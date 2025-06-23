import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsUUID()
    receiverId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
    amount: number;

  @IsOptional()
  @IsString()
    description?: string;
}