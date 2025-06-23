import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '@infra/persistence/database/repositories';
import { TransactionEntity } from '@infra/persistence/database/entities/transaction.entity';

interface GetTransactionByIdRequest {
  id: string;
}

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(request: GetTransactionByIdRequest): Promise<TransactionEntity> {
    const { id } = request;

    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}