import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import * as util from 'util';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerManager {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      transports: [
        new transports.Console({
          level: 'silly',
          format: format.combine(
            format((info) => info.level === 'verbose' ? false : info)(),

            format.label({ label: 'app' }),
            format.splat(),
            format.timestamp(),
            format.colorize(),

            format.printf(({ level, label, message, timestamp, ...meta }) => {
              const formattedMessage = message == null
                ? ''
                : (typeof message === 'object'
                  ? util.inspect(message, { depth: 2 })
                  : message
                );

              const metaOutput = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} ${label} [${level}]: ${formattedMessage}${metaOutput}`;
            })
          )
        }),

        new transports.DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '50m',
          maxFiles: '30d',
          level: 'debug'
        })
      ]
    });
  }

  error(message: string, meta: Record<string, unknown> = {}): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta: Record<string, unknown> = {}): void {
    this.logger.warn(message, meta);
  }

  info(message: string, meta: Record<string, unknown> = {}): void {
    this.logger.info(message, meta);
  }

  http(message: string, meta: Record<string, unknown> = {}): void {
    this.logger.http(message, meta);
  }

  debug(message: string, meta: Record<string, unknown> = {}): void {
    this.logger.debug(message, meta);
  }

  metrics(name: string, meta: Record<string, unknown> = {}): void {
    this.logger.verbose('', { ...meta, metric: name });
  }
}