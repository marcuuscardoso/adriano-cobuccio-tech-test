import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { CreateTransferDto, ReverseTransactionDto, TransactionResponseDto } from '../../dtos';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles, CurrentUser } from '@modules/auth/decorators';
import { EUserRole } from '@infra/persistence/database/entities/user.entity';
import {
  CreateTransferUseCase,
  ReverseTransactionUseCase,
  GetTransactionByIdUseCase,
  GetTransactionsByUserUseCase
} from '../../use-cases';
import { TransactionEntity } from '@infra/persistence/database/entities/transaction.entity';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionController {
  constructor(
    private readonly createTransferUseCase: CreateTransferUseCase,
    private readonly reverseTransactionUseCase: ReverseTransactionUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly getTransactionsByUserUseCase: GetTransactionsByUserUseCase
  ) {}

  @Post('transfer')
  @HttpCode(HttpStatus.CREATED)
  @Roles(EUserRole.USER, EUserRole.ADMIN)
  async createTransfer(
    @Body() createTransferDto: CreateTransferDto,
    @CurrentUser() currentUser: any
  ): Promise<TransactionResponseDto> {
    const transaction = await this.createTransferUseCase.execute({
      senderId: currentUser.id,
      receiverId: createTransferDto.receiverId,
      amount: createTransferDto.amount,
      description: createTransferDto.description,
      createdBy: currentUser.id
    });

    return this.toResponseDto(transaction);
  }

  @Post('reverse')
  @HttpCode(HttpStatus.CREATED)
  @Roles(EUserRole.ADMIN)
  async reverseTransaction(
    @Body() reverseTransactionDto: ReverseTransactionDto,
    @CurrentUser() currentUser: any
  ): Promise<TransactionResponseDto> {
    const transaction = await this.reverseTransactionUseCase.execute({
      transactionId: reverseTransactionDto.transactionId,
      reason: reverseTransactionDto.reason,
      reversedBy: currentUser.id
    });

    return this.toResponseDto(transaction);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.USER, EUserRole.ADMIN)
  async findById(
    @Param('id') id: string,
    @CurrentUser() currentUser: any
  ): Promise<TransactionResponseDto> {
    const transaction = await this.getTransactionByIdUseCase.execute({ id });

    if (currentUser.role !== EUserRole.ADMIN &&
        transaction.senderId !== currentUser.id &&
        transaction.receiverId !== currentUser.id) {
      throw new Error('You can only view your own transactions');
    }

    return this.toResponseDto(transaction);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN)
  async findByUserId(@Param('userId') userId: string): Promise<TransactionResponseDto[]> {
    const transactions = await this.getTransactionsByUserUseCase.execute({ userId });
    return transactions.map(transaction => this.toResponseDto(transaction));
  }

  @Get('my/transactions')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.USER, EUserRole.ADMIN)
  async findMyTransactions(@CurrentUser() currentUser: any): Promise<TransactionResponseDto[]> {
    const transactions = await this.getTransactionsByUserUseCase.execute({
      userId: currentUser.id
    });
    return transactions.map(transaction => this.toResponseDto(transaction));
  }

  private toResponseDto(transaction: TransactionEntity): TransactionResponseDto {
    return {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      type: transaction.type,
      status: transaction.status,
      senderId: transaction.senderId,
      receiverId: transaction.receiverId,
      senderName: transaction.sender?.name,
      receiverName: transaction.receiver?.name,
      originalTransactionId: transaction.originalTransactionId,
      reversedTransactionId: transaction.reversedTransactionId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    };
  }
}