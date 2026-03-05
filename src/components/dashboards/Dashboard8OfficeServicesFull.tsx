'use client'

import React, { useState } from 'react'
import {
  DASH,
  CardPanel,
  MonthSelector,
  FilterDropdown,
  GoldBarChart,
  PieChart,
  LineChart,
  StackedHorizontalBarChart,
} from '../charts/DashboardCharts'
import { Ticket } from '../../context/GlobalStateContext'

// ─── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  tickets: Ticket[]
}

// ─── Icon helpers ───────────────────────────────────────────────────────────────
function DiamondIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L22 9L12 22L2 9Z" stroke={DASH.gold} strokeWidth="2" fill="none" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={DASH.gold} strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke={DASH.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FMIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={DASH.gold} strokeWidth="2" />
      <path
        d="M12 1v3M12 20v3M1 12h3M20 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
        stroke={DASH.gold}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Arrow({ dir, size = 16 }: { dir: 'up' | 'down'; size?: number }) {
  const color = dir === 'up' ? DASH.trendUp : DASH.trendDown
  return <span style={{ color, fontSize: size, fontWeight: 700 }}>{dir === 'up' ? '↑' : '↓'}</span>
}

// ─── Filter pill ───────────────────────────────────────────────────────────────
function FilterPill({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '6px 14px',
        backgroundColor: DASH.cardBg2,
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '20px',
        color: DASH.label,
        fontSize: '12px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  )
}

// ─── Section title row with right-aligned filter pills ─────────────────────────
function SectionRow({
  title,
  filter,
  dateRange,
}: {
  title: string
  filter: string
  dateRange: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: 0 }}>{title}</h2>
      <div style={{ display: 'flex', gap: '8px' }}>
        <FilterPill label={filter} />
        <FilterPill label={dateRange} />
      </div>
    </div>
  )
}

