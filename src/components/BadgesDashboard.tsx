'use client'

import React from 'react'
import { Badge } from '../context/GlobalStateContext'

interface BadgesDashboardProps {
  badges: Badge[]
  searchTerm: string
}

export default function BadgesDashboard({ badges, searchTerm }: BadgesDashboardProps) {
  const statusCounts = {
    New: badges.filter(b => b.status === 'New').length,
    Sent: badges.filter(b => b.status === 'Sent').length,
    Downloaded: badges.filter(b => b.status === 'Downloaded').length,
    Suspended: badges.filter(b => b.status === 'Suspended').length
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1), rgba(14, 165, 233, 0.1))', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Digital Badges</h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', margin: '4px 0 0 0' }}>Badge distribution and status</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{statusCounts.New}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#DBEAFE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NEW</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.2))', border: '1px solid rgba(234, 179, 8, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{statusCounts.Sent}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#FEF3C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SENT</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{statusCounts.Downloaded}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#D1FAE5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DOWNLOADED</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{statusCounts.Suspended}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#FEE2E2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SUSPENDED</div>
        </div>
      </div>
    </div>
  )
}
