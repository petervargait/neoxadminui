'use client'

import React, { useState } from 'react'
import {
  DASH,
  MonthSelector,
  GoldBarChart,
  PieChart,
  CardPanel,
  FilterDropdown,
  LineChart,
  StackedHorizontalBarChart,
} from '../charts/DashboardCharts'
import { Ticket } from '../../context/GlobalStateContext'

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  tickets: Ticket[]
}

// ─── Diamond Icon ─────────────────────────────────────────────────────────────
function DiamondIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L22 9L12 22L2 9Z" stroke={DASH.gold} strokeWidth="2" fill="none" />
    </svg>
  )
}

// ─── Clock Icon ───────────────────────────────────────────────────────────────
function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={DASH.gold} strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke={DASH.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── FM Solutions Icon ────────────────────────────────────────────────────────
function FMIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={DASH.gold} strokeWidth="2" />
      <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
        stroke={DASH.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── TrendArrow inline ────────────────────────────────────────────────────────
function Arrow({ dir, size = 16 }: { dir: 'up' | 'down'; size?: number }) {
  const color = dir === 'up' ? DASH.trendUp : DASH.trendDown
  return <span style={{ color, fontSize: size, fontWeight: 700 }}>{dir === 'up' ? '↑' : '↓'}</span>
}

// ─── Filter Pill ─────────────────────────────────────────────────────────────
function FilterPill({ label }: { label: string }) {
  return (
    <div style={{ padding: '6px 14px', backgroundColor: DASH.cardBg2, border: `1px solid ${DASH.cardBorder}`, borderRadius: '20px', color: DASH.label, fontSize: '12px', whiteSpace: 'nowrap' }}>
      {label}
    </div>
  )
}

// ─── Section Row ─────────────────────────────────────────────────────────────
function SectionRow({ title, filter, dateRange }: { title: string; filter: string; dateRange: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: 0 }}>{title}</h2>
      <div style={{ display: 'flex', gap: '8px' }}>
        <FilterPill label={filter} />
        <FilterPill label={dateRange} />
      </div>
    </div>
  )
}

