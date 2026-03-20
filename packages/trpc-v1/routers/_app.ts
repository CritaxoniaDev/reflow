import { router } from '../index'
import { usersRouter } from './users'
import { postsRouter } from './posts'
import { teamsRouter } from './teams'
import { realtimeRouter } from './realtime'

export const appRouter = router({
  users: usersRouter,
  posts: postsRouter,
  teams: teamsRouter,
  realtime: realtimeRouter,
})

export type AppRouter = typeof appRouter