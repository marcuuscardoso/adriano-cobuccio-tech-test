import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/persistence/database/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserController } from './controllers';
import { 
  CreateUserUseCase,
  GetUserByIdUseCase,
  GetAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase
} from './use-cases';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}