import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request) {
    // update users auth token
    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}