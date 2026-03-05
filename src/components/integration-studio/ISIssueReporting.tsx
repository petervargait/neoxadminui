'use client'

import React, { useState } from 'react'
import {
  IS,
  ISCard,
  ISTable,
  ISModal,
  ISInput,
  ISSelect,
  ISButton,
  ISTabBar,
  StatusBadge,
} from './ISShared'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string
  name: string
  parent: string | null
  level: number
  requiredFields: string[]
  defaultPriority: 'P1' | 'P2' | 'P3' | 'P4'
  slaPolicy: string
  children?: Category[]
}

interface RoutingRule {
  id: string
  priority: number
  conditionsSummary: string
  backend: string
  queue: string
  escalation: string
  conditions: {
    category: string
    site: string
    priority: string
    timeWindow: string
  }
  actions: {
    backendConnector: string
    queue: string
    assigneePolicy: string
    escalationTimer: string
  }
}

interface Backend {
  id: string
  name: string
  type: string
  status: 'ok' | 'warning' | 'critical' | 'inactive'
  operations: string[]
  endpoint: string
  lastSync: string
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: 'itc',
    name: 'ITC',
    parent: null,
    level: 0,
    requiredFields: ['location', 'description'],
    defaultPriority: 'P3',
    slaPolicy: 'Standard SLA',
    children: [
      {
        id: 'itc-network',
        name: 'Network',
        parent: 'itc',
        level: 1,
        requiredFields: ['location', 'description', 'ipAddress'],
        defaultPriority: 'P2',
        slaPolicy: 'Network SLA (4h)',
      },
      {
        id: 'itc-workplace',
        name: 'Workplace',
        parent: 'itc',
        level: 1,
        requiredFields: ['location', 'description', 'assetTag'],
        defaultPriority: 'P3',
        slaPolicy: 'Workplace SLA (8h)',
      },
    ],
  },
  {
    id: 'fm',
    name: 'FM',
    parent: null,
    level: 0,
    requiredFields: ['location', 'description'],
    defaultPriority: 'P3',
    slaPolicy: 'Standard SLA',
    children: [
      {
        id: 'fm-hvac',
        name: 'HVAC',
        parent: 'fm',
        level: 1,
        requiredFields: ['location', 'description', 'roomTemp'],
        defaultPriority: 'P2',
        slaPolicy: 'HVAC SLA (2h)',
      },
      {
        id: 'fm-lighting',
        name: 'Lighting',
        parent: 'fm',
        level: 1,
        requiredFields: ['location', 'description'],
        defaultPriority: 'P4',
        slaPolicy: 'FM Standard (24h)',
      },
      {
        id: 'fm-plumbing',
        name: 'Plumbing',
        parent: 'fm',
        level: 1,
        requiredFields: ['location', 'description', 'urgency'],
        defaultPriority: 'P2',
        slaPolicy: 'Plumbing SLA (1h)',
      },
    ],
  },
  {
    id: 'avvc',
    name: 'AV/VC',
    parent: null,
    level: 0,
    requiredFields: ['location', 'description'],
    defaultPriority: 'P2',
    slaPolicy: 'AV SLA',
    children: [
      {
        id: 'avvc-meetingroom',
        name: 'Meeting Room',
        parent: 'avvc',
        level: 1,
        requiredFields: ['roomName', 'description', 'meetingTime'],
        defaultPriority: 'P2',
        slaPolicy: 'AV SLA (1h)',
        children: [
          {
            id: 'avvc-mr-teamscodec',
            name: 'Teams Codec',
            parent: 'avvc-meetingroom',
            level: 2,
            requiredFields: ['roomName', 'codecSerial', 'description'],
            defaultPriority: 'P1',
            slaPolicy: 'AV NOC SLA (30m)',
          },
          {
            id: 'avvc-mr-display',
            name: 'Display',
            parent: 'avvc-meetingroom',
            level: 2,
            requiredFields: ['roomName', 'displaySerial', 'description'],
            defaultPriority: 'P2',
            slaPolicy: 'AV SLA (2h)',
          },
        ],
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    parent: null,
    level: 0,
    requiredFields: ['location', 'description', 'incidentType'],
    defaultPriority: 'P1',
    slaPolicy: 'Security SLA (15m)',
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    parent: null,
    level: 0,
    requiredFields: ['location', 'description'],
    defaultPriority: 'P4',
    slaPolicy: 'Cleaning SLA (4h)',
  },
  {
    id: 'catering',
    name: 'Catering',
    parent: null,
    level: 0,
    requiredFields: ['location', 'description', 'headcount'],
    defaultPriority: 'P3',
    slaPolicy: 'Catering SLA (2h)',
  },
  {
    id: 'hse',
    name: 'HSE',
    parent: null,
    level: 0,
    requiredFields: ['location', 'description', 'riskLevel', 'witnessName'],
    defaultPriority: 'P1',
    slaPolicy: 'HSE SLA (Immediate)',
  },
]

const ROUTING_RULES: RoutingRule[] = [
  {
    id: 'rr-1',
    priority: 1,
    conditionsSummary: 'Category=AV/VC & Priority≤P2',
    backend: 'AV NOC',
    queue: 'av-critical',
    escalation: '30m → On-Call Eng',
    conditions: { category: 'avvc', site: 'any', priority: 'P1,P2', timeWindow: 'always' },
    actions: { backendConnector: 'av-noc', queue: 'av-critical', assigneePolicy: 'Round Robin', escalationTimer: '30m' },
  },
  {
    id: 'rr-2',
    priority: 2,
    conditionsSummary: 'Category=Security',
    backend: 'ServiceNow ITSM',
    queue: 'security-incidents',
    escalation: '15m → Security Manager',
    conditions: { category: 'security', site: 'any', priority: 'any', timeWindow: 'always' },
    actions: { backendConnector: 'servicenow', queue: 'security-incidents', assigneePolicy: 'Fixed: Security Team', escalationTimer: '15m' },
  },
  {
    id: 'rr-3',
    priority: 3,
    conditionsSummary: 'Category=HSE',
    backend: 'ServiceNow ITSM',
    queue: 'hse-queue',
    escalation: '10m → HSE Manager',
    conditions: { category: 'hse', site: 'any', priority: 'any', timeWindow: 'always' },
    actions: { backendConnector: 'servicenow', queue: 'hse-queue', assigneePolicy: 'Fixed: HSE Lead', escalationTimer: '10m' },
  },
  {
    id: 'rr-4',
    priority: 4,
    conditionsSummary: 'Category=FM & Site=HQ & Business Hours',
    backend: 'Archibus CAFM',
    queue: 'fm-hq',
    escalation: '4h → FM Supervisor',
    conditions: { category: 'fm', site: 'HQ', priority: 'any', timeWindow: '08:00-18:00 Mon-Fri' },
    actions: { backendConnector: 'archibus', queue: 'fm-hq', assigneePolicy: 'Skills Match', escalationTimer: '4h' },
  },
  {
    id: 'rr-5',
    priority: 5,
    conditionsSummary: 'Category=ITC',
    backend: 'Jira ITSM',
    queue: 'itc-general',
    escalation: '8h → IT Lead',
    conditions: { category: 'itc', site: 'any', priority: 'any', timeWindow: 'always' },
    actions: { backendConnector: 'jira', queue: 'itc-general', assigneePolicy: 'Load Balance', escalationTimer: '8h' },
  },
  {
    id: 'rr-6',
    priority: 6,
    conditionsSummary: 'Default (catch-all)',
    backend: 'ServiceNow ITSM',
    queue: 'default',
    escalation: '24h → Operations',
    conditions: { category: 'any', site: 'any', priority: 'any', timeWindow: 'always' },
    actions: { backendConnector: 'servicenow', queue: 'default', assigneePolicy: 'Round Robin', escalationTimer: '24h' },
  },
]

const BACKENDS: Backend[] = [
  {
    id: 'archibus',
    name: 'Archibus CAFM',
    type: 'CAFM/EAM',
    status: 'ok',
    operations: ['CreateTicket', 'UpdateTicket', 'AddComment', 'CloseTicket', 'GetStatus'],
    endpoint: 'https://archibus.corp.example.com/api/v2',
    lastSync: '2 min ago',
  },
  {
    id: 'servicenow',
    name: 'ServiceNow ITSM',
    type: 'ITSM',
    status: 'ok',
    operations: ['CreateTicket', 'UpdateTicket', 'AddComment', 'CloseTicket', 'GetStatus', 'ListQueues', 'AssignTicket'],
    endpoint: 'https://example.service-now.com/api/now/v2',
    lastSync: '1 min ago',
  },
  {
    id: 'jira',
    name: 'Jira ITSM',
    type: 'ITSM',
    status: 'warning',
    operations: ['CreateTicket', 'UpdateTicket', 'AddComment', 'CloseTicket', 'GetStatus'],
    endpoint: 'https://example.atlassian.net/rest/api/3',
    lastSync: '18 min ago',
  },
  {
    id: 'av-noc',
    name: 'AV NOC Tracker',
    type: 'AV NOC',
    status: 'ok',
    operations: ['CreateTicket', 'UpdateTicket', 'AddComment', 'Escalate'],
    endpoint: 'https://avnoc.internal/api/tickets',
    lastSync: '30 sec ago',
  },
  {
    id: 'maximo',
    name: 'IBM Maximo EAM',
    type: 'CAFM/EAM',
    status: 'inactive',
    operations: ['CreateTicket', 'UpdateTicket', 'GetStatus'],
    endpoint: 'https://maximo.corp.example.com/maximo/oslc',
    lastSync: 'Never',
  },
]

// ─── Shared sub-components ───────────────────────────────────────────────────

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

function PriorityBadge({ priority }: { priority: string }) {
  const cfg: Record<string, { color: string; label: string }> = {
    P1: { color: IS.red,    label: 'P1 Critical' },
    P2: { color: IS.orange, label: 'P2 High' },
    P3: { color: IS.yellow, label: 'P3 Medium' },
    P4: { color: IS.green,  label: 'P4 Low' },
  }
  const { color, label } = cfg[priority] ?? { color: IS.muted, label: priority }
  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 9px',
      borderRadius: '20px',
      backgroundColor: `${color}1A`,
      border: `1px solid ${color}40`,
      fontSize: '11px',
      fontWeight: 700,
      color,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

function Tag({ label, color = IS.blue }: { label: string; color?: string }) {
  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '6px',
      backgroundColor: `${color}18`,
      border: `1px solid ${color}30`,
      fontSize: '11px',
      fontWeight: 600,
      color,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

function IconBtn({
  title,
  onClick,
  color = IS.label,
  children,
}: {
  title: string
  onClick: () => void
  color?: string
  children: React.ReactNode
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...fontBase,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        background: hov ? `${color}18` : 'transparent',
        border: `1px solid ${hov ? color : 'transparent'}`,
        color: hov ? color : IS.label,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        padding: 0,
      }}
    >
      {children}
    </button>
  )
}

// ─── Taxonomy Tab ─────────────────────────────────────────────────────────────

function CategoryRow({
  cat,
  onEdit,
  onDelete,
}: {
  cat: Category
  onEdit: (c: Category) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = cat.children && cat.children.length > 0
  const indent = cat.level * 24

  return (
    <>
      <tr style={{ borderBottom: `1px solid ${IS.cardBorder}40` }}>
        <td style={{ padding: '10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: `${indent}px` }}>
            {hasChildren ? (
              <button
                onClick={() => setExpanded(p => !p)}
                style={{
                  ...fontBase,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: IS.muted,
                  padding: '0 2px',
                  fontSize: '12px',
                  lineHeight: 1,
                }}
              >
                {expanded ? '▾' : '▸'}
              </button>
            ) : (
              <span style={{ width: '16px', display: 'inline-block', color: IS.muted, fontSize: '10px', textAlign: 'center' }}>·</span>
            )}
            <span style={{ ...fontBase, color: IS.text, fontSize: '13px', fontWeight: cat.level === 0 ? 700 : 500 }}>
              {cat.name}
            </span>
            {cat.level === 0 && (
              <span style={{ ...fontBase, fontSize: '10px', color: IS.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Root
              </span>
            )}
          </div>
        </td>
        <td style={{ padding: '10px 14px' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {cat.requiredFields.map(f => <Tag key={f} label={f} color={IS.cyan} />)}
          </div>
        </td>
        <td style={{ padding: '10px 14px' }}>
          <PriorityBadge priority={cat.defaultPriority} />
        </td>
        <td style={{ padding: '10px 14px' }}>
          <span style={{ ...fontBase, color: IS.label, fontSize: '12px' }}>{cat.slaPolicy}</span>
        </td>
        <td style={{ padding: '10px 14px' }}>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
            <IconBtn title="Edit" color={IS.blue} onClick={() => onEdit(cat)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </IconBtn>
            <IconBtn title="Delete" color={IS.red} onClick={() => onDelete(cat.id)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </IconBtn>
          </div>
        </td>
      </tr>
      {hasChildren && expanded && cat.children!.map(child => (
        <CategoryRow key={child.id} cat={child} onEdit={onEdit} onDelete={onDelete} />
      ))}
      {hasChildren && expanded && cat.children!.map(child =>
        child.children?.map(grandchild => (
          <CategoryRow key={grandchild.id} cat={grandchild} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </>
  )
}

function TaxonomyTab() {
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatParent, setNewCatParent] = useState('')
  const [newCatPriority, setNewCatPriority] = useState('P3')
  const [newCatSla, setNewCatSla] = useState('')

  const allCatOptions = [
    { value: '', label: '(None — Root category)' },
    ...CATEGORIES.map(c => ({ value: c.id, label: c.name })),
    { value: 'avvc-meetingroom', label: 'AV/VC > Meeting Room' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ ...fontBase, color: IS.label, fontSize: '13px' }}>
            {CATEGORIES.length} root categories · Hierarchical issue taxonomy for routing
          </span>
        </div>
        <ISButton onClick={() => setShowAddModal(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </ISButton>
      </div>

      <ISCard>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', ...fontBase }}>
            <thead>
              <tr>
                {['Category', 'Required Fields', 'Default Priority', 'SLA Policy', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 14px',
                    textAlign: i === 4 ? 'right' : 'left',
                    color: IS.label,
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    backgroundColor: IS.cardBg2,
                    borderBottom: `1px solid ${IS.cardBorder}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map(cat => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  onEdit={setEditCat}
                  onDelete={(id) => console.log('delete', id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </ISCard>

      {/* Add Category Modal */}
      <ISModal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Category" width="480px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ISInput label="Category Name" value={newCatName} onChange={setNewCatName} placeholder="e.g. Electrical" />
          <ISSelect label="Parent Category" value={newCatParent} options={allCatOptions} onChange={setNewCatParent} />
          <ISSelect
            label="Default Priority"
            value={newCatPriority}
            options={[
              { value: 'P1', label: 'P1 — Critical' },
              { value: 'P2', label: 'P2 — High' },
              { value: 'P3', label: 'P3 — Medium' },
              { value: 'P4', label: 'P4 — Low' },
            ]}
            onChange={setNewCatPriority}
          />
          <ISInput label="SLA Policy" value={newCatSla} onChange={setNewCatSla} placeholder="e.g. FM Standard (24h)" />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <ISButton variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</ISButton>
            <ISButton onClick={() => setShowAddModal(false)}>Save Category</ISButton>
          </div>
        </div>
      </ISModal>

      {/* Edit Category Modal */}
      <ISModal open={!!editCat} onClose={() => setEditCat(null)} title={`Edit: ${editCat?.name ?? ''}`} width="480px">
        {editCat && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ISInput label="Category Name" value={editCat.name} onChange={v => setEditCat(p => p ? { ...p, name: v } : null)} />
            <ISSelect
              label="Default Priority"
              value={editCat.defaultPriority}
              options={[
                { value: 'P1', label: 'P1 — Critical' },
                { value: 'P2', label: 'P2 — High' },
                { value: 'P3', label: 'P3 — Medium' },
                { value: 'P4', label: 'P4 — Low' },
              ]}
              onChange={v => setEditCat(p => p ? { ...p, defaultPriority: v as Category['defaultPriority'] } : null)}
            />
            <ISInput label="SLA Policy" value={editCat.slaPolicy} onChange={v => setEditCat(p => p ? { ...p, slaPolicy: v } : null)} />
            <div>
              <span style={{ ...fontBase, color: IS.label, fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Required Fields
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                {editCat.requiredFields.map(f => (
                  <span key={f} style={{
                    ...fontBase,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    backgroundColor: `${IS.cyan}18`,
                    border: `1px solid ${IS.cyan}30`,
                    color: IS.cyan,
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '8px' }}>
              <ISButton variant="secondary" onClick={() => setEditCat(null)}>Cancel</ISButton>
              <ISButton onClick={() => setEditCat(null)}>Save Changes</ISButton>
            </div>
          </div>
        )}
      </ISModal>
    </div>
  )
}

// ─── Routing Rules Tab ────────────────────────────────────────────────────────

function RoutingRulesTab() {
  const [rules, setRules] = useState<RoutingRule[]>(ROUTING_RULES)
  const [editRule, setEditRule] = useState<RoutingRule | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const moveRule = (idx: number, dir: -1 | 1) => {
    const newRules = [...rules]
    const target = idx + dir
    if (target < 0 || target >= newRules.length) return
    ;[newRules[idx], newRules[target]] = [newRules[target], newRules[idx]]
    setRules(newRules.map((r, i) => ({ ...r, priority: i + 1 })))
  }

  const blankRule: RoutingRule = {
    id: `rr-${Date.now()}`,
    priority: rules.length + 1,
    conditionsSummary: '',
    backend: '',
    queue: '',
    escalation: '',
    conditions: { category: 'any', site: 'any', priority: 'any', timeWindow: 'always' },
    actions: { backendConnector: '', queue: '', assigneePolicy: 'Round Robin', escalationTimer: '4h' },
  }

  const RuleModal = ({ rule, onClose, title }: { rule: RoutingRule; onClose: () => void; title: string }) => {
    const [local, setLocal] = useState(rule)
    const setCondition = (k: keyof RoutingRule['conditions'], v: string) =>
      setLocal(p => ({ ...p, conditions: { ...p.conditions, [k]: v } }))
    const setAction = (k: keyof RoutingRule['actions'], v: string) =>
      setLocal(p => ({ ...p, actions: { ...p.actions, [k]: v } }))

    return (
      <ISModal open title={title} onClose={onClose} width="620px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Conditions */}
          <div>
            <div style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Conditions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <ISSelect
                label="Category"
                value={local.conditions.category}
                onChange={v => setCondition('category', v)}
                options={[
                  { value: 'any', label: 'Any' },
                  ...CATEGORIES.map(c => ({ value: c.id, label: c.name })),
                ]}
              />
              <ISInput label="Site" value={local.conditions.site} onChange={v => setCondition('site', v)} placeholder="any" />
              <ISSelect
                label="Priority"
                value={local.conditions.priority}
                onChange={v => setCondition('priority', v)}
                options={[
                  { value: 'any', label: 'Any' },
                  { value: 'P1', label: 'P1 Critical' },
                  { value: 'P2', label: 'P2 High' },
                  { value: 'P1,P2', label: 'P1 + P2' },
                  { value: 'P3', label: 'P3 Medium' },
                  { value: 'P4', label: 'P4 Low' },
                ]}
              />
              <ISInput label="Time Window" value={local.conditions.timeWindow} onChange={v => setCondition('timeWindow', v)} placeholder="e.g. 08:00-18:00 Mon-Fri" />
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${IS.cardBorder}` }} />

          {/* Actions */}
          <div>
            <div style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Actions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <ISSelect
                label="Backend Connector"
                value={local.actions.backendConnector}
                onChange={v => setAction('backendConnector', v)}
                options={[
                  { value: '', label: '— Select backend —' },
                  ...BACKENDS.map(b => ({ value: b.id, label: b.name })),
                ]}
              />
              <ISInput label="Queue" value={local.actions.queue} onChange={v => setAction('queue', v)} placeholder="e.g. fm-hq" />
              <ISSelect
                label="Assignee Policy"
                value={local.actions.assigneePolicy}
                onChange={v => setAction('assigneePolicy', v)}
                options={[
                  { value: 'Round Robin', label: 'Round Robin' },
                  { value: 'Load Balance', label: 'Load Balance' },
                  { value: 'Skills Match', label: 'Skills Match' },
                  { value: 'Fixed: Security Team', label: 'Fixed: Security Team' },
                  { value: 'Fixed: HSE Lead', label: 'Fixed: HSE Lead' },
                ]}
              />
              <ISInput label="Escalation Timer" value={local.actions.escalationTimer} onChange={v => setAction('escalationTimer', v)} placeholder="e.g. 30m" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
            <ISButton variant="secondary" onClick={onClose}>Cancel</ISButton>
            <ISButton onClick={onClose}>Save Rule</ISButton>
          </div>
        </div>
      </ISModal>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ ...fontBase, color: IS.label, fontSize: '13px' }}>
          Rules are evaluated top-to-bottom. First match wins.
        </span>
        <ISButton onClick={() => { setEditRule(blankRule); setShowCreate(true) }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Rule
        </ISButton>
      </div>

      <ISCard>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', ...fontBase }}>
            <thead>
              <tr>
                {['Order', 'Conditions', 'Backend', 'Queue', 'Escalation', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 14px',
                    textAlign: i === 5 ? 'right' : 'left',
                    color: IS.label,
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    backgroundColor: IS.cardBg2,
                    borderBottom: `1px solid ${IS.cardBorder}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, idx) => (
                <tr
                  key={rule.id}
                  style={{ borderBottom: `1px solid ${IS.cardBorder}40` }}
                >
                  <td style={{ padding: '10px 14px', width: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ ...fontBase, color: IS.text, fontWeight: 700, fontSize: '14px', minWidth: '20px' }}>
                        {rule.priority}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button
                          onClick={() => moveRule(idx, -1)}
                          disabled={idx === 0}
                          style={{
                            ...fontBase,
                            background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            color: idx === 0 ? IS.muted : IS.label, padding: '1px', fontSize: '10px', lineHeight: 1,
                            opacity: idx === 0 ? 0.4 : 1,
                          }}
                          title="Move up"
                        >▲</button>
                        <button
                          onClick={() => moveRule(idx, 1)}
                          disabled={idx === rules.length - 1}
                          style={{
                            ...fontBase,
                            background: 'none', border: 'none', cursor: idx === rules.length - 1 ? 'not-allowed' : 'pointer',
                            color: idx === rules.length - 1 ? IS.muted : IS.label, padding: '1px', fontSize: '10px', lineHeight: 1,
                            opacity: idx === rules.length - 1 ? 0.4 : 1,
                          }}
                          title="Move down"
                        >▼</button>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', maxWidth: '240px' }}>
                    <span style={{ ...fontBase, color: IS.text, fontSize: '12px' }}>{rule.conditionsSummary}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Tag label={rule.backend} color={IS.purple} />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ ...fontBase, color: IS.label, fontSize: '12px', fontFamily: "'Fira Code', monospace" }}>{rule.queue}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ ...fontBase, color: IS.orange, fontSize: '12px' }}>{rule.escalation}</span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <IconBtn title="Edit rule" color={IS.blue} onClick={() => { setEditRule(rule); setShowCreate(false) }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </IconBtn>
                      <IconBtn title="Delete rule" color={IS.red} onClick={() => setRules(p => p.filter(r => r.id !== rule.id).map((r, i) => ({ ...r, priority: i + 1 })))}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ISCard>

      {editRule && (
        <RuleModal
          rule={editRule}
          title={showCreate ? 'Create Routing Rule' : 'Edit Routing Rule'}
          onClose={() => { setEditRule(null); setShowCreate(false) }}
        />
      )}
    </div>
  )
}

// ─── Backends Tab ─────────────────────────────────────────────────────────────

function BackendsTab() {
  const [selected, setSelected] = useState<Backend | null>(null)

  const opColor: Record<string, string> = {
    CreateTicket: IS.green,
    UpdateTicket: IS.blue,
    AddComment: IS.cyan,
    CloseTicket: IS.purple,
    GetStatus: IS.yellow,
    ListQueues: IS.orange,
    AssignTicket: IS.gold,
    Escalate: IS.red,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ ...fontBase, color: IS.label, fontSize: '13px' }}>
          {BACKENDS.filter(b => b.status === 'ok').length} of {BACKENDS.length} connectors healthy
        </span>
        <ISButton>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Backend
        </ISButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {BACKENDS.map(b => (
          <div
            key={b.id}
            onClick={() => setSelected(selected?.id === b.id ? null : b)}
            style={{
              backgroundColor: IS.cardBg,
              border: `1px solid ${selected?.id === b.id ? IS.blue : IS.cardBorder}`,
              borderRadius: '10px',
              padding: '16px 20px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background-color 0.15s ease',
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                backgroundColor: `${IS.blue}18`, border: `1px solid ${IS.blue}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={IS.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ ...fontBase, color: IS.text, fontWeight: 700, fontSize: '14px' }}>{b.name}</span>
                  <Tag label={b.type} color={IS.purple} />
                  <StatusBadge status={b.status} />
                </div>
                <div style={{ ...fontBase, color: IS.muted, fontSize: '12px', marginTop: '2px', fontFamily: "'Fira Code', monospace" }}>
                  {b.endpoint}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ ...fontBase, color: IS.muted, fontSize: '11px' }}>Last sync</div>
                <div style={{ ...fontBase, color: IS.label, fontSize: '12px', fontWeight: 600 }}>{b.lastSync}</div>
              </div>
            </div>

            {/* Operations */}
            <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {b.operations.map(op => (
                <span key={op} style={{
                  ...fontBase,
                  padding: '2px 9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: opColor[op] ?? IS.label,
                  backgroundColor: `${opColor[op] ?? IS.label}15`,
                  border: `1px solid ${opColor[op] ?? IS.label}30`,
                }}>
                  {op}
                </span>
              ))}
            </div>

            {/* Expanded details */}
            {selected?.id === b.id && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${IS.cardBorder}`, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Configuration
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      { label: 'Backend ID', value: b.id },
                      { label: 'Type', value: b.type },
                      { label: 'Endpoint', value: b.endpoint },
                      { label: 'Auth', value: 'OAuth 2.0 / Service Account' },
                      { label: 'Timeout', value: '30s' },
                      { label: 'Retry Policy', value: 'Exponential backoff (3x)' },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ ...fontBase, color: IS.muted, fontSize: '12px', minWidth: '120px' }}>{row.label}:</span>
                        <span style={{ ...fontBase, color: IS.text, fontSize: '12px', fontFamily: row.label === 'Endpoint' || row.label === 'Backend ID' ? "'Fira Code', monospace" : 'inherit' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexShrink: 0 }}>
                  <ISButton variant="secondary">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
                    </svg>
                    Test Connection
                  </ISButton>
                  <ISButton variant="secondary">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </ISButton>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ISIssueReporting() {
  const [activeTab, setActiveTab] = useState('taxonomy')

  const tabs = [
    { id: 'taxonomy',      label: 'Taxonomy' },
    { id: 'routing-rules', label: 'Routing Rules' },
    { id: 'backends',      label: 'Backends' },
  ]

  return (
    <div style={{
      ...fontBase,
      backgroundColor: IS.pageBg,
      minHeight: '100vh',
      padding: '28px 32px',
      color: IS.text,
    }}>
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            backgroundColor: `${IS.orange}1A`, border: `1px solid ${IS.orange}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={IS.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h1 style={{ ...fontBase, margin: 0, color: IS.textWhite, fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Issue Reporting
            </h1>
            <p style={{ ...fontBase, margin: 0, color: IS.label, fontSize: '13px', marginTop: '2px' }}>
              Service Desk domain — taxonomy, routing rules &amp; backend connectors
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ marginBottom: '24px' }}>
        <ISTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab content */}
      {activeTab === 'taxonomy'      && <TaxonomyTab />}
      {activeTab === 'routing-rules' && <RoutingRulesTab />}
      {activeTab === 'backends'      && <BackendsTab />}
    </div>
  )
}
