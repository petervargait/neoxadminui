# NEOX Infinity App - Comprehensive Azure DevOps Specification

## Document Information
- **Version**: 1.0
- **Date**: 2025-10-28
- **Purpose**: Complete work item hierarchy for Azure DevOps implementation
- **Target Audience**: Development Teams, Product Owners, Project Managers

---

## Hierarchy Structure

```
Service (001)
└── Epic (Module)
    └── Use Case
        └── Work Item (Tasks/User Stories)
```

---

## Service Level

| ID | Type | Title | Description | Status |
|---|---|---|---|---|
| 001 | Service | NEOX Infinity App | Multi-tenant administrative platform for building management, visitor control, parking, space management, and facility operations | Active |

---

## Epic Level (Modules)

| ID | Type | Title | Description | ParentID | Implementation Areas |
|---|---|---|---|---|---|
| 001-001 | Epic | Visitor Management | Complete visitor lifecycle management including pre-registration, check-in/out, badge printing, and notifications | 001 | Global Admin, Tenant Admin, API |
| 001-002 | Epic | Parking Management | Vehicle and parking space management including reservations, access control, and occupancy tracking | 001 | Global Admin, Tenant Admin, API |
| 001-003 | Epic | Digital Badges | Digital credential management for building access and identification | 001 | Global Admin, Tenant Admin, API |
| 001-004 | Epic | Lockers | Locker assignment, reservation, and management system | 001 | Global Admin, Tenant Admin, API |
| 001-005 | Epic | Space Management | Meeting rooms, desks, and workspace booking and management | 001 | Global Admin, Tenant Admin, API |
| 001-006 | Epic | User Management | User roles, permissions, authentication, and profile management | 001 | Global Admin, Tenant Admin, API |
| 001-007 | Epic | Tenant Management | Multi-tenant configuration, onboarding, and administration | 001 | Global Admin, API |
| 001-008 | Epic | Building Management | Building configuration, floors, zones, and facility settings | 001 | Global Admin, Tenant Admin, API |
| 001-009 | Epic | Reporting & Analytics | Dashboards, reports, and data analytics across all modules | 001 | Global Admin, Tenant Admin, API |
| 001-010 | Epic | Notifications | Multi-channel notification system (Email, SMS, Push) | 001 | Global Admin, Tenant Admin, API |
| 001-011 | Epic | Integration Hub | Third-party integrations and API management | 001 | Global Admin, API Documentation |
| 001-012 | Epic | Security & Compliance | Audit logs, compliance reporting, and security controls | 001 | Global Admin, API |

---

## Use Cases & Work Items

### EPIC 001-001: Visitor Management

#### Use Case 001-001-UC01: Visitor Pre-Registration
**Description**: Allow hosts to pre-register visitors before their arrival  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Host can create visitor records with future visit dates

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-001-UC01-WI01 | User Story | Create visitor registration form | Design and implement form with visitor details (name, email, phone, company, visit date/time) | Tenant Admin | 5 |
| 001-001-UC01-WI02 | User Story | Add host selection functionality | Enable host to select themselves or another employee as the visitor's host | Tenant Admin | 3 |
| 001-001-UC01-WI03 | Task | Implement visitor data validation | Validate email format, phone numbers, required fields | API | 3 |
| 001-001-UC01-WI04 | Task | Create visitor API endpoints | POST /api/visitors, GET /api/visitors/{id} | API | 5 |
| 001-001-UC01-WI05 | User Story | Send confirmation email to visitor | Automated email with QR code, visit details, and directions | API | 5 |
| 001-001-UC01-WI06 | Task | Store visitor data in database | Create visitors table with proper indexes and relationships | API | 3 |
| 001-001-UC01-WI07 | Bug/Task | Handle duplicate visitor detection | Check for existing visitors by email/phone | API | 3 |

#### Use Case 001-001-UC02: Visitor Check-In/Check-Out
**Description**: Enable reception to check visitors in and out of the building  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Receptionist can scan QR code or search visitor to check in/out

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-001-UC02-WI01 | User Story | Build check-in interface | Create UI for scanning QR codes or searching visitors | Tenant Admin | 8 |
| 001-001-UC02-WI02 | Task | Implement QR code scanner | Integrate QR code scanning functionality | Tenant Admin | 5 |
| 001-001-UC02-WI03 | Task | Create check-in API endpoint | PUT /api/visitors/{id}/checkin | API | 3 |
| 001-001-UC02-WI04 | Task | Create check-out API endpoint | PUT /api/visitors/{id}/checkout | API | 3 |
| 001-001-UC02-WI05 | User Story | Display visitor photo on check-in | Show visitor photo for identity verification | Tenant Admin | 3 |
| 001-001-UC02-WI06 | Task | Notify host on visitor arrival | Send notification to host when visitor checks in | API | 5 |
| 001-001-UC02-WI07 | User Story | Record check-in/out timestamps | Store accurate timestamps with timezone support | API | 3 |
| 001-001-UC02-WI08 | Task | Handle walk-in visitors | Support check-in for visitors without pre-registration | Tenant Admin, API | 5 |

#### Use Case 001-001-UC03: Visitor Badge Printing
**Description**: Print physical badges for checked-in visitors  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: System can generate and print visitor badges with photo and QR code

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-001-UC03-WI01 | User Story | Design badge template | Create customizable badge template with company branding | Tenant Admin | 5 |
| 001-001-UC03-WI02 | Task | Integrate printer drivers | Support common badge printer models | API | 8 |
| 001-001-UC03-WI03 | Task | Generate badge PDF/image | Create printable badge with visitor info and QR code | API | 5 |
| 001-001-UC03-WI04 | User Story | Badge template customization | Allow tenant admins to customize badge design | Tenant Admin | 8 |
| 001-001-UC03-WI05 | Task | Print queue management | Handle multiple print requests and printer status | API | 5 |

#### Use Case 001-001-UC04: Visitor List Management
**Description**: View, search, filter, and manage all visitors  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Users can view past, current, and future visitors with filtering options

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-001-UC04-WI01 | User Story | Create visitor list view | Display visitors in table/grid with key information | Tenant Admin | 5 |
| 001-001-UC04-WI02 | User Story | Implement search functionality | Search by name, email, company, host | Tenant Admin | 5 |
| 001-001-UC04-WI03 | User Story | Add date range filters | Filter visitors by visit date range | Tenant Admin | 3 |
| 001-001-UC04-WI04 | User Story | Status filters | Filter by checked-in, checked-out, expected, cancelled | Tenant Admin | 3 |
| 001-001-UC04-WI05 | Task | Implement pagination | Handle large visitor lists efficiently | API | 3 |
| 001-001-UC04-WI06 | User Story | Export visitor list | Export to CSV/Excel for reporting | Tenant Admin, API | 5 |
| 001-001-UC04-WI07 | User Story | Bulk actions | Cancel, reschedule, or delete multiple visitors | Tenant Admin, API | 5 |

#### Use Case 001-001-UC05: Visitor Management Configuration
**Description**: Configure visitor management settings at tenant level  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Admins can configure visitor workflows and requirements

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-001-UC05-WI01 | User Story | Configure required visitor fields | Define which fields are mandatory for visitor registration | Tenant Admin | 5 |
| 001-001-UC05-WI02 | User Story | Setup NDA/legal agreements | Configure documents visitors must sign | Tenant Admin | 8 |
| 001-001-UC05-WI03 | User Story | Configure notification templates | Customize email/SMS templates for visitor communications | Tenant Admin | 5 |
| 001-001-UC05-WI04 | User Story | Set visitor rules | Define max visit duration, blacklist, security screening | Tenant Admin | 8 |
| 001-001-UC05-WI05 | Task | Global visitor settings | System-wide defaults for visitor management | Global Admin | 5 |

