'use client'

import React, { useState } from 'react'
import {
  IS,
  ISCard,
  ISButton,
  ISInput,
  ISSelect,
  JsonPreview,
} from './ISShared'

// ─── Types ────────────────────────────────────────────────────────────────────
type StepType = 'http_call' | 'transform' | 'conditional' | 'wait' | 'loop'
type StepStatus = 'idle' | 'running' | 'success' | 'error' | 'skipped'

interface FlowStep {
  id: string
  type: StepType
  name: string
  status: StepStatus
  // HTTP Call
  method?: string
  url?: string
  bodyTemplate?: string
  headers?: Record<string, string>
  responseVar?: string
  // Transform
  inputVar?: string
  outputVar?: string
  transformScript?: string
  // Conditional
  condition?: string
  trueBranch?: string
  falseBranch?: string
  // Wait
  durationMs?: number
  // Loop
  iterateOver?: string
  loopVar?: string
  maxIterations?: number
  // Compensation
  isCompensation?: boolean
  compensatesStepId?: string
}

interface FlowDefinition {
  id: string
  name: string
  description: string
  domain: string
  version: string
  steps: FlowStep[]
  compensationSteps: FlowStep[]
  sharedContext: Record<string, unknown>
}

// ─── Sample flow ──────────────────────────────────────────────────────────────
const SAMPLE_FLOW: FlowDefinition = {
  id: 'flow_parking_create_res_whitelist',
  name: 'Create Reservation + Whitelist',
  description: 'Creates a parking reservation and immediately whitelists the vehicle for barrier-free entry. Compensates both operations on any failure.',
  domain: 'Parking',
  version: '2.1.0',
  steps: [
    {
      id: 's1',
      type: 'transform',
      name: 'Prepare Request',
      status: 'idle',
      inputVar: 'ctx.input',
      outputVar: 'ctx.reservationPayload',
      transformScript: 'mapCanonicalToVendor(ctx.input, "CreateReservation")',
    },
    {
      id: 's2',
      type: 'http_call',
      name: 'Create Reservation',
      status: 'idle',
      method: 'POST',
      url: 'https://api.parkwhiz.com/v4/bookings',
      bodyTemplate: '{{ctx.reservationPayload}}',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {{ctx.token}}' },
      responseVar: 'ctx.vendorBooking',
    },
    {
      id: 's3',
      type: 'transform',
      name: 'Map Reservation Response',
      status: 'idle',
      inputVar: 'ctx.vendorBooking',
      outputVar: 'ctx.reservation',
      transformScript: 'mapVendorToCanonical(ctx.vendorBooking, "CreateReservation")',
    },
    {
      id: 's4',
      type: 'conditional',
      name: 'Whitelist Required?',
      status: 'idle',
      condition: 'ctx.input.whitelistOnCreate === true',
      trueBranch: 's5',
      falseBranch: 's8',
    },
    {
      id: 's5',
      type: 'transform',
      name: 'Prepare Whitelist Payload',
      status: 'idle',
      inputVar: 'ctx.reservation',
      outputVar: 'ctx.whitelistPayload',
      transformScript: 'buildWhitelistPayload(ctx.reservation)',
    },
    {
      id: 's6',
      type: 'http_call',
      name: 'Whitelist Vehicle',
      status: 'idle',
      method: 'POST',
      url: 'https://api.parkwhiz.com/v4/whitelist/entries',
      bodyTemplate: '{{ctx.whitelistPayload}}',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {{ctx.token}}' },
      responseVar: 'ctx.whitelistResult',
    },
    {
      id: 's7',
      type: 'wait',
      name: 'Propagation Delay',
      status: 'idle',
      durationMs: 500,
    },
    {
      id: 's8',
      type: 'loop',
      name: 'Notify Observers',
      status: 'idle',
      iterateOver: 'ctx.input.observers',
      loopVar: 'observer',
      maxIterations: 10,
    },
  ],
  compensationSteps: [
    {
      id: 'c1',
      type: 'http_call',
      name: 'Cancel Reservation',
      status: 'idle',
      method: 'DELETE',
      url: 'https://api.parkwhiz.com/v4/bookings/{{ctx.vendorBooking.booking_id}}',
      headers: { 'Authorization': 'Bearer {{ctx.token}}' },
      responseVar: 'ctx.cancelResult',
      isCompensation: true,
      compensatesStepId: 's2',
    },
    {
      id: 'c2',
      type: 'http_call',
      name: 'Remove Whitelist Entry',
      status: 'idle',
      method: 'DELETE',
      url: 'https://api.parkwhiz.com/v4/whitelist/entries/{{ctx.whitelistResult.entry_id}}',
      headers: { 'Authorization': 'Bearer {{ctx.token}}' },
      responseVar: 'ctx.removeResult',
      isCompensation: true,
      compensatesStepId: 's6',
    },
  ],
  sharedContext: {
    token: '{{resolved_at_runtime}}',
    input: {
      vehicle: { licensePlate: 'AB12 CDE' },
      location: { facilityId: 'FAC-LON-042' },
      startTime: '2026-03-05T10:00:00Z',
      endTime: '2026-03-05T12:00:00Z',
      whitelistOnCreate: true,
      observers: ['system.audit', 'system.billing'],
    },
    reservation: null,
    vendorBooking: null,
    whitelistPayload: null,
    whitelistResult: null,
  },
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STEP_TYPE_CONFIG: Record<StepType, { label: string; color: string; icon: React.ReactNode }> = {
  http_call:   {
    label: 'HTTP Call',
    color: IS.blue,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  transform:   {
    label: 'Transform',
    color: IS.purple,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
      </svg>
    ),
  },
  conditional: {
    label: 'Conditional',
    color: IS.yellow,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    ),
  },
  wait:        {
    label: 'Wait',
    color: IS.cyan,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  loop:        {
    label: 'Loop',
    color: IS.orange,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
}

const STATUS_CONFIG: Record<StepStatus, { color: string; label: string }> = {
  idle:    { color: IS.muted,   label: 'Idle' },
  running: { color: IS.blue,    label: 'Running' },
  success: { color: IS.green,   label: 'Success' },
  error:   { color: IS.red,     label: 'Error' },
  skipped: { color: IS.muted,   label: 'Skipped' },
}

const HTTP_METHODS = [
  { value: 'GET',    label: 'GET' },
  { value: 'POST',   label: 'POST' },
  { value: 'PUT',    label: 'PUT' },
  { value: 'PATCH',  label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
]

const ADD_STEP_OPTIONS: { type: StepType; label: string }[] = [
  { type: 'http_call',   label: 'HTTP Call' },
  { type: 'transform',   label: 'Transform' },
  { type: 'conditional', label: 'Conditional' },
  { type: 'wait',        label: 'Wait' },
  { type: 'loop',        label: 'Loop' },
]

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StepTypeBadge({ type }: { type: StepType }) {
  const { label, color, icon } = STEP_TYPE_CONFIG[type]
  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 9px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 700,
      color,
      backgroundColor: `${color}18`,
      border: `1px solid ${color}35`,
      whiteSpace: 'nowrap',
    }}>
      {icon}
      {label}
    </span>
  )
}

