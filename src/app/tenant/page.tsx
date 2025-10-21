import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'

export default function TenantPage() {
  const handleInviteUser = () => {
    alert('Invite User clicked - This would open user invitation form')
  }

  const handleSendInvitation = () => {
    alert('Send Invitation clicked - This would show invitation management')
  }

  const handleManageTemplates = () => {
    alert('Manage Templates clicked - This would show template management')
  }

  const handleViewReports = () => {
    alert('View Reports clicked - This would show tenant reports')
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
            Tenant Admin Dashboard
          </h1>
          <p style={{ 
            maxWidth: '672px', 
            margin: '0 auto 32px auto', 
            color: '#d7bb91', 
            opacity: 0.8 
          }}>
            Welcome to your tenant administration panel. Manage users, invitations, and resources.
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#d7bb91' }}>Users</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d7bb91', opacity: 0.7 }}>Manage team members</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#d7bb91' }}>Invitations</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d7bb91', opacity: 0.7 }}>Visitor management</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#d7bb91' }}>Parking</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d7bb91', opacity: 0.7 }}>Space management</p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>Available</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
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
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#d7bb91' }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d7bb91' }}></div>
                <span style={{ color: '#d7bb91', opacity: 0.7 }}>No recent activity</span>
              </div>
            </div>
          </div>

          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 55, 90, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#d7bb91' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={handleInviteUser} style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>Invite User</button>
              <button onClick={handleSendInvitation} style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>Send Invitation</button>
              <button onClick={handleManageTemplates} style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>Manage Templates</button>
              <button onClick={handleViewReports} style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>View Reports</button>
            </div>
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
