import { EUserRole, EUserType } from '@infra/persistence/database/entities/user.entity';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    balance: number;
    role: EUserRole;
    type: EUserType;
  };
}