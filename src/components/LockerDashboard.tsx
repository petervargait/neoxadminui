'use client'

import React from 'react'
import { Locker, LockerUsage } from '../context/GlobalStateContext'

interface LockerDashboardProps {
  lockers: Locker[]
  lockerUsages?: LockerUsage[]
  searchTerm: string
}

export default function LockerDashboard({ lockers, lockerUsages = [] }: LockerDashboardProps) {
  const occupied = lockers.filter(l => l.status === 'occupied').length
  const available = lockers.filter(l => l.status === 'available').length
  const utilization = lockers.length > 0 ? ((occupied / lockers.length) * 100).toFixed(1) : '0'
  
  // Usage statistics
  const totalUsages = lockerUsages.length
  const opened = lockerUsages.filter(u => u.opened).length
  const notOpened = lockerUsages.filter(u => !u.opened).length
  const avgDuration = lockerUsages.length > 0 ? Math.round(lockerUsages.reduce((sum, u) => sum + u.duration, 0) / lockerUsages.length) : 0

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)' }}>
            <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Locker Management</h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '4px 0 0 0' }}>Locker utilization and availability</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{lockers.length}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL LOCKERS</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{occupied}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OCCUPIED</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(109, 40, 217, 0.15))', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{available}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVAILABLE</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(67, 56, 202, 0.15))', border: '1px solid rgba(79, 70, 229, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{utilization}%</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UTILIZATION</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{opened}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OPENED (30D)</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{notOpened}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NOT OPENED (30D)</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(109, 40, 217, 0.15))', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{avgDuration}m</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVG DURATION</div>
        </div>
      </div>
    </div>
  )
}
