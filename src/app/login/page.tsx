'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NeoxLogo from '../../components/NeoxLogo'

export default function LoginPage() {
  const router = useRouter()
  const [loginStep, setLoginStep] = useState<'credentials' | 'mfa'>('credentials')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      if (username === 'neoxadmin' && password === 'IamNEOX01&') {
        setLoginStep('mfa')
        setLoading(false)
      } else {
        setError('Invalid username or password')
        setLoading(false)
      }
    }, 800)
  }

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate MFA verification delay
    setTimeout(() => {
      if (mfaCode === '000000') {
        // Store auth state in sessionStorage
        sessionStorage.setItem('isAuthenticated', 'true')
        sessionStorage.setItem('username', username)
        router.push('/')
      } else {
        setError('Invalid MFA code')
        setLoading(false)
      }
    }, 800)
  }

  const handleSSOLogin = (provider: string) => {
    setError('')
    setLoading(true)
    
    // Simulate SSO authentication
    setTimeout(() => {
      sessionStorage.setItem('isAuthenticated', 'true')
      sessionStorage.setItem('username', `${provider}-user`)
      sessionStorage.setItem('ssoProvider', provider)
      router.push('/')
    }, 1500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#08122E',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
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
        opacity: 0.1,
        zIndex: 0
      }} />

      {/* Top Navigation */}
      <div style={{
        height: '70px',
        backgroundColor: '#162032',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        position: 'relative',
        zIndex: 1
      }}>
        <NeoxLogo width="480px" height="128px" />
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#162032',
          borderRadius: '16px',
          border: '1px solid #1E293B',
          padding: '48px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Credentials Step */}
          {loginStep === 'credentials' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#F1F5F9',
                  marginBottom: '8px'
                }}>
                  Welcome Back
                </h1>
                <p style={{ color: '#64748B', fontSize: '14px' }}>
                  Sign in to access your admin dashboard
                </p>
              </div>

              <form onSubmit={handleCredentialsSubmit} style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#0F1729',
                      border: '1px solid #1E293B',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#1E293B'}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#0F1729',
                      border: '1px solid #1E293B',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#1E293B'}
                  />
                </div>

                {error && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ color: '#EF4444', fontSize: '14px', margin: 0 }}>
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: loading ? '#1E293B' : '#3B82F6',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563EB')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3B82F6')}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '32px 0',
                gap: '16px'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1E293B' }} />
                <span style={{ color: '#64748B', fontSize: '14px' }}>Or continue with</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1E293B' }} />
              </div>

              {/* SSO Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => handleSSOLogin('Google')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#0F1729',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'background-color 0.2s',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1E293B')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0F1729')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSSOLogin('Microsoft')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#0F1729',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'background-color 0.2s',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1E293B')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0F1729')}
                >
                  <svg width="20" height="20" viewBox="0 0 21 21" fill="currentColor">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                  </svg>
                  Continue with Microsoft
                </button>

                <button
                  onClick={() => handleSSOLogin('SAML')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#0F1729',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'background-color 0.2s',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1E293B')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0F1729')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Continue with SAML SSO
                </button>
              </div>
            </>
          )}

          {/* MFA Step */}
          {loginStep === 'mfa' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#3B82F6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto'
                }}>
                  <span style={{ fontSize: '32px' }}>🔐</span>
                </div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#F1F5F9',
                  marginBottom: '8px'
                }}>
                  Two-Factor Authentication
                </h1>
                <p style={{ color: '#64748B', fontSize: '14px' }}>
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <form onSubmit={handleMfaSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    textAlign: 'center'
                  }}>
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                    disabled={loading}
                    maxLength={6}
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#0F1729',
                      border: '1px solid #1E293B',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '24px',
                      fontWeight: '600',
                      textAlign: 'center',
                      letterSpacing: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#1E293B'}
                  />
                </div>

                {error && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ color: '#EF4444', fontSize: '14px', margin: 0, textAlign: 'center' }}>
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || mfaCode.length !== 6}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: (loading || mfaCode.length !== 6) ? '#1E293B' : '#3B82F6',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (loading || mfaCode.length !== 6) ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    opacity: (loading || mfaCode.length !== 6) ? 0.6 : 1,
                    marginBottom: '16px'
                  }}
                  onMouseEnter={(e) => !(loading || mfaCode.length !== 6) && (e.currentTarget.style.backgroundColor = '#2563EB')}
                  onMouseLeave={(e) => !(loading || mfaCode.length !== 6) && (e.currentTarget.style.backgroundColor = '#3B82F6')}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginStep('credentials')
                    setMfaCode('')
                    setError('')
                  }}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    color: '#64748B',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.color = '#F1F5F9')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.color = '#64748B')}
                >
                  Back to Login
                </button>
              </form>
            </>
          )}

          {/* Footer */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #1E293B',
            textAlign: 'center'
          }}>
            <p style={{ color: '#64748B', fontSize: '12px' }}>
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
