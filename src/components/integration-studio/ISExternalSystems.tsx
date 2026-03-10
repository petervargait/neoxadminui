'use client'

import React, { useState, useMemo } from 'react'
import {
  IS,
  ISCard,
  ISTable,
  ISModal,
  ISInput,
  ISSelect,
  ISButton,
  StatusBadge,
} from './ISShared'
import { useGlobalState } from '@/context/GlobalStateContext'
import type { ExternalSystem } from '@/context/GlobalStateContext'
import {
  ServerRegular,
  CheckmarkCircleRegular,
  WrenchRegular,
  CircleRegular,
} from '@fluentui/react-icons'

// ─── Constants ────────────────────────────────────────────────────────────────
const DOMAIN_TYPES = [
  { value: '',                    label: '— Select domain type —' },
  { value: 'BMS',                 label: 'BMS' },
  { value: 'AV/VC',               label: 'AV / UC' },
  { value: 'IoT',                 label: 'IoT' },
  { value: 'Access Control',      label: 'Access Control' },
  { value: 'Digital Badge',       label: 'Digital Badge' },
  { value: 'Lockers',             label: 'Lockers' },
  { value: 'Ticketing',           label: 'Ticketing' },
  { value: 'Elevator',            label: 'Elevator' },
  { value: 'Visitor Management',  label: 'Visitor Management' },
  { value: 'Parking',             label: 'Parking' },
  { value: 'Event Management',    label: 'Event Management' },
  { value: 'Restaurant',          label: 'Restaurant' },
  { value: 'Waste Management',    label: 'Waste Management' },
  { value: 'Identity Provider',   label: 'Identity Provider' },
]

