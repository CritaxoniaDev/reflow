import { createServerClient, createAdminClient } from '../server'

export async function getUserById(id: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createUser(email: string, name: string) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('users')
    .insert([{ email, name }] as any)
    .select()
    .single()

  if (error) throw error
  return data
}