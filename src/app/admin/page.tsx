import { NEOXLogo } from '@/components/ui/neox-logo'

export default function AdminPage() {
  return (
    <div className="min-h-screen neox-gradient p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <NEOXLogo size="lg" variant="gold" className="justify-center mb-6" />
          <h1 className="text-3xl font-bold text-gold-600 mb-4">
            Global Admin Dashboard
          </h1>
          <p className="text-gold-200 max-w-2xl mx-auto">
            Welcome to the NEOX Infinity global administration panel. 
            Manage tenants, users, and system-wide configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="neox-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gold-600 mb-2">Tenant Management</h3>
            <p className="text-gold-200 text-sm mb-4">Create, suspend, and manage tenant organizations</p>
            <div className="text-2xl font-bold text-gold-600">0</div>
            <div className="text-xs text-gold-400">Active Tenants</div>
          </div>

          <div className="neox-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gold-600 mb-2">User Management</h3>
            <p className="text-gold-200 text-sm mb-4">Manage users across all tenants</p>
            <div className="text-2xl font-bold text-gold-600">0</div>
            <div className="text-xs text-gold-400">Total Users</div>
          </div>

          <div className="neox-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gold-600 mb-2">System Health</h3>
            <p className="text-gold-200 text-sm mb-4">Monitor system performance</p>
            <div className="text-2xl font-bold text-green-400">Online</div>
            <div className="text-xs text-gold-400">All Systems Operational</div>
          </div>
        </div>

        <div className="mt-12 neox-card p-6">
          <h2 className="text-xl font-semibold text-gold-600 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="neox-button-secondary w-full text-left">
              Create Tenant
            </button>
            <button className="neox-button-secondary w-full text-left">
              Manage Modules
            </button>
            <button className="neox-button-secondary w-full text-left">
              View Audit Logs
            </button>
            <button className="neox-button-secondary w-full text-left">
              System Settings
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gold-400 text-sm">
            ⚠️ This is a placeholder page. Database connection and authentication required.
          </p>
          <a href="/" className="text-gold-600 hover:text-gold-500 text-sm underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}