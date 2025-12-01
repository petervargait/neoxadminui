'use client'

import React from 'react'
import { Badge, BadgeSwipe } from '../context/GlobalStateContext'

interface BadgesDashboardProps {
  badges: Badge[]
  badgeSwipes?: BadgeSwipe[]
  searchTerm: string
}

export default function BadgesDashboard({ badges, badgeSwipes = [] }: BadgesDashboardProps) {
  const downloaded = badges.filter(b => b.status === 'Downloaded').length
  const sent = badges.filter(b => b.status === 'Sent').length
  const newBadges = badges.filter(b => b.status === 'New').length
  const suspended = badges.filter(b => b.status === 'Suspended').length
  
  const totalSwipes = badgeSwipes.length
  const todaySwipes = badgeSwipes.filter(s => s.timestamp.startsWith(new Date().toISOString().split('T')[0])).length
  
  const total = badges.length || 1
  
  // Swipes by location (top 5)
  const locationCounts: Record<string, number> = {}
  badgeSwipes.forEach(swipe => {
    locationCounts[swipe.location] = (locationCounts[swipe.location] || 0) + 1
  })
  const topLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxSwipes = Math.max(...topLocations.map(l => l[1]), 1)

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
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '4px 0 0 0' }}>Badge distribution and access analytics</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{badges.length}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL BADGES</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{downloaded}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DOWNLOADED</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.15), rgba(91, 33, 182, 0.15))', border: '1px solid rgba(109, 40, 217, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{sent}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SENT</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(109, 40, 217, 0.15))', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{suspended}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SUSPENDED</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(67, 56, 202, 0.15))', border: '1px solid rgba(79, 70, 229, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{totalSwipes}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL SWIPES</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.15), rgba(55, 48, 163, 0.15))', border: '1px solid rgba(67, 56, 202, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{todaySwipes}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#A5B4FC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TODAY</div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px' }}>
          <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '20px', margin: '0 0 20px 0' }}>Badge Status Distribution</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.2))' }}>
                <circle cx="80" cy="80" r="60" fill="rgba(15, 23, 42, 0.4)" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="20" strokeDasharray={`${(downloaded/total) * 439.6} 439.6`} strokeDashoffset="0" transform="rotate(-90 80 80)" strokeLinecap="round" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(109, 40, 217, 0.8)" strokeWidth="20" strokeDasharray={`${(sent/total) * 439.6} 439.6`} strokeDashoffset={`-${(downloaded/total) * 439.6}`} transform="rotate(-90 80 80)" strokeLinecap="round" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(99, 102, 241, 0.7)" strokeWidth="20" strokeDasharray={`${(newBadges/total) * 439.6} 439.6`} strokeDashoffset={`-${((downloaded + sent)/total) * 439.6}`} transform="rotate(-90 80 80)" strokeLinecap="round" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(124, 58, 237, 0.5)" strokeWidth="20" strokeDasharray={`${(suspended/total) * 439.6} 439.6`} strokeDashoffset={`-${((downloaded + sent + newBadges)/total) * 439.6}`} transform="rotate(-90 80 80)" strokeLinecap="round" />
                <text x="80" y="75" textAnchor="middle" fill="#F1F5F9" fontSize="28" fontWeight="900">{badges.length}</text>
                <text x="80" y="95" textAnchor="middle" fill="#94A3B8" fontSize="12">Total</text>
              </svg>
            </div>
            <div style={{ flex: 1, paddingLeft: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.8)', boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)' }}></div>
                  <span style={{ color: '#94A3B8', fontSize: '12px' }}>Downloaded</span>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '700' }}>{downloaded}</div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(109, 40, 217, 0.8)', boxShadow: '0 0 8px rgba(109, 40, 217, 0.4)' }}></div>
                  <span style={{ color: '#94A3B8', fontSize: '12px' }}>Sent</span>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '700' }}>{sent}</div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.7)', boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)' }}></div>
                  <span style={{ color: '#94A3B8', fontSize: '12px' }}>New</span>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '700' }}>{newBadges}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px' }}>
          <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '20px', margin: '0 0 20px 0' }}>Top Access Locations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topLocations.map(([location, count], index) => {
              const percentage = (count / maxSwipes) * 100
              return (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94A3B8', fontSize: '12px' }}>{location.split(' - ')[1] || location}</span>
                    <span style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: '600' }}>{count}</span>
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
    </div>
  )
}
