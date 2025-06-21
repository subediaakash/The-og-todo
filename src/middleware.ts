import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "development" ? "*" : "https//:ogtodo.space"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/profile/:path*"],
};
