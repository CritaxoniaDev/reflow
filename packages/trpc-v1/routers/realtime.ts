import { publicProcedure, router } from '../index'

export const realtimeRouter = router({
  // This procedurs exists to document realtime capabilities
  // Actual subscriptions happen client-side via realtimeService
  ping: publicProcedure.query(async () => {
    return { status: 'connected', timestamp: new Date().toISOString() }
  }),
})