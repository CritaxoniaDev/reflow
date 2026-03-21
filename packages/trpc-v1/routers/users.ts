import { z } from 'zod'
import { publicProcedure, router } from '../index'
import { userService } from '@supabase/index'
import { TRPCError } from '@trpc/server'
import { createAdminClient } from '@supabase/server'

// Create a protected procedure that requires authentication
const protectedProcedure = publicProcedure.use(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User must be authenticated',
    })
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      user: opts.ctx.user,
    },
  })
})

export const usersRouter = router({
  // Only checks username and sends OTP (no profile creation yet)
  register: publicProcedure
    .input(z.object({
      username: z.string().min(3).max(20),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      // Check if username exists
      const existingUsername = await userService.getUserByUsername(input.username)
      if (existingUsername) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username already taken',
        })
      }

      // Send OTP (this will create auth.users entry when user verifies OTP)
      try {
        await userService.initiateRegistration(input.email)
      } catch (err: any) {
        console.error('Failed to send OTP:', err)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send magic link. Please try again.',
        })
      }

      return {
        success: true,
        message: 'Check your email for the magic link!',
        email: input.email,
      }
    }),

  signIn: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const normalizedEmail = input.email.toLowerCase()

      // Check if user exists in database for login flow
      try {
        const existingUser = await userService.getUserByEmail(normalizedEmail)

        if (!existingUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Email not found. Please register first.',
          })
        }
      } catch (err: any) {
        if (err instanceof TRPCError) throw err
        console.error('Error checking user:', err)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to verify email. Please try again.',
        })
      }

      // Send magic link only if user exists
      try {
        await userService.signInWithOtp(normalizedEmail)
      } catch (err: any) {
        console.error('Failed to send OTP:', err)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send magic link. Please try again.',
        })
      }

      return {
        success: true,
        message: 'Magic link sent to your email',
        email: normalizedEmail,
      }
    }),

  // Verify OTP and create profile (all server-side)
  verifyAndCreateProfile: publicProcedure
    .input(z.object({
      email: z.string().email(),
      code: z.string(), // Not used - OTP already verified client-side
      username: z.string().min(3).max(20),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const normalizedEmail = input.email.toLowerCase()

        console.log('verifyAndCreateProfile: Creating profile for:', normalizedEmail)

        // Check if user is authenticated
        if (!ctx.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must verify your email first',
          })
        }

        // Check if profile already exists
        let user = await userService.getUserByEmail(normalizedEmail)

        if (!user) {
          // Create profile with the authenticated user's ID
          try {
            user = await userService.registerUserProfile(
              ctx.user.id,
              input.username,
              normalizedEmail
            )
            console.log('Profile created:', user)
          } catch (err: any) {
            console.error('Failed to create profile:', err)
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to create profile. Please try again.',
            })
          }
        }

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
        }
      } catch (err: any) {
        console.error('verifyAndCreateProfile error:', err)
        throw err instanceof TRPCError ? err : new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message || 'Verification failed',
        })
      }
    }),

  // Verify OTP for login
  verifyLogin: publicProcedure
    .input(z.object({
      email: z.string().email(),
      code: z.string(), // Not used - OTP already verified client-side
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const normalizedEmail = input.email.toLowerCase()

        console.log('verifyLogin: Getting profile for:', normalizedEmail)

        // Check if user is authenticated
        if (!ctx.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must verify your email first',
          })
        }

        // Get existing user profile
        const user = await userService.getUserByEmail(normalizedEmail)

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User profile not found. Please register first.',
          })
        }

        console.log('Login successful:', user.email)

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
        }
      } catch (err: any) {
        console.error('verifyLogin error:', err)
        throw err instanceof TRPCError ? err : new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message || 'Login verification failed',
        })
      }
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const { error } = await ctx.supabase.auth.signOut()
      if (error) throw error
      return { success: true, message: 'Signed out successfully' }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })
    }
  }),

  getCurrentUserWithTeam: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }

      try {
        const user = await userService.getUserById(ctx.user.id)

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          })
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          teamId: user.team_id,
          teamName: user.teams?.name || 'Personal',
        }
      } catch (error: any) {
        console.error('getCurrentUserWithTeam error:', error)  // ADD THIS
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch user info',  // INCLUDE ERROR MESSAGE
        })
      }
    }),

  // Get current authenticated user
  getCurrentUser: protectedProcedure
    .query(({ ctx }) => {
      return {
        id: ctx.user.id,
        email: ctx.user.email,
      }
    }),
})