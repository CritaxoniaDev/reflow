import { router } from '../index'
import { usersRouter } from './users'
import { postsRouter } from './posts'
import { teamsRouter } from './teams'
import { realtimeRouter } from './realtime'
import { flowchartsRouter } from './flowcharts'

export const appRouter = router({
  users: usersRouter,
  posts: postsRouter,
  teams: teamsRouter,
  realtime: realtimeRouter,
  flowcharts: flowchartsRouter,
})

export type AppRouter = typeof appRouter