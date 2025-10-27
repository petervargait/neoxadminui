'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { PersonRegular, AlertRegular, StatusRegular, DocumentBulletListRegular, MailRegular, AlertOnRegular, DeleteRegular, ArrowUploadRegular, AddRegular, ArrowDownloadRegular, PeopleRegular, VehicleCarRegular, DocumentRegular, BuildingRegular, SettingsRegular } from '@fluentui/react-icons'
import { useGlobalState } from '../../context/GlobalStateContext'

export default function AdminPage() {
  const router = useRouter()
  const globalState = useGlobalState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')

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

  const [activeSection, setActiveSection] = useState<string>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<string>('all')
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<{name: string; email: string; role: string; department: string; status: string; profileId?: string} | null>(null)
  const [userSortField, setUserSortField] = useState<'name' | 'email' | 'role' | 'department' | 'status'>('name')
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc')
  const [expandedUserRow, setExpandedUserRow] = useState<number | null>(null)

  // Note: Policy files are now managed via global state (globalState.policyFiles)

  // Note: Digital badges are now managed via global state (globalState.badges)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [editingBadge, setEditingBadge] = useState<{id?: number; name: string; email: string; company: string; cardType: string; imei: string} | null>(null)
  const [badgeSearchTerm, setBadgeSearchTerm] = useState('')
  const [badgeStatusFilter, setBadgeStatusFilter] = useState('All Statuses')
  const [badgeCardTypeFilter, setBadgeCardTypeFilter] = useState('All Card Types')
  const [showBadgeImportModal, setShowBadgeImportModal] = useState(false)

  // Note: Profiles are now managed via global state (globalState.profiles)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState<{id?: string; name: string; description: string; modules: string[]} | null>(null)

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        console.log('CSV uploaded:', csv)
        alert(`CSV file "${file.name}" uploaded successfully! Processing ${csv.split('\n').length - 1} users.`)
      }
      reader.readAsText(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const handlePolicyUpload = (policyName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Data = e.target?.result as string
        globalState.uploadPolicy(policyName, {
          name: file.name,
          uploadDate: new Date().toLocaleDateString(),
          fileData: base64Data,
          fileType: file.type
        })
        alert(`${policyName} policy "${file.name}" uploaded successfully!`)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please select a valid PDF file')
    }
  }

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
      const existingBadge = globalState.badges.find(b => b.id === editingBadge.id)
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
        const headers = lines[0].split(',')
        
        lines.slice(1).forEach((line) => {
          const values = line.split(',')
          globalState.addBadge({
            name: values[0]?.trim() || '',
            email: values[1]?.trim() || '',
            company: values[2]?.trim() || '',
            cardType: values[3]?.trim() || 'NFC',
            imei: values[4]?.trim() || '',
            status: 'New'
          })
        })
        
        alert(`Successfully imported ${lines.length - 1} badge users`)
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

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

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
      {/* Sidebar - same as before */}
      <div style={{
        width: sidebarCollapsed ? '150px' : '280px',
        backgroundColor: '#162032',
        borderRight: '1px solid #1E293B',
        transition: 'width 0.3s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
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

        {!sidebarCollapsed && (
          <div style={{ padding: '20px 20px 10px 20px', borderBottom: '1px solid #1E293B' }}>
            <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Select Tenant</label>
            <select 
              value={selectedTenant}
              onChange={(e) => {
                setSelectedTenant(e.target.value);
                if (e.target.value !== 'all') {
                  setActiveSection('tenantEdit');
                } else {
                  setActiveSection('dashboard');
                }
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#0B1426',
                border: '1px solid #1E293B',
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Tenants</option>
              <option value="acme">Acme Corporation</option>
              <option value="digital">Digital Dynamics</option>
              <option value="global">Global Solutions Ltd</option>
              <option value="innovation">Innovation Labs</option>
              <option value="techflow">TechFlow Industries</option>
            </select>
          </div>
        )}

        <nav style={{ padding: '20px 0', flex: 1 }}>
          {[
            { icon: '◈', label: 'Dashboard', action: () => setActiveSection('dashboard'), enabled: true, isFluentIcon: false, iconType: null },
            { icon: 'building', label: 'Tenants', action: () => setActiveSection('tenantsList'), enabled: true, isFluentIcon: true, iconType: 'building' },
            { icon: 'people', label: 'Users', action: () => setActiveSection('users'), enabled: selectedTenant !== 'all', isFluentIcon: true, iconType: 'people' },
            { icon: 'settings', label: 'Modules', action: () => setActiveSection('modules'), enabled: true, isFluentIcon: true, iconType: 'settings' },
            { icon: '◨', label: 'Bulk Upload', action: () => setActiveSection('bulkUpload'), enabled: selectedTenant !== 'all', isFluentIcon: false, iconType: null },
            { icon: 'document', label: 'Digital Badges', action: () => setActiveSection('digitalBadges'), enabled: selectedTenant !== 'all', isFluentIcon: true, iconType: 'document' },
            { icon: '◆', label: 'White Label', action: () => setActiveSection('whiteLabel'), enabled: selectedTenant !== 'all', isFluentIcon: false, iconType: null },
            { icon: '◪', label: 'Policies', action: () => setActiveSection('policies'), enabled: true, isFluentIcon: false, iconType: null },
            { icon: 'ticket', label: 'Ticket Management', action: () => setActiveSection('ticketManagement'), enabled: true, isFluentIcon: true, iconType: 'ticket' },
            { icon: 'alert', label: 'Notifications', action: () => setActiveSection('notifications'), enabled: true, isFluentIcon: true, iconType: 'alert' },
            { icon: 'status', label: 'System Status', action: () => setActiveSection('systemStatus'), enabled: true, isFluentIcon: true, iconType: 'status' },
            { icon: '◫', label: 'Audit Logs', action: () => setActiveSection('auditLogs'), enabled: true, isFluentIcon: false, iconType: null },
            { icon: '◐', label: 'Analytics', action: () => setActiveSection('analytics'), enabled: true, isFluentIcon: false, iconType: null },
            { icon: '◦', label: 'System Settings', action: () => setActiveSection('systemSettings'), enabled: true, isFluentIcon: false, iconType: null },
          ].map((item, index) => (
            <div key={index} 
              onClick={item.enabled ? item.action : undefined}
              style={{
                padding: '12px 20px',
                margin: '4px 12px',
                borderRadius: '8px',
                cursor: item.enabled ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: item.enabled ? '#94A3B8' : '#475569',
                fontSize: '14px',
                fontWeight: '500',
                opacity: item.enabled ? 1 : 0.4,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (item.enabled) {
                  const target = e.currentTarget;
                  target.style.backgroundColor = '#1E293B';
                  target.style.color = '#F1F5F9';
                }
              }}
              onMouseLeave={(e) => {
                if (item.enabled) {
                  const target = e.currentTarget;
                  target.style.backgroundColor = 'transparent';
                  target.style.color = '#94A3B8';
                }
              }}
            >
              {item.isFluentIcon ? (
                item.iconType === 'people' ? (
                  <PeopleRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'building' ? (
                  <BuildingRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'settings' ? (
                  <SettingsRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'document' ? (
                  <DocumentRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'alert' ? (
                  <AlertRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'status' ? (
                  <StatusRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'ticket' ? (
                  <DocumentBulletListRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
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
              {activeSection === 'dashboard' && 'Global Admin Dashboard'}
              {activeSection === 'tenantsList' && 'Tenants Management'}
              {activeSection === 'tenantEdit' && 'Edit Tenant'}
              {activeSection === 'tenantCreate' && 'Create New Tenant'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'modules' && 'Manage Modules'}
              {activeSection === 'bulkUpload' && 'Bulk Upload Users'}
              {activeSection === 'digitalBadges' && 'Digital Badges Management'}
              {activeSection === 'whiteLabel' && 'White Label Settings'}
              {activeSection === 'policies' && 'Policy Management'}
              {activeSection === 'ticketManagement' && 'Ticket Management'}
              {activeSection === 'notifications' && 'Notifications'}
              {activeSection === 'systemStatus' && 'System Status'}
              {activeSection === 'auditLogs' && 'System Audit Logs'}
              {activeSection === 'analytics' && 'Analytics Dashboard'}
              {activeSection === 'systemSettings' && 'System Settings'}
            </h1>
            <p style={{ 
              color: '#64748B', 
              fontSize: '14px', 
              margin: '4px 0 0 0' 
            }}>
              {activeSection === 'dashboard' && 'Manage tenants, users, and system operations'}
              {activeSection === 'users' && selectedTenant !== 'all' && `Managing users for ${selectedTenant}`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* System Status Icon */}
            <button
              onClick={() => setActiveSection('systemStatus')}
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
              title="System Status"
            >
              <StatusRegular style={{ fontSize: '20px', width: '20px', height: '20px', color: '#10B981' }} />
            </button>
            
            {/* Notifications Icon */}
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
                position: 'relative',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.5), 0 0 25px rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#334155'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6), 0 0 35px rgba(239, 68, 68, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5), 0 0 25px rgba(239, 68, 68, 0.3)'
              }}
              title="Notifications"
            >
              <AlertOnRegular style={{ fontSize: '20px', width: '20px', height: '20px', color: '#F1F5F9' }} />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                border: '2px solid #1E293B',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)'
              }}></span>
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
                backgroundColor: '#3B82F6',
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

        {/* Main Content Area - All sections displayed here based on activeSection */}
        <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          
          {/* I'll continue this message with the remaining content sections... */}

          {/* Dashboard View */}
          {activeSection === 'dashboard' && (
            <>
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
                      boxShadow: '0 0 15px rgba(215, 187, 145, 0.4), 0 0 30px rgba(215, 187, 145, 0.2)'
                    }}>
                      <span style={{ fontSize: '24px', color: '#D7BB91' }}>◎</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>12</div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Active Tenants</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Organizations using the platform</p>
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
                      boxShadow: '0 0 15px rgba(96, 165, 250, 0.4), 0 0 30px rgba(96, 165, 250, 0.2)'
                    }}>
                      <span style={{ fontSize: '24px', color: '#60A5FA' }}>◧</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>2,847</div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Total Users</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Across all tenants</p>
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
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 15px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.2)'
                    }}>
                      <span style={{ fontSize: '24px', color: '#22C55E' }}>◈</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#22C55E' }}>Online</div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>System Status</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>All services operational</p>
                </div>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden',
                marginBottom: '32px'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Recent Tenants</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Latest organization registrations</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedTenant('all'); setActiveSection('tenantCreate'); }}
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2563EB'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#3B82F6'}
                  >
                    + Create Tenant
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organization</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Users</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                        <th style={{ padding: '16px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Acme Corporation', status: 'Active', users: 245, plan: 'Enterprise', created: '2024-01-15', logo: '◎', color: '#D7BB91' },
                        { name: 'TechFlow Industries', status: 'Active', users: 128, plan: 'Professional', created: '2024-01-10', logo: '◆', color: '#60A5FA' },
                        { name: 'Global Solutions Ltd', status: 'Pending', users: 0, plan: 'Starter', created: '2024-01-08', logo: '◈', color: '#22C55E' },
                        { name: 'Innovation Labs', status: 'Active', users: 87, plan: 'Professional', created: '2024-01-05', logo: '◧', color: '#A78BFA' },
                        { name: 'Digital Dynamics', status: 'Suspended', users: 156, plan: 'Enterprise', created: '2024-01-03', logo: '■', color: '#F59E0B' },
                      ].map((tenant, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: `${tenant.color}15`,
                                border: `1px solid ${tenant.color}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                color: tenant.color,
                                boxShadow: `0 0 10px ${tenant.color}30`
                              }}>
                                {tenant.logo}
                              </div>
                              <div>
                                <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{tenant.name}</div>
                                <div style={{ color: '#64748B', fontSize: '12px' }}>ID: {String(index + 1).padStart(3, '0')}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: tenant.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 
                                               tenant.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: tenant.status === 'Active' ? '#10B981' : 
                                     tenant.status === 'Pending' ? '#F59E0B' : '#EF4444'
                            }}>
                              {tenant.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', color: '#F1F5F9', fontSize: '14px' }}>{tenant.users.toLocaleString()}</td>
                          <td style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px' }}>{tenant.plan}</td>
                          <td style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px' }}>{tenant.created}</td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button onClick={() => {
                              const tenantMap: Record<string, string> = {
                                'Acme Corporation': 'acme',
                                'TechFlow Industries': 'techflow',
                                'Global Solutions Ltd': 'global',
                                'Innovation Labs': 'innovation',
                                'Digital Dynamics': 'digital'
                              };
                              setSelectedTenant(tenantMap[tenant.name] || 'all');
                              setActiveSection('tenantEdit');
                            }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #1E293B',
                              borderRadius: '6px',
                              color: '#64748B',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer'
                            }}>
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* User Management Section */}
          {activeSection === 'users' && selectedTenant !== 'all' && (
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
                        .filter(u => u.tenantId === selectedTenant)
                        .sort((a, b) => {
                        const aVal = (a[userSortField] || '').toString().toLowerCase();
                        const bVal = (b[userSortField] || '').toString().toLowerCase();
                        if (userSortDirection === 'asc') {
                          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                        } else {
                          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
                        }
                      }).map((user, idx) => {
                        const userProfile = globalState.profiles.find(p => p.id === user.profileId);
                        const userModules = userProfile?.modules || [];
                        return (
                        <>
                          <tr key={user.id} style={{ borderBottom: expandedUserRow === idx ? 'none' : '1px solid #1E293B' }}>
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
                                  cursor: 'pointer',
                                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.3)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                {expandedUserRow === idx ? 'Hide' : 'View'} Profile: {userProfile?.name || 'None'}
                              </button>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>
                              <button onClick={() => { setEditingUser({ name: user.name, email: user.email, role: user.role, department: user.department, status: user.status, profileId: user.profileId }); setShowUserModal(true); }} style={{
                                backgroundColor: '#60A5FA',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                marginRight: '8px',
                                boxShadow: '0 0 10px rgba(96, 165, 250, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(96, 165, 250, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}>Edit</button>
                              <button onClick={() => { 
                                if (confirm(`${user.status === 'active' ? 'Deactivate' : 'Reactivate'} ${user.name}?`)) { 
                                  globalState.updateUser(user.id, { status: user.status === 'active' ? 'inactive' : 'active' });
                                  alert(`User ${user.status === 'active' ? 'deactivated' : 'reactivated'} successfully`); 
                                } 
                              }} style={{
                                backgroundColor: user.status === 'active' ? '#F59E0B' : '#10B981',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                marginRight: '8px',
                                boxShadow: user.status === 'active' ? '0 0 10px rgba(245, 158, 11, 0.3)' : '0 0 10px rgba(16, 185, 129, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = user.status === 'active' ? '0 0 15px rgba(245, 158, 11, 0.5)' : '0 0 15px rgba(16, 185, 129, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = user.status === 'active' ? '0 0 10px rgba(245, 158, 11, 0.3)' : '0 0 10px rgba(16, 185, 129, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}>{user.status === 'active' ? 'Deactivate' : 'Reactivate'}</button>
                              <button onClick={() => { 
                                if (confirm(`Delete ${user.name}? This action cannot be undone.`)) { 
                                  globalState.deleteUser(user.id);
                                  alert('User deleted successfully'); 
                                } 
                              }} style={{
                                backgroundColor: '#EF4444',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}>Delete</button>
                            </td>
                          </tr>
                          {expandedUserRow === idx && userProfile && (
                            <tr key={`${user.id}-profile`} style={{ borderBottom: '1px solid #1E293B' }}>
                              <td colSpan={7} style={{ padding: '16px', backgroundColor: '#0F1629' }}>
                                <div style={{ marginBottom: '12px' }}>
                                  <h4 style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Profile: {userProfile.name}</h4>
                                  <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>{userProfile.description}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                                  {userModules.map((module) => (
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
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* Bulk Upload Section */}
          {activeSection === 'bulkUpload' && selectedTenant !== 'all' && (
            <div>
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <h3 style={{ color: '#3b82f6', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>ℹ️</span> CSV Format Requirements
                </h3>
                <p style={{ color: '#F1F5F9', fontSize: '14px', margin: '0 0 12px 0' }}>
                  Your CSV file should include the following columns (in order):
                </p>
                <div style={{ fontFamily: 'monospace', backgroundColor: '#1E293B', padding: '12px', borderRadius: '6px', color: '#F1F5F9', fontSize: '12px' }}>
                  name,email,role,department
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
                    textDecoration: 'none'
                  }} onClick={() => {
                    const csvContent = "name,email,role,department\nJohn Smith,john@company.com,user,IT\nJane Doe,jane@company.com,admin,HR\nBob Johnson,bob@company.com,manager,Sales"
                    const blob = new Blob([csvContent], { type: 'text/csv' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'users_template.csv'
                    a.click()
                    window.URL.revokeObjectURL(url)
                  }}>Download Sample CSV</button>
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
                    onChange={handleCSVUpload}
                    style={{ display: 'none' }}
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" style={{
                    backgroundColor: '#3B82F6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}>Choose CSV File</label>
                  <p style={{ color: '#64748B', marginTop: '12px', fontSize: '14px' }}>
                    Select a CSV file to upload multiple users at once
                  </p>
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                <h3 style={{ color: '#eab308', fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>⚠️</span> Upload Process
                </h3>
                <ul style={{ color: '#F1F5F9', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                  <li>Users will be validated before creation</li>
                  <li>Duplicate emails will be skipped</li>
                  <li>Invalid entries will be reported</li>
                  <li>Email invitations will be sent automatically</li>
                </ul>
              </div>
            </div>
          )}

          {/* Module Management Section - Context-aware: Global profiles or Tenant-specific profiles */}
          {activeSection === 'modules' && (() => {
            const isGlobalView = selectedTenant === 'all';
            const currentProfiles = isGlobalView 
              ? globalState.profiles.filter(p => p.isGlobal)
              : globalState.profiles.filter(p => p.isGlobal || p.tenantId === selectedTenant);
            
            return (
              <div>
                <div style={{
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B',
                  overflow: 'hidden',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>
                        {isGlobalView ? 'Global Access Profiles' : `Access Profiles: ${selectedTenant}`}
                      </h2>
                      <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>
                        {isGlobalView 
                          ? 'Global profiles inherited by all tenants' 
                          : 'Global profiles (inherited) and tenant-specific profiles'}
                      </p>
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
                      + Create {isGlobalView ? 'Global' : 'Tenant'} Profile
                    </button>
                  </div>

                  <div style={{ padding: '24px' }}>
                    {currentProfiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                        <p style={{ fontSize: '16px', marginBottom: '8px' }}>No profiles created yet</p>
                        <p style={{ fontSize: '14px' }}>Create a profile to define module access for users</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {currentProfiles.map((profile) => (
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
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
                                        globalState.deleteProfile(profile.id);
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
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

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
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Manage and distribute digital wallet badges</p>
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
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Company</th>
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
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>{user.company}</td>
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
                    }}>3</button>
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

          {/* Close main content div and other closing tags will be added next */}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Tenants</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>847</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>↑ 12.5% from last month</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Active Users</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3B82F6', marginBottom: '8px' }}>12,543</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>↑ 8.2% from last month</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Digital Badges Issued</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#D7BB91', marginBottom: '8px' }}>847</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>↑ 18.3% from last month</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Invitations</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B', marginBottom: '8px' }}>2,186</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>↑ 15.7% from last month</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Badges Activated</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>423</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>↑ 24.1% from last month</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>System Uptime</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>99.9%</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Last 30 days</div>
                </div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', margin: '0 0 16px 0' }}>Top Performing Tenants</h4>
                {[
                  { name: 'Acme Corporation', users: 245, growth: '+12%' },
                  { name: 'TechFlow Industries', users: 228, growth: '+18%' },
                  { name: 'Innovation Labs', users: 187, growth: '+9%' },
                  { name: 'Digital Dynamics', users: 156, growth: '+23%' },
                ].map((tenant, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx < 3 ? '1px solid #1E293B' : 'none' }}>
                    <span style={{ color: '#F1F5F9', fontSize: '14px' }}>{tenant.name}</span>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{ color: '#64748B', fontSize: '14px' }}>{tenant.users} users</span>
                      <span style={{ color: '#10B981', fontSize: '14px', fontWeight: '600' }}>{tenant.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeSection === 'systemSettings' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '18px', marginBottom: '16px' }}>General Settings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91' }}>
                      <input type="checkbox" defaultChecked /> Enable email notifications
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91' }}>
                      <input type="checkbox" defaultChecked /> Auto-approve invitations
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91' }}>
                      <input type="checkbox" /> Maintenance mode
                    </label>
                  </div>
                </div>
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '18px', marginBottom: '16px' }}>Security</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Session timeout (minutes)</label>
                      <input type="number" defaultValue="30" style={{
                        width: '100px',
                        padding: '8px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91'
                      }} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91' }}>
                      <input type="checkbox" defaultChecked /> Require 2FA for admins
                    </label>
                  </div>
                </div>
                <button style={{
                  backgroundColor: 'rgba(75, 101, 129, 0.8)',
                  color: '#d7bb91',
                  border: '1px solid rgba(75, 101, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>Save Settings</button>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {activeSection === 'auditLogs' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 170px)' }}>
              <div style={{ marginBottom: '16px' }}>
                <input type="search" placeholder="Search logs..." style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(51, 78, 104, 0.5)',
                  border: '1px solid rgba(75, 101, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#d7bb91',
                  fontSize: '14px'
                }} />
              </div>
              <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '16px' }}>
                {globalState.state.auditLogs.length === 0 ? (
                  <div style={{ color: '#d7bb91', opacity: 0.7, textAlign: 'center', padding: '24px' }}>No audit logs available</div>
                ) : (
                  globalState.state.auditLogs.map((log) => (
                    <div key={log.id} style={{
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.3)',
                      borderRadius: '8px',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500' }}>{log.action}</div>
                          <div style={{ color: '#d7bb91', opacity: 0.7, fontSize: '12px' }}>{log.user} - {new Date(log.timestamp).toLocaleString()}</div>
                        </div>
                        <span style={{
                          backgroundColor: log.status === 'Success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                          color: log.status === 'Success' ? '#10b981' : '#ef4444',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>{log.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* White Label */}
          {activeSection === 'whiteLabel' && selectedTenant !== 'all' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Branding Section */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Brand Identity</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company Name</label>
                      <input type="text" placeholder="Your Company Name" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company Logo</label>
                      <div style={{
                        border: '2px dashed rgba(75, 101, 129, 0.5)',
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                        backgroundColor: 'rgba(51, 78, 104, 0.1)'
                      }}>
                        <input type="file" accept="image/*" style={{ display: 'none' }} id="logo-upload" />
                        <label htmlFor="logo-upload" style={{
                          backgroundColor: 'rgba(75, 101, 129, 0.6)',
                          color: '#d7bb91',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'inline-block'
                        }}>Upload Logo</label>
                        <p style={{ color: '#d7bb91', opacity: 0.7, margin: '8px 0 0 0', fontSize: '12px' }}>PNG, JPG, SVG (max 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Scheme Section */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Color Scheme</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Primary Color</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="color" defaultValue="#d7bb91" style={{
                          width: '40px',
                          height: '40px',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }} />
                        <input type="text" defaultValue="#d7bb91" style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px',
                          fontFamily: 'monospace'
                        }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Secondary Color</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="color" defaultValue="#08122e" style={{
                          width: '40px',
                          height: '40px',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }} />
                        <input type="text" defaultValue="#08122e" style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px',
                          fontFamily: 'monospace'
                        }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Accent Color</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="color" defaultValue="#3b82f6" style={{
                          width: '40px',
                          height: '40px',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }} />
                        <input type="text" defaultValue="#3b82f6" style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px',
                          fontFamily: 'monospace'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(75, 101, 129, 0.3)' }}>
                  <button style={{
                    backgroundColor: 'rgba(75, 101, 129, 0.8)',
                    color: '#d7bb91',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '16px 32px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '16px',
                    minWidth: '200px'
                  }}>Save White Label Settings</button>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Management */}
          {activeSection === 'ticketManagement' && (
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
                    <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Support Tickets</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Manage support tickets from tenants</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select style={{
                      padding: '8px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      <option>All Status</option>
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </select>
                    <select style={{
                      padding: '8px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      <option>All Priority</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket ID</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tenant</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                        <th style={{ padding: '16px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'TKT-1024', tenant: 'Acme Corporation', subject: 'Unable to access parking module', priority: 'High', status: 'Open', created: '2025-10-22 14:30', assignedTo: 'Support Team' },
                        { id: 'TKT-1023', tenant: 'TechFlow Industries', subject: 'White label configuration help', priority: 'Medium', status: 'In Progress', created: '2025-10-22 10:15', assignedTo: 'John Smith' },
                        { id: 'TKT-1022', tenant: 'Innovation Labs', subject: 'Bulk user upload failing', priority: 'Critical', status: 'Open', created: '2025-10-22 09:45', assignedTo: 'Support Team' },
                        { id: 'TKT-1021', tenant: 'Global Solutions', subject: 'Need additional module activation', priority: 'Low', status: 'Resolved', created: '2025-10-21 16:20', assignedTo: 'Sarah Johnson' },
                        { id: 'TKT-1020', tenant: 'Digital Dynamics', subject: 'User permissions issue', priority: 'High', status: 'In Progress', created: '2025-10-21 13:10', assignedTo: 'Mike Davis' },
                      ].map((ticket, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ color: '#3B82F6', fontSize: '14px', fontWeight: '600', fontFamily: 'monospace' }}>{ticket.id}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{ticket.tenant}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ color: '#F1F5F9', fontSize: '14px', maxWidth: '300px' }}>{ticket.subject}</div>
                            <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>Assigned to: {ticket.assignedTo}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                ticket.priority === 'Critical' ? 'rgba(239, 68, 68, 0.2)' :
                                ticket.priority === 'High' ? 'rgba(245, 158, 11, 0.2)' :
                                ticket.priority === 'Medium' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                              color: 
                                ticket.priority === 'Critical' ? '#EF4444' :
                                ticket.priority === 'High' ? '#F59E0B' :
                                ticket.priority === 'Medium' ? '#3B82F6' : '#64748B'
                            }}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                ticket.status === 'Open' ? 'rgba(239, 68, 68, 0.1)' :
                                ticket.status === 'In Progress' ? 'rgba(59, 130, 246, 0.1)' :
                                ticket.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                              color: 
                                ticket.status === 'Open' ? '#EF4444' :
                                ticket.status === 'In Progress' ? '#3B82F6' :
                                ticket.status === 'Resolved' ? '#10B981' : '#64748B'
                            }}>
                              {ticket.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', color: '#64748B', fontSize: '13px' }}>{ticket.created}</td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button style={{
                              backgroundColor: '#3B82F6',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              marginRight: '8px'
                            }}>View</button>
                            <button style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #1E293B',
                              borderRadius: '6px',
                              color: '#64748B',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer'
                            }}>Assign</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ticket Statistics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '24px'
              }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#EF4444', marginBottom: '8px' }}>8</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Open Tickets</div>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#3B82F6', marginBottom: '8px' }}>5</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>In Progress</div>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>42</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Resolved This Month</div>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#F59E0B', marginBottom: '8px' }}>2.4h</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Avg Response Time</div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
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
                    <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>System Notifications</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Important system alerts and updates</p>
                  </div>
                  <button style={{
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
                      { id: 1, type: 'Critical', title: 'System Maintenance Scheduled', message: 'Planned maintenance window on Oct 25, 2025 from 2:00 AM - 4:00 AM UTC', time: '2 hours ago', unread: true },
                      { id: 2, type: 'Warning', title: 'High CPU Usage Detected', message: 'Server load has exceeded 85% for the past 30 minutes', time: '5 hours ago', unread: true },
                      { id: 3, type: 'Info', title: 'New Feature Released', message: 'Enhanced reporting module is now available for all tenants', time: '1 day ago', unread: false },
                      { id: 4, type: 'Success', title: 'Backup Completed Successfully', message: 'Daily system backup completed without errors', time: '1 day ago', unread: false },
                      { id: 5, type: 'Warning', title: 'SSL Certificate Expiring Soon', message: 'Your SSL certificate will expire in 30 days. Please renew.', time: '2 days ago', unread: false },
                      { id: 6, type: 'Info', title: 'Security Update Available', message: 'A new security patch is available for installation', time: '3 days ago', unread: false },
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
                            notification.type === 'Critical' ? 'rgba(239, 68, 68, 0.2)' :
                            notification.type === 'Warning' ? 'rgba(245, 158, 11, 0.2)' :
                            notification.type === 'Success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>
                          {notification.type === 'Critical' ? '🚨' : 
                           notification.type === 'Warning' ? '⚠️' : 
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
                              <button style={{
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

          {/* System Status */}
          {activeSection === 'systemStatus' && (
            <div>
              {/* Overall Status */}
              <div style={{
                padding: '24px',
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                }}>
                  <span style={{ fontSize: '32px' }}>✓</span>
                </div>
                <h2 style={{ color: '#10B981', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>All Systems Operational</h2>
                <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Last checked: Just now</p>
              </div>

              {/* Service Status Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {[
                  { name: 'API Gateway', status: 'Operational', uptime: '99.99%', responseTime: '45ms' },
                  { name: 'Database', status: 'Operational', uptime: '99.98%', responseTime: '12ms' },
                  { name: 'Authentication Service', status: 'Operational', uptime: '100%', responseTime: '23ms' },
                  { name: 'File Storage', status: 'Operational', uptime: '99.97%', responseTime: '89ms' },
                  { name: 'Email Service', status: 'Operational', uptime: '99.95%', responseTime: '156ms' },
                  { name: 'Notification System', status: 'Operational', uptime: '99.99%', responseTime: '34ms' },
                ].map((service, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    backgroundColor: '#162032',
                    borderRadius: '12px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', margin: 0 }}>{service.name}</h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10B981'
                      }}>{service.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#64748B', fontSize: '13px' }}>Uptime</span>
                      <span style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: '500' }}>{service.uptime}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B', fontSize: '13px' }}>Response Time</span>
                      <span style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: '500' }}>{service.responseTime}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Incidents */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Recent Incidents</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  {[
                    { date: 'Oct 20, 2025', title: 'Database Connection Issue', status: 'Resolved', duration: '15 minutes', severity: 'Minor' },
                    { date: 'Oct 18, 2025', title: 'API Rate Limiting', status: 'Resolved', duration: '45 minutes', severity: 'Moderate' },
                    { date: 'Oct 15, 2025', title: 'Scheduled Maintenance', status: 'Completed', duration: '2 hours', severity: 'Planned' },
                  ].map((incident, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      marginBottom: index < 2 ? '12px' : 0
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div>
                          <h4 style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>{incident.title}</h4>
                          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>{incident.date} • Duration: {incident.duration}</p>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#10B981',
                          whiteSpace: 'nowrap'
                        }}>{incident.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Policies */}
          {activeSection === 'policies' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: '#d7bb91', fontSize: '14px', marginBottom: '24px' }}>
                  Upload and manage policy documents. These policies will be available for download by all tenants.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {Object.keys(globalState.policyFiles).map((policyName) => (
                  <div key={policyName} style={{
                    padding: '24px',
                    backgroundColor: 'rgba(51, 78, 104, 0.3)',
                    borderRadius: '12px',
                    border: '1px solid rgba(75, 101, 129, 0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(75, 101, 129, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        📄
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: '#d7bb91', fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
                          {policyName}
                        </h3>
                        {globalState.policyFiles[policyName] ? (
                          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
                            Uploaded: {globalState.policyFiles[policyName]?.uploadDate}
                          </p>
                        ) : (
                          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
                            No file uploaded
                          </p>
                        )}
                      </div>
                    </div>

                    {globalState.policyFiles[policyName] && (
                      <div style={{
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}>
                        <p style={{ color: '#d7bb91', fontSize: '14px', margin: '0 0 4px 0', fontWeight: '500' }}>
                          Current File:
                        </p>
                        <p style={{ color: '#d7bb91', fontSize: '13px', margin: 0, opacity: 0.8 }}>
                          {globalState.policyFiles[policyName]?.name}
                        </p>
                      </div>
                    )}

                    <div style={{
                      border: '2px dashed rgba(75, 101, 129, 0.5)',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      backgroundColor: 'rgba(51, 78, 104, 0.1)'
                    }}>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        style={{ display: 'none' }}
                        id={`policy-${policyName.replace(/\s+/g, '-')}`}
                        onChange={(e) => handlePolicyUpload(policyName, e)}
                      />
                      <label
                        htmlFor={`policy-${policyName.replace(/\s+/g, '-')}`}
                        style={{
                          backgroundColor: 'rgba(75, 101, 129, 0.8)',
                          color: '#d7bb91',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '6px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'inline-block',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 101, 129, 1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 101, 129, 0.8)'}
                      >
                        {globalState.policyFiles[policyName] ? 'Replace File' : 'Upload PDF'}
                      </label>
                      <p style={{ color: '#d7bb91', opacity: 0.7, margin: '8px 0 0 0', fontSize: '12px' }}>
                        PDF files only (max 10MB)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tenants List */}
          {activeSection === 'tenantsList' && (
            <div>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
                <input type="search" placeholder="Search tenants..." style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  outline: 'none'
                }} />
                <button onClick={() => { setSelectedTenant('all'); setActiveSection('tenantCreate'); }} style={{
                  backgroundColor: '#3B82F6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: '500',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>+ Create Tenant</button>
              </div>
              <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                {globalState.tenants.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    <p style={{ fontSize: '16px', marginBottom: '8px' }}>No tenants created yet</p>
                    <p style={{ fontSize: '14px' }}>Click "Create Tenant" to add your first tenant</p>
                  </div>
                ) : (
                  globalState.tenants.sort((a, b) => a.name.localeCompare(b.name)).map((tenant) => {
                    const userCount = globalState.users.filter(u => u.tenantId === tenant.id).length;
                    return (
                      <div key={tenant.id} style={{
                        padding: '20px',
                        backgroundColor: '#162032',
                        borderRadius: '12px',
                        border: '1px solid #1E293B',
                        marginBottom: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1E293B';
                        e.currentTarget.style.borderColor = '#334155';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#162032';
                        e.currentTarget.style.borderColor = '#1E293B';
                      }}>
                        <div>
                          <h4 style={{ color: '#F1F5F9', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{tenant.name}</h4>
                          <p style={{ color: '#94A3B8', margin: '0 0 8px 0', fontSize: '14px' }}>{tenant.contactEmail}{tenant.contactPhone ? ` • ${tenant.contactPhone}` : ''}</p>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: tenant.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              color: tenant.status === 'active' ? '#10B981' : '#F59E0B'
                            }}>
                              {tenant.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                            <span style={{ color: '#64748B', fontSize: '13px' }}>{userCount} users</span>
                            <span style={{ color: '#64748B', fontSize: '13px' }}>{tenant.modules.length} modules</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setSelectedTenant(tenant.id); setActiveSection('tenantEdit'); }} style={{
                            backgroundColor: '#3B82F6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.3)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}>Edit</button>
                          <button onClick={() => {
                            if (confirm(`Delete tenant "${tenant.name}"? This action cannot be undone.`)) {
                              globalState.deleteTenant(tenant.id);
                              alert('Tenant deleted successfully');
                            }
                          }} style={{
                            backgroundColor: '#EF4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}>Delete</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Tenant Edit/Create */}
          {(activeSection === 'tenantEdit' || activeSection === 'tenantCreate') && (
            <div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const companyName = formData.get('companyName') as string;
                const contactEmail = formData.get('contactEmail') as string;
                const contactPhone = formData.get('contactPhone') as string;
                const domain = formData.get('domain') as string || companyName.toLowerCase().replace(/\s+/g, '');
                
                // Validation
                if (!companyName || !contactEmail) {
                  alert('Company Name and Contact Email are required fields');
                  return;
                }
                
                // Get selected modules from checkboxes
                const selectedModules: string[] = [];
                const checkboxes = e.currentTarget.querySelectorAll('input[type="checkbox"]:checked');
                checkboxes.forEach((cb) => {
                  const moduleName = (cb as HTMLInputElement).value;
                  if (moduleName) selectedModules.push(moduleName);
                });
                
                if (activeSection === 'tenantCreate') {
                  // Create new tenant
                  const newTenant = globalState.addTenant({
                    name: companyName,
                    domain: domain,
                    contactEmail: contactEmail,
                    contactPhone: contactPhone || undefined,
                    status: 'active',
                    modules: selectedModules
                  });
                  alert(`Tenant "${companyName}" created successfully!`);
                  setActiveSection('tenantsList');
                } else {
                  // Update existing tenant (if editing)
                  alert('Tenant updated successfully!');
                  setActiveSection('tenantsList');
                }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Company Data */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Company Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company Name *</label>
                      <input type="text" name="companyName" placeholder="Enter company name" required style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company Address</label>
                      <input type="text" placeholder="Street address" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <input type="text" placeholder="City" style={{
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                      <input type="text" placeholder="State/Province" style={{
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                      <input type="text" placeholder="Postal Code" style={{
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Contact Persons */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Contact Persons</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Primary Contact Name *</label>
                      <input type="text" placeholder="Full name" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email *</label>
                        <input type="email" name="contactEmail" placeholder="email@company.com" required style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }} />
                      </div>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Phone</label>
                        <input type="tel" name="contactPhone" placeholder="+1 (555) 000-0000" style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Locations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Location Name</label>
                      <input type="text" placeholder="e.g., Main Office, Building A" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Location Address</label>
                      <input type="text" placeholder="Physical location address" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Invoicing Data */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Invoicing Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Tax ID</label>
                        <input type="text" placeholder="Tax identification number" style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }} />
                      </div>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>IBAN</label>
                        <input type="text" placeholder="Bank account number" style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Billing Email</label>
                      <input type="email" placeholder="billing@company.com" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Enabled Features</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="User Management" defaultChecked /> User Management
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Visitor Management" defaultChecked /> Visitor Management
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Parking" defaultChecked /> Parking Management
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Emergency" /> Emergency
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Ticketing" /> Ticketing
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Digital Badge" /> Digital Badges
                    </label>
                  </div>
                </div>

                <button type="submit" style={{
                  backgroundColor: 'rgba(75, 101, 129, 0.8)',
                  color: '#d7bb91',
                  border: '1px solid rgba(75, 101, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginTop: '8px'
                }}>{activeSection === 'tenantCreate' ? 'Create Tenant' : 'Update Tenant'}</button>
              </form>
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
              const profileId = editingUser?.profileId;
              
              if (!profileId) {
                alert('Please select an access profile');
                return;
              }
              
              if (editingUser && 'id' in editingUser) {
                // Update existing user - find by email match
                const existingUser = globalState.users.find(u => u.email === editingUser.email);
                if (existingUser) {
                  globalState.updateUser(existingUser.id, { name, email, role, department, profileId });
                  alert('User updated successfully!');
                }
              } else {
                // Create new user
                globalState.addUser({
                  name,
                  email,
                  role,
                  department,
                  status: 'active',
                  profileId,
                  tenantId: selectedTenant
                });
                alert('User added successfully!');
              }
              setShowUserModal(false);
              setEditingUser(null);
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
                <select name="role" defaultValue={editingUser?.role || 'User'} required style={{
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
                  {globalState.profiles
                    .filter(p => p.isGlobal || p.tenantId === selectedTenant)
                    .map((profile) => (
                      <option key={profile.id} value={profile.id}>{profile.name} ({profile.modules.length} modules) - {profile.isGlobal ? 'Global' : 'Tenant'}</option>
                    ))}
                </select>
                {editingUser?.profileId && (() => {
                  const selectedProfile = globalState.profiles.find(p => p.id === editingUser.profileId);
                  return selectedProfile ? (
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #475569' }}>
                      <div style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Modules from {selectedProfile.name}:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {selectedProfile.modules.map((module) => (
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
                  ) : null;
                })()}
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
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company *</label>
                <input 
                  type="text" 
                  value={editingBadge.company}
                  onChange={(e) => setEditingBadge({ ...editingBadge, company: e.target.value })}
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
                name,email,company,cardType,imei
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
                  const csvContent = "name,email,company,cardType,imei\nJohn Doe,john@company.com,Acme Corp,Mifare EV3,123456789012345\nJane Smith,jane@company.com,TechFlow,NFC,234567890123456"
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
                  id="badge-csv-upload"
                />
                <label htmlFor="badge-csv-upload" style={{
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
              {editingProfile.id ? 'Edit' : 'Create'} Access Profile
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Define which modules this profile can access</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const profileName = formData.get('profileName') as string;
              const description = formData.get('description') as string;
              
              const isGlobalView = selectedTenant === 'all';
              
              if (editingProfile.id) {
                // Update existing profile
                globalState.updateProfile(editingProfile.id, {
                  name: profileName,
                  description: description,
                  modules: editingProfile.modules
                });
                alert('Profile updated successfully');
              } else {
                // Create new profile
                globalState.addProfile({
                  name: profileName,
                  description: description,
                  modules: editingProfile.modules,
                  isGlobal: isGlobalView,
                  tenantId: isGlobalView ? undefined : selectedTenant
                });
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
                  placeholder="e.g., Administrator, Manager, Receptionist"
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
