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
import { PersonRegular, WarningRegular, CheckmarkRegular } from '@fluentui/react-icons'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SSOProvider {
  id: string
  name: string
  logo: string
  protocol: 'OIDC' | 'SAML'
  issuer: string
  authorizationEndpoint: string
  tokenEndpoint: string
  jwksUri: string
  redirectUri: string
  clientId: string
  claimsMapping: { canonical: string; idpClaim: string }[]
  jitProvisioning: boolean
  status: 'ok' | 'warning' | 'inactive'
}

interface AttributeMapping {
  canonical: string
  idpAttribute: string
  type: string
  required: boolean
}

interface RoleMapping {
  id: string
  groupName: string
  groupId: string
  mappedRole: string
  tenantOverride: string | null
  source: string
}

interface CorrelationRule {
  id: string
  entityType: string
  internalField: string
  externalField: string
  externalSystem: string
  matchStrategy: string
  conflictCount: number
}

interface ConflictEntry {
  id: string
  entityType: string
  internalId: string
  externalId: string
  conflictType: string
  detectedAt: string
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SSO_PROVIDERS: SSOProvider[] = [
  {
    id: 'entra',
    name: 'Microsoft Entra ID',
    logo: 'entra',
    protocol: 'OIDC',
    issuer: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/v2.0',
    authorizationEndpoint: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/v2.0/token',
    jwksUri: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/discovery/v2.0/keys',
    redirectUri: 'https://platform.corp.example.com/auth/callback/entra',
    clientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    claimsMapping: [
      { canonical: 'sub', idpClaim: 'oid' },
      { canonical: 'email', idpClaim: 'upn' },
      { canonical: 'name', idpClaim: 'name' },
      { canonical: 'groups', idpClaim: 'groups' },
      { canonical: 'department', idpClaim: 'department' },
      { canonical: 'jobTitle', idpClaim: 'jobTitle' },
    ],
    jitProvisioning: true,
    status: 'ok',
  },
  {
    id: 'google',
    name: 'Google Workspace',
    logo: 'google',
    protocol: 'OIDC',
    issuer: 'https://accounts.google.com',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    redirectUri: 'https://platform.corp.example.com/auth/callback/google',
    clientId: 'project-1234567890.apps.googleusercontent.com',
    claimsMapping: [
      { canonical: 'sub', idpClaim: 'sub' },
      { canonical: 'email', idpClaim: 'email' },
      { canonical: 'name', idpClaim: 'name' },
      { canonical: 'groups', idpClaim: 'hd' },
    ],
    jitProvisioning: false,
    status: 'warning',
  },
]

const SYNC_ATTRIBUTE_MAPPINGS: AttributeMapping[] = [
  { canonical: 'userId',       idpAttribute: 'objectId',          type: 'string',  required: true  },
  { canonical: 'email',        idpAttribute: 'userPrincipalName', type: 'string',  required: true  },
  { canonical: 'displayName',  idpAttribute: 'displayName',       type: 'string',  required: true  },
  { canonical: 'firstName',    idpAttribute: 'givenName',         type: 'string',  required: false },
  { canonical: 'lastName',     idpAttribute: 'surname',           type: 'string',  required: false },
  { canonical: 'department',   idpAttribute: 'department',        type: 'string',  required: false },
  { canonical: 'jobTitle',     idpAttribute: 'jobTitle',          type: 'string',  required: false },
  { canonical: 'officePhone',  idpAttribute: 'telephoneNumber',   type: 'string',  required: false },
  { canonical: 'manager',      idpAttribute: 'manager',           type: 'string',  required: false },
  { canonical: 'accountEnabled', idpAttribute: 'accountEnabled',  type: 'boolean', required: true  },
  { canonical: 'groups',       idpAttribute: 'memberOf',          type: 'array',   required: false },
]

const ROLE_MAPPINGS: RoleMapping[] = [
  { id: 'rm-1', groupName: 'Platform-Admins',         groupId: 'sg-platform-admins-001',     mappedRole: 'Platform Admin',       tenantOverride: null,           source: 'Microsoft Entra' },
  { id: 'rm-2', groupName: 'Integration-Engineers',   groupId: 'sg-integration-eng-002',     mappedRole: 'Integration Engineer', tenantOverride: null,           source: 'Microsoft Entra' },
  { id: 'rm-3', groupName: 'Workplace-Operators',     groupId: 'sg-wp-operators-003',        mappedRole: 'Operator',             tenantOverride: null,           source: 'Microsoft Entra' },
  { id: 'rm-4', groupName: 'TenantA-Admins',          groupId: 'sg-tenant-a-admin-004',      mappedRole: 'Tenant Admin',         tenantOverride: 'tenant-alpha', source: 'Microsoft Entra' },
  { id: 'rm-5', groupName: 'TenantB-Admins',          groupId: 'sg-tenant-b-admin-005',      mappedRole: 'Tenant Admin',         tenantOverride: 'tenant-bravo', source: 'Microsoft Entra' },
  { id: 'rm-6', groupName: 'Auditors',                groupId: 'sg-platform-auditors-006',   mappedRole: 'Auditor',              tenantOverride: null,           source: 'Microsoft Entra' },
  { id: 'rm-7', groupName: 'workspace-operators',     groupId: 'ws-operators@corp.example',  mappedRole: 'Operator',             tenantOverride: null,           source: 'Google Workspace' },
]

const CORRELATION_RULES: CorrelationRule[] = [
  { id: 'cr-1', entityType: 'User',   internalField: 'userId',   externalField: 'badgeId',    externalSystem: 'Access Control (Lenel)',   matchStrategy: 'Exact Match',      conflictCount: 2  },
  { id: 'cr-2', entityType: 'User',   internalField: 'userId',   externalField: 'licensePlate', externalSystem: 'Parking (SKIDATA)',       matchStrategy: 'Exact Match',      conflictCount: 5  },
  { id: 'cr-3', entityType: 'User',   internalField: 'email',    externalField: 'email',      externalSystem: 'Booking (Condeco)',        matchStrategy: 'Case-Insensitive', conflictCount: 0  },
  { id: 'cr-4', entityType: 'User',   internalField: 'userId',   externalField: 'lockerId',   externalSystem: 'Lockers (Sievert)',        matchStrategy: 'Fuzzy (80%)',       conflictCount: 1  },
  { id: 'cr-5', entityType: 'Visitor', internalField: 'visitorId', externalField: 'tempBadgeId', externalSystem: 'Access Control (Lenel)', matchStrategy: 'Exact Match',      conflictCount: 0  },
  { id: 'cr-6', entityType: 'Asset',  internalField: 'assetId',  externalField: 'assetTag',   externalSystem: 'CAFM (Archibus)',          matchStrategy: 'Exact Match',      conflictCount: 3  },
]

const CONFLICTS: ConflictEntry[] = [
  { id: 'cf-1', entityType: 'User',  internalId: 'usr-7823',   externalId: 'BADGE-0042',  conflictType: 'Duplicate External ID', detectedAt: '2026-03-04 09:12' },
  { id: 'cf-2', entityType: 'User',  internalId: 'usr-4421',   externalId: 'BADGE-0199',  conflictType: 'No Match Found',        detectedAt: '2026-03-04 11:34' },
  { id: 'cf-3', entityType: 'User',  internalId: 'usr-9901',   externalId: 'LP-ABC-123',  conflictType: 'Ambiguous Match (3)',    detectedAt: '2026-03-03 15:02' },
  { id: 'cf-4', entityType: 'User',  internalId: 'usr-3312',   externalId: 'LP-XYZ-789',  conflictType: 'Ambiguous Match (2)',    detectedAt: '2026-03-03 08:55' },
  { id: 'cf-5', entityType: 'User',  internalId: 'usr-5544',   externalId: 'LP-DEF-456',  conflictType: 'Stale Reference',       detectedAt: '2026-03-02 17:20' },
  { id: 'cf-6', entityType: 'Asset', internalId: 'ast-0012',   externalId: 'TAG-90210',   conflictType: 'No Match Found',        detectedAt: '2026-03-01 10:00' },
  { id: 'cf-7', entityType: 'Asset', internalId: 'ast-0034',   externalId: 'TAG-90211',   conflictType: 'Duplicate External ID', detectedAt: '2026-02-28 14:30' },
  { id: 'cf-8', entityType: 'Asset', internalId: 'ast-0056',   externalId: 'TAG-90340',   conflictType: 'Stale Reference',       detectedAt: '2026-02-27 09:45' },
]

// ─── Shared sub-components ────────────────────────────────────────────────────

const fontBase: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: '40px', height: '22px', borderRadius: '11px',
        backgroundColor: value ? IS.blue : IS.inputBorder,
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background-color 0.2s ease', flexShrink: 0, padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: value ? '21px' : '3px',
        width: '16px', height: '16px', borderRadius: '50%',
        backgroundColor: IS.textWhite,
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}

