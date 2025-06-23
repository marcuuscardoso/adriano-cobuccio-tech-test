import { Request, Response } from 'express';

export interface ISignOutType {
  req: Request;
  res: Response;
}