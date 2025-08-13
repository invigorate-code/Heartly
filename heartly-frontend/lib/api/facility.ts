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
    return await apiCall<FacilityResponse>('/api/facility/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  update: async (data: UpdateFacilityDto): Promise<FacilityResponse> => {
    return await apiCall<FacilityResponse>('/api/facility/updateFacility', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiCall<void>(`/api/facility/${id}`, {
      method: 'DELETE',
    });
  },

  restore: async (id: string): Promise<FacilityResponse> => {
    return await apiCall<FacilityResponse>(`/api/facility/${id}/restore`, {
      method: 'PATCH',
    });
  },

  getById: async (id: string): Promise<FacilityResponse> => {
    return await apiCall<FacilityResponse>(`/api/facility/getFacilityById/${id}`, {
      method: 'GET',
    });
  },

  getUserFacilities: async (): Promise<FacilityResponse[]> => {
    return await apiCall<FacilityResponse[]>('/api/facility/getLoggedInUserFacilities', {
      method: 'GET',
    });
  },
};