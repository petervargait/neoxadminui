'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useGlobalState } from '@/context/GlobalStateContext'
import type { Invitation } from '@/context/GlobalStateContext'
import {
  VehicleCarParkingRegular,
  Wifi1Regular,
  LockClosedRegular,
  ShieldCheckmarkRegular,
} from '@fluentui/react-icons'

// ─── Types ───────────────────────────────────────────────────────────────────

interface VisitorManagementProps {
  tenantId: string
}

type DateFilter = 'today' | 'week' | 'month' | 'custom'
type ViewMode = 'list' | 'calendar'
type StatusFilterValue = 'all' | 'pending' | 'approved' | 'checked-in' | 'completed'

interface GuestRow {
  id: string
  name: string
  email: string
  company: string
}

interface CustomQuestion {
  id: string
  question: string
  answer: string
}

interface FormState {
  guests: GuestRow[]
  visitDate: string
  visitTime: string
  visitEndDate: string
  visitEndTime: string
  purpose: string
  location: string
  bookParking: boolean
  useWifi: boolean
  useLocker: boolean
  needIdVerification: boolean
  customQuestions: CustomQuestion[]
}

// ─── Design Tokens ───────────────────────────────────────────────────────────

const colors = {
  pageBg: '#08122E',
  cardBg: '#162032',
  cardBorder: '#1E293B',
  text: '#F1F5F9',
  secondary: '#94A3B8',
  muted: '#64748B',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#D4A847',
  red: '#EF4444',
  purple: '#8B5CF6',
} as const

const font = 'Inter, system-ui, sans-serif'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function startOfWeek(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().split('T')[0]
}

function startOfMonth(): string {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
}

function endOfWeek(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? 0 : 7)
  const sunday = new Date(new Date().setDate(diff))
  return sunday.toISOString().split('T')[0]
}

function endOfMonth(): string {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0]
}

