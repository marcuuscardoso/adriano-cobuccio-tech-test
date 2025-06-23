import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { RefreshTokenRepository } from '@infra/persistence/database/repositories/refresh-token.repository';

@Injectable()
export class SignOutUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(req: Request, res: Response): Promise<{ message: string }> {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.refreshTokenRepository.revokeToken(refreshToken);
    }

    this.clearTokenCookies(res);

    return { message: 'Logout successful' };
  }

  private clearTokenCookies(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}