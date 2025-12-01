'use client'

import React, { useState, useMemo } from 'react'
import { Badge } from '../context/GlobalStateContext'
import { ArrowDownloadRegular, SearchRegular } from '@fluentui/react-icons'

interface BadgesDashboardProps {
  badges: Badge[]
  tenantId: string
}

export default function BadgesDashboard({ badges }: BadgesDashboardProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [cardTypeFilter, setCardTypeFilter] = useState<string>('all')

  // Filter badges
  const filteredBadges = useMemo(() => {
    return badges.filter(badge => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        if (!badge.name.toLowerCase().includes(search) &&
            !badge.email.toLowerCase().includes(search) &&
            !badge.company.toLowerCase().includes(search)) {
          return false
        }
      }
      
      // Status filter
      if (statusFilter !== 'all' && badge.status !== statusFilter) return false
      
      // Card type filter
      if (cardTypeFilter !== 'all' && badge.cardType !== cardTypeFilter) return false
      
      return true
    })
  }, [badges, searchTerm, statusFilter, cardTypeFilter])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalBadges = filteredBadges.length
    const activeBadges = filteredBadges.filter(b => b.status === 'Downloaded' || b.status === 'Sent').length
    const newBadges = filteredBadges.filter(b => b.status === 'New').length
    const suspendedBadges = filteredBadges.filter(b => b.status === 'Suspended').length
    
    // Mock swipes per day (in real implementation, would be from actual badge swipe events)
    // Assuming active badges swipe 3-5 times per day on average
    const avgSwipesPerBadge = 4
    const swipesPerDay = activeBadges * avgSwipesPerBadge
    
    // Inactive/unused badges (New or Suspended status for more than 30 days)
    const inactiveBadges = newBadges + suspendedBadges
    const inactiveRate = totalBadges > 0 ? ((inactiveBadges / totalBadges) * 100).toFixed(1) : '0.0'
    
    // Badge distribution by status
    const statusDistribution: Record<string, number> = {
      'New': filteredBadges.filter(b => b.status === 'New').length,
      'Sent': filteredBadges.filter(b => b.status === 'Sent').length,
      'Downloaded': filteredBadges.filter(b => b.status === 'Downloaded').length,
      'Suspended': filteredBadges.filter(b => b.status === 'Suspended').length
    }
    
    // Badge distribution by card type
    const cardTypes = [...new Set(filteredBadges.map(b => b.cardType))]
    const cardTypeDistribution: Record<string, number> = {}
    cardTypes.forEach(type => {
      cardTypeDistribution[type] = filteredBadges.filter(b => b.cardType === type).length
    })
    
    // Company breakdown (top 5)
    const companies = [...new Set(filteredBadges.map(b => b.company))]
    const badgesByCompany: Record<string, number> = {}
    companies.forEach(company => {
      badgesByCompany[company] = filteredBadges.filter(b => b.company === company).length
    })
    
    return {
      totalBadges,
      activeBadges,
      newBadges,
      suspendedBadges,
      inactiveBadges,
      inactiveRate,
      swipesPerDay,
      statusDistribution,
      cardTypeDistribution,
      badgesByCompany,
      cardTypes
    }
  }, [filteredBadges])

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Department', 'Card Type', 'IMEI', 'Status', 'Created At']
    const rows = filteredBadges.map(badge => [
      badge.name,
      badge.email,
      badge.company,
      badge.department || '',
      badge.cardType,
      badge.imei,
      badge.status,
      badge.createdAt
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `badges-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export to XLS
  const exportToXLS = () => {
    const headers = ['Name', 'Email', 'Company', 'Department', 'Card Type', 'IMEI', 'Status', 'Created At']
    const rows = filteredBadges.map(badge => [
      badge.name,
      badge.email,
      badge.company,
      badge.department || '',
      badge.cardType,
      badge.imei,
      badge.status,
      badge.createdAt
    ])
    
    const csvContent = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `badges-report-${new Date().toISOString().split('T')[0]}.xls`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const allCardTypes = [...new Set(badges.map(b => b.cardType))]

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-emerald-900/20 to-teal-900/20 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        </div>
        Digital Badges Dashboard
      </h2>

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
          <div className="relative">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search badges..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Sent">Sent</option>
            <option value="Downloaded">Downloaded</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Card Type</label>
          <select
            value={cardTypeFilter}
            onChange={(e) => setCardTypeFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Types</option>
            {allCardTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={exportToCSV}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowDownloadRegular fontSize={18} />
            CSV
          </button>
          <button
            onClick={exportToXLS}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowDownloadRegular fontSize={18} />
            XLS
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Badges */}
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-emerald-300 uppercase tracking-wide">Active Badges</h3>
            <div className="w-10 h-10 bg-emerald-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.activeBadges}</div>
          <p className="text-sm text-gray-400">Out of {kpis.totalBadges} total</p>
        </div>

        {/* Swipes Per Day */}
        <div className="bg-gradient-to-br from-teal-600/20 to-teal-800/20 backdrop-blur-sm border border-teal-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-teal-300 uppercase tracking-wide">Swipes/Day</h3>
            <div className="w-10 h-10 bg-teal-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.swipesPerDay}</div>
          <p className="text-sm text-gray-400">Average daily</p>
        </div>

        {/* Inactive Badges */}
        <div className="bg-gradient-to-br from-orange-600/20 to-red-800/20 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-orange-300 uppercase tracking-wide">Inactive</h3>
            <div className="w-10 h-10 bg-orange-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.inactiveBadges}</div>
          <p className="text-sm text-gray-400">{kpis.inactiveRate}% of total</p>
        </div>

        {/* New Badges */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-300 uppercase tracking-wide">New Badges</h3>
            <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.newBadges}</div>
          <p className="text-sm text-gray-400">Pending distribution</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Distribution */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Badge Status Distribution</h3>
          <div className="space-y-3">
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
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{status}</span>
                      <span className="text-white font-semibold">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${colors[status] || 'from-gray-500 to-gray-600'} h-full rounded-full transition-all duration-500 shadow-lg`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            {Object.values(kpis.statusDistribution).every(count => count === 0) && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Top Companies by Badge Count */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Top Companies by Badge Count</h3>
          <div className="space-y-3">
            {Object.entries(kpis.badgesByCompany)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([company, count]) => {
                const maxCount = Math.max(...Object.values(kpis.badgesByCompany))
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                return (
                  <div key={company}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{company}</span>
                      <span className="text-white font-semibold">{count} badges</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-emerald-500/50"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            {Object.keys(kpis.badgesByCompany).length === 0 && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Card Type Distribution */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Badge Types Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(kpis.cardTypeDistribution).map(([type, count]) => {
            const percentage = kpis.totalBadges > 0 ? ((count / kpis.totalBadges) * 100).toFixed(1) : '0.0'
            return (
              <div key={type} className="bg-slate-700/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">{count}</div>
                <div className="text-sm text-gray-400 mb-2">{type}</div>
                <div className="text-xs text-emerald-400 font-semibold">{percentage}%</div>
              </div>
            )
          })}
          {Object.keys(kpis.cardTypeDistribution).length === 0 && (
            <p className="text-gray-500 text-center py-4 col-span-full">No data available</p>
          )}
        </div>
      </div>
    </div>
  )
}
