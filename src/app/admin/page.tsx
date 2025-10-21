import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'

export default function AdminPage() {
  const handleCreateTenant = () => {
    alert('Create Tenant clicked - This would open a tenant creation form')
  }

  const handleManageModules = () => {
    alert('Manage Modules clicked - This would show module management interface')
  }

  const handleViewAuditLogs = () => {
    alert('View Audit Logs clicked - This would show system audit logs')
  }

  const handleSystemSettings = () => {
    alert('System Settings clicked - This would open system configuration')
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
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(75, 101, 129, 0.9)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(51, 78, 104, 0.8)'}
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
    </div>
  )
}
