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
  // Floor 0 — Ground (zones inset within building walls)
  0: [
    { name: 'Reception',      x: 12, y: 12, w: 28, h: 22, occupancy: 85 },
    { name: 'Lobby',          x: 44, y: 12, w: 22, h: 22, occupancy: 45 },
    { name: 'Security',       x: 70, y: 12, w: 18, h: 14, occupancy: 30 },
    { name: 'Mail Room',      x: 12, y: 40, w: 18, h: 16, occupancy: 15 },
    { name: 'Loading Bay',    x: 35, y: 40, w: 18, h: 16, occupancy: 10 },
  ],

  // Floor 1 — Amenity / Shared
  1: [
    { name: 'Cafeteria',        x: 12, y: 10, w: 35, h: 24, occupancy: 72 },
    { name: 'Coffee Bar',       x: 52, y: 10, w: 18, h: 12, occupancy: 88 },
    { name: 'Seating',          x: 52, y: 26, w: 18, h: 12, occupancy: 60 },
    { name: 'Kitchen',          x: 74, y: 10, w: 14, h: 14, occupancy: 55 },
    { name: 'Vending',          x: 12, y: 40, w: 14, h: 14, occupancy: 18 },
    { name: 'Restrooms',        x: 30, y: 40, w: 14, h: 14, occupancy: 35 },
  ],

  // Floor 2 — Fitness & Wellness
  2: [
    { name: 'Gym',              x: 12, y: 10, w: 30, h: 24, occupancy: 65 },
    { name: 'Yoga Studio',      x: 46, y: 10, w: 20, h: 12, occupancy: 50 },
    { name: 'Spin Room',        x: 46, y: 26, w: 20, h: 12, occupancy: 40 },
    { name: 'Lockers',          x: 70, y: 10, w: 18, h: 14, occupancy: 38 },
    { name: 'Wellness',         x: 12, y: 40, w: 18, h: 14, occupancy: 22 },
    { name: 'Juice Bar',        x: 75, y: 52, w: 20, h: 28, occupancy: 30 },
  ],

  // Floor 3 — Conference
  3: [
    { name: 'Conference',    x: 15, y: 12, w: 30, h: 20, occupancy: 78 },
    { name: 'Training A',    x: 50, y: 12, w: 18, h: 12, occupancy: 90 },
    { name: 'Training B',    x: 50, y: 28, w: 18, h: 10, occupancy: 55 },
    { name: 'Breakout',      x: 72, y: 12, w: 16, h: 14, occupancy: 42 },
    { name: 'AV Control',    x: 15, y: 38, w: 14, h: 12, occupancy: 25 },
  ],

  // Floors 4-18: Office floors (use a helper pattern — smaller inset zones)
  4: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 28 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 25 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 35 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 18 },
    { name: 'Booths',      x: 32, y: 36, w: 12, h: 12, occupancy: 22 },
  ],
  5: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 30 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 32 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 40 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 22 },
    { name: 'Booths',      x: 32, y: 36, w: 12, h: 12, occupancy: 28 },
  ],
  6: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 26 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 28 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 32 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 18 },
    { name: 'Booths',      x: 32, y: 36, w: 12, h: 12, occupancy: 20 },
  ],
  7: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 33 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 35 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 42 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 25 },
    { name: 'Booths',      x: 32, y: 36, w: 12, h: 12, occupancy: 30 },
  ],
  8: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 31 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 33 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 38 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 22 },
    { name: 'Booths',      x: 32, y: 36, w: 12, h: 12, occupancy: 26 },
  ],
  9: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 23 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 25 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 28 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 15 },
    { name: 'Booths',      x: 32, y: 36, w: 12, h: 12, occupancy: 18 },
  ],
  10: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 19 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 20 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 22 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 12 },
    { name: 'Booths',      x: 32, y: 36, w: 12, h: 12, occupancy: 14 },
  ],
  11: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 12 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 13 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 15 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 8 },
  ],
  12: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 15 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 16 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 18 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 10 },
  ],
  13: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 24 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 26 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 30 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 16 },
  ],
  14: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 20 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 22 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 24 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 14 },
  ],
  15: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 22 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 24 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 26 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 15 },
  ],
  16: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 21 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 22 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 24 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 14 },
  ],
  17: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 17 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 18 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 20 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 10 },
  ],
  18: [
    { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 11 },
    { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 12 },
    { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 14 },
    { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 8 },
  ],

  // Floor 19 — Executive
  19: [
    { name: 'Exec Suite',    x: 15, y: 12, w: 28, h: 18, occupancy: 15 },
    { name: 'Board Room',    x: 48, y: 12, w: 20, h: 14, occupancy: 22 },
    { name: 'Lounge',        x: 72, y: 12, w: 16, h: 12, occupancy: 10 },
    { name: 'EA Station',    x: 15, y: 36, w: 16, h: 12, occupancy: 18 },
  ],

  // Floor 20 — Executive
  20: [
    { name: 'CEO Office',    x: 15, y: 12, w: 20, h: 16, occupancy: 15 },
    { name: 'CFO Office',    x: 40, y: 12, w: 16, h: 12, occupancy: 18 },
    { name: 'CTO Office',    x: 60, y: 12, w: 16, h: 12, occupancy: 12 },
    { name: 'Board Room',    x: 15, y: 34, w: 24, h: 14, occupancy: 20 },
    { name: 'Library',       x: 44, y: 34, w: 16, h: 12, occupancy: 5 },
  ],

  // Floor 21 — Rooftop
  21: [
    { name: 'Sky Lounge',   x: 15, y: 12, w: 26, h: 18, occupancy: 8 },
    { name: 'Terrace',      x: 46, y: 12, w: 20, h: 14, occupancy: 5 },
    { name: 'Event Space',  x: 70, y: 12, w: 18, h: 14, occupancy: 4 },
    { name: 'Bar',          x: 15, y: 36, w: 16, h: 12, occupancy: 12 },
  ],
}

// Default zones fallback
const DEFAULT_ZONES: Zone[] = [
  { name: 'Office A',    x: 12, y: 10, w: 26, h: 20, occupancy: 25 },
  { name: 'Office B',    x: 42, y: 10, w: 26, h: 20, occupancy: 22 },
  { name: 'Meetings',    x: 72, y: 10, w: 16, h: 14, occupancy: 28 },
  { name: 'Kitchen',     x: 12, y: 36, w: 16, h: 14, occupancy: 15 },
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
            viewBox="0 0 100 70"
            preserveAspectRatio="xMidYMid meet"
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
