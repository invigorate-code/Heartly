import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log("update user role called");
  
  // TODO: Implement with SuperTokens and backend API
  return NextResponse.json({
    error: 'This endpoint needs to be migrated from Supabase to SuperTokens'
  }, { status: 501 });
}