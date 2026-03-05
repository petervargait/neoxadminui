'use client'

import React, { useState, useMemo } from 'react'
import {
  DASH,
  TrendArrow,
  CardPanel,
  SectionHeader,
  DashboardHeader,
  MonthSelector,
  LineChart,
  GoldBarChart,
} from '../charts/DashboardCharts'
import { ParkingSpace, ParkingBooking, Space } from '../../context/GlobalStateContext'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  parkingSpaces: ParkingSpace[]
  parkingBookings: ParkingBooking[]
  spaces: Space[]
}

// ─── Small inline KPI for the left column ────────────────────────────────────
function ParkingKPIRow({
  value,
  unit,
  trend,
  label,
}: {
  value: string | number
  unit?: string
  trend: 'up' | 'down'
  label: string
}) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${DASH.cardBorder2}`,
        paddingBottom: '12px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ color: DASH.textWhite, fontSize: '26px', fontWeight: 800 }}>{value}</span>
        {unit && (
          <span style={{ color: DASH.textWhite, fontSize: '16px', fontWeight: 700 }}>{unit}</span>
        )}
        <TrendArrow direction={trend} size={16} />
      </div>
      <div style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.35, marginTop: '2px' }}>
        {label}
      </div>
    </div>
  )
}

// ─── Highlighted ratio badge ──────────────────────────────────────────────────
function RatioBadge({ pct, label }: { pct: string; label: string }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: DASH.cardBg2,
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '12px',
        padding: '14px 18px',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800 }}>{pct}</span>
        <TrendArrow direction="up" size={18} />
      </div>
      <div style={{ color: DASH.label, fontSize: '12px', marginTop: '4px', lineHeight: 1.3 }}>
        {label}
      </div>
    </div>
  )
}

// ─── Spot type icon row item ──────────────────────────────────────────────────
function SpotTypeItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span style={{ color: DASH.text, fontSize: '13px', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

// ─── Meeting/Workshop room card ───────────────────────────────────────────────
function RoomCard({
  roomName,
  highlighted,
  type,
}: {
  roomName: string
  highlighted: boolean
  type: 'popular' | 'least'
}) {
  const iconColor = type === 'popular' ? DASH.gold : DASH.red
  const bgColor = highlighted ? DASH.cardBg2 : 'transparent'
  const borderColor = highlighted ? DASH.cardBorder : 'transparent'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '16px 20px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        minWidth: '100px',
      }}
    >
      {/* Door icon SVG */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect
          x="3"
          y="2"
          width="30"
          height="32"
          rx="3"
          stroke={iconColor}
          strokeWidth="2"
          fill="none"
        />
        <rect x="6" y="6" width="24" height="24" rx="2" fill={iconColor} opacity="0.15" />
        {/* Door panels */}
        <line x1="18" y1="2" x2="18" y2="34" stroke={iconColor} strokeWidth="1.5" opacity="0.5" />
        {/* Handle */}
        <circle cx="24" cy="18" r="2" fill={iconColor} />
        <circle cx="12" cy="18" r="2" fill={iconColor} />
      </svg>
      <span
        style={{
          color: DASH.text,
          fontSize: '12px',
          fontWeight: 600,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {roomName}
      </span>
    </div>
  )
}

// ─── Vending machine icon ─────────────────────────────────────────────────────
function VendingIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="2" width="32" height="36" rx="4" stroke={DASH.gold} strokeWidth="2" fill="none" />
      <rect x="7" y="6" width="26" height="14" rx="2" fill={DASH.gold} opacity="0.2" />
      <rect x="7" y="22" width="26" height="10" rx="2" fill={DASH.gold} opacity="0.15" />
      <rect x="15" y="36" width="10" height="2" rx="1" fill={DASH.gold} opacity="0.5" />
      <rect x="18" y="14" width="4" height="6" rx="1" fill={DASH.gold} opacity="0.6" />
    </svg>
  )
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function Dashboard4EmployeeServices({
  parkingSpaces,
  parkingBookings,
  spaces,
}: Props) {
  const [selectedMonth, setSelectedMonth] = useState('February 2025')

  // ── Derived parking stats ──────────────────────────────────────────────────
  const parkingStats = useMemo(() => {
    const totalSpaces = parkingSpaces.length || 731
    const occupiedSpaces = parkingSpaces.filter((s) => s.status === 'occupied').length
    const visitorSpaces = parkingSpaces.filter((s) => s.isReservedForVisitor).length || 30
    const carSpaces =
      parkingSpaces.filter((s) => !s.isReservedForVisitor).length || 665
    const bikeSpaces = 36

    return {
      totalSpaces,
      occupiedSpaces: occupiedSpaces || 731,
      visitorSpaces,
      carSpaces,
      bikeSpaces,
    }
  }, [parkingSpaces])

  // ── Parking bar chart data ─────────────────────────────────────────────────
  const parkingBarData = [
    { label: 'Fix pass', value: 308 },
    { label: 'Occasional car', value: 876 },
    { label: 'Occasional bike', value: 80 },
    { label: 'Bicycle storage', value: 80 },
  ]
  const parkingUsedData = [
    { label: 'Fix pass', value: 100 },
    { label: 'Occasional car', value: 680 },
    { label: 'Occasional bike', value: 60 },
    { label: 'Bicycle storage', value: 60 },
  ]

  // ── Meeting rooms derived from spaces ─────────────────────────────────────
  const meetingRooms = useMemo(
    () => spaces.filter((s) => s.type === 'meeting-room' || s.type === 'conference-room'),
    [spaces]
  )
  const availableMeetingRooms = meetingRooms.length || 3567

  // ── Meeting line chart data ────────────────────────────────────────────────
  const meetingLineData = [80, 91, 62, 50, 22]
  const meetingXLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  return (
    <div
      style={{
        backgroundColor: DASH.pageBg,
        minHeight: '100vh',
        padding: '32px 28px',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <DashboardHeader title="Employee services">
        <MonthSelector value={selectedMonth} onChange={setSelectedMonth} />
      </DashboardHeader>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 – PARKING
      ══════════════════════════════════════════════════════════════════════════ */}
      <CardPanel style={{ marginBottom: '24px' }}>
        <SectionHeader title="Parking" />

        <div style={{ display: 'flex', gap: '24px' }}>
          {/* ── Left KPI column ─────────────────────────────────────────────── */}
          <div style={{ minWidth: '200px', maxWidth: '210px', flexShrink: 0 }}>
            <ParkingKPIRow
              value={parkingStats.occupiedSpaces.toLocaleString()}
              trend="up"
              label={`Total used spots out of ${parkingStats.totalSpaces.toLocaleString()} spots`}
            />
            <ParkingKPIRow value="5" unit="h" trend="down" label="Avg. daily booking" />
            <ParkingKPIRow value="116" trend="down" label="Avg. daily visitor booking" />
            <ParkingKPIRow
              value="20"
              trend="down"
              label="Haven't used their fix pass parking spot in less than 30 days"
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '26px', fontWeight: 800 }}>12</span>
                <TrendArrow direction="down" size={16} />
              </div>
              <div
                style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.35, marginTop: '2px' }}
              >
                Haven&apos;t used their fix pass parking spot in more than 30 days
              </div>
            </div>
          </div>

          {/* ── Right section ─────────────────────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Top: ratio badges */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <RatioBadge pct="67%" label="Ratio of booked hours vs. bookable hours" />
              <RatioBadge pct="73%" label="Daily usage ratio" />
            </div>

            {/* Middle: spot type icons */}
            <div
              style={{
                display: 'flex',
                gap: '32px',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '12px 16px',
                backgroundColor: DASH.cardBg2,
                borderRadius: '10px',
                border: `1px solid ${DASH.cardBorder2}`,
              }}
            >
              <SpotTypeItem icon="🚗" label={`${parkingStats.visitorSpaces} spot for visitors`} />
              <SpotTypeItem icon="🚐" label={`${parkingStats.carSpaces} spots`} />
              <SpotTypeItem icon="🚲" label={`${parkingStats.bikeSpaces} spots`} />
            </div>

            {/* Ratio of bookings chart */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: DASH.text, fontSize: '15px', fontWeight: 700 }}>
                  Ratio of bookings
                </span>
                {/* Legend */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        backgroundColor: DASH.gold,
                      }}
                    />
                    <span style={{ color: DASH.label, fontSize: '11px' }}>Available spots</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        backgroundColor: DASH.barWhite,
                      }}
                    />
                    <span style={{ color: DASH.label, fontSize: '11px' }}>Used spots</span>
                  </div>
                </div>
              </div>
              <GoldBarChart
                data={parkingBarData}
                comparisonData={parkingUsedData}
                width={560}
                height={200}
                barColor={DASH.gold}
                showValues={true}
              />
            </div>
          </div>
        </div>
      </CardPanel>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 – MEETINGS SERVICES
      ══════════════════════════════════════════════════════════════════════════ */}
      <CardPanel style={{ marginBottom: '24px' }}>
        <SectionHeader title="Meetings services" />

        {/* Sub-header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}
        >
          <div>
            <div
              style={{
                color: DASH.text,
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              Average daily meeting room usage ratio in the building from 8:00-17:00
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📅</span>
              <span style={{ color: DASH.label, fontSize: '13px' }}>
                Available meeting rooms:{' '}
                <span style={{ color: DASH.text, fontWeight: 600 }}>
                  {availableMeetingRooms.toLocaleString()}
                </span>
              </span>
            </div>
          </div>

          {/* Total hours badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: DASH.cardBg2,
              border: `1px solid ${DASH.cardBorder}`,
              borderRadius: '12px',
              padding: '12px 20px',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '24px' }}>🕐</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>
                  5 265
                </span>
                <TrendArrow direction="down" size={14} />
              </div>
              <div style={{ color: DASH.label, fontSize: '12px', marginTop: '2px' }}>
                Total hours
              </div>
            </div>
          </div>
        </div>

        {/* Line chart */}
        <LineChart
          series={[
            {
              data: meetingLineData,
              color: DASH.gold,
              label: 'Usage ratio',
            },
          ]}
          xLabels={meetingXLabels}
          width={700}
          height={300}
          yMax={100}
          yTicks={5}
        />
      </CardPanel>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 – MOST / LEAST POPULAR ROOMS
      ══════════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px',
        }}
      >
        {/* Most popular */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: DASH.text, fontSize: '18px', fontWeight: 700, lineHeight: 1.25 }}>
              Most popular
            </div>
            <div style={{ color: DASH.text, fontSize: '18px', fontWeight: 700, lineHeight: 1.25 }}>
              Meeting &amp; Workshop rooms
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['12H. 001.M', '2B. 101.W', '25H. 001.W'].map((room) => (
              <RoomCard key={room} roomName={room} highlighted={false} type="popular" />
            ))}
          </div>
        </div>

        {/* Least popular */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: DASH.text, fontSize: '18px', fontWeight: 700, lineHeight: 1.25 }}>
              Least popular
            </div>
            <div style={{ color: DASH.text, fontSize: '18px', fontWeight: 700, lineHeight: 1.25 }}>
              Meeting &amp; Workshop rooms
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['12H. 001.M', '2B. 101.W', '25H. 001.W'].map((room, idx) => (
              <RoomCard key={room + idx} roomName={room} highlighted={true} type="least" />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 – VENDING MACHINES
      ══════════════════════════════════════════════════════════════════════════ */}
      <CardPanel>
        <SectionHeader title="Vending machines" />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '40px' }}>
          {/* KPI: total sold items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <VendingIcon size={44} />
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800 }}>
                  1732
                </span>
                <TrendArrow direction="up" size={16} />
              </div>
              <div style={{ color: DASH.label, fontSize: '12px', marginTop: '2px' }}>
                Total number of sold items
              </div>
            </div>
          </div>

          {/* KPI: total value */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Money icon */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect
                x="4"
                y="10"
                width="36"
                height="24"
                rx="5"
                stroke={DASH.gold}
                strokeWidth="2"
                fill="none"
              />
              <circle cx="22" cy="22" r="6" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
              <circle cx="22" cy="22" r="2.5" fill={DASH.gold} opacity="0.6" />
              <circle cx="8" cy="16" r="2" fill={DASH.gold} opacity="0.4" />
              <circle cx="36" cy="28" r="2" fill={DASH.gold} opacity="0.4" />
            </svg>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800 }}>
                  1 234 567 Ft
                </span>
                <TrendArrow direction="up" size={16} />
              </div>
              <div style={{ color: DASH.label, fontSize: '12px', marginTop: '2px' }}>
                Total value of sold items
              </div>
            </div>
          </div>

          {/* TOP 3 items */}
          <div style={{ marginLeft: 'auto' }}>
            <div
              style={{
                color: DASH.text,
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              TOP 3 sold items
            </div>
            {[
              '1. Varta AAA battery',
              '2. Blue pen',
              '3. Apple earphones with cable',
            ].map((item) => (
              <div
                key={item}
                style={{ color: DASH.label, fontSize: '13px', lineHeight: '1.8' }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </CardPanel>
    </div>
  )
}
