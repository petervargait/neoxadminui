'use client'

import React, { useState, useMemo } from 'react'
import {
  IS,
  ISButton,
  CoverageBadge,
} from './ISShared'

// ─── Types ────────────────────────────────────────────────────────────────────

type Domain =
  | 'Parking'
  | 'Access Control'
  | 'Visitor'
  | 'Locker'
  | 'Rooms'
  | 'AV/VC'
  | 'Events'
  | 'Issue Reporting'
  | 'Identity'

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
    id: 'tpl-parking-reservation',
    domain: 'Parking',
    name: 'Parking Reservation',
    description: 'Full reservation lifecycle: search availability, create booking, modify/cancel, send confirmation notification, and release space on check-out.',
    coverage: 92,
    vendors: ['SKIDATA', 'Parkmobile', 'YellowGate'],
    protocols: ['REST', 'Webhook'],
    flowCount: 6,
    version: '2.3.1',
  },
  {
    id: 'tpl-parking-whitelist',
    domain: 'Parking',
    name: 'Parking Whitelist Sync',
    description: 'Synchronize license plate whitelists and permit allocations between the identity directory and parking barrier control systems.',
    coverage: 85,
    vendors: ['SKIDATA', 'Nedap', 'Amano'],
    protocols: ['REST', 'SFTP'],
    flowCount: 4,
    version: '1.8.0',
  },
  {
    id: 'tpl-access-credential',
    domain: 'Access Control',
    name: 'Credential Lifecycle',
    description: 'Provision, update, suspend, and revoke access credentials (physical badge or mobile key) driven by HR/directory lifecycle events.',
    coverage: 94,
    vendors: ['Lenel S2', 'Genetec', 'Honeywell Pro-Watch', 'ASSA ABLOY'],
    protocols: ['REST', 'SDK'],
    flowCount: 8,
    version: '3.1.0',
  },
  {
    id: 'tpl-visitor-prereg',
    domain: 'Visitor',
    name: 'Visitor Pre-registration & Approval',
    description: 'Host-initiated visitor invite, multi-step approval workflow, automatic temp-badge provisioning on approval, and check-in/check-out audit trail.',
    coverage: 88,
    vendors: ['Envoy', 'ProxyClick', 'Honeywell VEMS', 'Lenel S2'],
    protocols: ['REST', 'Webhook', 'SMTP'],
    flowCount: 7,
    version: '2.0.2',
  },
  {
    id: 'tpl-locker-booking',
    domain: 'Locker',
    name: 'Locker Booking & Unlock',
    description: 'Reserve a locker for a session or recurring period, auto-assign based on proximity rules, and trigger remote unlock via mobile or badge.',
    coverage: 79,
    vendors: ['Sievert', 'Bisley Smart', 'Veska'],
    protocols: ['REST', 'BLE'],
    flowCount: 5,
    version: '1.5.0',
  },
  {
    id: 'tpl-rooms-availability',
    domain: 'Rooms',
    name: 'Room Availability & Booking',
    description: 'Real-time room availability feed, instant booking with conflict prevention, room release on no-show, and calendar integration for meeting platforms.',
    coverage: 96,
    vendors: ['Condeco', 'Planon', 'EMS', 'Robin', 'Microsoft Places'],
    protocols: ['REST', 'GraphAPI', 'Exchange EWS'],
    flowCount: 9,
    version: '4.2.0',
  },
  {
    id: 'tpl-avvc-device',
    domain: 'AV/VC',
    name: 'AV Device Status & Alerting',
    description: 'Poll or receive push events for AV device health (codec, display, DSP), normalize to a common schema, and route alerts to the AV NOC or ITSM.',
    coverage: 81,
    vendors: ['Cisco Webex', 'Poly', 'Crestron', 'QSC', 'Extron'],
    protocols: ['REST', 'xAPI', 'SNMP', 'Webhook'],
    flowCount: 6,
    version: '2.1.0',
  },
  {
    id: 'tpl-events-ticket',
    domain: 'Events',
    name: 'Event Ticket Validation',
    description: 'Ingest ticket scan events, validate against booking system, grant or deny access, handle duplicates, and produce real-time occupancy counts.',
    coverage: 76,
    vendors: ['Ticketmaster', 'Eventbrite', 'Secutix', 'Lenel S2'],
    protocols: ['REST', 'Webhook', 'QR/NFC'],
    flowCount: 5,
    version: '1.2.0',
  },
  {
    id: 'tpl-issue-ticket',
    domain: 'Issue Reporting',
    name: 'Issue Ticket Lifecycle',
    description: 'Create, update, escalate, and close FM/IT/AV issue tickets across heterogeneous backends (CAFM, ITSM, AV NOC) with unified status tracking.',
    coverage: 90,
    vendors: ['ServiceNow', 'Archibus', 'Jira SM', 'IBM Maximo'],
    protocols: ['REST', 'Webhook'],
    flowCount: 8,
    version: '2.4.1',
  },
  {
    id: 'tpl-identity-entra',
    domain: 'Identity',
    name: 'Entra OIDC + Directory Sync',
    description: 'Full Microsoft Entra ID integration: OIDC SSO with JIT provisioning, scheduled group/user delta sync, and automated role assignment from group claims.',
    coverage: 97,
    vendors: ['Microsoft Entra', 'Azure AD'],
    protocols: ['OIDC', 'MS Graph API', 'SCIM 2.0'],
    flowCount: 7,
    version: '3.0.0',
  },
]

// ─── Domain config ────────────────────────────────────────────────────────────

const DOMAIN_CONFIG: Record<Domain, { color: string; icon: React.ReactNode }> = {
  'Parking': {
    color: IS.blue,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </svg>
    ),
  },
  'Access Control': {
    color: IS.red,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  'Visitor': {
    color: IS.green,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  'Locker': {
    color: IS.yellow,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <line x1="12" y1="14" x2="12" y2="17" />
      </svg>
    ),
  },
  'Rooms': {
    color: IS.cyan,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  'AV/VC': {
    color: IS.purple,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  'Events': {
    color: IS.orange,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8"  y1="2" x2="8"  y2="6" />
        <line x1="3"  y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  'Issue Reporting': {
    color: IS.gold,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  'Identity': {
    color: IS.purple,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={IS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
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
