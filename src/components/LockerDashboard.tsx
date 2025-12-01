'use client'

import React, { useMemo } from 'react'
import { Locker } from '../context/GlobalStateContext'

interface LockerDashboardProps {
  lockers: Locker[]
  searchTerm: string
}

export default function LockerDashboard({ lockers, searchTerm }: LockerDashboardProps) {
  const filteredLockers = useMemo(() => {
    return lockers.filter(locker => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        if (!locker.lockerNumber.toLowerCase().includes(search) &&
            !locker.building.toLowerCase().includes(search) &&
            !(locker.assignedToName || '').toLowerCase().includes(search)) {
          return false
        }
      }
      return true
    })
  }, [lockers, searchTerm])

  const kpis = useMemo(() => {
    const totalLockers = filteredLockers.length
    const activeLockers = filteredLockers.filter(l => l.status !== 'maintenance').length
    const occupiedLockers = filteredLockers.filter(l => l.status === 'occupied').length
    const availableLockers = filteredLockers.filter(l => l.status === 'available').length
    const utilizationRate = activeLockers > 0 ? ((occupiedLockers / activeLockers) * 100).toFixed(1) : '0.0'
    
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
    
    const mockOpeningsToday = Math.floor(occupiedLockers * 2.5)
    
    return { totalLockers, activeLockers, occupiedLockers, availableLockers, utilizationRate, utilizationByType, mockOpeningsToday }
  }, [filteredLockers])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-rose-600/10 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Locker Management</h2>
            <p className="text-gray-400 text-sm">Real-time locker availability and usage stats</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-sm border border-purple-500/20 p-6 shadow-2xl group hover:shadow-purple-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.activeLockers}</div>
            </div>
            <div className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Active Lockers</div>
            <div className="text-xs text-gray-500 mt-1">Out of {kpis.totalLockers} total</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600/20 to-pink-900/20 backdrop-blur-sm border border-pink-500/20 p-6 shadow-2xl group hover:shadow-pink-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.utilizationRate}%</div>
            </div>
            <div className="text-sm font-semibold text-pink-300 uppercase tracking-wider">Utilization</div>
            <div className="text-xs text-gray-500 mt-1">{kpis.occupiedLockers} occupied</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600/20 to-cyan-900/20 backdrop-blur-sm border border-cyan-500/20 p-6 shadow-2xl group hover:shadow-cyan-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.mockOpeningsToday}</div>
            </div>
            <div className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Openings Today</div>
            <div className="text-xs text-gray-500 mt-1">Access events</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600/20 to-green-900/20 backdrop-blur-sm border border-green-500/20 p-6 shadow-2xl group hover:shadow-green-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-white">{kpis.availableLockers}</div>
            </div>
            <div className="text-sm font-semibold text-green-300 uppercase tracking-wider">Available</div>
            <div className="text-xs text-gray-500 mt-1">Ready to assign</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Utilization by Locker Type
        </h3>
        <div className="space-y-5">
          {Object.entries(kpis.utilizationByType)
            .filter(([_, data]) => data.total > 0)
            .map(([type, data]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300 capitalize font-medium">{type}</span>
                  <span className="text-white font-bold">{data.occupied}/{data.total} ({data.utilization}%)</span>
                </div>
                <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full transition-all duration-1000"
                    style={{ width: `${data.utilization}%`, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
