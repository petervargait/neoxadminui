# NEOX Infinity App - Modules 5-17 Complete Specifications

**Version**: 4.0
**Last Updated**: 2026-03-11
**Modules**: Visitor Management, Parking, Spaces, Badges, Lockers, Tenants, Buildings, Reports, Notifications, Integration Studio, Event Management, Security, Mobile, Testing
**Status**: All core modules implemented and deployed

---

# Module 5: Visitor Management

## Overview
Complete visitor lifecycle management from pre-registration to check-out, including badge printing, analytics, and compliance.

## Screens

### 1. Visitor Dashboard
- Today's expected visitors count
- Checked-in visitors count
- Quick check-in button
- Recent activity feed
- Upcoming visitors (next 24hrs)

### 2. Visitor List
Columns: Photo, Name, Company, Host, Visit Date/Time, Status, Purpose, Actions
Filters: Status, Date Range, Host, Building
Export: CSV, Excel, PDF

### 3. Pre-Registration Form
Fields: Visitor Info (Name, Email, Phone, Company, Photo), Visit Details (Date, Time, Duration, Host, Building, Floor, Purpose), Additional (Parking, Accessibility, Equipment), Legal (NDA, Background Check)
Validation: Email format, Phone international, Future date only, Host availability check
API: POST /api/visitors

### 4. Check-In Screen
- QR code scanner
- Manual search
- Photo capture
- ID verification
- NDA signature pad
- Health screening
- Badge auto-print
- Host notification

### 5. Check-Out Screen
- Search checked-in visitors
- QR scan checkout
- Duration calculation
- Satisfaction survey
- Badge return confirmation

### 6. Badge Printing
- Template designer (drag-drop)
- 10 pre-built templates
- Custom fields
- Print queue
- Batch printing

### 7-15. Additional Screens
Visitor Detail, Reports (Daily Log, Trends, No-shows), Analytics Dashboard, Settings, Blacklist Management, NDA Templates, Calendar View, Recurring Visitors, Notification History

---

# Module 6: Parking Management

## Overview
Parking space allocation, reservations, vehicle registration, LPR integration, and occupancy tracking.

## Screens

### 1. Parking Dashboard
- Total spaces / Available
- Occupancy rate chart
- Reservations today
- Recent activity
- Quick reserve button

### 2. Parking Space List
Table: Space #, Zone, Type, Status, Assigned To, Vehicle, Actions
Filters: Building, Zone, Status, Type

### 3. Space Management
Create/Edit spaces, Bulk import, Zone configuration, Space types (Standard, Compact, EV, Handicap, VIP)

### 4. Reservation Interface
- Calendar view
- Space selector
- Date/time picker
- Vehicle selection
- Duration
- Recurring reservations

### 5-13. Additional Screens
My Reservations, Vehicle Registration, LPR Settings, Barrier Gate Control, Occupancy Map (visual floor plan), Analytics, Violations, Settings, Reports

APIs: GET/POST/PUT/DELETE /api/parking/spaces, /api/parking/reservations, /api/parking/vehicles

---

# Module 7: Space Management

## Overview
Meeting rooms, hot desks, booking calendar, check-in kiosks, utilization analytics.

## Screens

### 1. Space Dashboard
- Available rooms now
- Today's bookings
- Utilization rate
- Popular spaces
- Quick book button

### 2. Meeting Room List
Columns: Room Name, Capacity, Floor, Amenities, Status, Next Available
Filters: Building, Floor, Capacity, Amenities

### 3. Space Booking Calendar
- Day/Week/Month views
- Drag-drop booking
- Conflict detection
- Color-coded by type
- Multi-space booking

### 4. Room Display Panel
- Current booking info
- Check-in status
- Next meeting
- Room amenities
- QR code for booking

### 5-14. Additional Screens
Check-In Kiosk, Hot Desking Interface, Desk Map (interactive floor plan), My Bookings, Utilization Analytics, Recurring Bookings, Space Policies, Calendar Integration (Outlook, Google), Room Display Config, Settings

