'use client'

import React, { useState } from 'react'
import {
  IS,
  WizardStepper,
  ISCard,
  ISButton,
  ISInput,
  ISSelect,
} from './ISShared'
import {
  CheckmarkRegular,
  DismissRegular,
  SubtractRegular,
} from '@fluentui/react-icons'

// ─── Types ────────────────────────────────────────────────────────────────────
interface WizardState {
  domain: string
  externalSystem: string
  apiSpecFile: string | null
  apiSpecMethod: 'upload' | 'manual'
  selectedOperations: string[]
  endpointBindings: Record<string, { method: string; path: string }>
  authProfile: string
  timeout: string
  retries: string
  circuitBreaker: boolean
  rateLimit: string
  eventsMode: 'webhook' | 'polling'
  webhookUrl: string
  pollInterval: string
  testResults: TestResult[] | null
  version: string
}

interface TestResult {
  operation: string
  status: 'pass' | 'fail' | 'skip'
  latencyMs: number
  message: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STEP_LABELS = [
  'Domain',
  'System',
  'Import API',
  'Operations',
  'Endpoints',
  'Auth',
  'Policies',
  'Events',
  'Test',
  'Version',
]

const DOMAINS = [
  { value: '', label: '— Select domain —' },
  { value: 'parking', label: 'Parking' },
  { value: 'ev_charging', label: 'EV Charging' },
  { value: 'fleet', label: 'Fleet Management' },
  { value: 'payments', label: 'Payments' },
  { value: 'identity', label: 'Identity & Access' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'notifications', label: 'Notifications' },
]

const EXTERNAL_SYSTEMS = [
  { value: '', label: '— Select system —' },
  { value: 'parkwhiz', label: 'ParkWhiz API v3' },
  { value: 'parkmobile', label: 'ParkMobile REST' },
  { value: 'spplus', label: 'SP+ Connect' },
  { value: 'flowbird', label: 'Flowbird Cloud' },
  { value: 'skidata', label: 'SKIDATA ParkWeb' },
  { value: 'custom', label: 'Custom / Other' },
]

const CANONICAL_OPERATIONS = [
  'CreateReservation',
  'CancelReservation',
  'GetReservation',
  'ListAvailability',
  'UpdateReservation',
  'GetVehicle',
  'WhitelistVehicle',
  'RemoveWhitelist',
  'GetPricingRules',
  'ProcessPayment',
]

const AUTH_PROFILES = [
  { value: '', label: '— Select profile —' },
  { value: 'oauth2_cc', label: 'OAuth 2.0 — Client Credentials' },
  { value: 'oauth2_pkce', label: 'OAuth 2.0 — PKCE' },
  { value: 'api_key_header', label: 'API Key (Header)' },
  { value: 'api_key_query', label: 'API Key (Query Param)' },
  { value: 'basic_auth', label: 'Basic Auth' },
  { value: 'mtls', label: 'mTLS Certificate' },
  { value: 'none', label: 'No Auth' },
]

const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
]

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

// ─── Helper sub-components ───────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      ...fontBase,
      color: IS.muted,
      fontSize: '13px',
      margin: '0 0 20px 0',
      lineHeight: 1.6,
    }}>
      {children}
    </p>
  )
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...fontBase,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: hovered ? `${IS.inputBorder}18` : 'transparent',
        transition: 'background-color 0.12s ease',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: '16px',
        height: '16px',
        borderRadius: '4px',
        border: `2px solid ${checked ? IS.blue : IS.inputBorder}`,
        backgroundColor: checked ? IS.blue : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.15s ease',
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
      </div>
      <span style={{ color: IS.text, fontSize: '13px', fontWeight: checked ? 600 : 400 }}>
        {label}
      </span>
    </label>
  )
}

