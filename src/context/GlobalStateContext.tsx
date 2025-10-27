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
  location: string
  status: 'available' | 'occupied' | 'reserved'
  assignedTo?: string
  assignedToName?: string
  vehiclePlate?: string
  assignedDate?: string
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

interface GlobalState {
  users: User[]
  tenants: Tenant[]
  profiles: Profile[]
  badges: Badge[]
  invitations: Invitation[]
  parkingSpaces: ParkingSpace[]
  tickets: Ticket[]
  policyFiles: Record<string, PolicyFile | null>
  auditLogs: AuditLog[]
  tasks: Task[]
  whiteLabelSettings: Record<string, WhiteLabelSettings>
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
        return JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored state:', e)
      }
    }
  }

  return {
    users: [],
    tenants: [],
    profiles: [
      { id: 'prof1', name: 'Full Access', description: 'Complete access to all system modules', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'Service Hub', 'Lockers', 'News', 'AI Assistant', 'Space Management', 'Private Delivery', 'Authentication', 'Reporting'], isGlobal: true, createdAt: new Date().toISOString() },
      { id: 'prof2', name: 'Limited Access', description: 'Access to core operational modules', modules: ['User Management', 'Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Space Management', 'Reporting'], isGlobal: true, createdAt: new Date().toISOString() },
      { id: 'prof3', name: 'Visitor Management Only', description: 'Limited to front desk and visitor operations', modules: ['Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Lockers', 'News'], isGlobal: true, createdAt: new Date().toISOString() },
    ],
    badges: [],
    invitations: [],
    parkingSpaces: [
      { id: 'p1', spaceNumber: 'A-101', location: 'Building A - Level 1', status: 'available' },
      { id: 'p2', spaceNumber: 'A-102', location: 'Building A - Level 1', status: 'available' },
      { id: 'p3', spaceNumber: 'A-103', location: 'Building A - Level 1', status: 'available' },
      { id: 'p4', spaceNumber: 'B-201', location: 'Building B - Level 2', status: 'available' },
      { id: 'p5', spaceNumber: 'B-202', location: 'Building B - Level 2', status: 'available' },
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
    const initial = getInitialState()
    setState(initial)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
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
