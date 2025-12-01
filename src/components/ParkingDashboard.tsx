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
  
  // Calculate pie chart angles for space distribution
  const total = parkingSpaces.length || 1
  const occupiedAngle = (occupied / total) * 360
  const availableAngle = (available / total) * 360
  const reservedAngle = (reserved / total) * 360
  
  // Booking trend data (last 7 days)
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }
  
  const last7Days = getLast7Days()
  const bookingsByDay = last7Days.map(day => {
    return parkingBookings.filter(b => b.bookingDate === day).length
  })
  const maxBookings = Math.max(...bookingsByDay, 1)

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
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{parkingSpaces.length}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL SPACES</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{available}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVAILABLE</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.15), rgba(91, 33, 182, 0.15))', border: '1px solid rgba(109, 40, 217, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{occupied}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OCCUPIED</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(109, 40, 217, 0.15))', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{reserved}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RESERVED</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(67, 56, 202, 0.15))', border: '1px solid rgba(79, 70, 229, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{activeBookings}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIVE BOOKINGS</div>
        </div>
        <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.15), rgba(55, 48, 163, 0.15))', border: '1px solid rgba(67, 56, 202, 0.3)', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px' }}>{noShows}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#A5B4FC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NO-SHOWS</div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Pie Chart - Space Distribution */}
        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px' }}>
          <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '20px', margin: '0 0 20px 0' }}>Space Distribution</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.2))' }}>
                <circle cx="80" cy="80" r="60" fill="rgba(15, 23, 42, 0.4)" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="20" strokeDasharray={`${(available/total) * 439.6} 439.6`} strokeDashoffset="0" transform="rotate(-90 80 80)" strokeLinecap="round" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(109, 40, 217, 0.8)" strokeWidth="20" strokeDasharray={`${(occupied/total) * 439.6} 439.6`} strokeDashoffset={`-${(available/total) * 439.6}`} transform="rotate(-90 80 80)" strokeLinecap="round" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(124, 58, 237, 0.6)" strokeWidth="20" strokeDasharray={`${(reserved/total) * 439.6} 439.6`} strokeDashoffset={`-${((available + occupied)/total) * 439.6}`} transform="rotate(-90 80 80)" strokeLinecap="round" />
                <text x="80" y="75" textAnchor="middle" fill="#F1F5F9" fontSize="28" fontWeight="900">{utilization}%</text>
                <text x="80" y="95" textAnchor="middle" fill="#94A3B8" fontSize="12">Utilized</text>
              </svg>
            </div>
            <div style={{ flex: 1, paddingLeft: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.8)', boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)' }}></div>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>Available</span>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700' }}>{available}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(109, 40, 217, 0.8)', boxShadow: '0 0 8px rgba(109, 40, 217, 0.4)' }}></div>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>Occupied</span>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700' }}>{occupied}</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.6)', boxShadow: '0 0 8px rgba(124, 58, 237, 0.3)' }}></div>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>Reserved</span>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700' }}>{reserved}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bar Chart - Booking Trend */}
        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px' }}>
          <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '20px', margin: '0 0 20px 0' }}>Booking Trend (7 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '8px' }}>
            {bookingsByDay.map((count, index) => {
              const height = (count / maxBookings) * 140
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#8B5CF6', marginBottom: 'auto' }}>{count}</div>
                  <div style={{ width: '100%', height: `${height}px`, background: 'linear-gradient(180deg, #8B5CF6, #6366F1)', borderRadius: '6px 6px 0 0', minHeight: '4px', transition: 'height 0.3s ease' }}></div>
                  <div style={{ fontSize: '10px', color: '#64748B', transform: 'rotate(-45deg)', transformOrigin: 'center', whiteSpace: 'nowrap' }}>{last7Days[index].slice(5)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Booking Status Bars */}
      <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px' }}>
        <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '20px', margin: '0 0 20px 0' }}>Booking Status Overview</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#94A3B8', fontSize: '13px' }}>Active Bookings</span>
              <span style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600' }}>{activeBookings} / {parkingBookings.length}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(activeBookings / (parkingBookings.length || 1)) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #6366F1)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#94A3B8', fontSize: '13px' }}>Completed Bookings</span>
              <span style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600' }}>{completedBookings} / {parkingBookings.length}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(completedBookings / (parkingBookings.length || 1)) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #7C3AED, #6D28D9)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#94A3B8', fontSize: '13px' }}>No-Shows</span>
              <span style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600' }}>{noShows} / {parkingBookings.length}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(noShows / (parkingBookings.length || 1)) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #4F46E5)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
