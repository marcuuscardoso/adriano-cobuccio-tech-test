import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionRepository } from '@infra/persistence/database/repositories';
import { TransactionEntity, ETransactionType, ETransactionStatus } from '@infra/persistence/database/entities/transaction.entity';
import { UserEntity, EUserType } from '@infra/persistence/database/entities/user.entity';
import { LoggerManager } from '@commons/general/loggers';

interface CreateTransferRequest {
  senderId: string;
  receiverId: string;
  amount: number;
  description?: string;
  createdBy?: string;
}

@Injectable()
export class CreateTransferUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly dataSource: DataSource,
    private readonly logger: LoggerManager
  ) {}

  async execute(request: CreateTransferRequest): Promise<TransactionEntity> {
    const { senderId, receiverId, amount, description, createdBy } = request;

    this.logger.info('Transfer initiated', { senderId, receiverId, amount });

    this.validateTransferData(senderId, receiverId, amount);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { sender, receiver } = await this.validateUsers(queryRunner, senderId, receiverId);

      this.validateUserPermissions(sender, receiver);
      this.validateBalance(sender.balance, amount);

      this.logger.info('Updating balances', { senderId, receiverId, amount });
      await this.updateBalances(queryRunner, senderId, receiverId, sender.balance, receiver.balance, amount);

      this.logger.info('Creating transaction record');
      const transaction = await this.createTransaction(queryRunner, {
        senderId,
        receiverId,
        amount,
        description,
        createdBy
      });

      await queryRunner.commitTransaction();
      this.logger.info('Transfer completed successfully', { transactionId: transaction.id });

      return await this.transactionRepository.findById(transaction.id) as TransactionEntity;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transfer failed', { senderId, receiverId, amount, error: error.message });
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private validateTransferData(senderId: string, receiverId: string, amount: number): void {
    if (!senderId || !receiverId) {
      throw new BadRequestException('Sender ID and Receiver ID are required');
    }

    if (senderId === receiverId) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }
  }

  private async validateUsers(queryRunner: any, senderId: string, receiverId: string) {
    const [sender, receiver] = await Promise.all([
      queryRunner.manager.findOne(UserEntity, { where: { id: senderId } }),
      queryRunner.manager.findOne(UserEntity, { where: { id: receiverId } })
    ]);

    if (!sender) throw new NotFoundException('Sender not found');
    if (!receiver) throw new NotFoundException('Receiver not found');

    return { sender, receiver };
  }

  private validateUserPermissions(sender: UserEntity, receiver: UserEntity): void {
    const canSend = [EUserType.SENDER, EUserType.BOTH].includes(sender.type);
    const canReceive = [EUserType.RECEIVER, EUserType.BOTH].includes(receiver.type);

    if (!canSend) throw new BadRequestException('Sender is not allowed to send money');
    if (!canReceive) throw new BadRequestException('Receiver is not allowed to receive money');
  }

  private validateBalance(senderBalance: number, amount: number): void {
    if (senderBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
  }

  private async updateBalances(
    queryRunner: any,
    senderId: string,
    receiverId: string,
    senderBalance: number,
    receiverBalance: number,
    amount: number
  ): Promise<void> {
    await Promise.all([
      queryRunner.manager.update(UserEntity, { id: senderId }, { balance: senderBalance - amount }),
      queryRunner.manager.update(UserEntity, { id: receiverId }, { balance: receiverBalance + amount })
    ]);
  }

  private async createTransaction(queryRunner: any, data: any): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.createWithQueryRunner({
      ...data,
      type: ETransactionType.TRANSFER,
      status: ETransactionStatus.COMPLETED
    }, queryRunner);

    return transaction;
  }
}