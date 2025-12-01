'use client'

import React, { useState, useMemo } from 'react'
import { Invitation } from '../context/GlobalStateContext'
import { CalendarRegular, FilterRegular, ArrowDownloadRegular, SearchRegular } from '@fluentui/react-icons'

interface VisitorDashboardProps {
  invitations: Invitation[]
  tenantId: string
}

export default function VisitorDashboard({ invitations, tenantId }: VisitorDashboardProps) {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [siteFilter, setSiteFilter] = useState<string>('all')

  // Filter invitations based on date range and search
  const filteredInvitations = useMemo(() => {
    return invitations.filter(inv => {
      // Date filter
      if (startDate && new Date(inv.visitDate) < new Date(startDate)) return false
      if (endDate && new Date(inv.visitDate) > new Date(endDate)) return false
      
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        if (!inv.visitorName.toLowerCase().includes(search) &&
            !inv.hostName.toLowerCase().includes(search) &&
            !inv.location.toLowerCase().includes(search)) {
          return false
        }
      }
      
      // Site filter
      if (siteFilter !== 'all' && inv.location !== siteFilter) return false
      
      return true
    })
  }, [invitations, startDate, endDate, searchTerm, siteFilter])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const sites = [...new Set(filteredInvitations.map(i => i.location))]
    const hosts = [...new Set(filteredInvitations.map(i => i.hostId))]
    
    // Visits per site
    const visitsPerSite: Record<string, number> = {}
    sites.forEach(site => {
      visitsPerSite[site] = filteredInvitations.filter(i => i.location === site).length
    })
    
    // Visits per host
    const visitsPerHost: Record<string, number> = {}
    hosts.forEach(host => {
      visitsPerHost[host] = filteredInvitations.filter(i => i.hostId === host).length
    })
    
    // Lead time (mock - assuming average time spent is 2-4 hours)
    // In real implementation, this would be calculated from entrance/exit timestamps
    const avgLeadTime = '2.5 hrs'
    
    // No-show rate (assuming 'rejected' or 'pending' past date are no-shows)
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

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Visitor Name', 'Email', 'Company', 'Host', 'Visit Date', 'Visit Time', 'Location', 'Purpose', 'Status']
    const rows = filteredInvitations.map(inv => [
      inv.visitorName,
      inv.visitorEmail,
      inv.visitorCompany || '',
      inv.hostName,
      inv.visitDate,
      inv.visitTime,
      inv.location,
      inv.purpose,
      inv.status
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visitor-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export to XLS (using CSV format with .xls extension for simplicity)
  const exportToXLS = () => {
    const headers = ['Visitor Name', 'Email', 'Company', 'Host', 'Visit Date', 'Visit Time', 'Location', 'Purpose', 'Status']
    const rows = filteredInvitations.map(inv => [
      inv.visitorName,
      inv.visitorEmail,
      inv.visitorCompany || '',
      inv.hostName,
      inv.visitDate,
      inv.visitTime,
      inv.location,
      inv.purpose,
      inv.status
    ])
    
    const csvContent = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visitor-report-${new Date().toISOString().split('T')[0]}.xls`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const allSites = [...new Set(invitations.map(i => i.location))]

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <CalendarRegular className="text-white" fontSize={24} />
        </div>
        Visitor Management Dashboard
      </h2>

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
          <div className="relative">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search visitors..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Site Filter</label>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sites</option>
            {allSites.map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowDownloadRegular fontSize={18} />
          Export CSV
        </button>
        <button
          onClick={exportToXLS}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowDownloadRegular fontSize={18} />
          Export XLS
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Visits */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-300 uppercase tracking-wide">Total Visits</h3>
            <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
              <CalendarRegular className="text-blue-400" fontSize={20} />
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.totalVisits}</div>
          <p className="text-sm text-gray-400">In selected period</p>
        </div>

        {/* Average Lead Time */}
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wide">Avg Lead Time</h3>
            <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.avgLeadTime}</div>
          <p className="text-sm text-gray-400">Time in building</p>
        </div>

        {/* No-Show Rate */}
        <div className="bg-gradient-to-br from-orange-600/20 to-red-800/20 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-orange-300 uppercase tracking-wide">No-Show Rate</h3>
            <div className="w-10 h-10 bg-orange-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.noShowRate}%</div>
          <p className="text-sm text-gray-400">Didn't appear</p>
        </div>

        {/* Unique Sites */}
        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-cyan-300 uppercase tracking-wide">Active Sites</h3>
            <div className="w-10 h-10 bg-cyan-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.sites.length}</div>
          <p className="text-sm text-gray-400">With visits</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits per Site */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Visits per Site</h3>
          <div className="space-y-3">
            {Object.entries(kpis.visitsPerSite).map(([site, count]) => {
              const percentage = kpis.totalVisits > 0 ? (count / kpis.totalVisits) * 100 : 0
              return (
                <div key={site}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{site}</span>
                    <span className="text-white font-semibold">{count} visits</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {Object.keys(kpis.visitsPerSite).length === 0 && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Visits per Host (Top 5) */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Top Hosts by Visits</h3>
          <div className="space-y-3">
            {Object.entries(kpis.visitsPerHost)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([hostId, count]) => {
                const maxCount = Math.max(...Object.values(kpis.visitsPerHost))
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                const invitation = filteredInvitations.find(i => i.hostId === hostId)
                const hostName = invitation?.hostName || hostId
                
                return (
                  <div key={hostId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{hostName}</span>
                      <span className="text-white font-semibold">{count} visits</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            {Object.keys(kpis.visitsPerHost).length === 0 && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
