'use client'

import React, { useState } from 'react'
import {
  DASH,
  CardPanel,
  MonthSelector,
  StackedHorizontalBarChart,
  GaugeChart,
  FloorHeatmap,
  TrendArrow,
} from '../charts/DashboardCharts'
import { BadgeSwipe } from '../../context/GlobalStateContext'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  badgeSwipes: BadgeSwipe[]
}

// ─── Styled dropdown (pill) ──────────────────────────────────────────────────
function PillSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '7px 18px',
        backgroundColor: DASH.cardBg2,
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '20px',
        color: DASH.text,
        fontSize: '13px',
        outline: 'none',
        cursor: 'pointer',
        minWidth: '150px',
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

// ─── Static data constants ───────────────────────────────────────────────────
// Access Management stacked data: [Physical badge, Digital badge, Watch badge]
const ACCESS_COMPANIES_STATIC = [
  { rowLabel: 'Apex Data Solutions',      segments: [76, 381, 329], total: 786,  trend: 'up'      as const },
  { rowLabel: 'Horizon Analytics',        segments: [41, 284, 206], total: 531,  trend: 'up'      as const },
  { rowLabel: 'Lumina Insights',          segments: [68, 101, 498], total: 667,  trend: 'up'      as const },
  { rowLabel: 'Quantum Metric Corp',      segments: [89, 381, 171], total: 641,  trend: 'up'      as const },
  { rowLabel: 'Veridian Dynamics',        segments: [76, 271, 439], total: 786,  trend: 'up'      as const },
  { rowLabel: 'Starlight Technologies',   segments: [79, 331, 376], total: 786,  trend: 'up'      as const },
  { rowLabel: 'SynergyWorks Group',       segments: [79, 284, 124], total: 487,  trend: 'up'      as const },
  { rowLabel: 'Crimson DataFlow',         segments: [91, 318,  72], total: 481,  trend: 'up'      as const },
  { rowLabel: 'Willowbrook Consulting',   segments: [48, 221, 112], total: 381,  trend: 'up'      as const },
]

const ACCESS_COLORS = [DASH.gold, '#1E3A5F', DASH.red]
const ACCESS_LABELS = ['Physical badge', 'Digital badge', 'Watch badge']

const FLOOR_HEATMAP_DATA = [
  { label: '29th', occupancy: 12 },
  { label: '28th', occupancy: 18 },
  { label: '27th', occupancy: 22 },
  { label: '26th', occupancy: 30 },
  { label: '25th', occupancy: 35 },
  { label: '24th', occupancy: 28 },
  { label: '23th', occupancy: 42 },
  { label: '22th', occupancy: 55 },
  { label: '21th', occupancy: 60 },
  { label: '20th', occupancy: 48 },
  { label: '19th', occupancy: 38 },
  { label: '18th', occupancy: 44 },
  { label: '17th', occupancy: 52 },
  { label: '16th', occupancy: 70 },
  { label: '15th', occupancy: 65 },
  { label: '14th', occupancy: 58 },
  { label: '13th', occupancy: 72 },
  { label: '12th', occupancy: 45 },
  { label: '11th', occupancy: 40 },
  { label: '10th', occupancy: 62 },
  { label: '9th', occupancy: 55 },
  { label: '8th', occupancy: 48 },
  { label: '7th', occupancy: 66 },
  { label: '6th', occupancy: 75 },
  { label: '5th', occupancy: 80 },
  { label: '4th', occupancy: 70 },
  { label: '3rd', occupancy: 68 },
  { label: '2nd', occupancy: 60 },
  { label: '1st', occupancy: 55 },
  { label: 'Whole building', occupancy: 45 },
  { label: 'Groundfloor', occupancy: 82 },
]

// Daily avg people & peak estimate: grouped by month with 3 sub-bars
const DAILY_EST_DATA = [
  {
    groupLabel: 'August',
    weeklyAvg: 2300,
    weeklyMax: 2156,
    weeklyPeak: 400,
  },
  {
    groupLabel: 'September',
    weeklyAvg: 1900,
    weeklyMax: 2000,
    weeklyPeak: 423,
  },
  {
    groupLabel: 'October',
    weeklyAvg: 1411,
    weeklyMax: 1768,
    weeklyPeak: 342,
  },
  {
    groupLabel: 'November',
    weeklyAvg: 1002,
    weeklyMax: 1578,
    weeklyPeak: 456,
  },
  {
    groupLabel: 'December',
    weeklyAvg: 412,
    weeklyMax: 534,
    weeklyPeak: 303,
  },
]

