# NEOX Infinity - Complete Design Specification

## Document Information
- **Project Name**: NEOX Infinity - Multi-Tenant Admin Platform
- **Version**: 2.0
- **Date**: 2026-03-11
- **Purpose**: Complete design system specification including colors, typography, icons, panels, and UI components

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Dashboard Theme (DASH Tokens)](#dashboard-theme-dash-tokens)
4. [Typography](#typography)
5. [Fluent Icons](#fluent-icons)
6. [Layout & Panels](#layout--panels)
7. [UI Components](#ui-components)
8. [Spacing & Sizing](#spacing--sizing)
9. [Animations & Transitions](#animations--transitions)
10. [Responsive Design](#responsive-design)
11. [Dark Mode Implementation](#dark-mode-implementation)

---

## Design Philosophy

### Core Principles
- **Professional & Modern**: Clean, corporate aesthetic suitable for enterprise environments
- **Navy & Gold Branding**: Sophisticated color palette reflecting premium quality
- **Accessibility First**: WCAG 2.1 AA compliant, high contrast ratios
- **Mobile Responsive**: Mobile-first approach with adaptive layouts
- **Consistent Experience**: Unified design language across all modules

### Design Language
- Rounded corners (12px-24px) for modern feel
- Soft shadows for depth and hierarchy
- Gradient accents for visual interest
- Glass-morphism effects for premium look
- Smooth animations for polished interactions

---

## Color System

### Primary Brand Colors

#### Navy (Primary)
The navy color is used for backgrounds, primary surfaces, and brand identity.

```css
navy: {
  50:  '#f0f4f8'  /* Lightest tint - rarely used */
  100: '#d9e2ec'  /* Very light - borders, dividers */
  200: '#bcccdc'  /* Light - disabled states */
  300: '#9fb3c8'  /* Medium light - muted text */
  400: '#829ab1'  /* Medium - secondary text */
  500: '#627d98'  /* Base medium - icons */
  600: '#486581'  /* Dark medium - hover states */
  700: '#334e68'  /* Dark - secondary backgrounds */
  800: '#243b53'  /* Very dark - primary surfaces */
  900: '#102a43'  /* Almost black - deep backgrounds */
  950: '#08122e'  /* Primary Navy - main background */
}
```

**Usage:**
- `navy-950`: Main application background
- `navy-800`: Secondary panels, cards
- `navy-700`: Hover states, accents
- `navy-600`: Active navigation items
- `navy-500` - `navy-300`: Text hierarchy, muted content

#### Gold (Accent)
The gold color is used for highlights, CTAs, and premium features.

```css
gold: {
  50:  '#fefdf7'  /* Lightest - subtle backgrounds */
  100: '#fdf9e7'  /* Very light - hover backgrounds */
  200: '#fbf2cc'  /* Light - disabled gold elements */
  300: '#f7e6a1'  /* Medium light - borders */
  400: '#f1d76e'  /* Medium - secondary accents */
  500: '#e9c547'  /* Base gold - attention elements */
  600: '#d7bb91'  /* Primary Gold - main accent color */
  700: '#b5925a'  /* Dark - active states */
  800: '#936f3e'  /* Very dark - pressed states */
  900: '#7a5a31'  /* Darker - deep accents */
  950: '#463318'  /* Darkest - rarely used */
}
```

**Usage:**
- `gold-600`: Primary buttons, links, highlights
- `gold-500`: Hover states for gold elements
- `gold-400`: Active indicators, badges
- `gold-300`: Borders, subtle accents

### Semantic Colors

#### Primary (Mapped to Gold)
```css
primary: {
  DEFAULT: '#d7bb91'  /* gold-600 */
  50:  '#fefdf7'
  100: '#fdf9e7'
  200: '#fbf2cc'
  300: '#f7e6a1'
  400: '#f1d76e'
  500: '#e9c547'
  600: '#d7bb91'
  700: '#b5925a'
  800: '#936f3e'
  900: '#7a5a31'
  950: '#463318'
}
```

#### Secondary (Mapped to Navy)
```css
secondary: {
  DEFAULT: '#334e68'  /* navy-700 */
  50:  '#f0f4f8'
  100: '#d9e2ec'
  200: '#bcccdc'
  300: '#9fb3c8'
  400: '#829ab1'
  500: '#627d98'
  600: '#486581'
  700: '#334e68'
  800: '#243b53'
  900: '#102a43'
  950: '#08122e'
}
```

### Functional Colors

#### Success (Green)
```css
success: {
  light: '#dcfce7'  /* Background */
  DEFAULT: '#10B981' /* Icon/text */
  dark: '#166534'   /* Dark text */
}
```

#### Warning (Amber)
```css
warning: {
  light: '#fef3c7'  /* Background */
  DEFAULT: '#F59E0B' /* Icon/text */
  dark: '#d97706'   /* Dark text */
}
```

#### Error (Red)
```css
error: {
  light: '#fee2e2'  /* Background */
  DEFAULT: '#EF4444' /* Icon/text */
  dark: '#dc2626'   /* Dark text */
}
```

#### Info (Blue)
```css
info: {
  light: '#dbeafe'  /* Background */
  DEFAULT: '#3B82F6' /* Icon/text */
  dark: '#2563eb'   /* Dark text */
}
```

#### Neutral (Gray)
```css
neutral: {
  light: '#f3f4f6'  /* Background */
  DEFAULT: '#6B7280' /* Icon/text */
  dark: '#374151'   /* Dark text */
}
```

### CSS Variable System

The application uses HSL-based CSS variables for dynamic theming:

```css
:root {
  --background: 210 100% 6%;        /* Navy 950 */
  --foreground: 28 19% 85%;         /* Gold 600 */
  --card: 210 100% 12%;             /* Navy 800 + transparency */
  --card-foreground: 28 19% 85%;    /* Gold 600 */
  --popover: 210 100% 15%;          /* Slightly lighter than card */
  --popover-foreground: 28 19% 85%; /* Gold 600 */
  --primary: 28 19% 70%;            /* Gold 600 */
  --primary-foreground: 210 100% 6%; /* Navy 950 */
  --secondary: 215 25% 27%;         /* Navy 700 */
  --secondary-foreground: 28 19% 85%; /* Gold 600 */
  --muted: 215 25% 27%;             /* Navy 700 */
  --muted-foreground: 215 20% 65%;  /* Navy 400 */
  --accent: 215 25% 27%;            /* Navy 700 */
  --accent-foreground: 28 19% 85%;  /* Gold 600 */
  --destructive: 0 84% 60%;         /* Red */
  --destructive-foreground: 210 40% 98%; /* White */
  --border: 215 27.9% 16.9%;        /* Navy 800 */
  --input: 215 27.9% 16.9%;         /* Navy 800 */
  --ring: 28 19% 70%;               /* Gold 600 */
  --radius: 1rem;                   /* 16px */
}
```

### Gradient Styles

#### Navy Gradient (Primary Background)
```css
.neox-gradient {
  background: linear-gradient(135deg, #08122e 0%, #243b53 100%);
}
```

#### Gold Gradient (Accent Elements)
```css
.neox-gold-gradient {
  background: linear-gradient(135deg, #d7bb91 0%, #e9c547 100%);
}
```

#### Module-Specific Gradients

**Visitor Management (Blue)**
```css
background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
border: 1px solid rgba(59, 130, 246, 0.3);
```

**Parking Management (Steel)**
```css
background: linear-gradient(135deg, rgba(100, 116, 139, 0.15), rgba(71, 85, 105, 0.15));
border: 1px solid rgba(100, 116, 139, 0.3);
```

**Digital Badges (Purple)**
```css
background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.15));
border: 1px solid rgba(99, 102, 241, 0.3);
```

**Lockers (Cyan)**
```css
background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(6, 182, 212, 0.15));
border: 1px solid rgba(14, 165, 233, 0.3);
```

**Space Management (Emerald)**
```css
background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15));
border: 1px solid rgba(16, 185, 129, 0.3);
```

---

## Dashboard Theme (DASH Tokens)

The following DASH theme constants define the actual colors used across all 10 analytics dashboards. These tokens ensure visual consistency throughout the dashboard module while maintaining the overall NEOX dark theme.

### DASH Theme Constants

| Token | Value | Usage |
|---|---|---|
| **Background** | `#08122E` | Main dashboard background |
| **Panel Background** | `#0F1A2E` | Dashboard panel/section backgrounds |
| **Card Background** | `#162032` | Individual dashboard cards |
| **Card Hover** | `#1E293B` | Card hover state |
| **Border** | `#1E3A5F` | Card and panel borders |
| **Gold Accent** | `#C9963B` | Accent highlights, active indicators, chart emphasis |
| **Text Primary** | `#F1F5F9` | Headings, primary labels, KPI values |
| **Text Secondary** | `#94A3B8` | Descriptions, secondary labels, axis labels |
| **Text Muted** | `#64748B` | Disabled text, placeholder text, footnotes |
| **Success** | `#22C55E` | Positive metrics, upward trends, success states |
| **Warning** | `#F59E0B` | Caution indicators, thresholds, alerts |
| **Error** | `#EF4444` | Negative metrics, downward trends, error states |
| **Info** | `#3B82F6` | Informational highlights, chart accents, links |

### DASH Token CSS Variables

```css
:root {
  --dash-background: #08122E;
  --dash-panel-bg: #0F1A2E;
  --dash-card-bg: #162032;
  --dash-card-hover: #1E293B;
  --dash-border: #1E3A5F;
  --dash-gold-accent: #C9963B;
  --dash-text-primary: #F1F5F9;
  --dash-text-secondary: #94A3B8;
  --dash-text-muted: #64748B;
  --dash-success: #22C55E;
  --dash-warning: #F59E0B;
  --dash-error: #EF4444;
  --dash-info: #3B82F6;
}
```

### DASH Token Usage Example

```tsx
/* Dashboard card component */
<div style={{
  backgroundColor: 'var(--dash-card-bg)',   /* #162032 */
  border: '1px solid var(--dash-border)',    /* #1E3A5F */
  borderRadius: '16px',
  padding: '24px',
}}>
  <h3 style={{ color: 'var(--dash-text-primary)' }}>Revenue</h3>
  <p style={{ color: 'var(--dash-gold-accent)', fontSize: '32px' }}>$1.2M</p>
  <span style={{ color: 'var(--dash-success)' }}>+12.5%</span>
</div>
```

---

## Typography

### Font Family

**Primary Font**: Poppins (Google Fonts)

```css
font-family: 'Poppins', system-ui, sans-serif;
```

**Import Statement**:
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
```

**Available Weights**:
- 300: Light (rarely used)
- 400: Regular (body text)
- 500: Medium (emphasis)
- 600: Semi-Bold (sub-headings)
- 700: Bold (headings)
- 800: Extra-Bold (hero text, dashboard titles)

### Type Scale

#### Display Text (Hero Sections)
```css
/* Hero Title */
font-size: 36px;
font-weight: 700;
line-height: 1.2;
letter-spacing: -0.02em;
color: #F1F5F9;
```

#### Headings

**H1 - Page Title**
```css
font-size: 32px;
font-weight: 800;
line-height: 1.2;
letter-spacing: -0.02em;
color: #F1F5F9;
```

**H2 - Section Title**
```css
font-size: 24px;
font-weight: 700;
line-height: 1.3;
color: #F1F5F9;
```

**H3 - Card Title**
```css
font-size: 20px;
font-weight: 700;
line-height: 1.4;
color: #F1F5F9;
```

**H4 - Sub-section**
```css
font-size: 18px;
font-weight: 600;
line-height: 1.4;
color: #F1F5F9;
```

**H5 - Small Heading**
```css
font-size: 16px;
font-weight: 600;
line-height: 1.5;
color: #F1F5F9;
```

#### Body Text

**Body Large**
```css
font-size: 16px;
font-weight: 400;
line-height: 1.6;
color: #F1F5F9;
```

**Body Regular**
```css
font-size: 14px;
font-weight: 400;
line-height: 1.6;
color: #F1F5F9;
```

**Body Small**
```css
font-size: 13px;
font-weight: 400;
line-height: 1.5;
color: #CBD5E1; /* Muted */
```

**Caption**
```css
font-size: 12px;
font-weight: 500;
line-height: 1.4;
color: #94A3B8; /* More muted */
```

**Label**
```css
font-size: 11px;
font-weight: 600;
line-height: 1.4;
letter-spacing: 0.05em;
text-transform: uppercase;
color: #94A3B8;
```

#### Interactive Elements

**Button Text**
```css
font-size: 14px;
font-weight: 500;
line-height: 1;
```

**Link Text**
```css
font-size: 14px;
font-weight: 500;
color: #d7bb91; /* Gold */
text-decoration: none;
```

**Link Hover**
```css
color: #e9c547; /* Gold 500 */
text-decoration: underline;
```

### Text Colors

```css
/* Primary text on dark background */
.text-primary { color: #F1F5F9; }

/* Secondary/muted text */
.text-secondary { color: #CBD5E1; }

/* Tertiary/very muted text */
.text-tertiary { color: #94A3B8; }

/* Disabled text */
.text-disabled { color: #64748B; }

/* Accent text (gold) */
.text-accent { color: #d7bb91; }

/* Success text */
.text-success { color: #10B981; }

/* Warning text */
.text-warning { color: #F59E0B; }

/* Error text */
.text-error { color: #EF4444; }
```

---

## Fluent Icons

The project uses **Fluent UI React Icons** (`@fluentui/react-icons`) exclusively for all iconography. Do **NOT** use Lucide React or any other icon library.

### Installation
```bash
npm install @fluentui/react-icons@^2.0.312
```

### Key Icons by Category

- **Navigation**: `HomeRegular`, `PeopleRegular`, `CalendarRegular`, `BuildingRegular`
- **Actions**: `AddRegular`, `EditRegular`, `DeleteRegular`, `SaveRegular`, `DismissRegular`
- **Status**: `CheckmarkCircleRegular`, `ErrorCircleRegular`, `WarningRegular`, `InfoRegular`
- **Files**: `ArrowUploadRegular`, `ArrowDownloadRegular`, `DocumentRegular`
- **Communication**: `MailRegular`, `SendRegular`
- **System**: `SettingsRegular`, `SearchRegular`, `FilterRegular`, `StatusRegular`

### Icon Variants

All icons come in three variants:
- **Regular**: Default weight (24px)
- **Filled**: Solid fill
- **Light**: Thin stroke

Example:
```tsx
import { 
  HomeRegular, 
  HomeFilled, 
  HomeLight 
} from '@fluentui/react-icons'
```

### Core Icons Used

#### Navigation & Structure
```tsx
import {
  HomeRegular,           // Dashboard/Home
  BuildingRegular,       // Buildings
  PeopleRegular,         // Users
  SettingsRegular,       // Settings
  DocumentRegular,       // Documents/Reports
  GridRegular,           // Grid view
  ListRegular,           // List view
  SearchRegular,         // Search
  FilterRegular,         // Filters
  ArrowLeftRegular,      // Back navigation
  ArrowRightRegular,     // Forward navigation
  DismissRegular,        // Close/Cancel
} from '@fluentui/react-icons'
```

#### User Management
```tsx
import {
  PersonRegular,         // Single user
  PeopleRegular,         // Multiple users
  PersonAddRegular,      // Add user
  PersonDeleteRegular,   // Remove user
  PersonEditRegular,     // Edit user
  PersonCircleRegular,   // User profile
  PeopleTeamRegular,     // Team/Department
} from '@fluentui/react-icons'
```

#### Visitor Management
```tsx
import {
  PersonRegular,         // Visitor
  BriefcaseRegular,      // Business visitor
  StarRegular,           // VIP visitor
  AnimalDogRegular,      // Pet/Dog visitor
  QuestionCircleRegular, // Unknown/Other type
  CalendarRegular,       // Visit date
  ClockRegular,          // Visit time
  CheckmarkCircleRegular, // Checked in
  DismissCircleRegular,  // No-show
} from '@fluentui/react-icons'
```

#### Parking Management
```tsx
import {
  VehicleCarRegular,     // Car/Vehicle
  VehicleTruckRegular,   // Truck
  PlugConnectedRegular,  // EV Charging
  LocationRegular,       // Parking location
  MapRegular,            // Parking map
  KeyRegular,            // Access
  CalendarRegular,       // Reservation
  LockClosedRegular,     // Reserved
  LockOpenRegular,       // Available
} from '@fluentui/react-icons'
```

#### Digital Badges
```tsx
import {
  CardUIRegular,         // Badge/Card
  BadgeRegular,          // Digital badge
  QRCodeRegular,         // QR code
  ShieldRegular,         // Access/Security
  KeyRegular,            // Access key
  PrintRegular,          // Print badge
  ScanRegular,           // Scan badge
} from '@fluentui/react-icons'
```

#### Lockers
```tsx
import {
  BoxRegular,            // Locker
  LockClosedRegular,     // Locked
  LockOpenRegular,       // Open/Available
  KeyRegular,            // Locker key
  CalendarRegular,       // Locker reservation
  LocationRegular,       // Locker location
} from '@fluentui/react-icons'
```

#### Space Management
```tsx
import {
  DeskRegular,           // Desk
  MeetingRoomRegular,    // Meeting room
  ConferenceRoomRegular, // Conference room
  BuildingRegular,       // Building/Floor
  LocationRegular,       // Space location
  CalendarRegular,       // Booking
  ClockRegular,          // Time slot
  PeopleRegular,         // Capacity
} from '@fluentui/react-icons'
```

#### Status & Alerts
```tsx
import {
  CheckmarkCircleRegular, // Success
  ErrorCircleRegular,     // Error
  WarningRegular,         // Warning
  InfoRegular,            // Information
  AlertRegular,           // Alert
  AlertOnRegular,         // Active alert
  StatusRegular,          // Status indicator
} from '@fluentui/react-icons'
```

#### Actions
```tsx
import {
  AddRegular,            // Add/Create
  DeleteRegular,         // Delete
  EditRegular,           // Edit
  SaveRegular,           // Save
  SendRegular,           // Send
  MailRegular,           // Email
  ShareRegular,          // Share
  CopyRegular,           // Copy
  ArrowUploadRegular,    // Upload
  ArrowDownloadRegular,  // Download
  PrintRegular,          // Print
  RefreshRegular,        // Refresh
} from '@fluentui/react-icons'
```

#### Data & Analytics
```tsx
import {
  DataBarVerticalRegular, // Bar chart
  DataPieRegular,         // Pie chart
  DataLineRegular,        // Line chart
  TableRegular,           // Table view
  ChartMultipleRegular,   // Multiple charts
  TrendingUpRegular,      // Positive trend
  TrendingDownRegular,    // Negative trend
} from '@fluentui/react-icons'
```

#### System & Settings
```tsx
import {
  SettingsRegular,       // Settings
  OptionsRegular,        // More options
  ColorRegular,          // Color picker
  PaintBrushRegular,     // Customization
  EyeRegular,            // View/Preview
  EyeOffRegular,         // Hide
  LightbulbRegular,      // Idea/Help
  QuestionCircleRegular, // Help
} from '@fluentui/react-icons'
```

### Icon Styling

**Default Icon Style**
```tsx
<PersonRegular 
  style={{ 
    width: '20px', 
    height: '20px', 
    color: '#94A3B8' // Muted foreground
  }} 
/>
```

**Active Icon Style**
```tsx
<PersonRegular 
  style={{ 
    width: '20px', 
    height: '20px', 
    color: '#d7bb91' // Gold accent
  }} 
/>
```

**Button Icon Style**
```tsx
<AddRegular 
  style={{ 
    width: '16px', 
    height: '16px', 
    color: 'inherit'
  }} 
/>
```

**Large Icon Style (Dashboard Headers)**
```tsx
<DataBarVerticalRegular 
  style={{ 
    width: '24px', 
    height: '24px', 
    color: '#60A5FA' // Module color
  }} 
/>
```

---

## Layout & Panels

### Page Structure

#### Standard Layout Hierarchy
```
┌─────────────────────────────────────────┐
│ Top Navigation Bar (70px)              │
├─────────────────────────────────────────┤
│ Main Content Area                       │
│ ┌───────┬─────────────────────────────┐ │
│ │       │                             │ │
│ │ Side  │  Content Panel              │ │
│ │ Nav   │                             │ │
│ │       │                             │ │
│ │(280px)│  (Fluid)                    │ │
│ │       │                             │ │
│ └───────┴─────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Top Navigation Bar

**Specifications**:
```css
height: 70px;
background-color: #162032; /* Navy 800 + slight tint */
border-bottom: 1px solid #1E293B; /* Navy 700 */
padding: 0 32px;
display: flex;
align-items: center;
justify-content: space-between;
```

**Components**:
- Logo (left)
- User profile dropdown (right)
- Action buttons (right)
- Notifications icon (right)

### Sidebar Navigation

**Specifications**:
```css
width: 280px; /* Desktop */
min-height: 100vh;
background-color: #162032; /* Navy 800 */
border-right: 1px solid #1E293B; /* Navy 700 */
padding: 24px 16px;
```

**On Tablet** (769px - 1024px):
```css
width: 240px;
```

**On Mobile** (< 768px):
```css
width: 280px;
position: fixed;
z-index: 50;
transform: translateX(-100%); /* Hidden by default */
transition: transform 0.3s ease;
```

### Main Content Panel

**Specifications**:
```css
flex: 1;
padding: 40px 32px;
min-height: calc(100vh - 70px);
background-color: #08122E; /* Navy 950 */
```

**On Mobile**:
```css
padding: 20px 16px;
```

### Card/Panel Components

#### Standard Card
```css
background-color: rgba(22, 32, 50, 0.5); /* Navy 800 + transparency */
backdrop-filter: blur(8px);
border: 1px solid #1E293B; /* Navy 700 */
border-radius: 16px;
padding: 24px;
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

**Usage**: Forms, tables, content sections

#### Dashboard Card
```css
background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
border: 1px solid rgba(59, 130, 246, 0.3);
border-radius: 20px;
padding: 24px;
position: relative;
overflow: hidden;
```

**With Glow Effect**:
```css
/* Add inside card */
.glow-effect {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  filter: blur(40px);
}
```

**Usage**: KPI cards, dashboard metrics

#### Hero Panel
```css
background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
border-radius: 24px;
padding: 32px;
position: relative;
overflow: hidden;
```

**With Backdrop**:
```css
/* Add inside panel */
.hero-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.05));
  backdrop-filter: blur(10px);
}
```

**Usage**: Module headers, feature highlights

#### Modal/Dialog
```css
background-color: #162032; /* Navy 800 */
border: 1px solid #334e68; /* Navy 700 */
border-radius: 16px;
padding: 32px;
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
max-width: 600px;
width: 90%;
```

**Overlay**:
```css
position: fixed;
inset: 0;
background-color: rgba(0, 0, 0, 0.6);
backdrop-filter: blur(4px);
z-index: 50;
```

---

## UI Components

### Buttons

#### Primary Button
```css
.neox-button {
  background-color: hsl(var(--primary)); /* Gold */
  color: hsl(var(--primary-foreground)); /* Navy */
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
}

.neox-button:hover {
  background-color: hsl(var(--primary) / 0.9);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.neox-button:active {
  transform: translateY(0);
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, 0.1);
}
```

#### Secondary Button
```css
.neox-button-secondary {
  background-color: hsl(var(--secondary)); /* Navy 700 */
  color: hsl(var(--secondary-foreground)); /* Gold */
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.neox-button-secondary:hover {
  background-color: hsl(var(--secondary) / 0.8);
  border-color: hsl(var(--primary));
}
```

#### Danger Button
```css
background-color: #EF4444;
color: white;
border-radius: 12px;
padding: 12px 24px;
font-size: 14px;
font-weight: 500;
transition: all 0.2s;
border: none;
cursor: pointer;
```

**Hover**: `background-color: #DC2626;`

#### Icon Button
```css
width: 40px;
height: 40px;
border-radius: 8px;
background-color: transparent;
border: 1px solid #334155; /* Navy border */
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: all 0.2s;
```

**Hover**:
```css
background-color: #1E293B;
border-color: #d7bb91; /* Gold */
```

### Form Inputs

#### Text Input
```css
.form-input {
  display: flex;
  height: 48px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid hsl(var(--input)); /* Navy 800 */
  background-color: hsl(var(--background) / 0.5); /* Navy 950 + transparency */
  padding: 8px 16px;
  font-size: 14px;
  color: #F1F5F9;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: hsl(var(--ring)); /* Gold */
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}

.form-input::placeholder {
  color: #64748B; /* Muted */
}
```

#### Label
```css
.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #F1F5F9;
  margin-bottom: 8px;
  display: block;
}
```

#### Select Dropdown
```css
/* Uses Radix UI Select */
background-color: #162032; /* Navy 800 */
border: 1px solid #334155;
border-radius: 12px;
padding: 8px 16px;
color: #F1F5F9;
cursor: pointer;
```

#### Checkbox
```css
/* Uses Radix UI Checkbox */
width: 20px;
height: 20px;
border-radius: 4px;
border: 1px solid #334155;
background-color: transparent;
```

**Checked**:
```css
background-color: #d7bb91; /* Gold */
border-color: #d7bb91;
```

### Navigation

#### Nav Link
```css
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: hsl(var(--muted-foreground)); /* Navy 400 */
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  color: hsl(var(--foreground)); /* Gold */
  background-color: hsl(var(--accent) / 0.5); /* Navy 700 */
}

.nav-link.active {
  color: hsl(var(--primary)); /* Gold */
  background-color: hsl(var(--accent)); /* Navy 700 */
}
```

### Status Badges

#### Active Status
```css
.status-active {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background-color: #dcfce7; /* Green light */
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #166534; /* Green dark */
}
```

#### Inactive Status
```css
.status-inactive {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background-color: #f3f4f6; /* Gray light */
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #374151; /* Gray dark */
}
```

#### Suspended Status
```css
.status-suspended {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background-color: #fee2e2; /* Red light */
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #dc2626; /* Red dark */
}
```

#### Pending Status
```css
.status-pending {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background-color: #fef3c7; /* Yellow light */
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #d97706; /* Yellow dark */
}
```

### Tables

#### Table Structure
```css
/* Table wrapper */
.table-wrapper {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #1E293B; /* Navy 700 */
}

/* Table header */
.table-header {
  height: 48px;
  padding: 0 16px;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94A3B8; /* Muted */
  background-color: #162032; /* Navy 800 */
}

/* Table row */
.table-row {
  border-bottom: 1px solid #1E293B; /* Navy 700 */
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: rgba(51, 78, 104, 0.3); /* Navy 700 + transparency */
}

/* Table cell */
.table-cell {
  padding: 16px;
  font-size: 14px;
  color: #F1F5F9;
}
```

### Loading States

#### Spinner
```css
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(215, 187, 145, 0.2); /* Gold + transparency */
  border-top-color: #d7bb91; /* Gold */
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Skeleton Loader
```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(51, 78, 104, 0.2) 0%,
    rgba(51, 78, 104, 0.4) 50%,
    rgba(51, 78, 104, 0.2) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Rich WYSIWYG Email Editor

The platform includes a rich text email editor built with `contentEditable` and `document.execCommand` for composing formatted emails directly within the admin UI. Supports bold, italic, underline, lists, links, and inline images without requiring an external WYSIWYG library.

### Hover-to-Release Overlay on Grid Boxes

Grid-based layouts (e.g., locker grids, parking maps, space plans) use a hover-to-release overlay pattern. When a user hovers over an occupied grid box, an overlay appears with a "Release" action button, allowing quick deallocation without navigating to a detail view.

### Outlook-Style Calendar Views

The calendar module provides Outlook-style views with three modes:
- **Day View**: Hourly time slots with drag-to-create booking support
- **Week View**: 7-day grid with horizontal event bars
- **Month View**: Traditional month grid with event dots and overflow indicators

### Operational Status Badges

Operational status is displayed using color-coded badges:

| Status | Color | Hex |
|---|---|---|
| **Online** | Green | `#22C55E` |
| **Offline** | Red | `#EF4444` |
| **Degraded** | Yellow | `#F59E0B` |
| **Maintenance** | Blue | `#3B82F6` |

```css
.status-online { background-color: rgba(34, 197, 94, 0.15); color: #22C55E; }
.status-offline { background-color: rgba(239, 68, 68, 0.15); color: #EF4444; }
.status-degraded { background-color: rgba(245, 158, 11, 0.15); color: #F59E0B; }
.status-maintenance { background-color: rgba(59, 130, 246, 0.15); color: #3B82F6; }
```

### Collapsible Bulk Upload Panels

Bulk upload functionality is housed in collapsible panels that expand inline when the user triggers a bulk action. The panel contains a drag-and-drop file zone, a file list with validation status, and progress indicators. The panel collapses back after upload completion or manual dismissal.

---

## Spacing & Sizing

### Spacing Scale
```css
/* Tailwind-based spacing */
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
7: 28px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

### Common Spacing Patterns

**Card Padding**: `24px` (6)
**Modal Padding**: `32px` (8)
**Section Gap**: `32px` (8)
**Element Gap**: `16px` (4)
**Tight Gap**: `8px` (2)

### Border Radius

```css
--radius: 1rem; /* 16px - global default */
--radius-lg: 1rem; /* 16px - large elements */
--radius-md: 0.75rem; /* 12px - medium elements */
--radius-sm: 0.5rem; /* 8px - small elements */
--radius-full: 9999px; /* Fully rounded (pills, badges) */
```

**Usage**:
- Cards: `16px` or `20px`
- Buttons: `12px`
- Inputs: `12px`
- Modals: `16px`
- Badges: `9999px` (full)
- Small elements: `8px`

### Component Sizes

#### Buttons
- Small: `height: 32px, padding: 6px 12px`
- Medium: `height: 40px, padding: 10px 20px`
- Large: `height: 48px, padding: 12px 24px`

#### Inputs
- Small: `height: 32px`
- Medium: `height: 40px`
- Large: `height: 48px`

#### Icons
- Small: `16px × 16px`
- Medium: `20px × 20px`
- Large: `24px × 24px`
- Extra Large: `32px × 32px` (dashboard)

---

## Animations & Transitions

### Timing Functions

```css
/* Default ease */
transition-timing-function: ease;

/* Smooth out */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* Spring-like */
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Transition Durations

```css
/* Fast (micro-interactions) */
transition-duration: 150ms;

/* Normal (hover, focus) */
transition-duration: 200ms;

/* Slow (modals, panels) */
transition-duration: 300ms;

/* Very slow (page transitions) */
transition-duration: 500ms;
```

### Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

animation: fadeIn 0.3s ease-out;
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

animation: slideUp 0.3s ease-out;
```

#### Scale In
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

animation: scaleIn 0.2s ease-out;
```

#### Accordion Down/Up
```css
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}

/* Usage */
animation: accordion-down 0.2s ease-out;
animation: accordion-up 0.2s ease-out;
```

#### Pulse (Success Indicator)
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### Hover Effects

**Lift Effect**:
```css
transition: transform 0.2s, box-shadow 0.2s;

&:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}
```

**Glow Effect**:
```css
transition: box-shadow 0.2s;

&:hover {
  box-shadow: 0 0 20px rgba(215, 187, 145, 0.3);
}
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Range | Usage |
|---|---|---|
| **Mobile** | `< 640px` | Single column, stacked layouts, bottom navigation |
| **Tablet** | `640px - 1024px` | Two column layouts, collapsible sidebar |
| **Desktop** | `1024px - 1280px` | Full layout with sidebar, multi-column grids |
| **Wide** | `> 1280px` | Extended dashboard layouts, wider content areas |

```css
/* Mobile */
@media (max-width: 639px) { }

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) and (max-width: 1279px) { }

/* Wide */
@media (min-width: 1280px) { }
```

### Mobile Adaptations

#### Hide on Mobile
```css
@media (max-width: 768px) {
  .mobile-hidden {
    display: none !important;
  }
}
```

#### Full Width on Mobile
```css
@media (max-width: 768px) {
  .mobile-full-width {
    width: 100% !important;
  }
}
```

#### Stack on Mobile
```css
@media (max-width: 768px) {
  .mobile-stack {
    grid-template-columns: 1fr !important;
  }
}
```

#### Reduce Padding on Mobile
```css
@media (max-width: 768px) {
  .mobile-padding {
    padding: 16px !important;
  }
}
```

#### Mobile Sidebar
```css
@media (max-width: 768px) {
  .mobile-sidebar-hidden {
    transform: translateX(-100%);
    position: fixed;
    z-index: 50;
  }

  .mobile-sidebar-visible {
    transform: translateX(0);
    position: fixed;
    z-index: 50;
    width: 280px;
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
}
```

### Grid Patterns

#### Responsive Grid
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
gap: 24px;

/* On mobile */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
  gap: 16px;
}
```

#### Dashboard Cards Grid
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 20px;

/* On mobile */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
  gap: 12px;
}
```

---

## Dark Mode Implementation

The application is **dark mode only** by default, optimized for professional environments.

### Background Layers

```css
/* Base layer */
background: #08122E (navy-950)

/* Surface layer */
background: #162032 (navy-800)

/* Elevated surface */
background: #1E293B (navy-700)

/* Interactive surface */
background: #334e68 (navy-700)
```

### Text Hierarchy in Dark Mode

```css
/* Primary text */
color: #F1F5F9 (slate-100)

/* Secondary text */
color: #CBD5E1 (slate-300)

/* Tertiary/muted text */
color: #94A3B8 (slate-400)

/* Disabled text */
color: #64748B (slate-500)
```

### Shadows in Dark Mode

```css
/* Subtle shadow */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);

/* Medium shadow */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);

/* Large shadow */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

/* Glow effect */
box-shadow: 0 0 20px rgba(215, 187, 145, 0.3);
```

### Borders in Dark Mode

```css
/* Default border */
border: 1px solid #1E293B (navy-700)

/* Emphasized border */
border: 1px solid #334155 (slate-700)

/* Accent border */
border: 1px solid rgba(215, 187, 145, 0.3) (gold + transparency)
```

---

## Accessibility

### Color Contrast Ratios

All color combinations meet WCAG 2.1 AA standards:

- **Primary text (#F1F5F9) on navy-950 (#08122E)**: 12.6:1 ✓
- **Gold-600 (#d7bb91) on navy-950 (#08122E)**: 7.2:1 ✓
- **Muted text (#94A3B8) on navy-950 (#08122E)**: 5.1:1 ✓

### Focus States

All interactive elements have visible focus indicators:

```css
:focus-visible {
  outline: 2px solid #d7bb91; /* Gold */
  outline-offset: 2px;
}
```

### Screen Reader Support

- Semantic HTML elements used throughout
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Skip links for keyboard navigation

---

## Best Practices

### Component Usage Guidelines

1. **Use semantic HTML**: `<button>` for buttons, `<nav>` for navigation
2. **Consistent spacing**: Use the spacing scale, avoid arbitrary values
3. **Icon consistency**: Always use Fluent Icons, maintain size consistency
4. **Typography hierarchy**: Follow the type scale for visual hierarchy
5. **Responsive first**: Design for mobile, enhance for desktop
6. **Accessibility**: Always include focus states and ARIA labels

### Performance

- Use CSS variables for dynamic theming
- Optimize images and assets
- Lazy load heavy components
- Use backdrop-filter sparingly (performance impact)
- Minimize animation complexity

---

## Implementation Checklist

- [ ] Import Poppins font from Google Fonts
- [ ] Install @fluentui/react-icons package
- [ ] Configure Tailwind with custom colors
- [ ] Set up CSS variables in globals.css
- [ ] Create reusable component library
- [ ] Implement responsive breakpoints
- [ ] Test color contrast ratios
- [ ] Add focus states to all interactive elements
- [ ] Implement loading states
- [ ] Test on multiple devices and browsers

---

**Document Version**: 2.0
**Last Updated**: 2026-03-11  
**Maintained By**: NEOX Development Team
