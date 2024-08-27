import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token")?.value;

  if (!access_token) {
    return NextResponse.redirect(new URL("/register", req.url));
  }
  // const { pathname } = req.nextUrl;
  // const token = req.cookies.get("token"); // Assuming the auth token is stored in cookies

  // // Redirect to login if the user is not logged in and trying to access protected routes
  // if (!token && pathname.startsWith("/admin/dashboard")) {
  //   return NextResponse.redirect(new URL("/admin/login", req.url));
  // }

  // // Redirect to dashboard if the user is logged in and trying to access the login or register pages
  // if (
  //   token &&
  //   (pathname.startsWith("/admin/login") ||
  //     pathname.startsWith("/admin/register"))
  // ) {
  //   return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/dashboard", "/admin/login", "/admin/register"],
};