APIs: GET/POST/PUT/DELETE /api/spaces, /api/bookings, /api/spaces/availability

---

# Module 8: Digital Badges

## Overview
Digital badge issuance, templates, mobile display, access control integration.

## Screens

### 1. Badge Dashboard
- Active badges count
- Expiring soon
- Issue new badge
- Recent issuances

### 2. Badge Templates
- Template list
- Create/edit designer
- Preview
- Activate/deactivate

### 3. Badge Designer
- Drag-drop editor
- Field placement (Name, Photo, QR, Company, Expiry)
- Logo upload
- Color scheme
- Font selection

### 4. Issue Badge
Form: Recipient, Badge Type, Validity Period, Access Permissions, Photo, QR Code generation

### 5-10. Additional Screens
Badge List, Badge Detail, Mobile Display (full-screen QR), Access Permissions Matrix, Lifecycle Management (Suspend, Revoke, Renew), Analytics

APIs: POST /api/badges, GET /api/badges/:id, PUT /api/badges/:id/revoke

---

# Module 9: Lockers

## Overview
Locker bank setup, assignments, reservations, smart lock integration.

## Screens

### 1. Locker Dashboard
- Total lockers / Available
- Occupancy rate
- Assignments today
- Maintenance alerts

### 2. Locker Bank Setup
- Bank configuration
- Floor plan mapping
- Numbering system
- Size categories

### 3. Individual Locker Config
Fields: Number, Size, Location, Smart Lock ID, Status, Access Type

### 4. Assignment Interface
- Search user
- Select locker
- Duration (Temporary/Permanent)
- Access code/key
- Notify user

### 5-9. Additional Screens
Reservations, Access Control, Maintenance Tracking, Utilization Reports, Settings

APIs: GET/POST /api/lockers, /api/lockers/assignments

---

# Module 10: Tenant Management

## Overview
Multi-tenancy admin, onboarding, subscription, billing, feature flags.

## Screens

### 1. Tenant Dashboard (Global Admin)
- Active tenants count
- Revenue chart
- Recent signups
- System health

### 2. Tenant List
Columns: Name, Subscription Plan, Users, Status, Created, MRR, Actions

### 3. Create Tenant
Fields: Company Name, Admin Email, Subdomain, Plan, Users Limit, Storage, Modules Enabled

### 4. Onboarding Wizard (7 steps)
1. Company Info, 2. Admin Account, 3. Branding, 4. Module Selection, 5. Initial Setup, 6. Billing, 7. Review & Launch

### 5-11. Additional Screens
Tenant Settings, Subscription Management, Usage & Billing, Monitoring, Feature Flags, Branding (Logo, Colors, Domain), Suspension/Deletion

APIs: GET/POST/PUT/DELETE /api/tenants

---

# Module 11: Building Management

## Overview
Building/floor/zone management, access points, floor plans, facility services.

## Screens

### 1. Building List
Columns: Name, Address, Floors, Total Spaces, Occupancy, Status

### 2. Create/Edit Building
Fields: Name, Address, Floors Count, Total Area, Amenities, Operating Hours, Emergency Contacts

### 3. Floor Management
- Floor list per building
- Add/edit/delete floors
- Floor plan upload
- Zone mapping

### 4-10. Additional Screens
Zone Configuration, Access Points Setup, Floor Plan Upload & Mapping, Facility Services Catalog, Service Requests, Occupancy Dashboard, Settings

APIs: GET/POST/PUT/DELETE /api/buildings, /api/floors, /api/zones

---

# Module 12: Reporting & Analytics

## Overview
Executive dashboards, custom report builder, scheduled reports, data visualization.

## Screens

### 1. Executive Dashboard
Widgets: Total Users, Active Visitors, Parking Occupancy, Space Utilization, Trends (line charts), Top Modules (bar chart)

### 2. Custom Report Builder
- Data source selector
- Field picker
- Filter builder
- Grouping options
- Chart type selection
- Preview

### 3. Saved Reports Library
List, Search, Run, Schedule, Edit, Delete, Clone

