import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { EUserType, EUserRole } from '@infra/persistence/database/entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number;

  @IsEnum(EUserType)
  @IsOptional()
  type?: EUserType;

  @IsEnum(EUserRole)
  @IsOptional()
  role?: EUserRole;
}