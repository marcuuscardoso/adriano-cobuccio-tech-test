import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@infra/persistence/database/repositories';
import { TransactionEntity } from '@infra/persistence/database/entities/transaction.entity';

interface GetTransactionsByUserRequest {
  userId: string;
}

@Injectable()
export class GetTransactionsByUserUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(request: GetTransactionsByUserRequest): Promise<TransactionEntity[]> {
    const { userId } = request;

    return this.transactionRepository.findByUserId(userId);
  }
}