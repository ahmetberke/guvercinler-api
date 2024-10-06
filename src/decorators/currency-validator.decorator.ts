import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CurrencyCode, CurrencyCodes } from 'src/customs/currency-types';

// CurrencyCode tipini doğrulamak için bir Constraint oluşturuyoruz
@ValidatorConstraint({ async: false })
export class IsCurrencyCodeConstraint implements ValidatorConstraintInterface {
  
  validate(value: any): boolean {
    return CurrencyCodes.includes(value);
  }

  defaultMessage(): string {
    return 'Geçersiz Para Birimi, Geçerli birimler: ' + CurrencyCodes.join(", ") ;
  }
}

// Custom validator decorator
export function IsCurrencyCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCurrencyCodeConstraint,
    });
  };
}
