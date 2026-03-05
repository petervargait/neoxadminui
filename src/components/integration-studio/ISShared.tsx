'use client'

import React, { useState, useEffect, useCallback } from 'react'

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const IS = {
  pageBg: '#08122E',
  cardBg: '#0F1A2E',
  cardBg2: '#162032',
  cardBorder: '#1E3A5F',
  text: '#F1F5F9',
  textWhite: '#FFFFFF',
  label: '#94A3B8',
  muted: '#64748B',
  gold: '#D4A847',
  green: '#10B981',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  red: '#EF4444',
  cyan: '#06B6D4',
  orange: '#F97316',
  yellow: '#FBBF24',
  inputBg: '#1E293B',
  inputBorder: '#475569',
}

// ─── Base font style ──────────────────────────────────────────────────────────
const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: 'ok' | 'warning' | 'critical' | 'inactive' }) {
  const config: Record<typeof status, { color: string; dot: string; label: string }> = {
    ok:       { color: IS.green,  dot: IS.green,  label: 'OK' },
    warning:  { color: IS.yellow, dot: IS.yellow, label: 'Warning' },
    critical: { color: IS.red,    dot: IS.red,    label: 'Critical' },
    inactive: { color: IS.muted,  dot: IS.muted,  label: 'Inactive' },
  }
  const { color, dot, label } = config[status]

  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '3px 10px',
      borderRadius: '20px',
      backgroundColor: `${color}1A`,
      border: `1px solid ${color}40`,
      fontSize: '12px',
      fontWeight: 600,
      color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        backgroundColor: dot,
        flexShrink: 0,
        boxShadow: `0 0 4px ${dot}`,
      }} />
      {label}
    </span>
  )
}

// ─── EnvironmentBadge ─────────────────────────────────────────────────────────
export function EnvironmentBadge({ env }: { env: 'Dev' | 'Test' | 'Prod' }) {
  const config: Record<typeof env, { color: string; bg: string; border: string }> = {
    Dev:  { color: IS.blue,   bg: `${IS.blue}1A`,   border: `${IS.blue}40` },
    Test: { color: IS.yellow, bg: `${IS.yellow}1A`, border: `${IS.yellow}40` },
    Prod: { color: IS.green,  bg: `${IS.green}1A`,  border: `${IS.green}40` },
  }
  const { color, bg, border } = config[env]

  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: '20px',
      backgroundColor: bg,
      border: `1px solid ${border}`,
      fontSize: '12px',
      fontWeight: 700,
      color,
      whiteSpace: 'nowrap',
      letterSpacing: '0.03em',
    }}>
      {env}
    </span>
  )
}

// ─── CoverageBadge ────────────────────────────────────────────────────────────
export function CoverageBadge({ percent }: { percent: number }) {
  const color = percent > 80 ? IS.green : percent > 50 ? IS.yellow : IS.red

  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: '20px',
      backgroundColor: `${color}1A`,
      border: `1px solid ${color}40`,
      fontSize: '12px',
      fontWeight: 700,
      color,
      whiteSpace: 'nowrap',
    }}>
      {percent}%
    </span>
  )
}

// ─── ISCard ───────────────────────────────────────────────────────────────────
export function ISCard({
  children,
  title,
  action,
  style,
}: {
  children: React.ReactNode
  title?: string
  action?: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div style={{
      ...fontBase,
      backgroundColor: IS.cardBg,
      border: `1px solid ${IS.cardBorder}`,
      borderRadius: '12px',
      overflow: 'hidden',
      ...style,
    }}>
      {title && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 20px',
          borderBottom: `1px solid ${IS.cardBorder}`,
          backgroundColor: IS.cardBg2,
        }}>
          <span style={{
            color: IS.text,
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}>
            {title}
          </span>
          {action && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {action}
            </div>
          )}
        </div>
      )}
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  )
}

// ─── ISTable ──────────────────────────────────────────────────────────────────
export interface ISTableColumn {
  key: string
  label: string
  width?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: any) => React.ReactNode
}

