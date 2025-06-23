import { entitiesProvider } from '@infra/persistence/database/entities/entities';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { LoggerManager, TypeOrmLogger } from '@commons/general/loggers';
import path from 'node:path';

export class TypeOrmConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const loggerManager = new LoggerManager();

    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: entitiesProvider,
      migrations: [path.resolve(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
      migrationsRun: true,
      autoLoadEntities: true,
      logging: true,
      logger: new TypeOrmLogger(loggerManager),
      connectTimeoutMS: 3000,
      retryDelay: 700,
      ...(process.env.NODE_ENV !== 'development' && {
        ssl: {
          rejectUnauthorized: false
        }
      })
    };
  }
}
