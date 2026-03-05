'use client'

import React, { useState } from 'react'
import {
  DASH,
  ComboBarLineChart,
  MonthSelector,
} from '../charts/DashboardCharts'
import { Invitation } from '../../context/GlobalStateContext'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  invitations: Invitation[]
}

// ─── iOS Phone Icon ───────────────────────────────────────────────────────────
function IOSIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      {/* Phone body */}
      <rect x="5" y="2" width="14" height="20" rx="3" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      {/* Home button */}
      <circle cx="12" cy="18.5" r="1.2" stroke={DASH.gold} strokeWidth="1.2" fill="none" />
      {/* Notch */}
      <rect x="9" y="3" width="6" height="1.5" rx="0.75" fill={DASH.gold} />
      {/* Apple logo hint */}
      <path d="M10.5 9.5 C10.5 8.2 11.3 7.5 12 7.5 C12.7 7.5 13.5 8.2 13.5 9.5 C13.5 11 12.5 11.5 12.5 12.5 L11.5 12.5 C11.5 11.5 10.5 11 10.5 9.5Z" fill={DASH.gold} />
    </svg>
  )
}

// ─── Android Phone Icon ───────────────────────────────────────────────────────
function AndroidIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      {/* Phone body */}
      <rect x="5" y="4" width="14" height="18" rx="2" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      {/* Antenna left */}
      <line x1="8" y1="4" x2="6.5" y2="2" stroke={DASH.gold} strokeWidth="1.2" strokeLinecap="round" />
      {/* Antenna right */}
      <line x1="16" y1="4" x2="17.5" y2="2" stroke={DASH.gold} strokeWidth="1.2" strokeLinecap="round" />
      {/* Screen area */}
      <rect x="7" y="6" width="10" height="12" rx="1" fill={DASH.gold} opacity="0.15" stroke={DASH.gold} strokeWidth="0.5" />
      {/* Android robot eyes */}
      <circle cx="10" cy="9" r="1" fill={DASH.gold} />
      <circle cx="14" cy="9" r="1" fill={DASH.gold} />
      {/* Bottom dot */}
      <circle cx="12" cy="20.5" r="0.8" fill={DASH.gold} />
    </svg>
  )
}

