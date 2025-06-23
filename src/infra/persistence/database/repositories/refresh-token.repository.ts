import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>
  ) {}

  async create(tokenData: Partial<RefreshTokenEntity>): Promise<RefreshTokenEntity> {
    const token = this.refreshTokenRepository.create(tokenData);
    return this.refreshTokenRepository.save(token);
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    return this.refreshTokenRepository.findOne({
      where: { token, isRevoked: false },
      relations: ['user']
    });
  }

  async findByUserId(userId: string): Promise<RefreshTokenEntity[]> {
    return this.refreshTokenRepository.find({
      where: { userId, isRevoked: false }
    });
  }

  async revokeToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token },
      { isRevoked: true }
    );
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository.delete({
      expiresAt: { $lt: new Date() } as any
    });
  }
}