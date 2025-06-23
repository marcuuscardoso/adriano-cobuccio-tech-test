import { BaseEntity } from '@commons/general/entities';
import { UserEntity, RefreshTokenEntity, TransactionEntity } from '@infra/persistence/database/entities';

export const entitiesProvider = [
  BaseEntity,
  UserEntity,
  RefreshTokenEntity,
  TransactionEntity,
];