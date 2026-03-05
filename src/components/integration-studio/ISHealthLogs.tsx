'use client'

import React, { useState, useMemo } from 'react'
import {
  IS,
  ISCard,
  ISTable,
  ISTabBar,
  ISInput,
  ISSelect,
  StatusBadge,
  JsonPreview,
  ISTableColumn,
} from './ISShared'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConnectorHealth {
  connector: string
  status: 'ok' | 'warning' | 'critical' | 'inactive'
  lastSuccess: string
  errorRate: number
  latencyP95: number
  retries: number
  uptime: number
}

interface LogEntry {
  id: string
  timestamp: string
  connector: string
  operation: string
  status: 'ok' | 'warning' | 'critical' | 'inactive'
  httpStatus: number
  latency: number
  correlationId: string
  payload: Record<string, unknown>
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const HEALTH_DATA: ConnectorHealth[] = [
  { connector: 'Stripe',      status: 'ok',       lastSuccess: '2026-03-05 14:58:01', errorRate: 0.2,  latencyP95: 138,  retries: 3,   uptime: 99.97 },
  { connector: 'Salesforce',  status: 'warning',  lastSuccess: '2026-03-05 14:52:44', errorRate: 3.8,  latencyP95: 721,  retries: 47,  uptime: 98.21 },
  { connector: 'GitHub',      status: 'ok',       lastSuccess: '2026-03-05 14:57:55', errorRate: 0.0,  latencyP95: 204,  retries: 0,   uptime: 100.0 },
  { connector: 'HubSpot',     status: 'ok',       lastSuccess: '2026-03-05 14:55:12', errorRate: 0.5,  latencyP95: 312,  retries: 8,   uptime: 99.81 },
  { connector: 'QuickBooks',  status: 'critical', lastSuccess: '2026-03-05 10:30:00', errorRate: 18.4, latencyP95: 2910, retries: 214, uptime: 82.5  },
  { connector: 'Jira',        status: 'ok',       lastSuccess: '2026-03-05 14:58:10', errorRate: 0.1,  latencyP95: 178,  retries: 2,   uptime: 99.94 },
  { connector: 'Twilio',      status: 'inactive', lastSuccess: '2026-03-04 08:00:00', errorRate: 0.0,  latencyP95: 0,    retries: 0,   uptime: 0     },
  { connector: 'SendGrid',    status: 'warning',  lastSuccess: '2026-03-05 14:40:20', errorRate: 5.1,  latencyP95: 890,  retries: 63,  uptime: 96.34 },
  { connector: 'SAP ERP',     status: 'critical', lastSuccess: '2026-03-05 01:05:00', errorRate: 22.0, latencyP95: 5400, retries: 341, uptime: 71.2  },
]

const LOG_DATA: LogEntry[] = [
  {
    id: 'log-001', timestamp: '2026-03-05 14:58:01', connector: 'Stripe',     operation: 'createCharge',      status: 'ok',       httpStatus: 200, latency: 138,
    correlationId: 'cid-a1b2c3d4',
    payload: { request: { amount: 5000, currency: 'usd', source: 'tok_visa' }, response: { id: 'ch_Test001', status: 'succeeded', amount: 5000 } },
  },
  {
    id: 'log-002', timestamp: '2026-03-05 14:57:55', connector: 'GitHub',     operation: 'createIssue',        status: 'ok',       httpStatus: 201, latency: 204,
    correlationId: 'cid-e5f6g7h8',
    payload: { request: { title: 'Bug report', labels: ['bug'] }, response: { id: 42, number: 42, state: 'open' } },
  },
  {
    id: 'log-003', timestamp: '2026-03-05 14:55:12', connector: 'HubSpot',    operation: 'getContacts',        status: 'ok',       httpStatus: 200, latency: 312,
    correlationId: 'cid-i9j0k1l2',
    payload: { request: { limit: 50 }, response: { total: 1240, results: ['...redacted...'] } },
  },
  {
    id: 'log-004', timestamp: '2026-03-05 14:52:44', connector: 'Salesforce', operation: 'queryLeads',         status: 'warning',  httpStatus: 200, latency: 721,
    correlationId: 'cid-m3n4o5p6',
    payload: { request: { soql: 'SELECT Id FROM Lead WHERE Status = \'Open\'' }, response: { totalSize: 45, done: true }, warn: 'High latency detected (>700ms)' },
  },
  {
    id: 'log-005', timestamp: '2026-03-05 14:50:00', connector: 'QuickBooks', operation: 'getInvoice',         status: 'critical', httpStatus: 500, latency: 2910,
    correlationId: 'cid-q7r8s9t0',
    payload: { request: { invoiceId: 'INV-2026-0042' }, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Database connection timeout', retryCount: 3 } },
  },
  {
    id: 'log-006', timestamp: '2026-03-05 14:48:30', connector: 'SendGrid',   operation: 'sendEmail',          status: 'warning',  httpStatus: 429, latency: 890,
    correlationId: 'cid-u1v2w3x4',
    payload: { request: { to: '***@example.com', subject: '***' }, error: { code: 'RATE_LIMIT_EXCEEDED', retryAfter: 60 } },
  },
  {
    id: 'log-007', timestamp: '2026-03-05 14:45:22', connector: 'Stripe',     operation: 'createRefund',       status: 'ok',       httpStatus: 200, latency: 145,
    correlationId: 'cid-y5z6a7b8',
    payload: { request: { chargeId: 'ch_Test001', amount: 1000 }, response: { id: 're_Test001', status: 'succeeded', amount: 1000 } },
  },
  {
    id: 'log-008', timestamp: '2026-03-05 14:43:10', connector: 'Jira',       operation: 'searchIssues',       status: 'ok',       httpStatus: 200, latency: 178,
    correlationId: 'cid-c9d0e1f2',
    payload: { request: { jql: 'project = NEOX AND status = Open', maxResults: 50 }, response: { total: 12, issues: ['...redacted...'] } },
  },
  {
    id: 'log-009', timestamp: '2026-03-05 14:40:20', connector: 'SendGrid',   operation: 'getStats',           status: 'critical', httpStatus: 503, latency: 4200,
    correlationId: 'cid-g3h4i5j6',
    payload: { request: {}, error: { code: 'SERVICE_UNAVAILABLE', message: 'SendGrid API degraded - upstream timeout' } },
  },
  {
    id: 'log-010', timestamp: '2026-03-05 14:35:00', connector: 'SAP ERP',    operation: 'delta token',        status: 'critical', httpStatus: 500, latency: 5400,
    correlationId: 'cid-k7l8m9n0',
    payload: { request: { entity: 'SalesOrder', deltaToken: 'tok_abc123' }, error: { code: 'GATEWAY_TIMEOUT', message: 'SAP backend did not respond within 5s', retryCount: 5 } },
  },
]

const CONNECTOR_FILTER_OPTIONS = [
  { value: '', label: 'All Connectors' },
  { value: 'Stripe',     label: 'Stripe'     },
  { value: 'Salesforce', label: 'Salesforce' },
  { value: 'GitHub',     label: 'GitHub'     },
  { value: 'HubSpot',    label: 'HubSpot'    },
  { value: 'QuickBooks', label: 'QuickBooks' },
  { value: 'Jira',       label: 'Jira'       },
  { value: 'Twilio',     label: 'Twilio'     },
  { value: 'SendGrid',   label: 'SendGrid'   },
  { value: 'SAP ERP',    label: 'SAP ERP'    },
]

const TIME_RANGE_OPTIONS = [
  { value: '15m',  label: 'Last 15 minutes' },
  { value: '1h',   label: 'Last 1 hour'     },
  { value: '6h',   label: 'Last 6 hours'    },
  { value: '24h',  label: 'Last 24 hours'   },
  { value: '7d',   label: 'Last 7 days'     },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

function MetricTile({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{
      flex: '1 1 0',
      minWidth: '90px',
      backgroundColor: IS.pageBg,
      borderRadius: '8px',
      padding: '10px 14px',
      border: `1px solid ${IS.cardBorder}40`,
    }}>
      <div style={{ ...fontBase, fontSize: '11px', color: IS.muted, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ ...fontBase, fontSize: '18px', fontWeight: 800, color, letterSpacing: '-0.01em' }}>
        {value}
      </div>
      {sub && (
        <div style={{ ...fontBase, fontSize: '11px', color: IS.muted, marginTop: '2px' }}>{sub}</div>
      )}
    </div>
  )
}

function HttpStatusPill({ status }: { status: number }) {
  const color = status < 300 ? IS.green : status < 500 ? IS.yellow : IS.red
  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      padding: '2px 8px',
      borderRadius: '6px',
      backgroundColor: `${color}20`,
      border: `1px solid ${color}35`,
      color,
      fontSize: '11px',
      fontWeight: 700,
      fontFamily: 'monospace',
    }}>
      {status}
    </span>
  )
}

