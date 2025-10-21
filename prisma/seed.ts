import { PrismaClient, RoleKey, TenantStatus, UserStatus, UserSource } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create roles
  const roles = [
    {
      key: RoleKey.SUPER_ADMIN,
      name: 'Super Admin',
      description: 'Global administrator with access to all tenants'
    },
    {
      key: RoleKey.TENANT_ADMIN,
      name: 'Tenant Admin',
      description: 'Administrator for a specific tenant'
    },
    {
      key: RoleKey.RECEPTION,
      name: 'Reception',
      description: 'Reception staff member'
    },
    {
      key: RoleKey.OFFICE_MANAGER,
      name: 'Office Manager',
      description: 'Office management role'
    },
    {
      key: RoleKey.SECURITY,
      name: 'Security',
      description: 'Security personnel'
    },
    {
      key: RoleKey.EMPLOYEE,
      name: 'Employee',
      description: 'Regular employee'
    },
    {
      key: RoleKey.VISITOR,
      name: 'Visitor',
      description: 'Guest visitor'
    }
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: {},
      create: role
    })
  }

  // Create permissions
  const permissions = [
    { key: 'tenant.create', description: 'Create new tenants' },
    { key: 'tenant.read', description: 'View tenant information' },
    { key: 'tenant.update', description: 'Update tenant information' },
    { key: 'tenant.delete', description: 'Delete tenants' },
    { key: 'tenant.suspend', description: 'Suspend tenants' },
    { key: 'tenant.backup', description: 'Create and restore tenant backups' },
    { key: 'tenant.gdpr_export', description: 'Export tenant data for GDPR' },
    
    { key: 'user.create', description: 'Create new users' },
    { key: 'user.read', description: 'View user information' },
    { key: 'user.update', description: 'Update user information' },
    { key: 'user.delete', description: 'Delete users' },
    { key: 'user.import', description: 'Import users from Excel' },
    { key: 'user.invite', description: 'Send user invitations' },
    
    { key: 'module.read', description: 'View modules' },
    { key: 'module.assign', description: 'Assign modules to tenants' },
    
    { key: 'permission.read', description: 'View permissions' },
    { key: 'permission.assign', description: 'Assign permissions to roles' },
    
    { key: 'whitelabel.update', description: 'Update white-label settings' },
    { key: 'whitelabel.read', description: 'View white-label settings' },
    
    { key: 'invitation.create', description: 'Create invitations' },
    { key: 'invitation.read', description: 'View invitations' },
    { key: 'invitation.resend', description: 'Resend invitations' },
    { key: 'invitation.cancel', description: 'Cancel invitations' },
    
    { key: 'email_template.create', description: 'Create email templates' },
    { key: 'email_template.read', description: 'View email templates' },
    { key: 'email_template.update', description: 'Update email templates' },
    { key: 'email_template.delete', description: 'Delete email templates' },
    
    { key: 'parking.manage', description: 'Manage parking settings' },
    { key: 'settings.read', description: 'View tenant settings' },
    { key: 'settings.update', description: 'Update tenant settings' },
    
    { key: 'report.read', description: 'View reports' },
    { key: 'report.create', description: 'Create custom reports' },
    
    { key: 'audit.read', description: 'View audit logs' }
  ]

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {},
      create: permission
    })
  }

  // Create role permissions
  const rolePermissions = [
    // SUPER_ADMIN - all permissions
    ...permissions.map(p => ({ roleKey: RoleKey.SUPER_ADMIN, permissionKey: p.key })),
    
    // TENANT_ADMIN - tenant-scoped permissions
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'user.create' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'user.read' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'user.update' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'user.delete' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'user.import' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'user.invite' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'module.read' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'permission.read' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'invitation.create' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'invitation.read' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'invitation.resend' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'invitation.cancel' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'email_template.create' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'email_template.read' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'email_template.update' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'parking.manage' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'settings.read' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'settings.update' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'report.read' },
    { roleKey: RoleKey.TENANT_ADMIN, permissionKey: 'audit.read' },
    
    // RECEPTION - basic operations
    { roleKey: RoleKey.RECEPTION, permissionKey: 'user.read' },
    { roleKey: RoleKey.RECEPTION, permissionKey: 'invitation.create' },
    { roleKey: RoleKey.RECEPTION, permissionKey: 'invitation.read' },
    { roleKey: RoleKey.RECEPTION, permissionKey: 'invitation.resend' },
    { roleKey: RoleKey.RECEPTION, permissionKey: 'parking.manage' },
    
    // OFFICE_MANAGER - extended operations
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'user.create' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'user.read' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'user.update' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'user.invite' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'invitation.create' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'invitation.read' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'invitation.resend' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'invitation.cancel' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'email_template.read' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'parking.manage' },
    { roleKey: RoleKey.OFFICE_MANAGER, permissionKey: 'report.read' }
  ]

  for (const rp of rolePermissions) {
    const role = await prisma.role.findUnique({ where: { key: rp.roleKey } })
    const permission = await prisma.permission.findUnique({ where: { key: rp.permissionKey } })
    
    if (role && permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id
        }
      })
    }
  }

  // Create modules
  const modules = [
    {
      key: 'visitor_management',
      name: 'Visitor Management',
      description: 'Complete visitor registration and management system',
      isEnabledByDefault: true
    },
    {
      key: 'access_control',
      name: 'Access Control',
      description: 'Digital access control and security management',
      isEnabledByDefault: false
    },
    {
      key: 'meeting_rooms',
      name: 'Meeting Room Booking',
      description: 'Room reservation and scheduling system',
      isEnabledByDefault: false
    },
    {
      key: 'parking_management',
      name: 'Parking Management',
      description: 'Parking space allocation and management',
      isEnabledByDefault: false
    },
    {
      key: 'asset_tracking',
      name: 'Asset Tracking',
      description: 'Track and manage company assets',
      isEnabledByDefault: false
    },
    {
      key: 'compliance_reporting',
      name: 'Compliance Reporting',
      description: 'Generate compliance and audit reports',
      isEnabledByDefault: false
    }
  ]

  for (const module of modules) {
    await prisma.module.upsert({
      where: { key: module.key },
      update: {},
      create: module
    })
  }

  // Create demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { primaryDomain: 'demo.neox.hu' },
    update: {},
    create: {
      name: 'Demo Tenant',
      primaryDomain: 'demo.neox.hu',
      status: TenantStatus.ACTIVE,
      locale: 'EN',
      settings: {
        timeZone: 'Europe/Budapest',
        language: 'en',
        features: {
          parkingManagement: true,
          visitorManagement: true
        }
      }
    }
  })

  // Create tenant theme for demo tenant
  await prisma.tenantTheme.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      primaryColor: '#D7BB91',
      secondaryColor: '#08122E',
      emailHeaderHtml: '<div style="background: #08122E; color: #D7BB91; padding: 20px; text-align: center;"><h1>NEOX INFINITY</h1></div>',
      emailFooterHtml: '<div style="background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px;">Powered by NEOX Infinity</div>'
    }
  })

  // Create tenant settings for demo tenant
  await prisma.tenantSettings.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      parkingEnabled: true,
      mdmEnabled: false,
      ssoEnabled: false,
      autoNotifyHost: true
    }
  })

  // Add all modules to demo tenant
  const allModules = await prisma.module.findMany()
  for (const module of allModules) {
    await prisma.tenantModule.upsert({
      where: {
        tenantId_moduleId: {
          tenantId: demoTenant.id,
          moduleId: module.id
        }
      },
      update: {},
      create: {
        tenantId: demoTenant.id,
        moduleId: module.id,
        purchased: module.isEnabledByDefault
      }
    })
  }

  // Get roles
  const superAdminRole = await prisma.role.findUnique({ where: { key: RoleKey.SUPER_ADMIN } })
  const tenantAdminRole = await prisma.role.findUnique({ where: { key: RoleKey.TENANT_ADMIN } })

  if (!superAdminRole || !tenantAdminRole) {
    throw new Error('Roles not found')
  }

  // Create super admin user
  await prisma.user.upsert({
    where: { email: 'admin@neox.hu' },
    update: {},
    create: {
      email: 'admin@neox.hu',
      name: 'NEOX Super Admin',
      status: UserStatus.ACTIVE,
      roleId: superAdminRole.id,
      source: UserSource.LOCAL,
      tenantId: null // Super admin has no tenant
    }
  })

  // Create demo tenant admin
  await prisma.user.upsert({
    where: { email: 'demo@neox.hu' },
    update: {},
    create: {
      email: 'demo@neox.hu',
      name: 'Demo Tenant Admin',
      status: UserStatus.ACTIVE,
      roleId: tenantAdminRole.id,
      source: UserSource.LOCAL,
      tenantId: demoTenant.id
    }
  })

  // Create default email template for demo tenant
  await prisma.emailTemplate.upsert({
    where: {
      tenantId_name_version: {
        tenantId: demoTenant.id,
        name: 'visitor_invitation',
        version: 1
      }
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      name: 'visitor_invitation',
      subject: 'Welcome to {{tenant_name}} - Your Visit Invitation',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #08122E; color: #D7BB91; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { background: #D7BB91; color: #08122E; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            .footer { background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>NEOX INFINITY</h1>
          </div>
          <div class="content">
            <h2>Hello {{name}},</h2>
            <p>You have been invited to visit <strong>{{tenant_name}}</strong> on <strong>{{date}}</strong>.</p>
            <p>Your host is: <strong>{{host}}</strong></p>
            <p>Please click the link below to confirm your visit:</p>
            <a href="{{deep_link}}" class="button">Confirm Visit</a>
            <p>If you have any questions, please contact your host directly.</p>
            <p>Best regards,<br>The {{tenant_name}} Team</p>
          </div>
          <div class="footer">
            <p>Powered by NEOX Infinity</p>
          </div>
        </body>
        </html>
      `,
      textContent: `
        Hello {{name}},
        
        You have been invited to visit {{tenant_name}} on {{date}}.
        Your host is: {{host}}
        
        Please visit the following link to confirm your visit:
        {{deep_link}}
        
        If you have any questions, please contact your host directly.
        
        Best regards,
        The {{tenant_name}} Team
        
        Powered by NEOX Infinity
      `,
      variables: ['name', 'email', 'host', 'date', 'deep_link', 'tenant_name'],
      version: 1,
      isActive: true,
      createdBy: 'demo@neox.hu'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Super Admin: admin@neox.hu')
  console.log('👤 Demo Tenant Admin: demo@neox.hu')
  console.log('🏢 Demo Tenant: demo.neox.hu')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })