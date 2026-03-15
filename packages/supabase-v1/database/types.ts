export interface User {
  id: string
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: {
          email: string
          name?: string | null
        }
        Update: {
          email?: string
          name?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: Post
        Insert: {
          user_id: string
          title: string
          content: string
        }
        Update: {
          user_id?: string
          title?: string
          content?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}