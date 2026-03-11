'use client'

import React, { useState } from 'react'
import {
  DASH,
  ComboBarLineChart,
  MonthSelector,
  HorizontalBarChart,
} from '../charts/DashboardCharts'
import { Invitation } from '../../context/GlobalStateContext'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  invitations: Invitation[]
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
            Visitor Services
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <MonthSelector value={month} onChange={setMonth} />
        </div>
      </div>

      {/* ─── Visitor Services Card ─── */}
      <div style={{
        backgroundColor: DASH.cardBg,
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
      }}>
        <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: '0 0 28px 0' }}>
          Visitor Services
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

      {/* ════════════════════════════════════════════════════════════════════════
          VISITOR MANAGEMENT (from Occupancy Services)
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: 0 }}>Visitors by company</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ padding: '6px 14px', backgroundColor: DASH.cardBg2, border: `1px solid ${DASH.cardBorder}`, borderRadius: '20px', color: DASH.label, fontSize: '12px', whiteSpace: 'nowrap' as const }}>Filter to floor</div>
            <div style={{ padding: '6px 14px', backgroundColor: DASH.cardBg2, border: `1px solid ${DASH.cardBorder}`, borderRadius: '20px', color: DASH.label, fontSize: '12px', whiteSpace: 'nowrap' as const }}>February 2025</div>
          </div>
        </div>

        <div style={{ backgroundColor: DASH.cardBg, border: `1px solid ${DASH.cardBorder}`, borderRadius: '16px', padding: '24px' }}>
          <HorizontalBarChart
            data={[
              { label: 'Apex Data Solutions', value: 286, trend: 'up' as const },
              { label: 'Horizon Analytics', value: 268, trend: 'up' as const },
              { label: 'Willowbrook Consulting', value: 225, trend: 'up' as const },
              { label: 'Starlight Technologies', value: 207, trend: 'up' as const },
              { label: 'Lumina Insights', value: 187, trend: 'down' as const },
              { label: 'Quantum Metric Corp', value: 183, trend: 'down' as const },
              { label: 'SynergyWorks Group', value: 150, trend: 'up' as const },
              { label: 'NovaSphere Industries', value: 138, trend: 'down' as const },
              { label: 'Veridian Dynamics', value: 113, trend: 'neutral' as const },
              { label: 'Crimson DataFlow', value: 101, trend: 'neutral' as const },
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
