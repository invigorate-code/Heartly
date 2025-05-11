import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  // Regular email confirmation flow
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth error:", error);
      return NextResponse.redirect(new URL("/auth/auth-error", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Invite flow - redirect to the password setup page with the token parameters
  if (token && type === "invite") {
    // For invites, we'll redirect to a page where the user can set their password
    const url = new URL("/auth/confirm/accept-invite", request.url);
    url.searchParams.set("token", token);
    url.searchParams.set("type", type);
    return NextResponse.redirect(url);
  }

  // Neither code nor token_hash+type provided
  return NextResponse.redirect(new URL("/auth/auth-error", request.url));
}
