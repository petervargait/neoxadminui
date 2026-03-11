'use client'

import React from 'react'
import {
  DASH,
  CardPanel,
  SectionHeader,
  TrendArrow,
  PieChart,
  StackedHorizontalBarChart,
} from '../charts/DashboardCharts'

// ─── Filter Pill ──────────────────────────────────────────────────────────────
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

// ─── Electricity Icon ─────────────────────────────────────────────────────────
function ElectricityIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill={DASH.gold} />
    </svg>
  )
}

// ─── Generator / Building Icon ────────────────────────────────────────────────
function GeneratorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="13" rx="1" stroke={DASH.gold} strokeWidth="1.8" fill="none" />
      <rect x="7" y="4" width="10" height="5" rx="1" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      <line x1="7" y1="13" x2="17" y2="13" stroke={DASH.gold} strokeWidth="1.5" />
      <line x1="7" y1="16" x2="14" y2="16" stroke={DASH.gold} strokeWidth="1.5" />
    </svg>
  )
}

// ─── Water Drop Icon ──────────────────────────────────────────────────────────
function WaterIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 3C12 3 5 10.5 5 15a7 7 0 0 0 14 0C19 10.5 12 3 12 3z" stroke={DASH.gold} strokeWidth="1.8" fill="none" />
    </svg>
  )
}

// ─── Gas Icon ─────────────────────────────────────────────────────────────────
function GasIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke={DASH.gold} strokeWidth="1.8" fill="none" />
      <path d="M9 15 C9 12 12 9 12 9 C12 9 15 12 15 15" stroke={DASH.gold} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill={DASH.gold} />
    </svg>
  )
}

// ─── Lighting Icon ────────────────────────────────────────────────────────────
function LightIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="10" r="4" stroke={DASH.gold} strokeWidth="1.8" fill="none" />
      <path d="M9 14 l-.5 3 h7 l-.5-3" stroke={DASH.gold} strokeWidth="1.5" fill="none" />
      <line x1="9.5" y1="19" x2="14.5" y2="19" stroke={DASH.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Facility Row Item ────────────────────────────────────────────────────────
function FacilityMetric({
  icon,
  value,
  unit,
  trend,
  label,
}: {
  icon: React.ReactNode
  value: string
  unit: string
  trend: 'up' | 'down'
  label: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
      <div style={{ flexShrink: 0, color: DASH.gold }}>{icon}</div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
          <span style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 800 }}>{value}</span>
          <span style={{ color: DASH.textWhite, fontSize: '13px', fontWeight: 600 }}>{unit}</span>
          <TrendArrow direction={trend} size={13} />
        </div>
        <div style={{ color: DASH.label, fontSize: '12px', marginTop: '1px' }}>{label}</div>
      </div>
    </div>
  )
}

