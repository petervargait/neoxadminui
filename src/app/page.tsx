'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NeoxLogo from '../components/NeoxLogo'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [showTenantModal, setShowTenantModal] = useState(false)

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

  if (!isAuthenticated) {
    return null
  }
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#08122E',
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
          {/* Logo moved to center hero section */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
              backgroundColor: '#3B82F6',
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

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 32px 40px 32px', position: 'relative' }}>
        {/* Background Design Element */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/NEOXOfficeAI.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0
        }} />
        <div style={{ maxWidth: '1200px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Hero Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <NeoxLogo width="640px" height="170px" />
            </div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '0px',
              lineHeight: '1.2'
            }}>
              NEOX Infinity Admin Platform
            </h1>
          </div>

          {/* Main Admin Panels */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            maxWidth: '1200px',
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
                backgroundColor: 'rgba(215, 187, 145, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                boxShadow: '0 0 20px rgba(215, 187, 145, 0.5), 0 0 40px rgba(215, 187, 145, 0.3)'
              }}>
                <span style={{ fontSize: '32px', color: '#D7BB91' }}>◈</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#F1F5F9', marginBottom: '12px' }}>Global Admin</h2>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5' }}>Manage tenants, users, and system-wide settings</p>
            </Link>

            <div
              onClick={() => setShowTenantModal(true)}
              style={{
                display: 'block',
                padding: '40px 32px',
                backgroundColor: '#162032',
                border: '1px solid #1E293B',
                borderRadius: '12px',
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
                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                boxShadow: '0 0 20px rgba(96, 165, 250, 0.5), 0 0 40px rgba(96, 165, 250, 0.3)'
              }}>
                <span style={{ fontSize: '32px', color: '#60A5FA' }}>◎</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#F1F5F9', marginBottom: '12px' }}>Tenant Admin</h2>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5' }}>Manage your organization&apos;s users and settings</p>
            </div>

            <Link
              href="/api-docs"
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
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                boxShadow: '0 0 20px rgba(148, 163, 184, 0.5), 0 0 40px rgba(148, 163, 184, 0.3)'
              }}>
                <span style={{ fontSize: '32px', color: '#94A3B8' }}>▨</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#F1F5F9', marginBottom: '12px' }}>API Documentation</h2>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.5' }}>Access comprehensive API docs and integration guides</p>
            </Link>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '64px',
            paddingTop: '32px',
            borderTop: '1px solid #1E293B',
            textAlign: 'center'
          }}>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
              A product by{' '}
              <a 
                href="https://neox.team" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#94A3B8', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
              >
                NEOX Smart Solution Ltd
              </a>
            </p>
            <p style={{ color: '#64748B', fontSize: '12px', marginTop: '8px' }}>
              © {new Date().getFullYear()} NEOX. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Tenant Selection Modal */}
      {showTenantModal && (
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
        }} onClick={() => setShowTenantModal(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid #1E293B'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
              Select Tenant
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
              Choose an organization to manage
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflow: 'auto' }}>
              {[
                { id: 'acme', name: 'Acme Corporation', logo: '🏢', users: 245 },
                { id: 'techflow', name: 'TechFlow Industries', logo: '🚀', users: 128 },
                { id: 'global', name: 'Global Solutions Ltd', logo: '🌍', users: 87 },
                { id: 'innovation', name: 'Innovation Labs', logo: '🔬', users: 156 },
                { id: 'digital', name: 'Digital Dynamics', logo: '⚡', users: 93 },
              ].map((tenant) => (
                <div
                  key={tenant.id}
                  onClick={() => {
                    sessionStorage.setItem('selectedTenant', tenant.id);
                    sessionStorage.setItem('selectedTenantName', tenant.name);
                    router.push('/tenant');
                  }}
                  style={{
                    padding: '16px',
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#334155'
                    e.currentTarget.style.borderColor = '#60A5FA'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E293B'
                    e.currentTarget.style.borderColor = '#334155'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: '#162032',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {tenant.logo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      {tenant.name}
                    </div>
                    <div style={{ color: '#64748B', fontSize: '13px' }}>
                      {tenant.users} users
                    </div>
                  </div>
                  <div style={{ color: '#60A5FA', fontSize: '18px' }}>→</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowTenantModal(false)}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F1F5F9',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
