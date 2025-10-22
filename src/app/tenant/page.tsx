'use client'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { useState } from 'react'

export default function TenantPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

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
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <NeoxLogo width="64px" height="64px" />
        </div>

        {/* Navigation */}
        <nav style={{ padding: '20px 0', flex: 1 }}>
          {[
            { icon: '◈', label: 'Dashboard', action: () => setActiveSection(null) },
            { icon: '◐', label: 'Analytics', action: () => setActiveSection('analytics') },
            { icon: '◎', label: 'Users', action: () => setActiveSection('users') },
            { icon: '◫', label: 'Invitations', action: () => setActiveSection('invitations') },
            { icon: '◧', label: 'Parking', action: () => setActiveSection('parking') },
            { icon: '◨', label: 'Templates', action: () => setActiveSection('templates') },
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
                      backgroundColor: '#3B82F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
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
                      backgroundColor: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
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
                      backgroundColor: '#F59E0B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
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
                <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>User Management</h2>
                <button style={{
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
                <p style={{ color: '#64748B', fontSize: '16px', textAlign: 'center', padding: '40px' }}>
                  User management interface with table, filters, and CRUD operations coming soon...
                </p>
              </div>
            </div>
          )}

          {/* Invitation Management Section */}
          {activeSection === 'invitations' && (
            <div style={{
              backgroundColor: '#162032',
              borderRadius: '12px',
              border: '1px solid #1E293B',
              padding: '24px'
            }}>
              <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Invitation Management</h2>
              <p style={{ color: '#64748B', fontSize: '16px', textAlign: 'center', padding: '40px' }}>
                Invitation management interface with forms and tracking coming soon...
              </p>
            </div>
          )}

          {/* Parking Management Section */}
          {activeSection === 'parking' && (
            <div style={{
              backgroundColor: '#162032',
              borderRadius: '12px',
              border: '1px solid #1E293B',
              padding: '24px'
            }}>
              <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Parking Management</h2>
              <p style={{ color: '#64748B', fontSize: '16px', textAlign: 'center', padding: '40px' }}>
                Parking space management interface with allocation and scheduling coming soon...
              </p>
            </div>
          )}

          {/* Template Management Section */}
          {activeSection === 'templates' && (
            <div style={{
              backgroundColor: '#162032',
              borderRadius: '12px',
              border: '1px solid #1E293B',
              padding: '24px'
            }}>
              <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Template Management</h2>
              <p style={{ color: '#64748B', fontSize: '16px', textAlign: 'center', padding: '40px' }}>
                Email and document template management interface coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
