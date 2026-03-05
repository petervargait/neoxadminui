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
  ISTableColumn,
} from './ISShared'
import { useGlobalState } from '@/context/GlobalStateContext'
import type { IntegrationAuthProfile } from '@/context/GlobalStateContext'

// ─── Auth type config ──────────────────────────────────────────────────────────
const AUTH_TYPE_OPTIONS = [
  { value: 'api-key',       label: 'API Key' },
  { value: 'oauth2-client', label: 'OAuth2 Client Credentials' },
  { value: 'oauth2-code',   label: 'OAuth2 Authorization Code' },
  { value: 'mtls',          label: 'Mutual TLS (mTLS)' },
  { value: 'jwt',           label: 'JWT Bearer' },
  { value: 'basic',         label: 'HTTP Basic Auth' },
]

const AUTH_TYPE_COLORS: Record<IntegrationAuthProfile['authType'], string> = {
  'api-key':       IS.cyan,
  'oauth2-client': IS.blue,
  'oauth2-code':   IS.purple,
  'mtls':          IS.gold,
  'jwt':           IS.orange,
  'basic':         IS.label,
}

function AuthTypeBadge({ type }: { type: IntegrationAuthProfile['authType'] }) {
  const color = AUTH_TYPE_COLORS[type]
  const label = AUTH_TYPE_OPTIONS.find(o => o.value === type)?.label ?? type
  return (
    <span style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: '20px',
      backgroundColor: `${color}18`,
      border: `1px solid ${color}35`,
      fontSize: '12px',
      fontWeight: 600,
      color,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

// ─── Empty form state ─────────────────────────────────────────────────────────
type FormState = {
  name: string
  authType: IntegrationAuthProfile['authType']
  secretRef: string
  tokenUrl: string
  scopes: string
}

const EMPTY_FORM: FormState = {
  name: '',
  authType: 'api-key',
  secretRef: '',
  tokenUrl: '',
  scopes: '',
}

// ─── Confirmation dialog ──────────────────────────────────────────────────────
function ConfirmDeleteModal({
  open,
  profileName,
  onConfirm,
  onCancel,
}: {
  open: boolean
  profileName: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <ISModal open={open} onClose={onCancel} title="Delete Auth Profile" width="420px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          color: IS.text,
          fontSize: '14px',
          lineHeight: '1.6',
          margin: 0,
        }}>
          Are you sure you want to delete{' '}
          <span style={{ color: IS.textWhite, fontWeight: 700 }}>{profileName}</span>?
          This action cannot be undone. Any connectors referencing this profile will need to be reconfigured.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <ISButton variant="secondary" onClick={onCancel}>Cancel</ISButton>
          <ISButton variant="danger" onClick={onConfirm}>Delete</ISButton>
        </div>
      </div>
    </ISModal>
  )
}