// ─── KPI Bullet ──────────────────────────────────────────────────────────────
function KPIBullet({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '7px' }}>
      <span style={{ color: DASH.gold, fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>•</span>
      <span style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard1OfficeServices({ tickets }: Props) {
  const [month, setMonth] = useState('February 2025')
  const [tenantFilter, setTenantFilter] = useState('')
  const [floorFilter, setFloorFilter] = useState('')

  // Derive basic counts from tickets, fall back to hardcoded demo values
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

  const openedCount = openTickets > 0 ? openTickets : 307
  const completedCount = resolvedTickets > 0 ? resolvedTickets : 1187

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

  const frequentedXLabels = ['Feb 14', 'Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21', 'Feb 22']
  const frequentedToday     = [1800, 2600, 3480, 3100, 2700, 2200, 1500, 2400, 2800]
  const frequentedPrediction = [1600, 2200, 2800, 2500, 2300, 2000, 1800, 2200, 2500]

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: DASH.text, padding: '32px 40px', width: '100%', boxSizing: 'border-box' as const }}>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ color: DASH.textWhite, fontSize: '32px', fontWeight: 800, margin: 0, marginTop: '4px' }}>
            Office services
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <MonthSelector value={month} onChange={setMonth} />
        </div>
      </div>

      {/* ─── Issue Handling Section ─── */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: '0 0 20px 0' }}>
          Issue handling
        </h2>

        {/* 2-column layout: Left = KPIs + Resolutions, Right = Total tickets + pies */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* KPI cards side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

            {/* KPI: New warranty tickets */}
            <div style={{
              backgroundColor: DASH.cardBg,
              border: `1px solid ${DASH.cardBorder}`,
              borderRadius: '14px',
              padding: '18px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <DiamondIcon />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                  <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>1495</span>
                  <Arrow dir="down" size={18} />
                </div>
                <div style={{ color: DASH.label, fontSize: '12px', marginTop: '3px' }}>New warranty tickets</div>
              </div>
            </div>

            {/* KPI: Avg resolution time */}
            <div style={{
              backgroundColor: DASH.cardBg,
              border: `1px solid ${DASH.cardBorder}`,
              borderRadius: '14px',
              padding: '18px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <ClockIcon />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                  <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>45</span>
                  <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 600 }}>mins</span>
                  <Arrow dir="up" size={18} />
                </div>
                <div style={{ color: DASH.label, fontSize: '12px', marginTop: '3px' }}>Avg. resolution time</div>
              </div>
            </div>
          </div>

          {/* Row 2: Resolutions per month — full width */}
          <div style={{
            backgroundColor: DASH.cardBg,
            border: `1px solid ${DASH.cardBorder}`,
            borderRadius: '14px',
            padding: '20px 20px 12px 20px',
          }}>
            <div style={{ color: DASH.textWhite, fontSize: '16px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
              Resolutions per month
            </div>
            <GoldBarChart
              data={[
                { label: 'Opened tickets', value: openedCount },
                { label: 'Completed tickets', value: completedCount },
              ]}
              width={600}
              height={220}
              barColor={DASH.gold}
              showValues={true}
            />
          </div>

          </div>
          {/* RIGHT COLUMN: Total new tickets + pie charts */}
          <div style={{
            backgroundColor: DASH.cardBg,
            border: `1px solid ${DASH.cardBorder}`,
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>

            {/* Total new tickets header */}
            <div style={{
              textAlign: 'center',
              paddingBottom: '12px',
              borderBottom: `1px solid ${DASH.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '36px', fontWeight: 800 }}>1495</span>
                <Arrow dir="down" size={22} />
              </div>
              <div style={{ color: DASH.label, fontSize: '13px', marginTop: '2px' }}>Total new tickets</div>
            </div>

            {/* Pie rows side by side at full width */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Pie row 1: Online vs phone calls */}
              <div style={{
                backgroundColor: DASH.cardBg2,
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                {/* Pie chart 1 */}
                <div style={{ flexShrink: 0 }}>
                  <PieChart
                    size={120}
                    donut={false}
                    segments={[
                      { label: 'Online', value: 1418, color: DASH.gold },
                      { label: 'From phone calls', value: 76, color: '#FFFFFF' },
                    ]}
                  />
                </div>
                {/* Labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                      <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>1418</span>
                      <Arrow dir="up" size={14} />
                    </div>
                    <div style={{ color: DASH.label, fontSize: '12px' }}>Online</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                      <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>76</span>
                      <Arrow dir="up" size={14} />
                    </div>
                    <div style={{ color: DASH.label, fontSize: '12px' }}>From phone calls</div>
                  </div>
                </div>
              </div>

              {/* Pie row 2: Parking + warranty + campus + FM */}
              <div style={{
                backgroundColor: DASH.cardBg2,
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                {/* Left stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '90px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800 }}>79</span>
                      <Arrow dir="down" size={13} />
                    </div>
                    <div style={{ color: DASH.label, fontSize: '11px', lineHeight: 1.3 }}>For business visitor<br />parkings</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800 }}>5</span>
                      <Arrow dir="down" size={13} />
                    </div>
                    <div style={{ color: DASH.label, fontSize: '11px' }}>Warranty</div>
                  </div>
                </div>

                {/* Pie chart 2 */}
                <div style={{ flexShrink: 0 }}>
                  <PieChart
                    size={120}
                    donut={false}
                    segments={[
                      { label: 'Parking', value: 79, color: DASH.gold },
                      { label: 'Warranty', value: 5, color: DASH.trendDown },
                      { label: 'Campus', value: 712, color: '#FFFFFF' },
                      { label: 'FM', value: 782, color: DASH.label },
                    ]}
                  />
                </div>

                {/* Right stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '90px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px' }}>
                      <span style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800 }}>712</span>
                      <Arrow dir="up" size={13} />
                    </div>
                    <div style={{ color: DASH.label, fontSize: '11px' }}>In Campus solutions</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px' }}>
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
      </div>

      {/* ─── Most Frequent Requests Section ─── */}
      <div style={{
        backgroundColor: DASH.cardBg,
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
      }}>
        <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: '0 0 20px 0' }}>
          Most frequent requests
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Bar Chart */}
          <div>
            <GoldBarChart
              data={[
                { label: 'Business visitor\nparking', value: 966 },
                { label: 'Example', value: 1026 },
                { label: 'Example', value: 78 },
              ]}
              width={600}
              height={260}
              barColor={DASH.gold}
              showValues={true}
            />
          </div>

          {/* Reasons text */}
          <div style={{ paddingTop: '8px' }}>
            <div style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
              Some reasons for opening these tickets
            </div>
            <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 12px 0' }}>
              Business visitor parking: &quot;Szükségem van egy parkolóhelyre az &quot;AAAEAF699&quot; rendszámnak 08.02-óra 10-től 12-ig&quot;, &quot;Parkolóhelyet szeretnék 2 napra az &quot;XZT-123&quot;nak 08.20-21-re.&quot;, etc.
            </p>
            <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 12px 0' }}>
              Example: &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.&quot;
            </p>
            <p style={{ color: DASH.textWhite, fontSize: '12px', fontWeight: 700, lineHeight: 1.6, margin: 0 }}>
              Example:{' '}
              <span style={{ color: DASH.label, fontWeight: 400 }}>
                &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.&quot;
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ─── Most Frequent Issues Section ─── */}
      <div style={{
        backgroundColor: DASH.cardBg,
        border: `1px solid ${DASH.cardBorder}`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
      }}>
        <h2 style={{ color: DASH.textWhite, fontSize: '20px', fontWeight: 800, margin: '0 0 20px 0' }}>
          Most frequent issues
        </h2>

        {/* Campus Solutions subsection */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ color: DASH.label, fontSize: '14px', fontWeight: 500, marginBottom: '16px' }}>
            Campus solutions
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Campus bar chart */}
            <div>
              <GoldBarChart
                data={[
                  { label: 'Meeting rooms', value: 114 },
                  { label: 'Locker', value: 500 },
                  { label: 'Others', value: 177 },
                ]}
                width={460}
                height={220}
                barColor={DASH.gold}
                showValues={true}
              />
            </div>

            {/* Campus reasons */}
            <div style={{ paddingTop: '8px' }}>
              <div style={{ color: DASH.textWhite, fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>
                Some reasons for opening these tickets
              </div>
              <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Meeting rooms:</span>{' '}
                &quot;12H. 001M-ban nem működik a Teams touch panel&quot;, &quot;Az első emeleten az öböl felőli focus box-ban nem tölt a kábel&quot;, etc.
              </p>
              <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Locker:</span>{' '}
                &quot;Első emeleten az A lockercsoportnál nem működik a kártyaolvasó&quot;, &quot;Nem nyílt ki a lockerem, pedig kinyitottam az appon keresztül.&quot;, etc.
              </p>
              <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
                <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Other:</span>{' '}
                &quot;Nem tudom milyen kategóriába rakjam, de a 22. emeleti lifthívó gombnál néhány számra nem reagál semmit a kijelző.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Facility Management Solutions subsection */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FMIcon />
            <span style={{ color: DASH.label, fontSize: '14px', fontWeight: 500 }}>
              Facility Management solutions
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
            {/* FM bar chart */}
            <div>
              <GoldBarChart
                data={[
                  { label: 'Furniture', value: 107 },
                  { label: 'Electric systems', value: 122 },
                  { label: 'Heating/AC', value: 258 },
                ]}
                width={460}
                height={220}
                barColor={DASH.gold}
                showValues={true}
              />
            </div>

            {/* FM reasons */}
            <div style={{ paddingTop: '8px' }}>
              <div style={{ color: DASH.textWhite, fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>
                Some reasons for opening these tickets
              </div>
              <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Furniture:</span>{' '}
                Az 5. emeleten az egyik közös területen valaki leitta a lila puffokat kávéval&quot;, &quot;A tizedik emeleten a konyhában 2 asztal is billeg&quot;, etc.
              </p>
              <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Electric systems:</span>{' '}
                &quot;10. emeleten az egyik team areánál nem működnek a lámpák, és sötétben dolgozunk&quot;, &quot;Valami fura hang jön a plafonból a 8. emeleten&quot;, etc.
              </p>
              <p style={{ color: DASH.label, fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
                <span style={{ color: DASH.textWhite, fontWeight: 700 }}>Heating/AC:</span>{' '}
                &quot;Nagyon hideg van a 17. emeleten!!!&quot;, &quot;A harmadik emeleten jobb oldalon nagyon hangos a légkondi, nem lehet tőle dolgozni.&quot;, etc.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Ticket Statistics by Company (in/out of SLA) ─── */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow title="Ticket Statistics (in or out of SLA)" filter="Filter to floor" dateRange="15.-22. February 2025" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
          <span style={{ color: DASH.label, fontSize: '13px' }}>Tickets by company <span style={{ color: DASH.muted, fontSize: '12px' }}>compared to last period</span></span>
          <span style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700 }}>Total <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>7 315</span></span>
        </div>
        <StackedHorizontalBarChart data={companyData} colors={[DASH.gold, DASH.blue]} labels={['End of SLA', 'In SLA']} width={860} total={300} showTotal={true} />
      </CardPanel>

      {/* ─── Ticket Statistics by Level ─── */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow title="Ticket Statistics (in or out of SLA)" filter="Filter to floor" dateRange="15-22. February 2025" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
          <span style={{ color: DASH.label, fontSize: '13px' }}>Tickets by level <span style={{ color: DASH.muted, fontSize: '12px' }}>compared to last period</span></span>
          <span style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700 }}>Total <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>6 419</span></span>
        </div>
        <StackedHorizontalBarChart data={levelSLAData} colors={[DASH.gold, DASH.blue]} labels={['Opened by System', 'Opened by User']} width={860} total={300} showTotal={true} />
      </CardPanel>

      {/* ─── KPI ─── */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow title="KPI" filter="Filter to floor" dateRange="15-22. February 2025" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <KPIBullet text="Elevator up- and down-trips (4,410 trips/day) above average, increased compared to previous week." />
          <KPIBullet text="Average daily occupied meeting rooms (Campus): 9.4/10 occupied (94%)" />
          <KPIBullet text="Facility Operating temperature regulation deviation (above 24°C): temperature above 4.52" />
          <KPIBullet text="Occupied parking spaces: 44 bookings/day (88%)" />
          <KPIBullet text="Average daily occupied lockers: 37.5/50 (75%) but 7 lockers malfunctioned, service needed" />
          <KPIBullet text="Facility Opening room temperature accuracy (20°C): 98.3%" />
          <KPIBullet text="Energy monitoring – Building Operating maintenance (within 1 year): 12.6 kWh/sqm" />
          <KPIBullet text="Facility Operating temperature regulation deviation (above 24°C): occurred in 3.5% of cases" />
          <KPIBullet text="Electric systems operational accuracy (Power): 99.1%" />
          <KPIBullet text="Surface functional accuracy (Floor, wall, ceiling): 97.4% (maintenance needed on 2.6% of total area)" />
          <KPIBullet text="Doors and windows operational accuracy: 98.8% (0 malfunctioned units)" />
          <KPIBullet text="Cleaning quality accuracy: 97.2%" />
        </div>
      </CardPanel>

      {/* ─── Frequented Users ─── */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow title="Frequented users" filter="Filter to tenant" dateRange="15.-22. February 2025" />
        <LineChart
          series={[
            { data: frequentedToday, color: DASH.lineToday, label: 'Today', dashed: false },
            { data: frequentedPrediction, color: DASH.linePrediction, label: 'Prediction', dashed: true },
          ]}
          xLabels={frequentedXLabels}
          width={860}
          height={300}
          yMax={3500}
          yTicks={7}
        />
      </CardPanel>

      {/* ─── Arriving and Leaving ─── */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow title="Arriving and leaving" filter="Filter to floor" dateRange="15-22. February 2025" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '180px', flexDirection: 'column', gap: '16px', padding: '24px' }}>
          <p style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
            Expected arrival and departure blocks
          </p>
          <p style={{ color: DASH.gold, fontSize: '15px', fontWeight: 600, textAlign: 'center', margin: 0 }}>
            Arrivals 06:00–11:00<br />Departures 15:00–20:00
          </p>
        </div>
      </CardPanel>

      {/* ─── Cleaning Statistics ─── */}
      <CardPanel style={{ marginBottom: '20px' }}>
        <SectionRow title="Cleaning statistics" filter="Filter to floor" dateRange="15-22. February 2025" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
          <span style={{ color: DASH.label, fontSize: '13px' }}>Cleaning by levels <span style={{ color: DASH.muted, fontSize: '12px' }}>compared to last period</span></span>
          <span style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700 }}>Total <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>6 220</span></span>
        </div>
        <StackedHorizontalBarChart data={cleaningData} colors={[DASH.gold, DASH.cardBorder]} labels={['Opened by System', 'Opened by User']} width={860} total={800} showTotal={true} />
      </CardPanel>

    </div>
  )
}
