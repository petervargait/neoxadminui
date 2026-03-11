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
import BuildingModel3D from './BuildingModel3D'
import FloorplanWithZones from './FloorplanWithZones'

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

// Floor heatmap data
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

// Access by Department stacked data: [Workers, Visitors, Contractors]
const DEPT_ACCESS_DATA = [
  { rowLabel: 'Finance',         segments: [245, 42, 18],  total: 305, trend: 'up'      as const },
  { rowLabel: 'IT & Digital',    segments: [312, 68, 35],  total: 415, trend: 'up'      as const },
  { rowLabel: 'Human Resources', segments: [156, 55, 12],  total: 223, trend: 'down'    as const },
  { rowLabel: 'Marketing',       segments: [189, 38, 8],   total: 235, trend: 'neutral' as const },
  { rowLabel: 'Operations',      segments: [278, 95, 45],  total: 418, trend: 'up'      as const },
  { rowLabel: 'Legal',           segments: [98, 22, 5],    total: 125, trend: 'down'    as const },
  { rowLabel: 'Executive',       segments: [45, 15, 8],    total: 68,  trend: 'neutral' as const },
  { rowLabel: 'Facilities',      segments: [134, 28, 62],  total: 224, trend: 'up'      as const },
]

const DEPT_COLORS = [DASH.blue, DASH.green, '#F97316']
const DEPT_LABELS = ['Workers', 'Visitors', 'Contractors']

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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard7OccupancyServices({
  badgeSwipes,
}: Props) {
  const [month, setMonth] = useState('February 2025')
  const [floorFilter, setFloorFilter] = useState('')
  const [tenant, setTenant] = useState('all')
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [selectedFloorName, setSelectedFloorName] = useState('')

  const totalAccess = DEPT_ACCESS_DATA.reduce((s, d) => s + d.total, 0)

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: DASH.text,
        padding: '32px 40px',
        width: '100%',
        boxSizing: 'border-box' as const,
      }}
    >
      {/* Header */}
      <h1
        style={{
          color: DASH.textWhite || '#FFFFFF',
          fontSize: '36px',
          fontWeight: 800,
          margin: '0 0 40px 0',
          letterSpacing: '-0.5px',
        }}
      >
        Occupancy Services
      </h1>

      {/* ─── Section 1: 3D Building Model ─────────────────────────────────── */}
      <CardPanel style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${DASH.cardBorder}` }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 800, margin: 0 }}>
            Building Overview
          </h2>
          <p style={{ color: DASH.label, fontSize: '12px', margin: '4px 0 0' }}>
            {selectedFloor !== null
              ? `Viewing ${selectedFloorName} floor plan`
              : 'Click a floor in Ghost mode to view its floor plan with zone occupancy'}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '0',
            minHeight: '520px',
          }}
        >
          <div style={{ flex: selectedFloor !== null ? '0 0 45%' : '1 1 100%', transition: 'flex 0.3s ease' }}>
            <BuildingModel3D
              height={520}
              onFloorSelect={(floorNum, floorName) => {
                setSelectedFloor(floorNum)
                setSelectedFloorName(floorName)
              }}
            />
          </div>
          {selectedFloor !== null && (
            <div style={{ flex: '0 0 55%', borderLeft: `1px solid ${DASH.cardBorder}` }}>
              <FloorplanWithZones
                floorNumber={selectedFloor}
                floorName={selectedFloorName}
                onClose={() => setSelectedFloor(null)}
              />
            </div>
          )}
        </div>
      </CardPanel>

      {/* ─── Section 2: Workplace Utilization ─────────────────────────────── */}
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

      {/* ─── Section 3: Access by Department ──────────────────────────────── */}
      <section style={{ marginTop: '36px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ color: DASH.text, fontSize: '20px', fontWeight: 700, margin: 0 }}>
            Access by Department
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <PillSelect
              value={floorFilter}
              onChange={setFloorFilter}
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
              15 -22. February 2025
            </div>
          </div>
        </div>
        <CardPanel>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '16px',
            }}
          >
            <span style={{ color: DASH.text, fontWeight: 700, fontSize: '15px' }}>
              Department breakdown{' '}
              <span style={{ color: DASH.muted, fontSize: '13px', fontWeight: 400 }}>
                Workers, Visitors &amp; Contractors
              </span>
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ color: DASH.label, fontSize: '14px', fontWeight: 600 }}>Total</span>
              <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>
                {totalAccess.toLocaleString()}
              </span>
            </div>
          </div>
          <StackedHorizontalBarChart
            data={DEPT_ACCESS_DATA}
            colors={DEPT_COLORS}
            labels={DEPT_LABELS}
            width={620}
            total={500}
            showTotal={true}
          />
        </CardPanel>
      </section>
    </div>
  )
}
