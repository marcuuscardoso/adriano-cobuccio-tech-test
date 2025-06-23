import { Injectable } from '@nestjs/common';
import { IUseCase } from '@commons/general/interfaces';
import { IGetUserProfileType, UserProfile } from '../../types';

@Injectable()
export class GetUserProfileUseCase implements IUseCase<IGetUserProfileType, UserProfile> {
  async execute(params: IGetUserProfileType): Promise<UserProfile> {
    const { user } = params;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      role: user.role,
      type: user.type
    };
  }
}