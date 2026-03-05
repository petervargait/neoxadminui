'use client'

import React, { useState } from 'react'
import {
  DASH,
  CardPanel,
  LineChart,
  TrendArrow,
  MonthSelector,
} from '../charts/DashboardCharts'
import { Invitation } from '../../context/GlobalStateContext'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  invitations: Invitation[]
}

// ─── Weather Icons ────────────────────────────────────────────────────────────
function SunIcon({ size = 22, color = DASH.gold }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill={color} />
      <line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="4.9" y1="4.9" x2="7.1" y2="7.1" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="16.9" y1="16.9" x2="19.1" y2="19.1" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="4.9" y1="19.1" x2="7.1" y2="16.9" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="16.9" y1="7.1" x2="19.1" y2="4.9" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CloudIcon({ size = 22, color = DASH.label }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill={color} />
    </svg>
  )
}

function CloudSunIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="17" cy="7" r="3" fill={DASH.gold} />
      <line x1="17" y1="2" x2="17" y2="4" stroke={DASH.gold} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="10" x2="17" y2="12" stroke={DASH.gold} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="7" x2="14" y2="7" stroke={DASH.gold} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="7" x2="22" y2="7" stroke={DASH.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 13.5H6.5a4.5 4.5 0 1 0 .3 9H14a3.5 3.5 0 0 0 0-7z" fill={DASH.label} />
    </svg>
  )
}

function RainIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M16 9h-1.26A8 8 0 1 0 7 18h9a5 5 0 0 0 0-10z" fill={DASH.label} />
      <line x1="8" y1="19" x2="7" y2="22" stroke={DASH.cyan} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="19" x2="11" y2="22" stroke={DASH.cyan} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="19" x2="15" y2="22" stroke={DASH.cyan} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon({ size = 22, color = DASH.blue }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={color} />
    </svg>
  )
}

function ThermometerIcon({ size = 20, color = DASH.green }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5" />
      <circle cx="11.5" cy="18.5" r="2.5" fill={color} />
    </svg>
  )
}

