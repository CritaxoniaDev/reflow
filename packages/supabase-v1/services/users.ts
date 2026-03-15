import { createServerClient, createAdminClient } from '../server'
import { createBrowserClient } from '../client'
import type { User } from '../database/types'

export async function getUserByEmail(email: string) {
  // Use admin client on server-side (tRPC calls this server-side)
  const supabase = createAdminClient()
  const normalizedEmail = email.toLowerCase()
  
  console.log('Searching for user with email:', normalizedEmail)
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', normalizedEmail)
    .single()

  console.log('Database response:', { data, error })

  if (error && error.code !== 'PGRST116') {
    console.error('Database error:', error)
    throw error
  }
  
  return data as User | null
}

export async function getUserByUsername(username: string) {
  // Use admin client on server-side (tRPC calls this server-side)
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as User | null
}

export async function registerUserProfile(username: string, email: string) {
  const supabase = createAdminClient()
  const normalizedEmail = email.toLowerCase()
  
  console.log('Creating user with email:', normalizedEmail, 'username:', username)
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      username,
      email: normalizedEmail,
    } as any)
    .select()
    .single()

  if (error) {
    console.error('Insert error:', error)
    throw error
  }
  
  console.log('User created:', data)
  return data as User
}

export async function signInWithOtp(email: string, redirectTo?: string) {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase(),
    options: {
      emailRedirectTo: redirectTo || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/verify`,
    },
  })

  if (error) throw error
  return { success: true }
}

export async function verifyOtp(email: string, token: string) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.toLowerCase(),
    token,
    type: 'email',
  })

  if (error) {
    return { data: null, error }
  }
  
  return { data, error: null }
}