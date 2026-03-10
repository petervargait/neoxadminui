'use client'

import React, { useState, useMemo } from 'react'
import {
  IS,
  ISButton,
  CoverageBadge,
} from './ISShared'
import {
  VehicleCarParkingRegular,
  ShieldKeyholeRegular,
  PersonBoardRegular,
  LockClosedRegular,
  BuildingRegular,
  VideoRegular,
  TicketDiagonalRegular,
  TicketHorizontalRegular,
  PersonRegular,
  BookTemplateRegular,
  Wifi1Regular,
  ArrowUpRegular,
  FoodRegular,
  DeleteRegular,
} from '@fluentui/react-icons'

// ─── Types ────────────────────────────────────────────────────────────────────

type Domain =
  | 'BMS'
  | 'AV/VC'
  | 'IoT'
  | 'Access Control'
  | 'Digital Badge'
  | 'Locker'
  | 'Ticketing'
  | 'Elevator'
  | 'Visitor'
  | 'Parking'
  | 'Event Management'
  | 'Restaurant'
  | 'Waste Management'

interface Template {
  id: string
  domain: Domain
  name: string
  description: string
  coverage: number
  vendors: string[]
  protocols: string[]
  flowCount: number
  version: string
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  {
    id: 'tpl-bms-zone-control',
    domain: 'BMS',
    name: 'BMS Zone Control & Monitoring',
    description: 'Full zone management: read status, set setpoints, monitor energy metrics, handle alarms, and sync environmental data across building systems.',
    coverage: 90,
    vendors: ['Nective', 'Schneider EcoStruxure', 'Siemens Desigo', 'bGrid'],
    protocols: ['REST', 'BACnet/IP', 'Webhook'],
    flowCount: 7,
    version: '2.1.0',
  },
  {
    id: 'tpl-avvc-device',
    domain: 'AV/VC',
    name: 'AV Device Status & Control',
    description: 'Poll or receive push events for AV device health (codec, display, DSP), normalize to a common schema, start/end meetings, and route alerts to AV NOC.',
    coverage: 81,
    vendors: ['Crestron', 'Cisco Webex Devices'],
    protocols: ['REST', 'xAPI', 'Webhook'],
    flowCount: 6,
    version: '2.1.0',
  },
  {
    id: 'tpl-iot-occupancy',
    domain: 'IoT',
    name: 'IoT Sensor & Occupancy Feed',
    description: 'Ingest sensor readings (temperature, humidity, CO2, occupancy), normalize to canonical schema, generate occupancy heatmaps, and trigger environment alerts.',
    coverage: 88,
    vendors: ['bGrid', 'Haltian', 'XYSense', 'Avigilon Halo'],
    protocols: ['REST', 'MQTT', 'Webhook'],
    flowCount: 6,
    version: '1.5.0',
  },
  {
    id: 'tpl-access-credential',
    domain: 'Access Control',
    name: 'Credential Lifecycle',
    description: 'Provision, update, suspend, and revoke access credentials driven by HR/directory lifecycle events across multiple access control vendors.',
    coverage: 94,
    vendors: ['Avigilon', 'Locksense', 'ThirdMillennium', 'HID Origo', 'HikCentral'],
    protocols: ['REST', 'SDK', 'Webhook'],
    flowCount: 8,
    version: '3.1.0',
  },
  {
    id: 'tpl-badge-provisioning',
    domain: 'Digital Badge',
    name: 'Digital Badge Provisioning',
    description: 'Issue, manage, and revoke digital badges (physical and mobile). Supports multi-technology credentials with lifecycle automation.',
    coverage: 92,
    vendors: ['HID Origo', 'Legic Connect', 'NXP DESFire'],
    protocols: ['REST', 'NFC', 'BLE'],
    flowCount: 5,
    version: '2.0.0',
  },
  {
    id: 'tpl-locker-booking',
    domain: 'Locker',
    name: 'Locker Booking & Unlock',
    description: 'Reserve a locker for a session or recurring period, auto-assign based on proximity rules, and trigger remote unlock via mobile or badge.',
    coverage: 85,
    vendors: ['Vecos', 'Digilock', 'Flexlock'],
    protocols: ['REST', 'BLE'],
    flowCount: 5,
    version: '1.5.0',
  },
  {
    id: 'tpl-ticketing-lifecycle',
    domain: 'Ticketing',
    name: 'Ticket Lifecycle Management',
    description: 'Create, update, escalate, and close FM/IT issue tickets across heterogeneous backends with unified status tracking and SLA monitoring.',
    coverage: 90,
    vendors: ['IBM Maximo', 'Cisco Spaces', 'APFM', 'Facilio'],
    protocols: ['REST', 'Webhook'],
    flowCount: 8,
    version: '2.4.1',
  },
  {
    id: 'tpl-elevator-dispatch',
    domain: 'Elevator',
    name: 'Elevator Dispatch & Floor Authorization',
    description: 'Request elevator to specific floor, authorize floor access based on user credentials, monitor elevator status and availability.',
    coverage: 72,
    vendors: ['KONE DX', 'Otis ONE'],
    protocols: ['REST', 'SDK'],
    flowCount: 4,
    version: '1.0.0',
  },
  {
    id: 'tpl-visitor-prereg',
    domain: 'Visitor',
    name: 'Visitor Pre-registration & Approval',
    description: 'Host-initiated visitor invite, multi-step approval workflow, automatic temp-badge provisioning on approval, and check-in/check-out audit trail.',
    coverage: 88,
    vendors: ['TDS', 'NEOX Visitor'],
    protocols: ['REST', 'Webhook', 'SMTP'],
    flowCount: 7,
    version: '2.0.2',
  },
  {
    id: 'tpl-parking-reservation',
    domain: 'Parking',
    name: 'Parking Reservation & Whitelist',
    description: 'Full reservation lifecycle: search availability, create booking, modify/cancel, whitelist sync, and barrier control integration.',
    coverage: 92,
    vendors: ['SkiData', 'NEOX Parking', 'Designa', 'Swarco', 'Parkl', 'ParkHelp'],
    protocols: ['REST', 'Webhook', 'SFTP'],
    flowCount: 8,
    version: '2.3.1',
  },
  {
    id: 'tpl-event-management',
    domain: 'Event Management',
    name: 'Event Lifecycle & Attendee Management',
    description: 'Create events, manage registrations, validate tickets at entry, track attendance, and generate occupancy reports.',
    coverage: 95,
    vendors: ['NEOX Events'],
    protocols: ['REST', 'Webhook', 'QR/NFC'],
    flowCount: 6,
    version: '2.0.0',
  },
  {
    id: 'tpl-restaurant-ordering',
    domain: 'Restaurant',
    name: 'Restaurant Menu & Ordering',
    description: 'Retrieve menu items, place and manage orders, track order status, and handle cancellations with notification workflow.',
    coverage: 93,
    vendors: ['NEOX Restaurant'],
    protocols: ['REST', 'Webhook'],
    flowCount: 5,
    version: '1.5.0',
  },
  {
    id: 'tpl-waste-tracking',
    domain: 'Waste Management',
    name: 'Waste Container Tracking',
    description: 'Monitor container fill levels, schedule pickups, track collection routes, and generate sustainability reports.',
    coverage: 82,
    vendors: ['WasteTracker'],
    protocols: ['REST', 'MQTT'],
    flowCount: 4,
    version: '1.2.0',
  },
]

