'use client'

import React, { useState } from 'react'
import {
  DASH,
  CardPanel,
  StackedHorizontalBarChart,
  GaugeChart,
  TrendArrow,
} from '../charts/DashboardCharts'
import { BadgeSwipe } from '../../context/GlobalStateContext'
import BuildingModel3D from './BuildingModel3D'
import FloorplanWithZones from './FloorplanWithZones'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  badgeSwipes: BadgeSwipe[]
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

// Floor data for HSE capacity and current occupancy
// Per-floor data — current people sum to 1,247 total building occupancy
const FLOOR_DATA: Record<number, { hse: number; current: number }> = {
  0: { hse: 300, current: 95 },    // Ground - Reception
  1: { hse: 200, current: 72 },    // Cafeteria
  2: { hse: 150, current: 38 },    // Fitness
  3: { hse: 250, current: 112 },   // Conference
  4: { hse: 280, current: 78 },    // Office
  5: { hse: 280, current: 85 },
  6: { hse: 280, current: 74 },
  7: { hse: 280, current: 92 },
  8: { hse: 280, current: 88 },
  9: { hse: 280, current: 65 },
  10: { hse: 280, current: 52 },
  11: { hse: 280, current: 34 },
  12: { hse: 280, current: 41 },
  13: { hse: 280, current: 68 },
  14: { hse: 280, current: 55 },
  15: { hse: 280, current: 62 },
  16: { hse: 280, current: 58 },
  17: { hse: 250, current: 42 },
  18: { hse: 250, current: 28 },
  19: { hse: 120, current: 18 },   // Executive
  20: { hse: 80, current: 12 },
  21: { hse: 100, current: 8 },    // Rooftop
}
// Total: 95+72+38+112+78+85+74+92+88+65+52+34+41+68+55+62+58+42+28+18+12+8 = 1,247