---

### EPIC 001-002: Parking Management

#### Use Case 001-002-UC01: Parking Space Setup
**Description**: Configure parking spaces, zones, and access rules  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Admins can create and manage parking inventory

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-002-UC01-WI01 | User Story | Create parking space form | Add parking spaces with location, type, accessibility | Tenant Admin | 5 |
| 001-002-UC01-WI02 | User Story | Define parking zones | Organize spaces into zones (Level 1, VIP, Visitor, etc.) | Tenant Admin | 5 |
| 001-002-UC01-WI03 | Task | Parking space database schema | Create tables for spaces, zones, and attributes | API | 3 |
| 001-002-UC01-WI04 | User Story | Map parking spaces | Visual floor plan with space mapping | Tenant Admin | 13 |
| 001-002-UC01-WI05 | Task | Space availability API | Real-time parking availability endpoints | API | 5 |
| 001-002-UC01-WI06 | User Story | Parking space types | Define types: Regular, EV Charging, Accessible, Reserved | Tenant Admin | 3 |

#### Use Case 001-002-UC02: Parking Reservation
**Description**: Allow users to reserve parking spaces  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Users can book available parking spaces for specific dates/times

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-002-UC02-WI01 | User Story | Parking reservation interface | UI to browse and reserve available spaces | Tenant Admin | 8 |
| 001-002-UC02-WI02 | Task | Reservation conflict checking | Prevent double-booking of parking spaces | API | 5 |
| 001-002-UC02-WI03 | Task | Create reservation API | POST /api/parking/reservations | API | 5 |
| 001-002-UC02-WI04 | User Story | Recurring parking reservations | Allow daily/weekly recurring bookings | Tenant Admin, API | 8 |
| 001-002-UC02-WI05 | User Story | Reservation confirmation | Send confirmation with space number and directions | API | 3 |
| 001-002-UC02-WI06 | User Story | Cancel/modify reservation | Allow users to change or cancel bookings | Tenant Admin, API | 5 |
| 001-002-UC02-WI07 | Task | Reservation expiry handling | Auto-cancel expired or no-show reservations | API | 5 |

#### Use Case 001-002-UC03: Vehicle Registration
**Description**: Register vehicles for parking access  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Users can register multiple vehicles with license plates

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-002-UC03-WI01 | User Story | Vehicle registration form | Register vehicle with make, model, color, license plate | Tenant Admin | 5 |
| 001-002-UC03-WI02 | Task | License plate validation | Validate plate format by region | API | 5 |
| 001-002-UC03-WI03 | User Story | Multiple vehicle support | Users can register multiple vehicles | Tenant Admin, API | 3 |
| 001-002-UC03-WI04 | Task | Vehicle-user association | Link vehicles to user accounts | API | 3 |
| 001-002-UC03-WI05 | User Story | EV vehicle designation | Mark vehicles as electric for EV charging spots | Tenant Admin | 3 |

#### Use Case 001-002-UC04: Parking Access Control
**Description**: Integrate with physical access control systems  
**Implementation**: API, Global Admin  
**Acceptance Criteria**: System can grant/revoke parking access based on reservations

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-002-UC04-WI01 | Task | LPR integration | Integrate with License Plate Recognition systems | API | 13 |
| 001-002-UC04-WI02 | Task | Barrier gate integration | Connect to automatic barrier systems | API | 13 |
| 001-002-UC04-WI03 | Task | Access validation API | Validate parking access in real-time | API | 5 |
| 001-002-UC04-WI04 | User Story | Access event logging | Log all parking access attempts | API | 3 |
| 001-002-UC04-WI05 | Task | Configure hardware integrations | Setup page for access control hardware | Global Admin | 5 |

#### Use Case 001-002-UC05: Parking Analytics
**Description**: View parking utilization and analytics  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Dashboards show occupancy rates, usage patterns, and trends

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-002-UC05-WI01 | User Story | Parking occupancy dashboard | Real-time view of occupied vs available spaces | Tenant Admin | 8 |
| 001-002-UC05-WI02 | Task | Utilization metrics calculation | Calculate occupancy rates and trends | API | 5 |
| 001-002-UC05-WI03 | User Story | Parking reports | Generate utilization reports by date range | Tenant Admin, API | 8 |
| 001-002-UC05-WI04 | User Story | Peak hours analysis | Identify peak parking usage times | Tenant Admin | 5 |
| 001-002-UC05-WI05 | User Story | Zone-based analytics | Compare utilization across parking zones | Tenant Admin | 5 |

---

### EPIC 001-003: Digital Badges

#### Use Case 001-003-UC01: Badge Design & Templates
**Description**: Create and manage digital badge templates  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Admins can design custom badge layouts

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-003-UC01-WI01 | User Story | Badge template designer | Drag-and-drop badge design interface | Tenant Admin | 13 |
| 001-003-UC01-WI02 | User Story | Template field configuration | Define fields (name, photo, QR, department, etc.) | Tenant Admin | 8 |
| 001-003-UC01-WI03 | Task | Badge template storage | Save templates with JSON/XML configuration | API | 5 |
| 001-003-UC01-WI04 | User Story | Multiple badge types | Create different badges for employees, visitors, contractors | Tenant Admin | 5 |
| 001-003-UC01-WI05 | User Story | Brand customization | Add logos, colors, and company branding | Tenant Admin | 5 |
| 001-003-UC01-WI06 | Task | Default templates library | Provide pre-built badge templates | Global Admin | 5 |

#### Use Case 001-003-UC02: Badge Issuance
**Description**: Issue digital badges to users  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Badges can be assigned to users with access permissions

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-003-UC02-WI01 | User Story | Badge assignment interface | Assign badges to users from admin panel | Tenant Admin | 5 |
| 001-003-UC02-WI02 | Task | Badge generation API | POST /api/badges/issue | API | 5 |
| 001-003-UC02-WI03 | User Story | Badge activation/deactivation | Enable/disable badges without deleting | Tenant Admin, API | 3 |
| 001-003-UC02-WI04 | Task | Badge credential generation | Generate unique badge IDs and QR codes | API | 5 |
| 001-003-UC02-WI05 | User Story | Temporary badges | Issue badges with expiration dates | Tenant Admin, API | 5 |
| 001-003-UC02-WI06 | User Story | Bulk badge issuance | Issue badges to multiple users at once | Tenant Admin, API | 8 |

#### Use Case 001-003-UC03: Badge Access Permissions
**Description**: Configure access rights associated with badges  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Badges can grant access to specific areas and resources

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-003-UC03-WI01 | User Story | Access profile creation | Create access profiles with permitted areas/resources | Tenant Admin | 8 |
| 001-003-UC03-WI02 | Task | Badge-permission mapping | Link badges to access profiles | API | 5 |
| 001-003-UC03-WI03 | User Story | Time-based access rules | Define access schedules (e.g., weekdays 8am-6pm) | Tenant Admin, API | 8 |
| 001-003-UC03-WI04 | User Story | Zone-based permissions | Grant access to specific floors/zones | Tenant Admin | 5 |
| 001-003-UC03-WI05 | Task | Permission validation API | Real-time access permission checking | API | 5 |

