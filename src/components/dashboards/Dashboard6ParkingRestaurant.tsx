'use client'

import React, { useState, useMemo } from 'react'
import {
  DASH,
  CardPanel,
  MonthSelector,
  FilterDropdown,
  GoldBarChart,
} from '../charts/DashboardCharts'
import { ParkingSpace, ParkingBooking } from '../../context/GlobalStateContext'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  parkingSpaces: ParkingSpace[]
  parkingBookings: ParkingBooking[]
}

// ─── Arrow ────────────────────────────────────────────────────────────────────
function Arrow({ dir, size = 16 }: { dir: 'up' | 'down'; size?: number }) {
  const color = dir === 'up' ? DASH.trendUp : DASH.trendDown
  return <span style={{ color, fontSize: size, fontWeight: 700 }}>{dir === 'up' ? '↑' : '↓'}</span>
}

// ─── KPI Row item (stacked left side of parking card) ────────────────────────
function ParkingKPI({ value, unit, label, dir }: {
  value: string | number
  unit?: string
  label: string
  dir: 'up' | 'down'
}) {
  return (
    <div style={{
      backgroundColor: DASH.cardBg2,
      border: `1px solid ${DASH.cardBorder2}`,
      borderRadius: '12px',
      padding: '14px 18px',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '5px' }}>
        <span style={{ color: DASH.textWhite, fontSize: '26px', fontWeight: 800, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 600 }}>{unit}</span>}
        <Arrow dir={dir} size={18} />
      </div>
      <div style={{ color: DASH.label, fontSize: '12px', marginTop: '4px', lineHeight: 1.35 }}>{label}</div>
    </div>
  )
}

