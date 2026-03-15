import { createServerClient } from '../server'

export async function getPosts(limit = 10, offset = 0) {
  const supabase = createServerClient()
  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false })

  if (error) throw error
  return { posts: data, total: count }
}

export async function createPost(userId: string, title: string, content: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id: userId, title, content }] as any)
    .select()
    .single()

  if (error) throw error
  return data
}