// ─── Domain config ────────────────────────────────────────────────────────────

const DOMAIN_CONFIG: Record<Domain, { color: string; icon: React.ReactNode }> = {
  'BMS': {
    color: IS.cyan,
    icon: <BuildingRegular style={{ width: '20px', height: '20px' }} />,
  },
  'AV/VC': {
    color: IS.purple,
    icon: <VideoRegular style={{ width: '20px', height: '20px' }} />,
  },
  'IoT': {
    color: IS.green,
    icon: <Wifi1Regular style={{ width: '20px', height: '20px' }} />,
  },
  'Access Control': {
    color: IS.red,
    icon: <ShieldKeyholeRegular style={{ width: '20px', height: '20px' }} />,
  },
  'Digital Badge': {
    color: IS.gold,
    icon: <ShieldKeyholeRegular style={{ width: '20px', height: '20px' }} />,
  },
  'Locker': {
    color: IS.yellow,
    icon: <LockClosedRegular style={{ width: '20px', height: '20px' }} />,
  },
  'Ticketing': {
    color: IS.orange,
    icon: <TicketHorizontalRegular style={{ width: '20px', height: '20px' }} />,
  },
  'Elevator': {
    color: IS.blue,
    icon: <ArrowUpRegular style={{ width: '20px', height: '20px' }} />,
  },
  'Visitor': {
    color: IS.green,
    icon: <PersonBoardRegular style={{ width: '20px', height: '20px' }} />,
  },
  'Parking': {
    color: IS.blue,
    icon: <VehicleCarParkingRegular style={{ width: '20px', height: '20px' }} />,
  },
  'Event Management': {
    color: IS.orange,
    icon: <TicketDiagonalRegular style={{ width: '20px', height: '20px' }} />,
  },
  'Restaurant': {
    color: IS.gold,
    icon: <FoodRegular style={{ width: '20px', height: '20px' }} />,
  },
  'Waste Management': {
    color: IS.cyan,
    icon: <DeleteRegular style={{ width: '20px', height: '20px' }} />,
  },
}

