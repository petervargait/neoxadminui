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

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3B82F6, #9333EA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)'
          }}>
            <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Visitor Management</h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '4px 0 0 0' }}>Real-time visitor analytics and insights</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(29, 78, 216, 0.2))', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '24px', height: '24px', color: '#60A5FA' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9' }}>{kpis.totalVisits}</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL VISITS</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>In selected period</div>
          </div>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(126, 34, 206, 0.2))', border: '1px solid rgba(147, 51, 234, 0.2)', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', background: 'rgba(147, 51, 234, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(147, 51, 234, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '24px', height: '24px', color: '#A78BFA' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9' }}>{kpis.avgLeadTime}</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVG LEAD TIME</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Time in building</div>
          </div>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(220, 38, 38, 0.2))', border: '1px solid rgba(249, 115, 22, 0.2)', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '24px', height: '24px', color: '#FB923C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9' }}>{kpis.noShowRate}%</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#FDBA74', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NO-SHOW RATE</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Did not appear</div>
          </div>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.2))', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '24px', height: '24px', color: '#22D3EE' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9' }}>{kpis.sites.length}</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#67E8F9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIVE SITES</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>With visits</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F1F5F9', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #9333EA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Visits per Site
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(kpis.visitsPerSite).map(([site, count]) => {
              const percentage = kpis.totalVisits > 0 ? (count / kpis.totalVisits) * 100 : 0
              return (
                <div key={site}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#CBD5E1', fontWeight: '500' }}>{site}</span>
                    <span style={{ color: '#F1F5F9', fontWeight: '700' }}>{count} visits</span>
                  </div>
                  <div style={{ position: 'relative', height: '12px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${percentage}%`, background: 'linear-gradient(90deg, #3B82F6, #9333EA, #EC4899)', borderRadius: '9999px', boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)', transition: 'width 1s ease-out' }}></div>
                  </div>
                </div>
              )
            })}
            {Object.keys(kpis.visitsPerSite).length === 0 && <p style={{ color: '#64748B', textAlign: 'center', padding: '32px 0' }}>No data available</p>}
          </div>
        </div>

        <div style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F1F5F9', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #9333EA, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Top Hosts
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px' }}>
            {Object.entries(kpis.visitsPerHost).sort((a, b) => b[1].count - a[1].count).slice(0, 3).map(([hostId, data], index) => {
              const maxCount = Math.max(...Object.values(kpis.visitsPerHost).map(v => v.count))
              const percentage = maxCount > 0 ? (data.count / maxCount) * 100 : 0
              const circumference = 2 * Math.PI * 70
              const strokeDashoffset = circumference - (percentage / 100) * circumference
              const colors = ['#3B82F6', '#8B5CF6', '#EC4899']
              const color = colors[index % colors.length]
              
              return (
                <div key={hostId} style={{ position: 'relative' }}>
                  <svg style={{ width: '192px', height: '192px', transform: 'rotate(-90deg)' }} viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <circle cx="80" cy="80" r="70" fill="none" stroke={color} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dashoffset 1s ease-out' }} />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#F1F5F9', marginBottom: '4px' }}>{data.count}</div>
                    <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '500' }}>{data.name.split(' ')[0]}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{data.count} visits</div>
                  </div>
                </div>
              )
            })}
            {Object.keys(kpis.visitsPerHost).length === 0 && <p style={{ color: '#64748B', textAlign: 'center', padding: '32px 0' }}>No data available</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
