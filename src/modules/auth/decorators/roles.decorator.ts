import { SetMetadata } from '@nestjs/common';
import { EUserRole } from '@infra/persistence/database/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles); 