function uid(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function emptyGuest(): GuestRow {
  return { id: uid(), name: '', email: '', company: '' }
}

function emptyQuestion(): CustomQuestion {
  return { id: uid(), question: '', answer: '' }
}

function defaultFormState(): FormState {
  return {
    guests: [emptyGuest()],
    visitDate: todayStr(),
    visitTime: '09:00',
    visitEndDate: todayStr(),
    visitEndTime: '10:00',
    purpose: '',
    location: '',
    bookParking: false,
    useWifi: false,
    useLocker: false,
    needIdVerification: false,
    customQuestions: [],
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday = 0
}

function getWeekDays(baseDate?: Date): { date: Date; dateStr: string; label: string; shortDay: string }[] {
  const d = baseDate ? new Date(baseDate) : new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  const days: { date: Date; dateStr: string; label: string; shortDay: string }[] = []
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  for (let i = 0; i < 7; i++) {
    const dd = new Date(monday)
    dd.setDate(monday.getDate() + i)
    days.push({
      date: dd,
      dateStr: dd.toISOString().split('T')[0],
      label: dd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      shortDay: shortDays[i],
    })
  }
  return days
}

const HOUR_SLOTS = Array.from({ length: 14 }, (_, i) => i + 7) // 07:00 to 20:00

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'rgba(212, 168, 71, 0.15)', text: '#D4A847', border: 'rgba(212, 168, 71, 0.3)' },
  approved: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
  rejected: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
  'checked-in': { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
  'checked-out': { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6', border: 'rgba(139, 92, 246, 0.3)' },
  completed: { bg: 'rgba(100, 116, 139, 0.15)', text: '#94A3B8', border: 'rgba(100, 116, 139, 0.3)' },
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ─── Component ───────────────────────────────────────────────────────────────

export default function VisitorManagement({ tenantId }: VisitorManagementProps) {
  const { invitations, addInvitation, updateInvitation, deleteInvitation } = useGlobalState()

  // ── State ────────────────────────────────────────────────────────────────

  const [dateFilter, setDateFilter] = useState<DateFilter>('month')
  const [customFrom, setCustomFrom] = useState<string>('')
  const [customTo, setCustomTo] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear())
  const [calendarDayModal, setCalendarDayModal] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(defaultFormState())

  // ── Tenant filtering ─────────────────────────────────────────────────────

  const tenantInvitations = useMemo(() => {
    return invitations.filter(inv => {
      if (inv.tenantId) return inv.tenantId === tenantId
      return true // show if tenantId not set on invitation
    })
  }, [invitations, tenantId])

  // ── Date range computation ───────────────────────────────────────────────

  const dateRange = useMemo<{ from: string; to: string }>(() => {
    switch (dateFilter) {
      case 'today':
        return { from: todayStr(), to: todayStr() }
      case 'week':
        return { from: startOfWeek(), to: endOfWeek() }
      case 'month':
        return { from: startOfMonth(), to: endOfMonth() }
      case 'custom':
        return { from: customFrom, to: customTo }
    }
  }, [dateFilter, customFrom, customTo])

  // ── Filtered invitations ─────────────────────────────────────────────────

  const filteredInvitations = useMemo(() => {
    return tenantInvitations.filter(inv => {
      // Date filter
      if (dateRange.from && inv.visitDate < dateRange.from) return false
      if (dateRange.to && inv.visitDate > dateRange.to) return false

      // Status filter
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false

      // Search
      if (searchTerm) {
        const s = searchTerm.toLowerCase()
        const matchName = inv.visitorName.toLowerCase().includes(s)
        const matchEmail = inv.visitorEmail.toLowerCase().includes(s)
        const matchCompany = (inv.visitorCompany || '').toLowerCase().includes(s)
        if (!matchName && !matchEmail && !matchCompany) return false
      }

      return true
    })
  }, [tenantInvitations, dateRange, statusFilter, searchTerm])

  // ── Stats ────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const today = todayStr()
    const wkStart = startOfWeek()
    const wkEnd = endOfWeek()
    return {
      total: tenantInvitations.length,
      today: tenantInvitations.filter(inv => inv.visitDate === today).length,
      week: tenantInvitations.filter(inv => inv.visitDate >= wkStart && inv.visitDate <= wkEnd).length,
      pending: tenantInvitations.filter(inv => inv.status === 'pending').length,
    }
  }, [tenantInvitations])

  // ── Calendar helpers ─────────────────────────────────────────────────────

  const calendarInvitations = useMemo(() => {
    const prefix = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}`
    return tenantInvitations.filter(inv => inv.visitDate.startsWith(prefix))
  }, [tenantInvitations, calendarMonth, calendarYear])

  const invitationsByDay = useMemo(() => {
    const map: Record<string, Invitation[]> = {}
    calendarInvitations.forEach(inv => {
      if (!map[inv.visitDate]) map[inv.visitDate] = []
      map[inv.visitDate].push(inv)
    })
    return map
  }, [calendarInvitations])

  // ── Form helpers ─────────────────────────────────────────────────────────

  const openCreateModal = useCallback(() => {
    setEditingId(null)
    setForm(defaultFormState())
    setShowModal(true)
  }, [])

  const openEditModal = useCallback((inv: Invitation) => {
    setEditingId(inv.id)
    setForm({
      guests: [{
        id: uid(),
        name: inv.visitorName,
        email: inv.visitorEmail,
        company: inv.visitorCompany || '',
      }],
      visitDate: inv.visitDate,
      visitTime: inv.visitTime,
      visitEndDate: inv.visitEndDate || inv.visitDate,
      visitEndTime: inv.visitEndTime || inv.visitTime,
      purpose: inv.purpose,
      location: inv.location,
      bookParking: inv.bookParking || false,
      useWifi: inv.useWifi || false,
      useLocker: inv.useLocker || false,
      needIdVerification: inv.needIdVerification || false,
      customQuestions: [
        inv.customQuestion1 ? { id: uid(), question: inv.customQuestion1, answer: inv.customAnswer1 || '' } : null,
        inv.customQuestion2 ? { id: uid(), question: inv.customQuestion2, answer: inv.customAnswer2 || '' } : null,
        inv.customQuestion3 ? { id: uid(), question: inv.customQuestion3, answer: inv.customAnswer3 || '' } : null,
      ].filter(Boolean) as CustomQuestion[],
    })
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
    setEditingId(null)
  }, [])

  const addGuestRow = useCallback(() => {
    setForm(prev => ({ ...prev, guests: [...prev.guests, emptyGuest()] }))
  }, [])

  const removeGuestRow = useCallback((guestId: string) => {
    setForm(prev => ({
      ...prev,
      guests: prev.guests.length > 1 ? prev.guests.filter(g => g.id !== guestId) : prev.guests,
    }))
  }, [])

  const updateGuest = useCallback((guestId: string, field: keyof Omit<GuestRow, 'id'>, value: string) => {
    setForm(prev => ({
      ...prev,
      guests: prev.guests.map(g => g.id === guestId ? { ...g, [field]: value } : g),
    }))
  }, [])

  const addCustomQuestion = useCallback(() => {
    setForm(prev => {
      if (prev.customQuestions.length >= 3) return prev
      return { ...prev, customQuestions: [...prev.customQuestions, emptyQuestion()] }
    })
  }, [])

  const removeCustomQuestion = useCallback((qId: string) => {
    setForm(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.filter(q => q.id !== qId),
    }))
  }, [])

  const updateCustomQuestion = useCallback((qId: string, field: 'question' | 'answer', value: string) => {
    setForm(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.map(q => q.id === qId ? { ...q, [field]: value } : q),
    }))
  }, [])

  const handleSave = useCallback(() => {
    // Validate
    const validGuests = form.guests.filter(g => g.name.trim() && g.email.trim())
    if (validGuests.length === 0) return
    if (!form.visitDate || !form.visitTime) return

    const qMap: Record<string, string> = {}
    form.customQuestions.forEach((q, i) => {
      if (q.question.trim()) {
        qMap[`customQuestion${i + 1}`] = q.question
        qMap[`customAnswer${i + 1}`] = q.answer
      }
    })

    if (editingId) {
      // Edit mode: update single invitation
      const guest = validGuests[0]
      updateInvitation(editingId, {
        visitorName: guest.name.trim(),
        visitorEmail: guest.email.trim(),
        visitorCompany: guest.company.trim() || undefined,
        visitDate: form.visitDate,
        visitTime: form.visitTime,
        visitEndDate: form.visitEndDate,
        visitEndTime: form.visitEndTime,
        purpose: form.purpose.trim(),
        location: form.location.trim(),
        bookParking: form.bookParking,
        useWifi: form.useWifi,
        useLocker: form.useLocker,
        needIdVerification: form.needIdVerification,
        customQuestion1: form.customQuestions[0]?.question || undefined,
        customAnswer1: form.customQuestions[0]?.answer || undefined,
        customQuestion2: form.customQuestions[1]?.question || undefined,
        customAnswer2: form.customQuestions[1]?.answer || undefined,
        customQuestion3: form.customQuestions[2]?.question || undefined,
        customAnswer3: form.customQuestions[2]?.answer || undefined,
      })
    } else {
      // Create mode: one invitation per guest
      validGuests.forEach(guest => {
        addInvitation({
          visitorName: guest.name.trim(),
          visitorEmail: guest.email.trim(),
          visitorCompany: guest.company.trim() || undefined,
          hostId: 'system',
          hostName: 'System',
          visitDate: form.visitDate,
          visitTime: form.visitTime,
          visitEndDate: form.visitEndDate,
          visitEndTime: form.visitEndTime,
          purpose: form.purpose.trim(),
          location: form.location.trim(),
          status: 'pending',
          bookParking: form.bookParking,
          useWifi: form.useWifi,
          useLocker: form.useLocker,
          needIdVerification: form.needIdVerification,
          customQuestion1: form.customQuestions[0]?.question || undefined,
          customAnswer1: form.customQuestions[0]?.answer || undefined,
          customQuestion2: form.customQuestions[1]?.question || undefined,
          customAnswer2: form.customQuestions[1]?.answer || undefined,
          customQuestion3: form.customQuestions[2]?.question || undefined,
          customAnswer3: form.customQuestions[2]?.answer || undefined,
          tenantId,
        })
      })
    }

    closeModal()
  }, [form, editingId, tenantId, addInvitation, updateInvitation, closeModal])

  const handleDelete = useCallback((id: string) => {
    deleteInvitation(id)
    setDeleteConfirmId(null)
  }, [deleteInvitation])

  // ── Calendar navigation ──────────────────────────────────────────────────

  const prevMonth = useCallback(() => {
    setCalendarMonth(prev => {
      if (prev === 0) {
        setCalendarYear(y => y - 1)
        return 11
      }
      return prev - 1
    })
  }, [])

  const nextMonth = useCallback(() => {
    setCalendarMonth(prev => {
      if (prev === 11) {
        setCalendarYear(y => y + 1)
        return 0
      }
      return prev + 1
    })
  }, [])

  // ── Styles ───────────────────────────────────────────────────────────────

  const cardStyle: React.CSSProperties = {
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: '12px',
    padding: '20px',
    fontFamily: font,
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: '8px',
    padding: '10px 14px',
    color: colors.text,
    fontSize: '14px',
    fontFamily: font,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  const btnPrimary: React.CSSProperties = {
    background: colors.blue,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: font,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'opacity 0.15s',
  }

  const btnSecondary: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    color: colors.secondary,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: font,
    cursor: 'pointer',
    transition: 'background 0.15s',
  }

  const iconBtnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: '8px',
    padding: '8px 10px',
    color: colors.secondary,
    cursor: 'pointer',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s',
  }

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '36px',
    width: 'auto',
    minWidth: '140px',
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: font, color: colors.text, minHeight: '100vh' }}>

      {/* ── Header Row ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: colors.text }}>
          Visitor Management
        </h1>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Stats Cards */}
          {([
            { label: 'Total Visitors', value: stats.total, color: colors.blue },
            { label: 'Today', value: stats.today, color: colors.green },
            { label: 'This Week', value: stats.week, color: colors.purple },
            { label: 'Pending', value: stats.pending, color: colors.yellow },
          ] as const).map(stat => (
            <div key={stat.label} style={{
              ...cardStyle,
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '130px',
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: stat.color,
                boxShadow: `0 0 8px ${stat.color}`,
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: '11px', color: colors.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: colors.text }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}

          {/* New Invitation Button */}
          <button
            onClick={openCreateModal}
            style={btnPrimary}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Invitation
          </button>
        </div>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────── */}
      <div style={{
        ...cardStyle,
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        {/* Date filter buttons */}
        {([
          { key: 'today' as const, label: 'Today' },
          { key: 'week' as const, label: 'This Week' },
          { key: 'month' as const, label: 'This Month' },
          { key: 'custom' as const, label: 'Custom Range' },
        ]).map(df => (
          <button
            key={df.key}
            onClick={() => setDateFilter(df.key)}
            style={{
              ...btnSecondary,
              padding: '8px 16px',
              fontSize: '13px',
              background: dateFilter === df.key ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.04)',
              color: dateFilter === df.key ? colors.blue : colors.secondary,
              borderColor: dateFilter === df.key ? 'rgba(59, 130, 246, 0.4)' : colors.cardBorder,
            }}
          >
            {df.label}
          </button>
        ))}

        {/* Custom date inputs */}
        {dateFilter === 'custom' && (
          <>
            <input
              type="date"
              value={customFrom}
              onChange={e => setCustomFrom(e.target.value)}
              style={{ ...inputStyle, width: '150px' }}
              placeholder="From"
            />
            <span style={{ color: colors.muted, fontSize: '13px' }}>to</span>
            <input
              type="date"
              value={customTo}
              onChange={e => setCustomTo(e.target.value)}
              style={{ ...inputStyle, width: '150px' }}
              placeholder="To"
            />
          </>
        )}

        {/* Spacer */}
        <div style={{ flex: 1, minWidth: '16px' }} />

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '220px' }}>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="2"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search name, email, company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '36px' }}
          />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '4px' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              ...iconBtnStyle,
              border: 'none',
              background: viewMode === 'list' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: viewMode === 'list' ? colors.blue : colors.muted,
            }}
            title="List View"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="4" cy="6" r="1" fill="currentColor" />
              <circle cx="4" cy="12" r="1" fill="currentColor" />
              <circle cx="4" cy="18" r="1" fill="currentColor" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            style={{
              ...iconBtnStyle,
              border: 'none',
              background: viewMode === 'calendar' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: viewMode === 'calendar' ? colors.blue : colors.muted,
            }}
            title="Calendar View"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </button>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilterValue)}
          style={selectStyle}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="checked-in">Checked-in</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* ── List View ──────────────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr 0.8fr 0.8fr',
            padding: '14px 20px',
            background: 'rgba(255,255,255,0.02)',
            borderBottom: `1px solid ${colors.cardBorder}`,
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: colors.muted,
          }}>
            <div>Visitor</div>
            <div>Company</div>
            <div>Date / Time</div>
            <div>Purpose</div>
            <div>Services</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {/* Table rows */}
          {filteredInvitations.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: colors.muted,
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="1.5" style={{ marginBottom: '12px', opacity: 0.5 }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>No visitors found</div>
              <div style={{ fontSize: '13px' }}>Adjust your filters or create a new invitation</div>
            </div>
          ) : (
            filteredInvitations.map((inv, idx) => {
              const sc = statusColors[inv.status] || statusColors.pending
              return (
                <div
                  key={inv.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr 0.8fr 0.8fr',
                    padding: '14px 20px',
                    borderBottom: idx < filteredInvitations.length - 1 ? `1px solid ${colors.cardBorder}` : 'none',
                    alignItems: 'center',
                    fontSize: '14px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                >
                  {/* Visitor */}
                  <div>
                    <div style={{ fontWeight: 600, color: colors.text, marginBottom: '2px' }}>{inv.visitorName}</div>
                    <div style={{ fontSize: '12px', color: colors.muted }}>{inv.visitorEmail}</div>
                  </div>

                  {/* Company */}
                  <div style={{ color: colors.secondary, fontSize: '13px' }}>
                    {inv.visitorCompany || '\u2014'}
                  </div>

                  {/* Date/Time */}
                  <div>
                    <div style={{ color: colors.text, fontSize: '13px' }}>{formatDate(inv.visitDate)}</div>
                    <div style={{ fontSize: '12px', color: colors.muted }}>{formatTime(inv.visitTime)}</div>
                  </div>

                  {/* Purpose */}
                  <div style={{ color: colors.secondary, fontSize: '13px' }}>
                    {inv.purpose || '\u2014'}
                  </div>

                  {/* Services */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {inv.bookParking && (
                      <span title="Parking" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(59,130,246,0.1)', borderRadius: '6px', padding: '2px 6px', color: '#3B82F6' }}>
                        <VehicleCarParkingRegular style={{ width: '14px', height: '14px' }} />
                      </span>
                    )}
                    {inv.useWifi && (
                      <span title="WiFi" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', padding: '2px 6px', color: '#10B981' }}>
                        <Wifi1Regular style={{ width: '14px', height: '14px' }} />
                      </span>
                    )}
                    {inv.useLocker && (
                      <span title="Locker" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(139,92,246,0.1)', borderRadius: '6px', padding: '2px 6px', color: '#8B5CF6' }}>
                        <LockClosedRegular style={{ width: '14px', height: '14px' }} />
                      </span>
                    )}
                    {inv.needIdVerification && (
                      <span title="ID Verification" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(212,168,71,0.1)', borderRadius: '6px', padding: '2px 6px', color: '#D4A847' }}>
                        <ShieldCheckmarkRegular style={{ width: '14px', height: '14px' }} />
                      </span>
                    )}
                    {!inv.bookParking && !inv.useWifi && !inv.useLocker && !inv.needIdVerification && (
                      <span style={{ color: colors.muted, fontSize: '12px' }}>\u2014</span>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      background: sc.bg,
                      color: sc.text,
                      border: `1px solid ${sc.border}`,
                      letterSpacing: '0.02em',
                    }}>
                      {inv.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => openEditModal(inv)}
                      style={iconBtnStyle}
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(inv.id)}
                      style={{ ...iconBtnStyle, color: colors.red }}
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── Calendar View ──────────────────────────────────────────────── */}
      {viewMode === 'calendar' && (
        <div style={cardStyle}>
          {/* ── Day View (Today) ── */}
          {dateFilter === 'today' && (() => {
            const todayDate = todayStr()
            const todayInvitations = tenantInvitations.filter(inv => inv.visitDate === todayDate)
            return (
              <>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px 0', color: colors.text }}>
                  {formatDate(todayDate)}
                </h2>
                <div style={{ position: 'relative' }}>
                  {HOUR_SLOTS.map(hour => {
                    const hourStr = String(hour).padStart(2, '0')
                    const slotInvitations = todayInvitations.filter(inv => inv.visitTime && inv.visitTime.startsWith(hourStr + ':'))
                    return (
                      <div key={hour} style={{
                        display: 'flex',
                        minHeight: '60px',
                        borderBottom: `1px solid ${colors.cardBorder}`,
                      }}>
                        <div style={{
                          width: '70px',
                          flexShrink: 0,
                          padding: '8px 12px 8px 0',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.muted,
                          textAlign: 'right',
                          borderRight: `1px solid ${colors.cardBorder}`,
                        }}>
                          {hourStr}:00
                        </div>
                        <div style={{ flex: 1, padding: '4px 8px', display: 'flex', flexWrap: 'wrap', gap: '4px', alignContent: 'flex-start' }}>
                          {slotInvitations.length > 0 && (() => {
                            const first = slotInvitations[0]
                            const sc = statusColors[first.status] || statusColors.pending
                            const tooltipText = slotInvitations.map(inv => `${formatTime(inv.visitTime)} - ${inv.visitorName}${inv.visitorCompany ? ` (${inv.visitorCompany})` : ''}`).join('\n')
                            return (
                              <div style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: sc.bg,
                                border: `1px solid ${sc.border}`,
                                fontSize: '12px',
                                color: sc.text,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                position: 'relative',
                              }} onClick={() => setCalendarDayModal(todayDate)} title={tooltipText}>
                                <span>{formatTime(first.visitTime)} — {first.visitorName}</span>
                                {slotInvitations.length > 1 && (
                                  <span style={{
                                    backgroundColor: '#C9963B',
                                    color: '#08122E',
                                    borderRadius: '10px',
                                    padding: '1px 7px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    minWidth: '20px',
                                    textAlign: 'center',
                                  }}>+{slotInvitations.length - 1}</span>
                                )}
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )
          })()}

          {/* ── Week View ── */}
          {dateFilter === 'week' && (() => {
            const weekDays = getWeekDays()
            const todayDate = todayStr()
            return (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', gap: 0 }}>
                  {/* Header row */}
                  <div style={{ borderBottom: `2px solid ${colors.cardBorder}`, padding: '8px 0' }} />
                  {weekDays.map(wd => (
                    <div key={wd.dateStr} style={{
                      textAlign: 'center',
                      padding: '8px 4px',
                      borderBottom: `2px solid ${colors.cardBorder}`,
                      borderLeft: `1px solid ${colors.cardBorder}`,
                      background: wd.dateStr === todayDate ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: wd.dateStr === todayDate ? colors.blue : colors.muted, textTransform: 'uppercase' }}>
                        {wd.shortDay}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: wd.dateStr === todayDate ? 800 : 600, color: wd.dateStr === todayDate ? colors.blue : colors.text, marginTop: '2px' }}>
                        {wd.date.getDate()}
                      </div>
                    </div>
                  ))}

                  {/* Hour rows */}
                  {HOUR_SLOTS.map(hour => {
                    const hourStr = String(hour).padStart(2, '0')
                    return (
                      <React.Fragment key={hour}>
                        <div style={{
                          padding: '8px 8px 8px 0',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: colors.muted,
                          textAlign: 'right',
                          borderBottom: `1px solid ${colors.cardBorder}`,
                          borderRight: `1px solid ${colors.cardBorder}`,
                        }}>
                          {hourStr}:00
                        </div>
                        {weekDays.map(wd => {
                          const slotInvitations = tenantInvitations.filter(inv => inv.visitDate === wd.dateStr && inv.visitTime && inv.visitTime.startsWith(hourStr + ':'))
                          return (
                            <div key={wd.dateStr} style={{
                              minHeight: '48px',
                              padding: '2px 4px',
                              borderBottom: `1px solid ${colors.cardBorder}`,
                              borderLeft: `1px solid ${colors.cardBorder}`,
                              background: wd.dateStr === todayDate ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
                            }}>
                              {slotInvitations.length > 0 && (() => {
                                const first = slotInvitations[0]
                                const sc = statusColors[first.status] || statusColors.pending
                                const tooltipText = slotInvitations.map(inv => `${formatTime(inv.visitTime)} - ${inv.visitorName}${inv.visitorCompany ? ` (${inv.visitorCompany})` : ''}`).join('\n')
                                return (
                                  <div style={{
                                    padding: '3px 6px',
                                    borderRadius: '4px',
                                    background: sc.bg,
                                    border: `1px solid ${sc.border}`,
                                    fontSize: '10px',
                                    color: sc.text,
                                    fontWeight: 600,
                                    marginBottom: '2px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }} title={tooltipText}
                                     onClick={() => setCalendarDayModal(wd.dateStr)}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{first.visitorName}</span>
                                    {slotInvitations.length > 1 && (
                                      <span style={{
                                        backgroundColor: '#C9963B',
                                        color: '#08122E',
                                        borderRadius: '8px',
                                        padding: '0 5px',
                                        fontSize: '9px',
                                        fontWeight: 800,
                                        flexShrink: 0,
                                      }}>+{slotInvitations.length - 1}</span>
                                    )}
                                  </div>
                                )
                              })()}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    )
                  })}
                </div>
              </>
            )
          })()}

          {/* ── Month View (default) ── */}
          {(dateFilter === 'month' || dateFilter === 'custom') && (
            <>
              {/* Month navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <button onClick={prevMonth} style={iconBtnStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: colors.text }}>
                  {monthNames[calendarMonth]} {calendarYear}
                </h2>
                <button onClick={nextMonth} style={iconBtnStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Day labels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                {dayLabels.map(d => (
                  <div key={d} style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: colors.muted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '8px 0',
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {Array.from({ length: getFirstDayOfMonth(calendarYear, calendarMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ minHeight: '80px' }} />
                ))}
                {Array.from({ length: getDaysInMonth(calendarYear, calendarMonth) }).map((_, i) => {
                  const dayNum = i + 1
                  const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                  const dayInvitations = invitationsByDay[dateStr] || []
                  const isToday = dateStr === todayStr()
                  const hasVisitors = dayInvitations.length > 0
                  return (
                    <div
                      key={dayNum}
                      onClick={() => hasVisitors ? setCalendarDayModal(dateStr) : undefined}
                      style={{
                        minHeight: '80px',
                        padding: '8px',
                        borderRadius: '8px',
                        background: isToday ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.02)',
                        border: isToday ? `1px solid rgba(59, 130, 246, 0.3)` : `1px solid ${colors.cardBorder}`,
                        cursor: hasVisitors ? 'pointer' : 'default',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (hasVisitors) (e.currentTarget as HTMLDivElement).style.background = 'rgba(59, 130, 246, 0.12)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isToday ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.02)' }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: isToday ? 800 : 600, color: isToday ? colors.blue : colors.text, marginBottom: '6px' }}>
                        {dayNum}
                      </div>
                      {hasVisitors && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.blue, boxShadow: `0 0 6px ${colors.blue}`, flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: colors.secondary, fontWeight: 600 }}>
                            {dayInvitations.length} visitor{dayInvitations.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Calendar Day Modal ─────────────────────────────────────────── */}
      {calendarDayModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontFamily: font,
          }}
          onClick={() => setCalendarDayModal(null)}
        >
          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: colors.text }}>
                Visitors on {formatDate(calendarDayModal)}
              </h3>
              <button
                onClick={() => setCalendarDayModal(null)}
                style={{ ...iconBtnStyle, border: 'none', background: 'transparent' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {(invitationsByDay[calendarDayModal] || []).map(inv => {
              const sc = statusColors[inv.status] || statusColors.pending
              return (
                <div
                  key={inv.id}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${colors.cardBorder}`,
                    marginBottom: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: colors.text }}>{inv.visitorName}</div>
                      <div style={{ fontSize: '12px', color: colors.muted }}>{inv.visitorEmail}</div>
                    </div>
                    <span style={{
                      padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                      textTransform: 'capitalize', background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                    }}>
                      {inv.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: colors.secondary }}>
                    {formatTime(inv.visitTime)}{inv.purpose ? ` \u00B7 ${inv.purpose}` : ''}{inv.visitorCompany ? ` \u00B7 ${inv.visitorCompany}` : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ────────────────────────────────────────── */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontFamily: font,
          }}
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.red} strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: colors.text }}>Delete Invitation</h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: colors.secondary, lineHeight: 1.5 }}>
              Are you sure you want to delete this invitation? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={btnSecondary}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                style={{ ...btnPrimary, background: colors.red }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ────────────────────────────────────────── */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontFamily: font,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '640px',
              width: '94%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: colors.text }}>
                {editingId ? 'Edit Invitation' : 'New Invitation'}
              </h2>
              <button onClick={closeModal} style={{ ...iconBtnStyle, border: 'none', background: 'transparent' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ── Guest rows ─────────────────────────────────────────── */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                {editingId ? 'Guest' : 'Guests'}
              </label>

              {form.guests.map((guest, gIdx) => (
                <div
                  key={guest.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: form.guests.length > 1 && !editingId ? '1fr 1fr 1fr 32px' : '1fr 1fr 1fr',
                    gap: '10px',
                    marginBottom: '10px',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Name *"
                    value={guest.name}
                    onChange={e => updateGuest(guest.id, 'name', e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={guest.email}
                    onChange={e => updateGuest(guest.id, 'email', e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={guest.company}
                    onChange={e => updateGuest(guest.id, 'company', e.target.value)}
                    style={inputStyle}
                  />
                  {form.guests.length > 1 && !editingId && (
                    <button
                      onClick={() => removeGuestRow(guest.id)}
                      style={{ ...iconBtnStyle, padding: '6px', color: colors.red }}
                      title="Remove guest"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              {!editingId && (
                <button
                  onClick={addGuestRow}
                  style={{ ...btnSecondary, fontSize: '13px', padding: '8px 14px', marginTop: '4px' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: '-2px' }}>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Another Guest
                </button>
              )}
            </div>

            {/* ── Shared fields ──────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={form.visitDate}
                  onChange={e => setForm(prev => ({ ...prev, visitDate: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Start Time *
                </label>
                <input
                  type="time"
                  value={form.visitTime}
                  onChange={e => setForm(prev => ({ ...prev, visitTime: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  End Date *
                </label>
                <input
                  type="date"
                  value={form.visitEndDate}
                  onChange={e => setForm(prev => ({ ...prev, visitEndDate: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  End Time *
                </label>
                <input
                  type="time"
                  value={form.visitEndTime}
                  onChange={e => setForm(prev => ({ ...prev, visitEndTime: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Business meeting"
                  value={form.purpose}
                  onChange={e => setForm(prev => ({ ...prev, purpose: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Building A, Floor 3"
                  value={form.location}
                  onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* ── Services checkboxes ────────────────────────────────── */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Services
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {([
                  { key: 'bookParking' as const, label: 'Book Parking', icon: <VehicleCarParkingRegular style={{ width: '16px', height: '16px' }} /> },
                  { key: 'useWifi' as const, label: 'Use WiFi', icon: <Wifi1Regular style={{ width: '16px', height: '16px' }} /> },
                  { key: 'useLocker' as const, label: 'Use Locker', icon: <LockClosedRegular style={{ width: '16px', height: '16px' }} /> },
                  { key: 'needIdVerification' as const, label: 'Need ID Verification', icon: <ShieldCheckmarkRegular style={{ width: '16px', height: '16px' }} /> },
                ]).map(svc => (
                  <label
                    key={svc.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: form[svc.key] ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${form[svc.key] ? 'rgba(59, 130, 246, 0.3)' : colors.cardBorder}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontSize: '14px',
                      color: form[svc.key] ? colors.text : colors.secondary,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form[svc.key]}
                      onChange={e => setForm(prev => ({ ...prev, [svc.key]: e.target.checked }))}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '4px',
                      border: `2px solid ${form[svc.key] ? colors.blue : colors.muted}`,
                      background: form[svc.key] ? colors.blue : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s', flexShrink: 0,
                    }}>
                      {form[svc.key] && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span>{svc.icon}</span>
                    <span style={{ fontWeight: 500 }}>{svc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Custom Questions ────────────────────────────────────── */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Custom Questions (optional)
                </label>
                {form.customQuestions.length < 3 && (
                  <button
                    onClick={addCustomQuestion}
                    style={{ ...btnSecondary, fontSize: '12px', padding: '6px 12px' }}
                  >
                    + Add Question
                  </button>
                )}
              </div>

              {form.customQuestions.map((cq, qIdx) => (
                <div key={cq.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder={`Question ${qIdx + 1}`}
                    value={cq.question}
                    onChange={e => updateCustomQuestion(cq.id, 'question', e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Answer"
                    value={cq.answer}
                    onChange={e => updateCustomQuestion(cq.id, 'answer', e.target.value)}
                    style={inputStyle}
                  />
                  <button
                    onClick={() => removeCustomQuestion(cq.id)}
                    style={{ ...iconBtnStyle, padding: '6px', color: colors.red }}
                    title="Remove question"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}

              {form.customQuestions.length === 0 && (
                <div style={{ fontSize: '13px', color: colors.muted, fontStyle: 'italic' }}>
                  No custom questions added
                </div>
              )}
            </div>

            {/* ── Modal footer ───────────────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: `1px solid ${colors.cardBorder}` }}>
              <button onClick={closeModal} style={btnSecondary}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  ...btnPrimary,
                  opacity: form.guests.some(g => g.name.trim() && g.email.trim()) && form.visitDate && form.visitTime ? 1 : 0.5,
                  pointerEvents: form.guests.some(g => g.name.trim() && g.email.trim()) && form.visitDate && form.visitTime ? 'auto' : 'none',
                }}
              >
                {editingId ? 'Save Changes' : 'Create Invitation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
