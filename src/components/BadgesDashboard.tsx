'use client'

import React, { useMemo } from 'react'
import { Badge } from '../context/GlobalStateContext'

interface BadgesDashboardProps {
  badges: Badge[]
  searchTerm: string
}

export default function BadgesDashboard({ badges, searchTerm }: BadgesDashboardProps) {
  const filteredBadges = useMemo(() => {
    return badges.filter(badge => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        if (!badge.name.toLowerCase().includes(search) &&
            !badge.email.toLowerCase().includes(search) &&
            !badge.company.toLowerCase().includes(search)) {
          return false
        }
      }
      return true
    })
  }, [badges, searchTerm])

  const kpis = useMemo(() => {
    const totalBadges = filteredBadges.length
    const activeBadges = filteredBadges.filter(b => b.status === 'Downloaded' || b.status === 'Sent').length
    const newBadges = filteredBadges.filter(b => b.status === 'New').length
    const suspendedBadges = filteredBadges.filter(b => b.status === 'Suspended').length
    const swipesPerDay = activeBadges * 4
    const inactiveBadges = newBadges + suspendedBadges
    const inactiveRate = totalBadges > 0 ? ((inactiveBadges / totalBadges) * 100).toFixed(1) : '0.0'
    
    const statusDistribution: Record<string, number> = {
      'New': filteredBadges.filter(b => b.status === 'New').length,
      'Sent': filteredBadges.filter(b => b.status === 'Sent').length,
      'Downloaded': filteredBadges.filter(b => b.status === 'Downloaded').length,
      'Suspended': filteredBadges.filter(b => b.status === 'Suspended').length
    }
    
    return { totalBadges, activeBadges, newBadges, inactiveBadges, inactiveRate, swipesPerDay, statusDistribution }
  }, [filteredBadges])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-600/10 via-teal-600/10 to-cyan-600/10 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Digital Badges</h2>
            <p className="text-gray-400 text-sm">Badge distribution and usage analytics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 backdrop-blur-sm border border-emerald-500/20 p-6 shadow-2xl group hover:shadow-emerald-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.activeBadges}</div>
            </div>
            <div className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Active Badges</div>
            <div className="text-xs text-gray-500 mt-1">Out of {kpis.totalBadges} total</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600/20 to-teal-900/20 backdrop-blur-sm border border-teal-500/20 p-6 shadow-2xl group hover:shadow-teal-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.swipesPerDay}</div>
            </div>
            <div className="text-sm font-semibold text-teal-300 uppercase tracking-wider">Swipes/Day</div>
            <div className="text-xs text-gray-500 mt-1">Average daily</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600/20 to-red-900/20 backdrop-blur-sm border border-orange-500/20 p-6 shadow-2xl group hover:shadow-orange-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.inactiveBadges}</div>
            </div>
            <div className="text-sm font-semibold text-orange-300 uppercase tracking-wider">Inactive</div>
            <div className="text-xs text-gray-500 mt-1">{kpis.inactiveRate}% of total</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-sm border border-blue-500/20 p-6 shadow-2xl group hover:shadow-blue-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.newBadges}</div>
            </div>
            <div className="text-sm font-semibold text-blue-300 uppercase tracking-wider">New Badges</div>
            <div className="text-xs text-gray-500 mt-1">Pending distribution</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          Badge Status Distribution
        </h3>
        <div className="space-y-5">
          {Object.entries(kpis.statusDistribution)
            .filter(([_, count]) => count > 0)
            .map(([status, count]) => {
              const percentage = kpis.totalBadges > 0 ? (count / kpis.totalBadges) * 100 : 0
              const colors: Record<string, string> = {
                'New': 'from-blue-500 to-blue-600',
                'Sent': 'from-yellow-500 to-yellow-600',
                'Downloaded': 'from-green-500 to-green-600',
                'Suspended': 'from-red-500 to-red-600'
              }
              const shadowColors: Record<string, string> = {
                'New': 'rgba(59, 130, 246, 0.5)',
                'Sent': 'rgba(234, 179, 8, 0.5)',
                'Downloaded': 'rgba(34, 197, 94, 0.5)',
                'Suspended': 'rgba(239, 68, 68, 0.5)'
              }
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 font-medium">{status}</span>
                    <span className="text-white font-bold">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[status]} rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%`, boxShadow: `0 0 20px ${shadowColors[status]}` }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
