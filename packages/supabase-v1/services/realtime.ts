import { createBrowserClient } from '../client'
import type { RealtimeChannel } from '@supabase/realtime-js'

export const realtimeService = {
  subscribeToTeams(
    callback: (payload: any) => void
  ): RealtimeChannel {
    const supabase = createBrowserClient()

    return supabase
      .channel('public:teams')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
        },
        callback
      )
      .subscribe()
  },

  subscribeToUsers(
    callback: (payload: any) => void
  ): RealtimeChannel {
    const supabase = createBrowserClient()

    return supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
        },
        callback
      )
      .subscribe()
  },

  subscribeToTable(
    table: string,
    callback: (payload: any) => void,
    schema: string = 'public'
  ): RealtimeChannel {
    const supabase = createBrowserClient()

    return supabase
      .channel(`${schema}:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema,
          table,
        },
        callback
      )
      .subscribe()
  },

  unsubscribe(channel: RealtimeChannel) {
    return channel.unsubscribe()
  },
}