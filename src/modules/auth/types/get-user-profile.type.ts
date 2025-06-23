export interface UserProfile {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: string;
  type: string;
}

export interface IGetUserProfileType {
  user: UserProfile;
}