#### Use Case 001-003-UC04: Mobile Badge Display
**Description**: Display digital badges on mobile devices  
**Implementation**: Tenant Admin (Mobile), API  
**Acceptance Criteria**: Users can view and use their digital badge from mobile app

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-003-UC04-WI01 | User Story | Mobile badge view | Display badge with photo and QR code | Tenant Admin | 8 |
| 001-003-UC04-WI02 | Task | Badge API for mobile | GET /api/users/me/badge | API | 3 |
| 001-003-UC04-WI03 | User Story | QR code for scanning | Large, scannable QR code for access control | Tenant Admin | 3 |
| 001-003-UC04-WI04 | Task | Offline badge access | Cache badge for offline use | Tenant Admin | 8 |
| 001-003-UC04-WI05 | User Story | Badge refresh mechanism | Update badge when permissions change | API | 5 |

#### Use Case 001-003-UC05: Badge Lifecycle Management
**Description**: Manage badge lifecycle from issuance to revocation  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Complete audit trail of badge status changes

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-003-UC05-WI01 | User Story | Badge status tracking | Track badge states (Active, Suspended, Revoked, Expired) | Tenant Admin, API | 5 |
| 001-003-UC05-WI02 | Task | Automatic badge expiration | Expire badges based on configured rules | API | 5 |
| 001-003-UC05-WI03 | User Story | Badge renewal process | Renew expiring badges | Tenant Admin, API | 5 |
| 001-003-UC05-WI04 | User Story | Lost/stolen badge handling | Report and deactivate lost badges | Tenant Admin, API | 5 |
| 001-003-UC05-WI05 | Task | Badge lifecycle audit log | Log all badge status changes | API | 3 |

---

### EPIC 001-004: Lockers

#### Use Case 001-004-UC01: Locker Setup & Configuration
**Description**: Configure locker inventory and settings  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Admins can create and organize locker banks

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-004-UC01-WI01 | User Story | Create locker banks | Define locker groups by location and type | Tenant Admin | 5 |
| 001-004-UC01-WI02 | User Story | Add individual lockers | Configure locker number, size, and attributes | Tenant Admin | 5 |
| 001-004-UC01-WI03 | Task | Locker database schema | Create tables for locker management | API | 3 |
| 001-004-UC01-WI04 | User Story | Locker size categories | Define sizes (Small, Medium, Large, XL) | Tenant Admin | 3 |
| 001-004-UC01-WI05 | User Story | Locker amenities | Specify features (power outlet, USB, hanging space) | Tenant Admin | 3 |
| 001-004-UC01-WI06 | User Story | Map locker locations | Visual floor plan showing locker locations | Tenant Admin | 8 |

#### Use Case 001-004-UC02: Locker Assignment
**Description**: Assign lockers to users  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Lockers can be assigned permanently or temporarily

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-004-UC02-WI01 | User Story | Manual locker assignment | Admin assigns locker to specific user | Tenant Admin | 5 |
| 001-004-UC02-WI02 | Task | Assignment API endpoints | POST /api/lockers/{id}/assign | API | 5 |
| 001-004-UC02-WI03 | User Story | Permanent vs temporary assignment | Support both long-term and short-term assignments | Tenant Admin, API | 5 |
| 001-004-UC02-WI04 | Task | Assignment conflict prevention | Ensure locker isn't already assigned | API | 3 |
| 001-004-UC02-WI05 | User Story | Bulk locker assignment | Assign multiple lockers at once | Tenant Admin, API | 5 |
| 001-004-UC02-WI06 | User Story | Assignment notifications | Notify users when locker is assigned | API | 3 |

#### Use Case 001-004-UC03: Locker Reservation
**Description**: Allow users to reserve available lockers  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Users can self-serve reserve lockers

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-004-UC03-WI01 | User Story | Locker booking interface | Browse and reserve available lockers | Tenant Admin | 8 |
| 001-004-UC03-WI02 | Task | Availability checking | Real-time locker availability API | API | 5 |
| 001-004-UC03-WI03 | User Story | Date range reservation | Reserve locker for specific dates | Tenant Admin, API | 5 |
| 001-004-UC03-WI04 | User Story | Filter lockers | Filter by size, location, amenities | Tenant Admin | 5 |
| 001-004-UC03-WI05 | Task | Reservation confirmation | Send confirmation with locker details | API | 3 |
| 001-004-UC03-WI06 | User Story | Extend reservation | Users can extend their locker reservation | Tenant Admin, API | 5 |
| 001-004-UC03-WI07 | User Story | Early release | Release locker before reservation ends | Tenant Admin, API | 3 |

#### Use Case 001-004-UC04: Locker Access Control
**Description**: Integrate with physical locker locks  
**Implementation**: API, Global Admin  
**Acceptance Criteria**: System controls electronic locker locks

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-004-UC04-WI01 | Task | Smart lock integration | Integrate with electronic locker systems | API | 13 |
| 001-004-UC04-WI02 | Task | Generate access codes | Create temporary PIN codes for locker access | API | 5 |
| 001-004-UC04-WI03 | User Story | Mobile unlock | Unlock locker via mobile app | Tenant Admin, API | 8 |
| 001-004-UC04-WI04 | Task | Access event logging | Log all locker access events | API | 3 |
| 001-004-UC04-WI05 | Task | Emergency override | Admin can unlock any locker | API | 5 |
| 001-004-UC04-WI06 | Task | Lock hardware configuration | Setup page for lock system integration | Global Admin | 5 |

#### Use Case 001-004-UC05: Locker Management & Maintenance
**Description**: Track locker status and maintenance  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: System tracks locker maintenance and issues

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-004-UC05-WI01 | User Story | Locker status management | Mark lockers as Available, Occupied, Out of Service | Tenant Admin | 5 |
| 001-004-UC05-WI02 | User Story | Maintenance scheduling | Schedule locker maintenance/cleaning | Tenant Admin, API | 5 |
| 001-004-UC05-WI03 | User Story | Report locker issues | Users can report damaged/broken lockers | Tenant Admin, API | 5 |
| 001-004-UC05-WI04 | User Story | Maintenance history | View locker maintenance history | Tenant Admin | 3 |
| 001-004-UC05-WI05 | Task | Utilization reporting | Generate locker usage reports | API | 5 |

---

### EPIC 001-005: Space Management

#### Use Case 001-005-UC01: Space Inventory Setup
**Description**: Configure meeting rooms, desks, and workspaces  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Complete inventory of bookable spaces

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-005-UC01-WI01 | User Story | Create space form | Add spaces with name, type, capacity, location | Tenant Admin | 5 |
| 001-005-UC01-WI02 | User Story | Space types | Define Meeting Room, Desk, Phone Booth, Common Area | Tenant Admin | 3 |
| 001-005-UC01-WI03 | Task | Space database schema | Create tables for space management | API | 5 |
| 001-005-UC01-WI04 | User Story | Space amenities | Configure AV equipment, whiteboards, video conf, etc. | Tenant Admin | 5 |
| 001-005-UC01-WI05 | User Story | Floor plans | Upload and map spaces on floor plans | Tenant Admin | 13 |
| 001-005-UC01-WI06 | User Story | Space photos | Add photos for each space | Tenant Admin | 3 |
| 001-005-UC01-WI07 | User Story | Accessibility features | Mark spaces as accessible | Tenant Admin | 3 |

#### Use Case 001-005-UC02: Space Booking
**Description**: Allow users to book available spaces  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Users can reserve spaces for specific times

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-005-UC02-WI01 | User Story | Space booking interface | Calendar view for booking spaces | Tenant Admin | 13 |
| 001-005-UC02-WI02 | Task | Availability API | Real-time space availability checking | API | 5 |
| 001-005-UC02-WI03 | Task | Booking API | POST /api/spaces/{id}/bookings | API | 5 |
| 001-005-UC02-WI04 | User Story | Recurring bookings | Daily, weekly, or custom recurring reservations | Tenant Admin, API | 8 |
| 001-005-UC02-WI05 | User Story | Search & filter spaces | Find spaces by capacity, amenities, location | Tenant Admin | 8 |
| 001-005-UC02-WI06 | User Story | Booking confirmation | Email/notification with booking details | API | 3 |
| 001-005-UC02-WI07 | User Story | Add meeting attendees | Invite others to space booking | Tenant Admin, API | 5 |
| 001-005-UC02-WI08 | User Story | Cancel/modify booking | Edit or cancel existing bookings | Tenant Admin, API | 5 |