function Tag({ label, color = IS.blue }: { label: string; color?: string }) {
  return (
    <span style={{
      ...fontBase,
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: '6px',
      backgroundColor: `${color}18`, border: `1px solid ${color}30`,
      fontSize: '11px', fontWeight: 600, color, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

function InfoRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
      <span style={{ ...fontBase, color: IS.muted, fontSize: '12px', minWidth: '140px', flexShrink: 0 }}>{label}</span>
      <span style={{ ...fontBase, color: IS.text, fontSize: '12px', fontFamily: mono ? "'Fira Code', monospace" : 'inherit', wordBreak: 'break-all' }}>
        {value}
      </span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...fontBase, color: IS.label, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', marginTop: '4px' }}>
      {children}
    </div>
  )
}

// ─── Provider Logo SVG ────────────────────────────────────────────────────────

function ProviderIcon({ id }: { id: string }) {
  if (id === 'entra') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0078D4" />
        <path d="M12 4L4 8v8l8 4 8-4V8L12 4z" fill="white" opacity="0.9" />
        <path d="M12 4v16M4 8l8 4 8-4" stroke="#0078D4" strokeWidth="0.8" />
      </svg>
    )
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#FFFFFF" />
      <path d="M12 11.5c0-1.38 1.12-2.5 2.5-2.5S17 10.12 17 11.5 15.88 14 14.5 14 12 12.88 12 11.5z" fill="#EA4335" />
      <path d="M6 11.5C6 8.46 8.46 6 11.5 6S17 8.46 17 11.5H15c0-1.93-1.57-3.5-3.5-3.5S8 9.57 8 11.5" fill="#4285F4" />
      <path d="M11.5 17c-3.04 0-5.5-2.46-5.5-5.5H8c0 1.93 1.57 3.5 3.5 3.5S15 13.43 15 11.5h2C17 14.54 14.54 17 11.5 17z" fill="#34A853" />
      <path d="M6 11.5c0-1.38 1.12-2.5 2.5-2.5S11 10.12 11 11.5 9.88 14 8.5 14 6 12.88 6 11.5z" fill="#FBBC05" />
    </svg>
  )
}

