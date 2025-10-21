'use client'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { useState } from 'react'

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleCreateTenant = () => {
    setActiveSection('createTenant')
  }

  const handleManageModules = () => {
    setActiveSection('manageModules')
  }

  const handleViewAuditLogs = () => {
    setActiveSection('auditLogs')
  }

  const handleSystemSettings = () => {
    setActiveSection('systemSettings')
  }

  const handleBulkUpload = () => {
    setActiveSection('bulkUpload')
  }

  const handleWhiteLabel = () => {
    setActiveSection('whiteLabel')
  }

  const closeSection = () => {
    setActiveSection(null)
  }

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        console.log('CSV uploaded:', csv)
        // Here you would parse and process the CSV
        alert(`CSV file "${file.name}" uploaded successfully! Processing ${csv.split('\n').length - 1} users.`)
      }
      reader.readAsText(file)
    } else {
      alert('Please select a valid CSV file')
    }
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
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <NeoxLogo width={sidebarCollapsed ? '32px' : '120px'} height="32px" />
          {!sidebarCollapsed && (
            <div style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600' }}>NEOX</div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '20px 0', flex: 1 }}>
          {[
            { icon: '👥', label: 'Tenants', action: () => setActiveSection('tenantsList') },
            { icon: '🏢', label: 'Organizations', action: () => setActiveSection('organizations') },
            { icon: '⚙️', label: 'System Settings', action: handleSystemSettings },
            { icon: '📊', label: 'Analytics', action: () => setActiveSection('analytics') },
            { icon: '🔧', label: 'Modules', action: handleManageModules },
            { icon: '📁', label: 'Audit Logs', action: handleViewAuditLogs },
            { icon: '📤', label: 'Bulk Upload', action: handleBulkUpload },
            { icon: '🎨', label: 'White Label', action: handleWhiteLabel },
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
                transition: 'all 0.2s',
                ':hover': {
                  backgroundColor: '#1E293B',
                  color: '#F1F5F9'
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1E293B'
                e.target.style.color = '#F1F5F9'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#94A3B8'
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

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
              Global Admin Dashboard
            </h1>
            <p style={{ 
              color: '#64748B', 
              fontSize: '14px', 
              margin: '4px 0 0 0' 
            }}>
              Manage tenants, users, and system operations
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ 
              color: '#64748B', 
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
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
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>🏢</span>
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
                  backgroundColor: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>👥</span>
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
                  backgroundColor: '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>⚙️</span>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981' }}>Online</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>System Status</h3>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>All services operational</p>
            </div>
          </div>

          {/* Tenants Table */}
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
                onClick={handleCreateTenant}
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
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
              >
                + Create Tenant
              </button>
            </div>
            
            {/* Table */}
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
                    { name: 'Acme Corporation', status: 'Active', users: 245, plan: 'Enterprise', created: '2024-01-15', logo: '🏢' },
                    { name: 'TechFlow Industries', status: 'Active', users: 128, plan: 'Professional', created: '2024-01-10', logo: '🚀' },
                    { name: 'Global Solutions Ltd', status: 'Pending', users: 0, plan: 'Starter', created: '2024-01-08', logo: '🌍' },
                    { name: 'Innovation Labs', status: 'Active', users: 87, plan: 'Professional', created: '2024-01-05', logo: '🔬' },
                    { name: 'Digital Dynamics', status: 'Suspended', users: 156, plan: 'Enterprise', created: '2024-01-03', logo: '⚡' },
                  ].map((tenant, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1E293B' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: '#1E293B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
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
                        <button style={{
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

        </div>
      </div>

      {/* Modal Overlays for Different Sections */}
      {activeSection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(11, 20, 38, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#162032',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d7bb91', margin: 0 }}>
                {activeSection === 'createTenant' && 'Create New Tenant'}
                {activeSection === 'manageModules' && 'Manage Modules'}
                {activeSection === 'auditLogs' && 'System Audit Logs'}
                {activeSection === 'systemSettings' && 'System Settings'}
                {activeSection === 'bulkUpload' && 'Bulk Upload Users'}
                {activeSection === 'whiteLabel' && 'White Label Settings'}
              </h2>
              <button onClick={closeSection} style={{
                background: 'none',
                border: '1px solid rgba(215, 187, 145, 0.5)',
                borderRadius: '8px',
                color: '#d7bb91',
                fontSize: '20px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>×</button>
            </div>

            {activeSection === 'createTenant' && (
              <div>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Tenant Name</label>
                    <input type="text" placeholder="Enter tenant name" style={{
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
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Admin Email</label>
                    <input type="email" placeholder="admin@company.com" style={{
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
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Features</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                        <input type="checkbox" /> User Management
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                        <input type="checkbox" /> Invitation System
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                        <input type="checkbox" /> Parking Management
                      </label>
                    </div>
                  </div>
                  <button type="submit" style={{
                    backgroundColor: 'rgba(75, 101, 129, 0.8)',
                    color: '#d7bb91',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}>Create Tenant</button>
                </form>
              </div>
            )}

            {activeSection === 'manageModules' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  ].map((module, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      backgroundColor: 'rgba(51, 78, 104, 0.3)',
                      borderRadius: '8px',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4 style={{ color: '#d7bb91', margin: '0 0 4px 0', fontSize: '16px' }}>{module}</h4>
                        <p style={{ color: '#d7bb91', opacity: 0.7, margin: 0, fontSize: '14px' }}>Module configuration and settings</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          backgroundColor: 'rgba(75, 101, 129, 0.6)',
                          color: '#d7bb91',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>Configure</button>
                        <button style={{
                          backgroundColor: 'rgba(220, 38, 38, 0.6)',
                          color: '#fff',
                          border: '1px solid rgba(220, 38, 38, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>Disable</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'auditLogs' && (
              <div>
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
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {[
                    { time: '2025-10-21 13:05:23', user: 'admin@system', action: 'Created tenant "Acme Corp"', status: 'Success' },
                    { time: '2025-10-21 12:58:15', user: 'admin@system', action: 'Updated system configuration', status: 'Success' },
                    { time: '2025-10-21 12:45:02', user: 'john@tenant1', action: 'Failed login attempt', status: 'Failed' },
                    { time: '2025-10-21 12:30:18', user: 'admin@system', action: 'Enabled parking module', status: 'Success' },
                    { time: '2025-10-21 12:15:44', user: 'jane@tenant2', action: 'Sent invitation to visitor', status: 'Success' }
                  ].map((log, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.3)',
                      borderRadius: '8px',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500' }}>{log.action}</div>
                          <div style={{ color: '#d7bb91', opacity: 0.7, fontSize: '12px' }}>{log.user} - {log.time}</div>
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
                  ))}
                </div>
              </div>
            )}

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

            {activeSection === 'bulkUpload' && (
              <div>
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <h3 style={{ color: '#3b82f6', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>ℹ️</span> CSV Format Requirements
                  </h3>
                  <p style={{ color: '#d7bb91', fontSize: '14px', margin: '0 0 12px 0' }}>
                    Your CSV file should include the following columns (in order):
                  </p>
                  <div style={{ fontFamily: 'monospace', backgroundColor: 'rgba(51, 78, 104, 0.5)', padding: '12px', borderRadius: '6px', color: '#d7bb91', fontSize: '12px' }}>
                    name,email,role,department,tenant_id
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
                      const csvContent = "name,email,role,department,tenant_id\nJohn Smith,john@company.com,user,IT,tenant1\nJane Doe,jane@company.com,admin,HR,tenant1\nBob Johnson,bob@company.com,manager,Sales,tenant2"
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
                  <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>Upload CSV File</label>
                  <div style={{ 
                    border: '2px dashed rgba(75, 101, 129, 0.5)', 
                    borderRadius: '12px', 
                    padding: '32px', 
                    textAlign: 'center',
                    backgroundColor: 'rgba(51, 78, 104, 0.1)'
                  }}>
                    <input 
                      type="file" 
                      accept=".csv"
                      onChange={handleCSVUpload}
                      style={{ display: 'none' }}
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" style={{
                      backgroundColor: 'rgba(75, 101, 129, 0.8)',
                      color: '#d7bb91',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'inline-block'
                    }}>Choose CSV File</label>
                    <p style={{ color: '#d7bb91', opacity: 0.7, marginTop: '12px', fontSize: '14px' }}>
                      Select a CSV file to upload multiple users at once
                    </p>
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                  <h3 style={{ color: '#eab308', fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>⚠️</span> Upload Process
                  </h3>
                  <ul style={{ color: '#d7bb91', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                    <li>Users will be validated before creation</li>
                    <li>Duplicate emails will be skipped</li>
                    <li>Invalid entries will be reported</li>
                    <li>Email invitations will be sent automatically</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'whiteLabel' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Branding Section */}
                  <div>
                    <h3 style={{ color: '#d7bb91', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Brand Identity</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
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

                  {/* Typography Section */}
                  <div>
                    <h3 style={{ color: '#d7bb91', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Typography</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Primary Font</label>
                        <select style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }}>
                          <option value="Inter">Inter (Default)</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                          <option value="Poppins">Poppins</option>
                          <option value="Montserrat">Montserrat</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Font Size Scale</label>
                        <select style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }}>
                          <option value="small">Small</option>
                          <option value="medium" selected>Medium (Default)</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Email Templates Section */}
                  <div>
                    <h3 style={{ color: '#d7bb91', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Email Templates</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visitor Invitation Email Subject</label>
                        <input type="text" defaultValue="You're invited to visit {{company_name}}" style={{
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
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visitor Invitation Email Body</label>
                        <textarea defaultValue="Hello {{visitor_name}},\n\nYou have been invited to visit {{company_name}} on {{visit_date}} at {{visit_time}}.\n\nPurpose: {{purpose}}\nHost: {{host_name}}\n\nPlease confirm your visit by clicking the link below:\n{{confirmation_link}}\n\nBest regards,\n{{company_name}} Team" style={{
                          width: '100%',
                          minHeight: '150px',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px',
                          resize: 'vertical',
                          fontFamily: 'monospace'
                        }} />
                      </div>
                      <div style={{ padding: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                        <h4 style={{ color: '#3b82f6', fontSize: '14px', margin: '0 0 8px 0' }}>Available Variables:</h4>
                        <div style={{ color: '#d7bb91', fontSize: '12px', fontFamily: 'monospace', opacity: 0.8 }}>
                          {'{'}{'{'}{'}'}visitor_name{'}'}{'}'}  {'{'}{'{'}{'}'}company_name{'}'}{'}'}  {'{'}{'{'}{'}'}visit_date{'}'}{'}'}  {'{'}{'{'}{'}'}visit_time{'}'}{'}'}  {'{'}{'{'}{'}'}purpose{'}'}{'}'}  {'{'}{'{'}{'}'}host_name{'}'}{'}'}  {'{'}{'{'}{'}'}confirmation_link{'}'}{'}'}  
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div>
                    <h3 style={{ color: '#d7bb91', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Preview</h3>
                    <div style={{
                      padding: '20px',
                      backgroundColor: 'rgba(51, 78, 104, 0.2)',
                      borderRadius: '12px',
                      border: '1px solid rgba(75, 101, 129, 0.3)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#d7bb91',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#08122e',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}>LOGO</div>
                        <div style={{ color: '#d7bb91', fontSize: '18px', fontWeight: 'bold' }}>Your Company Name</div>
                      </div>
                      <p style={{ color: '#d7bb91', opacity: 0.7, fontSize: '14px' }}>This is how your brand will appear to visitors and users throughout the platform.</p>
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
          </div>
        </div>
      )}
    </div>
  )
}
