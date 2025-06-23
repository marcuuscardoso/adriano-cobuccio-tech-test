import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { RefreshTokenRepository } from '@infra/persistence/database/repositories/refresh-token.repository';
import { AuthResponse, JwtPayload } from '../../interfaces';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(req: Request, res: Response): Promise<AuthResponse> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokenRecord = await this.refreshTokenRepository.findByToken(refreshToken);
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = tokenRecord.user;

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: user.type
    };

    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m'
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        role: user.role,
        type: user.type
      }
    };
  }
}