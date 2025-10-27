'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types
export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'pending'
  profileId?: string
  tenantId?: string
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: string
  name: string
  domain: string
  contactEmail: string
  contactPhone?: string
  status: 'active' | 'inactive'
  modules: string[]
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  name: string
  description: string
  modules: string[]
  isGlobal: boolean
  tenantId?: string
  createdAt: string
}

export interface Badge {
  id: number
  userId?: string
  name: string
  email: string
  company: string
  department?: string
  cardType: string
  status: 'New' | 'Sent' | 'Downloaded' | 'Suspended'
  imei: string
  createdAt: string
}

export interface Invitation {
  id: string
  visitorName: string
  visitorEmail: string
  visitorCompany?: string
  hostId: string
  hostName: string
  visitDate: string
  visitTime: string
  purpose: string
  location: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  accessCode?: string
  createdAt: string
}

export interface ParkingSpace {
  id: string
  spaceNumber: string
  name?: string
  building: string
  location: string
  level?: string
  floor?: string
  status: 'available' | 'occupied' | 'reserved'
  isElectric?: boolean
  isDisabled?: boolean
  isSpecialNeed?: boolean
  isVIP?: boolean
  isReservedForVisitor?: boolean
  notes?: string
  tenantId?: string
  assignedTo?: string
  assignedToName?: string
  vehiclePlate?: string
  assignedDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface Locker {
  id: string
  lockerNumber: string
  name?: string
  building: string
  floor: string
  zone?: string
  type: 'permanent' | 'gym' | 'bike' | 'temporary' | 'storage'
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  tenantId?: string
  assignedTo?: string
  assignedToName?: string
  assignedDate?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface Ticket {
  id: string
  ticketNumber: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  createdBy: string
  createdByName: string
  assignedTo?: string
  assignedToName?: string
  tenantId?: string
  createdAt: string
  updatedAt: string
  comments?: Array<{ id: string; text: string; author: string; timestamp: string }>
}

export interface PolicyFile {
  name: string
  uploadDate: string
  fileData?: string // Base64 encoded file data
  fileType?: string
}

export interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  status: 'Success' | 'Failed'
  details?: string
}

export interface Task {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'tenant' | 'user' | 'badge' | 'invitation' | 'whitelabel' | 'profile' | 'policy'
  entityId: string
  entityName: string
  requestedBy: string
  requestedByName: string
  status: 'pending' | 'approved' | 'rejected'
  data: Record<string, unknown>
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  comments?: string
}

export interface WhiteLabelSettings {
  tenantId: string
  companyName: string
  logoData?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  updatedAt: string
}

export interface SystemSettings {
  tenantId: string // 'global' for global settings, or specific tenant ID
  emailNotifications: boolean
  autoApproveInvitations: boolean
  maintenanceMode: boolean
  sessionTimeout: number // in minutes
  require2FA: boolean
  backgroundImageData?: string // Base64 encoded background image
  workflowManagementEnabled: boolean // If true, all actions require approval
  updatedAt: string
}

interface GlobalState {
  users: User[]
  tenants: Tenant[]
  profiles: Profile[]
  badges: Badge[]
  invitations: Invitation[]
  parkingSpaces: ParkingSpace[]
  lockers: Locker[]
  tickets: Ticket[]
  policyFiles: Record<string, PolicyFile | null>
  auditLogs: AuditLog[]
  tasks: Task[]
  whiteLabelSettings: Record<string, WhiteLabelSettings>
  systemSettings: Record<string, SystemSettings>
  moduleStates: Record<string, boolean>
}

interface GlobalStateContextType extends GlobalState {
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => User
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => Tenant
  updateTenant: (id: string, updates: Partial<Tenant>) => void
  deleteTenant: (id: string) => void
  addProfile: (profile: Omit<Profile, 'id' | 'createdAt'>) => Profile
  updateProfile: (id: string, updates: Partial<Profile>) => void
  deleteProfile: (id: string) => void
  addBadge: (badge: Omit<Badge, 'id' | 'createdAt'>) => Badge
  updateBadge: (id: number, updates: Partial<Badge>) => void
  deleteBadge: (id: number) => void
  addInvitation: (invitation: Omit<Invitation, 'id' | 'createdAt'>) => Invitation
  updateInvitation: (id: string, updates: Partial<Invitation>) => void
  deleteInvitation: (id: string) => void
  addParkingSpace: (space: Omit<ParkingSpace, 'id'>) => ParkingSpace
  updateParkingSpace: (id: string, updates: Partial<ParkingSpace>) => void
  addLocker: (locker: Omit<Locker, 'id'>) => Locker
  updateLocker: (id: string, updates: Partial<Locker>) => void
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => Ticket
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  uploadPolicy: (policyName: string, file: PolicyFile) => void
  downloadPolicy: (policyName: string) => PolicyFile | null
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task
  approveTask: (taskId: string, reviewedBy: string) => void
  rejectTask: (taskId: string, reviewedBy: string, comments?: string) => void
  updateWhiteLabel: (tenantId: string, settings: Partial<WhiteLabelSettings>) => void
  getWhiteLabel: (tenantId: string) => WhiteLabelSettings | undefined
  updateSystemSettings: (tenantId: string, settings: Partial<SystemSettings>) => void
  getSystemSettings: (tenantId: string) => SystemSettings | undefined
  toggleModule: (moduleName: string) => void
  clearAllData: () => void
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined)

const STORAGE_KEY = 'neox_global_state'

const getInitialState = (): GlobalState => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsedState = JSON.parse(stored) as Partial<GlobalState>
        // Merge with defaults to ensure new fields exist
        return {
          ...parsedState,
          lockers: parsedState.lockers || [],
          systemSettings: parsedState.systemSettings || {
            'global': {
              tenantId: 'global',
              emailNotifications: true,
              autoApproveInvitations: true,
              maintenanceMode: false,
              sessionTimeout: 30,
              require2FA: true,
              workflowManagementEnabled: false,
              updatedAt: new Date().toISOString()
            }
          }
        } as GlobalState
      } catch (e) {
        console.error('Failed to parse stored state:', e)
      }
    }
  }

  return {
    users: [
      { id: 'usr_global_1', name: 'Admin User', email: 'admin@globaladmin.com', role: 'Admin', department: 'IT', status: 'active', profileId: 'prof1', tenantId: 'globaladmin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'usr_global_2', name: 'John Manager', email: 'john@globaladmin.com', role: 'Manager', department: 'Operations', status: 'active', profileId: 'prof2', tenantId: 'globaladmin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'usr_acme_1', name: 'Sarah Johnson', email: 'sarah@acme.com', role: 'Admin', department: 'HR', status: 'active', profileId: 'prof1', tenantId: 'acme', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'usr_techflow_1', name: 'Mike Chen', email: 'mike@techflow.com', role: 'Manager', department: 'Engineering', status: 'active', profileId: 'prof2', tenantId: 'techflow', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    tenants: [
      { id: 'globaladmin', name: 'Global Admin', domain: 'globaladmin.neox.com', contactEmail: 'admin@globaladmin.com', contactPhone: '+1-555-0100', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'Service Hub', 'Lockers', 'News', 'AI Assistant', 'Space Management', 'Private Delivery', 'Authentication', 'Reporting'], createdAt: '2024-01-01T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'mbank', name: 'M Bank', domain: 'mbank.neox.com', contactEmail: 'contact@mbank.com', contactPhone: '+1-555-0105', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Ticketing', 'Service Hub', 'Space Management', 'Authentication', 'Reporting'], createdAt: '2024-02-01T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'eassetmanager', name: 'E Asset Manager', domain: 'eassetmanager.neox.com', contactEmail: 'contact@eassetmanager.com', contactPhone: '+1-555-0106', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Ticketing', 'Space Management', 'AI Assistant', 'Authentication', 'Reporting'], createdAt: '2024-02-05T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'moil', name: 'M Oil', domain: 'moil.neox.com', contactEmail: 'contact@moil.com', contactPhone: '+1-555-0107', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'Service Hub', 'Authentication', 'Reporting'], createdAt: '2024-02-10T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'acme', name: 'ACME', domain: 'acme.neox.com', contactEmail: 'contact@acme.com', contactPhone: '+1-555-0108', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Ticketing', 'Service Hub', 'Space Management', 'Authentication', 'Reporting'], createdAt: '2024-01-15T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'techflow', name: 'TechFlow Industries', domain: 'techflow.neox.com', contactEmail: 'info@techflow.com', contactPhone: '+1-555-0102', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'News', 'Authentication', 'Reporting'], createdAt: '2024-01-10T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'globalsolutions', name: 'Global Solutions Ltd', domain: 'globalsolutions.neox.com', contactEmail: 'contact@globalsolutions.com', contactPhone: '+1-555-0103', status: 'active', modules: ['User Management', 'Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Authentication', 'Reporting'], createdAt: '2024-01-08T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'innovationlabs', name: 'Innovation Labs', domain: 'innovationlabs.neox.com', contactEmail: 'hello@innovationlabs.com', contactPhone: '+1-555-0104', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Ticketing', 'Space Management', 'AI Assistant', 'Authentication', 'Reporting'], createdAt: '2024-01-05T00:00:00.000Z', updatedAt: new Date().toISOString() },
    ],
    profiles: [
      { id: 'prof1', name: 'Full Access', description: 'Complete access to all system modules', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'Service Hub', 'Lockers', 'News', 'AI Assistant', 'Space Management', 'Private Delivery', 'Authentication', 'Reporting'], isGlobal: true, createdAt: new Date().toISOString() },
      { id: 'prof2', name: 'Limited Access', description: 'Access to core operational modules', modules: ['User Management', 'Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Space Management', 'Reporting'], isGlobal: true, createdAt: new Date().toISOString() },
      { id: 'prof3', name: 'Visitor Management Only', description: 'Limited to front desk and visitor operations', modules: ['Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Lockers', 'News'], isGlobal: true, createdAt: new Date().toISOString() },
    ],
    badges: [],
    invitations: [],
    parkingSpaces: [
      // Building A - Level 1 (20 spaces)
      { id: 'p1', spaceNumber: 'A-101', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p2', spaceNumber: 'A-102', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p3', spaceNumber: 'A-103', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p4', spaceNumber: 'A-104', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p5', spaceNumber: 'A-105', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p6', spaceNumber: 'A-106', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p7', spaceNumber: 'A-107', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p8', spaceNumber: 'A-108', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p9', spaceNumber: 'A-109', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p10', spaceNumber: 'A-110', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p11', spaceNumber: 'A-111', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p12', spaceNumber: 'A-112', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p13', spaceNumber: 'A-113', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p14', spaceNumber: 'A-114', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p15', spaceNumber: 'A-115', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p16', spaceNumber: 'A-116', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p17', spaceNumber: 'A-117', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p18', spaceNumber: 'A-118', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p19', spaceNumber: 'A-119', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      { id: 'p20', spaceNumber: 'A-120', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
      // Building A - Level 2 (20 spaces)
      { id: 'p21', spaceNumber: 'A-201', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p22', spaceNumber: 'A-202', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p23', spaceNumber: 'A-203', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p24', spaceNumber: 'A-204', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p25', spaceNumber: 'A-205', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p26', spaceNumber: 'A-206', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p27', spaceNumber: 'A-207', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p28', spaceNumber: 'A-208', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p29', spaceNumber: 'A-209', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p30', spaceNumber: 'A-210', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p31', spaceNumber: 'A-211', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p32', spaceNumber: 'A-212', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p33', spaceNumber: 'A-213', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p34', spaceNumber: 'A-214', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p35', spaceNumber: 'A-215', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p36', spaceNumber: 'A-216', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p37', spaceNumber: 'A-217', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p38', spaceNumber: 'A-218', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p39', spaceNumber: 'A-219', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      { id: 'p40', spaceNumber: 'A-220', building: 'Building A', location: 'Building A - Level 2', status: 'available' },
      // Building B - Level 1 (20 spaces)
      { id: 'p41', spaceNumber: 'B-101', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p42', spaceNumber: 'B-102', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p43', spaceNumber: 'B-103', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p44', spaceNumber: 'B-104', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p45', spaceNumber: 'B-105', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p46', spaceNumber: 'B-106', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p47', spaceNumber: 'B-107', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p48', spaceNumber: 'B-108', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p49', spaceNumber: 'B-109', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p50', spaceNumber: 'B-110', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p51', spaceNumber: 'B-111', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p52', spaceNumber: 'B-112', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p53', spaceNumber: 'B-113', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p54', spaceNumber: 'B-114', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p55', spaceNumber: 'B-115', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p56', spaceNumber: 'B-116', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p57', spaceNumber: 'B-117', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p58', spaceNumber: 'B-118', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p59', spaceNumber: 'B-119', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      { id: 'p60', spaceNumber: 'B-120', building: 'Building B', location: 'Building B - Level 1', status: 'available' },
      // Building B - Level 2 (20 spaces)
      { id: 'p61', spaceNumber: 'B-201', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p62', spaceNumber: 'B-202', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p63', spaceNumber: 'B-203', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p64', spaceNumber: 'B-204', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p65', spaceNumber: 'B-205', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p66', spaceNumber: 'B-206', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p67', spaceNumber: 'B-207', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p68', spaceNumber: 'B-208', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p69', spaceNumber: 'B-209', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p70', spaceNumber: 'B-210', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p71', spaceNumber: 'B-211', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p72', spaceNumber: 'B-212', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p73', spaceNumber: 'B-213', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p74', spaceNumber: 'B-214', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p75', spaceNumber: 'B-215', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p76', spaceNumber: 'B-216', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p77', spaceNumber: 'B-217', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p78', spaceNumber: 'B-218', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p79', spaceNumber: 'B-219', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      { id: 'p80', spaceNumber: 'B-220', building: 'Building B', location: 'Building B - Level 2', status: 'available' },
      // Building C - Underground (30 spaces)
      { id: 'p81', spaceNumber: 'C-U01', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p82', spaceNumber: 'C-U02', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p83', spaceNumber: 'C-U03', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p84', spaceNumber: 'C-U04', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p85', spaceNumber: 'C-U05', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p86', spaceNumber: 'C-U06', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p87', spaceNumber: 'C-U07', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p88', spaceNumber: 'C-U08', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p89', spaceNumber: 'C-U09', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p90', spaceNumber: 'C-U10', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p91', spaceNumber: 'C-U11', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p92', spaceNumber: 'C-U12', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p93', spaceNumber: 'C-U13', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p94', spaceNumber: 'C-U14', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p95', spaceNumber: 'C-U15', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p96', spaceNumber: 'C-U16', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p97', spaceNumber: 'C-U17', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p98', spaceNumber: 'C-U18', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p99', spaceNumber: 'C-U19', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p100', spaceNumber: 'C-U20', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p101', spaceNumber: 'C-U21', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p102', spaceNumber: 'C-U22', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p103', spaceNumber: 'C-U23', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p104', spaceNumber: 'C-U24', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p105', spaceNumber: 'C-U25', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p106', spaceNumber: 'C-U26', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p107', spaceNumber: 'C-U27', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p108', spaceNumber: 'C-U28', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p109', spaceNumber: 'C-U29', building: 'Building C', location: 'Building C - Underground', status: 'available' },
      { id: 'p110', spaceNumber: 'C-U30', building: 'Building C', location: 'Building C - Underground', status: 'available' },
    ],
    lockers: [],
    tickets: [],
    policyFiles: {
      'GDPR': null,
      'Terms & Conditions': null,
      'Passwords': null,
      'Installation and Onboarding Guide': null
    },
    auditLogs: [],
    tasks: [],
    whiteLabelSettings: {},
    systemSettings: {
      'global': {
        tenantId: 'global',
        emailNotifications: true,
        autoApproveInvitations: true,
        maintenanceMode: false,
        sessionTimeout: 30,
        require2FA: true,
        workflowManagementEnabled: false,
        updatedAt: new Date().toISOString()
      }
    },
    moduleStates: {
      'User Management': true,
      'Visitor Management': true,
      'Parking': false,
      'Emergency': true,
      'Map': true,
      'Restaurant': false,
      'Ticketing': true,
      'Service Hub': false,
      'Lockers': false,
      'News': true,
      'AI Assistant': false,
      'Space Management': true,
      'Private Delivery': false,
      'Authentication': true,
      'Reporting': true
    }
  }
}

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GlobalState>(getInitialState)

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state])

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }
    setState(prev => ({ ...prev, auditLogs: [newLog, ...prev.auditLogs] }))
  }

  const addUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, users: [...prev.users, newUser] }))
    addAuditLog({ user: 'system', action: `Created user "${newUser.name}"`, status: 'Success' })
    return newUser
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u)
    }))
    addAuditLog({ user: 'system', action: `Updated user (ID: ${id})`, status: 'Success' })
  }

  const deleteUser = (id: string) => {
    const user = state.users.find(u => u.id === id)
    setState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }))
    addAuditLog({ user: 'system', action: `Deleted user "${user?.name}" (ID: ${id})`, status: 'Success' })
  }

  const addTenant = (tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTenant: Tenant = {
      ...tenant,
      id: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, tenants: [...prev.tenants, newTenant] }))
    addAuditLog({ user: 'system', action: `Created tenant "${newTenant.name}"`, status: 'Success' })
    return newTenant
  }

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setState(prev => ({
      ...prev,
      tenants: prev.tenants.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
    }))
    addAuditLog({ user: 'system', action: `Updated tenant (ID: ${id})`, status: 'Success' })
  }

  const deleteTenant = (id: string) => {
    const tenant = state.tenants.find(t => t.id === id)
    setState(prev => ({ ...prev, tenants: prev.tenants.filter(t => t.id !== id) }))
    addAuditLog({ user: 'system', action: `Deleted tenant "${tenant?.name}" (ID: ${id})`, status: 'Success' })
  }

  const addProfile = (profile: Omit<Profile, 'id' | 'createdAt'>) => {
    const newProfile: Profile = {
      ...profile,
      id: `prof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, profiles: [...prev.profiles, newProfile] }))
    addAuditLog({ user: 'system', action: `Created profile "${newProfile.name}"`, status: 'Success' })
    return newProfile
  }

  const updateProfile = (id: string, updates: Partial<Profile>) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === id ? { ...p, ...updates } : p)
    }))
    addAuditLog({ user: 'system', action: `Updated profile (ID: ${id})`, status: 'Success' })
  }

  const deleteProfile = (id: string) => {
    const profile = state.profiles.find(p => p.id === id)
    setState(prev => ({ ...prev, profiles: prev.profiles.filter(p => p.id !== id) }))
    addAuditLog({ user: 'system', action: `Deleted profile "${profile?.name}" (ID: ${id})`, status: 'Success' })
  }

  const addBadge = (badge: Omit<Badge, 'id' | 'createdAt'>) => {
    const newBadge: Badge = {
      ...badge,
      id: state.badges.length > 0 ? Math.max(...state.badges.map(b => b.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, badges: [...prev.badges, newBadge] }))
    addAuditLog({ user: 'system', action: `Created digital badge for "${newBadge.name}"`, status: 'Success' })
    return newBadge
  }

  const updateBadge = (id: number, updates: Partial<Badge>) => {
    setState(prev => ({
      ...prev,
      badges: prev.badges.map(b => b.id === id ? { ...b, ...updates } : b)
    }))
    addAuditLog({ user: 'system', action: `Updated digital badge (ID: ${id})`, status: 'Success' })
  }

  const deleteBadge = (id: number) => {
    const badge = state.badges.find(b => b.id === id)
    setState(prev => ({ ...prev, badges: prev.badges.filter(b => b.id !== id) }))
    addAuditLog({ user: 'system', action: `Deleted digital badge for "${badge?.name}" (ID: ${id})`, status: 'Success' })
  }

  const addInvitation = (invitation: Omit<Invitation, 'id' | 'createdAt'>) => {
    const newInvitation: Invitation = {
      ...invitation,
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accessCode: `${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      createdAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, invitations: [...prev.invitations, newInvitation] }))
    addAuditLog({ user: 'system', action: `Created visitor invitation for "${newInvitation.visitorName}"`, status: 'Success' })
    return newInvitation
  }

  const updateInvitation = (id: string, updates: Partial<Invitation>) => {
    setState(prev => ({
      ...prev,
      invitations: prev.invitations.map(i => i.id === id ? { ...i, ...updates } : i)
    }))
    addAuditLog({ user: 'system', action: `Updated invitation (ID: ${id})`, status: 'Success' })
  }

  const deleteInvitation = (id: string) => {
    const invitation = state.invitations.find(i => i.id === id)
    setState(prev => ({ ...prev, invitations: prev.invitations.filter(i => i.id !== id) }))
    addAuditLog({ user: 'system', action: `Deleted invitation for "${invitation?.visitorName}" (ID: ${id})`, status: 'Success' })
  }

  const addParkingSpace = (space: Omit<ParkingSpace, 'id'>) => {
    const newSpace: ParkingSpace = {
      ...space,
      id: `park_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    setState(prev => ({ ...prev, parkingSpaces: [...prev.parkingSpaces, newSpace] }))
    if (space.assignedTo) {
      addAuditLog({ user: 'system', action: `Assigned parking space ${newSpace.spaceNumber} to ${space.assignedToName}`, status: 'Success' })
    }
    return newSpace
  }

  const updateParkingSpace = (id: string, updates: Partial<ParkingSpace>) => {
    setState(prev => ({
      ...prev,
      parkingSpaces: prev.parkingSpaces.map(p => p.id === id ? { ...p, ...updates } : p)
    }))
    if (updates.assignedTo) {
      const space = state.parkingSpaces.find(p => p.id === id)
      addAuditLog({ user: 'system', action: `Updated parking space ${space?.spaceNumber} assignment`, status: 'Success' })
    }
  }

  const addLocker = (locker: Omit<Locker, 'id'>) => {
    const newLocker: Locker = {
      ...locker,
      id: `locker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, lockers: [...prev.lockers, newLocker] }))
    addAuditLog({ user: 'system', action: `Created locker ${newLocker.lockerNumber} (${newLocker.type})`, status: 'Success' })
    return newLocker
  }

  const updateLocker = (id: string, updates: Partial<Locker>) => {
    setState(prev => ({
      ...prev,
      lockers: prev.lockers.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l)
    }))
    const locker = state.lockers.find(l => l.id === id)
    if (updates.assignedTo) {
      addAuditLog({ user: 'system', action: `Assigned locker ${locker?.lockerNumber} to ${updates.assignedToName}`, status: 'Success' })
    } else {
      addAuditLog({ user: 'system', action: `Updated locker ${locker?.lockerNumber}`, status: 'Success' })
    }
  }

  const addTicket = (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => {
    const ticketNumber = `TKT-${(state.tickets.length + 1).toString().padStart(5, '0')}`
    const newTicket: Ticket = {
      ...ticket,
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ticketNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, tickets: [...prev.tickets, newTicket] }))
    addAuditLog({ user: ticket.createdByName, action: `Created ticket ${ticketNumber}: "${ticket.title}"`, status: 'Success' })
    return newTicket
  }

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
    }))
    const ticket = state.tickets.find(t => t.id === id)
    addAuditLog({ user: 'system', action: `Updated ticket ${ticket?.ticketNumber}`, status: 'Success' })
  }

  const uploadPolicy = (policyName: string, file: PolicyFile) => {
    setState(prev => ({
      ...prev,
      policyFiles: { ...prev.policyFiles, [policyName]: file }
    }))
    addAuditLog({ user: 'system', action: `Uploaded policy document: "${policyName}"`, status: 'Success' })
  }

  const downloadPolicy = (policyName: string): PolicyFile | null => {
    return state.policyFiles[policyName] || null
  }

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }))
    addAuditLog({ user: task.requestedByName, action: `Created approval task for ${task.type} ${task.entity}: "${task.entityName}"`, status: 'Success' })
    return newTask
  }

  const approveTask = (taskId: string, reviewedBy: string) => {
    const task = state.tasks.find(t => t.id === taskId)
    if (!task) return

    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? {
        ...t,
        status: 'approved' as const,
        reviewedAt: new Date().toISOString(),
        reviewedBy
      } : t)
    }))
    addAuditLog({ user: reviewedBy, action: `Approved ${task.type} ${task.entity}: "${task.entityName}"`, status: 'Success' })
  }

  const rejectTask = (taskId: string, reviewedBy: string, comments?: string) => {
    const task = state.tasks.find(t => t.id === taskId)
    if (!task) return

    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? {
        ...t,
        status: 'rejected' as const,
        reviewedAt: new Date().toISOString(),
        reviewedBy,
        comments
      } : t)
    }))
    addAuditLog({ user: reviewedBy, action: `Rejected ${task.type} ${task.entity}: "${task.entityName}"`, status: 'Success' })
  }

  const updateWhiteLabel = (tenantId: string, settings: Partial<WhiteLabelSettings>) => {
    setState(prev => ({
      ...prev,
      whiteLabelSettings: {
        ...prev.whiteLabelSettings,
        [tenantId]: {
          ...(prev.whiteLabelSettings[tenantId] || { tenantId, companyName: '', primaryColor: '#d7bb91', secondaryColor: '#08122e', accentColor: '#3b82f6' }),
          ...settings,
          updatedAt: new Date().toISOString()
        }
      }
    }))
    addAuditLog({ user: 'system', action: `Updated white label settings for tenant ${tenantId}`, status: 'Success' })
  }

  const getWhiteLabel = (tenantId: string) => {
    return state.whiteLabelSettings[tenantId]
  }

  const updateSystemSettings = (tenantId: string, settings: Partial<SystemSettings>) => {
    setState(prev => ({
      ...prev,
      systemSettings: {
        ...prev.systemSettings,
        [tenantId]: {
          ...(prev.systemSettings[tenantId] || {
            tenantId,
            emailNotifications: true,
            autoApproveInvitations: true,
            maintenanceMode: false,
            sessionTimeout: 30,
            require2FA: true,
            workflowManagementEnabled: false
          }),
          ...settings,
          updatedAt: new Date().toISOString()
        }
      }
    }))
    addAuditLog({ user: 'system', action: `Updated system settings for ${tenantId === 'global' ? 'global' : 'tenant ' + tenantId}`, status: 'Success' })
  }

  const getSystemSettings = (tenantId: string) => {
    return state.systemSettings[tenantId]
  }

  const toggleModule = (moduleName: string) => {
    setState(prev => ({
      ...prev,
      moduleStates: {
        ...prev.moduleStates,
        [moduleName]: !prev.moduleStates[moduleName]
      }
    }))
    addAuditLog({ user: 'system', action: `Toggled module "${moduleName}"`, status: 'Success' })
  }

  const clearAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    // Reload from defaults by calling getInitialState after clearing storage
    window.location.reload()
  }

  const value: GlobalStateContextType = {
    ...state,
    addUser,
    updateUser,
    deleteUser,
    addTenant,
    updateTenant,
    deleteTenant,
    addProfile,
    updateProfile,
    deleteProfile,
    addBadge,
    updateBadge,
    deleteBadge,
    addInvitation,
    updateInvitation,
    deleteInvitation,
    addParkingSpace,
    updateParkingSpace,
    addLocker,
    updateLocker,
    addTicket,
    updateTicket,
    uploadPolicy,
    downloadPolicy,
    addAuditLog,
    addTask,
    approveTask,
    rejectTask,
    updateWhiteLabel,
    getWhiteLabel,
    updateSystemSettings,
    getSystemSettings,
    toggleModule,
    clearAllData
  }

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within GlobalStateProvider')
  }
  return context
}
