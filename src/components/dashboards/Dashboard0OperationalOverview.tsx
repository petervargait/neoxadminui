'use client'

import React from 'react'
import { DASH } from '../charts/DashboardCharts'
import { ExternalSystem, Ticket } from '../../context/GlobalStateContext'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  externalSystems: ExternalSystem[]
  tickets: Ticket[]
}

// ─── RAG Status Type ──────────────────────────────────────────────────────────
type RAGStatus = 'green' | 'amber' | 'red'

// ─── Domain Mapping ───────────────────────────────────────────────────────────
const DOMAIN_MAP: Record<string, string> = {
  'IoT Sensors': 'IoT',
  'AV/UC': 'AV/VC',
  'Parking': 'Parking',
  'Visitor Management': 'Visitor Management',
  'Lockers': 'Lockers',
  'Mobile App': '__mobile_app__',
  'Elevator': 'Elevator',
  'Access Control': 'Access Control',
  'BMS': 'BMS',
  'Digital Badge': 'Digital Badge',
  'Ticketing': 'Ticketing',
  'Restaurant': 'Restaurant',
  'Waste Management': 'Waste Management',
}

// ─── Service Definitions ──────────────────────────────────────────────────────
interface ServiceDef {
  name: string
  icon: React.ReactNode
}

function makeIcon(path: string) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={path} stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SERVICES: ServiceDef[] = [
  {
    name: 'Parking',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="3" stroke={DASH.label} strokeWidth="1.8" />
        <circle cx="7.5" cy="18" r="1.5" stroke={DASH.label} strokeWidth="1.8" />
        <circle cx="16.5" cy="18" r="1.5" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M5 6L7 3h10l2 3" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 10h4" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Visitor Management',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3" stroke={DASH.label} strokeWidth="1.8" />
        <circle cx="17" cy="9" r="2.5" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M17 14a3.5 3.5 0 0 1 3.5 3.5V21" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Lockers',
    icon: makeIcon('M17 11V7a5 5 0 0 0-10 0v4M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM12 15v3'),
  },
  {
    name: 'IoT Sensors',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="5" width="14" height="14" rx="2" stroke={DASH.label} strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M5 9h14M9 5v14" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M2 2l3 3M22 2l-3 3M2 22l3-3M22 22l-3-3" stroke={DASH.label} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Mobile App',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="2" width="10" height="20" rx="2" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M11 18h2" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 5h10" stroke={DASH.label} strokeWidth="1.4" />
        <path d="M7 16h10" stroke={DASH.label} strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: 'Elevator',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="2" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M12 2v20M4 12h16" stroke={DASH.label} strokeWidth="1.4" />
        <path d="M8 8l-1.5-2L8 4" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8 16l-1.5 2L8 20" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M16 8l1.5-2L16 4" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M16 16l1.5 2L16 20" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Access Control',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7l-9-5z" stroke={DASH.label} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'BMS',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 21h18" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
        <rect x="5" y="7" width="14" height="14" rx="1" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M9 21v-5h6v5" stroke={DASH.label} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 2l-9 5h18l-9-5z" stroke={DASH.label} strokeWidth="1.8" strokeLinejoin="round" />
        <rect x="8" y="10" width="3" height="3" rx="0.5" stroke={DASH.label} strokeWidth="1.4" />
        <rect x="13" y="10" width="3" height="3" rx="0.5" stroke={DASH.label} strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: 'AV/UC',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="15" height="11" rx="2" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M17 8l5-3v10l-5-3V8z" stroke={DASH.label} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M6 19h8" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 15v4" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Digital Badge',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="3" stroke={DASH.label} strokeWidth="1.8" />
        <circle cx="12" cy="9" r="3" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M8 16h8" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 19h6" stroke={DASH.label} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M10 2v1.5h4V2" stroke={DASH.label} strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: 'Ticketing',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7z" stroke={DASH.label} strokeWidth="1.8" />
        <path d="M9 5v2M9 17v2M9 11v2" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="0.5 3" />
      </svg>
    ),
  },
  {
    name: 'Restaurant',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 3v7c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V3" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 3v18" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 3v4a4 4 0 0 1-4 4" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 3v18" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 11h4" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Waste Management',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7 7l1.5 12a2 2 0 0 0 2 1.75h3a2 2 0 0 0 2-1.75L17 7" stroke={DASH.label} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 7h14" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 3l1-1h4l1 1" stroke={DASH.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12l2.5-1.5L9 12l2.5-1.5L14 12l2.5-1.5L19 12" stroke={DASH.label} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

// ─── Helper: compute RAG status ───────────────────────────────────────────────
function computeRAG(serviceName: string, externalSystems: ExternalSystem[]): RAGStatus {
  if (serviceName === 'Mobile App') return 'green'

  const domainKey = DOMAIN_MAP[serviceName] || serviceName
  const matched = externalSystems.filter(
    (es) => es.domainType.toLowerCase() === domainKey.toLowerCase()
  )

  if (matched.length === 0) return 'red'
  if (matched.some((es) => es.status === 'inactive')) return 'red'
  if (matched.some((es) => es.status === 'maintenance')) return 'amber'
  if (matched.every((es) => es.status === 'active')) return 'green'
  return 'red'
}

// ─── Helper: find latest ticket for service ───────────────────────────────────
function findLatestTicket(serviceName: string, tickets: Ticket[]): Ticket | null {
  const domainKey = DOMAIN_MAP[serviceName] || serviceName
  const keywords = [serviceName.toLowerCase(), domainKey.toLowerCase()]

  const matched = tickets.filter((t) =>
    keywords.some((kw) => t.category.toLowerCase().includes(kw) || kw.includes(t.category.toLowerCase()))
  )

  if (matched.length === 0) return null

  return matched.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
}

// ─── Priority Colors ──────────────────────────────────────────────────────────
function priorityColor(priority: Ticket['priority']): string {
  switch (priority) {
    case 'critical': return DASH.red
    case 'high': return DASH.orange
    case 'medium': return DASH.gold
    case 'low': return DASH.blue
  }
}

function priorityBg(priority: Ticket['priority']): string {
  switch (priority) {
    case 'critical': return 'rgba(239,68,68,0.15)'
    case 'high': return 'rgba(249,115,22,0.15)'
    case 'medium': return 'rgba(201,150,59,0.15)'
    case 'low': return 'rgba(59,130,246,0.15)'
  }
}

// ─── RAG Colors ───────────────────────────────────────────────────────────────
function ragColor(status: RAGStatus): string {
  switch (status) {
    case 'green': return DASH.green
    case 'amber': return DASH.orange
    case 'red': return DASH.red
  }
}

function ragLabel(status: RAGStatus): string {
  switch (status) {
    case 'green': return 'Online'
    case 'amber': return 'Maintenance'
    case 'red': return 'Offline'
  }
}

function ragAnimation(status: RAGStatus): string {
  switch (status) {
    case 'green': return 'ragPulseGreen 2s infinite'
    case 'amber': return 'ragPulseAmber 2s infinite'
    case 'red': return 'ragPulseRed 2s infinite'
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard0OperationalOverview({ externalSystems, tickets }: Props) {
  // Compute RAG for all services
  const serviceData = SERVICES.map((svc) => ({
    ...svc,
    rag: computeRAG(svc.name, externalSystems),
    latestTicket: findLatestTicket(svc.name, tickets),
  }))

  // Summary counts
  const totalServices = serviceData.length
  const onlineCount = serviceData.filter((s) => s.rag === 'green').length
  const degradedCount = serviceData.filter((s) => s.rag === 'amber').length
  const offlineCount = serviceData.filter((s) => s.rag === 'red').length

  return (
    <div style={{ padding: '32px', minHeight: '100vh', background: DASH.pageBg }}>
      {/* Inline keyframe animations */}
      <style>{`
        @keyframes ragPulseGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
        }
        @keyframes ragPulseAmber {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(249,115,22,0); }
        }
        @keyframes ragPulseRed {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #F1F5F9, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            } as React.CSSProperties}
          >
            Operational Overview
          </h1>
          <p style={{ color: DASH.muted, fontSize: '14px', margin: '8px 0 0 0', fontWeight: 500 }}>
            Real-time service health across all integrated platforms
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15,26,46,0.6)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${DASH.cardBorder}`,
            borderRadius: '20px',
            padding: '8px 16px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: DASH.green,
              animation: 'ragPulseGreen 2s infinite',
            }}
          />
          <span style={{ color: DASH.label, fontSize: '13px', fontWeight: 500 }}>
            Last updated: Just now
          </span>
        </div>
      </div>

      {/* ─── Summary Stats Row ───────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Total Services', value: totalServices, color: DASH.blue, dotColor: DASH.blue },
          { label: 'Online', value: onlineCount, color: DASH.green, dotColor: DASH.green },
          { label: 'Degraded', value: degradedCount, color: DASH.orange, dotColor: DASH.orange },
          { label: 'Offline', value: offlineCount, color: DASH.red, dotColor: DASH.red },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(15,26,46,0.7)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${DASH.cardBorder}`,
              borderRadius: '24px',
              padding: '12px 24px',
              minWidth: '160px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: stat.dotColor,
                flexShrink: 0,
                boxShadow: `0 0 8px ${stat.dotColor}40`,
              }}
            />
            <div>
              <div style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ color: DASH.label, fontSize: '12px', fontWeight: 500, marginTop: '2px' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Service Cards Grid ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {serviceData.map((svc, index) => {
          const color = ragColor(svc.rag)
          const statusLabel = ragLabel(svc.rag)
          const pulse = ragAnimation(svc.rag)
          const ticket = svc.latestTicket

          return (
            <div
              key={svc.name}
              style={{
                animation: 'fadeInUp 0.6s ease-out forwards',
                animationDelay: `${index * 0.06}s`,
                opacity: 0,
              }}
            >
              {/* Gradient border wrapper */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(30,58,95,0.6), rgba(59,130,246,0.15))',
                  borderRadius: '16px',
                  padding: '1px',
                }}
              >
                {/* Inner glass card */}
                <div
                  style={{
                    background: 'rgba(15, 26, 46, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '15px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    minHeight: '220px',
                  }}
                >
                  {/* ── Top Row: Icon + Name + RAG Dot ── */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Icon background */}
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: DASH.cardBg2,
                          border: `1px solid ${DASH.cardBorder}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {svc.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            color: DASH.textWhite,
                            fontSize: '16px',
                            fontWeight: 700,
                            lineHeight: 1.2,
                          }}
                        >
                          {svc.name}
                        </div>
                        <div
                          style={{
                            color,
                            fontSize: '13px',
                            fontWeight: 600,
                            marginTop: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {statusLabel}
                        </div>
                      </div>
                    </div>
                    {/* Pulsing RAG dot */}
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: color,
                        animation: pulse,
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${color}60`,
                      }}
                    />
                  </div>

                  {/* ── Ticket Preview ── */}
                  <div
                    style={{
                      flex: 1,
                      background: 'rgba(22,32,50,0.6)',
                      borderRadius: '10px',
                      border: `1px solid ${DASH.cardBorder2}`,
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {ticket ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span
                            style={{
                              color: DASH.blue,
                              fontSize: '12px',
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              letterSpacing: '0.3px',
                            }}
                          >
                            {ticket.ticketNumber}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: priorityColor(ticket.priority),
                              background: priorityBg(ticket.priority),
                              padding: '2px 10px',
                              borderRadius: '10px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                        <div
                          style={{
                            color: DASH.text,
                            fontSize: '13px',
                            fontWeight: 500,
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ticket.title}
                        </div>
                        <div style={{ color: DASH.muted, fontSize: '11px' }}>
                          {ticket.status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())} &middot;{' '}
                          {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          color: DASH.muted,
                          fontSize: '13px',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          padding: '8px 0',
                        }}
                      >
                        No recent tickets
                      </div>
                    )}
                  </div>

                  {/* ── View Dashboard Button ── */}
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      background: 'transparent',
                      border: `1px solid ${DASH.blue}`,
                      borderRadius: '20px',
                      padding: '8px 20px',
                      color: DASH.blue,
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(59,130,246,0.12)'
                      e.currentTarget.style.borderColor = DASH.blue
                      e.currentTarget.style.color = DASH.blue
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = DASH.blue
                      e.currentTarget.style.color = DASH.blue
                    }}
                  >
                    View Dashboard
                    <span style={{ fontSize: '15px', marginTop: '-1px' }}>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
