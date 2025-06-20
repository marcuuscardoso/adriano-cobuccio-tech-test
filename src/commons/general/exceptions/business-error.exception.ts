import { HttpException } from '@nestjs/common';

export class BusinessException extends HttpException {
  code?: string | number;
  detail?: string;
  title?: string;

  constructor(
    mensagem: string,
    data: {
      detail?: string;
      title?: string;
      code?: string | number;
    }
  ) {
    super(mensagem, 400);

    this.title = data.title;
    this.detail = data.detail;
    this.code = data.code ?? 500;
  }
}
