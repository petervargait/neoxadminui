'use client';

import { useState, useEffect } from 'react';
import { Search, Check } from 'lucide-react';

export interface FontFamily {
  id: string;
  name: string;
  category: 'system' | 'google';
  fallback: string;
  weights: number[];
  googleFontUrl?: string;
}

interface FontFamilySelectorProps {
  value: FontFamily;
  onChange: (value: FontFamily) => void;
}

const SYSTEM_FONTS: FontFamily[] = [
  {
    id: 'system-ui',
    name: 'System UI',
    category: 'system',
    fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'system',
    fallback: 'Inter, system-ui, sans-serif',
    weights: [300, 400, 500, 600, 700, 800, 900],
  },
  {
    id: 'arial',
    name: 'Arial',
    category: 'system',
    fallback: 'Arial, Helvetica, sans-serif',
    weights: [400, 700],
  },
  {
    id: 'georgia',
    name: 'Georgia',
    category: 'system',
    fallback: 'Georgia, "Times New Roman", serif',
    weights: [400, 700],
  },
];

const GOOGLE_FONTS: FontFamily[] = [
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'google',
    fallback: 'Roboto, sans-serif',
    weights: [100, 300, 400, 500, 700, 900],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    category: 'google',
    fallback: '"Open Sans", sans-serif',
    weights: [300, 400, 500, 600, 700, 800],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap',
  },
  {
    id: 'lato',
    name: 'Lato',
    category: 'google',
    fallback: 'Lato, sans-serif',
    weights: [100, 300, 400, 700, 900],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'google',
    fallback: 'Montserrat, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'google',
    fallback: 'Poppins, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'raleway',
    name: 'Raleway',
    category: 'google',
    fallback: 'Raleway, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'nunito',
    name: 'Nunito',
    category: 'google',
    fallback: 'Nunito, sans-serif',
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    category: 'google',
    fallback: 'Ubuntu, sans-serif',
    weights: [300, 400, 500, 700],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap',
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    category: 'google',
    fallback: '"Work Sans", sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    category: 'google',
    fallback: '"Playfair Display", serif',
    weights: [400, 500, 600, 700, 800, 900],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
  },
];

