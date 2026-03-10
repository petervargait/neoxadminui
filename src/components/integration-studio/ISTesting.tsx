'use client'

import React, { useState, useRef } from 'react'
import {
  IS,
  ISCard,
  ISTable,
  ISTabBar,
  ISButton,
  ISSelect,
  ISInput,
  JsonPreview,
  EnvironmentBadge,
  ISTableColumn,
} from './ISShared'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestResult {
  status: number
  latency: number
  timestamp: string
  body: Record<string, unknown>
}

interface StoredTestCase {
  id: string
  name: string
  connector: string
  operation: string
  payload: string
  environment: 'Dev' | 'Test' | 'Prod'
  lastResult: 'pass' | 'fail' | 'pending'
  lastRun: string
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const CONNECTOR_OPTIONS = [
  { value: 'skidata',      label: 'SkiData Parking'    },
  { value: 'avigilon',     label: 'Avigilon Access'    },
  { value: 'hid-origo',    label: 'HID Origo'          },
  { value: 'tds-visitor',  label: 'TDS Visitor'        },
  { value: 'vecos',        label: 'Vecos Lockers'      },
  { value: 'nective',      label: 'Nective BMS'        },
  { value: 'crestron',     label: 'Crestron AV'        },
  { value: 'bgrid',        label: 'bGrid IoT'          },
  { value: 'ibm-maximo',   label: 'IBM Maximo'         },
  { value: 'siemens',      label: 'Siemens Desigo'     },
  { value: 'schneider',    label: 'Schneider BMS'      },
  { value: 'wastetracker', label: 'WasteTracker'       },
  { value: 'hikcentral',   label: 'HikCentral'         },
  { value: 'neox-parking', label: 'NEOX Parking'       },
]

const ENVIRONMENT_OPTIONS = [
  { value: 'Dev',  label: 'Dev'  },
  { value: 'Test', label: 'Test' },
  { value: 'Prod', label: 'Prod' },
]

const OPERATIONS_BY_CONNECTOR: Record<string, { value: string; label: string }[]> = {
  skidata:      [{ value: 'createReservation', label: 'Create Reservation' }, { value: 'getAvailability', label: 'Get Availability' }, { value: 'cancelReservation', label: 'Cancel Reservation' }],
  avigilon:     [{ value: 'getAccessEvents', label: 'Get Access Events' }, { value: 'grantAccess', label: 'Grant Access' }, { value: 'revokeAccess', label: 'Revoke Access' }],
  'hid-origo':  [{ value: 'issueCredential', label: 'Issue Credential' }, { value: 'revokeCredential', label: 'Revoke Credential' }, { value: 'getCredentialStatus', label: 'Get Credential Status' }],
  'tds-visitor': [{ value: 'createInvitation', label: 'Create Invitation' }, { value: 'checkInVisitor', label: 'Check-In Visitor' }, { value: 'listVisitors', label: 'List Visitors' }],
  vecos:        [{ value: 'assignLocker', label: 'Assign Locker' }, { value: 'releaseLocker', label: 'Release Locker' }, { value: 'getAvailability', label: 'Get Availability' }],
  nective:      [{ value: 'getZoneStatus', label: 'Get Zone Status' }, { value: 'setSetpoint', label: 'Set Setpoint' }, { value: 'getEnergyMetrics', label: 'Get Energy Metrics' }],
  crestron:     [{ value: 'getDeviceStatus', label: 'Get Device Status' }, { value: 'startMeeting', label: 'Start Meeting' }, { value: 'setDisplayInput', label: 'Set Display Input' }],
  bgrid:        [{ value: 'getSensorReadings', label: 'Get Sensor Readings' }, { value: 'getOccupancy', label: 'Get Occupancy' }, { value: 'listSensors', label: 'List Sensors' }],
  'ibm-maximo': [{ value: 'createTicket', label: 'Create Ticket' }, { value: 'updateTicket', label: 'Update Ticket' }, { value: 'getTicket', label: 'Get Ticket' }],
  siemens:      [{ value: 'getAlarms', label: 'Get Alarms' }, { value: 'acknowledgeAlarm', label: 'Acknowledge Alarm' }, { value: 'getZoneStatus', label: 'Get Zone Status' }],
  schneider:    [{ value: 'getZoneData', label: 'Get Zone Data' }, { value: 'setSetpoint', label: 'Set Setpoint' }, { value: 'getEnergyReport', label: 'Get Energy Report' }],
  wastetracker: [{ value: 'getContainerStatus', label: 'Get Container Status' }, { value: 'schedulePickup', label: 'Schedule Pickup' }, { value: 'getReport', label: 'Get Report' }],
  hikcentral:   [{ value: 'getEvents', label: 'Get Events' }, { value: 'openDoor', label: 'Open Door' }, { value: 'getDeviceStatus', label: 'Get Device Status' }],
  'neox-parking': [{ value: 'createReservation', label: 'Create Reservation' }, { value: 'getAvailability', label: 'Get Availability' }, { value: 'listReservations', label: 'List Reservations' }],
}

const DEFAULT_PAYLOADS: Record<string, string> = {
  createReservation: JSON.stringify({ licensePlate: 'AB-1234-CD', zone: 'P1', startTime: '2026-03-06T08:00:00Z', endTime: '2026-03-06T18:00:00Z' }, null, 2),
  getAvailability: JSON.stringify({ zone: 'P1', date: '2026-03-06' }, null, 2),
  cancelReservation: JSON.stringify({ reservationId: 'res_skidata_001' }, null, 2),
  getAccessEvents: JSON.stringify({ doorId: 'door_lobby_01', since: '2026-03-05T00:00:00Z', limit: 50 }, null, 2),
  grantAccess: JSON.stringify({ userId: 'usr_acme_1', doorGroupId: 'grp_floor3', validFrom: '2026-03-06T08:00:00Z', validTo: '2026-03-06T18:00:00Z' }, null, 2),
  issueCredential: JSON.stringify({ userId: 'usr_acme_1', cardType: 'DESFire_EV3', facility: 'HQ' }, null, 2),
  createInvitation: JSON.stringify({ visitorName: 'John Smith', visitorEmail: 'john@example.com', hostId: 'usr_acme_1', visitDate: '2026-03-06' }, null, 2),
  assignLocker: JSON.stringify({ userId: 'usr_acme_1', zone: 'A1', duration: 'day' }, null, 2),
  getZoneStatus: JSON.stringify({ zoneId: 'zone_floor3', includeMetrics: true }, null, 2),
  getSensorReadings: JSON.stringify({ sensorIds: ['sensor_01', 'sensor_02'], since: '2026-03-05T00:00:00Z' }, null, 2),
  createTicket: JSON.stringify({ title: 'HVAC issue Floor 3', category: 'Facility', priority: 'Medium', description: 'Temperature too high in zone 3A' }, null, 2),
  getAlarms: JSON.stringify({ severity: 'high', since: '2026-03-05T00:00:00Z', limit: 20 }, null, 2),
}

const MOCK_RESPONSES: Record<string, Record<string, unknown>> = {
  success: {
    id: 'res_TestMock001',
    status: 'ok',
    data: { processed: true, reference: 'REF-20260305-001', timestamp: '2026-03-05T14:57:33Z' },
    meta: { connector: 'skidata', operation: 'createReservation', durationMs: 142 },
  },
  fail: {
    error: {
      code: 'INVALID_REQUEST',
      message: 'Parameter `zone` is required.',
      param: 'zone',
      type: 'validation_error',
    },
    status: 'error',
  },
}

const INITIAL_TEST_CASES: StoredTestCase[] = [
  {
    id: 'tc-001',
    name: 'SkiData reservation happy path',
    connector: 'skidata',
    operation: 'createReservation',
    payload: JSON.stringify({ licensePlate: 'AB-1234-CD', zone: 'P1', startTime: '2026-03-06T08:00:00Z', endTime: '2026-03-06T18:00:00Z' }),
    environment: 'Dev',
    lastResult: 'pass',
    lastRun: '2026-03-05 14:50:11',
  },
  {
    id: 'tc-002',
    name: 'Avigilon access events query',
    connector: 'avigilon',
    operation: 'getAccessEvents',
    payload: JSON.stringify({ doorId: 'door_lobby_01', since: '2026-03-05T00:00:00Z', limit: 50 }),
    environment: 'Test',
    lastResult: 'pass',
    lastRun: '2026-03-05 13:22:44',
  },
  {
    id: 'tc-003',
    name: 'HikCentral open door',
    connector: 'hikcentral',
    operation: 'openDoor',
    payload: JSON.stringify({ doorId: 'door_east_02', reason: 'maintenance' }),
    environment: 'Dev',
    lastResult: 'fail',
    lastRun: '2026-03-05 12:05:30',
  },
  {
    id: 'tc-004',
    name: 'Nective BMS zone status',
    connector: 'nective',
    operation: 'getZoneStatus',
    payload: JSON.stringify({ zoneId: 'zone_floor3', includeMetrics: true }),
    environment: 'Dev',
    lastResult: 'pass',
    lastRun: '2026-03-05 11:30:00',
  },
  {
    id: 'tc-005',
    name: 'IBM Maximo ticket creation',
    connector: 'ibm-maximo',
    operation: 'createTicket',
    payload: JSON.stringify({ title: 'HVAC issue Floor 3', category: 'Facility', priority: 'Medium' }),
    environment: 'Test',
    lastResult: 'pass',
    lastRun: '2026-03-04 18:30:00',
  },
  {
    id: 'tc-006',
    name: 'bGrid occupancy check',
    connector: 'bgrid',
    operation: 'getOccupancy',
    payload: JSON.stringify({ floorId: 'floor_3', zones: ['3A', '3B', '3C'] }),
    environment: 'Prod',
    lastResult: 'pass',
    lastRun: '2026-03-05 14:00:00',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

function HttpStatusBadge({ status }: { status: number }) {
  const isOk = status >= 200 && status < 300
  const color = isOk ? IS.green : IS.red
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
      fontWeight: 700,
      color,
    }}>
      {status}
    </span>
  )
}

