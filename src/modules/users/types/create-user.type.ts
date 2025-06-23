import { EUserType, EUserRole } from '@infra/persistence/database/entities/user.entity';

export interface ICreateUserType {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;
  balance?: number;
  type: EUserType;
  role?: EUserRole;
  createdBy?: string;
}