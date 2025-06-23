import { EUserType, EUserRole } from '@infra/persistence/database/entities/user.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  balance: number;
  type: EUserType;
  role: EUserRole;
  createdAt: Date;
  updatedAt?: Date;
}