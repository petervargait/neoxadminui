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
const FLOOR_BLOBS: Record<number, Blob[]> = {
  0: [ // Ground - Reception
    { cx: 18, cy: 35, r: 10, occupancy: 85 },
    { cx: 35, cy: 30, r: 7, occupancy: 72 },
    { cx: 50, cy: 38, r: 12, occupancy: 45 },
    { cx: 65, cy: 35, r: 9, occupancy: 30 },
    { cx: 80, cy: 32, r: 8, occupancy: 15 },
  ],
  1: [ // Cafeteria
    { cx: 20, cy: 32, r: 11, occupancy: 72 },
    { cx: 38, cy: 28, r: 8, occupancy: 88 },
    { cx: 55, cy: 35, r: 13, occupancy: 60 },
    { cx: 72, cy: 30, r: 7, occupancy: 55 },
    { cx: 85, cy: 38, r: 6, occupancy: 18 },
  ],
  2: [ // Fitness
    { cx: 22, cy: 30, r: 12, occupancy: 65 },
    { cx: 45, cy: 28, r: 8, occupancy: 50 },
    { cx: 60, cy: 35, r: 7, occupancy: 40 },
    { cx: 78, cy: 32, r: 9, occupancy: 25 },
  ],
  3: [ // Conference
    { cx: 25, cy: 32, r: 14, occupancy: 78 },
    { cx: 50, cy: 28, r: 9, occupancy: 90 },
    { cx: 68, cy: 35, r: 8, occupancy: 55 },
    { cx: 82, cy: 30, r: 6, occupancy: 42 },
  ],
  4: [ // Office
    { cx: 20, cy: 30, r: 10, occupancy: 28 },
    { cx: 40, cy: 35, r: 12, occupancy: 25 },
    { cx: 60, cy: 30, r: 9, occupancy: 35 },
    { cx: 78, cy: 34, r: 7, occupancy: 18 },
  ],
  5: [
    { cx: 20, cy: 32, r: 11, occupancy: 30 },
    { cx: 42, cy: 28, r: 13, occupancy: 32 },
    { cx: 62, cy: 35, r: 8, occupancy: 40 },
    { cx: 80, cy: 30, r: 6, occupancy: 22 },
  ],
  6: [
    { cx: 18, cy: 30, r: 10, occupancy: 26 },
    { cx: 38, cy: 34, r: 12, occupancy: 28 },
    { cx: 58, cy: 28, r: 9, occupancy: 32 },
    { cx: 75, cy: 35, r: 7, occupancy: 18 },
  ],
  7: [
    { cx: 22, cy: 32, r: 12, occupancy: 33 },
    { cx: 45, cy: 28, r: 14, occupancy: 35 },
    { cx: 65, cy: 35, r: 8, occupancy: 42 },
    { cx: 82, cy: 30, r: 6, occupancy: 25 },
  ],
  8: [
    { cx: 20, cy: 30, r: 11, occupancy: 31 },
    { cx: 42, cy: 35, r: 13, occupancy: 33 },
    { cx: 62, cy: 28, r: 9, occupancy: 38 },
    { cx: 80, cy: 34, r: 7, occupancy: 22 },
  ],
  9: [
    { cx: 22, cy: 32, r: 10, occupancy: 23 },
    { cx: 42, cy: 28, r: 12, occupancy: 25 },
    { cx: 60, cy: 35, r: 8, occupancy: 28 },
    { cx: 78, cy: 30, r: 6, occupancy: 15 },
  ],
  10: [
    { cx: 20, cy: 30, r: 9, occupancy: 19 },
    { cx: 40, cy: 34, r: 11, occupancy: 20 },
    { cx: 58, cy: 28, r: 8, occupancy: 22 },
    { cx: 75, cy: 35, r: 6, occupancy: 12 },
  ],
  11: [
    { cx: 22, cy: 32, r: 10, occupancy: 12 },
    { cx: 45, cy: 28, r: 12, occupancy: 13 },
    { cx: 68, cy: 35, r: 7, occupancy: 15 },
  ],
  12: [
    { cx: 20, cy: 30, r: 10, occupancy: 15 },
    { cx: 42, cy: 34, r: 11, occupancy: 16 },
    { cx: 65, cy: 28, r: 8, occupancy: 18 },
  ],
  13: [
    { cx: 22, cy: 32, r: 11, occupancy: 24 },
    { cx: 45, cy: 28, r: 13, occupancy: 26 },
    { cx: 65, cy: 35, r: 8, occupancy: 30 },
    { cx: 82, cy: 30, r: 6, occupancy: 16 },
  ],
  14: [
    { cx: 20, cy: 30, r: 10, occupancy: 20 },
    { cx: 42, cy: 34, r: 12, occupancy: 22 },
    { cx: 62, cy: 28, r: 8, occupancy: 24 },
  ],
  15: [
    { cx: 22, cy: 32, r: 11, occupancy: 22 },
    { cx: 45, cy: 28, r: 13, occupancy: 24 },
    { cx: 68, cy: 35, r: 7, occupancy: 26 },
  ],
  16: [
    { cx: 20, cy: 30, r: 10, occupancy: 21 },
    { cx: 42, cy: 34, r: 12, occupancy: 22 },
    { cx: 62, cy: 28, r: 8, occupancy: 24 },
  ],
  17: [
    { cx: 22, cy: 32, r: 10, occupancy: 17 },
    { cx: 45, cy: 28, r: 12, occupancy: 18 },
    { cx: 68, cy: 35, r: 7, occupancy: 10 },
  ],
  18: [
    { cx: 20, cy: 30, r: 9, occupancy: 11 },
    { cx: 42, cy: 34, r: 11, occupancy: 12 },
    { cx: 65, cy: 28, r: 7, occupancy: 8 },
  ],
  19: [ // Executive
    { cx: 25, cy: 32, r: 10, occupancy: 15 },
    { cx: 50, cy: 28, r: 8, occupancy: 22 },
    { cx: 72, cy: 35, r: 7, occupancy: 10 },
  ],
  20: [
    { cx: 25, cy: 30, r: 9, occupancy: 15 },
    { cx: 50, cy: 34, r: 8, occupancy: 20 },
    { cx: 72, cy: 28, r: 6, occupancy: 5 },
  ],
  21: [ // Rooftop
    { cx: 25, cy: 32, r: 11, occupancy: 8 },
    { cx: 50, cy: 28, r: 9, occupancy: 5 },
    { cx: 75, cy: 35, r: 7, occupancy: 12 },
  ],
}

