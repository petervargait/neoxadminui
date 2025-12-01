'use client'

import React from 'react'

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
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px',
      marginBottom: '24px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center'
    }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          flex: '1',
          minWidth: '200px',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.5)',
          color: '#F1F5F9',
          fontSize: '14px',
          outline: 'none'
        }}
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        style={{
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.5)',
          color: '#F1F5F9',
          fontSize: '14px',
          outline: 'none'
        }}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        style={{
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.5)',
          color: '#F1F5F9',
          fontSize: '14px',
          outline: 'none'
        }}
      />
      <button
        onClick={onExportCSV}
        style={{
          padding: '12px 24px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        CSV
      </button>
      <button
        onClick={onExportXLS}
        style={{
          padding: '12px 24px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        XLS
      </button>
    </div>
  )
}