### 4. Scheduled Reports
- Schedule configuration
- Recipients
- Format (PDF/Excel/CSV)
- Frequency (Daily/Weekly/Monthly)
- Email template

### 5-12. Additional Screens
Module-Specific Reports, Data Visualization Studio, Export Center, Report Templates, Analytics Settings, KPI Configuration, Benchmarking, Predictive Analytics

APIs: POST /api/reports/generate, GET /api/reports/:id

---

# Module 13: Notifications

## Overview
In-app notifications, email/SMS templates, push notifications, delivery analytics.

## Screens

### 1. Notification Center (In-app)
- Unread count
- Notification list (icon, title, message, time)
- Mark as read
- Filter by type
- Settings link

### 2. Notification Preferences
- Email notifications (toggle per event type)
- SMS notifications
- Push notifications
- Digest frequency
- Quiet hours

### 3. Email Template Editor (Rich WYSIWYG - Implemented)
- contentEditable + document.execCommand based editor
- Font family and font size selection
- Bold, italic, underline, strikethrough formatting
- Font color picker and highlight color picker
- Text alignment (left, center, right, justify)
- Ordered and unordered lists
- Insert/remove hyperlinks
- Insert images
- Undo/redo, clear formatting, horizontal rule
- Variable insertion {{userName}}, {{link}}
- Preview and test send

### 4-8. Additional Screens
SMS Template Editor, Push Notification Setup, Notification Rules Engine (if-then rules), Notification History, Delivery Analytics (sent, delivered, opened, clicked)

APIs: POST /api/notifications/send, GET /api/notifications, PUT /api/notifications/:id/read

---

# Module 14: Integration Studio (Replaces Integration Hub)

## Overview
Complete third-party integration platform with 16 modules, 38 vendor systems across 13 canonical domains. Fully implemented at `/integration-studio`.

**Specification**: See `../Integration_Studio_UI_Specification.md` for complete details.

## Modules (16 total)

### 1. Dashboard
- Domain health cards (13 canonical domains)
- Top failing connectors
- Error rate trend chart
- Recent deployments

### 2. External Systems
- 38 vendor systems (Siemens Desigo CC, Honeywell Niagara, HikCentral, Haltian, Kone, etc.)
- CRUD operations with connectivity test
- Per-environment (Dev/Test/Prod) API Key and Token fields
- Open API link per system

### 3. Canonical APIs
- 13 domain API catalogs
- Operations with methods, paths, schemas

### 4. Connectors
- Connector list with coverage %, health badges
- Environment versions, actions

### 5. Connector Builder
- Multi-step wizard for new connectors

### 6. Mapping Designer
- Split-pane canonical-to-vendor schema mapping
- Mapping rules editor

### 7. Flows
- Multi-step flow orchestration
- Compensation steps

### 8. Events & Sync
- 7 webhook subscriptions + 7 polling jobs
- Replay capability

### 9. Testing
- Test console with dry-run/live toggle
- 14 connectors available for testing

### 10. Health & Logs
- 16 connector health cards
- Request log table with correlation IDs

### 11. Incidents
- Incident tracking with severity S1-S4
- Assignment and linked logs

### 12. Issue Reporting
- Taxonomy tree, routing rules, backend connectors

### 13. Identity
- SSO providers, directory sync, role mapping

### 14. Templates
- 13 pre-built connector templates (one per canonical domain)

**13 Canonical Domains:** BMS, AV/UC, IoT, Access Control, Digital Badge, Lockers, Ticketing, Elevator, Visitor Management, Parking, Event Management, Restaurant, Waste Management

**Implementation Files:**
- Page: `src/app/integration-studio/page.tsx`
- Components: `src/components/integration-studio/IS*.tsx` (16 files)
- Shared: `ISShared.tsx` (StatusBadge, EnvironmentBadge, CoverageBadge, ISTable, ISModal, etc.)

---

# Module 14b: Event Management (NEW)

## Overview
Event scheduling, participant management, RSVP tracking, CSV upload, calendar views. Fully implemented.

