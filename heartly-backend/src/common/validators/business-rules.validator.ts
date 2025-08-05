import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// ===== Phone Number Validation =====
@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phone: string, args: ValidationArguments) {
    if (!phone) return true; // Allow null/undefined
    // International format: +1234567890 or domestic: 1234567890
    // Must start with 1-9, can have 1-14 additional digits
    return /^\+?[1-9]\d{9,14}$/.test(phone);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number must be in international format (+1234567890) or domestic format (1234567890)';
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}

// ===== UCI Format Validation =====
@ValidatorConstraint({ name: 'isUciFormat', async: false })
export class IsUciFormatConstraint implements ValidatorConstraintInterface {
  validate(uci: string, args: ValidationArguments) {
    if (!uci) return false; // UCI is required
    // 6-20 characters, uppercase letters and numbers only
    return /^[A-Z0-9]{6,20}$/.test(uci);
  }

  defaultMessage(args: ValidationArguments) {
    return 'UCI must be 6-20 characters, uppercase letters and numbers only';
  }
}

export function IsUciFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUciFormatConstraint,
    });
  };
}

// ===== Name Format Validation =====
@ValidatorConstraint({ name: 'isPersonName', async: false })
export class IsPersonNameConstraint implements ValidatorConstraintInterface {
  validate(name: string, args: ValidationArguments) {
    if (!name) return false; // Names are required
    // Allow letters (including accented), spaces, hyphens, and apostrophes only
    // Using a broader character set that includes common accented characters
    return /^[A-Za-zÀ-ÿ\s\'-]{1,50}$/.test(name) && name.trim().length >= 1;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Name must contain only letters, spaces, hyphens, and apostrophes (1-50 characters)';
  }
}

export function IsPersonName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPersonNameConstraint,
    });
  };
}

// ===== ZIP Code Validation =====
@ValidatorConstraint({ name: 'isZipCode', async: false })
export class IsZipCodeConstraint implements ValidatorConstraintInterface {
  validate(zip: string, args: ValidationArguments) {
    if (!zip) return false; // ZIP is required
    // US ZIP format: 12345 or 12345-6789
    return /^[0-9]{5}(-[0-9]{4})?$/.test(zip);
  }

  defaultMessage(args: ValidationArguments) {
    return 'ZIP code must be in format 12345 or 12345-6789';
  }
}

export function IsZipCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsZipCodeConstraint,
    });
  };
}

// ===== State Code Validation =====
@ValidatorConstraint({ name: 'isStateCode', async: false })
export class IsStateCodeConstraint implements ValidatorConstraintInterface {
  validate(state: string, args: ValidationArguments) {
    if (!state) return false; // State is required
    // 2-character uppercase state code
    return /^[A-Z]{2}$/.test(state);
  }

  defaultMessage(args: ValidationArguments) {
    return 'State must be a 2-character uppercase code (e.g., CA, NY)';
  }
}

export function IsStateCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStateCodeConstraint,
    });
  };
}

// ===== Facility Name Validation =====
@ValidatorConstraint({ name: 'isFacilityName', async: false })
export class IsFacilityNameConstraint implements ValidatorConstraintInterface {
  validate(name: string, args: ValidationArguments) {
    if (!name) return false; // Name is required
    // 3-100 characters, reasonable facility name
    return name.trim().length >= 3 && name.trim().length <= 100;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Facility name must be between 3 and 100 characters';
  }
}

export function IsFacilityName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFacilityNameConstraint,
    });
  };
}

// ===== City Name Validation =====
@ValidatorConstraint({ name: 'isCityName', async: false })
export class IsCityNameConstraint implements ValidatorConstraintInterface {
  validate(city: string, args: ValidationArguments) {
    if (!city) return false; // City is required
    // Allow letters (including accented), spaces, hyphens, and apostrophes
    return /^[A-Za-zÀ-ÿ\s\'-]{2,100}$/.test(city);
  }

  defaultMessage(args: ValidationArguments) {
    return 'City name must contain only letters, spaces, hyphens, and apostrophes (2-100 characters)';
  }
}

export function IsCityName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCityNameConstraint,
    });
  };
}

// ===== Address Validation =====
@ValidatorConstraint({ name: 'isAddress', async: false })
export class IsAddressConstraint implements ValidatorConstraintInterface {
  validate(address: string, args: ValidationArguments) {
    if (!address) return false; // Address is required
    // 5-200 characters for street address
    return address.trim().length >= 5 && address.trim().length <= 200;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Address must be between 5 and 200 characters';
  }
}

export function IsAddress(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAddressConstraint,
    });
  };
}

// ===== Birth Date Validation =====
@ValidatorConstraint({ name: 'isBirthDate', async: false })
export class IsBirthDateConstraint implements ValidatorConstraintInterface {
  validate(birthDate: Date, args: ValidationArguments) {
    if (!birthDate) return false; // Birth date is required

    const date = new Date(birthDate);
    const today = new Date();
    const minDate = new Date('1900-01-01');

    // Must be a valid date, not in future, and not before 1900
    return (
      date instanceof Date &&
      !isNaN(date.getTime()) &&
      date <= today &&
      date >= minDate
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Birth date must be a valid date between 1900-01-01 and today';
  }
}

export function IsBirthDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBirthDateConstraint,
    });
  };
}

// ===== Financial Amount Validation =====
@ValidatorConstraint({ name: 'isFinancialAmount', async: false })
export class IsFinancialAmountConstraint
  implements ValidatorConstraintInterface
{
  validate(amount: number, args: ValidationArguments) {
    if (amount === null || amount === undefined) return true; // Allow null

    // Must be within precision range: -999999.99 to 999999.99
    return (
      amount >= -999999.99 && amount <= 999999.99 && Number.isFinite(amount)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Amount must be between -999999.99 and 999999.99';
  }
}

export function IsFinancialAmount(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFinancialAmountConstraint,
    });
  };
}
