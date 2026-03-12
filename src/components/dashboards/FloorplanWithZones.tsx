'use client'

import React from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Blob {
  cx: number       // center X as % (0-100)
  cy: number       // center Y as % (0-100)
  r: number        // radius as % of width
  occupancy: number
}

interface FloorplanWithZonesProps {
  floorNumber: number
  floorName: string
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Which floors have mask files (0-13, then 13 reused for 14-19)
// ---------------------------------------------------------------------------
function getMaskUrl(floor: number): string | null {
  if (floor <= 13) return `/floorplans/Floor${floor}Mask.png`
  if (floor <= 19) return `/floorplans/Floor13Mask.png` // reuse 13 for 14-19
  return null // 20-21 no mask
}

// ---------------------------------------------------------------------------
// Blob data — many blobs covering the interior heavily.
// The mask image will clip anything outside walls automatically.
// So we can place blobs generously and let the mask do the work.
// ---------------------------------------------------------------------------
const FLOOR_BLOBS: Record<number, Blob[]> = {
  // Floors 0-3: Long horizontal building — spread blobs across full area
  0: [
    { cx: 10, cy: 30, r: 12, occupancy: 92 }, { cx: 25, cy: 35, r: 14, occupancy: 85 },
    { cx: 40, cy: 40, r: 16, occupancy: 78 }, { cx: 55, cy: 35, r: 15, occupancy: 65 },
    { cx: 70, cy: 38, r: 14, occupancy: 72 }, { cx: 85, cy: 35, r: 12, occupancy: 60 },
    { cx: 15, cy: 50, r: 11, occupancy: 80 }, { cx: 35, cy: 55, r: 10, occupancy: 68 },
    { cx: 60, cy: 50, r: 12, occupancy: 58 }, { cx: 80, cy: 48, r: 10, occupancy: 55 },
  ],
  1: [
    { cx: 10, cy: 32, r: 13, occupancy: 88 }, { cx: 25, cy: 38, r: 15, occupancy: 92 },
    { cx: 40, cy: 35, r: 16, occupancy: 82 }, { cx: 55, cy: 40, r: 14, occupancy: 75 },
    { cx: 70, cy: 35, r: 13, occupancy: 70 }, { cx: 85, cy: 38, r: 11, occupancy: 62 },
    { cx: 18, cy: 52, r: 10, occupancy: 78 }, { cx: 48, cy: 50, r: 12, occupancy: 68 },
    { cx: 75, cy: 50, r: 10, occupancy: 55 },
  ],
  2: [
    { cx: 12, cy: 30, r: 14, occupancy: 82 }, { cx: 28, cy: 38, r: 15, occupancy: 75 },
    { cx: 45, cy: 35, r: 16, occupancy: 70 }, { cx: 62, cy: 40, r: 14, occupancy: 65 },
    { cx: 78, cy: 35, r: 13, occupancy: 58 }, { cx: 90, cy: 40, r: 10, occupancy: 52 },
    { cx: 20, cy: 52, r: 11, occupancy: 68 }, { cx: 55, cy: 50, r: 10, occupancy: 55 },
  ],
  3: [
    { cx: 10, cy: 32, r: 14, occupancy: 90 }, { cx: 26, cy: 36, r: 15, occupancy: 85 },
    { cx: 42, cy: 40, r: 16, occupancy: 78 }, { cx: 58, cy: 35, r: 14, occupancy: 72 },
    { cx: 74, cy: 38, r: 13, occupancy: 65 }, { cx: 88, cy: 35, r: 11, occupancy: 58 },
    { cx: 15, cy: 52, r: 10, occupancy: 80 }, { cx: 50, cy: 52, r: 11, occupancy: 60 },
  ],

  // Floors 4-9: Hourglass/bowtie — blobs in both wings and neck
  4: [
    { cx: 12, cy: 25, r: 12, occupancy: 72 }, { cx: 25, cy: 40, r: 14, occupancy: 68 },
    { cx: 15, cy: 60, r: 12, occupancy: 62 }, { cx: 30, cy: 70, r: 10, occupancy: 55 },
    { cx: 45, cy: 45, r: 10, occupancy: 58 }, { cx: 55, cy: 40, r: 9, occupancy: 52 },
    { cx: 70, cy: 25, r: 12, occupancy: 80 }, { cx: 80, cy: 42, r: 14, occupancy: 75 },
    { cx: 75, cy: 65, r: 11, occupancy: 65 }, { cx: 88, cy: 55, r: 10, occupancy: 58 },
  ],
  5: [
    { cx: 12, cy: 22, r: 13, occupancy: 85 }, { cx: 24, cy: 42, r: 15, occupancy: 80 },
    { cx: 14, cy: 62, r: 12, occupancy: 72 }, { cx: 28, cy: 72, r: 10, occupancy: 65 },
    { cx: 44, cy: 44, r: 10, occupancy: 62 }, { cx: 56, cy: 38, r: 9, occupancy: 55 },
    { cx: 72, cy: 22, r: 13, occupancy: 82 }, { cx: 82, cy: 40, r: 15, occupancy: 78 },
    { cx: 76, cy: 64, r: 11, occupancy: 68 }, { cx: 90, cy: 52, r: 10, occupancy: 60 },
  ],
  6: [
    { cx: 13, cy: 24, r: 12, occupancy: 80 }, { cx: 24, cy: 44, r: 14, occupancy: 75 },
    { cx: 15, cy: 64, r: 11, occupancy: 68 }, { cx: 45, cy: 44, r: 9, occupancy: 58 },
    { cx: 72, cy: 24, r: 12, occupancy: 78 }, { cx: 82, cy: 44, r: 14, occupancy: 72 },
    { cx: 76, cy: 66, r: 10, occupancy: 62 },
  ],
  7: [
    { cx: 12, cy: 22, r: 14, occupancy: 88 }, { cx: 25, cy: 42, r: 15, occupancy: 82 },
    { cx: 15, cy: 65, r: 12, occupancy: 72 }, { cx: 46, cy: 42, r: 10, occupancy: 65 },
    { cx: 72, cy: 22, r: 14, occupancy: 85 }, { cx: 83, cy: 42, r: 15, occupancy: 80 },
    { cx: 76, cy: 68, r: 11, occupancy: 68 },
  ],
  8: [
    { cx: 13, cy: 24, r: 13, occupancy: 82 }, { cx: 25, cy: 44, r: 14, occupancy: 78 },
    { cx: 15, cy: 64, r: 11, occupancy: 65 }, { cx: 46, cy: 44, r: 9, occupancy: 60 },
    { cx: 73, cy: 24, r: 13, occupancy: 80 }, { cx: 83, cy: 44, r: 14, occupancy: 75 },
    { cx: 76, cy: 66, r: 10, occupancy: 62 },
  ],
  9: [
    { cx: 12, cy: 25, r: 12, occupancy: 72 }, { cx: 24, cy: 45, r: 13, occupancy: 68 },
    { cx: 15, cy: 65, r: 10, occupancy: 58 }, { cx: 45, cy: 45, r: 9, occupancy: 55 },
    { cx: 72, cy: 25, r: 12, occupancy: 70 }, { cx: 82, cy: 45, r: 13, occupancy: 65 },
    { cx: 76, cy: 67, r: 10, occupancy: 55 },
  ],

  // Floors 10-13: Three towers — fill each tower area
  10: [
    { cx: 12, cy: 22, r: 10, occupancy: 75 }, { cx: 18, cy: 42, r: 12, occupancy: 70 },
    { cx: 12, cy: 58, r: 10, occupancy: 62 },
    { cx: 40, cy: 18, r: 10, occupancy: 80 }, { cx: 46, cy: 38, r: 12, occupancy: 75 },
    { cx: 42, cy: 55, r: 10, occupancy: 65 },
    { cx: 74, cy: 18, r: 10, occupancy: 85 }, { cx: 80, cy: 38, r: 12, occupancy: 78 },
    { cx: 78, cy: 58, r: 10, occupancy: 68 },
  ],
  11: [
    { cx: 13, cy: 24, r: 10, occupancy: 65 }, { cx: 18, cy: 45, r: 11, occupancy: 60 },
    { cx: 41, cy: 20, r: 10, occupancy: 72 }, { cx: 46, cy: 40, r: 11, occupancy: 65 },
    { cx: 75, cy: 20, r: 10, occupancy: 78 }, { cx: 80, cy: 42, r: 11, occupancy: 70 },
  ],
  12: [
    { cx: 13, cy: 25, r: 10, occupancy: 68 }, { cx: 18, cy: 46, r: 11, occupancy: 62 },
    { cx: 41, cy: 22, r: 10, occupancy: 75 }, { cx: 46, cy: 42, r: 11, occupancy: 68 },
    { cx: 75, cy: 22, r: 10, occupancy: 80 }, { cx: 80, cy: 44, r: 11, occupancy: 72 },
  ],
  13: [
    { cx: 12, cy: 24, r: 10, occupancy: 70 }, { cx: 18, cy: 44, r: 11, occupancy: 65 },
    { cx: 40, cy: 20, r: 10, occupancy: 78 }, { cx: 46, cy: 40, r: 11, occupancy: 72 },
    { cx: 74, cy: 20, r: 10, occupancy: 82 }, { cx: 80, cy: 42, r: 11, occupancy: 75 },
  ],
  // Floors 14-19: Same tower layout as 13 with decreasing occupancy
  14: [
    { cx: 12, cy: 24, r: 10, occupancy: 65 }, { cx: 18, cy: 44, r: 11, occupancy: 58 },
    { cx: 40, cy: 20, r: 10, occupancy: 72 }, { cx: 46, cy: 40, r: 11, occupancy: 65 },
    { cx: 74, cy: 20, r: 10, occupancy: 75 }, { cx: 80, cy: 42, r: 11, occupancy: 68 },
  ],
  15: [
    { cx: 12, cy: 24, r: 10, occupancy: 62 }, { cx: 18, cy: 44, r: 11, occupancy: 55 },
    { cx: 40, cy: 20, r: 10, occupancy: 68 }, { cx: 46, cy: 40, r: 11, occupancy: 62 },
    { cx: 74, cy: 20, r: 10, occupancy: 72 }, { cx: 80, cy: 42, r: 11, occupancy: 65 },
  ],
  16: [
    { cx: 12, cy: 24, r: 10, occupancy: 58 }, { cx: 40, cy: 20, r: 10, occupancy: 65 },
    { cx: 46, cy: 40, r: 11, occupancy: 58 }, { cx: 74, cy: 20, r: 10, occupancy: 68 },
    { cx: 80, cy: 42, r: 11, occupancy: 60 },
  ],
  17: [
    { cx: 12, cy: 24, r: 10, occupancy: 55 }, { cx: 40, cy: 20, r: 10, occupancy: 60 },
    { cx: 74, cy: 20, r: 10, occupancy: 62 }, { cx: 80, cy: 42, r: 11, occupancy: 55 },
  ],
  18: [
    { cx: 12, cy: 24, r: 10, occupancy: 52 }, { cx: 40, cy: 20, r: 10, occupancy: 55 },
    { cx: 74, cy: 20, r: 10, occupancy: 58 },
  ],
  19: [
    { cx: 12, cy: 24, r: 10, occupancy: 55 }, { cx: 40, cy: 20, r: 10, occupancy: 60 },
    { cx: 74, cy: 20, r: 10, occupancy: 58 },
  ],
  20: [
    { cx: 30, cy: 35, r: 12, occupancy: 52 }, { cx: 60, cy: 35, r: 12, occupancy: 55 },
  ],
  21: [
    { cx: 35, cy: 35, r: 14, occupancy: 50 }, { cx: 65, cy: 35, r: 12, occupancy: 52 },
  ],
}

const DEFAULT_BLOBS: Blob[] = [
  { cx: 25, cy: 35, r: 14, occupancy: 65 },
  { cx: 50, cy: 40, r: 16, occupancy: 72 },
  { cx: 75, cy: 35, r: 14, occupancy: 58 },
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
  const maskUrl = getMaskUrl(floorNumber)

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

      {/* Floorplan with mask-clipped blob overlay */}
      <div style={{ flex: 1, position: 'relative', padding: '12px', overflow: 'auto' }}>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          {/* Floorplan image */}
          <img
            src={`/floorplans/Floor${floorNumber}.png`}
            alt={`${floorName} floor plan`}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px' }}
          />

          {/* Blob container — masked by the building outline image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              // Use the mask image: black areas = visible, white = hidden
              ...(maskUrl ? {
                WebkitMaskImage: `url(${maskUrl})`,
                maskImage: `url(${maskUrl})`,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
              } : {}),
            }}
          >
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
                    backgroundColor: isRed ? 'rgba(239,68,68,0.50)' : 'rgba(245,158,11,0.45)',
                    filter: 'blur(4px)',
                    pointerEvents: 'none',
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FloorplanWithZones
