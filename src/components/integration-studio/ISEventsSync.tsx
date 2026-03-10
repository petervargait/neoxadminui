'use client'

import React, { useState } from 'react'
import {
  IS,
  ISCard,
  ISTable,
  ISTabBar,
  ISModal,
  ISInput,
  ISSelect,
  ISButton,
  StatusBadge,
  ISTableColumn,
} from './ISShared'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WebhookSubscription {
  id: string
  connector: string
  callbackUrl: string
  signatureSecretRef: string
  eventTypes: string[]
  status: 'ok' | 'warning' | 'critical' | 'inactive'
}

interface PollingJob {
  id: string
  connector: string
  schedule: string
  cursorStrategy: string
  batchSize: number
  lastRun: string
  status: 'ok' | 'warning' | 'critical' | 'inactive'
}

interface ReplayResult {
  eventId: string
  connector: string
  eventType: string
  replayedAt: string
  outcome: 'success' | 'failed' | 'skipped'
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const INITIAL_WEBHOOKS: WebhookSubscription[] = [
  {
    id: 'wh-001',
    connector: 'SkiData Parking',
    callbackUrl: 'https://api.neox.io/hooks/skidata',
    signatureSecretRef: 'secret/skidata-webhook-sig',
    eventTypes: ['reservation.created', 'reservation.cancelled', 'barrier.opened'],
    status: 'ok',
  },
  {
    id: 'wh-002',
    connector: 'Avigilon Access',
    callbackUrl: 'https://api.neox.io/hooks/avigilon',
    signatureSecretRef: 'secret/avigilon-webhook-sig',
    eventTypes: ['access.granted', 'access.denied', 'door.forced'],
    status: 'ok',
  },
  {
    id: 'wh-003',
    connector: 'HID Origo',
    callbackUrl: 'https://api.neox.io/hooks/hid-origo',
    signatureSecretRef: 'secret/hid-webhook-sig',
    eventTypes: ['credential.provisioned', 'credential.revoked'],
    status: 'ok',
  },
  {
    id: 'wh-004',
    connector: 'Siemens Desigo',
    callbackUrl: 'https://api.neox.io/hooks/siemens-bms',
    signatureSecretRef: 'secret/siemens-webhook-sig',
    eventTypes: ['alarm.triggered', 'setpoint.changed', 'zone.offline'],
    status: 'critical',
  },
  {
    id: 'wh-005',
    connector: 'bGrid IoT',
    callbackUrl: 'https://api.neox.io/hooks/bgrid',
    signatureSecretRef: 'secret/bgrid-webhook-sig',
    eventTypes: ['sensor.reading', 'occupancy.changed', 'environment.alert'],
    status: 'ok',
  },
  {
    id: 'wh-006',
    connector: 'NEOX Visitor',
    callbackUrl: 'https://api.neox.io/hooks/neox-visitor',
    signatureSecretRef: 'secret/neox-visitor-webhook-sig',
    eventTypes: ['visitor.checkedIn', 'visitor.checkedOut', 'invitation.approved'],
    status: 'ok',
  },
  {
    id: 'wh-007',
    connector: 'Vecos Lockers',
    callbackUrl: 'https://api.neox.io/hooks/vecos',
    signatureSecretRef: 'secret/vecos-webhook-sig',
    eventTypes: ['locker.assigned', 'locker.released', 'locker.unlocked'],
    status: 'warning',
  },
]

const INITIAL_POLLING_JOBS: PollingJob[] = [
  {
    id: 'poll-001',
    connector: 'Nective BMS',
    schedule: '*/5 * * * *',
    cursorStrategy: 'LastModifiedDate',
    batchSize: 200,
    lastRun: '2026-03-05 14:55:00',
    status: 'ok',
  },
  {
    id: 'poll-002',
    connector: 'Schneider BMS',
    schedule: '*/10 * * * *',
    cursorStrategy: 'eventSequenceId',
    batchSize: 100,
    lastRun: '2026-03-05 14:50:00',
    status: 'ok',
  },
  {
    id: 'poll-003',
    connector: 'Haltian IoT',
    schedule: '*/2 * * * *',
    cursorStrategy: 'timestamp offset',
    batchSize: 500,
    lastRun: '2026-03-05 14:56:00',
    status: 'warning',
  },
  {
    id: 'poll-004',
    connector: 'XYSense',
    schedule: '*/5 * * * *',
    cursorStrategy: 'updated timestamp',
    batchSize: 300,
    lastRun: '2026-03-05 14:55:00',
    status: 'ok',
  },
  {
    id: 'poll-005',
    connector: 'IBM Maximo',
    schedule: '0 */4 * * *',
    cursorStrategy: 'delta token',
    batchSize: 1000,
    lastRun: '2026-03-05 12:00:00',
    status: 'ok',
  },
  {
    id: 'poll-006',
    connector: 'WasteTracker',
    schedule: '0 */6 * * *',
    cursorStrategy: 'lastSyncDate',
    batchSize: 50,
    lastRun: '2026-03-05 06:00:00',
    status: 'ok',
  },
  {
    id: 'poll-007',
    connector: 'HikCentral',
    schedule: '*/15 * * * *',
    cursorStrategy: 'eventId offset',
    batchSize: 200,
    lastRun: '2026-03-05 14:45:00',
    status: 'critical',
  },
]

const REPLAY_RESULTS_SAMPLE: ReplayResult[] = [
  { eventId: 'evt_skidata_01', connector: 'SkiData Parking', eventType: 'reservation.created', replayedAt: '2026-03-05 14:57:22', outcome: 'success' },
  { eventId: 'evt_skidata_02', connector: 'SkiData Parking', eventType: 'barrier.opened',      replayedAt: '2026-03-05 14:57:23', outcome: 'success' },
  { eventId: 'evt_avigilon_01', connector: 'Avigilon Access', eventType: 'access.denied',       replayedAt: '2026-03-05 14:57:23', outcome: 'failed'  },
  { eventId: 'evt_bgrid_01', connector: 'bGrid IoT',         eventType: 'sensor.reading',       replayedAt: '2026-03-05 14:57:24', outcome: 'skipped' },
]

const CONNECTOR_OPTIONS = [
  { value: '', label: 'All Connectors' },
  { value: 'SkiData Parking', label: 'SkiData Parking' },
  { value: 'Avigilon Access', label: 'Avigilon Access' },
  { value: 'HID Origo', label: 'HID Origo' },
  { value: 'Siemens Desigo', label: 'Siemens Desigo' },
  { value: 'bGrid IoT', label: 'bGrid IoT' },
  { value: 'NEOX Visitor', label: 'NEOX Visitor' },
  { value: 'Vecos Lockers', label: 'Vecos Lockers' },
  { value: 'Nective BMS', label: 'Nective BMS' },
  { value: 'Schneider BMS', label: 'Schneider BMS' },
  { value: 'Haltian IoT', label: 'Haltian IoT' },
  { value: 'XYSense', label: 'XYSense' },
  { value: 'IBM Maximo', label: 'IBM Maximo' },
  { value: 'WasteTracker', label: 'WasteTracker' },
  { value: 'HikCentral', label: 'HikCentral' },
]

const EVENT_TYPE_OPTIONS = [
  { value: 'reservation.created', label: 'reservation.created' },
  { value: 'reservation.cancelled', label: 'reservation.cancelled' },
  { value: 'access.granted', label: 'access.granted' },
  { value: 'access.denied', label: 'access.denied' },
  { value: 'credential.provisioned', label: 'credential.provisioned' },
  { value: 'sensor.reading', label: 'sensor.reading' },
  { value: 'occupancy.changed', label: 'occupancy.changed' },
  { value: 'visitor.checkedIn', label: 'visitor.checkedIn' },
  { value: 'locker.assigned', label: 'locker.assigned' },
  { value: 'alarm.triggered', label: 'alarm.triggered' },
]

const STATUS_OPTIONS = [
  { value: 'ok', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

function OutcomeBadge({ outcome }: { outcome: 'success' | 'failed' | 'skipped' }) {
  const cfg = {
    success: { color: IS.green,  label: 'Success' },
    failed:  { color: IS.red,    label: 'Failed'  },
    skipped: { color: IS.muted,  label: 'Skipped' },
  }
  const { color, label } = cfg[outcome]
  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '20px',
      backgroundColor: `${color}1A`,
      border: `1px solid ${color}40`,
      fontSize: '12px',
      fontWeight: 600,
      color,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 4px ${color}` }} />
      {label}
    </span>
  )
}

function EventTypeChips({ types }: { types: string[] }) {
  const shown = types.slice(0, 2)
  const rest = types.length - 2
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
      {shown.map(t => (
        <span key={t} style={{
          ...fontBase,
          padding: '2px 8px',
          borderRadius: '6px',
          backgroundColor: `${IS.purple}20`,
          border: `1px solid ${IS.purple}35`,
          color: IS.purple,
          fontSize: '11px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}>
          {t}
        </span>
      ))}
      {rest > 0 && (
        <span style={{
          ...fontBase,
          padding: '2px 8px',
          borderRadius: '6px',
          backgroundColor: `${IS.muted}20`,
          border: `1px solid ${IS.muted}35`,
          color: IS.muted,
          fontSize: '11px',
          fontWeight: 500,
        }}>
          +{rest} more
        </span>
      )}
    </div>
  )
}

// ─── Webhooks Tab ─────────────────────────────────────────────────────────────

function WebhooksTab() {
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>(INITIAL_WEBHOOKS)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    connector: '',
    callbackUrl: '',
    signatureSecretRef: '',
    eventType: '',
    status: 'ok',
  })

  const handleCreate = () => {
    if (!form.connector || !form.callbackUrl) return
    const newHook: WebhookSubscription = {
      id: `wh-${String(webhooks.length + 1).padStart(3, '0')}`,
      connector: form.connector,
      callbackUrl: form.callbackUrl,
      signatureSecretRef: form.signatureSecretRef || `secret/${form.connector.toLowerCase()}-sig`,
      eventTypes: form.eventType ? [form.eventType] : ['*'],
      status: form.status as WebhookSubscription['status'],
    }
    setWebhooks(prev => [newHook, ...prev])
    setModalOpen(false)
    setForm({ connector: '', callbackUrl: '', signatureSecretRef: '', eventType: '', status: 'ok' })
  }

  const columns: ISTableColumn[] = [
    { key: 'connector',          label: 'Connector',           width: '120px' },
    { key: 'callbackUrl',        label: 'Callback URL',        width: '240px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '12px', color: IS.cyan }}>{String(v)}</span>
    )},
    { key: 'signatureSecretRef', label: 'Signature Secret Ref', width: '200px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '12px', color: IS.label }}>{String(v)}</span>
    )},
    { key: 'eventTypes',         label: 'Event Types',          width: '220px', render: (v) => (
      <EventTypeChips types={v as string[]} />
    )},
    { key: 'status',             label: 'Status',               width: '100px', render: (v) => (
      <StatusBadge status={v as 'ok' | 'warning' | 'critical' | 'inactive'} />
    )},
  ]

  return (
    <>
      <ISCard
        title="Webhook Subscriptions"
        action={
          <ISButton onClick={() => setModalOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Webhook
          </ISButton>
        }
      >
        <ISTable columns={columns} data={webhooks} />
      </ISCard>

      <ISModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Webhook Subscription" width="520px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ISSelect
            label="Connector"
            value={form.connector}
            options={CONNECTOR_OPTIONS.filter(o => o.value)}
            onChange={v => setForm(f => ({ ...f, connector: v }))}
          />
          <ISInput
            label="Callback URL"
            value={form.callbackUrl}
            onChange={v => setForm(f => ({ ...f, callbackUrl: v }))}
            placeholder="https://api.example.com/hooks/connector"
          />
          <ISInput
            label="Signature Secret Ref"
            value={form.signatureSecretRef}
            onChange={v => setForm(f => ({ ...f, signatureSecretRef: v }))}
            placeholder="secret/my-connector-sig"
          />
          <ISSelect
            label="Event Type"
            value={form.eventType}
            options={[{ value: '', label: 'All Events (*)' }, ...EVENT_TYPE_OPTIONS]}
            onChange={v => setForm(f => ({ ...f, eventType: v }))}
          />
          <ISSelect
            label="Initial Status"
            value={form.status}
            options={STATUS_OPTIONS}
            onChange={v => setForm(f => ({ ...f, status: v }))}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
            <ISButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</ISButton>
            <ISButton onClick={handleCreate} disabled={!form.connector || !form.callbackUrl}>Create</ISButton>
          </div>
        </div>
      </ISModal>
    </>
  )
}

// ─── Polling Tab ──────────────────────────────────────────────────────────────

function PollingTab() {
  const columns: ISTableColumn[] = [
    { key: 'connector',      label: 'Connector',       width: '120px' },
    { key: 'schedule',       label: 'Schedule / Cron', width: '150px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '12px', color: IS.gold }}>{String(v)}</span>
    )},
    { key: 'cursorStrategy', label: 'Cursor Strategy', width: '180px', render: (v) => (
      <span style={{ ...fontBase, fontSize: '12px', color: IS.cyan }}>{String(v)}</span>
    )},
    { key: 'batchSize',      label: 'Batch Size',      width: '100px', render: (v) => (
      <span style={{ ...fontBase, color: IS.blue, fontWeight: 600, fontSize: '13px' }}>{String(v)}</span>
    )},
    { key: 'lastRun',        label: 'Last Run',         width: '170px', render: (v) => (
      <span style={{ ...fontBase, fontSize: '12px', color: IS.label }}>{String(v)}</span>
    )},
    { key: 'status',         label: 'Status',           width: '100px', render: (v) => (
      <StatusBadge status={v as 'ok' | 'warning' | 'critical' | 'inactive'} />
    )},
  ]

  return (
    <ISCard title="Sync Polling Jobs">
      <ISTable columns={columns} data={INITIAL_POLLING_JOBS} />
    </ISCard>
  )
}

// ─── Replay Tab ───────────────────────────────────────────────────────────────

function ReplayTab() {
  const [connector, setConnector] = useState('Stripe')
  const [fromDate, setFromDate] = useState('2026-03-05T00:00')
  const [toDate, setToDate] = useState('2026-03-05T14:00')
  const [eventId, setEventId] = useState('')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<ReplayResult[]>([])
  const [ran, setRan] = useState(false)

  const handleReplay = () => {
    setRunning(true)
    setResults([])
    setRan(false)
    setTimeout(() => {
      setResults(REPLAY_RESULTS_SAMPLE.filter(r =>
        r.connector === connector || connector === ''
      ))
      setRunning(false)
      setRan(true)
    }, 1400)
  }

  const columns: ISTableColumn[] = [
    { key: 'eventId',    label: 'Event ID',    width: '140px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '12px', color: IS.cyan }}>{String(v)}</span>
    )},
    { key: 'connector',  label: 'Connector',   width: '110px' },
    { key: 'eventType',  label: 'Event Type',  width: '180px', render: (v) => (
      <span style={{ ...fontBase, fontSize: '12px', color: IS.purple }}>{String(v)}</span>
    )},
    { key: 'replayedAt', label: 'Replayed At', width: '160px', render: (v) => (
      <span style={{ ...fontBase, fontSize: '12px', color: IS.label }}>{String(v)}</span>
    )},
    { key: 'outcome',    label: 'Outcome',     width: '110px', render: (v) => (
      <OutcomeBadge outcome={v as 'success' | 'failed' | 'skipped'} />
    )},
  ]

  const summarySuccess = results.filter(r => r.outcome === 'success').length
  const summaryFailed  = results.filter(r => r.outcome === 'failed').length
  const summarySkipped = results.filter(r => r.outcome === 'skipped').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ISCard title="Replay Configuration">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 160px' }}>
            <ISSelect
              label="Connector"
              value={connector}
              options={CONNECTOR_OPTIONS}
              onChange={setConnector}
            />
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <ISInput label="From" type="datetime-local" value={fromDate} onChange={setFromDate} />
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <ISInput label="To" type="datetime-local" value={toDate} onChange={setToDate} />
          </div>
          <div style={{ flex: '2 1 200px' }}>
            <ISInput
              label="Event ID (optional)"
              value={eventId}
              onChange={setEventId}
              placeholder="evt_1KqM2x8R"
            />
          </div>
          <div style={{ paddingBottom: '2px' }}>
            <ISButton onClick={handleReplay} disabled={running}>
              {running ? (
                <>
                  <span style={{ display: 'inline-block', width: '13px', height: '13px', border: `2px solid ${IS.textWhite}40`, borderTopColor: IS.textWhite, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Replaying…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                  </svg>
                  Replay
                </>
              )}
            </ISButton>
          </div>
        </div>
      </ISCard>

      {ran && (
        <ISCard
          title="Replay Results"
          action={
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ ...fontBase, fontSize: '12px', color: IS.green, fontWeight: 600 }}>{summarySuccess} success</span>
              <span style={{ ...fontBase, fontSize: '12px', color: IS.red,   fontWeight: 600 }}>{summaryFailed} failed</span>
              <span style={{ ...fontBase, fontSize: '12px', color: IS.muted, fontWeight: 600 }}>{summarySkipped} skipped</span>
            </div>
          }
        >
          {results.length === 0 ? (
            <div style={{ ...fontBase, textAlign: 'center', padding: '32px', color: IS.muted, fontSize: '13px' }}>
              No events matched the selected criteria.
            </div>
          ) : (
            <ISTable columns={columns} data={results} />
          )}
        </ISCard>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ISEventsSync() {
  const [activeTab, setActiveTab] = useState('webhooks')

  const tabs = [
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'polling',  label: 'Polling'  },
    { id: 'replay',   label: 'Replay'   },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: `${IS.cyan}20`,
            border: `1px solid ${IS.cyan}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={IS.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <div>
            <h1 style={{ ...fontBase, margin: 0, fontSize: '20px', fontWeight: 800, color: IS.textWhite, letterSpacing: '-0.01em' }}>
              Events &amp; Sync
            </h1>
            <p style={{ ...fontBase, margin: 0, fontSize: '13px', color: IS.muted, marginTop: '2px' }}>
              Manage webhook subscriptions, polling schedules, and event replay
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ marginBottom: '20px' }}>
        <ISTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab content */}
      {activeTab === 'webhooks' && <WebhooksTab />}
      {activeTab === 'polling'  && <PollingTab />}
      {activeTab === 'replay'   && <ReplayTab />}
    </div>
  )
}
