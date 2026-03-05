'use client'

import React, { useState } from 'react'
import { Building } from '../../context/GlobalStateContext'
import {
  DASH,
  CardPanel,
  MonthSelector,
  TrendArrow,
} from '../charts/DashboardCharts'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  buildings: Building[]
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
function SectionTitle({ title }: { title: string }) {
  return (
    <h2 style={{
      color: DASH.textWhite,
      fontSize: '22px',
      fontWeight: 800,
      margin: '0 0 18px 0',
    }}>
      {title}
    </h2>
  )
}

// ─── KPIBlock (used inside sections) ─────────────────────────────────────────
function KPIBlock({
  icon,
  value,
  unit,
  trend,
  label,
  description,
  style,
}: {
  icon: React.ReactNode
  value: string
  unit?: string
  trend: 'up' | 'down'
  label: string
  description?: string
  style?: React.CSSProperties
}) {
  return (
    <div style={{
      backgroundColor: DASH.cardBg2,
      border: `1px solid ${DASH.cardBorder2}`,
      borderRadius: '12px',
      padding: '18px 20px',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Icon */}
        <div style={{ fontSize: '26px', color: DASH.gold, lineHeight: 1, marginTop: '2px', flexShrink: 0 }}>
          {icon}
        </div>
        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
            <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>{value}</span>
            {unit && <span style={{ color: DASH.textWhite, fontSize: '16px', fontWeight: 700 }}>{unit}</span>}
            <TrendArrow direction={trend} size={16} />
          </div>
          <div style={{ color: DASH.label, fontSize: '13px', fontWeight: 400 }}>{label}</div>
          {description && (
            <div style={{ color: DASH.muted, fontSize: '12px', marginTop: '6px', lineHeight: 1.4 }}>
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── DonutChart (custom, for Heating & Cooling) ───────────────────────────────
function HeatingCoolingDonut() {
  const districtHeating = 103
  const heatPumps = 208.32
  const total = districtHeating + heatPumps
  const size = 260
  const cx = size / 2
  const cy = size / 2
  const outerR = 110
  const innerR = 62

  // Angles: start from top (-90 deg)
  const dhAngle = (districtHeating / total) * 360
  const hpAngle = (heatPumps / total) * 360

  function polarToXY(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    }
  }

  function arcPath(startDeg: number, endDeg: number, outerRadius: number, innerRadius: number) {
    const start = polarToXY(startDeg, outerRadius)
    const end = polarToXY(endDeg, outerRadius)
    const iStart = polarToXY(endDeg, innerRadius)
    const iEnd = polarToXY(startDeg, innerRadius)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return [
      `M ${start.x} ${start.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${large} 1 ${end.x} ${end.y}`,
      `L ${iStart.x} ${iStart.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${large} 0 ${iEnd.x} ${iEnd.y}`,
      'Z',
    ].join(' ')
  }

  // Segment 1: District heating (gold) — starts at 0
  const dhStart = 0
  const dhEnd = dhAngle
  // Segment 2: Heat pumps (off-white/cream) — follows
  const hpStart = dhEnd
  const hpEnd = dhEnd + hpAngle

  // Gap in degrees between segments for visual separation
  const gap = 2
  const dhPath = arcPath(dhStart + gap / 2, dhEnd - gap / 2, outerR, innerR)
  const hpPath = arcPath(hpStart + gap / 2, hpEnd - gap / 2, outerR, innerR)

  // Cream/off-white color matching screenshot
  const heatPumpColor = '#C8D8E8'

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
      <div style={{ position: 'relative', width: `${size + 160}px`, maxWidth: '100%' }}>
        {/* District heating label — top right */}
        <div style={{
          position: 'absolute',
          right: '0',
          top: '30px',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ color: DASH.textWhite, fontSize: '16px', fontWeight: 800 }}>103 MWh</span>
            <TrendArrow direction="up" size={13} />
          </div>
          <div style={{ color: DASH.label, fontSize: '12px', marginTop: '2px' }}>District heating</div>
        </div>

        {/* Heat pumps label — bottom left */}
        <div style={{
          position: 'absolute',
          left: '0',
          bottom: '30px',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ color: DASH.textWhite, fontSize: '16px', fontWeight: 800 }}>208,32 MWh</span>
            <TrendArrow direction="down" size={13} />
          </div>
          <div style={{ color: DASH.label, fontSize: '12px', marginTop: '2px' }}>Heat pumps</div>
        </div>

        {/* SVG Donut */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <path d={dhPath} fill={DASH.gold} />
            <path d={hpPath} fill={heatPumpColor} />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function BoltIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" fill={DASH.gold} />
    </svg>
  )
}

function SolarPanelIcon() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
      <rect x="1" y="1" width="24" height="16" rx="2" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      <line x1="9" y1="1" x2="9" y2="17" stroke={DASH.gold} strokeWidth="1" />
      <line x1="17" y1="1" x2="17" y2="17" stroke={DASH.gold} strokeWidth="1" />
      <line x1="1" y1="7" x2="25" y2="7" stroke={DASH.gold} strokeWidth="1" />
      <line x1="1" y1="13" x2="25" y2="13" stroke={DASH.gold} strokeWidth="1" />
      <line x1="13" y1="17" x2="13" y2="22" stroke={DASH.gold} strokeWidth="1.5" />
      <line x1="8" y1="22" x2="18" y2="22" stroke={DASH.gold} strokeWidth="1.5" />
    </svg>
  )
}

function ThermometerIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
      <rect x="8" y="1" width="6" height="16" rx="3" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      <rect x="9.5" y="2.5" width="3" height="10" rx="1.5" fill={DASH.gold} />
      <circle cx="11" cy="21" r="4" fill={DASH.gold} />
    </svg>
  )
}

