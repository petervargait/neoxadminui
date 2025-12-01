'use client'

import React, { useMemo } from 'react'
import { ParkingSpace } from '../context/GlobalStateContext'

interface ParkingDashboardProps {
  parkingSpaces: ParkingSpace[]
  searchTerm: string
}

export default function ParkingDashboard({ parkingSpaces, searchTerm }: ParkingDashboardProps) {
  const filteredSpaces = useMemo(() => {
    return parkingSpaces.filter(space => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        if (!space.spaceNumber.toLowerCase().includes(search) &&
            !space.building.toLowerCase().includes(search) &&
            !(space.assignedToName || '').toLowerCase().includes(search)) {
          return false
        }
      }
      return true
    })
  }, [parkingSpaces, searchTerm])

  const kpis = useMemo(() => {
    const totalSpaces = filteredSpaces.length
    const occupiedSpaces = filteredSpaces.filter(s => s.status === 'occupied').length
    const availableSpaces = filteredSpaces.filter(s => s.status === 'available').length
    const guestSpaces = filteredSpaces.filter(s => s.isReservedForVisitor).length
    const utilizationRate = totalSpaces > 0 ? ((occupiedSpaces / totalSpaces) * 100).toFixed(1) : '0.0'
    
    const buildings = [...new Set(filteredSpaces.map(s => s.building))]
    const spacesByBuilding: Record<string, { total: number; occupied: number }> = {}
    buildings.forEach(building => {
      const buildingSpaces = filteredSpaces.filter(s => s.building === building)
      spacesByBuilding[building] = {
        total: buildingSpaces.length,
        occupied: buildingSpaces.filter(s => s.status === 'occupied').length
      }
    })
    
    return { totalSpaces, occupiedSpaces, availableSpaces, guestSpaces, utilizationRate, spacesByBuilding }
  }, [filteredSpaces])

  const CircularProgress = ({ percentage, size = 160, strokeWidth = 14, color }: { percentage: number; size?: number; strokeWidth?: number; color: string }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        />
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600/10 via-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Parking Management</h2>
            <p className="text-gray-400 text-sm">Live parking availability and utilization</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 backdrop-blur-sm border border-indigo-500/20 p-6 shadow-2xl group hover:shadow-indigo-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.totalSpaces}</div>
            </div>
            <div className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">Total Spaces</div>
            <div className="text-xs text-gray-500 mt-1">In all buildings</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600/20 to-green-900/20 backdrop-blur-sm border border-green-500/20 p-6 shadow-2xl group hover:shadow-green-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.availableSpaces}</div>
            </div>
            <div className="text-sm font-semibold text-green-300 uppercase tracking-wider">Available</div>
            <div className="text-xs text-gray-500 mt-1">Ready to use</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-sm border border-blue-500/20 p-6 shadow-2xl group hover:shadow-blue-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.guestSpaces}</div>
            </div>
            <div className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Guest Parking</div>
            <div className="text-xs text-gray-500 mt-1">Reserved for visitors</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-sm border border-purple-500/20 p-6 shadow-2xl group hover:shadow-purple-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.utilizationRate}%</div>
            </div>
            <div className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Utilization</div>
            <div className="text-xs text-gray-500 mt-1">{kpis.occupiedSpaces} occupied</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            Utilization by Building
          </h3>
          <div className="space-y-5">
            {Object.entries(kpis.spacesByBuilding).map(([building, data]) => {
              const utilization = data.total > 0 ? (data.occupied / data.total) * 100 : 0
              return (
                <div key={building}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 font-medium">{building}</span>
                    <span className="text-white font-bold">{data.occupied}/{data.total} ({utilization.toFixed(0)}%)</span>
                  </div>
                  <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${utilization}%`, boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            Space Distribution
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <CircularProgress percentage={parseFloat(kpis.utilizationRate)} size={200} strokeWidth={18} color="url(#gradient)" />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-black text-white mb-1">{kpis.utilizationRate}%</div>
                <div className="text-sm text-gray-400 font-medium">Occupied</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
