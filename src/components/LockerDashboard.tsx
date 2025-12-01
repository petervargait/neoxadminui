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
  const maintenance = lockers.filter(l => l.status === 'maintenance').length
  const utilization = lockers.length > 0 ? ((occupied / lockers.length) * 100).toFixed(1) : '0'
  
  // Usage statistics
  const totalUsages = lockerUsages.length
  const opened = lockerUsages.filter(u => u.opened).length
  const notOpened = lockerUsages.filter(u => !u.opened).length
  const avgDuration = lockerUsages.length > 0 ? Math.round(lockerUsages.reduce((sum, u) => sum + u.duration, 0) / lockerUsages.length) : 0
  
  const total = lockers.length || 1
  
  // Usage by locker (top 5)
  const usageByLocker = lockers.slice(0, 5).map(locker => {
    const uses = lockerUsages.filter(u => u.lockerId === locker.id).length
    return { number: locker.lockerNumber, uses }
  })
  const maxUses = Math.max(...usageByLocker.map(l => l.uses), 1)

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
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '4px 0 0 0' }}>Locker utilization and usage analytics</p>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{lockers.length}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL LOCKERS</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.15))', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{available}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#BBF7D0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVAILABLE</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{occupied}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#FECACA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OCCUPIED</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{opened}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OPENED (30D)</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15))', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{notOpened}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#FEF3C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NOT OPENED</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(109, 40, 217, 0.15))', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{avgDuration}m</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVG DURATION</div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Pie Chart - Locker Status */}
        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px' }}>
          <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '20px', margin: '0 0 20px 0' }}>Locker Status Distribution</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="28" strokeDasharray={`${(available/total) * 439.6} 439.6`} strokeDashoffset="0" transform="rotate(-90 80 80)" />
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="28" strokeDasharray={`${(occupied/total) * 439.6} 439.6`} strokeDashoffset={`-${(available/total) * 439.6}`} transform="rotate(-90 80 80)" />
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="28" strokeDasharray={`${(maintenance/total) * 439.6} 439.6`} strokeDashoffset={`-${((available + occupied)/total) * 439.6}`} transform="rotate(-90 80 80)" />
              <text x="80" y="75" textAnchor="middle" fill="#F1F5F9" fontSize="28" fontWeight="900">{utilization}%</text>
              <text x="80" y="95" textAnchor="middle" fill="#94A3B8" fontSize="12">Used</text>
            </svg>
            <div style={{ flex: 1, paddingLeft: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(34, 197, 94, 0.6)' }}></div>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>Available</span>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700' }}>{available}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.6)' }}></div>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>Occupied</span>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700' }}>{occupied}</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(148, 163, 184, 0.4)' }}></div>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>Maintenance</span>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700' }}>{maintenance}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bar Chart - Top Used Lockers */}
        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px' }}>
          <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '20px', margin: '0 0 20px 0' }}>Most Used Lockers (30D)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {usageByLocker.map((locker, index) => {
              const percentage = (locker.uses / maxUses) * 100
              return (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94A3B8', fontSize: '13px' }}>{locker.number}</span>
                    <span style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: '600' }}>{locker.uses} uses</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #6366F1)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Usage Success Rate */}
      <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px' }}>
        <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '20px', margin: '0 0 20px 0' }}>Usage Success Rate</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#94A3B8', fontSize: '13px' }}>Successfully Opened</span>
              <span style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600' }}>{opened} / {totalUsages}</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${(opened / (totalUsages || 1)) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #22C55E, #16A34A)', borderRadius: '6px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#94A3B8', fontSize: '13px' }}>Failed to Open</span>
              <span style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600' }}>{notOpened} / {totalUsages}</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${(notOpened / (totalUsages || 1)) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #EF4444, #DC2626)', borderRadius: '6px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
