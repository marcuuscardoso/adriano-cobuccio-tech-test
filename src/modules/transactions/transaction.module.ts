import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/persistence/database/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { TransactionController } from './controllers';
import { 
  CreateTransferUseCase,
  ReverseTransactionUseCase,
  GetTransactionByIdUseCase,
  GetTransactionsByUserUseCase
} from './use-cases';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TransactionController],
  providers: [
    CreateTransferUseCase,
    ReverseTransactionUseCase,
    GetTransactionByIdUseCase,
    GetTransactionsByUserUseCase,
  ],
  exports: [
    CreateTransferUseCase,
    ReverseTransactionUseCase,
    GetTransactionByIdUseCase,
    GetTransactionsByUserUseCase,
  ],
})
export class TransactionModule {}