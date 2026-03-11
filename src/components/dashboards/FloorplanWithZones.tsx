'use client'

import React from 'react'

// ---------------------------------------------------------------------------
// Types — circles positioned as percentage of floorplan dimensions
// ---------------------------------------------------------------------------
interface Blob {
  cx: number       // center X as % of image width (0-100)
  cy: number       // center Y as % of image height (0-100)
  r: number        // radius as % of image width (0-100)
  occupancy: number // 0-100
}

interface FloorplanWithZonesProps {
  floorNumber: number
  floorName: string
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Occupancy blob definitions per floor — circles within the building interior
// Each floor has blobs of varying sizes placed inside the building walls.
// Occupancy determines color: Red >=80%, Amber >=50%, Green >=20%, none <20%
// ---------------------------------------------------------------------------
// All blobs centered within building footprint (cy ~18-30 to stay within clipped walls)
const FLOOR_BLOBS: Record<number, Blob[]> = {
  0: [
    { cx: 18, cy: 22, r: 8, occupancy: 85 },
    { cx: 32, cy: 18, r: 6, occupancy: 72 },
    { cx: 48, cy: 24, r: 10, occupancy: 45 },
    { cx: 65, cy: 20, r: 7, occupancy: 30 },
    { cx: 82, cy: 22, r: 6, occupancy: 15 },
  ],
  1: [
    { cx: 18, cy: 20, r: 9, occupancy: 72 },
    { cx: 35, cy: 17, r: 6, occupancy: 88 },
    { cx: 50, cy: 24, r: 10, occupancy: 60 },
    { cx: 68, cy: 20, r: 6, occupancy: 55 },
    { cx: 84, cy: 24, r: 5, occupancy: 18 },
  ],
  2: [
    { cx: 20, cy: 20, r: 9, occupancy: 65 },
    { cx: 42, cy: 18, r: 7, occupancy: 50 },
    { cx: 60, cy: 24, r: 6, occupancy: 40 },
    { cx: 78, cy: 20, r: 7, occupancy: 25 },
  ],
  3: [
    { cx: 22, cy: 22, r: 10, occupancy: 78 },
    { cx: 48, cy: 18, r: 8, occupancy: 90 },
    { cx: 68, cy: 24, r: 6, occupancy: 55 },
    { cx: 84, cy: 20, r: 5, occupancy: 42 },
  ],
  4: [
    { cx: 20, cy: 20, r: 8, occupancy: 28 },
    { cx: 40, cy: 24, r: 9, occupancy: 25 },
    { cx: 60, cy: 18, r: 7, occupancy: 35 },
    { cx: 80, cy: 22, r: 5, occupancy: 18 },
  ],
  5: [
    { cx: 18, cy: 22, r: 8, occupancy: 30 },
    { cx: 40, cy: 18, r: 10, occupancy: 32 },
    { cx: 62, cy: 24, r: 6, occupancy: 40 },
    { cx: 82, cy: 20, r: 5, occupancy: 22 },
  ],
  6: [
    { cx: 18, cy: 20, r: 8, occupancy: 26 },
    { cx: 38, cy: 24, r: 9, occupancy: 28 },
    { cx: 58, cy: 18, r: 7, occupancy: 32 },
    { cx: 78, cy: 22, r: 5, occupancy: 18 },
  ],
  7: [
    { cx: 20, cy: 22, r: 9, occupancy: 33 },
    { cx: 42, cy: 18, r: 10, occupancy: 35 },
    { cx: 64, cy: 24, r: 6, occupancy: 42 },
    { cx: 84, cy: 20, r: 5, occupancy: 25 },
  ],
  8: [
    { cx: 18, cy: 20, r: 8, occupancy: 31 },
    { cx: 40, cy: 24, r: 10, occupancy: 33 },
    { cx: 62, cy: 18, r: 7, occupancy: 38 },
    { cx: 82, cy: 22, r: 5, occupancy: 22 },
  ],
  9: [
    { cx: 20, cy: 22, r: 8, occupancy: 23 },
    { cx: 42, cy: 18, r: 9, occupancy: 25 },
    { cx: 62, cy: 24, r: 6, occupancy: 28 },
    { cx: 80, cy: 20, r: 5, occupancy: 15 },
  ],
  10: [
    { cx: 20, cy: 20, r: 7, occupancy: 19 },
    { cx: 42, cy: 24, r: 8, occupancy: 20 },
    { cx: 62, cy: 18, r: 6, occupancy: 22 },
    { cx: 80, cy: 22, r: 5, occupancy: 12 },
  ],
  11: [
    { cx: 22, cy: 22, r: 8, occupancy: 12 },
    { cx: 48, cy: 18, r: 9, occupancy: 13 },
    { cx: 72, cy: 24, r: 6, occupancy: 15 },
  ],
  12: [
    { cx: 22, cy: 20, r: 8, occupancy: 15 },
    { cx: 48, cy: 24, r: 8, occupancy: 16 },
    { cx: 72, cy: 18, r: 6, occupancy: 18 },
  ],
  13: [
    { cx: 20, cy: 22, r: 8, occupancy: 24 },
    { cx: 42, cy: 18, r: 10, occupancy: 26 },
    { cx: 64, cy: 24, r: 6, occupancy: 30 },
    { cx: 84, cy: 20, r: 5, occupancy: 16 },
  ],
  14: [
    { cx: 22, cy: 20, r: 8, occupancy: 20 },
    { cx: 48, cy: 24, r: 9, occupancy: 22 },
    { cx: 72, cy: 18, r: 6, occupancy: 24 },
  ],
  15: [
    { cx: 22, cy: 22, r: 8, occupancy: 22 },
    { cx: 48, cy: 18, r: 10, occupancy: 24 },
    { cx: 72, cy: 24, r: 6, occupancy: 26 },
  ],
  16: [
    { cx: 22, cy: 20, r: 8, occupancy: 21 },
    { cx: 48, cy: 24, r: 9, occupancy: 22 },
    { cx: 72, cy: 18, r: 6, occupancy: 24 },
  ],
  17: [
    { cx: 22, cy: 22, r: 8, occupancy: 17 },
    { cx: 48, cy: 18, r: 9, occupancy: 18 },
    { cx: 72, cy: 24, r: 6, occupancy: 10 },
  ],
  18: [
    { cx: 22, cy: 20, r: 7, occupancy: 11 },
    { cx: 48, cy: 24, r: 8, occupancy: 12 },
    { cx: 72, cy: 18, r: 6, occupancy: 8 },
  ],
  19: [
    { cx: 25, cy: 22, r: 8, occupancy: 15 },
    { cx: 50, cy: 18, r: 6, occupancy: 22 },
    { cx: 75, cy: 24, r: 5, occupancy: 10 },
  ],
  20: [
    { cx: 25, cy: 20, r: 7, occupancy: 15 },
    { cx: 50, cy: 24, r: 6, occupancy: 20 },
    { cx: 75, cy: 18, r: 5, occupancy: 5 },
  ],
  21: [
    { cx: 25, cy: 22, r: 8, occupancy: 8 },
    { cx: 50, cy: 18, r: 7, occupancy: 5 },
    { cx: 75, cy: 24, r: 5, occupancy: 12 },
  ],
}

const DEFAULT_BLOBS: Blob[] = [
  { cx: 25, cy: 22, r: 8, occupancy: 25 },
  { cx: 50, cy: 18, r: 9, occupancy: 22 },
  { cx: 75, cy: 24, r: 6, occupancy: 15 },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const FloorplanWithZones: React.FC<FloorplanWithZonesProps> = ({
  floorNumber,
  floorName,
  onClose,
}) => {
  const blobs = FLOOR_BLOBS[floorNumber] ?? DEFAULT_BLOBS

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
          Close
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
          { label: 'High occupancy (≥80%)', color: 'rgba(239,68,68,0.5)' },
          { label: 'Medium occupancy (≥50%)', color: 'rgba(245,158,11,0.5)' },
        ].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: l.color }} />
            <span style={{ color: '#94A3B8' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Floorplan with blob overlay */}
      <div style={{ flex: 1, position: 'relative', padding: '12px', overflow: 'auto' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Floorplan image as background — blobs positioned as % on top */}
          <img
            src={`/floorplans/Floor${floorNumber}.png`}
            alt={`${floorName} floor plan`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '6px',
            }}
          />

          {/* Occupancy blob overlays — only RED (>=80%) and AMBER (>=50%), no green */}
          {blobs.filter(b => b.occupancy >= 50).map((blob, i) => {
            const isRed = blob.occupancy >= 80
            const color = isRed ? 'rgba(239,68,68,0.45)' : 'rgba(245,158,11,0.40)'
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${blob.cx - blob.r}%`,
                  top: `${blob.cy - blob.r}%`,
                  width: `${blob.r * 2}%`,
                  height: `${blob.r * 2}%`,
                  borderRadius: '50%',
                  backgroundColor: color,
                  filter: 'blur(6px)',
                  pointerEvents: 'none',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FloorplanWithZones
