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
  
  const locationCounts: Record<string, number> = {}
  badgeSwipes.forEach(swipe => {
    locationCounts[swipe.location] = (locationCounts[swipe.location] || 0) + 1
  })
  const topLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxSwipes = Math.max(...topLocations.map(l => l[1]), 1)

  return (
    <div>
      <div style={{ background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', borderRadius: '24px', padding: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))', backdropFilter: 'blur(10px)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4), 0 0 40px rgba(99, 102, 241, 0.3)', fontSize: '36px', color: 'white', fontWeight: '400' }}>
            📄
          </div>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#F1F5F9', margin: 0, letterSpacing: '-0.02em' }}>Badge Management</h2>
            <p style={{ fontSize: '15px', color: '#A0AEC0', margin: '4px 0 0 0', fontWeight: '500' }}>Badge distribution & access analytics</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { value: badges.length, label: 'Total Badges', gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' },
          { value: downloaded, label: 'Downloaded', gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)' },
          { value: sent, label: 'Sent', gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' },
          { value: suspended, label: 'Suspended', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' },
          { value: totalSwipes, label: 'Total Swipes', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }
        ].map((stat, idx) => (
          <div key={idx} style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: stat.gradient, opacity: 0.1, borderRadius: '50%', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '40px', fontWeight: '900', background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.4))', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700', marginBottom: '32px', margin: '0 0 32px 0' }}>Badge Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                  <svg width="220" height="220" viewBox="0 0 220 220" style={{ filter: 'drop-shadow(0 8px 24px rgba(99, 102, 241, 0.4))' }}>
                    <defs>
                      <linearGradient id="badgeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#2563EB', stopOpacity: 1 }} />
                      </linearGradient>
                      <linearGradient id="badgeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#64748B', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#475569', stopOpacity: 1 }} />
                      </linearGradient>
                      <linearGradient id="badgeGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#6366F1', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
                      </linearGradient>
                      <linearGradient id="badgeGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#0EA5E9', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                      </linearGradient>
                  </defs>
                  <circle cx="110" cy="110" r="80" fill="rgba(15, 23, 42, 0.6)" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#badgeGrad1)" strokeWidth="28" strokeDasharray={`${(downloaded/total) * 596.9} 596.9`} strokeDashoffset="0" transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#badgeGrad2)" strokeWidth="28" strokeDasharray={`${(sent/total) * 596.9} 596.9`} strokeDashoffset={`-${(downloaded/total) * 596.9}`} transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#badgeGrad3)" strokeWidth="28" strokeDasharray={`${(newBadges/total) * 596.9} 596.9`} strokeDashoffset={`-${((downloaded + sent)/total) * 596.9}`} transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#badgeGrad4)" strokeWidth="28" strokeDasharray={`${(suspended/total) * 596.9} 596.9`} strokeDashoffset={`-${((downloaded + sent + newBadges)/total) * 596.9}`} transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <text x="110" y="105" textAnchor="middle" fill="#F1F5F9" fontSize="38" fontWeight="900">{badges.length}</text>
                  <text x="110" y="130" textAnchor="middle" fill="#94A3B8" fontSize="14" fontWeight="600">TOTAL</text>
                </svg>
              </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { label: 'Downloaded', value: downloaded, color: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
                    { label: 'Sent', value: sent, color: 'linear-gradient(135deg, #64748B, #475569)' },
                    { label: 'New', value: newBadges, color: 'linear-gradient(135deg, #6366F1, #4F46E5)' },
                    { label: 'Suspended', value: suspended, color: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }
                  ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: item.color, boxShadow: '0 0 12px rgba(139, 92, 246, 0.5)' }} />
                      <span style={{ color: '#94A3B8', fontSize: '15px', fontWeight: '600' }}>{item.label}</span>
                    </div>
                    <div style={{ color: '#F1F5F9', fontSize: '22px', fontWeight: '800' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.4))', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '-50%', left: '-20%', width: '140%', height: '140%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700', marginBottom: '32px', margin: '0 0 32px 0' }}>Top Access Locations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '300px', justifyContent: 'center' }}>
              {topLocations.map(([location, count], index) => {
                const percentage = (count / maxSwipes) * 100
                const colors = ['#6366F1', '#8B5CF6', '#A855F7', '#EC4899', '#F97316']
                const locationName = location.split(' - ')[1] || location
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'baseline' }}>
                      <span style={{ color: '#94A3B8', fontSize: '15px', fontWeight: '600' }}>{locationName}</span>
                      <span style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '800' }}>{count}<span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}> swipes</span></span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: `linear-gradient(90deg, ${colors[index]}, ${colors[(index + 1) % colors.length]})`, borderRadius: '100px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 20px ${colors[index]}40` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
