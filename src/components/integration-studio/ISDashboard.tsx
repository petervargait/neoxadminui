'use client'

import React, { useMemo } from 'react'
import {
  IS,
  ISCard,
  ISTable,
  StatusBadge,
} from './ISShared'
import { useGlobalState } from '@/context/GlobalStateContext'
import type { IntegrationConnector } from '@/context/GlobalStateContext'
import {
  PersonRegular,
  DoorArrowRightRegular,
  PersonBoardRegular,
  VehicleCarParkingRegular,
  LockClosedRegular,
  CalendarRegular,
  VideoRegular,
  TicketDiagonalRegular,
  TicketHorizontalRegular,
  PlugConnectedRegular,
  CheckmarkCircleRegular,
  AlertRegular,
  HeartPulseRegular,
} from '@fluentui/react-icons'

// ─── Domain definitions ───────────────────────────────────────────────────────
const DOMAINS: { key: string; label: string; Icon: React.ComponentType<{ style?: React.CSSProperties }> }[] = [
  { key: 'Identity Provider',       label: 'Identity',         Icon: PersonRegular },
  { key: 'Access Control',          label: 'Access Control',   Icon: DoorArrowRightRegular },
  { key: 'Visitor Management',      label: 'Visitor',          Icon: PersonBoardRegular },
  { key: 'Parking',                 label: 'Parking',          Icon: VehicleCarParkingRegular },
  { key: 'Lockers',                 label: 'Lockers',          Icon: LockClosedRegular },
  { key: 'Meeting Room Booking',    label: 'Meeting Rooms',    Icon: CalendarRegular },
  { key: 'AV/VC',                   label: 'AV / VC',          Icon: VideoRegular },
  { key: 'Events',                  label: 'Events',           Icon: TicketDiagonalRegular },
  { key: 'Issue Backend',           label: 'Issue Reporting',  Icon: TicketHorizontalRegular },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function domainHealth(
  connectors: IntegrationConnector[],
  domainKey: string,
): 'ok' | 'warning' | 'critical' | 'inactive' {
  const relevant = connectors.filter(c => c.domain === domainKey && c.status === 'active')
  if (relevant.length === 0) return 'inactive'
  if (relevant.some(c => c.health === 'critical')) return 'critical'
  if (relevant.some(c => c.health === 'warning'))  return 'warning'
  return 'ok'
}

// Synthetic error-rate derived from health + coverage
function connectorErrorRate(c: IntegrationConnector): number {
  const base = c.health === 'critical' ? 18 : c.health === 'warning' ? 5 : 0.4
  const fuzz  = (parseInt(c.id.slice(-4), 16) % 100) / 100
  return parseFloat((base + fuzz * 3).toFixed(1))
}

// Synthetic p95 latency
function connectorLatency(c: IntegrationConnector): number {
  const base = c.health === 'critical' ? 1800 : c.health === 'warning' ? 650 : 140
  const fuzz  = (parseInt(c.id.slice(-3), 16) % 300)
  return base + fuzz
}

// ─── Tiny SVG Bar Chart ───────────────────────────────────────────────────────
function ErrorRateBarChart({ connectors }: { connectors: IntegrationConnector[] }) {
  const bars = connectors.slice(0, 8).map(c => ({
    label: c.name.length > 12 ? c.name.slice(0, 11) + '…' : c.name,
    value: connectorErrorRate(c),
    color: c.health === 'critical' ? IS.red : c.health === 'warning' ? IS.yellow : IS.green,
  }))

  const maxVal = Math.max(...bars.map(b => b.value), 1)
  const chartH = 110
  const barW   = 34
  const gap    = 10
  const totalW = bars.length * (barW + gap) + gap
  const labelH = 36

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        width={totalW}
        height={chartH + labelH}
        style={{ display: 'block', minWidth: '100%' }}
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const y = chartH - frac * chartH
          return (
            <g key={i}>
              <line
                x1={0} y1={y} x2={totalW} y2={y}
                stroke={`${IS.cardBorder}60`}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={2} y={y - 3}
                fill={IS.muted}
                fontSize={9}
                fontFamily="Inter, sans-serif"
              >
                {(frac * maxVal).toFixed(1)}%
              </text>
            </g>
          )
        })}

        {bars.map((b, i) => {
          const x    = gap + i * (barW + gap)
          const barH = Math.max(2, (b.value / maxVal) * chartH)
          const y    = chartH - barH

          return (
            <g key={i}>
              {/* Bar with rounded top */}
              <rect
                x={x} y={y} width={barW} height={barH}
                rx={4} ry={4}
                fill={`${b.color}30`}
                stroke={b.color}
                strokeWidth={1.5}
              />
              {/* Value label */}
              <text
                x={x + barW / 2} y={y - 5}
                textAnchor="middle"
                fill={b.color}
                fontSize={9}
                fontWeight={700}
                fontFamily="Inter, sans-serif"
              >
                {b.value}%
              </text>
              {/* X-axis label */}
              <text
                x={x + barW / 2}
                y={chartH + 14}
                textAnchor="middle"
                fill={IS.muted}
                fontSize={9}
                fontFamily="Inter, sans-serif"
              >
                {b.label.split('').slice(0, 10).join('')}
              </text>
              {/* Glow dot on top of bar */}
              <circle
                cx={x + barW / 2}
                cy={y}
                r={3}
                fill={b.color}
                filter={`drop-shadow(0 0 3px ${b.color})`}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Domain Health Card ───────────────────────────────────────────────────────
function DomainHealthCard({
  label,
  Icon,
  status,
  connectorCount,
}: {
  label: string
  Icon: React.ComponentType<{ style?: React.CSSProperties }>
  status: 'ok' | 'warning' | 'critical' | 'inactive'
  connectorCount: number
}) {
  const borderColor =
    status === 'ok'       ? IS.green  :
    status === 'warning'  ? IS.yellow :
    status === 'critical' ? IS.red    : IS.muted

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundColor: IS.cardBg,
      border: `1px solid ${borderColor}40`,
      borderRadius: '10px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent stripe */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: borderColor,
        borderRadius: '10px 10px 0 0',
        opacity: status === 'inactive' ? 0.35 : 1,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Icon style={{ width: '20px', height: '20px', color: borderColor }} />
        <StatusBadge status={status} />
      </div>

      <div>
        <div style={{
          color: IS.text,
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '4px',
        }}>
          {label}
        </div>
        <div style={{ color: IS.muted, fontSize: '11px' }}>
          {connectorCount === 0
            ? 'No connectors'
            : `${connectorCount} connector${connectorCount !== 1 ? 's' : ''}`}
        </div>
      </div>
    </div>
  )
}

// ─── Recent Deployments ───────────────────────────────────────────────────────
function RecentDeployments({ connectors }: { connectors: IntegrationConnector[] }) {
  const deploys = useMemo(() => {
    const items: { connectorName: string; domain: string; env: string; version: string; deployedAt: string }[] = []
    connectors.forEach(c => {
      c.versions.forEach(v => {
        items.push({
          connectorName: c.name,
          domain: c.domain,
          env: v.env,
          version: v.version,
          deployedAt: v.deployedAt,
        })
      })
    })
    return items
      .sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime())
      .slice(0, 5)
  }, [connectors])

  const envColor: Record<string, string> = {
    Prod: IS.green,
    Test: IS.yellow,
    Dev:  IS.blue,
  }

  if (deploys.length === 0) {
    return (
      <div style={{
        color: IS.muted,
        fontSize: '13px',
        textAlign: 'center',
        padding: '24px',
        fontFamily: "'Inter', sans-serif",
      }}>
        No deployments recorded
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      {deploys.map((d, i) => {
        const color = envColor[d.env] ?? IS.muted
        const date  = new Date(d.deployedAt)
        const relTime = isNaN(date.getTime())
          ? d.deployedAt
          : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

        return (
          <div
            key={i}
            style={{
              fontFamily: "'Inter', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: i % 2 === 0 ? 'transparent' : `${IS.cardBg2}60`,
            }}
          >
            {/* Env pill */}
            <span style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              color,
              backgroundColor: `${color}18`,
              border: `1px solid ${color}35`,
              minWidth: '42px',
              textAlign: 'center',
            }}>
              {d.env}
            </span>

            {/* Connector + domain */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: IS.text, fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {d.connectorName}
              </div>
              <div style={{ color: IS.muted, fontSize: '11px' }}>{d.domain}</div>
            </div>

            {/* Version */}
            <span style={{
              fontFamily: "'Fira Code', monospace",
              color: IS.cyan,
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              v{d.version}
            </span>

            {/* Date */}
            <span style={{ color: IS.muted, fontSize: '11px', whiteSpace: 'nowrap' }}>
              {relTime}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── ISDashboard ──────────────────────────────────────────────────────────────
export default function ISDashboard() {
  const { integrationConnectors } = useGlobalState()

  // Domain cards
  const domainCards = useMemo(
    () =>
      DOMAINS.map(d => ({
        ...d,
        status: domainHealth(integrationConnectors, d.key),
        connectorCount: integrationConnectors.filter(
          c => c.domain === d.key && c.status === 'active',
        ).length,
      })),
    [integrationConnectors],
  )

  // Top failing connectors – sorted by derived error-rate descending, take top 6
  const failingConnectors = useMemo(() => {
    return [...integrationConnectors]
      .filter(c => c.health !== 'ok')
      .sort((a, b) => connectorErrorRate(b) - connectorErrorRate(a))
      .slice(0, 6)
      .map(c => ({
        id: c.id,
        name: c.name,
        domain: c.domain,
        errorRate: connectorErrorRate(c),
        latency: connectorLatency(c),
        health: c.health,
      }))
  }, [integrationConnectors])

  const failingColumns = [
    {
      key: 'name',
      label: 'Connector',
      width: '28%',
      render: (v: unknown) => (
        <span style={{
          color: IS.text,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
        }}>
          {String(v)}
        </span>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
      width: '22%',
      render: (v: unknown) => (
        <span style={{ color: IS.label, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{String(v)}</span>
      ),
    },
    {
      key: 'errorRate',
      label: 'Error Rate',
      width: '18%',
      render: (v: unknown) => {
        const n = Number(v)
        const color = n > 10 ? IS.red : n > 3 ? IS.yellow : IS.green
        return (
          <span style={{
            color,
            fontFamily: "'Fira Code', monospace",
            fontSize: '13px',
            fontWeight: 700,
          }}>
            {String(v)}%
          </span>
        )
      },
    },
    {
      key: 'latency',
      label: 'Latency p95',
      width: '18%',
      render: (v: unknown) => {
        const n = Number(v)
        const color = n > 1500 ? IS.red : n > 500 ? IS.yellow : IS.green
        return (
          <span style={{
            color,
            fontFamily: "'Fira Code', monospace",
            fontSize: '13px',
            fontWeight: 600,
          }}>
            {String(v)} ms
          </span>
        )
      },
    },
    {
      key: 'health',
      label: 'Health',
      width: '14%',
      render: (v: unknown) => <StatusBadge status={String(v) as 'ok' | 'warning' | 'critical'} />,
    },
  ]

  // Summary stats
  const totalConnectors = integrationConnectors.length
  const activeConnectors = integrationConnectors.filter(c => c.status === 'active').length
  const criticalCount    = integrationConnectors.filter(c => c.health === 'critical').length
  const healthyDomains   = domainCards.filter(d => d.status === 'ok').length

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

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{
            margin: 0,
            color: IS.textWhite,
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.01em',
          }}>
            Integration Studio
          </h1>
          <p style={{ margin: '4px 0 0', color: IS.muted, fontSize: '13px' }}>
            Health overview — all domains &amp; connectors at a glance
          </p>
        </div>

        {/* Live indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 14px',
          borderRadius: '20px',
          backgroundColor: `${IS.green}15`,
          border: `1px solid ${IS.green}35`,
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: IS.green,
            boxShadow: `0 0 6px ${IS.green}`,
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ color: IS.green, fontSize: '12px', fontWeight: 600 }}>Live</span>
        </div>
      </div>

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}>
        {[
          { label: 'Total Connectors',  value: totalConnectors,  color: IS.blue,   Icon: PlugConnectedRegular },
          { label: 'Active Connectors', value: activeConnectors, color: IS.green,  Icon: CheckmarkCircleRegular },
          { label: 'Critical Issues',   value: criticalCount,    color: IS.red,    Icon: AlertRegular },
          { label: 'Healthy Domains',   value: healthyDomains,   color: IS.purple, Icon: HeartPulseRegular },
        ].map((kpi, i) => (
          <div key={i} style={{
            backgroundColor: IS.cardBg,
            border: `1px solid ${kpi.color}30`,
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: `${kpi.color}18`,
              border: `1px solid ${kpi.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <kpi.Icon style={{ width: '18px', height: '18px', color: kpi.color }} />
            </div>
            <div>
              <div style={{ color: kpi.color, fontSize: '24px', fontWeight: 800, lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ color: IS.muted, fontSize: '11px', marginTop: '4px' }}>
                {kpi.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Domain Health Cards ──────────────────────────────────────────── */}
      <ISCard title="Domain Health Overview">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px',
        }}>
          {domainCards.map(d => (
            <DomainHealthCard
              key={d.key}
              label={d.label}
              Icon={d.Icon}
              status={d.status}
              connectorCount={d.connectorCount}
            />
          ))}
        </div>
      </ISCard>

      {/* ── Two-column: Failing connectors + Recent deployments ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', alignItems: 'start' }}>

        {/* Top Failing Connectors */}
        <ISCard
          title="Top Failing Connectors"
          action={
            <span style={{
              padding: '3px 10px',
              borderRadius: '12px',
              backgroundColor: `${IS.red}15`,
              border: `1px solid ${IS.red}30`,
              color: IS.red,
              fontSize: '11px',
              fontWeight: 700,
            }}>
              {failingConnectors.length} degraded
            </span>
          }
        >
          {failingConnectors.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              padding: '24px',
              color: IS.muted,
              fontSize: '13px',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={IS.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              All connectors operating normally
            </div>
          ) : (
            <ISTable columns={failingColumns} data={failingConnectors} />
          )}
        </ISCard>

        {/* Recent Deployments */}
        <ISCard
          title="Recent Deployments"
          action={
            <span style={{ color: IS.muted, fontSize: '11px' }}>Last 5</span>
          }
        >
          <RecentDeployments connectors={integrationConnectors} />
        </ISCard>
      </div>

      {/* ── Error Rate Chart ─────────────────────────────────────────────── */}
      <ISCard
        title="Connector Error Rate"
        action={
          <span style={{ color: IS.muted, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
            Derived from health status
          </span>
        }
      >
        {integrationConnectors.length === 0 ? (
          <div style={{ textAlign: 'center', color: IS.muted, padding: '32px', fontSize: '13px' }}>
            No connector data available
          </div>
        ) : (
          <div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {[
                { color: IS.red,    label: 'Critical  (>10%)' },
                { color: IS.yellow, label: 'Warning  (3–10%)' },
                { color: IS.green,  label: 'Healthy  (<3%)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    backgroundColor: item.color,
                    opacity: 0.8,
                  }} />
                  <span style={{ color: IS.muted, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <ErrorRateBarChart connectors={integrationConnectors} />
          </div>
        )}
      </ISCard>

    </div>
  )
}
