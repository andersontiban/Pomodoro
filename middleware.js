// middleware.js (or your preferred filename)
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const path = new URL(request.url).pathname;

  // Define your protected and authentication routes
  // Ensure these match your actual application routes
  const protectedRoutes = ["/song-app"]; // Example: your main app page
  const authRoutes = ["/login", "/signup"]; // Your login and signup pages

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  // Only run Supabase client and user check if it's a relevant route
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
            // request.cookies.set({ // This is not how you set cookies in middleware for the browser
            //   name,
            //   value,
            //   ...options,
            // });
            // The response object is used to set cookies that will be sent to the browser.
            // The Supabase client needs to be able to update the session cookie.
            // Re-creating response might be necessary if Supabase client modifies cookies.
            // However, the Supabase SSR client is designed to handle this by updating the `response` object you pass it.
            // The key is that the `response` object passed to `createServerClient` is the one that eventually gets returned or modified.
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            // request.cookies.set({ // Same as above
            //   name,
            //   value: "",
            //   ...options,
            // });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (isProtectedRoute && !user) {
      // If trying to access a protected route without being logged in,
      // redirect to the login page.
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && user) {
      // If trying to access an auth route (login/signup) while already logged in,
      // redirect to the main application page (or dashboard/homepage).
      // Make sure "/" is the correct redirect for logged-in users,
      // or change it to "/song-app" or your main app route.
      return NextResponse.redirect(new URL("/song-app", request.url)); 
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except for static assets, API routes, and specific files
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

