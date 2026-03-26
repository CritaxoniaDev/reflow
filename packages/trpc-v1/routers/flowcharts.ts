import { protectedProcedure, router } from '../index'
import { flowchartService, userService } from '@supabase/services'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const flowchartsRouter = router({
  createFlowchart: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      isTeam: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }

      try {
        let teamId: string | undefined

        if (input.isTeam) {
          const user = await userService.getUserById(ctx.user.id)
          if (!user?.team_id) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'You must be in a team to create team flowcharts',
            })
          }
          teamId = user.team_id
        }

        const flowchart = await flowchartService.createFlowchart(
          ctx.user.id,
          input.name,
          teamId
        )
        return flowchart
      } catch (error: any) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create flowchart',
        })
      }
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

  getUserFlowcharts: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }

      try {
        const flowcharts = await flowchartService.getUserFlowcharts(ctx.user.id)
        return flowcharts
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch flowcharts',
        })
      }
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

      try {
        const result = await flowchartService.updateFlowchart(input.id, ctx.user.id, {
          name: input.name,
          content: input.content,
        })
        console.log('Updated flowchart:', { id: input.id, name: input.name })
        return result
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error?.message || 'Failed to update flowchart',
        })
      }
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