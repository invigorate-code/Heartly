import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const backendBaseUrl = process.env.NEXT_PUBLIC_NEST_API_URL || 'http://localhost:4000';
    
    // Get user basic info first to check authentication
    const userInfoResponse = await fetch(`${backendBaseUrl}/api/user/getBasicUserInfo`, {
      method: 'POST',
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!userInfoResponse.ok) {
      return NextResponse.json({
        error: 'Failed to authenticate'
      }, { status: 401 });
    }

    const userInfo = await userInfoResponse.json();
    
    if (userInfo.status !== 'OK') {
      return NextResponse.json({
        error: 'Not authenticated'
      }, { status: 401 });
    }

    // Get user facilities
    const facilitiesResponse = await fetch(`${backendBaseUrl}/api/facility/getLoggedInUserFacilities`, {
      method: 'GET',
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!facilitiesResponse.ok) {
      throw new Error('Failed to fetch facilities');
    }

    const facilities = await facilitiesResponse.json();

    return NextResponse.json({
      owner: {
        id: userInfo.userId,
        email: userInfo.email,
        auth_id: userInfo.userId,
      },
      tenantId: userInfo.tenantIds?.[0] || 'default',
      facilities: facilities,
    });
  } catch (error) {
    console.error('Error fetching user and facilities:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch user and facilities'
    }, { status: 500 });
  }
}