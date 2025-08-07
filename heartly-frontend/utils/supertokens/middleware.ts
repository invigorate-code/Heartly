import { NextResponse, NextRequest } from "next/server";
import { getLoggedInUser } from "@/app/api/poc-api-using-api-util/index";

const protectedRoutes = ["/dashboard", "/onboarding"];
const authRoutes = ["/auth", "/login", "/sign-up", "/"];
const verificationRoutes = ["/auth/verify-email"];
const emailVerificationRequiredRoute = "/email-verification-required";

export async function updateSession(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Path:", path);
  console.log("Cookies:", req.headers.get("cookie"));

  // Allow direct access to verification routes with tokens and email verification required page
  if (
    path === "/auth/verify-email" ||
    path === emailVerificationRequiredRoute
  ) {
    console.log("Allowing direct access to verification route");
    return NextResponse.next();
  }

  // Check if the current route needs protection
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isVerificationRoute = verificationRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );

  const isUnprotectedRoute = !isProtectedRoute && !isAuthRoute && !isVerificationRoute;

  console.log("Route classification:", {
    isProtectedRoute,
    isAuthRoute,
    isVerificationRoute,
    isUnprotectedRoute,
  });

  // Skip middleware for unprotected routes
  if (isUnprotectedRoute) {
    console.log("Skipping middleware for unprotected route");
    return NextResponse.next();
  }

  try {
    // Check session using our basic user info endpoint (works for unverified users)
    const basicUserResponse = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/api/auth/getBasicUserInfo`,
      {
        method: "POST",
        headers: {
          Cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      },
    );

    const basicUserInfo = await basicUserResponse.json();
    const isAuthenticated = basicUserInfo?.status === "OK";
    const isEmailVerified = basicUserInfo?.isEmailVerified === true;

    console.log("Session check in middleware:", {
      isAuthenticated,
      isEmailVerified,
      path,
      email: basicUserInfo?.email,
      status: basicUserInfo?.status,
      willRedirect: isAuthenticated && isAuthRoute,
    });

    if (isAuthenticated) {
        // First handle auth route redirects for ALL authenticated users (verified or not)
        if (isAuthRoute) {
          console.log("User is authenticated and on auth route, redirecting...");
          if (isEmailVerified) {
            // For verified users, redirect to dashboard (we'll handle onboarding separately)
            console.log("Redirecting verified user from auth page to dashboard");
            return NextResponse.redirect(new URL("/dashboard", req.url));
          } else {
            // User is authenticated but not verified - redirect to verification page
            console.log("Redirecting unverified user from auth page to email verification");
            return NextResponse.redirect(
              new URL(emailVerificationRequiredRoute, req.url),
            );
          }
        }

        // Then handle protected route access for authenticated users
        if (isProtectedRoute && !isEmailVerified) {
          return NextResponse.redirect(
            new URL(emailVerificationRequiredRoute, req.url),
          );
        }
      } else {
        // User is not authenticated
        console.log("User not authenticated, checking route access");
        if (isProtectedRoute) {
          console.log("Redirecting unauthenticated user from protected route to login");
          return NextResponse.redirect(new URL("/login", req.url));
        }
        // For auth routes and landing page, unauthenticated users should have access
        console.log("Allowing unauthenticated access to:", path);
      }
  } catch (error) {
    console.error("Session verification error:", error);

    // On error, treat as unauthenticated
    // Allow access to auth routes and landing page, redirect from protected routes
    if (isProtectedRoute) {
      console.log("Error occurred, redirecting from protected route to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // Allow access to auth routes and landing page when there's an error
    console.log("Error occurred, allowing access to auth route or landing page:", path);
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
