import { GET } from './route';
import { NextRequest } from 'next/server';
import { apiCall } from '@/lib/api-util';
import { getSSRSession } from 'supertokens-node/nextjs';

// Mock dependencies
jest.mock('@/lib/api-util');
jest.mock('supertokens-node/nextjs');
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({})),
}));

describe('GET /api/getUserAndFacilities', () => {
  const mockApiCall = apiCall as jest.MockedFunction<typeof apiCall>;
  const mockGetSSRSession = getSSRSession as jest.MockedFunction<typeof getSSRSession>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user and facilities when authenticated', async () => {
    // Mock session
    const mockSession = {
      getUserId: jest.fn().mockReturnValue('user-123'),
      getTenantId: jest.fn().mockReturnValue('tenant-456'),
    };
    mockGetSSRSession.mockResolvedValueOnce(mockSession as any);

    // Mock user info response
    const mockUserInfo = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    mockApiCall.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockUserInfo),
    } as any);

    // Mock facilities response
    const mockFacilities = [
      {
        id: 'facility-1',
        name: 'Test Facility 1',
        address: '123 Test St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        projected_client_count: 50,
        room_count: 25,
        tenant_id: 'tenant-456',
        status: 'ACTIVE',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];
    mockApiCall.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockFacilities),
    } as any);

    // Make request
    const request = new NextRequest('http://localhost:3000/api/getUserAndFacilities');
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toEqual({
      owner: {
        id: 'user-123',
        email: 'test@example.com',
        auth_id: 'user-123',
      },
      tenantId: 'tenant-456',
      facilities: mockFacilities,
    });

    expect(mockApiCall).toHaveBeenCalledTimes(2);
    expect(mockApiCall).toHaveBeenNthCalledWith(1, '/api/user/getBasicUserInfo', {
      method: 'GET',
    });
    expect(mockApiCall).toHaveBeenNthCalledWith(2, '/api/facility/getLoggedInUserFacilities', {
      method: 'GET',
    });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSSRSession.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost:3000/api/getUserAndFacilities');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: 'Not authenticated' });
    expect(mockApiCall).not.toHaveBeenCalled();
  });

  it('should return 500 when user info fetch fails', async () => {
    const mockSession = {
      getUserId: jest.fn().mockReturnValue('user-123'),
      getTenantId: jest.fn().mockReturnValue('tenant-456'),
    };
    mockGetSSRSession.mockResolvedValueOnce(mockSession as any);

    mockApiCall.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ message: 'User not found' }),
    } as any);

    const request = new NextRequest('http://localhost:3000/api/getUserAndFacilities');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to fetch user info' });
  });

  it('should return 500 when facilities fetch fails', async () => {
    const mockSession = {
      getUserId: jest.fn().mockReturnValue('user-123'),
      getTenantId: jest.fn().mockReturnValue('tenant-456'),
    };
    mockGetSSRSession.mockResolvedValueOnce(mockSession as any);

    // Mock successful user info
    mockApiCall.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ email: 'test@example.com' }),
    } as any);

    // Mock failed facilities fetch
    mockApiCall.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ message: 'Database error' }),
    } as any);

    const request = new NextRequest('http://localhost:3000/api/getUserAndFacilities');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to fetch facilities' });
  });

  it('should handle empty facilities array', async () => {
    const mockSession = {
      getUserId: jest.fn().mockReturnValue('user-123'),
      getTenantId: jest.fn().mockReturnValue('tenant-456'),
    };
    mockGetSSRSession.mockResolvedValueOnce(mockSession as any);

    mockApiCall.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ email: 'test@example.com' }),
    } as any);

    mockApiCall.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce([]),
    } as any);

    const request = new NextRequest('http://localhost:3000/api/getUserAndFacilities');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.facilities).toEqual([]);
  });
});