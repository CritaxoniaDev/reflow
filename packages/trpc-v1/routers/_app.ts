import { router } from '../index'
import { usersRouter } from './users'
import { postsRouter } from './posts'

export const appRouter = router({
  users: usersRouter,
  posts: postsRouter,
})

export type AppRouter = typeof appRouter