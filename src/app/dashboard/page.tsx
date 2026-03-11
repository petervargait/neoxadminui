'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NeoxLogo from '../../components/NeoxLogo'
import { useGlobalState } from '../../context/GlobalStateContext'
import SmartSpacesDashboard from '../../components/SmartSpacesDashboard'
import VisitorDashboard from '../../components/VisitorDashboard'
import ParkingDashboard from '../../components/ParkingDashboard'
import LockerDashboard from '../../components/LockerDashboard'
import BadgesDashboard from '../../components/BadgesDashboard'
import SpaceBookingDashboard from '../../components/SpaceBookingDashboard'
import Dashboard0OperationalOverview from '../../components/dashboards/Dashboard0OperationalOverview'
import Dashboard1OfficeServices from '../../components/dashboards/Dashboard1OfficeServices'
import Dashboard2OfficeBuilding from '../../components/dashboards/Dashboard2OfficeBuilding'
import Dashboard3AmenityServices from '../../components/dashboards/Dashboard3AmenityServices'
import Dashboard4EmployeeServices from '../../components/dashboards/Dashboard4EmployeeServices'
import Dashboard5VisitorCenter from '../../components/dashboards/Dashboard5VisitorCenter'
import Dashboard6ParkingRestaurant from '../../components/dashboards/Dashboard6ParkingRestaurant'
import Dashboard7OccupancyServices from '../../components/dashboards/Dashboard7OccupancyServices'
import Dashboard9Sustainability from '../../components/dashboards/Dashboard9Sustainability'
import Dashboard10Wellbeing from '../../components/dashboards/Dashboard10Wellbeing'

