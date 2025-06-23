import { EUserRole, EUserType } from '@infra/persistence/database/entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: EUserRole;
  type: EUserType;
  iat?: number;
  exp?: number;
}