# NEOX Infinity - Multi-Tenant Admin Platform

A comprehensive, multi-tenant administrative platform for building and facility management built with Next.js 15, TypeScript, and React Context. Features role-based access control, white-labeling, Integration Studio for third-party systems, operational dashboards with interactive 3D building model and floorplan zone visualization, and complete visitor/event/space management.

**Live Demo:** Deployed on Vercel

## Features

### Global Admin (NEOX Admin) - 19 Modules
- **Dashboard** - Global overview with tenant statistics and operational dashboard (blue/neutral theme) showing integrated systems status
- **Tasks** - Approval workflow with pending/processed task management
- **Tenants** - Multi-tenant CRUD with context-aware tenant views
- **User Management** - User profiles, roles, bulk CSV upload with template download
- **Modules** - Module and profile configuration per tenant
- **Digital Badges** - NFC badge creation, assignment, and tracking with IMEI management
- **White Label Settings** - Custom branding (logo, colors with gradients, fonts) per tenant
- **Policies** - Global policy file management (GDPR, T&C, Passwords, Installation Guide)
- **Parking Management** - Space grid with types (EV, disabled, VIP), booking, hover-to-release, Free/Assigned/Occupied RAG status (green/amber/red) per box and summary cards, permanent/temporary assignment with date pickers
- **Locker Management** - 5 locker types (permanent, gym, bike, temporary, storage) with zone management, Free/Assigned/Occupied RAG status, permanent/temporary assignment toggle
- **Space Management** - Desks, offices, meeting rooms, conference rooms, social hubs, Free/Assigned/Occupied RAG status, permanent/temporary assignment toggle
- **Building Management** - Buildings, floors, zones, basement levels configuration
- **Visitor Check-in** - QR code and manual check-in/check-out with duration tracking
- **Visitor Management** - Invitation workflow with start/end date+time range, parking/WiFi/locker access requests
- **Event Management** - Event scheduling, participant management, RSVP, CSV upload with templates
- **Ticket Management** - Support tickets with priority, assignment, and status tracking
- **Notifications** - System notifications and alerts
- **System Status** - System health monitoring
- **Audit Logs** - Comprehensive activity logging

### Tenant Admin - 15 Modules
- **Dashboard** - Tenant-specific metrics with operational dashboard (blue/neutral theme, integrated systems status)
- **Tasks** - Tenant-scoped approval tasks
- **Analytics** - Date-filtered analytics dashboard
- **User Management** - Tenant user CRUD with bulk CSV upload
- **Visitor Management** - Visitor invitations with start/end date+time range, Outlook-style calendar views (day/week/month) with grouped visitors (+N badge and hover tooltip)
- **Event Management** - Events with Outlook-style calendar views and CSV participant upload
- **Parking** - Space grid with assign/release on hover, Free/Assigned/Occupied RAG status, permanent/temporary assignment
- **Lockers** - Locker assignment with hover-to-release, Free/Assigned/Occupied RAG status, permanent/temporary assignment
- **Spaces** - Space/desk booking with release functionality, Free/Assigned/Occupied RAG status, permanent/temporary assignment
- **Building Config** - Building and floor configuration
- **Digital Badges** - Badge assignment and tracking
- **Templates** - Rich WYSIWYG email template editor (fonts, colors, images, hyperlinks)
- **Policies** - Tenant policy management with global fallback (tenant version > global version)
- **Modules** - Module availability configuration
- **Support** - Help and support section

### Integration Studio - 16 Modules
Complete third-party integration platform at `/integration-studio` with tenant selector in top bar:
- **Dashboard** - Domain health cards across 13 canonical domains
- **External Systems** - 38 vendor systems (Siemens, Honeywell, HikVision, etc.) with per-env API credentials
- **Canonical APIs** - 13 domain API catalogs with operations, methods, paths
- **Connectors** - Connector management with coverage %, health badges
- **Connector Builder** - Multi-step wizard for creating new connectors
- **Mapping Designer** - Split-pane canonical-to-vendor schema mapping
- **Flows** - Multi-step flow orchestration with compensation steps
- **Events & Sync** - Webhook subscriptions and polling jobs
- **Testing** - Test console with dry-run/live toggle
- **Health & Logs** - Connector health monitoring with correlation IDs
- **Incidents** - Incident tracking with severity S1-S4
- **Issue Reporting** - Taxonomy tree and routing rules
- **Identity** - SSO providers, directory sync, role mapping
- **Templates** - Pre-built connector templates per domain

