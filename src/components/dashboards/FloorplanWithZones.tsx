'use client'

import React from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Zone {
  name: string
  x: number      // percentage from left (0-100)
  y: number      // percentage from top (0-100)
  w: number      // width percentage (0-100)
  h: number      // height percentage (0-100)
  occupancy: number  // 0-100
}

interface FloorplanWithZonesProps {
  floorNumber: number  // 0-21 (non-basement floor number)
  floorName: string    // e.g. "Floor 5"
  onClose: () => void
}

// ---------------------------------------------------------------------------
// DASH colors (for reference)
// ---------------------------------------------------------------------------
// pageBg: '#08122E', cardBg: '#0F1A2E', cardBg2: '#162032', cardBorder: '#1E3A5F',
// text: '#F1F5F9', label: '#94A3B8', muted: '#64748B'

// ---------------------------------------------------------------------------
// Zone definitions for all 22 floors (0-21)
// ---------------------------------------------------------------------------

const FLOOR_ZONES: Record<number, Zone[]> = {
  // Floor 0 — Ground
  0: [
    { name: 'Reception',      x: 5,  y: 10, w: 40, h: 35, occupancy: 85 },
    { name: 'Lobby',          x: 50, y: 10, w: 45, h: 35, occupancy: 45 },
    { name: 'Security Desk',  x: 5,  y: 52, w: 30, h: 25, occupancy: 30 },
    { name: 'Mail Room',      x: 40, y: 52, w: 25, h: 25, occupancy: 15 },
    { name: 'Loading Bay',    x: 70, y: 52, w: 25, h: 25, occupancy: 10 },
  ],

  // Floor 1 — Amenity / Shared
  1: [
    { name: 'Cafeteria',        x: 5,  y: 8,  w: 55, h: 40, occupancy: 72 },
    { name: 'Coffee Bar',       x: 65, y: 8,  w: 30, h: 18, occupancy: 88 },
    { name: 'Seating Area',     x: 65, y: 30, w: 30, h: 18, occupancy: 60 },
    { name: 'Kitchen',          x: 5,  y: 54, w: 30, h: 24, occupancy: 55 },
    { name: 'Vending Area',     x: 40, y: 54, w: 25, h: 24, occupancy: 18 },
    { name: 'Restrooms',        x: 70, y: 54, w: 25, h: 24, occupancy: 35 },
  ],

  // Floor 2 — Fitness & Wellness
  2: [
    { name: 'Gym',              x: 5,  y: 8,  w: 45, h: 38, occupancy: 65 },
    { name: 'Yoga Studio',      x: 55, y: 8,  w: 40, h: 18, occupancy: 50 },
    { name: 'Spin Room',        x: 55, y: 30, w: 40, h: 16, occupancy: 40 },
    { name: 'Locker Rooms',     x: 5,  y: 52, w: 35, h: 28, occupancy: 38 },
    { name: 'Wellness Room',    x: 45, y: 52, w: 25, h: 28, occupancy: 22 },
    { name: 'Juice Bar',        x: 75, y: 52, w: 20, h: 28, occupancy: 30 },
  ],

  // Floor 3 — Conference & Training
  3: [
    { name: 'Conference Center', x: 5,  y: 8,  w: 50, h: 35, occupancy: 78 },
    { name: 'Training Room A',   x: 60, y: 8,  w: 35, h: 16, occupancy: 90 },
    { name: 'Training Room B',   x: 60, y: 28, w: 35, h: 15, occupancy: 55 },
    { name: 'Breakout Space',    x: 5,  y: 50, w: 30, h: 28, occupancy: 42 },
    { name: 'AV Control',        x: 40, y: 50, w: 20, h: 28, occupancy: 25 },
    { name: 'Pre-function Area',  x: 65, y: 50, w: 30, h: 28, occupancy: 35 },
  ],

  // Floor 4 — Office (lower occupancy)
  4: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 52 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 48 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 60 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 30 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 45 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 55 },
  ],

  // Floor 5 — Office (busy)
  5: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 82 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 78 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 85 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 55 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 70 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 65 },
  ],

  // Floor 6 — Office (busy)
  6: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 88 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 80 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 90 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 60 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 75 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 70 },
  ],

  // Floor 7 — Office (very busy)
  7: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 92 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 85 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 95 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 68 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 80 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 72 },
  ],

  // Floor 8 — Office (very busy)
  8: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 90 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 88 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 82 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 65 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 78 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 68 },
  ],

  // Floor 9 — Office (busy)
  9: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 86 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 82 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 88 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 58 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 72 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 62 },
  ],

  // Floor 10 — Office (very busy, peak floor)
  10: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 95 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 90 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 92 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 70 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 85 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 75 },
  ],

  // Floor 11 — Office (busy)
  11: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 84 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 80 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 76 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 52 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 68 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 60 },
  ],

  // Floor 12 — Office (busy)
  12: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 80 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 76 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 72 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 50 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 65 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 58 },
  ],

  // Floor 13 — Office (moderate)
  13: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 68 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 62 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 55 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 40 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 50 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 45 },
  ],

  // Floor 14 — Office (moderate)
  14: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 64 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 58 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 52 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 35 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 48 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 42 },
  ],

  // Floor 15 — Office (moderate-low)
  15: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 58 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 52 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 48 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 28 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 40 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 38 },
  ],

  // Floor 16 — Office (moderate-low)
  16: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 55 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 48 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 44 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 25 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 35 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 32 },
  ],

  // Floor 17 — Office (low-moderate)
  17: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 50 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 42 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 38 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 22 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 30 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 28 },
  ],

  // Floor 18 — Office (low)
  18: [
    { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 45 },
    { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 38 },
    { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 32 },
    { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 18 },
    { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 25 },
    { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 22 },
  ],

  // Floor 19 — Executive
  19: [
    { name: 'Executive Suite',   x: 5,  y: 8,  w: 45, h: 35, occupancy: 60 },
    { name: 'Board Room',        x: 55, y: 8,  w: 40, h: 35, occupancy: 82 },
    { name: 'Executive Lounge',  x: 5,  y: 50, w: 35, h: 28, occupancy: 35 },
    { name: 'EA Station',        x: 45, y: 50, w: 25, h: 28, occupancy: 70 },
    { name: 'Private Dining',    x: 75, y: 50, w: 20, h: 28, occupancy: 15 },
  ],

  // Floor 20 — Executive
  20: [
    { name: 'CEO Office',        x: 5,  y: 8,  w: 30, h: 35, occupancy: 50 },
    { name: 'CFO Office',        x: 40, y: 8,  w: 25, h: 16, occupancy: 55 },
    { name: 'CTO Office',        x: 70, y: 8,  w: 25, h: 16, occupancy: 45 },
    { name: 'Board Room',        x: 40, y: 28, w: 55, h: 15, occupancy: 88 },
    { name: 'Executive Lounge',  x: 5,  y: 50, w: 40, h: 28, occupancy: 30 },
    { name: 'EA Station',        x: 50, y: 50, w: 22, h: 28, occupancy: 75 },
    { name: 'Private Library',   x: 77, y: 50, w: 18, h: 28, occupancy: 12 },
  ],

  // Floor 21 — Rooftop
  21: [
    { name: 'Sky Lounge',   x: 5,  y: 8,  w: 55, h: 35, occupancy: 42 },
    { name: 'Terrace',      x: 65, y: 8,  w: 30, h: 35, occupancy: 28 },
    { name: 'Event Space',  x: 5,  y: 50, w: 45, h: 28, occupancy: 18 },
    { name: 'Bar Area',     x: 55, y: 50, w: 20, h: 28, occupancy: 55 },
    { name: 'Observation',  x: 80, y: 50, w: 15, h: 28, occupancy: 10 },
  ],
}