// ─── SSO Tab ──────────────────────────────────────────────────────────────────

function SSOTab() {
  const [expanded, setExpanded] = useState<string | null>('entra')
  const [providers, setProviders] = useState(SSO_PROVIDERS)

  const toggleJit = (id: string) =>
    setProviders(p => p.map(pr => pr.id === id ? { ...pr, jitProvisioning: !pr.jitProvisioning } : pr))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {providers.map(prov => (
        <div
          key={prov.id}
          style={{
            backgroundColor: IS.cardBg,
            border: `1px solid ${expanded === prov.id ? IS.blue : IS.cardBorder}`,
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'border-color 0.15s ease',
          }}
        >
          {/* Header */}
          <div
            onClick={() => setExpanded(expanded === prov.id ? null : prov.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', cursor: 'pointer', backgroundColor: IS.cardBg2 }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
              backgroundColor: IS.inputBg, border: `1px solid ${IS.cardBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ProviderIcon id={prov.id} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ ...fontBase, color: IS.textWhite, fontWeight: 700, fontSize: '15px' }}>{prov.name}</span>
                <Tag label={prov.protocol} color={IS.purple} />
                <StatusBadge status={prov.status} />
              </div>
              <div style={{ ...fontBase, color: IS.muted, fontSize: '12px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {prov.issuer}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ ...fontBase, color: IS.label, fontSize: '12px' }}>JIT Provisioning</span>
                <Toggle value={prov.jitProvisioning} onChange={() => toggleJit(prov.id)} />
              </div>
              <span style={{ color: IS.muted, fontSize: '14px', transition: 'transform 0.2s ease', transform: expanded === prov.id ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▾</span>
            </div>
          </div>

          {/* Expanded body */}
          {expanded === prov.id && (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Endpoints */}
              <div>
                <SectionLabel>Endpoints &amp; Configuration</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <InfoRow label="Issuer" value={prov.issuer} mono />
                  <InfoRow label="Authorization URL" value={prov.authorizationEndpoint} mono />
                  <InfoRow label="Token URL" value={prov.tokenEndpoint} mono />
                  <InfoRow label="JWKS URI" value={prov.jwksUri} mono />
                  <InfoRow label="Redirect URI" value={prov.redirectUri} mono />
                  <InfoRow label="Client ID" value={prov.clientId} mono />
                </div>
              </div>

              {/* Claims mapping */}
              <div>
                <SectionLabel>Claims Mapping</SectionLabel>
                <div style={{ backgroundColor: IS.cardBg2, borderRadius: '8px', border: `1px solid ${IS.cardBorder}`, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', ...fontBase }}>
                    <thead>
                      <tr>
                        {['Canonical Claim', 'IdP Claim'].map((h, i) => (
                          <th key={i} style={{
                            padding: '8px 14px', textAlign: 'left', color: IS.label,
                            fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
                            textTransform: 'uppercase', borderBottom: `1px solid ${IS.cardBorder}`,
                            backgroundColor: IS.cardBg2,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {prov.claimsMapping.map((cm, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${IS.cardBorder}40` }}>
                          <td style={{ padding: '7px 14px', color: IS.cyan, fontFamily: "'Fira Code', monospace" }}>{cm.canonical}</td>
                          <td style={{ padding: '7px 14px', color: IS.green, fontFamily: "'Fira Code', monospace" }}>{cm.idpClaim}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <ISButton variant="secondary">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
                  </svg>
                  Test Auth
                </ISButton>
                <ISButton variant="secondary">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Config
                </ISButton>
              </div>
            </div>
          )}
        </div>
      ))}

      <ISButton variant="secondary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add SSO Provider
      </ISButton>
    </div>
  )
}