function ToggleSwitch({
  labelA,
  labelB,
  value,
  onChange,
}: {
  labelA: string
  labelB: string
  value: 'a' | 'b'
  onChange: (v: 'a' | 'b') => void
}) {
  return (
    <div style={{
      ...fontBase,
      display: 'inline-flex',
      backgroundColor: IS.inputBg,
      border: `1px solid ${IS.inputBorder}`,
      borderRadius: '10px',
      padding: '3px',
      gap: '2px',
    }}>
      {(['a', 'b'] as const).map(side => {
        const isActive = value === side
        const label = side === 'a' ? labelA : labelB
        return (
          <button
            key={side}
            onClick={() => onChange(side)}
            style={{
              ...fontBase,
              padding: '7px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isActive ? IS.blue : 'transparent',
              color: isActive ? '#fff' : IS.muted,
              fontSize: '13px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function TestResultRow({ result }: { result: TestResult }) {
  const statusConfig = {
    pass: { color: IS.green, Icon: CheckmarkRegular, label: 'Pass' },
    fail: { color: IS.red,   Icon: DismissRegular,   label: 'Fail' },
    skip: { color: IS.muted, Icon: SubtractRegular,  label: 'Skip' },
  }
  const { color, Icon, label } = statusConfig[result.status]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      borderRadius: '8px',
      backgroundColor: `${color}0D`,
      border: `1px solid ${color}25`,
      marginBottom: '8px',
    }}>
      <Icon style={{ color, width: '18px', height: '18px', flexShrink: 0 }} />
      <span style={{ color: IS.text, fontSize: '13px', fontWeight: 600, flex: 1 }}>{result.operation}</span>
      <span style={{ color: IS.muted, fontSize: '12px' }}>{result.latencyMs} ms</span>
      <span style={{
        ...fontBase,
        padding: '2px 8px',
        borderRadius: '10px',
        fontSize: '11px',
        fontWeight: 700,
        color,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}30`,
      }}>{label}</span>
      <span style={{ color: IS.muted, fontSize: '12px', minWidth: '160px', textAlign: 'right' }}>{result.message}</span>
    </div>
  )
}

// ─── Step panels ──────────────────────────────────────────────────────────────
function StepChooseDomain({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SectionLabel>
        Select the canonical domain this connector will integrate with. The domain determines the available operations, schema shapes, and governance policies applied at runtime.
      </SectionLabel>
      <div style={{ maxWidth: '420px' }}>
        <ISSelect
          label="Canonical Domain"
          value={state.domain}
          options={DOMAINS}
          onChange={v => setState(s => ({ ...s, domain: v }))}
        />
      </div>
      {state.domain && (
        <div style={{
          padding: '14px 18px',
          backgroundColor: `${IS.blue}10`,
          border: `1px solid ${IS.blue}30`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={IS.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '1px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p style={{ ...fontBase, color: IS.blue, fontSize: '13px', fontWeight: 600, margin: '0 0 4px 0' }}>
              Domain: {DOMAINS.find(d => d.value === state.domain)?.label}
            </p>
            <p style={{ ...fontBase, color: IS.label, fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
              This domain includes canonical operations, schema definitions, and standard error codes. Connector behaviour will be validated against the {DOMAINS.find(d => d.value === state.domain)?.label} canonical model.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function StepSelectSystem({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SectionLabel>
        Choose the external vendor system this connector will interface with. Systems are registered in the global integration registry and carry their own base URL, credentials, and capability metadata.
      </SectionLabel>
      <div style={{ maxWidth: '420px' }}>
        <ISSelect
          label="External System"
          value={state.externalSystem}
          options={EXTERNAL_SYSTEMS}
          onChange={v => setState(s => ({ ...s, externalSystem: v }))}
        />
      </div>
      {state.externalSystem && state.externalSystem !== 'custom' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          maxWidth: '560px',
        }}>
          {[
            { label: 'Base URL', value: 'https://api.parkwhiz.com/v4' },
            { label: 'API Version', value: 'v4.2.1' },
            { label: 'Protocol', value: 'REST / JSON' },
            { label: 'Auth Type', value: 'OAuth 2.0 CC' },
          ].map(item => (
            <div key={item.label} style={{
              padding: '12px 16px',
              backgroundColor: IS.cardBg2,
              border: `1px solid ${IS.cardBorder}`,
              borderRadius: '8px',
            }}>
              <p style={{ ...fontBase, color: IS.muted, fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>{item.label}</p>
              <p style={{ ...fontBase, color: IS.text, fontSize: '13px', fontWeight: 500, margin: 0, fontFamily: "'Fira Code', monospace" }}>{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StepImportAPI({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setState(s => ({ ...s, apiSpecFile: file.name, apiSpecMethod: 'upload' }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SectionLabel>
        Provide the vendor API specification so the builder can auto-discover endpoints, request/response schemas, and error contracts.
      </SectionLabel>

      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? IS.blue : state.apiSpecFile ? IS.green : IS.inputBorder}`,
          borderRadius: '12px',
          padding: '36px 24px',
          textAlign: 'center',
          backgroundColor: dragOver ? `${IS.blue}08` : state.apiSpecFile ? `${IS.green}08` : 'transparent',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        onClick={() => setState(s => ({ ...s, apiSpecFile: 'openapi_spec.yaml', apiSpecMethod: 'upload' }))}
      >
        {state.apiSpecFile ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={IS.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p style={{ ...fontBase, color: IS.green, fontSize: '14px', fontWeight: 600, margin: 0 }}>{state.apiSpecFile}</p>
            <p style={{ ...fontBase, color: IS.muted, fontSize: '12px', margin: 0 }}>Spec loaded — click to replace</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={IS.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p style={{ ...fontBase, color: IS.text, fontSize: '14px', fontWeight: 600, margin: 0 }}>Drop OpenAPI / Swagger spec here</p>
            <p style={{ ...fontBase, color: IS.muted, fontSize: '12px', margin: 0 }}>Supports .yaml, .json (OpenAPI 2 / 3, Swagger 2)</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: IS.cardBorder }} />
        <span style={{ ...fontBase, color: IS.muted, fontSize: '12px', fontWeight: 600 }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: IS.cardBorder }} />
      </div>

      <ISButton
        variant={state.apiSpecMethod === 'manual' ? 'primary' : 'secondary'}
        onClick={() => setState(s => ({ ...s, apiSpecMethod: 'manual', apiSpecFile: null }))}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add endpoints manually
      </ISButton>

      {state.apiSpecMethod === 'manual' && (
        <div style={{
          padding: '16px 18px',
          backgroundColor: `${IS.yellow}08`,
          border: `1px solid ${IS.yellow}30`,
          borderRadius: '10px',
        }}>
          <p style={{ ...fontBase, color: IS.yellow, fontSize: '13px', fontWeight: 600, margin: '0 0 6px 0' }}>Manual mode</p>
          <p style={{ ...fontBase, color: IS.label, fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
            You will manually define each endpoint path, method, request body, and response shape in the next steps. This is suitable when the vendor does not provide a machine-readable spec.
          </p>
        </div>
      )}
    </div>
  )
}

function StepSelectOperations({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  const toggle = (op: string) => {
    setState(s => ({
      ...s,
      selectedOperations: s.selectedOperations.includes(op)
        ? s.selectedOperations.filter(o => o !== op)
        : [...s.selectedOperations, op],
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SectionLabel>
        Select the canonical operations this connector should implement. Only selected operations will appear in the endpoint binding step. At least one operation is required.
      </SectionLabel>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
      }}>
        <ISButton variant="secondary" onClick={() => setState(s => ({ ...s, selectedOperations: CANONICAL_OPERATIONS }))}>
          Select all
        </ISButton>
        <ISButton variant="secondary" onClick={() => setState(s => ({ ...s, selectedOperations: [] }))}>
          Clear
        </ISButton>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4px',
        backgroundColor: IS.cardBg2,
        border: `1px solid ${IS.cardBorder}`,
        borderRadius: '10px',
        padding: '8px',
      }}>
        {CANONICAL_OPERATIONS.map(op => (
          <CheckboxRow
            key={op}
            label={op}
            checked={state.selectedOperations.includes(op)}
            onChange={() => toggle(op)}
          />
        ))}
      </div>
      {state.selectedOperations.length > 0 && (
        <p style={{ ...fontBase, color: IS.muted, fontSize: '12px', margin: 0 }}>
          {state.selectedOperations.length} operation{state.selectedOperations.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}

function StepBindEndpoints({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  const ops = state.selectedOperations.length > 0 ? state.selectedOperations : ['CreateReservation', 'CancelReservation']

  const updateBinding = (op: string, field: 'method' | 'path', value: string) => {
    setState(s => ({
      ...s,
      endpointBindings: {
        ...s.endpointBindings,
        [op]: {
          method: s.endpointBindings[op]?.method ?? 'POST',
          path: s.endpointBindings[op]?.path ?? '',
          [field]: value,
        },
      },
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SectionLabel>
        Bind each canonical operation to its corresponding vendor endpoint. Specify the HTTP method and relative path (e.g. /v2/reservations). The base URL is inherited from the selected system.
      </SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ops.map(op => (
          <div key={op} style={{
            padding: '14px 16px',
            backgroundColor: IS.cardBg2,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '10px',
          }}>
            <p style={{ ...fontBase, color: IS.text, fontSize: '13px', fontWeight: 700, margin: '0 0 12px 0' }}>
              {op}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px' }}>
              <ISSelect
                label="Method"
                value={state.endpointBindings[op]?.method ?? 'POST'}
                options={HTTP_METHODS}
                onChange={v => updateBinding(op, 'method', v)}
              />
              <ISInput
                label="Vendor Path"
                value={state.endpointBindings[op]?.path ?? ''}
                onChange={v => updateBinding(op, 'path', v)}
                placeholder="/v2/reservations"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepAuthProfile({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SectionLabel>
        Select or configure an authentication profile for this connector. Auth profiles are managed centrally and can be reused across multiple connectors.
      </SectionLabel>
      <div style={{ maxWidth: '420px' }}>
        <ISSelect
          label="Auth Profile"
          value={state.authProfile}
          options={AUTH_PROFILES}
          onChange={v => setState(s => ({ ...s, authProfile: v }))}
        />
      </div>

      {state.authProfile === 'oauth2_cc' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px' }}>
          <ISInput label="Token URL" value="https://auth.parkwhiz.com/oauth/token" onChange={() => {}} placeholder="https://…/oauth/token" />
          <ISInput label="Client ID" value="client_abc123" onChange={() => {}} placeholder="client_id" />
          <ISInput label="Client Secret" value="••••••••••••••••" onChange={() => {}} type="password" placeholder="client_secret" />
          <ISInput label="Scope" value="reservations.read reservations.write" onChange={() => {}} placeholder="scope1 scope2" />
        </div>
      )}

      {state.authProfile === 'api_key_header' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px' }}>
          <ISInput label="Header Name" value="X-API-Key" onChange={() => {}} placeholder="X-API-Key" />
          <ISInput label="API Key" value="••••••••••••••••" onChange={() => {}} type="password" placeholder="your-api-key" />
        </div>
      )}

      {state.authProfile === 'basic_auth' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px' }}>
          <ISInput label="Username" value="" onChange={() => {}} placeholder="username" />
          <ISInput label="Password" value="" onChange={() => {}} type="password" placeholder="password" />
        </div>
      )}

      {state.authProfile === 'none' && (
        <div style={{
          padding: '14px 18px',
          backgroundColor: `${IS.yellow}08`,
          border: `1px solid ${IS.yellow}30`,
          borderRadius: '10px',
        }}>
          <p style={{ ...fontBase, color: IS.yellow, fontSize: '13px', fontWeight: 600, margin: '0 0 4px 0' }}>No authentication</p>
          <p style={{ ...fontBase, color: IS.label, fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
            This connector will make unauthenticated requests. Ensure the vendor endpoint is intentionally public.
          </p>
        </div>
      )}
    </div>
  )
}

function StepRuntimePolicies({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionLabel>
        Configure runtime reliability policies applied to every outbound call made by this connector. These settings override global defaults for this connector specifically.
      </SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '560px' }}>
        <ISInput
          label="Timeout (ms)"
          value={state.timeout}
          onChange={v => setState(s => ({ ...s, timeout: v }))}
          placeholder="5000"
          type="number"
        />
        <ISInput
          label="Max Retries"
          value={state.retries}
          onChange={v => setState(s => ({ ...s, retries: v }))}
          placeholder="3"
          type="number"
        />
        <ISInput
          label="Rate Limit (req/min)"
          value={state.rateLimit}
          onChange={v => setState(s => ({ ...s, rateLimit: v }))}
          placeholder="60"
          type="number"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ ...fontBase, color: IS.label, fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Circuit Breaker
          </span>
          <label style={{ ...fontBase, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '4px' }}>
            <div
              onClick={() => setState(s => ({ ...s, circuitBreaker: !s.circuitBreaker }))}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: state.circuitBreaker ? IS.blue : IS.inputBorder,
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                top: '3px',
                left: state.circuitBreaker ? '19px' : '3px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }} />
            </div>
            <span style={{ color: IS.text, fontSize: '13px' }}>
              {state.circuitBreaker ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
      </div>

      {state.circuitBreaker && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', maxWidth: '560px' }}>
          <ISInput label="Failure Threshold (%)" value="50" onChange={() => {}} placeholder="50" type="number" />
          <ISInput label="Half-open Probes" value="3" onChange={() => {}} placeholder="3" type="number" />
          <ISInput label="Open Window (s)" value="30" onChange={() => {}} placeholder="30" type="number" />
        </div>
      )}
    </div>
  )
}

function StepEventsSync({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionLabel>
        Configure how this connector receives change events from the vendor system. Choose webhook for push-based delivery or polling for pull-based periodic fetching.
      </SectionLabel>

      <ToggleSwitch
        labelA="Webhook"
        labelB="Polling"
        value={state.eventsMode === 'webhook' ? 'a' : 'b'}
        onChange={v => setState(s => ({ ...s, eventsMode: v === 'a' ? 'webhook' : 'polling' }))}
      />

      {state.eventsMode === 'webhook' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: IS.cardBg2,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ ...fontBase, color: IS.muted, fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>Inbound URL</span>
            <code style={{ ...fontBase, color: IS.cyan, fontSize: '12px', fontFamily: "'Fira Code', monospace", flex: 1 }}>
              https://gateway.neox.io/webhooks/parking/v1/{'{connector-id}'}
            </code>
          </div>
          <ISInput
            label="Vendor Registration URL"
            value={state.webhookUrl}
            onChange={v => setState(s => ({ ...s, webhookUrl: v }))}
            placeholder="https://api.vendor.com/webhooks/register"
          />
          <ISInput label="HMAC Secret" value="••••••••••••••••••" onChange={() => {}} type="password" placeholder="Shared secret for payload verification" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ ...fontBase, color: IS.label, fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Events to Subscribe
            </span>
            {['reservation.created', 'reservation.cancelled', 'reservation.updated', 'vehicle.whitelisted'].map(ev => (
              <CheckboxRow key={ev} label={ev} checked={true} onChange={() => {}} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
          <ISInput
            label="Poll Interval (seconds)"
            value={state.pollInterval}
            onChange={v => setState(s => ({ ...s, pollInterval: v }))}
            placeholder="30"
            type="number"
          />
          <ISInput label="Fetch Endpoint" value="" onChange={() => {}} placeholder="/v2/events?since={last_cursor}" />
          <ISInput label="Cursor Field" value="last_event_id" onChange={() => {}} placeholder="last_event_id" />
        </div>
      )}
    </div>
  )
}

function StepTest({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  const [running, setRunning] = useState(false)

  const runTests = () => {
    setRunning(true)
    setTimeout(() => {
      const ops = state.selectedOperations.length > 0 ? state.selectedOperations.slice(0, 5) : ['CreateReservation', 'CancelReservation', 'GetReservation']
      const results: TestResult[] = ops.map(op => {
        const r = Math.random()
        if (r > 0.25) return { operation: op, status: 'pass', latencyMs: Math.floor(80 + Math.random() * 220), message: '200 OK — response schema valid' }
        if (r > 0.1)  return { operation: op, status: 'fail', latencyMs: Math.floor(1200 + Math.random() * 800), message: '401 Unauthorized — token expired' }
        return { operation: op, status: 'skip', latencyMs: 0, message: 'Skipped — no test credentials' }
      })
      setState(s => ({ ...s, testResults: results }))
      setRunning(false)
    }, 1800)
  }

  const passCount = state.testResults?.filter(r => r.status === 'pass').length ?? 0
  const failCount = state.testResults?.filter(r => r.status === 'fail').length ?? 0
  const total = state.testResults?.length ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SectionLabel>
        Run a connectivity and contract test against the vendor sandbox. Tests validate authentication, endpoint reachability, request serialisation, and response schema compliance.
      </SectionLabel>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ISButton onClick={runTests} disabled={running}>
          {running ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Running…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Run Tests
            </>
          )}
        </ISButton>
        {state.testResults && !running && (
          <span style={{ ...fontBase, color: failCount === 0 ? IS.green : IS.yellow, fontSize: '13px', fontWeight: 600 }}>
            {passCount}/{total} passed
          </span>
        )}
      </div>

      {state.testResults && !running && (
        <div>
          {state.testResults.map((r, i) => <TestResultRow key={i} result={r} />)}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function StepCreateVersion({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  const [deployed, setDeployed] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionLabel>
        Assign a semantic version to this connector build. The connector will be packaged and deployed to the Dev environment automatically. Further promotion to Test and Prod requires a manual approval gate.
      </SectionLabel>

      <div style={{ maxWidth: '320px' }}>
        <ISInput
          label="Version Number"
          value={state.version}
          onChange={v => setState(s => ({ ...s, version: v }))}
          placeholder="1.0.0"
        />
      </div>

      <div style={{
        padding: '16px 18px',
        backgroundColor: IS.cardBg2,
        border: `1px solid ${IS.cardBorder}`,
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '480px',
      }}>
        <p style={{ ...fontBase, color: IS.label, fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>Summary</p>
        {[
          { label: 'Domain',  value: DOMAINS.find(d => d.value === state.domain)?.label ?? '—' },
          { label: 'System',  value: EXTERNAL_SYSTEMS.find(s => s.value === state.externalSystem)?.label ?? '—' },
          { label: 'Operations', value: state.selectedOperations.length > 0 ? `${state.selectedOperations.length} selected` : '—' },
          { label: 'Auth',    value: AUTH_PROFILES.find(a => a.value === state.authProfile)?.label ?? '—' },
          { label: 'Events',  value: state.eventsMode === 'webhook' ? 'Webhook' : 'Polling' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...fontBase, color: IS.muted, fontSize: '12px' }}>{item.label}</span>
            <span style={{ ...fontBase, color: IS.text, fontSize: '12px', fontWeight: 600 }}>{item.value}</span>
          </div>
        ))}
      </div>

      {deployed ? (
        <div style={{
          padding: '16px 20px',
          backgroundColor: `${IS.green}10`,
          border: `1px solid ${IS.green}30`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={IS.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <p style={{ ...fontBase, color: IS.green, fontSize: '14px', fontWeight: 700, margin: '0 0 2px 0' }}>
              Connector v{state.version || '1.0.0'} deployed to Dev
            </p>
            <p style={{ ...fontBase, color: IS.label, fontSize: '12px', margin: 0 }}>
              Connector ID: conn_{state.externalSystem || 'custom'}_{Date.now().toString(36)}
            </p>
          </div>
        </div>
      ) : (
        <ISButton
          onClick={() => setDeployed(true)}
          disabled={!state.version}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Create & Deploy to Dev
        </ISButton>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ISConnectorBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<WizardState>({
    domain: '',
    externalSystem: '',
    apiSpecFile: null,
    apiSpecMethod: 'upload',
    selectedOperations: [],
    endpointBindings: {},
    authProfile: '',
    timeout: '5000',
    retries: '3',
    circuitBreaker: true,
    rateLimit: '60',
    eventsMode: 'webhook',
    webhookUrl: '',
    pollInterval: '30',
    testResults: null,
    version: '1.0.0',
  })

  const STEPS = [
    <StepChooseDomain     key={0} state={state} setState={setState} />,
    <StepSelectSystem     key={1} state={state} setState={setState} />,
    <StepImportAPI        key={2} state={state} setState={setState} />,
    <StepSelectOperations key={3} state={state} setState={setState} />,
    <StepBindEndpoints    key={4} state={state} setState={setState} />,
    <StepAuthProfile      key={5} state={state} setState={setState} />,
    <StepRuntimePolicies  key={6} state={state} setState={setState} />,
    <StepEventsSync       key={7} state={state} setState={setState} />,
    <StepTest             key={8} state={state} setState={setState} />,
    <StepCreateVersion    key={9} state={state} setState={setState} />,
  ]

  const canGoNext = () => {
    if (currentStep === 0) return !!state.domain
    if (currentStep === 1) return !!state.externalSystem
    if (currentStep === 2) return !!state.apiSpecFile || state.apiSpecMethod === 'manual'
    if (currentStep === 3) return state.selectedOperations.length > 0
    if (currentStep === 5) return !!state.authProfile
    return true
  }

  return (
    <div style={{
      ...fontBase,
      backgroundColor: IS.pageBg,
      minHeight: '100%',
      padding: '28px',
      color: IS.text,
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          ...fontBase,
          color: IS.textWhite,
          fontSize: '22px',
          fontWeight: 800,
          margin: '0 0 6px 0',
          letterSpacing: '-0.01em',
        }}>
          Connector Builder
        </h1>
        <p style={{ ...fontBase, color: IS.muted, fontSize: '14px', margin: 0 }}>
          Build and deploy a new vendor connector in {STEP_LABELS.length} steps
        </p>
      </div>

      {/* Wizard stepper */}
      <div style={{
        backgroundColor: IS.cardBg,
        border: `1px solid ${IS.cardBorder}`,
        borderRadius: '12px',
        padding: '20px 16px',
        marginBottom: '20px',
      }}>
        <WizardStepper steps={STEP_LABELS} currentStep={currentStep} />
      </div>

      {/* Step content */}
      <div style={{
        backgroundColor: IS.cardBg,
        border: `1px solid ${IS.cardBorder}`,
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '20px',
      }}>
        {/* Step header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${IS.cardBorder}`,
          backgroundColor: IS.cardBg2,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: IS.blue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>{currentStep + 1}</span>
          </div>
          <div>
            <h2 style={{ ...fontBase, color: IS.textWhite, fontSize: '15px', fontWeight: 700, margin: '0 0 2px 0' }}>
              Step {currentStep + 1} — {STEP_LABELS[currentStep]}
            </h2>
            <p style={{ ...fontBase, color: IS.muted, fontSize: '12px', margin: 0 }}>
              {currentStep + 1} of {STEP_LABELS.length}
            </p>
          </div>
        </div>

        {/* Panel body */}
        <div style={{ padding: '28px 28px 32px' }}>
          {STEPS[currentStep]}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <ISButton
          variant="secondary"
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </ISButton>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {STEP_LABELS.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                width: i === currentStep ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: i < currentStep ? IS.green : i === currentStep ? IS.blue : `${IS.muted}40`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>

        {currentStep < STEP_LABELS.length - 1 ? (
          <ISButton
            onClick={() => setCurrentStep(s => Math.min(STEP_LABELS.length - 1, s + 1))}
            disabled={!canGoNext()}
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </ISButton>
        ) : (
          <ISButton variant="secondary" disabled>
            Finished
          </ISButton>
        )}
      </div>
    </div>
  )
}
