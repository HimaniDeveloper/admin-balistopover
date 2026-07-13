import { NextResponse } from "next/server";
import { verifyRefreshToken } from "./lib/jwt";

// Role-based protected routes
const protectedRoutes = {
  "/": ["admin", "user"],
  "/users": ["admin"],
  "/airline": ["admin", "user"],
  "/airline/.*": ["admin", "user"],
  "/blogs/.*": ["admin", "user"],
  "/destination/.*": ["admin", "user"],
  "/category/.*": ["admin", "user"],
  "/reviews/.*": ["admin", "user"],
  "/images/.*": ["admin", "user"],
  "/deals/.*": ["admin", "user"],
  "/we-offer/.*": ["admin", "user"],
  "/blogs": ["admin", "user"],
  "/destination": ["admin", "user"],
  "/category": ["admin", , "user"],
  "/reviews": ["admin", "user"],
  "/images": ["admin", "user"],
  "/deals": ["admin", "user"],
  "/we-offer": ["admin", "user"],
  "/pagelist": ["admin", "user"],
  "/edit/.*": ["admin"],
  "/faqs": ["admin", "user"],
  "/faqs/.*": ["admin", "user"],
  "/popup": ["admin"],
  "/popup/.*": ["admin"],
  "/authors": ["admin", "user"],
  "/authors/.*": ["admin", "user"],
};

// Publicly accessible routes
const publicRoutes = [
  /^\/login$/,
  /^\/register$/,
  /^\/forgot-password$/,
  /^\/reset-password$/,
  /^\/api\/auth\/logout$/,
  /^\/_next\/.*$/,
  /^\/favicon\.ico$/,
  /^\/api\/.*$/,
  /^\/img\/.*$/,
  /^\/fonts\/.*$/,
  /^\/static\/.*$/,
  /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i,
];

function isProtectedRoute(pathname) {
  return Object.keys(protectedRoutes).some((pattern) =>
    new RegExp(`^${pattern}$`).test(pathname),
  );
}

function isPublicRoute(pathname) {
  return publicRoutes.some((pattern) => pattern.test(pathname));
}

function hasRequiredRole(pathname, userRole) {
  for (const [pattern, allowedRoles] of Object.entries(protectedRoutes)) {
    if (new RegExp(`^${pattern}$`).test(pathname)) {
      return allowedRoles.includes(userRole);
    }
  }
  return false;
}

export async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }
  if (!refreshToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }

  try {
    if (refreshToken) {
      const { payload } = await verifyRefreshToken(refreshToken);
      const userRole = payload?.role;
      if (!hasRequiredRole(pathname, userRole)) {
        const response = NextResponse.redirect(new URL("/", request.url));
        response.headers.set("Cache-Control", "no-store, max-age=0");
        return response;
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-role", userRole);

      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      response.headers.set("Cache-Control", "no-store, max-age=0");
      return response;
    }

    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }
}
