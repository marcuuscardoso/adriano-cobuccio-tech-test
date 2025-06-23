import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isCpfValid', async: false })
export class IsCpfValidConstraint implements ValidatorConstraintInterface {
  validate(cpf: string, args: ValidationArguments) {
    if (!cpf) return false;

    const cleanCpf = cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;

    if (parseInt(cleanCpf.charAt(9)) !== firstDigit) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;

    return parseInt(cleanCpf.charAt(10)) === secondDigit;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid CPF';
  }
}

export function IsCpfValid() {
  return function (object: object, propertyName: string) {
    const validateDecorator = require('class-validator').registerDecorator;
    validateDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsCpfValidConstraint
    });
  };
}