#### Use Case 001-005-UC03: Space Check-In
**Description**: Check-in to reserved spaces  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: No-show bookings are automatically released

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-005-UC03-WI01 | User Story | QR code check-in | Scan QR code at space to check in | Tenant Admin | 5 |
| 001-005-UC03-WI02 | User Story | Mobile check-in | Check in via mobile app | Tenant Admin | 5 |
| 001-005-UC03-WI03 | Task | Check-in API | PUT /api/bookings/{id}/checkin | API | 3 |
| 001-005-UC03-WI04 | Task | No-show detection | Auto-cancel bookings without check-in | API | 5 |
| 001-005-UC03-WI05 | User Story | Check-in grace period | Configure time window for check-in | Tenant Admin | 3 |
| 001-005-UC03-WI06 | Task | Release unclaimed bookings | Free up no-show spaces for others | API | 5 |

#### Use Case 001-005-UC04: Hot Desking
**Description**: Manage hot desk booking and allocation  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Users can book desks for specific days

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-005-UC04-WI01 | User Story | Desk booking calendar | Daily desk reservation interface | Tenant Admin | 8 |
| 001-005-UC04-WI02 | User Story | Desk neighborhoods | Group desks into teams/departments | Tenant Admin | 5 |
| 001-005-UC04-WI03 | User Story | Preferred desk selection | Users can favorite desks | Tenant Admin, API | 5 |
| 001-005-UC04-WI04 | User Story | Team clustering | Suggest desks near team members | Tenant Admin, API | 8 |
| 001-005-UC04-WI05 | Task | Daily desk assignment | Assign desks for full day bookings | API | 3 |
| 001-005-UC04-WI06 | User Story | Desk utilization analytics | Track desk usage patterns | Tenant Admin, API | 8 |

#### Use Case 001-005-UC05: Meeting Room Integration
**Description**: Integrate with calendar systems and room displays  
**Implementation**: API, Global Admin  
**Acceptance Criteria**: Sync with Outlook/Google Calendar and room panels

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-005-UC05-WI01 | Task | Outlook calendar integration | Sync with Microsoft Exchange/365 | API | 13 |
| 001-005-UC05-WI02 | Task | Google Calendar integration | Sync with Google Workspace | API | 13 |
| 001-005-UC05-WI03 | Task | Room display API | Provide data for room panel displays | API | 8 |
| 001-005-UC05-WI04 | User Story | Calendar configuration | Setup calendar integration settings | Global Admin | 5 |
| 001-005-UC05-WI05 | Task | Bi-directional sync | Bookings sync both ways | API | 8 |

#### Use Case 001-005-UC06: Space Policies & Rules
**Description**: Configure booking policies and restrictions  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Enforced booking rules and limits

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-005-UC06-WI01 | User Story | Booking time limits | Max booking duration per space type | Tenant Admin | 5 |
| 001-005-UC06-WI02 | User Story | Advance booking limits | How far ahead users can book | Tenant Admin | 3 |
| 001-005-UC06-WI03 | User Story | Concurrent booking limits | Max simultaneous bookings per user | Tenant Admin | 5 |
| 001-005-UC06-WI04 | User Story | Booking approval workflows | Require approval for certain spaces | Tenant Admin, API | 8 |
| 001-005-UC06-WI05 | User Story | User booking quotas | Limit bookings per user per week/month | Tenant Admin, API | 8 |
| 001-005-UC06-WI06 | Task | Policy enforcement | Validate bookings against policies | API | 5 |

---

### EPIC 001-006: User Management

#### Use Case 001-006-UC01: User Registration & Onboarding
**Description**: Register new users and onboard them to the system  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Users can be added manually or via bulk import

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-006-UC01-WI01 | User Story | User registration form | Create user with name, email, phone, department | Tenant Admin | 5 |
| 001-006-UC01-WI02 | Task | User database schema | Create users table with proper indexes | API | 5 |
| 001-006-UC01-WI03 | Task | User creation API | POST /api/users | API | 5 |
| 001-006-UC01-WI04 | User Story | Bulk user import | CSV/Excel upload for multiple users | Tenant Admin, API | 8 |
| 001-006-UC01-WI05 | User Story | Welcome email | Send onboarding email with credentials | API | 3 |
| 001-006-UC01-WI06 | User Story | User profile completion | Prompt users to complete profile on first login | Tenant Admin | 5 |
| 001-006-UC01-WI07 | Task | Email uniqueness validation | Prevent duplicate email addresses | API | 3 |

#### Use Case 001-006-UC02: Authentication & Login
**Description**: Secure user authentication system  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Multiple authentication methods supported

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-006-UC02-WI01 | User Story | Email/password login | Standard authentication | Tenant Admin, API | 8 |
| 001-006-UC02-WI02 | Task | JWT token generation | Secure token-based authentication | API | 5 |
| 001-006-UC02-WI03 | User Story | Single Sign-On (SSO) | Support SAML/OAuth SSO | API | 13 |
| 001-006-UC02-WI04 | User Story | Multi-factor authentication | SMS/Email/Authenticator app MFA | API | 13 |
| 001-006-UC02-WI05 | User Story | Password reset | Forgot password flow | Tenant Admin, API | 5 |
| 001-006-UC02-WI06 | User Story | Session management | Handle active sessions and timeouts | API | 5 |
| 001-006-UC02-WI07 | Task | Login attempt limiting | Prevent brute force attacks | API | 5 |
| 001-006-UC02-WI08 | User Story | SSO configuration | Configure SSO providers per tenant | Global Admin, Tenant Admin | 8 |

#### Use Case 001-006-UC03: Role-Based Access Control (RBAC)
**Description**: Define and manage user roles and permissions  
**Implementation**: Global Admin, Tenant Admin, API  
**Acceptance Criteria**: Granular permission system

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-006-UC03-WI01 | Task | RBAC database design | Roles, permissions, and user-role tables | API | 8 |
| 001-006-UC03-WI02 | User Story | Create custom roles | Define roles with specific permissions | Tenant Admin | 8 |
| 001-006-UC03-WI03 | User Story | Assign roles to users | Associate users with one or more roles | Tenant Admin | 5 |
| 001-006-UC03-WI04 | Task | Permission checking middleware | API authorization middleware | API | 8 |
| 001-006-UC03-WI05 | User Story | Default system roles | Super Admin, Tenant Admin, Manager, User, Guest | Global Admin | 5 |
| 001-006-UC03-WI06 | User Story | Permission groups | Organize permissions by module | Tenant Admin | 5 |
| 001-006-UC03-WI07 | Task | Role hierarchy | Support role inheritance | API | 8 |

#### Use Case 001-006-UC04: User Profile Management
**Description**: Users can view and edit their profiles  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Self-service profile updates

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-006-UC04-WI01 | User Story | View user profile | Display user information and settings | Tenant Admin | 5 |
| 001-006-UC04-WI02 | User Story | Edit profile | Update name, phone, photo, preferences | Tenant Admin, API | 5 |
| 001-006-UC04-WI03 | User Story | Upload profile photo | Image upload with crop/resize | Tenant Admin, API | 5 |
| 001-006-UC04-WI04 | User Story | Change password | Users can update their password | Tenant Admin, API | 3 |
| 001-006-UC04-WI05 | User Story | Notification preferences | Configure email/SMS/push notification settings | Tenant Admin, API | 5 |
| 001-006-UC04-WI06 | Task | Profile update API | PUT /api/users/me | API | 3 |

