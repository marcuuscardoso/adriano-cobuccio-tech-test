import { Injectable } from '@nestjs/common';
import { IUseCase } from '@commons/general/interfaces';
import { UserRepository } from '@infra/persistence/database/repositories';
import { UserEntity } from '@infra/persistence/database/entities/user.entity';

export interface IGetAllUsersType {
  // Pode ser expandido para incluir filtros, paginação, etc.
}

@Injectable()
export class GetAllUsersUseCase implements IUseCase<IGetAllUsersType, UserEntity[]> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params?: IGetAllUsersType): Promise<UserEntity[]> {
    return await this.userRepository.findAll();
  }
} 