// Default zones used as a fallback when a floor is not defined in FLOOR_ZONES
const DEFAULT_ZONES: Zone[] = [
  { name: 'Open Office A',    x: 5,  y: 8,  w: 40, h: 35, occupancy: 50 },
  { name: 'Open Office B',    x: 50, y: 8,  w: 45, h: 35, occupancy: 45 },
  { name: 'Meeting Rooms',    x: 5,  y: 50, w: 25, h: 28, occupancy: 40 },
  { name: 'Kitchen/Break',    x: 35, y: 50, w: 20, h: 28, occupancy: 25 },
  { name: 'Phone Booths',     x: 60, y: 50, w: 15, h: 28, occupancy: 30 },
  { name: 'Manager Offices',  x: 80, y: 50, w: 15, h: 28, occupancy: 35 },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const FloorplanWithZones: React.FC<FloorplanWithZonesProps> = ({
  floorNumber,
  floorName,
  onClose,
}) => {
  const zones = FLOOR_ZONES[floorNumber] ?? DEFAULT_ZONES

  return (
    <div
      style={{
        backgroundColor: '#0F1A2E',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #1E3A5F',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#162032',
          borderBottom: '1px solid #1E3A5F',
        }}
      >
        <span style={{ color: '#44eebb', fontSize: '14px', fontWeight: 700 }}>
          {floorName} — Floor Plan
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid #475569',
            borderRadius: '4px',
            color: '#94A3B8',
            fontSize: '12px',
            padding: '3px 10px',
            cursor: 'pointer',
          }}
        >
          ✕ Close
        </button>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          padding: '8px 16px',
          borderBottom: '1px solid #1E3A5F',
          fontSize: '11px',
        }}
      >
        {[
          { label: 'High (≥80%)', color: 'rgba(239,68,68,0.5)' },
          { label: 'Medium (≥50%)', color: 'rgba(245,158,11,0.5)' },
          { label: 'Low (≥20%)', color: 'rgba(16,185,129,0.5)' },
          { label: 'Empty (<20%)', color: 'rgba(148,163,184,0.15)' },
        ].map((l) => (
          <div
            key={l.label}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor: l.color,
              }}
            />
            <span style={{ color: '#94A3B8' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Floorplan with zone overlay */}
      <div style={{ flex: 1, position: 'relative', padding: '12px', overflow: 'auto' }}>
        <div style={{ position: 'relative', width: '100%', paddingBottom: '70%' }}>
          {/* Floorplan image */}
          <img
            src={`/floorplans/Floor${floorNumber}.png`}
            alt={`${floorName} floor plan`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />

          {/* Zone overlays */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {zones.map((zone, i) => {
              const fillColor =
                zone.occupancy >= 80
                  ? 'rgba(239,68,68,0.3)'
                  : zone.occupancy >= 50
                    ? 'rgba(245,158,11,0.3)'
                    : zone.occupancy >= 20
                      ? 'rgba(16,185,129,0.3)'
                      : 'transparent'

              const strokeColor =
                zone.occupancy >= 80
                  ? 'rgba(239,68,68,0.6)'
                  : zone.occupancy >= 50
                    ? 'rgba(245,158,11,0.6)'
                    : zone.occupancy >= 20
                      ? 'rgba(16,185,129,0.6)'
                      : 'rgba(148,163,184,0.2)'

              return (
                <g key={i}>
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.w}
                    height={zone.h}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="0.3"
                    rx="0.5"
                    strokeDasharray={zone.occupancy < 20 ? '1,1' : 'none'}
                  />
                  <text
                    x={zone.x + zone.w / 2}
                    y={zone.y + zone.h / 2 - 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#F1F5F9"
                    fontSize="2.2"
                    fontWeight="700"
                  >
                    {zone.name}
                  </text>
                  <text
                    x={zone.x + zone.w / 2}
                    y={zone.y + zone.h / 2 + 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#94A3B8"
                    fontSize="1.8"
                  >
                    {zone.occupancy}%
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default FloorplanWithZones
