import { TypeOrmConfig } from '@infra/persistence/config/typeorm';
import { DatabaseModule } from '@infra/persistence/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  exports: [TypeOrmConfig, DatabaseModule],
  providers: [TypeOrmConfig, DatabaseModule]
})
export class InfraModule {}
