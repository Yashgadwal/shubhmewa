import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  const { pathname } = request.nextUrl;

  // Protect admin panel paths
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!session) {
      // Redirect to login page if no session cookie exists
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect to dashboard if logged-in admin tries to view login page
  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
