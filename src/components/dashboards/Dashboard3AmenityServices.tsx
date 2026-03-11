'use client'

import React from 'react'
import {
  DASH,
  TrendArrow,
  CardPanel,
  SectionHeader,
  DashboardHeader,
  MonthSelector,
  KPICard,
  GoldBarChart,
  HorizontalBarChart,
  AreaChart,
  PieChart,
  StackedGroupedBarChart,
} from '../charts/DashboardCharts'

// ─── Inline sub-components used only in this dashboard ────────────────────────

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: DASH.label, fontSize: '13px', fontWeight: 600, marginBottom: '10px', marginTop: '18px' }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ borderBottom: `1px solid ${DASH.cardBorder}`, margin: '20px 0' }} />
}

function KPIRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
      {children}
    </div>
  )
}

function InlineStat({
  value,
  unit,
  trend,
  label,
}: {
  value: string
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  label: string
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>{value}</span>
        {unit && <span style={{ color: DASH.textWhite, fontSize: '13px', fontWeight: 600 }}>{unit}</span>}
        {trend && <TrendArrow direction={trend} />}
      </div>
      <div style={{ color: DASH.label, fontSize: '12px', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function Top3Services({ items }: { items: string[] }) {
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ color: DASH.label, fontSize: '12px', marginBottom: '6px' }}>TOP 3 services</div>
      {items.map((item, i) => (
        <div key={i} style={{ color: DASH.text, fontSize: '13px', lineHeight: '1.7' }}>
          <span style={{ color: DASH.gold, fontWeight: 700, marginRight: '6px' }}>{i + 1}.</span>
          {item}
        </div>
      ))}
    </div>
  )
}

function FilterPill({ label }: { label: string }) {
  return (
    <div style={{
      padding: '7px 18px',
      backgroundColor: DASH.cardBg,
      border: `1px solid ${DASH.cardBorder}`,
      borderRadius: '20px',
      color: DASH.text,
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    }}>
      {label}
      <span style={{ color: DASH.label, fontSize: '10px' }}>▼</span>
    </div>
  )
}

// ─── Grouped bar chart for Catering (Breakfast + Lunch per weekday) ──────────
function BreakfastLunchBarChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const breakfast = [966, 554, 788, 600, 289]
  const lunch = [1035, 1035, 688, 400, 178]
  const max = Math.max(...breakfast, ...lunch)
  const width = 500
  const height = 220
  const padding = { top: 30, right: 20, bottom: 40, left: 40 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const groupW = chartW / days.length
  const barW = groupW * 0.28

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {/* Y gridlines */}
      {[0, 250, 500, 750, 1000].map((v) => {
        const y = padding.top + chartH - (v / max) * chartH
        return (
          <g key={v}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={DASH.cardBorder} strokeWidth={1} strokeDasharray="3,3" />
            <text x={padding.left - 4} y={y + 4} textAnchor="end" fill={DASH.muted} fontSize="9">{v}</text>
          </g>
        )
      })}
      {days.map((day, i) => {
        const gx = padding.left + i * groupW
        const bH = (breakfast[i] / max) * chartH
        const lH = (lunch[i] / max) * chartH
        const bX = gx + groupW / 2 - barW - 2
        const lX = gx + groupW / 2 + 2
        return (
          <g key={i}>
            {/* Breakfast bar (gold) */}
            <rect x={bX} y={padding.top + chartH - bH} width={barW} height={bH} rx={3} fill={DASH.gold} />
            <text x={bX + barW / 2} y={padding.top + chartH - bH - 5} textAnchor="middle" fill={DASH.gold} fontSize="9" fontWeight="700">{breakfast[i]}</text>
            {/* Lunch bar (dark blue) */}
            <rect x={lX} y={padding.top + chartH - lH} width={barW} height={lH} rx={3} fill={DASH.barMuted} />
            <text x={lX + barW / 2} y={padding.top + chartH - lH - 5} textAnchor="middle" fill={DASH.barWhite} fontSize="9" fontWeight="700">{lunch[i]}</text>
            {/* Day label */}
            <text x={gx + groupW / 2} y={height - 10} textAnchor="middle" fill={DASH.label} fontSize="10">{day}</text>
          </g>
        )
      })}
      {/* Legend */}
      <rect x={padding.left} y={height - 32} width={10} height={10} rx={2} fill={DASH.gold} />
      <text x={padding.left + 14} y={height - 24} fill={DASH.label} fontSize="10">Breakfast</text>
      <rect x={padding.left + 80} y={height - 32} width={10} height={10} rx={2} fill={DASH.barMuted} />
      <text x={padding.left + 94} y={height - 24} fill={DASH.label} fontSize="10">Lunch</text>
    </svg>
  )
}

