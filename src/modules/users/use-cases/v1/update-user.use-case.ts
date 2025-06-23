import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUseCase } from '@commons/general/interfaces';
import { BusinessException } from '@commons/general/exceptions';
import { UserRepository } from '@infra/persistence/database/repositories';
import { UserEntity } from '@infra/persistence/database/entities/user.entity';
import { IUpdateUserType } from '../../types';

@Injectable()
export class UpdateUserUseCase implements IUseCase<IUpdateUserType, UserEntity> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: IUpdateUserType): Promise<UserEntity> {
    const existingUser = await this.userRepository.findById(params.id);
    if (!existingUser) {
      throw new BusinessException('User not found', {
        detail: `User with ID ${params.id} was not found`,
        title: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    if (params.email && params.email !== existingUser.email) {
      const existingUserByEmail = await this.userRepository.findByEmail(params.email);
      if (existingUserByEmail) {
        throw new BusinessException('Email is already in use', {
          detail: 'The provided email is already in use by another user',
          title: 'Email already exists',
          code: 'USER_EMAIL_ALREADY_EXISTS'
        });
      }
    }

    if (params.cpf && params.cpf !== existingUser.cpf) {
      const existingUserByCpf = await this.userRepository.findByCpf(params.cpf);
      if (existingUserByCpf) {
        throw new BusinessException('CPF is already in use', {
          detail: 'The provided CPF is already in use by another user',
          title: 'CPF already exists',
          code: 'USER_CPF_ALREADY_EXISTS'
        });
      }
    }

    const { id, ...updateData } = params;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userRepository.update(id, updateData);

    if (!updatedUser) {
      throw new BusinessException('Error updating user', {
        detail: 'Unable to update the user',
        title: 'Update error',
        code: 'USER_UPDATE_ERROR'
      });
    }

    return updatedUser;
  }
}