export function ISTable({
  columns,
  data,
  onRowClick,
}: {
  columns: ISTableColumn[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av == null) return 1
      if (bv == null) return -1
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  return (
    <div style={{
      ...fontBase,
      width: '100%',
      overflowX: 'auto',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{
                  width: col.width,
                  padding: '10px 14px',
                  textAlign: 'left',
                  color: IS.label,
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  backgroundColor: IS.cardBg2,
                  borderBottom: `1px solid ${IS.cardBorder}`,
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {col.label}
                  {sortKey === col.key ? (
                    <span style={{ color: IS.blue, fontSize: '10px' }}>
                      {sortDir === 'asc' ? '▲' : '▼'}
                    </span>
                  ) : (
                    <span style={{ color: IS.muted, fontSize: '10px', opacity: 0.5 }}>⇅</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  color: IS.muted,
                  fontSize: '13px',
                }}
              >
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  backgroundColor:
                    hoveredRow === i
                      ? `${IS.blue}18`
                      : i % 2 === 0
                      ? 'transparent'
                      : `${IS.cardBg2}80`,
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease',
                  borderBottom: `1px solid ${IS.cardBorder}40`,
                }}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    style={{
                      padding: '10px 14px',
                      color: IS.text,
                      verticalAlign: 'middle',
                      maxWidth: col.width,
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── ISModal ──────────────────────────────────────────────────────────────────
export function ISModal({
  open,
  onClose,
  title,
  children,
  width = '560px',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: string
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...fontBase,
          width,
          maxWidth: '100%',
          maxHeight: 'calc(100vh - 48px)',
          backgroundColor: IS.cardBg,
          border: `1px solid ${IS.cardBorder}`,
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Title bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: `1px solid ${IS.cardBorder}`,
          backgroundColor: IS.cardBg2,
          borderRadius: '14px 14px 0 0',
          flexShrink: 0,
        }}>
          <span style={{
            color: IS.textWhite,
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: IS.muted,
              borderRadius: '6px',
              transition: 'color 0.15s ease, background-color 0.15s ease',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLButtonElement).style.color = IS.text
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = `${IS.inputBorder}40`
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLButtonElement).style.color = IS.muted
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
            }}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{
          overflowY: 'auto',
          padding: '20px',
          flex: 1,
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── ISInput ──────────────────────────────────────────────────────────────────
export function ISInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ ...fontBase, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        color: IS.label,
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...fontBase,
          padding: '9px 12px',
          backgroundColor: IS.inputBg,
          border: `1px solid ${focused ? IS.blue : IS.inputBorder}`,
          borderRadius: '8px',
          color: IS.text,
          fontSize: '13px',
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: focused ? `0 0 0 3px ${IS.blue}25` : 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

// ─── ISSelect ─────────────────────────────────────────────────────────────────
export function ISSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ ...fontBase, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        color: IS.label,
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...fontBase,
            padding: '9px 36px 9px 12px',
            backgroundColor: IS.inputBg,
            border: `1px solid ${focused ? IS.blue : IS.inputBorder}`,
            borderRadius: '8px',
            color: value ? IS.text : IS.muted,
            fontSize: '13px',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            width: '100%',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            boxShadow: focused ? `0 0 0 3px ${IS.blue}25` : 'none',
          }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} style={{ backgroundColor: IS.inputBg, color: IS.text }}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: IS.muted,
          display: 'flex',
          alignItems: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── ISButton ─────────────────────────────────────────────────────────────────
export function ISButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: hovered ? '#2563EB' : IS.blue,
      color: IS.textWhite,
      border: `1px solid ${hovered ? '#2563EB' : IS.blue}`,
    },
    secondary: {
      backgroundColor: hovered ? `${IS.inputBorder}30` : 'transparent',
      color: IS.text,
      border: `1px solid ${IS.inputBorder}`,
    },
    danger: {
      backgroundColor: hovered ? '#DC2626' : IS.red,
      color: IS.textWhite,
      border: `1px solid ${hovered ? '#DC2626' : IS.red}`,
    },
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        ...fontBase,
        ...styles[variant],
        padding: '9px 18px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.15s ease, opacity 0.15s ease',
        whiteSpace: 'nowrap',
        outline: 'none',
      }}
    >
      {children}
    </button>
  )
}

