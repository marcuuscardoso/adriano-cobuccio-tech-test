import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUseCase } from '@commons/general/interfaces';
import { BusinessException } from '@commons/general/exceptions';
import { UserRepository } from '@infra/persistence/database/repositories';
import { UserEntity } from '@infra/persistence/database/entities/user.entity';
import { ICreateUserType } from '../types';

@Injectable()
export class CreateUserUseCase implements IUseCase<ICreateUserType, UserEntity> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: ICreateUserType): Promise<UserEntity> {
    const existingUserByEmail = await this.userRepository.findByEmail(params.email);
    if (existingUserByEmail) {
      throw new BusinessException('User already exists with this email', {
        detail: 'The provided email is already in use by another user',
        title: 'Email already exists',
        code: 'USER_EMAIL_ALREADY_EXISTS',
      });
    }

    const existingUserByCpf = await this.userRepository.findByCpf(params.cpf);
    if (existingUserByCpf) {
      throw new BusinessException('User already exists with this CPF', {
        detail: 'The provided CPF is already in use by another user',
        title: 'CPF already exists',
        code: 'USER_CPF_ALREADY_EXISTS',
      });
    }

    const hashedPassword = await bcrypt.hash(params.password, 10);

    const userData = {
      ...params,
      password: hashedPassword,
      balance: params.balance ?? 0,
    };

    return await this.userRepository.create(userData);
  }
} 