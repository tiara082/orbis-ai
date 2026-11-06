import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'

declare const process: { env: Record<string, string | undefined> }

export function createClient(request: Request) {
  const headers = new Headers()

  const supabase = createServerClient(
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL
      ? process.env.VITE_SUPABASE_URL
      : import.meta.env.VITE_SUPABASE_URL)!,
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_PUBLISHABLE_KEY
      ? process.env.VITE_SUPABASE_PUBLISHABLE_KEY
      : import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '') as {
            name: string
            value: string
          }[]
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
          )
        },
      },
    }
  )

  return { supabase, headers }
}
