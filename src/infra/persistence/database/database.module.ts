import { TypeOrmConfig } from '@infra/persistence/config/typeorm';
import { entitiesProvider } from './entities/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { repositoriesProvider } from './repositories/repositories';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    TypeOrmModule.forFeature(entitiesProvider),
  ],
  exports: [...repositoriesProvider],
  providers: [...repositoriesProvider],
})
export class DatabaseModule {}
