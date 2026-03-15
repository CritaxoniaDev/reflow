import { z } from 'zod'
import { publicProcedure, router } from '../index'

export const usersRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Fetch user from Supabase
      return { id: input.id, name: 'User' }
    }),

  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      // Insert user to Supabase
      return { id: '1', ...input }
    }),
})