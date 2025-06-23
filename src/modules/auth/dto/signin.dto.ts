import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Email must have a valid format' })
  @IsNotEmpty({ message: 'Email is required' })
    email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must have at least 6 characters' })
    password: string;
}