function SoundIcon() {
  return (
    <svg width="26" height="24" viewBox="0 0 26 24" fill="none">
      <circle cx="13" cy="10" r="6" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      <circle cx="13" cy="10" r="2.5" fill={DASH.gold} />
      <ellipse cx="13" cy="20" rx="5" ry="3" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      <line x1="10" y1="16" x2="8" y2="22" stroke={DASH.gold} strokeWidth="1.5" />
      <line x1="16" y1="16" x2="18" y2="22" stroke={DASH.gold} strokeWidth="1.5" />
    </svg>
  )
}

function ChemIcon() {
  return (
    <svg width="24" height="26" viewBox="0 0 24 26" fill="none">
      <path d="M8 2V12L2 22H22L16 12V2" stroke={DASH.gold} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <line x1="7" y1="2" x2="17" y2="2" stroke={DASH.gold} strokeWidth="1.5" />
      <circle cx="9" cy="18" r="1.5" fill={DASH.gold} />
      <circle cx="15" cy="15" r="1.5" fill={DASH.gold} />
    </svg>
  )
}

function AirIcon() {
  return (
    <svg width="26" height="24" viewBox="0 0 26 24" fill="none">
      <path d="M2 8C2 8 6 5 10 8C14 11 18 8 22 8" stroke={DASH.gold} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M2 13C2 13 6 10 10 13C14 16 18 13 22 13" stroke={DASH.gold} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M2 18C2 18 6 15 10 18C14 21 18 18 22 18" stroke={DASH.gold} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function WaterDropIcon() {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      <path d="M11 2C11 2 2 12 2 18C2 23 6 26 11 26C16 26 20 23 20 18C20 12 11 2 11 2Z" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      <path d="M11 6C11 6 5 13 5 18C5 21.3 7.7 23.5 11 23.5" stroke={DASH.gold} strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      <path d="M11 2C7 2 4 5 4 9C4 12.5 6 14.5 7.5 16.5V19H14.5V16.5C16 14.5 18 12.5 18 9C18 5 15 2 11 2Z" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      <line x1="7.5" y1="21" x2="14.5" y2="21" stroke={DASH.gold} strokeWidth="1.5" />
      <line x1="8.5" y1="23.5" x2="13.5" y2="23.5" stroke={DASH.gold} strokeWidth="1.5" />
      <line x1="11" y1="6" x2="11" y2="10" stroke={DASH.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard2OfficeBuilding({ buildings }: Props) {
  const [month, setMonth] = useState('February 2025')

  return (
    <div style={{
      backgroundColor: DASH.pageBg,
      minHeight: '100vh',
      padding: '32px 36px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Top bar: title + month selector ── */}
      <div style={{ marginBottom: '24px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{
            color: DASH.textWhite,
            fontSize: '32px',
            fontWeight: 900,
            margin: 0,
          }}>
            Office building
          </h1>
          <MonthSelector value={month} onChange={setMonth} />
        </div>
      </div>

      {/* ── Overall up-trend arrow (centered, above Electricity) ── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <span style={{ color: DASH.trendDown, fontSize: '28px', fontWeight: 900 }}>↑</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ELECTRICITY SECTION
      ═══════════════════════════════════════════════════════════ */}
      <CardPanel style={{ marginBottom: '32px' }}>
        <SectionTitle title="Electricity" />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
        }}>
          {/* Card 1: Electricity consumed */}
          <KPIBlock
            icon={<BoltIcon />}
            value="2783,98"
            unit="MWh"
            trend="up"
            label="Electricity consumed"
          />

          {/* Card 2: Electricity generated */}
          <KPIBlock
            icon={<SolarPanelIcon />}
            value="18,98"
            unit="MWh"
            trend="down"
            label="Electricity generated"
          />

          {/* Card 3: Self-sufficiency */}
          <KPIBlock
            icon={<span style={{ fontSize: '22px' }}>⚡</span>}
            value="8,98"
            unit="%"
            trend="up"
            label="Self-sufficiency"
            description="Calculated from generated and consumed electricity"
          />
        </div>
      </CardPanel>

      {/* ═══════════════════════════════════════════════════════════
          INDOOR CLIMATE SECTION
      ═══════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '32px' }}>
        <SectionTitle title="Indoor climate" />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          {/* Card 1: Temperature */}
          <KPIBlock
            icon={<ThermometerIcon />}
            value="23"
            unit="°C"
            trend="up"
            label="Avg. office temperature"
            description="Office temperature can range between 18°C and 24°C."
          />

          {/* Card 2: Noise */}
          <KPIBlock
            icon={<SoundIcon />}
            value="21"
            unit="dB"
            trend="up"
            label="Avg. noise in the office"
            description="An ideal office environment has about 50 dB noise."
          />

          {/* Card 3: TVOC */}
          <KPIBlock
            icon={<ChemIcon />}
            value="4,2"
            unit="mg / m³"
            trend="down"
            label="TVOC (Total Volatile Organic Compounds)"
            description="It indicates the level of VOCs present, which can impact human health. A higher score indicates higher VOC levels in indoor air."
          />

          {/* Card 4: AQI */}
          <KPIBlock
            icon={<AirIcon />}
            value="1,3"
            trend="down"
            label="AQI (Air Quality Index)"
            description="It measures the quality of indoor air by assessing pollutants and contaminants present in an enclosed space. A higher score indicates better air quality."
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FACILITY SECTION
      ═══════════════════════════════════════════════════════════ */}
      <CardPanel>
        <SectionTitle title="Facility" />

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

          {/* Left column: Water + Lighting stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '220px' }}>
            <KPIBlock
              icon={<WaterDropIcon />}
              value="18,98"
              unit="m3"
              trend="down"
              label="Water consumption"
            />
            <KPIBlock
              icon={<LightbulbIcon />}
              value="10"
              unit="h"
              trend="down"
              label="Avg. lighting used / day"
            />
          </div>

          {/* Right side: Heating & Cooling */}
          <div style={{ flex: 1 }}>
            <h3 style={{
              color: DASH.textWhite,
              fontSize: '20px',
              fontWeight: 800,
              margin: '0 0 10px 0',
            }}>
              Heating &amp; Cooling
            </h3>

            {/* Total line */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: DASH.label, fontSize: '15px' }}>Total:</span>
              <span style={{ color: DASH.textWhite, fontSize: '17px', fontWeight: 800 }}>290,38 MWh</span>
              <TrendArrow direction="down" size={14} />
            </div>

            {/* Donut chart with labels */}
            <HeatingCoolingDonut />
          </div>

        </div>
      </CardPanel>

    </div>
  )
}