// ─── Health Tab ───────────────────────────────────────────────────────────────

function HealthTab() {
  const sorted = [...HEALTH_DATA].sort((a, b) => {
    const order = { critical: 0, warning: 1, ok: 2, inactive: 3 }
    return order[a.status] - order[b.status]
  })

  const overallOk       = sorted.filter(c => c.status === 'ok').length
  const overallWarning  = sorted.filter(c => c.status === 'warning').length
  const overallCritical = sorted.filter(c => c.status === 'critical').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Summary row */}
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '14px 20px',
        backgroundColor: IS.cardBg,
        border: `1px solid ${IS.cardBorder}`,
        borderRadius: '12px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span style={{ ...fontBase, fontSize: '13px', fontWeight: 700, color: IS.text, marginRight: '8px' }}>Fleet Overview</span>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ ...fontBase, fontSize: '13px', color: IS.green }}><b>{overallOk}</b> healthy</span>
          <span style={{ ...fontBase, fontSize: '13px', color: IS.yellow }}><b>{overallWarning}</b> degraded</span>
          <span style={{ ...fontBase, fontSize: '13px', color: IS.red }}><b>{overallCritical}</b> critical</span>
          <span style={{ ...fontBase, fontSize: '13px', color: IS.muted }}><b>{sorted.filter(c => c.status === 'inactive').length}</b> inactive</span>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '14px' }}>
        {sorted.map(c => {
          const errorColor = c.errorRate > 10 ? IS.red : c.errorRate > 2 ? IS.yellow : IS.green
          const latColor   = c.latencyP95 > 2000 ? IS.red : c.latencyP95 > 500 ? IS.yellow : IS.green
          const upColor    = c.uptime > 99 ? IS.green : c.uptime > 95 ? IS.yellow : IS.red

          return (
            <div key={c.connector} style={{
              backgroundColor: IS.cardBg,
              border: `1px solid ${IS.cardBorder}`,
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {/* Card header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: `1px solid ${IS.cardBorder}`,
                backgroundColor: IS.cardBg2,
              }}>
                <span style={{ ...fontBase, fontSize: '14px', fontWeight: 700, color: IS.text }}>{c.connector}</span>
                <StatusBadge status={c.status} />
              </div>

              {/* Metrics */}
              <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <MetricTile label="Error Rate" value={`${c.errorRate}%`} color={errorColor} />
                <MetricTile label="Latency p95" value={`${c.latencyP95}ms`} color={latColor} />
                <MetricTile label="Retries" value={c.retries} color={c.retries > 100 ? IS.red : c.retries > 20 ? IS.yellow : IS.muted} />
                <MetricTile label="Uptime" value={`${c.uptime}%`} color={upColor} />
              </div>

              {/* Last success */}
              <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={IS.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{ ...fontBase, fontSize: '11px', color: IS.muted }}>
                  Last success: <span style={{ color: IS.label }}>{c.lastSuccess}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Logs Tab ─────────────────────────────────────────────────────────────────

function LogsTab() {
  const [filterConnector,    setFilterConnector]    = useState('')
  const [filterOperation,    setFilterOperation]    = useState('')
  const [filterCorrelation,  setFilterCorrelation]  = useState('')
  const [filterTimeRange,    setFilterTimeRange]    = useState('1h')
  const [expandedRow,        setExpandedRow]        = useState<string | null>(null)

  const filtered = useMemo(() => {
    return LOG_DATA.filter(log => {
      if (filterConnector   && log.connector !== filterConnector)                            return false
      if (filterOperation   && !log.operation.toLowerCase().includes(filterOperation.toLowerCase())) return false
      if (filterCorrelation && !log.correlationId.toLowerCase().includes(filterCorrelation.toLowerCase())) return false
      return true
    })
  }, [filterConnector, filterOperation, filterCorrelation])

  const columns: ISTableColumn[] = [
    { key: 'timestamp',     label: 'Timestamp',      width: '155px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '11.5px', color: IS.label }}>{String(v)}</span>
    )},
    { key: 'connector',     label: 'Connector',      width: '110px', render: (v) => (
      <span style={{ ...fontBase, fontSize: '12px', color: IS.text, fontWeight: 600 }}>{String(v)}</span>
    )},
    { key: 'operation',     label: 'Operation',      width: '170px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '12px', color: IS.gold }}>{String(v)}</span>
    )},
    { key: 'status',        label: 'Status',         width: '100px', render: (v) => (
      <StatusBadge status={v as 'ok' | 'warning' | 'critical' | 'inactive'} />
    )},
    { key: 'httpStatus',    label: 'HTTP',           width: '70px',  render: (v) => (
      <HttpStatusPill status={v as number} />
    )},
    { key: 'latency',       label: 'Latency',        width: '90px',  render: (v) => {
      const ms = v as number
      const c  = ms > 2000 ? IS.red : ms > 500 ? IS.yellow : IS.green
      return <span style={{ ...fontBase, fontSize: '12px', color: c, fontWeight: 600 }}>{ms}ms</span>
    }},
    { key: 'correlationId', label: 'Correlation ID', width: '130px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '11px', color: IS.cyan }}>{String(v)}</span>
    )},
    { key: 'id',            label: '',               width: '36px',  render: (_, row) => (
      <button
        onClick={e => { e.stopPropagation(); setExpandedRow(prev => prev === row.id ? null : row.id as string) }}
        style={{
          background: 'none',
          border: `1px solid ${IS.inputBorder}`,
          borderRadius: '5px',
          color: IS.muted,
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
        {expandedRow === row.id ? '▲' : '▼'}
      </button>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Filters */}
      <ISCard title="Filters">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ flex: '1 1 160px' }}>
            <ISSelect label="Connector" value={filterConnector} options={CONNECTOR_FILTER_OPTIONS} onChange={setFilterConnector} />
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <ISInput label="Operation" value={filterOperation} onChange={setFilterOperation} placeholder="e.g. createCharge" />
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <ISSelect label="Time Range" value={filterTimeRange} options={TIME_RANGE_OPTIONS} onChange={setFilterTimeRange} />
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <ISInput label="Correlation ID" value={filterCorrelation} onChange={setFilterCorrelation} placeholder="cid-…" />
          </div>
        </div>
      </ISCard>

      {/* Table + expandable rows */}
      <ISCard title={`Log Entries (${filtered.length})`}>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} style={{
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: IS.muted, fontSize: '13px' }}>
                    No log entries match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <React.Fragment key={row.id}>
                    <tr
                      style={{
                        backgroundColor: i % 2 === 0 ? 'transparent' : `${IS.cardBg2}80`,
                        borderBottom: expandedRow === row.id ? `1px solid ${IS.blue}40` : `1px solid ${IS.cardBorder}40`,
                        cursor: 'pointer',
                      }}
                    >
                      {columns.map(col => (
                        <td key={col.key} style={{ padding: '10px 14px', color: IS.text, verticalAlign: 'middle' }}>
                          {col.render ? col.render((row as unknown as Record<string, unknown>)[col.key], row as unknown as Record<string, unknown>) : String((row as unknown as Record<string, unknown>)[col.key] ?? '')}
                        </td>
                      ))}
                    </tr>
                    {expandedRow === row.id && (
                      <tr>
                        <td
                          colSpan={columns.length}
                          style={{
                            padding: '0',
                            backgroundColor: `${IS.blue}08`,
                            borderBottom: `1px solid ${IS.cardBorder}40`,
                          }}
                        >
                          <div style={{ padding: '16px 20px' }}>
                            <div style={{ ...fontBase, fontSize: '12px', color: IS.label, fontWeight: 600, marginBottom: '10px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                              Masked Payload
                            </div>
                            <JsonPreview data={row.payload} title={`${row.connector} / ${row.operation}`} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ISCard>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ISHealthLogs() {
  const [activeTab, setActiveTab] = useState('health')

  const tabs = [
    { id: 'health', label: 'Health' },
    { id: 'logs',   label: 'Logs'   },
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
            backgroundColor: `${IS.green}20`,
            border: `1px solid ${IS.green}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={IS.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <h1 style={{ ...fontBase, margin: 0, fontSize: '20px', fontWeight: 800, color: IS.textWhite, letterSpacing: '-0.01em' }}>
              Health &amp; Logs
            </h1>
            <p style={{ ...fontBase, margin: 0, fontSize: '13px', color: IS.muted, marginTop: '2px' }}>
              Monitor connector health metrics and inspect detailed request logs
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ marginBottom: '20px' }}>
        <ISTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === 'health' && <HealthTab />}
      {activeTab === 'logs'   && <LogsTab />}
    </div>
  )
}
