import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dtos';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles, CurrentUser } from '@modules/auth/decorators';
import { EUserRole } from '@infra/persistence/database/entities/user.entity';
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  GetAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase
} from '../use-cases';
import { UserEntity } from '@infra/persistence/database/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(EUserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser() currentUser: any): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute({
      ...createUserDto,
      createdBy: currentUser.sub,
    });

    return this.toResponseDto(user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN)
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.getAllUsersUseCase.execute();
    return users.map(user => this.toResponseDto(user));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN)
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute({ id });
    return this.toResponseDto(user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ): Promise<UserResponseDto> {
    const user = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
      updatedBy: currentUser.sub,
    });

    return this.toResponseDto(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(EUserRole.ADMIN)
  async delete(@Param('id') id: string, @CurrentUser() currentUser: any): Promise<void> {
    await this.deleteUserUseCase.execute({ id, deletedBy: currentUser.sub });
  }

  private toResponseDto(user: UserEntity): UserResponseDto {
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
      updatedAt: user.updatedAt,
    };
  }
}