// ─── Directory Sync Tab ───────────────────────────────────────────────────────

function DirectorySyncTab() {
  const [scope, setScope] = useState('filtered')
  const [interval, setInterval] = useState('15')
  const [deprovision, setDeprovision] = useState('disable')

  const syncStats = { added: 14, updated: 47, disabled: 3, total: 1284, lastRun: '2026-03-05 03:00 UTC', duration: '1m 23s', status: 'ok' as const }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Last Sync Status */}
      <ISCard title="Last Sync Status">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <StatusBadge status={syncStats.status} />
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Users', value: syncStats.total.toLocaleString(), color: IS.text },
              { label: 'Added',       value: `+${syncStats.added}`,           color: IS.green  },
              { label: 'Updated',     value: `~${syncStats.updated}`,          color: IS.yellow },
              { label: 'Disabled',    value: `-${syncStats.disabled}`,         color: IS.orange },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ ...fontBase, color: IS.muted, fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stat.label}</div>
                <div style={{ ...fontBase, color: stat.color, fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>{stat.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ ...fontBase, color: IS.muted, fontSize: '11px' }}>Last run</div>
            <div style={{ ...fontBase, color: IS.label, fontSize: '12px', fontWeight: 600 }}>{syncStats.lastRun}</div>
            <div style={{ ...fontBase, color: IS.muted, fontSize: '11px' }}>Duration: {syncStats.duration}</div>
          </div>
        </div>
      </ISCard>

      {/* Sync Configuration */}
      <ISCard title="Sync Configuration">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <ISSelect
              label="Scope"
              value={scope}
              onChange={setScope}
              options={[
                { value: 'all', label: 'All users &amp; groups' },
                { value: 'filtered', label: 'Filtered (by group membership)' },
                { value: 'ou', label: 'Organizational Unit' },
              ]}
            />
            <ISSelect
              label="Schedule Interval"
              value={interval}
              onChange={setInterval}
              options={[
                { value: '5',   label: 'Every 5 minutes' },
                { value: '15',  label: 'Every 15 minutes' },
                { value: '30',  label: 'Every 30 minutes' },
                { value: '60',  label: 'Every 1 hour' },
                { value: '360', label: 'Every 6 hours' },
                { value: '720', label: 'Every 12 hours' },
              ]}
            />
            <ISSelect
              label="Deprovision Policy"
              value={deprovision}
              onChange={setDeprovision}
              options={[
                { value: 'disable',   label: 'Disable account' },
                { value: 'delete',    label: 'Delete account' },
                { value: 'anonymize', label: 'Anonymize &amp; retain' },
                { value: 'none',      label: 'No action (manual)' },
              ]}
            />
          </div>

          {scope === 'filtered' && (
            <div style={{ padding: '12px 16px', backgroundColor: IS.cardBg2, borderRadius: '8px', border: `1px solid ${IS.cardBorder}` }}>
              <div style={{ ...fontBase, color: IS.label, fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                Included Groups (filter list)
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Platform-Admins', 'Integration-Engineers', 'Workplace-Operators', 'TenantA-Admins', 'TenantB-Admins', 'Auditors'].map(g => (
                  <span key={g} style={{
                    ...fontBase, padding: '3px 10px', borderRadius: '6px',
                    backgroundColor: `${IS.blue}18`, border: `1px solid ${IS.blue}30`,
                    color: IS.blue, fontSize: '12px', fontWeight: 600,
                  }}>
                    {g}
                  </span>
                ))}
                <span style={{ ...fontBase, padding: '3px 10px', borderRadius: '6px', backgroundColor: `${IS.muted}15`, border: `1px dashed ${IS.muted}`, color: IS.muted, fontSize: '12px', cursor: 'pointer' }}>
                  + Add group
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <ISButton variant="secondary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              Sync Now
            </ISButton>
            <ISButton>Save Configuration</ISButton>
          </div>
        </div>
      </ISCard>

      {/* Attribute Mapping */}
      <ISCard title="Attribute Mapping" action={<ISButton variant="secondary">Add Attribute</ISButton>}>
        <ISTable
          columns={[
            { key: 'canonical',    label: 'Canonical Field',  width: '180px', render: (v) => <span style={{ color: IS.cyan,  fontFamily: "'Fira Code', monospace", fontSize: '12px' }}>{v}</span> },
            { key: 'idpAttribute', label: 'IdP Attribute',    width: '220px', render: (v) => <span style={{ color: IS.green, fontFamily: "'Fira Code', monospace", fontSize: '12px' }}>{v}</span> },
            { key: 'type',         label: 'Type',             width: '90px',  render: (v) => <span style={{ ...fontBase, color: v === 'boolean' ? IS.purple : v === 'array' ? IS.cyan : IS.blue, fontSize: '12px' }}>{v}</span> },
            { key: 'required',     label: 'Required',         width: '90px',  render: (v) => <span style={{ color: v ? IS.green : IS.muted, fontSize: '12px', fontWeight: 600 }}>{v ? 'Yes' : 'No'}</span> },
          ]}
          data={SYNC_ATTRIBUTE_MAPPINGS}
        />
      </ISCard>
    </div>
  )
}

