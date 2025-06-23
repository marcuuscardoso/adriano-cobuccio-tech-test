import { BaseEntity } from '@commons/general/entities';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

export enum ETransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVERSED = 'reversed',
}

export enum ETransactionType {
  TRANSFER = 'transfer',
  REVERSAL = 'reversal',
}

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @Column({ type: 'float', name: 'amount' })
  amount: number;

  @Column({ type: 'varchar', name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ETransactionType, name: 'type' })
  type: ETransactionType;

  @Column({ type: 'enum', enum: ETransactionStatus, name: 'status', default: ETransactionStatus.PENDING })
  status: ETransactionStatus;

  @Column({ type: 'uuid', name: 'sender_id' })
  senderId: string;

  @Column({ type: 'uuid', name: 'receiver_id' })
  receiverId: string;

  @Column({ type: 'uuid', name: 'original_transaction_id', nullable: true })
  originalTransactionId?: string;

  @Column({ type: 'uuid', name: 'reversed_transaction_id', nullable: true })
  reversedTransactionId?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @ManyToOne(() => TransactionEntity)
  @JoinColumn({ name: 'original_transaction_id' })
  originalTransaction?: TransactionEntity;

  @ManyToOne(() => TransactionEntity)
  @JoinColumn({ name: 'reversed_transaction_id' })
  reversedTransaction?: TransactionEntity;
}