#### Use Case 001-006-UC05: User Directory
**Description**: Searchable directory of all users  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Users can find and contact colleagues

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-006-UC05-WI01 | User Story | User directory listing | Display all users with photos and basic info | Tenant Admin | 8 |
| 001-006-UC05-WI02 | User Story | Directory search | Search by name, email, department | Tenant Admin | 5 |
| 001-006-UC05-WI03 | User Story | Filters | Filter by department, role, location | Tenant Admin | 5 |
| 001-006-UC05-WI04 | User Story | User detail view | Click user to see full profile | Tenant Admin | 3 |
| 001-006-UC05-WI05 | Task | Directory API | GET /api/users with search/filter params | API | 5 |
| 001-006-UC05-WI06 | User Story | Export directory | Export user list to CSV | Tenant Admin, API | 3 |

#### Use Case 001-006-UC06: User Deactivation & Offboarding
**Description**: Deactivate users and revoke access  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Complete offboarding process

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-006-UC06-WI01 | User Story | Deactivate user account | Disable user login and access | Tenant Admin, API | 5 |
| 001-006-UC06-WI02 | Task | Revoke active sessions | Invalidate all user tokens | API | 3 |
| 001-006-UC06-WI03 | Task | Cancel user bookings | Auto-cancel future reservations | API | 5 |
| 001-006-UC06-WI04 | Task | Revoke badge access | Deactivate user's digital badges | API | 3 |
| 001-006-UC06-WI05 | User Story | Offboarding checklist | Track offboarding tasks | Tenant Admin | 5 |
| 001-006-UC06-WI06 | User Story | Reactivate user | Re-enable deactivated accounts | Tenant Admin, API | 3 |

---

### EPIC 001-007: Tenant Management

#### Use Case 001-007-UC01: Tenant Creation & Setup
**Description**: Create and configure new tenants  
**Implementation**: Global Admin, API  
**Acceptance Criteria**: Multi-tenant isolation and configuration

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-007-UC01-WI01 | User Story | Create tenant form | Setup new tenant with name, subdomain, contact info | Global Admin | 8 |
| 001-007-UC01-WI02 | Task | Tenant database architecture | Multi-tenant data isolation strategy | API | 13 |
| 001-007-UC01-WI03 | Task | Tenant provisioning API | POST /api/tenants | API | 8 |
| 001-007-UC01-WI04 | Task | Subdomain/domain configuration | Setup tenant-specific URLs | API | 8 |
| 001-007-UC01-WI05 | User Story | Initial tenant admin creation | Create first admin user for tenant | Global Admin, API | 5 |
| 001-007-UC01-WI06 | Task | Default tenant settings | Initialize tenant with default configs | API | 5 |
| 001-007-UC01-WI07 | User Story | Tenant onboarding wizard | Guided setup for new tenants | Global Admin | 13 |

#### Use Case 001-007-UC02: Tenant Configuration
**Description**: Configure tenant-specific settings  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Each tenant can customize their instance

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-007-UC02-WI01 | User Story | Company branding | Upload logo, colors, company name | Tenant Admin | 5 |
| 001-007-UC02-WI02 | User Story | Timezone & localization | Set timezone, language, date/time formats | Tenant Admin | 5 |
| 001-007-UC02-WI03 | User Story | Module activation | Enable/disable specific modules | Tenant Admin | 5 |
| 001-007-UC02-WI04 | User Story | Email configuration | SMTP settings for tenant emails | Tenant Admin | 5 |
| 001-007-UC02-WI05 | User Story | Custom domain | Configure custom domain for tenant | Global Admin | 8 |
| 001-007-UC02-WI06 | Task | Tenant settings API | GET/PUT /api/tenants/{id}/settings | API | 5 |

#### Use Case 001-007-UC03: Tenant Billing & Subscription
**Description**: Manage tenant subscriptions and billing  
**Implementation**: Global Admin, API  
**Acceptance Criteria**: Track usage and billing per tenant

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-007-UC03-WI01 | User Story | Subscription plans | Define plans (Basic, Professional, Enterprise) | Global Admin | 8 |
| 001-007-UC03-WI02 | User Story | Assign subscription to tenant | Set tenant's active plan | Global Admin | 5 |
| 001-007-UC03-WI03 | Task | Usage tracking | Track users, storage, API calls per tenant | API | 8 |
| 001-007-UC03-WI04 | Task | Billing API | Invoice generation and payment tracking | API | 13 |
| 001-007-UC03-WI05 | User Story | Usage limits enforcement | Limit features based on plan | API | 8 |
| 001-007-UC03-WI06 | User Story | Billing dashboard | View subscription and usage | Global Admin | 8 |

#### Use Case 001-007-UC04: Tenant Monitoring
**Description**: Monitor tenant health and activity  
**Implementation**: Global Admin, API  
**Acceptance Criteria**: System-wide tenant oversight

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-007-UC04-WI01 | User Story | Tenant list dashboard | View all tenants with status | Global Admin | 8 |
| 001-007-UC04-WI02 | User Story | Tenant activity metrics | Active users, storage used, API calls | Global Admin | 8 |
| 001-007-UC04-WI03 | User Story | Health checks | System status per tenant | Global Admin, API | 8 |
| 001-007-UC04-WI04 | Task | Tenant analytics API | GET /api/tenants/analytics | API | 5 |
| 001-007-UC04-WI05 | User Story | Alerting | Notify on tenant issues or limits | API | 5 |

#### Use Case 001-007-UC05: Tenant Suspension & Deletion
**Description**: Suspend or permanently delete tenants  
**Implementation**: Global Admin, API  
**Acceptance Criteria**: Safe tenant lifecycle management

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-007-UC05-WI01 | User Story | Suspend tenant | Temporarily disable tenant access | Global Admin, API | 5 |
| 001-007-UC05-WI02 | User Story | Reactivate tenant | Re-enable suspended tenant | Global Admin, API | 3 |
| 001-007-UC05-WI03 | User Story | Tenant deletion | Permanently delete tenant and data | Global Admin, API | 8 |
| 001-007-UC05-WI04 | Task | Data backup before deletion | Export tenant data before removal | API | 8 |
| 001-007-UC05-WI05 | Task | Cascade deletion | Remove all tenant-related data | API | 8 |

---

### EPIC 001-008: Building Management

#### Use Case 001-008-UC01: Building Setup
**Description**: Configure buildings and properties  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Complete building inventory

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-008-UC01-WI01 | User Story | Add building | Create building with name, address, contact | Tenant Admin | 5 |
| 001-008-UC01-WI02 | Task | Building database schema | Tables for buildings and hierarchy | API | 5 |
| 001-008-UC01-WI03 | User Story | Building details | Operating hours, capacity, amenities | Tenant Admin | 5 |
| 001-008-UC01-WI04 | User Story | Multiple buildings support | Manage multiple properties | Tenant Admin | 5 |
| 001-008-UC01-WI05 | Task | Building API | CRUD endpoints for buildings | API | 5 |