// ─── Donut chart with center label for Shared service area ───────────────────
function AppointmentDonut() {
  const preBooked = 22.43
  const adHoc = 77.57
  const size = 150
  const cx = size / 2
  const cy = size / 2
  const r = 58
  const innerR = 36

  // Pre-booked arc (starts at top = -90 degrees)
  const startAngle = -90
  const preAngle = (preBooked / 100) * 360
  const endPreAngle = startAngle + preAngle
  const adHocEndAngle = endPreAngle + (adHoc / 100) * 360

  function polarToXY(angleDeg: number, radius: number) {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  function arcPath(startA: number, endA: number, outerR: number, inner: number) {
    const s = polarToXY(startA, outerR)
    const e = polarToXY(endA, outerR)
    const si = polarToXY(endA, inner)
    const ei = polarToXY(startA, inner)
    const large = endA - startA > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${outerR} ${outerR} 0 ${large} 1 ${e.x} ${e.y} L ${si.x} ${si.y} A ${inner} ${inner} 0 ${large} 0 ${ei.x} ${ei.y} Z`
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={arcPath(startAngle, endPreAngle, r, innerR)} fill={DASH.gold} />
        <path d={arcPath(endPreAngle, adHocEndAngle, r, innerR)} fill={DASH.blue} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={DASH.textWhite} fontSize="10" fontWeight="700">Appointments</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={DASH.muted} fontSize="8">Ad-hoc</text>
        <text x={cx} y={cy + 21} textAnchor="middle" fill={DASH.muted} fontSize="7">Previous month: {'< 5%'}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: DASH.gold, flexShrink: 0 }} />
            <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 700 }}>22.43%</span>
          </div>
          <div style={{ color: DASH.label, fontSize: '11px', marginLeft: '16px' }}>Pre-Booked</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: DASH.blue, flexShrink: 0 }} />
            <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 700 }}>77.57%</span>
          </div>
          <div style={{ color: DASH.label, fontSize: '11px', marginLeft: '16px' }}>Ad-hoc</div>
        </div>
      </div>
    </div>
  )
}

// ─── Weekly group class attendance stacked grouped bar chart ─────────────────
const groupClassColors = [DASH.gold, DASH.cyan, DASH.green, DASH.purple, DASH.orange, DASH.pink]
const groupClassLabels = ['Body shape', 'Spine training', 'Yoga', 'Yoga & stretching', 'Circuit training', 'Cross training']

// Each weekday has one stack with 6 segments
const groupClassData = [
  { groupLabel: 'Monday',    stacks: [{ segments: [12, 5, 8, 7, 6, 4] }] },
  { groupLabel: 'Tuesday',   stacks: [{ segments: [10, 4, 9, 8, 8, 5] }] },
  { groupLabel: 'Wednesday', stacks: [{ segments: [9, 6, 7, 6, 7, 3] }] },
  { groupLabel: 'Thursday',  stacks: [{ segments: [11, 3, 10, 5, 9, 4] }] },
  { groupLabel: 'Friday',    stacks: [{ segments: [8, 4, 6, 8, 5, 6] }] },
]

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard3AmenityServices() {
  const [month, setMonth] = React.useState('February 2025')

  return (
    <div
      style={{
        backgroundColor: DASH.pageBg,
        minHeight: '100vh',
        padding: '32px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <DashboardHeader title="Amenity services">
        <MonthSelector value={month} onChange={setMonth} />
      </DashboardHeader>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 · FITNESS
        ════════════════════════════════════════════════════════════════════ */}
        <CardPanel>
          <SectionHeader title="Fitness" />

          {/* Row: KPIs + Group class popularity */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px' }}>
            {/* Left: KPIs */}
            <div>
              <InlineStat value="1200" trend="down" label="Total number of visitors / month" />
              <div style={{ marginTop: '16px' }}>
                <InlineStat value="32" trend="down" label="Total number of visitors / day" />
              </div>
              <Top3Services items={['General', 'Personal trainer', 'Group classes']} />
            </div>

            {/* Right: Horizontal bar chart */}
            <div>
              <SubSectionTitle>Group class popularity</SubSectionTitle>
              <HorizontalBarChart
                showTrend={false}
                data={[
                  { label: 'Body shape', value: 25 },
                  { label: 'Spine training', value: 9 },
                  { label: 'Yoga', value: 8 },
                  { label: 'Yoga & stretching', value: 8 },
                  { label: 'Circuit training', value: 10 },
                  { label: 'Cross training', value: 5 },
                  { label: 'Functional training', value: 6 },
                  { label: 'Functional circuit', value: 4 },
                  { label: 'Pilates', value: 12 },
                  { label: 'Hot Iron', value: 5 },
                ]}
                width={480}
                barColor={DASH.gold}
                maxValue={30}
              />
            </div>
          </div>

          <Divider />

          {/* Row: Area chart + Bar chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Average fitness traffic – area chart */}
            <div>
              <SubSectionTitle>Average fitness traffic</SubSectionTitle>
              <AreaChart
                series={[{ data: [53, 510, 720, 600, 532], color: DASH.gold, label: 'Traffic' }]}
                xLabels={['W1', 'W2', 'W3', 'W4', 'W5']}
                width={420}
                height={200}
                yMax={800}
              />
            </div>

            {/* Average weekly distribution per day – bar chart */}
            <div>
              <SubSectionTitle>Average weekly distribution per day</SubSectionTitle>
              <GoldBarChart
                data={[
                  { label: 'Mon', value: 966 },
                  { label: 'Tue', value: 1026 },
                  { label: 'Wed', value: 78 },
                  { label: 'Thu', value: 33 },
                  { label: 'Fri', value: 33 },
                  { label: 'Sat', value: 33 },
                ]}
                width={420}
                height={200}
                barColor={DASH.gold}
              />
            </div>
          </div>

          <Divider />

          {/* Weekly average group class attendance */}
          <div>
            <SubSectionTitle>Weekly average group class attendance</SubSectionTitle>
            <StackedGroupedBarChart
              data={groupClassData}
              colors={groupClassColors}
              legendLabels={groupClassLabels}
              width={700}
              height={280}
            />
          </div>
        </CardPanel>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2 · CATERING
        ════════════════════════════════════════════════════════════════════ */}
        <CardPanel>
          <SectionHeader title="Catering" />

          {/* Meeting + Event row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '20px' }}>
            {/* Meeting */}
            <div style={{ backgroundColor: DASH.cardBg2, borderRadius: '12px', padding: '16px', border: `1px solid ${DASH.cardBorder2}` }}>
              <div style={{ color: DASH.label, fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>Meeting</div>
              <KPIRow>
                <InlineStat value="147" trend="neutral" label="Orders" />
                <InlineStat value="21,443" unit="Ft" trend="neutral" label="Avg basket value" />
              </KPIRow>
            </div>
            {/* Event */}
            <div style={{ backgroundColor: DASH.cardBg2, borderRadius: '12px', padding: '16px', border: `1px solid ${DASH.cardBorder2}` }}>
              <div style={{ color: DASH.label, fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>Event</div>
              <KPIRow>
                <InlineStat value="147" trend="neutral" label="Orders" />
                <InlineStat value="21,443" unit="Ft" label="Avg basket value" />
              </KPIRow>
            </div>
          </div>

          {/* Canteen row */}
          <div style={{ backgroundColor: DASH.cardBg2, borderRadius: '12px', padding: '16px', border: `1px solid ${DASH.cardBorder2}`, marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: DASH.label, fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Canteen</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ color: DASH.muted, fontSize: '11px' }}>📅</span>
                  <span style={{ color: DASH.muted, fontSize: '11px' }}>Average weekly transaction number per day</span>
                </div>
                <BreakfastLunchBarChart />
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ color: DASH.textWhite, fontSize: '22px', fontWeight: 800 }}>1 443</span>
                  <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 600 }}>Ft</span>
                  <TrendArrow direction="down" />
                </div>
                <div style={{ color: DASH.label, fontSize: '12px', marginTop: '2px' }}>Average basket value</div>
              </div>
            </div>
          </div>

          {/* Average breakfast and lunch transaction daily – area chart */}
          <div>
            <SubSectionTitle>Average breakfast and lunch transaction daily</SubSectionTitle>
            <AreaChart
              series={[
                { data: [53, 510, 720, 600], color: DASH.gold, label: 'Transactions' },
              ]}
              xLabels={['W1', 'W2', 'W3', 'W4']}
              width={600}
              height={180}
              yMax={800}
            />
          </div>
        </CardPanel>

        {/* ════════════════════════════════════════════════════════════════════
            RESTAURANT OCCUPANCY
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: '28px' }}>
          <SectionHeader title="Restaurant occupancy">
            <FilterPill label="February 2025" />
          </SectionHeader>

          <CardPanel>
            <div style={{ color: DASH.label, fontSize: '13px', marginBottom: '16px' }}>
              Daily occupancy trends <span style={{ color: DASH.muted, fontSize: '12px' }}>Today vs Prediction vs Average</span>
            </div>

            {/* Custom Restaurant Line Chart */}
            <svg width="700" height="280" viewBox="0 0 700 280" style={{ overflow: 'visible' }}>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map(i => {
                const y = 20 + i * 45
                return (
                  <React.Fragment key={i}>
                    <line x1="60" y1={y} x2="680" y2={y} stroke={DASH.cardBorder} strokeWidth="1" strokeDasharray="4,4" />
                    <text x="50" y={y + 4} fill={DASH.muted} fontSize="11" textAnchor="end">{500 - i * 100}</text>
                  </React.Fragment>
                )
              })}

              {/* X-axis labels */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <text key={day} x={100 + i * 90} y={270} fill={DASH.muted} fontSize="11" textAnchor="middle">{day}</text>
              ))}

              {/* Today line (gold solid) */}
              <polyline
                points="100,110 190,85 280,60 370,95 460,120 550,175 640,200"
                fill="none"
                stroke={DASH.gold}
                strokeWidth="2.5"
              />
              {[110, 85, 60, 95, 120, 175, 200].map((y, i) => (
                <circle key={`today-${i}`} cx={100 + i * 90} cy={y} r="4" fill={DASH.gold} />
              ))}

              {/* Prediction line (dark dashed) */}
              <polyline
                points="100,130 190,105 280,80 370,115 460,140 550,190 640,215"
                fill="none"
                stroke={DASH.muted}
                strokeWidth="2"
                strokeDasharray="6,4"
              />

              {/* Average line (blue dashed) */}
              <polyline
                points="100,150 190,125 280,100 370,130 460,155 550,195 640,220"
                fill="none"
                stroke={DASH.blue}
                strokeWidth="2"
                strokeDasharray="6,4"
              />

              {/* Legend */}
              <circle cx="100" cy={255} r="4" fill={DASH.gold} />
              <text x="110" y={259} fill={DASH.label} fontSize="11">Today</text>
              <line x1="170" y1={255} x2="195" y2={255} stroke={DASH.muted} strokeWidth="2" strokeDasharray="4,3" />
              <text x="200" y={259} fill={DASH.label} fontSize="11">Prediction</text>
              <line x1="280" y1={255} x2="305" y2={255} stroke={DASH.blue} strokeWidth="2" strokeDasharray="4,3" />
              <text x="310" y={259} fill={DASH.label} fontSize="11">Average</text>
            </svg>
          </CardPanel>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3 · SHARED SERVICE AREA
        ════════════════════════════════════════════════════════════════════ */}
        <CardPanel>
          <SectionHeader title="Shared service area" />

          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: '32px', alignItems: 'start' }}>
            {/* KPIs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InlineStat value="1200" trend="neutral" label="Total number of appointments" />
              <InlineStat value="70%" trend="neutral" label="Service desk usage ratio" />
            </div>

            {/* Donut chart */}
            <div>
              <SubSectionTitle>Ratio of ad-hoc and pre-booked appointments</SubSectionTitle>
              <AppointmentDonut />
            </div>

            {/* Services list */}
            <div>
              <div style={{ color: DASH.label, fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>Services</div>
              {[
                'Lost&Office',
                'Fleet service desk',
                'Space Resources',
                'eCleaning Campus',
                'E-parts',
                'Telecom',
                'Travel & expenses',
              ].map((s) => (
                <div
                  key={s}
                  style={{
                    color: DASH.text,
                    fontSize: '12px',
                    lineHeight: '1.8',
                    paddingLeft: '10px',
                    borderLeft: `2px solid ${DASH.gold}`,
                    marginBottom: '4px',
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </CardPanel>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4 · BEAUTY
        ════════════════════════════════════════════════════════════════════ */}
        <CardPanel>
          <SectionHeader title="Beauty" />

          {/* KPI + pie chart row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Left: KPI + bar chart */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '20px' }}>💇</span>
                <InlineStat value="1200" trend="up" label="Total customers" />
              </div>
              <SubSectionTitle>Average weekly distribution per day</SubSectionTitle>
              <GoldBarChart
                data={[
                  { label: 'Mon', value: 966 },
                  { label: 'Tue', value: 1026 },
                  { label: 'Wed', value: 76 },
                  { label: 'Thu', value: 33 },
                  { label: 'Fri', value: 33 },
                  { label: 'Sat', value: 33 },
                ]}
                width={380}
                height={200}
                barColor={DASH.gold}
              />
            </div>

            {/* Right: Pie chart */}
            <div>
              <SubSectionTitle>Beauty service usage by type</SubSectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <PieChart
                  size={200}
                  segments={[
                    { label: 'Hairdresser', value: 40, color: DASH.gold },
                    { label: 'Barber', value: 30, color: DASH.blue },
                    { label: 'Cosmetician', value: 20, color: DASH.cyan },
                    { label: 'Manicure', value: 10, color: DASH.green },
                  ]}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Hairdresser', pct: '40%', color: DASH.gold },
                    { label: 'Barber', pct: '30%', color: DASH.blue },
                    { label: 'Cosmetician', pct: '20%', color: DASH.cyan },
                    { label: 'Manicure', pct: '10%', color: DASH.green },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color, flexShrink: 0 }} />
                      <span style={{ color: DASH.label, fontSize: '12px', minWidth: '80px' }}>{item.label}</span>
                      <span style={{ color: DASH.textWhite, fontSize: '13px', fontWeight: 700 }}>{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardPanel>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 5 · CAFFE ON 6TH FLOOR
        ════════════════════════════════════════════════════════════════════ */}
        <CardPanel>
          <SectionHeader title="Caffe on 6th Floor" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <KPICard value="12 345 678" unit="Ft" trend="neutral" label="Total sales" />
            <KPICard value="1 287" trend="neutral" label="Number of sold coffee" />
            <KPICard value="2 135" unit="Ft" trend="neutral" label="Avg. basket value" />
            <KPICard value="123 111" unit="Ft" trend="up" label="Total coffee purchases in the kitchen areas" />
          </div>
        </CardPanel>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 6 · CAFFE ON GROUND FLOOR + SHUTTLE BUS
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px' }}>
          {/* Caffe on Ground Floor */}
          <CardPanel>
            <SectionHeader title="Caffe on Ground Floor" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <KPICard value="12 345 678" unit="Ft" trend="up" label="Total sales" />
              <KPICard value="1 287" trend="neutral" label="Number of sold coffee" />
              <KPICard value="2 135" unit="Ft" trend="up" label="Avg. basket value" />
            </div>
          </CardPanel>

          {/* Shuttle bus usage */}
          <CardPanel style={{ minWidth: '220px' }}>
            <SectionHeader title="Shuttle bus usage" />
            <div style={{ display: 'flex', gap: '32px' }}>
              <InlineStat value="540" trend="neutral" label="Morning" />
              <InlineStat value="670" trend="neutral" label="Afternoon" />
            </div>
          </CardPanel>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 7 · PEAK PLACE UTILIZATION
        ════════════════════════════════════════════════════════════════════ */}
        <CardPanel>
          <SectionHeader title="Peak place utilization" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* Morning garden */}
            <div style={{ backgroundColor: DASH.cardBg2, borderRadius: '12px', padding: '16px', border: `1px solid ${DASH.cardBorder2}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800 }}>14,47%</span>
                <TrendArrow direction="up" size={16} />
              </div>
              <div style={{ color: DASH.label, fontSize: '12px' }}>Avg. with 8 people</div>
              <div style={{ color: DASH.muted, fontSize: '11px', marginTop: '4px' }}>Morning garden</div>
            </div>

            {/* Office */}
            <div style={{ backgroundColor: DASH.cardBg2, borderRadius: '12px', padding: '16px', border: `1px solid ${DASH.cardBorder2}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800 }}>42,54%</span>
                <TrendArrow direction="neutral" size={16} />
              </div>
              <div style={{ color: DASH.label, fontSize: '12px' }}>Avg. with 33 people</div>
              <div style={{ color: DASH.muted, fontSize: '11px', marginTop: '4px' }}>Office</div>
            </div>

            {/* Evening event */}
            <div style={{ backgroundColor: DASH.cardBg2, borderRadius: '12px', padding: '16px', border: `1px solid ${DASH.cardBorder2}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                <span style={{ color: DASH.textWhite, fontSize: '28px', fontWeight: 800 }}>21,73%</span>
                <TrendArrow direction="neutral" size={16} />
              </div>
              <div style={{ color: DASH.label, fontSize: '12px' }}>Avg. with 9 people</div>
              <div style={{ color: DASH.muted, fontSize: '11px', marginTop: '4px' }}>Evening event</div>
            </div>
          </div>
        </CardPanel>

      </div>
    </div>
  )
}
