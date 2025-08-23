import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Confirm route called");
  
  // TODO: Implement SuperTokens email confirmation
  return NextResponse.json({
    error: 'Email confirmation needs to be implemented with SuperTokens'
  }, { status: 501 });
}