#### Use Case 001-008-UC02: Floor & Zone Configuration
**Description**: Define floors and zones within buildings  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Hierarchical building structure

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-008-UC02-WI01 | User Story | Add floors | Define floors with number and name | Tenant Admin | 5 |
| 001-008-UC02-WI02 | User Story | Create zones | Define areas within floors (North Wing, Lobby, etc.) | Tenant Admin | 5 |
| 001-008-UC02-WI03 | User Story | Upload floor plans | Image upload for each floor | Tenant Admin | 5 |
| 001-008-UC02-WI04 | Task | Building hierarchy API | Buildings > Floors > Zones | API | 5 |
| 001-008-UC02-WI05 | User Story | Floor/zone attributes | Square footage, capacity, department assignment | Tenant Admin | 3 |

#### Use Case 001-008-UC03: Access Points Configuration
**Description**: Configure doors, gates, and entry points  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Map all access points

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-008-UC03-WI01 | User Story | Add access points | Define doors, gates, turnstiles | Tenant Admin | 5 |
| 001-008-UC03-WI02 | User Story | Access point types | Main entrance, floor door, elevator, parking gate | Tenant Admin | 3 |
| 001-008-UC03-WI03 | Task | Access control integration | Connect to physical access systems | API | 13 |
| 001-008-UC03-WI04 | User Story | Access schedules | Configure when access points are active | Tenant Admin | 5 |
| 001-008-UC03-WI05 | Task | Access event logging | Log all access attempts | API | 5 |

#### Use Case 001-008-UC04: Facility Services
**Description**: Configure facility services and amenities  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Services catalog available

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-008-UC04-WI01 | User Story | Services catalog | List available services (catering, IT, maintenance) | Tenant Admin | 5 |
| 001-008-UC04-WI02 | User Story | Service request form | Users can request facility services | Tenant Admin | 8 |
| 001-008-UC04-WI03 | Task | Service request API | POST /api/service-requests | API | 5 |
| 001-008-UC04-WI04 | User Story | Service tracking | Track request status and completion | Tenant Admin, API | 5 |
| 001-008-UC04-WI05 | User Story | Service notifications | Notify requestor of status changes | API | 3 |

#### Use Case 001-008-UC05: Building Occupancy
**Description**: Monitor and display building occupancy  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Real-time occupancy data

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-008-UC05-WI01 | User Story | Occupancy dashboard | Display current building occupancy | Tenant Admin | 8 |
| 001-008-UC05-WI02 | Task | Calculate occupancy | Count checked-in users and visitors | API | 5 |
| 001-008-UC05-WI03 | User Story | Floor-level occupancy | Occupancy by floor | Tenant Admin | 5 |
| 001-008-UC05-WI04 | User Story | Capacity alerts | Alert when reaching capacity limits | API | 5 |
| 001-008-UC05-WI05 | User Story | Historical occupancy | View occupancy trends over time | Tenant Admin, API | 8 |

---

### EPIC 001-009: Reporting & Analytics

#### Use Case 001-009-UC01: Dashboard & KPIs
**Description**: Executive dashboard with key metrics  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Real-time KPI display

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-009-UC01-WI01 | User Story | Executive dashboard | Overview of all modules with KPIs | Tenant Admin | 13 |
| 001-009-UC01-WI02 | Task | KPI calculation engine | Calculate metrics across modules | API | 8 |
| 001-009-UC01-WI03 | User Story | Configurable widgets | Users can customize dashboard layout | Tenant Admin | 8 |
| 001-009-UC01-WI04 | User Story | Date range filtering | Filter dashboard by date range | Tenant Admin | 5 |
| 001-009-UC01-WI05 | Task | Dashboard API | GET /api/dashboard/metrics | API | 5 |

#### Use Case 001-009-UC02: Module-Specific Reports
**Description**: Detailed reports per module  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Reports for each module with export

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-009-UC02-WI01 | User Story | Visitor reports | Visitor counts, trends, average visit duration | Tenant Admin, API | 8 |
| 001-009-UC02-WI02 | User Story | Parking reports | Utilization, peak hours, revenue (if applicable) | Tenant Admin, API | 8 |
| 001-009-UC02-WI03 | User Story | Space utilization reports | Booking rates, popular spaces, no-show rates | Tenant Admin, API | 8 |
| 001-009-UC02-WI04 | User Story | User activity reports | Active users, login frequency, feature usage | Tenant Admin, API | 8 |
| 001-009-UC02-WI05 | User Story | Report export | Export reports to PDF, Excel, CSV | API | 5 |
| 001-009-UC02-WI06 | User Story | Scheduled reports | Auto-generate and email reports | API | 8 |

#### Use Case 001-009-UC03: Custom Report Builder
**Description**: Allow users to create custom reports  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Drag-and-drop report builder

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-009-UC03-WI01 | User Story | Report builder UI | Select data sources, fields, filters | Tenant Admin | 13 |
| 001-009-UC03-WI02 | Task | Query builder API | Dynamic query generation | API | 13 |
| 001-009-UC03-WI03 | User Story | Save custom reports | Save report definitions for reuse | Tenant Admin, API | 5 |
| 001-009-UC03-WI04 | User Story | Share reports | Share report templates with other users | Tenant Admin, API | 5 |
| 001-009-UC03-WI05 | User Story | Visualization options | Charts (bar, line, pie) for reports | Tenant Admin | 8 |

#### Use Case 001-009-UC04: Data Export
**Description**: Export data from the system  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Bulk data export capabilities

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-009-UC04-WI01 | User Story | Bulk data export | Export all data from a module | Tenant Admin, API | 8 |
| 001-009-UC04-WI02 | Task | CSV export functionality | Generate CSV files | API | 5 |
| 001-009-UC04-WI03 | Task | Excel export functionality | Generate Excel files with formatting | API | 8 |
| 001-009-UC04-WI04 | Task | JSON export | Export data in JSON format | API | 3 |
| 001-009-UC04-WI05 | User Story | Export history | Track what was exported and when | Tenant Admin, API | 5 |

#### Use Case 001-009-UC05: Analytics & Insights
**Description**: AI-powered insights and predictions  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Actionable insights from data

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-009-UC05-WI01 | User Story | Trend analysis | Identify trends across modules | Tenant Admin, API | 13 |
| 001-009-UC05-WI02 | User Story | Predictive analytics | Forecast future demand (spaces, parking, etc.) | API | 13 |
| 001-009-UC05-WI03 | User Story | Anomaly detection | Alert on unusual patterns | API | 13 |
| 001-009-UC05-WI04 | User Story | Recommendations | Suggest optimizations based on data | Tenant Admin, API | 13 |
| 001-009-UC05-WI05 | Task | ML model integration | Integrate machine learning models | API | 21 |

---

### EPIC 001-010: Notifications

#### Use Case 001-010-UC01: Email Notifications
**Description**: Send email notifications for events  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Reliable email delivery

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-010-UC01-WI01 | Task | Email service integration | Integrate with SendGrid/AWS SES | API | 8 |
| 001-010-UC01-WI02 | User Story | Email templates | Create templates for different events | Tenant Admin | 8 |
| 001-010-UC01-WI03 | Task | Template variables | Support dynamic content in emails | API | 5 |
| 001-010-UC01-WI04 | User Story | Email customization | Tenant-specific email branding | Tenant Admin | 5 |
| 001-010-UC01-WI05 | Task | Email queue | Queue system for reliable delivery | API | 5 |
| 001-010-UC01-WI06 | Task | Email delivery tracking | Track sent, delivered, opened, clicked | API | 8 |

#### Use Case 001-010-UC02: SMS Notifications
**Description**: Send SMS text messages  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: SMS delivery for critical alerts

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-010-UC02-WI01 | Task | SMS service integration | Integrate with Twilio/AWS SNS | API | 8 |
| 001-010-UC02-WI02 | User Story | SMS templates | Create SMS message templates | Tenant Admin | 5 |
| 001-010-UC02-WI03 | Task | SMS cost management | Track SMS usage and costs | API | 5 |
| 001-010-UC02-WI04 | User Story | SMS opt-in/opt-out | Users can control SMS notifications | Tenant Admin, API | 5 |
| 001-010-UC02-WI05 | Task | International SMS support | Support different countries/regions | API | 8 |

