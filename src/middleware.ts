import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("accessToken")?.value;

  const url = new URL(req.url);

  // If no token, redirect to the register page
  if (!access_token && url.pathname !== "/register") {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // If token exists and the request is to the login or register page, redirect to dashboard
  if (
    access_token &&
    (url.pathname === "/login" || url.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [ "/register", "/dashboard"],
};
