import { Injectable } from '@nestjs/common';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: string;
  type: string;
}

@Injectable()
export class GetUserProfileUseCase {
  async execute(user: any): Promise<UserProfile> {
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