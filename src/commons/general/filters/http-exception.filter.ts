import { BaseHttpException } from '@commons/general/exceptions/base-http-exception.exception';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BaseHttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BaseHttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = exception.getStatus();
    const title = exception.getTitle();
    const code = exception.getCode();
    const description = exception.getDescription();

    response.status(statusCode).json({
      error: title,
      errorCode: code,
      message: description,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
