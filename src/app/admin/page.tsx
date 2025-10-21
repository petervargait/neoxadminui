import Link from 'next/link'

export default function AdminPage() {
  const cardStyle = {
    backgroundColor: 'rgba(30, 55, 90, 0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(75, 101, 129, 0.3)'
  }

  const buttonStyle = {
    backgroundColor: 'rgba(51, 78, 104, 0.8)',
    color: '#d7bb91',
    border: '1px solid rgba(75, 101, 129, 0.3)',
    borderRadius: '0.75rem',
    padding: '0.75rem 1.5rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer'
  }

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #08122e 0%, #243b53 100%)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6" style={{ color: '#d7bb91' }}>
            <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
              <g fill="currentColor">
                <rect x="10" y="70" width="8" height="30" />
                <rect x="22" y="60" width="8" height="40" />
                <rect x="34" y="45" width="8" height="55" />
                <rect x="46" y="35" width="8" height="65" />
                <rect x="58" y="45" width="8" height="55" />
                <rect x="70" y="60" width="8" height="40" />
                <rect x="82" y="70" width="8" height="30" />
                <path d="M25 50 Q50 30 75 50 Q50 70 25 50" stroke="currentColor" strokeWidth="2" fill="none" />
                <rect x="10" y="98" width="80" height="2" />
                <circle cx="50" cy="25" r="3" />
              </g>
            </svg>
            <div>
              <div className="text-xl font-bold">NEOX</div>
              <div className="text-xs opacity-80">INFINITY</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#d7bb91' }}>Global Admin Dashboard</h1>
          <p className="max-w-2xl mx-auto mb-8" style={{ color: '#d7bb91', opacity: 0.8 }}>
            Welcome to the NEOX Infinity global administration panel.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl shadow-xl" style={cardStyle}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(215, 187, 145, 0.2)' }}>
              <svg className="w-6 h-6" style={{ color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#d7bb91' }}>Tenants</h3>
            <p className="text-sm mb-4" style={{ color: '#d7bb91', opacity: 0.7 }}>Manage organizations</p>
            <div className="text-2xl font-bold" style={{ color: '#d7bb91' }}>0</div>
          </div>

          <div className="p-6 rounded-2xl shadow-xl" style={cardStyle}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(215, 187, 145, 0.2)' }}>
              <svg className="w-6 h-6" style={{ color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#d7bb91' }}>Users</h3>
            <p className="text-sm mb-4" style={{ color: '#d7bb91', opacity: 0.7 }}>Manage all users</p>
            <div className="text-2xl font-bold" style={{ color: '#d7bb91' }}>0</div>
          </div>

          <div className="p-6 rounded-2xl shadow-xl" style={cardStyle}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(215, 187, 145, 0.2)' }}>
              <svg className="w-6 h-6" style={{ color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#d7bb91' }}>Status</h3>
            <p className="text-sm mb-4" style={{ color: '#d7bb91', opacity: 0.7 }}>System health</p>
            <div className="text-2xl font-bold text-green-400">Online</div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 rounded-2xl shadow-xl mb-8" style={cardStyle}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7bb91' }}>Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button style={buttonStyle}>Create Tenant</button>
            <button style={buttonStyle}>Manage Modules</button>
            <button style={buttonStyle}>View Audit Logs</button>
            <button style={buttonStyle}>System Settings</button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: '#d7bb91', opacity: 0.6 }}>
            ⚠️ Demo page - Database connection required
          </p>
          <Link href="/" className="text-sm underline hover:opacity-80" style={{ color: '#d7bb91' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
