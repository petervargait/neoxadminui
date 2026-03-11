'use client'

import React, { useState, useMemo } from 'react'
import {
  DASH,
  CardPanel,
  MonthSelector,
  FilterDropdown,
  GoldBarChart,
  HorizontalBarChart,
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard6ParkingRestaurant({ parkingSpaces, parkingBookings }: Props) {
  const [month, setMonth] = useState('February 2025')
  const [tenant, setTenant] = useState('')

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
          Parking Services
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

      {/* ════════════════════════════════════════════════════════════════════════
          PARKING MANAGEMENT (from Occupancy Services)
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: 0 }}>Parked cars by levels</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ padding: '6px 14px', backgroundColor: DASH.cardBg2, border: `1px solid ${DASH.cardBorder}`, borderRadius: '20px', color: DASH.label, fontSize: '12px', whiteSpace: 'nowrap' as const }}>Filter to company</div>
            <div style={{ padding: '6px 14px', backgroundColor: DASH.cardBg2, border: `1px solid ${DASH.cardBorder}`, borderRadius: '20px', color: DASH.label, fontSize: '12px', whiteSpace: 'nowrap' as const }}>February 2025</div>
          </div>
        </div>

        <div style={{ backgroundColor: DASH.cardBg, border: `1px solid ${DASH.cardBorder}`, borderRadius: '16px', padding: '24px' }}>
          <HorizontalBarChart
            data={[
              { label: 'B2 Level', value: 312, trend: 'up' as const },
              { label: 'B1 Level', value: 287, trend: 'up' as const },
              { label: 'Ground Level', value: 198, trend: 'down' as const },
              { label: 'Level 1', value: 145, trend: 'neutral' as const },
            ]}
            width={700}
            barColor={DASH.gold}
            showTrend={true}
          />
        </div>
      </div>

    </div>
  )
}
