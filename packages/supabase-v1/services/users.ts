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

// NEW: Just initiate registration by sending OTP (auth user created when OTP verified)
export async function initiateRegistration(email: string, redirectTo?: string) {
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

// Now takes userId (from authenticated user) and creates profile
export async function registerUserProfile(userId: string, username: string, email: string) {
  const supabase = createAdminClient()
  const normalizedEmail = email.toLowerCase()
  
  console.log('Creating user profile with id:', userId, 'email:', normalizedEmail, 'username:', username)
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      username,
      email: normalizedEmail,
    } as any)
    .select()
    .single()

  if (error) {
    console.error('Insert error:', error)
    throw error
  }
  
  console.log('User profile created:', data)
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