import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsCpfValid } from '@commons/validators/cpf.validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must have at least 2 characters' })
    name: string;

  @IsEmail({}, { message: 'Email must have a valid format' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase?.())
    email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Password must contain at least one letter and one number'
  })
    password: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^(\+55\s?)?\(?[1-9]{2}\)?\s?[9]?[0-9]{4}-?[0-9]{4}$/, {
    message: 'Phone must have a valid format (ex: (11) 99999-9999)'
  })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
    phone: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF is required' })
  @IsCpfValid()
  @Transform(({ value }) => value?.replace(/\D/g, ''))
    cpf: string;
}