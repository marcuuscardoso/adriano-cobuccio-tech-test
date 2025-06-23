import { Logger as ITypeOrmLogger } from 'typeorm';
import { LoggerManager } from './logger-manager.logger';

export class TypeOrmLogger implements ITypeOrmLogger {
  constructor(private readonly logger: LoggerManager) {}

  logQuery(query: string, parameters?: any[]): void {
    this.logger.debug('TypeORM Query', {
      query,
      parameters: parameters || []
    });
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]): void {
    this.logger.error('TypeORM Query Error', {
      error: error instanceof Error ? error.message : error,
      query,
      parameters: parameters || []
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]): void {
    this.logger.warn('TypeORM Slow Query', {
      executionTime: `${time}ms`,
      query,
      parameters: parameters || []
    });
  }

  logSchemaBuild(message: string): void {
    this.logger.info('TypeORM Schema Build', {
      message
    });
  }

  logMigration(message: string): void {
    this.logger.info('TypeORM Migration', {
      message
    });
  }

  log(level: 'log' | 'info' | 'warn', message: any): void {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.info('TypeORM', { message });
        break;
      case 'warn':
        this.logger.warn('TypeORM', { message });
        break;
    }
  }
}