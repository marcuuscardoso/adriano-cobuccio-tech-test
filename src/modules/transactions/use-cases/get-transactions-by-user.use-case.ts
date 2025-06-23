import { Injectable } from '@nestjs/common';
import { IUseCase } from '@commons/general/interfaces';
import { TransactionRepository } from '@infra/persistence/database/repositories';
import { TransactionEntity } from '@infra/persistence/database/entities/transaction.entity';
import { LoggerManager } from '@commons/general/loggers';
import { IGetTransactionsByUserType } from '../types';

@Injectable()
export class GetTransactionsByUserUseCase implements IUseCase<IGetTransactionsByUserType, TransactionEntity[]> {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly logger: LoggerManager
  ) {}

  async execute(params: IGetTransactionsByUserType): Promise<TransactionEntity[]> {
    const { userId } = params;

    try {
      const transactions = await this.transactionRepository.findByUserId(userId);

      this.logger.info('Transactions fetched', { userId, count: transactions.length });
      return transactions;
    } catch (error: any) {
      this.logger.error('Failed to fetch user transactions', { userId, error: error.message });
      throw error;
    }
  }
}