export default function FontFamilySelector({ value, onChange }: FontFamilySelectorProps) {
  const [category, setCategory] = useState<'system' | 'google'>(value.category || 'google');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFont, setSelectedFont] = useState<FontFamily>(value);
  const [previewSize, setPreviewSize] = useState(16);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load Google Font dynamically
  useEffect(() => {
    if (selectedFont?.category === 'google' && selectedFont.googleFontUrl) {
      const existingLink = document.getElementById('white-label-font-preview');
      if (existingLink) {
        existingLink.remove();
      }

      const link = document.createElement('link');
      link.id = 'white-label-font-preview';
      link.rel = 'stylesheet';
      link.href = selectedFont.googleFontUrl;
      link.onload = () => setFontLoaded(true);
      link.onerror = () => setFontLoaded(false);
      document.head.appendChild(link);
    } else {
      setFontLoaded(true);
    }
  }, [selectedFont]);

  const fonts = category === 'system' ? SYSTEM_FONTS : GOOGLE_FONTS;
  const filteredFonts = searchQuery
    ? fonts.filter(font => font.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : fonts;

  const handleFontSelect = (font: FontFamily) => {
    setSelectedFont(font);
    onChange(font);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      backgroundColor: 'rgba(51, 78, 104, 0.3)',
      border: '1px solid rgba(75, 101, 129, 0.3)',
      borderRadius: '8px'
    }}>
      <label style={{ color: '#d7bb91', fontSize: '16px', fontWeight: '600' }}>Font Family</label>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setCategory('system')}
          style={{
            flex: 1,
            padding: '8px 16px',
            backgroundColor: category === 'system' ? 'rgba(75, 101, 129, 0.8)' : 'rgba(51, 78, 104, 0.5)',
            border: `1px solid ${category === 'system' ? '#d7bb91' : 'rgba(75, 101, 129, 0.3)'}`,
            borderRadius: '6px',
            color: '#d7bb91',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          System Fonts
        </button>
        <button
          onClick={() => setCategory('google')}
          style={{
            flex: 1,
            padding: '8px 16px',
            backgroundColor: category === 'google' ? 'rgba(75, 101, 129, 0.8)' : 'rgba(51, 78, 104, 0.5)',
            border: `1px solid ${category === 'google' ? '#d7bb91' : 'rgba(75, 101, 129, 0.3)'}`,
            borderRadius: '6px',
            color: '#d7bb91',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Google Fonts
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search 
          size={16} 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'rgba(215, 187, 145, 0.5)' 
          }} 
        />
        <input
          type="text"
          placeholder="Search fonts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            backgroundColor: 'rgba(51, 78, 104, 0.5)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            borderRadius: '8px',
            color: '#d7bb91',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Font List */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid rgba(75, 101, 129, 0.3)',
        borderRadius: '8px',
        backgroundColor: 'rgba(51, 78, 104, 0.2)'
      }}>
        {filteredFonts.map((font) => (
          <label
            key={font.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              borderBottom: '1px solid rgba(75, 101, 129, 0.2)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              fontFamily: font.fallback,
              backgroundColor: selectedFont?.id === font.id ? 'rgba(75, 101, 129, 0.3)' : 'transparent'
            }}
            onClick={() => handleFontSelect(font)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 101, 129, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedFont?.id === font.id ? 'rgba(75, 101, 129, 0.3)' : 'transparent'}
          >
            <input
              type="radio"
              checked={selectedFont?.id === font.id}
              onChange={() => handleFontSelect(font)}
              style={{ marginTop: '4px', cursor: 'pointer' }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#d7bb91', fontSize: '14px' }}>
                  {font.name}
                </span>
                {selectedFont?.id === font.id && (
                  <Check size={16} style={{ color: '#d7bb91' }} />
                )}
              </div>
              <div
                style={{
                  fontFamily: font.fallback,
                  fontSize: `${previewSize}px`,
                  color: '#d7bb91',
                  opacity: 0.9
                }}
              >
                The quick brown fox jumps over the lazy dog
              </div>
              <div
                style={{
                  fontFamily: font.fallback,
                  fontSize: '12px',
                  color: '#d7bb91',
                  opacity: 0.7
                }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
              </div>
              <div style={{ fontSize: '11px', color: '#d7bb91', opacity: 0.6 }}>
                Weights: {font.weights.join(', ')}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Preview Size Selector */}
      <div>
        <label style={{ color: '#d7bb91', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          Preview Size
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[12, 14, 16, 20, 24].map(size => (
            <button
              key={size}
              onClick={() => setPreviewSize(size)}
              style={{
                padding: '6px 12px',
                backgroundColor: previewSize === size ? 'rgba(75, 101, 129, 0.8)' : 'rgba(51, 78, 104, 0.5)',
                border: `1px solid ${previewSize === size ? '#d7bb91' : 'rgba(75, 101, 129, 0.3)'}`,
                borderRadius: '6px',
                color: '#d7bb91',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      {selectedFont && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500' }}>Live Preview</label>
          <div
            style={{
              padding: '24px',
              border: '1px solid rgba(75, 101, 129, 0.3)',
              borderRadius: '8px',
              backgroundColor: 'rgba(51, 78, 104, 0.2)',
              fontFamily: selectedFont.fallback,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#d7bb91', margin: 0 }}>
              Your Application Title
            </h1>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#d7bb91', margin: 0 }}>
              Section Heading
            </h2>
            <p style={{ fontSize: '16px', color: '#d7bb91', margin: 0, lineHeight: 1.6, opacity: 0.9 }}>
              This is how regular paragraph text will appear in your application with the selected font family. You can see how it looks at various sizes and weights.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: 'rgba(75, 101, 129, 0.8)',
                border: '1px solid #d7bb91',
                borderRadius: '6px',
                color: '#d7bb91',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Button Example
              </button>
              <a href="#" style={{ color: '#d7bb91', textDecoration: 'underline' }}>
                Link Example
              </a>
            </div>
            <div style={{
              paddingTop: '16px',
              borderTop: '1px solid rgba(75, 101, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '14px'
            }}>
              <div style={{ fontWeight: 300, color: '#d7bb91', opacity: 0.8 }}>Light (300): The quick brown fox</div>
              <div style={{ fontWeight: 400, color: '#d7bb91', opacity: 0.8 }}>Regular (400): The quick brown fox</div>
              <div style={{ fontWeight: 500, color: '#d7bb91', opacity: 0.8 }}>Medium (500): The quick brown fox</div>
              <div style={{ fontWeight: 600, color: '#d7bb91', opacity: 0.8 }}>Semibold (600): The quick brown fox</div>
              <div style={{ fontWeight: 700, color: '#d7bb91', opacity: 0.8 }}>Bold (700): The quick brown fox</div>
            </div>
          </div>

          {/* Font Loading Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            {fontLoaded ? (
              <>
                <Check size={14} style={{ color: '#22c55e' }} />
                <span style={{ color: '#22c55e' }}>Font loaded successfully</span>
              </>
            ) : (
              <>
                <div style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(215, 187, 145, 0.3)',
                  borderTopColor: '#d7bb91',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span style={{ color: '#d7bb91', opacity: 0.7 }}>Loading font...</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
