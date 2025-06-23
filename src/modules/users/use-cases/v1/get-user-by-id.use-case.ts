import { Injectable } from '@nestjs/common';
import { IUseCase } from '@commons/general/interfaces';
import { BusinessException } from '@commons/general/exceptions';
import { UserRepository } from '@infra/persistence/database/repositories';
import { UserEntity } from '@infra/persistence/database/entities/user.entity';

export interface IGetUserByIdType {
  id: string;
}

@Injectable()
export class GetUserByIdUseCase implements IUseCase<IGetUserByIdType, UserEntity> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: IGetUserByIdType): Promise<UserEntity> {
    const user = await this.userRepository.findById(params.id);

    if (!user) {
      throw new BusinessException('User not found', {
        detail: `User with ID ${params.id} was not found`,
        title: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    return user;
  }
}