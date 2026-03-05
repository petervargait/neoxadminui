'use client'

import React, { useState } from 'react'
import {
  IS,
  ISCard,
  ISTable,
  ISModal,
  ISButton,
  CoverageBadge,
  StatusBadge,
  EnvironmentBadge,
  ISTableColumn,
} from './ISShared'
import { useGlobalState } from '@/context/GlobalStateContext'
import type { IntegrationConnector } from '@/context/GlobalStateContext'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtDateShort(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Small icon-only button ───────────────────────────────────────────────────
function IconBtn({
  children,
  onClick,
  title,
  color,
  disabled = false,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  color: string
  disabled?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={e => { e.stopPropagation(); if (!disabled) onClick() }}
      title={title}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}20` : 'transparent',
        border: `1px solid ${hovered ? color + '60' : IS.cardBorder}`,
        borderRadius: '6px',
        padding: '5px 7px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? IS.muted : hovered ? color : IS.muted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

// ─── Test result badge ────────────────────────────────────────────────────────
function TestResultBadge({ result, at }: { result?: 'pass' | 'fail'; at?: string }) {
  if (!result) return <span style={{ color: IS.muted, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Never</span>
  const color = result === 'pass' ? IS.green : IS.red
  const label = result === 'pass' ? 'Pass' : 'Fail'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '12px',
        fontWeight: 600,
        color,
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'inline-block',
        }} />
        {label}
      </span>
      {at && (
        <span style={{ fontFamily: "'Inter', sans-serif", color: IS.muted, fontSize: '11px' }}>
          {fmtDateShort(at)}
        </span>
      )}
    </div>
  )
}

// ─── Status toggle badge (active / paused) ────────────────────────────────────
function StatusToggle({
  status,
  onToggle,
}: {
  status: IntegrationConnector['status']
  onToggle: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const isPaused = status === 'paused'
  const isDraft = status === 'draft'

  if (isDraft) {
    return (
      <span style={{
        fontFamily: "'Inter', sans-serif",
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '20px',
        backgroundColor: `${IS.muted}18`,
        border: `1px solid ${IS.muted}30`,
        fontSize: '12px',
        fontWeight: 600,
        color: IS.muted,
        whiteSpace: 'nowrap',
      }}>
        Draft
      </span>
    )
  }

  const color = isPaused ? IS.orange : IS.green
  const label = isPaused ? 'Paused' : 'Active'

  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={isPaused ? 'Click to resume' : 'Click to pause'}
      style={{
        fontFamily: "'Inter', sans-serif",
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '20px',
        backgroundColor: hovered ? `${color}30` : `${color}18`,
        border: `1px solid ${color}${hovered ? '60' : '30'}`,
        fontSize: '12px',
        fontWeight: 600,
        color,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        outline: 'none',
      }}
    >
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
        boxShadow: `0 0 4px ${color}`,
      }} />
      {label}
    </button>
  )
}

// ─── Connector detail modal ───────────────────────────────────────────────────
function ConnectorDetailModal({
  open,
  onClose,
  connector,
}: {
  open: boolean
  onClose: () => void
  connector: IntegrationConnector | null
}) {
  if (!connector) return null

  const envLabel = (env: string): 'Dev' | 'Test' | 'Prod' => {
    const lower = env.toLowerCase()
    if (lower.includes('prod')) return 'Prod'
    if (lower.includes('stag') || lower.includes('test') || lower.includes('qa')) return 'Test'
    return 'Dev'
  }

  return (
    <ISModal open={open} onClose={onClose} title={connector.name} width="560px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Identity */}
        <Section label="Connector Identity">
          <InfoRow label="ID" value={connector.id} mono />
          <InfoRow label="Domain" value={connector.domain} />
          <InfoRow label="External System" value={connector.externalSystemName} />
          <InfoRow label="Auth Profile ID" value={connector.authProfileId} mono />
          <InfoRow label="Tenant" value={connector.tenantId} />
          <InfoRow label="Created" value={fmtDate(connector.createdAt)} />
        </Section>

        {/* Health & Coverage */}
        <Section label="Health & Coverage">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: IS.label, fontSize: '11px', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health</span>
              <StatusBadge status={connector.health} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: IS.label, fontSize: '11px', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coverage</span>
              <CoverageBadge percent={connector.coveragePercent} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: IS.label, fontSize: '11px', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Test</span>
              <TestResultBadge result={connector.lastTestResult} at={connector.lastTestAt} />
            </div>
          </div>
        </Section>

        {/* Deployed versions */}
        <Section label="Deployed Versions">
          {connector.versions.length === 0 ? (
            <span style={{ color: IS.muted, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>No deployments yet.</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {connector.versions.map((v, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  backgroundColor: IS.cardBg2,
                  border: `1px solid ${IS.cardBorder}`,
                  borderRadius: '7px',
                }}>
                  <EnvironmentBadge env={envLabel(v.env)} />
                  <span style={{
                    fontFamily: "'Fira Code', monospace",
                    color: IS.text,
                    fontSize: '13px',
                    fontWeight: 600,
                  }}>
                    v{v.version}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", color: IS.muted, fontSize: '12px', marginLeft: 'auto' }}>
                    Deployed {fmtDate(v.deployedAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </ISModal>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px',
        fontWeight: 600,
        color: IS.label,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        paddingBottom: '6px',
        borderBottom: `1px solid ${IS.cardBorder}`,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        color: IS.label,
        fontSize: '12px',
        minWidth: '130px',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "'Fira Code', 'Cascadia Code', monospace" : "'Inter', sans-serif",
        color: IS.text,
        fontSize: mono ? '12px' : '13px',
      }}>
        {value}
      </span>
    </div>
  )
}

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      zIndex: 99999,
      padding: '12px 20px',
      backgroundColor: IS.cardBg,
      border: `1px solid ${IS.green}40`,
      borderRadius: '10px',
      color: IS.green,
      fontSize: '13px',
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transform: visible ? 'translateY(0)' : 'translateY(80px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.25s ease, opacity 0.25s ease',
      pointerEvents: 'none',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ISConnectors() {
  const {
    integrationConnectors,
    updateIntegrationConnector,
  } = useGlobalState()

  const [selectedConnector, setSelectedConnector] = useState<IntegrationConnector | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false })

  const showToast = (message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000)
  }

  const handleTest = (connector: IntegrationConnector) => {
    // Simulated test — toggles result randomly with brief delay feedback
    const result: 'pass' | 'fail' = connector.health === 'critical' ? 'fail' : 'pass'
    updateIntegrationConnector(connector.id, {
      lastTestResult: result,
      lastTestAt: new Date().toISOString(),
    })
    showToast(`Test ${result === 'pass' ? 'passed' : 'failed'} for "${connector.name}"`)
  }

  const handlePromote = (connector: IntegrationConnector) => {
    showToast(`Promotion triggered for "${connector.name}" — this is a placeholder action.`)
  }

  const handleRollback = (connector: IntegrationConnector) => {
    showToast(`Rollback initiated for "${connector.name}" — this is a placeholder action.`)
  }

  const handleTogglePause = (connector: IntegrationConnector) => {
    const next: IntegrationConnector['status'] = connector.status === 'paused' ? 'active' : 'paused'
    updateIntegrationConnector(connector.id, { status: next })
    showToast(`"${connector.name}" ${next === 'paused' ? 'paused' : 'resumed'} successfully.`)
  }

  const envLabel = (env: string): 'Dev' | 'Test' | 'Prod' => {
    const lower = env.toLowerCase()
    if (lower.includes('prod')) return 'Prod'
    if (lower.includes('stag') || lower.includes('test') || lower.includes('qa')) return 'Test'
    return 'Dev'
  }

  // ─── Summary stats ──────────────────────────────────────────────────────────
  const totalActive  = integrationConnectors.filter(c => c.status === 'active').length
  const totalPaused  = integrationConnectors.filter(c => c.status === 'paused').length
  const totalCrit    = integrationConnectors.filter(c => c.health === 'critical').length
  const avgCoverage  = integrationConnectors.length
    ? Math.round(integrationConnectors.reduce((s, c) => s + c.coveragePercent, 0) / integrationConnectors.length)
    : 0

  // ─── Table columns ──────────────────────────────────────────────────────────
  const columns: ISTableColumn[] = [
    {
      key: 'name',
      label: 'Name',
      width: '17%',
      render: (v, row) => (
        <div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            color: IS.textWhite,
            fontWeight: 600,
            fontSize: '13px',
          }}>
            {String(v)}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", color: IS.muted, fontSize: '11px', marginTop: '1px' }}>
            {(row as unknown as IntegrationConnector).id}
          </div>
        </div>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
      width: '12%',
      render: (v) => (
        <span style={{
          fontFamily: "'Inter', sans-serif",
          color: IS.cyan,
          fontSize: '12.5px',
          fontWeight: 500,
        }}>
          {String(v)}
        </span>
      ),
    },
    {
      key: 'externalSystemName',
      label: 'External System',
      width: '15%',
      render: (v) => (
        <span style={{
          fontFamily: "'Inter', sans-serif",
          color: IS.label,
          fontSize: '12.5px',
        }}>
          {String(v)}
        </span>
      ),
    },
    {
      key: 'coveragePercent',
      label: 'Coverage',
      width: '8%',
      render: (v) => <CoverageBadge percent={Number(v)} />,
    },
    {
      key: 'health',
      label: 'Health',
      width: '9%',
      render: (v) => <StatusBadge status={v as 'ok' | 'warning' | 'critical' | 'inactive'} />,
    },
    {
      key: 'versions',
      label: 'Versions',
      width: '13%',
      render: (_v, row) => {
        const connector = row as unknown as IntegrationConnector
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {connector.versions.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <EnvironmentBadge env={envLabel(v.env)} />
                <span style={{
                  fontFamily: "'Fira Code', monospace",
                  color: IS.muted,
                  fontSize: '10px',
                }}>
                  v{v.version}
                </span>
              </div>
            ))}
            {connector.versions.length === 0 && (
              <span style={{ color: IS.muted, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>No deployments</span>
            )}
          </div>
        )
      },
    },
    {
      key: 'lastTestAt',
      label: 'Last Test',
      width: '10%',
      render: (_v, row) => {
        const connector = row as unknown as IntegrationConnector
        return <TestResultBadge result={connector.lastTestResult} at={connector.lastTestAt} />
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '9%',
      render: (_v, row) => {
        const connector = row as unknown as IntegrationConnector
        return (
          <StatusToggle
            status={connector.status}
            onToggle={() => handleTogglePause(connector)}
          />
        )
      },
    },
    {
      key: 'id',
      label: 'Actions',
      width: '15%',
      render: (_v, row) => {
        const connector = row as unknown as IntegrationConnector
        const isPaused = connector.status === 'paused'
        return (
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'nowrap' }}>
            {/* Test */}
            <IconBtn
              title="Run connection test"
              color={IS.blue}
              onClick={() => handleTest(connector)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </IconBtn>

            {/* Promote */}
            <IconBtn
              title="Promote to next environment"
              color={IS.green}
              onClick={() => handlePromote(connector)}
              disabled={isPaused}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </IconBtn>

            {/* Rollback */}
            <IconBtn
              title="Rollback to previous version"
              color={IS.orange}
              onClick={() => handleRollback(connector)}
              disabled={connector.versions.length < 2}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
              </svg>
            </IconBtn>

            {/* Pause / Resume */}
            <IconBtn
              title={isPaused ? 'Resume connector' : 'Pause connector'}
              color={isPaused ? IS.green : IS.yellow}
              onClick={() => handleTogglePause(connector)}
              disabled={connector.status === 'draft'}
            >
              {isPaused ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              )}
            </IconBtn>
          </div>
        )
      },
    },
  ]

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: IS.pageBg,
      minHeight: '100%',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: IS.textWhite, fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            Connectors
          </h2>
          <p style={{ color: IS.muted, fontSize: '13px', margin: 0 }}>
            Manage, test, and promote integration connectors across environments.
          </p>
        </div>

        {/* New connector placeholder */}
        <ISButton
          variant="primary"
          onClick={() => showToast('Connector Builder coming soon. Raise a platform request to create a new connector.')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Connector
        </ISButton>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total',          value: integrationConnectors.length, color: IS.blue },
          { label: 'Active',         value: totalActive,  color: IS.green },
          { label: 'Paused',         value: totalPaused,  color: IS.orange },
          { label: 'Critical',       value: totalCrit,    color: IS.red },
          { label: 'Avg Coverage',   value: `${avgCoverage}%`, color: avgCoverage > 80 ? IS.green : avgCoverage > 50 ? IS.yellow : IS.red },
        ].map(s => (
          <div key={s.label} style={{
            padding: '10px 18px',
            backgroundColor: IS.cardBg,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ color: s.color, fontSize: '20px', fontWeight: 700 }}>{s.value}</span>
            <span style={{ color: IS.label, fontSize: '12px' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Critical alert */}
      {totalCrit > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '11px 14px',
          backgroundColor: `${IS.red}12`,
          border: `1px solid ${IS.red}30`,
          borderRadius: '8px',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={IS.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span style={{ fontFamily: "'Inter', sans-serif", color: IS.red, fontSize: '13px', fontWeight: 500 }}>
            {totalCrit} connector{totalCrit !== 1 ? 's are' : ' is'} in critical health. Immediate attention required.
          </span>
        </div>
      )}

      {/* Table */}
      <ISCard
        title={`Connectors (${integrationConnectors.length})`}
        action={
          <span style={{
            fontFamily: "'Inter', sans-serif",
            color: IS.muted,
            fontSize: '11px',
          }}>
            Click a row for details
          </span>
        }
      >
        <ISTable
          columns={columns}
          data={integrationConnectors}
          onRowClick={(row) => {
            setSelectedConnector(row as unknown as IntegrationConnector)
            setDetailOpen(true)
          }}
        />
      </ISCard>

      {/* New connector note */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '11px 14px',
        backgroundColor: `${IS.blue}08`,
        border: `1px solid ${IS.blue}20`,
        borderRadius: '8px',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={IS.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontFamily: "'Inter', sans-serif", color: IS.blue, fontSize: '12px' }}>
          The Connector Builder is under development. New connectors must be scaffolded by the platform team and linked to a canonical API domain and auth profile before deployment.
        </span>
      </div>

      {/* Connector detail modal */}
      <ConnectorDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        connector={selectedConnector}
      />

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
