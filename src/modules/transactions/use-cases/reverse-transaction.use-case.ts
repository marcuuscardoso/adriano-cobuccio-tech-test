import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionRepository } from '@infra/persistence/database/repositories';
import { TransactionEntity, ETransactionType, ETransactionStatus } from '@infra/persistence/database/entities/transaction.entity';
import { UserEntity } from '@infra/persistence/database/entities/user.entity';
import { LoggerManager } from '@commons/general/loggers';

interface ReverseTransactionRequest {
  transactionId: string;
  reason?: string;
  reversedBy?: string;
}

@Injectable()
export class ReverseTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly dataSource: DataSource,
    private readonly logger: LoggerManager
  ) {}

  async execute(request: ReverseTransactionRequest): Promise<TransactionEntity> {
    const { transactionId, reason, reversedBy } = request;

    if (!transactionId) {
      throw new BadRequestException('Transaction ID is required');
    }

    this.logger.info('Transaction reversal initiated', { transactionId });

    const originalTransaction = await this.validateOriginalTransaction(transactionId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { sender, receiver } = await this.validateUsers(queryRunner, originalTransaction);

      this.validateReceiverBalance(receiver.balance, originalTransaction.amount);

      this.logger.info('Reverting balances', {
        originalSender: originalTransaction.senderId,
        originalReceiver: originalTransaction.receiverId,
        amount: originalTransaction.amount
      });
      await this.revertBalances(queryRunner, originalTransaction, sender.balance, receiver.balance);

      this.logger.info('Creating reversal transaction record');
      const reversalTransaction = await this.createReversalTransaction(queryRunner, {
        originalTransaction,
        reason,
        reversedBy
      });

      await this.linkTransactions(queryRunner, originalTransaction.id, reversalTransaction.id);

      await queryRunner.commitTransaction();
      this.logger.info('Transaction reversal completed successfully', { reversalTransactionId: reversalTransaction.id });

      return await this.transactionRepository.findById(reversalTransaction.id) as TransactionEntity;

    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction reversal failed', { transactionId, error: error.message });
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async validateOriginalTransaction(transactionId: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.type !== ETransactionType.TRANSFER) {
      throw new BadRequestException('Only transfer transactions can be reversed');
    }

    if (transaction.status !== ETransactionStatus.COMPLETED) {
      throw new BadRequestException('Only completed transactions can be reversed');
    }

    if (transaction.reversedTransactionId) {
      throw new BadRequestException('Transaction has already been reversed');
    }

    return transaction;
  }

  private async validateUsers(queryRunner: any, originalTransaction: TransactionEntity) {
    const [sender, receiver] = await Promise.all([
      queryRunner.manager.findOne(UserEntity, { where: { id: originalTransaction.senderId } }),
      queryRunner.manager.findOne(UserEntity, { where: { id: originalTransaction.receiverId } })
    ]);

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    return { sender, receiver };
  }

  private validateReceiverBalance(receiverBalance: number, amount: number): void {
    if (receiverBalance < amount) {
      throw new BadRequestException('Receiver has insufficient balance for reversal');
    }
  }

  private async revertBalances(
    queryRunner: any,
    originalTransaction: TransactionEntity,
    senderBalance: number,
    receiverBalance: number
  ): Promise<void> {
    await Promise.all([
      queryRunner.manager.update(UserEntity, { id: originalTransaction.senderId }, {
        balance: senderBalance + originalTransaction.amount
      }),
      queryRunner.manager.update(UserEntity, { id: originalTransaction.receiverId }, {
        balance: receiverBalance - originalTransaction.amount
      })
    ]);
  }

  private async createReversalTransaction(queryRunner: any, data: any): Promise<TransactionEntity> {
    const { originalTransaction, reason, reversedBy } = data;

    return await this.transactionRepository.createWithQueryRunner({
      senderId: originalTransaction.receiverId,
      receiverId: originalTransaction.senderId,
      amount: originalTransaction.amount,
      description: reason || `Reversal of transaction ${originalTransaction.id}`,
      type: ETransactionType.REVERSAL,
      status: ETransactionStatus.COMPLETED,
      originalTransactionId: originalTransaction.id,
      createdBy: reversedBy
    }, queryRunner);
  }

  private async linkTransactions(queryRunner: any, originalTransactionId: string, reversalTransactionId: string): Promise<void> {
    await queryRunner.manager.update(TransactionEntity, { id: originalTransactionId }, {
      reversedTransactionId: reversalTransactionId,
      status: ETransactionStatus.REVERSED
    });
  }
}