// ─── Electricity KPI Block ────────────────────────────────────────────────────
function ElectricityKPI({
  icon,
  value,
  unit,
  trend,
  label,
  description,
}: {
  icon: React.ReactNode
  value: string
  unit: string
  trend: 'up' | 'down'
  label: string
  description?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
      <div style={{ flexShrink: 0, marginTop: '4px' }}>{icon}</div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ color: DASH.textWhite, fontSize: '26px', fontWeight: 800 }}>{value}</span>
          <span style={{ color: DASH.textWhite, fontSize: '15px', fontWeight: 600 }}>{unit}</span>
          <TrendArrow direction={trend} size={16} />
        </div>
        <div style={{ color: DASH.label, fontSize: '13px', marginTop: '3px' }}>{label}</div>
        {description && (
          <div style={{ color: DASH.muted, fontSize: '11px', marginTop: '4px', lineHeight: 1.4, maxWidth: '180px' }}>
            {description}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Waste Level Data ─────────────────────────────────────────────────────────
const wasteLevels = [
  { rowLabel: 'Level 01', segments: [49, 51, 48, 50, 51], total: 231, trend: 'up' as const },
  { rowLabel: 'Level 02', segments: [36, 41, 42, 55, 136], total: 225, trend: 'down' as const },
  { rowLabel: 'Level 03', segments: [25, 26, 29, 48, 142], total: 221, trend: 'down' as const },
  { rowLabel: 'Level 04', segments: [24, 25, 28, 46, 151], total: 232, trend: 'up' as const },
  { rowLabel: 'Level 05', segments: [38, 39, 48, 56, 132], total: 222, trend: 'down' as const },
  { rowLabel: 'Level 06', segments: [39, 41, 41, 57, 129], total: 222, trend: 'down' as const },
  { rowLabel: 'Level 07', segments: [25, 25, 26, 46, 154], total: 229, trend: 'up' as const },
  { rowLabel: 'Level 08', segments: [30, 31, 30, 48, 138], total: 233, trend: 'down' as const },
]

const wasteColors = [
  '#7CB9C8', // Glass - light blue-gray
  '#4CAF82', // Paper - green
  '#E05252', // Aluminum - red/pink
  '#C9963B', // Plastic - gold
  '#1E3A5F', // Communal - dark navy
]

const wasteLabels = ['Glass', 'Paper', 'Aluminum', 'Plastic', 'Communal']

// ─── CO2 Emissions Data ─────────────────────────────────────────────────────
const CO2_ITEMS = [
  { label: 'HVAC Systems', value: 1245, color: '#C9963B' },
  { label: 'Lighting', value: 485, color: '#3B82F6' },
  { label: 'IT Infrastructure', value: 380, color: '#06B6D4' },
  { label: 'Elevators & Escalators', value: 215, color: '#10B981' },
  { label: 'Kitchen & Catering', value: 195, color: '#8B5CF6' },
  { label: 'Hot Water Systems', value: 165, color: '#F97316' },
  { label: 'Transportation (Fleet)', value: 125, color: '#EC4899' },
  { label: 'Cleaning Equipment', value: 65, color: '#EF4444' },
  { label: 'Waste Processing', value: 55, color: '#475569' },
  { label: 'Other Equipment', value: 30, color: '#64748B' },
]
const CO2_TOTAL = 2960
const CO2_MAX = Math.max(...CO2_ITEMS.map(i => i.value))

// ─── Pie Segment Labels ───────────────────────────────────────────────────────
function HeatingCoolingChart() {
  const segments = [
    { label: 'District heating green', value: 22.1, color: '#4CAF82' },
    { label: 'District heating', value: 103, color: '#8B6914' },
    { label: 'Heat pumps', value: 208.2, color: '#C9963B' },
    { label: 'Heat pumps green', value: 52.3, color: '#2D7A5A' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '260px' }}>
      {/* Title + Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
        <span style={{ color: DASH.textWhite, fontSize: '15px', fontWeight: 700 }}>Heating &amp; Cooling</span>
        <span style={{ color: DASH.label, fontSize: '12px' }}>
          Total: <span style={{ color: DASH.textWhite, fontWeight: 700 }}>290,38 MWh</span>{' '}
          <TrendArrow direction="down" size={12} />
        </span>
      </div>

      {/* Pie + Labels layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px' }}>
        {/* Left labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'flex-end' }}>
              <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 700 }}>22,1 MWh</span>
              <TrendArrow direction="up" size={11} />
            </div>
            <div style={{ color: DASH.label, fontSize: '11px' }}>District heating green</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'flex-end' }}>
              <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 700 }}>208,2 MWh</span>
              <TrendArrow direction="down" size={11} />
            </div>
            <div style={{ color: DASH.label, fontSize: '11px' }}>Heat pumps</div>
          </div>
        </div>

        {/* Pie chart */}
        <PieChart segments={segments} size={140} donut={false} />

        {/* Right labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 700 }}>103 MWh</span>
              <TrendArrow direction="up" size={11} />
            </div>
            <div style={{ color: DASH.label, fontSize: '11px' }}>District heating</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ color: DASH.textWhite, fontSize: '14px', fontWeight: 700 }}>52,3 MWh</span>
              <TrendArrow direction="down" size={11} />
            </div>
            <div style={{ color: DASH.label, fontSize: '11px' }}>Heat pumps green</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard9Sustainability() {
  return (
    <div style={{
      backgroundColor: DASH.pageBg,
      minHeight: '100vh',
      padding: '32px 28px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>

      {/* ── Page Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
      }}>
        <h1 style={{
          color: DASH.textWhite,
          fontSize: '36px',
          fontWeight: 800,
          margin: 0,
          letterSpacing: '-0.5px',
        }}>
          Energy Monitor
        </h1>
      </div>

      {/* ════════════════════════════════════════════════════════
          SECTION 1 – Energy Consumption
          ════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '24px' }}>
        <SectionHeader title="Energy consumption">
          <FilterPill label="Filter to tenant" />
          <FilterPill label="Filter to level" />
          <FilterPill label="February 2025" />
        </SectionHeader>

        {/* Electricity CardPanel */}
        <CardPanel>
          <h3 style={{ color: DASH.textWhite, fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0' }}>
            Electricity
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <ElectricityKPI
              icon={<ElectricityIcon />}
              value="2783,98"
              unit="MWh"
              trend="up"
              label="Electricity consumed"
            />
            <div style={{ width: '1px', backgroundColor: DASH.cardBorder, alignSelf: 'stretch' }} />
            <ElectricityKPI
              icon={<GeneratorIcon />}
              value="18,98"
              unit="MWh"
              trend="down"
              label="Electricity generated"
            />
            <div style={{ width: '1px', backgroundColor: DASH.cardBorder, alignSelf: 'stretch' }} />
            <ElectricityKPI
              icon={<span style={{ fontSize: '28px' }}>%</span>}
              value="8,98"
              unit="%"
              trend="up"
              label="Self-sufficiency"
              description="Calculated from generated and consumed electricity"
            />
          </div>
        </CardPanel>
      </div>

      {/* ════════════════════════════════════════════════════════
          SECTION 2 – Facility
          ════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '24px' }}>
        <SectionHeader title="Facility" />

        <CardPanel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '24px', alignItems: 'start' }}>

            {/* LEFT column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              <FacilityMetric icon={<WaterIcon />} value="8,58" unit="m3" trend="down" label="Rain water consumption" />
              <FacilityMetric icon={<WaterIcon />} value="6,45" unit="m3" trend="up" label="Grey water consumption" />
              <FacilityMetric icon={<WaterIcon />} value="18,98" unit="m3" trend="down" label="Communal water consumption" />
              <FacilityMetric icon={<GasIcon />} value="16,2" unit="m3" trend="up" label="Avg. gas used / day" />
              <FacilityMetric icon={<LightIcon />} value="10" unit="h" trend="down" label="Avg. lighting used / day" />
            </div>

            {/* RIGHT column (mirror) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              <FacilityMetric icon={<WaterIcon />} value="8,58" unit="m3" trend="down" label="Rain water consumption" />
              <FacilityMetric icon={<WaterIcon />} value="6,45" unit="m3" trend="up" label="Grey water consumption" />
              <FacilityMetric icon={<WaterIcon />} value="18,98" unit="m3" trend="down" label="Communal water consumption" />
              <FacilityMetric icon={<GasIcon />} value="16,2" unit="m3" trend="up" label="Avg. gas used / day" />
              <FacilityMetric icon={<LightIcon />} value="10" unit="h" trend="down" label="Avg. lighting used / day" />
            </div>

            {/* Heating & Cooling (far right) */}
            <div style={{
              borderLeft: `1px solid ${DASH.cardBorder}`,
              paddingLeft: '24px',
              minWidth: '280px',
            }}>
              <HeatingCoolingChart />
            </div>

          </div>
        </CardPanel>
      </div>

      {/* ════════════════════════════════════════════════════════
          SECTION 3 – CO2 Emissions
          ════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '24px' }}>
        <SectionHeader title="CO2 Emissions">
          <FilterPill label="Filter to tenant" />
          <FilterPill label="Filter to level" />
          <FilterPill label="February 2025" />
        </SectionHeader>

        <CardPanel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>

            {/* LEFT – Itemized list with bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {CO2_ITEMS.map((item) => {
                const pct = ((item.value / CO2_TOTAL) * 100).toFixed(1)
                const barWidth = (item.value / CO2_MAX) * 100
                return (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <span style={{ color: DASH.textWhite, fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ color: DASH.label, fontSize: '12px' }}>
                        <span style={{ color: DASH.textWhite, fontWeight: 700 }}>{item.value.toLocaleString()}</span>{' '}
                        t/year &middot; {pct}%
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: DASH.cardBorder }}>
                      <div style={{
                        height: '100%',
                        width: `${barWidth}%`,
                        borderRadius: '3px',
                        backgroundColor: item.color,
                      }} />
                    </div>
                  </div>
                )
              })}

              {/* Total row */}
              <div style={{
                borderTop: `1px solid ${DASH.cardBorder}`,
                paddingTop: '10px',
                marginTop: '4px',
              }}>
                <span style={{ color: DASH.gold, fontSize: '14px', fontWeight: 800 }}>
                  Total: ~2,960 tonnes CO2/year
                </span>
              </div>
            </div>

            {/* RIGHT – Pie chart */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PieChart
                segments={CO2_ITEMS.map(item => ({
                  label: item.label,
                  value: item.value,
                  color: item.color,
                }))}
                size={260}
                donut={false}
              />
            </div>

          </div>
        </CardPanel>
      </div>

      {/* ════════════════════════════════════════════════════════
          SECTION 4 – Waste Management
          ════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '24px' }}>
        <SectionHeader title="Waste management">
          <FilterPill label="Filter to tenant" />
          <FilterPill label="February 2025" />
        </SectionHeader>

        <CardPanel>
          {/* Sub-header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ color: DASH.textWhite, fontSize: '16px', fontWeight: 700 }}>Cleaning by levels</span>
              <span style={{ color: DASH.label, fontSize: '13px' }}>compared to last period</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ color: DASH.textWhite, fontSize: '15px', fontWeight: 600 }}>Total</span>
              <span style={{ color: DASH.textWhite, fontSize: '24px', fontWeight: 800 }}>6 220</span>
            </div>
          </div>

          <StackedHorizontalBarChart
            data={wasteLevels}
            colors={wasteColors}
            labels={wasteLabels}
            width={700}
            total={250}
            showTotal={true}
          />
        </CardPanel>
      </div>

    </div>
  )
}