export default function DashboardPage() {
  const router = useRouter()
  const globalState = useGlobalState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [selectedTenant, setSelectedTenant] = useState<string>('')
  const [activeDashboard, setActiveDashboard] = useState<string>('operationalOverview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated')
    const storedUsername = sessionStorage.getItem('username') || ''

    if (authStatus !== 'true') {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
      setUsername(storedUsername)
      // Default to first active tenant
      const firstTenant = globalState.tenants.find(t => t.status === 'active')
      if (firstTenant) setSelectedTenant(firstTenant.id)
    }
  }, [router, globalState.tenants])

  if (!isAuthenticated) return null

  const tenantInvitations = globalState.invitations.filter(inv => {
    const host = globalState.users.find(u => u.id === inv.hostId)
    return host?.tenantId === selectedTenant
  })

  const tenantBuildings = globalState.buildings.filter(b => b.tenantId === selectedTenant)
  const tenantParkingSpaces = globalState.parkingSpaces.filter(p => p.tenantId === selectedTenant)
  const tenantParkingBookings = globalState.parkingBookings?.filter(b => b.tenantId === selectedTenant)
  const tenantLockers = globalState.lockers.filter(l => l.tenantId === selectedTenant)
  const tenantLockerUsages = globalState.lockerUsages?.filter(u => u.tenantId === selectedTenant)
  const tenantBadges = globalState.badges.filter(badge => {
    const user = globalState.users.find(u => u.email === badge.email || u.id === badge.userId)
    return user?.tenantId === selectedTenant
  })
  const tenantBadgeSwipes = globalState.badgeSwipes?.filter(s => s.tenantId === selectedTenant)
  const tenantSpaces = globalState.spaces?.filter(s => s.tenantId === selectedTenant)
  const tenantTickets = globalState.tickets?.filter(t => t.tenantId === selectedTenant) || []

  const dashboards = [
    { id: 'operationalOverview', label: 'Operational Overview', icon: '◉', color: '#10B981' },
    { id: 'occupancyServices', label: 'Occupancy Services', icon: '▦', color: '#3B82F6' },
    { id: 'sustainability', label: 'Energy Monitor', icon: '▨', color: '#10B981' },
    { id: 'wellbeing', label: 'Wellbeing', icon: '▩', color: '#06B6D4' },
    { id: 'officeBuilding', label: 'Office Building', icon: '◈', color: '#3B82F6' },
    { id: 'officeServices', label: 'Office Services', icon: '◇', color: '#D4A847' },
    { id: 'amenityServices', label: 'Amenity Services', icon: '▣', color: '#D4A847' },
    { id: 'employeeServices', label: 'Employee Services', icon: '◫', color: '#64748B' },
    { id: 'visitorServices', label: 'Visitor Services', icon: '▤', color: '#D4A847' },
    { id: 'parkingServices', label: 'Parking Services', icon: '▥', color: '#8B5CF6' },
  ]

  const selectedTenantObj = globalState.tenants.find(t => t.id === selectedTenant)

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
            Dashboard & Analytics
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Tenant selector */}
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1E293B',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#F1F5F9',
              fontSize: '14px',
              outline: 'none',
              minWidth: '200px'
            }}
          >
            {globalState.tenants.filter(t => t.status === 'active').map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
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
              backgroundColor: '#3B82F6',
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

          {/* Dashboard nav items */}
          <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'auto', flex: 1 }}>
            {dashboards.map(d => (
              <button
                key={d.id}
                onClick={() => setActiveDashboard(d.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarCollapsed ? '12px' : '12px 16px',
                  backgroundColor: activeDashboard === d.id ? '#1E293B' : 'transparent',
                  border: activeDashboard === d.id ? `1px solid ${d.color}40` : '1px solid transparent',
                  borderRadius: '8px',
                  color: activeDashboard === d.id ? '#F1F5F9' : '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeDashboard === d.id ? '600' : '400',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (activeDashboard !== d.id) {
                    e.currentTarget.style.backgroundColor = '#162032'
                    e.currentTarget.style.color = '#F1F5F9'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeDashboard !== d.id) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#94A3B8'
                  }
                }}
              >
                <span style={{
                  fontSize: '18px',
                  color: activeDashboard === d.id ? d.color : '#64748B',
                  flexShrink: 0
                }}>
                  {d.icon}
                </span>
                {!sidebarCollapsed && <span>{d.label}</span>}
              </button>
            ))}
          </div>

          {/* Tenant info at bottom */}
          {!sidebarCollapsed && selectedTenantObj && (
            <div style={{
              marginTop: 'auto',
              padding: '16px',
              borderTop: '1px solid #1E293B'
            }}>
              <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Tenant
              </div>
              <div style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: '600' }}>
                {selectedTenantObj.name}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
          {activeDashboard === 'smartSpaces' && (
            <SmartSpacesDashboard
              buildings={tenantBuildings}
              invitations={tenantInvitations}
            />
          )}

          {activeDashboard === 'visitors' && (
            <div style={{ padding: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
              }}>
                <VisitorDashboard
                  invitations={tenantInvitations}
                  startDate=""
                  endDate=""
                  searchTerm=""
                />
              </div>
            </div>
          )}

          {activeDashboard === 'parking' && (
            <div style={{ padding: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
              }}>
                <ParkingDashboard
                  parkingSpaces={tenantParkingSpaces}
                  parkingBookings={tenantParkingBookings}
                  searchTerm=""
                />
              </div>
            </div>
          )}

          {activeDashboard === 'lockers' && (
            <div style={{ padding: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
              }}>
                <LockerDashboard
                  lockers={tenantLockers}
                  lockerUsages={tenantLockerUsages}
                  searchTerm=""
                />
              </div>
            </div>
          )}

          {activeDashboard === 'badges' && (
            <div style={{ padding: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
              }}>
                <BadgesDashboard
                  badges={tenantBadges}
                  badgeSwipes={tenantBadgeSwipes}
                  searchTerm=""
                />
              </div>
            </div>
          )}

          {activeDashboard === 'spaces' && (
            <div style={{ padding: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
              }}>
                <SpaceBookingDashboard
                  spaces={tenantSpaces || []}
                  searchTerm=""
                />
              </div>
            </div>
          )}

          {/* ─── Operational Overview ─── */}
          {activeDashboard === 'operationalOverview' && (
            <Dashboard0OperationalOverview
              externalSystems={globalState.externalSystems}
              tickets={tenantTickets}
            />
          )}

          {/* ─── Figma-based Dashboards ─── */}
          {activeDashboard === 'officeServices' && (
            <Dashboard1OfficeServices tickets={tenantTickets} />
          )}
          {activeDashboard === 'officeBuilding' && (
            <Dashboard2OfficeBuilding buildings={tenantBuildings} />
          )}
          {activeDashboard === 'amenityServices' && (
            <Dashboard3AmenityServices />
          )}
          {activeDashboard === 'employeeServices' && (
            <Dashboard4EmployeeServices
              parkingSpaces={tenantParkingSpaces}
              parkingBookings={tenantParkingBookings}
              spaces={tenantSpaces || []}
            />
          )}
          {activeDashboard === 'visitorServices' && (
            <Dashboard5VisitorCenter invitations={tenantInvitations} />
          )}
          {activeDashboard === 'parkingServices' && (
            <Dashboard6ParkingRestaurant
              parkingSpaces={tenantParkingSpaces}
              parkingBookings={tenantParkingBookings}
            />
          )}
          {activeDashboard === 'occupancyServices' && (
            <Dashboard7OccupancyServices
              badgeSwipes={tenantBadgeSwipes || []}
            />
          )}
          {activeDashboard === 'sustainability' && (
            <Dashboard9Sustainability />
          )}
          {activeDashboard === 'wellbeing' && (
            <Dashboard10Wellbeing invitations={tenantInvitations} />
          )}
        </div>
      </div>
    </div>
  )
}
