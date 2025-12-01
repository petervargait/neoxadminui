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
  
  const activeBookings = parkingBookings.filter(b => b.status === 'active').length
  const noShows = parkingBookings.filter(b => b.status === 'no-show').length
  const completedBookings = parkingBookings.filter(b => b.status === 'completed').length
  
  const total = parkingSpaces.length || 1
  
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
  const bookingsByDay = last7Days.map(day => parkingBookings.filter(b => b.bookingDate === day).length)
  const maxBookings = Math.max(...bookingsByDay, 1)

  return (
    <div>
      {/* Header */}
      <div style={{ 
        background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))', backdropFilter: 'blur(10px)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '72px', 
            height: '72px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.3)',
            fontSize: '36px',
            color: 'white',
            fontWeight: '400'
          }}>
            ◧
          </div>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#F1F5F9', margin: 0, letterSpacing: '-0.02em' }}>Parking Management</h2>
            <p style={{ fontSize: '15px', color: '#A0AEC0', margin: '4px 0 0 0', fontWeight: '500' }}>Real-time availability & utilization analytics</p>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { value: parkingSpaces.length, label: 'Total Spaces', gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' },
          { value: available, label: 'Available', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' },
          { value: occupied, label: 'Occupied', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)' },
          { value: reserved, label: 'Reserved', gradient: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)' }
        ].map((stat, idx) => (
          <div key={idx} style={{ 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            padding: '28px 24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: stat.gradient, opacity: 0.1, borderRadius: '50%', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '40px', fontWeight: '900', background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '24px', marginBottom: '32px' }}>
        {/* Pie Chart */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.4))', 
          backdropFilter: 'blur(20px)',
          borderRadius: '24px', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          padding: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700', marginBottom: '32px', margin: '0 0 32px 0' }}>Space Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                <svg width="220" height="220" viewBox="0 0 220 220" style={{ filter: 'drop-shadow(0 8px 24px rgba(139, 92, 246, 0.4))' }}>
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#0EA5E9', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <circle cx="110" cy="110" r="80" fill="rgba(15, 23, 42, 0.6)" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#grad1)" strokeWidth="28" strokeDasharray={`${(available/total) * 596.9} 596.9`} strokeDashoffset="0" transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#grad2)" strokeWidth="28" strokeDasharray={`${(occupied/total) * 596.9} 596.9`} strokeDashoffset={`-${(available/total) * 596.9}`} transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#grad3)" strokeWidth="28" strokeDasharray={`${(reserved/total) * 596.9} 596.9`} strokeDashoffset={`-${((available + occupied)/total) * 596.9}`} transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <text x="110" y="105" textAnchor="middle" fill="#F1F5F9" fontSize="38" fontWeight="900">{utilization}%</text>
                  <text x="110" y="130" textAnchor="middle" fill="#94A3B8" fontSize="14" fontWeight="600">UTILIZED</text>
                </svg>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Available', value: available, color: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' },
                  { label: 'Occupied', value: occupied, color: 'linear-gradient(135deg, #8B5CF6, #A855F7)' },
                  { label: 'Reserved', value: reserved, color: 'linear-gradient(135deg, #EC4899, #F97316)' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: item.color, boxShadow: '0 0 12px rgba(139, 92, 246, 0.5)' }} />
                      <span style={{ color: '#94A3B8', fontSize: '15px', fontWeight: '600' }}>{item.label}</span>
                    </div>
                    <div style={{ color: '#F1F5F9', fontSize: '22px', fontWeight: '800' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bar Chart */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.4))', 
          backdropFilter: 'blur(20px)',
          borderRadius: '24px', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          padding: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', bottom: '-50%', left: '-20%', width: '140%', height: '140%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700', marginBottom: '32px', margin: '0 0 32px 0' }}>7-Day Booking Trend</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '300px', gap: '12px' }}>
              {bookingsByDay.map((count, index) => {
                const height = (count / maxBookings) * 240
                const colors = ['#6366F1', '#8B5CF6', '#A855F7', '#EC4899', '#F97316', '#06B6D4', '#0EA5E9']
                return (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: colors[index % colors.length], marginBottom: 'auto' }}>{count}</div>
                    <div style={{ 
                      width: '100%', 
                      height: `${height}px`, 
                      background: `linear-gradient(180deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})`, 
                      borderRadius: '12px 12px 0 0', 
                      minHeight: '8px', 
                      boxShadow: `0 -4px 20px ${colors[index % colors.length]}40`,
                      position: 'relative'
                    }}>
                      <div style={{ position: 'absolute', top: '-4px', left: 0, right: 0, height: '4px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '12px 12px 0 0' }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Progress Bars */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.4))', 
        backdropFilter: 'blur(20px)',
        borderRadius: '24px', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        padding: '32px' 
      }}>
        <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700', marginBottom: '28px', margin: '0 0 28px 0' }}>Booking Status Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            { label: 'Active', value: activeBookings, total: parkingBookings.length, gradient: 'linear-gradient(90deg, #6366F1, #8B5CF6)' },
            { label: 'Completed', value: completedBookings, total: parkingBookings.length, gradient: 'linear-gradient(90deg, #8B5CF6, #A855F7)' },
            { label: 'No-Shows', value: noShows, total: parkingBookings.length, gradient: 'linear-gradient(90deg, #EC4899, #F97316)' }
          ].map((item, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'baseline' }}>
                <span style={{ color: '#94A3B8', fontSize: '15px', fontWeight: '600' }}>{item.label}</span>
                <span style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '800' }}>{item.value}<span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}> / {item.total}</span></span>
              </div>
              <div style={{ width: '100%', height: '12px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ 
                  width: `${(item.value / (item.total || 1)) * 100}%`, 
                  height: '100%', 
                  background: item.gradient, 
                  borderRadius: '100px', 
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 0 20px ${item.gradient}40`
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
