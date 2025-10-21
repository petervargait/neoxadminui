import Link from 'next/link'
import NeoxLogo from '../components/NeoxLogo'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B1426',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navigation */}
      <div style={{
        height: '70px',
        backgroundColor: '#162032',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NeoxLogo width="120px" height="32px" />
          <div style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600' }}>NEOX</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: '#64748B', fontSize: '14px' }}>Production Ready</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 32px' }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '24px',
              lineHeight: '1.1'
            }}>
              Multi-Tenant Admin Platform
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#64748B',
              maxWidth: '800px',
              margin: '0 auto 48px auto',
              lineHeight: '1.6'
            }}>
              A production-ready administrative web application with comprehensive role-based access control, white-labeling, and OWASP security compliance.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '64px'
          }}>
            <div style={{
              padding: '32px',
              borderRadius: '12px',
              backgroundColor: '#162032',
              border: '1px solid #1E293B',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <span style={{ fontSize: '32px' }}>🏢</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#F1F5F9', marginBottom: '12px' }}>Multi-Tenant</h3>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5' }}>Complete tenant isolation with custom branding and configurations</p>
            </div>

            <div style={{
              padding: '32px',
              borderRadius: '12px',
              backgroundColor: '#162032',
              border: '1px solid #1E293B',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <span style={{ fontSize: '32px' }}>🔒</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#F1F5F9', marginBottom: '12px' }}>RBAC Security</h3>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5' }}>Granular role-based permissions with audit logging and OWASP compliance</p>
            </div>

            <div style={{
              padding: '32px',
              borderRadius: '12px',
              backgroundColor: '#162032',
              border: '1px solid #1E293B',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <span style={{ fontSize: '32px' }}>🎨</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#F1F5F9', marginBottom: '12px' }}>White-Label</h3>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5' }}>Customize branding, themes, and email templates for each tenant</p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
            <Link
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                backgroundColor: '#3B82F6',
                color: '#F1F5F9',
                fontWeight: '600',
                fontSize: '18px',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '2px solid #3B82F6',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB'
                e.currentTarget.style.borderColor = '#2563EB'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3B82F6'
                e.currentTarget.style.borderColor = '#3B82F6'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '20px' }}>⚙️</span>
              Global Admin
            </Link>
            <Link
              href="/tenant"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                backgroundColor: 'transparent',
                color: '#F1F5F9',
                fontWeight: '600',
                fontSize: '18px',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '2px solid #64748B',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#64748B'
                e.currentTarget.style.color = '#F1F5F9'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#F1F5F9'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '20px' }}>👤</span>
              Tenant Admin
            </Link>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '64px',
            paddingTop: '32px',
            borderTop: '1px solid #1E293B',
            textAlign: 'center'
          }}>
            <p style={{ color: '#64748B', fontSize: '14px' }}>
              Built with Next.js 14, TypeScript, Prisma, and NextAuth.js
            </p>
            <p style={{ color: '#64748B', fontSize: '12px', marginTop: '8px' }}>
              Production-ready • OWASP Compliant • Multi-tenant Architecture
            </p>
          </div>
      </div>
    </div>
  )
}
