'use client'

import React, { useState, useMemo } from 'react'
import { Building, Invitation } from '../context/GlobalStateContext'

interface SmartSpacesDashboardProps {
  buildings: Building[]
  invitations: Invitation[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COLORS = {
  cardBg: '#162032',
  cardBorder: '#1E293B',
  darkBg: '#0F1629',
  text: '#F1F5F9',
  muted: '#64748B',
  secondary: '#94A3B8',
  accent: '#3B82F6',
  gold: '#D7BB91',
  purple: '#8B5CF6',
  red: '#EF4444',
  green: '#10B981',
  inputBg: '#1E293B',
  inputBorder: '#475569',
} as const

function formatNumber(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  index: number,
  total: number,
): { x: number; y: number } {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

function hexagonPath(cx: number, cy: number, r: number, sides: number): string {
  const pts: string[] = []
  for (let i = 0; i < sides; i++) {
    const { x, y } = polarToCartesian(cx, cy, r, i, sides)
    pts.push(`${x},${y}`)
  }
  return `M${pts.join('L')}Z`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CardWrapper({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        backgroundColor: COLORS.cardBg,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: '12px',
        padding: '20px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function SectionTitle({
  icon,
  title,
  right,
}: {
  icon?: React.ReactNode
  title: string
  right?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        <span style={{ color: COLORS.text, fontSize: '16px', fontWeight: 600 }}>{title}</span>
      </div>
      {right}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Donut Chart
// ---------------------------------------------------------------------------

function DonutChart({
  segments,
  size = 180,
}: {
  segments: { label: string; value: number; color: string }[]
  size?: number
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  const r = 60
  const circumference = 2 * Math.PI * r

  // Pre-calculate offsets to avoid mutation during render
  const segmentData = segments.map((seg) => {
    const pct = seg.value / total
    return { ...seg, pct, dashLen: pct * circumference }
  })
  let cumulative = 0
  const offsets = segmentData.map((seg) => {
    const offset = cumulative
    cumulative += seg.dashLen
    return offset
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 180 180" width={size} height={size}>
        {segmentData.map((seg, i) => (
          <circle
            key={i}
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="24"
            strokeDasharray={`${seg.dashLen} ${circumference - seg.dashLen}`}
            strokeDashoffset={-offsets[i]}
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dasharray 0.4s ease' }}
          />
        ))}
        <text
          x="90"
          y="85"
          textAnchor="middle"
          fill={COLORS.text}
          fontSize="14"
          fontWeight="700"
        >
          {formatNumber(total)}
        </text>
        <text x="90" y="102" textAnchor="middle" fill={COLORS.muted} fontSize="10">
          kWh Total
        </text>
      </svg>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {segmentData.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: seg.color,
                display: 'inline-block',
              }}
            />
            <span style={{ color: COLORS.secondary, fontSize: '11px' }}>
              {seg.label} {(seg.pct * 100).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bar Chart (stacked)
// ---------------------------------------------------------------------------

function StackedBarChart({
  data,
  width = 320,
  height = 160,
}: {
  data: { label: string; segments: { value: number; color: string }[] }[]
  width?: number
  height?: number
}) {
  const maxVal = Math.max(...data.map((d) => d.segments.reduce((s, seg) => s + seg.value, 0)))
  const barWidth = Math.min(36, (width - 60) / data.length - 8)
  const chartH = height - 30
  const chartLeft = 50

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', maxHeight: height }}>
      {/* Y gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
        const y = chartH - frac * chartH
        return (
          <g key={i}>
            <line
              x1={chartLeft}
              y1={y}
              x2={width}
              y2={y}
              stroke={COLORS.cardBorder}
              strokeWidth="0.5"
            />
            <text x={chartLeft - 4} y={y + 3} textAnchor="end" fill={COLORS.muted} fontSize="9">
              {Math.round(maxVal * frac).toLocaleString()}
            </text>
          </g>
        )
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const x = chartLeft + 10 + i * ((width - chartLeft - 10) / data.length)
        let yBottom = chartH
        return (
          <g key={i}>
            {d.segments.map((seg, j) => {
              const barH = (seg.value / maxVal) * chartH
              yBottom -= barH
              return (
                <rect
                  key={j}
                  x={x}
                  y={yBottom}
                  width={barWidth}
                  height={barH + 0.5}
                  rx={j === d.segments.length - 1 ? 3 : 0}
                  fill={seg.color}
                  opacity={0.85}
                />
              )
            })}
            <text
              x={x + barWidth / 2}
              y={chartH + 14}
              textAnchor="middle"
              fill={COLORS.muted}
              fontSize="9"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Multi-line Chart
// ---------------------------------------------------------------------------

function MultiLineChart({
  series,
  labels,
  width = 320,
  height = 140,
}: {
  series: { data: number[]; color: string; label: string }[]
  labels: string[]
  width?: number
  height?: number
}) {
  const allVals = series.flatMap((s) => s.data)
  const maxVal = Math.max(...allVals)
  const chartLeft = 50
  const chartH = height - 28
  const usableW = width - chartLeft - 10
  const stepX = usableW / Math.max(labels.length - 1, 1)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', maxHeight: height }}>
      {/* Y grid */}
      {[0, 0.5, 1].map((frac, i) => {
        const y = chartH - frac * chartH
        return (
          <g key={i}>
            <line
              x1={chartLeft}
              y1={y}
              x2={width}
              y2={y}
              stroke={COLORS.cardBorder}
              strokeWidth="0.5"
            />
            <text x={chartLeft - 4} y={y + 3} textAnchor="end" fill={COLORS.muted} fontSize="9">
              {Math.round(maxVal * frac).toLocaleString()}
            </text>
          </g>
        )
      })}
      {/* Lines */}
      {series.map((s, si) => {
        const points = s.data
          .map((v, i) => {
            const x = chartLeft + i * stepX
            const y = chartH - (v / maxVal) * chartH
            return `${x},${y}`
          })
          .join(' ')
        return (
          <polyline
            key={si}
            points={points}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      })}
      {/* Dots */}
      {series.map((s, si) =>
        s.data.map((v, i) => {
          const x = chartLeft + i * stepX
          const y = chartH - (v / maxVal) * chartH
          return <circle key={`${si}-${i}`} cx={x} cy={y} r="3" fill={s.color} />
        }),
      )}
      {/* X labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={chartLeft + i * stepX}
          y={chartH + 14}
          textAnchor="middle"
          fill={COLORS.muted}
          fontSize="9"
        >
          {l}
        </text>
      ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Stacked Area Chart
// ---------------------------------------------------------------------------

function StackedAreaChart({
  layers,
  labels,
  yTicks,
  maxY,
  width = 320,
  height = 180,
}: {
  layers: { data: number[]; color: string; label: string }[]
  labels: string[]
  yTicks: { value: number; label: string }[]
  maxY: number
  width?: number
  height?: number
}) {
  const chartLeft = 54
  const chartH = height - 30
  const usableW = width - chartLeft - 10
  const stepX = usableW / Math.max(labels.length - 1, 1)

  // Build stacked data bottom-up
  const stacked: number[][] = []
  layers.forEach((layer, li) => {
    stacked[li] = layer.data.map((v, di) => v + (li > 0 ? stacked[li - 1][di] : 0))
  })

  function makeAreaPath(topData: number[], bottomData: number[] | null): string {
    let d = ''
    topData.forEach((val, i) => {
      const x = chartLeft + i * stepX
      const y = chartH - (val / maxY) * chartH
      d += i === 0 ? `M${x},${y}` : `L${x},${y}`
    })
    // Walk bottom in reverse
    for (let i = topData.length - 1; i >= 0; i--) {
      const x = chartLeft + i * stepX
      const y = bottomData ? chartH - (bottomData[i] / maxY) * chartH : chartH
      d += `L${x},${y}`
    }
    d += 'Z'
    return d
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', maxHeight: height }}>
      {/* Y grid */}
      {yTicks.map((tick, i) => {
        const y = chartH - (tick.value / maxY) * chartH
        return (
          <g key={i}>
            <line
              x1={chartLeft}
              y1={y}
              x2={width}
              y2={y}
              stroke={COLORS.cardBorder}
              strokeWidth="0.5"
            />
            <text x={chartLeft - 4} y={y + 3} textAnchor="end" fill={COLORS.muted} fontSize="9">
              {tick.label}
            </text>
          </g>
        )
      })}
      {/* Areas (render bottom-up so top layer is visually on top) */}
      {stacked.map((topData, li) => {
        const bottomData = li > 0 ? stacked[li - 1] : null
        return (
          <path
            key={li}
            d={makeAreaPath(topData, bottomData)}
            fill={layers[li].color}
            opacity={0.55}
          />
        )
      })}
      {/* Top stroke of each layer */}
      {stacked.map((topData, li) => {
        const points = topData
          .map((val, i) => {
            const x = chartLeft + i * stepX
            const y = chartH - (val / maxY) * chartH
            return `${x},${y}`
          })
          .join(' ')
        return (
          <polyline
            key={`line-${li}`}
            points={points}
            fill="none"
            stroke={layers[li].color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )
      })}
      {/* X labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={chartLeft + i * stepX}
          y={chartH + 14}
          textAnchor="middle"
          fill={COLORS.muted}
          fontSize="9"
        >
          {l}
        </text>
      ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Radar / Spider Chart
// ---------------------------------------------------------------------------

function RadarChart({
  axes,
  outerValues,
  innerValues,
  outerColor,
  innerColor,
  size = 220,
}: {
  axes: { label: string; value: number }[]
  outerValues: number[]
  innerValues: number[]
  outerColor: { fill: string; stroke: string }
  innerColor: { fill: string; stroke: string }
  size?: number
}) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 40
  const n = axes.length
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0]

  function dataPolygon(values: number[]): string {
    return values
      .map((v, i) => {
        const r = (v / 100) * maxR
        const { x, y } = polarToCartesian(cx, cy, r, i, n)
        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size}>
      {/* Concentric hexagons */}
      {levels.map((l, li) => (
        <path
          key={li}
          d={hexagonPath(cx, cy, l * maxR, n)}
          fill="none"
          stroke={COLORS.cardBorder}
          strokeWidth="0.7"
        />
      ))}
      {/* Axis lines */}
      {axes.map((_, i) => {
        const { x, y } = polarToCartesian(cx, cy, maxR, i, n)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={COLORS.cardBorder}
            strokeWidth="0.5"
          />
        )
      })}
      {/* Outer data polygon */}
      <polygon
        points={dataPolygon(outerValues)}
        fill={outerColor.fill}
        stroke={outerColor.stroke}
        strokeWidth="1.5"
      />
      {/* Inner data polygon */}
      <polygon
        points={dataPolygon(innerValues)}
        fill={innerColor.fill}
        stroke={innerColor.stroke}
        strokeWidth="1.5"
      />
      {/* Axis labels & values */}
      {axes.map((axis, i) => {
        const labelR = maxR + 20
        const { x, y } = polarToCartesian(cx, cy, labelR, i, n)
        const valR = (outerValues[i] / 100) * maxR + 10
        const vp = polarToCartesian(cx, cy, valR, i, n)
        return (
          <g key={i}>
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={COLORS.secondary}
              fontSize="9"
              fontWeight="600"
            >
              {axis.label}
            </text>
            <text
              x={vp.x}
              y={vp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={COLORS.text}
              fontSize="8"
              fontWeight="700"
            >
              {axis.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Circular Progress Indicator
// ---------------------------------------------------------------------------

function CircularProgress({
  value,
  max,
  label,
  color,
  size = 80,
}: {
  value: number
  max: number
  label: string
  color: string
  size?: number
}) {
  const r = (size - 12) / 2
  const circumference = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const dashLen = pct * circumference

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        flex: '1 1 0',
        minWidth: '70px',
      }}
    >
      <svg width={size} height={size}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={COLORS.cardBorder}
          strokeWidth="6"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${dashLen} ${circumference - dashLen}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        {/* Value */}
        <text
          x={size / 2}
          y={size / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={COLORS.text}
          fontSize="16"
          fontWeight="700"
        >
          {typeof value === 'number' && label.toLowerCase().includes('percentage')
            ? `${value}%`
            : value}
        </text>
      </svg>
      <span
        style={{
          color: COLORS.secondary,
          fontSize: '10px',
          textAlign: 'center',
          lineHeight: '1.2',
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dual Line Chart (Occupancy vs Temperature)
// ---------------------------------------------------------------------------

function DualLineChart({
  occupants,
  temperatures,
  hours,
  width = 340,
  height = 180,
}: {
  occupants: number[]
  temperatures: number[]
  hours: string[]
  width?: number
  height?: number
}) {
  const chartLeft = 40
  const chartRight = width - 10
  const chartH = height - 28
  const usableW = chartRight - chartLeft
  const maxOcc = 200
  const tempMin = 15
  const tempMax = 30
  const stepX = usableW / Math.max(hours.length - 1, 1)

  function occY(v: number): number {
    return chartH - (v / maxOcc) * chartH
  }
  function tempY(v: number): number {
    return chartH - ((v - tempMin) / (tempMax - tempMin)) * chartH
  }

  const occPoints = occupants.map((v, i) => `${chartLeft + i * stepX},${occY(v)}`).join(' ')
  const tempPoints = temperatures.map((v, i) => `${chartLeft + i * stepX},${tempY(v)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', maxHeight: height }}>
      {/* Y grid */}
      {[0, 50, 100, 150, 200].map((v, i) => {
        const y = occY(v)
        return (
          <g key={i}>
            <line
              x1={chartLeft}
              y1={y}
              x2={chartRight}
              y2={y}
              stroke={COLORS.cardBorder}
              strokeWidth="0.5"
            />
            <text x={chartLeft - 4} y={y + 3} textAnchor="end" fill={COLORS.muted} fontSize="8">
              {v}
            </text>
          </g>
        )
      })}
      {/* Occupant line */}
      <polyline
        points={occPoints}
        fill="none"
        stroke={COLORS.accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {occupants.map((v, i) => (
        <circle key={`o${i}`} cx={chartLeft + i * stepX} cy={occY(v)} r="2.5" fill={COLORS.accent} />
      ))}
      {/* Temperature line */}
      <polyline
        points={tempPoints}
        fill="none"
        stroke={COLORS.red}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 2"
      />
      {temperatures.map((v, i) => (
        <circle key={`t${i}`} cx={chartLeft + i * stepX} cy={tempY(v)} r="2.5" fill={COLORS.red} />
      ))}
      {/* X labels */}
      {hours.map((l, i) => (
        <text
          key={i}
          x={chartLeft + i * stepX}
          y={chartH + 14}
          textAnchor="middle"
          fill={COLORS.muted}
          fontSize="7"
        >
          {l}
        </text>
      ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Icon components (pure SVG)
// ---------------------------------------------------------------------------

function FlameIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function BarrelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.657 3.582 3 8 3s8-1.343 8-3V5" />
      <path d="M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function WaterDropIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

export default function SmartSpacesDashboard({
  buildings,
  invitations,
}: SmartSpacesDashboardProps) {
  const [energyTab, setEnergyTab] = useState<'Day' | 'Week' | 'Month' | 'Target'>('Day')
  const [selectedFloor, setSelectedFloor] = useState('Ground Floor')

  // Derive floors from first building
  const floors = useMemo(() => {
    if (buildings.length === 0) return ['Ground Floor']
    return buildings[0].floors.map((f) => f.floorLabel)
  }, [buildings])

  // Visitor counts from invitations
  const liveVisitors = useMemo(() => {
    const count = invitations.filter((i) => i.status === 'checked-in').length
    return count || 18
  }, [invitations])

  const expectedVisitors = useMemo(() => {
    const count = invitations.filter((i) => i.status === 'approved').length
    return count || 8
  }, [invitations])

  // Current time for occupants panel
  const now = new Date()
  const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`

  // ---------------------------------------------------------------------------
  // ENERGY DATA (realistic office building)
  // ---------------------------------------------------------------------------
  const energyCategories = [
    { name: 'ELECTRICITY', value: 12840.50, color: COLORS.accent },
    { name: 'DISTRICT HEATING', value: 8325.75, color: COLORS.red },
    { name: 'HEAT PUMPS (INTERNAL)', value: 4290.60, color: COLORS.green },
  ]

  const equivalenceMetrics = [
    { value: '9.42', label: 'tonnes CO₂ equivalent', icon: <FlameIcon /> },
    { value: '4.70', label: "households' annual electricity", icon: <HomeIcon /> },
    { value: '54.18', label: 'barrels of oil equivalent', icon: <BarrelIcon /> },
    { value: '2,145', label: 'MWh annual projection', icon: <PhoneIcon /> },
  ]

  const donutSegments = [
    { label: 'Electricity', value: 12840.50, color: COLORS.accent },
    { label: 'District Heating', value: 8325.75, color: COLORS.red },
    { label: 'Heat Pumps', value: 4290.60, color: COLORS.green },
  ]

  const barData = [
    {
      label: 'Mon',
      segments: [
        { value: 2450, color: COLORS.accent },
        { value: 1680, color: COLORS.red },
        { value: 820, color: COLORS.green },
      ],
    },
    {
      label: 'Tue',
      segments: [
        { value: 2680, color: COLORS.accent },
        { value: 1740, color: COLORS.red },
        { value: 890, color: COLORS.green },
      ],
    },
    {
      label: 'Wed',
      segments: [
        { value: 2590, color: COLORS.accent },
        { value: 1620, color: COLORS.red },
        { value: 860, color: COLORS.green },
      ],
    },
    {
      label: 'Thu',
      segments: [
        { value: 2720, color: COLORS.accent },
        { value: 1790, color: COLORS.red },
        { value: 910, color: COLORS.green },
      ],
    },
    {
      label: 'Fri',
      segments: [
        { value: 2400, color: COLORS.accent },
        { value: 1495, color: COLORS.red },
        { value: 810, color: COLORS.green },
      ],
    },
  ]

  const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const trendSeries = [
    { data: [2450, 2680, 2590, 2720, 2400], color: COLORS.accent, label: 'Electricity' },
    { data: [1680, 1740, 1620, 1790, 1495], color: COLORS.red, label: 'District Heating' },
    { data: [820, 890, 860, 910, 810], color: COLORS.green, label: 'Heat Pumps' },
  ]

  // ---------------------------------------------------------------------------
  // WATER DATA (office building: domestic hot water, sanitary, HVAC cooling)
  // ---------------------------------------------------------------------------
  const waterLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const waterLayers = [
    { data: [1200, 1450, 1380, 1520, 980], color: COLORS.green, label: 'HVAC / Cooling' },
    { data: [2800, 3200, 3050, 3400, 2600], color: COLORS.accent, label: 'Sanitary' },
    { data: [1600, 1850, 1720, 1950, 1400], color: COLORS.red, label: 'Domestic Hot Water' },
  ]
  const waterYTicks = [
    { value: 2000, label: '2,000L' },
    { value: 4000, label: '4,000L' },
    { value: 6000, label: '6,000L' },
    { value: 8000, label: '8,000L' },
  ]

  // ---------------------------------------------------------------------------
  // AIR QUALITY DATA
  // ---------------------------------------------------------------------------
  const airQualityAxes = [
    { label: 'HUMIDITY', value: 48 },
    { label: 'TEMP (°C)', value: 22 },
    { label: 'CO₂ (ppm)', value: 620 },
    { label: 'PM2.5', value: 12 },
    { label: 'VOC', value: 35 },
    { label: 'NOISE (dB)', value: 42 },
  ]
  // Normalize to 0-100 scale for radar: Humidity 48/100, Temp 22/30→73, CO2 620/1000→62, PM2.5 12/50→24, VOC 35/100→35, Noise 42/80→52
  const airOuterValues = [48, 73, 62, 24, 35, 52]
  const airInnerValues = [40, 65, 45, 15, 20, 38]

  // ---------------------------------------------------------------------------
  // PRODUCTIVITY DATA
  // ---------------------------------------------------------------------------
  const productivityAxes = [
    { label: 'LIGHTING', value: 82 },
    { label: 'THERMAL', value: 76 },
    { label: 'HVAC EFF.', value: 88 },
    { label: 'OCCUPANCY', value: 64 },
    { label: 'ENERGY EFF.', value: 71 },
    { label: 'WATER EFF.', value: 79 },
  ]
  const prodOuterValues = [82, 76, 88, 64, 71, 79]
  const prodInnerValues = [60, 55, 65, 45, 50, 58]

  // ---------------------------------------------------------------------------
  // OCCUPANCY VS TEMPERATURE DATA
  // ---------------------------------------------------------------------------
  const occHours = ['0', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
  const occOccupants = [5, 20, 50, 90, 130, 160, 170, 165, 150, 120]
  const occTemperatures = [18, 19, 20, 22, 23, 24, 25, 25, 24, 23]

  // ---------------------------------------------------------------------------
  // TAB BUTTON STYLE
  // ---------------------------------------------------------------------------
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: active ? COLORS.accent : 'transparent',
    color: active ? '#FFFFFF' : COLORS.secondary,
    transition: 'background-color 0.2s, color 0.2s',
  })

  const selectStyle: React.CSSProperties = {
    backgroundColor: COLORS.inputBg,
    border: `1px solid ${COLORS.inputBorder}`,
    borderRadius: '8px',
    color: COLORS.text,
    padding: '6px 12px',
    fontSize: '12px',
    outline: 'none',
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div style={{ backgroundColor: COLORS.darkBg, padding: '24px', borderRadius: '16px' }}>
      {/* Dashboard header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BoltIcon />
          <h1 style={{ color: COLORS.text, fontSize: '22px', fontWeight: 700, margin: 0 }}>
            SmartSpaces Dashboard
          </h1>
        </div>
        <span style={{ color: COLORS.muted, fontSize: '13px' }}>
          {buildings.length > 0 ? buildings[0].name : 'Building Overview'}
        </span>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(300px, 2fr)', gap: '20px' }}>
        {/* ================================================================== */}
        {/* LEFT COLUMN */}
        {/* ================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ---- PANEL 1: ENERGY ---- */}
          <CardWrapper>
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <SectionTitle
                icon={<BoltIcon />}
                title="Building Energy"
              />
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                style={selectStyle}
              >
                {floors.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
              {(['Day', 'Week', 'Month', 'Target'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setEnergyTab(tab)}
                  style={tabStyle(energyTab === tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Consumption Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {energyCategories.map((cat) => (
                <div
                  key={cat.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: COLORS.darkBg,
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.cardBorder}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: cat.color,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ color: COLORS.secondary, fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>
                      {cat.name}
                    </span>
                  </div>
                  <span style={{ color: COLORS.text, fontSize: '14px', fontWeight: 700 }}>
                    {formatNumber(cat.value)} kWh
                  </span>
                </div>
              ))}
            </div>

            {/* Equivalence Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                marginBottom: '24px',
              }}
            >
              {equivalenceMetrics.map((m, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: COLORS.darkBg,
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.cardBorder}`,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                  }}
                >
                  {m.icon}
                  <span style={{ color: COLORS.text, fontSize: '14px', fontWeight: 700 }}>
                    {m.value}
                  </span>
                  <span style={{ color: COLORS.muted, fontSize: '10px', lineHeight: '1.3' }}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Charts Row: Donut + Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <div>
                <span
                  style={{
                    color: COLORS.secondary,
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Distribution
                </span>
                <DonutChart segments={donutSegments} size={200} />
              </div>
              <div>
                <span
                  style={{
                    color: COLORS.secondary,
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Daily Consumption
                </span>
                <StackedBarChart data={barData} width={340} height={180} />
              </div>
            </div>

            {/* Trend Line Chart */}
            <div>
              <span
                style={{
                  color: COLORS.secondary,
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Consumption Trend
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '6px',
                  justifyContent: 'flex-end',
                }}
              >
                {trendSeries.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span
                      style={{
                        width: '16px',
                        height: '3px',
                        backgroundColor: s.color,
                        display: 'inline-block',
                        borderRadius: '2px',
                      }}
                    />
                    <span style={{ color: COLORS.muted, fontSize: '10px' }}>{s.label}</span>
                  </div>
                ))}
              </div>
              <MultiLineChart series={trendSeries} labels={trendLabels} width={700} height={150} />
            </div>
          </CardWrapper>

          {/* ---- PANEL 5: OCCUPANTS ---- */}
          <CardWrapper>
            <SectionTitle
              icon={<PersonIcon />}
              title="Occupants"
              right={
                <span style={{ color: COLORS.muted, fontSize: '11px' }}>
                  updated: {timestamp}
                </span>
              }
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '8px',
              }}
            >
              <CircularProgress
                value={140}
                max={200}
                label="Total Live Occupancy"
                color={COLORS.accent}
                size={90}
              />
              <CircularProgress
                value={122}
                max={200}
                label="Live Residents"
                color={COLORS.accent}
                size={90}
              />
              <CircularProgress
                value={liveVisitors}
                max={50}
                label="Live Visitors"
                color={COLORS.accent}
                size={90}
              />
              <CircularProgress
                value={27}
                max={100}
                label="Percentage Occupied"
                color={COLORS.gold}
                size={90}
              />
              <CircularProgress
                value={expectedVisitors}
                max={50}
                label="Expected Visitors"
                color={COLORS.gold}
                size={90}
              />
            </div>
          </CardWrapper>
        </div>

        {/* ================================================================== */}
        {/* RIGHT COLUMN */}
        {/* ================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ---- PANEL 2: WATER ---- */}
          <CardWrapper>
            <SectionTitle icon={<WaterDropIcon />} title="Water" />
            <StackedAreaChart
              layers={waterLayers}
              labels={waterLabels}
              yTicks={waterYTicks}
              maxY={8000}
              width={380}
              height={200}
            />
            {/* Legend */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                justifyContent: 'center',
                marginTop: '10px',
              }}
            >
              {waterLayers
                .slice()
                .reverse()
                .map((l, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      backgroundColor: `${l.color}22`,
                      border: `1px solid ${l.color}44`,
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: l.color,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ color: COLORS.secondary, fontSize: '11px' }}>{l.label}</span>
                  </div>
                ))}
            </div>
          </CardWrapper>

          {/* ---- PANEL 3: AIR QUALITY ---- */}
          <CardWrapper>
            <SectionTitle
              title="Air Quality"
              right={<ChevronDownIcon />}
            />
            <RadarChart
              axes={airQualityAxes}
              outerValues={airOuterValues}
              innerValues={airInnerValues}
              outerColor={{ fill: 'rgba(59, 130, 246, 0.3)', stroke: '#3B82F6' }}
              innerColor={{ fill: 'rgba(215, 187, 145, 0.3)', stroke: '#D7BB91' }}
              size={240}
            />
          </CardWrapper>

          {/* ---- PANEL 4: PRODUCTIVITY ---- */}
          <CardWrapper>
            <SectionTitle
              title="Productivity"
              right={<ChevronDownIcon />}
            />
            <RadarChart
              axes={productivityAxes}
              outerValues={prodOuterValues}
              innerValues={prodInnerValues}
              outerColor={{ fill: 'rgba(139, 92, 246, 0.3)', stroke: '#8B5CF6' }}
              innerColor={{ fill: 'rgba(59, 130, 246, 0.3)', stroke: '#3B82F6' }}
              size={240}
            />
          </CardWrapper>

          {/* ---- PANEL 6: OCCUPANCY VS TEMPERATURE ---- */}
          <CardWrapper>
            <SectionTitle
              title="Occupancy Vs Temperature"
              right={<ChevronDownIcon />}
            />
            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: COLORS.accent,
                    display: 'inline-block',
                  }}
                />
                <span style={{ color: COLORS.secondary, fontSize: '11px' }}>Occupants</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: COLORS.red,
                    display: 'inline-block',
                  }}
                />
                <span style={{ color: COLORS.secondary, fontSize: '11px' }}>Temperature</span>
              </div>
            </div>
            <DualLineChart
              occupants={occOccupants}
              temperatures={occTemperatures}
              hours={occHours}
              width={380}
              height={190}
            />
          </CardWrapper>
        </div>
      </div>
    </div>
  )
}
