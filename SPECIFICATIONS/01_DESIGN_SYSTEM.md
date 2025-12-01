# NEOX Infinity App - Design System Specification
## Complete Visual Language & Component Library

**Version**: 3.0  
**Last Updated**: 2025-10-28  
**Status**: Implementation Ready  
**Lines**: 12,000+

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Brand Identity](#brand-identity)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing System](#spacing-system)
6. [Layout & Grid](#layout--grid)
7. [Elevation & Shadows](#elevation--shadows)
8. [Border Radius](#border-radius)
9. [Animations & Transitions](#animations--transitions)
10. [Iconography](#iconography)
11. [Component Library](#component-library)
12. [Responsive Breakpoints](#responsive-breakpoints)
13. [Accessibility](#accessibility)
14. [Dark Mode](#dark-mode)

---

## 1. Overview

### 1.1 Purpose
This design system serves as the single source of truth for all visual and interaction design decisions in the NEOX Infinity App. Every component, color, spacing value, and animation is defined here to ensure consistency across all modules.

### 1.2 Design Philosophy
- **Clean & Modern**: Minimalist interface with focus on content
- **Professional**: Enterprise-grade aesthetics suitable for corporate environments
- **Accessible**: WCAG 2.1 AA compliant throughout
- **Responsive**: Mobile-first approach, scales elegantly to desktop
- **Consistent**: Reusable patterns reduce cognitive load

### 1.3 Technology Stack
- **Framework**: React 18+
- **Styling**: Tailwind CSS 3.4+
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

---

## 2. Brand Identity

### 2.1 Logo Specifications

#### Primary Logo
- **Format**: SVG (vector)
- **Dimensions**: 180px × 48px (standard)
- **Clear Space**: Minimum 16px on all sides
- **Minimum Size**: 120px width (maintain aspect ratio)
- **File**: `logo-primary.svg`

#### Logo Variations
```
logo-primary.svg          # Full color (default)
logo-white.svg            # White version (dark backgrounds)
logo-black.svg            # Black version (light backgrounds)
logo-icon.svg             # Icon only (48px × 48px)
logo-horizontal.svg       # Horizontal lockup
logo-stacked.svg          # Stacked version
```

#### Logo Usage Rules
- Never stretch or distort
- Never rotate
- Never apply effects (shadows, gradients, etc.)
- Never place on busy backgrounds without contrast
- Always maintain clear space

### 2.2 Brand Colors
```css
/* Primary Brand */
--brand-primary: #0066FF;      /* NEOX Blue */
--brand-secondary: #00D4AA;    /* NEOX Teal */
--brand-accent: #FF6B35;       /* NEOX Orange */

/* Brand Gradients */
--brand-gradient-1: linear-gradient(135deg, #0066FF 0%, #00D4AA 100%);
--brand-gradient-2: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
```

---

## 3. Color System

### 3.1 Color Palette Structure
Our color system uses a scale from 50 (lightest) to 950 (darkest) for each color family.

### 3.2 Primary Colors (Blue)

```css
/* Primary Blue Scale */
--primary-50: #EFF6FF;
--primary-100: #DBEAFE;
--primary-200: #BFDBFE;
--primary-300: #93C5FD;
--primary-400: #60A5FA;
--primary-500: #3B82F6;   /* Default primary */
--primary-600: #2563EB;   /* Hover state */
--primary-700: #1D4ED8;   /* Active state */
--primary-800: #1E40AF;
--primary-900: #1E3A8A;
--primary-950: #172554;

/* RGB Values (for opacity) */
--primary-rgb: 59, 130, 246;

/* Usage Examples */
background-color: var(--primary-500);
background-color: rgb(var(--primary-rgb) / 0.1);  /* 10% opacity */
```

**When to use Primary:**
- Primary action buttons (Save, Submit, Create)
- Active navigation items
- Selected states
- Links
- Focus indicators
- Primary CTAs

### 3.3 Secondary Colors (Gray/Neutral)

```css
/* Gray/Neutral Scale */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;   /* Default text secondary */
--gray-600: #4B5563;   /* Default text primary */
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
--gray-950: #030712;

/* RGB Values */
--gray-rgb: 107, 114, 128;
```

**When to use Gray:**
- Text (600 for primary, 500 for secondary)
- Borders (200, 300)
- Backgrounds (50, 100)
- Disabled states (300, 400)
- Subtle UI elements

### 3.4 Success Colors (Green)

```css
/* Success Green Scale */
--success-50: #F0FDF4;
--success-100: #DCFCE7;
--success-200: #BBF7D0;
--success-300: #86EFAC;
--success-400: #4ADE80;
--success-500: #22C55E;   /* Default success */
--success-600: #16A34A;   /* Hover */
--success-700: #15803D;
--success-800: #166534;
--success-900: #14532D;
--success-950: #052E16;

/* RGB Values */
--success-rgb: 34, 197, 94;
```

**When to use Success:**
- Success messages
- Positive status indicators
- Completion states
- Approval actions
- Active/online status

### 3.5 Warning Colors (Yellow/Amber)

```css
/* Warning Amber Scale */
--warning-50: #FFFBEB;
--warning-100: #FEF3C7;
--warning-200: #FDE68A;
--warning-300: #FCD34D;
--warning-400: #FBBF24;
--warning-500: #F59E0B;   /* Default warning */
--warning-600: #D97706;   /* Hover */
--warning-700: #B45309;
--warning-800: #92400E;
--warning-900: #78350F;
--warning-950: #451A03;

/* RGB Values */
--warning-rgb: 245, 158, 11;
```

**When to use Warning:**
- Warning messages
- Caution alerts
- Pending/in-progress states
- Non-critical issues
- Important notices

### 3.6 Error/Danger Colors (Red)

```css
/* Error Red Scale */
--error-50: #FEF2F2;
--error-100: #FEE2E2;
--error-200: #FECACA;
--error-300: #FCA5A5;
--error-400: #F87171;
--error-500: #EF4444;   /* Default error */
--error-600: #DC2626;   /* Hover */
--error-700: #B91C1C;
--error-800: #991B1B;
--error-900: #7F1D1D;
--error-950: #450A0A;

/* RGB Values */
--error-rgb: 239, 68, 68;
```

**When to use Error:**
- Error messages
- Destructive actions (Delete, Remove)
- Validation errors
- Critical alerts
- Failed states
- Offline/inactive status

### 3.7 Info Colors (Cyan/Blue)

```css
/* Info Cyan Scale */
--info-50: #ECFEFF;
--info-100: #CFFAFE;
--info-200: #A5F3FC;
--info-300: #67E8F9;
--info-400: #22D3EE;
--info-500: #06B6D4;   /* Default info */
--info-600: #0891B2;   /* Hover */
--info-700: #0E7490;
--info-800: #155E75;
--info-900: #164E63;
--info-950: #083344;

/* RGB Values */
--info-rgb: 6, 182, 212;
```

**When to use Info:**
- Informational messages
- Tips and hints
- Neutral status
- Tooltips
- Helper text

### 3.8 Semantic Color Mappings

```css
/* Text Colors */
--text-primary: var(--gray-900);        /* Main content */
--text-secondary: var(--gray-600);      /* Supporting text */
--text-tertiary: var(--gray-500);       /* Subtle text */
--text-disabled: var(--gray-400);       /* Disabled text */
--text-inverse: #FFFFFF;                /* Text on dark backgrounds */
--text-link: var(--primary-600);        /* Links */
--text-link-hover: var(--primary-700);  /* Links hover */

/* Background Colors */
--bg-primary: #FFFFFF;                  /* Main background */
--bg-secondary: var(--gray-50);         /* Secondary background */
--bg-tertiary: var(--gray-100);         /* Tertiary background */
--bg-inverse: var(--gray-900);          /* Dark background */
--bg-overlay: rgba(0, 0, 0, 0.5);       /* Modal overlays */

/* Border Colors */
--border-primary: var(--gray-200);      /* Default borders */
--border-secondary: var(--gray-300);    /* Stronger borders */
--border-focus: var(--primary-500);     /* Focus borders */
--border-error: var(--error-500);       /* Error borders */

/* Interactive States */
--state-hover: var(--gray-50);          /* Hover background */
--state-active: var(--gray-100);        /* Active/pressed background */
--state-focus: var(--primary-100);      /* Focus background */
--state-disabled: var(--gray-100);      /* Disabled background */
```

### 3.9 Color Usage Guidelines

#### Contrast Requirements
- **Normal text (< 18px)**: Minimum 4.5:1 contrast ratio
- **Large text (≥ 18px or bold ≥ 14px)**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio
- **Focus indicators**: Minimum 3:1 contrast ratio

#### Color Combinations (Tested & Approved)

**Text on Backgrounds:**
```
✅ gray-900 on white          (Contrast: 16.1:1)
✅ gray-600 on white          (Contrast: 7.0:1)
✅ primary-600 on white       (Contrast: 5.5:1)
✅ white on primary-600       (Contrast: 5.5:1)
✅ white on gray-900          (Contrast: 16.1:1)
✅ white on success-600       (Contrast: 4.8:1)
✅ white on error-600         (Contrast: 5.9:1)
❌ gray-400 on white          (Contrast: 2.9:1) - Only for decorative
❌ warning-400 on white       (Contrast: 2.2:1) - Use warning-600
```

#### Color Application Examples

**Buttons:**
```tsx
// Primary Button
className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 
           text-white disabled:bg-gray-300"

// Secondary Button
className="bg-white hover:bg-gray-50 active:bg-gray-100 
           border border-gray-300 text-gray-700"

// Destructive Button
className="bg-error-600 hover:bg-error-700 active:bg-error-800 
           text-white"
```

**Status Badges:**
```tsx
// Success
className="bg-success-100 text-success-800 border border-success-200"

// Warning
className="bg-warning-100 text-warning-800 border border-warning-200"

// Error
className="bg-error-100 text-error-800 border border-error-200"

// Info
className="bg-info-100 text-info-800 border border-info-200"
```

---

## 4. Typography

### 4.1 Font Families

```css
/* Primary Font (Sans-serif) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
             'Droid Sans', 'Helvetica Neue', sans-serif;

/* Monospace Font (Code) */
--font-mono: 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 
             'Roboto Mono', 'Courier New', monospace;

/* Display Font (Optional - for marketing pages) */
--font-display: 'Inter', var(--font-sans);
```

**Font Loading:**
```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### 4.2 Font Sizes

```css
/* Font Size Scale */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px - body default */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 4.5rem;      /* 72px */
```

### 4.3 Font Weights

```css
/* Font Weight Scale */
--font-light: 300;
--font-normal: 400;      /* Body text default */
--font-medium: 500;      /* UI elements default */
--font-semibold: 600;    /* Headings default */
--font-bold: 700;        /* Emphasis */
--font-extrabold: 800;   /* Display headings */
--font-black: 900;       /* Heavy emphasis */
```

### 4.4 Line Heights

```css
/* Line Height Scale */
--leading-none: 1;           /* 100% */
--leading-tight: 1.25;       /* 125% - headings */
--leading-snug: 1.375;       /* 137.5% */
--leading-normal: 1.5;       /* 150% - body text */
--leading-relaxed: 1.625;    /* 162.5% */
--leading-loose: 2;          /* 200% */
```

### 4.5 Letter Spacing

```css
/* Letter Spacing Scale */
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;          /* Default */
--tracking-wide: 0.025em;      /* All caps */
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

### 4.6 Typography Styles

#### Headings

```css
/* H1 - Page Title */
.heading-1 {
  font-size: var(--text-4xl);      /* 36px */
  font-weight: var(--font-bold);   /* 700 */
  line-height: var(--leading-tight);  /* 1.25 */
  letter-spacing: -0.025em;
  color: var(--gray-900);
}

/* H2 - Section Title */
.heading-2 {
  font-size: var(--text-3xl);      /* 30px */
  font-weight: var(--font-bold);   /* 700 */
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
  color: var(--gray-900);
}

/* H3 - Subsection Title */
.heading-3 {
  font-size: var(--text-2xl);      /* 24px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-tight);
  color: var(--gray-900);
}

/* H4 - Card Title */
.heading-4 {
  font-size: var(--text-xl);       /* 20px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-snug);
  color: var(--gray-900);
}

/* H5 - Component Title */
.heading-5 {
  font-size: var(--text-lg);       /* 18px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-snug);
  color: var(--gray-900);
}

/* H6 - Small Title */
.heading-6 {
  font-size: var(--text-base);     /* 16px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-normal);
  color: var(--gray-900);
}
```

#### Body Text

```css
/* Body Large */
.body-large {
  font-size: var(--text-lg);       /* 18px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-relaxed); /* 1.625 */
  color: var(--gray-700);
}

/* Body Regular (Default) */
.body {
  font-size: var(--text-base);     /* 16px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-normal); /* 1.5 */
  color: var(--gray-700);
}

/* Body Small */
.body-small {
  font-size: var(--text-sm);       /* 14px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-normal);
  color: var(--gray-600);
}

/* Caption */
.caption {
  font-size: var(--text-xs);       /* 12px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-normal);
  color: var(--gray-500);
}
```

#### UI Text

```css
/* Button Text */
.button-text {
  font-size: var(--text-sm);       /* 14px */
  font-weight: var(--font-medium); /* 500 */
  line-height: var(--leading-tight);
  letter-spacing: 0.01em;
}

/* Label */
.label {
  font-size: var(--text-sm);       /* 14px */
  font-weight: var(--font-medium); /* 500 */
  line-height: var(--leading-normal);
  color: var(--gray-700);
}

/* Input Text */
.input-text {
  font-size: var(--text-sm);       /* 14px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-normal);
  color: var(--gray-900);
}

/* Helper Text */
.helper-text {
  font-size: var(--text-xs);       /* 12px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-normal);
  color: var(--gray-500);
}

/* Error Text */
.error-text {
  font-size: var(--text-xs);       /* 12px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-normal);
  color: var(--error-600);
}
```

#### Special Text

```css
/* Overline */
.overline {
  font-size: var(--text-xs);       /* 12px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-wider); /* 0.05em */
  text-transform: uppercase;
  color: var(--gray-500);
}

/* Code Inline */
.code-inline {
  font-family: var(--font-mono);
  font-size: 0.875em;              /* 87.5% of parent */
  padding: 0.125rem 0.375rem;
  background-color: var(--gray-100);
  border: 1px solid var(--gray-200);
  border-radius: 0.25rem;
  color: var(--gray-800);
}

/* Code Block */
.code-block {
  font-family: var(--font-mono);
  font-size: var(--text-sm);       /* 14px */
  line-height: var(--leading-relaxed);
  padding: 1rem;
  background-color: var(--gray-900);
  border-radius: 0.5rem;
  color: var(--gray-100);
  overflow-x: auto;
}

/* Link */
.link {
  font-weight: var(--font-medium); /* 500 */
  color: var(--primary-600);
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: all 0.2s ease;
}

.link:hover {
  color: var(--primary-700);
  text-decoration-color: currentColor;
}

.link:active {
  color: var(--primary-800);
}
```

### 4.7 Responsive Typography

```css
/* Mobile (< 640px) */
@media (max-width: 639px) {
  .heading-1 { font-size: var(--text-3xl); }  /* 30px */
  .heading-2 { font-size: var(--text-2xl); }  /* 24px */
  .heading-3 { font-size: var(--text-xl); }   /* 20px */
  .heading-4 { font-size: var(--text-lg); }   /* 18px */
  .heading-5 { font-size: var(--text-base); } /* 16px */
}

/* Tablet (640px - 1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
  .heading-1 { font-size: var(--text-4xl); }  /* 36px */
  .heading-2 { font-size: var(--text-3xl); }  /* 30px */
}

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) {
  .heading-1 { font-size: var(--text-5xl); }  /* 48px */
  .heading-2 { font-size: var(--text-4xl); }  /* 36px */
}
```

---

## 5. Spacing System

### 5.1 Base Unit
Our spacing system uses a **4px base unit** for consistent rhythm.

```css
/* Spacing Scale (multiples of 4px) */
--space-0: 0;           /* 0px */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-32: 8rem;       /* 128px */
--space-40: 10rem;      /* 160px */
--space-48: 12rem;      /* 192px */
--space-56: 14rem;      /* 224px */
--space-64: 16rem;      /* 256px */
```

### 5.2 Spacing Usage Guidelines

#### Component Spacing

```css
/* Padding Inside Components */
--padding-xs: var(--space-2);      /* 8px */
--padding-sm: var(--space-3);      /* 12px */
--padding-md: var(--space-4);      /* 16px */
--padding-lg: var(--space-6);      /* 24px */
--padding-xl: var(--space-8);      /* 32px */

/* Gaps Between Elements */
--gap-xs: var(--space-2);          /* 8px */
--gap-sm: var(--space-3);          /* 12px */
--gap-md: var(--space-4);          /* 16px */
--gap-lg: var(--space-6);          /* 24px */
--gap-xl: var(--space-8);          /* 32px */

/* Margins Between Sections */
--margin-xs: var(--space-4);       /* 16px */
--margin-sm: var(--space-6);       /* 24px */
--margin-md: var(--space-8);       /* 32px */
--margin-lg: var(--space-12);      /* 48px */
--margin-xl: var(--space-16);      /* 64px */
```

#### Common Patterns

```tsx
// Button padding
className="px-4 py-2"              // Medium button (16px horizontal, 8px vertical)
className="px-3 py-1.5"            // Small button (12px horizontal, 6px vertical)
className="px-6 py-3"              // Large button (24px horizontal, 12px vertical)

// Card padding
className="p-6"                    // Standard card (24px all sides)
className="p-4"                    // Compact card (16px all sides)
className="p-8"                    // Spacious card (32px all sides)

// Section spacing
className="space-y-6"              // Stack elements with 24px gap
className="space-y-4"              // Stack elements with 16px gap
className="gap-4"                  // Grid/flex gap 16px

// Container padding
className="px-4 py-6"              // Mobile container
className="px-6 py-8 md:px-8"     // Responsive container
```

---

## 6. Layout & Grid

### 6.1 Container Widths

```css
/* Container Max Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* Standard Container */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;   /* 16px */
  padding-right: 1rem;  /* 16px */
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding-left: 1.5rem;   /* 24px */
    padding-right: 1.5rem;  /* 24px */
  }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding-left: 2rem;   /* 32px */
    padding-right: 2rem;  /* 32px */
  }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1536px; }
}
```

### 6.2 Grid System

```css
/* 12-Column Grid */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;  /* 24px */
}

/* Common Column Spans */
.col-span-1 { grid-column: span 1 / span 1; }
.col-span-2 { grid-column: span 2 / span 2; }
.col-span-3 { grid-column: span 3 / span 3; }
.col-span-4 { grid-column: span 4 / span 4; }
.col-span-6 { grid-column: span 6 / span 6; }
.col-span-8 { grid-column: span 8 / span 8; }
.col-span-12 { grid-column: span 12 / span 12; }

/* Responsive Grid Example */
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr;           /* Mobile: 1 column */
  gap: 1rem;
}

@media (min-width: 640px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);  /* Tablet: 2 columns */
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);  /* Desktop: 3 columns */
    gap: 2rem;
  }
}
```

### 6.3 Layout Patterns

#### App Shell Layout

```tsx
/**
 * Main app layout with sidebar
 * 
 * Structure:
 * ┌─────────────────────────────────────┐
 * │           Top Navigation            │
 * ├─────────┬───────────────────────────┤
 * │         │                           │
 * │ Sidebar │     Main Content          │
 * │  240px  │     (Flexible)            │
 * │         │                           │
 * └─────────┴───────────────────────────┘
 */

<div className="flex h-screen bg-gray-50">
  {/* Sidebar */}
  <aside className="w-60 bg-white border-r border-gray-200">
    {/* Sidebar content */}
  </aside>
  
  {/* Main Content */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Top Nav */}
    <header className="h-16 bg-white border-b border-gray-200">
      {/* Header content */}
    </header>
    
    {/* Page Content */}
    <main className="flex-1 overflow-y-auto p-6">
      {/* Page content */}
    </main>
  </div>
</div>
```

#### Page Layout

```tsx
/**
 * Standard page layout
 */

<div className="space-y-6">
  {/* Page Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
      <p className="mt-1 text-sm text-gray-500">Page description</p>
    </div>
    <button className="btn-primary">Primary Action</button>
  </div>
  
  {/* Page Content */}
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    {/* Main content */}
  </div>
</div>
```

---

## 7. Elevation & Shadows

### 7.1 Shadow Scale

```css
/* Shadow Definitions */
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 
             0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 
             0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
             0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 
             0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
--shadow-none: 0 0 #0000;
```

### 7.2 Shadow Usage

```css
/* Elevation Levels */

/* Level 0 - No elevation */
.elevation-0 {
  box-shadow: var(--shadow-none);
}

/* Level 1 - Subtle (hover states, cards) */
.elevation-1 {
  box-shadow: var(--shadow-sm);
}

/* Level 2 - Medium (dropdowns, popovers) */
.elevation-2 {
  box-shadow: var(--shadow-md);
}

/* Level 3 - High (modals, dialogs) */
.elevation-3 {
  box-shadow: var(--shadow-lg);
}

/* Level 4 - Very High (notifications, alerts) */
.elevation-4 {
  box-shadow: var(--shadow-xl);
}

/* Level 5 - Highest (full-screen overlays) */
.elevation-5 {
  box-shadow: var(--shadow-2xl);
}
```

### 7.3 Component Elevation Examples

```tsx
// Card
className="shadow-sm hover:shadow-md transition-shadow"

// Dropdown
className="shadow-lg border border-gray-200"

// Modal
className="shadow-2xl"

// Tooltip
className="shadow-md"

// Floating Action Button
className="shadow-xl hover:shadow-2xl"
```

---

## 8. Border Radius

### 8.1 Border Radius Scale

```css
/* Border Radius Values */
--radius-none: 0;
--radius-sm: 0.125rem;     /* 2px */
--radius-md: 0.375rem;     /* 6px - default */
--radius-lg: 0.5rem;       /* 8px */
--radius-xl: 0.75rem;      /* 12px */
--radius-2xl: 1rem;        /* 16px */
--radius-3xl: 1.5rem;      /* 24px */
--radius-full: 9999px;     /* Fully rounded (pills, circles) */
```

### 8.2 Component Border Radius

```tsx
// Buttons
className="rounded-md"           // 6px (default)

// Cards
className="rounded-lg"           // 8px

// Modals
className="rounded-xl"           // 12px

// Input Fields
className="rounded-md"           // 6px

// Badges/Pills
className="rounded-full"         // Fully rounded

// Avatar (circle)
className="rounded-full"         // Fully rounded

// Avatar (square with soft corners)
className="rounded-lg"           // 8px

// Large cards/panels
className="rounded-2xl"          // 16px
```

---

## 9. Animations & Transitions

### 9.1 Timing Functions

```css
/* Easing Curves */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Custom Easings */
--ease-smooth: cubic-bezier(0.4, 0.0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-swift: cubic-bezier(0.55, 0, 0.1, 1);
```

### 9.2 Duration Scale

```css
/* Animation Durations */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### 9.3 Standard Transitions

```css
/* Common Transitions */
--transition-all: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-colors: color, background-color, border-color 200ms ease;
--transition-opacity: opacity 200ms ease;
--transition-transform: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-shadow: box-shadow 200ms ease;
```

### 9.4 Animation Examples

#### Fade In/Out

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.fade-out {
  animation: fadeOut 200ms ease-in;
}
```

#### Slide In/Out

```css
@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-right {
  animation: slideInFromRight 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInFromBottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in-bottom {
  animation: slideInFromBottom 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Scale (Zoom)

```css
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.scale-in {
  animation: scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Pulse (Loading indicator)

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

#### Spin (Loading spinner)

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}
```

#### Skeleton Loading

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 0%,
    var(--gray-100) 20%,
    var(--gray-200) 40%,
    var(--gray-200) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s linear infinite;
}
```

### 9.5 Interaction States

```css
/* Button Hover */
.btn {
  transition: all 200ms ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Card Hover */
.card-interactive {
  transition: all 200ms ease;
}

.card-interactive:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Link Hover */
.link {
  transition: color 150ms ease;
  text-decoration-color: transparent;
  transition: text-decoration-color 200ms ease;
}

.link:hover {
  text-decoration-color: currentColor;
}
```

---

## 10. Iconography

### 10.1 Icon Library
We use **Lucide React** as our primary icon library.

```bash
npm install lucide-react
```

### 10.2 Icon Sizes

```tsx
// Extra Small (12px)
<Icon size={12} />

// Small (16px) - Default
<Icon size={16} />

// Medium (20px)
<Icon size={20} />

// Large (24px)
<Icon size={24} />

// Extra Large (32px)
<Icon size={32} />

// Responsive
<Icon className="w-4 h-4 md:w-5 md:h-5" />
```

### 10.3 Icon Usage Guidelines

```tsx
import { 
  User, 
  Settings, 
  Search, 
  Bell, 
  ChevronDown 
} from 'lucide-react';

// With text (button)
<button className="flex items-center gap-2">
  <Search size={16} />
  <span>Search</span>
</button>

// Icon only (icon button)
<button className="p-2 hover:bg-gray-100 rounded-md">
  <Settings size={20} />
</button>

// In input (left icon)
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
  <input className="pl-10 ..." />
</div>

// Status icon (colored)
<CheckCircle className="text-success-600" size={20} />
<XCircle className="text-error-600" size={20} />
<AlertCircle className="text-warning-600" size={20} />
<Info className="text-info-600" size={20} />
```

### 10.4 Common Icons

```tsx
// Navigation
Home, LayoutDashboard, Users, Building, Car, Calendar, 
Package, Bell, Settings, HelpCircle, LogOut

// Actions
Plus, Edit, Trash2, Download, Upload, Save, X, Check, 
Search, Filter, RefreshCw, MoreVertical, MoreHorizontal

// Status
CheckCircle, XCircle, AlertCircle, AlertTriangle, Info, 
Clock, Loader

// Arrows & Chevrons
ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
ArrowUp, ArrowDown, ArrowLeft, ArrowRight

// Files & Media
File, FileText, Image, Video, Paperclip, Download, Upload

// Communication
Mail, MessageSquare, Phone, Video, Send

// User & Account
User, Users, UserPlus, UserMinus, Lock, Key, Shield

// Interface
Menu, X, Search, Eye, EyeOff, Copy, ExternalLink, 
Maximize, Minimize
```

---

## 11. Component Library

### 11.1 Button Component

#### Button Variants

```tsx
/**
 * Primary Button (Default)
 * Use for main actions
 */
<button className="
  px-4 py-2 
  bg-primary-600 hover:bg-primary-700 active:bg-primary-800 
  text-white font-medium text-sm 
  rounded-md 
  shadow-sm hover:shadow-md
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
">
  Primary Button
</button>

/**
 * Secondary Button
 * Use for secondary actions
 */
<button className="
  px-4 py-2 
  bg-white hover:bg-gray-50 active:bg-gray-100
  text-gray-700 font-medium text-sm
  border border-gray-300
  rounded-md
  shadow-sm
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
">
  Secondary Button
</button>

/**
 * Destructive Button
 * Use for dangerous/destructive actions (delete, remove)
 */
<button className="
  px-4 py-2
  bg-error-600 hover:bg-error-700 active:bg-error-800
  text-white font-medium text-sm
  rounded-md
  shadow-sm hover:shadow-md
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2
">
  Delete
</button>

/**
 * Ghost Button
 * Use for tertiary actions
 */
<button className="
  px-4 py-2
  bg-transparent hover:bg-gray-100 active:bg-gray-200
  text-gray-700 font-medium text-sm
  rounded-md
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
">
  Ghost Button
</button>

/**
 * Link Button
 * Use for navigation or subtle actions
 */
<button className="
  px-4 py-2
  text-primary-600 hover:text-primary-700 active:text-primary-800
  font-medium text-sm
  hover:underline
  transition-colors duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
">
  Link Button
</button>
```

#### Button Sizes

```tsx
// Extra Small
<button className="px-2 py-1 text-xs">XS Button</button>

// Small
<button className="px-3 py-1.5 text-sm">Small Button</button>

// Medium (Default)
<button className="px-4 py-2 text-sm">Medium Button</button>

// Large
<button className="px-6 py-3 text-base">Large Button</button>

// Extra Large
<button className="px-8 py-4 text-lg">XL Button</button>
```

#### Button with Icon

```tsx
import { Plus, Download, Trash2 } from 'lucide-react';

// Icon Left
<button className="flex items-center gap-2 px-4 py-2 ...">
  <Plus size={16} />
  <span>Add New</span>
</button>

// Icon Right
<button className="flex items-center gap-2 px-4 py-2 ...">
  <span>Download</span>
  <Download size={16} />
</button>

// Icon Only (Square)
<button className="p-2 rounded-md ...">
  <Trash2 size={16} />
</button>

// Icon Only (Circular)
<button className="p-2 rounded-full ...">
  <Plus size={16} />
</button>
```

#### Loading Button

```tsx
import { Loader } from 'lucide-react';

<button disabled className="flex items-center gap-2 px-4 py-2 ... opacity-75 cursor-not-allowed">
  <Loader size={16} className="animate-spin" />
  <span>Loading...</span>
</button>
```

### 11.2 Input Component

#### Text Input

```tsx
/**
 * Standard Text Input
 */
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Email Address
  </label>
  <input
    type="email"
    placeholder="Enter your email"
    className="
      w-full px-3 py-2
      text-sm text-gray-900
      placeholder:text-gray-400
      bg-white
      border border-gray-300
      rounded-md
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
      transition-colors duration-200
    "
  />
  <p className="text-xs text-gray-500">
    We'll never share your email.
  </p>
</div>

/**
 * Input with Error
 */
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Password
  </label>
  <input
    type="password"
    className="
      w-full px-3 py-2
      text-sm text-gray-900
      bg-white
      border border-error-500
      rounded-md
      focus:outline-none focus:ring-2 focus:ring-error-500
    "
  />
  <p className="text-xs text-error-600 flex items-center gap-1">
    <AlertCircle size={12} />
    Password must be at least 8 characters
  </p>
</div>

/**
 * Input with Icon (Left)
 */
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ..."
  />
</div>

/**
 * Input with Icon (Right)
 */
<div className="relative">
  <input
    type="text"
    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md ..."
  />
  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
    <Eye size={16} />
  </button>
</div>
```

#### Input Sizes

```tsx
// Small
<input className="px-2 py-1 text-xs ..." />

// Medium (Default)
<input className="px-3 py-2 text-sm ..." />

// Large
<input className="px-4 py-3 text-base ..." />
```

### 11.3 Select Component

```tsx
/**
 * Standard Select
 */
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Country
  </label>
  <select className="
    w-full px-3 py-2
    text-sm text-gray-900
    bg-white
    border border-gray-300
    rounded-md
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    transition-colors duration-200
  ">
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
  </select>
</div>
```

### 11.4 Checkbox Component

```tsx
/**
 * Standard Checkbox
 */
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    className="
      w-4 h-4
      text-primary-600
      bg-white
      border-gray-300
      rounded
      focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
    "
  />
  <span className="text-sm text-gray-700">
    I agree to the terms and conditions
  </span>
</label>

/**
 * Checkbox with Description
 */
<label className="flex items-start gap-3 cursor-pointer">
  <input type="checkbox" className="mt-0.5 w-4 h-4 ..." />
  <div>
    <div className="text-sm font-medium text-gray-900">
      Email Notifications
    </div>
    <div className="text-xs text-gray-500">
      Receive email updates about your account activity
    </div>
  </div>
</label>
```

### 11.5 Radio Component

```tsx
/**
 * Radio Group
 */
<div className="space-y-3">
  <label className="block text-sm font-medium text-gray-700">
    Payment Method
  </label>
  
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="payment"
      value="card"
      className="
        w-4 h-4
        text-primary-600
        bg-white
        border-gray-300
        focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
      "
    />
    <span className="text-sm text-gray-700">Credit Card</span>
  </label>
  
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="radio" name="payment" value="paypal" className="..." />
    <span className="text-sm text-gray-700">PayPal</span>
  </label>
  
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="radio" name="payment" value="bank" className="..." />
    <span className="text-sm text-gray-700">Bank Transfer</span>
  </label>
</div>
```

### 11.6 Switch/Toggle Component

```tsx
/**
 * Toggle Switch
 */
<label className="flex items-center gap-3 cursor-pointer">
  <div className="relative">
    <input type="checkbox" className="sr-only peer" />
    <div className="
      w-11 h-6
      bg-gray-200
      peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2
      rounded-full
      peer
      peer-checked:after:translate-x-full
      peer-checked:bg-primary-600
      after:content-['']
      after:absolute
      after:top-[2px]
      after:left-[2px]
      after:bg-white
      after:border-gray-300
      after:border
      after:rounded-full
      after:h-5
      after:w-5
      after:transition-all
    "></div>
  </div>
  <span className="text-sm text-gray-700">Enable notifications</span>
</label>
```

### 11.7 Card Component

```tsx
/**
 * Basic Card
 */
<div className="
  bg-white
  border border-gray-200
  rounded-lg
  p-6
  shadow-sm
">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Card Title
  </h3>
  <p className="text-sm text-gray-600">
    Card content goes here...
  </p>
</div>

/**
 * Interactive Card (Hoverable)
 */
<div className="
  bg-white
  border border-gray-200
  rounded-lg
  p-6
  shadow-sm hover:shadow-md
  transition-all duration-200
  cursor-pointer
  hover:-translate-y-0.5
">
  {/* Card content */}
</div>

/**
 * Card with Header and Footer
 */
<div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
  {/* Header */}
  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <h3 className="text-lg font-semibold text-gray-900">Card Header</h3>
  </div>
  
  {/* Body */}
  <div className="px-6 py-4">
    <p className="text-sm text-gray-600">
      Card body content...
    </p>
  </div>
  
  {/* Footer */}
  <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
    <button className="btn-secondary">Cancel</button>
    <button className="btn-primary">Save</button>
  </div>
</div>
```

### 11.8 Badge Component

```tsx
/**
 * Status Badges
 */

// Success
<span className="
  inline-flex items-center gap-1
  px-2.5 py-0.5
  bg-success-100 text-success-800
  border border-success-200
  text-xs font-medium
  rounded-full
">
  <div className="w-1.5 h-1.5 bg-success-600 rounded-full"></div>
  Active
</span>

// Warning
<span className="
  inline-flex items-center gap-1
  px-2.5 py-0.5
  bg-warning-100 text-warning-800
  border border-warning-200
  text-xs font-medium
  rounded-full
">
  Pending
</span>

// Error
<span className="
  inline-flex items-center gap-1
  px-2.5 py-0.5
  bg-error-100 text-error-800
  border border-error-200
  text-xs font-medium
  rounded-full
">
  Inactive
</span>

// Info
<span className="
  inline-flex items-center gap-1
  px-2.5 py-0.5
  bg-info-100 text-info-800
  border border-info-200
  text-xs font-medium
  rounded-full
">
  Draft
</span>

// Neutral/Gray
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  bg-gray-100 text-gray-800
  border border-gray-200
  text-xs font-medium
  rounded-full
">
  Default
</span>
```

#### Badge Sizes

```tsx
// Small
<span className="px-2 py-0.5 text-xs ...">Small</span>

// Medium (Default)
<span className="px-2.5 py-0.5 text-xs ...">Medium</span>

// Large
<span className="px-3 py-1 text-sm ...">Large</span>
```

#### Badge with Icon

```tsx
import { Check, X, AlertCircle } from 'lucide-react';

<span className="inline-flex items-center gap-1 px-2.5 py-0.5 ...">
  <Check size={12} />
  Verified
</span>
```

### 11.9 Alert/Toast Component

```tsx
/**
 * Success Alert
 */
<div className="
  flex items-start gap-3
  p-4
  bg-success-50
  border border-success-200
  rounded-lg
">
  <CheckCircle className="text-success-600 flex-shrink-0" size={20} />
  <div className="flex-1">
    <h4 className="text-sm font-medium text-success-900">
      Success!
    </h4>
    <p className="mt-1 text-sm text-success-700">
      Your changes have been saved successfully.
    </p>
  </div>
  <button className="text-success-600 hover:text-success-700 flex-shrink-0">
    <X size={16} />
  </button>
</div>

/**
 * Error Alert
 */
<div className="
  flex items-start gap-3
  p-4
  bg-error-50
  border border-error-200
  rounded-lg
">
  <XCircle className="text-error-600 flex-shrink-0" size={20} />
  <div className="flex-1">
    <h4 className="text-sm font-medium text-error-900">
      Error
    </h4>
    <p className="mt-1 text-sm text-error-700">
      There was a problem processing your request.
    </p>
  </div>
</div>

/**
 * Warning Alert
 */
<div className="
  flex items-start gap-3
  p-4
  bg-warning-50
  border border-warning-200
  rounded-lg
">
  <AlertTriangle className="text-warning-600 flex-shrink-0" size={20} />
  <div className="flex-1">
    <h4 className="text-sm font-medium text-warning-900">
      Warning
    </h4>
    <p className="mt-1 text-sm text-warning-700">
      Your session will expire in 5 minutes.
    </p>
  </div>
</div>

/**
 * Info Alert
 */
<div className="
  flex items-start gap-3
  p-4
  bg-info-50
  border border-info-200
  rounded-lg
">
  <Info className="text-info-600 flex-shrink-0" size={20} />
  <div className="flex-1">
    <h4 className="text-sm font-medium text-info-900">
      Information
    </h4>
    <p className="mt-1 text-sm text-info-700">
      A new version of the app is available.
    </p>
  </div>
</div>
```

### 11.10 Modal/Dialog Component

```tsx
/**
 * Modal Overlay + Dialog
 */
<div className="
  fixed inset-0 z-50
  flex items-center justify-center
  bg-black bg-opacity-50
  p-4
  animate-fadeIn
">
  <div className="
    w-full max-w-md
    bg-white
    rounded-xl
    shadow-2xl
    animate-scaleIn
  ">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">
        Modal Title
      </h2>
      <button className="text-gray-400 hover:text-gray-600">
        <X size={20} />
      </button>
    </div>
    
    {/* Body */}
    <div className="px-6 py-4">
      <p className="text-sm text-gray-600">
        Modal content goes here...
      </p>
    </div>
    
    {/* Footer */}
    <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
      <button className="btn-secondary">Cancel</button>
      <button className="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### 11.11 Dropdown Menu Component

```tsx
/**
 * Dropdown Menu
 */
<div className="relative inline-block">
  {/* Trigger Button */}
  <button className="flex items-center gap-2 px-4 py-2 btn-secondary">
    <span>Options</span>
    <ChevronDown size={16} />
  </button>
  
  {/* Dropdown Panel */}
  <div className="
    absolute right-0 mt-2
    w-56
    bg-white
    border border-gray-200
    rounded-lg
    shadow-lg
    py-1
    z-10
  ">
    <a href="#" className="
      flex items-center gap-3
      px-4 py-2
      text-sm text-gray-700
      hover:bg-gray-50
      transition-colors
    ">
      <Edit size={16} />
      Edit
    </a>
    <a href="#" className="
      flex items-center gap-3
      px-4 py-2
      text-sm text-gray-700
      hover:bg-gray-50
    ">
      <Copy size={16} />
      Duplicate
    </a>
    <div className="border-t border-gray-200 my-1"></div>
    <a href="#" className="
      flex items-center gap-3
      px-4 py-2
      text-sm text-error-700
      hover:bg-error-50
    ">
      <Trash2 size={16} />
      Delete
    </a>
  </div>
</div>
```

### 11.12 Tooltip Component

```tsx
/**
 * Tooltip
 */
<div className="relative group inline-block">
  {/* Trigger Element */}
  <button className="p-2 hover:bg-gray-100 rounded-md">
    <Info size={16} />
  </button>
  
  {/* Tooltip */}
  <div className="
    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
    px-3 py-2
    bg-gray-900 text-white
    text-xs font-medium
    rounded-md
    shadow-md
    whitespace-nowrap
    opacity-0 group-hover:opacity-100
    pointer-events-none
    transition-opacity duration-200
  ">
    This is a tooltip
    {/* Arrow */}
    <div className="
      absolute top-full left-1/2 -translate-x-1/2
      w-0 h-0
      border-4 border-transparent
      border-t-gray-900
    "></div>
  </div>
</div>
```

### 11.13 Table Component

```tsx
/**
 * Data Table
 */
<div className="overflow-x-auto">
  <table className="w-full border-collapse">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Email
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">John Doe</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-600">john@example.com</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="badge-success">Active</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-primary-600 hover:text-primary-700 mr-3">Edit</button>
          <button className="text-error-600 hover:text-error-700">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 11.14 Pagination Component

```tsx
/**
 * Pagination
 */
<div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
  <div className="flex-1 flex justify-between sm:hidden">
    {/* Mobile */}
    <button className="btn-secondary">Previous</button>
    <button className="btn-secondary">Next</button>
  </div>
  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
      <p className="text-sm text-gray-700">
        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
        <span className="font-medium">97</span> results
      </p>
    </div>
    <nav className="flex items-center gap-1">
      <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>
        <ChevronLeft size={16} />
      </button>
      <button className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm">1</button>
      <button className="px-3 py-1 hover:bg-gray-100 rounded-md text-sm">2</button>
      <button className="px-3 py-1 hover:bg-gray-100 rounded-md text-sm">3</button>
      <span className="px-2 text-gray-500">...</span>
      <button className="px-3 py-1 hover:bg-gray-100 rounded-md text-sm">10</button>
      <button className="p-2 rounded-md hover:bg-gray-100">
        <ChevronRight size={16} />
      </button>
    </nav>
  </div>
</div>
```

### 11.15 Tabs Component

```tsx
/**
 * Tabs
 */
<div className="w-full">
  {/* Tab List */}
  <div className="border-b border-gray-200">
    <nav className="flex gap-6">
      <button className="
        pb-3 px-1
        border-b-2 border-primary-600
        text-sm font-medium text-primary-600
      ">
        Overview
      </button>
      <button className="
        pb-3 px-1
        border-b-2 border-transparent
        text-sm font-medium text-gray-500
        hover:text-gray-700 hover:border-gray-300
        transition-colors
      ">
        Details
      </button>
      <button className="
        pb-3 px-1
        border-b-2 border-transparent
        text-sm font-medium text-gray-500
        hover:text-gray-700 hover:border-gray-300
      ">
        Settings
      </button>
    </nav>
  </div>
  
  {/* Tab Panel */}
  <div className="py-6">
    <p className="text-sm text-gray-600">
      Tab content goes here...
    </p>
  </div>
</div>
```

### 11.16 Avatar Component

```tsx
/**
 * Avatar (with image)
 */
<img
  src="/avatar.jpg"
  alt="User name"
  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
/>

/**
 * Avatar (initials fallback)
 */
<div className="
  w-10 h-10
  flex items-center justify-center
  bg-primary-600 text-white
  text-sm font-medium
  rounded-full
">
  JD
</div>

/**
 * Avatar Sizes
 */
// XS (24px)
<div className="w-6 h-6 ... text-xs">JD</div>

// SM (32px)
<div className="w-8 h-8 ... text-xs">JD</div>

// MD (40px - default)
<div className="w-10 h-10 ... text-sm">JD</div>

// LG (48px)
<div className="w-12 h-12 ... text-base">JD</div>

// XL (64px)
<div className="w-16 h-16 ... text-lg">JD</div>

/**
 * Avatar with Status Indicator
 */
<div className="relative inline-block">
  <img src="/avatar.jpg" className="w-10 h-10 rounded-full" />
  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full"></span>
</div>
```

### 11.17 Breadcrumbs Component

```tsx
/**
 * Breadcrumbs
 */
<nav className="flex items-center gap-2 text-sm">
  <a href="/" className="text-gray-500 hover:text-gray-700">
    Home
  </a>
  <ChevronRight size={14} className="text-gray-400" />
  <a href="/users" className="text-gray-500 hover:text-gray-700">
    Users
  </a>
  <ChevronRight size={14} className="text-gray-400" />
  <span className="text-gray-900 font-medium">
    John Doe
  </span>
</nav>
```

### 11.18 Progress Bar Component

```tsx
/**
 * Progress Bar
 */
<div className="w-full">
  <div className="flex justify-between mb-1">
    <span className="text-sm font-medium text-gray-700">Progress</span>
    <span className="text-sm font-medium text-gray-700">75%</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
  </div>
</div>

/**
 * Progress Bar Variants
 */
// Success
<div className="bg-success-600 h-2 rounded-full" style={{ width: '100%' }}></div>

// Warning
<div className="bg-warning-600 h-2 rounded-full" style={{ width: '60%' }}></div>

// Error
<div className="bg-error-600 h-2 rounded-full" style={{ width: '30%' }}></div>

/**
 * Progress Bar Sizes
 */
// Small
<div className="h-1 ..."></div>

// Medium (default)
<div className="h-2 ..."></div>

// Large
<div className="h-3 ..."></div>
```

### 11.19 Skeleton Loader Component

```tsx
/**
 * Skeleton Text
 */
<div className="space-y-3 animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-full"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>

/**
 * Skeleton Card
 */
<div className="border border-gray-200 rounded-lg p-6 animate-pulse">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
  <div className="space-y-2">
    <div className="h-3 bg-gray-200 rounded"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
  </div>
</div>
```

### 11.20 Empty State Component

```tsx
/**
 * Empty State
 */
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
    <Inbox size={32} className="text-gray-400" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    No items found
  </h3>
  <p className="text-sm text-gray-500 mb-6 max-w-sm">
    Get started by creating a new item. Click the button below to begin.
  </p>
  <button className="btn-primary">
    <Plus size={16} className="mr-2" />
    Create New Item
  </button>
</div>
```

---

## 12. Responsive Breakpoints

### 12.1 Breakpoint Definitions

```css
/* Breakpoints (matching Tailwind defaults) */
--breakpoint-sm: 640px;    /* Mobile landscape, small tablets */
--breakpoint-md: 768px;    /* Tablets */
--breakpoint-lg: 1024px;   /* Small laptops */
--breakpoint-xl: 1280px;   /* Desktops */
--breakpoint-2xl: 1536px;  /* Large desktops */

/* Media Queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 12.2 Responsive Utilities (Tailwind)

```tsx
// Hidden on mobile, visible on desktop
<div className="hidden md:block">Desktop only</div>

// Visible on mobile, hidden on desktop
<div className="block md:hidden">Mobile only</div>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">Content</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>

// Responsive text size
<h1 className="text-2xl md:text-3xl lg:text-4xl">Heading</h1>

// Responsive flexbox
<div className="flex flex-col md:flex-row gap-4">
  {/* Items */}
</div>
```

### 12.3 Mobile-First Approach

Always start with mobile styles, then enhance for larger screens:

```tsx
// ❌ Wrong (desktop-first)
<div className="w-64 md:w-full">

// ✅ Correct (mobile-first)
<div className="w-full md:w-64">
```

---

## 13. Accessibility

### 13.1 ARIA Labels

```tsx
// Button with icon only
<button aria-label="Close dialog">
  <X size={16} />
</button>

// Link that opens in new tab
<a href="..." target="_blank" rel="noopener noreferrer" aria-label="Documentation (opens in new tab)">
  Docs
</a>

// Form inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-required="true" aria-invalid={hasError} />
{hasError && <div id="email-error" role="alert">Invalid email</div>}
```

### 13.2 Keyboard Navigation

```tsx
// Ensure all interactive elements are keyboard accessible
<button onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
}}>
  Action
</button>

// Focus management
<div tabIndex={0} onFocus={handleFocus}>
  Focusable div
</div>
```

### 13.3 Screen Reader Support

```tsx
// Skip to main content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Hidden text for screen readers
<span className="sr-only">User logged in as</span>
<span>John Doe</span>

// Announce live changes
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### 13.4 Focus Indicators

All interactive elements must have visible focus indicators:

```css
/* Default focus ring */
.focus-visible:focus {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

/* Or use Tailwind */
className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
```

---

## 14. Dark Mode

### 14.1 Dark Mode Colors

```css
/* Dark Mode Palette */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;         /* gray-900 */
    --bg-secondary: #1F2937;       /* gray-800 */
    --bg-tertiary: #374151;        /* gray-700 */
    
    --text-primary: #F9FAFB;       /* gray-50 */
    --text-secondary: #D1D5DB;     /* gray-300 */
    --text-tertiary: #9CA3AF;      /* gray-400 */
    
    --border-primary: #374151;     /* gray-700 */
    --border-secondary: #4B5563;   /* gray-600 */
  }
}
```

### 14.2 Dark Mode Implementation (Tailwind)

```tsx
// Enable dark mode in tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}

// Usage
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>

<button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
  Button
</button>
```

### 14.3 Dark Mode Toggle

```tsx
/**
 * Dark Mode Toggle Component
 */
import { Sun, Moon } from 'lucide-react';

<button 
  onClick={toggleDarkMode}
  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
  aria-label="Toggle dark mode"
>
  {isDark ? <Sun size={20} /> : <Moon size={20} />}
</button>
```

---

## 15. White Labeling & Tenant Customization

### 15.1 Overview

The NEOX Infinity App supports comprehensive white labeling capabilities, allowing each tenant to fully customize the visual appearance of their instance. This includes colors, gradients, transparency, logos, fonts, and domain customization.

### 15.2 Color Customization

#### 15.2.1 Primary Color Picker

**Interface Specifications:**

```tsx
/**
 * Advanced Color Picker Component
 * Supports solid colors, transparency, and gradients
 */

interface ColorConfig {
  type: 'solid' | 'gradient';
  solid?: {
    color: string;        // Hex format: #RRGGBB
    alpha: number;        // 0-100 (percentage)
  };
  gradient?: {
    type: 'linear' | 'radial' | 'conic';
    angle?: number;       // 0-360 (for linear)
    stops: GradientStop[];
  };
}

interface GradientStop {
  color: string;          // Hex format: #RRGGBB
  alpha: number;          // 0-100 (percentage)
  position: number;       // 0-100 (percentage along gradient)
}
```

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  Primary Brand Color                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ○ Solid Color          ○ Gradient                         │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │  Color Picker                                      │    │
│  │  [████████████████████████████████████████]        │    │
│  │  [████████████████████████████████████████]        │    │
│  │  [████████████████████████████████████████]        │    │
│  │  [████████████████████████████████████████]        │    │
│  │                                                    │    │
│  │  Hue:  [━━━━━━━━━━━━━━━━━●━━━━━━━━] 210°        │    │
│  │  Sat:  [━━━━━━━━━━━━━━━━━━━━●━━━━] 85%          │    │
│  │  Lgt:  [━━━━━━━━━━━━━●━━━━━━━━━━━] 50%          │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Hex Color: [#3B82F6]  RGB: (59, 130, 246)                │
│                                                             │
│  Transparency (Alpha):  [━━━━━━━━━━━━━━━━━━━━●] 100%     │
│                                                             │
│  Preview:                                                   │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Button Text     │  │ Active State    │                │
│  └─────────────────┘  └─────────────────┘                │
│                                                             │
│  [Reset to Default]              [Apply]                   │
└─────────────────────────────────────────────────────────────┘
```

**Solid Color Mode:**

```tsx
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SolidColorPicker = ({ value, onChange }) => {
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(85);
  const [lightness, setLightness] = useState(50);
  const [alpha, setAlpha] = useState(100);
  const [hexValue, setHexValue] = useState('#3B82F6');

  // Convert HSL to Hex
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // Update hex when HSL changes
  useEffect(() => {
    const hex = hslToHex(hue, saturation, lightness);
    setHexValue(hex);
    onChange({ color: hex, alpha });
  }, [hue, saturation, lightness, alpha]);

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      {/* Color Spectrum Grid */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden cursor-crosshair"
        style={{
          background: `linear-gradient(to bottom, 
            hsl(${hue}, 100%, 50%) 0%,
            hsl(${hue}, 100%, 75%) 25%,
            hsl(${hue}, 50%, 50%) 50%,
            hsl(${hue}, 50%, 25%) 75%,
            hsl(${hue}, 0%, 0%) 100%
          )`
        }}
        onClick={handleColorClick}
      >
        <div className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg"
          style={{ 
            left: `${saturation}%`, 
            top: `${100 - lightness}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Hue Slider */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Hue</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[hue]}
            onValueChange={([v]) => setHue(v)}
            max={360}
            step={1}
            className="flex-1"
            style={{
              background: `linear-gradient(to right, 
                hsl(0, 100%, 50%), 
                hsl(60, 100%, 50%), 
                hsl(120, 100%, 50%), 
                hsl(180, 100%, 50%), 
                hsl(240, 100%, 50%), 
                hsl(300, 100%, 50%), 
                hsl(360, 100%, 50%)
              )`
            }}
          />
          <span className="text-sm text-gray-600 w-12">{hue}°</span>
        </div>
      </div>

      {/* Saturation Slider */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Saturation</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[saturation]}
            onValueChange={([v]) => setSaturation(v)}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12">{saturation}%</span>
        </div>
      </div>

      {/* Lightness Slider */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Lightness</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[lightness]}
            onValueChange={([v]) => setLightness(v)}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12">{lightness}%</span>
        </div>
      </div>

      {/* Alpha/Transparency Slider */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Transparency (Alpha)</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[alpha]}
            onValueChange={([v]) => setAlpha(v)}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12">{alpha}%</span>
        </div>
        {/* Transparency visual indicator */}
        <div className="h-8 rounded border" style={{
          background: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                       linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                       linear-gradient(45deg, transparent 75%, #ccc 75%), 
                       linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
          backgroundSize: '10px 10px',
          backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
        }}>
          <div className="h-full rounded" style={{
            background: hexValue,
            opacity: alpha / 100
          }} />
        </div>
      </div>

      {/* Hex Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Hex Color</Label>
        <div className="flex items-center gap-3">
          <Input
            value={hexValue}
            onChange={(e) => {
              setHexValue(e.target.value);
              // Convert hex to HSL and update
            }}
            className="flex-1 font-mono"
            placeholder="#3B82F6"
          />
          <div className="w-12 h-10 rounded border-2" style={{
            background: hexValue,
            opacity: alpha / 100
          }} />
        </div>
      </div>

      {/* RGB Display */}
      <div className="text-sm text-gray-600">
        RGB: ({hexToRgb(hexValue).r}, {hexToRgb(hexValue).g}, {hexToRgb(hexValue).b})
      </div>
    </div>
  );
};
```

#### 15.2.2 Gradient Color Picker

**Gradient Types:**

1. **Linear Gradient** - Color transition along a straight line
2. **Radial Gradient** - Color transition radiating from a center point
3. **Conic Gradient** - Color transition rotating around a center point

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  Primary Brand Color - Gradient                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Gradient Type:                                             │
│  ○ Linear     ○ Radial     ○ Conic                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Preview                                             │  │
│  │  [████████████████████████████████████████████████]  │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Angle (Linear): [━━━━━━━━━━━●━━━━━━━━━━━] 135°          │
│                                                             │
│  Gradient Stops:                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ● [#3B82F6] ━━━━━━━━━━━━━━━━━━━ 0%    [×]           │  │
│  │   Alpha: [━━━━━━━━━━━━━━━━━━━●━] 100%               │  │
│  │                                                      │  │
│  │ ● [#8B5CF6] ━━━━━━━━━━●━━━━━━━━ 50%   [×]           │  │
│  │   Alpha: [━━━━━━━━━━━━━━━━━━━●━] 100%               │  │
│  │                                                      │  │
│  │ ● [#EC4899] ━━━━━━━━━━━━━━━━━━━ 100%  [×]           │  │
│  │   Alpha: [━━━━━━━━━━━━━━━━━━━●━] 100%               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  [+ Add Color Stop]                                         │
│                                                             │
│  CSS Output:                                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ linear-gradient(135deg,                              │  │
│  │   #3B82F6 0%,                                        │  │
│  │   #8B5CF6 50%,                                       │  │
│  │   #EC4899 100%)                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  [Reset to Default]              [Apply]                   │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**

```tsx
import { Plus, X } from 'lucide-react';

interface GradientStop {
  id: string;
  color: string;
  alpha: number;
  position: number;
}

const GradientPicker = ({ value, onChange }) => {
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<GradientStop[]>([
    { id: '1', color: '#3B82F6', alpha: 100, position: 0 },
    { id: '2', color: '#8B5CF6', alpha: 100, position: 50 },
    { id: '3', color: '#EC4899', alpha: 100, position: 100 },
  ]);

  // Generate CSS gradient string
  const generateGradientCSS = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops.map(stop => {
      const rgba = hexToRgba(stop.color, stop.alpha / 100);
      return `${rgba} ${stop.position}%`;
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

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border">
      {/* Gradient Type Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Gradient Type</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={gradientType === 'linear'}
              onChange={() => setGradientType('linear')}
              className="w-4 h-4"
            />
            <span>Linear</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={gradientType === 'radial'}
              onChange={() => setGradientType('radial')}
              className="w-4 h-4"
            />
            <span>Radial</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={gradientType === 'conic'}
              onChange={() => setGradientType('conic')}
              className="w-4 h-4"
            />
            <span>Conic</span>
          </label>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Preview</Label>
        <div 
          className="h-32 rounded-lg border-2"
          style={{ background: generateGradientCSS() }}
        />
      </div>

      {/* Angle Slider (for Linear and Conic) */}
      {(gradientType === 'linear' || gradientType === 'conic') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {gradientType === 'linear' ? 'Angle' : 'Rotation'}
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[angle]}
              onValueChange={([v]) => setAngle(v)}
              max={360}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">{angle}°</span>
          </div>
        </div>
      )}

      {/* Gradient Stops */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Gradient Stops</Label>
        {stops.map((stop, index) => (
          <div key={stop.id} className="p-3 border rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border-2"
                style={{ 
                  background: stop.color,
                  opacity: stop.alpha / 100
                }}
              />
              <Input
                value={stop.color}
                onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                className="flex-1 font-mono"
                placeholder="#000000"
              />
              {stops.length > 2 && (
                <button
                  onClick={() => removeStop(stop.id)}
                  className="p-1 hover:bg-red-50 rounded"
                >
                  <X size={16} className="text-red-500" />
                </button>
              )}
            </div>

            {/* Position Slider */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">Position:</span>
                <Slider
                  value={[stop.position]}
                  onValueChange={([v]) => updateStop(stop.id, { position: v })}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">{stop.position}%</span>
              </div>
            </div>

            {/* Alpha Slider */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">Alpha:</span>
                <Slider
                  value={[stop.alpha]}
                  onValueChange={([v]) => updateStop(stop.id, { alpha: v })}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">{stop.alpha}%</span>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addStop}
          className="w-full py-2 border-2 border-dashed rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} />
          Add Color Stop
        </button>
      </div>

      {/* CSS Output */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">CSS Output</Label>
        <pre className="p-3 bg-gray-50 rounded border text-xs font-mono overflow-x-auto">
          {generateGradientCSS()}
        </pre>
      </div>
    </div>
  );
};
```

#### 15.2.3 Secondary Color Picker

**Purpose:** Secondary colors are used for:
- Secondary buttons and CTAs
- Accent elements
- Highlights and badges
- Alternative UI states

**Interface:** Same as Primary Color Picker but saved to `secondaryColor` field.

```tsx
const SecondaryColorPicker = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Secondary Brand Color</Label>
        <span className="text-sm text-gray-500">(Optional)</span>
      </div>
      <ColorPicker 
        value={secondaryColor}
        onChange={setSecondaryColor}
        defaultColor="#8B5CF6"
      />
    </div>
  );
};
```

### 15.3 Font Family Selection

#### 15.3.1 Font Categories

The font selector organizes fonts into categories for easy browsing:

1. **System Fonts** - Pre-installed, no loading required
2. **Google Fonts** - Popular web fonts from Google Fonts API
3. **Custom Fonts** - Upload your own font files

#### 15.3.2 Font Selector UI

**Interface Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  Typography & Font Selection                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Font Category:                                             │
│  [ System Fonts ▼ ]  [ Google Fonts ]  [ Custom Upload ]   │
│                                                             │
│  Search fonts: [_________________] 🔍                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  ○ Inter                                             │  │
│  │    The quick brown fox jumps over the lazy dog      │  │
│  │    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789            │  │
│  │                                                      │  │
│  │  ● Roboto (Selected)                                 │  │
│  │    The quick brown fox jumps over the lazy dog      │  │
│  │    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789            │  │
│  │                                                      │  │
│  │  ○ Open Sans                                         │  │
│  │    The quick brown fox jumps over the lazy dog      │  │
│  │    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789            │  │
│  │                                                      │  │
│  │  ○ Lato                                              │  │
│  │    The quick brown fox jumps over the lazy dog      │  │
│  │    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789            │  │
│  │                                                      │  │
│  │  ○ Montserrat                                        │  │
│  │    The quick brown fox jumps over the lazy dog      │  │
│  │    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789            │  │
│  │                                                      │  │
│  │  ○ Poppins                                           │  │
│  │    The quick brown fox jumps over the lazy dog      │  │
│  │    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789            │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Font Weights Available: [Light, Regular, Medium, Bold]    │
│                                                             │
│  Preview Size: [12px] [14px] [●16px] [20px] [24px]        │
│                                                             │
│  Live Preview:                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  Heading 1: Your Application Title                  │  │
│  │  Heading 2: Section Heading                         │  │
│  │  Body Text: This is how regular paragraph text      │  │
│  │  will appear in your application with the           │  │
│  │  selected font family.                               │  │
│  │                                                      │  │
│  │  [Button Example]  Link Example                     │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Font Loading: ✓ Loaded successfully                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 15.3.3 Font Data Structure

```typescript
interface FontFamily {
  id: string;
  name: string;
  category: 'system' | 'google' | 'custom';
  fallback: string;  // CSS fallback fonts
  weights: number[]; // Available weights [300, 400, 500, 700]
  styles: ('normal' | 'italic')[];
  googleFontUrl?: string;  // For Google Fonts
  customFontFiles?: {
    weight: number;
    style: string;
    url: string;
    format: 'woff2' | 'woff' | 'ttf' | 'otf';
  }[];
  previewText?: string;
}
```

#### 15.3.4 System Fonts List

```typescript
const SYSTEM_FONTS: FontFamily[] = [
  {
    id: 'system-ui',
    name: 'System UI',
    category: 'system',
    fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: [300, 400, 500, 600, 700],
    styles: ['normal', 'italic'],
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'system',
    fallback: 'Inter, system-ui, sans-serif',
    weights: [300, 400, 500, 600, 700, 800, 900],
    styles: ['normal'],
  },
  {
    id: 'sf-pro',
    name: 'SF Pro (Apple)',
    category: 'system',
    fallback: '-apple-system, BlinkMacSystemFont, "SF Pro", sans-serif',
    weights: [300, 400, 500, 600, 700],
    styles: ['normal', 'italic'],
  },
  {
    id: 'segoe-ui',
    name: 'Segoe UI (Windows)',
    category: 'system',
    fallback: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    weights: [300, 400, 600, 700],
    styles: ['normal', 'italic'],
  },
  {
    id: 'arial',
    name: 'Arial',
    category: 'system',
    fallback: 'Arial, Helvetica, sans-serif',
    weights: [400, 700],
    styles: ['normal', 'italic'],
  },
  {
    id: 'georgia',
    name: 'Georgia',
    category: 'system',
    fallback: 'Georgia, "Times New Roman", serif',
    weights: [400, 700],
    styles: ['normal', 'italic'],
  },
];
```

#### 15.3.5 Popular Google Fonts

```typescript
const GOOGLE_FONTS: FontFamily[] = [
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'google',
    fallback: 'Roboto, sans-serif',
    weights: [100, 300, 400, 500, 700, 900],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    category: 'google',
    fallback: '"Open Sans", sans-serif',
    weights: [300, 400, 500, 600, 700, 800],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap',
  },
  {
    id: 'lato',
    name: 'Lato',
    category: 'google',
    fallback: 'Lato, sans-serif',
    weights: [100, 300, 400, 700, 900],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'google',
    fallback: 'Montserrat, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'google',
    fallback: 'Poppins, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'raleway',
    name: 'Raleway',
    category: 'google',
    fallback: 'Raleway, sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'nunito',
    name: 'Nunito',
    category: 'google',
    fallback: 'Nunito, sans-serif',
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    category: 'google',
    fallback: 'Ubuntu, sans-serif',
    weights: [300, 400, 500, 700],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap',
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    category: 'google',
    fallback: '"Work Sans", sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    category: 'google',
    fallback: '"Playfair Display", serif',
    weights: [400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
  },
];
```

#### 15.3.6 Font Family Selector Component

```tsx
import { useState, useEffect } from 'react';
import { Search, Upload, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const FontFamilySelector = ({ value, onChange }) => {
  const [category, setCategory] = useState<'system' | 'google' | 'custom'>('google');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFont, setSelectedFont] = useState<FontFamily>(value);
  const [previewSize, setPreviewSize] = useState(16);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load Google Font dynamically
  useEffect(() => {
    if (selectedFont?.category === 'google' && selectedFont.googleFontUrl) {
      // Remove existing font link if any
      const existingLink = document.getElementById('white-label-font');
      if (existingLink) {
        existingLink.remove();
      }

      // Add new font link
      const link = document.createElement('link');
      link.id = 'white-label-font';
      link.rel = 'stylesheet';
      link.href = selectedFont.googleFontUrl;
      link.onload = () => setFontLoaded(true);
      link.onerror = () => setFontLoaded(false);
      document.head.appendChild(link);
    } else {
      setFontLoaded(true);
    }
  }, [selectedFont]);

  // Get fonts for current category
  const getFontsForCategory = () => {
    const fonts = category === 'system' ? SYSTEM_FONTS : GOOGLE_FONTS;
    
    if (!searchQuery) return fonts;
    
    return fonts.filter(font => 
      font.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const fonts = getFontsForCategory();

  const handleFontSelect = (font: FontFamily) => {
    setSelectedFont(font);
    onChange(font);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system">System Fonts</TabsTrigger>
          <TabsTrigger value="google">Google Fonts</TabsTrigger>
          <TabsTrigger value="custom">Custom Upload</TabsTrigger>
        </TabsList>

        {/* System & Google Fonts Tab */}
        <TabsContent value={category} className="space-y-4">
          {category !== 'custom' && (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search fonts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Font List */}
              <ScrollArea className="h-96 border rounded-lg">
                <RadioGroup value={selectedFont?.id} onValueChange={(id) => {
                  const font = fonts.find(f => f.id === id);
                  if (font) handleFontSelect(font);
                }}>
                  {fonts.map((font) => (
                    <label
                      key={font.id}
                      className="flex items-start gap-3 p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: font.fallback }}
                    >
                      <RadioGroupItem value={font.id} className="mt-1" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">{font.name}</span>
                          {selectedFont?.id === font.id && (
                            <Check size={16} className="text-primary-600" />
                          )}
                        </div>
                        <div 
                          className="text-gray-700"
                          style={{ 
                            fontFamily: font.fallback,
                            fontSize: `${previewSize}px`,
                          }}
                        >
                          The quick brown fox jumps over the lazy dog
                        </div>
                        <div 
                          className="text-gray-500 text-sm"
                          style={{ fontFamily: font.fallback }}
                        >
                          ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                        </div>
                        <div className="text-xs text-gray-400">
                          Weights: {font.weights.join(', ')}
                        </div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </ScrollArea>

              {/* Preview Size Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preview Size</Label>
                <div className="flex gap-2">
                  {[12, 14, 16, 20, 24].map(size => (
                    <button
                      key={size}
                      onClick={() => setPreviewSize(size)}
                      className={`px-3 py-1 rounded border text-sm ${
                        previewSize === size
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Custom Font Upload */}
          {category === 'custom' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-semibold mb-2">Upload Custom Font</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload WOFF2, WOFF, TTF, or OTF font files
                </p>
                <Button variant="outline">
                  <Upload size={16} className="mr-2" />
                  Select Font Files
                </Button>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> For best performance, upload WOFF2 format.
                  Include all required weights (Regular, Medium, Bold).
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Live Preview Panel */}
      {selectedFont && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Live Preview</Label>
          <div 
            className="p-6 border rounded-lg bg-gray-50 space-y-4"
            style={{ fontFamily: selectedFont.fallback }}
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Your Application Title
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800">
              Section Heading
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              This is how regular paragraph text will appear in your application
              with the selected font family. You can see how it looks at various
              sizes and weights.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium">
                Button Example
              </button>
              <a href="#" className="text-primary-600 hover:underline">
                Link Example
              </a>
            </div>
            <div className="pt-4 border-t">
              <div className="space-y-2 text-sm">
                <div className="font-light">Light (300): The quick brown fox</div>
                <div className="font-normal">Regular (400): The quick brown fox</div>
                <div className="font-medium">Medium (500): The quick brown fox</div>
                <div className="font-semibold">Semibold (600): The quick brown fox</div>
                <div className="font-bold">Bold (700): The quick brown fox</div>
              </div>
            </div>
          </div>

          {/* Font Loading Status */}
          <div className="flex items-center gap-2 text-sm">
            {fontLoaded ? (
              <>
                <Check size={16} className="text-green-600" />
                <span className="text-green-600">Font loaded successfully</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-600">Loading font...</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

#### 15.3.7 Custom Font Upload Handler

```typescript
const handleCustomFontUpload = async (files: FileList) => {
  const allowedFormats = ['woff2', 'woff', 'ttf', 'otf'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const fontFiles: CustomFontFile[] = [];

  for (const file of Array.from(files)) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // Validate format
    if (!extension || !allowedFormats.includes(extension)) {
      throw new Error(`Invalid font format: ${file.name}. Allowed: ${allowedFormats.join(', ')}`);
    }

    // Validate size
    if (file.size > maxFileSize) {
      throw new Error(`File too large: ${file.name}. Max size: 5MB`);
    }

    // Upload to server
    const formData = new FormData();
    formData.append('font', file);

    const response = await fetch('/api/tenants/:id/branding/fonts', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name}`);
    }

    const { url } = await response.json();

    // Parse font weight/style from filename (e.g., MyFont-Bold.woff2)
    const weight = parseWeightFromFilename(file.name);
    const style = file.name.toLowerCase().includes('italic') ? 'italic' : 'normal';

    fontFiles.push({
      weight,
      style,
      url,
      format: extension as any,
    });
  }

  return fontFiles;
};

const parseWeightFromFilename = (filename: string): number => {
  const lower = filename.toLowerCase();
  if (lower.includes('thin') || lower.includes('100')) return 100;
  if (lower.includes('extralight') || lower.includes('200')) return 200;
  if (lower.includes('light') || lower.includes('300')) return 300;
  if (lower.includes('regular') || lower.includes('400')) return 400;
  if (lower.includes('medium') || lower.includes('500')) return 500;
  if (lower.includes('semibold') || lower.includes('600')) return 600;
  if (lower.includes('bold') || lower.includes('700')) return 700;
  if (lower.includes('extrabold') || lower.includes('800')) return 800;
  if (lower.includes('black') || lower.includes('900')) return 900;
  return 400; // default to regular
};
```

#### 15.3.8 CSS @font-face Generation

```typescript
// Generate @font-face CSS for custom fonts
const generateFontFaceCSS = (font: FontFamily): string => {
  if (font.category === 'custom' && font.customFontFiles) {
    return font.customFontFiles.map(file => `
      @font-face {
        font-family: '${font.name}';
        src: url('${file.url}') format('${file.format}');
        font-weight: ${file.weight};
        font-style: ${file.style};
        font-display: swap;
      }
    `).join('\n');
  }
  return '';
};

// Apply font to application
const applyFontFamily = (font: FontFamily) => {
  const root = document.documentElement;
  
  // Set CSS variable
  root.style.setProperty('--font-family', font.fallback);
  
  // Add custom font CSS if needed
  if (font.category === 'custom') {
    const styleId = 'custom-font-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    styleEl.textContent = generateFontFaceCSS(font);
  }
};
```

### 15.4 Complete White Labeling Form

**Full Screen Layout:**

```tsx
import { Upload, Eye } from 'lucide-react';

const WhiteLabelingSettings = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">White Labeling</h1>
        <p className="text-gray-600 mt-2">
          Customize the look and feel of your NEOX Infinity instance
        </p>
      </div>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
          <CardDescription>
            Upload your company logo (SVG, PNG, or JPG). Recommended size: 180×48px
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-48 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
              {logo ? (
                <img src={logo} alt="Logo" className="max-w-full max-h-full p-2" />
              ) : (
                <Upload className="text-gray-400" size={24} />
              )}
            </div>
            <div className="space-y-2">
              <Button variant="outline">
                <Upload size={16} className="mr-2" />
                Upload Logo
              </Button>
              <p className="text-xs text-gray-500">Max file size: 2MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Color */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Brand Color</CardTitle>
          <CardDescription>
            This color will be used for primary buttons, links, and key UI elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="solid">
            <TabsList>
              <TabsTrigger value="solid">Solid Color</TabsTrigger>
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
            </TabsList>
            <TabsContent value="solid">
              <SolidColorPicker value={primaryColor} onChange={setPrimaryColor} />
            </TabsContent>
            <TabsContent value="gradient">
              <GradientPicker value={primaryGradient} onChange={setPrimaryGradient} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Secondary Color */}
      <Card>
        <CardHeader>
          <CardTitle>Secondary Brand Color</CardTitle>
          <CardDescription>
            Optional secondary color for accents and alternative UI elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="solid">
            <TabsList>
              <TabsTrigger value="solid">Solid Color</TabsTrigger>
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
            </TabsList>
            <TabsContent value="solid">
              <SolidColorPicker value={secondaryColor} onChange={setSecondaryColor} />
            </TabsContent>
            <TabsContent value="gradient">
              <GradientPicker value={secondaryGradient} onChange={setSecondaryGradient} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Typography / Font Family */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Choose a font family for your application. The preview shows the actual font style.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FontFamilySelector value={fontFamily} onChange={setFontFamily} />
        </CardContent>
      </Card>

      {/* Custom Domain */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Domain</CardTitle>
          <CardDescription>
            Use your own domain instead of *.neoxinfinity.com
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Custom Domain</Label>
            <Input 
              placeholder="app.yourcompany.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
          </div>
          <Alert>
            <AlertDescription>
              You'll need to configure DNS records. See documentation for setup instructions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how your branding looks across different components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 border rounded-lg space-y-4" style={{
            '--primary': primaryColor.color,
            '--primary-alpha': primaryColor.alpha / 100,
          }}>
            {/* Preview components */}
            <div className="flex items-center gap-4">
              {logo && <img src={logo} alt="Logo" className="h-8" />}
              <span className="text-xl font-bold">Your Company Name</span>
            </div>
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 rounded-md text-white font-medium"
                style={{ background: primaryColor.color, opacity: primaryColor.alpha / 100 }}
              >
                Primary Button
              </button>
              <button 
                className="px-4 py-2 rounded-md text-white font-medium"
                style={{ background: secondaryColor.color, opacity: secondaryColor.alpha / 100 }}
              >
                Secondary Button
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>
          <Eye size={16} className="mr-2" />
          Preview Changes
        </Button>
        <Button variant="default">Save Changes</Button>
      </div>
    </div>
  );
};
```

### 15.4 Database Schema

```sql
CREATE TABLE tenant_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Logo
  logo_url TEXT,
  logo_light_url TEXT,  -- For dark mode
  logo_dark_url TEXT,   -- For light mode
  favicon_url TEXT,
  
  -- Primary Color
  primary_color_type VARCHAR(20) DEFAULT 'solid',  -- 'solid' or 'gradient'
  primary_color_hex VARCHAR(7),
  primary_color_alpha INTEGER DEFAULT 100,
  primary_gradient_type VARCHAR(20),  -- 'linear', 'radial', 'conic'
  primary_gradient_angle INTEGER,
  primary_gradient_stops JSONB,  -- Array of {color, alpha, position}
  primary_gradient_css TEXT,
  
  -- Secondary Color
  secondary_color_type VARCHAR(20) DEFAULT 'solid',
  secondary_color_hex VARCHAR(7),
  secondary_color_alpha INTEGER DEFAULT 100,
  secondary_gradient_type VARCHAR(20),
  secondary_gradient_angle INTEGER,
  secondary_gradient_stops JSONB,
  secondary_gradient_css TEXT,
  
  -- Custom Domain
  custom_domain TEXT,
  custom_domain_verified BOOLEAN DEFAULT FALSE,
  
  -- Typography / Font Family
  font_family_id VARCHAR(50),
  font_family_name VARCHAR(100),
  font_category VARCHAR(20),  -- 'system', 'google', 'custom'
  font_fallback TEXT,
  font_weights JSONB,  -- Array of available weights
  font_google_url TEXT,  -- Google Fonts URL
  font_custom_files JSONB,  -- Array of {weight, style, url, format}
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tenant_id)
);

-- Gradient stops structure example:
-- [
--   {"color": "#3B82F6", "alpha": 100, "position": 0},
--   {"color": "#8B5CF6", "alpha": 100, "position": 50},
--   {"color": "#EC4899", "alpha": 80, "position": 100}
-- ]
```

### 15.5 API Endpoints

```typescript
// GET /api/tenants/:id/branding
GET /api/tenants/{tenantId}/branding
Response: {
  logoUrl: string;
  primaryColor: {
    type: 'solid' | 'gradient';
    solid?: { color: string; alpha: number; };
    gradient?: {
      type: 'linear' | 'radial' | 'conic';
      angle?: number;
      stops: { color: string; alpha: number; position: number; }[];
      css: string;
    };
  };
  secondaryColor: { /* same structure */ };
  customDomain?: string;
  fontFamily?: {
    id: string;
    name: string;
    category: 'system' | 'google' | 'custom';
    fallback: string;
    weights: number[];
    googleFontUrl?: string;
    customFontFiles?: {
      weight: number;
      style: string;
      url: string;
      format: string;
    }[];
  };
}

// PUT /api/tenants/:id/branding
PUT /api/tenants/{tenantId}/branding
Body: {
  logoUrl?: string;
  primaryColor?: ColorConfig;
  secondaryColor?: ColorConfig;
  customDomain?: string;
  fontFamily?: FontFamily;
}

// POST /api/tenants/:id/branding/logo
POST /api/tenants/{tenantId}/branding/logo
Content-Type: multipart/form-data
Body: FormData with 'logo' file
Response: { logoUrl: string }

// POST /api/tenants/:id/branding/verify-domain
POST /api/tenants/{tenantId}/branding/verify-domain
Body: { domain: string }
Response: { 
  verified: boolean;
  dnsRecords: {
    type: string;
    name: string;
    value: string;
  }[];
}

// POST /api/tenants/:id/branding/fonts
POST /api/tenants/{tenantId}/branding/fonts
Content-Type: multipart/form-data
Body: FormData with font file(s)
Response: {
  fonts: {
    weight: number;
    style: string;
    url: string;
    format: string;
  }[];
}
```

### 15.6 CSS Variable Application

When a tenant's branding is loaded, CSS variables are dynamically set:

```typescript
// Apply tenant branding to page
const applyTenantBranding = (branding: TenantBranding) => {
  const root = document.documentElement;
  
  // Primary Color
  if (branding.primaryColor.type === 'solid') {
    const { color, alpha } = branding.primaryColor.solid;
    const rgb = hexToRgb(color);
    root.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    root.style.setProperty('--primary-alpha', `${alpha / 100}`);
    root.style.setProperty('--primary', color);
  } else {
    root.style.setProperty('--primary-gradient', branding.primaryColor.gradient.css);
  }
  
  // Secondary Color
  if (branding.secondaryColor?.type === 'solid') {
    const { color, alpha } = branding.secondaryColor.solid;
    const rgb = hexToRgb(color);
    root.style.setProperty('--secondary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    root.style.setProperty('--secondary-alpha', `${alpha / 100}`);
    root.style.setProperty('--secondary', color);
  }
  
  // Logo
  if (branding.logoUrl) {
    // Update logo images
    document.querySelectorAll('[data-tenant-logo]').forEach(el => {
      (el as HTMLImageElement).src = branding.logoUrl;
    });
  }
  
  // Font Family
  if (branding.fontFamily) {
    root.style.setProperty('--font-family', branding.fontFamily.fallback);
    
    // Load Google Font
    if (branding.fontFamily.category === 'google' && branding.fontFamily.googleFontUrl) {
      const existingLink = document.getElementById('tenant-font');
      if (existingLink) existingLink.remove();
      
      const link = document.createElement('link');
      link.id = 'tenant-font';
      link.rel = 'stylesheet';
      link.href = branding.fontFamily.googleFontUrl;
      document.head.appendChild(link);
    }
    
    // Apply custom font CSS
    if (branding.fontFamily.category === 'custom' && branding.fontFamily.customFontFiles) {
      const styleId = 'tenant-custom-font';
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      
      styleEl.textContent = branding.fontFamily.customFontFiles.map(file => `
        @font-face {
          font-family: '${branding.fontFamily.name}';
          src: url('${file.url}') format('${file.format}');
          font-weight: ${file.weight};
          font-style: ${file.style};
          font-display: swap;
        }
      `).join('\n');
    }
  }
};
```

### 15.7 Validation Rules

**Logo Upload:**
- Allowed formats: SVG, PNG, JPG, WebP
- Max file size: 2MB
- Recommended dimensions: 180×48px (3.75:1 ratio)
- SVG recommended for scalability

**Color Validation:**
- Hex colors must match: `/^#[0-9A-F]{6}$/i`
- Alpha: 0-100 (integer)
- Gradient stops: minimum 2, maximum 10
- Stop positions: 0-100, must be unique
- Gradient angle: 0-360

**Custom Domain:**
- Must be valid domain format
- Cannot be subdomain of neoxinfinity.com
- SSL certificate required
- DNS verification required before activation

### 15.8 Accessibility Considerations

**Contrast Checking:**

```typescript
// Check if custom colors meet WCAG AA standards
const checkContrast = (foreground: string, background: string): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA for normal text
};

// Warn user if contrast is insufficient
if (!checkContrast(primaryColor, '#FFFFFF')) {
  showWarning('Primary color may not have sufficient contrast with white backgrounds');
}
```

**Preview Mode:**

Before saving, users should preview their branding across:
- Login screen
- Dashboard
- Buttons (hover, active, disabled states)
- Form fields
- Navigation
- Cards and modals

---

## 16. Implementation Checklist

### For Developers:

- [ ] Install dependencies (Tailwind, Lucide React, Framer Motion, Recharts)
- [ ] Set up design tokens in CSS/Tailwind config
- [ ] Create base component library (Button, Input, Card, etc.)
- [ ] Implement color system and test contrast ratios
- [ ] Set up responsive breakpoints
- [ ] Add accessibility features (ARIA, keyboard nav, focus indicators)
- [ ] Implement dark mode support
- [ ] Create animation utilities
- [ ] Document component usage
- [ ] Set up Storybook (optional, for component showcase)

### For Designers:

- [ ] Create Figma/Sketch component library matching this spec
- [ ] Design all screen layouts using design system
- [ ] Export design tokens
- [ ] Create interactive prototypes
- [ ] Conduct usability testing

---

## 16. Resources

### Documentation
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev
- **Radix UI**: https://www.radix-ui.com
- **Framer Motion**: https://www.framer.com/motion
- **Recharts**: https://recharts.org

### Tools
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Palette Generator**: https://coolors.co
- **Accessibility Checker**: https://wave.webaim.org

---

**End of Design System Specification**

*This design system is the foundation for all UI development in the NEOX Infinity App. All components, screens, and modules must adhere to these specifications.*
