import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class PHIService {
  private readonly logger = new Logger(PHIService.name);
  private readonly encryptionKey: Buffer;

  // Define PHI fields that need encryption across the application
  // Consider using a configuration approach for different entity types
  private readonly PHI_FIELDS_MAP: Record<string, string[]> = {
    placementInfo: [
      'uci',
      'height',
      'weight',
      'eyes',
      'hair',
      'allergies',
      'dietarySensitivities',
      'socialSecurity',
      'ssi',
      'ssiPayee',
      'ssa',
      'ssaPayee',
      'otherBenefits',
      'otherBenefitsPayee',
      'medical',
      'medicare',
      'otherInsurance',
      'religiousPreference',
      'religiousPrefAdvisor',
      'dangerousPropensities',
      'dangerousPropensitiesDescription',
      'diagnosis',
      'medicalNeeds',
      'communicableConditions',
      'distinguishingMarks',
    ],
    // Add specialist PHI fields
    specialist: ['name', 'type', 'address', 'phoneNumber'],
    // Add medication PHI fields
    medication: ['name', 'requiredDosage', 'timeFrequency', 'prescribingMd'],
    // Add other entity types with their PHI fields
    client: [
      'socialSecurity',
      'medicalRecordNumber',
      // other client PHI fields
    ],
    // Add more entity types as needed
  };

  constructor(private readonly configService: ConfigService) {
    // Get encryption key from environment variables or a secure source
    const keyString = this.configService.get<string>('ENCRYPTION_KEY');
    if (!keyString) {
      this.logger.warn(
        '⚠️ WARNING: No encryption key found! Using temporary key. NOT SECURE for production!',
      );
      this.encryptionKey = this.generateTemporaryKey();
    } else {
      this.encryptionKey = this.createEncryptionKey(keyString);
    }
  }

  /**
   * Gets PHI fields for a specific entity type
   * @param entityType Type of entity (e.g., 'placement_info', 'client')
   * @returns Array of field names that contain PHI
   */
  getPHIFields(entityType: string): string[] {
    return this.PHI_FIELDS_MAP[entityType] || [];
  }

  /**
   * Encrypts a string value using AES-256-CBC
   * @param data String to encrypt
   * @returns Buffer containing IV + encrypted data
   */
  encryptPHI(data: string): Buffer {
    if (!data) return null;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final(),
    ]);
    return Buffer.concat([iv, encrypted]);
  }

  /**
   * Decrypts a buffer containing encrypted data
   * @param encryptedData Buffer containing IV + encrypted data
   * @returns Decrypted string
   */
  decryptPHI(encryptedData: Buffer): string {
    if (!encryptedData) return ''; // Return empty string instead of null

    try {
      const iv = encryptedData.subarray(0, 16);
      const encryptedText = encryptedData.subarray(16);
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        this.encryptionKey,
        iv,
      );
      const decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      this.logger.error(`Error decrypting PHI: ${error.message}`);
      return ''; // Return empty string instead of null for better error handling
    }
  }

  /**
   * Encrypts PHI fields in an object based on entity type
   * @param data Object possibly containing PHI fields
   * @param entityType Type of entity to identify PHI fields
   * @returns Copy of the object with PHI fields encrypted
   */
  encryptPHIFields<T extends object>(data: T, entityType: string): T {
    if (!data) return null;

    // Get PHI fields for this entity type
    const phiFields = this.getPHIFields(entityType);
    if (!phiFields.length) {
      return data; // No fields to encrypt
    }

    // Create a new object from scratch
    const result: Record<string, any> = {};

    // Copy all properties from the original object
    Object.keys(data).forEach((key) => {
      if (
        phiFields.includes(key) &&
        data[key] !== undefined &&
        data[key] !== null
      ) {
        // Encrypt PHI fields
        const encryptedBuffer = this.encryptPHI(String(data[key]));

        // Convert Buffer to a format that can be saved to the database
        // Option 1: Base64 encoding (recommended for storage as string)
        result[key] = encryptedBuffer
          ? encryptedBuffer.toString('base64')
          : null;

        // Option 2: Keep as Buffer if your DB schema expects Buffer type
        // result[key] = encryptedBuffer;
      } else {
        // Copy non-PHI fields as is
        result[key] = data[key];
      }
    });

    return result as T;
  }

  /**
   * Decrypts PHI fields in an entity based on entity type
   * @param entity Entity possibly containing encrypted PHI fields
   * @param entityType Type of entity to identify PHI fields
   * @returns Copy of the entity with PHI fields decrypted
   */
  decryptPHIFields<T extends Record<string, any>>(
    entity: T,
    entityType: string,
  ): T {
    if (!entity) return null;

    // Get PHI fields for this entity type
    const phiFields = this.getPHIFields(entityType);
    if (!phiFields.length) {
      return entity; // No fields to decrypt
    }

    // Create a new object from scratch
    const result: Record<string, any> = {};

    // Copy all properties from the original entity
    Object.keys(entity).forEach((key) => {
      if (phiFields.includes(key) && entity[key]) {
        // Decrypt PHI fields
        try {
          // Convert from base64 string back to Buffer first
          const buffer = Buffer.from(entity[key], 'base64');
          result[key] = this.decryptPHI(buffer);
        } catch (error) {
          this.logger.error(`Error decrypting ${key}: ${error.message}`);
          // Keep original value if decryption fails
          result[key] = entity[key];
        }
      } else {
        // Copy non-PHI fields as is
        result[key] = entity[key];
      }
    });

    return result as T;
  }

  /**
   * Directly encrypt a value to a Buffer
   * @param value Value to encrypt
   * @returns Buffer containing encrypted data
   */
  encryptToBuffer(value: any): Buffer {
    if (value === null || value === undefined) {
      return null;
    }

    // Convert any value to string before encryption
    const stringValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value);

    return this.encryptPHI(stringValue);
  }

  /**
   * Decrypt a Buffer back to its original value
   * @param buffer Encrypted buffer
   * @returns Original value
   */
  decryptFromBuffer(buffer: Buffer): any {
    if (!buffer) {
      return null;
    }

    const decryptedString = this.decryptPHI(buffer);

    // Try to parse as JSON in case it was an object
    try {
      return JSON.parse(decryptedString);
    } catch (e) {
      // If not JSON, return as string
      return decryptedString;
    }
  }

  /**
   * Encrypts PHI fields in an object based on entity type, returning Buffer values
   * @param data Object possibly containing PHI fields
   * @param entityType Type of entity to identify PHI fields
   * @returns Copy of the object with PHI fields encrypted as Buffer
   */
  encryptPHIFieldsToBuffer<T extends Record<string, any>>(
    data: T,
    entityType: string,
  ): Record<string, any> {
    if (!data) return null;

    // Get PHI fields for this entity type
    const phiFields = this.getPHIFields(entityType);
    if (!phiFields.length) {
      return data; // No fields to encrypt
    }

    // Create a new object from scratch
    const result: Record<string, any> = {};

    // Copy all properties from the original object
    Object.keys(data).forEach((key) => {
      if (
        phiFields.includes(key) &&
        data[key] !== undefined &&
        data[key] !== null
      ) {
        // Encrypt PHI fields directly to Buffer
        result[key] = this.encryptToBuffer(data[key]);
      } else {
        // Copy non-PHI fields as is
        result[key] = data[key];
      }
    });

    return result;
  }

  private createEncryptionKey(keyString: string): Buffer {
    if (!keyString) {
      throw new Error('Empty encryption key string provided');
    }
    return crypto.createHash('sha256').update(keyString).digest();
  }

  private generateTemporaryKey(): Buffer {
    return crypto.randomBytes(32);
  }

  /**
   * Process an entity with PHI fields, encrypting sensitive data to Buffer
   * @param data The data to process
   * @param entityType The type of entity for PHI field lookup
   * @param additionalFields Any additional fields to add to the result
   * @param tenantId The tenant ID to assign to the result
   * @param addressProcessor Optional function to process address fields
   * @returns Processed entity with encrypted PHI fields as Buffers
   */
  processEntityWithPHI<T>(
    data: any,
    entityType: string,
    tenantId: string,
    additionalFields?: Record<string, any>,
    addressProcessor?: (address: any) => any,
  ): T | undefined {
    if (!data) return undefined;

    // Get PHI fields for this entity type
    const phiFields = this.getPHIFields(entityType);

    // Start with additional fields (if any)
    const result: Record<string, any> = {
      ...(additionalFields || {}),
      tenantId,
    };

    // Process each field in the data
    Object.keys(data).forEach((key) => {
      if (
        phiFields.includes(key) &&
        data[key] !== undefined &&
        data[key] !== null
      ) {
        // Encrypt PHI fields directly to Buffer
        result[key] = this.encryptToBuffer(data[key]);
      } else if (key === 'address' && data[key] && addressProcessor) {
        // Special handling for address fields using the provided processor
        result[key] = addressProcessor(data[key]);
      } else if (!phiFields.includes(key)) {
        // Copy non-PHI fields as is
        result[key] = data[key];
      }
    });

    return result as T;
  }
}
