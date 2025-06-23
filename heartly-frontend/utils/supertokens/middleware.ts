import { NextResponse, NextRequest } from "next/server";
import { getLoggedInUser } from "@/app/api/poc-api-using-api-util/index";

const protectedRoutes = ["/dashboard", "/onboarding"];
const authRoutes = ["/auth", "/login", "/sign-up", "/"];
const verificationRoutes = ["/auth/verify-email"];
const emailVerificationRequiredRoute = "/email-verification-required";

export async function updateSession(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow direct access to verification routes with tokens and email verification required page
  if (
    path === "/auth/verify-email" ||
    path === emailVerificationRequiredRoute
  ) {
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

  // Skip middleware for non-protected and non-auth routes
  if (!isProtectedRoute && !isAuthRoute && !isVerificationRoute) {
    return NextResponse.next();
  }

  try {
    // First try to get basic user info (works for unverified users)
    const basicUserResponse = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_API_URL}/api/auth/getBasicUserInfo`,
      {
        method: "POST",
        headers: {
          Cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      },
    );

    if (basicUserResponse.ok) {
      const basicUserInfo = await basicUserResponse.json();
      const isAuthenticated = basicUserInfo?.status === "OK";
      const isEmailVerified = basicUserInfo?.isEmailVerified === true;

      console.log("Basic user info:", {
        isAuthenticated,
        isEmailVerified,
        email: basicUserInfo?.email,
      });

      if (isAuthenticated) {
        // User is authenticated, now check if email is verified for protected routes
        if (isProtectedRoute && !isEmailVerified) {
          return NextResponse.redirect(
            new URL(emailVerificationRequiredRoute, req.url),
          );
        }

        // For verified users, get full user profile for onboarding check
        if (isEmailVerified) {
          try {
            const fullUserResponse = await fetch(
              `${process.env.NEXT_PUBLIC_NEST_API_URL}/api/auth/getUserSession`,
              {
                method: "POST",
                headers: {
                  Cookie: req.headers.get("cookie") || "",
                },
                credentials: "include",
              },
            );

            if (fullUserResponse.ok) {
              const response = await fullUserResponse.json();
              const isOnboardingCompleted =
                response?.userProfile?.onboarding_completed_at != null;
              const isOwner = response?.userProfile?.role === "OWNER";
              const isOnboardingRequired = isOwner && !isOnboardingCompleted;

              // Redirect authenticated users from auth routes (including "/")
              if (isAuthRoute) {
                if (isOnboardingRequired) {
                  return NextResponse.redirect(new URL("/onboarding", req.url));
                }
                return NextResponse.redirect(new URL("/dashboard", req.url));
              }
            }
          } catch (error) {
            console.error("Error getting full user session:", error);
          }
        } else {
          // User is authenticated but not verified
          if (isAuthRoute) {
            return NextResponse.redirect(
              new URL(emailVerificationRequiredRoute, req.url),
            );
          }
        }
      } else {
        // User is not authenticated
        if (isProtectedRoute) {
          return NextResponse.redirect(new URL("/login", req.url));
        }
      }
    } else {
      // User is not authenticated at all
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  } catch (error) {
    console.error("Session verification error:", error);

    // On error, allow access to auth routes but redirect from protected routes
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
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