// ─── Vending Machine / Cash Icon ─────────────────────────────────────────────
function VendingIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      {/* Outer machine */}
      <rect x="6" y="4" width="36" height="40" rx="4" stroke={DASH.gold} strokeWidth="2" fill="none" />
      {/* Screen */}
      <rect x="10" y="8" width="28" height="14" rx="2" fill={DASH.gold} opacity="0.2" stroke={DASH.gold} strokeWidth="1.2" />
      {/* Product rows */}
      <rect x="10" y="26" width="28" height="6" rx="1" fill={DASH.gold} opacity="0.15" stroke={DASH.gold} strokeWidth="1" />
      <rect x="10" y="34" width="28" height="4" rx="1" fill={DASH.gold} opacity="0.1" stroke={DASH.gold} strokeWidth="1" />
      {/* Coin slot */}
      <rect x="30" y="12" width="4" height="1.5" rx="0.75" fill={DASH.gold} />
      {/* Money symbol */}
      <text x="24" y="19" textAnchor="middle" fill={DASH.gold} fontSize="7" fontWeight="800">Ft</text>
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeAverage(values: number[]): number {
  if (!values.length) return 0
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard5VisitorCenter({ invitations }: Props) {
  const [month, setMonth] = useState('February 2025')

  // ── Weekday visitor counts derived from invitations ────────────────────────
  // Day indices: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const weekdayFallback = [2678, 1112, 1930, 5021, 6672, 7961, 6805]
  const weekdayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const weekdayCounts = (() => {
    const filtered = invitations.filter(inv => {
      const d = new Date(inv.visitDate)
      return !isNaN(d.getTime())
    })
    if (!filtered.length) return weekdayFallback

    // Count per day-of-week (Mon=0 ... Sun=6 in our display order)
    const counts = [0, 0, 0, 0, 0, 0, 0]
    filtered.forEach(inv => {
      const d = new Date(inv.visitDate)
      const dow = d.getDay() // 0=Sun
      // Map JS dow to our Mon-first order
      const idx = dow === 0 ? 6 : dow - 1
      counts[idx]++
    })
    // If all zeros, fall back
    if (counts.every(c => c === 0)) return weekdayFallback
    return counts
  })()

  const weekdayAvg = computeAverage(weekdayCounts)

  const weekdayChartData = weekdayLabels.map((label, i) => ({
    label,
    barValue: weekdayCounts[i],
    lineValue: weekdayAvg,
  }))

  // ── Time slot visitor counts (hardcoded as no time-series in invitations) ──
  const timeSlotValues = [2678, 1200, 1812, 5116, 6546, 7901, 6881, 1015, 2050, 5321, 6109, 4265]
  const timeSlotLabels = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

  const timeSlotAvg = computeAverage(timeSlotValues)

  const timeSlotChartData = timeSlotLabels.map((label, i) => ({
    label,
    barValue: timeSlotValues[i],
    lineValue: timeSlotAvg,
  }))

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: DASH.text,
      backgroundColor: DASH.pageBg,
      padding: '32px 40px',
      width: '100%',
      boxSizing: 'border-box',
      minHeight: '100vh',
    }}>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ color: DASH.textWhite, fontSize: '32px', fontWeight: 800, margin: 0, marginTop: '4px' }}>
            Visitor Center
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <MonthSelector value={month} onChange={setMonth} />
        </div>
      </div>

      {/* ─── Visitor Center Card ─── */}
      <div style={{
        backgroundColor: DASH.cardBg,
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
      }}>
        <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: '0 0 28px 0' }}>
          Visitor Center
        </h2>

        {/* ── Number of visitors by weekdays ── */}
        <div style={{ marginBottom: '36px' }}>
          <h3 style={{ color: DASH.textWhite, fontSize: '15px', fontWeight: 700, margin: '0 0 16px 0' }}>
            Number of visitors by weekdays
          </h3>
          <ComboBarLineChart
            data={weekdayChartData}
            width={1400}
            height={340}
            showValues={true}
          />
        </div>

        {/* ── Number of visitors by time slots ── */}
        <div>
          <h3 style={{ color: DASH.textWhite, fontSize: '15px', fontWeight: 700, margin: '0 0 16px 0' }}>
            Number of visitors by time slots
          </h3>
          <ComboBarLineChart
            data={timeSlotChartData}
            width={1400}
            height={340}
            showValues={true}
          />
        </div>
      </div>

      {/* ─── Bottom Row: SkyDeck + Vending ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px' }}>

        {/* ── SkyDeck App Downloads ── */}
        <div style={{
          backgroundColor: DASH.cardBg,
          border: `1px solid ${DASH.cardBorder}`,
          borderRadius: '16px',
          padding: '24px',
        }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 800, margin: '0 0 24px 0' }}>
            SkyDeck App downloads
          </h2>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {/* iOS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <IOSIcon />
              <div>
                <div style={{ color: DASH.textWhite, fontSize: '30px', fontWeight: 800, lineHeight: 1 }}>455</div>
                <div style={{ color: DASH.label, fontSize: '13px', marginTop: '4px' }}>iOS</div>
              </div>
            </div>

            {/* Android */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <AndroidIcon />
              <div>
                <div style={{ color: DASH.textWhite, fontSize: '30px', fontWeight: 800, lineHeight: 1 }}>933</div>
                <div style={{ color: DASH.label, fontSize: '13px', marginTop: '4px' }}>Android</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Vending Machines ── */}
        <div style={{
          backgroundColor: DASH.cardBg,
          border: `1px solid ${DASH.cardBorder}`,
          borderRadius: '16px',
          padding: '24px',
        }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 800, margin: '0 0 20px 0' }}>
            Vending machines
          </h2>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {/* Left: total revenue */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <VendingIcon />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ color: DASH.textWhite, fontSize: '26px', fontWeight: 800, lineHeight: 1 }}>
                    1 234 567 Ft
                  </span>
                  <span style={{ color: DASH.trendUp, fontSize: '20px', fontWeight: 700 }}>↑</span>
                </div>
                <div style={{ color: DASH.label, fontSize: '13px', marginTop: '4px' }}>
                  Total value of sold items
                </div>
              </div>
            </div>

            {/* Right: TOP 3 */}
            <div style={{ minWidth: '180px' }}>
              <div style={{ color: DASH.label, fontSize: '12px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                TOP 3 sold items
              </div>
              <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {[
                  { rank: 1, name: 'MOL T-shirt' },
                  { rank: 2, name: 'MOL Campus pen' },
                  { rank: 3, name: 'Voucher' },
                ].map(item => (
                  <li key={item.rank} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      color: DASH.gold,
                      fontSize: '13px',
                      fontWeight: 700,
                      minWidth: '16px',
                    }}>
                      {item.rank}.
                    </span>
                    <span style={{ color: DASH.textWhite, fontSize: '13px', fontWeight: 500 }}>
                      {item.name}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