// ─── Climate Metric Row ───────────────────────────────────────────────────────
function ClimateMetric({
  icon,
  value,
  unit,
  trend,
  label,
  description,
}: {
  icon: string
  value: string
  unit: string
  trend: 'up' | 'down'
  label: string
  description?: string
}) {
  return (
    <div style={{
      padding: '10px 0',
      borderBottom: `1px solid ${DASH.cardBorder}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>{value}</span>
            <span style={{ color: DASH.label, fontSize: '12px', fontWeight: 500 }}>{unit}</span>
            <TrendArrow direction={trend} size={13} />
          </div>
          <div style={{ color: DASH.label, fontSize: '12px', marginTop: '3px', fontWeight: 500 }}>{label}</div>
          {description && (
            <div style={{ color: DASH.muted, fontSize: '11px', marginTop: '2px', lineHeight: 1.4 }}>{description}</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Status Indicator ─────────────────────────────────────────────────────────
function StatusIndicator({
  icon,
  label,
  sublabel,
  active = false,
}: {
  icon: React.ReactNode
  label: string
  sublabel: string
  active?: boolean
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 12px',
      borderRadius: '10px',
      backgroundColor: active ? `${DASH.green}18` : `${DASH.cardBorder}40`,
      border: `1px solid ${active ? DASH.green : DASH.cardBorder}`,
      flex: 1,
      minWidth: 0,
    }}>
      {icon}
      <span style={{ color: active ? DASH.green : DASH.label, fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>{label}</span>
      <span style={{ color: DASH.muted, fontSize: '10px', textAlign: 'center' }}>{sublabel}</span>
    </div>
  )
}

// ─── Day Weather Card ─────────────────────────────────────────────────────────
function DayWeatherCard({
  day,
  icon,
  temperature,
  pollen,
  pollenLevel,
}: {
  day: string
  icon: React.ReactNode
  temperature: string
  pollen: string
  pollenLevel: 'Low' | 'Moderate' | 'High'
}) {
  const pollenColor =
    pollenLevel === 'High' ? DASH.red :
    pollenLevel === 'Moderate' ? DASH.orange :
    DASH.green

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      padding: '14px 8px',
      backgroundColor: DASH.cardBg2,
      borderRadius: '10px',
      border: `1px solid ${DASH.cardBorder2}`,
      flex: 1,
      minWidth: 0,
    }}>
      <span style={{ color: DASH.label, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{day}</span>
      {icon}
      <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 700 }}>{temperature}°C</span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: DASH.muted, fontSize: '10px' }}>Pollen</div>
        <div style={{ color: pollenColor, fontSize: '11px', fontWeight: 700 }}>{pollen}</div>
      </div>
    </div>
  )
}

// ─── Map Placeholder ──────────────────────────────────────────────────────────
function MapPlaceholder({ liveTraffic, onToggle }: { liveTraffic: boolean; onToggle: () => void }) {
  // Grid lines to suggest a map
  const gridLines = []
  for (let i = 1; i < 8; i++) {
    gridLines.push(
      <line key={`h${i}`} x1={0} y1={i * 30} x2={760} y2={i * 30} stroke="#2A3A50" strokeWidth="0.8" />,
      <line key={`v${i}`} x1={i * 95} y1={0} x2={i * 95} y2={240} stroke="#2A3A50" strokeWidth="0.8" />
    )
  }

  // Road-like paths
  const roads = [
    { d: 'M 0 80 L 760 95', stroke: '#1E3A5F', width: 8 },
    { d: 'M 0 160 L 760 155', stroke: '#1E3A5F', width: 8 },
    { d: 'M 190 0 L 185 240', stroke: '#1E3A5F', width: 8 },
    { d: 'M 380 0 L 380 240', stroke: '#1E3A5F', width: 8 },
    { d: 'M 570 0 L 575 240', stroke: '#1E3A5F', width: 8 },
    { d: 'M 50 0 L 100 240', stroke: '#162032', width: 5 },
    { d: 'M 260 0 L 270 240', stroke: '#162032', width: 5 },
    { d: 'M 470 0 L 460 240', stroke: '#162032', width: 5 },
    { d: 'M 650 0 L 660 240', stroke: '#162032', width: 5 },
    { d: 'M 0 40 L 760 45', stroke: '#162032', width: 4 },
    { d: 'M 0 120 L 760 118', stroke: '#162032', width: 4 },
    { d: 'M 0 200 L 760 198', stroke: '#162032', width: 4 },
    // Traffic highlight (orange = congestion)
    { d: 'M 0 80 L 260 88', stroke: liveTraffic ? '#F97316' : '#1E3A5F', width: 6 },
    { d: 'M 380 92 L 570 95', stroke: liveTraffic ? '#EF4444' : '#1E3A5F', width: 6 },
  ]

  // Block shapes for buildings
  const blocks = [
    [20, 10, 55, 25], [90, 15, 70, 20], [220, 10, 60, 25], [310, 12, 50, 22],
    [420, 8, 65, 28], [520, 14, 45, 22], [620, 10, 60, 25],
    [20, 105, 60, 40], [110, 110, 50, 30], [220, 100, 65, 45], [330, 108, 40, 28],
    [430, 102, 55, 42], [530, 106, 50, 35], [625, 104, 60, 38],
    [20, 170, 55, 35], [100, 175, 65, 30], [230, 168, 55, 38], [320, 172, 45, 30],
    [440, 170, 60, 35], [540, 168, 50, 32], [630, 173, 55, 30],
  ]

  return (
    <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#111C2E' }}>
      <svg width="100%" height="240" viewBox="0 0 760 240" preserveAspectRatio="xMidYMid slice">
        {/* Base fill */}
        <rect width="760" height="240" fill="#0B1525" />
        {/* Grid lines */}
        {gridLines}
        {/* Roads */}
        {roads.map((r, i) => (
          <path key={i} d={r.d} stroke={r.stroke} strokeWidth={r.width} fill="none" strokeLinecap="round" />
        ))}
        {/* Buildings */}
        {blocks.map((b, i) => (
          <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx="2" fill="#162032" stroke="#1E293B" strokeWidth="0.5" />
        ))}
        {/* Green areas */}
        <ellipse cx="340" cy="130" rx="25" ry="18" fill="#0D3320" opacity="0.7" />
        <ellipse cx="150" cy="50" rx="18" ry="12" fill="#0D3320" opacity="0.6" />
        <ellipse cx="600" cy="185" rx="22" ry="14" fill="#0D3320" opacity="0.6" />
        {/* Pin marker */}
        <circle cx="380" cy="120" r="10" fill={DASH.gold} opacity="0.9" />
        <circle cx="380" cy="120" r="5" fill={DASH.pageBg} />
        <line x1="380" y1="130" x2="380" y2="145" stroke={DASH.gold} strokeWidth="2" strokeLinecap="round" />
      </svg>
      {/* Live Traffic toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '6px 14px',
          backgroundColor: liveTraffic ? DASH.orange : DASH.cardBg,
          border: `1px solid ${liveTraffic ? DASH.orange : DASH.cardBorder}`,
          borderRadius: '16px',
          color: DASH.textWhite,
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: liveTraffic ? DASH.textWhite : DASH.muted,
          display: 'inline-block',
        }} />
        Live Traffic
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard10Wellbeing({ invitations }: Props) {
  const [indoorMonth, setIndoorMonth] = useState('February 2025')
  const [liveTraffic, setLiveTraffic] = useState(false)

  // ── Derive visitor counts from invitations for occupancy chart ────────────
  const dateLabels = ['15.02', '16.02', '17.02', '18.02', '19.02', '20.02', '21.02', '22.02']

  const visitorsTodayBase = [180, 420, 810, 1250, 1680, 1920, 2050, 1740]
  const visitorsPredBase  = [200, 450, 850, 1300, 1720, 1950, 2100, 1800]
  const todaySeries       = [320, 680, 1100, 1580, 1920, 2180, 2300, 2020]
  const predictionSeries  = [350, 700, 1150, 1600, 1960, 2200, 2320, 2060]

  // Scale today's visitor line slightly by invitation count
  const invCount = invitations.length
  const scaleFactor = invCount > 0 ? Math.min(1 + invCount / 500, 1.3) : 1
  const visitorsToday = visitorsTodayBase.map(v => Math.round(v * scaleFactor))
  const visitorsPred  = visitorsPredBase.map(v => Math.round(v * scaleFactor))

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: DASH.text,
      backgroundColor: DASH.pageBg,
      padding: '32px 40px',
      width: '100%',
      boxSizing: 'border-box' as const,
      minHeight: '100vh',
    }}>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
        <h1 style={{ color: DASH.textWhite, fontSize: '32px', fontWeight: 800, margin: 0, textAlign: 'right' }}>
          Wellbeing services
        </h1>
      </div>

      {/* ─── 1 & 2. Indoor + Outdoor Climate side by side ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
      <CardPanel>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700, margin: 0 }}>Indoor climate</h2>
          <MonthSelector value={indoorMonth} onChange={setIndoorMonth} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top: big temperature + badge + indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Temperature */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ThermometerIcon size={36} color={DASH.green} />
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: DASH.textWhite, fontSize: '56px', fontWeight: 900, lineHeight: 1 }}>20,5</span>
                  <span style={{ color: DASH.label, fontSize: '22px', fontWeight: 600, marginTop: '10px' }}>°C</span>
                </div>
                {/* Excellent badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: `${DASH.green}22`,
                  border: `1px solid ${DASH.green}`,
                  borderRadius: '20px',
                  padding: '4px 14px',
                  marginTop: '8px',
                }}>
                  <ThermometerIcon size={14} color={DASH.green} />
                  <span style={{ color: DASH.green, fontSize: '14px', fontWeight: 700 }}>Excellent</span>
                </div>
                <div style={{ color: DASH.muted, fontSize: '12px', marginTop: '6px' }}>Indoor air quality</div>
              </div>
            </div>

            {/* Status indicators */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <StatusIndicator
                icon={<CloudIcon size={18} color={DASH.green} />}
                label="Excellent"
                sublabel="Light breeze"
                active
              />
              <StatusIndicator
                icon={<SunIcon size={18} color={DASH.gold} />}
                label="Good"
                sublabel="Humidity"
              />
              <StatusIndicator
                icon={<MoonIcon size={18} color={DASH.blue} />}
                label="Quiet"
                sublabel="Noise level"
              />
            </div>
          </div>

          {/* Right: metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <ClimateMetric
              icon="🔊"
              value="21"
              unit="dB"
              trend="down"
              label="Avg. noise in the office"
            />
            <ClimateMetric
              icon="🌬️"
              value="1,3"
              unit=""
              trend="down"
              label="AQI (Air Quality Index)"
              description="Air quality index based on monitoring pollutants and particulates, using real-time sensors distributed throughout the office."
            />
            <ClimateMetric
              icon="🧪"
              value="4,2"
              unit="mg / m³"
              trend="down"
              label="TVOC (Total Volatile Organic Compounds)"
              description="Total volatile organic compound concentration detected by air quality sensors in the office environment."
            />
            <ClimateMetric
              icon="🔬"
              value="659"
              unit="micromol mol⁻¹"
              trend="down"
              label="Carbon Dioxide (CO2) level"
              description="Carbon dioxide concentration level measured in the office space during occupied hours."
            />
            <ClimateMetric
              icon="💨"
              value="9"
              unit="μg/m³"
              trend="down"
              label="PM2.5 level"
            />
          </div>
        </div>
      </CardPanel>

      {/* ─── 2. Outdoor Climate ─── */}
      <CardPanel>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700, margin: 0 }}>Outdoor climate</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Temperature */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <SunIcon size={36} color={DASH.orange} />
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: DASH.textWhite, fontSize: '56px', fontWeight: 900, lineHeight: 1 }}>29,5</span>
                  <span style={{ color: DASH.label, fontSize: '22px', fontWeight: 600, marginTop: '10px' }}>°C</span>
                </div>
                {/* Fair badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: `${DASH.orange}22`,
                  border: `1px solid ${DASH.orange}`,
                  borderRadius: '20px',
                  padding: '4px 14px',
                  marginTop: '8px',
                }}>
                  <SunIcon size={14} color={DASH.orange} />
                  <span style={{ color: DASH.orange, fontSize: '14px', fontWeight: 700 }}>Fair</span>
                </div>
                <div style={{ color: DASH.muted, fontSize: '12px', marginTop: '6px' }}>Outdoor air quality</div>
              </div>
            </div>

            {/* Status indicators */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <StatusIndicator
                icon={<SunIcon size={18} color={DASH.green} />}
                label="Good"
                sublabel="Temperature"
              />
              <StatusIndicator
                icon={<CloudIcon size={18} color={DASH.red} />}
                label="Poor"
                sublabel="Air quality"
              />
              <StatusIndicator
                icon={<span style={{ fontSize: '16px' }}>🔈</span>}
                label="Loud"
                sublabel="Noise level"
              />
            </div>
          </div>

          {/* Right: metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <ClimateMetric
              icon="🔊"
              value="52"
              unit="dB"
              trend="down"
              label="Avg. noise in the office"
            />
            <ClimateMetric
              icon="🌬️"
              value="5,7"
              unit=""
              trend="up"
              label="AQI (Air Quality Index)"
              description="Air quality index based on monitoring pollutants and particulates, using real-time outdoor sensors around the building perimeter."
            />
            <ClimateMetric
              icon="🧪"
              value="9,2"
              unit="mg / m³"
              trend="down"
              label="TVOC (Total Volatile Organic Compounds)"
              description="Total volatile organic compound concentration detected by outdoor air quality sensors near the building entrances."
            />
            <ClimateMetric
              icon="🔬"
              value="1048"
              unit="micromol mol⁻¹"
              trend="down"
              label="Carbon Dioxide (CO2) level"
              description="Carbon dioxide concentration level measured outside the building near pedestrian areas."
            />
            <ClimateMetric
              icon="💨"
              value="18"
              unit="μg/m³"
              trend="up"
              label="PM2.5 level"
            />
          </div>
        </div>
      </CardPanel>
      </div>

      {/* ─── 3. Traffic Around the Building ─── */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700, margin: 0 }}>Traffic around the building</h2>
        </div>
        <MapPlaceholder liveTraffic={liveTraffic} onToggle={() => setLiveTraffic(v => !v)} />
      </CardPanel>

      {/* ─── 4. Outdoor Weather Prediction ─── */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700, margin: 0 }}>Outdoor weather prediction</h2>
          <span style={{
            padding: '5px 14px',
            backgroundColor: DASH.cardBg2,
            border: `1px solid ${DASH.cardBorder}`,
            borderRadius: '20px',
            color: DASH.label,
            fontSize: '12px',
          }}>
            15–22. February 2025
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <DayWeatherCard day="Mon" icon={<SunIcon size={24} />} temperature="19.1" pollen="Moderate" pollenLevel="Moderate" />
          <DayWeatherCard day="Tue" icon={<CloudIcon size={24} />} temperature="15.3" pollen="Moderate" pollenLevel="Moderate" />
          <DayWeatherCard day="Wed" icon={<CloudSunIcon size={24} />} temperature="20.1" pollen="Moderate" pollenLevel="Moderate" />
          <DayWeatherCard day="Thu" icon={<RainIcon size={24} />} temperature="19.6" pollen="High" pollenLevel="High" />
          <DayWeatherCard day="Fri" icon={<CloudSunIcon size={24} />} temperature="19.2" pollen="Moderate" pollenLevel="Moderate" />
          <DayWeatherCard day="Sat" icon={<SunIcon size={24} />} temperature="23.6" pollen="Moderate" pollenLevel="Moderate" />
          <DayWeatherCard day="Sun" icon={<SunIcon size={24} color={DASH.goldLight} />} temperature="22.4" pollen="Low" pollenLevel="Low" />
        </div>
      </CardPanel>

      {/* ─── 5. Occupancy Prediction Based on Outdoor Weather ─── */}
      <CardPanel>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700, margin: 0 }}>
            Occupancy prediction based on outdoor weather
          </h2>
          <span style={{
            padding: '5px 14px',
            backgroundColor: DASH.cardBg2,
            border: `1px solid ${DASH.cardBorder}`,
            borderRadius: '20px',
            color: DASH.label,
            fontSize: '12px',
          }}>
            15–22. February 2025
          </span>
        </div>

        <LineChart
          series={[
            {
              data: todaySeries,
              color: DASH.lineToday,
              label: 'Today',
            },
            {
              data: predictionSeries,
              color: DASH.linePrediction,
              label: 'Prediction',
              dotted: true,
            },
            {
              data: visitorsToday,
              color: DASH.orange,
              label: 'Visitors today',
            },
            {
              data: visitorsPred,
              color: DASH.label,
              label: 'Visitors prediction',
              dashed: true,
            },
          ]}
          xLabels={dateLabels}
          width={820}
          height={300}
          yMax={2500}
          yTicks={5}
        />
      </CardPanel>

    </div>
  )
}