## Features

### 1. Event List
- All events with status, date, participant count
- Create/edit/delete events

### 2. Event Details
- Event name, description, date, time, location, capacity
- Participant list with RSVP status

### 3. Participant Management
- Add participants manually
- CSV bulk upload with template download (name, email, company)
- RSVP statuses: Confirmed, Pending, Declined, Waitlisted

### 4. Calendar Views (Outlook-style)
- Day view: Hourly slots 7:00-20:00 with events placed in slots
- Week view: 7-column grid with day columns + hour rows
- Month view: Monthly calendar grid with event dots

### 5. Additional Features
- Check-in/attendance tracking
- Custom registration questions
- Dietary requirements and special assistance
- Food allergy tracking

**Implementation:** `src/components/EventManagement.tsx`

---

# Module 15: Security & Compliance

## Overview
Audit logs, GDPR tools, security controls, compliance reports, backup management.

## Screens

### 1. Security Dashboard
- Security score
- Recent alerts
- Failed login attempts
- Suspicious activities
- Compliance status

### 2. Audit Log Viewer
- Timestamp, User, Action, Resource, IP Address, Status
- Filters (user, action, date range, module)
- Export audit logs
- Search

### 3. Data Privacy Center (GDPR)
- Data subject requests
- Right to access
- Right to erasure
- Data portability
- Consent management

### 4-9. Additional Screens
Security Controls (2FA enforcement, password policies, session timeouts), Compliance Reports (SOC 2, ISO 27001, GDPR), Backup Management, IP Whitelisting, Session Management (force logout), Settings

APIs: GET /api/audit-logs, POST /api/gdpr/data-export

---

# Module 16: Mobile App

## Overview
React Native mobile app with offline support, QR scanning, digital badges.

## Screens (20+)

### Core Screens
1. Splash Screen (logo animation, version check)
2. Login (mobile-optimized, biometric auth)
3. Dashboard (widgets, quick actions)
4. QR Scanner (visitor check-in, badge scan)
5. Digital Badge Display (full-screen QR, auto-brightness)
6. Visitor Check-In (mobile flow)
7. Space Booking (calendar, search)
8. My Bookings (list, upcoming, past)
9. Notifications (push-enabled)
10. Profile (edit, settings)

### Additional Screens
11-20. Parking Reservations, Badge Viewer, Directory, Maps (floor plans), Check-Out, Settings, Offline Mode (sync queue), Camera Access, Biometric Setup, Help & Support

### Technical Specs
- Offline data sync (SQLite)
- Push notifications (FCM/APNS)
- Biometric auth (Face ID, Touch ID)
- Camera access (QR scanning)
- Background sync
- Deep linking

APIs: Same REST APIs as web, with JWT auth

---

# Module 17: Testing Specifications

## Overview
Comprehensive testing strategy covering unit, integration, E2E, accessibility, performance.

## Testing Strategy

### 1. Unit Tests
Framework: Jest + React Testing Library
Coverage: 80%+ code coverage
Test files: `*.test.tsx`, `*.spec.ts`

Components to test:
- All form components with validation
- All data tables with sorting/filtering
- All modals and dialogs
- All custom hooks
- All utility functions

Example:
```typescript
describe('UserForm', () => {
  it('validates email format', () => {
    // Test email validation
  });
  
  it('submits form with valid data', async () => {
    // Test form submission
  });
});
```

### 2. Integration Tests
Framework: Jest + Supertest (API)
Focus: API endpoint testing, database operations

Test scenarios:
- User CRUD operations
- Authentication flows
- Permission checks
- Data relationships
- Error handling

### 3. E2E Tests
Framework: Playwright / Cypress
Critical user flows:
- User login → Dashboard
- Create visitor → Check-in → Check-out
- Book parking space
- Reserve meeting room
- Generate report