// ─── Role Mapping Tab ─────────────────────────────────────────────────────────

function RoleMappingTab() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newGroup, setNewGroup] = useState('')
  const [newGroupId, setNewGroupId] = useState('')
  const [newRole, setNewRole] = useState('Operator')
  const [newTenant, setNewTenant] = useState('')

  const roleColors: Record<string, string> = {
    'Platform Admin':       IS.red,
    'Integration Engineer': IS.purple,
    'Operator':             IS.blue,
    'Tenant Admin':         IS.orange,
    'Auditor':              IS.yellow,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...fontBase, color: IS.label, fontSize: '13px' }}>
          {ROLE_MAPPINGS.length} group mappings · IdP groups are mapped to platform roles at login
        </span>
        <ISButton onClick={() => setShowAddModal(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Mapping
        </ISButton>
      </div>

      <ISCard>
        <ISTable
          columns={[
            { key: 'groupName', label: 'Group Name', width: '200px', render: (v) => <span style={{ ...fontBase, color: IS.text, fontWeight: 600, fontSize: '13px' }}>{v}</span> },
            { key: 'groupId',   label: 'Group ID',   width: '240px', render: (v) => <span style={{ fontFamily: "'Fira Code', monospace", color: IS.muted, fontSize: '11px' }}>{v}</span> },
            { key: 'mappedRole', label: 'Mapped Role', width: '180px', render: (v) => (
              <span style={{
                ...fontBase, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                color: roleColors[v] ?? IS.label,
                backgroundColor: `${roleColors[v] ?? IS.label}1A`,
                border: `1px solid ${roleColors[v] ?? IS.label}40`,
              }}>{v}</span>
            )},
            { key: 'tenantOverride', label: 'Tenant Override', render: (v) =>
              v ? <span style={{ ...fontBase, color: IS.orange, fontSize: '12px', fontFamily: "'Fira Code', monospace" }}>{v}</span>
                : <span style={{ ...fontBase, color: IS.muted, fontSize: '12px' }}>— global —</span>
            },
            { key: 'source', label: 'Source', render: (v) => <span style={{ ...fontBase, color: IS.label, fontSize: '12px' }}>{v}</span> },
          ]}
          data={ROLE_MAPPINGS}
        />
      </ISCard>

      {/* Add Mapping Modal */}
      <ISModal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Role Mapping" width="480px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ISInput label="Group Name" value={newGroup} onChange={setNewGroup} placeholder="e.g. Finance-Approvers" />
          <ISInput label="Group ID / DN" value={newGroupId} onChange={setNewGroupId} placeholder="e.g. sg-finance-approvers-007" />
          <ISSelect
            label="Mapped Role"
            value={newRole}
            onChange={setNewRole}
            options={[
              { value: 'Platform Admin',       label: 'Platform Admin' },
              { value: 'Integration Engineer', label: 'Integration Engineer' },
              { value: 'Operator',             label: 'Operator' },
              { value: 'Tenant Admin',         label: 'Tenant Admin' },
              { value: 'Auditor',              label: 'Auditor' },
            ]}
          />
          <ISInput label="Tenant Override (optional)" value={newTenant} onChange={setNewTenant} placeholder="Leave blank for global mapping" />
          <ISSelect
            label="Source Provider"
            value="entra"
            onChange={() => {}}
            options={SSO_PROVIDERS.map(p => ({ value: p.id, label: p.name }))}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <ISButton variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</ISButton>
            <ISButton onClick={() => setShowAddModal(false)}>Save Mapping</ISButton>
          </div>
        </div>
      </ISModal>
    </div>
  )
}

