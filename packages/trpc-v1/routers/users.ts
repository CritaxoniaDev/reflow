import { z } from 'zod'
import { publicProcedure, router } from '../index'
import { userService } from '@supabase/index'

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
})

export const usersRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      // Check if username exists
      const existingUsername = await userService.getUserByUsername(input.username)
      if (existingUsername) {
        throw new Error('Username already taken')
      }

      // Check if email exists
      const existingEmail = await userService.getUserByEmail(input.email)
      if (existingEmail) {
        throw new Error('Email already registered')
      }

      // Create user profile in the database
      try {
        await userService.registerUserProfile(input.username, input.email)
      } catch (err: any) {
        console.error('Failed to create user profile:', err)
        throw new Error('Failed to create account. Please try again.')
      }

      return {
        success: true,
        message: 'Account created. Check your email for the magic link!',
        email: input.email,
      }
    }),

  verifySession: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        const normalizedEmail = input.email.toLowerCase()

        // Get user to confirm they exist
        const user = await userService.getUserByEmail(normalizedEmail)

        if (!user) {
          console.error(`User not found for email: ${normalizedEmail}`)
          throw new Error('User not found. Please register first.')
        }

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          }
        }
      } catch (err: any) {
        console.error('verifySession error:', err.message)
        throw err
      }
    }),
})