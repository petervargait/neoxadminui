'use client'

import React from 'react'

// ─── Design Tokens ───────────────────────────────────────────────────────────
export const DASH = {
  pageBg: '#08122E',
  cardBg: '#0F1A2E',
  cardBg2: '#162032',
  cardBorder: '#1E3A5F',
  cardBorder2: '#1E293B',
  text: '#F1F5F9',
  textWhite: '#FFFFFF',
  label: '#94A3B8',
  muted: '#64748B',
  gold: '#C9963B',
  goldLight: '#D4A847',
  barWhite: '#E2E8F0',
  barMuted: '#334155',
  trendUp: '#3B82F6',
  trendDown: '#EF4444',
  trendNeutral: '#D4A847',
  green: '#10B981',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  pink: '#EC4899',
  orange: '#F97316',
  red: '#EF4444',
  blue: '#3B82F6',
  lineToday: '#C9963B',
  linePrediction: '#475569',
  lineAverage: '#3B82F6',
}

// ─── TrendArrow ──────────────────────────────────────────────────────────────
export function TrendArrow({ direction, size = 14 }: { direction: 'up' | 'down' | 'neutral'; size?: number }) {
  const color = direction === 'up' ? DASH.trendUp : direction === 'down' ? DASH.trendDown : DASH.trendNeutral
  if (direction === 'neutral') {
    return <span style={{ color, fontSize: size, fontWeight: 700 }}>↕</span>
  }
  return <span style={{ color, fontSize: size, fontWeight: 700 }}>{direction === 'up' ? '↑' : '↓'}</span>
}

// ─── CardPanel ───────────────────────────────────────────────────────────────
export function CardPanel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: DASH.cardBg,
      border: `1px solid ${DASH.cardBorder}`,
      borderRadius: '16px',
      padding: '24px',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── SectionHeader ───────────────────────────────────────────────────────────
export function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h2 style={{ color: DASH.text, fontSize: '22px', fontWeight: 700, margin: 0 }}>{title}</h2>
      {children && <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>{children}</div>}
    </div>
  )
}

// ─── DashboardHeader ─────────────────────────────────────────────────────────
export function DashboardHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', padding: '0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
          <rect x="10" y="50" width="15" height="40" rx="2" fill={DASH.gold} />
          <rect x="30" y="30" width="15" height="60" rx="2" fill={DASH.gold} />
          <rect x="50" y="15" width="15" height="75" rx="2" fill={DASH.gold} />
          <rect x="70" y="40" width="15" height="50" rx="2" fill={DASH.gold} />
          <text x="50" y="12" textAnchor="middle" fill={DASH.text} fontSize="8" fontWeight="600">NEOX</text>
        </svg>
        <h1 style={{ color: DASH.text, fontSize: '28px', fontWeight: 800, margin: 0 }}>{title}</h1>
      </div>
      {children && <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>{children}</div>}
    </div>
  )
}

// ─── MonthSelector ───────────────────────────────────────────────────────────
export function MonthSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const months = [
    'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
    'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025',
    'January 2026', 'February 2026', 'March 2026',
  ]
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px 16px',
        backgroundColor: DASH.cardBg,
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '20px',
        color: DASH.text,
        fontSize: '13px',
        outline: 'none',
        cursor: 'pointer',
        minWidth: '160px',
      }}
    >
      {months.map(m => <option key={m} value={m}>{m}</option>)}
    </select>
  )
}

// ─── FilterDropdown ──────────────────────────────────────────────────────────
export function FilterDropdown({ label, value, options, onChange }: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px 16px',
        backgroundColor: DASH.cardBg,
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '20px',
        color: DASH.text,
        fontSize: '13px',
        outline: 'none',
        cursor: 'pointer',
        minWidth: '140px',
      }}
    >
      <option value="">{label}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

// ─── KPICard ─────────────────────────────────────────────────────────────────
export function KPICard({ value, label, trend, icon, unit, description, style }: {
  value: string | number
  label: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  unit?: string
  description?: string
  style?: React.CSSProperties
}) {
  return (
    <div style={{
      backgroundColor: DASH.cardBg,
      border: `1px solid ${DASH.cardBorder}`,
      borderRadius: '12px',
      padding: '16px 20px',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: description ? '6px' : '0' }}>
        {icon && <span style={{ fontSize: '20px', color: DASH.gold, flexShrink: 0 }}>{icon}</span>}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ color: DASH.textWhite, fontSize: '24px', fontWeight: 800 }}>{value}</span>
            {unit && <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 600 }}>{unit}</span>}
            {trend && <TrendArrow direction={trend} />}
          </div>
          <div style={{ color: DASH.label, fontSize: '13px', marginTop: '2px' }}>{label}</div>
        </div>
      </div>
      {description && <div style={{ color: DASH.muted, fontSize: '12px', marginTop: '4px', lineHeight: 1.4 }}>{description}</div>}
    </div>
  )
}

