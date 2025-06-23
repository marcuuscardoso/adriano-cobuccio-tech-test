import { Injectable } from '@nestjs/common';
import { IUseCase } from '@commons/general/interfaces';
import { BusinessException } from '@commons/general/exceptions';
import { UserRepository } from '@infra/persistence/database/repositories';

export interface IDeleteUserType {
  id: string;
  deletedBy?: string;
}

@Injectable()
export class DeleteUserUseCase implements IUseCase<IDeleteUserType, void> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: IDeleteUserType): Promise<void> {
    const existingUser = await this.userRepository.findById(params.id);
    if (!existingUser) {
      throw new BusinessException('User not found', {
        detail: `User with ID ${params.id} was not found`,
        title: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    await this.userRepository.delete(params.id);
  }
}