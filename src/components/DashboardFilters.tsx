'use client'

import React from 'react'

interface DashboardFiltersProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onApplyFilters?: () => void
  onClearFilters?: () => void
  onExportCSV: () => void
  onExportXLS: () => void
}

export default function DashboardFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilters,
  onClearFilters,
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
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#94A3B8', fontSize: '14px', fontWeight: '500' }}>Date Range:</span>
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
      {onApplyFilters && (
        <button
          onClick={onApplyFilters}
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Apply Filters
        </button>
      )}
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            background: 'transparent',
            color: '#EF4444',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          Clear
        </button>
      )}
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onExportCSV}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Export CSV
        </button>
        <button
          onClick={onExportXLS}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Export XLS
        </button>
      </div>
    </div>
  )
}
