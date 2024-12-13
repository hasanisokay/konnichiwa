import { NextResponse } from "next/server";
import { verifyToken } from "./utils/verifyToken.mjs";
import logOut from "./utils/logOut.mjs";
import { TOKEN_COOKIE } from "./constants/constantNames.mjs";

export async function middleware(request) {
  // return NextResponse.next();
  let token = request.cookies
    .get(TOKEN_COOKIE)
    ?.value?.split("Bearer")[1]
    ?.trim();
  const pathName = request.nextUrl.pathname;

  if ((pathName === "/login" || pathName === "/signup") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!token && pathName !== "/login" && pathName !== "/signup") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathName);
    return NextResponse.redirect(loginUrl);
  }
  if (pathName.includes("/admin") && token) {
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      await logOut();
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathName);
      return NextResponse.redirect(loginUrl);
    }
  }
  if (
    token &&
    !pathName.includes("/admin") &&
    pathName !== "/" &&
    pathName !== "/profile" &&
    !pathName.includes("/api")
  ) {
    const payload = await verifyToken(token);
    if (payload.role === "admin") {
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  if (token && pathName === "/") {
    const payload = await verifyToken(token);
    if (payload.role === "admin") {
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    } else if (payload.role === "user" && payload.status === "active") {
      const loginUrl = new URL("/lessons", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/posts/login|api/posts/signup|api/gets|api/gets/log-out|api/posts/check-email-availability).*)",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
  ],
};
