'use client'

import React from 'react'
import { SearchRegular, CalendarRegular, FilterRegular, ArrowDownloadRegular } from '@fluentui/react-icons'

interface DashboardFiltersProps {
  startDate: string
  endDate: string
  searchTerm: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onSearchChange: (term: string) => void
  onExportCSV: () => void
  onExportXLS: () => void
}

export default function DashboardFilters({
  startDate,
  endDate,
  searchTerm,
  onStartDateChange,
  onEndDateChange,
  onSearchChange,
  onExportCSV,
  onExportXLS
}: DashboardFiltersProps) {
  return (
    <div className="mb-8 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative group">
            <SearchRegular className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors" fontSize={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <CalendarRegular className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" fontSize={18} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="pl-10 pr-4 py-3 bg-slate-900/60 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
          <span className="text-gray-500">→</span>
          <div className="relative group">
            <CalendarRegular className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" fontSize={18} />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="pl-10 pr-4 py-3 bg-slate-900/60 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
          >
            <ArrowDownloadRegular fontSize={18} />
            CSV
          </button>
          <button
            onClick={onExportXLS}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            <ArrowDownloadRegular fontSize={18} />
            XLS
          </button>
        </div>
      </div>
    </div>
  )
}
