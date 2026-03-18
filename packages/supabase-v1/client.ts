import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'

export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === 'undefined') return []
          
          const cookies: Array<{ name: string; value: string }> = []
          const cookieString = document.cookie || ''
          
          if (cookieString) {
            cookieString.split('; ').forEach(cookie => {
              const [name, value] = cookie.split('=')
              if (name && value) {
                cookies.push({ 
                  name: decodeURIComponent(name),
                  value: decodeURIComponent(value)
                })
              }
            })
          }
          
          return cookies
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') return
          
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieValue = `${name}=${value}`
            const maxAge = options?.maxAge ? `; Max-Age=${options.maxAge}` : ''
            const sameSite = options?.sameSite ? `; SameSite=${options.sameSite}` : ''
            const domain = options?.domain ? `; Domain=${options.domain}` : ''
            const path = options?.path ? `; Path=${options.path}` : '; Path=/'
            const secure = options?.secure ? '; Secure' : ''
            
            document.cookie = `${cookieValue}${maxAge}${sameSite}${domain}${path}${secure}`
          })
        },
      },
    }
  )
}