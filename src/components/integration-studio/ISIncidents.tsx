'use client'

import React, { useState } from 'react'
import {
  IS,
  ISCard,
  ISTable,
  ISModal,
  ISInput,
  ISSelect,
  ISButton,
  JsonPreview,
  ISTableColumn,
} from './ISShared'

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = 'S1' | 'S2' | 'S3' | 'S4'
type IncidentState = 'Open' | 'Acknowledged' | 'Resolved'

interface TimelineEntry {
  at: string
  actor: string
  action: string
}

interface LinkedLog {
  timestamp: string
  operation: string
  httpStatus: number
  correlationId: string
  error: string
}

interface Incident {
  id: string
  errorSignature: string
  severity: Severity
  connector: string
  count: number
  state: IncidentState
  assignedTo: string
  created: string
  notes: string
  timeline: TimelineEntry[]
  linkedLogs: LinkedLog[]
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-0042',
    errorSignature: 'Siemens Desigo INTERNAL_SERVER_ERROR on getAlarms',
    severity: 'S1',
    connector: 'Siemens Desigo',
    count: 214,
    state: 'Open',
    assignedTo: 'Unassigned',
    created: '2026-03-05 10:30:00',
    notes: 'Ongoing since 10:30. Siemens Desigo BACnet gateway returning 500 intermittently. Escalated to BMS team.',
    timeline: [
      { at: '2026-03-05 10:30:00', actor: 'System',       action: 'Incident auto-created from error spike (threshold: >50 errors/10min)' },
      { at: '2026-03-05 10:35:12', actor: 'System',       action: 'PagerDuty alert dispatched to on-call engineer' },
      { at: '2026-03-05 10:42:00', actor: 'jane.doe',     action: 'Acknowledged the incident' },
      { at: '2026-03-05 11:00:00', actor: 'jane.doe',     action: 'Note: Rolling back Siemens connector to v1.8.0' },
    ],
    linkedLogs: [
      { timestamp: '2026-03-05 14:50:00', operation: 'getAlarms',         httpStatus: 500, correlationId: 'cid-q7r8s9t0', error: 'BACnet gateway connection timeout' },
      { timestamp: '2026-03-05 14:48:00', operation: 'acknowledgeAlarm',  httpStatus: 500, correlationId: 'cid-ab12cd34', error: 'BACnet gateway connection timeout' },
      { timestamp: '2026-03-05 14:46:00', operation: 'getZoneStatus',     httpStatus: 500, correlationId: 'cid-ef56gh78', error: 'BACnet gateway connection timeout' },
    ],
  },
  {
    id: 'INC-0041',
    errorSignature: 'HikCentral GATEWAY_TIMEOUT on getEvents',
    severity: 'S1',
    connector: 'HikCentral',
    count: 341,
    state: 'Acknowledged',
    assignedTo: 'bob.smith',
    created: '2026-03-05 01:05:00',
    notes: 'HikCentral backend not responding within 5s. Infrastructure team investigating network path to on-premise server.',
    timeline: [
      { at: '2026-03-05 01:05:00', actor: 'System',   action: 'Incident auto-created from error spike' },
      { at: '2026-03-05 01:10:00', actor: 'bob.smith', action: 'Acknowledged the incident' },
      { at: '2026-03-05 02:00:00', actor: 'bob.smith', action: 'Note: Working with site IT to check VPN tunnel to HikCentral server' },
      { at: '2026-03-05 08:00:00', actor: 'bob.smith', action: 'Note: No resolution yet. Monitoring continues.' },
    ],
    linkedLogs: [
      { timestamp: '2026-03-05 14:35:00', operation: 'getEvents',       httpStatus: 500, correlationId: 'cid-k7l8m9n0', error: 'Gateway timeout 5000ms exceeded' },
      { timestamp: '2026-03-05 13:35:00', operation: 'getDeviceStatus', httpStatus: 500, correlationId: 'cid-op90qr12', error: 'Gateway timeout 5000ms exceeded' },
    ],
  },
  {
    id: 'INC-0040',
    errorSignature: 'Haltian IoT RATE_LIMIT_EXCEEDED on getOccupancy',
    severity: 'S2',
    connector: 'Haltian IoT',
    count: 63,
    state: 'Acknowledged',
    assignedTo: 'carol.white',
    created: '2026-03-05 14:38:00',
    notes: 'Rate limit hit during high-frequency polling. Backoff strategy applied but sensor data is delayed.',
    timeline: [
      { at: '2026-03-05 14:38:00', actor: 'System',       action: 'Incident created from HTTP 429 spike' },
      { at: '2026-03-05 14:40:00', actor: 'carol.white',  action: 'Acknowledged the incident' },
      { at: '2026-03-05 14:45:00', actor: 'carol.white',  action: 'Note: Reducing polling frequency from */2 to */5 minutes' },
    ],
    linkedLogs: [
      { timestamp: '2026-03-05 14:40:20', operation: 'getOccupancy',     httpStatus: 429, correlationId: 'cid-g3h4i5j6', error: 'Rate limit exceeded, retry after 60s' },
      { timestamp: '2026-03-05 14:36:00', operation: 'getSensorReadings', httpStatus: 429, correlationId: 'cid-u1v2w3x4', error: 'Rate limit exceeded, retry after 60s' },
    ],
  },
  {
    id: 'INC-0039',
    errorSignature: 'TDS Visitor high latency on checkInVisitor (>700ms)',
    severity: 'S3',
    connector: 'TDS Visitor',
    count: 47,
    state: 'Acknowledged',
    assignedTo: 'dave.jones',
    created: '2026-03-05 12:00:00',
    notes: 'P95 latency elevated. TDS API performance degraded during peak visitor check-in hours.',
    timeline: [
      { at: '2026-03-05 12:00:00', actor: 'System',     action: 'Incident created from p95 latency threshold breach (>700ms)' },
      { at: '2026-03-05 12:15:00', actor: 'dave.jones', action: 'Acknowledged the incident' },
    ],
    linkedLogs: [
      { timestamp: '2026-03-05 14:52:44', operation: 'checkInVisitor',     httpStatus: 200, correlationId: 'cid-m3n4o5p6', error: 'High latency: 721ms' },
      { timestamp: '2026-03-05 13:10:00', operation: 'createInvitation',   httpStatus: 200, correlationId: 'cid-st34uv56', error: 'High latency: 845ms' },
    ],
  },
  {
    id: 'INC-0038',
    errorSignature: 'Vecos Lockers assignLocker auth failure (403)',
    severity: 'S2',
    connector: 'Vecos Lockers',
    count: 12,
    state: 'Resolved',
    assignedTo: 'emily.chen',
    created: '2026-03-04 16:00:00',
    notes: 'Vecos API key expired. Rotated credentials via Vault. Issue resolved.',
    timeline: [
      { at: '2026-03-04 16:00:00', actor: 'System',      action: 'Incident created from HTTP 403 errors' },
      { at: '2026-03-04 16:05:00', actor: 'emily.chen',  action: 'Acknowledged the incident' },
      { at: '2026-03-04 16:30:00', actor: 'emily.chen',  action: 'Note: Identified expired Vecos API key in Vault secret' },
      { at: '2026-03-04 16:45:00', actor: 'emily.chen',  action: 'Rotated Vecos API key via Vault. Connector recovered.' },
      { at: '2026-03-04 16:46:00', actor: 'emily.chen',  action: 'Resolved the incident' },
    ],
    linkedLogs: [
      { timestamp: '2026-03-04 16:00:00', operation: 'assignLocker', httpStatus: 403, correlationId: 'cid-wx78yz90', error: 'Bad credentials – API key expired' },
    ],
  },
  {
    id: 'INC-0037',
    errorSignature: 'XYSense getOccupancy 422 validation error',
    severity: 'S4',
    connector: 'XYSense',
    count: 5,
    state: 'Resolved',
    assignedTo: 'frank.miller',
    created: '2026-03-04 09:00:00',
    notes: 'Malformed floor zone identifier sent by mapping rule. Fixed zone mapping configuration.',
    timeline: [
      { at: '2026-03-04 09:00:00', actor: 'System',        action: 'Incident created from HTTP 422 errors' },
      { at: '2026-03-04 09:10:00', actor: 'frank.miller',  action: 'Acknowledged the incident' },
      { at: '2026-03-04 09:40:00', actor: 'frank.miller',  action: 'Deployed fix for zone mapping. Incident resolved.' },
      { at: '2026-03-04 09:41:00', actor: 'frank.miller',  action: 'Resolved the incident' },
    ],
    linkedLogs: [
      { timestamp: '2026-03-04 09:00:00', operation: 'getOccupancy', httpStatus: 422, correlationId: 'cid-ab12ef34', error: 'Invalid zone identifier: zone_99 not found' },
    ],
  },
]

