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

// ─── Google Maps Embed ────────────────────────────────────────────────────────
// Location: Árbóc utca / Göncz Árpád Városközpont area, Budapest
// Coordinates: 47.5695, 19.0825
const MAPS_CENTER = '47.5695,19.0825'
const MAPS_ZOOM = 15

// Dark mode map style for Google Maps embed (static image with dark styling)
function GoogleMapSection({ liveTraffic, onToggle }: { liveTraffic: boolean; onToggle: () => void }) {
  // Google Maps Embed API with dark mode: use &maptype=roadmap and layer=traffic when on
  // We use the embed API which supports traffic layer via &layer=traffic
  const baseUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2694.5!2d19.0825!3d47.5695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2shu!4v1`
  const trafficUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2694.5!2d19.0825!3d47.5695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2shu!4v1&layer=traffic`

  return (
    <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#111C2E' }}>
      {/* Dark overlay to blend iframe with dashboard theme */}
      <style>{`
        .gmap-dark-wrapper iframe {
          filter: invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.2) saturate(0.3);
        }
      `}</style>
      <div
        className="gmap-dark-wrapper"
        style={{
          width: '100%',
          height: '320px',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <iframe
          key={liveTraffic ? 'traffic' : 'normal'}
          src={liveTraffic ? trafficUrl : baseUrl}
          width="100%"
          height="320"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Traffic around the building - Árbóc utca, Budapest"
        />
      </div>

      {/* Live Traffic toggle button */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '6px 14px',
          backgroundColor: liveTraffic ? DASH.orange : 'rgba(15, 26, 46, 0.9)',
          border: `1px solid ${liveTraffic ? DASH.orange : DASH.cardBorder}`,
          borderRadius: '16px',
          color: DASH.textWhite,
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
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

      {/* Location label */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        padding: '4px 12px',
        backgroundColor: 'rgba(15, 26, 46, 0.9)',
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '12px',
        color: DASH.label,
        fontSize: '11px',
        fontWeight: 500,
        zIndex: 10,
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill={DASH.gold} />
        </svg>
        Árbóc utca, Göncz Árpád Városközpont
      </div>
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
        <GoogleMapSection liveTraffic={liveTraffic} onToggle={() => setLiveTraffic(v => !v)} />
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
