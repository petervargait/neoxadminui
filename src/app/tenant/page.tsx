import { NEOXLogo } from '@/components/ui/neox-logo'
import Link from 'next/link'

export default function TenantPage() {
  return (
    <div className="min-h-screen neox-gradient p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <NEOXLogo size="lg" variant="gold" className="justify-center mb-6" />
          <h1 className="text-3xl font-bold text-gold-600 mb-4">
            Tenant Admin Dashboard
          </h1>
          <p className="text-gold-200 max-w-2xl mx-auto">
            Welcome to your tenant administration panel. 
            Manage users, invitations, and tenant-specific configurations.
          </p>
        </div>

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