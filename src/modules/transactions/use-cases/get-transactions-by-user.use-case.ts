import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@infra/persistence/database/repositories';
import { TransactionEntity } from '@infra/persistence/database/entities/transaction.entity';
import { LoggerManager } from '@commons/general/loggers';

interface GetTransactionsByUserRequest {
  userId: string;
}

@Injectable()
export class GetTransactionsByUserUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly logger: LoggerManager
  ) {}

  async execute(request: GetTransactionsByUserRequest): Promise<TransactionEntity[]> {
    const { userId } = request;

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