// ─── Shared sub-components ────────────────────────────────────────────────────

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: '32px', left: '50%',
      backgroundColor: IS.green, color: IS.textWhite,
      padding: '12px 24px', borderRadius: '10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      fontSize: '14px', fontWeight: 600, ...fontBase,
      display: 'flex', alignItems: 'center', gap: '8px',
      zIndex: 10000,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(16px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      pointerEvents: 'none',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  )
}

function TemplateCard({ template, onUse }: { template: Template; onUse: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [btnHov, setBtnHov] = useState(false)
  const cfg = DOMAIN_CONFIG[template.domain]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: IS.cardBg,
        border: `1px solid ${hovered ? cfg.color + '60' : IS.cardBorder}`,
        borderRadius: '14px',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.25)` : '0 2px 8px rgba(0,0,0,0.15)',
        cursor: 'default',
      }}
    >
      {/* Card accent strip */}
      <div style={{ height: '3px', backgroundColor: cfg.color, opacity: hovered ? 1 : 0.5, transition: 'opacity 0.2s ease' }} />

      {/* Body */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* Domain icon */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
            backgroundColor: `${cfg.color}1A`, border: `1px solid ${cfg.color}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: cfg.color,
          }}>
            {cfg.icon}
          </div>

          {/* Name + domain + version */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...fontBase, color: IS.textWhite, fontWeight: 700, fontSize: '14px', lineHeight: 1.3, marginBottom: '4px' }}>
              {template.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{
                ...fontBase, padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                color: cfg.color, backgroundColor: `${cfg.color}18`, border: `1px solid ${cfg.color}30`,
              }}>
                {template.domain}
              </span>
              <span style={{ ...fontBase, color: IS.muted, fontSize: '11px' }}>v{template.version}</span>
            </div>
          </div>

          {/* Coverage badge */}
          <div style={{ flexShrink: 0 }}>
            <CoverageBadge percent={template.coverage} />
          </div>
        </div>

        {/* Description */}
        <p style={{ ...fontBase, color: IS.label, fontSize: '12px', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
          {template.description}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div>
            <div style={{ ...fontBase, color: IS.muted, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Flows</div>
            <div style={{ ...fontBase, color: IS.text, fontSize: '16px', fontWeight: 800 }}>{template.flowCount}</div>
          </div>
          <div>
            <div style={{ ...fontBase, color: IS.muted, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Protocols</div>
            <div style={{ ...fontBase, color: IS.text, fontSize: '12px', fontWeight: 600, marginTop: '3px' }}>{template.protocols.join(' · ')}</div>
          </div>
        </div>

        {/* Vendor tags */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {template.vendors.map(v => (
            <span key={String(v)} style={{
              ...fontBase, padding: '2px 8px', borderRadius: '5px',
              fontSize: '11px', fontWeight: 500,
              color: IS.label, backgroundColor: `${IS.inputBorder}20`,
              border: `1px solid ${IS.inputBorder}50`,
              whiteSpace: 'nowrap',
            }}>
              {String(v)}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: `1px solid ${IS.cardBorder}`,
        backgroundColor: IS.cardBg2,
        display: 'flex', justifyContent: 'flex-end',
      }}>
        <button
          onClick={onUse}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            ...fontBase,
            padding: '8px 18px', borderRadius: '8px',
            fontSize: '13px', fontWeight: 600,
            color: IS.textWhite,
            backgroundColor: btnHov ? cfg.color : `${cfg.color}CC`,
            border: `1px solid ${cfg.color}`,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            transition: 'background-color 0.15s ease',
            outline: 'none',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          Use Template
        </button>
      </div>
    </div>
  )
}

// ─── Domain filter pill ───────────────────────────────────────────────────────

function DomainPill({ domain, active, onClick }: { domain: string; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  const cfg = domain === 'All' ? null : DOMAIN_CONFIG[domain as Domain]
  const color = cfg ? cfg.color : IS.blue

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...fontBase,
        padding: '6px 14px', borderRadius: '20px',
        fontSize: '12px', fontWeight: active ? 700 : 500,
        color: active ? IS.textWhite : hov ? color : IS.label,
        backgroundColor: active ? color : hov ? `${color}18` : 'transparent',
        border: `1px solid ${active ? color : hov ? color + '50' : IS.cardBorder}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        outline: 'none',
        whiteSpace: 'nowrap',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
      }}
    >
      {cfg && (
        <span style={{ opacity: active ? 1 : 0.7, lineHeight: 1, display: 'flex', color: active ? IS.textWhite : color }}>
          {cfg.icon}
        </span>
      )}
      {domain}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ISTemplates() {
  const [search, setSearch] = useState('')
  const [selectedDomain, setSelectedDomain] = useState<string>('All')
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const domains = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.domain)))] as string[]

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchesDomain = selectedDomain === 'All' || t.domain === selectedDomain
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.vendors.some(v => v.toLowerCase().includes(q)) ||
        t.protocols.some(p => p.toLowerCase().includes(q))
      return matchesDomain && matchesSearch
    })
  }, [search, selectedDomain])

  const handleUse = (tpl: Template) => {
    setToastMsg(`Template "${tpl.name}" applied successfully`)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2800)
  }

  // Group filtered by domain for rendering
  const grouped = useMemo(() => {
    const map = new Map<string, Template[]>()
    for (const t of filtered) {
      const arr = map.get(t.domain) ?? []
      arr.push(t)
      map.set(t.domain, arr)
    }
    return map
  }, [filtered])

  return (
    <div style={{
      ...fontBase,
      backgroundColor: IS.pageBg,
      minHeight: '100vh',
      padding: '28px 32px',
      color: IS.text,
    }}>
      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            backgroundColor: `${IS.gold}1A`, border: `1px solid ${IS.gold}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <BookTemplateRegular style={{ width: '20px', height: '20px', color: IS.gold }} />
          </div>
          <div>
            <h1 style={{ ...fontBase, margin: 0, color: IS.textWhite, fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Templates Library
            </h1>
            <p style={{ ...fontBase, margin: 0, color: IS.label, fontSize: '13px', marginTop: '2px' }}>
              {TEMPLATES.length} pre-built integration templates across {domains.length - 1} domains
            </p>
          </div>
        </div>
      </div>

      {/* Search + filter toolbar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
          <div style={{
            position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)',
            color: searchFocused ? IS.blue : IS.muted, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', transition: 'color 0.15s ease',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search templates, vendors, protocols..."
            style={{
              ...fontBase,
              width: '100%', boxSizing: 'border-box',
              padding: '9px 12px 9px 34px',
              backgroundColor: IS.inputBg,
              border: `1px solid ${searchFocused ? IS.blue : IS.inputBorder}`,
              borderRadius: '8px',
              color: IS.text, fontSize: '13px', outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              boxShadow: searchFocused ? `0 0 0 3px ${IS.blue}25` : 'none',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: IS.muted,
                display: 'flex', alignItems: 'center', padding: '2px',
              }}
              title="Clear search"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Domain filter pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
          {domains.map(d => (
            <DomainPill
              key={d}
              domain={d}
              active={selectedDomain === d}
              onClick={() => setSelectedDomain(d)}
            />
          ))}
        </div>

        {/* Result count */}
        <span style={{ ...fontBase, color: IS.muted, fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {filtered.length} {filtered.length === 1 ? 'template' : 'templates'}
        </span>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '80px 24px', gap: '16px',
        }}>
          <div style={{ color: IS.muted, opacity: 0.4 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div style={{ ...fontBase, color: IS.label, fontSize: '15px', fontWeight: 600 }}>No templates found</div>
          <div style={{ ...fontBase, color: IS.muted, fontSize: '13px' }}>
            Try adjusting your search query or domain filter
          </div>
          <ISButton variant="secondary" onClick={() => { setSearch(''); setSelectedDomain('All') }}>
            Clear filters
          </ISButton>
        </div>
      ) : selectedDomain !== 'All' ? (
        // Flat grid when domain is filtered
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '16px',
        }}>
          {filtered.map(tpl => (
            <TemplateCard key={tpl.id} template={tpl} onUse={() => handleUse(tpl)} />
          ))}
        </div>
      ) : (
        // Grouped by domain
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Array.from(grouped.entries()).map(([domain, templates]) => {
            const cfg = DOMAIN_CONFIG[domain as Domain]
            return (
              <div key={domain}>
                {/* Domain section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    backgroundColor: `${cfg.color}1A`, border: `1px solid ${cfg.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: cfg.color,
                  }}>
                    {cfg.icon}
                  </div>
                  <span style={{ ...fontBase, color: cfg.color, fontWeight: 700, fontSize: '14px' }}>{domain}</span>
                  <span style={{ ...fontBase, color: IS.muted, fontSize: '12px' }}>
                    {templates.length} {templates.length === 1 ? 'template' : 'templates'}
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: `${cfg.color}20` }} />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '16px',
                }}>
                  {templates.map(tpl => (
                    <TemplateCard key={tpl.id} template={tpl} onUse={() => handleUse(tpl)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Toast notification */}
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  )
}