const ASSIGNEE_OPTIONS = [
  { value: 'Unassigned',   label: 'Unassigned'   },
  { value: 'jane.doe',     label: 'jane.doe'     },
  { value: 'bob.smith',    label: 'bob.smith'    },
  { value: 'carol.white',  label: 'carol.white'  },
  { value: 'dave.jones',   label: 'dave.jones'   },
  { value: 'emily.chen',   label: 'emily.chen'   },
  { value: 'frank.miller', label: 'frank.miller' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

const SEVERITY_CONFIG: Record<Severity, { color: string; label: string }> = {
  S1: { color: IS.red,    label: 'S1' },
  S2: { color: IS.orange, label: 'S2' },
  S3: { color: IS.yellow, label: 'S3' },
  S4: { color: IS.blue,   label: 'S4' },
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const { color, label } = SEVERITY_CONFIG[severity]
  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3px 10px',
      borderRadius: '20px',
      backgroundColor: `${color}20`,
      border: `1px solid ${color}45`,
      fontSize: '12px',
      fontWeight: 800,
      color,
      letterSpacing: '0.02em',
      minWidth: '36px',
    }}>
      {label}
    </span>
  )
}

function StateBadge({ state }: { state: IncidentState }) {
  const cfg: Record<IncidentState, { color: string }> = {
    Open:         { color: IS.red    },
    Acknowledged: { color: IS.yellow },
    Resolved:     { color: IS.green  },
  }
  const { color } = cfg[state]
  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '20px',
      backgroundColor: `${color}18`,
      border: `1px solid ${color}40`,
      fontSize: '12px',
      fontWeight: 600,
      color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 4px ${color}` }} />
      {state}
    </span>
  )
}

function HttpPill({ status }: { status: number }) {
  const color = status < 300 ? IS.green : status < 500 ? IS.yellow : IS.red
  return (
    <span style={{
      ...fontBase,
      fontFamily: 'monospace',
      fontSize: '11px',
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: '5px',
      backgroundColor: `${color}18`,
      border: `1px solid ${color}35`,
      color,
    }}>
      {status}
    </span>
  )
}

// ─── Expandable row detail ────────────────────────────────────────────────────

function IncidentDetail({
  incident,
  onAcknowledge,
  onResolve,
  onAssign,
}: {
  incident: Incident
  onAcknowledge: () => void
  onResolve: () => void
  onAssign: (assignee: string) => void
}) {
  const [assignee, setAssignee] = useState(incident.assignedTo)

  return (
    <div style={{
      padding: '20px 24px',
      backgroundColor: `${IS.blue}06`,
      borderTop: `1px solid ${IS.blue}30`,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Actions bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
        {incident.state === 'Open' && (
          <ISButton onClick={onAcknowledge}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Acknowledge
          </ISButton>
        )}
        {incident.state !== 'Resolved' && (
          <ISButton variant="secondary" onClick={onResolve}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Resolve
          </ISButton>
        )}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ width: '180px' }}>
            <ISSelect
              label="Assign to"
              value={assignee}
              options={ASSIGNEE_OPTIONS}
              onChange={setAssignee}
            />
          </div>
          <ISButton variant="secondary" onClick={() => onAssign(assignee)}>Assign</ISButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Timeline */}
        <div>
          <div style={{ ...fontBase, fontSize: '12px', fontWeight: 700, color: IS.label, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Timeline
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {incident.timeline.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                {/* Vertical line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: IS.blue,
                    border: `2px solid ${IS.cardBg}`,
                    boxShadow: `0 0 0 2px ${IS.blue}50`,
                    flexShrink: 0,
                    marginTop: '3px',
                  }} />
                  {i < incident.timeline.length - 1 && (
                    <div style={{ width: '2px', flex: 1, backgroundColor: `${IS.cardBorder}`, minHeight: '20px' }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ paddingBottom: i < incident.timeline.length - 1 ? '14px' : '0' }}>
                  <div style={{ ...fontBase, fontSize: '11px', color: IS.muted, marginBottom: '2px', fontFamily: 'monospace' }}>
                    {entry.at} &mdash; <span style={{ color: IS.cyan }}>{entry.actor}</span>
                  </div>
                  <div style={{ ...fontBase, fontSize: '12.5px', color: IS.text, lineHeight: 1.4 }}>{entry.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Linked logs + notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Notes */}
          <div>
            <div style={{ ...fontBase, fontSize: '12px', fontWeight: 700, color: IS.label, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Notes
            </div>
            <div style={{
              ...fontBase,
              fontSize: '13px',
              color: IS.text,
              lineHeight: 1.6,
              padding: '12px 14px',
              backgroundColor: IS.pageBg,
              borderRadius: '8px',
              border: `1px solid ${IS.cardBorder}40`,
            }}>
              {incident.notes}
            </div>
          </div>

          {/* Linked log entries */}
          <div>
            <div style={{ ...fontBase, fontSize: '12px', fontWeight: 700, color: IS.label, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Linked Log Entries ({incident.linkedLogs.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {incident.linkedLogs.map((log, i) => (
                <div key={i} style={{
                  padding: '10px 12px',
                  backgroundColor: IS.pageBg,
                  borderRadius: '8px',
                  border: `1px solid ${IS.cardBorder}40`,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center',
                }}>
                  <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '11px', color: IS.muted, minWidth: '140px' }}>{log.timestamp}</span>
                  <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '12px', color: IS.gold }}>{log.operation}</span>
                  <HttpPill status={log.httpStatus} />
                  <span style={{ ...fontBase, fontSize: '12px', color: IS.red, flex: 1 }}>{log.error}</span>
                  <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '11px', color: IS.cyan }}>{log.correlationId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ISIncidents() {
  const [incidents,    setIncidents]    = useState<Incident[]>(INITIAL_INCIDENTS)
  const [expandedId,   setExpandedId]   = useState<string | null>(null)
  const [assignModal,  setAssignModal]  = useState<{ open: boolean; incidentId: string }>({ open: false, incidentId: '' })

  const handleAcknowledge = (id: string) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id
        ? {
            ...inc,
            state: 'Acknowledged' as IncidentState,
            timeline: [...inc.timeline, {
              at: new Date().toISOString().replace('T', ' ').slice(0, 19),
              actor: 'current.user',
              action: 'Acknowledged the incident',
            }],
          }
        : inc
    ))
  }

  const handleResolve = (id: string) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id
        ? {
            ...inc,
            state: 'Resolved' as IncidentState,
            timeline: [...inc.timeline, {
              at: new Date().toISOString().replace('T', ' ').slice(0, 19),
              actor: 'current.user',
              action: 'Resolved the incident',
            }],
          }
        : inc
    ))
  }

  const handleAssign = (id: string, assignee: string) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id
        ? {
            ...inc,
            assignedTo: assignee,
            timeline: [...inc.timeline, {
              at: new Date().toISOString().replace('T', ' ').slice(0, 19),
              actor: 'current.user',
              action: `Assigned incident to ${assignee}`,
            }],
          }
        : inc
    ))
  }

  // Summary counts
  const openCount  = incidents.filter(i => i.state === 'Open').length
  const ackCount   = incidents.filter(i => i.state === 'Acknowledged').length
  const s1Count    = incidents.filter(i => i.severity === 'S1' && i.state !== 'Resolved').length

  const columns: ISTableColumn[] = [
    { key: 'id',             label: 'Incident ID',      width: '100px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '12px', color: IS.cyan, fontWeight: 700 }}>{v}</span>
    )},
    { key: 'errorSignature', label: 'Error Signature',              render: (v) => (
      <span style={{ ...fontBase, fontSize: '12.5px', color: IS.text }}>{v}</span>
    )},
    { key: 'severity',       label: 'Severity',         width: '80px',  render: (v) => (
      <SeverityBadge severity={v as Severity} />
    )},
    { key: 'connector',      label: 'Connector',        width: '110px', render: (v) => (
      <span style={{ ...fontBase, fontSize: '12px', color: IS.label, fontWeight: 600 }}>{v}</span>
    )},
    { key: 'count',          label: 'Count',            width: '70px',  render: (v) => (
      <span style={{ ...fontBase, fontSize: '13px', fontWeight: 700, color: IS.orange }}>{v}</span>
    )},
    { key: 'state',          label: 'State',            width: '130px', render: (v) => (
      <StateBadge state={v as IncidentState} />
    )},
    { key: 'assignedTo',     label: 'Assigned To',      width: '120px', render: (v) => (
      <span style={{ ...fontBase, fontSize: '12px', color: v === 'Unassigned' ? IS.muted : IS.text }}>
        {v === 'Unassigned' ? (
          <span style={{ fontStyle: 'italic' }}>Unassigned</span>
        ) : (
          <>
            <span style={{ marginRight: '5px', color: IS.blue }}>@</span>{String(v)}
          </>
        )}
      </span>
    )},
    { key: 'created',        label: 'Created',          width: '155px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '11.5px', color: IS.muted }}>{v}</span>
    )},
    { key: 'id',             label: '',                 width: '36px',  render: (_, row) => (
      <button
        onClick={e => { e.stopPropagation(); setExpandedId(prev => prev === row.id ? null : row.id as string) }}
        style={{
          background: 'none',
          border: `1px solid ${IS.inputBorder}`,
          borderRadius: '5px',
          color: expandedId === row.id ? IS.blue : IS.muted,
          cursor: 'pointer',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          padding: 0,
        }}
      >
        {expandedId === row.id ? '▲' : '▼'}
      </button>
    )},
  ]

  return (
    <div style={{
      ...fontBase,
      backgroundColor: IS.pageBg,
      minHeight: '100vh',
      padding: '28px',
      color: IS.text,
    }}>
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: `${IS.red}20`,
            border: `1px solid ${IS.red}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={IS.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <h1 style={{ ...fontBase, margin: 0, fontSize: '20px', fontWeight: 800, color: IS.textWhite, letterSpacing: '-0.01em' }}>
              Incident Management
            </h1>
            <p style={{ ...fontBase, margin: 0, fontSize: '13px', color: IS.muted, marginTop: '2px' }}>
              Track, acknowledge, and resolve integration incidents
            </p>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}>
        {[
          { label: 'Open',         value: openCount, color: IS.red    },
          { label: 'Acknowledged', value: ackCount,  color: IS.yellow },
          { label: 'S1 Active',    value: s1Count,   color: IS.red    },
          { label: 'Total',        value: incidents.length, color: IS.label },
        ].map(stat => (
          <div key={stat.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            backgroundColor: IS.cardBg,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '10px',
          }}>
            <span style={{ ...fontBase, fontSize: '22px', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</span>
            <span style={{ ...fontBase, fontSize: '12px', color: IS.muted, fontWeight: 600 }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Incidents table with expandable rows */}
      <ISCard title="Incidents">
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {columns.map((col, ci) => (
                  <th key={`${col.key}-${ci}`} style={{
                    width: col.width,
                    padding: '10px 14px',
                    textAlign: 'left',
                    color: IS.label,
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    backgroundColor: IS.cardBg2,
                    borderBottom: `1px solid ${IS.cardBorder}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc, i) => (
                <React.Fragment key={inc.id}>
                  <tr
                    style={{
                      backgroundColor:
                        expandedId === inc.id
                          ? `${IS.blue}0A`
                          : i % 2 === 0
                          ? 'transparent'
                          : `${IS.cardBg2}80`,
                      borderBottom: expandedId === inc.id
                        ? `1px solid ${IS.blue}30`
                        : `1px solid ${IS.cardBorder}40`,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {columns.map((col, ci) => (
                      <td key={`${col.key}-${ci}`} style={{ padding: '10px 14px', color: IS.text, verticalAlign: 'middle' }}>
                        {col.render ? col.render((inc as unknown as Record<string, unknown>)[col.key], inc as unknown as unknown as Record<string, unknown>) : String((inc as unknown as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                  {expandedId === inc.id && (
                    <tr>
                      <td colSpan={columns.length} style={{ padding: 0 }}>
                        <IncidentDetail
                          incident={inc}
                          onAcknowledge={() => handleAcknowledge(inc.id)}
                          onResolve={() => handleResolve(inc.id)}
                          onAssign={(assignee) => handleAssign(inc.id, assignee)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </ISCard>
    </div>
  )
}
