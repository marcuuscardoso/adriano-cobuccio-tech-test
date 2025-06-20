import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModule as NestConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { LoggerManager } from '@commons/general/loggers/logger-manager.logger';
import { HttpServiceLoggerInterceptor } from '@commons/general/interceptors/http-logger.interceptor';
import { HttpModule } from '@nestjs/axios';
import { InfraModule } from '@infra/infra.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      envFilePath: ['.env']
    }),
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    InfraModule
  ],
  controllers: [HealthController],
  providers: [
    LoggerManager,
    HttpServiceLoggerInterceptor
  ]
})
export class AppModule {}
