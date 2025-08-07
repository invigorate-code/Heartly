import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  IsAddress,
  IsBirthDate,
  IsCityName,
  IsFacilityName,
  IsFinancialAmount,
  IsPersonName,
  IsPhoneNumber,
  IsStateCode,
  IsUciFormat,
  IsZipCode,
} from './business-rules.validator';

// Test classes for validation
class PhoneTestDto {
  @IsPhoneNumber()
  phone: string;
}

class UciTestDto {
  @IsUciFormat()
  uci: string;
}

class NameTestDto {
  @IsPersonName()
  name: string;
}

class ZipTestDto {
  @IsZipCode()
  zip: string;
}

class StateTestDto {
  @IsStateCode()
  state: string;
}

class FacilityNameTestDto {
  @IsFacilityName()
  name: string;
}

class CityTestDto {
  @IsCityName()
  city: string;
}

class AddressTestDto {
  @IsAddress()
  address: string;
}

class BirthDateTestDto {
  @IsBirthDate()
  birthDate: Date;
}

class FinancialAmountTestDto {
  @IsFinancialAmount()
  amount: number;
}

describe('Business Rules Validators', () => {
  describe('IsPhoneNumber', () => {
    it('should accept valid international phone numbers', async () => {
      const validPhones = ['+1234567890', '+12345678901234', '1234567890'];

      for (const phone of validPhones) {
        const dto = plainToClass(PhoneTestDto, { phone });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should accept null/undefined phone numbers', async () => {
      const dto1 = plainToClass(PhoneTestDto, { phone: null });
      const dto2 = plainToClass(PhoneTestDto, { phone: undefined });
      const dto3 = plainToClass(PhoneTestDto, {});

      const errors1 = await validate(dto1);
      const errors2 = await validate(dto2);
      const errors3 = await validate(dto3);

      expect(errors1).toHaveLength(0);
      expect(errors2).toHaveLength(0);
      expect(errors3).toHaveLength(0);
    });

    it('should reject invalid phone numbers', async () => {
      const invalidPhones = [
        'invalid-phone',
        '0123456789', // starts with 0
        '+0123456789', // starts with 0 after +
        '123456789', // too short (needs at least 10 digits total)
        '+12345678901234567', // too long (over 15 digits total)
        'abc1234567890', // contains letters
      ];

      for (const phone of invalidPhones) {
        const dto = plainToClass(PhoneTestDto, { phone });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isPhoneNumber');
      }
    });
  });

  describe('IsUciFormat', () => {
    it('should accept valid UCI formats', async () => {
      const validUcis = ['CLIENT123456', 'ABC123DEF789GHI', 'PATIENT001'];

      for (const uci of validUcis) {
        const dto = plainToClass(UciTestDto, { uci });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid UCI formats', async () => {
      const invalidUcis = [
        '', // empty
        'ABC12', // too short
        'ABC123DEF789GHI123456', // too long (over 20 chars)
        'client123456', // lowercase
        'CLIENT-123456', // contains hyphen
        'CLIENT 123456', // contains space
        'CLIENT@123456', // contains special character
      ];

      for (const uci of invalidUcis) {
        const dto = plainToClass(UciTestDto, { uci });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isUciFormat');
      }
    });
  });

  describe('IsPersonName', () => {
    it('should accept valid person names', async () => {
      const validNames = [
        'John',
        'Mary-Jane',
        "O'Connor",
        'Van Der Berg',
        'José María',
        "Anne-Marie O'Sullivan-Smith",
      ];

      for (const name of validNames) {
        const dto = plainToClass(NameTestDto, { name });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid person names', async () => {
      const invalidNames = [
        '', // empty
        'John123', // contains numbers
        'John@Doe', // contains special characters
        'a'.repeat(51), // too long (over 50 chars)
        '   ', // only spaces
      ];

      for (const name of invalidNames) {
        const dto = plainToClass(NameTestDto, { name });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isPersonName');
      }
    });
  });

  describe('IsZipCode', () => {
    it('should accept valid ZIP codes', async () => {
      const validZips = ['12345', '12345-6789'];

      for (const zip of validZips) {
        const dto = plainToClass(ZipTestDto, { zip });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid ZIP codes', async () => {
      const invalidZips = [
        '', // empty
        '1234', // too short
        '123456', // too long without dash
        '12345-67890', // too long with dash
        'ABCDE', // contains letters
        '12345-ABCD', // contains letters in extension
        '12345 6789', // space instead of dash
      ];

      for (const zip of invalidZips) {
        const dto = plainToClass(ZipTestDto, { zip });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isZipCode');
      }
    });
  });

  describe('IsStateCode', () => {
    it('should accept valid state codes', async () => {
      const validStates = ['CA', 'NY', 'TX', 'FL'];

      for (const state of validStates) {
        const dto = plainToClass(StateTestDto, { state });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid state codes', async () => {
      const invalidStates = [
        '', // empty
        'C', // too short
        'CAL', // too long
        'ca', // lowercase
        'C1', // contains number
        'C@', // contains special character
      ];

      for (const state of invalidStates) {
        const dto = plainToClass(StateTestDto, { state });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isStateCode');
      }
    });
  });

  describe('IsFacilityName', () => {
    it('should accept valid facility names', async () => {
      const validNames = [
        'ABC', // minimum length
        'Sunshine Care Center',
        "St. Mary's Residential Treatment Facility",
        'a'.repeat(100), // maximum length
      ];

      for (const name of validNames) {
        const dto = plainToClass(FacilityNameTestDto, { name });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid facility names', async () => {
      const invalidNames = [
        '', // empty
        'AB', // too short
        'a'.repeat(101), // too long
        '   ', // only spaces
      ];

      for (const name of invalidNames) {
        const dto = plainToClass(FacilityNameTestDto, { name });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isFacilityName');
      }
    });
  });

  describe('IsCityName', () => {
    it('should accept valid city names', async () => {
      const validCities = [
        'LA', // minimum length
        'San Francisco',
        'New York',
        'Saint-Jean-sur-Richelieu',
        "O'Fallon",
      ];

      for (const city of validCities) {
        const dto = plainToClass(CityTestDto, { city });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid city names', async () => {
      const invalidCities = [
        '', // empty
        'A', // too short
        'a'.repeat(101), // too long
        'City123', // contains numbers
        'City@Name', // contains special characters
      ];

      for (const city of invalidCities) {
        const dto = plainToClass(CityTestDto, { city });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isCityName');
      }
    });
  });

  describe('IsAddress', () => {
    it('should accept valid addresses', async () => {
      const validAddresses = [
        '123 Main St', // minimum acceptable length
        '123 Main Street, Apt 4B',
        '1234 Very Long Street Name with Multiple Words',
        'a'.repeat(200), // maximum length
      ];

      for (const address of validAddresses) {
        const dto = plainToClass(AddressTestDto, { address });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid addresses', async () => {
      const invalidAddresses = [
        '', // empty
        '123', // too short
        'a'.repeat(201), // too long
        '   ', // only spaces
      ];

      for (const address of invalidAddresses) {
        const dto = plainToClass(AddressTestDto, { address });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isAddress');
      }
    });
  });

  describe('IsBirthDate', () => {
    it('should accept valid birth dates', async () => {
      const validDates = [
        new Date('1990-01-01'),
        new Date('2000-12-31'),
        new Date(), // today
        new Date('1900-01-01'), // minimum date
      ];

      for (const birthDate of validDates) {
        const dto = plainToClass(BirthDateTestDto, { birthDate });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid birth dates', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const invalidDates = [
        null, // null
        undefined, // undefined
        new Date('invalid'), // invalid date
        tomorrow, // future date
        new Date('1899-12-31'), // before 1900
      ];

      for (const birthDate of invalidDates) {
        const dto = plainToClass(BirthDateTestDto, { birthDate });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isBirthDate');
      }
    });
  });

  describe('IsFinancialAmount', () => {
    it('should accept valid financial amounts', async () => {
      const validAmounts = [
        0,
        100.5,
        -50.25,
        999999.99, // maximum positive
        -999999.99, // maximum negative
        null, // null should be allowed
        undefined, // undefined should be allowed
      ];

      for (const amount of validAmounts) {
        const dto = plainToClass(FinancialAmountTestDto, { amount });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid financial amounts', async () => {
      const invalidAmounts = [
        1000000, // exceeds maximum
        -1000000, // exceeds minimum negative
        Infinity,
        -Infinity,
        NaN,
      ];

      for (const amount of invalidAmounts) {
        const dto = plainToClass(FinancialAmountTestDto, { amount });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isFinancialAmount');
      }
    });
  });
});