#### Use Case 001-010-UC03: Push Notifications
**Description**: Mobile and web push notifications  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Real-time push to mobile and web

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-010-UC03-WI01 | Task | Push notification service | Integrate with FCM/APNS | API | 13 |
| 001-010-UC03-WI02 | User Story | Device registration | Register mobile/web devices for push | API | 5 |
| 001-010-UC03-WI03 | Task | Push notification API | Send push notifications | API | 5 |
| 001-010-UC03-WI04 | User Story | Push notification settings | Users control what notifications they receive | Tenant Admin | 5 |
| 001-010-UC03-WI05 | Task | Rich push notifications | Include images, actions in notifications | API | 8 |

#### Use Case 001-010-UC04: In-App Notifications
**Description**: Notification center within the app  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Unified notification inbox

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-010-UC04-WI01 | User Story | Notification center UI | List all notifications for user | Tenant Admin | 8 |
| 001-010-UC04-WI02 | Task | Notification storage | Store notifications in database | API | 5 |
| 001-010-UC04-WI03 | User Story | Mark as read/unread | Users can manage notification status | Tenant Admin, API | 3 |
| 001-010-UC04-WI04 | User Story | Notification filtering | Filter by type, date, read status | Tenant Admin | 5 |
| 001-010-UC04-WI05 | Task | Real-time notifications | WebSocket/SSE for live updates | API | 8 |
| 001-010-UC04-WI06 | User Story | Delete notifications | Users can delete notifications | Tenant Admin, API | 3 |

#### Use Case 001-010-UC05: Notification Rules & Preferences
**Description**: Configure what notifications are sent when  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Granular notification control

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-010-UC05-WI01 | User Story | User notification preferences | Users set their notification preferences | Tenant Admin | 8 |
| 001-010-UC05-WI02 | User Story | Admin notification rules | Admins configure notification triggers | Tenant Admin | 8 |
| 001-010-UC05-WI03 | Task | Notification routing logic | Determine which notifications to send via which channel | API | 8 |
| 001-010-UC05-WI04 | User Story | Quiet hours | Don't send notifications during certain times | Tenant Admin, API | 5 |
| 001-010-UC05-WI05 | User Story | Notification digest | Batch notifications into periodic summaries | API | 8 |

---

### EPIC 001-011: Integration Hub

#### Use Case 001-011-UC01: API Documentation
**Description**: Comprehensive API documentation  
**Implementation**: API Documentation, Global Admin  
**Acceptance Criteria**: Interactive API docs with examples

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-011-UC01-WI01 | Task | OpenAPI/Swagger spec | Generate API specification | API Documentation | 8 |
| 001-011-UC01-WI02 | User Story | Interactive API docs | Swagger UI or similar for testing | API Documentation | 5 |
| 001-011-UC01-WI03 | Task | API documentation portal | Dedicated documentation website | API Documentation | 8 |
| 001-011-UC01-WI04 | User Story | Code examples | Provide examples in multiple languages | API Documentation | 8 |
| 001-011-UC01-WI05 | User Story | Webhooks documentation | Document webhook events and payloads | API Documentation | 5 |
| 001-011-UC01-WI06 | Task | Versioned documentation | Docs for different API versions | API Documentation | 5 |

#### Use Case 001-011-UC02: API Key Management
**Description**: Generate and manage API keys  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Secure API authentication

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-011-UC02-WI01 | User Story | Generate API keys | Create API keys for integrations | Tenant Admin | 5 |
| 001-011-UC02-WI02 | Task | API key authentication | Validate API keys on requests | API | 5 |
| 001-011-UC02-WI03 | User Story | API key permissions | Scope API keys to specific endpoints | Tenant Admin | 8 |
| 001-011-UC02-WI04 | User Story | Revoke API keys | Disable compromised keys | Tenant Admin | 3 |
| 001-011-UC02-WI05 | User Story | API key usage tracking | Monitor API key usage | Tenant Admin, API | 5 |
| 001-011-UC02-WI06 | Task | Rate limiting | Limit API calls per key | API | 5 |

#### Use Case 001-011-UC03: Webhooks
**Description**: Send events to external systems  
**Implementation**: Tenant Admin, API  
**Acceptance Criteria**: Reliable webhook delivery

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-011-UC03-WI01 | User Story | Configure webhook endpoints | Register webhook URLs | Tenant Admin | 5 |
| 001-011-UC03-WI02 | User Story | Select webhook events | Choose which events trigger webhooks | Tenant Admin | 5 |
| 001-011-UC03-WI03 | Task | Webhook delivery system | Queue and send webhook payloads | API | 8 |
| 001-011-UC03-WI04 | Task | Webhook retry logic | Retry failed webhook deliveries | API | 5 |
| 001-011-UC03-WI05 | User Story | Webhook logs | View webhook delivery history | Tenant Admin, API | 5 |
| 001-011-UC03-WI06 | Task | Webhook signature | Sign webhooks for verification | API | 5 |

#### Use Case 001-011-UC04: Third-Party Integrations
**Description**: Pre-built integrations with popular services  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Plug-and-play integrations

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-011-UC04-WI01 | Task | Microsoft 365 integration | Sync with Azure AD, Outlook, Teams | API | 21 |
| 001-011-UC04-WI02 | Task | Google Workspace integration | Sync with Google Directory, Calendar | API | 21 |
| 001-011-UC04-WI03 | Task | Slack integration | Send notifications to Slack | API | 13 |
| 001-011-UC04-WI04 | Task | Salesforce integration | Sync contacts and data | API | 21 |
| 001-011-UC04-WI05 | User Story | Integration marketplace | Browse and enable integrations | Tenant Admin | 8 |
| 001-011-UC04-WI06 | User Story | Configure integrations | Setup credentials and mapping | Tenant Admin | 8 |

#### Use Case 001-011-UC05: Data Import/Export
**Description**: Bulk data migration tools  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: Import data from other systems

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-011-UC05-WI01 | User Story | CSV import | Import data via CSV upload | Tenant Admin, API | 8 |
| 001-011-UC05-WI02 | User Story | Data mapping | Map CSV columns to system fields | Tenant Admin | 8 |
| 001-011-UC05-WI03 | Task | Import validation | Validate data before import | API | 8 |
| 001-011-UC05-WI04 | User Story | Import preview | Preview data before committing | Tenant Admin | 5 |
| 001-011-UC05-WI05 | Task | Bulk export API | Export large datasets | API | 8 |
| 001-011-UC05-WI06 | User Story | Migration tools | Tools for migrating from competitors | Tenant Admin, API | 13 |

---

### EPIC 001-012: Security & Compliance

#### Use Case 001-012-UC01: Audit Logging
**Description**: Comprehensive audit trail of all actions  
**Implementation**: Global Admin, Tenant Admin, API  
**Acceptance Criteria**: Immutable audit logs

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-012-UC01-WI01 | Task | Audit log database | Secure storage for audit events | API | 8 |
| 001-012-UC01-WI02 | Task | Log all user actions | Capture who, what, when, where | API | 8 |
| 001-012-UC01-WI03 | User Story | Audit log viewer | Search and filter audit logs | Tenant Admin, Global Admin | 8 |
| 001-012-UC01-WI04 | User Story | Export audit logs | Export logs for compliance | Tenant Admin, API | 5 |
| 001-012-UC01-WI05 | Task | Audit log retention | Configure retention policies | API | 5 |
| 001-012-UC01-WI06 | User Story | Audit log alerts | Alert on suspicious activities | API | 8 |