// ─── Badge (67% / 73% blocks) ─────────────────────────────────────────────────
function RatioBadge({ pct, label, dir }: { pct: string; label: string; dir: 'up' | 'down' }) {
  return (
    <div style={{
      backgroundColor: DASH.cardBg2,
      border: `1px solid ${DASH.cardBorder2}`,
      borderRadius: '12px',
      padding: '16px 20px',
      textAlign: 'center',
      flex: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
        <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800 }}>{pct}</span>
        <Arrow dir={dir} size={18} />
      </div>
      <div style={{ color: DASH.label, fontSize: '12px', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

// ─── Vehicle Icon Row ─────────────────────────────────────────────────────────
function VehicleIconRow({ visitorSpots, carSpots, bikeSpots }: {
  visitorSpots: number
  carSpots: number
  bikeSpots: number
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0' }}>
      {/* Visitor/taxi icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="8" width="20" height="10" rx="3" stroke={DASH.gold} strokeWidth="2" fill="none" />
          <path d="M5 8l2-4h10l2 4" stroke={DASH.gold} strokeWidth="2" />
          <circle cx="7" cy="18" r="2" fill={DASH.gold} />
          <circle cx="17" cy="18" r="2" fill={DASH.gold} />
        </svg>
        <span style={{ color: DASH.text, fontSize: '13px' }}>
          <strong style={{ color: DASH.textWhite }}>{visitorSpots}</strong> spot for visitors
        </span>
      </div>
      {/* Car icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 11l2-5h14l2 5" stroke={DASH.gold} strokeWidth="2" />
          <rect x="2" y="11" width="20" height="7" rx="2" stroke={DASH.gold} strokeWidth="2" fill="none" />
          <circle cx="7" cy="18" r="2" fill={DASH.gold} />
          <circle cx="17" cy="18" r="2" fill={DASH.gold} />
        </svg>
        <span style={{ color: DASH.text, fontSize: '13px' }}>
          <strong style={{ color: DASH.textWhite }}>{carSpots}</strong> spots
        </span>
      </div>
      {/* Bike icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="17" r="3" stroke={DASH.gold} strokeWidth="2" fill="none" />
          <circle cx="18" cy="17" r="3" stroke={DASH.gold} strokeWidth="2" fill="none" />
          <path d="M6 17l4-8h4l4 8" stroke={DASH.gold} strokeWidth="2" strokeLinejoin="round" />
          <path d="M10 9l2-3" stroke={DASH.gold} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ color: DASH.text, fontSize: '13px' }}>
          <strong style={{ color: DASH.textWhite }}>{bikeSpots}</strong> spots
        </span>
      </div>
    </div>
  )
}

// ─── Restaurant Line Chart (custom, matching screenshot closely) ──────────────
function RestaurantLineChart() {
  const width = 700
  const height = 320
  const padding = { top: 30, right: 30, bottom: 60, left: 55 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const yMax = 500
  const yTicks = [0, 100, 200, 300, 400, 500]
  const xLabels = ['Feb. 14.', 'Feb. 15.', 'Feb. 16.', 'Feb. 17.', 'Feb. 18.', 'Feb. 19.', 'Feb. 20.']

  // Data series (values at each x label index 0-6)
  const todayData    = [240, 430, 470, null, null, null, null] as (number | null)[]
  const predData     = [350, 400, 480, 460, 430, 370, 340] as (number | null)[]
  const avgData      = [215, 280, 300, 310, 295, 285, 290] as (number | null)[]

  function xPos(i: number) {
    return padding.left + (i / (xLabels.length - 1)) * chartW
  }
  function yPos(v: number) {
    return padding.top + chartH - (v / yMax) * chartH
  }

  // Build polyline points string from data (skip nulls, create segments)
  function buildPolylineSegments(data: (number | null)[]): string[][] {
    const segments: string[][] = []
    let current: string[] = []
    data.forEach((v, i) => {
      if (v !== null) {
        current.push(`${xPos(i)},${yPos(v)}`)
      } else {
        if (current.length > 0) {
          segments.push(current)
          current = []
        }
      }
    })
    if (current.length > 0) segments.push(current)
    return segments
  }

  const todaySegments = buildPolylineSegments(todayData)
  const predSegments = buildPolylineSegments(predData)
  const avgSegments = buildPolylineSegments(avgData)

  // Dot for today at last non-null point
  const todayLastIdx: number = todayData.reduce<number>((last, v, i) => (v !== null ? i : last), -1)

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMinYMid meet"
      style={{ display: 'block' }}
    >
      {/* Y grid lines + labels */}
      {yTicks.map(v => {
        const y = yPos(v)
        return (
          <g key={v}>
            <line
              x1={padding.left} y1={y}
              x2={width - padding.right} y2={y}
              stroke={DASH.cardBorder}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill={DASH.muted} fontSize="11">{v}</text>
          </g>
        )
      })}

      {/* Vertical grid lines + x labels */}
      {xLabels.map((label, i) => {
        const x = xPos(i)
        return (
          <g key={i}>
            <line
              x1={x} y1={padding.top}
              x2={x} y2={padding.top + chartH}
              stroke={DASH.cardBorder}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <text x={x} y={height - 38} textAnchor="middle" fill={DASH.label} fontSize="11">{label}</text>
          </g>
        )
      })}

      {/* Average series - blue dashed */}
      {avgSegments.map((seg, si) => (
        <polyline
          key={`avg-${si}`}
          points={seg.join(' ')}
          fill="none"
          stroke={DASH.lineAverage}
          strokeWidth={2.5}
          strokeDasharray="8,5"
        />
      ))}

      {/* Prediction series - dark dashed */}
      {predSegments.map((seg, si) => (
        <polyline
          key={`pred-${si}`}
          points={seg.join(' ')}
          fill="none"
          stroke={DASH.linePrediction}
          strokeWidth={2.5}
          strokeDasharray="8,5"
        />
      ))}

      {/* Today series - gold solid with endpoint dot */}
      {todaySegments.map((seg, si) => (
        <polyline
          key={`today-${si}`}
          points={seg.join(' ')}
          fill="none"
          stroke={DASH.lineToday}
          strokeWidth={3}
        />
      ))}
      {/* Large dot at the last today data point */}
      {todayLastIdx >= 0 && todayData[todayLastIdx] !== null && (
        <circle
          cx={xPos(todayLastIdx)}
          cy={yPos(todayData[todayLastIdx] as number)}
          r={8}
          fill={DASH.lineToday}
          stroke={DASH.cardBg}
          strokeWidth={2}
        />
      )}

      {/* Legend */}
      <g transform={`translate(${padding.left + chartW / 2 - 200}, ${height - 20})`}>
        {/* Today */}
        <circle cx={10} cy={0} r={6} fill={DASH.lineToday} />
        <text x={22} y={4} fill={DASH.label} fontSize="12">Today</text>
        {/* Prediction */}
        <line x1={130} y1={0} x2={155} y2={0} stroke={DASH.linePrediction} strokeWidth={2.5} strokeDasharray="6,3" />
        <circle cx={142} cy={0} r={5} fill={DASH.linePrediction} />
        <text x={162} y={4} fill={DASH.label} fontSize="12">Prediction</text>
        {/* Average */}
        <line x1={290} y1={0} x2={315} y2={0} stroke={DASH.lineAverage} strokeWidth={2.5} strokeDasharray="6,3" />
        <circle cx={302} cy={0} r={5} fill={DASH.lineAverage} />
        <text x={322} y={4} fill={DASH.label} fontSize="12">Average</text>
      </g>
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard6ParkingRestaurant({ parkingSpaces, parkingBookings }: Props) {
  const [month, setMonth] = useState('February 2025')
  const [tenant, setTenant] = useState('')
  const [dateRange] = useState('15.-22. February 2025')

  // ─── Derive parking KPIs from real data ───────────────────────────────────
  const totalSpots = parkingSpaces.length || 731
  const visitorSpots = parkingSpaces.filter(s => s.isReservedForVisitor).length || 30
  const bikeSpots = parkingSpaces.filter(s => s.notes?.toLowerCase().includes('bike') || s.zone?.toLowerCase().includes('bike')).length || 36
  const carSpots = totalSpots - visitorSpots - bikeSpots || 665

  // Ratio of booked hours vs bookable: use booking count relative to capacity
  const activeBookings = parkingBookings.filter(b => b.status === 'active' || b.status === 'completed').length
  const bookedRatioPct = activeBookings > 0
    ? Math.min(Math.round((activeBookings / (totalSpots * 0.9)) * 100), 100)
    : 67
  const dailyUsageRatioPct = parkingSpaces.length > 0
    ? Math.min(Math.round((parkingSpaces.filter(s => s.status === 'occupied').length / parkingSpaces.length) * 100), 100)
    : 73

  // Ratio of bookings bar chart data (hardcoded to match screenshot)
  const ratioData = [
    { label: 'Fix pass',       value: 308 },
    { label: 'Occasional car', value: 876 },
    { label: 'Occasional bike', value: 80 },
    { label: 'Bicycle storage', value: 80 },
  ]
  const ratioUsed = [
    { label: 'Fix pass',       value: 100 },
    { label: 'Occasional car', value: 680 },
    { label: 'Occasional bike', value: 60 },
    { label: 'Bicycle storage', value: 60 },
  ]

  // Tenant options derived from data
  const tenantOptions = useMemo(() => {
    const ids = [...new Set([
      ...parkingSpaces.map(s => s.tenantId).filter(Boolean),
      ...parkingBookings.map(b => b.tenantId).filter(Boolean),
    ])] as string[]
    return ids.map(id => ({ value: id, label: id }))
  }, [parkingSpaces, parkingBookings])

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      backgroundColor: DASH.pageBg,
      color: DASH.text,
      padding: '32px 40px',
      width: '100%',
      minHeight: '100vh',
      boxSizing: 'border-box',
    }}>

      {/* ─── Header: Logo top-left, title top-right ─── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '36px',
      }}>
        <h1 style={{
          color: DASH.textWhite,
          fontSize: '38px',
          fontWeight: 800,
          margin: 0,
          letterSpacing: '-0.5px',
        }}>
          Employee services
        </h1>
      </div>

      {/* ─── Parking Section ─── */}
      <div style={{ marginBottom: '32px' }}>
        {/* Section header with filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800, margin: 0 }}>
            Parking
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <FilterDropdown
              label="Filter to tenant"
              value={tenant}
              options={tenantOptions}
              onChange={setTenant}
            />
            <MonthSelector value={month} onChange={setMonth} />
          </div>
        </div>

        <CardPanel>
          {/* Two-column: left KPIs | right content */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px' }}>

            {/* LEFT: Stacked KPI cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <ParkingKPI
                value={totalSpots}
                label={`Total used spots out of ${totalSpots} spots`}
                dir="up"
              />
              <ParkingKPI
                value="5"
                unit="h"
                label="Avg. daily booking"
                dir="down"
              />
              <ParkingKPI
                value={116}
                label="Avg. daily visitor booking"
                dir="down"
              />
              <ParkingKPI
                value={20}
                label={"Haven't used their fix pass\nparking spot in less than 30 days"}
                dir="down"
              />
              <ParkingKPI
                value={12}
                label={"Haven't used their fix pass\nparking spot in more than 30 days"}
                dir="down"
              />
            </div>

            {/* RIGHT: badges + vehicle icons + ratio chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Ratio badges row */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <RatioBadge
                  pct={`${bookedRatioPct}%`}
                  label="Ratio of booked hours vs. bookable hours"
                  dir="up"
                />
                <RatioBadge
                  pct={`${dailyUsageRatioPct}%`}
                  label="Daily usage ratio"
                  dir="up"
                />
              </div>

              {/* Vehicle type row */}
              <div style={{
                backgroundColor: DASH.cardBg2,
                border: `1px solid ${DASH.cardBorder2}`,
                borderRadius: '12px',
                padding: '10px 16px',
              }}>
                <VehicleIconRow
                  visitorSpots={visitorSpots}
                  carSpots={carSpots}
                  bikeSpots={bikeSpots}
                />
              </div>

              {/* Ratio of bookings bar chart */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                }}>
                  <span style={{ color: DASH.textWhite, fontSize: '15px', fontWeight: 700 }}>
                    Ratio of bookings
                  </span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: DASH.gold }} />
                      <span style={{ color: DASH.label, fontSize: '11px' }}>Available spots</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: DASH.barWhite }} />
                      <span style={{ color: DASH.label, fontSize: '11px' }}>Used spots</span>
                    </div>
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  <GoldBarChart
                    data={ratioData}
                    comparisonData={ratioUsed}
                    width={480}
                    height={220}
                    barColor={DASH.gold}
                    showValues={true}
                  />
                </div>
              </div>

            </div>
          </div>
        </CardPanel>
      </div>

      {/* ─── Restaurant Occupancy Section ─── */}
      <div>
        {/* Section header with date range selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800, margin: 0 }}>
            Restaurant ocupency
          </h2>
          <div>
            <select
              defaultValue={dateRange}
              style={{
                padding: '8px 16px',
                backgroundColor: DASH.cardBg,
                border: `1px solid ${DASH.cardBorder}`,
                borderRadius: '20px',
                color: DASH.text,
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '200px',
              }}
            >
              <option value="15.-22. February 2025">15.-22. February 2025</option>
              <option value="8.-15. February 2025">8.-15. February 2025</option>
              <option value="1.-8. February 2025">1.-8. February 2025</option>
            </select>
          </div>
        </div>

        <CardPanel>
          <RestaurantLineChart />
        </CardPanel>
      </div>

    </div>
  )
}
