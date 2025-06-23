import { UserRepository } from './user.repository';
import { RefreshTokenRepository } from './refresh-token.repository';
import { TransactionRepository } from './transaction.repository';

export const repositoriesProvider = [
  UserRepository,
  RefreshTokenRepository,
  TransactionRepository,
];