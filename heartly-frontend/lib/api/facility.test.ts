import { facilityAPI, CreateFacilityDto, UpdateFacilityDto, FacilityResponse } from './facility';
import { apiCall } from '@/lib/api-util';

// Mock the apiCall function
jest.mock('@/lib/api-util', () => ({
  apiCall: jest.fn(),
}));

describe('Facility API Service', () => {
  const mockApiCall = apiCall as jest.MockedFunction<typeof apiCall>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a facility successfully', async () => {
      const createData: CreateFacilityDto = {
        name: 'Test Facility',
        address: '123 Test St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        projectedClientCount: 50,
        roomCount: 25,
        tenantId: 'tenant-123',
        phone: '+14155551234',
        email: 'test@facility.com',
      };

      const mockResponse: FacilityResponse = {
        id: 'facility-123',
        name: 'Test Facility',
        address: '123 Test St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        projected_client_count: 50,
        room_count: 25,
        tenant_id: 'tenant-123',
        phone: '+14155551234',
        email: 'test@facility.com',
        status: 'ACTIVE',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockApiCall.mockResolvedValueOnce(mockResponse);

      const result = await facilityAPI.create(createData);

      expect(mockApiCall).toHaveBeenCalledWith('/api/facility/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when create fails', async () => {
      const createData: CreateFacilityDto = {
        name: 'Test Facility',
        address: '123 Test St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        projectedClientCount: 50,
        roomCount: 25,
        tenantId: 'tenant-123',
      };

      mockApiCall.mockRejectedValueOnce(new Error('Validation failed'));

      await expect(facilityAPI.create(createData)).rejects.toThrow('Validation failed');
    });
  });

  describe('update', () => {
    it('should update a facility successfully', async () => {
      const updateData: UpdateFacilityDto = {
        id: 'facility-123',
        name: 'Updated Facility',
        projectedClientCount: 75,
      };

      const mockResponse: FacilityResponse = {
        id: 'facility-123',
        name: 'Updated Facility',
        address: '123 Test St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        projected_client_count: 75,
        room_count: 25,
        tenant_id: 'tenant-123',
        status: 'ACTIVE',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T01:00:00Z',
      };

      mockApiCall.mockResolvedValueOnce(mockResponse);

      const result = await facilityAPI.update(updateData);

      expect(mockApiCall).toHaveBeenCalledWith('/api/facility/updateFacility', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when update fails', async () => {
      const updateData: UpdateFacilityDto = {
        id: 'facility-123',
        name: 'Updated Facility',
      };

      mockApiCall.mockRejectedValueOnce(new Error('Facility not found'));

      await expect(facilityAPI.update(updateData)).rejects.toThrow('Facility not found');
    });
  });

  describe('delete', () => {
    it('should delete a facility successfully', async () => {
      mockApiCall.mockResolvedValueOnce({
        ok: true,
        json: jest.fn(),
      } as any);

      await facilityAPI.delete('facility-123');

      expect(mockApiCall).toHaveBeenCalledWith('/api/facility/facility-123', {
        method: 'DELETE',
      });
    });

    it('should throw error when delete fails', async () => {
      mockApiCall.mockRejectedValueOnce(new Error('Insufficient permissions'));

      await expect(facilityAPI.delete('facility-123')).rejects.toThrow('Insufficient permissions');
    });
  });

  describe('restore', () => {
    it('should restore a facility successfully', async () => {
      const mockResponse: FacilityResponse = {
        id: 'facility-123',
        name: 'Test Facility',
        address: '123 Test St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        projected_client_count: 50,
        room_count: 25,
        tenant_id: 'tenant-123',
        status: 'ACTIVE',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T02:00:00Z',
      };

      mockApiCall.mockResolvedValueOnce(mockResponse);

      const result = await facilityAPI.restore('facility-123');

      expect(mockApiCall).toHaveBeenCalledWith('/api/facility/facility-123/restore', {
        method: 'PATCH',
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should get a facility by id successfully', async () => {
      const mockResponse: FacilityResponse = {
        id: 'facility-123',
        name: 'Test Facility',
        address: '123 Test St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        projected_client_count: 50,
        room_count: 25,
        tenant_id: 'tenant-123',
        status: 'ACTIVE',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockApiCall.mockResolvedValueOnce(mockResponse);

      const result = await facilityAPI.getById('facility-123');

      expect(mockApiCall).toHaveBeenCalledWith('/api/facility/getFacilityById/facility-123', {
        method: 'GET',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when facility not found', async () => {
      mockApiCall.mockRejectedValueOnce(new Error('Facility not found'));

      await expect(facilityAPI.getById('invalid-id')).rejects.toThrow('Facility not found');
    });
  });

  describe('getUserFacilities', () => {
    it('should get user facilities successfully', async () => {
      const mockResponse: FacilityResponse[] = [
        {
          id: 'facility-1',
          name: 'Facility 1',
          address: '123 Test St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94102',
          projected_client_count: 50,
          room_count: 25,
          tenant_id: 'tenant-123',
          status: 'ACTIVE',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'facility-2',
          name: 'Facility 2',
          address: '456 Main St',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
          projected_client_count: 30,
          room_count: 15,
          tenant_id: 'tenant-123',
          status: 'ACTIVE',
          is_active: true,
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ];

      mockApiCall.mockResolvedValueOnce(mockResponse);

      const result = await facilityAPI.getUserFacilities();

      expect(mockApiCall).toHaveBeenCalledWith('/api/facility/getLoggedInUserFacilities', {
        method: 'GET',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should return empty array when user has no facilities', async () => {
      mockApiCall.mockResolvedValueOnce([]);

      const result = await facilityAPI.getUserFacilities();

      expect(result).toEqual([]);
    });

    it('should throw error when not authenticated', async () => {
      mockApiCall.mockRejectedValueOnce(new Error('Failed to get user facilities'));

      await expect(facilityAPI.getUserFacilities()).rejects.toThrow('Failed to get user facilities');
    });
  });
});