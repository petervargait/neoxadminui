'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { AlertRegular, MailRegular, AlertOnRegular, DeleteRegular, ArrowUploadRegular, AddRegular, ArrowDownloadRegular, PeopleRegular, VehicleCarRegular, DocumentRegular, PersonRegular, SettingsRegular, PhoneRegular, ClockRegular, WarningRegular, InfoRegular, CheckmarkCircleRegular, BuildingRegular } from '@fluentui/react-icons'
import { useGlobalState } from '../../context/GlobalStateContext'

export default function TenantPage() {
  const router = useRouter()
  const globalState = useGlobalState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [tenantName, setTenantName] = useState('Organization')
  const [selectedTenantId, setSelectedTenantId] = useState('')

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated')
    const storedUsername = sessionStorage.getItem('username') || ''
    const storedTenantName = sessionStorage.getItem('selectedTenantName') || 'Organization'
    const storedTenantId = sessionStorage.getItem('selectedTenant') || ''
    
    if (authStatus !== 'true') {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
      setUsername(storedUsername)
      setTenantName(storedTenantName)
      setSelectedTenantId(storedTenantId)
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  // Global Profiles inherited from admin - in a real app, this would be fetched from API/context
  const [globalProfiles] = useState<Array<{id: string; name: string; description: string; modules: string[]; isGlobal: boolean}>>([
    { id: 'prof1', name: 'Full Access', description: 'Complete access to all system modules', modules: ['User Management', 'Visitor Management', 'Parking', 'Emergency', 'Map', 'Restaurant', 'Ticketing', 'Service Hub', 'Lockers', 'News', 'AI Assistant', 'Space Management', 'Private Delivery', 'Authentication', 'Reporting'], isGlobal: true },
    { id: 'prof2', name: 'Limited Access', description: 'Access to core operational modules', modules: ['User Management', 'Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Space Management', 'Reporting'], isGlobal: true },
    { id: 'prof3', name: 'Visitor Management Only', description: 'Limited to front desk and visitor operations', modules: ['Visitor Management', 'Emergency', 'Map', 'Ticketing', 'Lockers', 'News'], isGlobal: true },
  ])
  // Tenant-specific profiles
  const [tenantProfiles, setTenantProfiles] = useState<Array<{id: string; name: string; description: string; modules: string[]; isGlobal: boolean}>>([])
  // Combined profiles (global + tenant-specific)
  const profiles = [...globalProfiles, ...tenantProfiles]
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState<{id?: string; name: string; description: string; modules: string[]} | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<{id?: string; name: string; email: string; role: string; department: string; status: string; profileId?: string} | null>(null)
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')
  const [userSortField, setUserSortField] = useState<'name' | 'email' | 'role' | 'department' | 'status'>('name')
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc')
  const [expandedUserRow, setExpandedUserRow] = useState<number | null>(null)
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<{name: string; subject?: string; status?: string} | null>(null)
  const [showParkingModal, setShowParkingModal] = useState(false)
  const [selectedParkingSpace, setSelectedParkingSpace] = useState<string | null>(null)
  const [showLockerModal, setShowLockerModal] = useState(false)
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null)
  const [showSpaceModal, setShowSpaceModal] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [systemOnline, setSystemOnline] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)
  const [invitationForm, setInvitationForm] = useState({
    visitorName: '',
    visitorEmail: '',
    visitorCompany: '',
    visitDate: '',
    visitTime: '',
    purpose: '',
    location: 'Main Office'
  })
  const [editingInvitation, setEditingInvitation] = useState<string | null>(null)

  // Digital Badges state
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [editingBadge, setEditingBadge] = useState<{id?: number; name: string; email: string; company: string; cardType: string; imei: string} | null>(null)
  const [badgeSearchTerm, setBadgeSearchTerm] = useState('')
  const [badgeStatusFilter, setBadgeStatusFilter] = useState('All Statuses')
  const [badgeCardTypeFilter, setBadgeCardTypeFilter] = useState('All Card Types')
  const [showBadgeImportModal, setShowBadgeImportModal] = useState(false)

  // Digital Badges handlers
  const handleAddBadgeUser = () => {
    setEditingBadge({ name: '', email: '', company: '', cardType: 'Mifare EV3', imei: '' })
    setShowBadgeModal(true)
  }

  const handleEditBadgeUser = (user: typeof globalState.badges[0]) => {
    setEditingBadge(user)
    setShowBadgeModal(true)
  }

  const handleSaveBadgeUser = () => {
    if (!editingBadge) return
    
    if (!editingBadge.name || !editingBadge.email || !editingBadge.company || !editingBadge.imei) {
      alert('Please fill in all required fields')
      return
    }

    if (editingBadge.id) {
      // Update existing
      globalState.updateBadge(editingBadge.id, { 
        name: editingBadge.name, 
        email: editingBadge.email, 
        company: editingBadge.company, 
        cardType: editingBadge.cardType, 
        imei: editingBadge.imei 
      })
      alert('Badge user updated successfully')
    } else {
      // Add new
      globalState.addBadge({ 
        name: editingBadge.name, 
        email: editingBadge.email, 
        company: editingBadge.company, 
        cardType: editingBadge.cardType, 
        imei: editingBadge.imei,
        status: 'New'
      })
      alert('Badge user added successfully')
    }
    
    setShowBadgeModal(false)
    setEditingBadge(null)
  }

  const handleDeleteBadgeUser = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user && confirm(`Delete badge for ${user.name}? This action cannot be undone.`)) {
      globalState.deleteBadge(userId)
      alert('Badge user deleted successfully')
    }
  }

  const handleSendBadgeEmail = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user) {
      globalState.updateBadge(userId, { status: 'Sent' })
      alert(`Badge email sent to ${user.email}`)
    }
  }

  const handleSendBadgePush = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user) {
      globalState.updateBadge(userId, { status: 'Sent' })
      alert(`Push notification sent to ${user.name}`)
    }
  }

  const handleSuspendBadge = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user && confirm(`Suspend badge for ${user.name}?`)) {
      globalState.updateBadge(userId, { status: 'Suspended' })
      alert('Badge suspended successfully')
    }
  }

  const handleRecoverBadge = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user && confirm(`Recover badge for ${user.name}?`)) {
      globalState.updateBadge(userId, { status: 'Downloaded' })
      alert('Badge recovered successfully')
    }
  }

  const handleBadgeImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        const lines = csv.split('\n').filter(line => line.trim())
        
        lines.slice(1).forEach((line) => {
          const values = line.split(',')
          if (values[0]?.trim()) {
            globalState.addBadge({
              name: values[0]?.trim() || '',
              email: values[1]?.trim() || '',
              company: values[2]?.trim() || '',
              cardType: values[3]?.trim() || 'NFC',
              imei: values[4]?.trim() || '',
              status: 'New'
            })
          }
        })
        
        alert(`Successfully imported badge users`)
        setShowBadgeImportModal(false)
      }
      reader.readAsText(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const filteredBadgeUsers = globalState.badges.filter(user => {
    const matchesSearch = badgeSearchTerm === '' || 
      user.name.toLowerCase().includes(badgeSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(badgeSearchTerm.toLowerCase())
    const matchesStatus = badgeStatusFilter === 'All Statuses' || user.status === badgeStatusFilter
    const matchesCardType = badgeCardTypeFilter === 'All Card Types' || user.cardType === badgeCardTypeFilter
    return matchesSearch && matchesStatus && matchesCardType
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh', 
      backgroundColor: '#0B1426',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '60px' : '280px',
        backgroundColor: '#162032',
        borderRight: '1px solid #1E293B',
        transition: 'width 0.3s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          padding: '24px 20px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          <NeoxLogo width="128px" height="128px" />
        </Link>

        {/* Navigation */}
        <nav style={{ padding: '20px 0', flex: 1 }}>
          {[
            { icon: '◈', label: 'Dashboard', action: () => setActiveSection(null), isFluentIcon: false, iconType: null },
            { icon: '✓', label: 'Tasks', action: () => setActiveSection('tasks'), isFluentIcon: false, iconType: null, badge: globalState.tasks.filter(t => t.status === 'pending' && (t.data as {tenantId?: string}).tenantId === selectedTenantId).length },
            { icon: '◐', label: 'Analytics', action: () => setActiveSection('analytics'), isFluentIcon: false, iconType: null },
            { icon: 'people', label: 'Users', action: () => setActiveSection('users'), isFluentIcon: true, iconType: 'people' },
            { icon: 'person', label: 'Invitations', action: () => setActiveSection('invitations'), isFluentIcon: true, iconType: 'person' },
            { icon: 'vehicle', label: 'Parking', action: () => setActiveSection('parking'), isFluentIcon: true, iconType: 'vehicle' },
            { icon: '◎', label: 'Lockers', action: () => setActiveSection('lockers'), isFluentIcon: false, iconType: null },
            { icon: '◩', label: 'Spaces', action: () => setActiveSection('spaces'), isFluentIcon: false, iconType: null },
            { icon: 'building', label: 'Building Config', action: () => setActiveSection('buildings'), isFluentIcon: true, iconType: 'building' },
            { icon: 'document', label: 'Digital Badges', action: () => setActiveSection('digitalBadges'), isFluentIcon: true, iconType: 'document' },
            { icon: '◨', label: 'Templates', action: () => setActiveSection('templates'), isFluentIcon: false, iconType: null },
            { icon: '◪', label: 'Policies', action: () => setActiveSection('policies'), isFluentIcon: false, iconType: null },
            { icon: 'settings', label: 'Modules', action: () => setActiveSection('modules'), isFluentIcon: true, iconType: 'settings' },
            { icon: '◭', label: 'Support', action: () => setActiveSection('support'), isFluentIcon: false, iconType: null },
          ].map((item, index) => (
            <div key={index} 
              onClick={item.action}
              style={{
                padding: '12px 20px',
                margin: '4px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#94A3B8',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.backgroundColor = '#1E293B';
                target.style.color = '#F1F5F9';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.backgroundColor = 'transparent';
                target.style.color = '#94A3B8';
              }}
            >
              {item.isFluentIcon ? (
                item.iconType === 'people' ? (
                  <PeopleRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'person' ? (
                  <PersonRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'vehicle' ? (
                  <VehicleCarRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'document' ? (
                  <DocumentRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'settings' ? (
                  <SettingsRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'building' ? (
                  <BuildingRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : (
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                )
              ) : (
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
              )}
              {!sidebarCollapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span style={{
                      backgroundColor: '#EF4444',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      minWidth: '18px',
                      textAlign: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Back to Home Button */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          color: '#64748B',
          textDecoration: 'none',
          fontSize: '14px',
          borderTop: '1px solid #1E293B',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1E293B'
          e.currentTarget.style.color = '#F1F5F9'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#64748B'
        }}>
          <span style={{ fontSize: '18px' }}>◄</span>
          {!sidebarCollapsed && <span>Back to Home</span>}
        </Link>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-12px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#3B82F6',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            zIndex: 10
          }}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          height: '70px',
          backgroundColor: '#0B1426',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          <div>
            <h1 style={{ 
              color: '#F1F5F9', 
              fontSize: '24px', 
              fontWeight: '600', 
              margin: 0 
            }}>
              {activeSection === 'tasks' && 'Approval Tasks'}
              {activeSection === 'analytics' && 'Analytics Dashboard'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'invitations' && 'Invitation Management'}
              {activeSection === 'parking' && 'Parking Management'}
              {activeSection === 'lockers' && 'Locker Management'}
              {activeSection === 'spaces' && 'Space Management'}
              {activeSection === 'digitalBadges' && 'Digital Badges Management'}
              {activeSection === 'templates' && 'Template Management'}
              {activeSection === 'policies' && 'Company Policies'}
              {activeSection === 'support' && 'Support & Help'}
              {activeSection === 'notifications' && 'Notifications'}
              {!activeSection && `${tenantName} - Tenant Admin Dashboard`}
            </h1>
            <p style={{ 
              color: '#64748B', 
              fontSize: '14px', 
              margin: '4px 0 0 0' 
            }}>
              {activeSection ? `Manage ${tenantName}` : `Welcome to ${tenantName}`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* System Status Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: systemOnline ? '#22C55E' : '#EF4444',
                boxShadow: systemOnline ? '0 0 10px rgba(34, 197, 94, 0.6)' : '0 0 10px rgba(239, 68, 68, 0.6)'
              }} />
              <span style={{ color: '#F1F5F9', fontSize: '12px', fontWeight: '500' }}>
                {systemOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Notifications */}
            <button
              onClick={() => setActiveSection('notifications')}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#334155'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B'
              }}
              title="Notifications"
            >
              <AlertRegular style={{ fontSize: '20px', width: '20px', height: '20px', color: '#F1F5F9' }} />
              {notificationCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#EF4444',
                  borderRadius: '50%',
                  border: '2px solid #1E293B'
                }}></span>
              )}
            </button>

            {/* User Profile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 12px',
              height: '40px',
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {username.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{username}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: '0 16px',
                height: '40px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F1F5F9',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EF4444'
                e.currentTarget.style.borderColor = '#EF4444'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B'
                e.currentTarget.style.borderColor = '#334155'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          {/* Default Dashboard View */}
          {!activeSection && (
            <>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(215, 187, 145, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#D7BB91',
                      boxShadow: '0 0 15px rgba(215, 187, 145, 0.4), 0 0 30px rgba(215, 187, 145, 0.2)'
                    }}>◎</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>{globalState.users.filter(u => u.tenantId === selectedTenantId).length}</div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Total Users</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>{globalState.users.filter(u => u.tenantId === selectedTenantId && u.status === 'active').length} active</p>
                </div>

                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(203, 213, 225, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#CBD5E1',
                      boxShadow: '0 0 15px rgba(203, 213, 225, 0.4), 0 0 30px rgba(203, 213, 225, 0.2)'
                    }}>◫</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>{globalState.invitations.length}</div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Active Invitations</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>{globalState.invitations.filter(i => i.status === 'pending').length} pending</p>
                </div>

                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(96, 165, 250, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#60A5FA',
                      boxShadow: '0 0 15px rgba(96, 165, 250, 0.4), 0 0 30px rgba(96, 165, 250, 0.2)'
                    }}>◧</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>
                      {globalState.parkingSpaces.filter(p => (!p.tenantId || p.tenantId === selectedTenantId) && p.status === 'occupied').length}/
                      {globalState.parkingSpaces.filter(p => !p.tenantId || p.tenantId === selectedTenantId).length}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Parking Spaces</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                    {globalState.parkingSpaces.filter(p => (!p.tenantId || p.tenantId === selectedTenantId) && p.status === 'available').length} available
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#8B5CF6',
                      boxShadow: '0 0 15px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2)'
                    }}>◎</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>
                      {globalState.lockers.filter(l => l.type === 'permanent' && (!l.tenantId || l.tenantId === selectedTenantId) && l.status === 'occupied').length}/
                      {globalState.lockers.filter(l => l.type === 'permanent' && (!l.tenantId || l.tenantId === selectedTenantId)).length}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Permanent Lockers</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                    {globalState.lockers.filter(l => l.type === 'permanent' && (!l.tenantId || l.tenantId === selectedTenantId) && l.status === 'available').length} available
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#F1F5F9', marginBottom: '20px' }}>Quick Actions</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  <button 
                    onClick={() => setActiveSection('users')}
                    style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      color: '#F1F5F9',
                      border: '2px solid #D7BB91',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 0 10px rgba(215, 187, 145, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D7BB91'
                      e.currentTarget.style.color = '#0B1426'
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(215, 187, 145, 0.6)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B'
                      e.currentTarget.style.color = '#F1F5F9'
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(215, 187, 145, 0.3)'
                    }}
                  >
                    Manage Users
                  </button>
                  
                  <button 
                    onClick={() => setActiveSection('invitations')}
                    style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      color: '#F1F5F9',
                      border: '2px solid #D7BB91',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 0 10px rgba(215, 187, 145, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D7BB91'
                      e.currentTarget.style.color = '#0B1426'
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(215, 187, 145, 0.6)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B'
                      e.currentTarget.style.color = '#F1F5F9'
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(215, 187, 145, 0.3)'
                    }}
                  >
                    Send Invitation
                  </button>
                  
                  <button 
                    onClick={() => setActiveSection('templates')}
                    style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      color: '#F1F5F9',
                      border: '2px solid #D7BB91',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 0 10px rgba(215, 187, 145, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D7BB91'
                      e.currentTarget.style.color = '#0B1426'
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(215, 187, 145, 0.6)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B'
                      e.currentTarget.style.color = '#F1F5F9'
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(215, 187, 145, 0.3)'
                    }}
                  >
                    Manage Templates
                  </button>
                  
                  <button 
                    onClick={() => setActiveSection('analytics')}
                    style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      color: '#F1F5F9',
                      border: '2px solid #D7BB91',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 0 10px rgba(215, 187, 145, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D7BB91'
                      e.currentTarget.style.color = '#0B1426'
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(215, 187, 145, 0.6)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B'
                      e.currentTarget.style.color = '#F1F5F9'
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(215, 187, 145, 0.3)'
                    }}
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Tasks Section */}
          {activeSection === 'tasks' && (() => {
            const tenantTasks = globalState.tasks.filter(t => (t.data as {tenantId?: string}).tenantId === selectedTenantId);
            const pendingTasks = tenantTasks.filter(t => t.status === 'pending');
            const approvedTasks = tenantTasks.filter(t => t.status === 'approved');
            const rejectedTasks = tenantTasks.filter(t => t.status === 'rejected');

            return (
            <div>
              {/* Info Banner */}
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <InfoRegular style={{ color: '#3B82F6', fontSize: '20px' }} />
                <div>
                  <h4 style={{ color: '#F1F5F9', fontSize: '14px', margin: '0 0 4px 0', fontWeight: '600' }}>Approval Workflow</h4>
                  <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>
                    {pendingTasks.length > 0 
                      ? `You have ${pendingTasks.length} pending task${pendingTasks.length > 1 ? 's' : ''} that require${pendingTasks.length === 1 ? 's' : ''} approval.`
                      : 'No pending approval tasks at the moment.'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Pending</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B' }}>{pendingTasks.length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Approved</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>{approvedTasks.length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Rejected</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>{rejectedTasks.length}</div>
                </div>
              </div>

              {/* Tasks List */}
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', overflow: 'hidden' }}>
                {tenantTasks.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
                    <CheckmarkCircleRegular style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '16px', margin: 0 }}>No approval tasks yet</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#0F1629' }}>
                          <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Type</th>
                          <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Entity</th>
                          <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Requested By</th>
                          <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Date</th>
                          <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                          <th style={{ padding: '16px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenantTasks.map((task) => (
                          <tr key={task.id} style={{ borderBottom: '1px solid #1E293B' }}>
                            <td style={{ padding: '16px 24px' }}>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: task.type === 'create' ? 'rgba(16, 185, 129, 0.1)' : task.type === 'update' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: task.type === 'create' ? '#10B981' : task.type === 'update' ? '#3B82F6' : '#EF4444'
                              }}>
                                {task.type.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                              <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{task.entityName}</div>
                              <div style={{ color: '#64748B', fontSize: '12px' }}>{task.entity}</div>
                            </td>
                            <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>{task.requestedByName}</td>
                            <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>{new Date(task.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '16px 24px' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: task.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : task.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: task.status === 'pending' ? '#F59E0B' : task.status === 'approved' ? '#10B981' : '#EF4444'
                              }}>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                              </span>
                            </td>
                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                              {task.status === 'pending' ? (
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Approve this ${task.type} ${task.entity} request?`)) {
                                        globalState.approveTask(task.id, username)
                                        alert('Task approved successfully')
                                      }
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#10B981',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      const comments = prompt('Reason for rejection (optional):')
                                      if (comments !== null) {
                                        globalState.rejectTask(task.id, username, comments || undefined)
                                        alert('Task rejected successfully')
                                      }
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#1E293B',
                                      color: '#EF4444',
                                      border: '1px solid #EF4444',
                                      borderRadius: '6px',
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    ✗ Reject
                                  </button>
                                </div>
                              ) : (
                                <div style={{ color: '#64748B', fontSize: '13px' }}>
                                  {task.reviewedBy && `By ${task.reviewedBy}`}
                                  {task.reviewedAt && ` on ${new Date(task.reviewedAt).toLocaleDateString()}`}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );})()}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (() => {
            // Filter data for current tenant
            const tenantUsers = globalState.users.filter(u => u.tenantId === selectedTenantId);
            const tenantInvitations = globalState.invitations;
            const tenantTickets = globalState.tickets.filter(t => t.tenantId === selectedTenantId);
            const tenantBadges = globalState.badges;
            const tenantLockers = globalState.lockers.filter(l => l.type === 'permanent' && (!l.tenantId || l.tenantId === selectedTenantId));
            
            const activeUsers = tenantUsers.filter(u => u.status === 'active').length;
            const pendingInvitations = tenantInvitations.filter(i => i.status === 'pending').length;
            const totalParkingSpaces = globalState.parkingSpaces.filter(p => !p.tenantId || p.tenantId === selectedTenantId).length;
            const occupiedSpaces = globalState.parkingSpaces.filter(p => (!p.tenantId || p.tenantId === selectedTenantId) && (p.status === 'occupied' || p.status === 'reserved')).length;
            const parkingUsagePercent = totalParkingSpaces > 0 ? Math.round((occupiedSpaces / totalParkingSpaces) * 100) : 0;
            const openTickets = tenantTickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
            const occupiedLockers = tenantLockers.filter(l => l.status === 'occupied').length;
            const lockerUsagePercent = tenantLockers.length > 0 ? Math.round((occupiedLockers / tenantLockers.length) * 100) : 0;
            
            // Get recent audit logs for this tenant
            const recentLogs = globalState.auditLogs.slice(0, 5);
            
            return (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Users</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>{tenantUsers.length}</div>
                  <div style={{ fontSize: '14px', color: '#10B981' }}>{activeUsers} active</div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Invitations</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3B82F6', marginBottom: '8px' }}>{tenantInvitations.length}</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>{pendingInvitations} pending</div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Parking Usage</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#F59E0B', marginBottom: '8px' }}>{parkingUsagePercent}%</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>{occupiedSpaces} of {totalParkingSpaces} spaces</div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Support Tickets</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: tenantTickets.length === 0 ? '#10B981' : '#3B82F6', marginBottom: '8px' }}>{tenantTickets.length}</div>
                  <div style={{ fontSize: '14px', color: openTickets > 0 ? '#F59E0B' : '#10B981' }}>{openTickets} open</div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Digital Badges</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#D7BB91', marginBottom: '8px' }}>{tenantBadges.length}</div>
                  <div style={{ fontSize: '14px', color: '#10B981' }}>{tenantBadges.filter(b => b.status === 'Downloaded').length} activated</div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>User Status</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>{activeUsers}</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>{tenantUsers.filter(u => u.status === 'pending').length} pending</div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Locker Usage</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8B5CF6', marginBottom: '8px' }}>{lockerUsagePercent}%</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>{occupiedLockers} of {tenantLockers.length} lockers</div>
                </div>
              </div>
              <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                <h4 style={{ color: '#F1F5F9', fontSize: '18px', margin: '0 0 20px 0' }}>Recent Activity</h4>
                {recentLogs.length === 0 ? (
                  <div style={{ color: '#64748B', textAlign: 'center', padding: '24px' }}>No recent activity</div>
                ) : (
                  recentLogs.map((log, idx) => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: idx < recentLogs.length - 1 ? '1px solid #1E293B' : 'none' }}>
                      <div>
                        <div style={{ color: '#F1F5F9', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>{log.action}</div>
                        <div style={{ color: '#64748B', fontSize: '13px' }}>{log.user}</div>
                      </div>
                      <span style={{ color: '#64748B', fontSize: '13px' }}>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );})()}

          {/* User Management Section */}
          {activeSection === 'users' && (
            <div style={{
              backgroundColor: '#162032',
              borderRadius: '12px',
              border: '1px solid #1E293B',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>User Management</h2>
                  <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Manage organization users and permissions</p>
                </div>
                <button onClick={() => { 
                  setEditingUser(null); 
                  setSelectedProfileId(''); 
                  setShowUserModal(true); 
                }} style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  + Add User
                </button>
              </div>
              
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
                  <input type="search" placeholder="Search users..." style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} />
                  <select style={{
                    padding: '10px 16px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Receptionist</option>
                    <option>User</option>
                  </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th onClick={() => {
                          if (userSortField === 'name') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('name');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Name {userSortField === 'name' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => {
                          if (userSortField === 'email') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('email');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Email {userSortField === 'email' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => {
                          if (userSortField === 'role') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('role');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Role {userSortField === 'role' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => {
                          if (userSortField === 'department') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('department');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Department {userSortField === 'department' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => {
                          if (userSortField === 'status') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('status');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Status {userSortField === 'status' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Modules</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalState.users
                        .filter(u => u.tenantId === selectedTenantId)
                        .sort((a, b) => {
                        const aVal = a[userSortField].toLowerCase();
                        const bVal = b[userSortField].toLowerCase();
                        if (userSortDirection === 'asc') {
                          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                        } else {
                          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
                        }
                      }).map((user, idx) => (
                        <>
                          <tr key={idx} style={{ borderBottom: expandedUserRow === idx ? 'none' : '1px solid #1E293B' }}>
                            <td style={{ padding: '16px', color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{user.name}</td>
                            <td style={{ padding: '16px', color: '#94A3B8', fontSize: '14px' }}>{user.email}</td>
                            <td style={{ padding: '16px' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: user.role === 'Admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'Manager' ? 'rgba(245, 158, 11, 0.1)' : user.role === 'Receptionist' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: user.role === 'Admin' ? '#EF4444' : user.role === 'Manager' ? '#F59E0B' : user.role === 'Receptionist' ? '#8B5CF6' : '#3B82F6'
                              }}>
                                {user.role}
                              </span>
                            </td>
                            <td style={{ padding: '16px', color: '#94A3B8', fontSize: '14px' }}>{user.department}</td>
                            <td style={{ padding: '16px' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: user.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                color: user.status === 'active' ? '#10B981' : '#64748B'
                              }}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </span>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <button 
                                onClick={() => setExpandedUserRow(expandedUserRow === idx ? null : idx)}
                                style={{
                                  backgroundColor: '#3B82F6',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: 'white',
                                  fontSize: '12px',
                                  padding: '6px 12px',
                                  cursor: 'pointer'
                                }}>
                                {expandedUserRow === idx ? 'Hide' : 'View'} ({profiles.find(p => p.id === user.profileId)?.modules.length || 0} modules)
                              </button>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>
                            {/* Check if user is a tenant admin - tenant admins cannot be edited or deleted on tenant site */}
                            {user.role === 'Admin' ? (
                              <span style={{
                                color: '#64748B',
                                fontSize: '12px',
                                fontStyle: 'italic'
                              }}>Admin (Managed by System)</span>
                            ) : (
                              <>
                                <button onClick={() => { 
                                  setEditingUser(user); 
                                  setSelectedProfileId(user.profileId || ''); 
                                  setShowUserModal(true); 
                                }} style={{
                                  backgroundColor: 'transparent',
                                  border: '1px solid #1E293B',
                                  borderRadius: '6px',
                                  color: '#3B82F6',
                                  fontSize: '12px',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                  marginRight: '8px'
                                }}>Edit</button>
                                <button onClick={() => { 
                                  if (confirm(`${user.status === 'active' ? 'Deactivate' : 'Reactivate'} ${user.name}?`)) { 
                                    globalState.updateUser(user.id, { status: user.status === 'active' ? 'inactive' : 'active' });
                                    alert(`User ${user.status === 'active' ? 'deactivated' : 'reactivated'} successfully`); 
                                  } 
                                }} style={{
                                  backgroundColor: 'transparent',
                                  border: '1px solid #1E293B',
                                  borderRadius: '6px',
                                  color: user.status === 'active' ? '#F59E0B' : '#10B981',
                                  fontSize: '12px',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                  marginRight: '8px'
                                }}>{user.status === 'active' ? 'Deactivate' : 'Reactivate'}</button>
                                <button onClick={() => { 
                                  if (confirm(`Delete ${user.name}? This action cannot be undone.`)) { 
                                    globalState.deleteUser(user.id);
                                    alert('User deleted successfully'); 
                                  } 
                                }} style={{
                                  backgroundColor: 'transparent',
                                  border: '1px solid #1E293B',
                                  borderRadius: '6px',
                                  color: '#EF4444',
                                  fontSize: '12px',
                                  padding: '6px 12px',
                                  cursor: 'pointer'
                                }}>Delete</button>
                              </>
                            )}
                            </td>
                          </tr>
                          {expandedUserRow === idx && (
                            <tr key={`${idx}-modules`} style={{ borderBottom: '1px solid #1E293B' }}>
                              <td colSpan={7} style={{ padding: '16px', backgroundColor: '#0F1629' }}>
                                <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#1E293B', borderRadius: '8px' }}>
                                  <div style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Access Profile:</div>
                                  <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>
                                    {profiles.find(p => p.id === user.profileId)?.name || 'No profile assigned'}
                                  </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                                  {(profiles.find(p => p.id === user.profileId)?.modules || []).map((module) => (
                                    <div key={module} style={{
                                      padding: '8px 12px',
                                      backgroundColor: '#1E293B',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      border: '1px solid #10B981'
                                    }}>
                                      <span style={{ color: '#F1F5F9', fontSize: '13px' }}>{module}</span>
                                      <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10B981'
                                      }}>
                                        Enabled
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Invitation Management Section */}
          {activeSection === 'invitations' && (
            <div>
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>{editingInvitation ? 'Edit Invitation' : 'Send New Invitation'}</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!invitationForm.visitorName || !invitationForm.visitorEmail || !invitationForm.visitDate || !invitationForm.visitTime) {
                    alert('Please fill in all required fields');
                    return;
                  }
                  
                  if (editingInvitation) {
                    globalState.updateInvitation(editingInvitation, {
                      visitorName: invitationForm.visitorName,
                      visitorEmail: invitationForm.visitorEmail,
                      visitorCompany: invitationForm.visitorCompany,
                      visitDate: invitationForm.visitDate,
                      visitTime: invitationForm.visitTime,
                      purpose: invitationForm.purpose,
                      location: invitationForm.location
                    });
                    alert('Invitation updated successfully!');
                    setEditingInvitation(null);
                  } else {
                    globalState.addInvitation({
                      visitorName: invitationForm.visitorName,
                      visitorEmail: invitationForm.visitorEmail,
                      visitorCompany: invitationForm.visitorCompany,
                      hostId: username,
                      hostName: username,
                      visitDate: invitationForm.visitDate,
                      visitTime: invitationForm.visitTime,
                      purpose: invitationForm.purpose,
                      location: invitationForm.location,
                      status: 'pending'
                    });
                    alert('Invitation sent successfully!');
                  }
                  
                  setInvitationForm({
                    visitorName: '',
                    visitorEmail: '',
                    visitorCompany: '',
                    visitDate: '',
                    visitTime: '',
                    purpose: '',
                    location: 'Main Office'
                  });
                }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visitor Name *</label>
                    <input type="text" placeholder="Full name" required value={invitationForm.visitorName} onChange={(e) => setInvitationForm({...invitationForm, visitorName: e.target.value})} style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} />
                  </div>
                  <div>
                    <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email *</label>
                    <input type="email" placeholder="visitor@email.com" required value={invitationForm.visitorEmail} onChange={(e) => setInvitationForm({...invitationForm, visitorEmail: e.target.value})} style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} />
                  </div>
                  <div>
                    <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visit Date *</label>
                    <input type="date" required value={invitationForm.visitDate} onChange={(e) => setInvitationForm({...invitationForm, visitDate: e.target.value})} style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} />
                  </div>
                  <div>
                    <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visit Time *</label>
                    <input type="time" required value={invitationForm.visitTime} onChange={(e) => setInvitationForm({...invitationForm, visitTime: e.target.value})} style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Purpose of Visit</label>
                    <textarea placeholder="Enter purpose of visit" value={invitationForm.purpose} onChange={(e) => setInvitationForm({...invitationForm, purpose: e.target.value})} style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      minHeight: '80px',
                      resize: 'vertical'
                    }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
                    <button type="submit" style={{
                      flex: 1,
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>{editingInvitation ? 'Update Invitation' : 'Send Invitation'}</button>
                    {editingInvitation && (
                      <button type="button" onClick={() => {
                        setEditingInvitation(null);
                        setInvitationForm({
                          visitorName: '',
                          visitorEmail: '',
                          visitorCompany: '',
                          visitDate: '',
                          visitTime: '',
                          purpose: '',
                          location: 'Main Office'
                        });
                      }} style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        color: '#F1F5F9',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>Cancel Edit</button>
                    )}
                  </div>
                </form>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Active Invitations</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  {globalState.invitations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>No Invitations</div>
                      <div style={{ fontSize: '14px', marginTop: '8px' }}>Send your first visitor invitation above</div>
                    </div>
                  ) : globalState.invitations.map((inv) => (
                    <div key={inv.id} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#F1F5F9', margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{inv.visitorName}</h4>
                        <p style={{ color: '#94A3B8', margin: '0 0 4px 0', fontSize: '13px' }}>{inv.visitorEmail}</p>
                        <p style={{ color: '#64748B', margin: 0, fontSize: '13px' }}>{inv.visitDate} at {inv.visitTime} • {inv.purpose || 'No purpose specified'}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: inv.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : inv.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: inv.status === 'approved' ? '#10B981' : inv.status === 'rejected' ? '#EF4444' : '#F59E0B'
                        }}>
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </span>
                        <button onClick={() => {
                          setInvitationForm({
                            visitorName: inv.visitorName,
                            visitorEmail: inv.visitorEmail,
                            visitorCompany: inv.visitorCompany || '',
                            visitDate: inv.visitDate,
                            visitTime: inv.visitTime,
                            purpose: inv.purpose,
                            location: inv.location
                          });
                          setEditingInvitation(inv.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#3B82F6',
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}>Edit</button>
                        <button onClick={() => {
                          if (confirm(`Delete invitation for ${inv.visitorName}?`)) {
                            globalState.deleteInvitation(inv.id);
                            alert('Invitation deleted successfully');
                          }
                        }} style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#EF4444',
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Parking Management Section */}
          {activeSection === 'parking' && (() => {
            // Filter parking spaces for this tenant (either assigned to this tenant or global spaces without tenantId)
            const tenantParkingSpaces = globalState.parkingSpaces.filter(p => !p.tenantId || p.tenantId === selectedTenantId);
            const occupiedSpaces = tenantParkingSpaces.filter(p => p.status === 'occupied');
            const availableSpaces = tenantParkingSpaces.filter(p => p.status === 'available');

            return (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Spaces</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F1F5F9' }}>{tenantParkingSpaces.length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Occupied</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>{occupiedSpaces.length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Available</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>{availableSpaces.length}</div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Parking Spaces</h3>
                  <button onClick={() => setShowParkingModal(true)} style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>Assign Space</button>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                    {tenantParkingSpaces.map((space) => {
                      const isOccupied = space.status === 'occupied';
                      return (
                        <div key={space.id} 
                          onClick={() => {
                            if (!isOccupied) {
                              setSelectedParkingSpace(space.spaceNumber);
                              setShowParkingModal(true);
                            }
                          }}
                          style={{
                          padding: '20px',
                          backgroundColor: isOccupied ? '#1E293B' : '#0F1629',
                          border: `2px solid ${isOccupied ? '#EF4444' : '#10B981'}`,
                          borderRadius: '8px',
                          textAlign: 'center',
                          cursor: isOccupied ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          opacity: isOccupied ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isOccupied) e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isOccupied) e.currentTarget.style.transform = 'scale(1)';
                        }}>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: isOccupied ? '#EF4444' : '#10B981', marginBottom: '4px' }}>{space.spaceNumber}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>{isOccupied ? 'Occupied' : 'Available'}</div>
                          {isOccupied && space.assignedToName && (
                            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>{space.assignedToName}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden',
                marginTop: '24px'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Current Assignments</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  {occupiedSpaces.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>No parking assignments yet</div>
                      <div style={{ fontSize: '14px', marginTop: '8px' }}>Assign parking spaces to users from the available spaces above</div>
                    </div>
                  ) : (
                    occupiedSpaces.map((assignment) => (
                    <div key={assignment.id} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#0F1629',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#3B82F6'
                        }}>{assignment.spaceNumber}</div>
                        <div>
                          <h4 style={{ color: '#F1F5F9', margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>{assignment.assignedToName || 'Unknown User'}</h4>
                          <p style={{ color: '#94A3B8', margin: '0 0 2px 0', fontSize: '13px' }}>{assignment.vehiclePlate || 'No vehicle info'}</p>
                          <p style={{ color: '#64748B', margin: 0, fontSize: '12px' }}>{assignment.location}</p>
                          {assignment.assignedDate && (
                            <p style={{ color: '#64748B', margin: 0, fontSize: '11px', marginTop: '2px' }}>Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <button onClick={() => { 
                        if (confirm(`Release parking space ${assignment.spaceNumber}?`)) { 
                          globalState.updateParkingSpace(assignment.id, { status: 'available', assignedTo: undefined, assignedToName: undefined, vehiclePlate: undefined, assignedDate: undefined });
                          alert(`Parking space ${assignment.spaceNumber} released successfully`); 
                        } 
                      }} style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        color: '#EF4444',
                        fontSize: '12px',
                        padding: '6px 12px',
                        cursor: 'pointer'
                      }}>Release</button>
                    </div>
                  ))
                  )}
                </div>
              </div>
            </div>
          );})()}

          {/* Locker Management Section */}
          {activeSection === 'lockers' && (() => {
            // Filter permanent lockers for this tenant (either assigned to this tenant or global lockers without tenantId)
            const tenantLockers = globalState.lockers.filter(l => l.type === 'permanent' && (!l.tenantId || l.tenantId === selectedTenantId));
            const occupiedLockers = tenantLockers.filter(l => l.status === 'occupied');
            const availableLockers = tenantLockers.filter(l => l.status === 'available');

            return (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Lockers</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F1F5F9' }}>{tenantLockers.length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Occupied</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>{occupiedLockers.length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Available</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>{availableLockers.length}</div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Permanent Lockers</h3>
                  <button onClick={() => setShowLockerModal(true)} style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>Assign Locker</button>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                    {tenantLockers.map((locker) => {
                      const isOccupied = locker.status === 'occupied';
                      return (
                        <div key={locker.id} 
                          onClick={() => {
                            if (!isOccupied) {
                              setSelectedLocker(locker.lockerNumber);
                              setShowLockerModal(true);
                            }
                          }}
                          style={{
                          padding: '20px',
                          backgroundColor: isOccupied ? '#1E293B' : '#0F1629',
                          border: `2px solid ${isOccupied ? '#EF4444' : '#10B981'}`,
                          borderRadius: '8px',
                          textAlign: 'center',
                          cursor: isOccupied ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          opacity: isOccupied ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isOccupied) e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isOccupied) e.currentTarget.style.transform = 'scale(1)';
                        }}>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: isOccupied ? '#EF4444' : '#10B981', marginBottom: '4px' }}>{locker.lockerNumber}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>{isOccupied ? 'Occupied' : 'Available'}</div>
                          {isOccupied && locker.assignedToName && (
                            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>{locker.assignedToName}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden',
                marginTop: '24px'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Current Locker Assignments</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  {occupiedLockers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>No locker assignments yet</div>
                      <div style={{ fontSize: '14px', marginTop: '8px' }}>Assign lockers to users from the available lockers above</div>
                    </div>
                  ) : (
                    occupiedLockers.map((assignment) => (
                    <div key={assignment.id} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#0F1629',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#8B5CF6'
                        }}>{assignment.lockerNumber}</div>
                        <div>
                          <h4 style={{ color: '#F1F5F9', margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>{assignment.assignedToName || 'Unknown User'}</h4>
                          <p style={{ color: '#94A3B8', margin: '0 0 2px 0', fontSize: '13px' }}>{assignment.building} - Floor {assignment.floor}</p>
                          {assignment.zone && (
                            <p style={{ color: '#64748B', margin: 0, fontSize: '12px' }}>{assignment.zone}</p>
                          )}
                          {assignment.assignedDate && (
                            <p style={{ color: '#64748B', margin: 0, fontSize: '11px', marginTop: '2px' }}>Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <button onClick={() => { 
                        if (confirm(`Release locker ${assignment.lockerNumber}?`)) { 
                          globalState.updateLocker(assignment.id, { status: 'available', assignedTo: undefined, assignedToName: undefined, assignedDate: undefined });
                          alert(`Locker ${assignment.lockerNumber} released successfully`); 
                        } 
                      }} style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        color: '#EF4444',
                        fontSize: '12px',
                        padding: '6px 12px',
                        cursor: 'pointer'
                      }}>Release</button>
                    </div>
                  ))
                  )}
                </div>
              </div>
            </div>
          );})()}

          {/* Space Management Section */}
          {activeSection === 'spaces' && (() => {
            // Filter spaces for this tenant
            const tenantSpaces = globalState.spaces.filter(s => !s.tenantId || s.tenantId === selectedTenantId);
            const occupiedSpaces = tenantSpaces.filter(s => s.status === 'occupied');
            const availableSpaces = tenantSpaces.filter(s => s.status === 'available');

            return (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Spaces</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F1F5F9' }}>{tenantSpaces.length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Assigned</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>{occupiedSpaces.length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Available</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>{availableSpaces.length}</div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Bookable Spaces</h3>
                  <button onClick={() => setShowSpaceModal(true)} style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>Assign Space</button>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                    {tenantSpaces.map((space) => {
                      const isOccupied = space.status === 'occupied';
                      const typeColors: Record<string, string> = {
                        'desk': '#3B82F6',
                        'office': '#8B5CF6',
                        'meeting-room': '#10B981',
                        'conference-room': '#F59E0B',
                        'social-hub': '#EC4899'
                      };
                      const typeColor = typeColors[space.type] || '#64748B';
                      return (
                        <div key={space.id} 
                          onClick={() => {
                            if (!isOccupied) {
                              setSelectedSpace(space.spaceNumber);
                              setShowSpaceModal(true);
                            }
                          }}
                          style={{
                          padding: '20px',
                          backgroundColor: isOccupied ? '#1E293B' : '#0F1629',
                          border: `2px solid ${isOccupied ? '#EF4444' : typeColor}`,
                          borderRadius: '8px',
                          textAlign: 'center',
                          cursor: isOccupied ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          opacity: isOccupied ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isOccupied) e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isOccupied) e.currentTarget.style.transform = 'scale(1)';
                        }}>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: isOccupied ? '#EF4444' : typeColor, marginBottom: '4px' }}>{space.spaceNumber}</div>
                          <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                            {space.type === 'meeting-room' ? 'Meeting' : space.type === 'conference-room' ? 'Conference' : space.type === 'social-hub' ? 'Social' : space.type}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>{isOccupied ? 'Occupied' : 'Available'}</div>
                          {isOccupied && space.assignedToName && (
                            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>{space.assignedToName}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden',
                marginTop: '24px'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Current Space Assignments</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  {occupiedSpaces.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>No space assignments yet</div>
                      <div style={{ fontSize: '14px', marginTop: '8px' }}>Assign spaces to users from the available spaces above</div>
                    </div>
                  ) : (
                    occupiedSpaces.map((assignment) => {
                      const typeColors: Record<string, string> = {
                        'desk': '#3B82F6',
                        'office': '#8B5CF6',
                        'meeting-room': '#10B981',
                        'conference-room': '#F59E0B',
                        'social-hub': '#EC4899'
                      };
                      const typeColor = typeColors[assignment.type] || '#64748B';
                      return (
                    <div key={assignment.id} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#0F1629',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: typeColor
                        }}>{assignment.spaceNumber}</div>
                        <div>
                          <h4 style={{ color: '#F1F5F9', margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>{assignment.assignedToName || 'Unknown User'}</h4>
                          <p style={{ color: '#94A3B8', margin: '0 0 2px 0', fontSize: '13px' }}>
                            {assignment.type === 'meeting-room' ? 'Meeting Room' : assignment.type === 'conference-room' ? 'Conference Room' : assignment.type === 'social-hub' ? 'Social Hub' : assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)} • {assignment.building} - Floor {assignment.floor}
                          </p>
                          {assignment.zone && (
                            <p style={{ color: '#64748B', margin: 0, fontSize: '12px' }}>{assignment.zone}</p>
                          )}
                          {assignment.assignedDate && (
                            <p style={{ color: '#64748B', margin: 0, fontSize: '11px', marginTop: '2px' }}>Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <button onClick={() => { 
                        if (confirm(`Release space ${assignment.spaceNumber}?`)) { 
                          globalState.updateSpace(assignment.id, { status: 'available', assignedTo: undefined, assignedToName: undefined, assignedDate: undefined });
                          alert(`Space ${assignment.spaceNumber} released successfully`); 
                        } 
                      }} style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        color: '#EF4444',
                        fontSize: '12px',
                        padding: '6px 12px',
                        cursor: 'pointer'
                      }}>Release</button>
                    </div>
                    );
                  })
                  )}
                </div>
              </div>
            </div>
          );})()}

          {/* Building Configuration Section (Read-only) */}
          {activeSection === 'buildings' && (() => {
            // Filter buildings for this tenant
            const tenantBuildings = globalState.buildings.filter(b => b.tenantId === selectedTenantId);

            return (
            <div>
              <div style={{ marginBottom: '24px', padding: '16px 20px', backgroundColor: '#162032', borderRadius: '8px', border: '1px solid #1E293B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <InfoRegular style={{ fontSize: '20px', color: '#3B82F6' }} />
                  <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Building configuration is managed by your administrator. This is a read-only view.</p>
                </div>
              </div>

              {/* Stats Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Buildings</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F1F5F9' }}>{tenantBuildings.length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Floors</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>
                    {tenantBuildings.reduce((sum, b) => sum + b.floors.length, 0)}
                  </div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Zones</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3B82F6' }}>
                    {tenantBuildings.reduce((sum, b) => sum + b.floors.reduce((zoneSum, f) => zoneSum + f.zones.length, 0), 0)}
                  </div>
                </div>
              </div>

              {/* Buildings List */}
              {tenantBuildings.map((building) => (
                <div key={building.id} style={{
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B',
                  overflow: 'hidden',
                  marginBottom: '24px'
                }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                    <div>
                      <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>{building.name}</h3>
                      <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                        {building.floors.length} floors • {building.basementLevels} basement{building.basementLevels !== 1 ? 's' : ''} • Top floor: {building.topFloor}
                      </p>
                    </div>
                  </div>

                  {/* Floor Visualization */}
                  <div style={{ padding: '24px' }}>
                    <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Floor Configuration</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                      {building.floors.map((floor) => (
                        <div key={floor.floorNumber} style={{
                          backgroundColor: '#0F1629',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid #1E293B'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <div style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600' }}>
                                {floor.floorLabel === 'Ground' ? 'Ground Floor' : `Floor ${floor.floorLabel}`}
                              </div>
                              <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>
                                {floor.zones.length} zone{floor.zones.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: floor.floorNumber < 0 ? 'rgba(139, 92, 246, 0.1)' : floor.floorNumber === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              color: floor.floorNumber < 0 ? '#8B5CF6' : floor.floorNumber === 0 ? '#10B981' : '#3B82F6'
                            }}>
                              {floor.floorNumber < 0 ? 'Basement' : floor.floorNumber === 0 ? 'Ground' : 'Above'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {floor.zones.map((zone, zoneIdx) => (
                              <span key={zoneIdx} style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                                color: '#94A3B8',
                                border: '1px solid #334155'
                              }}>
                                {zone}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {tenantBuildings.length === 0 && (
                <div style={{
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B',
                  padding: '48px 24px',
                  textAlign: 'center'
                }}>
                  <BuildingRegular style={{ fontSize: '48px', color: '#475569', marginBottom: '16px' }} />
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No Buildings Configured</h3>
                  <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>Your administrator has not configured any buildings yet. Contact your administrator for more information.</p>
                </div>
              )}
            </div>
          );})()}

          {/* Digital Badges Section */}
          {activeSection === 'digitalBadges' && (
            <div>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px' }}>{globalState.badges.length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Total Badges Issued</div>
                </div>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#3B82F6', marginBottom: '8px' }}>{globalState.badges.filter(u => u.status === 'Sent').length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Badges Sent</div>
                </div>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>{globalState.badges.filter(u => u.status === 'Downloaded').length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Badges Activated</div>
                </div>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#EF4444', marginBottom: '8px' }}>{globalState.badges.filter(u => u.status === 'Suspended').length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Badges Suspended</div>
                </div>
              </div>

              {/* Badge Management Table */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Digital Badge Users</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Manage and distribute digital wallet badges for {tenantName}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleAddBadgeUser} style={{
                      backgroundColor: '#60A5FA',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.6), 0 0 35px rgba(96, 165, 250, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                      <AddRegular style={{ fontSize: '16px' }} />
                      Add Badge User
                    </button>
                    <button onClick={() => setShowBadgeImportModal(true)} style={{
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(16, 185, 129, 0.4), 0 0 25px rgba(16, 185, 129, 0.2)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6), 0 0 35px rgba(16, 185, 129, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4), 0 0 25px rgba(16, 185, 129, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                      <ArrowUploadRegular style={{ fontSize: '16px' }} />
                      Import Users
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #1E293B', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="search"
                    placeholder="Search by name or email"
                    value={badgeSearchTerm}
                    onChange={(e) => setBadgeSearchTerm(e.target.value)}
                    style={{
                      flex: '1 1 200px',
                      padding: '10px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }}
                  />
                  <select 
                    value={badgeStatusFilter}
                    onChange={(e) => setBadgeStatusFilter(e.target.value)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                    <option>All Statuses</option>
                    <option>New</option>
                    <option>Sent</option>
                    <option>Downloaded</option>
                    <option>Suspended</option>
                  </select>
                  <select 
                    value={badgeCardTypeFilter}
                    onChange={(e) => setBadgeCardTypeFilter(e.target.value)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                    <option>All Card Types</option>
                    <option>Mifare EV3</option>
                    <option>LEGIC</option>
                    <option>HID</option>
                    <option>NFC</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                          <input type="checkbox" style={{ accentColor: '#3B82F6' }} />
                        </th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Name</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Email</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Department</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Card Type</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '12px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBadgeUsers.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px 24px' }}>
                            <input type="checkbox" style={{ accentColor: '#3B82F6' }} />
                          </td>
                          <td style={{ padding: '16px 24px', color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{user.name}</td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>{user.email}</td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>{user.department}</td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: '#1E293B',
                              color: '#94A3B8',
                              border: '1px solid #334155'
                            }}>
                              {user.cardType}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                user.status === 'Downloaded' ? 'rgba(16, 185, 129, 0.1)' :
                                user.status === 'Sent' ? 'rgba(59, 130, 246, 0.1)' :
                                user.status === 'Suspended' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                              color: 
                                user.status === 'Downloaded' ? '#10B981' :
                                user.status === 'Sent' ? '#3B82F6' :
                                user.status === 'Suspended' ? '#EF4444' : '#64748B'
                            }}>
                              {user.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                              {user.status === 'New' && (
                                <>
                                  <button 
                                    onClick={() => handleSendBadgeEmail(user.id)}
                                    title="Send Email"
                                    style={{
                                      backgroundColor: '#60A5FA',
                                      border: 'none',
                                      borderRadius: '6px',
                                      color: '#FFFFFF',
                                      fontSize: '12px',
                                      padding: '8px',
                                      cursor: 'pointer',
                                      boxShadow: '0 0 10px rgba(96, 165, 250, 0.3)',
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.5)';
                                      e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 10px rgba(96, 165, 250, 0.3)';
                                      e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                    <MailRegular style={{ fontSize: '16px' }} />
                                  </button>
                                  <button 
                                    onClick={() => handleSendBadgePush(user.id)}
                                    title="Send Push Notification"
                                    style={{
                                      backgroundColor: '#10B981',
                                      border: 'none',
                                      borderRadius: '6px',
                                      color: '#FFFFFF',
                                      fontSize: '12px',
                                      padding: '8px',
                                      cursor: 'pointer',
                                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
                                      e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)';
                                      e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                    <AlertOnRegular style={{ fontSize: '16px' }} />
                                  </button>
                                </>
                              )}
                              {user.status === 'Downloaded' && (
                                <button 
                                  onClick={() => handleSuspendBadge(user.id)}
                                  title="Suspend Badge"
                                  style={{
                                    backgroundColor: '#F59E0B',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#FFFFFF',
                                    fontSize: '12px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }}>
                                  Suspend
                                </button>
                              )}
                              {user.status === 'Suspended' && (
                                <button 
                                  onClick={() => handleRecoverBadge(user.id)}
                                  title="Recover Badge"
                                  style={{
                                    backgroundColor: '#10B981',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#FFFFFF',
                                    fontSize: '12px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }}>
                                  Recover
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteBadgeUser(user.id)}
                                title="Delete Badge"
                                style={{
                                  backgroundColor: '#EF4444',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: 'white',
                                  fontSize: '12px',
                                  padding: '8px',
                                  cursor: 'pointer',
                                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <DeleteRegular style={{ fontSize: '16px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Showing 1-{Math.min(filteredBadgeUsers.length, 5)} of {filteredBadgeUsers.length} users</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>Previous</button>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#3B82F6',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>1</button>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>2</button>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Template Management Section */}
          {activeSection === 'templates' && (
            <div>
              {/* Email Templates */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Email Templates</h2>
                  <button style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>+ New Template</button>
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { name: 'Visitor Invitation', subject: 'You\'re invited to visit {{company_name}}', lastModified: '2025-10-20', status: 'Active' },
                    { name: 'Welcome Email', subject: 'Welcome to {{company_name}}', lastModified: '2025-10-18', status: 'Active' },
                    { name: 'Parking Confirmation', subject: 'Parking Space Reserved - {{space_number}}', lastModified: '2025-10-15', status: 'Active' },
                    { name: 'Visit Reminder', subject: 'Reminder: Your visit to {{company_name}} tomorrow', lastModified: '2025-10-12', status: 'Draft' },
                  ].map((template, idx) => (
                    <div key={idx} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      border: '1px solid #475569',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#F1F5F9', margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{template.name}</h4>
                        <p style={{ color: '#94A3B8', margin: '0 0 4px 0', fontSize: '13px' }}>{template.subject}</p>
                        <p style={{ color: '#64748B', margin: 0, fontSize: '12px' }}>Last modified: {template.lastModified}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: template.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: template.status === 'Active' ? '#10B981' : '#F59E0B'
                        }}>
                          {template.status}
                        </span>
                        <button onClick={() => { setEditingTemplate(template); setShowTemplateEditor(true); }} style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#3B82F6',
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          marginRight: '4px'
                        }}>Edit</button>
                        <button style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#64748B',
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}>Preview</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application/Form Templates */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Application Templates</h2>
                  <button style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>+ New Template</button>
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { name: 'Visitor Registration Form', fields: 8, submissions: 145, lastModified: '2025-10-19' },
                    { name: 'Parking Request Form', fields: 6, submissions: 89, lastModified: '2025-10-17' },
                    { name: 'Access Request Form', fields: 10, submissions: 234, lastModified: '2025-10-14' },
                    { name: 'Meeting Room Booking', fields: 7, submissions: 156, lastModified: '2025-10-10' },
                  ].map((template, idx) => (
                    <div key={idx} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      border: '1px solid #475569',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#F1F5F9', margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{template.name}</h4>
                        <p style={{ color: '#94A3B8', margin: '0 0 4px 0', fontSize: '13px' }}>{template.fields} fields • {template.submissions} submissions</p>
                        <p style={{ color: '#64748B', margin: 0, fontSize: '12px' }}>Last modified: {template.lastModified}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#3B82F6',
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}>Edit</button>
                        <button style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#64748B',
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}>Preview</button>
                        <button style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#10B981',
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}>Export</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Policies Section */}
          {activeSection === 'policies' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                  Download company policy documents. These policies are managed by your system administrator.
                </p>
              </div>

              {Object.entries(globalState.policyFiles).filter(([_, file]) => file !== null).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 24px', color: '#64748B' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
                  <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No Policies Available</div>
                  <div style={{ fontSize: '14px' }}>Policy documents will appear here once uploaded by your administrator</div>
                </div>
              ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {Object.entries(globalState.policyFiles).filter(([_, file]) => file !== null).map(([policyName, policyFile]) => {
                  if (!policyFile) return null;
                  return (
                  <div key={policyName} style={{
                    padding: '24px',
                    backgroundColor: '#162032',
                    borderRadius: '12px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        backgroundColor: '#3B82F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        flexShrink: 0
                      }}>
                        📄
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                          {policyName}
                        </h3>
                        <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                          {policyFile.name || 'Policy document'}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                          <span style={{ color: '#64748B' }}>
                            <span style={{ color: '#94A3B8', fontWeight: '500' }}>Uploaded:</span> {policyFile.uploadDate}
                          </span>
                          <span style={{ color: '#64748B' }}>
                            <span style={{ color: '#94A3B8', fontWeight: '500' }}>Type:</span> {policyFile.fileType || 'PDF'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (policyFile.fileData) {
                          // Create download link from base64 data
                          const link = document.createElement('a');
                          link.href = policyFile.fileData;
                          link.download = `${policyName.replace(/\s+/g, '_')}.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          alert(`Downloading ${policyName} policy...`);
                        } else {
                          alert('Policy file data not available');
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
                    >
                      <span>⬇️</span>
                      <span>Download PDF</span>
                    </button>
                  </div>
                  );
                })}
              </div>
              )}
            </div>
          )}

          {/* Profile Management Section */}
          {activeSection === 'modules' && (
            <div>
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <h3 style={{ color: '#3b82f6', fontSize: '16px', marginBottom: '8px', fontWeight: '600' }}>
                  ℹ️ Access Profiles
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
                  Global profiles are inherited from admin. You can also create tenant-specific profiles for your organization.
                </p>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Access Profiles</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Global profiles from admin and tenant-specific profiles</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingProfile({ name: '', description: '', modules: [] });
                      setShowProfileModal(true);
                    }}
                    style={{
                      backgroundColor: '#60A5FA',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.6), 0 0 35px rgba(96, 165, 250, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                    + Create Tenant Profile
                  </button>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {profiles.map((profile) => (
                      <div key={profile.id} style={{
                        padding: '20px',
                        backgroundColor: '#1E293B',
                        borderRadius: '12px',
                        border: '1px solid #475569',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3B82F6';
                        e.currentTarget.style.backgroundColor = '#0F1629';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#475569';
                        e.currentTarget.style.backgroundColor = '#1E293B';
                      }}>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h5 style={{ color: '#F1F5F9', margin: 0, fontSize: '16px', fontWeight: '600' }}>{profile.name}</h5>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: '600',
                                backgroundColor: profile.isGlobal ? 'rgba(100, 116, 139, 0.2)' : 'rgba(96, 165, 250, 0.2)',
                                color: profile.isGlobal ? '#64748B' : '#60A5FA'
                              }}>{profile.isGlobal ? 'Global' : 'Tenant'}</span>
                            </div>
                            {!profile.isGlobal && (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button 
                                  onClick={() => {
                                    setEditingProfile({ id: profile.id, name: profile.name, description: profile.description, modules: profile.modules });
                                    setShowProfileModal(true);
                                  }}
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid #475569',
                                    borderRadius: '4px',
                                    color: '#3B82F6',
                                    fontSize: '11px',
                                    padding: '4px 8px',
                                    cursor: 'pointer'
                                  }}>Edit</button>
                                <button 
                                  onClick={() => {
                                    if (confirm(`Delete profile "${profile.name}"? This action cannot be undone.`)) {
                                      setTenantProfiles(prev => prev.filter(p => p.id !== profile.id));
                                      alert('Profile deleted successfully');
                                    }
                                  }}
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid #475569',
                                    borderRadius: '4px',
                                    color: '#EF4444',
                                    fontSize: '11px',
                                    padding: '4px 8px',
                                    cursor: 'pointer'
                                  }}>Delete</button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p style={{ color: '#94A3B8', fontSize: '13px', margin: '0 0 12px 0' }}>{profile.description}</p>
                        
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Assigned Modules ({profile.modules.length})</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
                            {profile.modules.map((module) => (
                              <span key={module} style={{
                                padding: '4px 10px',
                                backgroundColor: '#0F1629',
                                borderRadius: '12px',
                                fontSize: '11px',
                                color: '#10B981',
                                border: '1px solid rgba(16, 185, 129, 0.3)'
                              }}>
                                {module}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support Section */}
          {activeSection === 'support' && (
            <div>
              {/* Contact Information */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>NEOX Support</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(96, 165, 250, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MailRegular style={{ fontSize: '24px', color: '#60A5FA' }} />
                    </div>
                    <div>
                      <div style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Email Support</div>
                      <a href="mailto:support@neox.team" style={{ color: '#60A5FA', fontSize: '14px', textDecoration: 'none' }}>support@neox.team</a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <PhoneRegular style={{ fontSize: '24px', color: '#10B981' }} />
                    </div>
                    <div>
                      <div style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Phone Support</div>
                      <a href="tel:+3618888888" style={{ color: '#60A5FA', fontSize: '14px', textDecoration: 'none' }}>+36 1 888 888</a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ClockRegular style={{ fontSize: '24px', color: '#F59E0B' }} />
                    </div>
                    <div>
                      <div style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Availability</div>
                      <div style={{ color: '#F1F5F9', fontSize: '14px' }}>Mon-Fri, 9:00-18:00 CET</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create New Ticket Button */}
              <button onClick={() => setShowTicketModal(true)} style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '24px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}>
                + Create New Support Ticket
              </button>

              {/* Tickets List */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>My Support Tickets</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  {globalState.tickets.filter(t => t.tenantId === selectedTenantId).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>No support tickets yet</div>
                      <div style={{ fontSize: '14px', marginTop: '8px' }}>Create a ticket above if you need help</div>
                    </div>
                  ) : (
                    globalState.tickets.filter(t => t.tenantId === selectedTenantId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((ticket) => (
                      <div key={ticket.id} style={{
                        padding: '16px',
                        backgroundColor: '#1E293B',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        border: '1px solid #475569'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                              <span style={{ color: '#60A5FA', fontSize: '14px', fontWeight: '600' }}>{ticket.ticketNumber}</span>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600',
                                backgroundColor: ticket.priority === 'critical' ? 'rgba(239, 68, 68, 0.2)' : ticket.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : ticket.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                color: ticket.priority === 'critical' ? '#EF4444' : ticket.priority === 'high' ? '#EF4444' : ticket.priority === 'medium' ? '#F59E0B' : '#22C55E'
                              }}>
                                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                              </span>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600',
                                backgroundColor: ticket.status === 'open' ? 'rgba(59, 130, 246, 0.2)' : ticket.status === 'in-progress' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                color: ticket.status === 'open' ? '#3B82F6' : ticket.status === 'in-progress' ? '#F59E0B' : '#22C55E'
                              }}>
                                {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                            </div>
                            <h4 style={{ color: '#F1F5F9', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{ticket.title}</h4>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748B' }}>
                              <span>Category: {ticket.category}</span>
                              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                              <span>By: {ticket.createdByName}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => alert(`Viewing ticket ${ticket.ticketNumber}`)} style={{
                            padding: '6px 12px',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>View</button>
                          {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                            <button onClick={() => alert(`Adding reply to ${ticket.ticketNumber}`)} style={{
                              padding: '6px 12px',
                              backgroundColor: 'transparent',
                              color: '#94A3B8',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}>Reply</button>
                          )}
                          {ticket.status === 'resolved' && (
                            <button onClick={() => {
                              globalState.updateTicket(ticket.id, { status: 'open' });
                              alert(`Ticket ${ticket.ticketNumber} reopened`);
                            }} style={{
                              padding: '6px 12px',
                              backgroundColor: 'transparent',
                              color: '#F59E0B',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}>Reopen</button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div>
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Notifications</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Stay updated with your organization alerts</p>
                  </div>
                  <button onClick={() => setNotificationCount(0)} style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>Mark All Read</button>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { id: 1, type: 'Info', title: 'New parking space assigned', message: 'You have been assigned parking space P-42 for this month', time: '2 hours ago', unread: true },
                      { id: 2, type: 'Success', title: 'Invitation accepted', message: 'John Doe has accepted your invitation and joined your organization', time: '5 hours ago', unread: true },
                      { id: 3, type: 'Warning', title: 'Policy update required', message: 'Please review and accept the updated company policies', time: '1 day ago', unread: true },
                      { id: 4, type: 'Info', title: 'System maintenance scheduled', message: 'Planned maintenance on Oct 25, 2025 from 2:00 AM - 4:00 AM', time: '2 days ago', unread: false },
                      { id: 5, type: 'Success', title: 'Support ticket resolved', message: 'Your support ticket TKT-0995 has been resolved', time: '3 days ago', unread: false },
                    ].map((notification) => (
                      <div key={notification.id} style={{
                        padding: '16px',
                        backgroundColor: notification.unread ? 'rgba(59, 130, 246, 0.05)' : '#1E293B',
                        borderRadius: '8px',
                        border: `1px solid ${notification.unread ? 'rgba(59, 130, 246, 0.2)' : '#1E293B'}`,
                        display: 'flex',
                        gap: '16px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: 
                            notification.type === 'Warning' ? 'rgba(245, 158, 11, 0.2)' :
                            notification.type === 'Success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          flexShrink: 0,
                          boxShadow: 
                            notification.type === 'Warning' ? '0 0 20px rgba(245, 158, 11, 0.5)' :
                            notification.type === 'Success' ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 0 20px rgba(59, 130, 246, 0.5)',
                          color: 
                            notification.type === 'Warning' ? '#F59E0B' :
                            notification.type === 'Success' ? '#10B981' : '#3B82F6'
                        }}>
                          {notification.type === 'Warning' ? <WarningRegular /> : 
                           notification.type === 'Success' ? <CheckmarkCircleRegular /> : <InfoRegular />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                              {notification.title}
                              {notification.unread && (
                                <span style={{
                                  marginLeft: '8px',
                                  width: '8px',
                                  height: '8px',
                                  backgroundColor: '#3B82F6',
                                  borderRadius: '50%',
                                  display: 'inline-block'
                                }}></span>
                              )}
                            </h3>
                            <span style={{ color: '#64748B', fontSize: '12px', whiteSpace: 'nowrap' }}>{notification.time}</span>
                          </div>
                          <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 12px 0' }}>{notification.message}</p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #334155',
                              borderRadius: '6px',
                              color: '#94A3B8',
                              fontSize: '12px',
                              padding: '4px 12px',
                              cursor: 'pointer'
                            }}>View Details</button>
                            {notification.unread && (
                              <button onClick={() => setNotificationCount(prev => Math.max(0, prev - 1))} style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #334155',
                                borderRadius: '6px',
                                color: '#3B82F6',
                                fontSize: '12px',
                                padding: '4px 12px',
                                cursor: 'pointer'
                              }}>Mark as Read</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Add/Edit Modal */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowUserModal(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '700px',
            width: '90%',
            border: '1px solid #1E293B',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              const name = formData.get('name') as string;
              const email = formData.get('email') as string;
              const role = formData.get('role') as string;
              const department = formData.get('department') as string;
              const profileId = selectedProfileId;
              
              // Prevent creation of Admin users from tenant site
              if (!editingUser && role === 'Admin') {
                alert('Cannot create Admin users from tenant site. Admin users must be created from the admin dashboard.');
                return;
              }
              
              // Prevent changing existing user to Admin from tenant site
              if (editingUser && editingUser.role !== 'Admin' && role === 'Admin') {
                alert('Cannot assign Admin role from tenant site.');
                return;
              }
              
              if (editingUser && editingUser.id) {
                // Update existing user
                globalState.updateUser(editingUser.id, {
                  name,
                  email,
                  role,
                  department,
                  profileId
                });
                alert('User updated successfully!');
              } else {
                // Add new user
                globalState.addUser({
                  name,
                  email,
                  role,
                  department,
                  status: 'active',
                  profileId,
                  tenantId: selectedTenantId
                });
                alert('User added successfully!');
              }
              setShowUserModal(false);
              setEditingUser(null);
              setSelectedProfileId('');
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Full Name *</label>
                <input type="text" name="name" defaultValue={editingUser?.name} required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email *</label>
                <input type="email" name="email" defaultValue={editingUser?.email} required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Role *</label>
                <select name="role" defaultValue={editingUser?.role || 'User'} required disabled={editingUser?.role === 'Admin'} style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: editingUser?.role === 'Admin' ? '#0F1629' : '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: editingUser?.role === 'Admin' ? '#64748B' : '#F1F5F9',
                  fontSize: '14px',
                  cursor: editingUser?.role === 'Admin' ? 'not-allowed' : 'pointer'
                }}>
                  <option value="Admin" disabled={!editingUser || editingUser.role !== 'Admin'}>Admin (System Only)</option>
                  <option value="Manager">Manager</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="User">User</option>
                </select>
                {editingUser?.role === 'Admin' && (
                  <div style={{ marginTop: '8px', color: '#F59E0B', fontSize: '12px' }}>
                    ⚠️ Admin users can only be managed from the system admin dashboard.
                  </div>
                )}
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Department</label>
                <input type="text" name="department" defaultValue={editingUser?.department} style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Access Profile *</label>
                <select 
                  name="profileId"
                  value={selectedProfileId}
                  onChange={(e) => {
                    setSelectedProfileId(e.target.value);
                  }}
                  disabled={editingUser?.role === 'Admin'}
                  required 
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: editingUser?.role === 'Admin' ? '#0F1629' : '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: editingUser?.role === 'Admin' ? '#64748B' : '#F1F5F9',
                    fontSize: '14px',
                    cursor: editingUser?.role === 'Admin' ? 'not-allowed' : 'pointer'
                  }}>
                  <option value="" disabled>Select an access profile</option>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>{profile.name} ({profile.modules.length} modules)</option>
                  ))}
                </select>
                {selectedProfileId && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #475569' }}>
                    <div style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Modules from {profiles.find(p => p.id === selectedProfileId)?.name}:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {profiles.find(p => p.id === selectedProfileId)?.modules.map((module) => (
                        <span key={module} style={{
                          padding: '4px 10px',
                          backgroundColor: '#0F1629',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#10B981',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>{editingUser ? 'Update User' : 'Add User'}</button>
                <button type="button" onClick={() => { 
                  setShowUserModal(false); 
                  setEditingUser(null); 
                  setSelectedProfileId(''); 
                }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {showTemplateEditor && editingTemplate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowTemplateEditor(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid #1E293B'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              Edit Template: {editingTemplate.name}
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Template saved successfully!'); setShowTemplateEditor(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Template Name *</label>
                <input type="text" defaultValue={editingTemplate.name} required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              {editingTemplate.subject && (
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Subject Line *</label>
                  <input type="text" defaultValue={editingTemplate.subject} required style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} />
                </div>
              )}
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Template Content</label>
                <textarea defaultValue={editingTemplate.subject || 'Template content here...'} style={
{
                  width: '100%',
                  minHeight: '200px',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Save Template</button>
                <button type="button" onClick={() => setShowTemplateEditor(false)} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parking Assignment Modal */}
      {showParkingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowParkingModal(false); setSelectedParkingSpace(null); }}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid #1E293B'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              Assign Parking Space {selectedParkingSpace ? `#${selectedParkingSpace}` : ''}
            </h2>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              const userId = formData.get('user') as string;
              const userName = (e.currentTarget.elements.namedItem('user') as HTMLSelectElement).selectedOptions[0].text;
              const vehiclePlate = formData.get('vehiclePlate') as string;
              
              const space = globalState.parkingSpaces.find(p => p.spaceNumber === selectedParkingSpace);
              if (space) {
                globalState.updateParkingSpace(space.id, {
                  status: 'occupied',
                  assignedTo: userId,
                  assignedToName: userName,
                  vehiclePlate: vehiclePlate,
                  assignedDate: new Date().toISOString()
                });
                alert(`Parking space ${selectedParkingSpace} (${space.location}) assigned successfully to ${userName}!`);
              }
              setShowParkingModal(false);
              setSelectedParkingSpace(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Select User *</label>
                <select name="user" required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  <option value="">Choose a user...</option>
                  {globalState.users.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>License Plate *</label>
                <input name="vehiclePlate" type="text" placeholder="e.g., ABC-1234" required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Assign Space</button>
                <button type="button" onClick={() => { setShowParkingModal(false); setSelectedParkingSpace(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Locker Assignment Modal */}
      {showLockerModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowLockerModal(false); setSelectedLocker(null); }}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid #1E293B'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              Assign Locker {selectedLocker ? `#${selectedLocker}` : ''}
            </h2>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              const userId = formData.get('user') as string;
              const userName = (e.currentTarget.elements.namedItem('user') as HTMLSelectElement).selectedOptions[0].text;
              
              const locker = globalState.lockers.find(l => l.lockerNumber === selectedLocker);
              if (locker) {
                globalState.updateLocker(locker.id, {
                  status: 'occupied',
                  assignedTo: userId,
                  assignedToName: userName,
                  assignedDate: new Date().toISOString()
                });
                alert(`Locker ${selectedLocker} (${locker.building} - Floor ${locker.floor}) assigned successfully to ${userName}!`);
              }
              setShowLockerModal(false);
              setSelectedLocker(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Select User *</label>
                <select name="user" required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  <option value="">Choose a user...</option>
                  {globalState.users.filter(u => u.tenantId === selectedTenantId).map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Assign Locker</button>
                <button type="button" onClick={() => { setShowLockerModal(false); setSelectedLocker(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Space Assignment Modal */}
      {showSpaceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowSpaceModal(false); setSelectedSpace(null); }}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid #1E293B'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              Assign Space {selectedSpace ? `#${selectedSpace}` : ''}
            </h2>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              const userId = formData.get('user') as string;
              const userName = (e.currentTarget.elements.namedItem('user') as HTMLSelectElement).selectedOptions[0].text;
              
              const space = globalState.spaces.find(s => s.spaceNumber === selectedSpace);
              if (space) {
                globalState.updateSpace(space.id, {
                  status: 'occupied',
                  assignedTo: userId,
                  assignedToName: userName,
                  assignedDate: new Date().toISOString()
                });
                alert(`Space ${selectedSpace} (${space.building} - Floor ${space.floor}) assigned successfully to ${userName}!`);
              }
              setShowSpaceModal(false);
              setSelectedSpace(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Select User *</label>
                <select name="user" required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  <option value="">Choose a user...</option>
                  {globalState.users.filter(u => u.tenantId === selectedTenantId).map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Assign Space</button>
                <button type="button" onClick={() => { setShowSpaceModal(false); setSelectedSpace(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowTicketModal(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            border: '1px solid #1E293B',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              Create Support Ticket
            </h2>
            <form onSubmit={(e) => { 
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get('title') as string;
              const category = formData.get('category') as string;
              const priority = formData.get('priority') as string;
              const description = formData.get('description') as string;
              
              globalState.addTicket({
                title,
                description,
                category,
                priority: priority as 'low' | 'medium' | 'high' | 'critical',
                status: 'open',
                createdBy: username,
                createdByName: username,
                tenantId: selectedTenantId
              });
              
              alert('Support ticket created successfully!');
              setShowTicketModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Subject *</label>
                <input type="text" name="title" placeholder="Brief description of the issue" required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Category *</label>
                <select name="category" required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  <option value="">Select category...</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Licensing</option>
                  <option value="feature">Feature Request</option>
                  <option value="account">Account Management</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Priority *</label>
                <select name="priority" required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  <option value="">Select severity...</option>
                  <option value="low">Low - Minor issue, no immediate impact</option>
                  <option value="medium">Medium - Moderate impact on operations</option>
                  <option value="high">High - Significant impact, needs urgent attention</option>
                  <option value="critical">Critical - System down or data loss</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Description *</label>
                <textarea name="description" placeholder="Please provide detailed information about your issue..." required style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  resize: 'vertical'
                }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Create Ticket</button>
                <button type="button" onClick={() => setShowTicketModal(false)} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Badge Add/Edit Modal */}
      {showBadgeModal && editingBadge && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowBadgeModal(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid #1E293B'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              {editingBadge.id ? 'Edit Digital Badge' : 'Create Digital Badge'}
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveBadgeUser(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!editingBadge.id && (
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Select User *</label>
                  <select 
                    value={editingBadge.email}
                    onChange={(e) => {
                      const user = globalState.users.find(u => u.email === e.target.value);
                      if (user) {
                        const tenant = globalState.tenants.find(t => t.id === user.tenantId);
                        setEditingBadge({ 
                          ...editingBadge, 
                          name: user.name, 
                          email: user.email, 
                          company: tenant?.name || user.department 
                        });
                      }
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                    <option value="">Choose a user...</option>
                    {globalState.users.filter(u => u.tenantId === selectedTenantId).map(user => (
                      <option key={user.id} value={user.email}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                </div>
              )}
              {editingBadge.email && (
                <>
                  <div style={{ padding: '12px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #475569' }}>
                    <div style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Selected User:</div>
                    <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{editingBadge.name}</div>
                    <div style={{ color: '#94A3B8', fontSize: '13px' }}>{editingBadge.email}</div>
                    <div style={{ color: '#94A3B8', fontSize: '13px' }}>{editingBadge.company}</div>
                  </div>
                </>
              )}
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Card Type *</label>
                <select 
                  value={editingBadge.cardType}
                  onChange={(e) => setEditingBadge({ ...editingBadge, cardType: e.target.value })}
                  required 
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                  <option value="Mifare EV3">Mifare EV3</option>
                  <option value="LEGIC">LEGIC</option>
                  <option value="HID">HID</option>
                  <option value="NFC">NFC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>IMEI Number *</label>
                <input 
                  type="text" 
                  value={editingBadge.imei}
                  onChange={(e) => setEditingBadge({ ...editingBadge, imei: e.target.value })}
                  placeholder="123456789012345"
                  required 
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>{editingBadge.id ? 'Update Badge User' : 'Add Badge User'}</button>
                <button type="button" onClick={() => { setShowBadgeModal(false); setEditingBadge(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Badge Import Modal */}
      {showBadgeImportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowBadgeImportModal(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            border: '1px solid #1E293B'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              Import Badge Users
            </h2>
            
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>ℹ️</span> CSV Format Requirements
              </h3>
              <p style={{ color: '#F1F5F9', fontSize: '14px', margin: '0 0 12px 0' }}>
                Your CSV file should include the following columns (in order):
              </p>
              <div style={{ fontFamily: 'monospace', backgroundColor: '#1E293B', padding: '12px', borderRadius: '6px', color: '#F1F5F9', fontSize: '12px' }}>
                name,email,department,cardType,imei
              </div>
              <div style={{ marginTop: '12px' }}>
                <button style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.6)',
                  color: '#fff',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }} onClick={() => {
                  const csvContent = "name,email,department,cardType,imei\nJohn Doe,john@company.com,IT,Mifare EV3,123456789012345\nJane Smith,jane@company.com,HR,NFC,234567890123456"
                  const blob = new Blob([csvContent], { type: 'text/csv' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'badge_users_template.csv'
                  a.click()
                  window.URL.revokeObjectURL(url)
                }}>
                  <ArrowDownloadRegular style={{ fontSize: '14px' }} />
                  Download Sample CSV
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>Upload CSV File</label>
              <div style={{ 
                border: '2px dashed #475569', 
                borderRadius: '12px', 
                padding: '32px', 
                textAlign: 'center',
                backgroundColor: '#1E293B'
              }}>
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={handleBadgeImport}
                  style={{ display: 'none' }}
                  id="tenant-badge-csv-upload"
                />
                <label htmlFor="tenant-badge-csv-upload" style={{
                  backgroundColor: '#3B82F6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>
                  <ArrowUploadRegular style={{ fontSize: '16px' }} />
                  Choose CSV File
                </label>
                <p style={{ color: '#64748B', marginTop: '12px', fontSize: '14px' }}>
                  Select a CSV file to import multiple badge users at once
                </p>
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              <h3 style={{ color: '#eab308', fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>⚠️</span> Import Process
              </h3>
              <ul style={{ color: '#F1F5F9', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                <li>Users will be validated before creation</li>
                <li>Duplicate emails will be reported</li>
                <li>Invalid entries will be flagged</li>
                <li>All imported users will have &quot;New&quot; status</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowBadgeImportModal(false)} style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: '#F1F5F9',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px'
              }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && editingProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowProfileModal(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '700px',
            width: '90%',
            border: '1px solid #1E293B',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              {editingProfile.id ? 'Edit' : 'Create'} Tenant Profile
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Define which modules this tenant-specific profile can access</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const profileName = formData.get('profileName') as string;
              const description = formData.get('description') as string;
              
              const newProfile = {
                id: editingProfile.id || `tenant_prof_${Date.now()}`,
                name: profileName,
                description: description,
                modules: editingProfile.modules,
                isGlobal: false
              };
              
              if (editingProfile.id) {
                // Update existing
                setTenantProfiles(prev => prev.map(p => p.id === editingProfile.id ? newProfile : p));
                alert('Profile updated successfully');
              } else {
                // Create new
                setTenantProfiles(prev => [...prev, newProfile]);
                alert('Profile created successfully');
              }
              
              setShowProfileModal(false);
              setEditingProfile(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Profile Name *</label>
                <input 
                  type="text" 
                  name="profileName"
                  defaultValue={editingProfile.name}
                  required 
                  placeholder="e.g., Full Access, Limited Access, Custom Profile"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} 
                />
              </div>
              
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Description *</label>
                <textarea 
                  name="description"
                  defaultValue={editingProfile.description}
                  required 
                  placeholder="Describe the purpose and access level of this profile"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    resize: 'vertical'
                  }} 
                />
              </div>
              
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>Assigned Modules *</label>
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#1E293B', 
                  borderRadius: '8px', 
                  border: '1px solid #475569',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      'User Management', 
                      'Visitor Management', 
                      'Parking', 
                      'Emergency', 
                      'Map', 
                      'Restaurant', 
                      'Ticketing', 
                      'Service Hub', 
                      'Lockers', 
                      'News', 
                      'AI Assistant', 
                      'Space Management', 
                      'Private Delivery',
                      'Authentication',
                      'Reporting'
                    ].map((module) => {
                      const isEnabled = editingProfile.modules.includes(module);
                      return (
                        <label key={module} style={{
                          padding: '10px',
                          backgroundColor: '#0F1629',
                          borderRadius: '6px',
                          border: `1px solid ${isEnabled ? '#10B981' : '#475569'}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>
                          <input 
                            type="checkbox" 
                            checked={isEnabled}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingProfile({
                                  ...editingProfile,
                                  modules: [...editingProfile.modules, module]
                                });
                              } else {
                                setEditingProfile({
                                  ...editingProfile,
                                  modules: editingProfile.modules.filter(m => m !== module)
                                });
                              }
                            }}
                            style={{ accentColor: '#10B981', cursor: 'pointer' }} 
                          />
                          <span style={{ color: '#F1F5F9', fontSize: '13px' }}>{module}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <p style={{ color: '#64748B', fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>Selected: {editingProfile.modules.length} module(s)</p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>{editingProfile.id ? 'Update Profile' : 'Create Profile'}</button>
                <button type="button" onClick={() => { setShowProfileModal(false); setEditingProfile(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