function getFloorHSE(floor: number): string {
  return (FLOOR_DATA[floor]?.hse || 200).toLocaleString()
}
function getFloorCurrent(floor: number): string {
  return (FLOOR_DATA[floor]?.current || 0).toLocaleString()
}
function getFloorOccColor(floor: number): string {
  const d = FLOOR_DATA[floor]
  if (!d) return '#94A3B8'
  const pct = d.current / d.hse
  if (pct >= 0.8) return '#EF4444'   // Red
  if (pct >= 0.5) return '#F59E0B'   // Amber
  return '#10B981'                    // Green
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard7OccupancyServices({
  badgeSwipes,
}: Props) {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [selectedFloorName, setSelectedFloorName] = useState('')
  const [dateRange, setDateRange] = useState<string>('Today')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

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
      {/* Header with date filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: '36px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
          Occupancy Services
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {(['Today', 'This Week', 'This Month'] as const).map(label => (
            <button key={label} onClick={() => setDateRange(label)}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                backgroundColor: dateRange === label ? '#1E3A5F' : DASH.cardBg2,
                border: `1px solid ${dateRange === label ? '#3B82F6' : DASH.cardBorder}`,
                color: dateRange === label ? '#F1F5F9' : '#94A3B8',
              }}>
              {label}
            </button>
          ))}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input type="date" value={customFrom} onChange={e => { setCustomFrom(e.target.value); setDateRange('custom') }}
              style={{ padding: '7px 10px', backgroundColor: DASH.cardBg2, border: `1px solid ${DASH.cardBorder}`, borderRadius: '8px', color: '#F1F5F9', fontSize: '12px', outline: 'none' }} />
            <span style={{ color: '#64748B', fontSize: '12px' }}>to</span>
            <input type="date" value={customTo} onChange={e => { setCustomTo(e.target.value); setDateRange('custom') }}
              style={{ padding: '7px 10px', backgroundColor: DASH.cardBg2, border: `1px solid ${DASH.cardBorder}`, borderRadius: '8px', color: '#F1F5F9', fontSize: '12px', outline: 'none' }} />
          </div>
        </div>
      </div>

      {/* ─── Section 1: 3D Building Model ─────────────────────────────────── */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <CardPanel style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${DASH.cardBorder}` }}>
            <h2 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 800, margin: 0 }}>Building Overview</h2>
            <p style={{ color: DASH.label, fontSize: '12px', margin: '4px 0 0' }}>
              {selectedFloor !== null
                ? `Showing data for ${selectedFloorName} · Click "All Floors" to reset`
                : 'Click a floor in Ghost mode to filter all dashboard data to that floor'}
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <BuildingModel3D height={520} onFloorSelect={(floorNum, floorName) => { setSelectedFloor(floorNum); setSelectedFloorName(floorName) }} />
            {/* "All" button — reset to whole building view */}
            {selectedFloor !== null && (
              <button onClick={() => { setSelectedFloor(null); setSelectedFloorName('') }}
                style={{
                  position: 'absolute', top: 52, left: 12, zIndex: 10,
                  padding: '6px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  backgroundColor: '#1E3A5F', border: '1px solid #3B82F6', color: '#F1F5F9',
                  backdropFilter: 'blur(8px)',
                }}>
                All Floors
              </button>
            )}
            {/* HSE & Occupancy overlay panels */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(15,26,46,0.9)', border: '1px solid #1E3A5F', borderRadius: '10px', backdropFilter: 'blur(8px)', minWidth: '160px' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>HSE Capacity</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#F1F5F9', lineHeight: 1.2 }}>5,000</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Maximum allowed</div>
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(15,26,46,0.9)', border: '1px solid #1E3A5F', borderRadius: '10px', backdropFilter: 'blur(8px)', minWidth: '160px' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Occupancy</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#10B981', lineHeight: 1.2 }}>1,247</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>People in building</div>
              </div>
              {selectedFloor !== null && (
                <>
                  <div style={{ padding: '12px 16px', backgroundColor: 'rgba(15,26,46,0.9)', border: '1px solid #3B82F6', borderRadius: '10px', backdropFilter: 'blur(8px)', minWidth: '160px' }}>
                    <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedFloorName} HSE</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#F1F5F9', lineHeight: 1.2 }}>{getFloorHSE(selectedFloor)}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Floor max capacity</div>
                  </div>
                  <div style={{ padding: '12px 16px', backgroundColor: 'rgba(15,26,46,0.9)', border: '1px solid #3B82F6', borderRadius: '10px', backdropFilter: 'blur(8px)', minWidth: '160px' }}>
                    <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedFloorName} Current</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: getFloorOccColor(selectedFloor), lineHeight: 1.2 }}>{getFloorCurrent(selectedFloor)}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>People on floor</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardPanel>
      </div>

      {/* Floorplan panel - appears below when floor selected */}
      {selectedFloor !== null && (
        <CardPanel style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
          <FloorplanWithZones
            floorNumber={selectedFloor}
            floorName={selectedFloorName}
            onClose={() => setSelectedFloor(null)}
          />
        </CardPanel>
      )}

      {/* ─── Section 2: Workplace Utilization ─────────────────────────────── */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: DASH.text, fontSize: '20px', fontWeight: 700, margin: 0 }}>
            Workplace utilization
          </h2>
        </div>

        <CardPanel>
          {/* Gauge row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <GaugeChart
                value={4200}
                max={5000}
                label="Allocation"
                sublabel="4,200 / 5,000"
                size={180}
                color={DASH.blue}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <GaugeChart
                value={25}
                max={100}
                label="Current Utilization"
                sublabel="1,247 / 5,000"
                size={180}
                color={DASH.blue}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <GaugeChart
                value={68}
                max={100}
                label="Peak Utilization"
                sublabel="3,400 / 5,000"
                size={180}
                color={DASH.blue}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: DASH.text, fontSize: '20px', fontWeight: 700, margin: 0 }}>
            Access by Department
          </h2>
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