// ─── ISTabBar ─────────────────────────────────────────────────────────────────
export function ISTabBar({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: { id: string; label: string }[]
  activeTab: string
  onTabChange: (id: string) => void
}) {
  return (
    <div style={{
      ...fontBase,
      display: 'flex',
      gap: '4px',
      borderBottom: `1px solid ${IS.cardBorder}`,
      overflow: 'auto',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              ...fontBase,
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? `2px solid ${IS.blue}` : '2px solid transparent',
              color: isActive ? IS.blue : IS.label,
              fontSize: '13px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s ease, border-color 0.15s ease',
              marginBottom: '-1px',
              outline: 'none',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── WizardStepper ───────────────────────────────────────────────────────────
export function WizardStepper({
  steps,
  currentStep,
}: {
  steps: string[]
  currentStep: number
}) {
  return (
    <div style={{
      ...fontBase,
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '0 4px',
      overflowX: 'auto',
    }}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isCurrent = i === currentStep
        const dotColor = isCompleted ? IS.green : isCurrent ? IS.blue : IS.muted

        return (
          <React.Fragment key={i}>
            {/* Step node */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              minWidth: '80px',
              flexShrink: 0,
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? IS.green : isCurrent ? IS.blue : `${IS.muted}30`,
                border: `2px solid ${dotColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: isCurrent ? `0 0 0 4px ${IS.blue}25` : 'none',
              }}>
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={IS.textWhite} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{
                    color: isCurrent ? IS.textWhite : IS.muted,
                    fontSize: '13px',
                    fontWeight: 700,
                  }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span style={{
                color: isCompleted ? IS.green : isCurrent ? IS.text : IS.muted,
                fontSize: '11px',
                fontWeight: isCurrent ? 700 : 500,
                textAlign: 'center',
                lineHeight: 1.3,
                transition: 'color 0.2s ease',
              }}>
                {step}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div style={{
                height: '2px',
                flex: 1,
                minWidth: '24px',
                backgroundColor: i < currentStep ? IS.green : `${IS.muted}30`,
                marginBottom: '22px',
                transition: 'background-color 0.2s ease',
              }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── SchemaTree ───────────────────────────────────────────────────────────────
interface SchemaField {
  name: string
  type: string
  required?: boolean
  children?: SchemaField[]
}

function SchemaNode({ field, depth = 0 }: { field: SchemaField; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = field.children && field.children.length > 0

  const typeColor: Record<string, string> = {
    string: IS.green,
    number: IS.blue,
    integer: IS.blue,
    boolean: IS.purple,
    object: IS.gold,
    array: IS.cyan,
    null: IS.muted,
    any: IS.orange,
  }
  const tColor = typeColor[field.type.toLowerCase()] ?? IS.label

  return (
    <div style={{ paddingLeft: depth > 0 ? '20px' : '0' }}>
      <div
        onClick={() => hasChildren && setExpanded(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 8px',
          borderRadius: '6px',
          cursor: hasChildren ? 'pointer' : 'default',
          backgroundColor: 'transparent',
          transition: 'background-color 0.12s ease',
        }}
        onMouseEnter={e => {
          if (hasChildren) (e.currentTarget as HTMLDivElement).style.backgroundColor = `${IS.inputBorder}20`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
        }}
      >
        {/* Expand/collapse toggle */}
        <span style={{ width: '14px', flexShrink: 0, color: IS.muted, fontSize: '11px', display: 'flex', alignItems: 'center' }}>
          {hasChildren ? (expanded ? '▾' : '▸') : '·'}
        </span>

        {/* Field name */}
        <span style={{ color: IS.text, fontSize: '13px', fontWeight: 500, fontFamily: "'Fira Code', 'Cascadia Code', monospace" }}>
          {field.name}
        </span>

        {/* Required marker */}
        {field.required && (
          <span style={{ color: IS.red, fontSize: '12px', fontWeight: 700, marginLeft: '1px' }} title="Required">
            *
          </span>
        )}

        {/* Type badge */}
        <span style={{
          ...fontBase,
          padding: '1px 7px',
          borderRadius: '10px',
          fontSize: '11px',
          fontWeight: 600,
          color: tColor,
          backgroundColor: `${tColor}18`,
          border: `1px solid ${tColor}30`,
          whiteSpace: 'nowrap',
        }}>
          {field.type}
        </span>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div style={{
          borderLeft: `1px solid ${IS.cardBorder}`,
          marginLeft: '16px',
        }}>
          {field.children!.map((child, i) => (
            <SchemaNode key={i} field={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function SchemaTree({
  schema,
  title,
}: {
  schema: SchemaField[]
  title: string
}) {
  return (
    <div style={{
      ...fontBase,
      backgroundColor: IS.cardBg2,
      border: `1px solid ${IS.cardBorder}`,
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: `1px solid ${IS.cardBorder}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={IS.label} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <span style={{ color: IS.label, fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em' }}>{title}</span>
      </div>
      <div style={{ padding: '8px' }}>
        {schema.map((field, i) => (
          <SchemaNode key={i} field={field} />
        ))}
      </div>
    </div>
  )
}

// ─── JsonPreview ──────────────────────────────────────────────────────────────
export function JsonPreview({
  data,
  title,
}: {
  data: unknown
  title?: string
}) {
  const [copied, setCopied] = useState(false)
  const jsonString = JSON.stringify(data, null, 2)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement('textarea')
      el.value = jsonString
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Very lightweight JSON syntax colorizer
  function colorizeJson(raw: string): React.ReactNode[] {
    const lines = raw.split('\n')
    return lines.map((line, i) => {
      const parts: React.ReactNode[] = []
      let remaining = line

      // Indent whitespace
      const indentMatch = remaining.match(/^(\s+)/)
      if (indentMatch) {
        parts.push(<span key="indent">{indentMatch[1]}</span>)
        remaining = remaining.slice(indentMatch[1].length)
      }

      // Key: "value"
      const keyMatch = remaining.match(/^("(?:[^"\\]|\\.)*")\s*:(.*)$/)
      if (keyMatch) {
        parts.push(<span key="key" style={{ color: IS.cyan }}>{keyMatch[1]}</span>)
        parts.push(<span key="colon" style={{ color: IS.label }}>:</span>)
        remaining = keyMatch[2]
      }

      // Value tokenization
      const tokenize = (src: string, keyIdx: number): React.ReactNode => {
        const s = src.trimStart()
        const leadingSpace = src.slice(0, src.length - src.trimStart().length)

        if (s.startsWith('"')) {
          const end = s.indexOf('"', 1)
          const str = end !== -1 ? s.slice(0, end + 1) : s
          return <span key={`v${keyIdx}`}><span style={{ color: IS.label }}>{leadingSpace}</span><span style={{ color: IS.green }}>{str}</span><span style={{ color: IS.muted }}>{s.slice(str.length)}</span></span>
        }
        if (/^-?\d/.test(s)) {
          const numMatch = s.match(/^(-?\d+\.?\d*)(.*)$/)
          if (numMatch) return <span key={`v${keyIdx}`}><span style={{ color: IS.label }}>{leadingSpace}</span><span style={{ color: IS.blue }}>{numMatch[1]}</span><span style={{ color: IS.muted }}>{numMatch[2]}</span></span>
        }
        if (s.startsWith('true') || s.startsWith('false')) {
          const bool = s.startsWith('true') ? 'true' : 'false'
          return <span key={`v${keyIdx}`}><span style={{ color: IS.label }}>{leadingSpace}</span><span style={{ color: IS.purple }}>{bool}</span><span style={{ color: IS.muted }}>{s.slice(bool.length)}</span></span>
        }
        if (s.startsWith('null')) {
          return <span key={`v${keyIdx}`}><span style={{ color: IS.label }}>{leadingSpace}</span><span style={{ color: IS.muted }}>null</span><span style={{ color: IS.muted }}>{s.slice(4)}</span></span>
        }
        return <span key={`v${keyIdx}`} style={{ color: IS.muted }}>{src}</span>
      }

      if (remaining) {
        parts.push(tokenize(remaining, i))
      }

      return (
        <div key={i} style={{ minHeight: '1.5em' }}>
          {parts}
        </div>
      )
    })
  }

  return (
    <div style={{
      ...fontBase,
      backgroundColor: IS.pageBg,
      border: `1px solid ${IS.cardBorder}`,
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '9px 14px',
        borderBottom: `1px solid ${IS.cardBorder}`,
        backgroundColor: IS.cardBg2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>
          {title && <span style={{ color: IS.muted, fontSize: '12px', marginLeft: '6px' }}>{title}</span>}
        </div>
        <button
          onClick={handleCopy}
          style={{
            ...fontBase,
            background: 'none',
            border: `1px solid ${copied ? IS.green : IS.inputBorder}`,
            borderRadius: '6px',
            color: copied ? IS.green : IS.label,
            fontSize: '11px',
            fontWeight: 600,
            padding: '3px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'color 0.15s ease, border-color 0.15s ease',
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code block */}
      <pre style={{
        margin: 0,
        padding: '16px',
        overflowX: 'auto',
        fontSize: '12.5px',
        lineHeight: '1.6',
        fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Courier New', monospace",
        color: IS.text,
        maxHeight: '480px',
        overflowY: 'auto',
      }}>
        {colorizeJson(jsonString)}
      </pre>
    </div>
  )
}
