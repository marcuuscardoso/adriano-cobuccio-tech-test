import { Controller, Post, Get, Body, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { SignInDto } from '../../dto';
import { JwtAuthGuard } from '../../guards';
import { CurrentUser } from '../../decorators';
import { SignInUseCase, SignOutUseCase, RefreshTokenUseCase, GetUserProfileUseCase } from '../../use-cases/v1';
import { RegisterUserDto, UserResponseDto } from '@modules/users/dtos';
import { RegisterUserUseCase } from '@modules/users/use-cases';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly signOutUseCase: SignOutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    const user = await this.registerUserUseCase.execute(registerUserDto);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      cpf: user.cpf,
      balance: user.balance,
      type: user.type,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.signInUseCase.execute(signInDto, req, res);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.signOutUseCase.execute(req, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.refreshTokenUseCase.execute(req, res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any) {
    return this.getUserProfileUseCase.execute(user);
  }
}