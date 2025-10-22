'use client'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { useState } from 'react'

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<string>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<string>('all')
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<{name: string; email: string; role: string; department: string; status: string} | null>(null)
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({
    'User Management': true,
    'Visitor Management': true,
    'Parking': false,
    'Emergency': true,
    'Map': true,
    'Restaurant': false,
    'Ticketing': true,
    'Service Hub': false,
    'Lockers': false,
    'News': true,
    'AI Assistant': false,
    'Space Management': true,
    'Private Delivery': false,
    'Authentication': true,
    'Reporting': true
  })

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

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh', 
      backgroundColor: '#0B1426',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '150px' : '280px',
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

        {/* Tenant Selector */}
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
              <option value="techflow">TechFlow Industries</option>
              <option value="global">Global Solutions Ltd</option>
              <option value="innovation">Innovation Labs</option>
              <option value="digital">Digital Dynamics</option>
            </select>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ padding: '20px 0', flex: 1 }}>
          {[
            { icon: '◈', label: 'Dashboard', action: () => setActiveSection('dashboard'), enabled: true },
            { icon: '◎', label: 'Tenants', action: () => setActiveSection('tenantsList'), enabled: true },
            { icon: '👥', label: 'Users', action: () => setActiveSection('users'), enabled: selectedTenant !== 'all' },
            { icon: '◧', label: 'Modules', action: () => setActiveSection('modules'), enabled: selectedTenant !== 'all' },
            { icon: '◨', label: 'Bulk Upload', action: () => setActiveSection('bulkUpload'), enabled: selectedTenant !== 'all' },
            { icon: '◆', label: 'White Label', action: () => setActiveSection('whiteLabel'), enabled: selectedTenant !== 'all' },
            { icon: '◫', label: 'Audit Logs', action: () => setActiveSection('auditLogs'), enabled: true },
            { icon: '◐', label: 'Analytics', action: () => setActiveSection('analytics'), enabled: true },
            { icon: '◦', label: 'System Settings', action: () => setActiveSection('systemSettings'), enabled: true },
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
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
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
              {activeSection === 'dashboard' && 'Global Admin Dashboard'}
              {activeSection === 'tenantsList' && 'Tenants Management'}
              {activeSection === 'tenantEdit' && 'Edit Tenant'}
              {activeSection === 'tenantCreate' && 'Create New Tenant'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'modules' && 'Manage Modules'}
              {activeSection === 'bulkUpload' && 'Bulk Upload Users'}
              {activeSection === 'whiteLabel' && 'White Label Settings'}
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
          {/* Dashboard View - Default */}
          {activeSection === 'dashboard' && (
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

          {/* User Management Section - Continues in next part... */}
        </div>
      </div>
    </div>
  )
}
