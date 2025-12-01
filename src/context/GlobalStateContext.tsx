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

export interface BadgeSwipe {
  id: string
  badgeId: number
  userId?: string
  userName: string
  location: string
  accessPoint: string
  timestamp: string
  tenantId: string
}

export interface ParkingBooking {
  id: string
  spaceId: string
  spaceNumber: string
  userId: string
  userName: string
  vehiclePlate: string
  bookingDate: string
  startTime: string
  endTime: string
  status: 'active' | 'completed' | 'no-show' | 'cancelled'
  tenantId: string
  createdAt: string
}

export interface LockerUsage {
  id: string
  lockerId: string
  lockerNumber: string
  userId: string
  userName: string
  usageDate: string
  opened: boolean
  duration: number // in minutes
  tenantId: string
  timestamp: string
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

export interface Space {
  id: string
  spaceNumber: string
  name?: string
  building: string
  floor: string
  location?: string
  zone?: string
  type: 'desk' | 'office' | 'meeting-room' | 'conference-room' | 'social-hub'
  capacity?: number
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

export interface GradientStop {
  id: string
  color: string
  alpha: number
  position: number
}

export interface ColorConfig {
  type: 'solid' | 'gradient'
  solid?: {
    color: string
    alpha: number
  }
  gradient?: {
    type: 'linear' | 'radial' | 'conic'
    angle?: number
    stops: GradientStop[]
  }
}

export interface FontFamily {
  id: string
  name: string
  category: 'system' | 'google'
  fallback: string
  weights: number[]
  googleFontUrl?: string
}

export interface WhiteLabelSettings {
  tenantId: string
  companyName: string
  logoData?: string
  // Support both old (string) and new (ColorConfig) formats for backward compatibility
  primaryColor: string | ColorConfig
  secondaryColor: string | ColorConfig
  accentColor?: string // Keep for old data
  fontFamily?: FontFamily
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

export interface BuildingFloor {
  floorNumber: number // Negative for basements, positive for floors above ground
  floorLabel: string // e.g., "B4", "Ground", "1", "21"
  zones: string[] // e.g., ["East Wing", "West Wing", "Social Area"]
}

export interface Building {
  id: string
  name: string
  tenantId: string
  basementLevels: number // Number of basement levels (e.g., 4 means -4 to -1)
  topFloor: number // Highest floor number (e.g., 21)
  floors: BuildingFloor[] // Array of all floors with their zones
  createdAt: string
  updatedAt: string
}

interface GlobalState {
  users: User[]
  tenants: Tenant[]
  profiles: Profile[]
  badges: Badge[]
  badgeSwipes: BadgeSwipe[]
  invitations: Invitation[]
  parkingSpaces: ParkingSpace[]
  parkingBookings: ParkingBooking[]
  lockers: Locker[]
  lockerUsages: LockerUsage[]
  spaces: Space[]
  buildings: Building[]
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
  addSpace: (space: Omit<Space, 'id'>) => Space
  updateSpace: (id: string, updates: Partial<Space>) => void
  addBuilding: (building: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => Building
  updateBuilding: (id: string, updates: Partial<Building>) => void
  deleteBuilding: (id: string) => void
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
  resetDashboardData: () => void
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
          spaces: parsedState.spaces || [],
          buildings: parsedState.buildings || [],
          badgeSwipes: parsedState.badgeSwipes || [],
          parkingBookings: parsedState.parkingBookings || [],
          lockerUsages: parsedState.lockerUsages || [],
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
      { id: 'usr_acme_2', name: 'David Martinez', email: 'david@acme.com', role: 'Manager', department: 'Sales', status: 'active', profileId: 'prof2', tenantId: 'acme', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'usr_acme_3', name: 'Emily Chen', email: 'emily@acme.com', role: 'Employee', department: 'Marketing', status: 'active', profileId: 'prof3', tenantId: 'acme', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'usr_acme_4', name: 'Robert Wilson', email: 'robert@acme.com', role: 'Manager', department: 'IT', status: 'active', profileId: 'prof2', tenantId: 'acme', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'usr_acme_5', name: 'Lisa Anderson', email: 'lisa@acme.com', role: 'Employee', department: 'Operations', status: 'active', profileId: 'prof3', tenantId: 'acme', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'usr_techflow_1', name: 'Mike Chen', email: 'mike@techflow.com', role: 'Manager', department: 'Engineering', status: 'active', profileId: 'prof2', tenantId: 'techflow', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    tenants: [
      { id: 'globaladmin', name: 'Global Admin', domain: 'globaladmin.neox.com', contactEmail: 'admin@globaladmin.com', contactPhone: '+1-555-0100', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'Service Hub', 'Lockers', 'News', 'AI Assistant', 'Space Management', 'Private Delivery', 'Building Automation', 'Smart Sensors', 'Access Management', 'Authentication', 'Reporting'], createdAt: '2024-01-01T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'mbank', name: 'M Bank', domain: 'mbank.neox.com', contactEmail: 'contact@mbank.com', contactPhone: '+1-555-0105', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Ticketing', 'Service Hub', 'Space Management', 'Building Automation', 'Smart Sensors', 'Access Management', 'Authentication', 'Reporting'], createdAt: '2024-02-01T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'eassetmanager', name: 'E Asset Manager', domain: 'eassetmanager.neox.com', contactEmail: 'contact@eassetmanager.com', contactPhone: '+1-555-0106', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Ticketing', 'Space Management', 'AI Assistant', 'Building Automation', 'Smart Sensors', 'Access Management', 'Authentication', 'Reporting'], createdAt: '2024-02-05T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'moil', name: 'M Oil', domain: 'moil.neox.com', contactEmail: 'contact@moil.com', contactPhone: '+1-555-0107', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'Service Hub', 'Building Automation', 'Smart Sensors', 'Access Management', 'Authentication', 'Reporting'], createdAt: '2024-02-10T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'acme', name: 'ACME', domain: 'acme.neox.com', contactEmail: 'contact@acme.com', contactPhone: '+1-555-0108', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Ticketing', 'Service Hub', 'Lockers', 'Space Management', 'Building Automation', 'Smart Sensors', 'Access Management', 'Authentication', 'Reporting'], createdAt: '2024-01-15T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'techflow', name: 'TechFlow Industries', domain: 'techflow.neox.com', contactEmail: 'info@techflow.com', contactPhone: '+1-555-0102', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'News', 'Building Automation', 'Smart Sensors', 'Access Management', 'Authentication', 'Reporting'], createdAt: '2024-01-10T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'globalsolutions', name: 'Global Solutions Ltd', domain: 'globalsolutions.neox.com', contactEmail: 'contact@globalsolutions.com', contactPhone: '+1-555-0103', status: 'active', modules: ['User Management', 'Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Building Automation', 'Smart Sensors', 'Access Management', 'Authentication', 'Reporting'], createdAt: '2024-01-08T00:00:00.000Z', updatedAt: new Date().toISOString() },
      { id: 'innovationlabs', name: 'Innovation Labs', domain: 'innovationlabs.neox.com', contactEmail: 'hello@innovationlabs.com', contactPhone: '+1-555-0104', status: 'active', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Ticketing', 'Space Management', 'AI Assistant', 'Building Automation', 'Smart Sensors', 'Access Management', 'Authentication', 'Reporting'], createdAt: '2024-01-05T00:00:00.000Z', updatedAt: new Date().toISOString() },
    ],
    profiles: [
      { id: 'prof1', name: 'Full Access', description: 'Complete access to all system modules', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'Service Hub', 'Lockers', 'News', 'AI Assistant', 'Space Management', 'Private Delivery', 'Building Automation', 'Smart Sensors', 'Access Management', 'Authentication', 'Reporting'], isGlobal: true, createdAt: new Date().toISOString() },
      { id: 'prof2', name: 'Limited Access', description: 'Access to core operational modules', modules: ['User Management', 'Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Space Management', 'Reporting'], isGlobal: true, createdAt: new Date().toISOString() },
      { id: 'prof3', name: 'Visitor Management Only', description: 'Limited to front desk and visitor operations', modules: ['Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Lockers', 'News'], isGlobal: true, createdAt: new Date().toISOString() },
    ],
    badges: [
      // ACME tenant badges
      { id: 1, userId: 'usr_acme_1', name: 'Sarah Johnson', email: 'sarah@acme.com', company: 'ACME', department: 'HR', cardType: 'Employee', status: 'Downloaded', imei: 'IMEI001', createdAt: '2024-11-15T08:00:00.000Z' },
      { id: 2, userId: 'usr_acme_2', name: 'David Martinez', email: 'david@acme.com', company: 'ACME', department: 'Sales', cardType: 'Employee', status: 'Downloaded', imei: 'IMEI002', createdAt: '2024-11-16T09:00:00.000Z' },
      { id: 3, userId: 'usr_acme_3', name: 'Emily Chen', email: 'emily@acme.com', company: 'ACME', department: 'Marketing', cardType: 'Employee', status: 'New', imei: 'IMEI003', createdAt: '2024-11-28T10:00:00.000Z' },
      { id: 4, userId: 'usr_acme_4', name: 'Robert Wilson', email: 'robert@acme.com', company: 'ACME', department: 'IT', cardType: 'Manager', status: 'Sent', imei: 'IMEI004', createdAt: '2024-11-20T11:00:00.000Z' },
      { id: 5, userId: 'usr_acme_5', name: 'Lisa Anderson', email: 'lisa@acme.com', company: 'ACME', department: 'Operations', cardType: 'Employee', status: 'Suspended', imei: 'IMEI005', createdAt: '2024-10-01T08:30:00.000Z' },
      { id: 6, name: 'James Thompson', email: 'james@acme.com', company: 'ACME', department: 'Finance', cardType: 'Employee', status: 'Downloaded', imei: 'IMEI006', createdAt: '2024-11-10T09:00:00.000Z' },
      { id: 7, name: 'Maria Garcia', email: 'maria@acme.com', company: 'ACME', department: 'HR', cardType: 'Visitor', status: 'Sent', imei: 'IMEI007', createdAt: '2024-11-25T14:00:00.000Z' },
      { id: 8, name: 'Chris Lee', email: 'chris@acme.com', company: 'ACME', department: 'Sales', cardType: 'Contractor', status: 'New', imei: 'IMEI008', createdAt: '2024-11-29T15:00:00.000Z' },
    ],
    invitations: [
      // ACME tenant - Recent invitations with various statuses
      { id: 'inv1', visitorName: 'Alex Rivera', visitorEmail: 'alex@techcorp.com', visitorCompany: 'TechCorp', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-11-28', visitTime: '10:00', purpose: 'Business Meeting', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1001', createdAt: '2024-11-27T09:00:00.000Z' },
      { id: 'inv2', visitorName: 'Jessica Wong', visitorEmail: 'jessica@innovate.com', visitorCompany: 'Innovate Solutions', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-11-28', visitTime: '14:00', purpose: 'Sales Presentation', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1002', createdAt: '2024-11-27T10:00:00.000Z' },
      { id: 'inv3', visitorName: 'Michael Brown', visitorEmail: 'mbrown@consulting.com', visitorCompany: 'Brown Consulting', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-11-29', visitTime: '09:30', purpose: 'Consulting Session', location: 'HQ - Building B', status: 'approved', accessCode: 'AC1003', createdAt: '2024-11-28T08:00:00.000Z' },
      { id: 'inv4', visitorName: 'Sophia Patel', visitorEmail: 'spatel@partners.com', visitorCompany: 'Partners Inc', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-11-29', visitTime: '11:00', purpose: 'Partnership Discussion', location: 'HQ - Building A', status: 'approved', accessCode: 'AC1004', createdAt: '2024-11-28T09:00:00.000Z' },
      { id: 'inv5', visitorName: 'Daniel Kim', visitorEmail: 'dkim@startup.io', visitorCompany: 'Startup Labs', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-11-30', visitTime: '15:00', purpose: 'Technical Review', location: 'HQ - Building C', status: 'pending', accessCode: 'AC1005', createdAt: '2024-11-28T11:00:00.000Z' },
      { id: 'inv6', visitorName: 'Emma Taylor', visitorEmail: 'etaylor@design.com', visitorCompany: 'Design Co', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-12-01', visitTime: '10:00', purpose: 'Design Review', location: 'HQ - Building A', status: 'pending', accessCode: 'AC1006', createdAt: '2024-11-29T08:00:00.000Z' },
      { id: 'inv7', visitorName: 'Oliver Zhang', visitorEmail: 'ozhang@manufacturing.com', visitorCompany: 'Manufacturing Plus', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-12-02', visitTime: '13:00', purpose: 'Factory Tour', location: 'HQ - Building B', status: 'pending', accessCode: 'AC1007', createdAt: '2024-11-29T09:00:00.000Z' },
      { id: 'inv8', visitorName: 'Isabella Lopez', visitorEmail: 'ilopez@finance.com', visitorCompany: 'Finance Corp', hostId: 'usr_acme_5', hostName: 'Lisa Anderson', visitDate: '2024-11-27', visitTime: '09:00', purpose: 'Financial Audit', location: 'HQ - Building A', status: 'pending', accessCode: 'AC1008', createdAt: '2024-11-26T10:00:00.000Z' },
      { id: 'inv9', visitorName: 'Noah Johnson', visitorEmail: 'noah@logistics.com', visitorCompany: 'Logistics Plus', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-11-25', visitTime: '14:30', purpose: 'Supply Chain Meeting', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1009', createdAt: '2024-11-24T08:00:00.000Z' },
      { id: 'inv10', visitorName: 'Ava Martinez', visitorEmail: 'ava@research.org', visitorCompany: 'Research Institute', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-11-26', visitTime: '11:00', purpose: 'Research Collaboration', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1010', createdAt: '2024-11-25T09:00:00.000Z' },
      { id: 'inv11', visitorName: 'Liam Chen', visitorEmail: 'lchen@security.com', visitorCompany: 'Security Systems', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-11-24', visitTime: '10:00', purpose: 'Security Assessment', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1011', createdAt: '2024-11-23T08:00:00.000Z' },
      { id: 'inv12', visitorName: 'Mia Wang', visitorEmail: 'mwang@legal.com', visitorCompany: 'Legal Partners', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-11-23', visitTime: '16:00', purpose: 'Legal Consultation', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1012', createdAt: '2024-11-22T09:00:00.000Z' },
      { id: 'inv13', visitorName: 'Ethan White', visitorEmail: 'ewhite@marketing.com', visitorCompany: 'Marketing Agency', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-11-22', visitTime: '12:00', purpose: 'Marketing Campaign', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1013', createdAt: '2024-11-21T08:00:00.000Z' },
      { id: 'inv14', visitorName: 'Charlotte Davis', visitorEmail: 'cdavis@hr.com', visitorCompany: 'HR Solutions', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-11-21', visitTime: '09:30', purpose: 'Recruitment Drive', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1014', createdAt: '2024-11-20T08:00:00.000Z' },
      { id: 'inv15', visitorName: 'James Anderson', visitorEmail: 'janderson@training.com', visitorCompany: 'Training Corp', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-11-20', visitTime: '14:00', purpose: 'Training Session', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1015', createdAt: '2024-11-19T08:00:00.000Z' },
      { id: 'inv16', visitorName: 'Amelia Brown', visitorEmail: 'abrown@insurance.com', visitorCompany: 'Insurance Co', hostId: 'usr_acme_5', hostName: 'Lisa Anderson', visitDate: '2024-11-19', visitTime: '10:30', purpose: 'Insurance Review', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1016', createdAt: '2024-11-18T08:00:00.000Z' },
      { id: 'inv17', visitorName: 'Benjamin Lee', visitorEmail: 'blee@realestate.com', visitorCompany: 'Real Estate Partners', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-11-18', visitTime: '15:00', purpose: 'Property Discussion', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1017', createdAt: '2024-11-17T08:00:00.000Z' },
      { id: 'inv18', visitorName: 'Harper Wilson', visitorEmail: 'hwilson@architecture.com', visitorCompany: 'Architecture Firm', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-11-17', visitTime: '11:00', purpose: 'Building Plans', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1018', createdAt: '2024-11-16T08:00:00.000Z' },
      { id: 'inv19', visitorName: 'Lucas Garcia', visitorEmail: 'lgarcia@catering.com', visitorCompany: 'Catering Services', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-11-16', visitTime: '13:30', purpose: 'Event Catering', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1019', createdAt: '2024-11-15T08:00:00.000Z' },
      { id: 'inv20', visitorName: 'Evelyn Martinez', visitorEmail: 'emartinez@cleaning.com', visitorCompany: 'Cleaning Corp', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-11-15', visitTime: '08:00', purpose: 'Facility Inspection', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1020', createdAt: '2024-11-14T08:00:00.000Z' },
      // Additional invitations for better visualization
      { id: 'inv21', visitorName: 'William Foster', visitorEmail: 'wfoster@tech.com', visitorCompany: 'Tech Innovations', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-11-14', visitTime: '09:00', purpose: 'Product Demo', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1021', createdAt: '2024-11-13T08:00:00.000Z' },
      { id: 'inv22', visitorName: 'Olivia Turner', visitorEmail: 'oturner@media.com', visitorCompany: 'Media Corp', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-11-13', visitTime: '14:00', purpose: 'Press Interview', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1022', createdAt: '2024-11-12T08:00:00.000Z' },
      { id: 'inv23', visitorName: 'Elijah Cooper', visitorEmail: 'ecooper@solutions.com', visitorCompany: 'Solutions Inc', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-11-12', visitTime: '10:30', purpose: 'Contract Negotiation', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1023', createdAt: '2024-11-11T08:00:00.000Z' },
      { id: 'inv24', visitorName: 'Sophia Mitchell', visitorEmail: 'smitchell@consulting.com', visitorCompany: 'Mitchell Consulting', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-11-11', visitTime: '15:30', purpose: 'Strategy Session', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1024', createdAt: '2024-11-10T08:00:00.000Z' },
      { id: 'inv25', visitorName: 'Lucas Rodriguez', visitorEmail: 'lrodriguez@vendor.com', visitorCompany: 'Vendor Plus', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-11-10', visitTime: '11:00', purpose: 'Vendor Meeting', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1025', createdAt: '2024-11-09T08:00:00.000Z' },
      { id: 'inv26', visitorName: 'Mia Thompson', visitorEmail: 'mthompson@design.com', visitorCompany: 'Design Studio', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-11-09', visitTime: '13:00', purpose: 'Design Consultation', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1026', createdAt: '2024-11-08T08:00:00.000Z' },
      { id: 'inv27', visitorName: 'Ethan Harris', visitorEmail: 'eharris@software.com', visitorCompany: 'Software Co', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-11-08', visitTime: '09:30', purpose: 'Software Demo', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1027', createdAt: '2024-11-07T08:00:00.000Z' },
      { id: 'inv28', visitorName: 'Ava Clark', visitorEmail: 'aclark@analytics.com', visitorCompany: 'Analytics Pro', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-11-07', visitTime: '14:30', purpose: 'Data Analysis', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1028', createdAt: '2024-11-06T08:00:00.000Z' },
      { id: 'inv29', visitorName: 'Noah Lewis', visitorEmail: 'nlewis@startup.com', visitorCompany: 'Startup Hub', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-11-06', visitTime: '10:00', purpose: 'Pitch Presentation', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1029', createdAt: '2024-11-05T08:00:00.000Z' },
      { id: 'inv30', visitorName: 'Isabella Walker', visitorEmail: 'iwalker@finance.com', visitorCompany: 'Finance Group', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-11-05', visitTime: '15:00', purpose: 'Financial Review', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1030', createdAt: '2024-11-04T08:00:00.000Z' },
      { id: 'inv31', visitorName: 'Mason King', visitorEmail: 'mking@logistics.com', visitorCompany: 'Logistics Co', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-11-04', visitTime: '11:30', purpose: 'Supply Chain', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1031', createdAt: '2024-11-03T08:00:00.000Z' },
      { id: 'inv32', visitorName: 'Charlotte Scott', visitorEmail: 'cscott@marketing.com', visitorCompany: 'Marketing Plus', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-11-03', visitTime: '13:30', purpose: 'Marketing Strategy', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1032', createdAt: '2024-11-02T08:00:00.000Z' },
      { id: 'inv33', visitorName: 'Liam Young', visitorEmail: 'lyoung@engineering.com', visitorCompany: 'Engineering Firm', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-11-02', visitTime: '09:00', purpose: 'Technical Review', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1033', createdAt: '2024-11-01T08:00:00.000Z' },
      { id: 'inv34', visitorName: 'Emma Adams', visitorEmail: 'eadams@hr.com', visitorCompany: 'HR Consulting', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-11-01', visitTime: '14:00', purpose: 'HR Consultation', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1034', createdAt: '2024-10-31T08:00:00.000Z' },
      { id: 'inv35', visitorName: 'Oliver Baker', visitorEmail: 'obaker@legal.com', visitorCompany: 'Legal Services', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-10-31', visitTime: '10:30', purpose: 'Legal Review', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1035', createdAt: '2024-10-30T08:00:00.000Z' },
      { id: 'inv36', visitorName: 'Sophia Nelson', visitorEmail: 'snelson@research.com', visitorCompany: 'Research Labs', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-10-30', visitTime: '15:30', purpose: 'Research Collaboration', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1036', createdAt: '2024-10-29T08:00:00.000Z' },
      { id: 'inv37', visitorName: 'James Carter', visitorEmail: 'jcarter@insurance.com', visitorCompany: 'Insurance Partners', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-10-29', visitTime: '11:00', purpose: 'Policy Review', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1037', createdAt: '2024-10-28T08:00:00.000Z' },
      { id: 'inv38', visitorName: 'Mia Rivera', visitorEmail: 'mrivera@consulting.com', visitorCompany: 'Rivera Consulting', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-10-28', visitTime: '13:00', purpose: 'Business Consulting', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1038', createdAt: '2024-10-27T08:00:00.000Z' },
      { id: 'inv39', visitorName: 'Ethan Roberts', visitorEmail: 'eroberts@security.com', visitorCompany: 'Security Solutions', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-10-27', visitTime: '09:30', purpose: 'Security Audit', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1039', createdAt: '2024-10-26T08:00:00.000Z' },
      { id: 'inv40', visitorName: 'Ava Phillips', visitorEmail: 'aphillips@training.com', visitorCompany: 'Training Academy', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-10-26', visitTime: '14:30', purpose: 'Training Workshop', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1040', createdAt: '2024-10-25T08:00:00.000Z' },
      { id: 'inv41', visitorName: 'Noah Campbell', visitorEmail: 'ncampbell@tech.com', visitorCompany: 'Tech Ventures', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-10-25', visitTime: '10:00', purpose: 'Tech Discussion', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1041', createdAt: '2024-10-24T08:00:00.000Z' },
      { id: 'inv42', visitorName: 'Isabella Martinez', visitorEmail: 'imartinez@media.com', visitorCompany: 'Media Network', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-10-24', visitTime: '15:00', purpose: 'Media Coverage', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1042', createdAt: '2024-10-23T08:00:00.000Z' },
      { id: 'inv43', visitorName: 'Mason Garcia', visitorEmail: 'mgarcia@realestate.com', visitorCompany: 'Real Estate Group', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-10-23', visitTime: '11:30', purpose: 'Property Discussion', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1043', createdAt: '2024-10-22T08:00:00.000Z' },
      { id: 'inv44', visitorName: 'Charlotte Lopez', visitorEmail: 'clopez@design.com', visitorCompany: 'Design Partners', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-10-22', visitTime: '13:30', purpose: 'Design Presentation', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1044', createdAt: '2024-10-21T08:00:00.000Z' },
      { id: 'inv45', visitorName: 'Liam Gonzalez', visitorEmail: 'lgonzalez@startup.com', visitorCompany: 'Startup Capital', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-10-21', visitTime: '09:00', purpose: 'Investment Discussion', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1045', createdAt: '2024-10-20T08:00:00.000Z' },
      { id: 'inv46', visitorName: 'Emma Wilson', visitorEmail: 'ewilson@analytics.com', visitorCompany: 'Analytics Corp', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-10-20', visitTime: '14:00', purpose: 'Data Presentation', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1046', createdAt: '2024-10-19T08:00:00.000Z' },
      { id: 'inv47', visitorName: 'Oliver Anderson', visitorEmail: 'oanderson@legal.com', visitorCompany: 'Anderson Legal', hostId: 'usr_acme_3', hostName: 'Emily Chen', visitDate: '2024-10-19', visitTime: '10:30', purpose: 'Contract Review', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1047', createdAt: '2024-10-18T08:00:00.000Z' },
      { id: 'inv48', visitorName: 'Sophia Thomas', visitorEmail: 'sthomas@consulting.com', visitorCompany: 'Thomas Consulting', hostId: 'usr_acme_4', hostName: 'Robert Wilson', visitDate: '2024-10-18', visitTime: '15:30', purpose: 'Strategic Planning', location: 'HQ - Building C', status: 'completed', accessCode: 'AC1048', createdAt: '2024-10-17T08:00:00.000Z' },
      { id: 'inv49', visitorName: 'James Jackson', visitorEmail: 'jjackson@manufacturing.com', visitorCompany: 'Manufacturing Inc', hostId: 'usr_acme_1', hostName: 'Sarah Johnson', visitDate: '2024-10-17', visitTime: '11:00', purpose: 'Production Review', location: 'HQ - Building A', status: 'completed', accessCode: 'AC1049', createdAt: '2024-10-16T08:00:00.000Z' },
      { id: 'inv50', visitorName: 'Mia White', visitorEmail: 'mwhite@healthcare.com', visitorCompany: 'Healthcare Solutions', hostId: 'usr_acme_2', hostName: 'David Martinez', visitDate: '2024-10-16', visitTime: '13:00', purpose: 'Healthcare Consultation', location: 'HQ - Building B', status: 'completed', accessCode: 'AC1050', createdAt: '2024-10-15T08:00:00.000Z' },
    ],
    parkingSpaces: [
      // ACME tenant - Building A - Level 1 (20 spaces with mixed statuses)
      { id: 'p1', spaceNumber: 'A-101', building: 'Building A', location: 'Building A - Level 1', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_1', assignedToName: 'Sarah Johnson', vehiclePlate: 'ABC123' },
      { id: 'p2', spaceNumber: 'A-102', building: 'Building A', location: 'Building A - Level 1', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_2', assignedToName: 'David Martinez', vehiclePlate: 'XYZ789' },
      { id: 'p3', spaceNumber: 'A-103', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p4', spaceNumber: 'A-104', building: 'Building A', location: 'Building A - Level 1', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_3', assignedToName: 'Emily Chen', vehiclePlate: 'DEF456' },
      { id: 'p5', spaceNumber: 'A-105', building: 'Building A', location: 'Building A - Level 1', status: 'reserved', tenantId: 'acme', isReservedForVisitor: true },
      { id: 'p6', spaceNumber: 'A-106', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p7', spaceNumber: 'A-107', building: 'Building A', location: 'Building A - Level 1', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_4', assignedToName: 'Robert Wilson', vehiclePlate: 'GHI789' },
      { id: 'p8', spaceNumber: 'A-108', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p9', spaceNumber: 'A-109', building: 'Building A', location: 'Building A - Level 1', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_5', assignedToName: 'Lisa Anderson', vehiclePlate: 'JKL012' },
      { id: 'p10', spaceNumber: 'A-110', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p11', spaceNumber: 'A-111', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p12', spaceNumber: 'A-112', building: 'Building A', location: 'Building A - Level 1', status: 'occupied', tenantId: 'acme', vehiclePlate: 'MNO345' },
      { id: 'p13', spaceNumber: 'A-113', building: 'Building A', location: 'Building A - Level 1', status: 'reserved', tenantId: 'acme', isReservedForVisitor: true },
      { id: 'p14', spaceNumber: 'A-114', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p15', spaceNumber: 'A-115', building: 'Building A', location: 'Building A - Level 1', status: 'occupied', tenantId: 'acme', vehiclePlate: 'PQR678' },
      { id: 'p16', spaceNumber: 'A-116', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p17', spaceNumber: 'A-117', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p18', spaceNumber: 'A-118', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p19', spaceNumber: 'A-119', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      { id: 'p20', spaceNumber: 'A-120', building: 'Building A', location: 'Building A - Level 1', status: 'available', tenantId: 'acme' },
      // ACME tenant - Building A - Level 2 (20 spaces)
      { id: 'p21', spaceNumber: 'A-201', building: 'Building A', location: 'Building A - Level 2', status: 'occupied', tenantId: 'acme', vehiclePlate: 'STU901' },
      { id: 'p22', spaceNumber: 'A-202', building: 'Building A', location: 'Building A - Level 2', status: 'available', tenantId: 'acme' },
      { id: 'p23', spaceNumber: 'A-203', building: 'Building A', location: 'Building A - Level 2', status: 'available', tenantId: 'acme' },
      { id: 'p24', spaceNumber: 'A-204', building: 'Building A', location: 'Building A - Level 2', status: 'occupied', tenantId: 'acme', vehiclePlate: 'VWX234' },
      { id: 'p25', spaceNumber: 'A-205', building: 'Building A', location: 'Building A - Level 2', status: 'available', tenantId: 'acme' },
      { id: 'p26', spaceNumber: 'A-206', building: 'Building A', location: 'Building A - Level 2', status: 'available', tenantId: 'acme' },
      { id: 'p27', spaceNumber: 'A-207', building: 'Building A', location: 'Building A - Level 2', status: 'available', tenantId: 'acme' },
      { id: 'p28', spaceNumber: 'A-208', building: 'Building A', location: 'Building A - Level 2', status: 'occupied', tenantId: 'acme', vehiclePlate: 'YZA567' },
      { id: 'p29', spaceNumber: 'A-209', building: 'Building A', location: 'Building A - Level 2', status: 'available', tenantId: 'acme' },
      { id: 'p30', spaceNumber: 'A-210', building: 'Building A', location: 'Building A - Level 2', status: 'available', tenantId: 'acme' },
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
    lockers: [
      // ACME tenant - Building A - Floor 1 - Permanent Lockers (20 lockers with mixed statuses)
      { id: 'l1', lockerNumber: 'A1-001', building: 'Building A', floor: '1', zone: 'Zone A', type: 'permanent', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_1', assignedToName: 'Sarah Johnson', createdAt: '2024-01-15T08:00:00.000Z' },
      { id: 'l2', lockerNumber: 'A1-002', building: 'Building A', floor: '1', zone: 'Zone A', type: 'permanent', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_2', assignedToName: 'David Martinez', createdAt: '2024-01-16T08:00:00.000Z' },
      { id: 'l3', lockerNumber: 'A1-003', building: 'Building A', floor: '1', zone: 'Zone A', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l4', lockerNumber: 'A1-004', building: 'Building A', floor: '1', zone: 'Zone A', type: 'permanent', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_3', assignedToName: 'Emily Chen', createdAt: '2024-01-20T08:00:00.000Z' },
      { id: 'l5', lockerNumber: 'A1-005', building: 'Building A', floor: '1', zone: 'Zone A', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l6', lockerNumber: 'A1-006', building: 'Building A', floor: '1', zone: 'Zone B', type: 'permanent', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_4', assignedToName: 'Robert Wilson', createdAt: '2024-01-22T08:00:00.000Z' },
      { id: 'l7', lockerNumber: 'A1-007', building: 'Building A', floor: '1', zone: 'Zone B', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l8', lockerNumber: 'A1-008', building: 'Building A', floor: '1', zone: 'Zone B', type: 'permanent', status: 'occupied', tenantId: 'acme', assignedTo: 'usr_acme_5', assignedToName: 'Lisa Anderson', createdAt: '2024-01-25T08:00:00.000Z' },
      { id: 'l9', lockerNumber: 'A1-009', building: 'Building A', floor: '1', zone: 'Zone B', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l10', lockerNumber: 'A1-010', building: 'Building A', floor: '1', zone: 'Zone B', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l11', lockerNumber: 'A1-011', building: 'Building A', floor: '1', zone: 'Zone C', type: 'permanent', status: 'occupied', tenantId: 'acme', createdAt: '2024-02-01T08:00:00.000Z' },
      { id: 'l12', lockerNumber: 'A1-012', building: 'Building A', floor: '1', zone: 'Zone C', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l13', lockerNumber: 'A1-013', building: 'Building A', floor: '1', zone: 'Zone C', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l14', lockerNumber: 'A1-014', building: 'Building A', floor: '1', zone: 'Zone C', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l15', lockerNumber: 'A1-015', building: 'Building A', floor: '1', zone: 'Zone C', type: 'permanent', status: 'occupied', tenantId: 'acme', createdAt: '2024-02-05T08:00:00.000Z' },
      { id: 'l16', lockerNumber: 'A1-016', building: 'Building A', floor: '1', zone: 'Zone D', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l17', lockerNumber: 'A1-017', building: 'Building A', floor: '1', zone: 'Zone D', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l18', lockerNumber: 'A1-018', building: 'Building A', floor: '1', zone: 'Zone D', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l19', lockerNumber: 'A1-019', building: 'Building A', floor: '1', zone: 'Zone D', type: 'permanent', status: 'available', tenantId: 'acme', createdAt: new Date().toISOString() },
      { id: 'l20', lockerNumber: 'A1-020', building: 'Building A', floor: '1', zone: 'Zone D', type: 'permanent', status: 'occupied', tenantId: 'acme', createdAt: '2024-02-10T08:00:00.000Z' },
      // Building A - Floor 2 - Permanent Lockers (20 lockers)
      { id: 'l21', lockerNumber: 'A2-001', building: 'Building A', floor: '2', zone: 'Zone A', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l22', lockerNumber: 'A2-002', building: 'Building A', floor: '2', zone: 'Zone A', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l23', lockerNumber: 'A2-003', building: 'Building A', floor: '2', zone: 'Zone A', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l24', lockerNumber: 'A2-004', building: 'Building A', floor: '2', zone: 'Zone A', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l25', lockerNumber: 'A2-005', building: 'Building A', floor: '2', zone: 'Zone A', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l26', lockerNumber: 'A2-006', building: 'Building A', floor: '2', zone: 'Zone B', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l27', lockerNumber: 'A2-007', building: 'Building A', floor: '2', zone: 'Zone B', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l28', lockerNumber: 'A2-008', building: 'Building A', floor: '2', zone: 'Zone B', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l29', lockerNumber: 'A2-009', building: 'Building A', floor: '2', zone: 'Zone B', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l30', lockerNumber: 'A2-010', building: 'Building A', floor: '2', zone: 'Zone B', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l31', lockerNumber: 'A2-011', building: 'Building A', floor: '2', zone: 'Zone C', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l32', lockerNumber: 'A2-012', building: 'Building A', floor: '2', zone: 'Zone C', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l33', lockerNumber: 'A2-013', building: 'Building A', floor: '2', zone: 'Zone C', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l34', lockerNumber: 'A2-014', building: 'Building A', floor: '2', zone: 'Zone C', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l35', lockerNumber: 'A2-015', building: 'Building A', floor: '2', zone: 'Zone C', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l36', lockerNumber: 'A2-016', building: 'Building A', floor: '2', zone: 'Zone D', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l37', lockerNumber: 'A2-017', building: 'Building A', floor: '2', zone: 'Zone D', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l38', lockerNumber: 'A2-018', building: 'Building A', floor: '2', zone: 'Zone D', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l39', lockerNumber: 'A2-019', building: 'Building A', floor: '2', zone: 'Zone D', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l40', lockerNumber: 'A2-020', building: 'Building A', floor: '2', zone: 'Zone D', type: 'permanent', status: 'available', createdAt: new Date().toISOString() },
      // Building B - Gym Lockers (15 lockers)
      { id: 'l41', lockerNumber: 'B-GYM-001', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l42', lockerNumber: 'B-GYM-002', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l43', lockerNumber: 'B-GYM-003', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l44', lockerNumber: 'B-GYM-004', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l45', lockerNumber: 'B-GYM-005', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l46', lockerNumber: 'B-GYM-006', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l47', lockerNumber: 'B-GYM-007', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l48', lockerNumber: 'B-GYM-008', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l49', lockerNumber: 'B-GYM-009', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l50', lockerNumber: 'B-GYM-010', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l51', lockerNumber: 'B-GYM-011', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l52', lockerNumber: 'B-GYM-012', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l53', lockerNumber: 'B-GYM-013', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l54', lockerNumber: 'B-GYM-014', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l55', lockerNumber: 'B-GYM-015', building: 'Building B', floor: 'Ground', zone: 'Gym Area', type: 'gym', status: 'available', createdAt: new Date().toISOString() },
      // Building C - Bike Storage (10 lockers)
      { id: 'l56', lockerNumber: 'C-BIKE-001', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l57', lockerNumber: 'C-BIKE-002', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l58', lockerNumber: 'C-BIKE-003', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l59', lockerNumber: 'C-BIKE-004', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l60', lockerNumber: 'C-BIKE-005', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l61', lockerNumber: 'C-BIKE-006', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l62', lockerNumber: 'C-BIKE-007', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l63', lockerNumber: 'C-BIKE-008', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l64', lockerNumber: 'C-BIKE-009', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
      { id: 'l65', lockerNumber: 'C-BIKE-010', building: 'Building C', floor: 'Basement', zone: 'Bike Storage', type: 'bike', status: 'available', createdAt: new Date().toISOString() },
    ],
    spaces: [
      // Building A - Floor 1 - Desks (30 desks)
      { id: 's1', spaceNumber: 'A1-D001', name: 'Desk 1', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone A', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's2', spaceNumber: 'A1-D002', name: 'Desk 2', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone A', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's3', spaceNumber: 'A1-D003', name: 'Desk 3', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone A', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's4', spaceNumber: 'A1-D004', name: 'Desk 4', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone A', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's5', spaceNumber: 'A1-D005', name: 'Desk 5', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone A', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's6', spaceNumber: 'A1-D006', name: 'Desk 6', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone B', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's7', spaceNumber: 'A1-D007', name: 'Desk 7', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone B', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's8', spaceNumber: 'A1-D008', name: 'Desk 8', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone B', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's9', spaceNumber: 'A1-D009', name: 'Desk 9', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone B', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's10', spaceNumber: 'A1-D010', name: 'Desk 10', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone B', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's11', spaceNumber: 'A1-D011', name: 'Desk 11', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone C', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's12', spaceNumber: 'A1-D012', name: 'Desk 12', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone C', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's13', spaceNumber: 'A1-D013', name: 'Desk 13', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone C', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's14', spaceNumber: 'A1-D014', name: 'Desk 14', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone C', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's15', spaceNumber: 'A1-D015', name: 'Desk 15', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone C', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's16', spaceNumber: 'A1-D016', name: 'Desk 16', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone D', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's17', spaceNumber: 'A1-D017', name: 'Desk 17', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone D', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's18', spaceNumber: 'A1-D018', name: 'Desk 18', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone D', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's19', spaceNumber: 'A1-D019', name: 'Desk 19', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone D', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's20', spaceNumber: 'A1-D020', name: 'Desk 20', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone D', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's21', spaceNumber: 'A1-D021', name: 'Desk 21', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone E', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's22', spaceNumber: 'A1-D022', name: 'Desk 22', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone E', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's23', spaceNumber: 'A1-D023', name: 'Desk 23', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone E', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's24', spaceNumber: 'A1-D024', name: 'Desk 24', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone E', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's25', spaceNumber: 'A1-D025', name: 'Desk 25', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone E', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's26', spaceNumber: 'A1-D026', name: 'Desk 26', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone F', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's27', spaceNumber: 'A1-D027', name: 'Desk 27', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone F', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's28', spaceNumber: 'A1-D028', name: 'Desk 28', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone F', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's29', spaceNumber: 'A1-D029', name: 'Desk 29', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone F', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's30', spaceNumber: 'A1-D030', name: 'Desk 30', building: 'Building A', floor: '1', location: 'Open Plan', zone: 'Zone F', type: 'desk', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      // Building A - Floor 2 - Offices (10 offices)
      { id: 's31', spaceNumber: 'A2-O001', name: 'Office 1', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone A', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's32', spaceNumber: 'A2-O002', name: 'Office 2', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone A', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's33', spaceNumber: 'A2-O003', name: 'Office 3', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone A', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's34', spaceNumber: 'A2-O004', name: 'Office 4', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone B', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's35', spaceNumber: 'A2-O005', name: 'Office 5', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone B', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's36', spaceNumber: 'A2-O006', name: 'Office 6', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone B', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's37', spaceNumber: 'A2-O007', name: 'Office 7', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone C', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's38', spaceNumber: 'A2-O008', name: 'Office 8', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone C', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's39', spaceNumber: 'A2-O009', name: 'Office 9', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone C', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      { id: 's40', spaceNumber: 'A2-O010', name: 'Office 10', building: 'Building A', floor: '2', location: 'Private Offices', zone: 'Zone D', type: 'office', capacity: 1, status: 'available', createdAt: new Date().toISOString() },
      // Building B - Meeting Rooms (8 meeting rooms)
      { id: 's41', spaceNumber: 'B1-MR01', name: 'Meeting Room 1', building: 'Building B', floor: '1', location: 'Meeting Rooms', zone: 'North Wing', type: 'meeting-room', capacity: 6, status: 'available', createdAt: new Date().toISOString() },
      { id: 's42', spaceNumber: 'B1-MR02', name: 'Meeting Room 2', building: 'Building B', floor: '1', location: 'Meeting Rooms', zone: 'North Wing', type: 'meeting-room', capacity: 6, status: 'available', createdAt: new Date().toISOString() },
      { id: 's43', spaceNumber: 'B1-MR03', name: 'Meeting Room 3', building: 'Building B', floor: '1', location: 'Meeting Rooms', zone: 'North Wing', type: 'meeting-room', capacity: 8, status: 'available', createdAt: new Date().toISOString() },
      { id: 's44', spaceNumber: 'B1-MR04', name: 'Meeting Room 4', building: 'Building B', floor: '1', location: 'Meeting Rooms', zone: 'South Wing', type: 'meeting-room', capacity: 8, status: 'available', createdAt: new Date().toISOString() },
      { id: 's45', spaceNumber: 'B2-MR05', name: 'Meeting Room 5', building: 'Building B', floor: '2', location: 'Meeting Rooms', zone: 'North Wing', type: 'meeting-room', capacity: 10, status: 'available', createdAt: new Date().toISOString() },
      { id: 's46', spaceNumber: 'B2-MR06', name: 'Meeting Room 6', building: 'Building B', floor: '2', location: 'Meeting Rooms', zone: 'North Wing', type: 'meeting-room', capacity: 10, status: 'available', createdAt: new Date().toISOString() },
      { id: 's47', spaceNumber: 'B2-MR07', name: 'Meeting Room 7', building: 'Building B', floor: '2', location: 'Meeting Rooms', zone: 'South Wing', type: 'meeting-room', capacity: 4, status: 'available', createdAt: new Date().toISOString() },
      { id: 's48', spaceNumber: 'B2-MR08', name: 'Meeting Room 8', building: 'Building B', floor: '2', location: 'Meeting Rooms', zone: 'South Wing', type: 'meeting-room', capacity: 4, status: 'available', createdAt: new Date().toISOString() },
      // Building C - Conference Rooms (4 conference rooms)
      { id: 's49', spaceNumber: 'C1-CR01', name: 'Conference Room A', building: 'Building C', floor: '1', location: 'Conference Center', zone: 'East Wing', type: 'conference-room', capacity: 20, status: 'available', createdAt: new Date().toISOString() },
      { id: 's50', spaceNumber: 'C1-CR02', name: 'Conference Room B', building: 'Building C', floor: '1', location: 'Conference Center', zone: 'East Wing', type: 'conference-room', capacity: 20, status: 'available', createdAt: new Date().toISOString() },
      { id: 's51', spaceNumber: 'C2-CR03', name: 'Conference Room C', building: 'Building C', floor: '2', location: 'Conference Center', zone: 'West Wing', type: 'conference-room', capacity: 30, status: 'available', createdAt: new Date().toISOString() },
      { id: 's52', spaceNumber: 'C2-CR04', name: 'Boardroom', building: 'Building C', floor: '2', location: 'Conference Center', zone: 'West Wing', type: 'conference-room', capacity: 16, status: 'available', createdAt: new Date().toISOString() },
      // Social Hubs (3 hubs)
      { id: 's53', spaceNumber: 'A1-SH01', name: 'The Lounge', building: 'Building A', floor: '1', location: 'Central', zone: 'Common Area', type: 'social-hub', capacity: 15, status: 'available', createdAt: new Date().toISOString() },
      { id: 's54', spaceNumber: 'B1-SH02', name: 'Collaboration Hub', building: 'Building B', floor: '1', location: 'Central', zone: 'Common Area', type: 'social-hub', capacity: 20, status: 'available', createdAt: new Date().toISOString() },
      { id: 's55', spaceNumber: 'C1-SH03', name: 'Breakout Space', building: 'Building C', floor: '1', location: 'Central', zone: 'Common Area', type: 'social-hub', capacity: 25, status: 'available', createdAt: new Date().toISOString() },
    ],
    buildings: [
      // Building A - Tower with 21 floors
      {
        id: 'bldg_a',
        name: 'Building A',
        tenantId: 'acme',
        basementLevels: 2,
        topFloor: 21,
        floors: [
          { floorNumber: -2, floorLabel: 'B2', zones: ['Parking', 'Storage'] },
          { floorNumber: -1, floorLabel: 'B1', zones: ['Parking', 'Bike Storage'] },
          { floorNumber: 0, floorLabel: 'Ground', zones: ['Lobby', 'Reception', 'Security'] },
          { floorNumber: 1, floorLabel: '1', zones: ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'] },
          { floorNumber: 2, floorLabel: '2', zones: ['Zone A', 'Zone B', 'Zone C', 'Zone D'] },
          { floorNumber: 3, floorLabel: '3', zones: ['Zone A', 'Zone B', 'Zone C', 'Zone D'] },
          { floorNumber: 4, floorLabel: '4', zones: ['East Wing', 'West Wing'] },
          { floorNumber: 5, floorLabel: '5', zones: ['East Wing', 'West Wing'] },
          { floorNumber: 6, floorLabel: '6', zones: ['East Wing', 'West Wing'] },
          { floorNumber: 7, floorLabel: '7', zones: ['East Wing', 'West Wing'] },
          { floorNumber: 8, floorLabel: '8', zones: ['East Wing', 'West Wing'] },
          { floorNumber: 9, floorLabel: '9', zones: ['East Wing', 'West Wing'] },
          { floorNumber: 10, floorLabel: '10', zones: ['Open Plan', 'Meeting Rooms'] },
          { floorNumber: 11, floorLabel: '11', zones: ['Open Plan', 'Meeting Rooms'] },
          { floorNumber: 12, floorLabel: '12', zones: ['Open Plan', 'Meeting Rooms'] },
          { floorNumber: 13, floorLabel: '13', zones: ['Open Plan', 'Meeting Rooms'] },
          { floorNumber: 14, floorLabel: '14', zones: ['Open Plan', 'Meeting Rooms'] },
          { floorNumber: 15, floorLabel: '15', zones: ['Open Plan', 'Meeting Rooms'] },
          { floorNumber: 16, floorLabel: '16', zones: ['Executive Offices', 'Boardrooms'] },
          { floorNumber: 17, floorLabel: '17', zones: ['Executive Offices', 'Boardrooms'] },
          { floorNumber: 18, floorLabel: '18', zones: ['Conference Center', 'Training Rooms'] },
          { floorNumber: 19, floorLabel: '19', zones: ['IT Infrastructure', 'Server Room'] },
          { floorNumber: 20, floorLabel: '20', zones: ['Executive Suite', 'VIP Lounge'] },
          { floorNumber: 21, floorLabel: '21', zones: ['Penthouse', 'Sky Lounge'] }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Building B - Mid-rise with 10 floors
      {
        id: 'bldg_b',
        name: 'Building B',
        tenantId: 'mbank',
        basementLevels: 1,
        topFloor: 10,
        floors: [
          { floorNumber: -1, floorLabel: 'B1', zones: ['Parking', 'Storage', 'Bike Storage'] },
          { floorNumber: 0, floorLabel: 'Ground', zones: ['Lobby', 'Cafe', 'Security'] },
          { floorNumber: 1, floorLabel: '1', zones: ['North Wing', 'South Wing', 'Common Area'] },
          { floorNumber: 2, floorLabel: '2', zones: ['North Wing', 'South Wing', 'Common Area'] },
          { floorNumber: 3, floorLabel: '3', zones: ['East Section', 'West Section'] },
          { floorNumber: 4, floorLabel: '4', zones: ['East Section', 'West Section'] },
          { floorNumber: 5, floorLabel: '5', zones: ['Open Office', 'Collaboration Zone'] },
          { floorNumber: 6, floorLabel: '6', zones: ['Open Office', 'Collaboration Zone'] },
          { floorNumber: 7, floorLabel: '7', zones: ['Team Spaces', 'Meeting Rooms'] },
          { floorNumber: 8, floorLabel: '8', zones: ['Management Offices', 'Executive Lounge'] },
          { floorNumber: 9, floorLabel: '9', zones: ['Conference Rooms', 'Event Space'] },
          { floorNumber: 10, floorLabel: '10', zones: ['Rooftop', 'Terrace', 'Recreation'] }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Building C - Low-rise with 5 floors and garage basement
      {
        id: 'bldg_c',
        name: 'Building C',
        tenantId: 'eassetmanager',
        basementLevels: 4,
        topFloor: 5,
        floors: [
          { floorNumber: -4, floorLabel: 'B4', zones: ['Parking Level 4'] },
          { floorNumber: -3, floorLabel: 'B3', zones: ['Parking Level 3'] },
          { floorNumber: -2, floorLabel: 'B2', zones: ['Parking Level 2'] },
          { floorNumber: -1, floorLabel: 'B1', zones: ['Parking Level 1', 'Bike Storage', 'Facilities'] },
          { floorNumber: 0, floorLabel: 'Ground', zones: ['Main Entrance', 'Reception', 'Lobby', 'Retail'] },
          { floorNumber: 1, floorLabel: '1', zones: ['East Wing', 'West Wing', 'Conference Center'] },
          { floorNumber: 2, floorLabel: '2', zones: ['East Wing', 'West Wing', 'Conference Center'] },
          { floorNumber: 3, floorLabel: '3', zones: ['Training Rooms', 'Workshops'] },
          { floorNumber: 4, floorLabel: '4', zones: ['Administrative', 'HR Department'] },
          { floorNumber: 5, floorLabel: '5', zones: ['Executive Floor', 'Boardroom', 'Sky Lounge'] }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
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
    badgeSwipes: [
      // ACME tenant badge swipes - Last 30 days
      { id: 'bs1', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-12-01T08:15:00.000Z', tenantId: 'acme' },
      { id: 'bs2', badgeId: 2, userId: 'usr_acme_2', userName: 'David Martinez', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-12-01T08:30:00.000Z', tenantId: 'acme' },
      { id: 'bs3', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building A - Floor 5', accessPoint: 'Elevator A5', timestamp: '2024-12-01T09:00:00.000Z', tenantId: 'acme' },
      { id: 'bs4', badgeId: 4, userId: 'usr_acme_4', userName: 'Robert Wilson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-12-01T09:15:00.000Z', tenantId: 'acme' },
      { id: 'bs5', badgeId: 2, userId: 'usr_acme_2', userName: 'David Martinez', location: 'Building A - Meeting Room 3', accessPoint: 'MR3', timestamp: '2024-12-01T10:00:00.000Z', tenantId: 'acme' },
      { id: 'bs6', badgeId: 6, userName: 'James Thompson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-12-01T08:45:00.000Z', tenantId: 'acme' },
      { id: 'bs7', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building B - Entrance', accessPoint: 'Door B1', timestamp: '2024-12-01T14:00:00.000Z', tenantId: 'acme' },
      { id: 'bs8', badgeId: 4, userId: 'usr_acme_4', userName: 'Robert Wilson', location: 'Building A - Server Room', accessPoint: 'SR1', timestamp: '2024-12-01T15:30:00.000Z', tenantId: 'acme' },
      { id: 'bs9', badgeId: 2, userId: 'usr_acme_2', userName: 'David Martinez', location: 'Building A - Parking', accessPoint: 'Garage A', timestamp: '2024-12-01T17:45:00.000Z', tenantId: 'acme' },
      { id: 'bs10', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building A - Main Exit', accessPoint: 'Door A1', timestamp: '2024-12-01T18:00:00.000Z', tenantId: 'acme' },
      { id: 'bs11', badgeId: 6, userName: 'James Thompson', location: 'Building A - Gym', accessPoint: 'Gym1', timestamp: '2024-11-30T07:00:00.000Z', tenantId: 'acme' },
      { id: 'bs12', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-30T08:10:00.000Z', tenantId: 'acme' },
      { id: 'bs13', badgeId: 2, userId: 'usr_acme_2', userName: 'David Martinez', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-30T08:25:00.000Z', tenantId: 'acme' },
      { id: 'bs14', badgeId: 4, userId: 'usr_acme_4', userName: 'Robert Wilson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-30T09:00:00.000Z', tenantId: 'acme' },
      { id: 'bs15', badgeId: 6, userName: 'James Thompson', location: 'Building A - Cafeteria', accessPoint: 'Cafe1', timestamp: '2024-11-30T12:00:00.000Z', tenantId: 'acme' },
      // Additional swipes for better data visualization
      { id: 'bs16', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-29T08:15:00.000Z', tenantId: 'acme' },
      { id: 'bs17', badgeId: 2, userId: 'usr_acme_2', userName: 'David Martinez', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-29T08:35:00.000Z', tenantId: 'acme' },
      { id: 'bs18', badgeId: 4, userId: 'usr_acme_4', userName: 'Robert Wilson', location: 'Building A - Server Room', accessPoint: 'SR1', timestamp: '2024-11-29T10:20:00.000Z', tenantId: 'acme' },
      { id: 'bs19', badgeId: 6, userName: 'James Thompson', location: 'Building A - Gym', accessPoint: 'Gym1', timestamp: '2024-11-29T07:00:00.000Z', tenantId: 'acme' },
      { id: 'bs20', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building A - Meeting Room 3', accessPoint: 'MR3', timestamp: '2024-11-28T10:00:00.000Z', tenantId: 'acme' },
      { id: 'bs21', badgeId: 2, userId: 'usr_acme_2', userName: 'David Martinez', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-28T08:30:00.000Z', tenantId: 'acme' },
      { id: 'bs22', badgeId: 4, userId: 'usr_acme_4', userName: 'Robert Wilson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-28T09:10:00.000Z', tenantId: 'acme' },
      { id: 'bs23', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-27T08:20:00.000Z', tenantId: 'acme' },
      { id: 'bs24', badgeId: 2, userId: 'usr_acme_2', userName: 'David Martinez', location: 'Building A - Parking', accessPoint: 'Garage A', timestamp: '2024-11-27T17:50:00.000Z', tenantId: 'acme' },
      { id: 'bs25', badgeId: 6, userName: 'James Thompson', location: 'Building A - Cafeteria', accessPoint: 'Cafe1', timestamp: '2024-11-27T12:30:00.000Z', tenantId: 'acme' },
      { id: 'bs26', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-26T08:15:00.000Z', tenantId: 'acme' },
      { id: 'bs27', badgeId: 4, userId: 'usr_acme_4', userName: 'Robert Wilson', location: 'Building A - Server Room', accessPoint: 'SR1', timestamp: '2024-11-26T14:00:00.000Z', tenantId: 'acme' },
      { id: 'bs28', badgeId: 2, userId: 'usr_acme_2', userName: 'David Martinez', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-26T08:25:00.000Z', tenantId: 'acme' },
      { id: 'bs29', badgeId: 1, userId: 'usr_acme_1', userName: 'Sarah Johnson', location: 'Building B - Entrance', accessPoint: 'Door B1', timestamp: '2024-11-25T14:30:00.000Z', tenantId: 'acme' },
      { id: 'bs30', badgeId: 6, userName: 'James Thompson', location: 'Building A - Main Entrance', accessPoint: 'Door A1', timestamp: '2024-11-25T08:40:00.000Z', tenantId: 'acme' },
    ],
    parkingBookings: [
      // ACME tenant parking bookings - Recent and upcoming
      { id: 'pb1', spaceId: 'p1', spaceNumber: 'A-101', userId: 'usr_acme_1', userName: 'Sarah Johnson', vehiclePlate: 'ABC123', bookingDate: '2024-12-01', startTime: '08:00', endTime: '18:00', status: 'active', tenantId: 'acme', createdAt: '2024-11-30T10:00:00.000Z' },
      { id: 'pb2', spaceId: 'p2', spaceNumber: 'A-102', userId: 'usr_acme_2', userName: 'David Martinez', vehiclePlate: 'XYZ789', bookingDate: '2024-12-01', startTime: '08:00', endTime: '18:00', status: 'active', tenantId: 'acme', createdAt: '2024-11-30T10:05:00.000Z' },
      { id: 'pb3', spaceId: 'p4', spaceNumber: 'A-104', userId: 'usr_acme_3', userName: 'Emily Chen', vehiclePlate: 'DEF456', bookingDate: '2024-12-01', startTime: '09:00', endTime: '17:00', status: 'active', tenantId: 'acme', createdAt: '2024-11-30T11:00:00.000Z' },
      { id: 'pb4', spaceId: 'p7', spaceNumber: 'A-107', userId: 'usr_acme_4', userName: 'Robert Wilson', vehiclePlate: 'GHI789', bookingDate: '2024-12-01', startTime: '08:00', endTime: '18:00', status: 'active', tenantId: 'acme', createdAt: '2024-11-30T10:30:00.000Z' },
      { id: 'pb5', spaceId: 'p9', spaceNumber: 'A-109', userId: 'usr_acme_5', userName: 'Lisa Anderson', vehiclePlate: 'JKL012', bookingDate: '2024-12-01', startTime: '08:00', endTime: '18:00', status: 'active', tenantId: 'acme', createdAt: '2024-11-30T09:00:00.000Z' },
      { id: 'pb6', spaceId: 'p12', spaceNumber: 'A-112', userId: 'usr_acme_1', userName: 'Sarah Johnson', vehiclePlate: 'MNO345', bookingDate: '2024-11-30', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-29T15:00:00.000Z' },
      { id: 'pb7', spaceId: 'p15', spaceNumber: 'A-115', userId: 'usr_acme_2', userName: 'David Martinez', vehiclePlate: 'PQR678', bookingDate: '2024-11-30', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-29T15:30:00.000Z' },
      { id: 'pb8', spaceId: 'p21', spaceNumber: 'A-201', userId: 'usr_acme_3', userName: 'Emily Chen', vehiclePlate: 'STU901', bookingDate: '2024-11-29', startTime: '09:00', endTime: '17:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-28T14:00:00.000Z' },
      { id: 'pb9', spaceId: 'p24', spaceNumber: 'A-204', userId: 'usr_acme_4', userName: 'Robert Wilson', vehiclePlate: 'VWX234', bookingDate: '2024-11-29', startTime: '08:00', endTime: '18:00', status: 'no-show', tenantId: 'acme', createdAt: '2024-11-28T14:30:00.000Z' },
      { id: 'pb10', spaceId: 'p28', spaceNumber: 'A-208', userId: 'usr_acme_5', userName: 'Lisa Anderson', vehiclePlate: 'YZA567', bookingDate: '2024-11-28', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-27T16:00:00.000Z' },
      { id: 'pb11', spaceId: 'p3', spaceNumber: 'A-103', userId: 'usr_acme_1', userName: 'Sarah Johnson', vehiclePlate: 'ABC123', bookingDate: '2024-11-27', startTime: '08:00', endTime: '18:00', status: 'no-show', tenantId: 'acme', createdAt: '2024-11-26T10:00:00.000Z' },
      { id: 'pb12', spaceId: 'p6', spaceNumber: 'A-106', userId: 'usr_acme_2', userName: 'David Martinez', vehiclePlate: 'XYZ789', bookingDate: '2024-11-26', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-25T11:00:00.000Z' },
      { id: 'pb13', spaceId: 'p8', spaceNumber: 'A-108', userId: 'usr_acme_3', userName: 'Emily Chen', vehiclePlate: 'DEF456', bookingDate: '2024-11-25', startTime: '09:00', endTime: '17:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-24T12:00:00.000Z' },
      { id: 'pb14', spaceId: 'p5', spaceNumber: 'A-105', userId: 'usr_acme_4', userName: 'Robert Wilson', vehiclePlate: 'GHI789', bookingDate: '2024-11-24', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-23T10:00:00.000Z' },
      { id: 'pb15', spaceId: 'p13', spaceNumber: 'A-113', userId: 'usr_acme_5', userName: 'Lisa Anderson', vehiclePlate: 'JKL012', bookingDate: '2024-11-23', startTime: '08:00', endTime: '18:00', status: 'no-show', tenantId: 'acme', createdAt: '2024-11-22T09:00:00.000Z' },
      // Additional bookings for 7-day trend
      { id: 'pb16', spaceId: 'p14', spaceNumber: 'A-114', userId: 'usr_acme_1', userName: 'Sarah Johnson', vehiclePlate: 'ABC123', bookingDate: '2024-11-28', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-27T09:00:00.000Z' },
      { id: 'pb17', spaceId: 'p16', spaceNumber: 'A-116', userId: 'usr_acme_2', userName: 'David Martinez', vehiclePlate: 'XYZ789', bookingDate: '2024-11-28', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-27T09:30:00.000Z' },
      { id: 'pb18', spaceId: 'p17', spaceNumber: 'A-117', userId: 'usr_acme_3', userName: 'Emily Chen', vehiclePlate: 'DEF456', bookingDate: '2024-11-28', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-27T10:00:00.000Z' },
      { id: 'pb19', spaceId: 'p18', spaceNumber: 'A-118', userId: 'usr_acme_4', userName: 'Robert Wilson', vehiclePlate: 'GHI789', bookingDate: '2024-11-27', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-26T09:00:00.000Z' },
      { id: 'pb20', spaceId: 'p19', spaceNumber: 'A-119', userId: 'usr_acme_5', userName: 'Lisa Anderson', vehiclePlate: 'JKL012', bookingDate: '2024-11-27', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-26T09:30:00.000Z' },
      { id: 'pb21', spaceId: 'p14', spaceNumber: 'A-114', userId: 'usr_acme_1', userName: 'Sarah Johnson', vehiclePlate: 'ABC123', bookingDate: '2024-11-26', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-25T09:00:00.000Z' },
      { id: 'pb22', spaceId: 'p16', spaceNumber: 'A-116', userId: 'usr_acme_2', userName: 'David Martinez', vehiclePlate: 'XYZ789', bookingDate: '2024-11-26', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-25T09:30:00.000Z' },
      { id: 'pb23', spaceId: 'p14', spaceNumber: 'A-114', userId: 'usr_acme_3', userName: 'Emily Chen', vehiclePlate: 'DEF456', bookingDate: '2024-11-25', startTime: '09:00', endTime: '17:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-24T10:00:00.000Z' },
      { id: 'pb24', spaceId: 'p17', spaceNumber: 'A-117', userId: 'usr_acme_4', userName: 'Robert Wilson', vehiclePlate: 'GHI789', bookingDate: '2024-11-25', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-24T10:30:00.000Z' },
      { id: 'pb25', spaceId: 'p18', spaceNumber: 'A-118', userId: 'usr_acme_5', userName: 'Lisa Anderson', vehiclePlate: 'JKL012', bookingDate: '2024-11-25', startTime: '08:00', endTime: '18:00', status: 'completed', tenantId: 'acme', createdAt: '2024-11-24T11:00:00.000Z' },
    ],
    lockerUsages: [
      // ACME tenant locker usage - Last 30 days
      { id: 'lu1', lockerId: 'l1', lockerNumber: 'A1-001', userId: 'usr_acme_1', userName: 'Sarah Johnson', usageDate: '2024-12-01', opened: true, duration: 45, tenantId: 'acme', timestamp: '2024-12-01T08:15:00.000Z' },
      { id: 'lu2', lockerId: 'l2', lockerNumber: 'A1-002', userId: 'usr_acme_2', userName: 'David Martinez', usageDate: '2024-12-01', opened: true, duration: 30, tenantId: 'acme', timestamp: '2024-12-01T08:30:00.000Z' },
      { id: 'lu3', lockerId: 'l4', lockerNumber: 'A1-004', userId: 'usr_acme_3', userName: 'Emily Chen', usageDate: '2024-12-01', opened: true, duration: 60, tenantId: 'acme', timestamp: '2024-12-01T09:00:00.000Z' },
      { id: 'lu4', lockerId: 'l1', lockerNumber: 'A1-001', userId: 'usr_acme_1', userName: 'Sarah Johnson', usageDate: '2024-12-01', opened: true, duration: 20, tenantId: 'acme', timestamp: '2024-12-01T17:00:00.000Z' },
      { id: 'lu5', lockerId: 'l2', lockerNumber: 'A1-002', userId: 'usr_acme_2', userName: 'David Martinez', usageDate: '2024-12-01', opened: true, duration: 25, tenantId: 'acme', timestamp: '2024-12-01T17:30:00.000Z' },
      { id: 'lu6', lockerId: 'l1', lockerNumber: 'A1-001', userId: 'usr_acme_1', userName: 'Sarah Johnson', usageDate: '2024-11-30', opened: true, duration: 40, tenantId: 'acme', timestamp: '2024-11-30T08:10:00.000Z' },
      { id: 'lu7', lockerId: 'l2', lockerNumber: 'A1-002', userId: 'usr_acme_2', userName: 'David Martinez', usageDate: '2024-11-30', opened: true, duration: 35, tenantId: 'acme', timestamp: '2024-11-30T08:25:00.000Z' },
      { id: 'lu8', lockerId: 'l4', lockerNumber: 'A1-004', userId: 'usr_acme_3', userName: 'Emily Chen', usageDate: '2024-11-30', opened: false, duration: 0, tenantId: 'acme', timestamp: '2024-11-30T09:00:00.000Z' },
      { id: 'lu9', lockerId: 'l1', lockerNumber: 'A1-001', userId: 'usr_acme_1', userName: 'Sarah Johnson', usageDate: '2024-11-29', opened: true, duration: 50, tenantId: 'acme', timestamp: '2024-11-29T08:15:00.000Z' },
      { id: 'lu10', lockerId: 'l2', lockerNumber: 'A1-002', userId: 'usr_acme_2', userName: 'David Martinez', usageDate: '2024-11-29', opened: true, duration: 30, tenantId: 'acme', timestamp: '2024-11-29T08:30:00.000Z' },
      { id: 'lu11', lockerId: 'l4', lockerNumber: 'A1-004', userId: 'usr_acme_3', userName: 'Emily Chen', usageDate: '2024-11-29', opened: true, duration: 55, tenantId: 'acme', timestamp: '2024-11-29T09:00:00.000Z' },
      { id: 'lu12', lockerId: 'l1', lockerNumber: 'A1-001', userId: 'usr_acme_1', userName: 'Sarah Johnson', usageDate: '2024-11-28', opened: true, duration: 45, tenantId: 'acme', timestamp: '2024-11-28T08:20:00.000Z' },
      { id: 'lu13', lockerId: 'l2', lockerNumber: 'A1-002', userId: 'usr_acme_2', userName: 'David Martinez', usageDate: '2024-11-28', opened: false, duration: 0, tenantId: 'acme', timestamp: '2024-11-28T08:35:00.000Z' },
      { id: 'lu14', lockerId: 'l4', lockerNumber: 'A1-004', userId: 'usr_acme_3', userName: 'Emily Chen', usageDate: '2024-11-27', opened: true, duration: 40, tenantId: 'acme', timestamp: '2024-11-27T09:10:00.000Z' },
      { id: 'lu15', lockerId: 'l1', lockerNumber: 'A1-001', userId: 'usr_acme_1', userName: 'Sarah Johnson', usageDate: '2024-11-26', opened: true, duration: 35, tenantId: 'acme', timestamp: '2024-11-26T08:15:00.000Z' },
      // Additional locker usage data
      { id: 'lu16', lockerId: 'l2', lockerNumber: 'A1-002', userId: 'usr_acme_2', userName: 'David Martinez', usageDate: '2024-11-26', opened: true, duration: 28, tenantId: 'acme', timestamp: '2024-11-26T08:30:00.000Z' },
      { id: 'lu17', lockerId: 'l4', lockerNumber: 'A1-004', userId: 'usr_acme_3', userName: 'Emily Chen', usageDate: '2024-11-26', opened: true, duration: 42, tenantId: 'acme', timestamp: '2024-11-26T09:00:00.000Z' },
      { id: 'lu18', lockerId: 'l1', lockerNumber: 'A1-001', userId: 'usr_acme_1', userName: 'Sarah Johnson', usageDate: '2024-11-25', opened: true, duration: 38, tenantId: 'acme', timestamp: '2024-11-25T08:15:00.000Z' },
      { id: 'lu19', lockerId: 'l2', lockerNumber: 'A1-002', userId: 'usr_acme_2', userName: 'David Martinez', usageDate: '2024-11-25', opened: true, duration: 32, tenantId: 'acme', timestamp: '2024-11-25T08:30:00.000Z' },
      { id: 'lu20', lockerId: 'l4', lockerNumber: 'A1-004', userId: 'usr_acme_3', userName: 'Emily Chen', usageDate: '2024-11-25', opened: false, duration: 0, tenantId: 'acme', timestamp: '2024-11-25T09:00:00.000Z' },
      { id: 'lu21', lockerId: 'l1', lockerNumber: 'A1-001', userId: 'usr_acme_1', userName: 'Sarah Johnson', usageDate: '2024-11-24', opened: true, duration: 44, tenantId: 'acme', timestamp: '2024-11-24T08:20:00.000Z' },
      { id: 'lu22', lockerId: 'l2', lockerNumber: 'A1-002', userId: 'usr_acme_2', userName: 'David Martinez', usageDate: '2024-11-24', opened: true, duration: 30, tenantId: 'acme', timestamp: '2024-11-24T08:35:00.000Z' },
      { id: 'lu23', lockerId: 'l4', lockerNumber: 'A1-004', userId: 'usr_acme_3', userName: 'Emily Chen', usageDate: '2024-11-24', opened: true, duration: 52, tenantId: 'acme', timestamp: '2024-11-24T09:10:00.000Z' },
      { id: 'lu24', lockerId: 'l1', lockerNumber: 'A1-001', userId: 'usr_acme_1', userName: 'Sarah Johnson', usageDate: '2024-11-23', opened: true, duration: 40, tenantId: 'acme', timestamp: '2024-11-23T08:15:00.000Z' },
      { id: 'lu25', lockerId: 'l2', lockerNumber: 'A1-002', userId: 'usr_acme_2', userName: 'David Martinez', usageDate: '2024-11-23', opened: true, duration: 33, tenantId: 'acme', timestamp: '2024-11-23T08:30:00.000Z' },
    ],
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

  const addSpace = (space: Omit<Space, 'id'>) => {
    const newSpace: Space = {
      ...space,
      id: `space_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, spaces: [...prev.spaces, newSpace] }))
    addAuditLog({ user: 'system', action: `Created space ${newSpace.spaceNumber} (${newSpace.type})`, status: 'Success' })
    return newSpace
  }

  const updateSpace = (id: string, updates: Partial<Space>) => {
    setState(prev => ({
      ...prev,
      spaces: prev.spaces.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)
    }))
    const space = state.spaces.find(s => s.id === id)
    if (updates.assignedTo) {
      addAuditLog({ user: 'system', action: `Assigned space ${space?.spaceNumber} to ${updates.assignedToName}`, status: 'Success' })
    } else {
      addAuditLog({ user: 'system', action: `Updated space ${space?.spaceNumber}`, status: 'Success' })
    }
  }

  const addBuilding = (building: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBuilding: Building = {
      ...building,
      id: `building_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setState(prev => ({ ...prev, buildings: [...prev.buildings, newBuilding] }))
    addAuditLog({ user: 'system', action: `Created building "${newBuilding.name}" with ${newBuilding.floors.length} floors`, status: 'Success' })
    return newBuilding
  }

  const updateBuilding = (id: string, updates: Partial<Building>) => {
    setState(prev => ({
      ...prev,
      buildings: prev.buildings.map(b => b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b)
    }))
    const building = state.buildings.find(b => b.id === id)
    addAuditLog({ user: 'system', action: `Updated building "${building?.name}"`, status: 'Success' })
  }

  const deleteBuilding = (id: string) => {
    const building = state.buildings.find(b => b.id === id)
    setState(prev => ({
      ...prev,
      buildings: prev.buildings.filter(b => b.id !== id)
    }))
    addAuditLog({ user: 'system', action: `Deleted building "${building?.name}"`, status: 'Success' })
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

  const resetDashboardData = () => {
    // Simply clear localStorage and reload - this will load all default data
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      addAuditLog({ user: 'system', action: 'Reset dashboard data to sample data', status: 'Success' })
      window.location.reload()
    }
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
    addSpace,
    updateSpace,
    addBuilding,
    updateBuilding,
    deleteBuilding,
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
    clearAllData,
    resetDashboardData
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
