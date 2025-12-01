'use client'

import React from 'react'
import { Locker } from '../context/GlobalStateContext'

interface LockerDashboardProps {
  lockers: Locker[]
  searchTerm: string
}

export default function LockerDashboard({ lockers, searchTerm }: LockerDashboardProps) {
  const occupied = lockers.filter(l => l.status === 'occupied').length
  const available = lockers.filter(l => l.status === 'available').length
  const utilization = lockers.length > 0 ? ((occupied / lockers.length) * 100).toFixed(1) : '0'

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), rgba(244, 114, 182, 0.1))', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Locker Management</h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', margin: '4px 0 0 0' }}>Locker utilization and availability</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(126, 34, 206, 0.2))', border: '1px solid rgba(147, 51, 234, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{lockers.length}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#E9D5FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL LOCKERS</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2))', border: '1px solid rgba(236, 72, 153, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{occupied}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#FBCFE8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OCCUPIED</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(236, 72, 153, 0.2))', border: '1px solid rgba(244, 114, 182, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{available}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#FBD5E8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVAILABLE</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(219, 39, 119, 0.2), rgba(190, 24, 93, 0.2))', border: '1px solid rgba(219, 39, 119, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{utilization}%</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#FCE7F3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UTILIZATION</div>
        </div>
      </div>
    </div>
  )
}
