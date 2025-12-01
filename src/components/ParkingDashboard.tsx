'use client'

import React, { useState, useMemo } from 'react'
import { ParkingSpace } from '../context/GlobalStateContext'
import { VehicleCarRegular, ArrowDownloadRegular, SearchRegular } from '@fluentui/react-icons'

interface ParkingDashboardProps {
  parkingSpaces: ParkingSpace[]
  tenantId: string
}

export default function ParkingDashboard({ parkingSpaces }: ParkingDashboardProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [buildingFilter, setBuildingFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter parking spaces
  const filteredSpaces = useMemo(() => {
    return parkingSpaces.filter(space => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        if (!space.spaceNumber.toLowerCase().includes(search) &&
            !space.building.toLowerCase().includes(search) &&
            !(space.assignedToName || '').toLowerCase().includes(search)) {
          return false
        }
      }
      
      // Building filter
      if (buildingFilter !== 'all' && space.building !== buildingFilter) return false
      
      // Status filter
      if (statusFilter !== 'all' && space.status !== statusFilter) return false
      
      return true
    })
  }, [parkingSpaces, searchTerm, buildingFilter, statusFilter])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalSpaces = filteredSpaces.length
    const activeSpaces = filteredSpaces.length // All spaces are active (no maintenance status for parking)
    const occupiedSpaces = filteredSpaces.filter(s => s.status === 'occupied').length
    const availableSpaces = filteredSpaces.filter(s => s.status === 'available').length
    const guestSpaces = filteredSpaces.filter(s => s.isReservedForVisitor).length
    const guestOccupied = filteredSpaces.filter(s => s.isReservedForVisitor && s.status === 'occupied').length
    
    // Utilization rate
    const utilizationRate = activeSpaces > 0 ? ((occupiedSpaces / activeSpaces) * 100).toFixed(1) : '0.0'
    
    // Guest parking utilization
    const guestUtilization = guestSpaces > 0 ? ((guestOccupied / guestSpaces) * 100).toFixed(1) : '0.0'
    
    // Special spaces breakdown
    const electricSpaces = filteredSpaces.filter(s => s.isElectric).length
    const disabledSpaces = filteredSpaces.filter(s => s.isDisabled).length
    const vipSpaces = filteredSpaces.filter(s => s.isVIP).length
    
    // Building breakdown
    const buildings = [...new Set(filteredSpaces.map(s => s.building))]
    const spacesByBuilding: Record<string, { total: number; occupied: number }> = {}
    buildings.forEach(building => {
      const buildingSpaces = filteredSpaces.filter(s => s.building === building)
      spacesByBuilding[building] = {
        total: buildingSpaces.length,
        occupied: buildingSpaces.filter(s => s.status === 'occupied').length
      }
    })
    
    return {
      totalSpaces,
      activeSpaces,
      occupiedSpaces,
      availableSpaces,
      utilizationRate,
      guestSpaces,
      guestOccupied,
      guestUtilization,
      electricSpaces,
      disabledSpaces,
      vipSpaces,
      spacesByBuilding,
      buildings
    }
  }, [filteredSpaces])

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Space Number', 'Name', 'Building', 'Location', 'Status', 'Assigned To', 'Vehicle Plate', 'Electric', 'Disabled', 'VIP', 'Guest']
    const rows = filteredSpaces.map(space => [
      space.spaceNumber,
      space.name || '',
      space.building,
      space.location,
      space.status,
      space.assignedToName || '',
      space.vehiclePlate || '',
      space.isElectric ? 'Yes' : 'No',
      space.isDisabled ? 'Yes' : 'No',
      space.isVIP ? 'Yes' : 'No',
      space.isReservedForVisitor ? 'Yes' : 'No'
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `parking-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export to XLS
  const exportToXLS = () => {
    const headers = ['Space Number', 'Name', 'Building', 'Location', 'Status', 'Assigned To', 'Vehicle Plate', 'Electric', 'Disabled', 'VIP', 'Guest']
    const rows = filteredSpaces.map(space => [
      space.spaceNumber,
      space.name || '',
      space.building,
      space.location,
      space.status,
      space.assignedToName || '',
      space.vehiclePlate || '',
      space.isElectric ? 'Yes' : 'No',
      space.isDisabled ? 'Yes' : 'No',
      space.isVIP ? 'Yes' : 'No',
      space.isReservedForVisitor ? 'Yes' : 'No'
    ])
    
    const csvContent = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `parking-report-${new Date().toISOString().split('T')[0]}.xls`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const allBuildings = [...new Set(parkingSpaces.map(s => s.building))]

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-900/20 to-blue-900/20 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <VehicleCarRegular className="text-white" fontSize={24} />
        </div>
        Parking Dashboard
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
              placeholder="Search spaces..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Building Filter</label>
          <select
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Buildings</option>
            {allBuildings.map(building => (
              <option key={building} value={building}>{building}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
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
        {/* Active Parking Slots */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wide">Active Slots</h3>
            <div className="w-10 h-10 bg-indigo-500/30 rounded-lg flex items-center justify-center">
              <VehicleCarRegular className="text-indigo-400" fontSize={20} />
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.activeSpaces}</div>
          <p className="text-sm text-gray-400">Out of {kpis.totalSpaces} total</p>
        </div>

        {/* Average Utilization */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-300 uppercase tracking-wide">Utilization</h3>
            <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.utilizationRate}%</div>
          <p className="text-sm text-gray-400">{kpis.occupiedSpaces} occupied</p>
        </div>

        {/* Guest Parking */}
        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-cyan-300 uppercase tracking-wide">Guest Parking</h3>
            <div className="w-10 h-10 bg-cyan-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.guestSpaces}</div>
          <p className="text-sm text-gray-400">{kpis.guestUtilization}% utilized</p>
        </div>

        {/* Available Spaces */}
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-green-300 uppercase tracking-wide">Available</h3>
            <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{kpis.availableSpaces}</div>
          <p className="text-sm text-gray-400">Ready to use</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Utilization by Building */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Utilization by Building</h3>
          <div className="space-y-3">
            {Object.entries(kpis.spacesByBuilding).map(([building, data]) => {
              const utilization = data.total > 0 ? (data.occupied / data.total) * 100 : 0
              return (
                <div key={building}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{building}</span>
                    <span className="text-white font-semibold">{data.occupied}/{data.total} ({utilization.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-indigo-500/50"
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {Object.keys(kpis.spacesByBuilding).length === 0 && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Special Parking Types */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Special Parking Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-300 font-medium">Electric Charging</span>
              </div>
              <span className="text-2xl font-bold text-white">{kpis.electricSpaces}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-gray-300 font-medium">Disabled Access</span>
              </div>
              <span className="text-2xl font-bold text-white">{kpis.disabledSpaces}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <span className="text-gray-300 font-medium">VIP Parking</span>
              </div>
              <span className="text-2xl font-bold text-white">{kpis.vipSpaces}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution Circular Chart (Visual) */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Parking Status Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="12"
                  strokeDasharray={`${(kpis.availableSpaces / kpis.totalSpaces) * 351.86} 351.86`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{kpis.availableSpaces}</span>
              </div>
            </div>
            <p className="text-green-400 font-semibold">Available</p>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="12"
                  strokeDasharray={`${(kpis.occupiedSpaces / kpis.totalSpaces) * 351.86} 351.86`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{kpis.occupiedSpaces}</span>
              </div>
            </div>
            <p className="text-red-400 font-semibold">Occupied</p>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="12"
                  strokeDasharray={`${((kpis.totalSpaces - kpis.availableSpaces - kpis.occupiedSpaces) / kpis.totalSpaces) * 351.86} 351.86`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{kpis.totalSpaces - kpis.availableSpaces - kpis.occupiedSpaces}</span>
              </div>
            </div>
            <p className="text-blue-400 font-semibold">Reserved</p>
          </div>
        </div>
      </div>
    </div>
  )
}
