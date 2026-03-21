import { createServerClient, createAdminClient } from '../server'
import crypto from 'crypto'
import { createBrowserClient } from '../client'
import type { User, UserWithTeam } from '../database/types'

const ENCRYPTION_KEY = process.env.TEAM_ENCRYPTION_KEY || ' '

function generateEncryptedCode() {
  const code = crypto.randomBytes(8).toString('hex').toUpperCase()
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    iv
  )
  let encrypted = cipher.update(code, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return {
    code: encrypted,
    iv: iv.toString('hex'),
    plainCode: code,
  }
}

// Helper function to decrypt code
function decryptCode(encryptedCode: string, iv: string): string {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    Buffer.from(iv, 'hex')
  )
  let decrypted = decipher.update(encryptedCode, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

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
      teams!users_team_id_fkey(id, name)
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
      teams!users_team_id_fkey(id, name)
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
    const { code, iv } = generateEncryptedCode()

    const { data: team, error: teamError } = await adm
      .from('teams')
      .insert({
        name: teamName,
        invite_code: code,
        invite_code_iv: iv,
        owner_id: userId,
      } as any)
      .select()
      .single()

    if (teamError) throw teamError

    const { data: user, error: userError } = await adm
      .from('users')
      // @ts-ignore
      .update({ team_id: team.id })
      .eq('id', userId)
      .select('id, email, username, team_id, teams!users_team_id_fkey(id, name)')
      .single()

    if (userError) throw userError
    return { team, user }
  },

  async getTeamByInviteCode(plainCode: string) {
    const adm = createAdminClient()

    const { data, error } = await adm
      .from('teams')
      .select('*')

    if (error) throw error

    // Find team with matching decrypted code
    const team = data?.find(t => {
      try {
        // Decrypt code and compare
        // @ts-ignore
        const decrypted = decryptCode(t.invite_code, t.invite_code_iv)
        return decrypted === plainCode.toUpperCase()
      } catch {
        return false
      }
    })

    return team || null
  },

  // Add function to get team with its code
  async getTeamWithCode(teamId: string) {
    const adm = createAdminClient()
    const { data, error } = await adm
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    // Decrypt and return code
    if (data) {
      // @ts-ignore
      const plainCode = decryptCode(data.invite_code, data.invite_code_iv)
      // @ts-ignore
      return { ...data, plainCode }
    }
    return data
  },

  // Add function to join team by code
  async joinTeamByCode(userId: string, teamId: string) {
    const adm = createAdminClient()

    const { data, error } = await adm
      .from('users')
      // @ts-ignore
      .update({ team_id: teamId })
      .eq('id', userId)
      .select('id, email, username, team_id, teams!users_team_id_fkey(id, name)')
      .single()

    if (error) throw error
    return data
  },

  async getTeamMembers(teamId: string) {
    const adm = createAdminClient()

    const { data, error } = await adm
      .from('users')
      .select('id, email, username, team_id')
      .eq('team_id', teamId)

    if (error) throw error

    // Fetch team to get owner_id
    const { data: team, error: teamError } = await adm
      .from('teams')
      .select('owner_id')
      .eq('id', teamId)
      .single()

    if (teamError) throw teamError

    // Map members with role
    const members = data?.map((user: any) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      // @ts-ignore
      role: user.id === team.owner_id ? 'owner' : 'member',
    })) || []

    return members
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