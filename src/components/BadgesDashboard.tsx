'use client'

import React from 'react'
import { Badge } from '../context/GlobalStateContext'

interface BadgesDashboardProps {
  badges: Badge[]
  searchTerm: string
}

export default function BadgesDashboard({ badges }: BadgesDashboardProps) {
  const downloaded = badges.filter(b => b.status === 'Downloaded').length
  const sent = badges.filter(b => b.status === 'Sent').length
  const newBadges = badges.filter(b => b.status === 'New').length
  const suspended = badges.filter(b => b.status === 'Suspended').length

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)' }}>
            <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Badge Management</h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '4px 0 0 0' }}>Badge issuance and status tracking</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{badges.length}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL BADGES</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{downloaded}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DOWNLOADED</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(109, 40, 217, 0.15))', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{sent}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SENT</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(67, 56, 202, 0.15))', border: '1px solid rgba(79, 70, 229, 0.3)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{suspended}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SUSPENDED</div>
        </div>
      </div>
    </div>
  )
}
