export interface User {
  id: string
  email: string
  username: string
  team_id: string | null
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Flowchart {
  id: string
  user_id: string
  team_id: string | null
  name: string
  content: any
  created_at: string
  updated_at: string
}

export interface UserWithTeam extends User {
  teams: Team | null
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
          team_id?: string | null
        }
        Update: {
          username?: string
          email?: string
          token?: string | null
          token_expires_at?: string | null
          created_at?: string
          updated_at?: string
          team_id?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: Team
        Insert: {
          name: string
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      flowcharts: {
        Row: Flowchart
        Insert: {
          user_id: string
          name: string
          team_id?: string | null
          content?: any
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          content?: any
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