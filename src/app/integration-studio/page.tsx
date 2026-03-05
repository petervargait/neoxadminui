'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NeoxLogo from '../../components/NeoxLogo'
import { useGlobalState } from '../../context/GlobalStateContext'
import ISDashboard from '../../components/integration-studio/ISDashboard'
import ISExternalSystems from '../../components/integration-studio/ISExternalSystems'
import ISAuthProfiles from '../../components/integration-studio/ISAuthProfiles'
import ISCanonicalAPIs from '../../components/integration-studio/ISCanonicalAPIs'
import ISConnectors from '../../components/integration-studio/ISConnectors'
import ISConnectorBuilder from '../../components/integration-studio/ISConnectorBuilder'
import ISMappingDesigner from '../../components/integration-studio/ISMappingDesigner'
import ISFlows from '../../components/integration-studio/ISFlows'
import ISEventsSync from '../../components/integration-studio/ISEventsSync'
import ISTesting from '../../components/integration-studio/ISTesting'
import ISHealthLogs from '../../components/integration-studio/ISHealthLogs'
import ISIncidents from '../../components/integration-studio/ISIncidents'
import ISIssueReporting from '../../components/integration-studio/ISIssueReporting'
import ISIdentity from '../../components/integration-studio/ISIdentity'
import ISTemplates from '../../components/integration-studio/ISTemplates'

export default function IntegrationStudioPage() {
  const router = useRouter()
  const globalState = useGlobalState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [activeSection, setActiveSection] = useState<string>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated')
    const storedUsername = sessionStorage.getItem('username') || ''

    if (authStatus !== 'true') {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
      setUsername(storedUsername)
    }
  }, [router])

  if (!isAuthenticated) return null

  const sections = [
    { id: 'dashboard',       label: 'Dashboard',        icon: '◈', color: '#3B82F6' },
    { id: 'externalSystems', label: 'External Systems',  icon: '◧', color: '#D4A847' },
    { id: 'authProfiles',    label: 'Auth Profiles',     icon: '◆', color: '#8B5CF6' },
    { id: 'canonicalAPIs',   label: 'Canonical APIs',    icon: '◩', color: '#10B981' },
    { id: 'connectors',      label: 'Connectors',        icon: '◫', color: '#3B82F6' },
    { id: 'mappingDesigner', label: 'Mapping Designer',  icon: '◬', color: '#D4A847' },
    { id: 'flows',           label: 'Flows',             icon: '▤', color: '#06B6D4' },
    { id: 'eventsSync',      label: 'Events & Sync',     icon: '▥', color: '#8B5CF6' },
    { id: 'testing',         label: 'Testing',           icon: '▦', color: '#10B981' },
    { id: 'healthLogs',      label: 'Health & Logs',     icon: '▧', color: '#3B82F6' },
    { id: 'incidents',       label: 'Incidents',         icon: '▨', color: '#EF4444' },
    { id: 'issueReporting',  label: 'Issue Reporting',   icon: '◉', color: '#D4A847' },
    { id: 'identity',        label: 'Identity',          icon: '◎', color: '#06B6D4' },
    { id: 'templates',       label: 'Templates',         icon: '▩', color: '#10B981' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#08122E',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navigation */}
      <div style={{
        height: '70px',
        backgroundColor: '#162032',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#F1F5F9'; e.currentTarget.style.backgroundColor = '#1E293B' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            ←
          </button>
          <NeoxLogo width="140px" height="36px" />
          <div style={{ width: '1px', height: '32px', backgroundColor: '#334155' }} />
          <h1 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>
            Integration Studio
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: '#1E293B',
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <span style={{ color: '#F1F5F9', fontSize: '13px' }}>{username}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: sidebarCollapsed ? '60px' : '220px',
          backgroundColor: '#0B1426',
          borderRight: '1px solid #1E293B',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              padding: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #1E293B',
              color: '#64748B',
              cursor: 'pointer',
              fontSize: '16px',
              textAlign: 'center'
            }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>

          {/* Section nav items */}
          <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'auto', flex: 1 }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarCollapsed ? '12px' : '12px 16px',
                  backgroundColor: activeSection === s.id ? '#1E293B' : 'transparent',
                  border: activeSection === s.id ? `1px solid ${s.color}40` : '1px solid transparent',
                  borderRadius: '8px',
                  color: activeSection === s.id ? '#F1F5F9' : '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeSection === s.id ? '600' : '400',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== s.id) {
                    e.currentTarget.style.backgroundColor = '#162032'
                    e.currentTarget.style.color = '#F1F5F9'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== s.id) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#94A3B8'
                  }
                }}
              >
                <span style={{
                  fontSize: '18px',
                  color: activeSection === s.id ? s.color : '#64748B',
                  flexShrink: 0
                }}>
                  {s.icon}
                </span>
                {!sidebarCollapsed && <span>{s.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
          {activeSection === 'dashboard' && <ISDashboard />}
          {activeSection === 'externalSystems' && <ISExternalSystems />}
          {activeSection === 'authProfiles' && <ISAuthProfiles />}
          {activeSection === 'canonicalAPIs' && <ISCanonicalAPIs />}
          {activeSection === 'connectors' && <ISConnectors />}
          {activeSection === 'mappingDesigner' && <ISMappingDesigner />}
          {activeSection === 'flows' && <ISFlows />}
          {activeSection === 'eventsSync' && <ISEventsSync />}
          {activeSection === 'testing' && <ISTesting />}
          {activeSection === 'healthLogs' && <ISHealthLogs />}
          {activeSection === 'incidents' && <ISIncidents />}
          {activeSection === 'issueReporting' && <ISIssueReporting />}
          {activeSection === 'identity' && <ISIdentity />}
          {activeSection === 'templates' && <ISTemplates />}
        </div>
      </div>
    </div>
  )
}
