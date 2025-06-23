import { Request, Response } from 'express';

export interface IRefreshTokenType {
  req: Request;
  res: Response;
}