'use client'

import React, { useState, useMemo, useRef, useCallback } from 'react'
import { useGlobalState } from '@/context/GlobalStateContext'
import type { EventInvitation, EventParticipant } from '@/context/GlobalStateContext'
import {
  VehicleCarParkingRegular,
  Wifi1Regular,
  LockClosedRegular,
  ShieldCheckmarkRegular,
} from '@fluentui/react-icons'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EventManagementProps {
  tenantId: string
}

type DateFilterOption = 'today' | 'thisWeek' | 'thisMonth' | 'custom'
type ViewMode = 'list' | 'calendar'
type StatusFilter = 'all' | 'draft' | 'published' | 'completed' | 'cancelled'
type ParticipantTab = 'individual' | 'csv'

interface ParticipantFormData {
  name: string
  email: string
  company: string
  bookParking: boolean
  useWifi: boolean
  useLocker: boolean
  needIdVerification: boolean
  hasFoodAllergy: boolean
  foodAllergyDetails: string
  needsSpecialAssistance: boolean
  specialAssistanceDetails: string
  dietaryRequirements: string
  customQuestion1: string
  customQuestion2: string
  customQuestion3: string
}

interface BulkSettings {
  bookParking: boolean
  useWifi: boolean
  useLocker: boolean
  needIdVerification: boolean
}

interface EventFormState {
  eventName: string
  eventDate: string
  eventTime: string
  eventEndTime: string
  eventLocation: string
  eventDescription: string
}

