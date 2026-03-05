# Dashboard & Analytics - Complete Specification

Version 4.0 | Date: 2026-03-05 | Status: Implemented

---

## Table of Contents

1. [Architecture](#1-architecture)
2. [Design System](#2-design-system)
3. [Shared Chart Components](#3-shared-chart-components)
4. [Dashboard 1 - Energy Monitor](#4-energy-monitor)
5. [Dashboard 2 - Wellbeing Services](#5-wellbeing-services)
6. [Dashboard 3 - Office Building](#6-office-building)
7. [Dashboard 4 - Office Services](#7-office-services)
8. [Dashboard 5 - Office Services Full](#8-office-services-full)
9. [Dashboard 6 - Amenity Services](#9-amenity-services)
10. [Dashboard 7 - Employee Services](#10-employee-services)
11. [Dashboard 8 - Visitor Center](#11-visitor-center)
12. [Dashboard 9 - Parking & Restaurant](#12-parking--restaurant)
13. [Dashboard 10 - Occupancy Services](#13-occupancy-services)

---

## 1. Architecture

### Route & Entry Point

- **Route:** `/dashboard`
- **Page file:** `src/app/dashboard/page.tsx`
- **Authentication:** Requires `sessionStorage.isAuthenticated === 'true'`; redirects to `/login` otherwise.

### Page Layout Structure

```
+------------------------------------------------------------------+
| Top Navigation Bar (70px)                                        |
| [<- Back] [NEOX Logo] | Dashboard & Analytics  [Tenant] [User]  |
+----------+-------------------------------------------------------+
| Sidebar  | Main Content Area (scrollable)                        |
| (220px)  |   Active dashboard component renders here             |
| collaps- |                                                       |
| ible to  |                                                       |
| 60px     |                                                       |
+----------+-------------------------------------------------------+
```

### Top Navigation Bar

- Height: 70px
- Background: `#162032`
- Border bottom: `1px solid #1E293B`
- Left: Back button (arrow), NEOX Logo, divider, "Dashboard & Analytics" title
- Right: Tenant selector dropdown (all active tenants), User avatar badge with username

### Sidebar

- Width: 220px expanded, 60px collapsed
- Background: `#0B1426`
- Border right: `1px solid #1E293B`
- Collapse toggle button at top
- Navigation items with icon, label, active state highlight
- Tenant info panel at bottom (expanded only)

### Sidebar Navigation Items (in order)

| # | ID                  | Label                 | Icon | Color    |
|---|---------------------|-----------------------|------|----------|
| 1 | `sustainability`    | Energy Monitor        | `▨`  | #10B981  |
| 2 | `wellbeing`         | Wellbeing             | `▩`  | #06B6D4  |
| 3 | `officeBuilding`    | Office Building       | `◈`  | #3B82F6  |
| 4 | `officeServices`    | Office Services       | `◇`  | #D4A847  |
| 5 | `officeServicesFull`| Office Services Full  | `▧`  | #D4A847  |
| 6 | `amenityServices`   | Amenity Services      | `▣`  | #D4A847  |
| 7 | `employeeServices`  | Employee Services     | `◫`  | #64748B  |
| 8 | `visitorCenter`     | Visitor Center        | `▤`  | #D4A847  |
| 9 | `parkingRestaurant` | Parking & Restaurant  | `▥`  | #8B5CF6  |
|10 | `occupancyServices` | Occupancy Services    | `▦`  | #3B82F6  |

### Default Active Dashboard

`sustainability` (Energy Monitor) is the default on page load.

### Data Flow Pattern

1. `GlobalStateContext` provides all app data (tenants, buildings, invitations, parking, lockers, badges, spaces, tickets).
2. `DashboardPage` filters data by `selectedTenant` to produce tenant-scoped subsets.
3. Each dashboard component receives its relevant filtered props.
4. Dashboards with no external data dependency (e.g., Energy Monitor, Amenity Services) use hardcoded demo data.
5. Dashboards with props use real data when available, falling back to hardcoded demo values.

### File Map

| File | Purpose |
|------|---------|
| `src/app/dashboard/page.tsx` | Page shell, sidebar, routing |
| `src/components/charts/DashboardCharts.tsx` | Shared chart library & design tokens |
| `src/components/dashboards/Dashboard1OfficeServices.tsx` | Office Services |
| `src/components/dashboards/Dashboard2OfficeBuilding.tsx` | Office Building |
| `src/components/dashboards/Dashboard3AmenityServices.tsx` | Amenity Services |
| `src/components/dashboards/Dashboard4EmployeeServices.tsx` | Employee Services |
| `src/components/dashboards/Dashboard5VisitorCenter.tsx` | Visitor Center |
| `src/components/dashboards/Dashboard6ParkingRestaurant.tsx` | Parking & Restaurant |
| `src/components/dashboards/Dashboard7OccupancyServices.tsx` | Occupancy Services |
| `src/components/dashboards/Dashboard8OfficeServicesFull.tsx` | Office Services Full |
| `src/components/dashboards/Dashboard9Sustainability.tsx` | Energy Monitor |
| `src/components/dashboards/Dashboard10Wellbeing.tsx` | Wellbeing Services |

---

## 2. Design System

### DASH Color Tokens

All dashboard components import the `DASH` object from `DashboardCharts.tsx`:

| Token          | Value     | Usage                              |
|----------------|-----------|------------------------------------|
| `pageBg`       | `#08122E` | Page background                    |
| `cardBg`       | `#0F1A2E` | Primary card background            |
| `cardBg2`      | `#162032` | Secondary/nested card background   |
| `cardBorder`   | `#1E3A5F` | Primary card border                |
| `cardBorder2`  | `#1E293B` | Secondary card border              |
| `text`         | `#F1F5F9` | Primary text                       |
| `textWhite`    | `#FFFFFF` | Emphasis/value text                |
| `label`        | `#94A3B8` | Label/secondary text               |
| `muted`        | `#64748B` | Muted/tertiary text                |
| `gold`         | `#C9963B` | Brand accent, bars, icons          |
| `goldLight`    | `#D4A847` | Light gold variant                 |
| `barWhite`     | `#E2E8F0` | Comparison bar color               |
| `barMuted`     | `#334155` | Bar background track               |
| `trendUp`      | `#3B82F6` | Upward trend indicator (blue)      |
| `trendDown`    | `#EF4444` | Downward trend indicator (red)     |
| `trendNeutral` | `#D4A847` | Neutral trend indicator (gold)     |
| `green`        | `#10B981` | Positive/excellent status          |
| `purple`       | `#8B5CF6` | Chart accent                       |
| `cyan`         | `#06B6D4` | Chart accent                       |
| `pink`         | `#EC4899` | Chart accent                       |
| `orange`       | `#F97316` | Warning/outdoor status             |
| `red`          | `#EF4444` | Negative/alert                     |
| `blue`         | `#3B82F6` | Chart accent                       |
| `lineToday`    | `#C9963B` | "Today" line in line charts        |
| `linePrediction`| `#475569`| "Prediction" line (dashed)         |
| `lineAverage`  | `#3B82F6` | "Average" line (dashed, blue)      |

### Card Styling

- **CardPanel:** bg `cardBg`, border `1px solid cardBorder`, border-radius `16px`, padding `24px`
- **KPICard:** bg `cardBg`, border `1px solid cardBorder`, border-radius `12px`, padding `16px 20px`
- **Nested cards:** bg `cardBg2`, border `1px solid cardBorder2`, border-radius `12px`

### Typography

- Font family: `Inter, system-ui, sans-serif`
- Page title: 28-38px, weight 800
- Section header: 20-22px, weight 700-800
- KPI value: 22-28px, weight 800, color `textWhite`
- KPI label: 12-13px, weight 400, color `label`
- KPI description: 11-12px, color `muted`

### Trend Indicators

- `TrendArrow` component renders colored arrows: `↑` (blue), `↓` (red), `↕` (gold)
- Default size: 14px; configurable via `size` prop

### Filter Controls

- **MonthSelector:** Pill-shaped dropdown, bg `cardBg`, border `cardBorder`, border-radius `20px`, options Jan 2025 through Mar 2026
- **FilterDropdown:** Same styling with a label placeholder
- **FilterPill:** Static display pill (non-interactive in some dashboards)

---

## 3. Shared Chart Components

All exported from `src/components/charts/DashboardCharts.tsx`.

### Layout Components

| Component | Props | Description |
|-----------|-------|-------------|
| `CardPanel` | `children`, `style?` | Rounded card container with standard bg/border |
| `SectionHeader` | `title`, `children?` | Flex row: title left, optional controls right |
| `DashboardHeader` | `title`, `children?` | Page-level header with NEOX chart icon and title |
| `MonthSelector` | `value`, `onChange` | Pill-shaped month dropdown (Jan 2025 - Mar 2026) |
| `FilterDropdown` | `label`, `value`, `options[]`, `onChange` | Pill-shaped filter with label placeholder |

### KPI Components

| Component | Props | Description |
|-----------|-------|-------------|
| `TrendArrow` | `direction: 'up'\|'down'\|'neutral'`, `size?` | Colored directional arrow |
| `KPICard` | `value`, `label`, `trend?`, `icon?`, `unit?`, `description?`, `style?` | Standalone KPI card |
| `SmallKPI` | `value`, `label`, `trend?`, `unit?` | Compact centered KPI for inline use |

### Chart Components

| Component | Props | Description |
|-----------|-------|-------------|
| `GoldBarChart` | `data[]`, `width?`, `height?`, `barColor?`, `showValues?`, `comparisonData?` | Vertical bar chart; supports paired comparison bars |
| `ComboBarLineChart` | `data[]`, `width?`, `height?`, `showValues?` | Gold bars with white average line overlay |
| `HorizontalBarChart` | `data[]`, `width?`, `height?`, `barColor?`, `maxValue?`, `showTrend?` | Horizontal bars with labels and optional trend arrows |
| `StackedHorizontalBarChart` | `data[]`, `colors[]`, `labels[]`, `width?`, `total?`, `showTotal?` | Stacked horizontal bars with legend |
| `PieChart` | `segments[]`, `size?`, `donut?` | Pie or donut chart from segment array |
| `LineChart` | `series[]`, `xLabels[]`, `width?`, `height?`, `yMax?`, `yTicks?` | Multi-series line chart with grid, supports dashed/dotted styles |
| `GaugeChart` | `value`, `max?`, `label`, `size?`, `color?`, `sublabel?` | Semi-circle gauge (0-100%+) |
| `AreaChart` | `series[]`, `xLabels[]`, `width?`, `height?`, `yMax?` | Filled area chart |
| `StackedGroupedBarChart` | `data[]`, `colors[]`, `legendLabels[]`, `width?`, `height?` | Grouped stacked vertical bars |
| `FloorHeatmap` | `floors[]`, `width?`, `height?` | Building outline with per-floor occupancy shading |

---

## 4. Energy Monitor

- **File:** `Dashboard9Sustainability.tsx`
- **Sidebar:** "Energy Monitor" | `▨` | `#10B981`
- **Props:** none (all data hardcoded)
- **Title:** "Energy Monitor" (36px, weight 800)

### Section 1: Energy Consumption

- **Header:** "Energy consumption"
- **Filters:** "Filter to tenant" pill, "Filter to level" pill, "February 2025" pill
- **Card:** "Electricity" sub-card inside CardPanel

| KPI | Value | Unit | Trend | Label | Description |
|-----|-------|------|-------|-------|-------------|
| Bolt icon | 2783,98 | MWh | up | Electricity consumed | - |
| Generator icon | 18,98 | MWh | down | Electricity generated | - |
| % icon | 8,98 | % | up | Self-sufficiency | Calculated from generated and consumed electricity |

Layout: 3 KPIs in a horizontal flex row separated by vertical dividers.

### Section 2: Facility

- **Header:** "Facility" (no filters)
- **Layout:** 3-column grid: left metrics, right metrics (mirror), Heating & Cooling donut

**Left & Right columns (identical):**

| Icon | Value | Unit | Trend | Label |
|------|-------|------|-------|-------|
| Water drop | 8,58 | m3 | down | Rain water consumption |
| Water drop | 6,45 | m3 | up | Grey water consumption |
| Water drop | 18,98 | m3 | down | Communal water consumption |
| Gas flame | 16,2 | m3 | up | Avg. gas used / day |
| Light bulb | 10 | h | down | Avg. lighting used / day |

**Heating & Cooling (right panel):**

- Title: "Heating & Cooling"
- Total: 290,38 MWh (trend down)
- PieChart (4 segments, size 140, non-donut):

| Segment | Value | Color | Trend |
|---------|-------|-------|-------|
| District heating green | 22,1 MWh | #4CAF82 | up |
| District heating | 103 MWh | #8B6914 | up |
| Heat pumps | 208,2 MWh | #C9963B | down |
| Heat pumps green | 52,3 MWh | #2D7A5A | down |

Labels positioned left/right of pie in a 3-column grid layout.

### Section 3: Waste Management

- **Header:** "Waste management"
- **Filters:** "Filter to tenant" pill, "February 2025" pill
- **Sub-header:** "Cleaning by levels" | "compared to last period" | Total: **6 220**
- **Chart:** StackedHorizontalBarChart (width 700, total scale 250)

| Level | Glass | Paper | Aluminum | Plastic | Communal | Total | Trend |
|-------|-------|-------|----------|---------|----------|-------|-------|
| Level 01 | 49 | 51 | 48 | 50 | 51 | 231 | up |
| Level 02 | 36 | 41 | 42 | 55 | 136 | 225 | down |
| Level 03 | 25 | 26 | 29 | 48 | 142 | 221 | down |
| Level 04 | 24 | 25 | 28 | 46 | 151 | 232 | up |
| Level 05 | 38 | 39 | 48 | 56 | 132 | 222 | down |
| Level 06 | 39 | 41 | 41 | 57 | 129 | 222 | down |
| Level 07 | 25 | 25 | 26 | 46 | 154 | 229 | up |
| Level 08 | 30 | 31 | 30 | 48 | 138 | 233 | down |

**Segment colors:** Glass `#7CB9C8`, Paper `#4CAF82`, Aluminum `#E05252`, Plastic `#C9963B`, Communal `#1E3A5F`

### Section 4: CO2 Emission

- **Header:** "CO2 emission"
- **Filters:** "Filter to tenant" pill, "February 2025" pill
- **Content:** Placeholder card (min-height 180px, centered text)
- **Text:** "ponosan milyen adatokat es hogyan kene vizualizalni?" / "1 fa = 21kg CO2"

---

## 5. Wellbeing Services

- **File:** `Dashboard10Wellbeing.tsx`
- **Sidebar:** "Wellbeing" | `▩` | `#06B6D4`
- **Props:** `invitations: Invitation[]`
- **Title:** "Wellbeing services" (32px, weight 800)
- **State:** `indoorMonth`, `liveTraffic` toggle

### Section 1: Indoor Climate (left half of 2-column grid)

- **Card title:** "Indoor climate"
- **Filter:** MonthSelector (right of title)

**Main temperature display:**
- Thermometer icon (green) + **20,5** °C (56px, weight 900)
- Badge: "Excellent" (green border, green bg 22% opacity)
- Subtitle: "Indoor air quality"

**Status indicators (3 across):**

| Icon | Label | Sublabel | Active |
|------|-------|----------|--------|
| Cloud (green) | Excellent | Light breeze | Yes (green border) |
| Sun (gold) | Good | Humidity | No |
| Moon (blue) | Quiet | Noise level | No |

**Climate metrics (stacked):**

| Icon | Value | Unit | Trend | Label | Description |
|------|-------|------|-------|-------|-------------|
| Speaker | 21 | dB | down | Avg. noise in the office | - |
| Wind | 1,3 | - | down | AQI (Air Quality Index) | Air quality index based on monitoring... |
| Flask | 4,2 | mg/m3 | down | TVOC | Total volatile organic compound... |
| Microscope | 659 | micromol mol-1 | down | Carbon Dioxide (CO2) level | Carbon dioxide concentration... |
| Wind | 9 | ug/m3 | down | PM2.5 level | - |

### Section 2: Outdoor Climate (right half of 2-column grid)

- **Card title:** "Outdoor climate"

**Main temperature display:**
- Sun icon (orange) + **29,5** °C (56px, weight 900)
- Badge: "Fair" (orange border, orange bg 22% opacity)
- Subtitle: "Outdoor air quality"

**Status indicators (3 across):**

| Icon | Label | Sublabel |
|------|-------|----------|
| Sun (green) | Good | Temperature |
| Cloud (red) | Poor | Air quality |
| Speaker | Loud | Noise level |

**Climate metrics (stacked):**

| Icon | Value | Unit | Trend | Label |
|------|-------|------|-------|-------|
| Speaker | 52 | dB | down | Avg. noise in the office |
| Wind | 5,7 | - | up | AQI |
| Flask | 9,2 | mg/m3 | down | TVOC |
| Microscope | 1048 | micromol mol-1 | down | CO2 level |
| Wind | 18 | ug/m3 | up | PM2.5 level |

### Section 3: Traffic Around the Building

- **Title:** "Traffic around the building"
- **Content:** SVG map placeholder (760x240) with grid lines, road paths, building blocks, green areas, pin marker
- **Toggle:** "Live Traffic" button (top-right, toggles orange/red route highlights)

### Section 4: Outdoor Weather Prediction

- **Title:** "Outdoor weather prediction"
- **Date range badge:** "15-22. February 2025"
- **Layout:** 7 DayWeatherCard components in a flex row

| Day | Icon | Temp (C) | Pollen | Level |
|-----|------|----------|--------|-------|
| Mon | Sun | 19.1 | Moderate | Moderate |
| Tue | Cloud | 15.3 | Moderate | Moderate |
| Wed | CloudSun | 20.1 | Moderate | Moderate |
| Thu | Rain | 19.6 | High | High |
| Fri | CloudSun | 19.2 | Moderate | Moderate |
| Sat | Sun | 23.6 | Moderate | Moderate |
| Sun | Sun (light) | 22.4 | Low | Low |

Pollen colors: Low = green, Moderate = orange, High = red.

### Section 5: Occupancy Prediction Based on Outdoor Weather

- **Title:** "Occupancy prediction based on outdoor weather"
- **Date range badge:** "15-22. February 2025"
- **Chart:** LineChart (width 820, height 300, yMax 2500, yTicks 5)

| Series | Color | Style | Base data |
|--------|-------|-------|-----------|
| Today | `lineToday` (gold) | solid | [320, 680, 1100, 1580, 1920, 2180, 2300, 2020] |
| Prediction | `linePrediction` | dotted | [350, 700, 1150, 1600, 1960, 2200, 2320, 2060] |
| Visitors today | `orange` | solid | scaled by invitation count |
| Visitors prediction | `label` (gray) | dashed | scaled by invitation count |

X-labels: `['15.02', '16.02', '17.02', '18.02', '19.02', '20.02', '21.02', '22.02']`

---

## 6. Office Building

- **File:** `Dashboard2OfficeBuilding.tsx`
- **Sidebar:** "Office Building" | `◈` | `#3B82F6`
- **Props:** `buildings: Building[]`
- **Title:** "Office building" (32px, weight 900)
- **Filter:** MonthSelector (top-right)
- **State:** `month`

### Section 1: Electricity

- **Layout:** CardPanel with 3-column grid of KPIBlock cards

| Icon | Value | Unit | Trend | Label | Description |
|------|-------|------|-------|-------|-------------|
| Bolt | 2783,98 | MWh | up | Electricity consumed | - |
| Solar panel | 18,98 | MWh | down | Electricity generated | - |
| Lightning | 8,98 | % | up | Self-sufficiency | Calculated from generated and consumed electricity |

### Section 2: Indoor Climate

- **Title:** "Indoor climate" (outside card, as section title)
- **Layout:** 2x2 grid of KPIBlock cards

| Icon | Value | Unit | Trend | Label | Description |
|------|-------|------|-------|-------|-------------|
| Thermometer | 23 | C | up | Avg. office temperature | Office temperature can range between 18C and 24C. |
| Sound | 21 | dB | up | Avg. noise in the office | An ideal office environment has about 50 dB noise. |
| Chemistry | 4,2 | mg/m3 | down | TVOC | Indicates level of VOCs present... |
| Air waves | 1,3 | - | down | AQI | Measures quality of indoor air... |

### Section 3: Facility

- **Layout:** CardPanel with flex row: left column (stacked KPIs) + right section (Heating & Cooling)

**Left column KPIs:**

| Icon | Value | Unit | Trend | Label |
|------|-------|------|-------|-------|
| Water drop | 18,98 | m3 | down | Water consumption |
| Lightbulb | 10 | h | down | Avg. lighting used / day |

**Right section - Heating & Cooling:**
- Title: "Heating & Cooling"
- Total: 290,38 MWh (trend down)
- Custom donut chart (size 260, outer radius 110, inner radius 62):
  - District heating: 103 MWh (gold), trend up
  - Heat pumps: 208,32 MWh (#C8D8E8 cream), trend down

---

## 7. Office Services

- **File:** `Dashboard1OfficeServices.tsx`
- **Sidebar:** "Office Services" | `◇` | `#D4A847`
- **Props:** `tickets: Ticket[]`
- **Title:** "Office services" (32px, weight 800)
- **Filter:** MonthSelector
- **State:** `month`

### Section 1: Issue Handling

**Layout:** 2-column grid (left: KPIs + bar chart, right: totals + pie charts)

**Left column - KPIs (2-across):**

| Icon | Value | Unit | Trend | Label |
|------|-------|------|-------|-------|
| Diamond | 1495 | - | down | New warranty tickets |
| Clock | 45 | mins | up | Avg. resolution time |

**Left column - Resolutions per month:** GoldBarChart with 2 bars:
- Opened tickets: 307 (or live `openTickets`)
- Completed tickets: 1187 (or live `resolvedTickets`)

**Right column - Total new tickets:** 1495 (down) centered header

**Pie chart 1 (Online vs Phone):**

| Segment | Value | Color |
|---------|-------|-------|
| Online | 1418 | gold |
| From phone calls | 76 | white |

**Pie chart 2 (Ticket categories):**

| Segment | Value | Color | Trend |
|---------|-------|-------|-------|
| For business visitor parkings | 79 | gold | down |
| Warranty | 5 | red | down |
| In Campus solutions | 712 | white | up |
| In FM solutions | 782 | gray | down |

### Section 2: Most Frequent Requests

- GoldBarChart (3 bars): Business visitor parking: 966, Example: 1026, Example: 78
- Right panel: "Some reasons for opening these tickets" with sample text

### Section 3: Most Frequent Issues

**Campus solutions sub-section:**
- GoldBarChart: Meeting rooms: 114, Locker: 500, Others: 177
- Reasons text for each category

**Facility Management solutions sub-section:**
- GoldBarChart: Furniture: 107, Electric systems: 122, Heating/AC: 258
- Reasons text for each category

---

## 8. Office Services Full

- **File:** `Dashboard8OfficeServicesFull.tsx`
- **Sidebar:** "Office Services Full" | `▧` | `#D4A847`
- **Props:** `tickets: Ticket[]`
- **Title:** "Office services" (36px, weight 800)
- **State:** `month`, `tenantFilter`, `floorFilter`

This is an expanded version of Dashboard 1 with 9 sections.

### Section 1: Issue Handling

Identical to Dashboard 1 Section 1 but with FilterDropdown for tenant and MonthSelector.

### Section 2: Most Frequent Requests

Same as Dashboard 1 Section 2, full-width bar chart (860px wide).

### Section 3: Most Frequent Issues

Same as Dashboard 1 Section 3, full-width charts.

### Section 4: Ticket Statistics by Company (in/out of SLA)

- **Title:** "Ticket Statistics (in or out of SLA)"
- **Filters:** "Filter to floor" pill, "15.-22. February 2025" pill
- **Sub-header:** "Tickets by company" | "compared to last period" | Total: **7 315**
- **Chart:** StackedHorizontalBarChart (colors: gold = End of SLA, blue = In SLA)

| Company | End of SLA | In SLA | Total | Trend |
|---------|-----------|--------|-------|-------|
| Apex Data Solutions | 165 | 121 | 286 | up |
| Horizon Analytics | 137 | 131 | 268 | up |
| Lumina Insights | 78 | 109 | 187 | down |
| Quantum Metric Corp | 74 | 109 | 183 | down |
| Veridian Dynamics | 41 | 72 | 113 | neutral |
| Starlight Technologies | 79 | 128 | 207 | up |
| SynergyWorks Group | 63 | 87 | 150 | up |
| NovaSphere Industries | 43 | 95 | 138 | down |
| Crimson DataFlow | 39 | 62 | 101 | neutral |
| Willowbrook Consulting | 49 | 176 | 225 | up |

### Section 5: Ticket Statistics by Level (in/out of SLA)

- **Total:** 6 419
- **Labels:** "Opened by System" (gold), "Opened by User" (blue)

| Level | Opened by System | Opened by User | Total | Trend |
|-------|-----------------|----------------|-------|-------|
| Level 01 | 83 | 121 | 204 | up |
| Level 02 | 109 | 169 | 278 | up |
| Level 03 | 16 | 53 | 69 | down |
| Level 04 | 50 | 128 | 178 | up |
| Level 05 | 59 | 105 | 164 | down |
| Level 06 | 43 | 79 | 122 | up |
| Level 07 | 29 | 62 | 91 | down |
| Level 08 | 72 | 188 | 260 | up |

### Section 6: KPI

- **Title:** "KPI"
- **Filters:** "Filter to floor" pill, date pill
- **Content:** 12 bullet-pointed KPI text items (gold bullet, gray text)
- Items cover: lift usage (4,410/day), meeting room occupancy (94%), temperature regulation, parking (88%), locker usage (75%), energy monitoring, electric systems accuracy (99.1%), surface maintenance (97.4%), door accuracy (98.8%), cleaning quality (97.2%)

### Section 7: Frequented Users

- **Title:** "Frequented users"
- **Chart:** LineChart (width 860, height 300, yMax 3500, yTicks 7)
- **Series:** Today (gold, solid) + Prediction (dark gray, dashed)
- **X-labels:** Feb 14 through Feb 22
- **Data today:** [1800, 2600, 3480, 3100, 2700, 2200, 1500, 2400, 2800]
- **Data prediction:** [1600, 2200, 2800, 2500, 2300, 2000, 1800, 2200, 2500]

### Section 8: Arriving and Leaving

- **Title:** "Arriving and leaving"
- **Content:** Placeholder card with Hungarian text
- **Notes:** Arrival 06:00-11:00, Departure 15:00-20:00

### Section 9: Cleaning Statistics

- **Title:** "Cleaning statistics"
- **Sub-header:** "Cleaning by levels" | Total: **6 220**
- **Chart:** StackedHorizontalBarChart (colors: gold = Opened by System, dark = Opened by User)

| Level | Opened by System | Opened by User | Total | Trend |
|-------|-----------------|----------------|-------|-------|
| Level 01 | 620 | 149 | 769 | up |
| Level 02 | 600 | 140 | 740 | up |
| Level 03 | 570 | 150 | 720 | down |
| Level 04 | 610 | 149 | 760 | up |
| Level 05 | 580 | 150 | 730 | down |
| Level 06 | 560 | 170 | 730 | up |
| Level 07 | 620 | 150 | 770 | down |
| Level 08 | 630 | 150 | 780 | up |

---

## 9. Amenity Services

- **File:** `Dashboard3AmenityServices.tsx`
- **Sidebar:** "Amenity Services" | `▣` | `#D4A847`
- **Props:** none (all data hardcoded)
- **Title:** "Amenity services" (via DashboardHeader)
- **Filter:** MonthSelector
- **State:** `month`

### Section 1: Fitness

**KPIs (left column):**
- 1200 (down) - Total number of visitors / month
- 32 (down) - Total number of visitors / day
- TOP 3 services: 1. General, 2. Personal trainer, 3. Group classes

**Group class popularity (right):** HorizontalBarChart (gold, maxValue 30)

| Class | Value |
|-------|-------|
| Body shape | 25 |
| Spine training | 9 |
| Yoga | 8 |
| Yoga & stretching | 8 |
| Circuit training | 10 |
| Cross training | 5 |
| Functional training | 6 |
| Functional circuit | 4 |
| Pilates | 12 |
| Hot Iron | 5 |

**Average fitness traffic:** AreaChart (gold), data [53, 510, 720, 600, 532], x-labels W1-W5

**Average weekly distribution per day:** GoldBarChart: Mon 966, Tue 1026, Wed 78, Thu 33, Fri 33, Sat 33

**Weekly average group class attendance:** StackedGroupedBarChart (Mon-Fri)
- Colors: gold, cyan, green, purple, orange, pink
- Labels: Body shape, Spine training, Yoga, Yoga & stretching, Circuit training, Cross training

### Section 2: Catering

**Meeting row:** Orders: 147 (neutral), Avg basket value: 21,443 Ft (neutral)
**Event row:** Orders: 147 (neutral), Avg basket value: 21,443 Ft

**Canteen:**
- Custom grouped bar chart (Breakfast gold vs Lunch dark blue):

| Day | Breakfast | Lunch |
|-----|-----------|-------|
| Mon | 966 | 1035 |
| Tue | 554 | 1035 |
| Wed | 788 | 688 |
| Thu | 600 | 400 |
| Fri | 289 | 178 |

- Average basket value: 1 443 Ft (down)

**Average breakfast and lunch transaction daily:** AreaChart (gold), data [53, 510, 720, 600], x-labels W1-W4

### Section 3: Shared Service Area

**KPIs:** 1200 (neutral) Total appointments, 70% (neutral) Service desk usage ratio

**Donut chart:** "Ratio of ad-hoc and pre-booked appointments"
- Pre-Booked: 22.43% (gold)
- Ad-hoc: 77.57% (blue)
- Center label: "Appointments / Ad-hoc / Previous month: < 5%"

**Services list:** Lost&Office, Fleet service desk, Space Resources, eCleaning Campus, E-parts, Telecom, Travel & expenses

### Section 4: Beauty

**KPI:** 1200 (up) Total customers

**Average weekly distribution per day:** GoldBarChart: Mon 966, Tue 1026, Wed 76, Thu 33, Fri 33, Sat 33

**Beauty service usage by type:** PieChart (size 200)

| Service | Percentage | Color |
|---------|-----------|-------|
| Hairdresser | 40% | gold |
| Barber | 30% | blue |
| Cosmetician | 20% | cyan |
| Manicure | 10% | green |

### Section 5: Fresh Corner Easy (1st floor)

4-column KPI row:
- 12 345 678 Ft (neutral) - Total sales
- 1 287 (neutral) - Number of sold coffee
- 2 135 Ft (neutral) - Avg. basket value
- 123 111 Ft (up) - Total coffee purchases in the kitchen areas

### Section 6: Fresh Corner Cafe (Groundfloor) + Shuttle Bus

**Fresh Corner Cafe:** 3-column KPIs: 12 345 678 Ft (up), 1 287 (neutral), 2 135 Ft (up)

**Shuttle bus usage:** Morning: 540 (neutral), Afternoon: 670 (neutral)

### Section 7: Peak Place Utilization

3-column cards:

| Place | Percentage | Trend | Detail |
|-------|-----------|-------|--------|
| Morning garden | 14,47% | up | Avg. with 8 people |
| Office | 42,54% | neutral | Avg. with 33 people |
| Evening event | 21,73% | neutral | Avg. with 9 people |

---

## 10. Employee Services

- **File:** `Dashboard4EmployeeServices.tsx`
- **Sidebar:** "Employee Services" | `◫` | `#64748B`
- **Props:** `parkingSpaces: ParkingSpace[]`, `parkingBookings: ParkingBooking[]`, `spaces: Space[]`
- **Title:** "Employee services" (via DashboardHeader)
- **Filter:** MonthSelector
- **State:** `selectedMonth`

### Section 1: Parking

**Left KPI column (stacked):**

| Value | Unit | Trend | Label |
|-------|------|-------|-------|
| 731 | - | up | Total used spots out of 731 spots |
| 5 | h | down | Avg. daily booking |
| 116 | - | down | Avg. daily visitor booking |
| 20 | - | down | Haven't used fix pass < 30 days |
| 12 | - | down | Haven't used fix pass > 30 days |

**Right section - Ratio badges:** 67% (up) Ratio of booked hours, 73% (up) Daily usage ratio

**Vehicle type icons row:** 30 spot for visitors, 665 spots (car), 36 spots (bike)

**Ratio of bookings:** GoldBarChart with comparison bars (gold = Available, white = Used)

| Category | Available | Used |
|----------|-----------|------|
| Fix pass | 308 | 100 |
| Occasional car | 876 | 680 |
| Occasional bike | 80 | 60 |
| Bicycle storage | 80 | 60 |

### Section 2: Meetings Services

- Sub-header: "Average daily meeting room usage ratio in the building from 8:00-17:00"
- Available meeting rooms: 3,567
- Total hours: 5 265 (down) in badge
- LineChart (gold, width 700, height 300, yMax 100): [80, 91, 62, 50, 22] across Mon-Fri

### Section 3: Most/Least Popular Rooms

**Most popular:** 12H. 001.M, 2B. 101.W, 25H. 001.W (gold door icons)
**Least popular:** 12H. 001.M, 2B. 101.W, 25H. 001.W (red door icons, highlighted bg)

### Section 4: Vending Machines

- Total sold items: 1732 (up)
- Total value: 1 234 567 Ft (up)
- TOP 3 sold items: 1. Varta AAA battery, 2. Blue pen, 3. Apple earphones with cable

---

## 11. Visitor Center

- **File:** `Dashboard5VisitorCenter.tsx`
- **Sidebar:** "Visitor Center" | `▤` | `#D4A847`
- **Props:** `invitations: Invitation[]`
- **Title:** "Visitor Center" (32px, weight 800)
- **Filter:** MonthSelector
- **State:** `month`

### Section 1: Visitor Center Card

**Number of visitors by weekdays:** ComboBarLineChart (width 1400, height 340)
- Gold bars = total visitors, white line = average
- Fallback data: Mon 2678, Tue 1112, Wed 1930, Thu 5021, Fri 6672, Sat 7961, Sun 6805

**Number of visitors by time slots:** ComboBarLineChart (width 1400, height 340)
- Time slots: 10:00 through 21:00
- Values: [2678, 1200, 1812, 5116, 6546, 7901, 6881, 1015, 2050, 5321, 6109, 4265]

### Section 2: Bottom Row (2-column)

**SkyDeck App downloads:**
- iOS icon + **455** iOS
- Android icon + **933** Android

**Vending machines:**
- Vending icon + **1 234 567 Ft** (up) Total value of sold items
- TOP 3 sold items: 1. MOL T-shirt, 2. MOL Campus pen, 3. Voucher

---

## 12. Parking & Restaurant

- **File:** `Dashboard6ParkingRestaurant.tsx`
- **Sidebar:** "Parking & Restaurant" | `▥` | `#8B5CF6`
- **Props:** `parkingSpaces: ParkingSpace[]`, `parkingBookings: ParkingBooking[]`
- **Title:** "Employee services" (38px, weight 800)
- **Filters:** FilterDropdown (tenant), MonthSelector
- **State:** `month`, `tenant`, `dateRange`

### Section 1: Parking

**Layout:** CardPanel with 2-column grid (200px left KPIs | 1fr right content)

**Left KPI stack (ParkingKPI cards):**

| Value | Unit | Trend | Label |
|-------|------|-------|-------|
| 731 | - | up | Total used spots out of 731 spots |
| 5 | h | down | Avg. daily booking |
| 116 | - | down | Avg. daily visitor booking |
| 20 | - | down | Haven't used fix pass < 30 days |
| 12 | - | down | Haven't used fix pass > 30 days |

**Right: Ratio badges:** 67% (up), 73% (up)

**Vehicle icon row:** 30 visitors, 665 car spots, 36 bike spots (with SVG vehicle icons)

**Ratio of bookings:** GoldBarChart with comparisonData (gold = Available, white = Used)
- Fix pass: 308/100, Occasional car: 876/680, Occasional bike: 80/60, Bicycle storage: 80/60

### Section 2: Restaurant Occupancy

- **Title:** "Restaurant ocupency" (note: original spelling)
- **Filter:** Date range selector ("15.-22. February 2025")
- **Chart:** Custom RestaurantLineChart (700x320)
  - Y-axis: 0-500
  - X-labels: Feb. 14. through Feb. 20.
  - **Today line:** gold solid, data [240, 430, 470, null, null, null, null] with large endpoint dot
  - **Prediction line:** dark dashed, data [350, 400, 480, 460, 430, 370, 340]
  - **Average line:** blue dashed, data [215, 280, 300, 310, 295, 285, 290]
  - Legend: Today (gold dot), Prediction (dark dashed), Average (blue dashed)

---

## 13. Occupancy Services

- **File:** `Dashboard7OccupancyServices.tsx`
- **Sidebar:** "Occupancy Services" | `▦` | `#3B82F6`
- **Props:** `invitations: Invitation[]`, `parkingSpaces: ParkingSpace[]`, `badgeSwipes: BadgeSwipe[]`
- **Title:** "Occupancy services" (36px, weight 800)

### Section 1: Visitor Management

- **Filters:** PillSelect (floor), MonthSelector
- **Sub-header:** "Visitors by company" | "compared to last period" | Total: **1 015**
- **Chart:** HorizontalBarChart (gold, width 580)

| Company | Value | Trend |
|---------|-------|-------|
| Apex Data Solutions | 169 | down |
| Horizon Analytics | 121 | neutral |
| Lumina Insights | 53 | neutral |
| Quantum Metric Corp | 105 | down |
| Veridian Dynamics | 72 | down |
| Starlight Technologies | 128 | neutral |
| SynergyWorks Group | 34 | neutral |
| Crimson DataFlow | 62 | down |
| Willowbrook Consulting | 176 | neutral |
| NovaSphere Industries | 95 | neutral |

### Section 2: Parking Management

- **Filters:** PillSelect (company), MonthSelector
- **Sub-header:** "Parked cars by levels" | Total: **9 615** (derived)
- **Chart:** HorizontalBarChart (cyan, width 580, maxValue 4000)

| Level | Value | Trend |
|-------|-------|-------|
| Level -1 | 3426 | down |
| Level -2 | 2267 | down |
| Level -3 | 2946 | neutral |
| Level -4 | 2052 | neutral |

### Section 3: Access Management

- **Filters:** PillSelect (floor), date range pill "15-22. February 2025"
- **Sub-header:** "Visitors by company" | Total: **21 421** (derived)
- **Chart:** StackedHorizontalBarChart (width 620, total scale 900)
- **Segment colors:** gold = Physical badge, `#1E3A5F` = Digital badge, red = Watch badge

| Company | Physical | Digital | Watch | Total | Trend |
|---------|----------|---------|-------|-------|-------|
| Apex Data Solutions | 76 | 381 | 329 | 786 | up |
| Horizon Analytics | 41 | 284 | 206 | 531 | up |
| Lumina Insights | 68 | 101 | 498 | 667 | up |
| Quantum Metric Corp | 89 | 381 | 171 | 641 | up |
| Veridian Dynamics | 76 | 271 | 439 | 786 | up |
| Starlight Technologies | 79 | 331 | 376 | 786 | up |
| SynergyWorks Group | 79 | 284 | 124 | 487 | up |
| Crimson DataFlow | 91 | 318 | 72 | 481 | up |
| Willowbrook Consulting | 48 | 221 | 112 | 381 | up |

### Section 4: Workplace Utilization

- **Filters:** PillSelect (tenant), MonthSelector

**Floor Heatmap** (FloorHeatmap, width 180, height 480):
31 floors from Groundfloor (82%) through 29th (12%), color-coded by occupancy threshold (>25% = gold, <=25% = blue).

**Center metrics:**
- Average floor occupancy: **45** (+10%)
- Peak floor occupancy: **93** (-20%)

**Right KPI cards:**
- HSE Capacity: **1036** (up)
- Avg. daily entrance: **1373** (up)

**Gauge row (3 across):**

| Gauge | Value | Label | Sublabel |
|-------|-------|-------|----------|
| 1 | 126% | Allocation | - |
| 2 | 30% | Utilization | - |
| 3 | 56% | Peak utilization | 56,47% |

**Daily average people & peak estimate by date:** Custom grouped bar chart (3 bars per month)
- Colors: orange = Weekly avg., gold = Weekly max., red = Weekly peak check-in

| Month | Weekly Avg | Weekly Max | Weekly Peak |
|-------|-----------|-----------|-------------|
| August | 2300 | 2156 | 400 |
| September | 1900 | 2000 | 423 |
| October | 1411 | 1768 | 342 |
| November | 1002 | 1578 | 456 |
| December | 412 | 534 | 303 |

---

## Appendix: Figma Screenshot Reference

| Dashboard | Screenshot File |
|-----------|----------------|
| Office Services | `DashBoards/DashBoard1.png` |
| Office Building | `DashBoards/DashBoard2.png` |
| Amenity Services | `DashBoards/DashBoard3.png` |
| Employee Services | `DashBoards/DashBoard4.png` |
| Visitor Center | `DashBoards/DashBoard5.png` |
| Parking & Restaurant | `DashBoards/DashBoard6.png` |
| Occupancy Services | `DashBoards/DashBoard7.png` |
| Office Services Full | `DashBoards/DashBoard8.png` |
| Energy Monitor | `DashBoards/DashBoard9.png` |
| Wellbeing Services | `DashBoards/DashBoard10.png` |
