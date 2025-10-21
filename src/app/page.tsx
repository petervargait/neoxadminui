'use client'

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
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          {/* Hero Section */}
          <div style={{ marginBottom: '48px' }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              NEOX Infinity Admin Platform
            </h1>
          </div>

          {/* Main Admin Panels */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <Link
              href="/admin"
              style={{
                display: 'block',
                padding: '40px 32px',
                backgroundColor: '#162032',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 25px -3px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#162032'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <span style={{ fontSize: '32px' }}>⚙️</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#F1F5F9', marginBottom: '12px' }}>Global Admin</h2>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5' }}>Manage tenants, users, and system-wide settings</p>
            </Link>

            <Link
              href="/tenant"
              style={{
                display: 'block',
                padding: '40px 32px',
                backgroundColor: '#162032',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 25px -3px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#162032'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <span style={{ fontSize: '32px' }}>👤</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#F1F5F9', marginBottom: '12px' }}>Tenant Admin</h2>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5' }}>Manage your organization's users and settings</p>
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
    </div>
  )
}
