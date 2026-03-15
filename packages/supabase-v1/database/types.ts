export interface User {
  id: string
  username: string
  email: string
  token: string | null
  token_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: {
          username: string
          email: string
          token?: string | null
          token_expires_at?: string | null
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string
          email?: string
          token?: string | null
          token_expires_at?: string | null
          id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}