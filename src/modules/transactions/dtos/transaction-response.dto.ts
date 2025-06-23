import { ETransactionStatus, ETransactionType } from '@infra/persistence/database/entities/transaction.entity';

export class TransactionResponseDto {
  id: string;
  amount: number;
  description?: string;
  type: ETransactionType;
  status: ETransactionStatus;
  senderId: string;
  receiverId: string;
  senderName?: string;
  receiverName?: string;
  originalTransactionId?: string;
  reversedTransactionId?: string;
  createdAt: Date;
  updatedAt?: Date;
}