// ─── SmallKPI (inline stat) ─────────────────────────────────────────────────
export function SmallKPI({ value, label, trend, unit }: {
  value: string | number; label: string; trend?: 'up' | 'down' | 'neutral'; unit?: string
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
        <span style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800 }}>{value}</span>
        {unit && <span style={{ color: DASH.textWhite, fontSize: '12px' }}>{unit}</span>}
        {trend && <TrendArrow direction={trend} size={12} />}
      </div>
      <div style={{ color: DASH.label, fontSize: '11px', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

// ─── GoldBarChart ────────────────────────────────────────────────────────────
export function GoldBarChart({ data, width = 400, height = 250, barColor = DASH.gold, showValues = true, comparisonData }: {
  data: { label: string; value: number }[]
  width?: number
  height?: number
  barColor?: string
  showValues?: boolean
  comparisonData?: { label: string; value: number }[]
}) {
  if (!data.length) return null
  const maxVal = Math.max(...data.map(d => d.value), ...(comparisonData?.map(d => d.value) || []))
  const padding = { top: 30, right: 20, bottom: 40, left: 20 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const barGroupWidth = chartW / data.length
  const hasComparison = comparisonData && comparisonData.length === data.length
  const barW = hasComparison ? barGroupWidth * 0.35 : barGroupWidth * 0.5
  const gap = hasComparison ? barGroupWidth * 0.05 : 0

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {data.map((d, i) => {
        const barH = maxVal > 0 ? (d.value / maxVal) * chartH : 0
        const x = padding.left + i * barGroupWidth + (barGroupWidth - (hasComparison ? barW * 2 + gap : barW)) / 2
        const y = padding.top + chartH - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={3} fill={barColor} />
            {showValues && (
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={DASH.textWhite} fontSize="12" fontWeight="700">{d.value.toLocaleString()}</text>
            )}
            {hasComparison && comparisonData[i] && (() => {
              const cH = maxVal > 0 ? (comparisonData[i].value / maxVal) * chartH : 0
              const cx = x + barW + gap
              const cy = padding.top + chartH - cH
              return (
                <>
                  <rect x={cx} y={cy} width={barW} height={cH} rx={3} fill={DASH.barWhite} />
                  {showValues && (
                    <text x={cx + barW / 2} y={cy - 6} textAnchor="middle" fill={DASH.barWhite} fontSize="11" fontWeight="600">{comparisonData[i].value.toLocaleString()}</text>
                  )}
                </>
              )
            })()}
            <text x={padding.left + i * barGroupWidth + barGroupWidth / 2} y={height - 8} textAnchor="middle" fill={DASH.label} fontSize="11">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── ComboBarLineChart ───────────────────────────────────────────────────────
export function ComboBarLineChart({ data, width = 600, height = 300, showValues = true }: {
  data: { label: string; barValue: number; lineValue: number }[]
  width?: number
  height?: number
  showValues?: boolean
}) {
  if (!data.length) return null
  const maxVal = Math.max(...data.map(d => Math.max(d.barValue, d.lineValue)))
  const padding = { top: 40, right: 30, bottom: 50, left: 50 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const barGroupW = chartW / data.length
  const barW = barGroupW * 0.5

  // Y-axis gridlines
  const yTicks = 5
  const yStep = Math.ceil(maxVal / yTicks / 1000) * 1000

  // Line points
  const linePoints = data.map((d, i) => {
    const x = padding.left + i * barGroupW + barGroupW / 2
    const y = padding.top + chartH - (maxVal > 0 ? (d.lineValue / (yStep * yTicks)) * chartH : 0)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {/* Y gridlines */}
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const y = padding.top + chartH - (i * yStep / (yStep * yTicks)) * chartH
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={DASH.cardBorder} strokeWidth={1} strokeDasharray="4,4" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill={DASH.muted} fontSize="11">{(i * yStep).toLocaleString()}</text>
          </g>
        )
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const barH = maxVal > 0 ? (d.barValue / (yStep * yTicks)) * chartH : 0
        const x = padding.left + i * barGroupW + (barGroupW - barW) / 2
        const y = padding.top + chartH - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={3} fill={DASH.gold} />
            {showValues && (
              <text x={x + barW / 2} y={y - 8} textAnchor="middle" fill={DASH.textWhite} fontSize="12" fontWeight="700">{d.barValue.toLocaleString()}</text>
            )}
            <text x={padding.left + i * barGroupW + barGroupW / 2} y={height - 12} textAnchor="middle" fill={DASH.label} fontSize="11">{d.label}</text>
          </g>
        )
      })}
      {/* Line */}
      <polyline points={linePoints} fill="none" stroke={DASH.barWhite} strokeWidth={2} />
      {data.map((d, i) => {
        const x = padding.left + i * barGroupW + barGroupW / 2
        const y = padding.top + chartH - (maxVal > 0 ? (d.lineValue / (yStep * yTicks)) * chartH : 0)
        return <circle key={i} cx={x} cy={y} r={3} fill={DASH.barWhite} />
      })}
      {/* Legend */}
      <rect x={width - 220} y={6} width={12} height={12} rx={2} fill={DASH.gold} />
      <text x={width - 204} y={16} fill={DASH.label} fontSize="11">Total number of visitors</text>
      <rect x={width - 220} y={22} width={12} height={12} rx={2} fill={DASH.barWhite} />
      <text x={width - 204} y={32} fill={DASH.label} fontSize="11">Average number of visitors</text>
    </svg>
  )
}

// ─── HorizontalBarChart ──────────────────────────────────────────────────────
export function HorizontalBarChart({ data, width = 500, height, barColor = DASH.gold, maxValue, showTrend = true }: {
  data: { label: string; value: number; trend?: 'up' | 'down' | 'neutral' }[]
  width?: number
  height?: number
  barColor?: string
  maxValue?: number
  showTrend?: boolean
}) {
  if (!data.length) return null
  const max = maxValue || Math.max(...data.map(d => d.value))
  const barH = 24
  const rowH = 40
  const labelW = 180
  const valueW = 80
  const h = height || data.length * rowH + 20
  const chartW = width - labelW - valueW

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${width} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {data.map((d, i) => {
        const barW = max > 0 ? (d.value / max) * chartW : 0
        const y = i * rowH + 10
        return (
          <g key={i}>
            <text x={labelW - 10} y={y + barH / 2 + 4} textAnchor="end" fill={DASH.text} fontSize="12">{d.label}</text>
            <rect x={labelW} y={y} width={chartW} height={barH} rx={4} fill={DASH.barMuted} opacity={0.3} />
            <rect x={labelW} y={y} width={barW} height={barH} rx={4} fill={barColor} />
            <text x={labelW + chartW + 8} y={y + barH / 2 + 4} fill={DASH.textWhite} fontSize="13" fontWeight="700">{d.value.toLocaleString()}</text>
            {showTrend && d.trend && (
              <text x={labelW + chartW + 55} y={y + barH / 2 + 4} fill={d.trend === 'up' ? DASH.trendUp : d.trend === 'down' ? DASH.trendDown : DASH.trendNeutral} fontSize="12" fontWeight="700">
                {d.trend === 'up' ? '↑' : d.trend === 'down' ? '↓' : '↕'}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─── StackedHorizontalBarChart ───────────────────────────────────────────────
export function StackedHorizontalBarChart({ data, colors, labels, width = 600, total, showTotal: _showTotal = true }: {
  data: { rowLabel: string; segments: number[]; total: number; trend?: 'up' | 'down' | 'neutral' }[]
  colors: string[]
  labels: string[]
  width?: number
  total?: number
  showTotal?: boolean
}) {
  if (!data.length) return null
  const maxVal = total || Math.max(...data.map(d => d.total))
  const barH = 22
  const rowH = 36
  const labelW = 80
  const valueW = 100
  const chartW = width - labelW - valueW
  const h = data.length * rowH + 60

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${width} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {data.map((d, i) => {
        const y = i * rowH + 10
        let xOffset = labelW
        return (
          <g key={i}>
            <text x={labelW - 10} y={y + barH / 2 + 4} textAnchor="end" fill={DASH.text} fontSize="11">{d.rowLabel}</text>
            <rect x={labelW} y={y} width={chartW} height={barH} rx={4} fill={DASH.barMuted} opacity={0.15} />
            {d.segments.map((seg, j) => {
              const w = maxVal > 0 ? (seg / maxVal) * chartW : 0
              const sx = xOffset
              xOffset += w
              return (
                <g key={j}>
                  <rect x={sx} y={y} width={Math.max(w, 0)} height={barH} rx={j === 0 ? 4 : 0} fill={colors[j] || DASH.gold} />
                  {w > 25 && (
                    <text x={sx + w / 2} y={y + barH / 2 + 4} textAnchor="middle" fill={DASH.textWhite} fontSize="9" fontWeight="600">{seg}</text>
                  )}
                </g>
              )
            })}
            <text x={labelW + chartW + 8} y={y + barH / 2 + 4} fill={DASH.textWhite} fontSize="12" fontWeight="700">{d.total.toLocaleString()}</text>
            {d.trend && (
              <text x={labelW + chartW + 60} y={y + barH / 2 + 4} fill={d.trend === 'up' ? DASH.trendUp : d.trend === 'down' ? DASH.trendDown : DASH.trendNeutral} fontSize="11" fontWeight="700">
                {d.trend === 'up' ? '↑' : d.trend === 'down' ? '↓' : '↕'}
              </text>
            )}
          </g>
        )
      })}
      {/* Legend */}
      <g transform={`translate(${labelW}, ${data.length * rowH + 20})`}>
        {labels.map((l, i) => {
          const x = i * (width / labels.length - 10)
          return (
            <g key={i}>
              <rect x={x} y={0} width={12} height={12} rx={2} fill={colors[i]} />
              <text x={x + 16} y={10} fill={DASH.label} fontSize="10">{l}</text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

// ─── PieChart ────────────────────────────────────────────────────────────────
export function PieChart({ segments, size = 200, donut = false }: {
  segments: { label: string; value: number; color: string }[]
  size?: number
  donut?: boolean
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  if (total === 0) return null
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 10
  const innerR = donut ? r * 0.55 : 0

  let startAngle = -90

  function describeArc(startA: number, endA: number, outerR: number, innerRadius: number) {
    const startRad = (startA * Math.PI) / 180
    const endRad = (endA * Math.PI) / 180
    const x1 = cx + outerR * Math.cos(startRad)
    const y1 = cy + outerR * Math.sin(startRad)
    const x2 = cx + outerR * Math.cos(endRad)
    const y2 = cy + outerR * Math.sin(endRad)
    const largeArc = endA - startA > 180 ? 1 : 0

    if (innerRadius === 0) {
      return `M ${cx} ${cy} L ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} Z`
    }
    const ix1 = cx + innerRadius * Math.cos(endRad)
    const iy1 = cy + innerRadius * Math.sin(endRad)
    const ix2 = cx + innerRadius * Math.cos(startRad)
    const iy2 = cy + innerRadius * Math.sin(startRad)
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const angle = (seg.value / total) * 360
        const path = describeArc(startAngle, startAngle + angle, r, innerR)
        startAngle += angle
        return <path key={i} d={path} fill={seg.color} stroke={DASH.cardBg} strokeWidth={1} />
      })}
    </svg>
  )
}

// ─── LineChart ───────────────────────────────────────────────────────────────
export function LineChart({ series, xLabels, width = 600, height = 300, yMax, yTicks = 5 }: {
  series: { data: number[]; color: string; label: string; dashed?: boolean; dotted?: boolean }[]
  xLabels: string[]
  width?: number
  height?: number
  yMax?: number
  yTicks?: number
}) {
  const padding = { top: 30, right: 30, bottom: 50, left: 55 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const allValues = series.flatMap(s => s.data)
  const maxY = yMax || Math.max(...allValues)
  const yStep = Math.ceil(maxY / yTicks)

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {/* Y gridlines */}
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const y = padding.top + chartH - (i * yStep / (yStep * yTicks)) * chartH
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={DASH.cardBorder} strokeWidth={1} strokeDasharray="4,4" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill={DASH.muted} fontSize="10">{(i * yStep).toLocaleString()}</text>
          </g>
        )
      })}
      {/* X labels */}
      {xLabels.map((label, i) => {
        const x = padding.left + (i / Math.max(xLabels.length - 1, 1)) * chartW
        return (
          <text key={i} x={x} y={height - 12} textAnchor="middle" fill={DASH.label} fontSize="10">{label}</text>
        )
      })}
      {/* Vertical grid */}
      {xLabels.map((_, i) => {
        const x = padding.left + (i / Math.max(xLabels.length - 1, 1)) * chartW
        return <line key={i} x1={x} y1={padding.top} x2={x} y2={padding.top + chartH} stroke={DASH.cardBorder} strokeWidth={1} strokeDasharray="4,4" />
      })}
      {/* Series */}
      {series.map((s, si) => {
        const points = s.data.map((v, i) => {
          const x = padding.left + (i / Math.max(s.data.length - 1, 1)) * chartW
          const y = padding.top + chartH - (v / (yStep * yTicks)) * chartH
          return { x, y }
        })
        const polyline = points.map(p => `${p.x},${p.y}`).join(' ')
        return (
          <g key={si}>
            <polyline
              points={polyline}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeDasharray={s.dashed ? '8,4' : s.dotted ? '2,4' : 'none'}
            />
            {points.map((p, pi) => (
              <circle key={pi} cx={p.x} cy={p.y} r={s.dashed ? 0 : 4} fill={s.color} stroke={DASH.cardBg} strokeWidth={2} />
            ))}
          </g>
        )
      })}
      {/* Legend */}
      <g transform={`translate(${padding.left}, ${height - 32})`}>
        {series.map((s, i) => {
          const x = i * 150
          return (
            <g key={i}>
              <line x1={x} y1={0} x2={x + 20} y2={0} stroke={s.color} strokeWidth={3} strokeDasharray={s.dashed ? '6,3' : 'none'} />
              <circle cx={x + 10} cy={0} r={s.dashed ? 0 : 4} fill={s.color} />
              <text x={x + 26} y={4} fill={DASH.label} fontSize="10">{s.label}</text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

// ─── GaugeChart ──────────────────────────────────────────────────────────────
export function GaugeChart({ value, max = 100, label, size = 160, color = DASH.gold, sublabel }: {
  value: number; max?: number; label: string; size?: number; color?: string; sublabel?: string
}) {
  const cx = size / 2
  const cy = size / 2 + 10
  const r = size / 2 - 20
  const startAngle = Math.PI
  const endAngle = 2 * Math.PI
  const pct = Math.min(value / max, 1.5) // allow >100%
  const valueAngle = startAngle + pct * Math.PI

  const bgPath = `M ${cx + r * Math.cos(startAngle)} ${cy + r * Math.sin(startAngle)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(endAngle)} ${cy + r * Math.sin(endAngle)}`
  const largeArc = pct > 1 ? 1 : 0
  const valuePath = `M ${cx + r * Math.cos(startAngle)} ${cy + r * Math.sin(startAngle)} A ${r} ${r} 0 ${largeArc} 1 ${cx + r * Math.cos(valueAngle)} ${cy + r * Math.sin(valueAngle)}`

  const displayPct = max === 100 ? `${value}%` : `${Math.round((value / max) * 100)}%`

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        <path d={bgPath} fill="none" stroke={DASH.barMuted} strokeWidth={12} strokeLinecap="round" opacity={0.3} />
        <path d={valuePath} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
        <text x={10} y={cy + 20} fill={DASH.muted} fontSize="11">0%</text>
        <text x={size - 10} y={cy + 20} textAnchor="end" fill={DASH.muted} fontSize="11">100%</text>
        <text x={cx} y={cy} textAnchor="middle" fill={DASH.textWhite} fontSize="24" fontWeight="800">{displayPct}</text>
      </svg>
      <div style={{ color: color || DASH.label, fontSize: '14px', fontWeight: 700, marginTop: '-4px' }}>{label}</div>
      {sublabel && <div style={{ color: DASH.muted, fontSize: '11px', marginTop: '2px' }}>{sublabel}</div>}
    </div>
  )
}

// ─── AreaChart ────────────────────────────────────────────────────────────────
export function AreaChart({ series, xLabels, width = 500, height = 250, yMax }: {
  series: { data: number[]; color: string; label: string }[]
  xLabels: string[]
  width?: number
  height?: number
  yMax?: number
}) {
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const allValues = series.flatMap(s => s.data)
  const maxY = yMax || Math.max(...allValues)

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {series.map((s, si) => {
        const points = s.data.map((v, i) => {
          const x = padding.left + (i / Math.max(s.data.length - 1, 1)) * chartW
          const y = padding.top + chartH - (maxY > 0 ? (v / maxY) * chartH : 0)
          return `${x},${y}`
        })
        const areaPath = `M ${padding.left},${padding.top + chartH} ${points.join(' ')} L ${padding.left + chartW},${padding.top + chartH} Z`
        const linePath = points.join(' ')
        return (
          <g key={si}>
            <polygon points={areaPath.replace('M ', '').replace(' Z', '')} fill={s.color} opacity={0.25} />
            <polyline points={linePath} fill="none" stroke={s.color} strokeWidth={2} />
          </g>
        )
      })}
      {xLabels.map((l, i) => {
        const x = padding.left + (i / Math.max(xLabels.length - 1, 1)) * chartW
        return <text key={i} x={x} y={height - 10} textAnchor="middle" fill={DASH.label} fontSize="10">{l}</text>
      })}
    </svg>
  )
}

// ─── StackedGroupedBarChart ──────────────────────────────────────────────────
export function StackedGroupedBarChart({ data, colors, legendLabels, width = 600, height = 300 }: {
  data: { groupLabel: string; stacks: { segments: number[] }[] }[]
  colors: string[]
  legendLabels: string[]
  width?: number
  height?: number
}) {
  const padding = { top: 20, right: 20, bottom: 50, left: 40 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxVal = Math.max(...data.flatMap(g => g.stacks.map(s => s.segments.reduce((a, b) => a + b, 0))))
  const groupW = chartW / data.length
  const barW = groupW / (data[0]?.stacks.length || 1) * 0.7

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {/* Y gridlines */}
      {[0, 10, 20, 30, 40, 50, 60].map(v => {
        const y = padding.top + chartH - (v / 60) * chartH
        return (
          <g key={v}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={DASH.cardBorder} strokeWidth={1} strokeDasharray="3,3" />
            <text x={padding.left - 6} y={y + 4} textAnchor="end" fill={DASH.muted} fontSize="9">{v}</text>
          </g>
        )
      })}
      {data.map((g, gi) => {
        const gx = padding.left + gi * groupW
        return (
          <g key={gi}>
            {g.stacks.map((stack, si) => {
              const sx = gx + si * (barW + 2) + (groupW - (barW + 2) * g.stacks.length) / 2
              let yOffset = 0
              return (
                <g key={si}>
                  {stack.segments.map((seg, ci) => {
                    const h = maxVal > 0 ? (seg / maxVal) * chartH : 0
                    const y = padding.top + chartH - yOffset - h
                    yOffset += h
                    return <rect key={ci} x={sx} y={y} width={barW} height={h} fill={colors[ci]} />
                  })}
                </g>
              )
            })}
            <text x={gx + groupW / 2} y={height - 16} textAnchor="middle" fill={DASH.label} fontSize="9">{g.groupLabel}</text>
          </g>
        )
      })}
      {/* Legend */}
      <g transform={`translate(${padding.left}, ${height - 6})`}>
        {legendLabels.map((l, i) => (
          <g key={i}>
            <rect x={i * 110} y={-4} width={8} height={8} rx={1} fill={colors[i]} />
            <text x={i * 110 + 12} y={4} fill={DASH.label} fontSize="9">{l}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ─── FloorHeatmap (building outline with floors) ─────────────────────────────
export function FloorHeatmap({ floors, width = 200, height = 400 }: {
  floors: { label: string; occupancy: number }[]
  width?: number
  height?: number
}) {
  const floorH = height / floors.length
  const maxW = width * 0.85
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {floors.map((f, i) => {
        // Building narrows toward top
        const progress = i / floors.length
        const w = maxW * (0.6 + 0.4 * (1 - progress))
        const x = (width - w) / 2
        const y = i * floorH
        const opacityVal = 0.3 + f.occupancy * 0.007
        const color = f.occupancy > 25 ? DASH.gold : DASH.blue
        return (
          <g key={i}>
            <rect x={x} y={y + 1} width={w} height={floorH - 2} rx={2} fill={color} opacity={opacityVal} stroke={DASH.cardBorder} strokeWidth={0.5} />
            <text x={x + 8} y={y + floorH / 2 + 3} fill={DASH.text} fontSize="8" fontWeight="600">{f.label}</text>
            <text x={x + w - 8} y={y + floorH / 2 + 3} textAnchor="end" fill={DASH.text} fontSize="8">{f.occupancy}%</text>
          </g>
        )
      })}
    </svg>
  )
}
