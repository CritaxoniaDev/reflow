import { createBrowserClient } from '../client'
import type { RealtimeChannel } from '@supabase/realtime-js'
import { createAdminClient } from '../server'

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

  subscribeToFlowchartChanges(flowchartId: string, callback: (payload: any) => void) {
    const supabase = createAdminClient()

    const subscription = supabase
      .channel(`flowchart:${flowchartId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'flowcharts',
          filter: `id=eq.${flowchartId}`,
        },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return subscription
  },

  broadcastCursorPosition(flowchartId: string, userId: string, username: string, x: number, y: number, color: string) {
    const supabase = createAdminClient()

    return supabase
      .channel(`flowchart:${flowchartId}:cursors`)
      // @ts-ignore
      .send('broadcast', {
        event: 'cursor_move',
        payload: {
          userId,
          username,
          x,
          y,
          color,
        },
      })
  },

  subscribeToCursorPosition(flowchartId: string, callback: (payload: any) => void) {
    const supabase = createAdminClient()

    const subscription = supabase
      .channel(`flowchart:${flowchartId}:cursors`)
      .on('broadcast', { event: 'cursor_move' }, (payload) => {
        callback(payload.payload)
      })
      .subscribe()

    return subscription
  },

  broadcastFlowchartChanges(flowchartId: string, userId: string, username: string, changes: any) {
    const supabase = createAdminClient()

    console.log('[SERVICE] broadcastFlowchartChanges called:', {
      flowchartId,
      userId,
      username,
      type: changes.type,
      nodeId: changes.node?.id,
      nodeLabel: changes.node?.data?.label,
    })

    const channel = supabase
      .channel(`flowchart:${flowchartId}:changes`)
      .subscribe()

    return channel
      // @ts-ignore
      .send('broadcast', {
        event: 'flowchart_update',
        payload: {
          userId,
          username,
          ...changes,
        },
      })
      .then((response) => {
        console.log('[SERVICE] Broadcast sent successfully:', {
          type: changes.type,
          nodeId: changes.node?.id,
          nodeLabel: changes.node?.data?.label,
        })
        supabase.removeChannel(channel)
        return response
      })
      .catch((error) => {
        console.error('[SERVICE] Broadcast error:', error, {
          type: changes.type,
          nodeId: changes.node?.id,
        })
        supabase.removeChannel(channel)
        throw error
      })
  },

  subscribeToFlowchartLiveChanges(flowchartId: string, callback: (payload: any) => void) {
    const supabase = createAdminClient()

    console.log('[SERVICE] Subscribing to flowchart changes:', flowchartId)

    const subscription = supabase
      .channel(`flowchart:${flowchartId}:changes`)
      .on('broadcast', { event: 'flowchart_update' }, (payload) => {
        console.log('[SERVICE] Received broadcast:', {
          type: payload.payload?.type,
          nodeId: payload.payload?.node?.id,
          nodeLabel: payload.payload?.node?.data?.label,
          userId: payload.payload?.userId,
        })
        callback(payload.payload)
      })
      .subscribe((status) => {
        console.log('[SERVICE] Subscription status:', status)
      })

    return subscription
  },

  unsubscribe(channel: RealtimeChannel) {
    return channel.unsubscribe()
  },
}