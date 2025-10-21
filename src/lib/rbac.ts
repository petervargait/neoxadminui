import { RoleKey } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

export type Permission = string

export interface UserContext {
  userId: string
  role: RoleKey
  tenantId: string | null
  tenantName?: string
}

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(
  userContext: UserContext,
  permission: Permission,
  tenantId?: string
): Promise<boolean> {
  // Super admin has all permissions
  if (userContext.role === RoleKey.SUPER_ADMIN) {
    return true
  }

  // Get user's role permissions
  const rolePermissions = await prisma.rolePermission.findMany({
    where: {
      role: {
        key: userContext.role
      }
    },
    include: {
      permission: true
    }
  })

  const hasRolePermission = rolePermissions.some(
    rp => rp.permission.key === permission
  )

  if (hasRolePermission) {
    // For tenant-scoped users, check if they're accessing their own tenant
    if (userContext.tenantId && tenantId && userContext.tenantId !== tenantId) {
      return false
    }
    return true
  }

  // Check tenant-specific permission overrides
  if (userContext.tenantId && tenantId === userContext.tenantId) {
    const tenantPermissions = await prisma.tenantRolePermission.findMany({
      where: {
        tenantId: userContext.tenantId,
        role: {
          key: userContext.role
        }
      },
      include: {
        permission: true
      }
    })

    return tenantPermissions.some(tp => tp.permission.key === permission)
  }

  return false
}

/**
 * Get current user context from session
 */
export async function getCurrentUser(): Promise<UserContext | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }

  return {
    userId: session.user.id,
    role: session.user.role,
    tenantId: session.user.tenantId,
    tenantName: session.user.tenantName
  }
}

/**
 * Require authentication and return user context
 */
export async function requireAuth(): Promise<UserContext> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

/**
 * Require specific permission
 */
export async function requirePermission(
  permission: Permission,
  tenantId?: string
): Promise<UserContext> {
  const user = await requireAuth()
  
  const hasAccess = await hasPermission(user, permission, tenantId)
  
  if (!hasAccess) {
    throw new Error(`Permission denied: ${permission}`)
  }
  
  return user
}

/**
 * Check if user can access admin routes
 */
export function canAccessAdmin(role: RoleKey): boolean {
  return role === RoleKey.SUPER_ADMIN
}

/**
 * Check if user can access tenant routes
 */
export function canAccessTenant(role: RoleKey): boolean {
  return [
    RoleKey.TENANT_ADMIN,
    RoleKey.RECEPTION,
    RoleKey.OFFICE_MANAGER,
    RoleKey.SECURITY
  ].includes(role)
}

/**
 * Get allowed routes for a user role
 */
export function getAllowedRoutes(role: RoleKey): string[] {
  switch (role) {
    case RoleKey.SUPER_ADMIN:
      return ['/admin', '/admin/*']
    
    case RoleKey.TENANT_ADMIN:
      return ['/tenant', '/tenant/*']
    
    case RoleKey.RECEPTION:
    case RoleKey.OFFICE_MANAGER:
      return [
        '/tenant',
        '/tenant/invitations',
        '/tenant/users',
        '/tenant/parking'
      ]
    
    case RoleKey.SECURITY:
      return [
        '/tenant',
        '/tenant/users',
        '/tenant/invitations'
      ]
    
    default:
      return ['/']
  }
}

/**
 * Audit log helper
 */
export async function createAuditLog(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  diff?: any,
  tenantId?: string | null
) {
  await prisma.auditLog.create({
    data: {
      actorUserId: actorId,
      tenantId,
      action,
      targetType,
      targetId,
      diff: diff || {}
    }
  })
}