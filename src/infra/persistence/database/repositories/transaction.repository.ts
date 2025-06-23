import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { TransactionEntity, ETransactionStatus, ETransactionType } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async findById(id: string): Promise<TransactionEntity | null> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'originalTransaction', 'reversedTransaction'],
    });
  }

  async findByUserId(userId: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: [
        { senderId: userId },
        { receiverId: userId }
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySenderId(senderId: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: { senderId },
      relations: ['receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByReceiverId(receiverId: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: { receiverId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: ETransactionStatus): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: { status },
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(transactionData: Partial<TransactionEntity>): Promise<TransactionEntity> {
    const transaction = this.transactionRepository.create(transactionData);
    return this.transactionRepository.save(transaction);
  }

  async createWithQueryRunner(
    transactionData: Partial<TransactionEntity>,
    queryRunner: QueryRunner
  ): Promise<TransactionEntity> {
    const transaction = queryRunner.manager.create(TransactionEntity, transactionData);
    return queryRunner.manager.save(TransactionEntity, transaction);
  }

  async updateStatus(id: string, status: ETransactionStatus): Promise<TransactionEntity | null> {
    await this.transactionRepository.update(id, { status });
    return this.findById(id);
  }

  async updateStatusWithQueryRunner(
    id: string, 
    status: ETransactionStatus,
    queryRunner: QueryRunner
  ): Promise<void> {
    await queryRunner.manager.update(TransactionEntity, id, { status });
  }

  async linkReversalTransaction(
    originalTransactionId: string, 
    reversalTransactionId: string
  ): Promise<void> {
    await this.transactionRepository.update(originalTransactionId, {
      reversedTransactionId: reversalTransactionId,
      status: ETransactionStatus.REVERSED
    });
  }

  async findPendingTransactions(): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: { 
        status: ETransactionStatus.PENDING,
        type: ETransactionType.TRANSFER
      },
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }
}