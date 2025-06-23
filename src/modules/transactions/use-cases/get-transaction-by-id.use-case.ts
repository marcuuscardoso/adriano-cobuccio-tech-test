import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '@infra/persistence/database/repositories';
import { TransactionEntity } from '@infra/persistence/database/entities/transaction.entity';
import { LoggerManager } from '@commons/general/loggers';

interface GetTransactionByIdRequest {
  id: string;
}

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly logger: LoggerManager,
  ) {}

  async execute(request: GetTransactionByIdRequest): Promise<TransactionEntity> {
    const { id } = request;

    try {
      const transaction = await this.transactionRepository.findById(id);

      if (!transaction) {
        this.logger.info('Transaction not found', { transactionId: id });
        throw new NotFoundException('Transaction not found');
      }

      return transaction;
    } catch (error: any) {
      this.logger.error('Failed to fetch transaction', { transactionId: id, error: error.message });
      throw error;
    }
  }
}