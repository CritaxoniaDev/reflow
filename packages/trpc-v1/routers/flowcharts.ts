import { protectedProcedure, router } from '../index'
import { flowchartService, userService } from '@supabase/services'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const flowchartsRouter = router({
  createFlowchart: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }
      // Get user's current team
      const user = await userService.getUserById(ctx.user.id)
      return flowchartService.createFlowchart(ctx.user.id, input.name, user?.team_id || undefined)
    }),

  getFlowchartById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }
      return flowchartService.getFlowchartById(input.id, ctx.user.id)
    }),

  getUserFlowcharts: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User must be authenticated',
      })
    }
    return flowchartService.getUserFlowcharts(ctx.user.id)
  }),

  updateFlowchart: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(100).optional(),
      content: z.any().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }
      return flowchartService.updateFlowchart(input.id, ctx.user.id, {
        name: input.name,
        content: input.content,
      })
    }),

  deleteFlowchart: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }
      return flowchartService.deleteFlowchart(input.id, ctx.user.id)
    }),
})