const FLOOR_OPTIONS = [
  { value: 'all', label: 'All floors' },
  ...Array.from({ length: 29 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} floor`,
  })).reverse(),
  { value: '0', label: 'Ground floor' },
]

const TENANT_OPTIONS = [
  { value: 'all', label: 'All tenants' },
  { value: 'tenant1', label: 'Tenant A' },
  { value: 'tenant2', label: 'Tenant B' },
  { value: 'tenant3', label: 'Tenant C' },
]

// ─── GroupedBarChart for daily estimates ─────────────────────────────────────
function DailyEstimateChart({
  data,
}: {
  data: typeof DAILY_EST_DATA
}) {
  const width = 680
  const height = 320
  const padding = { top: 40, right: 20, bottom: 70, left: 50 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxVal = 3200
  const yTicks = [0, 500, 1000, 1500, 2000, 2500, 3000]
  const groupW = chartW / data.length
  const barW = groupW * 0.22
  const gap = groupW * 0.03

  const barColors = [DASH.orange, DASH.gold, DASH.red]
  const legendLabels = ['Weekly avg. estimate people', 'Weekly max. estimate people', 'Weekly peak check-in']

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      {/* Y gridlines */}
      {yTicks.map((v) => {
        const y = padding.top + chartH - (v / maxVal) * chartH
        return (
          <g key={v}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke={DASH.cardBorder}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <text x={padding.left - 6} y={y + 4} textAnchor="end" fill={DASH.muted} fontSize="11">
              {v.toLocaleString()}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const gx = padding.left + i * groupW + groupW / 2 - (barW * 3 + gap * 2) / 2
        const vals = [d.weeklyAvg, d.weeklyMax, d.weeklyPeak]
        return (
          <g key={i}>
            {vals.map((v, j) => {
              const bx = gx + j * (barW + gap)
              const bh = (v / maxVal) * chartH
              const by = padding.top + chartH - bh
              return (
                <g key={j}>
                  <rect x={bx} y={by} width={barW} height={bh} rx={2} fill={barColors[j]} />
                  <text
                    x={bx + barW / 2}
                    y={by - 5}
                    textAnchor="middle"
                    fill={DASH.textWhite}
                    fontSize="10"
                    fontWeight="700"
                  >
                    {v.toLocaleString()}
                  </text>
                </g>
              )
            })}
            <text
              x={padding.left + i * groupW + groupW / 2}
              y={height - 45}
              textAnchor="middle"
              fill={DASH.label}
              fontSize="11"
            >
              {d.groupLabel}
            </text>
          </g>
        )
      })}

      {/* Legend */}
      <g transform={`translate(${padding.left}, ${height - 28})`}>
        {legendLabels.map((l, i) => (
          <g key={i}>
            <rect x={i * 190} y={0} width={12} height={12} rx={2} fill={barColors[i]} />
            <text x={i * 190 + 16} y={10} fill={DASH.label} fontSize="10">
              {l}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ─── Access Management Section ────────────────────────────────────────────────
function AccessManagementSection({ badgeSwipes }: { badgeSwipes: BadgeSwipe[] }) {
  const [floor, setFloor] = useState('all')
  const [dateRange] = useState('15 -22. February 2025')

  const total = ACCESS_COMPANIES_STATIC.reduce((s, d) => s + d.total, 0)

  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ color: DASH.text, fontSize: '20px', fontWeight: 700, margin: 0 }}>
          Access Management
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <PillSelect
            value={floor}
            onChange={setFloor}
            options={FLOOR_OPTIONS}
            placeholder="Filter to floor"
          />
          <div
            style={{
              padding: '7px 18px',
              backgroundColor: DASH.cardBg2,
              border: `1px solid ${DASH.cardBorder}`,
              borderRadius: '20px',
              color: DASH.text,
              fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            {dateRange}
          </div>
        </div>
      </div>
      <CardPanel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}
        >
          <div>
            <span style={{ color: DASH.text, fontWeight: 700, fontSize: '15px' }}>
              Visitors by company
            </span>{' '}
            <span style={{ color: DASH.muted, fontSize: '13px' }}>compared to last period</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ color: DASH.label, fontSize: '14px', fontWeight: 600 }}>Total</span>
            <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>
              {total.toLocaleString()}
            </span>
          </div>
        </div>
        <StackedHorizontalBarChart
          data={ACCESS_COMPANIES_STATIC}
          colors={ACCESS_COLORS}
          labels={ACCESS_LABELS}
          width={620}
          total={900}
          showTotal={true}
        />
      </CardPanel>
    </section>
  )
}

// ─── Workplace Utilization Section ────────────────────────────────────────────
function WorkplaceUtilizationSection() {
  const [tenant, setTenant] = useState('all')
  const [month, setMonth] = useState('February 2025')

  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ color: DASH.text, fontSize: '20px', fontWeight: 700, margin: 0 }}>
          Workplace utilization
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <PillSelect
            value={tenant}
            onChange={setTenant}
            options={TENANT_OPTIONS}
            placeholder="Filter to tenant"
          />
          <MonthSelector value={month} onChange={setMonth} />
        </div>
      </div>

      <CardPanel>
        {/* Top row: Heatmap + Avg metrics + KPIs */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '32px' }}>
          {/* Floor heatmap */}
          <div style={{ flexShrink: 0 }}>
            <FloorHeatmap floors={FLOOR_HEATMAP_DATA} width={180} height={480} />
          </div>

          {/* Center: occupancy stats */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
              paddingTop: '120px',
            }}
          >
            <div>
              <div style={{ color: DASH.muted, fontSize: '13px', marginBottom: '4px' }}>
                Average floor occupancy
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '32px', fontWeight: 800 }}>45</span>
                <span style={{ color: DASH.trendUp, fontSize: '14px', fontWeight: 700 }}>+10%</span>
              </div>
            </div>
            <div>
              <div style={{ color: DASH.muted, fontSize: '13px', marginBottom: '4px' }}>
                Peak floor occupancy
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '32px', fontWeight: 800 }}>93</span>
                <span style={{ color: DASH.trendDown, fontSize: '14px', fontWeight: 700 }}>-20%</span>
              </div>
            </div>
          </div>

          {/* Right: HSE + Avg daily entrance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '80px' }}>
            <div
              style={{
                backgroundColor: DASH.cardBg2,
                border: `1px solid ${DASH.cardBorder}`,
                borderRadius: '12px',
                padding: '16px 24px',
                textAlign: 'right',
                minWidth: '160px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'flex-end',
                  gap: '6px',
                  marginBottom: '4px',
                }}
              >
                <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800 }}>1036</span>
                <TrendArrow direction="up" size={16} />
              </div>
              <div style={{ color: DASH.label, fontSize: '13px' }}>HSE Capacity</div>
            </div>
            <div
              style={{
                backgroundColor: DASH.cardBg2,
                border: `1px solid ${DASH.cardBorder}`,
                borderRadius: '12px',
                padding: '16px 24px',
                textAlign: 'right',
                minWidth: '160px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'flex-end',
                  gap: '6px',
                  marginBottom: '4px',
                }}
              >
                <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800 }}>1373</span>
                <TrendArrow direction="up" size={16} />
              </div>
              <div style={{ color: DASH.label, fontSize: '13px' }}>Avg. daily entrance</div>
            </div>
          </div>
        </div>

        {/* Gauge row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '32px',
            borderTop: `1px solid ${DASH.cardBorder}`,
            paddingTop: '28px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: DASH.muted, fontSize: '12px', marginBottom: '8px', lineHeight: 1.4 }}>
              Ide jöhetne valami szöveg még magyarázásba
            </div>
            <GaugeChart
              value={126}
              max={100}
              label="Allocation"
              size={180}
              color={DASH.gold}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: DASH.muted, fontSize: '12px', marginBottom: '8px', lineHeight: 1.4 }}>
              Ide jöhetne valami szöveg még magyarázásba
            </div>
            <GaugeChart
              value={30}
              max={100}
              label="Utilization"
              size={180}
              color={DASH.gold}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: DASH.muted, fontSize: '12px', marginBottom: '8px', lineHeight: 1.4 }}>
              Ide jöhetne valami szöveg még magyarázásba
            </div>
            <GaugeChart
              value={56}
              max={100}
              label="Peak utilization"
              sublabel="56,47%"
              size={180}
              color={DASH.gold}
            />
          </div>
        </div>

        {/* Daily estimate grouped bar chart */}
        <div style={{ borderTop: `1px solid ${DASH.cardBorder}`, paddingTop: '24px' }}>
          <div
            style={{
              color: DASH.text,
              fontWeight: 700,
              fontSize: '15px',
              marginBottom: '16px',
            }}
          >
            Daily average people &amp; peak estimate by date
          </div>
          <DailyEstimateChart data={DAILY_EST_DATA} />
        </div>
      </CardPanel>
    </section>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard7OccupancyServices({
  badgeSwipes,
}: Props) {
  return (
    <div
      style={{
        backgroundColor: DASH.pageBg,
        minHeight: '100vh',
        padding: '32px 40px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
        }}
      >
        <h1
          style={{
            color: DASH.textWhite,
            fontSize: '36px',
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Occupancy services
        </h1>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        <AccessManagementSection badgeSwipes={badgeSwipes} />
        <WorkplaceUtilizationSection />
      </div>
    </div>
  )
}
