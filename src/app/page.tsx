'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NeoxLogo from '../components/NeoxLogo'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')

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
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 32px 40px 32px', position: 'relative' }}>
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
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Hero Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <NeoxLogo width="960px" height="256px" />
            </div>
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
    </div>
  )
}
