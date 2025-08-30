"use server";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client.
 * @param {boolean} useServiceRole - if true, uses SERVICE_ROLE_KEY for admin actions (server-side only)
 */
export async function createClient({ useServiceRole = false } = {}) {
  const cookieStore = await cookies()

  const supabaseKey = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Can ignore if called from a server component without proper headers
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  return user;
}

export async function protectRoute() {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized")
}