function TestResultBadge({ result }: { result: 'pass' | 'fail' | 'pending' }) {
  const cfg = {
    pass:    { color: IS.green,  label: 'Pass'    },
    fail:    { color: IS.red,    label: 'Fail'    },
    pending: { color: IS.muted,  label: 'Pending' },
  }
  const { color, label } = cfg[result]
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
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }} />
      {label}
    </span>
  )
}

function Toggle({
  value,
  onChange,
  leftLabel,
  rightLabel,
}: {
  value: boolean
  onChange: (v: boolean) => void
  leftLabel: string
  rightLabel: string
}) {
  return (
    <div style={{ ...fontBase, display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{
        fontSize: '12px',
        fontWeight: value ? 500 : 700,
        color: value ? IS.muted : IS.text,
        cursor: 'pointer',
        transition: 'color 0.15s',
      }} onClick={() => onChange(false)}>
        {leftLabel}
      </span>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: '42px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: value ? IS.blue : IS.inputBorder,
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 0.2s ease',
          flexShrink: 0,
          border: `1px solid ${value ? IS.blue : IS.inputBorder}`,
        }}
      >
        <div style={{
          position: 'absolute',
          top: '3px',
          left: value ? '20px' : '3px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: IS.textWhite,
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }} />
      </div>
      <span style={{
        fontSize: '12px',
        fontWeight: value ? 700 : 500,
        color: value ? IS.text : IS.muted,
        cursor: 'pointer',
        transition: 'color 0.15s',
      }} onClick={() => onChange(true)}>
        {rightLabel}
      </span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ISTesting() {
  const [connector,   setConnector]   = useState('stripe')
  const [environment, setEnvironment] = useState<'Dev' | 'Test' | 'Prod'>('Dev')
  const [operation,   setOperation]   = useState('createCharge')
  const [payload,     setPayload]     = useState(DEFAULT_PAYLOADS['createCharge'] ?? '{}')
  const [isLiveCall,  setIsLiveCall]  = useState(false)
  const [running,     setRunning]     = useState(false)
  const [testResult,  setTestResult]  = useState<TestResult | null>(null)
  const [testCases,   setTestCases]   = useState<StoredTestCase[]>(INITIAL_TEST_CASES)
  const [saveName,    setSaveName]    = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const operations = OPERATIONS_BY_CONNECTOR[connector] ?? []

  const handleConnectorChange = (v: string) => {
    setConnector(v)
    const ops = OPERATIONS_BY_CONNECTOR[v] ?? []
    const firstOp = ops[0]?.value ?? ''
    setOperation(firstOp)
    setPayload(DEFAULT_PAYLOADS[firstOp] ?? '{\n  \n}')
    setTestResult(null)
  }

  const handleOperationChange = (v: string) => {
    setOperation(v)
    setPayload(DEFAULT_PAYLOADS[v] ?? '{\n  \n}')
    setTestResult(null)
  }

  const handleRunTest = () => {
    setRunning(true)
    setTestResult(null)
    const delay = 600 + Math.random() * 1200
    setTimeout(() => {
      let parsedOk = true
      try { JSON.parse(payload) } catch { parsedOk = false }
      const isSuccess = parsedOk && !isLiveCall
      const status = isSuccess ? 200 : 400
      setTestResult({
        status,
        latency: Math.round(delay),
        timestamp: new Date().toISOString(),
        body: isSuccess ? MOCK_RESPONSES.success : MOCK_RESPONSES.fail,
      })
      setRunning(false)
    }, delay)
  }

  const handleSaveTestCase = () => {
    if (!saveName.trim()) return
    const tc: StoredTestCase = {
      id: `tc-${String(testCases.length + 1).padStart(3, '0')}`,
      name: saveName.trim(),
      connector,
      operation,
      payload,
      environment,
      lastResult: testResult ? (testResult.status < 300 ? 'pass' : 'fail') : 'pending',
      lastRun: testResult ? new Date().toLocaleString() : 'Never',
    }
    setTestCases(prev => [tc, ...prev])
    setSaveName('')
  }

  const handleDeleteTestCase = (id: string) => {
    setTestCases(prev => prev.filter(tc => tc.id !== id))
  }

  const handleRunStoredCase = (tc: StoredTestCase) => {
    setConnector(tc.connector)
    setEnvironment(tc.environment)
    setOperation(tc.operation)
    setPayload(tc.payload)
    setTestResult(null)
    setTimeout(() => {
      setRunning(true)
      const delay = 600 + Math.random() * 800
      setTimeout(() => {
        setTestResult({
          status: 200,
          latency: Math.round(delay),
          timestamp: new Date().toISOString(),
          body: MOCK_RESPONSES.success,
        })
        setRunning(false)
        setTestCases(prev => prev.map(t =>
          t.id === tc.id ? { ...t, lastResult: 'pass', lastRun: new Date().toLocaleString() } : t
        ))
      }, delay)
    }, 50)
  }

  const storedCaseColumns: ISTableColumn[] = [
    { key: 'name',       label: 'Name',       render: (v) => (
      <span style={{ ...fontBase, color: IS.text, fontWeight: 600, fontSize: '13px' }}>{v}</span>
    )},
    { key: 'connector',  label: 'Connector',  width: '110px', render: (v) => (
      <span style={{ ...fontBase, fontSize: '12px', color: IS.cyan, textTransform: 'capitalize' }}>{v}</span>
    )},
    { key: 'operation',  label: 'Operation',  width: '160px', render: (v) => (
      <span style={{ ...fontBase, fontFamily: 'monospace', fontSize: '12px', color: IS.gold }}>{v}</span>
    )},
    { key: 'environment', label: 'Env',       width: '70px', render: (v) => (
      <EnvironmentBadge env={v as 'Dev' | 'Test' | 'Prod'} />
    )},
    { key: 'lastResult', label: 'Last Result', width: '100px', render: (v) => (
      <TestResultBadge result={v as 'pass' | 'fail' | 'pending'} />
    )},
    { key: 'lastRun',    label: 'Last Run',   width: '160px', render: (v) => (
      <span style={{ ...fontBase, fontSize: '12px', color: IS.label }}>{v}</span>
    )},
    { key: 'id',         label: 'Actions',    width: '120px', render: (_, row) => (
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={e => { e.stopPropagation(); handleRunStoredCase(row as StoredTestCase) }}
          style={{
            ...fontBase,
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: `${IS.blue}20`,
            border: `1px solid ${IS.blue}40`,
            color: IS.blue,
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Run
        </button>
        <button
          onClick={e => { e.stopPropagation(); handleDeleteTestCase(row.id as string) }}
          style={{
            ...fontBase,
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: `${IS.red}15`,
            border: `1px solid ${IS.red}35`,
            color: IS.red,
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
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
            backgroundColor: `${IS.green}20`,
            border: `1px solid ${IS.green}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={IS.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <div>
            <h1 style={{ ...fontBase, margin: 0, fontSize: '20px', fontWeight: 800, color: IS.textWhite, letterSpacing: '-0.01em' }}>
              Testing Console
            </h1>
            <p style={{ ...fontBase, margin: 0, fontSize: '13px', color: IS.muted, marginTop: '2px' }}>
              Execute operations against connectors in any environment
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'flex-end',
        padding: '16px 20px',
        backgroundColor: IS.cardBg,
        border: `1px solid ${IS.cardBorder}`,
        borderRadius: '12px',
        marginBottom: '16px',
      }}>
        <div style={{ flex: '1 1 160px', minWidth: '140px' }}>
          <ISSelect
            label="Connector"
            value={connector}
            options={CONNECTOR_OPTIONS}
            onChange={handleConnectorChange}
          />
        </div>
        <div style={{ flex: '0 1 120px' }}>
          <ISSelect
            label="Environment"
            value={environment}
            options={ENVIRONMENT_OPTIONS}
            onChange={v => setEnvironment(v as 'Dev' | 'Test' | 'Prod')}
          />
        </div>
        <div style={{ flex: '1 1 200px', minWidth: '160px' }}>
          <ISSelect
            label="Operation"
            value={operation}
            options={operations}
            onChange={handleOperationChange}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '2px' }}>
          <Toggle
            value={isLiveCall}
            onChange={setIsLiveCall}
            leftLabel="Dry Run"
            rightLabel="Live Call"
          />
          {environment === 'Prod' && isLiveCall && (
            <span style={{
              ...fontBase,
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: `${IS.red}15`,
              border: `1px solid ${IS.red}40`,
              color: IS.red,
              fontSize: '11px',
              fontWeight: 700,
            }}>
              LIVE PROD
            </span>
          )}
        </div>
        <div style={{ paddingBottom: '2px' }}>
          <ISButton onClick={handleRunTest} disabled={running}>
            {running ? (
              <>
                <span style={{ display: 'inline-block', width: '13px', height: '13px', border: `2px solid ${IS.textWhite}40`, borderTopColor: IS.textWhite, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Running…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Run Test
              </>
            )}
          </ISButton>
        </div>
      </div>

      {/* Split panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Left: Payload editor */}
        <ISCard title="Request Payload">
          <div style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              value={payload}
              onChange={e => setPayload(e.target.value)}
              spellCheck={false}
              style={{
                ...fontBase,
                fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Courier New', monospace",
                width: '100%',
                minHeight: '340px',
                backgroundColor: IS.pageBg,
                border: `1px solid ${IS.cardBorder}`,
                borderRadius: '8px',
                color: IS.text,
                fontSize: '12.5px',
                lineHeight: '1.6',
                padding: '14px 16px',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                caretColor: IS.blue,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = IS.blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${IS.blue}20` }}
              onBlur={e  => { e.currentTarget.style.borderColor = IS.cardBorder; e.currentTarget.style.boxShadow = 'none' }}
            />
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}>
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(payload)
                    setPayload(JSON.stringify(parsed, null, 2))
                  } catch { /* ignore */ }
                }}
                style={{
                  ...fontBase,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: `${IS.inputBorder}25`,
                  border: `1px solid ${IS.inputBorder}`,
                  color: IS.label,
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Format
              </button>
            </div>
          </div>
          {/* Save test case */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <ISInput
                label="Save as Test Case"
                value={saveName}
                onChange={setSaveName}
                placeholder="Test case name…"
              />
            </div>
            <div style={{ paddingBottom: '1px' }}>
              <ISButton variant="secondary" onClick={handleSaveTestCase} disabled={!saveName.trim()}>
                Save
              </ISButton>
            </div>
          </div>
        </ISCard>

        {/* Right: Response panel */}
        <ISCard title="Response">
          {running ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '340px', gap: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: `3px solid ${IS.cardBorder}`,
                borderTopColor: IS.blue,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ ...fontBase, color: IS.muted, fontSize: '13px' }}>Executing request…</span>
            </div>
          ) : testResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Meta row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', paddingBottom: '4px', borderBottom: `1px solid ${IS.cardBorder}40` }}>
                <HttpStatusBadge status={testResult.status} />
                <span style={{ ...fontBase, fontSize: '12px', color: IS.label }}>
                  <span style={{ color: IS.blue, fontWeight: 700 }}>{testResult.latency}ms</span> latency
                </span>
                <span style={{ ...fontBase, fontSize: '12px', color: IS.muted }}>
                  {new Date(testResult.timestamp).toLocaleTimeString()}
                </span>
                <EnvironmentBadge env={environment} />
                {isLiveCall && (
                  <span style={{ ...fontBase, fontSize: '11px', color: IS.red, fontWeight: 700 }}>LIVE</span>
                )}
              </div>
              <JsonPreview data={testResult.body} title="response.json" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '340px', gap: '12px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={IS.cardBorder} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 8 12 12 14 14" />
              </svg>
              <span style={{ ...fontBase, color: IS.muted, fontSize: '13px' }}>No response yet. Run a test to see results.</span>
            </div>
          )}
        </ISCard>
      </div>

      {/* Stored test cases */}
      <ISCard title="Stored Test Cases">
        <ISTable
          columns={storedCaseColumns}
          data={testCases}
        />
      </ISCard>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
