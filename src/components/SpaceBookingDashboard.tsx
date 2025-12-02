'use client'

import React from 'react'
import { Space } from '../context/GlobalStateContext'

interface SpaceBookingDashboardProps {
  spaces: Space[]
  searchTerm: string
}

export default function SpaceBookingDashboard({ spaces }: SpaceBookingDashboardProps) {
  const occupied = spaces.filter(s => s.status === 'occupied').length
  const available = spaces.filter(s => s.status === 'available').length
  const reserved = spaces.filter(s => s.status === 'reserved').length
  const maintenance = spaces.filter(s => s.status === 'maintenance').length
  const utilization = spaces.length > 0 ? ((occupied / spaces.length) * 100).toFixed(1) : '0'
  
  // Space type distribution
  const deskSpaces = spaces.filter(s => s.type === 'desk').length
  const offices = spaces.filter(s => s.type === 'office').length
  const meetingRooms = spaces.filter(s => s.type === 'meeting-room').length
  const conferenceRooms = spaces.filter(s => s.type === 'conference-room').length
  const socialHubs = spaces.filter(s => s.type === 'social-hub').length
  
  const total = spaces.length || 1
  
  // System availability (99.8% uptime example)
  const systemAvailability = 99.8

  return (
    <div>
      {/* Header with System Availability */}
      <div style={{ 
        background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(6, 182, 212, 0.05))', backdropFilter: 'blur(10px)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 20px 40px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.3)',
              fontSize: '36px',
              color: 'white',
              fontWeight: '400'
            }}>
              ▣
            </div>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#F1F5F9', margin: 0, letterSpacing: '-0.02em' }}>Space Booking</h2>
              <p style={{ fontSize: '15px', color: '#A0AEC0', margin: '4px 0 0 0', fontWeight: '500' }}>Workspace utilization & booking analytics</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.1)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px #10B981' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Availability</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#10B981' }}>{systemAvailability}%</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { value: spaces.length, label: 'Total Spaces', gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' },
          { value: available, label: 'Available', gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' },
          { value: occupied, label: 'Occupied', gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)' },
          { value: reserved, label: 'Reserved', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' },
          { value: maintenance, label: 'Maintenance', gradient: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)' }
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
        {/* Utilization Pie Chart */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.4))', 
          backdropFilter: 'blur(20px)',
          borderRadius: '24px', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          padding: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700', marginBottom: '32px', margin: '0 0 32px 0' }}>Utilization</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                <svg width="220" height="220" viewBox="0 0 220 220" style={{ filter: 'drop-shadow(0 8px 24px rgba(59, 130, 246, 0.4))' }}>
                  <defs>
                    <linearGradient id="spaceGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#6366F1', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="spaceGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#64748B', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#475569', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="spaceGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#0EA5E9', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <circle cx="110" cy="110" r="80" fill="rgba(15, 23, 42, 0.6)" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#spaceGrad1)" strokeWidth="28" strokeDasharray={`${(available/total) * 596.9} 596.9`} strokeDashoffset="0" transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#spaceGrad2)" strokeWidth="28" strokeDasharray={`${(occupied/total) * 596.9} 596.9`} strokeDashoffset={`-${(available/total) * 596.9}`} transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="95" fill="none" stroke="url(#spaceGrad3)" strokeWidth="28" strokeDasharray={`${(reserved/total) * 596.9} 596.9`} strokeDashoffset={`-${((available + occupied)/total) * 596.9}`} transform="rotate(-90 110 110)" strokeLinecap="round" />
                  <text x="110" y="105" textAnchor="middle" fill="#F1F5F9" fontSize="38" fontWeight="900">{utilization}%</text>
                  <text x="110" y="130" textAnchor="middle" fill="#94A3B8" fontSize="14" fontWeight="600">UTILIZED</text>
                </svg>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Available', value: available, color: 'linear-gradient(135deg, #6366F1, #4F46E5)' },
                  { label: 'Occupied', value: occupied, color: 'linear-gradient(135deg, #64748B, #475569)' },
                  { label: 'Reserved', value: reserved, color: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: item.color, boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)' }} />
                      <span style={{ color: '#94A3B8', fontSize: '15px', fontWeight: '600' }}>{item.label}</span>
                    </div>
                    <div style={{ color: '#F1F5F9', fontSize: '22px', fontWeight: '800' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Space Type Distribution */}
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
            <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '700', marginBottom: '32px', margin: '0 0 32px 0' }}>Space Type Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '300px', justifyContent: 'center' }}>
              {[
                { label: 'Desks', value: deskSpaces, color: '#3B82F6' },
                { label: 'Offices', value: offices, color: '#6366F1' },
                { label: 'Meeting Rooms', value: meetingRooms, color: '#8B5CF6' },
                { label: 'Conference Rooms', value: conferenceRooms, color: '#0EA5E9' },
                { label: 'Social Hubs', value: socialHubs, color: '#06B6D4' }
              ].map((item, index) => {
                const maxSpaces = Math.max(deskSpaces, offices, meetingRooms, conferenceRooms, socialHubs, 1)
                const percentage = (item.value / maxSpaces) * 100
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'baseline' }}>
                      <span style={{ color: '#94A3B8', fontSize: '15px', fontWeight: '600' }}>{item.label}</span>
                      <span style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '800' }}>{item.value}<span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}> spaces</span></span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`, borderRadius: '100px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 20px ${item.color}40` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
