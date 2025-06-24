import { NextResponse, NextRequest } from "next/server";
import { getLoggedInUser } from "@/app/api/poc-api-using-api-util/index";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth", "/login", "/sign-up", "/"];
const verificationRoutes = ["/auth/verify-email"];
const unprotectedRoutes = ["/components", "/showcase"];

export async function updateSession(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow direct access to verification routes with tokens
  if (path === "/auth/verify-email" && req.nextUrl.searchParams.has("token")) {
    return NextResponse.next();
  }

  // Check if the current route needs protection
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isVerificationRoute = verificationRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isUnprotectedRoute = unprotectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );

  // Skip middleware for unprotected routes
  if (isUnprotectedRoute) {
    return NextResponse.next();
  }

  // Skip middleware for non-protected and non-auth routes
  if (!isProtectedRoute && !isAuthRoute && !isVerificationRoute) {
    return NextResponse.next();
  }

  try {
    // Check if backend API URL is configured
    if (!process.env.NEXT_PUBLIC_NEST_API_URL) {
      console.warn(
        "NEXT_PUBLIC_NEST_API_URL not configured. Skipping authentication check.",
      );
      throw new Error("Backend API URL not configured");
    }

    // Use your dedicated endpoint to verify the session
    // Forward the cookies from the incoming request
    const loggedInUserResponse = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_API_URL}/api/auth/getUserSession`,
      {
        method: "POST",
        headers: {
          Cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      },
    );

    if (!loggedInUserResponse.ok) {
      throw new Error(`Backend responded with ${loggedInUserResponse.status}`);
    }

    const response = await loggedInUserResponse.json();

    const isAuthenticated = response?.status === "OK";
    console.log("isAuthenticated", isAuthenticated);

    // check if the user is an owner and has completed onboarding
    const isOnboardingCompleted =
      response?.userProfile?.onboarding_completed_at != null;
    const isOwner = response?.userProfile?.role === "OWNER";
    const isOnboardingRequired = isOwner && !isOnboardingCompleted;

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect authenticated users from auth routes (including "/")
    if (isAuthRoute && isAuthenticated) {
      // If user is an owner and hasn't completed onboarding, redirect to onboarding
      if (isOnboardingRequired) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
      // Otherwise redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch (error) {
    console.error("Session verification error:", error);

    // On error during development, allow access to auth routes but redirect from protected routes
    // In production, you might want to handle this differently
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If we're trying to access the root path and backend is not available,
    // allow it to proceed (this will show the landing page)
    if (path === "/") {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
  // // For API routes, create a minimal response that just passes through
  // if (request.nextUrl.pathname.startsWith("/api/")) {
  //   return NextResponse.next();
  // }

  // let response = NextResponse.next({
  //   request,
  // });

  // // Get the logged in user
  // const user = await authApi.getLoggedInUser();

  // if (!user) {
  //   // Unauthenticated user logic
  //   if (request.nextUrl.pathname.startsWith("/api")) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/";
  //     return NextResponse.redirect(url);
  //   }
  // } else {
  //   const { role, onboarding_completed_at, onboarding_step } = user.userProfile;
  //   const isOwner = role === "OWNER";

  //   // Redirect logged-in users away from /login, /, and /sign-up
  //   if (
  //     !request.nextUrl.pathname.startsWith("/api") &&
  //     (request.nextUrl.pathname.startsWith("/login") ||
  //       request.nextUrl.pathname === "/" ||
  //       request.nextUrl.pathname.startsWith("/sign-up"))
  //   ) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = onboarding_completed_at ? "/dashboard" : "/onboarding";
  //     return NextResponse.redirect(url);
  //   }

  //   if (isOwner && !onboarding_completed_at) {
  //     // Owner who hasn't completed onboarding
  //     if (!request.nextUrl.pathname.startsWith("/onboarding")) {
  //       const url = request.nextUrl.clone();
  //       url.pathname = "/onboarding";
  //       return NextResponse.redirect(url);
  //     }
  //   } else {
  //     // All logged-in users who have completed onboarding or are not owners/subscribers
  //     if (
  //       request.nextUrl.pathname.startsWith("/admin") &&
  //       role !== "OWNER" &&
  //       role !== "ADMIN"
  //     ) {
  //       // Not allowed to access admin dashboard
  //       const url = request.nextUrl.clone();
  //       url.pathname = "/dashboard";
  //       return NextResponse.redirect(url);
  //     }
  //   }

  //   // Redirect users who have completed onboarding away from the onboarding route
  //   if (
  //     onboarding_completed_at &&
  //     request.nextUrl.pathname.startsWith("/onboarding")
  //   ) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/dashboard";
  //     return NextResponse.redirect(url);
  //   }
  // }

  // return response;
}
