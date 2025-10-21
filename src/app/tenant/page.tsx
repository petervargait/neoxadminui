import Link from 'next/link'

export default function TenantPage() {
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
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#d7bb91' }}>Tenant Admin Dashboard</h1>
          <p className="max-w-2xl mx-auto mb-8" style={{ color: '#d7bb91', opacity: 0.8 }}>
            Welcome to your tenant administration panel.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl shadow-xl" style={cardStyle}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(215, 187, 145, 0.2)' }}>
              <svg className="w-6 h-6" style={{ color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#d7bb91' }}>Users</h3>
            <p className="text-sm mb-4" style={{ color: '#d7bb91', opacity: 0.7 }}>Manage team members</p>
            <div className="text-2xl font-bold" style={{ color: '#d7bb91' }}>0</div>
          </div>

          <div className="p-6 rounded-2xl shadow-xl" style={cardStyle}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(215, 187, 145, 0.2)' }}>
              <svg className="w-6 h-6" style={{ color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#d7bb91' }}>Invitations</h3>
            <p className="text-sm mb-4" style={{ color: '#d7bb91', opacity: 0.7 }}>Visitor management</p>
            <div className="text-2xl font-bold" style={{ color: '#d7bb91' }}>0</div>
          </div>

          <div className="p-6 rounded-2xl shadow-xl" style={cardStyle}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(215, 187, 145, 0.2)' }}>
              <svg className="w-6 h-6" style={{ color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#d7bb91' }}>Parking</h3>
            <p className="text-sm mb-4" style={{ color: '#d7bb91', opacity: 0.7 }}>Space management</p>
            <div className="text-2xl font-bold text-green-400">Available</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl shadow-xl" style={cardStyle}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7bb91' }}>Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d7bb91' }}></div>
                <span style={{ color: '#d7bb91', opacity: 0.7 }}>No recent activity</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl shadow-xl" style={cardStyle}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7bb91' }}>Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <button style={buttonStyle}>Invite User</button>
              <button style={buttonStyle}>Send Invitation</button>
              <button style={buttonStyle}>Manage Templates</button>
              <button style={buttonStyle}>View Reports</button>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="neox-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gold-600 mb-2">Users</h3>
            <p className="text-gold-200 text-sm mb-4">Manage team members and their roles</p>
            <div className="text-2xl font-bold text-gold-600">0</div>
            <div className="text-xs text-gold-400">Active Users</div>
          </div>

          <div className="neox-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gold-600 mb-2">Invitations</h3>
            <p className="text-gold-200 text-sm mb-4">Send and manage visitor invitations</p>
            <div className="text-2xl font-bold text-gold-600">0</div>
            <div className="text-xs text-gold-400">Pending Invitations</div>
          </div>

          <div className="neox-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gold-600 mb-2">Parking</h3>
            <p className="text-gold-200 text-sm mb-4">Manage parking availability</p>
            <div className="text-2xl font-bold text-green-400">Available</div>
            <div className="text-xs text-gold-400">Parking Status</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="neox-card p-6">
            <h2 className="text-xl font-semibold text-gold-600 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-gold-600 rounded-full"></div>
                <span className="text-gold-200">No recent activity</span>
              </div>
            </div>
          </div>

          <div className="neox-card p-6">
            <h2 className="text-xl font-semibold text-gold-600 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <button className="neox-button-secondary w-full text-left">
                Invite User
              </button>
              <button className="neox-button-secondary w-full text-left">
                Send Invitation
              </button>
              <button className="neox-button-secondary w-full text-left">
                Manage Templates
              </button>
              <button className="neox-button-secondary w-full text-left">
                View Reports
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gold-400 text-sm">
            ⚠️ This is a placeholder page. Database connection and authentication required.
          </p>
          <Link href="/" className="text-gold-600 hover:text-gold-500 text-sm underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}