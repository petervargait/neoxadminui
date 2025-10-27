'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { PersonRegular, PeopleRegular, VehicleCarRegular, DocumentRegular, BookRegular } from '@fluentui/react-icons'

export default function APIDocsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [activeAPI, setActiveAPI] = useState<string>('overview')

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

  const apiCategories = [
    { id: 'overview', name: 'Overview', icon: 'book', isFluentIcon: true },
    { id: 'authentication', name: 'Authentication', icon: '🔐', isFluentIcon: false },
    { id: 'user-management', name: 'User Management', icon: 'people', isFluentIcon: true },
    { id: 'tenant-management', name: 'Tenant Management', icon: '🏢', isFluentIcon: false },
    { id: 'visitor-management', name: 'Visitor Management', icon: 'person', isFluentIcon: true },
    { id: 'parking', name: 'Parking Management', icon: 'vehicle', isFluentIcon: true },
    { id: 'digital-badge', name: 'Digital Badge Management', icon: 'document', isFluentIcon: true },
    { id: 'modules-profiles', name: 'Modules & Profiles', icon: '⚙️', isFluentIcon: false },
    { id: 'tickets', name: 'Ticketing System', icon: '🎫', isFluentIcon: false },
    { id: 'notifications', name: 'Notifications', icon: '🔔', isFluentIcon: false },
    { id: 'emergency', name: 'Emergency Management', icon: '🚨', isFluentIcon: false },
    { id: 'restaurant', name: 'Restaurant & Catering', icon: '🍽️', isFluentIcon: false },
    { id: 'space-management', name: 'Space Management', icon: '📍', isFluentIcon: false },
    { id: 'lockers', name: 'Locker Management', icon: '🔒', isFluentIcon: false },
    { id: 'analytics', name: 'Analytics & Reporting', icon: '📊', isFluentIcon: false },
    { id: 'ai-assistant', name: 'AI Assistant', icon: '🤖', isFluentIcon: false },
  ]

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh', 
      backgroundColor: '#0B1426',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#162032',
        borderRight: '1px solid #1E293B',
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

        <nav style={{ padding: '20px 0', flex: 1 }}>
          {apiCategories.map((category) => (
            <div 
              key={category.id}
              onClick={() => setActiveAPI(category.id)}
              style={{
                padding: '12px 20px',
                margin: '4px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: activeAPI === category.id ? '#1E293B' : 'transparent',
                color: activeAPI === category.id ? '#F1F5F9' : '#94A3B8',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeAPI !== category.id) {
                  e.currentTarget.style.backgroundColor = '#1E293B'
                  e.currentTarget.style.color = '#F1F5F9'
                }
              }}
              onMouseLeave={(e) => {
                if (activeAPI !== category.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#94A3B8'
                }
              }}
            >
              {category.isFluentIcon ? (
                category.icon === 'book' ? (
                  <BookRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : category.icon === 'people' ? (
                  <PeopleRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : category.icon === 'person' ? (
                  <PersonRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : category.icon === 'vehicle' ? (
                  <VehicleCarRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : category.icon === 'document' ? (
                  <DocumentRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : (
                  <span style={{ fontSize: '18px' }}>{category.icon}</span>
                )
              ) : (
                <span style={{ fontSize: '18px' }}>{category.icon}</span>
              )}
              <span>{category.name}</span>
            </div>
          ))}
        </nav>

        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          color: '#64748B',
          textDecoration: 'none',
          fontSize: '14px',
          borderTop: '1px solid #1E293B',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1E293B'
          e.currentTarget.style.color = '#F1F5F9'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#64748B'
        }}>
          <span style={{ fontSize: '18px' }}>◄</span>
          <span>Back to Home</span>
        </Link>
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
              NEOX API Documentation
            </h1>
            <p style={{ 
              color: '#64748B', 
              fontSize: '14px', 
              margin: '4px 0 0 0' 
            }}>
              OpenAPI 3.0 compliant REST API reference
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 12px',
              height: '40px',
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
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
                padding: '0 16px',
                height: '40px',
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

        {/* API Documentation Content */}
        <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          
          {/* Overview Section */}
          {activeAPI === 'overview' && (
            <div>
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                padding: '32px',
                marginBottom: '24px'
              }}>
                <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
                  NEOX API v1.0
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
                  RESTful API following OpenAPI 3.0 specification. All endpoints return JSON responses and use standard HTTP methods and status codes.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '32px' }}>
                  <div style={{ padding: '20px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>OpenAPI 3.0</h3>
                    <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Industry standard specification</p>
                  </div>
                  <div style={{ padding: '20px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>OAuth 2.0</h3>
                    <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Secure token-based authentication</p>
                  </div>
                  <div style={{ padding: '20px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Rate Limits</h3>
                    <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>1000 req/hour per API key</p>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                padding: '32px',
                marginBottom: '24px'
              }}>
                <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                  Base URL
                </h3>
                <div style={{ backgroundColor: '#0F1629', padding: '20px', borderRadius: '8px' }}>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>
                    https://api.neox.team/v1
                  </code>
                </div>
              </div>

              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                padding: '32px'
              }}>
                <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                  Authentication
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                  All requests require authentication via Bearer token in the Authorization header:
                </p>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace' }}>
{`Authorization: Bearer YOUR_API_KEY`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Authentication API */}
          {activeAPI === 'authentication' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Authentication API
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                OAuth 2.0 authentication endpoints for secure access
              </p>

              {/* POST /auth/login */}
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/auth/login</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>Authenticate user and receive JWT access token</p>
                
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Request Body</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "email": "user@company.com",
  "password": "SecurePassword123!",
  "remember_me": true
}`}
                  </pre>
                </div>

                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Response 200</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "usr_123456",
    "email": "user@company.com",
    "name": "John Smith",
    "role": "admin"
  }
}`}
                  </pre>
                </div>
              </div>

              {/* POST /auth/refresh */}
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/auth/refresh</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Refresh expired access token using refresh token</p>
              </div>

              {/* POST /auth/logout */}
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/auth/logout</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Invalidate current session and access token</p>
              </div>

              {/* POST /auth/forgot-password */}
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/auth/forgot-password</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Request password reset email</p>
              </div>
            </div>
          )}

          {/* User Management API */}
          {activeAPI === 'user-management' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                User Management API
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                Manage user accounts, roles, and permissions
              </p>

              {/* GET /users */}
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/users</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>List all users with pagination and filtering</p>
                
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Parameters</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <table style={{ width: '100%', color: '#94A3B8', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1E293B' }}>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#64748B' }}>Parameter</th>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#64748B' }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#64748B' }}>Required</th>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#64748B' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{ padding: '8px' }}><code style={{ color: '#D7BB91' }}>page</code></td>
                        <td style={{ padding: '8px' }}>integer</td>
                        <td style={{ padding: '8px' }}>No</td>
                        <td style={{ padding: '8px' }}>Page number (default: 1)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{ padding: '8px' }}><code style={{ color: '#D7BB91' }}>limit</code></td>
                        <td style={{ padding: '8px' }}>integer</td>
                        <td style={{ padding: '8px' }}>No</td>
                        <td style={{ padding: '8px' }}>Results per page (max: 100)</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px' }}><code style={{ color: '#D7BB91' }}>role</code></td>
                        <td style={{ padding: '8px' }}>string</td>
                        <td style={{ padding: '8px' }}>No</td>
                        <td style={{ padding: '8px' }}>Filter by role (admin, manager, user)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Response 200</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "data": [
    {
      "id": "usr_123456",
      "name": "John Smith",
      "email": "john.smith@company.com",
      "role": "admin",
      "department": "IT",
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-10-20T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 147,
    "pages": 3
  }
}`}
                  </pre>
                </div>
              </div>

              {/* POST /users */}
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/users</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>Create a new user account</p>
                
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Request Body</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "name": "Jane Doe",
  "email": "jane.doe@company.com",
  "role": "user",
  "department": "Marketing",
  "send_invite": true
}`}
                  </pre>
                </div>

                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Response 201</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "id": "usr_789012",
  "name": "Jane Doe",
  "email": "jane.doe@company.com",
  "role": "user",
  "status": "pending",
  "created_at": "2025-10-22T20:30:00Z"
}`}
                  </pre>
                </div>
              </div>

              {/* PATCH /users/:id */}
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#F59E0B', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>PATCH</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/users/:id</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Update user information</p>
              </div>
            </div>
          )}

          {/* Visitor Management API */}
          {activeAPI === 'visitor-management' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Visitor Management API
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                Create invitations and manage visitor check-ins
              </p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/visitors/invitations</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>Create visitor invitation with QR code</p>
                
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Request Body</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "visitor": {
    "name": "John Visitor",
    "email": "visitor@example.com",
    "company": "External Corp"
  },
  "host_user_id": "usr_123456",
  "visit_date": "2025-10-25",
  "visit_time": "14:00",
  "purpose": "Business meeting",
  "location": "Building A, Floor 3",
  "notes": "Meeting room 301"
}`}
                  </pre>
                </div>

                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Response 201</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "invitation_id": "inv_789012",
  "qr_code": "https://api.neox.team/qr/inv_789012.png",
  "access_code": "ABCD-1234",
  "status": "sent",
  "expires_at": "2025-10-25T23:59:59Z",
  "created_at": "2025-10-22T10:30:00Z"
}`}
                  </pre>
                </div>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/visitors/check-in</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Check-in a visitor using QR code or access code</p>
              </div>
            </div>
          )}

          {/* Parking Management API */}
          {activeAPI === 'parking' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Parking Management API
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                Manage parking spaces and reservations
              </p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/parking/spaces</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>Get available parking spaces</p>
                
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Parameters</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <table style={{ width: '100%', color: '#94A3B8', fontSize: '13px' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{ padding: '8px', width: '120px' }}><code style={{ color: '#D7BB91' }}>status</code></td>
                        <td style={{ padding: '8px' }}>available | occupied | reserved</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px' }}><code style={{ color: '#D7BB91' }}>location</code></td>
                        <td style={{ padding: '8px' }}>Filter by parking location</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/parking/reservations</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>Reserve parking space</p>
                
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Request Body</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "user_id": "usr_123456",
  "space_id": "space_42",
  "from_date": "2025-10-23",
  "to_date": "2025-10-30",
  "vehicle": {
    "plate": "ABC-123",
    "make": "Tesla",
    "model": "Model 3"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Tenant Management API */}
          {activeAPI === 'tenant-management' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Tenant Management API
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                Multi-tenant organization management
              </p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/tenants</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>List all tenants with pagination</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/tenants</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>Create new tenant organization</p>
                
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Request Body</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "name": "Acme Corporation",
  "domain": "acme.com",
  "contact_email": "admin@acme.com",
  "contact_phone": "+1-555-0123",
  "address": "123 Business St, City, ST 12345",
  "modules": ["user_management", "visitor_management", "parking"],
  "settings": {
    "max_users": 500,
    "enable_sso": true
  }
}`}
                  </pre>
                </div>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#F59E0B', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>PATCH</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/tenants/:id</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Update tenant configuration</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#EF4444', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>DELETE</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/tenants/:id</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Deactivate or delete tenant</p>
              </div>
            </div>
          )}

          {/* Digital Badge Management API */}
          {activeAPI === 'digital-badge' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Digital Badge API
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                Generate and manage digital access badges
              </p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/badges</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>Generate digital badge</p>
                
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Request Body</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "user_id": "usr_123456",
  "badge_type": "employee",
  "access_level": "full",
  "valid_from": "2025-10-23",
  "valid_until": "2026-10-23",
  "photo_url": "https://example.com/photo.jpg",
  "access_zones": ["building_a", "parking", "gym"]
}`}
                  </pre>
                </div>

                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>Response 201</h4>
                <div style={{ backgroundColor: '#0F1629', padding: '16px', borderRadius: '8px' }}>
                  <pre style={{ color: '#94A3B8', fontSize: '13px', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`{
  "badge_id": "badge_789012",
  "qr_code": "https://api.neox.team/qr/badge_789012.png",
  "nfc_token": "ABCD1234EFGH5678",
  "status": "active",
  "expires_at": "2026-10-23T23:59:59Z",
  "created_at": "2025-10-22T20:30:00Z"
}`}
                  </pre>
                </div>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/badges/:id/verify</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Verify badge and check access rights</p>
              </div>
            </div>
          )}

          {/* Modules & Profiles API */}
          {activeAPI === 'modules-profiles' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Modules & Profiles API</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Manage system modules and user permission profiles</p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/modules</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>List all available modules</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#F59E0B', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>PATCH</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/modules/:id/toggle</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Enable or disable a module</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/profiles</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Get all user profiles with module permissions</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/profiles</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Create new user profile with module permissions</p>
              </div>
            </div>
          )}

          {/* Ticketing System API */}
          {activeAPI === 'tickets' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Ticketing System API</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Support ticket management and tracking</p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/tickets</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Create new support ticket</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/tickets</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>List all tickets with filtering options</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#F59E0B', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>PATCH</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/tickets/:id</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Update ticket status or assign to agent</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/tickets/:id/comments</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Add comment to ticket</p>
              </div>
            </div>
          )}

          {/* Notifications API */}
          {activeAPI === 'notifications' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Notifications API</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Push notifications, emails, and in-app alerts</p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/notifications/send</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Send notification to user or group</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/notifications</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Get notifications for current user</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#F59E0B', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>PATCH</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/notifications/:id/read</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Mark notification as read</p>
              </div>
            </div>
          )}

          {/* Emergency Management API */}
          {activeAPI === 'emergency' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Emergency Management API</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Emergency alerts, evacuation management, and crisis response</p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#EF4444', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/emergency/alert</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Trigger emergency alert</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/emergency/status</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Get current emergency status</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#F59E0B', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>PATCH</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/emergency/resolve</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Resolve emergency and clear alerts</p>
              </div>
            </div>
          )}

          {/* Restaurant & Catering API */}
          {activeAPI === 'restaurant' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Restaurant & Catering API</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Food ordering, catering requests, and menu management</p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/restaurant/menu</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Get current menu</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/restaurant/orders</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Place food order</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/catering/request</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Request catering for event</p>
              </div>
            </div>
          )}

          {/* Space Management API */}
          {activeAPI === 'space-management' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Space Management API</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Meeting rooms, desks, and workspace reservations</p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/spaces</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>List available spaces</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/spaces/reserve</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Reserve a space or room</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/spaces/availability</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Check space availability for date range</p>
              </div>
            </div>
          )}

          {/* Locker Management API */}
          {activeAPI === 'lockers' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Locker Management API</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Locker assignment, access control, and management</p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/lockers</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>List all lockers with status</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/lockers/assign</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Assign locker to user</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#F59E0B', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>PATCH</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/lockers/:id/access</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Grant or revoke locker access</p>
              </div>
            </div>
          )}

          {/* Analytics & Reporting API */}
          {activeAPI === 'analytics' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Analytics & Reporting API</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>System analytics, usage reports, and data insights</p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/analytics/dashboard</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Get overview dashboard metrics</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/analytics/users</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Get user activity and engagement analytics</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>GET</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/reports/audit-logs</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Export audit logs with filters</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/reports/generate</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Generate custom report with specified parameters</p>
              </div>
            </div>
          )}

          {/* AI Assistant API */}
          {activeAPI === 'ai-assistant' && (
            <div>
              <h2 style={{ color: '#F1F5F9', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>AI Assistant API</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Natural language processing, chatbot, and AI-powered features</p>
              
              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/ai/chat</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Send message to AI assistant and get response</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/ai/recommendations</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Get personalized recommendations based on user context</p>
              </div>

              <div style={{ backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POST</span>
                  <code style={{ color: '#60A5FA', fontSize: '16px', fontFamily: 'monospace' }}>/ai/analyze</code>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>Analyze text, images, or data with AI</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
