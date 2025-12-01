'use client'

import React, { useMemo } from 'react'
import { Invitation } from '../context/GlobalStateContext'

interface VisitorDashboardProps {
  invitations: Invitation[]
  startDate: string
  endDate: string
  searchTerm: string
}

export default function VisitorDashboardModern({ invitations, startDate, endDate, searchTerm }: VisitorDashboardProps) {
  // Filter invitations
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

  // Calculate KPIs
  const kpis = useMemo(() => {
    const sites = [...new Set(filteredInvitations.map(i => i.location))]
    const hosts = [...new Set(filteredInvitations.map(i => i.hostId))]
    
    const visitsPerSite: Record<string, number> = {}
    sites.forEach(site => {
      visitsPerSite[site] = filteredInvitations.filter(i => i.location === site).length
    })
    
    const visitsPerHost: Record<string, number> = {}
    hosts.forEach(host => {
      visitsPerHost[host] = filteredInvitations.filter(i => i.hostId === host).length
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

  // Circular progress component
  const CircularProgress = ({ value, max, color, label, subLabel }: { value: number; max: number; color: string; label: string; subLabel: string }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0
    const circumference = 2 * Math.PI * 70
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative group">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white mb-1">{value}</div>
          <div className="text-sm text-gray-400 font-medium">{label}</div>
          <div className="text-xs text-gray-500">{subLabel}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Visitor Management</h2>
            <p className="text-gray-400 text-sm">Real-time visitor analytics and insights</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Visits - Glowing Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-sm border border-blue-500/20 p-6 shadow-2xl group hover:shadow-blue-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.totalVisits}</div>
            </div>
            <div className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Total Visits</div>
            <div className="text-xs text-gray-500 mt-1">In selected period</div>
          </div>
        </div>

        {/* Lead Time */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-sm border border-purple-500/20 p-6 shadow-2xl group hover:shadow-purple-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.avgLeadTime}</div>
            </div>
            <div className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Avg Lead Time</div>
            <div className="text-xs text-gray-500 mt-1">Time in building</div>
          </div>
        </div>

        {/* No-Show Rate */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600/20 to-red-900/20 backdrop-blur-sm border border-orange-500/20 p-6 shadow-2xl group hover:shadow-orange-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.noShowRate}%</div>
            </div>
            <div className="text-sm font-semibold text-orange-300 uppercase tracking-wider">No-Show Rate</div>
            <div className="text-xs text-gray-500 mt-1">Did not appear</div>
          </div>
        </div>

        {/* Active Sites */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600/20 to-cyan-900/20 backdrop-blur-sm border border-cyan-500/20 p-6 shadow-2xl group hover:shadow-cyan-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.sites.length}</div>
            </div>
            <div className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Active Sites</div>
            <div className="text-xs text-gray-500 mt-1">With visits</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits per Site - Modern Bars */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Visits per Site
          </h3>
          <div className="space-y-5">
            {Object.entries(kpis.visitsPerSite).map(([site, count]) => {
              const percentage = kpis.totalVisits > 0 ? (count / kpis.totalVisits) * 100 : 0
              return (
                <div key={site} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 font-medium">{site}</span>
                    <span className="text-white font-bold">{count} visits</span>
                  </div>
                  <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%`, boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}
                    />
                  </div>
                </div>
              )
            })}
            {Object.keys(kpis.visitsPerSite).length === 0 && (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Top Hosts - Circular Progress */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Top Hosts
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {Object.entries(kpis.visitsPerHost)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([hostId, count]) => {
                const maxCount = Math.max(...Object.values(kpis.visitsPerHost))
                const invitation = filteredInvitations.find(i => i.hostId === hostId)
                const hostName = invitation?.hostName || hostId
                const colors = ['#3B82F6', '#8B5CF6', '#EC4899']
                const colorIndex = Object.keys(kpis.visitsPerHost).sort((a, b) => kpis.visitsPerHost[b] - kpis.visitsPerHost[a]).indexOf(hostId)
                
                return (
                  <CircularProgress
                    key={hostId}
                    value={count}
                    max={maxCount}
                    color={colors[colorIndex % colors.length]}
                    label={hostName.split(' ')[0]}
                    subLabel={`${count} visits`}
                  />
                )
              })}
            {Object.keys(kpis.visitsPerHost).length === 0 && (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