function StepStatusDot({ status }: { status: StepStatus }) {
  const { color } = STATUS_CONFIG[status]
  return (
    <div style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
      boxShadow: status === 'running' ? `0 0 6px ${color}` : 'none',
    }} />
  )
}

function ConnectorLine({ completed }: { completed: boolean }) {
  return (
    <div style={{
      width: '2px',
      height: '20px',
      backgroundColor: completed ? IS.green : `${IS.muted}30`,
      margin: '0 auto',
      transition: 'background-color 0.2s ease',
    }} />
  )
}

function StepCard({
  step,
  index,
  selected,
  onSelect,
  onDelete,
  isCompensation,
}: {
  step: FlowStep
  index: number
  selected: boolean
  onSelect: () => void
  onDelete: () => void
  isCompensation?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const { color } = STEP_TYPE_CONFIG[step.type]

  const getSummary = () => {
    switch (step.type) {
      case 'http_call':   return `${step.method} ${step.url ?? ''}`
      case 'transform':   return `${step.inputVar ?? ''} → ${step.outputVar ?? ''}`
      case 'conditional': return `if ${step.condition ?? ''}`
      case 'wait':        return `${step.durationMs ?? 0} ms`
      case 'loop':        return `for ${step.loopVar ?? 'item'} in ${step.iterateOver ?? ''}`
      default:            return ''
    }
  }

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '14px 16px',
        borderRadius: '10px',
        backgroundColor: selected
          ? `${color}10`
          : hovered
          ? `${IS.inputBorder}12`
          : IS.cardBg2,
        border: `1px solid ${selected ? color + '45' : IS.cardBorder}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        position: 'relative',
        borderLeft: `3px solid ${isCompensation ? IS.red : color}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
          {/* Step index */}
          {!isCompensation && (
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: `${color}20`,
              border: `1.5px solid ${color}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ ...fontBase, color, fontSize: '11px', fontWeight: 700 }}>{index + 1}</span>
            </div>
          )}
          {isCompensation && (
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: `${IS.red}20`,
              border: `1.5px solid ${IS.red}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={IS.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4.27" />
              </svg>
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{ ...fontBase, color: IS.text, fontSize: '13px', fontWeight: 700 }}>{step.name}</span>
              <StepTypeBadge type={step.type} />
              <StepStatusDot status={step.status} />
            </div>
            <code style={{
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontSize: '11px',
              color: IS.muted,
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {getSummary()}
            </code>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '3px',
            color: IS.muted,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.12s ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = IS.red)}
          onMouseLeave={e => (e.currentTarget.style.color = IS.muted)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function StepDetailPanel({
  step,
  onUpdate,
}: {
  step: FlowStep
  onUpdate: (updated: FlowStep) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Name */}
      <ISInput
        label="Step Name"
        value={step.name}
        onChange={v => onUpdate({ ...step, name: v })}
        placeholder="Step name"
      />

      {/* Type-specific fields */}
      {step.type === 'http_call' && (
        <>
          <ISSelect
            label="HTTP Method"
            value={step.method ?? 'GET'}
            options={HTTP_METHODS}
            onChange={v => onUpdate({ ...step, method: v })}
          />
          <ISInput
            label="URL"
            value={step.url ?? ''}
            onChange={v => onUpdate({ ...step, url: v })}
            placeholder="https://api.vendor.com/v1/resource"
          />
          <ISInput
            label="Response Variable"
            value={step.responseVar ?? ''}
            onChange={v => onUpdate({ ...step, responseVar: v })}
            placeholder="ctx.response"
          />
          {step.headers && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ ...fontBase, color: IS.label, fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Headers
              </span>
              <div style={{
                padding: '10px 12px',
                backgroundColor: IS.inputBg,
                border: `1px solid ${IS.inputBorder}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {Object.entries(step.headers).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <code style={{ ...fontBase, color: IS.cyan, fontSize: '11px', fontFamily: "'Fira Code', monospace", minWidth: '120px' }}>{k}</code>
                    <span style={{ color: IS.muted, fontSize: '11px' }}>:</span>
                    <code style={{ ...fontBase, color: IS.muted, fontSize: '11px', fontFamily: "'Fira Code', monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {step.type === 'transform' && (
        <>
          <ISInput
            label="Input Variable"
            value={step.inputVar ?? ''}
            onChange={v => onUpdate({ ...step, inputVar: v })}
            placeholder="ctx.input"
          />
          <ISInput
            label="Output Variable"
            value={step.outputVar ?? ''}
            onChange={v => onUpdate({ ...step, outputVar: v })}
            placeholder="ctx.output"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ ...fontBase, color: IS.label, fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Transform Script
            </label>
            <textarea
              value={step.transformScript ?? ''}
              onChange={e => onUpdate({ ...step, transformScript: e.target.value })}
              rows={3}
              style={{
                ...fontBase,
                width: '100%',
                padding: '8px 10px',
                backgroundColor: IS.inputBg,
                border: `1px solid ${IS.inputBorder}`,
                borderRadius: '8px',
                color: IS.text,
                fontSize: '12px',
                fontFamily: "'Fira Code', monospace",
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </>
      )}

      {step.type === 'conditional' && (
        <>
          <ISInput
            label="Condition Expression"
            value={step.condition ?? ''}
            onChange={v => onUpdate({ ...step, condition: v })}
            placeholder="ctx.value === true"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <ISInput
              label="True Branch (step ID)"
              value={step.trueBranch ?? ''}
              onChange={v => onUpdate({ ...step, trueBranch: v })}
              placeholder="s5"
            />
            <ISInput
              label="False Branch (step ID)"
              value={step.falseBranch ?? ''}
              onChange={v => onUpdate({ ...step, falseBranch: v })}
              placeholder="s8"
            />
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
            padding: '10px 14px',
            backgroundColor: `${IS.yellow}08`,
            border: `1px solid ${IS.yellow}25`,
            borderRadius: '8px',
          }}>
            <div>
              <span style={{ ...fontBase, color: IS.green, fontSize: '11px', fontWeight: 700 }}>TRUE</span>
              <p style={{ ...fontBase, color: IS.label, fontSize: '12px', margin: '2px 0 0 0' }}>→ {step.trueBranch ?? '(unset)'}</p>
            </div>
            <div style={{ width: '1px', backgroundColor: IS.cardBorder }} />
            <div>
              <span style={{ ...fontBase, color: IS.red, fontSize: '11px', fontWeight: 700 }}>FALSE</span>
              <p style={{ ...fontBase, color: IS.label, fontSize: '12px', margin: '2px 0 0 0' }}>→ {step.falseBranch ?? '(unset)'}</p>
            </div>
          </div>
        </>
      )}

      {step.type === 'wait' && (
        <ISInput
          label="Duration (ms)"
          value={String(step.durationMs ?? 0)}
          onChange={v => onUpdate({ ...step, durationMs: parseInt(v) || 0 })}
          placeholder="500"
          type="number"
        />
      )}

      {step.type === 'loop' && (
        <>
          <ISInput
            label="Iterate Over"
            value={step.iterateOver ?? ''}
            onChange={v => onUpdate({ ...step, iterateOver: v })}
            placeholder="ctx.items"
          />
          <ISInput
            label="Loop Variable"
            value={step.loopVar ?? ''}
            onChange={v => onUpdate({ ...step, loopVar: v })}
            placeholder="item"
          />
          <ISInput
            label="Max Iterations"
            value={String(step.maxIterations ?? 100)}
            onChange={v => onUpdate({ ...step, maxIterations: parseInt(v) || 100 })}
            placeholder="100"
            type="number"
          />
        </>
      )}
    </div>
  )
}

function AddStepDropdown({ onAdd }: { onAdd: (type: StepType) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <ISButton variant="secondary" onClick={() => setOpen(o => !o)}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Step
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </ISButton>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 101,
            backgroundColor: IS.cardBg,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
            minWidth: '180px',
          }}>
            {ADD_STEP_OPTIONS.map(opt => {
              const { color, icon } = STEP_TYPE_CONFIG[opt.type]
              return (
                <button
                  key={opt.type}
                  onClick={() => { onAdd(opt.type); setOpen(false) }}
                  style={{
                    ...fontBase,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 14px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: IS.text,
                    fontSize: '13px',
                    textAlign: 'left',
                    transition: 'background-color 0.12s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${IS.inputBorder}20`)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ color }}>{icon}</span>
                  {opt.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Simulated run ────────────────────────────────────────────────────────────
function simulateRun(steps: FlowStep[]): Promise<FlowStep[]> {
  return new Promise(resolve => {
    let current = steps.map(s => ({ ...s, status: 'idle' as StepStatus }))
    let i = 0

    const tick = () => {
      if (i >= current.length) {
        resolve(current)
        return
      }
      current = current.map((s, idx) => {
        if (idx === i) return { ...s, status: 'running' as StepStatus }
        if (idx < i)  return { ...s, status: s.status === 'running' ? 'success' as StepStatus : s.status }
        return s
      })
      // Simulate previous step completing
      if (i > 0) current[i - 1] = { ...current[i - 1], status: (Math.random() > 0.05 ? 'success' : 'error') as StepStatus }
      i++
      setTimeout(tick, 500)
    }
    tick()
  })
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ISFlows() {
  const [flow, setFlow] = useState<FlowDefinition>(SAMPLE_FLOW)
  const [selectedStepId, setSelectedStepId] = useState<string | null>('s2')
  const [contextOpen, setContextOpen] = useState(true)
  const [running, setRunning] = useState(false)
  const [showCompensation, setShowCompensation] = useState(true)

  const allSteps = flow.steps
  const selectedStep =
    allSteps.find(s => s.id === selectedStepId) ??
    flow.compensationSteps.find(s => s.id === selectedStepId) ??
    null

  const updateStep = (updated: FlowStep) => {
    setFlow(f => ({
      ...f,
      steps: f.steps.map(s => s.id === updated.id ? updated : s),
      compensationSteps: f.compensationSteps.map(s => s.id === updated.id ? updated : s),
    }))
  }

  const deleteStep = (id: string) => {
    setFlow(f => ({
      ...f,
      steps: f.steps.filter(s => s.id !== id),
      compensationSteps: f.compensationSteps.filter(s => s.id !== id),
    }))
    if (selectedStepId === id) setSelectedStepId(null)
  }

  const addStep = (type: StepType) => {
    const newStep: FlowStep = {
      id: `s${Date.now()}`,
      type,
      name: `New ${STEP_TYPE_CONFIG[type].label}`,
      status: 'idle',
      method:   type === 'http_call'   ? 'GET'   : undefined,
      url:      type === 'http_call'   ? ''      : undefined,
      inputVar: type === 'transform'   ? 'ctx.'  : undefined,
      outputVar:type === 'transform'   ? 'ctx.'  : undefined,
      condition:type === 'conditional' ? ''      : undefined,
      durationMs: type === 'wait'      ? 1000    : undefined,
      iterateOver: type === 'loop'     ? 'ctx.'  : undefined,
      loopVar:   type === 'loop'       ? 'item'  : undefined,
      maxIterations: type === 'loop'   ? 100     : undefined,
    }
    setFlow(f => ({ ...f, steps: [...f.steps, newStep] }))
    setSelectedStepId(newStep.id)
  }

  const handleRun = async () => {
    setRunning(true)
    setSelectedStepId(null)
    const updated = await simulateRun(flow.steps)
    setFlow(f => ({ ...f, steps: updated }))
    setRunning(false)
  }

  const resetStatuses = () => {
    setFlow(f => ({
      ...f,
      steps: f.steps.map(s => ({ ...s, status: 'idle' })),
    }))
  }

  return (
    <div style={{
      ...fontBase,
      backgroundColor: IS.pageBg,
      minHeight: '100%',
      padding: '28px',
      color: IS.text,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ ...fontBase, color: IS.textWhite, fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
              {flow.name}
            </h1>
            <span style={{
              ...fontBase,
              padding: '2px 8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              color: IS.gold,
              backgroundColor: `${IS.gold}15`,
              border: `1px solid ${IS.gold}30`,
            }}>
              v{flow.version}
            </span>
            <span style={{
              ...fontBase,
              padding: '2px 8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              color: IS.blue,
              backgroundColor: `${IS.blue}15`,
              border: `1px solid ${IS.blue}30`,
            }}>
              {flow.domain}
            </span>
          </div>
          <p style={{ ...fontBase, color: IS.muted, fontSize: '13px', margin: 0, maxWidth: '540px', lineHeight: 1.5 }}>
            {flow.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <ISButton variant="secondary" onClick={resetStatuses}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.27" />
            </svg>
            Reset
          </ISButton>
          <ISButton onClick={handleRun} disabled={running}>
            {running ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Running…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Simulate Run
              </>
            )}
          </ISButton>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
        {/* Left column — step list + compensation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Steps card */}
          <div style={{
            backgroundColor: IS.cardBg,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: `1px solid ${IS.cardBorder}`,
              backgroundColor: IS.cardBg2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={IS.label} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span style={{ ...fontBase, color: IS.text, fontSize: '14px', fontWeight: 700 }}>Flow Steps</span>
                <span style={{
                  ...fontBase,
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: IS.muted,
                  backgroundColor: `${IS.muted}18`,
                  border: `1px solid ${IS.muted}30`,
                }}>
                  {flow.steps.length}
                </span>
              </div>
              <AddStepDropdown onAdd={addStep} />
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
              {flow.steps.map((step, i) => (
                <React.Fragment key={step.id}>
                  <StepCard
                    step={step}
                    index={i}
                    selected={step.id === selectedStepId}
                    onSelect={() => setSelectedStepId(step.id === selectedStepId ? null : step.id)}
                    onDelete={() => deleteStep(step.id)}
                  />
                  {i < flow.steps.length - 1 && (
                    <ConnectorLine completed={step.status === 'success'} />
                  )}
                </React.Fragment>
              ))}

              {flow.steps.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 24px',
                  color: IS.muted,
                  fontSize: '13px',
                }}>
                  No steps yet. Use &quot;Add Step&quot; to begin building the flow.
                </div>
              )}
            </div>
          </div>

          {/* Compensation steps */}
          <div style={{
            backgroundColor: IS.cardBg,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setShowCompensation(p => !p)}
              style={{
                ...fontBase,
                width: '100%',
                padding: '14px 20px',
                backgroundColor: IS.cardBg2,
                border: 'none',
                borderBottom: showCompensation ? `1px solid ${IS.cardBorder}` : 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={IS.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-4.27" />
                </svg>
                <span style={{ ...fontBase, color: IS.text, fontSize: '14px', fontWeight: 700 }}>Compensation Steps</span>
                <span style={{
                  ...fontBase,
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: IS.red,
                  backgroundColor: `${IS.red}18`,
                  border: `1px solid ${IS.red}30`,
                }}>
                  {flow.compensationSteps.length}
                </span>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={IS.muted}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: showCompensation ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showCompensation && (
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ ...fontBase, color: IS.muted, fontSize: '12px', margin: '0 0 12px 0', lineHeight: 1.6 }}>
                  These steps execute automatically if the flow fails after partial completion, rolling back side effects in reverse order.
                </p>
                {flow.compensationSteps.map((step, i) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    index={i}
                    selected={step.id === selectedStepId}
                    onSelect={() => setSelectedStepId(step.id === selectedStepId ? null : step.id)}
                    onDelete={() => deleteStep(step.id)}
                    isCompensation
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — step detail + shared context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>

          {/* Step detail */}
          <div style={{
            backgroundColor: IS.cardBg,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 16px',
              borderBottom: `1px solid ${IS.cardBorder}`,
              backgroundColor: IS.cardBg2,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={IS.label} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
              <span style={{ ...fontBase, color: IS.text, fontSize: '13px', fontWeight: 700 }}>
                {selectedStep ? 'Step Detail' : 'Step Detail'}
              </span>
              {selectedStep && (
                <StepTypeBadge type={selectedStep.type} />
              )}
            </div>
            <div style={{ padding: '16px' }}>
              {selectedStep ? (
                <StepDetailPanel step={selectedStep} onUpdate={updateStep} />
              ) : (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: IS.muted,
                  fontSize: '12px',
                  lineHeight: 1.6,
                }}>
                  Select a step from the flow to inspect and edit its configuration.
                </div>
              )}
            </div>
          </div>

          {/* Shared context */}
          <div style={{
            backgroundColor: IS.cardBg,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setContextOpen(p => !p)}
              style={{
                ...fontBase,
                width: '100%',
                padding: '12px 16px',
                backgroundColor: IS.cardBg2,
                border: 'none',
                borderBottom: contextOpen ? `1px solid ${IS.cardBorder}` : 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={IS.label} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
                <span style={{ ...fontBase, color: IS.text, fontSize: '13px', fontWeight: 700 }}>Shared Context</span>
              </div>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={IS.muted}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: contextOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {contextOpen && (
              <div style={{ padding: '12px' }}>
                <JsonPreview data={flow.sharedContext} title="ctx" />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
