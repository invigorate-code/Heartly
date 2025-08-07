import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("get user and facilities called");
  
  // TODO: Implement with SuperTokens and backend API
  return NextResponse.json({
    error: 'This endpoint needs to be migrated from Supabase to SuperTokens'
  }, { status: 501 });
}