const STATUS_OPTIONS = [
  { value: 'active',      label: 'Active' },
  { value: 'inactive',    label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' },
]

const EMPTY_FORM = {
  name:       '',
  domainType: '',
  vendor:     '',
  product:    '',
  version:    '',
  tenantId:   '',
  siteId:     '',
  status:     'active' as ExternalSystem['status'],
  endpointDev:    '',
  endpointTest:   '',
  endpointProd:   '',
  apiKeyDev:      '',
  apiTokenDev:    '',
  apiKeyTest:     '',
  apiTokenTest:   '',
  apiKeyProd:     '',
  apiTokenProd:   '',
}

type FormState = typeof EMPTY_FORM

// ─── Connectivity test state ──────────────────────────────────────────────────
type TestState = 'idle' | 'testing' | 'success' | 'fail'

// ─── System Form Modal ────────────────────────────────────────────────────────
function SystemFormModal({
  open,
  onClose,
  onSave,
  initial,
  title,
  tenantOptions,
}: {
  open: boolean
  onClose: () => void
  onSave: (form: FormState) => void
  initial?: FormState
  title: string
  tenantOptions: { value: string; label: string }[]
}) {
  const [form, setForm] = useState<FormState>(initial ?? EMPTY_FORM)
  const [testState, setTestState] = useState<TestState>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  // Sync form when initial changes (edit mode)
  React.useEffect(() => {
    if (open) {
      setForm(initial ?? EMPTY_FORM)
      setTestState('idle')
      setErrors({})
    }
  }, [open, initial])

  const set = (key: keyof FormState) => (v: string) =>
    setForm(prev => ({ ...prev, [key]: v }))

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim())       next.name       = 'Name is required'
    if (!form.domainType)        next.domainType  = 'Domain type is required'
    if (!form.vendor.trim())     next.vendor      = 'Vendor is required'
    if (!form.product.trim())    next.product     = 'Product is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSave() {
    if (validate()) onSave(form)
  }

  function handleTestConnectivity() {
    if (!form.endpointDev && !form.endpointTest && !form.endpointProd) return
    setTestState('testing')
    // Simulate network round-trip
    setTimeout(() => {
      // Deterministically succeed unless a URL contains 'fail' for demo purposes
      const allUrls = [form.endpointDev, form.endpointTest, form.endpointProd].join('')
      setTestState(allUrls.toLowerCase().includes('fail') ? 'fail' : 'success')
    }, 1800)
  }

  const testColor =
    testState === 'success' ? IS.green  :
    testState === 'fail'    ? IS.red    :
    testState === 'testing' ? IS.yellow : IS.muted

  const testLabel =
    testState === 'testing' ? 'Testing…'        :
    testState === 'success' ? 'All endpoints OK' :
    testState === 'fail'    ? 'Connectivity failed' : 'Test Connectivity'

  const hasEndpoint = !!(form.endpointDev || form.endpointTest || form.endpointProd)

  const fieldRow = (children: React.ReactNode) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
      {children}
    </div>
  )

  return (
    <ISModal open={open} onClose={onClose} title={title} width="640px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Section: Identity */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '-4px',
        }}>
          <div style={{
            height: '1px',
            flex: 1,
            backgroundColor: IS.cardBorder,
          }} />
          <span style={{
            color: IS.muted,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
            padding: '0 8px',
            whiteSpace: 'nowrap',
          }}>
            System Identity
          </span>
          <div style={{ height: '1px', flex: 1, backgroundColor: IS.cardBorder }} />
        </div>

        {/* Name + Domain */}
        {fieldRow(
          <>
            <div>
              <ISInput
                label="System Name"
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. ACME Parking API"
              />
              {errors.name && (
                <div style={{ color: IS.red, fontSize: '11px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
                  {errors.name}
                </div>
              )}
            </div>
            <div>
              <ISSelect
                label="Domain Type"
                value={form.domainType}
                options={DOMAIN_TYPES}
                onChange={set('domainType')}
              />
              {errors.domainType && (
                <div style={{ color: IS.red, fontSize: '11px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
                  {errors.domainType}
                </div>
              )}
            </div>
          </>
        )}

        {/* Vendor + Product */}
        {fieldRow(
          <>
            <div>
              <ISInput
                label="Vendor"
                value={form.vendor}
                onChange={set('vendor')}
                placeholder="e.g. ACME Corp"
              />
              {errors.vendor && (
                <div style={{ color: IS.red, fontSize: '11px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
                  {errors.vendor}
                </div>
              )}
            </div>
            <div>
              <ISInput
                label="Product"
                value={form.product}
                onChange={set('product')}
                placeholder="e.g. ParkManager Pro"
              />
              {errors.product && (
                <div style={{ color: IS.red, fontSize: '11px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
                  {errors.product}
                </div>
              )}
            </div>
          </>
        )}

        {/* Version + Status */}
        {fieldRow(
          <>
            <ISInput
              label="Version"
              value={form.version}
              onChange={set('version')}
              placeholder="e.g. 3.2.1"
            />
            <ISSelect
              label="Status"
              value={form.status}
              options={STATUS_OPTIONS}
              onChange={v => set('status')(v)}
            />
          </>
        )}

        {/* Tenant + Site */}
        {fieldRow(
          <>
            <ISSelect
              label="Tenant"
              value={form.tenantId}
              options={tenantOptions}
              onChange={set('tenantId')}
            />
            <ISInput
              label="Site ID"
              value={form.siteId}
              onChange={set('siteId')}
              placeholder="site_xyz789"
            />
          </>
        )}

        {/* Section: Endpoints */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: IS.cardBorder }} />
          <span style={{
            color: IS.muted,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
            padding: '0 8px',
            whiteSpace: 'nowrap',
          }}>
            Endpoints
          </span>
          <div style={{ height: '1px', flex: 1, backgroundColor: IS.cardBorder }} />
        </div>

        {/* ── Dev environment ── */}
        <div style={{
          padding: '14px',
          borderRadius: '10px',
          backgroundColor: `${IS.blue}08`,
          border: `1px solid ${IS.blue}20`,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <span style={{
            color: IS.blue,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
          }}>
            Dev
          </span>
          <ISInput
            label="Base URL"
            value={form.endpointDev}
            onChange={set('endpointDev')}
            placeholder="https://dev.api.example.com"
            type="url"
          />
          {fieldRow(
            <>
              <ISInput label="API Key" value={form.apiKeyDev} onChange={set('apiKeyDev')} placeholder="Dev API key" />
              <ISInput label="API Token" value={form.apiTokenDev} onChange={set('apiTokenDev')} placeholder="Dev API token" />
            </>
          )}
        </div>

        {/* ── Test environment ── */}
        <div style={{
          padding: '14px',
          borderRadius: '10px',
          backgroundColor: `${IS.yellow}08`,
          border: `1px solid ${IS.yellow}20`,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <span style={{
            color: IS.yellow,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
          }}>
            Test
          </span>
          <ISInput
            label="Base URL"
            value={form.endpointTest}
            onChange={set('endpointTest')}
            placeholder="https://test.api.example.com"
            type="url"
          />
          {fieldRow(
            <>
              <ISInput label="API Key" value={form.apiKeyTest} onChange={set('apiKeyTest')} placeholder="Test API key" />
              <ISInput label="API Token" value={form.apiTokenTest} onChange={set('apiTokenTest')} placeholder="Test API token" />
            </>
          )}
        </div>

        {/* ── Prod environment ── */}
        <div style={{
          padding: '14px',
          borderRadius: '10px',
          backgroundColor: `${IS.green}08`,
          border: `1px solid ${IS.green}20`,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <span style={{
            color: IS.green,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
          }}>
            Prod
          </span>
          <ISInput
            label="Base URL"
            value={form.endpointProd}
            onChange={set('endpointProd')}
            placeholder="https://api.example.com"
            type="url"
          />
          {fieldRow(
            <>
              <ISInput label="API Key" value={form.apiKeyProd} onChange={set('apiKeyProd')} placeholder="Prod API key" />
              <ISInput label="API Token" value={form.apiTokenProd} onChange={set('apiTokenProd')} placeholder="Prod API token" />
            </>
          )}
        </div>

        {/* Connectivity test result */}
        {testState !== 'idle' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: `${testColor}12`,
            border: `1px solid ${testColor}35`,
            fontFamily: "'Inter', sans-serif",
          }}>
            {testState === 'testing' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={testColor} strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : testState === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={testColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={testColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span style={{ color: testColor, fontSize: '13px', fontWeight: 600 }}>
              {testLabel}
            </span>
          </div>
        )}

        {/* Footer actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '4px',
          gap: '10px',
        }}>
          <ISButton
            variant="secondary"
            onClick={handleTestConnectivity}
            disabled={!hasEndpoint || testState === 'testing'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <circle cx="12" cy="20" r="1" />
            </svg>
            Test Connectivity
          </ISButton>

          <div style={{ display: 'flex', gap: '10px' }}>
            <ISButton variant="secondary" onClick={onClose}>Cancel</ISButton>
            <ISButton variant="primary" onClick={handleSave}>Save System</ISButton>
          </div>
        </div>
      </div>
    </ISModal>
  )
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({
  open,
  systemName,
  onClose,
  onConfirm,
}: {
  open: boolean
  systemName: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <ISModal open={open} onClose={onClose} title="Delete External System" width="420px">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
          padding: '14px',
          borderRadius: '8px',
          backgroundColor: `${IS.red}10`,
          border: `1px solid ${IS.red}30`,
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: `${IS.red}20`,
            border: `1px solid ${IS.red}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={IS.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
          <div>
            <div style={{ color: IS.text, fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
              Are you sure?
            </div>
            <div style={{ color: IS.label, fontSize: '13px', lineHeight: 1.5 }}>
              You are about to permanently delete{' '}
              <span style={{ color: IS.textWhite, fontWeight: 600 }}>{systemName}</span>.
              Any connectors referencing this system may stop working.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <ISButton variant="secondary" onClick={onClose}>Cancel</ISButton>
          <ISButton variant="danger" onClick={onConfirm}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
            Delete
          </ISButton>
        </div>
      </div>
    </ISModal>
  )
}

// ─── Status badge mapping (ExternalSystem status → StatusBadge) ───────────────
function systemStatusBadge(status: ExternalSystem['status']) {
  const map: Record<ExternalSystem['status'], 'ok' | 'warning' | 'critical' | 'inactive'> = {
    active:      'ok',
    inactive:    'inactive',
    maintenance: 'warning',
  }
  return <StatusBadge status={map[status]} />
}

// ─── Form ↔ ExternalSystem conversion helpers ─────────────────────────────────
function formToSystem(form: FormState): Omit<ExternalSystem, 'id' | 'createdAt'> {
  const endpoints: ExternalSystem['endpoints'] = []
  if (form.endpointDev)  endpoints.push({ env: 'Dev',  baseUrl: form.endpointDev,  apiKey: form.apiKeyDev.trim()  || undefined, apiToken: form.apiTokenDev.trim()  || undefined })
  if (form.endpointTest) endpoints.push({ env: 'Test', baseUrl: form.endpointTest, apiKey: form.apiKeyTest.trim() || undefined, apiToken: form.apiTokenTest.trim() || undefined })
  if (form.endpointProd) endpoints.push({ env: 'Prod', baseUrl: form.endpointProd, apiKey: form.apiKeyProd.trim() || undefined, apiToken: form.apiTokenProd.trim() || undefined })

  return {
    name:       form.name.trim(),
    domainType: form.domainType,
    vendor:     form.vendor.trim(),
    product:    form.product.trim(),
    version:    form.version.trim(),
    tenantId:   form.tenantId.trim(),
    siteId:     form.siteId.trim(),
    status:     form.status,
    endpoints,
  }
}

function systemToForm(system: ExternalSystem): FormState {
  const dev  = system.endpoints.find(e => e.env === 'Dev'  || e.env === 'dev')
  const test = system.endpoints.find(e => e.env === 'Test' || e.env === 'test' || e.env === 'staging')
  const prod = system.endpoints.find(e => e.env === 'Prod' || e.env === 'prod' || e.env === 'production')

  return {
    name:           system.name,
    domainType:     system.domainType,
    vendor:         system.vendor,
    product:        system.product,
    version:        system.version,
    tenantId:       system.tenantId,
    siteId:         system.siteId,
    status:         system.status,
    endpointDev:    dev?.baseUrl  ?? '',
    endpointTest:   test?.baseUrl ?? '',
    endpointProd:   prod?.baseUrl ?? '',
    apiKeyDev:      dev?.apiKey   ?? '',
    apiTokenDev:    dev?.apiToken ?? '',
    apiKeyTest:     test?.apiKey  ?? '',
    apiTokenTest:   test?.apiToken ?? '',
    apiKeyProd:     prod?.apiKey  ?? '',
    apiTokenProd:   prod?.apiToken ?? '',
  }
}

// ─── ISExternalSystems ────────────────────────────────────────────────────────
export default function ISExternalSystems() {
  const {
    externalSystems,
    addExternalSystem,
    updateExternalSystem,
    deleteExternalSystem,
    tenants,
  } = useGlobalState()

  // Build tenant options for dropdown
  const tenantOptions = useMemo(() => [
    { value: '', label: '— Select tenant —' },
    ...tenants.map(t => ({ value: t.id, label: t.name })),
  ], [tenants])

  // Modal state
  const [createOpen, setCreateOpen]         = useState(false)
  const [editSystem, setEditSystem]         = useState<ExternalSystem | null>(null)
  const [deleteTarget, setDeleteTarget]     = useState<ExternalSystem | null>(null)

  // Search / filter
  const [search, setSearch]                 = useState('')
  const [filterDomain, setFilterDomain]     = useState('')
  const [filterStatus, setFilterStatus]     = useState('')

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleCreate(form: FormState) {
    addExternalSystem(formToSystem(form))
    setCreateOpen(false)
  }

  function handleEdit(form: FormState) {
    if (!editSystem) return
    updateExternalSystem(editSystem.id, formToSystem(form))
    setEditSystem(null)
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteExternalSystem(deleteTarget.id)
    setDeleteTarget(null)
  }

  // ── Filtered data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return externalSystems.filter(s => {
      if (filterDomain && s.domainType !== filterDomain) return false
      if (filterStatus && s.status    !== filterStatus)  return false
      if (q && ![s.name, s.vendor, s.product, s.domainType, s.tenantId, s.siteId]
        .some(f => f.toLowerCase().includes(q))) return false
      return true
    })
  }, [externalSystems, search, filterDomain, filterStatus])

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'name',
      label: 'Name',
      width: '20%',
      render: (v: unknown, row: Record<string, unknown>) => (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
          <div style={{ color: IS.text, fontWeight: 700, fontSize: '13px' }}>{String(v ?? '')}</div>
          <div style={{ color: IS.muted, fontSize: '11px', marginTop: '2px', fontFamily: "'Fira Code', monospace" }}>
            {String(row.id ?? '')}
          </div>
        </div>
      ),
    },
    {
      key: 'domainType',
      label: 'Domain',
      width: '16%',
      render: (v: unknown) => (
        <span style={{
          fontFamily: "'Inter', sans-serif",
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 600,
          color: IS.cyan,
          backgroundColor: `${IS.cyan}15`,
          border: `1px solid ${IS.cyan}30`,
          whiteSpace: 'nowrap',
        }}>
          {String(v || '—')}
        </span>
      ),
    },
    {
      key: 'vendor',
      label: 'Vendor',
      width: '14%',
      render: (v: unknown) => (
        <span style={{ color: IS.label, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{String(v ?? '')}</span>
      ),
    },
    {
      key: 'product',
      label: 'Product',
      width: '16%',
      render: (v: unknown, row: Record<string, unknown>) => (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
          <div style={{ color: IS.text, fontSize: '13px' }}>{String(v ?? '')}</div>
          {row.version ? (
            <div style={{ color: IS.muted, fontSize: '11px', fontFamily: "'Fira Code', monospace" }}>
              v{String(row.version)}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: 'siteId',
      label: 'Site',
      width: '12%',
      render: (v: unknown) => (
        <span style={{
          color: IS.muted,
          fontSize: '12px',
          fontFamily: "'Fira Code', monospace",
        }}>
          {String(v || '—')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (v: unknown) => systemStatusBadge(v as ExternalSystem['status']),
    },
    {
      key: 'id',
      label: 'Actions',
      width: '10%',
      render: (_v: unknown, row: Record<string, unknown>) => {
        const system = externalSystems.find(s => s.id === row.id)
        if (!system) return null
        return (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {/* API Test Link */}
            {system.endpoints.length > 0 && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  const url = system.endpoints[0]?.baseUrl
                  if (url) window.open(url, '_blank', 'noopener,noreferrer')
                }}
                title="Open API Endpoint"
                style={{
                  background: 'none',
                  border: `1px solid ${IS.inputBorder}`,
                  borderRadius: '6px',
                  padding: '5px 8px',
                  cursor: 'pointer',
                  color: IS.label,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = IS.green
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = IS.green
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = IS.label
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = IS.inputBorder
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            )}

            {/* Edit */}
            <button
              onClick={e => { e.stopPropagation(); setEditSystem(system) }}
              title="Edit"
              style={{
                background: 'none',
                border: `1px solid ${IS.inputBorder}`,
                borderRadius: '6px',
                padding: '5px 8px',
                cursor: 'pointer',
                color: IS.label,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = IS.blue
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = IS.blue
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = IS.label
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = IS.inputBorder
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            {/* Delete */}
            <button
              onClick={e => { e.stopPropagation(); setDeleteTarget(system) }}
              title="Delete"
              style={{
                background: 'none',
                border: `1px solid ${IS.inputBorder}`,
                borderRadius: '6px',
                padding: '5px 8px',
                cursor: 'pointer',
                color: IS.label,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = IS.red
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = IS.red
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = IS.label
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = IS.inputBorder
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>
          </div>
        )
      },
    },
  ]

  // Domain options for filter bar (unique values from existing systems + predefined)
  const domainFilterOptions = useMemo(() => {
    const base = [{ value: '', label: 'All Domains' }]
    const seen = new Set<string>()
    DOMAIN_TYPES.slice(1).forEach(d => seen.add(d.value))
    externalSystems.forEach(s => { if (s.domainType) seen.add(s.domainType) })
    return [...base, ...[...seen].map(v => ({ value: v, label: v }))]
  }, [externalSystems])

  // Stats
  const activeCount      = externalSystems.filter(s => s.status === 'active').length
  const maintenanceCount = externalSystems.filter(s => s.status === 'maintenance').length
  const inactiveCount    = externalSystems.filter(s => s.status === 'inactive').length

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundColor: IS.pageBg,
      minHeight: '100vh',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{
            margin: 0,
            color: IS.textWhite,
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.01em',
          }}>
            External Systems
          </h1>
          <p style={{ margin: '4px 0 0', color: IS.muted, fontSize: '13px' }}>
            Registry of third-party systems integrated via connectors
          </p>
        </div>

        <ISButton variant="primary" onClick={() => setCreateOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add External System
        </ISButton>
      </div>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
      }}>
        {[
          { label: 'Total Systems',    value: externalSystems.length, color: IS.blue,   Icon: ServerRegular },
          { label: 'Active',           value: activeCount,            color: IS.green,  Icon: CheckmarkCircleRegular },
          { label: 'Maintenance',      value: maintenanceCount,       color: IS.yellow, Icon: WrenchRegular },
          { label: 'Inactive',         value: inactiveCount,          color: IS.muted,  Icon: CircleRegular },
        ].map((kpi, i) => (
          <div key={i} style={{
            backgroundColor: IS.cardBg,
            border: `1px solid ${kpi.color}25`,
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              color: kpi.color,
              lineHeight: 1,
              width: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <kpi.Icon style={{ width: '20px', height: '20px', color: kpi.color }} />
            </div>
            <div>
              <div style={{ color: kpi.color, fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ color: IS.muted, fontSize: '11px', marginTop: '3px' }}>
                {kpi.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table card ────────────────────────────────────────────────────── */}
      <ISCard
        title="Systems Registry"
        action={
          <span style={{
            color: IS.muted,
            fontSize: '12px',
            fontFamily: "'Inter', sans-serif",
          }}>
            {filtered.length} of {externalSystems.length} systems
          </span>
        }
      >
        {/* Filter bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '18px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{
            flex: '1 1 240px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={IS.muted}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, vendor, product…"
              style={{
                fontFamily: "'Inter', sans-serif",
                width: '100%',
                padding: '9px 12px 9px 34px',
                backgroundColor: IS.inputBg,
                border: `1px solid ${IS.inputBorder}`,
                borderRadius: '8px',
                color: IS.text,
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Domain filter */}
          <div style={{ minWidth: '180px' }}>
            <select
              value={filterDomain}
              onChange={e => setFilterDomain(e.target.value)}
              style={{
                fontFamily: "'Inter', sans-serif",
                padding: '9px 12px',
                backgroundColor: IS.inputBg,
                border: `1px solid ${IS.inputBorder}`,
                borderRadius: '8px',
                color: filterDomain ? IS.text : IS.muted,
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              {domainFilterOptions.map(opt => (
                <option key={opt.value} value={opt.value} style={{ backgroundColor: IS.inputBg }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div style={{ minWidth: '140px' }}>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                fontFamily: "'Inter', sans-serif",
                padding: '9px 12px',
                backgroundColor: IS.inputBg,
                border: `1px solid ${IS.inputBorder}`,
                borderRadius: '8px',
                color: filterStatus ? IS.text : IS.muted,
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <option value="" style={{ backgroundColor: IS.inputBg }}>All Statuses</option>
              <option value="active"      style={{ backgroundColor: IS.inputBg }}>Active</option>
              <option value="inactive"    style={{ backgroundColor: IS.inputBg }}>Inactive</option>
              <option value="maintenance" style={{ backgroundColor: IS.inputBg }}>Maintenance</option>
            </select>
          </div>

          {/* Clear filters */}
          {(search || filterDomain || filterStatus) && (
            <button
              onClick={() => { setSearch(''); setFilterDomain(''); setFilterStatus('') }}
              style={{
                fontFamily: "'Inter', sans-serif",
                background: 'none',
                border: `1px solid ${IS.inputBorder}`,
                borderRadius: '8px',
                padding: '9px 14px',
                color: IS.label,
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = IS.text }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = IS.label }}
            >
              Clear filters
            </button>
          )}
        </div>

        <ISTable
          columns={columns}
          data={filtered.map(s => ({
            id:         s.id,
            name:       s.name,
            domainType: s.domainType,
            vendor:     s.vendor,
            product:    s.product,
            version:    s.version,
            siteId:     s.siteId,
            tenantId:   s.tenantId,
            status:     s.status,
          }))}
        />
      </ISCard>

      {/* ── Create Modal ───────────────────────────────────────────────────── */}
      <SystemFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
        title="Add External System"
        tenantOptions={tenantOptions}
      />

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      <SystemFormModal
        open={!!editSystem}
        onClose={() => setEditSystem(null)}
        onSave={handleEdit}
        initial={editSystem ? systemToForm(editSystem) : undefined}
        title={editSystem ? `Edit — ${editSystem.name}` : 'Edit External System'}
        tenantOptions={tenantOptions}
      />

      {/* ── Delete Confirm Modal ───────────────────────────────────────────── */}
      <DeleteConfirmModal
        open={!!deleteTarget}
        systemName={deleteTarget?.name ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