// ─── Identity Correlation Tab ─────────────────────────────────────────────────

function IdentityCorrelationTab() {
  const [selectedConflict, setSelectedConflict] = useState<ConflictEntry | null>(null)

  const totalConflicts = CORRELATION_RULES.reduce((sum, r) => sum + r.conflictCount, 0)

  const conflictTypeColor = (t: string) =>
    t.includes('Duplicate') ? IS.red
    : t.includes('Ambiguous') ? IS.orange
    : t.includes('Stale') ? IS.yellow
    : IS.muted

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Correlation Rules', value: CORRELATION_RULES.length, color: IS.blue },
          { label: 'Total Conflicts', value: totalConflicts, color: IS.orange },
          { label: 'Entity Types', value: 3, color: IS.purple },
          { label: 'External Systems', value: 4, color: IS.green },
        ].map(s => (
          <div key={s.label} style={{
            flex: '1 1 140px', padding: '14px 18px', borderRadius: '10px',
            backgroundColor: IS.cardBg, border: `1px solid ${IS.cardBorder}`,
          }}>
            <div style={{ ...fontBase, color: IS.muted, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ ...fontBase, color: s.color, fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Correlation rules table */}
      <ISCard title="Correlation Rules" action={<ISButton>Add Rule</ISButton>}>
        <ISTable
          columns={[
            { key: 'entityType',     label: 'Entity Type',     width: '100px', render: (v) => <span style={{ ...fontBase, color: IS.text, fontWeight: 600 }}>{v}</span> },
            { key: 'internalField',  label: 'Internal Field',  width: '130px', render: (v) => <span style={{ fontFamily: "'Fira Code', monospace", color: IS.cyan,  fontSize: '12px' }}>{v}</span> },
            { key: 'externalField',  label: 'External Field',  width: '130px', render: (v) => <span style={{ fontFamily: "'Fira Code', monospace", color: IS.green, fontSize: '12px' }}>{v}</span> },
            { key: 'externalSystem', label: 'External System', render: (v) => <span style={{ ...fontBase, color: IS.label, fontSize: '12px' }}>{v}</span> },
            { key: 'matchStrategy',  label: 'Match Strategy',  width: '160px', render: (v) => <span style={{ ...fontBase, color: IS.yellow, fontSize: '12px' }}>{v}</span> },
            { key: 'conflictCount',  label: 'Conflicts',       width: '90px',  render: (v) => (
              <span style={{
                ...fontBase, fontWeight: 700, fontSize: '13px',
                color: v > 0 ? IS.orange : IS.green,
                display: 'inline-flex', alignItems: 'center', gap: '4px',
              }}>
                {v > 0
                  ? <><WarningRegular style={{ width: '13px', height: '13px' }} /> {v}</>
                  : <><CheckmarkRegular style={{ width: '13px', height: '13px' }} /> 0</>}
              </span>
            )},
          ]}
          data={CORRELATION_RULES}
        />
      </ISCard>

      {/* Manual Resolution Queue */}
      <ISCard
        title={`Manual Resolution Queue (${CONFLICTS.length} pending)`}
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <ISButton variant="secondary">Export CSV</ISButton>
            <ISButton>Resolve All</ISButton>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CONFLICTS.map(cf => (
            <div
              key={cf.id}
              onClick={() => setSelectedConflict(selectedConflict?.id === cf.id ? null : cf)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                backgroundColor: selectedConflict?.id === cf.id ? `${IS.blue}12` : IS.cardBg2,
                border: `1px solid ${selectedConflict?.id === cf.id ? IS.blue : IS.cardBorder}40`,
                transition: 'all 0.15s ease',
              }}
            >
              {/* Entity type badge */}
              <span style={{
                ...fontBase, padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                color: cf.entityType === 'User' ? IS.blue : cf.entityType === 'Visitor' ? IS.purple : IS.orange,
                backgroundColor: `${cf.entityType === 'User' ? IS.blue : cf.entityType === 'Visitor' ? IS.purple : IS.orange}18`,
                border: `1px solid ${cf.entityType === 'User' ? IS.blue : cf.entityType === 'Visitor' ? IS.purple : IS.orange}30`,
                minWidth: '52px', textAlign: 'center', flexShrink: 0,
              }}>
                {cf.entityType}
              </span>

              {/* IDs */}
              <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
                <span style={{ fontFamily: "'Fira Code', monospace", color: IS.cyan, fontSize: '12px' }}>{cf.internalId}</span>
                <span style={{ color: IS.muted, fontSize: '12px' }}>↔</span>
                <span style={{ fontFamily: "'Fira Code', monospace", color: IS.green, fontSize: '12px' }}>{cf.externalId}</span>
              </div>

              {/* Conflict type */}
              <span style={{
                ...fontBase, padding: '2px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                color: conflictTypeColor(cf.conflictType),
                backgroundColor: `${conflictTypeColor(cf.conflictType)}15`,
                border: `1px solid ${conflictTypeColor(cf.conflictType)}30`,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {cf.conflictType}
              </span>

              {/* Timestamp */}
              <span style={{ ...fontBase, color: IS.muted, fontSize: '11px', whiteSpace: 'nowrap', flexShrink: 0 }}>{cf.detectedAt}</span>

              {/* Action buttons (shown when selected) */}
              {selectedConflict?.id === cf.id && (
                <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto', flexShrink: 0 }}>
                  <ISButton variant="secondary">Ignore</ISButton>
                  <ISButton>Resolve</ISButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </ISCard>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ISIdentity() {
  const [activeTab, setActiveTab] = useState('sso')

  const tabs = [
    { id: 'sso',         label: 'SSO Providers' },
    { id: 'dir-sync',    label: 'Directory Sync' },
    { id: 'role-mapping',label: 'Role Mapping' },
    { id: 'correlation', label: 'Identity Correlation' },
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
            backgroundColor: `${IS.purple}1A`, border: `1px solid ${IS.purple}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <PersonRegular style={{ width: '20px', height: '20px', color: IS.purple }} />
          </div>
          <div>
            <h1 style={{ ...fontBase, margin: 0, color: IS.textWhite, fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Identity Management
            </h1>
            <p style={{ ...fontBase, margin: 0, color: IS.label, fontSize: '13px', marginTop: '2px' }}>
              SSO providers, directory sync, role mapping &amp; identity correlation
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ marginBottom: '24px' }}>
        <ISTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab content */}
      {activeTab === 'sso'          && <SSOTab />}
      {activeTab === 'dir-sync'     && <DirectorySyncTab />}
      {activeTab === 'role-mapping' && <RoleMappingTab />}
      {activeTab === 'correlation'  && <IdentityCorrelationTab />}
    </div>
  )
}
