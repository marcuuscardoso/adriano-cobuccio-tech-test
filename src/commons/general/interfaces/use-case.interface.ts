import { Obj } from '@commons/general/interfaces';

export interface IUseCase<T extends Obj = any, TRes = any> {
  execute(params: T): Promise<TRes>;
}