const DEFAULT_BLOBS: Blob[] = [
  { cx: 25, cy: 32, r: 10, occupancy: 25 },
  { cx: 50, cy: 28, r: 12, occupancy: 22 },
  { cx: 75, cy: 35, r: 8, occupancy: 15 },
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
          { label: 'High (≥80%)', color: 'rgba(239,68,68,0.5)' },
          { label: 'Medium (≥50%)', color: 'rgba(245,158,11,0.5)' },
          { label: 'Low (≥20%)', color: 'rgba(16,185,129,0.5)' },
          { label: 'Empty (<20%)', color: 'rgba(148,163,184,0.15)' },
        ].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: l.color }} />
            <span style={{ color: '#94A3B8' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Floorplan with blob overlay */}
      <div style={{ flex: 1, position: 'relative', padding: '12px', overflow: 'auto' }}>
        <div style={{ position: 'relative', width: '100%', paddingBottom: '45%' }}>
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

          {/* Occupancy blob overlays — circles, no text */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 100 45"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="blur-blob">
                <feGaussianBlur stdDeviation="0.8" />
              </filter>
            </defs>
            {blobs.map((blob, i) => {
              const fillColor =
                blob.occupancy >= 80
                  ? 'rgba(239,68,68,0.4)'
                  : blob.occupancy >= 50
                    ? 'rgba(245,158,11,0.4)'
                    : blob.occupancy >= 20
                      ? 'rgba(16,185,129,0.35)'
                      : 'rgba(148,163,184,0.1)'

              if (blob.occupancy < 5) return null

              return (
                <circle
                  key={i}
                  cx={blob.cx}
                  cy={blob.cy}
                  r={blob.r}
                  fill={fillColor}
                  filter="url(#blur-blob)"
                />
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default FloorplanWithZones
