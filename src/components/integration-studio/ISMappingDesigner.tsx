'use client'

import React, { useState } from 'react'
import {
  IS,
  ISTabBar,
  ISButton,
  ISSelect,
  SchemaTree,
  JsonPreview,
} from './ISShared'

// ─── Types ────────────────────────────────────────────────────────────────────
type TransformType = 'direct' | 'constant' | 'if_else' | 'lookup' | 'regex' | 'date' | 'template'

interface MappingRule {
  id: string
  canonicalField: string
  transformType: TransformType
  vendorField: string
  transformConfig: string
}

type MappingTabId = 'request' | 'response' | 'error'

// ─── Sample schemas ────────────────────────────────────────────────────────────
const CANONICAL_PARKING_SCHEMA = [
  {
    name: 'reservation',
    type: 'object',
    required: true,
    children: [
      { name: 'id',            type: 'string',  required: true },
      { name: 'status',        type: 'string',  required: true },
      { name: 'startTime',     type: 'string',  required: true },
      { name: 'endTime',       type: 'string',  required: true },
      { name: 'durationMinutes', type: 'integer' },
      {
        name: 'vehicle',
        type: 'object',
        required: true,
        children: [
          { name: 'licensePlate', type: 'string', required: true },
          { name: 'make',         type: 'string' },
          { name: 'model',        type: 'string' },
          { name: 'color',        type: 'string' },
        ],
      },
      {
        name: 'location',
        type: 'object',
        required: true,
        children: [
          { name: 'facilityId',   type: 'string', required: true },
          { name: 'facilityName', type: 'string' },
          { name: 'zone',         type: 'string' },
          { name: 'spotNumber',   type: 'string' },
        ],
      },
      {
        name: 'pricing',
        type: 'object',
        children: [
          { name: 'currency',    type: 'string' },
          { name: 'totalAmount', type: 'number' },
          { name: 'taxAmount',   type: 'number' },
        ],
      },
      { name: 'createdAt',  type: 'string' },
      { name: 'updatedAt',  type: 'string' },
    ],
  },
]

const VENDOR_PARKING_SCHEMA = [
  {
    name: 'booking',
    type: 'object',
    children: [
      { name: 'booking_id',     type: 'string',  required: true },
      { name: 'booking_status', type: 'string',  required: true },
      { name: 'start_dt',       type: 'string',  required: true },
      { name: 'end_dt',         type: 'string',  required: true },
      { name: 'duration_mins',  type: 'integer' },
      {
        name: 'vehicle_info',
        type: 'object',
        children: [
          { name: 'plate',  type: 'string', required: true },
          { name: 'brand',  type: 'string' },
          { name: 'model',  type: 'string' },
          { name: 'colour', type: 'string' },
        ],
      },
      {
        name: 'site',
        type: 'object',
        children: [
          { name: 'site_id',   type: 'string', required: true },
          { name: 'site_name', type: 'string' },
          { name: 'area_code', type: 'string' },
          { name: 'bay',       type: 'string' },
        ],
      },
      {
        name: 'cost',
        type: 'object',
        children: [
          { name: 'ccy',       type: 'string' },
          { name: 'total_gbp', type: 'number' },
          { name: 'tax_gbp',   type: 'number' },
        ],
      },
      { name: 'created_at',  type: 'string' },
      { name: 'modified_at', type: 'string' },
    ],
  },
]

// ─── Default mapping rules ─────────────────────────────────────────────────────
const DEFAULT_REQUEST_RULES: MappingRule[] = [
  { id: 'r1', canonicalField: 'reservation.vehicle.licensePlate', transformType: 'direct',   vendorField: 'booking.vehicle_info.plate',    transformConfig: '' },
  { id: 'r2', canonicalField: 'reservation.startTime',           transformType: 'date',     vendorField: 'booking.start_dt',              transformConfig: 'ISO8601 → Unix epoch' },
  { id: 'r3', canonicalField: 'reservation.endTime',             transformType: 'date',     vendorField: 'booking.end_dt',                transformConfig: 'ISO8601 → Unix epoch' },
  { id: 'r4', canonicalField: 'reservation.location.facilityId', transformType: 'lookup',   vendorField: 'booking.site.site_id',          transformConfig: 'facilityId → site_id' },
  { id: 'r5', canonicalField: 'reservation.status',              transformType: 'if_else',  vendorField: 'booking.booking_status',        transformConfig: 'ACTIVE→active, CANCELLED→cancelled' },
]