interface CsvUploadState {
  fileName: string
  parsedRows: Array<{ name: string; email: string; company: string }>
  errorCount: number
  isParsed: boolean
}

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const COLORS = {
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

const FONT = 'Inter, system-ui, sans-serif'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWeekBounds(date: Date): { start: Date; end: Date } {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const start = new Date(d.setDate(diff))
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

function getMonthBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function createEmptyParticipant(): EventParticipant {
  return {
    id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    email: '',
    company: '',
    status: 'invited',
    bookParking: false,
    useWifi: false,
    useLocker: false,
    needIdVerification: false,
    hasFoodAllergy: false,
    foodAllergyDetails: '',
    needsSpecialAssistance: false,
    specialAssistanceDetails: '',
    dietaryRequirements: '',
    customQuestion1: '',
    customQuestion2: '',
    customQuestion3: '',
  }
}

const defaultBulkSettings: BulkSettings = {
  bookParking: false,
  useWifi: false,
  useLocker: false,
  needIdVerification: false,
}

const defaultEventForm: EventFormState = {
  eventName: '',
  eventDate: '',
  eventTime: '',
  eventEndTime: '',
  eventLocation: '',
  eventDescription: '',
}

const defaultCsvState: CsvUploadState = {
  fileName: '',
  parsedRows: [],
  errorCount: 0,
  isParsed: false,
}

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------

function statusBadgeStyle(status: EventInvitation['status']): React.CSSProperties {
  const map: Record<EventInvitation['status'], { bg: string; color: string }> = {
    draft: { bg: 'rgba(148, 163, 184, 0.15)', color: COLORS.secondary },
    published: { bg: 'rgba(59, 130, 246, 0.15)', color: COLORS.blue },
    completed: { bg: 'rgba(16, 185, 129, 0.15)', color: COLORS.green },
    cancelled: { bg: 'rgba(239, 68, 68, 0.15)', color: COLORS.red },
  }
  const m = map[status]
  return {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize' as const,
    background: m.bg,
    color: m.color,
    border: `1px solid ${m.color}33`,
  }
}

function participantStatusBadge(status: EventParticipant['status']): React.CSSProperties {
  const map: Record<EventParticipant['status'], { bg: string; color: string }> = {
    invited: { bg: 'rgba(59, 130, 246, 0.15)', color: COLORS.blue },
    confirmed: { bg: 'rgba(16, 185, 129, 0.15)', color: COLORS.green },
    declined: { bg: 'rgba(239, 68, 68, 0.15)', color: COLORS.red },
    attended: { bg: 'rgba(139, 92, 246, 0.15)', color: COLORS.purple },
    'no-show': { bg: 'rgba(212, 168, 71, 0.15)', color: COLORS.yellow },
  }
  const m = map[status]
  return {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'capitalize' as const,
    background: m.bg,
    color: m.color,
    border: `1px solid ${m.color}33`,
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventManagement({ tenantId }: EventManagementProps) {
  const { events, addEvent, updateEvent, deleteEvent } = useGlobalState()

  // ---- Filter state ----
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('thisMonth')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // ---- Modal state ----
  const [showModal, setShowModal] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  // ---- Calendar state ----
  const now = new Date()
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth())
  const [calendarYear, setCalendarYear] = useState(now.getFullYear())

  // ---- Event form state ----
  const [eventForm, setEventForm] = useState<EventFormState>(defaultEventForm)
  const [participants, setParticipants] = useState<EventParticipant[]>([])
  const [participantTab, setParticipantTab] = useState<ParticipantTab>('individual')
  const [indivName, setIndivName] = useState('')
  const [indivEmail, setIndivEmail] = useState('')
  const [indivCompany, setIndivCompany] = useState('')
  const [csvState, setCsvState] = useState<CsvUploadState>(defaultCsvState)
  const [bulkSettings, setBulkSettings] = useState<BulkSettings>(defaultBulkSettings)
  const [expandedParticipantId, setExpandedParticipantId] = useState<string | null>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)

  // ---- Expanded event in list view ----
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)

  // ---- Delete confirmation ----
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // ---- Selected calendar day ----
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null)

  // =========================================================================
  // Filtered events
  // =========================================================================

  const tenantEvents = useMemo(() => {
    return events.filter(e => e.tenantId === tenantId)
  }, [events, tenantId])

  const filteredEvents = useMemo(() => {
    let result = tenantEvents

    // Date filter
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (dateFilter === 'today') {
      const todayStr = today.toISOString().split('T')[0]
      result = result.filter(e => e.eventDate === todayStr)
    } else if (dateFilter === 'thisWeek') {
      const { start, end } = getWeekBounds(new Date())
      result = result.filter(e => {
        const d = new Date(e.eventDate)
        return d >= start && d <= end
      })
    } else if (dateFilter === 'thisMonth') {
      const { start, end } = getMonthBounds(new Date())
      result = result.filter(e => {
        const d = new Date(e.eventDate)
        return d >= start && d <= end
      })
    } else if (dateFilter === 'custom') {
      if (customFrom) {
        result = result.filter(e => e.eventDate >= customFrom)
      }
      if (customTo) {
        result = result.filter(e => e.eventDate <= customTo)
      }
    }

    // Search
    if (searchTerm) {
      const s = searchTerm.toLowerCase()
      result = result.filter(e =>
        e.eventName.toLowerCase().includes(s) ||
        e.eventLocation.toLowerCase().includes(s) ||
        e.organizer.toLowerCase().includes(s)
      )
    }

    // Status
    if (statusFilter !== 'all') {
      result = result.filter(e => e.status === statusFilter)
    }

    return result
  }, [tenantEvents, dateFilter, customFrom, customTo, searchTerm, statusFilter])

  // =========================================================================
  // Stats
  // =========================================================================

  const stats = useMemo(() => {
    const upcoming = tenantEvents.filter(e => {
      const d = new Date(e.eventDate)
      return d >= new Date() && (e.status === 'published' || e.status === 'draft')
    }).length
    const published = tenantEvents.filter(e => e.status === 'published').length
    const draft = tenantEvents.filter(e => e.status === 'draft').length
    return { total: tenantEvents.length, upcoming, published, draft }
  }, [tenantEvents])

  // =========================================================================
  // Modal helpers
  // =========================================================================

  const openCreateModal = useCallback(() => {
    setEditingEventId(null)
    setEventForm(defaultEventForm)
    setParticipants([])
    setBulkSettings(defaultBulkSettings)
    setCsvState(defaultCsvState)
    setParticipantTab('individual')
    setIndivName('')
    setIndivEmail('')
    setIndivCompany('')
    setExpandedParticipantId(null)
    setShowModal(true)
  }, [])

  const openEditModal = useCallback((event: EventInvitation) => {
    setEditingEventId(event.id)
    setEventForm({
      eventName: event.eventName,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      eventEndTime: event.eventEndTime || '',
      eventLocation: event.eventLocation,
      eventDescription: event.eventDescription || '',
    })
    setParticipants([...event.participants])
    setBulkSettings(defaultBulkSettings)
    setCsvState(defaultCsvState)
    setParticipantTab('individual')
    setIndivName('')
    setIndivEmail('')
    setIndivCompany('')
    setExpandedParticipantId(null)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
    setEditingEventId(null)
  }, [])

  // =========================================================================
  // Save / publish
  // =========================================================================

  const saveEvent = useCallback((status: 'draft' | 'published') => {
    if (!eventForm.eventName.trim()) return

    // Apply bulk settings to participants that haven't been individually overridden
    const finalParticipants = participants.map(p => ({
      ...p,
      bookParking: p.bookParking || bulkSettings.bookParking,
      useWifi: p.useWifi || bulkSettings.useWifi,
      useLocker: p.useLocker || bulkSettings.useLocker,
      needIdVerification: p.needIdVerification || bulkSettings.needIdVerification,
    }))

    const payload = {
      eventName: eventForm.eventName.trim(),
      eventDate: eventForm.eventDate,
      eventTime: eventForm.eventTime,
      eventEndTime: eventForm.eventEndTime || undefined,
      eventLocation: eventForm.eventLocation,
      eventDescription: eventForm.eventDescription || undefined,
      organizer: 'Admin',
      organizerId: 'admin',
      tenantId,
      status,
      participants: finalParticipants,
    }

    if (editingEventId) {
      updateEvent(editingEventId, payload)
    } else {
      addEvent(payload)
    }

    closeModal()
  }, [eventForm, participants, bulkSettings, editingEventId, tenantId, addEvent, updateEvent, closeModal])

  // =========================================================================
  // Participants
  // =========================================================================

  const addIndividualParticipant = useCallback(() => {
    if (!indivName.trim() || !indivEmail.trim()) return
    const p: EventParticipant = {
      ...createEmptyParticipant(),
      name: indivName.trim(),
      email: indivEmail.trim(),
      company: indivCompany.trim(),
    }
    setParticipants(prev => [...prev, p])
    setIndivName('')
    setIndivEmail('')
    setIndivCompany('')
  }, [indivName, indivEmail, indivCompany])

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id))
    if (expandedParticipantId === id) setExpandedParticipantId(null)
  }, [expandedParticipantId])

  const updateParticipantField = useCallback((id: string, field: keyof EventParticipant, value: unknown) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }, [])

  // =========================================================================
  // CSV parsing
  // =========================================================================

  const handleCsvUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      if (!text) return

      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
      if (lines.length < 2) {
        setCsvState({ fileName: file.name, parsedRows: [], errorCount: 0, isParsed: true })
        return
      }

      // Skip header
      const dataLines = lines.slice(1)
      const parsed: Array<{ name: string; email: string; company: string }> = []
      let errors = 0

      for (const line of dataLines) {
        const parts = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''))
        if (parts.length >= 2 && parts[0] && parts[1]) {
          parsed.push({
            name: parts[0],
            email: parts[1],
            company: parts[2] || '',
          })
        } else {
          errors++
        }
      }

      setCsvState({ fileName: file.name, parsedRows: parsed, errorCount: errors, isParsed: true })
    }
    reader.readAsText(file)

    // Reset input so the same file can be re-selected
    if (csvInputRef.current) csvInputRef.current.value = ''
  }, [])

  const importCsvParticipants = useCallback(() => {
    const newParticipants: EventParticipant[] = csvState.parsedRows.map(row => ({
      ...createEmptyParticipant(),
      name: row.name,
      email: row.email,
      company: row.company,
    }))
    setParticipants(prev => [...prev, ...newParticipants])
    setCsvState(defaultCsvState)
  }, [csvState.parsedRows])

  // =========================================================================
  // Delete
  // =========================================================================

  const handleDelete = useCallback((id: string) => {
    deleteEvent(id)
    setDeleteConfirmId(null)
    if (expandedEventId === id) setExpandedEventId(null)
  }, [deleteEvent, expandedEventId])

  // =========================================================================
  // Toggle event status
  // =========================================================================

  const toggleEventStatus = useCallback((event: EventInvitation) => {
    if (event.status === 'published') {
      updateEvent(event.id, { status: 'cancelled' })
    } else if (event.status === 'draft' || event.status === 'cancelled') {
      updateEvent(event.id, { status: 'published' })
    }
  }, [updateEvent])

  // =========================================================================
  // Calendar helpers
  // =========================================================================

  const calendarEvents = useMemo(() => {
    const map: Record<number, EventInvitation[]> = {}
    tenantEvents.forEach(e => {
      const d = new Date(e.eventDate)
      if (d.getMonth() === calendarMonth && d.getFullYear() === calendarYear) {
        const day = d.getDate()
        if (!map[day]) map[day] = []
        map[day].push(e)
      }
    })
    return map
  }, [tenantEvents, calendarMonth, calendarYear])

  const prevMonth = useCallback(() => {
    setSelectedCalendarDay(null)
    if (calendarMonth === 0) {
      setCalendarMonth(11)
      setCalendarYear(y => y - 1)
    } else {
      setCalendarMonth(m => m - 1)
    }
  }, [calendarMonth])

  const nextMonth = useCallback(() => {
    setSelectedCalendarDay(null)
    if (calendarMonth === 11) {
      setCalendarMonth(0)
      setCalendarYear(y => y + 1)
    } else {
      setCalendarMonth(m => m + 1)
    }
  }, [calendarMonth])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  // =========================================================================
  // Inline styles
  // =========================================================================

  const pageStyle: React.CSSProperties = {
    fontFamily: FONT,
    color: COLORS.text,
    minHeight: '100vh',
  }

  const cardStyle: React.CSSProperties = {
    background: COLORS.cardBg,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: '12px',
    padding: '24px',
  }

  const btnPrimary: React.CSSProperties = {
    background: COLORS.blue,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: FONT,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  }

  const btnSecondary: React.CSSProperties = {
    background: 'transparent',
    color: COLORS.secondary,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: FONT,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  }

  const btnDanger: React.CSSProperties = {
    background: 'rgba(239, 68, 68, 0.15)',
    color: COLORS.red,
    border: `1px solid ${COLORS.red}33`,
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: FONT,
    cursor: 'pointer',
  }

  const btnGreen: React.CSSProperties = {
    background: COLORS.green,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: FONT,
    cursor: 'pointer',
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    fontFamily: FONT,
    color: COLORS.text,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '32px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.secondary,
    marginBottom: '6px',
    display: 'block',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  }

  const statCardStyle = (accentColor: string): React.CSSProperties => ({
    ...cardStyle,
    background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
    border: `1px solid ${accentColor}30`,
    flex: 1,
    minWidth: '180px',
  })

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div style={pageStyle}>
      {/* ================================================================ */}
      {/* HEADER                                                          */}
      {/* ================================================================ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: COLORS.text }}>
            Event Management
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: COLORS.muted }}>
            Create and manage events with participant handling
          </p>
        </div>
        <button style={btnPrimary} onClick={openCreateModal}>
          + Create Event
        </button>
      </div>

      {/* ================================================================ */}
      {/* STAT CARDS                                                      */}
      {/* ================================================================ */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Events', value: stats.total, color: COLORS.blue },
          { label: 'Upcoming', value: stats.upcoming, color: COLORS.purple },
          { label: 'Published', value: stats.published, color: COLORS.green },
          { label: 'Draft', value: stats.draft, color: COLORS.secondary },
        ].map(({ label, value, color }) => (
          <div key={label} style={statCardStyle(color)}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ================================================================ */}
      {/* FILTER BAR                                                      */}
      {/* ================================================================ */}
      <div style={{ ...cardStyle, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Date filter pills */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '3px' }}>
          {(['today', 'thisWeek', 'thisMonth', 'custom'] as DateFilterOption[]).map(opt => (
            <button
              key={opt}
              onClick={() => setDateFilter(opt)}
              style={{
                background: dateFilter === opt ? COLORS.blue : 'transparent',
                color: dateFilter === opt ? '#fff' : COLORS.secondary,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: FONT,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {opt === 'thisWeek' ? 'This Week' : opt === 'thisMonth' ? 'This Month' : opt === 'custom' ? 'Custom Range' : 'Today'}
            </button>
          ))}
        </div>

        {/* Custom date pickers */}
        {dateFilter === 'custom' && (
          <>
            <input
              type="date"
              value={customFrom}
              onChange={e => setCustomFrom(e.target.value)}
              style={{ ...inputStyle, width: '160px' }}
              placeholder="From"
            />
            <input
              type="date"
              value={customTo}
              onChange={e => setCustomTo(e.target.value)}
              style={{ ...inputStyle, width: '160px' }}
              placeholder="To"
            />
          </>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '220px' }}>
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: COLORS.muted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            style={{ ...inputStyle, paddingLeft: '36px' }}
          />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '3px' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              background: viewMode === 'list' ? COLORS.blue : 'transparent',
              color: viewMode === 'list' ? '#fff' : COLORS.secondary,
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: FONT,
              cursor: 'pointer',
            }}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            style={{
              background: viewMode === 'calendar' ? COLORS.blue : 'transparent',
              color: viewMode === 'calendar' ? '#fff' : COLORS.secondary,
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: FONT,
              cursor: 'pointer',
            }}
          >
            Calendar
          </button>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          style={{ ...selectStyle, width: '160px' }}
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ================================================================ */}
      {/* LIST VIEW                                                       */}
      {/* ================================================================ */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredEvents.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>📅</div>
              <div style={{ fontSize: '16px', color: COLORS.secondary, marginBottom: '4px' }}>No events found</div>
              <div style={{ fontSize: '13px', color: COLORS.muted }}>Try adjusting your filters or create a new event.</div>
            </div>
          )}

          {filteredEvents.map(event => (
            <div key={event.id}>
              {/* Event Card */}
              <div
                style={{
                  ...cardStyle,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                  borderColor: expandedEventId === event.id ? COLORS.blue : COLORS.cardBorder,
                }}
                onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: COLORS.text }}>
                        {event.eventName}
                      </h3>
                      <span style={statusBadgeStyle(event.status)}>{event.status}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', color: COLORS.secondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.eventDate)}
                      </span>
                      <span style={{ fontSize: '13px', color: COLORS.secondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(event.eventTime)}{event.eventEndTime ? ` - ${formatTime(event.eventEndTime)}` : ''}
                      </span>
                      <span style={{ fontSize: '13px', color: COLORS.secondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.eventLocation}
                      </span>
                      <span style={{ fontSize: '13px', color: COLORS.secondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Card actions */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                    <button
                      style={{ ...btnSecondary, padding: '8px 14px', fontSize: '13px' }}
                      onClick={() => openEditModal(event)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        ...btnSecondary,
                        padding: '8px 14px',
                        fontSize: '13px',
                        color: event.status === 'published' ? COLORS.yellow : COLORS.green,
                        borderColor: event.status === 'published' ? `${COLORS.yellow}40` : `${COLORS.green}40`,
                      }}
                      onClick={() => toggleEventStatus(event)}
                      disabled={event.status === 'completed'}
                    >
                      {event.status === 'published' ? 'Cancel' : 'Publish'}
                    </button>
                    {deleteConfirmId === event.id ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: COLORS.red }}>Delete?</span>
                        <button style={{ ...btnDanger, padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDelete(event.id)}>
                          Yes
                        </button>
                        <button style={{ ...btnSecondary, padding: '6px 12px', fontSize: '12px' }} onClick={() => setDeleteConfirmId(null)}>
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        style={{ ...btnDanger, padding: '8px 14px', fontSize: '13px' }}
                        onClick={() => setDeleteConfirmId(event.id)}
                      >
                        Delete
                      </button>
                    )}
                    <svg
                      style={{
                        width: '20px',
                        height: '20px',
                        color: COLORS.muted,
                        transition: 'transform 0.2s',
                        transform: expandedEventId === event.id ? 'rotate(180deg)' : 'rotate(0deg)',
                        marginLeft: '4px',
                        cursor: 'pointer',
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded participant table */}
              {expandedEventId === event.id && (
                <div style={{ ...cardStyle, marginTop: '2px', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px', color: COLORS.text }}>
                    Participants ({event.participants.length})
                  </h4>
                  {event.participants.length === 0 ? (
                    <div style={{ fontSize: '13px', color: COLORS.muted, textAlign: 'center', padding: '20px' }}>
                      No participants added yet.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr>
                            {['Name', 'Email', 'Company', 'Status', 'Services', 'Dietary', 'Actions'].map(h => (
                              <th key={h} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${COLORS.cardBorder}`, fontSize: '11px', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {event.participants.map(p => (
                            <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.cardBorder}08` }}>
                              <td style={{ padding: '10px 12px', color: COLORS.text }}>{p.name}</td>
                              <td style={{ padding: '10px 12px', color: COLORS.secondary }}>{p.email}</td>
                              <td style={{ padding: '10px 12px', color: COLORS.secondary }}>{p.company || '-'}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={participantStatusBadge(p.status)}>{p.status}</span>
                              </td>
                              <td style={{ padding: '10px 12px' }}>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  {p.bookParking && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', background: 'rgba(59,130,246,0.12)', color: COLORS.blue, padding: '2px 8px', borderRadius: '4px' }}><VehicleCarParkingRegular style={{ width: '12px', height: '12px' }} /> Parking</span>}
                                  {p.useWifi && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', background: 'rgba(139,92,246,0.12)', color: COLORS.purple, padding: '2px 8px', borderRadius: '4px' }}><Wifi1Regular style={{ width: '12px', height: '12px' }} /> WiFi</span>}
                                  {p.useLocker && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', background: 'rgba(212,168,71,0.12)', color: COLORS.yellow, padding: '2px 8px', borderRadius: '4px' }}><LockClosedRegular style={{ width: '12px', height: '12px' }} /> Locker</span>}
                                  {p.needIdVerification && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', background: 'rgba(16,185,129,0.12)', color: COLORS.green, padding: '2px 8px', borderRadius: '4px' }}><ShieldCheckmarkRegular style={{ width: '12px', height: '12px' }} /> ID</span>}
                                  {!p.bookParking && !p.useWifi && !p.useLocker && !p.needIdVerification && <span style={{ color: COLORS.muted }}>-</span>}
                                </div>
                              </td>
                              <td style={{ padding: '10px 12px', color: COLORS.secondary }}>{p.dietaryRequirements || '-'}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <button
                                  style={{ ...btnSecondary, padding: '4px 10px', fontSize: '12px' }}
                                  onClick={() => openEditModal(event)}
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/* CALENDAR VIEW                                                   */}
      {/* ================================================================ */}
      {viewMode === 'calendar' && (
        <div style={cardStyle}>
          {/* Calendar header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <button style={{ ...btnSecondary, padding: '8px 14px' }} onClick={prevMonth}>
              <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: COLORS.text }}>
              {monthNames[calendarMonth]} {calendarYear}
            </h3>
            <button style={{ ...btnSecondary, padding: '8px 14px' }} onClick={nextMonth}>
              <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: COLORS.muted, padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {/* Empty cells for offset */}
            {Array.from({ length: getFirstDayOfMonth(calendarYear, calendarMonth) }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: '90px', background: 'rgba(255,255,255,0.01)', borderRadius: '6px' }} />
            ))}

            {/* Day cells */}
            {Array.from({ length: getDaysInMonth(calendarYear, calendarMonth) }).map((_, i) => {
              const day = i + 1
              const dayEvents = calendarEvents[day] || []
              const isToday = day === now.getDate() && calendarMonth === now.getMonth() && calendarYear === now.getFullYear()
              const isSelected = selectedCalendarDay === day

              return (
                <div
                  key={day}
                  onClick={() => setSelectedCalendarDay(isSelected ? null : day)}
                  style={{
                    minHeight: '90px',
                    background: isSelected ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                    borderRadius: '6px',
                    padding: '8px',
                    cursor: dayEvents.length > 0 ? 'pointer' : 'default',
                    border: isToday ? `1px solid ${COLORS.blue}40` : isSelected ? `1px solid ${COLORS.blue}` : '1px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    fontSize: '13px',
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? COLORS.blue : COLORS.secondary,
                    marginBottom: '6px',
                  }}>
                    {day}
                  </div>
                  {dayEvents.slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '3px',
                        fontSize: '11px',
                        color: COLORS.text,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: ev.status === 'published' ? COLORS.blue :
                          ev.status === 'draft' ? COLORS.secondary :
                          ev.status === 'completed' ? COLORS.green : COLORS.red,
                      }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.eventName}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div style={{ fontSize: '10px', color: COLORS.muted }}>+{dayEvents.length - 3} more</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Selected day detail */}
          {selectedCalendarDay !== null && calendarEvents[selectedCalendarDay] && calendarEvents[selectedCalendarDay].length > 0 && (
            <div style={{ marginTop: '20px', borderTop: `1px solid ${COLORS.cardBorder}`, paddingTop: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px', color: COLORS.text }}>
                Events on {monthNames[calendarMonth]} {selectedCalendarDay}, {calendarYear}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {calendarEvents[selectedCalendarDay].map(ev => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px 16px', border: `1px solid ${COLORS.cardBorder}` }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: COLORS.text, marginBottom: '4px' }}>
                        {ev.eventName}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.secondary }}>
                        {formatTime(ev.eventTime)}{ev.eventEndTime ? ` - ${formatTime(ev.eventEndTime)}` : ''} &middot; {ev.eventLocation} &middot; {ev.participants.length} participant{ev.participants.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={statusBadgeStyle(ev.status)}>{ev.status}</span>
                      <button style={{ ...btnSecondary, padding: '6px 12px', fontSize: '12px' }} onClick={() => openEditModal(ev)}>
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* CREATE / EDIT MODAL                                             */}
      {/* ================================================================ */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          overflowY: 'auto',
          padding: '40px 20px',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '860px',
            background: COLORS.cardBg,
            borderRadius: '16px',
            border: `1px solid ${COLORS.cardBorder}`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: `1px solid ${COLORS.cardBorder}` }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: COLORS.text }}>
                {editingEventId ? 'Edit Event' : 'Create Event'}
              </h2>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', color: COLORS.muted, fontSize: '24px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '28px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {/* ---- Event Details ---- */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px', color: COLORS.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg style={{ width: '18px', height: '18px', color: COLORS.blue }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Event Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Event Name *</label>
                    <input
                      type="text"
                      value={eventForm.eventName}
                      onChange={e => setEventForm(f => ({ ...f, eventName: e.target.value }))}
                      placeholder="e.g. Q1 All-Hands Meeting"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input
                      type="date"
                      value={eventForm.eventDate}
                      onChange={e => setEventForm(f => ({ ...f, eventDate: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Start Time</label>
                      <input
                        type="time"
                        value={eventForm.eventTime}
                        onChange={e => setEventForm(f => ({ ...f, eventTime: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>End Time</label>
                      <input
                        type="time"
                        value={eventForm.eventEndTime}
                        onChange={e => setEventForm(f => ({ ...f, eventEndTime: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Location</label>
                    <input
                      type="text"
                      value={eventForm.eventLocation}
                      onChange={e => setEventForm(f => ({ ...f, eventLocation: e.target.value }))}
                      placeholder="e.g. Conference Room A"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      value={eventForm.eventDescription}
                      onChange={e => setEventForm(f => ({ ...f, eventDescription: e.target.value }))}
                      placeholder="Event description..."
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' as const }}
                    />
                  </div>
                </div>
              </div>

              {/* ---- Participant Management ---- */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px', color: COLORS.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg style={{ width: '18px', height: '18px', color: COLORS.purple }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Participant Management
                </h3>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '3px', width: 'fit-content' }}>
                  <button
                    onClick={() => setParticipantTab('individual')}
                    style={{
                      background: participantTab === 'individual' ? COLORS.blue : 'transparent',
                      color: participantTab === 'individual' ? '#fff' : COLORS.secondary,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      fontFamily: FONT,
                      cursor: 'pointer',
                    }}
                  >
                    Add Individual
                  </button>
                  <button
                    onClick={() => setParticipantTab('csv')}
                    style={{
                      background: participantTab === 'csv' ? COLORS.blue : 'transparent',
                      color: participantTab === 'csv' ? '#fff' : COLORS.secondary,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      fontFamily: FONT,
                      cursor: 'pointer',
                    }}
                  >
                    CSV Upload
                  </button>
                </div>

                {/* Add Individual tab */}
                {participantTab === 'individual' && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <label style={labelStyle}>Name</label>
                      <input
                        type="text"
                        value={indivName}
                        onChange={e => setIndivName(e.target.value)}
                        placeholder="Participant name"
                        style={inputStyle}
                        onKeyDown={e => { if (e.key === 'Enter') addIndividualParticipant() }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        value={indivEmail}
                        onChange={e => setIndivEmail(e.target.value)}
                        placeholder="participant@email.com"
                        style={inputStyle}
                        onKeyDown={e => { if (e.key === 'Enter') addIndividualParticipant() }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '140px' }}>
                      <label style={labelStyle}>Company</label>
                      <input
                        type="text"
                        value={indivCompany}
                        onChange={e => setIndivCompany(e.target.value)}
                        placeholder="Company name"
                        style={inputStyle}
                        onKeyDown={e => { if (e.key === 'Enter') addIndividualParticipant() }}
                      />
                    </div>
                    <button
                      style={{ ...btnPrimary, whiteSpace: 'nowrap', marginBottom: '0px' }}
                      onClick={addIndividualParticipant}
                    >
                      + Add Participant
                    </button>
                  </div>
                )}

                {/* CSV Upload tab */}
                {participantTab === 'csv' && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      border: `2px dashed ${COLORS.cardBorder}`,
                      borderRadius: '12px',
                      padding: '32px',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                    }}>
                      <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        style={{ display: 'none' }}
                      />
                      <svg style={{ width: '40px', height: '40px', color: COLORS.muted, margin: '0 auto 12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <button
                        style={btnPrimary}
                        onClick={() => csvInputRef.current?.click()}
                      >
                        Upload CSV File
                      </button>
                      <p style={{ fontSize: '12px', color: COLORS.muted, marginTop: '12px', marginBottom: 0 }}>
                        Upload CSV file with columns: <strong style={{ color: COLORS.secondary }}>name, email, company</strong>
                      </p>
                    </div>

                    {/* CSV preview */}
                    {csvState.isParsed && (
                      <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontSize: '14px', color: COLORS.text, fontWeight: 600 }}>
                              {csvState.fileName}
                            </span>
                            <span style={{ fontSize: '12px', color: COLORS.muted, marginLeft: '12px' }}>
                              {csvState.parsedRows.length} valid row{csvState.parsedRows.length !== 1 ? 's' : ''}
                            </span>
                            {csvState.errorCount > 0 && (
                              <span style={{ fontSize: '12px', color: COLORS.red, marginLeft: '12px' }}>
                                {csvState.errorCount} invalid row{csvState.errorCount !== 1 ? 's' : ''} skipped
                              </span>
                            )}
                          </div>
                        </div>

                        {csvState.parsedRows.length > 0 && (
                          <>
                            <div style={{ overflowX: 'auto', maxHeight: '200px', overflowY: 'auto', borderRadius: '8px', border: `1px solid ${COLORS.cardBorder}` }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                  <tr>
                                    {['Name', 'Email', 'Company'].map(h => (
                                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${COLORS.cardBorder}`, fontSize: '11px', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.03)', position: 'sticky' as const, top: 0 }}>
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {csvState.parsedRows.map((row, idx) => (
                                    <tr key={idx}>
                                      <td style={{ padding: '8px 12px', color: COLORS.text }}>{row.name}</td>
                                      <td style={{ padding: '8px 12px', color: COLORS.secondary }}>{row.email}</td>
                                      <td style={{ padding: '8px 12px', color: COLORS.secondary }}>{row.company || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                              <button
                                style={btnGreen}
                                onClick={importCsvParticipants}
                              >
                                Import {csvState.parsedRows.length} participant{csvState.parsedRows.length !== 1 ? 's' : ''}
                              </button>
                              <button
                                style={btnSecondary}
                                onClick={() => setCsvState(defaultCsvState)}
                              >
                                Discard
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Participant list table */}
                {participants.length > 0 && (
                  <div style={{ borderRadius: '10px', border: `1px solid ${COLORS.cardBorder}`, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${COLORS.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>
                        {participants.length} Participant{participants.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr>
                            {['Name', 'Email', 'Company', ''].map((h, i) => (
                              <th key={i} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${COLORS.cardBorder}`, fontSize: '11px', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.02)', position: 'sticky' as const, top: 0 }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map(p => (
                            <React.Fragment key={p.id}>
                              <tr style={{ borderBottom: `1px solid ${COLORS.cardBorder}15` }}>
                                <td style={{ padding: '10px 12px', color: COLORS.text }}>
                                  <button
                                    onClick={() => setExpandedParticipantId(expandedParticipantId === p.id ? null : p.id)}
                                    style={{ background: 'none', border: 'none', color: COLORS.text, cursor: 'pointer', fontFamily: FONT, fontSize: '13px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
                                  >
                                    <svg
                                      style={{ width: '12px', height: '12px', color: COLORS.muted, transition: 'transform 0.15s', transform: expandedParticipantId === p.id ? 'rotate(90deg)' : 'rotate(0deg)' }}
                                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    {p.name}
                                  </button>
                                </td>
                                <td style={{ padding: '10px 12px', color: COLORS.secondary }}>{p.email}</td>
                                <td style={{ padding: '10px 12px', color: COLORS.secondary }}>{p.company || '-'}</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                  <button
                                    onClick={() => removeParticipant(p.id)}
                                    style={{ background: 'none', border: 'none', color: COLORS.red, cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '4px' }}
                                    title="Remove participant"
                                  >
                                    &times;
                                  </button>
                                </td>
                              </tr>

                              {/* Expanded per-participant options */}
                              {expandedParticipantId === p.id && (
                                <tr>
                                  <td colSpan={4} style={{ padding: '0 12px 16px 36px', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ padding: '16px', borderRadius: '8px', border: `1px solid ${COLORS.cardBorder}`, background: 'rgba(255,255,255,0.01)' }}>
                                      {/* Service checkboxes */}
                                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                        {[
                                          { key: 'bookParking' as const, label: 'Book Parking' },
                                          { key: 'useWifi' as const, label: 'WiFi' },
                                          { key: 'useLocker' as const, label: 'Locker' },
                                          { key: 'needIdVerification' as const, label: 'ID Verification' },
                                        ].map(({ key, label }) => (
                                          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.secondary, cursor: 'pointer' }}>
                                            <input
                                              type="checkbox"
                                              checked={!!p[key]}
                                              onChange={e => updateParticipantField(p.id, key, e.target.checked)}
                                              style={{ accentColor: COLORS.blue }}
                                            />
                                            {label}
                                          </label>
                                        ))}
                                      </div>

                                      {/* Food allergy */}
                                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px', alignItems: 'center' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.secondary, cursor: 'pointer', minWidth: '160px' }}>
                                          <input
                                            type="checkbox"
                                            checked={!!p.hasFoodAllergy}
                                            onChange={e => updateParticipantField(p.id, 'hasFoodAllergy', e.target.checked)}
                                            style={{ accentColor: COLORS.yellow }}
                                          />
                                          Has Food Allergy
                                        </label>
                                        {p.hasFoodAllergy && (
                                          <input
                                            type="text"
                                            value={p.foodAllergyDetails || ''}
                                            onChange={e => updateParticipantField(p.id, 'foodAllergyDetails', e.target.value)}
                                            placeholder="Allergy details..."
                                            style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
                                          />
                                        )}
                                      </div>

                                      {/* Special assistance */}
                                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px', alignItems: 'center' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.secondary, cursor: 'pointer', minWidth: '190px' }}>
                                          <input
                                            type="checkbox"
                                            checked={!!p.needsSpecialAssistance}
                                            onChange={e => updateParticipantField(p.id, 'needsSpecialAssistance', e.target.checked)}
                                            style={{ accentColor: COLORS.purple }}
                                          />
                                          Needs Special Assistance
                                        </label>
                                        {p.needsSpecialAssistance && (
                                          <input
                                            type="text"
                                            value={p.specialAssistanceDetails || ''}
                                            onChange={e => updateParticipantField(p.id, 'specialAssistanceDetails', e.target.value)}
                                            placeholder="Assistance details..."
                                            style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
                                          />
                                        )}
                                      </div>

                                      {/* Dietary */}
                                      <div style={{ marginBottom: '12px' }}>
                                        <label style={labelStyle}>Dietary Requirements</label>
                                        <input
                                          type="text"
                                          value={p.dietaryRequirements || ''}
                                          onChange={e => updateParticipantField(p.id, 'dietaryRequirements', e.target.value)}
                                          placeholder="e.g. Vegetarian, Halal, Kosher..."
                                          style={inputStyle}
                                        />
                                      </div>

                                      {/* Custom questions */}
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                        {[1, 2, 3].map(n => (
                                          <div key={n}>
                                            <label style={labelStyle}>Custom Question {n}</label>
                                            <input
                                              type="text"
                                              value={(p as unknown as Record<string, unknown>)[`customQuestion${n}`] as string || ''}
                                              onChange={e => updateParticipantField(p.id, `customQuestion${n}` as keyof EventParticipant, e.target.value)}
                                              placeholder={`Question ${n}...`}
                                              style={inputStyle}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* ---- Bulk Settings ---- */}
              <div style={{ marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px', color: COLORS.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg style={{ width: '18px', height: '18px', color: COLORS.green }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Bulk Settings
                </h3>
                <p style={{ fontSize: '12px', color: COLORS.muted, margin: '0 0 14px' }}>
                  Default settings applied to all participants unless overridden individually.
                </p>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'bookParking' as const, label: 'Book Parking' },
                    { key: 'useWifi' as const, label: 'WiFi Access' },
                    { key: 'useLocker' as const, label: 'Locker' },
                    { key: 'needIdVerification' as const, label: 'ID Verification' },
                  ].map(({ key, label }) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.secondary, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={bulkSettings[key]}
                        onChange={e => setBulkSettings(s => ({ ...s, [key]: e.target.checked }))}
                        style={{ accentColor: COLORS.green }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', padding: '20px 28px', borderTop: `1px solid ${COLORS.cardBorder}` }}>
              <button style={btnSecondary} onClick={closeModal}>
                Cancel
              </button>
              <button
                style={{ ...btnSecondary, color: COLORS.yellow, borderColor: `${COLORS.yellow}40` }}
                onClick={() => saveEvent('draft')}
              >
                Save as Draft
              </button>
              <button style={btnGreen} onClick={() => saveEvent('published')}>
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
