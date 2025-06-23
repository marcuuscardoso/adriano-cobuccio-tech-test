import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { EUserType, EUserRole } from '@infra/persistence/database/entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
    name: string;

  @IsEmail()
  @IsNotEmpty()
    email: string;

  @IsString()
  @IsNotEmpty()
    password: string;

  @IsString()
  @IsNotEmpty()
    phone: string;

  @IsString()
  @IsNotEmpty()
    cpf: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
    balance?: number = 0;

  @IsEnum(EUserType)
  @IsNotEmpty()
    type: EUserType;

  @IsEnum(EUserRole)
  @IsOptional()
    role?: EUserRole = EUserRole.USER;
}