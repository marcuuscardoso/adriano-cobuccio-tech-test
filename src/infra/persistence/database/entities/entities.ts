import { BaseEntity } from '@commons/general/entities';
import { UserEntity } from '@infra/persistence/database/entities';

export const entitiesProvider = [
  BaseEntity,
  UserEntity,
];