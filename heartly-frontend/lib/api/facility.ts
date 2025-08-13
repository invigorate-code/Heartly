import { apiCall } from '@/lib/api-util';

export interface CreateFacilityDto {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  projectedClientCount: number;
  roomCount: number;
  tenantId: string;
  phone?: string;
  email?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

export interface UpdateFacilityDto extends Partial<CreateFacilityDto> {
  id: string;
}

export interface FacilityResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  projected_client_count: number;
  room_count: number;
  tenant_id: string;
  phone?: string;
  email?: string;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const facilityAPI = {
  create: async (data: CreateFacilityDto): Promise<FacilityResponse> => {
    const response = await apiCall('/api/facility/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create facility');
    }

    return response.json();
  },

  update: async (data: UpdateFacilityDto): Promise<FacilityResponse> => {
    const response = await apiCall('/api/facility/updateFacility', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update facility');
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await apiCall(`/api/facility/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete facility');
    }
  },

  restore: async (id: string): Promise<FacilityResponse> => {
    const response = await apiCall(`/api/facility/${id}/restore`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to restore facility');
    }

    return response.json();
  },

  getById: async (id: string): Promise<FacilityResponse> => {
    const response = await apiCall(`/api/facility/getFacilityById/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get facility');
    }

    return response.json();
  },

  getUserFacilities: async (): Promise<FacilityResponse[]> => {
    const response = await apiCall('/api/facility/getLoggedInUserFacilities', {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user facilities');
    }

    return response.json();
  },
};