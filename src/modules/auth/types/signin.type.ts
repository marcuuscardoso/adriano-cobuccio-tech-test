import { Request, Response } from 'express';
import { SignInDto } from '../dto';

export interface ISignInType {
  signInDto: SignInDto;
  req: Request;
  res: Response;
}