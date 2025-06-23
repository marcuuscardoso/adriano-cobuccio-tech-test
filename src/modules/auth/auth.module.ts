import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/v1/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard, RolesGuard } from './guards';
import { UserRepository } from '@infra/persistence/database/repositories/user.repository';
import { RefreshTokenRepository } from '@infra/persistence/database/repositories/refresh-token.repository';
import { UserEntity, RefreshTokenEntity } from '@infra/persistence/database/entities';
import { SignInUseCase, SignOutUseCase, RefreshTokenUseCase, GetUserProfileUseCase } from './use-cases/v1';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'jwt-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    UserRepository,
    RefreshTokenRepository,
    SignInUseCase,
    SignOutUseCase,
    RefreshTokenUseCase,
    GetUserProfileUseCase,
  ],
  exports: [
    JwtAuthGuard,
    RolesGuard,
    JwtStrategy,
  ],
})
export class AuthModule {}