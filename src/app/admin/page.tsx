'use client'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { useState } from 'react'

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

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
      minHeight: '100vh', 
      padding: '32px', 
      background: 'linear-gradient(135deg, #08122e 0%, #243b53 100%)' 
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '24px' 
          }}>
            <NeoxLogo width="300px" height="60px" />
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '16px', color: '#d7bb91' }}>
            Global Admin Dashboard
          </h1>
          <p style={{ 
            maxWidth: '672px', 
            margin: '0 auto 32px auto', 
            color: '#d7bb91', 
            opacity: 0.8 
          }}>
            Welcome to the global administration panel. Monitor and manage all tenants, users, and system operations.
          </p>
        </div>

        {/* Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 55, 90, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              backgroundColor: 'rgba(215, 187, 145, 0.2)'
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#d7bb91' }}>Tenants</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d7bb91', opacity: 0.7 }}>Manage organizations</p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d7bb91' }}>0</div>
          </div>

          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 55, 90, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              backgroundColor: 'rgba(215, 187, 145, 0.2)'
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#d7bb91' }}>Global Users</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d7bb91', opacity: 0.7 }}>All system users</p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d7bb91' }}>0</div>
          </div>

          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 55, 90, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              backgroundColor: 'rgba(215, 187, 145, 0.2)'
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#d7bb91' }}>System Health</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d7bb91', opacity: 0.7 }}>Monitor performance</p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>Healthy</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: 'rgba(30, 55, 90, 0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(75, 101, 129, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#d7bb91' }}>Quick Actions</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            <button 
              onClick={handleCreateTenant} 
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(75, 101, 129, 0.9)'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(51, 78, 104, 0.8)'}
              style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>Create Tenant</button>
            <button onClick={handleManageModules} style={{
              backgroundColor: 'rgba(51, 78, 104, 0.8)',
              color: '#d7bb91',
              border: '1px solid rgba(75, 101, 129, 0.3)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px'
            }}>Manage Modules</button>
            <button onClick={handleViewAuditLogs} style={{
              backgroundColor: 'rgba(51, 78, 104, 0.8)',
              color: '#d7bb91',
              border: '1px solid rgba(75, 101, 129, 0.3)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px'
            }}>View Audit Logs</button>
            <button onClick={handleSystemSettings} style={{
              backgroundColor: 'rgba(51, 78, 104, 0.8)',
              color: '#d7bb91',
              border: '1px solid rgba(75, 101, 129, 0.3)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px'
            }}>System Settings</button>
            <button 
              onClick={handleBulkUpload}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(75, 101, 129, 0.9)'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(51, 78, 104, 0.8)'}
              style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              fontSize: '14px'
            }}>Bulk Upload Users</button>
            <button 
              onClick={handleWhiteLabel}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(75, 101, 129, 0.9)'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(51, 78, 104, 0.8)'}
              style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>White Label Settings</button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px', color: '#d7bb91', opacity: 0.6 }}>
            ⚠️ Demo page - Database connection required
          </p>
          <Link href="/" style={{ 
            fontSize: '14px', 
            textDecoration: 'underline', 
            color: '#d7bb91',
            transition: 'opacity 0.2s'
          }}>
            ← Back to Home
          </Link>
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
          backgroundColor: 'rgba(8, 18, 46, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(30, 55, 90, 0.95)',
            border: '1px solid rgba(75, 101, 129, 0.5)',
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
