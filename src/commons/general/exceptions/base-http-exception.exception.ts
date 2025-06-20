export interface BaseHttpExceptionOptions {
  statusCode?: number;
  description?: string | string[];
}

export class BaseHttpException extends Error {
  private readonly statusCode: number;
  private readonly description: string | string[];

  constructor(
    private readonly errorTitle: string,
    private readonly errorCode: number,
    options?: BaseHttpExceptionOptions
  ) {
    super();

    this.name = this.constructor.name;

    this.statusCode = options?.statusCode ?? 500;
    this.description = options?.description ?? 'Internal Server Error';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public getStatus(): number {
    return this.statusCode;
  }

  public getDescription(): string | string[] {
    return this.description;
  }

  public getCode(): number {
    return this.errorCode;
  }

  public getTitle(): string {
    return this.errorTitle;
  }
}
