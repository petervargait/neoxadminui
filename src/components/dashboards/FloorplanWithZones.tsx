'use client'

import React from 'react'

// ---------------------------------------------------------------------------
// Types — circles positioned as percentage of floorplan image dimensions
// ---------------------------------------------------------------------------
interface Blob {
  cx: number       // center X as % of image width (0-100)
  cy: number       // center Y as % of image height (0-100)
  r: number        // radius as % of image width
  occupancy: number // 0-100
}

interface FloorplanWithZonesProps {
  floorNumber: number
  floorName: string
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Blob positions traced from actual floorplan images.
// Only RED (>=80%) and AMBER (>=50%) are rendered.
//
// Floor 0-3: Long horizontal building footprint
//   Walls roughly: x 5%-93%, y 15%-78%
// Floor 4-9: Hourglass/bowtie shape
//   Left wing x 5%-40% y 12%-88%, neck x 35%-65% y 25%-75%, right wing x 60%-95% y 12%-88%
// Floor 10+: Three separate towers
//   Left tower x 4%-28% y 8%-72%, Center tower x 34%-58% y 5%-68%, Right tower x 64%-96% y 8%-78%
// ---------------------------------------------------------------------------
const FLOOR_BLOBS: Record<number, Blob[]> = {
  // Floors 0-3: Long horizontal building
  0: [
    { cx: 14, cy: 38, r: 9, occupancy: 92 },
    { cx: 28, cy: 35, r: 7, occupancy: 85 },
    { cx: 22, cy: 55, r: 8, occupancy: 78 },
    { cx: 42, cy: 42, r: 11, occupancy: 65 },
    { cx: 55, cy: 38, r: 10, occupancy: 58 },
    { cx: 68, cy: 45, r: 8, occupancy: 52 },
    { cx: 80, cy: 35, r: 9, occupancy: 70 },
    { cx: 88, cy: 50, r: 7, occupancy: 60 },
  ],
  1: [
    { cx: 12, cy: 40, r: 8, occupancy: 88 },
    { cx: 24, cy: 35, r: 7, occupancy: 92 },
    { cx: 18, cy: 58, r: 9, occupancy: 75 },
    { cx: 38, cy: 40, r: 10, occupancy: 82 },
    { cx: 50, cy: 45, r: 12, occupancy: 68 },
    { cx: 65, cy: 38, r: 8, occupancy: 55 },
    { cx: 78, cy: 42, r: 9, occupancy: 72 },
    { cx: 88, cy: 38, r: 7, occupancy: 60 },
  ],
  2: [
    { cx: 13, cy: 38, r: 9, occupancy: 82 },
    { cx: 26, cy: 42, r: 8, occupancy: 70 },
    { cx: 40, cy: 38, r: 11, occupancy: 65 },
    { cx: 55, cy: 45, r: 9, occupancy: 58 },
    { cx: 70, cy: 40, r: 8, occupancy: 52 },
    { cx: 84, cy: 42, r: 7, occupancy: 55 },
  ],
  3: [
    { cx: 14, cy: 40, r: 10, occupancy: 90 },
    { cx: 28, cy: 35, r: 8, occupancy: 85 },
    { cx: 42, cy: 42, r: 12, occupancy: 78 },
    { cx: 58, cy: 38, r: 9, occupancy: 65 },
    { cx: 72, cy: 45, r: 8, occupancy: 72 },
    { cx: 85, cy: 40, r: 7, occupancy: 55 },
  ],

  // Floors 4-9: Hourglass/bowtie shape
  4: [
    { cx: 15, cy: 30, r: 8, occupancy: 72 },
    { cx: 25, cy: 50, r: 9, occupancy: 65 },
    { cx: 15, cy: 70, r: 7, occupancy: 58 },
    { cx: 48, cy: 45, r: 8, occupancy: 55 },
    { cx: 72, cy: 30, r: 9, occupancy: 68 },
    { cx: 82, cy: 55, r: 8, occupancy: 80 },
    { cx: 75, cy: 72, r: 7, occupancy: 62 },
  ],
  5: [
    { cx: 14, cy: 28, r: 9, occupancy: 85 },
    { cx: 24, cy: 52, r: 10, occupancy: 78 },
    { cx: 16, cy: 72, r: 7, occupancy: 65 },
    { cx: 45, cy: 42, r: 8, occupancy: 60 },
    { cx: 70, cy: 28, r: 9, occupancy: 82 },
    { cx: 80, cy: 50, r: 10, occupancy: 75 },
    { cx: 78, cy: 74, r: 7, occupancy: 55 },
  ],
  6: [
    { cx: 15, cy: 30, r: 9, occupancy: 80 },
    { cx: 22, cy: 55, r: 8, occupancy: 72 },
    { cx: 14, cy: 72, r: 7, occupancy: 60 },
    { cx: 48, cy: 45, r: 7, occupancy: 55 },
    { cx: 73, cy: 30, r: 9, occupancy: 78 },
    { cx: 83, cy: 52, r: 8, occupancy: 70 },
    { cx: 76, cy: 72, r: 7, occupancy: 58 },
  ],
  7: [
    { cx: 16, cy: 28, r: 10, occupancy: 88 },
    { cx: 24, cy: 52, r: 9, occupancy: 82 },
    { cx: 15, cy: 74, r: 7, occupancy: 68 },
    { cx: 46, cy: 44, r: 8, occupancy: 62 },
    { cx: 72, cy: 28, r: 10, occupancy: 85 },
    { cx: 82, cy: 52, r: 9, occupancy: 78 },
    { cx: 77, cy: 75, r: 7, occupancy: 60 },
  ],
  8: [
    { cx: 15, cy: 30, r: 9, occupancy: 82 },
    { cx: 24, cy: 54, r: 8, occupancy: 75 },
    { cx: 16, cy: 72, r: 7, occupancy: 62 },
    { cx: 48, cy: 45, r: 7, occupancy: 58 },
    { cx: 74, cy: 30, r: 9, occupancy: 80 },
    { cx: 82, cy: 55, r: 8, occupancy: 72 },
    { cx: 78, cy: 74, r: 6, occupancy: 55 },
  ],
  9: [
    { cx: 16, cy: 28, r: 8, occupancy: 70 },
    { cx: 22, cy: 52, r: 9, occupancy: 65 },
    { cx: 15, cy: 72, r: 7, occupancy: 55 },
    { cx: 47, cy: 44, r: 7, occupancy: 52 },
    { cx: 72, cy: 28, r: 8, occupancy: 68 },
    { cx: 80, cy: 52, r: 9, occupancy: 60 },
  ],

  // Floors 10+: Three separate towers (left ~4-28%, center ~34-58%, right ~64-96%)
  10: [
    { cx: 14, cy: 28, r: 7, occupancy: 72 },
    { cx: 18, cy: 50, r: 8, occupancy: 65 },
    { cx: 12, cy: 62, r: 6, occupancy: 55 },
    { cx: 44, cy: 25, r: 8, occupancy: 78 },
    { cx: 48, cy: 48, r: 9, occupancy: 70 },
    { cx: 78, cy: 28, r: 8, occupancy: 82 },
    { cx: 82, cy: 52, r: 7, occupancy: 68 },
    { cx: 76, cy: 68, r: 6, occupancy: 55 },
  ],
  11: [
    { cx: 14, cy: 30, r: 7, occupancy: 62 },
    { cx: 17, cy: 52, r: 6, occupancy: 55 },
    { cx: 44, cy: 28, r: 8, occupancy: 68 },
    { cx: 47, cy: 50, r: 7, occupancy: 58 },
    { cx: 78, cy: 30, r: 7, occupancy: 72 },
    { cx: 82, cy: 55, r: 6, occupancy: 60 },
  ],
  12: [
    { cx: 15, cy: 32, r: 7, occupancy: 65 },
    { cx: 18, cy: 55, r: 6, occupancy: 52 },
    { cx: 45, cy: 28, r: 8, occupancy: 70 },
    { cx: 48, cy: 52, r: 7, occupancy: 58 },
    { cx: 79, cy: 30, r: 7, occupancy: 75 },
    { cx: 82, cy: 54, r: 6, occupancy: 62 },
  ],
  13: [
    { cx: 14, cy: 30, r: 7, occupancy: 68 },
    { cx: 17, cy: 54, r: 6, occupancy: 55 },
    { cx: 44, cy: 26, r: 8, occupancy: 72 },
    { cx: 47, cy: 48, r: 7, occupancy: 60 },
    { cx: 78, cy: 28, r: 8, occupancy: 80 },
    { cx: 82, cy: 52, r: 7, occupancy: 65 },
  ],
  14: [
    { cx: 15, cy: 32, r: 7, occupancy: 62 },
    { cx: 45, cy: 28, r: 7, occupancy: 65 },
    { cx: 48, cy: 50, r: 6, occupancy: 55 },
    { cx: 79, cy: 30, r: 7, occupancy: 70 },
    { cx: 82, cy: 55, r: 6, occupancy: 58 },
  ],
  15: [
    { cx: 14, cy: 30, r: 7, occupancy: 65 },
    { cx: 17, cy: 52, r: 6, occupancy: 52 },
    { cx: 44, cy: 26, r: 8, occupancy: 72 },
    { cx: 47, cy: 48, r: 7, occupancy: 60 },
    { cx: 78, cy: 28, r: 8, occupancy: 78 },
    { cx: 82, cy: 52, r: 7, occupancy: 62 },
  ],
  16: [
    { cx: 15, cy: 32, r: 6, occupancy: 58 },
    { cx: 45, cy: 28, r: 7, occupancy: 65 },
    { cx: 79, cy: 30, r: 7, occupancy: 68 },
    { cx: 82, cy: 55, r: 6, occupancy: 55 },
  ],
  17: [
    { cx: 14, cy: 30, r: 6, occupancy: 55 },
    { cx: 44, cy: 26, r: 7, occupancy: 60 },
    { cx: 78, cy: 28, r: 7, occupancy: 62 },
    { cx: 82, cy: 52, r: 6, occupancy: 52 },
  ],
  18: [
    { cx: 15, cy: 32, r: 6, occupancy: 52 },
    { cx: 45, cy: 28, r: 6, occupancy: 55 },
    { cx: 79, cy: 30, r: 6, occupancy: 58 },
  ],
  19: [
    { cx: 14, cy: 30, r: 6, occupancy: 55 },
    { cx: 44, cy: 26, r: 7, occupancy: 62 },
    { cx: 78, cy: 28, r: 7, occupancy: 58 },
  ],
  20: [
    { cx: 15, cy: 32, r: 6, occupancy: 52 },
    { cx: 45, cy: 28, r: 6, occupancy: 58 },
    { cx: 79, cy: 30, r: 6, occupancy: 55 },
  ],
  21: [
    { cx: 14, cy: 30, r: 6, occupancy: 50 },
    { cx: 44, cy: 28, r: 7, occupancy: 52 },
    { cx: 80, cy: 32, r: 7, occupancy: 55 },
  ],
}

const DEFAULT_BLOBS: Blob[] = [
  { cx: 15, cy: 35, r: 8, occupancy: 65 },
  { cx: 45, cy: 40, r: 9, occupancy: 72 },
  { cx: 78, cy: 38, r: 8, occupancy: 58 },
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

      {/* Floorplan with blob overlay — blobs as CSS divs on top of img */}
      <div style={{ flex: 1, position: 'relative', padding: '12px', overflow: 'auto' }}>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <img
            src={`/floorplans/Floor${floorNumber}.png`}
            alt={`${floorName} floor plan`}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px' }}
          />
          {/* Blobs — only >=50% occupancy (red & amber) */}
          {blobs.filter(b => b.occupancy >= 50).map((blob, i) => {
            const isRed = blob.occupancy >= 80
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
                  backgroundColor: isRed ? 'rgba(239,68,68,0.45)' : 'rgba(245,158,11,0.40)',
                  filter: 'blur(4px)',
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
