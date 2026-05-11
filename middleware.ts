import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "@/lib/auth-config";
import { isTokenRevoked } from "@/lib/auth/token-blocklist";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      // Check if token has been revoked (logout)
      if (await isTokenRevoked(token)) {
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url),
        );
        response.cookies.delete("authToken");
        return response;
      }

      const { payload } = await jwtVerify(token, JWT_SECRET);

      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
      return NextResponse.next();
    } catch (err) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url),
      );
      response.cookies.delete("authToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
