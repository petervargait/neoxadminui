'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'

export default function TenantPage() {
  const router = useRouter()
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

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<{name: string; email: string; role: string; department: string; status: string} | null>(null)
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<{name: string; subject?: string; status?: string} | null>(null)
  const [showParkingModal, setShowParkingModal] = useState(false)
  const [selectedParkingSpace, setSelectedParkingSpace] = useState<number | null>(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [systemOnline, setSystemOnline] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)

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
            { icon: '◈', label: 'Dashboard', action: () => setActiveSection(null) },
            { icon: '◐', label: 'Analytics', action: () => setActiveSection('analytics') },
            { icon: '◎', label: 'Users', action: () => setActiveSection('users') },
            { icon: '◫', label: 'Invitations', action: () => setActiveSection('invitations') },
            { icon: '◧', label: 'Parking', action: () => setActiveSection('parking') },
            { icon: '◨', label: 'Templates', action: () => setActiveSection('templates') },
            { icon: '◪', label: 'Policies', action: () => setActiveSection('policies') },
            { icon: '◭', label: 'Support', action: () => setActiveSection('support') },
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
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
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
              {activeSection === 'templates' && 'Template Management'}
              {activeSection === 'policies' && 'Company Policies'}
              {activeSection === 'support' && 'Support & Help'}
              {!activeSection && 'Tenant Admin Dashboard'}
            </h1>
            <p style={{ 
              color: '#64748B', 
              fontSize: '14px', 
              margin: '4px 0 0 0' 
            }}>
              {activeSection ? 'Manage your organization' : 'Welcome to your organization'}
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
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => alert('Notifications')}}>
              <div style={{
                padding: '8px',
                backgroundColor: '#1E293B',
                borderRadius: '8px',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '18px' }}>🔔</span>
              </div>
              {notificationCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {notificationCount}
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
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
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
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
                    <option>User</option>
                  </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Email</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Role</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Department</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'John Smith', email: 'john.smith@company.com', role: 'Admin', department: 'IT', status: 'Active' },
                        { name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Manager', department: 'HR', status: 'Active' },
                        { name: 'Mike Davis', email: 'mike.davis@company.com', role: 'User', department: 'Sales', status: 'Active' },
                        { name: 'Lisa Wilson', email: 'lisa.w@company.com', role: 'User', department: 'Marketing', status: 'Inactive' },
                        { name: 'Tom Brown', email: 'tom.brown@company.com', role: 'Manager', department: 'Operations', status: 'Active' },
                      ].map((user, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px', color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{user.name}</td>
                          <td style={{ padding: '16px', color: '#94A3B8', fontSize: '14px' }}>{user.email}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: user.role === 'Admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'Manager' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              color: user.role === 'Admin' ? '#EF4444' : user.role === 'Manager' ? '#F59E0B' : '#3B82F6'
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
            maxWidth: '500px',
            width: '90%',
            border: '1px solid #1E293B'
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
    </div>
  )
}
