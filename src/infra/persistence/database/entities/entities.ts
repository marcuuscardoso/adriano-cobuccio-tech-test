import { BaseEntity } from '@commons/general/entities';
import { UserEntity, RefreshTokenEntity } from '@infra/persistence/database/entities';

export const entitiesProvider = [
  BaseEntity,
  UserEntity,
  RefreshTokenEntity,
];