const DEFAULT_RESPONSE_RULES: MappingRule[] = [
  { id: 'rs1', canonicalField: 'reservation.id',                  transformType: 'direct',   vendorField: 'booking.booking_id',            transformConfig: '' },
  { id: 'rs2', canonicalField: 'reservation.status',              transformType: 'if_else',  vendorField: 'booking.booking_status',        transformConfig: 'active→ACTIVE, cancelled→CANCELLED' },
  { id: 'rs3', canonicalField: 'reservation.pricing.totalAmount', transformType: 'direct',   vendorField: 'booking.cost.total_gbp',        transformConfig: '' },
  { id: 'rs4', canonicalField: 'reservation.pricing.currency',    transformType: 'constant', vendorField: '',                              transformConfig: '"GBP"' },
  { id: 'rs5', canonicalField: 'reservation.createdAt',           transformType: 'date',     vendorField: 'booking.created_at',            transformConfig: 'Unix → ISO8601' },
]

const DEFAULT_ERROR_RULES: MappingRule[] = [
  { id: 'e1', canonicalField: 'error.code',    transformType: 'lookup',   vendorField: 'error.error_code',  transformConfig: '401→AUTH_FAILED, 404→NOT_FOUND, 429→RATE_LIMITED' },
  { id: 'e2', canonicalField: 'error.message', transformType: 'template', vendorField: 'error.description', transformConfig: '"Vendor error: {{description}}"' },
  { id: 'e3', canonicalField: 'error.retryable', transformType: 'if_else', vendorField: 'error.error_code', transformConfig: '429,503→true, else→false' },
]

// ─── Sample preview data ───────────────────────────────────────────────────────
const REQUEST_PREVIEW = {
  booking: {
    vehicle_info: { plate: 'AB12 CDE' },
    start_dt: 1741176000,
    end_dt: 1741183200,
    site: { site_id: 'PWZ-LON-042' },
    booking_status: 'active',
  },
}

const RESPONSE_PREVIEW = {
  reservation: {
    id: 'res_7xk2p9',
    status: 'ACTIVE',
    startTime: '2026-03-05T10:00:00Z',
    endTime: '2026-03-05T12:00:00Z',
    pricing: { totalAmount: 12.50, currency: 'GBP' },
    createdAt: '2026-03-04T09:15:33Z',
  },
}

const ERROR_PREVIEW = {
  error: {
    code: 'AUTH_FAILED',
    message: 'Vendor error: Token has expired or is invalid',
    retryable: false,
  },
}

const PREVIEW_MAP: Record<MappingTabId, unknown> = {
  request:  REQUEST_PREVIEW,
  response: RESPONSE_PREVIEW,
  error:    ERROR_PREVIEW,
}

