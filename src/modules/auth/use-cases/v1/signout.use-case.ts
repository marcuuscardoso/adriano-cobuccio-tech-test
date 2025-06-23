import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { IUseCase } from '@commons/general/interfaces';
import { RefreshTokenRepository } from '@infra/persistence/database/repositories/refresh-token.repository';
import { ISignOutType } from '../../types';

export interface SignOutResponse {
  message: string;
}

@Injectable()
export class SignOutUseCase implements IUseCase<ISignOutType, SignOutResponse> {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(params: ISignOutType): Promise<SignOutResponse> {
    const { req, res } = params;
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