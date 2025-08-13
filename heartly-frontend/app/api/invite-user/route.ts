import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("invite user called");
  
  // TODO: Implement with SuperTokens and backend API
  return NextResponse.json({
    error: 'This endpoint needs to be migrated from Supabase to SuperTokens'
  }, { status: 501 });
}