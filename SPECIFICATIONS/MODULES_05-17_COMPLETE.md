# NEOX Infinity App - Modules 5-17 Complete Specifications

**Version**: 3.0  
**Last Updated**: 2025-10-28  
**Modules**: Visitor Management, Parking, Spaces, Badges, Lockers, Tenants, Buildings, Reports, Notifications, Integration, Security, Mobile, Testing

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

### 3. Email Template Editor
- Rich text editor
- Variable insertion {{userName}}, {{link}}
- Preview
- Test send
- Version control

### 4-8. Additional Screens
SMS Template Editor, Push Notification Setup, Notification Rules Engine (if-then rules), Notification History, Delivery Analytics (sent, delivered, opened, clicked)

APIs: POST /api/notifications/send, GET /api/notifications, PUT /api/notifications/:id/read

---

# Module 14: Integration Hub

## Overview
API documentation, key management, webhooks, marketplace integrations.

## Screens

### 1. Integration Dashboard
- Active integrations
- API usage stats
- Recent API calls
- Webhook deliveries

### 2. API Documentation Portal
- Interactive API explorer
- Endpoint list
- Request/response examples
- Authentication guide
- Rate limits

### 3. API Key Management
- Generate new key
- Key list (name, created, last used, scopes)
- Revoke key
- Regenerate key

### 4. Webhook Configuration
- Create webhook
- Event types
- Endpoint URL
- Secret key
- Retry policy
- Test webhook

### 5-10. Additional Screens
Integration Marketplace, Microsoft 365 Setup, Google Workspace Setup, Data Import Wizard, Data Export Center, API Usage Analytics

APIs: POST /api/integrations/webhooks, GET /api/integrations/api-keys

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

## Implementation Checklists (All Modules)

### Visitor Management
- [ ] 15 screens implemented
- [ ] QR code generation/scanning
- [ ] Badge printing integration
- [ ] NDA digital signature
- [ ] Email notifications
- [ ] Analytics dashboards
- [ ] Blacklist management

### Parking Management
- [ ] 13 screens implemented
- [ ] LPR integration
- [ ] Barrier gate control
- [ ] Occupancy map
- [ ] Reservation system
- [ ] Vehicle management

### Space Management
- [ ] 14 screens implemented
- [ ] Calendar integration (Outlook, Google)
- [ ] Room display panels
- [ ] Check-in kiosks
- [ ] Hot desking
- [ ] Utilization analytics

### Digital Badges
- [ ] Badge designer implemented
- [ ] QR code generation
- [ ] Mobile badge display
- [ ] Access control integration
- [ ] Lifecycle management

### Lockers
- [ ] Smart lock integration
- [ ] Assignment system
- [ ] Maintenance tracking
- [ ] Access control

### Tenant Management
- [ ] Multi-tenancy architecture
- [ ] Onboarding wizard
- [ ] Billing integration
- [ ] Feature flags
- [ ] Tenant isolation

### Building Management
- [ ] Floor plan upload/mapping
- [ ] Zone configuration
- [ ] Access point management
- [ ] Service requests

### Reporting & Analytics
- [ ] Custom report builder
- [ ] Data visualization (Recharts)
- [ ] Scheduled reports
- [ ] Export functionality
- [ ] KPI dashboards

### Notifications
- [ ] Email service (SendGrid/SES)
- [ ] SMS service (Twilio)
- [ ] Push notifications (FCM)
- [ ] Template engine
- [ ] Delivery tracking

### Integration Hub
- [ ] REST API documentation
- [ ] API key management
- [ ] Webhook system
- [ ] OAuth integrations
- [ ] Data import/export

### Security & Compliance
- [ ] Audit logging
- [ ] GDPR compliance tools
- [ ] Backup automation
- [ ] Security monitoring
- [ ] Compliance reports

### Mobile App
- [ ] React Native setup
- [ ] Offline sync
- [ ] Push notifications
- [ ] Biometric auth
- [ ] QR scanner
- [ ] App store deployment

### Testing
- [ ] Unit test suite (80%+ coverage)
- [ ] Integration tests
- [ ] E2E test suite
- [ ] Accessibility tests
- [ ] Performance tests
- [ ] Security tests
- [ ] CI/CD pipeline

---

**End of Consolidated Specifications for Modules 5-17**

*All modules are ready for implementation with complete screen specifications, API definitions, and technical requirements.*
