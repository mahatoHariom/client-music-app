import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token")?.value;
  if (!access_token) {
    return NextResponse.redirect(new URL("/register", req.url));
  }
}
export const config = {
  matcher: ["/", "/admin/dashboard", "/admin/login", "/admin/register"],
};
