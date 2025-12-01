'use client'

import React from 'react'
import { ParkingSpace } from '../context/GlobalStateContext'

interface ParkingDashboardProps {
  parkingSpaces: ParkingSpace[]
  searchTerm: string
}

export default function ParkingDashboard({ parkingSpaces, searchTerm }: ParkingDashboardProps) {
  const occupied = parkingSpaces.filter(s => s.status === 'occupied').length
  const available = parkingSpaces.filter(s => s.status === 'available').length
  const reserved = parkingSpaces.filter(s => s.status === 'reserved').length
  const utilization = parkingSpaces.length > 0 ? ((occupied / parkingSpaces.length) * 100).toFixed(1) : '0'

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Parking Management</h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', margin: '4px 0 0 0' }}>Live parking availability and utilization</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(67, 56, 202, 0.2))', border: '1px solid rgba(79, 70, 229, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{parkingSpaces.length}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#A5B4FC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL SPACES</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{available}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#86EFAC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVAILABLE</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{occupied}</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#FCA5A5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OCCUPIED</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F1F5F9', marginBottom: '16px' }}>{utilization}%</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UTILIZATION</div>
        </div>
      </div>
    </div>
  )
}