const RULES_MAP: Record<MappingTabId, MappingRule[]> = {
  request:  DEFAULT_REQUEST_RULES,
  response: DEFAULT_RESPONSE_RULES,
  error:    DEFAULT_ERROR_RULES,
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TRANSFORM_OPTIONS: { value: TransformType; label: string }[] = [
  { value: 'direct',   label: 'Direct copy' },
  { value: 'constant', label: 'Constant' },
  { value: 'if_else',  label: 'If / Else' },
  { value: 'lookup',   label: 'Lookup table' },
  { value: 'regex',    label: 'Regex extract' },
  { value: 'date',     label: 'Date format' },
  { value: 'template', label: 'Template string' },
]

const TRANSFORM_COLORS: Record<TransformType, string> = {
  direct:   IS.green,
  constant: IS.purple,
  if_else:  IS.yellow,
  lookup:   IS.cyan,
  regex:    IS.orange,
  date:     IS.blue,
  template: IS.gold,
}

const MAPPING_TABS = [
  { id: 'request',  label: 'Request Mapping' },
  { id: 'response', label: 'Response Mapping' },
  { id: 'error',    label: 'Error Mapping' },
]

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TransformBadge({ type }: { type: TransformType }) {
  const color = TRANSFORM_COLORS[type]
  const label = TRANSFORM_OPTIONS.find(t => t.value === type)?.label ?? type
  return (
    <span style={{
      ...fontBase,
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 700,
      color,
      backgroundColor: `${color}18`,
      border: `1px solid ${color}30`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={IS.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function FieldPill({ value, color = IS.text }: { value: string; color?: string }) {
  return (
    <code style={{
      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
      fontSize: '12px',
      color,
      backgroundColor: `${IS.inputBg}`,
      border: `1px solid ${IS.cardBorder}`,
      borderRadius: '6px',
      padding: '3px 8px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '180px',
      display: 'block',
    }}>
      {value || <span style={{ color: IS.muted, fontStyle: 'italic' }}>—</span>}
    </code>
  )
}

function MappingRow({
  rule,
  selected,
  onSelect,
  onUpdate,
  onDelete,
}: {
  rule: MappingRule
  selected: boolean
  onSelect: () => void
  onUpdate: (updated: MappingRule) => void
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 32px 140px 32px 1fr 32px',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        borderRadius: '8px',
        backgroundColor: selected
          ? `${IS.blue}14`
          : hovered
          ? `${IS.inputBorder}12`
          : 'transparent',
        border: `1px solid ${selected ? IS.blue + '40' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.12s ease',
        marginBottom: '4px',
      }}
    >
      {/* Canonical field */}
      <FieldPill value={rule.canonicalField} color={IS.cyan} />

      {/* Arrow */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ArrowIcon />
      </div>

      {/* Transform type */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TransformBadge type={rule.transformType} />
      </div>

      {/* Arrow */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ArrowIcon />
      </div>

      {/* Vendor field */}
      <FieldPill value={rule.vendorField || '(none)'} color={IS.gold} />

      {/* Delete */}
      <button
        onClick={e => { e.stopPropagation(); onDelete() }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: IS.muted,
          display: 'flex',
          alignItems: 'center',
          borderRadius: '4px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.12s ease, color 0.12s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = IS.red)}
        onMouseLeave={e => (e.currentTarget.style.color = IS.muted)}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

function RuleDetailPanel({
  rule,
  onUpdate,
}: {
  rule: MappingRule
  onUpdate: (updated: MappingRule) => void
}) {
  const [focused, setFocused] = useState<string | null>(null)

  const inputStyle = (field: string): React.CSSProperties => ({
    ...fontBase,
    width: '100%',
    padding: '8px 10px',
    backgroundColor: IS.inputBg,
    border: `1px solid ${focused === field ? IS.blue : IS.inputBorder}`,
    borderRadius: '7px',
    color: IS.text,
    fontSize: '12px',
    fontFamily: "'Fira Code', monospace",
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: focused === field ? `0 0 0 3px ${IS.blue}20` : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Canonical Field
        </label>
        <input
          value={rule.canonicalField}
          onChange={e => onUpdate({ ...rule, canonicalField: e.target.value })}
          onFocus={() => setFocused('canon')}
          onBlur={() => setFocused(null)}
          style={inputStyle('canon')}
        />
      </div>

      <ISSelect
        label="Transform Type"
        value={rule.transformType}
        options={TRANSFORM_OPTIONS}
        onChange={v => onUpdate({ ...rule, transformType: v as TransformType })}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Vendor Field
        </label>
        <input
          value={rule.vendorField}
          onChange={e => onUpdate({ ...rule, vendorField: e.target.value })}
          onFocus={() => setFocused('vendor')}
          onBlur={() => setFocused(null)}
          placeholder="(leave blank for constant)"
          style={inputStyle('vendor')}
        />
      </div>

      {rule.transformType !== 'direct' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Transform Config
          </label>
          <textarea
            value={rule.transformConfig}
            onChange={e => onUpdate({ ...rule, transformConfig: e.target.value })}
            onFocus={() => setFocused('config')}
            onBlur={() => setFocused(null)}
            rows={3}
            placeholder={
              rule.transformType === 'constant'  ? '"your value"' :
              rule.transformType === 'if_else'   ? 'val_a→mapped_a, val_b→mapped_b' :
              rule.transformType === 'lookup'    ? 'key1→val1, key2→val2' :
              rule.transformType === 'regex'     ? '^(\\d{4})-…' :
              rule.transformType === 'date'      ? 'ISO8601 → Unix' :
              rule.transformType === 'template'  ? '"Hello {{name}}"' :
              ''
            }
            style={{
              ...inputStyle('config'),
              resize: 'vertical',
              minHeight: '72px',
              lineHeight: 1.5,
            }}
          />
        </div>
      )}

      <div style={{
        padding: '10px 12px',
        backgroundColor: `${TRANSFORM_COLORS[rule.transformType]}08`,
        border: `1px solid ${TRANSFORM_COLORS[rule.transformType]}25`,
        borderRadius: '8px',
      }}>
        <p style={{ ...fontBase, color: IS.muted, fontSize: '11px', lineHeight: 1.6, margin: 0 }}>
          {rule.transformType === 'direct'   && 'Value is copied from the source field as-is with no modification.'}
          {rule.transformType === 'constant' && 'A fixed literal value is always used regardless of the source payload.'}
          {rule.transformType === 'if_else'  && 'Maps discrete input values to output values via a condition table. Non-matching values pass through unchanged unless a default is specified.'}
          {rule.transformType === 'lookup'   && 'Performs a key→value lookup against a static or dynamic reference table.'}
          {rule.transformType === 'regex'    && 'Applies a regular expression to extract or replace a portion of the string value.'}
          {rule.transformType === 'date'     && 'Converts between date/time formats using the configured source and target pattern.'}
          {rule.transformType === 'template' && 'Renders a Mustache-style template string with values from the current context.'}
        </p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ISMappingDesigner() {
  const [activeTab, setActiveTab] = useState<MappingTabId>('request')
  const [rules, setRules] = useState<Record<MappingTabId, MappingRule[]>>(RULES_MAP)
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>('r1')
  const [previewOpen, setPreviewOpen] = useState(true)

  const currentRules = rules[activeTab]
  const selectedRule = currentRules.find(r => r.id === selectedRuleId) ?? null

  const updateRule = (updated: MappingRule) => {
    setRules(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(r => r.id === updated.id ? updated : r),
    }))
  }

  const deleteRule = (id: string) => {
    setRules(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(r => r.id !== id),
    }))
    if (selectedRuleId === id) setSelectedRuleId(null)
  }

  const addRule = () => {
    const newRule: MappingRule = {
      id: `rule_${Date.now()}`,
      canonicalField: 'reservation.',
      transformType: 'direct',
      vendorField: 'booking.',
      transformConfig: '',
    }
    setRules(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newRule],
    }))
    setSelectedRuleId(newRule.id)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ ...fontBase, color: IS.textWhite, fontSize: '22px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
            Mapping Designer
          </h1>
          <p style={{ ...fontBase, color: IS.muted, fontSize: '14px', margin: 0 }}>
            Parking / ParkWhiz connector — field mapping rules
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ISButton variant="secondary" onClick={() => setPreviewOpen(p => !p)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {previewOpen ? 'Hide preview' : 'Show preview'}
          </ISButton>
          <ISButton>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save mapping
          </ISButton>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        backgroundColor: IS.cardBg,
        border: `1px solid ${IS.cardBorder}`,
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '0 20px' }}>
          <ISTabBar
            tabs={MAPPING_TABS}
            activeTab={activeTab}
            onTabChange={id => {
              setActiveTab(id as MappingTabId)
              setSelectedRuleId(null)
            }}
          />
        </div>

        {/* Three-pane layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 280px',
          minHeight: '480px',
          borderTop: `1px solid ${IS.cardBorder}`,
        }}>
          {/* Left — canonical schema */}
          <div style={{
            borderRight: `1px solid ${IS.cardBorder}`,
            padding: '16px',
            overflowY: 'auto',
          }}>
            <p style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
              Canonical Schema
            </p>
            <SchemaTree schema={CANONICAL_PARKING_SCHEMA} title="Parking — Reservation" />
          </div>

          {/* Center — mapping rules */}
          <div style={{ padding: '16px', overflowY: 'auto' }}>
            {/* Rules header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <p style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
                  Mapping Rules
                </p>
                <p style={{ ...fontBase, color: IS.muted, fontSize: '11px', margin: '2px 0 0 0' }}>
                  {currentRules.length} rule{currentRules.length !== 1 ? 's' : ''}
                </p>
              </div>
              <ISButton variant="secondary" onClick={addRule}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add rule
              </ISButton>
            </div>

            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 32px 140px 32px 1fr 32px',
              gap: '8px',
              padding: '6px 14px',
              marginBottom: '4px',
            }}>
              <span style={{ ...fontBase, color: IS.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Canonical</span>
              <span />
              <span style={{ ...fontBase, color: IS.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'center' }}>Transform</span>
              <span />
              <span style={{ ...fontBase, color: IS.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Vendor</span>
              <span />
            </div>

            {/* Rules list */}
            {currentRules.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: IS.muted,
                fontSize: '13px',
              }}>
                No mapping rules yet. Click &quot;Add rule&quot; to create one.
              </div>
            ) : (
              currentRules.map(rule => (
                <MappingRow
                  key={rule.id}
                  rule={rule}
                  selected={rule.id === selectedRuleId}
                  onSelect={() => setSelectedRuleId(rule.id === selectedRuleId ? null : rule.id)}
                  onUpdate={updateRule}
                  onDelete={() => deleteRule(rule.id)}
                />
              ))
            )}
          </div>

          {/* Right — vendor schema + rule detail */}
          <div style={{
            borderLeft: `1px solid ${IS.cardBorder}`,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* Vendor schema */}
            <div style={{ padding: '16px', borderBottom: `1px solid ${IS.cardBorder}` }}>
              <p style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
                Vendor Schema
              </p>
              <SchemaTree schema={VENDOR_PARKING_SCHEMA} title="ParkWhiz — Booking" />
            </div>

            {/* Rule detail panel */}
            {selectedRule ? (
              <div style={{ padding: '16px' }}>
                <p style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 14px 0' }}>
                  Rule Detail
                </p>
                <RuleDetailPanel rule={selectedRule} onUpdate={updateRule} />
              </div>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                color: IS.muted,
                fontSize: '12px',
                textAlign: 'center',
                lineHeight: 1.6,
              }}>
                Select a mapping rule to edit its details
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview panel */}
      {previewOpen && (
        <div style={{
          backgroundColor: IS.cardBg,
          border: `1px solid ${IS.cardBorder}`,
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 20px',
            borderBottom: `1px solid ${IS.cardBorder}`,
            backgroundColor: IS.cardBg2,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={IS.label} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span style={{ ...fontBase, color: IS.label, fontSize: '13px', fontWeight: 600 }}>
              Mapped Output Preview — {MAPPING_TABS.find(t => t.id === activeTab)?.label}
            </span>
          </div>
          <div style={{ padding: '20px' }}>
            <JsonPreview data={PREVIEW_MAP[activeTab]} title="mapped-output.json" />
          </div>
        </div>
      )}
    </div>
  )
}
