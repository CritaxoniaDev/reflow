import type { CreateNextContextOptions } from '@trpc/server/adapters/next'

export async function createContext(opts?: CreateNextContextOptions) {
  const { req, res } = opts ?? {}

  return {
    req,
    res,
    // Add user from JWT, db connection, etc.
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>