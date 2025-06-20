import { BaseHttpException, BaseHttpExceptionOptions } from '@commons/general/exceptions';
import { HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends BaseHttpException {
  constructor(options: BaseHttpExceptionOptions) {
    const errorTitle = 'Internal Server Error';
    const errorCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionOptions = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal Server Error',
      ...options
    };

    super(errorTitle, errorCode, exceptionOptions);
  }
}
