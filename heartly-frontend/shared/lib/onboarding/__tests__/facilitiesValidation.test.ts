/**
 * @jest-environment jsdom
 */

import { validateFacilitiesStep } from '../facilitiesValidation';

// Mock fetch globally
global.fetch = jest.fn();

describe('Facilities Validation', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateFacilitiesStep', () => {
    it('should return error when API call fails', async () => {
      // Mock failed API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Server Error',
      });

      const result = await validateFacilitiesStep();

      expect(result).toEqual({
        isValid: false,
        errors: ['Failed to fetch facilities data'],
        warnings: [],
        canProceed: false,
        requiredActions: ['Check your internet connection and try again'],
        facilitiesCount: 0,
        validFacilities: 0,
      });
    });

    it('should return error when no facilities exist', async () => {
      // Mock API response with no facilities
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ facilities: [] }),
      });

      const result = await validateFacilitiesStep();

      expect(result).toEqual({
        isValid: false,
        errors: ['No facilities have been created'],
        warnings: [],
        canProceed: false,
        requiredActions: ['Create at least one facility to proceed'],
        facilitiesCount: 0,
        validFacilities: 0,
      });
    });

    it('should return error when all facilities are incomplete', async () => {
      // Mock API response with incomplete facilities
      const incompleteFacilities = [
        {
          name: '',
          address: 'Test Address',
          city: 'Test City',
          state: 'CA',
          zip: '90210',
          projected_client_count: 10,
        },
        {
          name: 'Test Facility',
          address: '',
          city: 'Test City',
          state: 'CA',
          zip: '90210',
          projected_client_count: 10,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ facilities: incompleteFacilities }),
      });

      const result = await validateFacilitiesStep();

      expect(result).toEqual({
        isValid: false,
        errors: ['All facilities are incomplete'],
        warnings: [],
        canProceed: false,
        requiredActions: ['Complete all facility information (name, address, city, state, zip, client count)'],
        facilitiesCount: 2,
        validFacilities: 0,
      });
    });

    it('should return warning when some facilities are incomplete', async () => {
      const mixedFacilities = [
        {
          name: 'Complete Facility',
          address: '123 Test Street',
          city: 'Test City',
          state: 'CA',
          zip: '90210',
          projected_client_count: 15,
        },
        {
          name: '',
          address: 'Incomplete Address',
          city: 'Test City',
          state: 'CA',
          zip: '90210',
          projected_client_count: 10,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ facilities: mixedFacilities }),
      });

      const result = await validateFacilitiesStep();

      expect(result).toEqual({
        isValid: false,
        errors: [],
        warnings: ['1 facility is incomplete'],
        canProceed: true,
        requiredActions: ['Complete information for all facilities'],
        facilitiesCount: 2,
        validFacilities: 1,
      });
    });

    it('should return valid result for complete facilities', async () => {
      const completeFacilities = [
        {
          name: 'Sunny Care Facility',
          address: '123 Healthcare Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210',
          projected_client_count: 25,
        },
        {
          name: 'Peaceful Living Center',
          address: '456 Wellness Drive',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          projected_client_count: 30,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ facilities: completeFacilities }),
      });

      const result = await validateFacilitiesStep();

      expect(result).toEqual({
        isValid: true,
        errors: [],
        warnings: [],
        canProceed: true,
        requiredActions: [],
        facilitiesCount: 2,
        validFacilities: 2,
      });
    });

    it('should return warning for low capacity facilities', async () => {
      const lowCapacityFacilities = [
        {
          name: 'Small Care Home',
          address: '123 Small Street',
          city: 'Test City',
          state: 'CA',
          zip: '90210',
          projected_client_count: 3, // Low capacity
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ facilities: lowCapacityFacilities }),
      });

      const result = await validateFacilitiesStep();

      expect(result).toEqual({
        isValid: false,
        errors: [],
        warnings: ['1 facility has low client capacity (< 5)'],
        canProceed: true,
        requiredActions: [],
        facilitiesCount: 1,
        validFacilities: 1,
      });
    });

    it('should return warning for high capacity facilities', async () => {
      const highCapacityFacilities = [
        {
          name: 'Large Care Center',
          address: '123 Large Avenue',
          city: 'Test City',
          state: 'CA',
          zip: '90210',
          projected_client_count: 75, // High capacity
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ facilities: highCapacityFacilities }),
      });

      const result = await validateFacilitiesStep();

      expect(result).toEqual({
        isValid: false,
        errors: [],
        warnings: ['1 facility has high client capacity (> 50). Ensure adequate staffing.'],
        canProceed: true,
        requiredActions: [],
        facilitiesCount: 1,
        validFacilities: 1,
      });
    });

    it('should handle network errors gracefully', async () => {
      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await validateFacilitiesStep();

      expect(result).toEqual({
        isValid: false,
        errors: ['Validation failed due to system error'],
        warnings: [],
        canProceed: false,
        requiredActions: ['Please try again or contact support if the problem persists'],
        facilitiesCount: 0,
        validFacilities: 0,
      });
    });

    it('should validate facility completeness correctly', async () => {
      const testCases = [
        {
          facility: {
            name: 'Valid Facility',
            address: '123 Test St',
            city: 'Test City',
            state: 'CA',
            zip: '90210',
            projected_client_count: 10,
          },
          shouldBeValid: true,
        },
        {
          facility: {
            name: '',
            address: '123 Test St',
            city: 'Test City',
            state: 'CA',
            zip: '90210',
            projected_client_count: 10,
          },
          shouldBeValid: false,
        },
        {
          facility: {
            name: 'Valid Facility',
            address: '',
            city: 'Test City',
            state: 'CA',
            zip: '90210',
            projected_client_count: 10,
          },
          shouldBeValid: false,
        },
        {
          facility: {
            name: 'Valid Facility',
            address: '123 Test St',
            city: 'Test City',
            state: 'CA',
            zip: '90210',
            projected_client_count: 0,
          },
          shouldBeValid: false,
        },
      ];

      for (const testCase of testCases) {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ facilities: [testCase.facility] }),
        });

        const result = await validateFacilitiesStep();
        
        if (testCase.shouldBeValid) {
          expect(result.validFacilities).toBe(1);
        } else {
          expect(result.validFacilities).toBe(0);
        }
        
        jest.clearAllMocks();
      }
    });
  });
});