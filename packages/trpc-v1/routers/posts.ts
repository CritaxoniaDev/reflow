import { z } from 'zod'
import { publicProcedure, router } from '../index'

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
})

export const postsRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }))
    .query(async () => {
      // TODO: Fetch from Supabase
      return { posts: [], total: 0 }
    }),

  create: publicProcedure
    .input(postSchema)
    .mutation(async ({ input }) => {
      // TODO: Create in Supabase
      return input
    }),
})