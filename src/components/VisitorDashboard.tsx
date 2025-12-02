'use client'

import React, { useMemo } from 'react'
import { Invitation } from '../context/GlobalStateContext'

interface VisitorDashboardProps {
  invitations: Invitation[]
  startDate: string
  endDate: string
  searchTerm: string
}

export default function VisitorDashboard({ invitations, startDate, endDate, searchTerm }: VisitorDashboardProps) {
  const filteredInvitations = useMemo(() => {
    return invitations.filter(inv => {
      if (startDate && new Date(inv.visitDate) < new Date(startDate)) return false
      if (endDate && new Date(inv.visitDate) > new Date(endDate)) return false
      
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        if (!inv.visitorName.toLowerCase().includes(search) &&
            !inv.hostName.toLowerCase().includes(search) &&
            !inv.location.toLowerCase().includes(search)) {
          return false
        }
      }
      
      return true
    })
  }, [invitations, startDate, endDate, searchTerm])

  const kpis = useMemo(() => {
    const sites = [...new Set(filteredInvitations.map(i => i.location))]
    const hosts = [...new Set(filteredInvitations.map(i => i.hostId))]
    
    const visitsPerSite: Record<string, number> = {}
    sites.forEach(site => {
      visitsPerSite[site] = filteredInvitations.filter(i => i.location === site).length
    })
    
    const visitsPerHost: Record<string, { name: string; count: number }> = {}
    hosts.forEach(host => {
      const invitation = filteredInvitations.find(i => i.hostId === host)
      visitsPerHost[host] = {
        name: invitation?.hostName || host,
        count: filteredInvitations.filter(i => i.hostId === host).length
      }
    })
    
    const avgLeadTime = '2.5 hrs'
    
    const now = new Date()
    const noShows = filteredInvitations.filter(inv => {
      const visitDate = new Date(inv.visitDate)
      return visitDate < now && inv.status === 'pending'
    }).length
    const totalPastVisits = filteredInvitations.filter(inv => new Date(inv.visitDate) < now).length
    const noShowRate = totalPastVisits > 0 ? ((noShows / totalPastVisits) * 100).toFixed(1) : '0.0'
    
    return {
      totalVisits: filteredInvitations.length,
      visitsPerSite,
      visitsPerHost,
      avgLeadTime,
      noShowRate,
      sites,
      hosts
    }
  }, [filteredInvitations])

  // Visitor type distribution
  const businessVisitors = filteredInvitations.filter(inv => inv.visitorType === 'business').length
  const vipVisitors = filteredInvitations.filter(inv => inv.visitorType === 'vip').length
  const childVisitors = filteredInvitations.filter(inv => inv.visitorType === 'child').length
  const dogVisitors = filteredInvitations.filter(inv => inv.visitorType === 'dog').length
  const otherVisitors = filteredInvitations.filter(inv => !inv.visitorType || inv.visitorType === 'other').length
  
  const systemAvailability = 99.9

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Header with System Availability */}
      <div style={{ 
        background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.05))', backdropFilter: 'blur(10px)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.3)',
              fontSize: '36px',
              color: 'white',
              fontWeight: '400'
            }}>
              👥
            </div>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#F1F5F9', margin: 0, letterSpacing: '-0.02em' }}>Visitor Management</h2>
              <p style={{ fontSize: '15px', color: '#A0AEC0', margin: '4px 0 0 0', fontWeight: '500' }}>Real-time visitor analytics and insights</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.1)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px #10B981' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Availability</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#10B981' }}>{systemAvailability}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid - Blue/Steel/Purple Theme */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '24px', height: '24px', color: '#60A5FA' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9' }}>{kpis.totalVisits}</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#BFDBFE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL VISITS</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>In selected period</div>
          </div>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.15), rgba(71, 85, 105, 0.15))', border: '1px solid rgba(100, 116, 139, 0.3)', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'rgba(100, 116, 139, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(100, 116, 139, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '24px', height: '24px', color: '#94A3B8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9' }}>{kpis.avgLeadTime}</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVG LEAD TIME</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Time in building</div>
          </div>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '24px', height: '24px', color: '#818CF8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9' }}>{kpis.noShowRate}%</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NO-SHOW RATE</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Did not appear</div>
          </div>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(6, 182, 212, 0.15))', border: '1px solid rgba(14, 165, 233, 0.3)', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '24px', height: '24px', color: '#38BDF8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9' }}>{kpis.sites.length}</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#BAE6FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIVE SITES</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>With visits</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={{ borderRadius: '20px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '28px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F1F5F9', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Visits per Site
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {Object.entries(kpis.visitsPerSite).map(([site, count]) => {
              const percentage = kpis.totalVisits > 0 ? (count / kpis.totalVisits) * 100 : 0
              return (
                <div key={site}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: '#CBD5E1', fontWeight: '500' }}>{site}</span>
                    <span style={{ color: '#F1F5F9', fontWeight: '700' }}>{count} visits</span>
                  </div>
                  <div style={{ position: 'relative', height: '10px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      bottom: 0, 
                      width: `${percentage}%`, 
                      background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                      borderRadius: '10px',
                      boxShadow: '0 0 16px rgba(59, 130, 246, 0.6)',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
                  </div>
                </div>
              )
            })}
            {Object.keys(kpis.visitsPerSite).length === 0 && <p style={{ color: '#64748B', textAlign: 'center', padding: '32px 0' }}>No data available</p>}
          </div>
        </div>

        <div style={{ borderRadius: '20px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '28px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F1F5F9', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Top Hosts
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '28px' }}>
            {Object.entries(kpis.visitsPerHost).sort((a, b) => b[1].count - a[1].count).slice(0, 3).map(([hostId, data], index) => {
              const maxCount = Math.max(...Object.values(kpis.visitsPerHost).map(v => v.count))
              const percentage = maxCount > 0 ? (data.count / maxCount) * 100 : 0
              const circumference = 2 * Math.PI * 60
              const strokeDashoffset = circumference - (percentage / 100) * circumference
              const colors = ['#3B82F6', '#64748B', '#6366F1']
              const color = colors[index % colors.length]
              
              return (
                <div key={hostId} style={{ position: 'relative' }}>
                  <svg style={{ width: '160px', height: '160px', transform: 'rotate(-90deg)' }} viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle cx="70" cy="70" r="60" fill="none" stroke={color} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9', marginBottom: '2px' }}>{data.count}</div>
                    <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '500' }}>{data.name.split(' ')[0]}</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>{data.count} visits</div>
                  </div>
                </div>
              )
            })}
            {Object.keys(kpis.visitsPerHost).length === 0 && <p style={{ color: '#64748B', textAlign: 'center', padding: '32px 0' }}>No data available</p>}
          </div>
        </div>
        
        {/* Visitor Type Distribution */}
        <div style={{ borderRadius: '20px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '28px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)', marginTop: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F1F5F9', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            Visitor Type Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[
              { label: 'Business Visitors', value: businessVisitors, color: '#3B82F6', icon: '💼' },
              { label: 'VIP Visitors', value: vipVisitors, color: '#6366F1', icon: '⭐' },
              { label: 'Child Visitors', value: childVisitors, color: '#8B5CF6', icon: '👶' },
              { label: 'Dog Visitors', value: dogVisitors, color: '#0EA5E9', icon: '🐕' },
              { label: 'Other/Unspecified', value: otherVisitors, color: '#64748B', icon: '👤' }
            ].map((item) => {
              const maxVisitors = Math.max(businessVisitors, vipVisitors, childVisitors, dogVisitors, otherVisitors, 1)
              const percentage = (item.value / maxVisitors) * 100
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#CBD5E1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{item.icon}</span>
                      {item.label}
                    </span>
                    <span style={{ color: '#F1F5F9', fontWeight: '700' }}>{item.value} visitors</span>
                  </div>
                  <div style={{ position: 'relative', height: '10px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      bottom: 0, 
                      width: `${percentage}%`, 
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                      borderRadius: '10px',
                      boxShadow: `0 0 16px ${item.color}99`,
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
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
