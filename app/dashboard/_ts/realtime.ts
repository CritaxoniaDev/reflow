import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { realtimeService } from '@supabase/services'

export const useSupabaseRealtime = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Subscribe to teams table changes
    const teamsChannel = realtimeService.subscribeToTeams((payload) => {
      console.log('Teams change received:', payload)

      if (payload.eventType === 'INSERT') {
        queryClient.invalidateQueries({ queryKey: ['teams'] })
      } else if (payload.eventType === 'UPDATE') {
        queryClient.invalidateQueries({ queryKey: ['teams', payload.new.id] })
      } else if (payload.eventType === 'DELETE') {
        queryClient.invalidateQueries({ queryKey: ['teams'] })
      }
    })

    // Subscribe to users table changes
    const usersChannel = realtimeService.subscribeToUsers((payload) => {
      console.log('Users change received:', payload)

      if (payload.eventType === 'UPDATE') {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.invalidateQueries({ queryKey: ['account'] })
      }
    })

    return () => {
      realtimeService.unsubscribe(teamsChannel)
      realtimeService.unsubscribe(usersChannel)
    }
  }, [queryClient])
}