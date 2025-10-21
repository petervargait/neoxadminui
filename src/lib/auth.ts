import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { prisma } from '@/lib/prisma'
import { RoleKey } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: 'openid email profile User.Read'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        // First-time login, fetch user from database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: {
            role: true,
            tenant: true
          }
        })

        if (dbUser) {
          token.userId = dbUser.id
          token.role = dbUser.role.key
          token.tenantId = dbUser.tenantId
          token.tenantName = dbUser.tenant?.name
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.role = token.role as RoleKey
        session.user.tenantId = token.tenantId as string | null
        session.user.tenantName = token.tenantName as string | undefined
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false
      }

      // Check if user exists in our database
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
      })

      if (!dbUser) {
        // Auto-create user if they don't exist (for Entra ID users)
        // This could be customized based on your requirements
        console.log(`New user attempting to sign in: ${user.email}`)
        return '/unauthorized' // Redirect to unauthorized page
      }

      // Update last login
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { lastLoginAt: new Date() }
      })

      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  events: {
    async signIn({ user, account, profile }) {
      // Log sign-in event
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

        if (dbUser) {
          await prisma.auditLog.create({
            data: {
              actorUserId: dbUser.id,
              tenantId: dbUser.tenantId,
              action: 'USER_SIGNED_IN',
              targetType: 'USER',
              targetId: dbUser.id,
              diff: {
                provider: account?.provider,
                timestamp: new Date().toISOString()
              }
            }
          })
        }
      }
    }
  }
}