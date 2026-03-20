import { createServerClient, createAdminClient } from '../server'
import { createBrowserClient } from '../client'
import type { User, UserWithTeam } from '../database/types'

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

export async function getUserWithTeam(email: string) {
  const adm = createAdminClient()
  const { data, error } = await adm
    .from('users')
    .select(`
      id,
      email,
      username,
      team_id,
      teams(id, name)
    `)
    .eq('email', email)
    .single()

  if (error) throw error
  return data as UserWithTeam
}

export async function getUserById(id: string) {
  const adm = createAdminClient()
  const { data, error } = await adm
    .from('users')
    .select(`
      id,
      email,
      username,
      team_id,
      teams(id, name)
    `)
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as UserWithTeam | null
}

export async function signOutUser(supabase: any) {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error: any) {
    throw new Error(`Sign out failed: ${error.message}`)
  }
}

export const teamService = {
  async createTeam(userId: string, teamName: string) {
    const adm = createAdminClient()

    // Create team
    const { data: team, error: teamError } = await adm
      .from('teams')
      .insert({ name: teamName } as any)
      .select()
      .single()

    if (teamError) throw teamError

    // Update user's team_id
    const { data: user, error: userError } = await adm
      .from('users')
      // @ts-ignore
      .update({ team_id: team.id })
      .eq('id', userId)
      .select('id, email, username, team_id, teams:team_id(id, name)')
      .single()

    if (userError) throw userError
    return { team, user }
  },

  async getTeamById(teamId: string) {
    const adm = createAdminClient()
    const { data, error } = await adm
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateTeamName(teamId: string, newName: string) {
    const adm = createAdminClient()
    const { data, error } = await adm
      .from('teams')
      // @ts-ignore
      .update({ name: newName, updated_at: new Date().toISOString() })
      .eq('id', teamId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTeam(teamId: string, userId: string) {
    const adm = createAdminClient()

    // Remove team_id from user
    const { error: updateError } = await adm
      .from('users')
      // @ts-ignore
      .update({ team_id: null })
      .eq('id', userId)

    if (updateError) throw updateError

    // Delete team
    const { error: deleteError } = await adm
      .from('teams')
      .delete()
      .eq('id', teamId)

    if (deleteError) throw deleteError
    return { success: true }
  },

  async inviteMember(teamId: string, memberEmail: string) {
    const adm = createAdminClient()
    
    // Find user by email
    const { data: user, error: userError } = await adm
      .from('users')
      .select('id, email, username')
      .eq('email', memberEmail.toLowerCase())
      .single()

    if (userError && userError.code !== 'PGRST116') throw userError
    
    if (!user) {
      throw new Error(`User with email ${memberEmail} not found`)
    }

    // Update user's team_id
    const { data: updatedUser, error: updateError } = await adm
      .from('users')
      // @ts-ignore
      .update({ team_id: teamId })
      // @ts-ignore
      .eq('id', user.id)
      .select('id, email, username, team_id')
      .single()

    if (updateError) throw updateError
    
    return { success: true, user: updatedUser }
  },
}