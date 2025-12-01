'use client'

import React, { useState, useMemo } from 'react'
import { Locker } from '../context/GlobalStateContext'
import { ArrowDownloadRegular, SearchRegular } from '@fluentui/react-icons'

interface LockerDashboardProps {
  lockers: Locker[]
  tenantId: string
}

export default function LockerDashboard({ lockers }: LockerDashboardProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [buildingFilter, setBuildingFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter lockers
  const filteredLockers = useMemo(() => {
    return lockers.filter(locker => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        if (!locker.lockerNumber.toLowerCase().includes(search) &&
            !locker.building.toLowerCase().includes(search) &&
            !(locker.assignedToName || '').toLowerCase().includes(search)) {
          return false
        }
      }
      
      // Building filter
      if (buildingFilter !== 'all' && locker.building !== buildingFilter) return false
      
      // Type filter
      if (typeFilter !== 'all' && locker.type !== typeFilter) return false
      
      // Status filter
      if (statusFilter !== 'all' && locker.status !== statusFilter) return false
      
      return true
    })
  }, [lockers, searchTerm, buildingFilter, typeFilter, statusFilter])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalLockers = filteredLockers.length
    const activeLockers = filteredLockers.filter(l => l.status !== 'maintenance').length
    const occupiedLockers = filteredLockers.filter(l => l.status === 'occupied').length
    const availableLockers = filteredLockers.filter(l => l.status === 'available').length
    
    // Utilization rate
    const utilizationRate = activeLockers > 0 ? ((occupiedLockers / activeLockers) * 100).toFixed(1) : '0.0'
    
    // Utilization by type
    const types: Array<'permanent' | 'gym' | 'bike' | 'temporary' | 'storage'> = ['permanent', 'gym', 'bike', 'temporary', 'storage']
    const utilizationByType: Record<string, { total: number; occupied: number; utilization: string }> = {}
    
    types.forEach(type => {
      const typeLockers = filteredLockers.filter(l => l.type === type)
      const typeOccupied = typeLockers.filter(l => l.status === 'occupied').length
      const typeActive = typeLockers.filter(l => l.status !== 'maintenance').length
      utilizationByType[type] = {
        total: typeLockers.length,
        occupied: typeOccupied,
        utilization: typeActive > 0 ? ((typeOccupied / typeActive) * 100).toFixed(1) : '0.0'
      }
    })
    
    // Mock opening statistics (in real system, this would track locker access events)
    const mockOpeningsToday = Math.floor(occupiedLockers * 2.5) // Assume each occupied locker opened ~2.5 times
    const mockOpeningsWeek = mockOpeningsToday * 7
    
    // Building breakdown
    const buildings = [...new Set(filteredLockers.map(l => l.building))]
    const lockersByBuilding: Record<string, { total: number; occupied: number }> = {}
    buildings.forEach(building => {
      const buildingLockers = filteredLockers.filter(l => l.building === building)
      lockersByBuilding[building] = {
        total: buildingLockers.length,
        occupied: buildingLockers.filter(l => l.status === 'occupied').length
      }
    })
    
    return {
      totalLockers,
      activeLockers,
      occupiedLockers,
      availableLockers,
      utilizationRate,
      utilizationByType,
      mockOpeningsToday,
      mockOpeningsWeek,
      lockersByBuilding,
      buildings
    }
  }, [filteredLockers])

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Locker Number', 'Name', 'Building', 'Floor', 'Zone', 'Type', 'Status', 'Assigned To']
    const rows = filteredLockers.map(locker => [
      locker.lockerNumber,
      locker.name || '',
      locker.building,
      locker.floor,
      locker.zone || '',
      locker.type,
      locker.status,
      locker.assignedToName || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `locker-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export to XLS
  const exportToXLS = () => {
    const headers = ['Locker Number', 'Name', 'Building', 'Floor', 'Zone', 'Type', 'Status', 'Assigned To']
    const rows = filteredLockers.map(locker => [
      locker.lockerNumber,
      locker.name || '',
      locker.building,
      locker.floor,
      locker.zone || '',
      locker.type,
      locker.status,
      locker.assignedToName || ''
    ])
    
    const csvContent = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `locker-report-${new Date().toISOString().split('T')[0]}.xls`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const allBuildings = [...new Set(lockers.map(l => l.building))]

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900/20 to-pink-900/20 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        Locker Dashboard
      </h2>

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
          <div className="relative">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search lockers..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Building</label>
          <select
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Buildings</option>
            {allBuildings.map(building => (
              <option key={building} value={building}>{building}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="permanent">Permanent</option>
            <option value="gym">Gym</option>
            <option value="bike">Bike</option>
            <option value="temporary">Temporary</option>
            <option value="storage">Storage</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Maintenance</option>
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
        {/* Active Lockers */}
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wide">Active Lockers</h3>
            <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.activeLockers}</div>
          <p className="text-sm text-gray-400">Out of {kpis.totalLockers} total</p>
        </div>

        {/* Overall Utilization */}
        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 backdrop-blur-sm border border-pink-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-pink-300 uppercase tracking-wide">Utilization</h3>
            <div className="w-10 h-10 bg-pink-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.utilizationRate}%</div>
          <p className="text-sm text-gray-400">{kpis.occupiedLockers} occupied</p>
        </div>

        {/* Openings Today */}
        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-cyan-300 uppercase tracking-wide">Openings Today</h3>
            <div className="w-10 h-10 bg-cyan-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.mockOpeningsToday}</div>
          <p className="text-sm text-gray-400">Access events</p>
        </div>

        {/* Available Lockers */}
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-green-300 uppercase tracking-wide">Available</h3>
            <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.availableLockers}</div>
          <p className="text-sm text-gray-400">Ready to assign</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization by Type */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Utilization by Locker Type</h3>
          <div className="space-y-3">
            {Object.entries(kpis.utilizationByType)
              .filter(([_, data]) => data.total > 0)
              .map(([type, data]) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 capitalize">{type}</span>
                    <span className="text-white font-semibold">{data.occupied}/{data.total} ({data.utilization}%)</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50"
                      style={{ width: `${data.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            {Object.values(kpis.utilizationByType).every(data => data.total === 0) && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Lockers by Building */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Lockers by Building</h3>
          <div className="space-y-3">
            {Object.entries(kpis.lockersByBuilding).map(([building, data]) => {
              const utilization = data.total > 0 ? (data.occupied / data.total) * 100 : 0
              return (
                <div key={building}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{building}</span>
                    <span className="text-white font-semibold">{data.occupied}/{data.total} ({utilization.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/50"
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {Object.keys(kpis.lockersByBuilding).length === 0 && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