#### Use Case 001-012-UC02: Data Privacy & GDPR
**Description**: Privacy controls and GDPR compliance  
**Implementation**: Tenant Admin, Global Admin, API  
**Acceptance Criteria**: GDPR-compliant data handling

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-012-UC02-WI01 | User Story | Data subject access request | Users can request their data | Tenant Admin, API | 8 |
| 001-012-UC02-WI02 | User Story | Right to be forgotten | Delete user data on request | Tenant Admin, API | 8 |
| 001-012-UC02-WI03 | Task | Data encryption at rest | Encrypt sensitive data in database | API | 8 |
| 001-012-UC02-WI04 | Task | Data encryption in transit | Enforce HTTPS/TLS | API | 5 |
| 001-012-UC02-WI05 | User Story | Privacy policy management | Display and track consent | Tenant Admin, API | 5 |
| 001-012-UC02-WI06 | User Story | Data retention policies | Auto-delete old data | API | 8 |
| 001-012-UC02-WI07 | Task | PII identification | Tag and protect personally identifiable information | API | 8 |

#### Use Case 001-012-UC03: Security Controls
**Description**: Security features and controls  
**Implementation**: Global Admin, API  
**Acceptance Criteria**: Industry-standard security

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-012-UC03-WI01 | Task | IP whitelisting | Restrict access by IP address | API | 5 |
| 001-012-UC03-WI02 | Task | Session timeout | Auto-logout inactive users | API | 3 |
| 001-012-UC03-WI03 | Task | Password policies | Enforce strong passwords | API | 5 |
| 001-012-UC03-WI04 | Task | Brute force protection | Lock accounts after failed attempts | API | 5 |
| 001-012-UC03-WI05 | Task | XSS and CSRF protection | Implement security headers | API | 5 |
| 001-012-UC03-WI06 | Task | SQL injection prevention | Parameterized queries | API | 3 |
| 001-012-UC03-WI07 | User Story | Security dashboard | View security events and threats | Global Admin | 8 |

#### Use Case 001-012-UC04: Compliance Reporting
**Description**: Generate compliance reports  
**Implementation**: Global Admin, Tenant Admin, API  
**Acceptance Criteria**: Reports for various compliance frameworks

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-012-UC04-WI01 | User Story | SOC 2 compliance report | Generate SOC 2 documentation | Global Admin, API | 13 |
| 001-012-UC04-WI02 | User Story | GDPR compliance report | Document GDPR compliance measures | Tenant Admin, API | 8 |
| 001-012-UC04-WI03 | User Story | ISO 27001 documentation | Support ISO certification | Global Admin | 13 |
| 001-012-UC04-WI04 | User Story | Custom compliance reports | Configurable compliance reporting | Global Admin, API | 8 |
| 001-012-UC04-WI05 | Task | Compliance checklist | Track compliance requirements | Global Admin | 5 |

#### Use Case 001-012-UC05: Backup & Disaster Recovery
**Description**: Data backup and recovery procedures  
**Implementation**: Global Admin, API  
**Acceptance Criteria**: Automated backups and tested recovery

| Work Item ID | Type | Title | Description | Implementation Area | Effort (SP) |
|---|---|---|---|---|---|
| 001-012-UC05-WI01 | Task | Automated database backups | Daily backup of all data | API | 8 |
| 001-012-UC05-WI02 | Task | Backup encryption | Encrypt backup files | API | 5 |
| 001-012-UC05-WI03 | Task | Off-site backup storage | Store backups in separate location | API | 5 |
| 001-012-UC05-WI04 | User Story | Backup monitoring | Alert on backup failures | Global Admin, API | 5 |
| 001-012-UC05-WI05 | Task | Recovery procedures | Document and test recovery process | Global Admin | 8 |
| 001-012-UC05-WI06 | User Story | Point-in-time recovery | Restore to specific point in time | API | 8 |

---

## Summary Statistics

### Total Work Items by Epic

| Epic ID | Epic Name | Use Cases | Work Items | Estimated Story Points |
|---|---|---|---|---|
| 001-001 | Visitor Management | 5 | 35 | 175 |
| 001-002 | Parking Management | 5 | 30 | 183 |
| 001-003 | Digital Badges | 5 | 25 | 155 |
| 001-004 | Lockers | 5 | 27 | 149 |
| 001-005 | Space Management | 6 | 37 | 215 |
| 001-006 | User Management | 6 | 36 | 194 |
| 001-007 | Tenant Management | 5 | 25 | 168 |
| 001-008 | Building Management | 5 | 24 | 130 |
| 001-009 | Reporting & Analytics | 5 | 25 | 180 |
| 001-010 | Notifications | 5 | 25 | 164 |
| 001-011 | Integration Hub | 5 | 29 | 196 |
| 001-012 | Security & Compliance | 5 | 30 | 196 |
| **TOTAL** | **12 Epics** | **62 Use Cases** | **348 Work Items** | **~2,105 SP** |

---

## Implementation Area Distribution

| Implementation Area | Approximate Work Items |
|---|---|
| **Tenant Admin** | ~45% of work items |
| **API** | ~85% of work items (many shared with other areas) |
| **Global Admin** | ~25% of work items |
| **API Documentation** | ~2% of work items |

*Note: Percentages add up to more than 100% because many work items span multiple implementation areas*

---

## Development Recommendations

### Phase 1 - Foundation (Months 1-3)
- 001-006: User Management (complete)
- 001-007: Tenant Management (complete)
- 001-008: Building Management (basic setup)
- 001-012: Security & Compliance (core features)

### Phase 2 - Core Modules (Months 4-6)
- 001-001: Visitor Management (complete)
- 001-005: Space Management (complete)
- 001-010: Notifications (complete)

### Phase 3 - Additional Modules (Months 7-9)
- 001-002: Parking Management (complete)
- 001-003: Digital Badges (complete)
- 001-004: Lockers (complete)

### Phase 4 - Advanced Features (Months 10-12)
- 001-009: Reporting & Analytics (complete)
- 001-011: Integration Hub (complete)
- Remaining features from 001-008 and 001-012

---

## Azure DevOps Import Format

To import this into Azure DevOps, you'll need to:

1. **Create the Service** (001) as a custom work item type or Feature
2. **Create each Epic** (001-001 through 001-012) as Epic work items with ParentID set to 001
3. **Create Use Cases** as Features with ParentID set to the respective Epic ID
4. **Create Work Items** as User Stories/Tasks with ParentID set to the respective Use Case ID

### CSV Import Template Structure

```csv
Work Item Type,ID,Title,Description,ParentID,Implementation Area,Story Points
Service,001,NEOX Infinity App,[Description],,All,
Epic,001-001,Visitor Management,[Description],001,Global Admin;Tenant Admin;API,
Feature,001-001-UC01,Visitor Pre-Registration,[Description],001-001,Tenant Admin;API,
User Story,001-001-UC01-WI01,Create visitor registration form,[Description],001-001-UC01,Tenant Admin,5
...
```

---

## Notes

- **Story Points**: Based on Fibonacci scale (1, 2, 3, 5, 8, 13, 21)
- **Effort Estimates**: Assume 1 SP = ~4 hours of development time
- **Total Estimated Time**: ~8,420 hours (~4.2 developer-years)
- **Dependencies**: Many work items have dependencies that should be tracked in Azure DevOps
- **API Work**: Most features require corresponding API work; ensure backend and frontend work is coordinated

---

## Version History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-10-28 | System | Initial comprehensive specification |