### Dashboard & Analytics - 11 Dashboards
Full analytics suite at `/dashboard` with mobile responsive layout (sidebar hidden on mobile, top bar wraps):
1. Operational Overview - Redesigned with blue/neutral theme (no gold), integrated systems status, CO2 emissions panel
2. Occupancy Services - Interactive 3D building model (Three.js, Shaded/Ghost modes) with RAG floor highlighting, floorplan with heatmap blob overlays, HSE capacity/occupancy panels, workplace utilization gauges (Allocation/Current/Peak), access by department breakdown, date range filter (Today/This Week/This Month/Custom), "All Floors" reset button
3. Energy Monitor - Energy consumption, waste, CO2 emissions panel
4. Wellbeing Services - Climate, Google Maps traffic embed (Arboc utca, Budapest, dark mode, Live Traffic toggle), weather, occupancy prediction
5. Office Building - Electricity, climate, heating/cooling
6. Office Services - Issue handling, ticket resolution, frequent requests
7. Caffe Services - Fitness, catering (renamed from Amenity Services), shuttle, peak utilization
8. Employee Services - Parking, meetings, vending
9. Visitor Services - Visitor counts, app downloads, vending (renamed from Visitor Center)
10. Parking Services - Parking metrics, restaurant occupancy (renamed from Parking & Restaurant)
11. Office Services Full - SLA statistics, KPIs, cleaning stats

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: React Context (GlobalStateContext) with localStorage persistence
- **Icons**: Fluent UI React Icons (`@fluentui/react-icons`)
- **Charts**: Custom pure SVG chart library (9 chart types, no external dependencies)
- **3D Rendering**: Three.js with @react-three/fiber and @react-three/drei for interactive building model
- **Maps**: Google Maps Embed API for live traffic visualization
- **Styling**: Inline styles with dark navy design system
- **Deployment**: Vercel
- **Rich Text**: Native contentEditable + document.execCommand WYSIWYG editor

## Design System

- **Primary Colors**: Navy (#08122E) and Gold (#D7BB91)
- **Dashboard Theme**: Dark navy (#08122E, #0F1A2E, #162032, #1E293B) with blue/neutral accents (Operational Overview) and gold accents (#C9963B) for analytics dashboards
- **Typography**: Poppins font family
- **Text Colors**: #F1F5F9 (primary), #94A3B8 (secondary), #64748B (muted)
- **Components**: Rounded corners (8-16px), soft shadows, gradient backgrounds
- **Icons**: Fluent UI React Icons exclusively (no emojis, no Lucide)
- **Responsive**: Mobile-first with breakpoints at 640px, 768px, 1024px, 1280px

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
git clone <repository-url>
cd neoxadminui
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build

```bash
npm run build
npm run start
```

### Deploy to Vercel

```bash
npx vercel --prod
```

## Project Structure

```
src/
  app/
    page.tsx                    # Home page with tenant cards
    admin/page.tsx              # Global admin (19 sidebar sections)
    tenant/page.tsx             # Tenant admin (15 sidebar sections)
    dashboard/page.tsx          # Dashboard & Analytics (11 dashboards)
    integration-studio/page.tsx # Integration Studio (16 modules)
    energy/page.tsx             # Energy management
    api-docs/page.tsx           # API documentation
  components/
    VisitorManagement.tsx       # Visitor invitation management (date range, calendar grouping)
    EventManagement.tsx         # Event & participant management
    VisitorDashboard.tsx        # Visitor dashboard panel
    ParkingDashboard.tsx        # Parking dashboard panel
    LockerDashboard.tsx         # Locker dashboard panel
    BadgesDashboard.tsx         # Digital badges dashboard panel
    SpaceBookingDashboard.tsx   # Space booking dashboard panel
    SmartSpacesDashboard.tsx    # Smart spaces operations
    DashboardFilters.tsx        # Date range filtering
    ColorPicker.tsx             # Color picker with gradient support
    FontFamilySelector.tsx      # Font selection component
    charts/
      DashboardCharts.tsx       # Shared SVG chart library (9 types)
    dashboards/
      BuildingModel3D.tsx       # Three.js interactive 3D building with Shaded/Ghost modes
      FloorplanWithZones.tsx    # Floorplan with heatmap blob overlays and mask clipping
      Dashboard0OperationalOverview.tsx  # Operational Overview (blue/neutral)
      Dashboard1-10*.tsx        # 10 analytics dashboards
    integration-studio/
      IS*.tsx                   # 16 Integration Studio modules
  context/
    GlobalStateContext.tsx       # Global state with 29+ interfaces
public/
  models/                       # 3D building model assets
  floorplans/                   # Floor plan images and mask files
```

## Key Data Models

- **User** - Name, email, role, department, status, profile, tenant
- **Tenant** - Organization, domain, modules, contact, status
- **Invitation** - Visitor invitations with access codes, parking/WiFi/locker
- **EventInvitation** - Events with participant management
- **ParkingSpace** - Types (EV, disabled, VIP), building, status
- **Locker** - Types (permanent, gym, bike, temporary, storage)
- **Space** - Types (desk, office, meeting-room, conference-room, social-hub)
- **Building** - Floors, zones, basement levels
- **Ticket** - Priority, category, assignment, comments
- **Badge** - Card type, IMEI, status tracking
- **ExternalSystem** - 38 vendor systems across 13 domains
- **IntegrationConnector** - Health, coverage, environment versions
- **OperationalMessage** - System alerts (info/warning/error/critical)
- **PolicyFile** - Global and tenant-level policy documents
- **WhiteLabelSettings** - Branding with colors, fonts, logo

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Support

For questions or support, contact: admin@neox.hu

---

**Built by the NEOX Team**
