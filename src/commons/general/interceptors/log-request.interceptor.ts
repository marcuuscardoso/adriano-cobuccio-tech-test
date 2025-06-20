import { LoggerManager } from '@commons/general/loggers';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerManager) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap((data) => {
        this.logger.info('api-requests', {
          request: {
            urlPath: request.originalUrl.split('?')[0],
            method: request.method,
            headers: request.headers,
            params: request.params,
            query: request.query,
            body: request.body
          },
          response: {
            statusCode: response.statusCode,
            body: data
          }
        });

        return data;
      })
    );
  }
}
