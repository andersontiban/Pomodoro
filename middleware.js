// middleware.js
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const response = NextResponse.next();

  const path = new URL(request.url).pathname;

  const protectedRoutes = ["/song-app"];
  const authRoutes = ["/login", "/sign-up"];

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  if (isProtectedRoute || isAuthRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            response.cookies.set(name, value, options);
          },
          remove(name, options) {
            response.cookies.set(name, "", {
              ...options,
              maxAge: 0,
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL("/song-app", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Only run middleware on these routes (excluding API, static files, etc.)
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
