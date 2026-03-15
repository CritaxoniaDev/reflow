import { z } from 'zod'
import { publicProcedure, protectedProcedure, router } from '../index'

export const postsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      // Fetch posts from Supabase
      return {
        posts: [
          { id: '1', title: 'First Post', content: 'Content', userId: '1' },
        ],
        total: 1,
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Fetch single post from Supabase
      return { id: input.id, title: 'Post', content: 'Content', userId: '1' }
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Insert post to Supabase
      return { id: '1', ...input, userId: 'user-id' }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Update post in Supabase
      return { id: input.id, title: 'Updated', content: 'Updated' }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Delete post from Supabase
      return { success: true, id: input.id }
    }),
})