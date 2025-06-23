import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByCpf(cpf: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { cpf },
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<UserEntity>): Promise<UserEntity | null> {
    await this.userRepository.update(id, userData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}