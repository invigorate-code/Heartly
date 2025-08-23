/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

// Mock fetch before importing route
global.fetch = jest.fn();

// Now import the route after mocking
import { GET } from './route';

describe('GET /api/getUserAndFacilities', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_NEST_API_URL = 'http://localhost:4000';
  });

  it('should return user and facilities when authenticated', async () => {
    // Mock user info response
    const mockUserInfo = {
      status: 'OK',
      userId: 'user-123',
      email: 'test@example.com',
      tenantIds: ['tenant-456'],
    };
    
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

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockUserInfo),
      } as any)
      .mockResolvedValueOnce({
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

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(1, 
      'http://localhost:4000/api/user/getBasicUserInfo',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
    expect(mockFetch).toHaveBeenNthCalledWith(2,
      'http://localhost:4000/api/facility/getLoggedInUserFacilities',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });

  it('should return 401 when not authenticated', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ error: 'Not authenticated' }),
    } as any);

    const request = new NextRequest('http://localhost:3000/api/getUserAndFacilities');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: 'Failed to authenticate' });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should return 401 when user info status is not OK', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ status: 'ERROR' }),
    } as any);

    const request = new NextRequest('http://localhost:3000/api/getUserAndFacilities');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: 'Not authenticated' });
  });

  it('should return 500 when facilities fetch fails', async () => {
    // Mock successful user info
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          status: 'OK',
          userId: 'user-123',
          email: 'test@example.com',
          tenantIds: ['tenant-456'],
        }),
      } as any)
      .mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: 'Database error' }),
      } as any);

    const request = new NextRequest('http://localhost:3000/api/getUserAndFacilities');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('Failed to fetch facilities');
  });

  it('should handle empty facilities array', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          status: 'OK',
          userId: 'user-123',
          email: 'test@example.com',
          tenantIds: ['tenant-456'],
        }),
      } as any)
      .mockResolvedValueOnce({
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