'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

// Helper component for gradient stop with its own color picker
function GradientStopPicker({ 
  stop, 
  index, 
  canRemove, 
  onUpdate, 
  onRemove,
  hslToHex,
  hexToHsl 
}: { 
  stop: GradientStop; 
  index: number;
  canRemove: boolean;
  onUpdate: (id: string, updates: Partial<GradientStop>) => void;
  onRemove: (id: string) => void;
  hslToHex: (h: number, s: number, l: number) => string;
  hexToHsl: (hex: string) => { h: number; s: number; l: number };
}) {
  const stopHsl = hexToHsl(stop.color);
  const [stopHue, setStopHue] = useState(stopHsl.h);
  const [stopSaturation, setStopSaturation] = useState(stopHsl.s);
  const [stopLightness, setStopLightness] = useState(stopHsl.l);
  const [showStopPicker, setShowStopPicker] = useState(false);

  return (
    <div
      style={{
        padding: '12px',
        backgroundColor: 'rgba(51, 78, 104, 0.5)',
        border: '1px solid rgba(75, 101, 129, 0.3)',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => setShowStopPicker(!showStopPicker)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            backgroundColor: stop.color,
            opacity: stop.alpha / 100,
            border: '2px solid rgba(215, 187, 145, 0.3)',
            cursor: 'pointer',
            flexShrink: 0
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ color: '#d7bb91', fontSize: '11px', opacity: 0.7, marginBottom: '2px' }}>Stop {index + 1}</div>
          <div style={{
            padding: '4px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            borderRadius: '4px',
            color: '#d7bb91',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            {stop.color}
          </div>
        </div>
        {canRemove && (
          <button
            onClick={() => onRemove(stop.id)}
            style={{
              padding: '6px',
              backgroundColor: 'rgba(220, 38, 38, 0.2)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '4px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Inline Color Picker for Stop */}
      {showStopPicker && (
        <div style={{ padding: '12px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px', border: '1px solid rgba(75, 101, 129, 0.3)' }}>
          {/* Color Grid */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '150px',
            borderRadius: '6px',
            overflow: 'hidden',
            cursor: 'crosshair',
            background: `
              linear-gradient(to bottom, transparent, black),
              linear-gradient(to right, white, hsl(${stopHue}, 100%, 50%))
            `,
            border: '2px solid rgba(75, 101, 129, 0.3)',
            marginBottom: '8px'
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const newSat = Math.round((x / rect.width) * 100);
            const newLight = Math.round(100 - (y / rect.height) * 100);
            setStopSaturation(newSat);
            setStopLightness(newLight);
            onUpdate(stop.id, { color: hslToHex(stopHue, newSat, newLight) });
          }}
          >
            <div style={{
              position: 'absolute',
              left: `${stopSaturation}%`,
              top: `${100 - stopLightness}%`,
              width: '12px',
              height: '12px',
              border: '2px solid white',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 0 1px black',
              pointerEvents: 'none'
            }} />
          </div>

          {/* Hue Bar */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '20px',
            borderRadius: '4px',
            cursor: 'pointer',
            background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
            border: '2px solid rgba(75, 101, 129, 0.3)'
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const newHue = Math.round((x / rect.width) * 360);
            setStopHue(newHue);
            onUpdate(stop.id, { color: hslToHex(newHue, stopSaturation, stopLightness) });
          }}
          >
            <div style={{
              position: 'absolute',
              left: `${(stopHue / 360) * 100}%`,
              top: '50%',
              width: '3px',
              height: '100%',
              backgroundColor: 'white',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 0 1px black',
              pointerEvents: 'none'
            }} />
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ color: '#d7bb91', display: 'block', marginBottom: '4px' }}>
            Position: {stop.position}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={stop.position}
            onChange={(e) => onUpdate(stop.id, { position: Number(e.target.value) })}
            style={{ width: '100%', height: '6px' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ color: '#d7bb91', display: 'block', marginBottom: '4px' }}>
            Alpha: {stop.alpha}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={stop.alpha}
            onChange={(e) => onUpdate(stop.id, { alpha: Number(e.target.value) })}
            style={{ width: '100%', height: '6px' }}
          />
        </div>
      </div>
    </div>
  );
}

export interface ColorConfig {
  type: 'solid' | 'gradient';
  solid?: {
    color: string;
    alpha: number;
  };
  gradient?: {
    type: 'linear' | 'radial' | 'conic';
    angle?: number;
    stops: GradientStop[];
  };
}

export interface GradientStop {
  id: string;
  color: string;
  alpha: number;
  position: number;
}

interface ColorPickerProps {
  value: ColorConfig;
  onChange: (value: ColorConfig) => void;
  label?: string;
}

export default function ColorPicker({ value, onChange, label = 'Color' }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'solid' | 'gradient'>(value.type || 'solid');
  
  // Solid color state
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(85);
  const [lightness, setLightness] = useState(50);
  const [alpha, setAlpha] = useState(value.solid?.alpha || 100);
  const [hexValue, setHexValue] = useState(value.solid?.color || '#3B82F6');
  
  // Gradient state
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>(
    value.gradient?.type || 'linear'
  );
  const [angle, setAngle] = useState(value.gradient?.angle || 135);
  const [stops, setStops] = useState<GradientStop[]>(
    value.gradient?.stops || [
      { id: '1', color: '#3B82F6', alpha: 100, position: 0 },
      { id: '2', color: '#8B5CF6', alpha: 100, position: 100 },
    ]
  );

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // Convert Hex to HSL
  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // Update hex when HSL changes
  useEffect(() => {
    const hex = hslToHex(hue, saturation, lightness);
    setHexValue(hex);
  }, [hue, saturation, lightness]);

  // Notify parent of changes
  useEffect(() => {
    if (mode === 'solid') {
      onChange({
        type: 'solid',
        solid: { color: hexValue, alpha },
      });
    } else {
      onChange({
        type: 'gradient',
        gradient: { type: gradientType, angle, stops },
      });
    }
  }, [mode, hexValue, alpha, gradientType, angle, stops]);

  // Generate CSS gradient string
  const generateGradientCSS = (): string => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops.map(stop => {
      const rgb = hexToRgb(stop.color);
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${stop.alpha / 100}) ${stop.position}%`;
    });

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stopStrings.join(', ')})`;
      case 'radial':
        return `radial-gradient(circle, ${stopStrings.join(', ')})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stopStrings.join(', ')})`;
    }
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  };

  const addStop = () => {
    const newStop: GradientStop = {
      id: Date.now().toString(),
      color: '#888888',
      alpha: 100,
      position: 50,
    };
    setStops([...stops, newStop]);
  };

  const removeStop = (id: string) => {
    if (stops.length > 2) {
      setStops(stops.filter(s => s.id !== id));
    }
  };

  const updateStop = (id: string, updates: Partial<GradientStop>) => {
    setStops(stops.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Get display value for button
  const getDisplayValue = () => {
    if (value.type === 'solid' && value.solid) {
      return value.solid.color;
    } else if (value.type === 'gradient' && value.gradient) {
      const sortedStops = [...value.gradient.stops].sort((a, b) => a.position - b.position);
      const stopStrings = sortedStops.map(stop => {
        const rgb = hexToRgb(stop.color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${stop.alpha / 100}) ${stop.position}%`;
      });
      switch (value.gradient.type) {
        case 'linear':
          return `linear-gradient(${value.gradient.angle}deg, ${stopStrings.join(', ')})`;
        case 'radial':
          return `radial-gradient(circle, ${stopStrings.join(', ')})`;
        case 'conic':
          return `conic-gradient(from ${value.gradient.angle}deg, ${stopStrings.join(', ')})`;
      }
    }
    return '#d7bb91';
  };

  return (
    <>
      {/* Trigger Button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500' }}>{label}</label>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'rgba(51, 78, 104, 0.5)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 78, 104, 0.7)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 78, 104, 0.5)'}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '6px',
              background: getDisplayValue(),
              border: '2px solid rgba(215, 187, 145, 0.3)',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500' }}>
              {value.type === 'solid' ? 'Solid Color' : `${value.gradient?.type} Gradient`}
            </div>
            <div style={{ color: '#d7bb91', fontSize: '12px', opacity: 0.7 }}>
              {value.type === 'solid' 
                ? `${value.solid?.color} (${value.solid?.alpha}% opacity)`
                : `${value.gradient?.stops.length} color stops`}
            </div>
          </div>
          <div style={{ color: '#d7bb91', fontSize: '12px' }}>Edit →</div>
        </button>
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#162032',
              borderRadius: '12px',
              border: '1px solid rgba(75, 101, 129, 0.5)',
              maxWidth: '600px',
              maxHeight: '90vh',
              width: '100%',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              padding: '24px'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#d7bb91', fontSize: '20px', fontWeight: '600' }}>{label}</label>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(51, 78, 104, 0.5)',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    color: '#d7bb91',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
      
      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setMode('solid')}
          style={{
            flex: 1,
            padding: '8px 16px',
            backgroundColor: mode === 'solid' ? 'rgba(75, 101, 129, 0.8)' : 'rgba(51, 78, 104, 0.5)',
            border: `1px solid ${mode === 'solid' ? '#d7bb91' : 'rgba(75, 101, 129, 0.3)'}`,
            borderRadius: '6px',
            color: '#d7bb91',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Solid Color
        </button>
        <button
          onClick={() => setMode('gradient')}
          style={{
            flex: 1,
            padding: '8px 16px',
            backgroundColor: mode === 'gradient' ? 'rgba(75, 101, 129, 0.8)' : 'rgba(51, 78, 104, 0.5)',
            border: `1px solid ${mode === 'gradient' ? '#d7bb91' : 'rgba(75, 101, 129, 0.3)'}`,
            borderRadius: '6px',
            color: '#d7bb91',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Gradient
        </button>
      </div>

      {/* Solid Color Mode */}
      {mode === 'solid' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Color Picker Grid */}
          <div>
            <label style={{ color: '#d7bb91', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Select Color
            </label>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '200px',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'crosshair',
              background: `
                linear-gradient(to bottom, transparent, black),
                linear-gradient(to right, white, hsl(${hue}, 100%, 50%))
              `,
              border: '2px solid rgba(75, 101, 129, 0.3)'
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const newSaturation = Math.round((x / rect.width) * 100);
              const newLightness = Math.round(100 - (y / rect.height) * 100);
              setSaturation(newSaturation);
              setLightness(newLightness);
            }}
            >
              {/* Picker Indicator */}
              <div style={{
                position: 'absolute',
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
                width: '16px',
                height: '16px',
                border: '3px solid white',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 1px black, 0 2px 4px rgba(0,0,0,0.3)',
                pointerEvents: 'none'
              }} />
            </div>
          </div>

          {/* Hue Bar */}
          <div>
            <label style={{ color: '#d7bb91', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Hue
            </label>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '30px',
              borderRadius: '6px',
              cursor: 'pointer',
              background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
              border: '2px solid rgba(75, 101, 129, 0.3)'
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const newHue = Math.round((x / rect.width) * 360);
              setHue(newHue);
            }}
            >
              {/* Hue Indicator */}
              <div style={{
                position: 'absolute',
                left: `${(hue / 360) * 100}%`,
                top: '50%',
                width: '4px',
                height: '100%',
                backgroundColor: 'white',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 1px black',
                pointerEvents: 'none'
              }} />
            </div>
          </div>

          {/* Alpha Slider */}
          <div>
            <label style={{ color: '#d7bb91', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Transparency (Alpha): {alpha}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              style={{ width: '100%', height: '8px' }}
            />
            {/* Transparency Preview */}
            <div style={{
              marginTop: '8px',
              height: '32px',
              borderRadius: '4px',
              backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
              backgroundSize: '10px 10px',
              backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: hexValue,
                opacity: alpha / 100,
                borderRadius: '4px'
              }} />
            </div>
          </div>

          {/* Color Preview */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', backgroundColor: 'rgba(51, 78, 104, 0.3)', borderRadius: '8px', border: '1px solid rgba(75, 101, 129, 0.3)' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                backgroundColor: hexValue,
                opacity: alpha / 100,
                border: '2px solid rgba(215, 187, 145, 0.3)',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#d7bb91', fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>Selected Color</div>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '6px',
                color: '#d7bb91',
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: '600'
              }}>
                {hexValue}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gradient Mode */}
      {mode === 'gradient' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Gradient Type */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['linear', 'radial', 'conic'] as const).map(type => (
              <button
                key={type}
                onClick={() => setGradientType(type)}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  backgroundColor: gradientType === type ? 'rgba(75, 101, 129, 0.8)' : 'rgba(51, 78, 104, 0.5)',
                  border: `1px solid ${gradientType === type ? '#d7bb91' : 'rgba(75, 101, 129, 0.3)'}`,
                  borderRadius: '6px',
                  color: '#d7bb91',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'capitalize'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div
            style={{
              height: '80px',
              borderRadius: '8px',
              background: generateGradientCSS(),
              border: '2px solid rgba(215, 187, 145, 0.3)'
            }}
          />

          {/* Angle Slider (for linear and conic) */}
          {(gradientType === 'linear' || gradientType === 'conic') && (
            <div>
              <label style={{ color: '#d7bb91', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                {gradientType === 'linear' ? 'Angle' : 'Rotation'}: {angle}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                style={{ width: '100%', height: '8px' }}
              />
            </div>
          )}

          {/* Gradient Stops */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500' }}>Color Stops</label>
            {stops.map((stop, index) => (
              <GradientStopPicker
                key={stop.id}
                stop={stop}
                index={index}
                canRemove={stops.length > 2}
                onUpdate={updateStop}
                onRemove={removeStop}
                hslToHex={hslToHex}
                hexToHsl={hexToHsl}
              />
            ))}

            <button
              onClick={addStop}
              style={{
                padding: '8px',
                border: '2px dashed rgba(75, 101, 129, 0.5)',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#d7bb91',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} />
              Add Color Stop
            </button>
          </div>

          {/* CSS Output */}
          <div>
            <label style={{ color: '#d7bb91', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
              CSS Output:
            </label>
            <pre style={{
              padding: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(75, 101, 129, 0.3)',
              borderRadius: '4px',
              color: '#d7bb91',
              fontSize: '10px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {generateGradientCSS()}
            </pre>
          </div>
        </div>
      )}

              {/* Done Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(75, 101, 129, 0.3)' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'rgba(75, 101, 129, 0.8)',
                    border: '1px solid #d7bb91',
                    borderRadius: '8px',
                    color: '#d7bb91',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 101, 129, 1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 101, 129, 0.8)'}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
