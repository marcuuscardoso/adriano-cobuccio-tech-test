import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';

export class ReverseTransactionDto {
  @IsNotEmpty()
  @IsUUID()
    transactionId: string;

  @IsOptional()
  @IsString()
    reason?: string;
}