// ─── Create / Edit modal ──────────────────────────────────────────────────────
function AuthProfileModal({
  open,
  onClose,
  initial,
  onSave,
  isEditing,
}: {
  open: boolean
  onClose: () => void
  initial: FormState
  onSave: (form: FormState) => void
  isEditing: boolean
}) {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  // Sync when initial changes (editing different records)
  React.useEffect(() => {
    setForm(initial)
    setErrors({})
  }, [initial, open])

  const needsToken = form.authType === 'oauth2-client' || form.authType === 'oauth2-code' || form.authType === 'jwt'
  const needsScopes = form.authType === 'oauth2-client' || form.authType === 'oauth2-code' || form.authType === 'jwt'

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.secretRef.trim()) errs.secretRef = 'Secret reference is required'
    if (needsToken && !form.tokenUrl.trim()) errs.tokenUrl = 'Token URL is required for this auth type'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (validate()) onSave(form)
  }

  const field = (k: keyof FormState) =>
    (v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <ISModal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Auth Profile' : 'New Auth Profile'}
      width="560px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Security note */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '12px 14px',
          backgroundColor: `${IS.gold}12`,
          border: `1px solid ${IS.gold}30`,
          borderRadius: '9px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={IS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            color: IS.gold,
            fontSize: '12px',
            lineHeight: '1.55',
          }}>
            Secrets are stored in vault. Only references are shown. Never paste raw credentials here.
          </span>
        </div>

        {/* Name */}
        <div>
          <ISInput
            label="Profile Name"
            value={form.name}
            onChange={field('name')}
            placeholder="e.g. Genetec OAuth2 Client"
          />
          {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
        </div>

        {/* Auth Type */}
        <ISSelect
          label="Auth Type"
          value={form.authType}
          options={AUTH_TYPE_OPTIONS}
          onChange={v => field('authType')(v as IntegrationAuthProfile['authType'])}
        />

        {/* Secret Ref */}
        <div>
          <ISInput
            label="Secret Ref (Vault Key ID)"
            value={form.secretRef}
            onChange={field('secretRef')}
            placeholder="vault:secret/integrations/my-system/api-key"
          />
          {errors.secretRef && <ErrorMsg>{errors.secretRef}</ErrorMsg>}
        </div>

        {/* Token URL — conditional */}
        {needsToken && (
          <div>
            <ISInput
              label="Token URL"
              value={form.tokenUrl}
              onChange={field('tokenUrl')}
              placeholder="https://auth.example.com/oauth/token"
            />
            {errors.tokenUrl && <ErrorMsg>{errors.tokenUrl}</ErrorMsg>}
          </div>
        )}

        {/* Scopes — conditional */}
        {needsScopes && (
          <ISInput
            label="Scopes"
            value={form.scopes}
            onChange={field('scopes')}
            placeholder="read:events write:rules (space-separated)"
          />
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
          <ISButton variant="secondary" onClick={onClose}>Cancel</ISButton>
          <ISButton variant="primary" onClick={handleSave}>
            {isEditing ? 'Save Changes' : 'Create Profile'}
          </ISButton>
        </div>
      </div>
    </ISModal>
  )
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "'Inter', sans-serif",
      color: IS.red,
      fontSize: '11.5px',
      marginTop: '4px',
      display: 'block',
    }}>
      {children}
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ISAuthProfiles() {
  const {
    integrationAuthProfiles,
    addIntegrationAuthProfile,
    updateIntegrationAuthProfile,
    deleteIntegrationAuthProfile,
  } = useGlobalState()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<IntegrationAuthProfile | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<IntegrationAuthProfile | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (profile: IntegrationAuthProfile) => {
    setEditTarget(profile)
    setForm({
      name:      profile.name,
      authType:  profile.authType,
      secretRef: profile.secretRef,
      tokenUrl:  profile.tokenUrl ?? '',
      scopes:    profile.scopes ?? '',
    })
    setModalOpen(true)
  }

  const handleSave = (f: FormState) => {
    if (editTarget) {
      updateIntegrationAuthProfile(editTarget.id, {
        name:      f.name.trim(),
        authType:  f.authType,
        secretRef: f.secretRef.trim(),
        tokenUrl:  f.tokenUrl.trim() || undefined,
        scopes:    f.scopes.trim() || undefined,
      })
    } else {
      addIntegrationAuthProfile({
        name:      f.name.trim(),
        authType:  f.authType,
        secretRef: f.secretRef.trim(),
        tokenUrl:  f.tokenUrl.trim() || undefined,
        scopes:    f.scopes.trim() || undefined,
        tenantId:  'acme',
      })
    }
    setModalOpen(false)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      deleteIntegrationAuthProfile(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  const columns: ISTableColumn[] = [
    {
      key: 'name',
      label: 'Name',
      width: '22%',
      render: (v) => (
        <span style={{
          fontFamily: "'Inter', sans-serif",
          color: IS.textWhite,
          fontWeight: 600,
          fontSize: '13px',
        }}>
          {String(v)}
        </span>
      ),
    },
    {
      key: 'authType',
      label: 'Auth Type',
      width: '20%',
      render: (v) => <AuthTypeBadge type={v as IntegrationAuthProfile['authType']} />,
    },
    {
      key: 'secretRef',
      label: 'Secret Ref',
      width: '28%',
      render: (v) => (
        <span style={{
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          color: IS.cyan,
          fontSize: '12px',
          backgroundColor: `${IS.cyan}10`,
          padding: '2px 8px',
          borderRadius: '5px',
          border: `1px solid ${IS.cyan}20`,
        }}>
          {String(v)}
        </span>
      ),
    },
    {
      key: 'scopes',
      label: 'Scopes',
      width: '18%',
      render: (v) => v ? (
        <span style={{
          fontFamily: "'Inter', sans-serif",
          color: IS.label,
          fontSize: '12px',
        }}>
          {String(v).split(' ').slice(0, 2).join(' ')}{String(v).split(' ').length > 2 ? ' …' : ''}
        </span>
      ) : (
        <span style={{ color: IS.muted, fontSize: '12px' }}>—</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '12%',
      render: (v) => (
        <span style={{ fontFamily: "'Inter', sans-serif", color: IS.muted, fontSize: '12px' }}>
          {new Date(String(v)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      width: '10%',
      render: (_v, row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <ActionIconBtn
            title="Edit"
            color={IS.blue}
            onClick={() => openEdit(row as unknown as IntegrationAuthProfile)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </ActionIconBtn>
          <ActionIconBtn
            title="Delete"
            color={IS.red}
            onClick={() => setDeleteTarget(row as unknown as IntegrationAuthProfile)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </ActionIconBtn>
        </div>
      ),
    },
  ]

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: IS.pageBg,
      minHeight: '100%',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ color: IS.textWhite, fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            Auth Profiles
          </h2>
          <p style={{ color: IS.muted, fontSize: '13px', margin: 0 }}>
            Manage authentication credentials for external system integrations.
          </p>
        </div>
        <ISButton variant="primary" onClick={openCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Auth Profile
        </ISButton>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {AUTH_TYPE_OPTIONS.map(opt => {
          const count = integrationAuthProfiles.filter(p => p.authType === opt.value).length
          if (count === 0) return null
          return (
            <div key={opt.value} style={{
              padding: '8px 14px',
              backgroundColor: IS.cardBg,
              border: `1px solid ${IS.cardBorder}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                color: AUTH_TYPE_COLORS[opt.value as IntegrationAuthProfile['authType']],
                fontSize: '18px',
                fontWeight: 700,
              }}>
                {count}
              </span>
              <span style={{ color: IS.label, fontSize: '12px' }}>{opt.label}</span>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <ISCard title={`Auth Profiles (${integrationAuthProfiles.length})`}>
        <ISTable columns={columns} data={integrationAuthProfiles} />
      </ISCard>

      {/* Create / Edit modal */}
      <AuthProfileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={form}
        onSave={handleSave}
        isEditing={editTarget !== null}
      />

      {/* Delete confirmation */}
      <ConfirmDeleteModal
        open={deleteTarget !== null}
        profileName={deleteTarget?.name ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

// ─── Small icon-only action button ────────────────────────────────────────────
function ActionIconBtn({
  children,
  onClick,
  title,
  color,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  color: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}20` : 'transparent',
        border: `1px solid ${hovered ? color + '60' : IS.cardBorder}`,
        borderRadius: '6px',
        padding: '5px 7px',
        cursor: 'pointer',
        color: hovered ? color : IS.muted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  )
}
