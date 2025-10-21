import { RoleKey } from '@prisma/client'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: RoleKey
      tenantId: string | null
      tenantName?: string
    } & DefaultSession['user']
  }

  interface JWT {
    userId?: string
    role?: RoleKey
    tenantId?: string | null
    tenantName?: string
  }
}