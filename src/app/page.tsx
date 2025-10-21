import { NEOXLogo } from '@/components/ui/neox-logo'

export default function Home() {
  return (
    <div className="min-h-screen neox-gradient flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <NEOXLogo size="xl" variant="gold" className="justify-center mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-gold-600 mb-4">
            Multi-Tenant Admin Platform
          </h1>
          <p className="text-xl text-gold-200 mb-8 max-w-2xl mx-auto">
            A production-ready administrative web application with comprehensive 
            role-based access control, white-labeling, and OWASP security compliance.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="neox-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-600/20 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gold-600 mb-2">Multi-Tenant</h3>
            <p className="text-gold-200 text-sm">Complete tenant isolation with custom branding and configurations</p>
          </div>

          <div className="neox-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-600/20 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gold-600 mb-2">RBAC Security</h3>
            <p className="text-gold-200 text-sm">Granular role-based permissions with audit logging and OWASP compliance</p>
          </div>

          <div className="neox-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-600/20 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gold-600 mb-2">White-Label</h3>
            <p className="text-gold-200 text-sm">Customize branding, themes, and email templates for each tenant</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/admin"
            className="neox-button inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Global Admin
          </a>
          <a
            href="/tenant"
            className="neox-button-secondary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Tenant Admin
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gold-600/20">
          <p className="text-gold-300 text-sm">
            Built with Next.js 14, TypeScript, Prisma, and NextAuth.js
          </p>
          <p className="text-gold-400 text-xs mt-2">
            Production-ready • OWASP Compliant • Multi-tenant Architecture
          </p>
        </div>
      </div>
    </div>
  )
}
