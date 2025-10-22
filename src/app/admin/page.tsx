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
              <option value="techflow">TechFlow Industries</option>
              <option value="global">Global Solutions Ltd</option>
              <option value="innovation">Innovation Labs</option>
              <option value="digital">Digital Dynamics</option>
            </select>
          </div>
        )}

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

          {/* Modules Section */}
          {activeSection === 'modules' && selectedTenant !== 'all' && (
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
                ].map((module, index) => {
                  const isEnabled = moduleStates[module];
                  return (
                    <div key={index} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      border: '1px solid #475569',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4 style={{ color: '#F1F5F9', margin: '0 0 4px 0', fontSize: '16px' }}>{module}</h4>
                        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>Module configuration and settings</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          backgroundColor: '#3B82F6',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>Configure</button>
                        <button 
                          onClick={() => {
                            setModuleStates(prev => ({
                              ...prev,
                              [module]: !prev[module]
                            }));
                          }}
                          style={{
                            backgroundColor: isEnabled ? '#EF4444' : '#10B981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}>
                          {isEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Invitations</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B', marginBottom: '8px' }}>2,186</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>↑ 15.7% from last month</div>
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

          {/* Tenants List */}
          {activeSection === 'tenantsList' && (
            <div>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
                <input type="search" placeholder="Search tenants..." style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'rgba(51, 78, 104, 0.5)',
                  border: '1px solid rgba(75, 101, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#d7bb91',
                  fontSize: '14px'
                }} />
                <button onClick={() => { setSelectedTenant('all'); setActiveSection('tenantCreate'); }} style={{
                  backgroundColor: 'rgba(75, 101, 129, 0.8)',
                  color: '#d7bb91',
                  border: '1px solid rgba(75, 101, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}>+ Create Tenant</button>
              </div>
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                {[
                  { name: 'Acme Corporation', status: 'Active', users: 245, contact: 'John Doe', email: 'john@acme.com' },
                  { name: 'TechFlow Industries', status: 'Active', users: 128, contact: 'Jane Smith', email: 'jane@techflow.com' },
                  { name: 'Global Solutions Ltd', status: 'Pending', users: 0, contact: 'Bob Johnson', email: 'bob@global.com' },
                  { name: 'Innovation Labs', status: 'Active', users: 87, contact: 'Alice Brown', email: 'alice@innovation.com' },
                ].map((tenant, idx) => (
                  <div key={idx} style={{
                    padding: '16px',
                    backgroundColor: 'rgba(51, 78, 104, 0.3)',
                    borderRadius: '8px',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ color: '#d7bb91', margin: '0 0 4px 0', fontSize: '16px' }}>{tenant.name}</h4>
                      <p style={{ color: '#d7bb91', opacity: 0.7, margin: '0 0 4px 0', fontSize: '13px' }}>{tenant.contact} • {tenant.email}</p>
                      <p style={{ color: '#64748B', margin: 0, fontSize: '13px' }}>{tenant.users} users • {tenant.status}</p>
                    </div>
                    <button onClick={() => { setSelectedTenant('all'); setActiveSection('tenantEdit'); }} style={{
                      backgroundColor: 'rgba(75, 101, 129, 0.6)',
                      color: '#d7bb91',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tenant Edit/Create */}
          {(activeSection === 'tenantEdit' || activeSection === 'tenantCreate') && (
            <div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Company Data */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Company Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company Name *</label>
                      <input type="text" placeholder="Enter company name" style={{
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
                        <input type="email" placeholder="email@company.com" style={{
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
                        <input type="tel" placeholder="+1 (555) 000-0000" style={{
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
                      <input type="checkbox" defaultChecked /> User Management
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" defaultChecked /> Invitation System
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" defaultChecked /> Parking Management
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" /> Templates
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
    </div>
  )
}
