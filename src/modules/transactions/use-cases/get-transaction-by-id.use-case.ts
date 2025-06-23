import { Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from '@commons/general/interfaces';
import { TransactionRepository } from '@infra/persistence/database/repositories';
import { TransactionEntity } from '@infra/persistence/database/entities/transaction.entity';
import { LoggerManager } from '@commons/general/loggers';
import { IGetTransactionByIdType } from '../types';

@Injectable()
export class GetTransactionByIdUseCase implements IUseCase<IGetTransactionByIdType, TransactionEntity> {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly logger: LoggerManager
  ) {}

  async execute(params: IGetTransactionByIdType): Promise<TransactionEntity> {
    const { id } = params;

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