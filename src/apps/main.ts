import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './default/app.module';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerManager } from '../commons/general/loggers/logger-manager.logger';
import { HttpExceptionFilter } from '@commons/general/filters/http-exception.filter';
import { LogRequestInterceptor } from '@commons/general/interceptors/log-request.interceptor';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, {
    bodyParser: true,
    bufferLogs: true,
    logger: ['log', 'error', 'warn', 'debug', 'verbose']
  });

  const config = app.get(ConfigService);
  const logger = app.get(LoggerManager);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new LogRequestInterceptor(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.use(helmet());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*'
  });

  const port = config.get<number>('API_PORT') ?? 3025;
  const host = config.get<string>('SERVICE_HOST') ?? '0.0.0.0';

  await app.listen(port, host);

  logger.info('Server started successfully', {
    port: port,
    host: host
  });
}

bootstrap();