Example:
```typescript
test('visitor check-in flow', async ({ page }) => {
  await page.goto('/visitors/check-in');
  await page.fill('[name="email"]', 'visitor@example.com');
  await page.click('button:has-text("Check In")');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### 4. Accessibility Testing
Tools: axe-core, Pa11y, WAVE
Standards: WCAG 2.1 AA compliance

Checks:
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- ARIA labels
- Focus management
- Alt text for images

### 5. Performance Testing
Tools: Lighthouse, WebPageTest
Metrics:
- FCP < 1.8s
- LCP < 2.5s
- TTI < 3.8s
- Bundle size < 500KB (gzipped)

Load testing:
- Apache JMeter for API load tests
- 1000 concurrent users
- Response time < 200ms (p95)

### 6. Security Testing
- OWASP Top 10 checks
- SQL injection tests
- XSS vulnerability scans
- CSRF protection verification
- Authentication bypass attempts
- Authorization checks
- Dependency vulnerability scanning (npm audit)

### Test Data
- Use factories/fixtures for consistent test data
- Separate test database
- Seed scripts for common scenarios
- Mock external APIs (MSW)

### CI/CD Integration
- Run unit tests on every commit
- Run integration tests on PR
- Run E2E tests before deployment
- Generate coverage reports
- Block deployment if tests fail

---

## Implementation Status (All Modules)

### Visitor Management - IMPLEMENTED
- [x] Visitor dashboard, list, invitations
- [x] Check-in/check-out with QR and manual search
- [x] Outlook-style calendar views (day/week/month)
- [x] Connected to GlobalStateContext

### Parking Management - IMPLEMENTED
- [x] Space grid with types (EV, disabled, VIP)
- [x] Assign/release functionality
- [x] Hover-to-release on occupied spaces
- [x] Connected to GlobalStateContext

### Space Management - IMPLEMENTED
- [x] Space types (desk, office, meeting-room, conference-room, social-hub)
- [x] Capacity configuration
- [x] Assign/release with hover overlay
- [x] Connected to GlobalStateContext

### Digital Badges - IMPLEMENTED
- [x] Badge creation and assignment
- [x] Multiple card types, IMEI tracking
- [x] Status management (New, Sent, Downloaded, Suspended)
- [x] CSV import/export

### Lockers - IMPLEMENTED
- [x] 5 locker types (permanent, gym, bike, temporary, storage)
- [x] Floor and zone assignment
- [x] Hover-to-release on occupied lockers
- [x] Usage tracking

### Tenant Management - IMPLEMENTED
- [x] Multi-tenancy with per-tenant modules
- [x] Tenant CRUD with context-aware views
- [x] White label branding per tenant
- [x] Tenant policy management with global fallback

### Building Management - IMPLEMENTED
- [x] Buildings, floors, zones, basement levels
- [x] Connected to GlobalStateContext
- [x] Integrated with dashboard floor heatmaps

### Reporting & Analytics - IMPLEMENTED
- [x] 10 analytics dashboards with pure SVG charts
- [x] Custom chart library (9 chart types)
- [x] CSV and Excel export
- [x] Tenant-filtered data

### Notifications - IMPLEMENTED
- [x] Rich WYSIWYG email template editor
- [x] In-app notification system
- [x] Communication templates

### Integration Studio - IMPLEMENTED
- [x] 16 modules, 38 vendor systems
- [x] 13 canonical domains
- [x] Per-environment API credentials
- [x] Connector health monitoring

### Event Management - IMPLEMENTED
- [x] Event scheduling and participant management
- [x] CSV upload with template download
- [x] Outlook-style calendar views
- [x] RSVP and check-in tracking

### Security & Compliance - IMPLEMENTED
- [x] Audit logging
- [x] Policy management (global + tenant)
- [x] System status monitoring

### Enhancement Backlog
- [ ] Profile edit/delete in admin
- [ ] Badge user selection dropdown
- [ ] Module inheritance from profiles
- [ ] Mobile app (React Native)
- [ ] Automated testing suite

---

**End of Consolidated Specifications for Modules 5-17**

*All core modules are implemented and deployed. See COMPLETED_WORK.md for full implementation details.*