// ─── KPI bullet list item ──────────────────────────────────────────────────────
function KPIBullet({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '7px' }}>
      <span style={{ color: DASH.gold, fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>•</span>
      <span style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function Dashboard8OfficeServicesFull({ tickets }: Props) {
  const [month, setMonth] = useState('February 2025')
  const [tenantFilter, setTenantFilter] = useState('')
  const [floorFilter, setFloorFilter] = useState('')

  // Derive counts from live tickets where available, fall back to demo data
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  const openedCount = openTickets > 0 ? openTickets : 307
  const completedCount = resolvedTickets > 0 ? resolvedTickets : 1187

  // ─── Hardcoded chart data ─────────────────────────────────────────────────────

  // Section 4: Tickets by company (in/out of SLA)
  const companyData = [
    { rowLabel: 'Apex Data Solutions',      segments: [165, 121], total: 286, trend: 'up'      as const },
    { rowLabel: 'Horizon Analytics',        segments: [137, 131], total: 268, trend: 'up'      as const },
    { rowLabel: 'Lumina Insights',          segments: [78, 109],  total: 187, trend: 'down'    as const },
    { rowLabel: 'Quantum Metric Corp',      segments: [74, 109],  total: 183, trend: 'down'    as const },
    { rowLabel: 'Veridian Dynamics',        segments: [41, 72],   total: 113, trend: 'neutral' as const },
    { rowLabel: 'Starlight Technologies',   segments: [79, 128],  total: 207, trend: 'up'      as const },
    { rowLabel: 'SynergyWorks Group',       segments: [63, 87],   total: 150, trend: 'up'      as const },
    { rowLabel: 'NovaSphere Industries',    segments: [43, 95],   total: 138, trend: 'down'    as const },
    { rowLabel: 'Crimson DataFlow',         segments: [39, 62],   total: 101, trend: 'neutral' as const },
    { rowLabel: 'Willowbrook Consulting',   segments: [49, 176],  total: 225, trend: 'up'      as const },
  ]

  // Section 5: Tickets by level (in/out of SLA)
  const levelSLAData = [
    { rowLabel: 'Level 01', segments: [83, 121],  total: 204, trend: 'up'   as const },
    { rowLabel: 'Level 02', segments: [109, 169], total: 278, trend: 'up'   as const },
    { rowLabel: 'Level 03', segments: [16, 53],   total:  69, trend: 'down' as const },
    { rowLabel: 'Level 04', segments: [50, 128],  total: 178, trend: 'up'   as const },
    { rowLabel: 'Level 05', segments: [59, 105],  total: 164, trend: 'down' as const },
    { rowLabel: 'Level 06', segments: [43, 79],   total: 122, trend: 'up'   as const },
    { rowLabel: 'Level 07', segments: [29, 62],   total:  91, trend: 'down' as const },
    { rowLabel: 'Level 08', segments: [72, 188],  total: 260, trend: 'up'   as const },
  ]

  // Section 9: Cleaning by level
  const cleaningData = [
    { rowLabel: 'Level 01', segments: [620, 149], total: 769, trend: 'up'   as const },
    { rowLabel: 'Level 02', segments: [600, 140], total: 740, trend: 'up'   as const },
    { rowLabel: 'Level 03', segments: [570, 150], total: 720, trend: 'down' as const },
    { rowLabel: 'Level 04', segments: [610, 149], total: 760, trend: 'up'   as const },
    { rowLabel: 'Level 05', segments: [580, 150], total: 730, trend: 'down' as const },
    { rowLabel: 'Level 06', segments: [560, 170], total: 730, trend: 'up'   as const },
    { rowLabel: 'Level 07', segments: [620, 150], total: 770, trend: 'down' as const },
    { rowLabel: 'Level 08', segments: [630, 150], total: 780, trend: 'up'   as const },
  ]

  // Section 7: Frequented users line chart data
  const frequentedXLabels = ['Feb 14', 'Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21', 'Feb 22']
  const frequentedToday     = [1800, 2600, 3480, 3100, 2700, 2200, 1500, 2400, 2800]
  const frequentedPrediction = [1600, 2200, 2800, 2500, 2300, 2000, 1800, 2200, 2500]

  const tenantOptions = [
    { value: 'apex',         label: 'Apex Data Solutions' },
    { value: 'horizon',      label: 'Horizon Analytics' },
    { value: 'lumina',       label: 'Lumina Insights' },
    { value: 'quantum',      label: 'Quantum Metric Corp' },
    { value: 'veridian',     label: 'Veridian Dynamics' },
    { value: 'starlight',    label: 'Starlight Technologies' },
    { value: 'synergy',      label: 'SynergyWorks Group' },
    { value: 'novasphere',   label: 'NovaSphere Industries' },
    { value: 'crimson',      label: 'Crimson DataFlow' },
    { value: 'willowbrook',  label: 'Willowbrook Consulting' },
  ]

  const floorOptions = [
    { value: 'l01', label: 'Level 01' },
    { value: 'l02', label: 'Level 02' },
    { value: 'l03', label: 'Level 03' },
    { value: 'l04', label: 'Level 04' },
    { value: 'l05', label: 'Level 05' },
    { value: 'l06', label: 'Level 06' },
    { value: 'l07', label: 'Level 07' },
    { value: 'l08', label: 'Level 08' },
  ]

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        backgroundColor: DASH.pageBg,
        color: DASH.text,
        padding: '32px 40px',
        width: '100%',
        boxSizing: 'border-box' as const,
        minHeight: '100vh',
      }}
    >
      {/* ─── Page Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '40px',
        }}
      >
        <h1
          style={{
            color: DASH.textWhite,
            fontSize: '36px',
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Office services
        </h1>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — Issue handling
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '28px' }}>
        {/* Section header row with filters */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: 0 }}>
            Issue handling
          </h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <FilterDropdown
              label="Filter to tenant"
              value={tenantFilter}
              options={tenantOptions}
              onChange={setTenantFilter}
            />
            <MonthSelector value={month} onChange={setMonth} />
          </div>
        </div>

        {/* 2-column layout: Left = KPIs + Resolutions, Right = Total tickets + pies */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* New warranty tickets */}
          <div
            style={{
              backgroundColor: DASH.cardBg,
              border: `1px solid ${DASH.cardBorder}`,
              borderRadius: '14px',
              padding: '18px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <DiamondIcon />
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>
                  1495
                </span>
                <Arrow dir="down" size={18} />
              </div>
              <div style={{ color: DASH.label, fontSize: '12px', marginTop: '3px' }}>
                New warranty tickets
              </div>
            </div>
          </div>

          {/* Avg resolution time */}
          <div
            style={{
              backgroundColor: DASH.cardBg,
              border: `1px solid ${DASH.cardBorder}`,
              borderRadius: '14px',
              padding: '18px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <ClockIcon />
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>
                  45
                </span>
                <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 600 }}>mins</span>
                <Arrow dir="up" size={18} />
              </div>
              <div style={{ color: DASH.label, fontSize: '12px', marginTop: '3px' }}>
                Avg. resolution time
              </div>
            </div>
          </div>
        </div>

        {/* Resolutions per month card — full width */}
        <div
          style={{
            backgroundColor: DASH.cardBg,
            border: `1px solid ${DASH.cardBorder}`,
            borderRadius: '14px',
            padding: '20px 20px 12px 20px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              color: DASH.textWhite,
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '8px',
              lineHeight: 1.3,
            }}
          >
            Resolutions per month
          </div>
          <GoldBarChart
            data={[
              { label: 'Opened tickets',    value: openedCount },
              { label: 'Completed tickets', value: completedCount },
            ]}
            width={500}
            height={220}
            barColor={DASH.gold}
            showValues={true}
          />
        </div>
        </div>

        {/* RIGHT COLUMN: Ticket breakdown */}
        <div
          style={{
            backgroundColor: DASH.cardBg,
            border: `1px solid ${DASH.cardBorder}`,
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Total new tickets header */}
          <div
            style={{
              textAlign: 'center',
              paddingBottom: '12px',
              borderBottom: `1px solid ${DASH.cardBorder}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: DASH.textWhite, fontSize: '36px', fontWeight: 800 }}>1495</span>
              <Arrow dir="down" size={22} />
            </div>
            <div style={{ color: DASH.label, fontSize: '13px', marginTop: '2px' }}>
              Total new tickets
            </div>
          </div>

          {/* Pie row 1: Online vs from phone calls */}
          <div
            style={{
              backgroundColor: DASH.cardBg2,
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <PieChart
                size={110}
                donut={false}
                segments={[
                  { label: 'Online',           value: 1418, color: DASH.gold },
                  { label: 'From phone calls', value: 76,   color: '#FFFFFF' },
                ]}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                  <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>1418</span>
                  <Arrow dir="up" size={14} />
                </div>
                <div style={{ color: DASH.label, fontSize: '12px' }}>Online</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'flex-end',
                    gap: '5px',
                  }}
                >
                  <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>76</span>
                  <Arrow dir="up" size={14} />
                </div>
                <div style={{ color: DASH.label, fontSize: '12px' }}>From phone calls</div>
              </div>
            </div>
          </div>

          {/* Pie row 2: Parking / Warranty / Campus / FM */}
          <div
            style={{
              backgroundColor: DASH.cardBg2,
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '80px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800 }}>79</span>
                  <Arrow dir="down" size={13} />
                </div>
                <div style={{ color: DASH.label, fontSize: '11px', lineHeight: 1.3 }}>
                  For business visitor
                  <br />
                  parkings
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800 }}>5</span>
                  <Arrow dir="down" size={13} />
                </div>
                <div style={{ color: DASH.label, fontSize: '11px' }}>Warranty</div>
              </div>
            </div>

            <div style={{ flexShrink: 0 }}>
              <PieChart
                size={110}
                donut={false}
                segments={[
                  { label: 'Parking',  value: 79,  color: DASH.gold },
                  { label: 'Warranty', value: 5,   color: DASH.trendDown },
                  { label: 'Campus',   value: 712, color: '#FFFFFF' },
                  { label: 'FM',       value: 782, color: DASH.label },
                ]}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '80px' }}>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'flex-end',
                    gap: '4px',
                  }}
                >
                  <span style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800 }}>712</span>
                  <Arrow dir="up" size={13} />
                </div>
                <div style={{ color: DASH.label, fontSize: '11px' }}>In Campus solutions</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'flex-end',
                    gap: '4px',
                  }}
                >
                  <span style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800 }}>782</span>
                  <Arrow dir="down" size={13} />
                </div>
                <div style={{ color: DASH.label, fontSize: '11px' }}>In FM solutions</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — Most frequent requests
      ════════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          backgroundColor: DASH.cardBg,
          border: `1px solid ${DASH.cardBorder}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: '0 0 20px 0' }}>
          Most frequent requests
        </h2>

        <div>
          <GoldBarChart
            data={[
              { label: 'Business visitor\nparking', value: 966 },
              { label: 'Example',                   value: 1026 },
              { label: 'Example',                   value: 78 },
            ]}
            width={860}
            height={280}
            barColor={DASH.gold}
            showValues={true}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
            Some reasons for opening these tickets
          </div>
          <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 12px 0' }}>
            Business visitor parking: &quot;Szükségem van egy parkolóhelyre az &quot;AAAEAF699&quot; rendszámnak 08.02-óra
            10-től 12-ig&quot;, &quot;Parkolóhelyet szeretnék 2 napra az &quot;XZT-123&quot;nak 08.20-21-re.&quot;, etc.
          </p>
          <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 12px 0' }}>
            Example: &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore.&quot;
          </p>
          <p style={{ color: DASH.textWhite, fontSize: '12px', fontWeight: 700, lineHeight: 1.6, margin: 0 }}>
            Example:{' '}
            <span style={{ color: DASH.label, fontWeight: 400 }}>
              &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore.&quot;
            </span>
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — Most frequent issues
      ════════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          backgroundColor: DASH.cardBg,
          border: `1px solid ${DASH.cardBorder}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: '0 0 20px 0' }}>
          Most frequent issues
        </h2>

        {/* Campus solutions */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ color: DASH.label, fontSize: '14px', fontWeight: 500, marginBottom: '16px' }}>
            Campus solutions
          </div>
          <div>
            <GoldBarChart
              data={[
                { label: 'Meeting rooms', value: 114 },
                { label: 'Locker',        value: 500 },
                { label: 'Others',        value: 177 },
              ]}
              width={860}
              height={260}
              barColor={DASH.gold}
              showValues={true}
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ color: DASH.textWhite, fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>
              Some reasons for opening these tickets
            </div>
            <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 10px 0' }}>
              <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Meeting rooms:</span>{' '}
              &quot;12H. 001M-ban nem működik a Teams touch panel&quot;, &quot;Az első emeleten az öböl felőli focus
              box-ban nem tölt a kábel&quot;, etc.
            </p>
            <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 10px 0' }}>
              <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Locker:</span>{' '}
              &quot;Első emeleten az A lockercsoportnál nem működik a kártyaolvasó&quot;, &quot;Nem nyílt ki a lockerem,
              pedig kinyitottam az appon keresztül.&quot;, etc.
            </p>
            <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
              <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Other:</span>{' '}
              &quot;Nem tudom milyen kategóriába rakjam, de a 22. emeleti lifthívó gombnál néhány számra nem
              reagál semmit a kijelző.&quot;
            </p>
          </div>
        </div>

        {/* FM solutions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FMIcon />
            <span style={{ color: DASH.label, fontSize: '14px', fontWeight: 500 }}>
              Facility Management solutions
            </span>
          </div>
          <div>
            <GoldBarChart
              data={[
                { label: 'Furniture',        value: 107 },
                { label: 'Electric systems', value: 122 },
                { label: 'Heating/AC',       value: 258 },
              ]}
              width={860}
              height={260}
              barColor={DASH.gold}
              showValues={true}
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ color: DASH.textWhite, fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>
              Some reasons for opening these tickets
            </div>
            <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 10px 0' }}>
              <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Furniture:</span>{' '}
              &quot;Az 5. emeleten az egyik közös területen valaki leitta a lila puffokat kávéval&quot;, &quot;A tizedik
              emeleten a konyhában 2 asztal is billeg&quot;, etc.
            </p>
            <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 10px 0' }}>
              <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Electric systems:</span>{' '}
              &quot;10. emeleten az egyik team areánál nem működnek a lámpák, és sötétben dolgozunk&quot;, &quot;Valami
              fura hang jön a plafonból a 8. emeleten&quot;, etc.
            </p>
            <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
              <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Heating/AC:</span>{' '}
              &quot;Nagyon hideg van a 17. emeleten!!!&quot;, &quot;A harmadik emeleten jobb oldalon nagyon hangos a
              légkondi, nem lehet tőle dolgozni.&quot;, etc.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 — Ticket Statistics by company (in/out of SLA)
      ════════════════════════════════════════════════════════════════════════ */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow
          title="Ticket Statistics (in or out of SLA)"
          filter="Filter to floor"
          dateRange="15.-22. February 2025"
        />

        {/* Subtitle + total */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '16px',
          }}
        >
          <span style={{ color: DASH.label, fontSize: '13px' }}>
            Tickets by company{' '}
            <span style={{ color: DASH.muted, fontSize: '12px' }}>compared to last period</span>
          </span>
          <span style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700 }}>
            Total{' '}
            <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>7 315</span>
          </span>
        </div>

        <StackedHorizontalBarChart
          data={companyData}
          colors={[DASH.gold, DASH.blue]}
          labels={['End of SLA', 'In SLA']}
          width={860}
          total={300}
          showTotal={true}
        />
      </CardPanel>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5 — Ticket Statistics by level (in/out of SLA)
      ════════════════════════════════════════════════════════════════════════ */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow
          title="Ticket Statistics (in or out of SLA)"
          filter="Filter to floor"
          dateRange="15-22. February 2025"
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '16px',
          }}
        >
          <span style={{ color: DASH.label, fontSize: '13px' }}>
            Tickets by company{' '}
            <span style={{ color: DASH.muted, fontSize: '12px' }}>compared to last period</span>
          </span>
          <span style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700 }}>
            Total{' '}
            <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>6 419</span>
          </span>
        </div>

        <StackedHorizontalBarChart
          data={levelSLAData}
          colors={[DASH.gold, DASH.blue]}
          labels={['Opened by System', 'Opened by User']}
          width={860}
          total={300}
          showTotal={true}
        />
      </CardPanel>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6 — KPI
      ════════════════════════════════════════════════════════════════════════ */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow
          title="KPI"
          filter="Filter to floor"
          dateRange="15-22. February 2025"
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <KPIBullet text="A lift le- és felszállások (4 410 felszállás/nap) átlagon felül, az előző héthez képest növekedett." />
          <KPIBullet text="Átlagosan napi foglalatban lévő tárgyalók száma (Campus): 9,4/10 foglalt (94%)" />
          <KPIBullet text="Facility Operating hőmérséklet szabályzás eltérés (24°C felett): 4,52 feletti hőmérséklet esetben" />
          <KPIBullet text="Foglalt parkolók száma: 44 foglalás/nap (88%)" />
          <KPIBullet text="Átlagos napi foglalásban lévő lockerek száma: 37,5/50 (75%) de 7 locker meghibásodott, szerviz szükséges" />
          <KPIBullet text="Facility Opening szobahőmérséklet pontosság (20°C): 98,3%" />
          <KPIBullet text="Energia monitoring – Building Operating karbantartás (1 éven belüli): 12,6 kWh/nm" />
          <KPIBullet text="Facility Operating hőmérséklet szabályzás eltérés (24°C felett): 4,52 feletti hőmérséklet esetben 3,5%-ban fordult elő" />
          <KPIBullet text="Electric systems működési pontossága (Áram): 99,1%" />
          <KPIBullet text="Burkolatok funkcionális pontossága (Padló, fal, mennyezet): 97,4% (az összes terület 2,6%-án szükséges karbantartás)" />
          <KPIBullet text="Ajtók és nyílászárók működési pontossága: 98,8% (0 db meghibásodott egységek)" />
          <KPIBullet text="Takarítás minőségi pontossága: 97,2%" />
        </div>
      </CardPanel>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 7 — Frequented users
      ════════════════════════════════════════════════════════════════════════ */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow
          title="Frequented users"
          filter="Filter to tenant"
          dateRange="15.-22. February 2025"
        />

        <LineChart
          series={[
            {
              data:   frequentedToday,
              color:  DASH.lineToday,
              label:  'Today',
              dashed: false,
            },
            {
              data:   frequentedPrediction,
              color:  DASH.linePrediction,
              label:  'Prediction',
              dashed: true,
            },
          ]}
          xLabels={frequentedXLabels}
          width={860}
          height={300}
          yMax={3500}
          yTicks={7}
        />
      </CardPanel>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 8 — Arriving and leaving
      ════════════════════════════════════════════════════════════════════════ */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow
          title="Arriving and leaving"
          filter="Filter to floor"
          dateRange="15-22. February 2025"
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '180px',
            flexDirection: 'column',
            gap: '16px',
            padding: '24px',
          }}
        >
          <p
            style={{
              color: DASH.textWhite,
              fontSize: '18px',
              fontWeight: 700,
              textAlign: 'center',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Várható érkezés és távozás blokkok
            <br />
            ponosan milyen adatokat és hogyan kéne vizualizálni?
          </p>
          <p style={{ color: DASH.gold, fontSize: '15px', fontWeight: 600, textAlign: 'center', margin: 0 }}>
            külön érkezés 06:00–11:00
            <br />
            távozás 15:00–20:00
          </p>
        </div>
      </CardPanel>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 9 — Cleaning statistics
      ════════════════════════════════════════════════════════════════════════ */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow
          title="Cleaning statistics"
          filter="Filter to floor"
          dateRange="15-22. February 2025"
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '16px',
          }}
        >
          <span style={{ color: DASH.label, fontSize: '13px' }}>
            Cleaning by levels{' '}
            <span style={{ color: DASH.muted, fontSize: '12px' }}>compared to last period</span>
          </span>
          <span style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700 }}>
            Total{' '}
            <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>6 220</span>
          </span>
        </div>

        <StackedHorizontalBarChart
          data={cleaningData}
          colors={[DASH.gold, DASH.cardBorder]}
          labels={['Opened by System', 'Opened by User']}
          width={860}
          total={800}
          showTotal={true}
        />
      </CardPanel>

    </div>
  )
}
