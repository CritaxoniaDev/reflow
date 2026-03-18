import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { createServerClient } from '@supabase/ssr'

export async function createContext(opts: FetchCreateContextFnOptions) {
  let headers = new Headers()

  // Create Supabase server client with modern cookie methods
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Use getAll instead of get
        getAll() {
          const cookieHeader = opts.req.headers.get('cookie') || ''
          const cookies: Array<{ name: string; value: string }> = []
          
          if (cookieHeader) {
            cookieHeader.split('; ').forEach(cookie => {
              const [name, value] = cookie.split('=')
              if (name && value) {
                cookies.push({ name, value })
              }
            })
          }
          
          return cookies
        },
        // Use setAll instead of set/remove
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieString = `${name}=${value}`
            headers.append('Set-Cookie', cookieString)
          })
        },
      },
    }
  )

  // Get authenticated user from Supabase session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return {
    req: opts.req,
    user,
    supabase,
    headers,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>