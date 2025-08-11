import { NextRequest, NextResponse } from "next/server";
import { apiCall } from '@/lib/api-util';
import { getSSRSession } from 'supertokens-node/nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const session = await getSSRSession(cookies(), false);
    
    if (!session) {
      return NextResponse.json({
        error: 'Not authenticated'
      }, { status: 401 });
    }

    const userId = session.getUserId();
    const tenantId = session.getTenantId();
    
    // Get user basic info
    const userResponse = await apiCall('/api/user/getBasicUserInfo', {
      method: 'GET',
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await userResponse.json();

    // Get user facilities
    const facilitiesResponse = await apiCall('/api/facility/getLoggedInUserFacilities', {
      method: 'GET',
    });

    if (!facilitiesResponse.ok) {
      throw new Error('Failed to fetch facilities');
    }

    const facilities = await facilitiesResponse.json();

    return NextResponse.json({
      owner: {
        id: userId,
        email: userInfo.email,
        auth_id: userId,
      },
      tenantId: tenantId,
      facilities: facilities,
    });
  } catch (error) {
    console.error('Error fetching user and facilities:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch user and facilities'
    }, { status: 500 });
  }
}