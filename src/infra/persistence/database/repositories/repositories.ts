import { UserRepository } from './user.repository';
import { RefreshTokenRepository } from './refresh-token.repository';

export const repositoriesProvider = [
  UserRepository,
  RefreshTokenRepository,
];
