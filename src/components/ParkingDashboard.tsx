'use client'

import React from 'react'
import { ParkingSpace, ParkingBooking } from '../context/GlobalStateContext'

interface ParkingDashboardProps {
  parkingSpaces: ParkingSpace[]
  parkingBookings?: ParkingBooking[]
  searchTerm: string
}

export default function ParkingDashboard({ parkingSpaces, parkingBookings = [] }: ParkingDashboardProps) {
  const occupied = parkingSpaces.filter(s => s.status === 'occupied').length
  const available = parkingSpaces.filter(s => s.status === 'available').length
  const reserved = parkingSpaces.filter(s => s.status === 'reserved').length
  const utilization = parkingSpaces.length > 0 ? ((occupied / parkingSpaces.length) * 100).toFixed(1) : '0'
  
  // Booking statistics
  const activeBookings = parkingBookings.filter(b => b.status === 'active').length
  const noShows = parkingBookings.filter(b => b.status === 'no-show').length
  const completedBookings = parkingBookings.filter(b => b.status === 'completed').length

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)' }}>
            <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Parking Management</h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '4px 0 0 0' }}>Live parking availability and utilization</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{parkingSpaces.length}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL SPACES</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{available}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVAILABLE</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(109, 40, 217, 0.15))', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{occupied}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OCCUPIED</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(67, 56, 202, 0.15))', border: '1px solid rgba(79, 70, 229, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{utilization}%</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UTILIZATION</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{activeBookings}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIVE BOOKINGS</div>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#F1F5F9', marginBottom: '12px' }}>{noShows}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NO-SHOWS</div>
        </div>
      </div>
    </div>
  )
}
