'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { AlertRegular, MailRegular, AlertOnRegular, DeleteRegular, ArrowUploadRegular, AddRegular, ArrowDownloadRegular, PeopleRegular, VehicleCarRegular, DocumentRegular, PersonRegular, SettingsRegular, PhoneRegular, ClockRegular } from '@fluentui/react-icons'

export default function TenantPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [tenantName, setTenantName] = useState('Organization')

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated')
    const storedUsername = sessionStorage.getItem('username') || ''
    const storedTenantName = sessionStorage.getItem('selectedTenantName') || 'Organization'
    
    if (authStatus !== 'true') {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
      setUsername(storedUsername)
      setTenantName(storedTenantName)
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
  const [editingUser, setEditingUser] = useState<{name: string; email: string; role: string; department: string; status: string; profileId?: string} | null>(null)
  const [userSortField, setUserSortField] = useState<'name' | 'email' | 'role' | 'department' | 'status'>('name')
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc')
  const [expandedUserRow, setExpandedUserRow] = useState<number | null>(null)
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<{name: string; subject?: string; status?: string} | null>(null)
  const [showParkingModal, setShowParkingModal] = useState(false)
  const [selectedParkingSpace, setSelectedParkingSpace] = useState<number | null>(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [systemOnline, setSystemOnline] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)

  // Digital Badges state
  const [badgeUsers, setBadgeUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john.smith@company.com', department: 'IT', cardType: 'Mifare EV3', status: 'Downloaded', imei: '123456789012345' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@company.com', department: 'HR', cardType: 'HID', status: 'Sent', imei: '234567890123456' },
    { id: 3, name: 'Mike Davis', email: 'mike.d@company.com', department: 'Sales', cardType: 'NFC', status: 'New', imei: '345678901234567' },
    { id: 4, name: 'Lisa Wilson', email: 'lisa.w@company.com', department: 'Marketing', cardType: 'LEGIC', status: 'Downloaded', imei: '456789012345678' },
    { id: 5, name: 'Tom Brown', email: 'tom.brown@company.com', department: 'Operations', cardType: 'Mifare EV3', status: 'Suspended', imei: '567890123456789' },
  ])
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [editingBadge, setEditingBadge] = useState<{id?: number; name: string; email: string; department: string; cardType: string; imei: string} | null>(null)
  const [badgeSearchTerm, setBadgeSearchTerm] = useState('')
  const [badgeStatusFilter, setBadgeStatusFilter] = useState('All Statuses')
  const [badgeCardTypeFilter, setBadgeCardTypeFilter] = useState('All Card Types')
  const [showBadgeImportModal, setShowBadgeImportModal] = useState(false)

  // Digital Badges handlers
  const handleAddBadgeUser = () => {
    setEditingBadge({ name: '', email: '', department: '', cardType: 'Mifare EV3', imei: '' })
    setShowBadgeModal(true)
  }

  const handleEditBadgeUser = (user: typeof badgeUsers[0]) => {
    setEditingBadge(user)
    setShowBadgeModal(true)
  }

  const handleSaveBadgeUser = () => {
    if (!editingBadge) return
    
    if (!editingBadge.name || !editingBadge.email || !editingBadge.department || !editingBadge.imei) {
      alert('Please fill in all required fields')
      return
    }

    if (editingBadge.id) {
      // Update existing
      setBadgeUsers(prev => prev.map(u => u.id === editingBadge.id ? { ...editingBadge, id: editingBadge.id, status: u.status } as typeof u : u))
      alert('Badge user updated successfully')
    } else {
      // Add new
      const newUser = { ...editingBadge, id: Math.max(...badgeUsers.map(u => u.id)) + 1, status: 'New' as const }
      setBadgeUsers(prev => [...prev, newUser])
      alert('Badge user added successfully')
    }
    
    setShowBadgeModal(false)
    setEditingBadge(null)
  }

  const handleDeleteBadgeUser = (userId: number) => {
    const user = badgeUsers.find(u => u.id === userId)
    if (user && confirm(`Delete badge for ${user.name}? This action cannot be undone.`)) {
      setBadgeUsers(prev => prev.filter(u => u.id !== userId))
      alert('Badge user deleted successfully')
    }
  }

  const handleSendBadgeEmail = (userId: number) => {
    const user = badgeUsers.find(u => u.id === userId)
    if (user) {
      setBadgeUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Sent' as const } : u))
      alert(`Badge email sent to ${user.email}`)
    }
  }

  const handleSendBadgePush = (userId: number) => {
    const user = badgeUsers.find(u => u.id === userId)
    if (user) {
      setBadgeUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Sent' as const } : u))
      alert(`Push notification sent to ${user.name}`)
    }
  }

  const handleSuspendBadge = (userId: number) => {
    const user = badgeUsers.find(u => u.id === userId)
    if (user && confirm(`Suspend badge for ${user.name}?`)) {
      setBadgeUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Suspended' as const } : u))
      alert('Badge suspended successfully')
    }
  }

  const handleRecoverBadge = (userId: number) => {
    const user = badgeUsers.find(u => u.id === userId)
    if (user && confirm(`Recover badge for ${user.name}?`)) {
      setBadgeUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Downloaded' as const } : u))
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
        const headers = lines[0].split(',')
        
        const newUsers = lines.slice(1).map((line, index) => {
          const values = line.split(',')
          return {
            id: Math.max(...badgeUsers.map(u => u.id)) + index + 1,
            name: values[0]?.trim() || '',
            email: values[1]?.trim() || '',
            department: values[2]?.trim() || '',
            cardType: values[3]?.trim() || 'NFC',
            imei: values[4]?.trim() || '',
            status: 'New' as const
          }
        })
        
        setBadgeUsers(prev => [...prev, ...newUsers])
        alert(`Successfully imported ${newUsers.length} badge users`)
        setShowBadgeImportModal(false)
      }
      reader.readAsText(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const filteredBadgeUsers = badgeUsers.filter(user => {
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
            { icon: '◐', label: 'Analytics', action: () => setActiveSection('analytics'), isFluentIcon: false, iconType: null },
            { icon: 'people', label: 'Users', action: () => setActiveSection('users'), isFluentIcon: true, iconType: 'people' },
            { icon: 'person', label: 'Invitations', action: () => setActiveSection('invitations'), isFluentIcon: true, iconType: 'person' },
            { icon: 'vehicle', label: 'Parking', action: () => setActiveSection('parking'), isFluentIcon: true, iconType: 'vehicle' },
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
                ) : (
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                )
              ) : (
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
              )}
              {!sidebarCollapsed && <span>{item.label}</span>}
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
              {activeSection === 'analytics' && 'Analytics Dashboard'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'invitations' && 'Invitation Management'}
              {activeSection === 'parking' && 'Parking Management'}
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
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>147</div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Total Users</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Active in your organization</p>
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
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>23</div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Active Invitations</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Pending responses</p>
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
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>12/50</div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Parking Spaces</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>38 available</p>
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

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Users</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>147</div>
                  <div style={{ fontSize: '14px', color: '#10B981' }}>↑ 12% from last month</div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Active Invitations</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3B82F6', marginBottom: '8px' }}>23</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>8 pending responses</div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Parking Usage</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#F59E0B', marginBottom: '8px' }}>24%</div>
                  <div style={{ fontSize: '14px', color: '#10B981' }}>12 of 50 spaces</div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Monthly Growth</h4>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>+18%</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>vs previous month</div>
                </div>
              </div>
              <div style={{ padding: '24px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                <h4 style={{ color: '#F1F5F9', fontSize: '18px', margin: '0 0 20px 0' }}>Recent Activity</h4>
                {[
                  { action: 'New user registered', user: 'John Smith', time: '2 hours ago' },
                  { action: 'Invitation sent', user: 'Sarah Johnson', time: '4 hours ago' },
                  { action: 'Parking reserved', user: 'Mike Davis', time: '6 hours ago' },
                  { action: 'Visit scheduled', user: 'Lisa Wilson', time: '1 day ago' },
                ].map((activity, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: idx < 3 ? '1px solid #1E293B' : 'none' }}>
                    <div>
                      <div style={{ color: '#F1F5F9', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>{activity.action}</div>
                      <div style={{ color: '#64748B', fontSize: '13px' }}>{activity.user}</div>
                    </div>
                    <span style={{ color: '#64748B', fontSize: '13px' }}>{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <button onClick={() => { setEditingUser(null); setShowUserModal(true); }} style={{
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
                      {[
                        { name: 'John Smith', email: 'john.smith@company.com', role: 'Admin', department: 'IT', status: 'Active', modules: { 'User Management': true, 'Visitor Management': true, 'Parking': true, 'Emergency': true, 'Map': true, 'Restaurant': true, 'Ticketing': true, 'Service Hub': true, 'Lockers': true, 'News': true, 'AI Assistant': true, 'Space Management': true, 'Private Delivery': true, 'Authentication': true, 'Reporting': true } },
                        { name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Manager', department: 'HR', status: 'Active', modules: { 'User Management': true, 'Visitor Management': true, 'Parking': false, 'Emergency': true, 'Map': true, 'Restaurant': false, 'Ticketing': true, 'Service Hub': false, 'Lockers': false, 'News': true, 'AI Assistant': false, 'Space Management': true, 'Private Delivery': false, 'Authentication': false, 'Reporting': true } },
                        { name: 'Mike Davis', email: 'mike.davis@company.com', role: 'User', department: 'Sales', status: 'Active', modules: { 'User Management': false, 'Visitor Management': true, 'Parking': false, 'Emergency': true, 'Map': true, 'Restaurant': true, 'Ticketing': false, 'Service Hub': false, 'Lockers': false, 'News': true, 'AI Assistant': false, 'Space Management': false, 'Private Delivery': false, 'Authentication': false, 'Reporting': false } },
                        { name: 'Lisa Wilson', email: 'lisa.w@company.com', role: 'Receptionist', department: 'Reception', status: 'Active', modules: { 'User Management': false, 'Visitor Management': true, 'Parking': true, 'Emergency': true, 'Map': true, 'Restaurant': false, 'Ticketing': true, 'Service Hub': false, 'Lockers': true, 'News': true, 'AI Assistant': false, 'Space Management': false, 'Private Delivery': false, 'Authentication': false, 'Reporting': false } },
                        { name: 'Tom Brown', email: 'tom.brown@company.com', role: 'Manager', department: 'Operations', status: 'Active', modules: { 'User Management': false, 'Visitor Management': true, 'Parking': true, 'Emergency': true, 'Map': true, 'Restaurant': false, 'Ticketing': true, 'Service Hub': true, 'Lockers': true, 'News': true, 'AI Assistant': false, 'Space Management': true, 'Private Delivery': true, 'Authentication': false, 'Reporting': true } },
                      ].sort((a, b) => {
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
                                backgroundColor: user.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                color: user.status === 'Active' ? '#10B981' : '#64748B'
                              }}>
                                {user.status}
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
                                {expandedUserRow === idx ? 'Hide' : 'View'} ({Object.values(user.modules || {}).filter(Boolean).length}/{Object.keys(user.modules || {}).length})
                              </button>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>
                            <button onClick={() => { setEditingUser(user); setShowUserModal(true); }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #1E293B',
                              borderRadius: '6px',
                              color: '#3B82F6',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              marginRight: '8px'
                            }}>Edit</button>
                            <button onClick={() => { if (confirm(`${user.status === 'Active' ? 'Deactivate' : 'Reactivate'} ${user.name}?`)) { alert(`User ${user.status === 'Active' ? 'deactivated' : 'reactivated'} successfully`); } }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #1E293B',
                              borderRadius: '6px',
                              color: user.status === 'Active' ? '#F59E0B' : '#10B981',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              marginRight: '8px'
                            }}>{user.status === 'Active' ? 'Deactivate' : 'Reactivate'}</button>
                            <button onClick={() => { if (confirm(`Delete ${user.name}? This action cannot be undone.`)) { alert('User deleted successfully'); } }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #1E293B',
                              borderRadius: '6px',
                              color: '#EF4444',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer'
                            }}>Delete</button>
                            </td>
                          </tr>
                          {expandedUserRow === idx && (
                            <tr key={`${idx}-modules`} style={{ borderBottom: '1px solid #1E293B' }}>
                              <td colSpan={7} style={{ padding: '16px', backgroundColor: '#0F1629' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                                  {Object.entries(user.modules || {}).map(([module, enabled]) => (
                                    <div key={module} style={{
                                      padding: '8px 12px',
                                      backgroundColor: '#1E293B',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      border: `1px solid ${enabled ? '#10B981' : '#475569'}`
                                    }}>
                                      <span style={{ color: '#F1F5F9', fontSize: '13px' }}>{module}</span>
                                      <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                        backgroundColor: enabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                        color: enabled ? '#10B981' : '#64748B'
                                      }}>
                                        {enabled ? 'Enabled' : 'Disabled'}
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
                <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Send New Invitation</h2>
                <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visitor Name *</label>
                    <input type="text" placeholder="Full name" style={{
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
                    <input type="email" placeholder="visitor@email.com" style={{
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
                    <input type="date" style={{
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
                    <input type="time" style={{
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
                    <textarea placeholder="Enter purpose of visit" style={{
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
                  <div style={{ gridColumn: '1 / -1' }}>
                    <button type="submit" onSubmit={(e) => { e.preventDefault(); alert('Invitation sent successfully!'); }} style={{
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>Send Invitation</button>
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
                  {[
                    { visitor: 'Alice Cooper', email: 'alice@email.com', date: '2025-10-25', time: '10:00 AM', status: 'Pending', purpose: 'Business Meeting' },
                    { visitor: 'Bob Martin', email: 'bob@email.com', date: '2025-10-24', time: '2:00 PM', status: 'Confirmed', purpose: 'Interview' },
                    { visitor: 'Carol White', email: 'carol@email.com', date: '2025-10-23', time: '11:30 AM', status: 'Declined', purpose: 'Consultation' },
                    { visitor: 'David Lee', email: 'david@email.com', date: '2025-10-26', time: '3:00 PM', status: 'Pending', purpose: 'Product Demo' },
                  ].map((inv, idx) => (
                    <div key={idx} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#F1F5F9', margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{inv.visitor}</h4>
                        <p style={{ color: '#94A3B8', margin: '0 0 4px 0', fontSize: '13px' }}>{inv.email}</p>
                        <p style={{ color: '#64748B', margin: 0, fontSize: '13px' }}>{inv.date} at {inv.time} • {inv.purpose}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: inv.status === 'Confirmed' ? 'rgba(16, 185, 129, 0.1)' : inv.status === 'Declined' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: inv.status === 'Confirmed' ? '#10B981' : inv.status === 'Declined' ? '#EF4444' : '#F59E0B'
                        }}>
                          {inv.status}
                        </span>
                        <button style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#3B82F6',
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}>View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Parking Management Section */}
          {activeSection === 'parking' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Spaces</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F1F5F9' }}>50</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Occupied</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>12</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Available</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>38</div>
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
                    {Array.from({ length: 50 }, (_, i) => {
                      const occupied = [2, 5, 8, 12, 15, 18, 23, 27, 31, 38, 42, 47].includes(i + 1);
                      return (
                        <div key={i} 
                          onClick={() => {
                            if (!occupied) {
                              setSelectedParkingSpace(i + 1);
                              setShowParkingModal(true);
                            }
                          }}
                          style={{
                          padding: '20px',
                          backgroundColor: occupied ? '#1E293B' : '#0F1629',
                          border: `2px solid ${occupied ? '#EF4444' : '#10B981'}`,
                          borderRadius: '8px',
                          textAlign: 'center',
                          cursor: occupied ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          opacity: occupied ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!occupied) e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!occupied) e.currentTarget.style.transform = 'scale(1)';
                        }}>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: occupied ? '#EF4444' : '#10B981', marginBottom: '4px' }}>{i + 1}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>{occupied ? 'Occupied' : 'Available'}</div>
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
                  {[
                    { space: 'A-02', user: 'John Smith', vehicle: 'Tesla Model 3', plate: 'ABC-1234', from: '2025-10-22', to: '2025-10-25' },
                    { space: 'A-05', user: 'Sarah Johnson', vehicle: 'BMW X5', plate: 'XYZ-5678', from: '2025-10-21', to: '2025-10-24' },
                    { space: 'B-08', user: 'Mike Davis', vehicle: 'Audi A4', plate: 'DEF-9012', from: '2025-10-22', to: '2025-10-26' },
                    { space: 'B-12', user: 'Lisa Wilson', vehicle: 'Honda Civic', plate: 'GHI-3456', from: '2025-10-20', to: '2025-10-23' },
                  ].map((assignment, idx) => (
                    <div key={idx} style={{
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
                        }}>{assignment.space}</div>
                        <div>
                          <h4 style={{ color: '#F1F5F9', margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>{assignment.user}</h4>
                          <p style={{ color: '#94A3B8', margin: '0 0 2px 0', fontSize: '13px' }}>{assignment.vehicle} • {assignment.plate}</p>
                          <p style={{ color: '#64748B', margin: 0, fontSize: '12px' }}>{assignment.from} to {assignment.to}</p>
                        </div>
                      </div>
                      <button onClick={() => { if (confirm(`Release parking space ${assignment.space}?`)) { alert(`Parking space ${assignment.space} released successfully`); } }} style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        color: '#EF4444',
                        fontSize: '12px',
                        padding: '6px 12px',
                        cursor: 'pointer'
                      }}>Release</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px' }}>{badgeUsers.length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Total Badges Issued</div>
                </div>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#3B82F6', marginBottom: '8px' }}>{badgeUsers.filter(u => u.status === 'Sent').length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Badges Sent</div>
                </div>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>{badgeUsers.filter(u => u.status === 'Downloaded').length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Badges Activated</div>
                </div>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#EF4444', marginBottom: '8px' }}>{badgeUsers.filter(u => u.status === 'Suspended').length}</div>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {[
                  { name: 'GDPR', description: 'General Data Protection Regulation compliance policy', lastUpdated: '2025-10-15', size: '2.4 MB' },
                  { name: 'Terms & Conditions', description: 'Platform terms and conditions of use', lastUpdated: '2025-10-12', size: '1.8 MB' },
                  { name: 'Passwords', description: 'Password requirements and security guidelines', lastUpdated: '2025-10-10', size: '856 KB' },
                  { name: 'Installation and Onboarding Guide', description: 'Complete setup and onboarding instructions', lastUpdated: '2025-10-08', size: '5.2 MB' },
                ].map((policy) => (
                  <div key={policy.name} style={{
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
                          {policy.name}
                        </h3>
                        <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                          {policy.description}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                          <span style={{ color: '#64748B' }}>
                            <span style={{ color: '#94A3B8', fontWeight: '500' }}>Updated:</span> {policy.lastUpdated}
                          </span>
                          <span style={{ color: '#64748B' }}>
                            <span style={{ color: '#94A3B8', fontWeight: '500' }}>Size:</span> {policy.size}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Downloading ${policy.name} policy...`)}
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
                ))}
              </div>
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
                  {[
                    { id: 'TKT-1001', subject: 'Login issue on mobile app', category: 'Technical', severity: 'High', status: 'Open', created: '2025-10-22', lastUpdate: '2 hours ago' },
                    { id: 'TKT-0998', subject: 'Request for additional user licenses', category: 'Billing', severity: 'Medium', status: 'In Progress', created: '2025-10-20', lastUpdate: '1 day ago' },
                    { id: 'TKT-0995', subject: 'Feature request: Dark mode', category: 'Feature Request', severity: 'Low', status: 'Resolved', created: '2025-10-18', lastUpdate: '3 days ago' },
                  ].map((ticket) => (
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
                            <span style={{ color: '#60A5FA', fontSize: '14px', fontWeight: '600' }}>{ticket.id}</span>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: ticket.severity === 'High' ? 'rgba(239, 68, 68, 0.2)' : ticket.severity === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                              color: ticket.severity === 'High' ? '#EF4444' : ticket.severity === 'Medium' ? '#F59E0B' : '#22C55E'
                            }}>
                              {ticket.severity}
                            </span>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: ticket.status === 'Open' ? 'rgba(59, 130, 246, 0.2)' : ticket.status === 'In Progress' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                              color: ticket.status === 'Open' ? '#3B82F6' : ticket.status === 'In Progress' ? '#F59E0B' : '#22C55E'
                            }}>
                              {ticket.status}
                            </span>
                          </div>
                          <h4 style={{ color: '#F1F5F9', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{ticket.subject}</h4>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748B' }}>
                            <span>Category: {ticket.category}</span>
                            <span>Created: {ticket.created}</span>
                            <span>Updated: {ticket.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => alert(`Viewing ticket ${ticket.id}`)} style={{
                          padding: '6px 12px',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>View</button>
                        {ticket.status !== 'Resolved' && (
                          <button onClick={() => alert(`Adding reply to ${ticket.id}`)} style={{
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
                        {ticket.status === 'Resolved' && (
                          <button onClick={() => alert(`Reopening ticket ${ticket.id}`)} style={{
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
                  ))}
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
                          fontSize: '20px',
                          flexShrink: 0
                        }}>
                          {notification.type === 'Warning' ? '⚠️' : 
                           notification.type === 'Success' ? '✅' : 'ℹ️'}
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
            <form onSubmit={(e) => { e.preventDefault(); alert(`User ${editingUser ? 'updated' : 'added'} successfully!`); setShowUserModal(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Full Name *</label>
                <input type="text" defaultValue={editingUser?.name} required style={{
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
                <input type="email" defaultValue={editingUser?.email} required style={{
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
                <select defaultValue={editingUser?.role || 'User'} required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Department</label>
                <input type="text" defaultValue={editingUser?.department} style={{
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
                  value={editingUser?.profileId || ''}
                  onChange={(e) => {
                    if (editingUser) {
                      setEditingUser({
                        ...editingUser,
                        profileId: e.target.value
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
                  <option value="" disabled>Select an access profile</option>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>{profile.name} ({profile.modules.length} modules)</option>
                  ))}
                </select>
                {editingUser?.profileId && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #475569' }}>
                    <div style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Modules from {profiles.find(p => p.id === editingUser.profileId)?.name}:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {profiles.find(p => p.id === editingUser.profileId)?.modules.map((module) => (
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
                <button type="button" onClick={() => setShowUserModal(false)} style={{
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
              alert(`Parking space ${selectedParkingSpace} assigned successfully!`); 
              setShowParkingModal(false);
              setSelectedParkingSpace(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Select User *</label>
                <select required style={{
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
                  <option value="john">John Smith</option>
                  <option value="sarah">Sarah Johnson</option>
                  <option value="mike">Mike Davis</option>
                  <option value="lisa">Lisa Wilson</option>
                  <option value="tom">Tom Anderson</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Vehicle Information *</label>
                <input type="text" placeholder="e.g., Tesla Model 3" required style={{
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
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>License Plate *</label>
                <input type="text" placeholder="e.g., ABC-1234" required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>From Date *</label>
                  <input type="date" required style={{
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
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>To Date *</label>
                  <input type="date" required style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} />
                </div>
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
              alert('Support ticket created successfully!');
              setShowTicketModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Subject *</label>
                <input type="text" placeholder="Brief description of the issue" required style={{
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
                <select required style={{
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
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Severity *</label>
                <select required style={{
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
                <textarea placeholder="Please provide detailed information about your issue..." required style={{
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
              {editingBadge.id ? 'Edit Badge User' : 'Add New Badge User'}
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveBadgeUser(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Full Name *</label>
                <input 
                  type="text" 
                  value={editingBadge.name}
                  onChange={(e) => setEditingBadge({ ...editingBadge, name: e.target.value })}
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
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email *</label>
                <input 
                  type="email" 
                  value={editingBadge.email}
                  onChange={(e) => setEditingBadge({ ...editingBadge, email: e.target.value })}
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
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Department *</label>
                <input 
                  type="text" 
                  value={editingBadge.department}
                  onChange={(e) => setEditingBadge({ ...editingBadge, department: e.target.value })}
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
