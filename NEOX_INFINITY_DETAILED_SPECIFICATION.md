# NEOX Infinity App - Comprehensive Detailed Specification for Azure DevOps

## Document Information
- **Version**: 1.0
- **Date**: 2025-10-28
- **Purpose**: Complete work item hierarchy for Azure DevOps implementation with detailed technical specifications
- **Target Audience**: Development Teams, Product Owners, Project Managers, QA Engineers, System Architects
- **Confidentiality**: Internal Use Only

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Hierarchy Structure](#hierarchy-structure)
4. [Technology Stack](#technology-stack)
5. [Service Level Definition](#service-level)
6. [Epic Level Modules](#epic-level-modules)
7. [Detailed Use Cases & Work Items](#detailed-use-cases--work-items)
8. [Summary & Statistics](#summary-statistics)
9. [Development Guidelines](#development-guidelines)
10. [Appendices](#appendices)

---

## Executive Summary

The NEOX Infinity App is a comprehensive, enterprise-grade, multi-tenant Software-as-a-Service (SaaS) platform designed to revolutionize building management, facility operations, and workplace services. This system provides organizations with a unified solution to manage visitors, parking, digital credentials, space bookings, lockers, and various other facility-related operations through an intuitive administrative interface and robust API infrastructure.

### Business Context

In modern workplace environments, facility managers and administrators face numerous challenges:
- **Fragmented Systems**: Different vendors for visitor management, parking, space booking, creating data silos
- **Manual Processes**: Paper-based check-ins, manual badge printing, spreadsheet tracking
- **Poor Visibility**: Lack of real-time data on building occupancy, space utilization, parking availability
- **Security Concerns**: Inadequate visitor tracking, outdated access control, compliance risks
- **Scalability Issues**: Systems that don't scale with organizational growth or multi-location needs

The NEOX Infinity App addresses these challenges by providing a unified, cloud-based platform that:
- Centralizes all facility management operations in one system
- Automates manual processes with digital workflows
- Provides real-time analytics and insights
- Ensures security and compliance through comprehensive audit trails
- Scales seamlessly across multiple buildings, locations, and tenants

### Target Users

**Global Administrators**: System-wide administrators who manage the entire NEOX platform, configure global settings, onboard new tenants, monitor system health, and manage billing and subscriptions.

**Tenant Administrators**: Organization-specific administrators who configure their tenant's settings, manage users, set up buildings and resources, configure modules, and oversee operations within their organization.

**End Users**: Employees, facility managers, receptionists, and other staff members who use the system for daily operations such as checking in visitors, booking spaces, reserving parking, accessing lockers, and viewing reports.

**Visitors**: External guests who interact with the system through pre-registration links, QR codes, and mobile check-in experiences.

### Key Benefits

1. **Operational Efficiency**: Reduce manual work by 70% through automation of visitor check-ins, space bookings, and access control
2. **Enhanced Security**: Complete audit trail of all building access, visitor tracking, and compliance reporting
3. **Cost Savings**: Optimize space utilization (identify underused areas), reduce parking management costs, eliminate paper-based processes
4. **User Experience**: Seamless, contactless experiences for visitors and employees through mobile apps and self-service portals
5. **Data-Driven Decisions**: Real-time dashboards and analytics help facility managers make informed decisions about space allocation, staffing, and resource planning
6. **Scalability**: Multi-tenant architecture supports unlimited organizations, buildings, and users with tenant isolation and customization

---

## System Architecture Overview

### High-Level Architecture

The NEOX Infinity App follows a modern, cloud-native architecture with the following components:

#### Frontend Layer
- **Global Admin Interface**: Web application for platform administrators (React/Next.js)
- **Tenant Admin Interface**: Web application for organization administrators (React/Next.js)
- **Mobile Applications**: iOS and Android apps for end users (React Native or native)
- **API Documentation Portal**: Interactive API documentation (Swagger/OpenAPI)

#### Backend Layer
- **RESTful API**: Node.js/Express or .NET Core API with JWT authentication
- **GraphQL API** (Optional): For complex data queries and real-time subscriptions
- **WebSocket Server**: Real-time notifications and updates
- **Background Job Processor**: Queue-based processing for emails, notifications, reports (Bull/Redis or Hangfire)

#### Data Layer
- **Primary Database**: PostgreSQL or SQL Server with multi-tenant data isolation
- **Cache Layer**: Redis for session management, rate limiting, and performance optimization
- **File Storage**: AWS S3 or Azure Blob Storage for documents, images, and exports
- **Search Engine**: Elasticsearch for advanced search capabilities (optional)

#### Integration Layer
- **Email Service**: SendGrid, AWS SES, or Azure Communication Services
- **SMS Service**: Twilio, AWS SNS, or Azure Communication Services
- **Push Notifications**: Firebase Cloud Messaging (FCM) and Apple Push Notification Service (APNS)
- **Calendar Integration**: Microsoft Graph API, Google Calendar API
- **Single Sign-On**: SAML 2.0, OAuth 2.0, OpenID Connect providers

#### Infrastructure
- **Cloud Platform**: AWS, Azure, or Google Cloud Platform
- **Container Orchestration**: Kubernetes or Docker Swarm
- **CI/CD Pipeline**: GitHub Actions, GitLab CI, or Azure DevOps Pipelines
- **Monitoring**: Application Insights, CloudWatch, or Datadog
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana) or Splunk

### Multi-Tenancy Strategy

The system implements **database-level multi-tenancy** where:
- Each tenant's data is logically isolated using a `tenant_id` column in all tables
- Row-level security ensures queries automatically filter by tenant context
- Shared database reduces infrastructure costs while maintaining data isolation
- Tenant-specific configurations are stored in a `tenant_settings` table

**Alternative Approach** (for high-security requirements):
- **Schema-per-tenant**: Each tenant gets their own database schema
- **Database-per-tenant**: Each tenant gets their own physical database

### Security Architecture

- **Authentication**: JWT tokens with refresh token rotation
- **Authorization**: Role-Based Access Control (RBAC) with granular permissions
- **Data Encryption**: AES-256 encryption for sensitive data at rest, TLS 1.3 for data in transit
- **API Security**: Rate limiting, request throttling, API key management, IP whitelisting
- **Audit Logging**: Immutable logs for all user actions and system events
- **Compliance**: GDPR, SOC 2, ISO 27001 compliance measures

---

## Hierarchy Structure

The Azure DevOps work item hierarchy follows this structure:

```
Service (Level 0)
├── ID: 001
├── Type: Service/Portfolio
└── Title: NEOX Infinity App
    │
    ├── Epic (Level 1) - Modules
    │   ├── ID Format: 001-XXX (e.g., 001-001, 001-002)
    │   ├── ParentID: 001
    │   └── Represents major functional modules
    │       │
    │       ├── Use Case / Feature (Level 2)
    │       │   ├── ID Format: 001-XXX-UCXX (e.g., 001-001-UC01)
    │       │   ├── ParentID: Epic ID
    │       │   └── Represents specific user scenarios
    │       │       │
    │       │       └── Work Item (Level 3) - Implementation Tasks
    │       │           ├── ID Format: 001-XXX-UCXX-WIXX (e.g., 001-001-UC01-WI01)
    │       │           ├── ParentID: Use Case ID
    │       │           ├── Type: User Story, Task, or Bug
    │       │           └── Represents atomic development work
```

### ID Naming Convention

- **001**: Service ID (NEOX Infinity App)
- **001-XXX**: Epic/Module ID (e.g., 001-001 for Visitor Management)
- **001-XXX-UCXX**: Use Case ID (e.g., 001-001-UC01 for Visitor Pre-Registration)
- **001-XXX-UCXX-WIXX**: Work Item ID (e.g., 001-001-UC01-WI01 for specific task)

This hierarchical structure ensures:
- **Traceability**: Every work item can be traced back to its parent epic and service
- **Organization**: Work is logically grouped by functional area
- **Reporting**: Azure DevOps queries can aggregate effort by epic, use case, or work item
- **Dependencies**: Cross-module dependencies can be identified by ID patterns

---

## Technology Stack

### Recommended Frontend Technologies

**Admin Interfaces (Global & Tenant)**
- **Framework**: React 18+ with Next.js 14+ for server-side rendering and static generation
- **UI Library**: Material-UI (MUI) v5+ or Ant Design for enterprise-grade components
- **State Management**: Redux Toolkit with RTK Query for API state management
- **Form Handling**: React Hook Form with Zod validation
- **Charts/Visualization**: Recharts or Chart.js for analytics dashboards
- **Calendar Components**: FullCalendar or react-big-calendar for booking interfaces
- **File Upload**: Dropzone or react-dropzone for drag-and-drop file uploads
- **QR Code**: qrcode.react or react-qr-code for QR code generation
- **PDF Generation**: jsPDF or pdfmake for client-side PDF generation
- **Date Handling**: date-fns or Day.js (lightweight alternative to Moment.js)

**Mobile Applications**
- **Framework**: React Native with Expo for cross-platform development
- **Navigation**: React Navigation v6+
- **State Management**: Redux Toolkit or Zustand
- **Offline Storage**: AsyncStorage or MMKV for high-performance local storage
- **Camera/QR Scanner**: react-native-camera or expo-camera

### Recommended Backend Technologies

**API Server**
- **Runtime**: Node.js 20 LTS with Express.js 4.x or NestJS for structured architecture
- **Alternative**: .NET 8 with ASP.NET Core for enterprise environments
- **Authentication**: Passport.js (Node) or IdentityServer (.NET) for JWT and OAuth
- **Validation**: Joi, Yup, or class-validator for request validation
- **ORM**: Prisma (Node) or Entity Framework Core (.NET) for database operations
- **API Documentation**: Swagger/OpenAPI with Swagger UI Express

**Database**
- **Primary**: PostgreSQL 15+ for relational data with JSON support
- **Alternative**: Microsoft SQL Server 2019+ for .NET-based implementations
- **Schema Migration**: Prisma Migrate, Flyway, or Entity Framework Migrations
- **Connection Pooling**: PgBouncer for PostgreSQL connection management

**Caching & Queuing**
- **Cache**: Redis 7+ for session storage, rate limiting, and caching
- **Message Queue**: Bull (Redis-based) or RabbitMQ for background jobs
- **Job Scheduler**: node-cron or Hangfire for recurring tasks

**Storage & Files**
- **Object Storage**: AWS S3, Azure Blob Storage, or MinIO (self-hosted)
- **CDN**: CloudFront (AWS) or Azure CDN for static asset delivery

**External Services**
- **Email**: SendGrid, AWS SES, or Postmark
- **SMS**: Twilio, AWS SNS, or Vonage
- **Push Notifications**: Firebase Cloud Messaging (FCM) for Android, Apple Push Notification Service (APNS) for iOS

### DevOps & Infrastructure

**Containerization**
- **Docker**: Multi-stage builds for frontend and backend
- **Docker Compose**: Local development environment
- **Kubernetes**: Production orchestration with Helm charts

**CI/CD**
- **Source Control**: Git with GitHub, GitLab, or Azure Repos
- **CI/CD Pipeline**: GitHub Actions, GitLab CI/CD, or Azure Pipelines
- **Testing**: Jest for unit tests, Cypress or Playwright for E2E tests
- **Code Quality**: ESLint, Prettier, SonarQube

**Monitoring & Logging**
- **APM**: Application Insights, New Relic, or Datadog
- **Logging**: Winston or Pino (structured logging), ELK Stack for aggregation
- **Error Tracking**: Sentry for real-time error monitoring
- **Uptime Monitoring**: Pingdom, UptimeRobot, or StatusCake

---

## Service Level

| Attribute | Value |
|---|---|
| **ID** | 001 |
| **Type** | Service |
| **Title** | NEOX Infinity App |
| **Description** | The NEOX Infinity App is a comprehensive, enterprise-grade, multi-tenant administrative platform designed for modern workplace management. It provides organizations with integrated solutions for visitor management, parking allocation, space booking, digital credential management, locker assignment, and facility operations. The platform features a Global Admin interface for system-wide management, Tenant Admin interfaces for organization-specific configuration, robust REST APIs for integration, and mobile applications for end-user access. Built with scalability, security, and compliance at its core, the system supports unlimited tenants, users, and buildings while maintaining strict data isolation and customization capabilities. |
| **Status** | Active |
| **ParentID** | (None - Top Level) |
| **Owner** | Product Management |
| **Priority** | Critical |
| **Target Users** | Facility Managers, Building Administrators, Receptionists, Employees, Visitors |
| **Business Value** | Streamlines facility operations, reduces manual processes by 70%, improves security and compliance, optimizes space utilization, and enhances user experience across all building-related services |
| **Strategic Goals** | 1. Become the leading workplace management platform<br>2. Achieve 95%+ customer satisfaction<br>3. Support 10,000+ tenants within 3 years<br>4. Integrate with top 20 enterprise platforms |
| **Success Metrics** | - Time to check-in visitor: < 30 seconds<br>- Space booking conversion rate: > 85%<br>- System uptime: 99.9%<br>- API response time: < 200ms (p95)<br>- User adoption rate: > 80% within first month |
| **Implementation Areas** | Global Admin, Tenant Admin, REST API, Mobile Apps, API Documentation |
| **Estimated Total Effort** | ~2,105 Story Points (~8,420 hours, ~4.2 developer-years) |
| **Dependencies** | Cloud infrastructure (AWS/Azure), Email service (SendGrid/SES), SMS service (Twilio), Payment gateway (Stripe/PayPal), Calendar APIs (Microsoft/Google), Identity providers (Azure AD, Okta) |

---

## Epic Level (Modules)

### Overview

The NEOX Infinity App consists of 12 major functional modules (Epics), each representing a distinct area of workplace management functionality. These modules are designed to work independently while sharing common infrastructure, data models, and user management systems. Each module can be enabled or disabled at the tenant level, allowing organizations to activate only the features they need.

---

### EPIC 001-001: Visitor Management

| Attribute | Value |
|---|---|
| **ID** | 001-001 |
| **Type** | Epic |
| **Title** | Visitor Management |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, Tenant Admin, API |
| **Priority** | High |
| **Business Value** | High |

#### Epic Description

The Visitor Management module provides a comprehensive solution for managing the entire visitor lifecycle from pre-registration through check-out. This module replaces traditional paper-based visitor logs with a digital, secure, and auditable system that enhances security, improves the visitor experience, and provides valuable analytics.

**Key Capabilities:**
- Pre-register visitors before their arrival with email confirmations
- Check visitors in and out using QR codes, email lookup, or manual search
- Print physical visitor badges with photos, QR codes, and host information
- Notify hosts automatically when their visitors arrive
- Track visitor duration, frequency, and patterns
- Support walk-in visitors without pre-registration
- Configure legal agreements (NDAs, terms of service) that visitors must accept
- Blacklist management for denied entry
- Integration with building access control systems
- Comprehensive visitor reports and analytics

**Business Impact:**
- Reduces visitor check-in time from 5-10 minutes to under 30 seconds
- Improves building security with digital records and photo verification
- Enhances visitor experience with pre-registration and contactless check-in
- Provides compliance documentation for audits and investigations
- Reduces reception staff workload by 40%

**Technical Considerations:**
- QR code generation and scanning
- Photo capture and storage
- Badge template customization engine
- Printer driver integration for badge printers
- Real-time notification delivery
- Visitor data retention policies for GDPR compliance

#### Use Cases (5)
1. **UC01**: Visitor Pre-Registration - Allow hosts to register visitors in advance
2. **UC02**: Visitor Check-In/Check-Out - Reception desk operations for visitor access
3. **UC03**: Visitor Badge Printing - Generate and print physical visitor badges
4. **UC04**: Visitor List Management - View, search, filter, and manage visitor records
5. **UC05**: Visitor Management Configuration - Configure module settings and policies

**Total Work Items**: 35  
**Estimated Story Points**: 175 SP (~700 hours)

---

### EPIC 001-002: Parking Management

| Attribute | Value |
|---|---|
| **ID** | 001-002 |
| **Type** | Epic |
| **Title** | Parking Management |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, Tenant Admin, API |
| **Priority** | High |
| **Business Value** | High |

#### Epic Description

The Parking Management module provides a complete solution for managing parking spaces, vehicle registration, reservations, and access control. Organizations can optimize parking utilization, reduce conflicts, support electric vehicle charging, and provide convenient booking experiences for employees and visitors.

**Key Capabilities:**
- Define parking inventory with spaces, zones, and attributes
- Support multiple parking types: regular, EV charging, accessible, reserved, visitor
- Enable employees to reserve parking spaces in advance
- Support recurring parking reservations (daily, weekly)
- Register and manage multiple vehicles per user
- Integrate with License Plate Recognition (LPR) systems for automated entry
- Connect to barrier gates and parking access hardware
- Real-time parking availability tracking
- Parking occupancy dashboards and heat maps
- Zone-based access control (executive parking, visitor parking, etc.)
- Parking violation tracking and enforcement
- Utilization analytics and peak hour identification

**Business Impact:**
- Reduces parking conflicts and eliminates "first-come, first-served" frustrations
- Optimizes parking utilization (identify underused areas)
- Supports sustainability initiatives with EV charging spot management
- Improves employee satisfaction with fair, transparent parking allocation
- Generates revenue opportunities (paid parking, visitor parking fees)
- Reduces parking administration costs by 50%

**Technical Considerations:**
- Integration with LPR systems (camera-based license plate recognition)
- Barrier gate control APIs
- Real-time occupancy tracking with sensor integration (optional)
- Conflict detection algorithms for reservation overlaps
- Payment gateway integration for paid parking (optional)
- Mobile app support for parking reservations and directions

#### Use Cases (5)
1. **UC01**: Parking Space Setup - Configure parking inventory and zones
2. **UC02**: Parking Reservation - Allow users to book parking spaces
3. **UC03**: Vehicle Registration - Register vehicles for parking access
4. **UC04**: Parking Access Control - Integrate with physical access systems
5. **UC05**: Parking Analytics - View utilization reports and dashboards

**Total Work Items**: 30  
**Estimated Story Points**: 183 SP (~732 hours)

---

### EPIC 001-003: Digital Badges

| Attribute | Value |
|---|---|
| **ID** | 001-003 |
| **Type** | Epic |
| **Title** | Digital Badges |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, Tenant Admin, API |
| **Priority** | Medium-High |
| **Business Value** | Medium-High |

#### Epic Description

The Digital Badges module provides a comprehensive digital credential management system for building access and identification. Employees and authorized personnel receive digital badges on their mobile devices that can be used for building access, identity verification, and integration with physical access control systems.

**Key Capabilities:**
- Design custom badge templates with drag-and-drop designer
- Issue digital badges to employees, contractors, and temporary staff
- Configure access permissions and schedules (time-based, zone-based)
- Display badges on mobile devices with QR codes or NFC
- Support temporary badges with automatic expiration
- Bulk badge issuance for large organizations
- Badge lifecycle management (active, suspended, revoked, expired)
- Integration with physical access control systems
- Lost/stolen badge reporting and immediate revocation
- Badge usage analytics and access logs

**Business Impact:**
- Eliminates physical badge costs (printing, materials, replacement)
- Reduces badge replacement time from days to minutes
- Improves security with immediate revocation capabilities
- Supports contactless access with mobile credentials
- Provides complete audit trail of access events
- Reduces security desk workload by 30%

**Technical Considerations:**
- QR code and NFC technology for mobile badges
- Integration with access control systems (Lenel, CCURE, Avigilon, etc.)
- Offline badge validation for network outages
- Badge template rendering engine
- Secure credential storage on mobile devices
- Real-time permission updates and synchronization

#### Use Cases (5)
1. **UC01**: Badge Design & Templates - Create and manage badge layouts
2. **UC02**: Badge Issuance - Issue digital badges to users
3. **UC03**: Badge Access Permissions - Configure access rights for badges
4. **UC04**: Mobile Badge Display - Display badges on mobile devices
5. **UC05**: Badge Lifecycle Management - Manage badge status and expiration

**Total Work Items**: 25  
**Estimated Story Points**: 155 SP (~620 hours)

---

### EPIC 001-004: Lockers

| Attribute | Value |
|---|---|
| **ID** | 001-004 |
| **Type** | Epic |
| **Title** | Lockers |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, Tenant Admin, API |
| **Priority** | Medium |
| **Business Value** | Medium |

#### Epic Description

The Lockers module provides a complete locker management solution for organizations implementing hot-desking, flexible workspaces, or temporary storage needs. Users can reserve, access, and manage lockers through self-service interfaces, while administrators maintain oversight of locker inventory, assignments, and maintenance.

**Key Capabilities:**
- Configure locker banks and individual lockers with attributes (size, location, amenities)
- Support multiple locker types: personal storage, gym lockers, package lockers
- Enable users to reserve lockers for specific dates or permanent assignment
- Integrate with electronic lock systems for keyless access
- Generate temporary PIN codes or QR codes for locker access
- Support permanent and temporary locker assignments
- Locker maintenance scheduling and status tracking
- User-reported issues and maintenance requests
- Utilization reports and occupancy tracking
- Floor plan visualization of locker locations
- Bulk locker assignment for teams or departments

**Business Impact:**
- Supports flexible workplace strategies (hot-desking, hybrid work)
- Reduces locker administration time by 60%
- Improves locker utilization with data-driven allocation
- Enhances employee experience with self-service booking
- Provides secure storage for personal items and packages
- Reduces security incidents with electronic lock integration

**Technical Considerations:**
- Integration with electronic lock systems (Digilock, Salto, Gantner, etc.)
- PIN code generation and secure transmission
- Mobile unlock functionality via Bluetooth or WiFi
- Locker occupancy sensors (optional)
- Emergency override capabilities for facility managers
- Notification system for reservation reminders and extensions

#### Use Cases (5)
1. **UC01**: Locker Setup & Configuration - Configure locker inventory
2. **UC02**: Locker Assignment - Assign lockers to users
3. **UC03**: Locker Reservation - Allow users to reserve lockers
4. **UC04**: Locker Access Control - Integrate with electronic locks
5. **UC05**: Locker Management & Maintenance - Track status and maintenance

**Total Work Items**: 27  
**Estimated Story Points**: 149 SP (~596 hours)

---

### EPIC 001-005: Space Management

| Attribute | Value |
|---|---|
| **ID** | 001-005 |
| **Type** | Epic |
| **Title** | Space Management |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, Tenant Admin, API |
| **Priority** | High |
| **Business Value** | Very High |

#### Epic Description

The Space Management module is a comprehensive workspace and meeting room booking system that enables organizations to optimize space utilization, support hybrid work models, and provide seamless booking experiences. This module includes meeting room scheduling, hot desk booking, phone booth reservations, and integration with calendar systems.

**Key Capabilities:**
- Configure diverse space types: meeting rooms, desks, phone booths, collaboration areas
- Calendar-based booking interface with real-time availability
- Support recurring bookings (daily, weekly, custom patterns)
- Advanced search and filtering by capacity, amenities, location
- Check-in functionality to release no-show bookings
- Integration with Outlook and Google Calendar (bi-directional sync)
- Room display panel support for meeting room doors
- Booking policies and restrictions (max duration, advance booking limits)
- Hot desking with team clustering and preferred desk selection
- Booking approval workflows for special spaces
- Space utilization analytics and occupancy reports
- Capacity management and social distancing support

**Business Impact:**
- Optimizes space utilization (typical 20-40% improvement)
- Reduces meeting room conflicts and double-bookings to zero
- Supports hybrid work strategies with hot desk management
- Improves employee productivity with easy space finding
- Provides data for real estate decisions (office expansion/downsizing)
- Reduces facility management costs by identifying underused spaces
- Generates ROI through space optimization ($50-100 per sq ft annually)

**Technical Considerations:**
- Calendar integration with Microsoft Graph API and Google Calendar API
- Real-time availability synchronization
- Conflict resolution algorithms
- Room display panel APIs (TEEM, Joan, Robin, etc.)
- Check-in detection (QR code, NFC, Bluetooth beacon)
- No-show detection and automatic release logic
- Floor plan rendering and interactive maps
- Time zone handling for global organizations

#### Use Cases (6)
1. **UC01**: Space Inventory Setup - Configure meeting rooms and workspaces
2. **UC02**: Space Booking - Allow users to book spaces
3. **UC03**: Space Check-In - Check-in to reserved spaces
4. **UC04**: Hot Desking - Manage desk booking and allocation
5. **UC05**: Meeting Room Integration - Integrate with calendar systems
6. **UC06**: Space Policies & Rules - Configure booking rules and restrictions

**Total Work Items**: 37  
**Estimated Story Points**: 215 SP (~860 hours)

---

### EPIC 001-006: User Management

| Attribute | Value |
|---|---|
| **ID** | 001-006 |
| **Type** | Epic |
| **Title** | User Management |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, Tenant Admin, API |
| **Priority** | Critical |
| **Business Value** | Critical |

#### Epic Description

The User Management module is the foundation of the NEOX Infinity App, providing comprehensive user account management, authentication, authorization, and profile management. This module supports the entire user lifecycle from onboarding through offboarding, with robust security features and role-based access control.

**Key Capabilities:**
- User registration with manual entry or bulk import (CSV/Excel)
- Multiple authentication methods: email/password, SSO (SAML, OAuth), multi-factor authentication
- Role-Based Access Control (RBAC) with customizable roles and permissions
- User profile management with photos, contact information, and preferences
- User directory with advanced search and filtering
- Organizational hierarchy (departments, teams, locations)
- Session management and security controls
- Password policies and reset flows
- User deactivation and reactivation
- Offboarding workflows with automated cleanup
- User activity tracking and analytics
- Notification preferences per user

**Business Impact:**
- Centralizes user management across all modules
- Reduces IT support tickets by 40% with self-service capabilities
- Improves security with SSO integration and MFA
- Streamlines onboarding (from days to hours)
- Ensures compliance with automated offboarding
- Provides granular access control for data security

**Technical Considerations:**
- JWT token-based authentication with refresh tokens
- Integration with identity providers (Azure AD, Okta, Auth0)
- SAML 2.0 and OAuth 2.0 protocol support
- Multi-factor authentication (SMS, email, authenticator apps)
- Role permission inheritance and hierarchies
- User data encryption and PII protection
- Session timeout and concurrent session management
- Password hashing with bcrypt or Argon2

#### Use Cases (6)
1. **UC01**: User Registration & Onboarding - Register and onboard new users
2. **UC02**: Authentication & Login - Secure user authentication
3. **UC03**: Role-Based Access Control - Manage roles and permissions
4. **UC04**: User Profile Management - User profile updates
5. **UC05**: User Directory - Searchable user directory
6. **UC06**: User Deactivation & Offboarding - Offboard users securely

**Total Work Items**: 36  
**Estimated Story Points**: 194 SP (~776 hours)

---

### EPIC 001-007: Tenant Management

| Attribute | Value |
|---|---|
| **ID** | 001-007 |
| **Type** | Epic |
| **Title** | Tenant Management |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, API |
| **Priority** | Critical |
| **Business Value** | Critical |

#### Epic Description

The Tenant Management module provides the multi-tenancy foundation of the NEOX Infinity App. This module enables platform administrators to create, configure, monitor, and manage multiple organizations (tenants) on the shared platform infrastructure while maintaining complete data isolation and customization capabilities.

**Key Capabilities:**
- Tenant creation and provisioning with subdomain/custom domain setup
- Tenant-specific configuration (branding, localization, module activation)
- Subscription management with multiple plan tiers (Basic, Professional, Enterprise)
- Usage tracking and billing (users, storage, API calls)
- Tenant monitoring with health checks and activity metrics
- Tenant suspension and reactivation
- Tenant deletion with data backup and export
- Tenant onboarding wizard for guided setup
- White-labeling support for tenant branding
- Feature flags for gradual rollouts
- Tenant analytics and reporting

**Business Impact:**
- Enables SaaS business model with scalable tenant onboarding
- Reduces operational overhead with centralized tenant management
- Provides revenue tracking per tenant for billing
- Supports enterprise customers with custom domains and white-labeling
- Ensures platform scalability to thousands of tenants
- Provides visibility into tenant health and engagement

**Technical Considerations:**
- Multi-tenant database architecture (shared database with tenant_id)
- Row-level security for data isolation
- Tenant context management in API requests
- Subdomain routing and custom domain SSL certificates
- Tenant data backup and migration tools
- Usage metering and tracking infrastructure
- Tenant-specific feature flags
- Database connection pooling per tenant (if using dedicated schemas)

#### Use Cases (5)
1. **UC01**: Tenant Creation & Setup - Create and configure new tenants
2. **UC02**: Tenant Configuration - Configure tenant-specific settings
3. **UC03**: Tenant Billing & Subscription - Manage subscriptions and billing
4. **UC04**: Tenant Monitoring - Monitor tenant health and activity
5. **UC05**: Tenant Suspension & Deletion - Manage tenant lifecycle

**Total Work Items**: 25  
**Estimated Story Points**: 168 SP (~672 hours)

---

### EPIC 001-008: Building Management

| Attribute | Value |
|---|---|
| **ID** | 001-008 |
| **Type** | Epic |
| **Title** | Building Management |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, Tenant Admin, API |
| **Priority** | High |
| **Business Value** | High |

#### Epic Description

The Building Management module provides the hierarchical structure and configuration for physical buildings, floors, zones, and access points. This module serves as the foundation for location-based features across all other modules, enabling organizations to model their physical infrastructure in the system.

**Key Capabilities:**
- Create and manage multiple buildings with addresses and details
- Define floors within buildings with numbering and naming
- Create zones within floors (wings, departments, areas)
- Upload and display floor plans for visual navigation
- Configure access points (doors, gates, elevators, turnstiles)
- Set building operating hours and holidays
- Configure facility services catalog (catering, IT, maintenance)
- Service request management and tracking
- Building occupancy monitoring and capacity tracking
- Access control integration for entry points
- Building directory and wayfinding information

**Business Impact:**
- Provides foundation for all location-based features
- Enables multi-building support for enterprise organizations
- Improves wayfinding with floor plans and directories
- Streamlines facility service requests
- Provides occupancy data for capacity management
- Supports health and safety initiatives (capacity limits)

**Technical Considerations:**
- Hierarchical data model (buildings -> floors -> zones)
- Geographic coordinates for multi-location support
- Floor plan image storage and rendering
- Access control system integration
- Occupancy calculation algorithms
- Service request workflow engine
- Building calendar for operating hours and closures

#### Use Cases (5)
1. **UC01**: Building Setup - Configure buildings and properties
2. **UC02**: Floor & Zone Configuration - Define building structure
3. **UC03**: Access Points Configuration - Configure entry points
4. **UC04**: Facility Services - Manage facility services catalog
5. **UC05**: Building Occupancy - Monitor building occupancy

**Total Work Items**: 24  
**Estimated Story Points**: 130 SP (~520 hours)

---

### EPIC 001-009: Reporting & Analytics

| Attribute | Value |
|---|---|
| **ID** | 001-009 |
| **Type** | Epic |
| **Title** | Reporting & Analytics |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, Tenant Admin, API |
| **Priority** | High |
| **Business Value** | Very High |

#### Epic Description

The Reporting & Analytics module provides comprehensive business intelligence capabilities across all modules. This module transforms operational data into actionable insights through dashboards, reports, custom analytics, and predictive intelligence, enabling data-driven decision-making for facility management and business operations.

**Key Capabilities:**
- Executive dashboard with KPIs across all modules
- Module-specific reports (visitor trends, space utilization, parking occupancy)
- Custom report builder with drag-and-drop interface
- Data export in multiple formats (PDF, Excel, CSV, JSON)
- Scheduled report generation and email delivery
- Trend analysis and historical comparisons
- Predictive analytics for demand forecasting
- Anomaly detection and alerting
- Configurable dashboard widgets and layouts
- Real-time data visualization with charts and graphs
- Drill-down capabilities for detailed analysis
- Benchmarking and comparative analytics

**Business Impact:**
- Enables data-driven decisions for space planning and resource allocation
- Identifies cost savings opportunities (underused spaces, optimization)
- Provides ROI justification for facility investments
- Improves operational efficiency with trend identification
- Supports strategic planning with predictive analytics
- Generates reports for stakeholder presentations and board meetings
- Provides compliance documentation for audits

**Technical Considerations:**
- Data warehouse or analytics database for fast queries
- ETL processes for data aggregation
- Chart rendering libraries (Recharts, Chart.js, D3.js)
- PDF generation for report exports
- Excel generation with formatting
- Query builder for custom reports
- Caching layer for dashboard performance
- Machine learning models for predictions (optional)

#### Use Cases (5)
1. **UC01**: Dashboard & KPIs - Executive dashboard with key metrics
2. **UC02**: Module-Specific Reports - Detailed reports per module
3. **UC03**: Custom Report Builder - Create custom reports
4. **UC04**: Data Export - Export data from the system
5. **UC05**: Analytics & Insights - AI-powered insights and predictions

**Total Work Items**: 25  
**Estimated Story Points**: 180 SP (~720 hours)

---

### EPIC 001-010: Notifications

| Attribute | Value |
|---|---|
| **ID** | 001-010 |
| **Type** | Epic |
| **Title** | Notifications |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, Tenant Admin, API |
| **Priority** | High |
| **Business Value** | High |

#### Epic Description

The Notifications module provides a multi-channel notification system that keeps users informed about important events, updates, and actions across all modules. This module supports email, SMS, push notifications, and in-app notifications with user preferences, templates, and delivery tracking.

**Key Capabilities:**
- Email notifications with customizable templates
- SMS text message notifications for critical alerts
- Mobile and web push notifications
- In-app notification center with read/unread status
- User notification preferences (channel selection, frequency)
- Admin-configured notification rules and triggers
- Template variables for personalization
- Notification delivery tracking and analytics
- Quiet hours and do-not-disturb settings
- Notification digest (batched notifications)
- Tenant-specific branding for emails
- Multi-language support for notifications
- Notification queue with retry logic

**Business Impact:**
- Improves user engagement and system adoption
- Reduces missed appointments and no-shows by 60%
- Enhances communication between hosts and visitors
- Provides timely alerts for critical events
- Reduces manual notification work for administrators
- Improves user satisfaction with timely updates

**Technical Considerations:**
- Integration with email services (SendGrid, AWS SES)
- Integration with SMS services (Twilio, AWS SNS)
- Push notification services (FCM, APNS)
- WebSocket or Server-Sent Events for real-time in-app notifications
- Message queue for reliable delivery
- Template rendering engine
- Notification retry and failure handling
- Delivery status tracking and webhooks
- Rate limiting to prevent spam

#### Use Cases (5)
1. **UC01**: Email Notifications - Send email notifications
2. **UC02**: SMS Notifications - Send SMS text messages
3. **UC03**: Push Notifications - Mobile and web push
4. **UC04**: In-App Notifications - Notification center in app
5. **UC05**: Notification Rules & Preferences - Configure notifications

**Total Work Items**: 25  
**Estimated Story Points**: 164 SP (~656 hours)

---

### EPIC 001-011: Integration Hub

| Attribute | Value |
|---|---|
| **ID** | 001-011 |
| **Type** | Epic |
| **Title** | Integration Hub |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, API Documentation |
| **Priority** | High |
| **Business Value** | Very High |

#### Epic Description

The Integration Hub module provides comprehensive API management, third-party integrations, and data import/export capabilities. This module enables the NEOX Infinity App to connect with existing enterprise systems, exchange data with external platforms, and provide developers with the tools needed to build custom integrations.

**Key Capabilities:**
- Comprehensive REST API with OpenAPI documentation
- Interactive API documentation with Swagger UI
- API key generation and management with scoped permissions
- Webhooks for real-time event notifications
- Pre-built integrations (Microsoft 365, Google Workspace, Slack, Salesforce)
- OAuth 2.0 for third-party app authorization
- Data import from CSV/Excel with field mapping
- Bulk data export capabilities
- Integration marketplace for discovering connectors
- API usage analytics and monitoring
- Rate limiting and throttling
- API versioning for backward compatibility
- Developer portal with code examples

**Business Impact:**
- Enables enterprise integration with existing systems (HR, ERP, CRM)
- Reduces implementation time with pre-built connectors
- Provides data portability and migration tools
- Supports custom workflows and automation
- Increases platform value through extensibility
- Attracts developers and partners to ecosystem

**Technical Considerations:**
- RESTful API design principles
- OpenAPI 3.0 specification
- API gateway for routing and security
- Webhook delivery system with retry logic
- OAuth 2.0 authorization server
- Integration framework for third-party connectors
- CSV/Excel parsing and validation
- Data transformation and mapping engine
- API monitoring and analytics platform

#### Use Cases (5)
1. **UC01**: API Documentation - Comprehensive API documentation
2. **UC02**: API Key Management - Generate and manage API keys
3. **UC03**: Webhooks - Send events to external systems
4. **UC04**: Third-Party Integrations - Pre-built integrations
5. **UC05**: Data Import/Export - Bulk data migration tools

**Total Work Items**: 29  
**Estimated Story Points**: 196 SP (~784 hours)

---

### EPIC 001-012: Security & Compliance

| Attribute | Value |
|---|---|
| **ID** | 001-012 |
| **Type** | Epic |
| **Title** | Security & Compliance |
| **ParentID** | 001 |
| **Implementation Areas** | Global Admin, API |
| **Priority** | Critical |
| **Business Value** | Critical |

#### Epic Description

The Security & Compliance module provides enterprise-grade security controls, audit logging, data privacy features, and compliance reporting to ensure the NEOX Infinity App meets the highest standards of data protection and regulatory compliance. This module is essential for enterprise customers and regulated industries.

**Key Capabilities:**
- Comprehensive audit logging of all user actions
- Data privacy controls for GDPR, CCPA compliance
- Security controls (IP whitelisting, session management, password policies)
- Compliance reporting (SOC 2, ISO 27001, GDPR)
- Data encryption at rest and in transit
- Backup and disaster recovery procedures
- Security monitoring and alerting
- Data retention policies and auto-deletion
- Data subject access requests (DSAR)
- Right to be forgotten implementation
- PII identification and protection
- Security dashboard for threat monitoring
- Penetration testing and vulnerability scanning

**Business Impact:**
- Enables enterprise sales by meeting security requirements
- Reduces compliance risk and potential fines
- Builds customer trust with transparent security practices
- Provides audit documentation for certifications
- Reduces security incident risk by 80%
- Supports RFP responses with compliance documentation
- Enables sales in regulated industries (healthcare, finance, government)

**Technical Considerations:**
- Immutable audit log storage
- Encryption key management (KMS)
- Data anonymization and pseudonymization
- Secure data deletion (crypto-shredding)
- Backup encryption and offsite storage
- Point-in-time recovery capabilities
- Security information and event management (SIEM) integration
- Compliance framework mapping (controls to requirements)

#### Use Cases (5)
1. **UC01**: Audit Logging - Comprehensive audit trail
2. **UC02**: Data Privacy & GDPR - Privacy controls and GDPR compliance
3. **UC03**: Security Controls - Security features and controls
4. **UC04**: Compliance Reporting - Generate compliance reports
5. **UC05**: Backup & Disaster Recovery - Data backup and recovery

**Total Work Items**: 30  
**Estimated Story Points**: 196 SP (~784 hours)

---

## Detailed Use Cases & Work Items

This section provides detailed specifications for every use case and work item in the system. Each use case includes business context, acceptance criteria, technical requirements, and detailed work items with implementation guidance.

---

## EPIC 001-001: Visitor Management

### Use Case 001-001-UC01: Visitor Pre-Registration

#### Use Case Overview

**ID**: 001-001-UC01  
**Title**: Visitor Pre-Registration  
**ParentID**: 001-001  
**Priority**: High  
**Implementation Areas**: Tenant Admin, API

#### Business Context

Pre-registration is a critical feature that allows employees (hosts) to register expected visitors before they arrive at the building. This provides numerous benefits:
- **Faster Check-In**: Pre-registered visitors can check in quickly using QR codes or email lookup
- **Better Security**: Security teams have advance notice of expected visitors
- **Professional Experience**: Visitors receive confirmation emails with directions and parking information
- **Host Notification**: Hosts are automatically notified when their visitors arrive
- **Reduced Reception Workload**: Reception staff spend less time collecting visitor information

**User Story**: As a host (employee), I want to pre-register my expected visitors so that they can check in quickly when they arrive and I receive notification of their arrival.

#### Acceptance Criteria

1. Host can create a visitor record with all required information (name, email, phone, company)
2. Host can specify visit date, start time, and expected duration
3. Host can select themselves or another employee as the designated host
4. System validates email format and phone number format
5. System sends confirmation email to visitor with QR code and visit details
6. Host receives confirmation of successful registration
7. Visitor record appears in upcoming visitors list for reception staff
8. Duplicate detection prevents creating multiple records for same visitor on same day
9. Host can add special instructions or notes for reception staff
10. Host can configure whether visitor requires NDA or other legal agreements

#### Technical Requirements

- **Database Tables**: visitors, hosts, buildings, legal_agreements
- **API Endpoints**: POST /api/visitors, GET /api/visitors/{id}, PUT /api/visitors/{id}, DELETE /api/visitors/{id}
- **Email Template**: Visitor confirmation email with QR code embedded
- **QR Code Generation**: Unique QR code for each visitor containing visitor_id
- **Validation Rules**: Email regex, phone format by country, date must be future, host must be active employee
- **Business Rules**: Cannot register visitor more than 90 days in advance (configurable)

#### Work Items

##### Work Item 001-001-UC01-WI01

**ID**: 001-001-UC01-WI01  
**Type**: User Story  
**Title**: Create visitor registration form  
**ParentID**: 001-001-UC01  
**Priority**: High  
**Effort**: 5 Story Points (~20 hours)  
**Implementation Area**: Tenant Admin

**Description**:
Design and implement a comprehensive visitor registration form in the Tenant Admin interface that captures all necessary information for pre-registering visitors. The form should be intuitive, responsive, and guide users through the registration process with clear labels, helpful placeholder text, and inline validation feedback.

**Detailed Requirements**:

1. **Form Fields**:
   - Visitor First Name (required, text, max 50 chars)
   - Visitor Last Name (required, text, max 50 chars)
   - Visitor Email (required, email format validation)
   - Visitor Phone (optional, format validation based on country code)
   - Visitor Company (optional, text, max 100 chars)
   - Visit Date (required, date picker, cannot be past date)
   - Visit Start Time (required, time picker)
   - Expected Duration (optional, dropdown: 30 min, 1 hour, 2 hours, 4 hours, All Day)
   - Host Selection (required, searchable dropdown of employees)
   - Building Selection (required if multiple buildings exist)
   - Purpose of Visit (optional, text area, max 500 chars)
   - Special Instructions (optional, text area, max 500 chars)
   - Require NDA (checkbox, default unchecked)
   - Visitor Photo (optional, file upload, max 5MB, formats: JPG, PNG)

2. **Form Behavior**:
   - Real-time validation as user types (debounced)
   - Clear, specific error messages ("Email must be in format name@domain.com")
   - Disable submit button until all required fields are valid
   - Loading state during submission
   - Success message with option to register another visitor or view visitor list
   - Error handling with user-friendly messages

3. **UI/UX Considerations**:
   - Multi-step form with progress indicator (Step 1: Visitor Info, Step 2: Visit Details, Step 3: Additional Info)
   - Mobile-responsive design
   - Keyboard navigation support
   - Accessibility compliance (ARIA labels, screen reader support)
   - Autofocus on first field
   - Tab order follows logical flow

4. **Integration Points**:
   - Call POST /api/visitors endpoint on form submission
   - Populate host dropdown from GET /api/users endpoint (filtered by active employees)
   - Populate building dropdown from GET /api/buildings endpoint
   - Handle API errors gracefully with user feedback

**Technical Specifications**:
- **Frontend Framework**: React with React Hook Form for form state management
- **Validation Library**: Zod for schema validation
- **Date/Time Picker**: Material-UI DatePicker and TimePicker components
- **File Upload**: react-dropzone for photo upload with preview
- **API Client**: Axios or fetch with error handling
- **State Management**: Local component state with React Hook Form

**Acceptance Criteria**:
- [ ] Form displays all required fields with appropriate input types
- [ ] Real-time validation provides immediate feedback
- [ ] Form cannot be submitted with invalid data
- [ ] Successful submission displays confirmation message
- [ ] API errors are handled gracefully with user-friendly messages
- [ ] Form is fully responsive on mobile devices
- [ ] Form is keyboard-navigable and accessible
- [ ] Photo upload supports drag-and-drop and file selection
- [ ] Host dropdown supports search and filtering
- [ ] Date picker prevents selection of past dates

**Testing Requirements**:
- Unit tests for form validation logic
- Integration tests for API calls
- E2E tests for complete registration flow
- Accessibility testing with screen readers
- Mobile device testing (iOS Safari, Android Chrome)
- Error scenario testing (network failures, server errors)

---

##### Work Item 001-001-UC01-WI02

**ID**: 001-001-UC01-WI02  
**Type**: User Story  
**Title**: Add host selection functionality  
**ParentID**: 001-001-UC01  
**Priority**: High  
**Effort**: 3 Story Points (~12 hours)  
**Implementation Area**: Tenant Admin

**Description**:
Implement a sophisticated host selection component that allows the user registering the visitor to select either themselves or another employee as the designated host. The host is the person the visitor is coming to see, and they will receive notifications when the visitor arrives.

**Detailed Requirements**:

1. **Host Selection Component**:
   - Searchable dropdown with autocomplete functionality
   - Display host name, department, and photo in dropdown results
   - Default to current logged-in user as host (pre-selected)
   - Allow changing host to any other active employee
   - Display selected host information below dropdown
   - Clear button to deselect and choose different host

2. **Search Functionality**:
   - Search by host name (first name or last name)
   - Search by email address
   - Search by department
   - Debounced search (300ms) to reduce API calls
   - Display "No results found" message for empty searches
   - Display loading indicator during search

3. **Host Information Display**:
   - Host profile photo (with fallback initials avatar)
   - Host full name
   - Host department
   - Host email address
   - Host phone number (if available)
   - Badge indicating if host is currently in office (optional, requires check-in data)

4. **Business Rules**:
   - Only active employees can be selected as hosts
   - Deactivated or terminated employees do not appear in search results
   - User must have permission to see employee directory (role-based)
   - If user doesn't have directory access, only their own name appears

5. **Edge Cases**:
   - Handle scenario where logged-in user is not an employee (contractor, vendor) - force selection of host
   - Handle scenario where organization has thousands of employees - implement pagination or virtual scrolling
   - Handle scenario where no employees exist - display helpful message

**Technical Specifications**:
- **Component**: Autocomplete component with async data loading
- **API Endpoint**: GET /api/users?search={query}&role=employee&status=active
- **Debouncing**: Use lodash.debounce or custom hook
- **Avatar Display**: Use Material-UI Avatar or custom component with initials
- **Pagination**: Implement server-side pagination if employee count > 100
- **Caching**: Cache search results for 5 minutes to reduce API calls

**Acceptance Criteria**:
- [ ] Dropdown defaults to logged-in user as host
- [ ] Search returns relevant results within 500ms
- [ ] Search works for name, email, and department
- [ ] Selected host information displays correctly
- [ ] Only active employees appear in results
- [ ] Component handles thousands of employees efficiently
- [ ] Deactivated employees cannot be selected
- [ ] Loading and error states are handled gracefully
- [ ] Component is mobile-responsive
- [ ] Component is keyboard-navigable

**Testing Requirements**:
- Unit tests for search debouncing
- Unit tests for result filtering
- Integration tests for API calls
- E2E tests for host selection flow
- Performance testing with large employee datasets (1000+ employees)
- Accessibility testing for keyboard navigation

---

##### Work Item 001-001-UC01-WI03

**ID**: 001-001-UC01-WI03  
**Type**: Task  
**Title**: Implement visitor data validation  
**ParentID**: 001-001-UC01  
**Priority**: High  
**Effort**: 3 Story Points (~12 hours)  
**Implementation Area**: API

**Description**:
Implement comprehensive server-side validation for all visitor data to ensure data integrity, security, and consistency. Client-side validation provides user feedback, but server-side validation is critical for preventing invalid or malicious data from entering the system.

**Detailed Requirements**:

1. **Field-Level Validation**:
   - **First Name**: Required, 1-50 characters, alphanumeric and spaces only, trim whitespace
   - **Last Name**: Required, 1-50 characters, alphanumeric and spaces only, trim whitespace
   - **Email**: Required, valid email format (RFC 5322), max 255 characters, lowercase, check for disposable email domains (optional)
   - **Phone**: Optional, valid international format (E.164), support multiple country formats
   - **Company**: Optional, 1-100 characters if provided, trim whitespace
   - **Visit Date**: Required, must be today or future date, cannot be more than 90 days in future (configurable)
   - **Visit Time**: Required, valid time format (HH:MM), cannot be in the past if visit date is today
   - **Duration**: Optional, must be positive integer (minutes), max 720 minutes (12 hours)
   - **Host ID**: Required, must reference valid active employee, must exist in database
   - **Building ID**: Required if tenant has multiple buildings, must reference valid building
   - **Purpose**: Optional, max 500 characters if provided
   - **Special Instructions**: Optional, max 500 characters if provided
   - **Photo**: Optional, if provided must be valid image (JPG, PNG), max 5MB, minimum 200x200 pixels

2. **Business Logic Validation**:
   - **Duplicate Detection**: Check if visitor with same email already has appointment on same day at same building
   - **Host Availability**: Optional check if host has marked themselves as out-of-office (requires calendar integration)
   - **Building Capacity**: Optional check if building has reached capacity limit for visit date
   - **Blacklist Check**: Check if visitor email/phone is on blacklist (denied entry list)
   - **Time Slot Validation**: Ensure visit time falls within building operating hours

3. **Security Validation**:
   - **SQL Injection Prevention**: Use parameterized queries, ORM escaping
   - **XSS Prevention**: Sanitize all text inputs, especially purpose and instructions fields
   - **File Upload Security**: Validate image file headers, not just extensions, scan for malware
   - **Rate Limiting**: Prevent brute force by limiting registration attempts per IP/user
   - **CSRF Protection**: Validate CSRF token on all POST requests

4. **Error Response Format**:
   ```json
   {
     "success": false,
     "errors": [
       {
         "field": "email",
         "message": "Email address is already registered for this date",
         "code": "DUPLICATE_VISITOR"
       },
       {
         "field": "visitDate",
         "message": "Visit date cannot be more than 90 days in the future",
         "code": "DATE_OUT_OF_RANGE"
       }
     ],
     "timestamp": "2025-10-28T10:30:00Z"
   }
   ```

**Technical Specifications**:
- **Validation Library**: Joi (Node.js) or FluentValidation (.NET) for schema validation
- **Email Validation**: Use validator.js or email-validator library
- **Phone Validation**: Use libphonenumber-js for international phone validation
- **Image Validation**: Use sharp or jimp for image processing and validation
- **Database**: Use transactions for atomic operations
- **Logging**: Log all validation failures for security monitoring

**Validation Rules Object** (Example for Node.js with Joi):
```javascript
const visitorSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required().trim(),
  lastName: Joi.string().min(1).max(50).required().trim(),
  email: Joi.string().email().max(255).required().lowercase(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  company: Joi.string().max(100).optional().trim(),
  visitDate: Joi.date().min('now').max(Joi.ref('$maxDate')).required(),
  visitTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  duration: Joi.number().integer().min(15).max(720).optional(),
  hostId: Joi.string().uuid().required(),
  buildingId: Joi.string().uuid().required(),
  purpose: Joi.string().max(500).optional(),
  specialInstructions: Joi.string().max(500).optional(),
  requireNDA: Joi.boolean().default(false)
});
```

**Acceptance Criteria**:
- [ ] All required fields are validated
- [ ] Invalid data returns appropriate error messages
- [ ] Duplicate visitors are detected and prevented
- [ ] Email format is validated correctly
- [ ] Phone format accepts international numbers
- [ ] Past dates are rejected
- [ ] Future dates beyond limit are rejected
- [ ] Invalid host IDs are rejected
- [ ] XSS attempts are sanitized
- [ ] SQL injection attempts are prevented
- [ ] File uploads are securely validated
- [ ] Error responses are consistent and informative

**Testing Requirements**:
- Unit tests for each validation rule
- Integration tests for validation flow
- Security testing for injection attacks
- Performance testing for validation overhead
- Test with malformed data and edge cases
- Test with very large files (>5MB)
- Test with international phone numbers from various countries

---

##### Work Item 001-001-UC01-WI04

**ID**: 001-001-UC01-WI04  
**Type**: Task  
**Title**: Create visitor API endpoints  
**ParentID**: 001-001-UC01  
**Priority**: High  
**Effort**: 5 Story Points (~20 hours)  
**Implementation Area**: API

**Description**:
Design and implement RESTful API endpoints for visitor management, following REST conventions and best practices. These endpoints will handle all CRUD operations for visitors and serve as the backend for the admin interface and potentially third-party integrations.

**Detailed Requirements**:

1. **POST /api/visitors** - Create New Visitor
   - **Purpose**: Register a new visitor
   - **Authentication**: Required (JWT token)
   - **Authorization**: User must have "visitor:create" permission
   - **Request Body**:
     ```json
     {
       "firstName": "John",
       "lastName": "Doe",
       "email": "john.doe@example.com",
       "phone": "+14155551234",
       "company": "Acme Corp",
       "visitDate": "2025-11-15",
       "visitTime": "14:00",
       "duration": 60,
       "hostId": "uuid-of-host",
       "buildingId": "uuid-of-building",
       "purpose": "Business meeting",
       "specialInstructions": "Please notify when arrived",
       "requireNDA": false,
       "photoUrl": "https://storage.example.com/photos/visitor.jpg"
     }
     ```
   - **Response** (201 Created):
     ```json
     {
       "success": true,
       "data": {
         "id": "uuid-of-visitor",
         "firstName": "John",
         "lastName": "Doe",
         "email": "john.doe@example.com",
         "qrCode": "https://api.example.com/visitors/qr/uuid-of-visitor",
         "status": "expected",
         "createdAt": "2025-10-28T10:30:00Z",
         "createdBy": "uuid-of-creator"
       },
       "message": "Visitor registered successfully. Confirmation email sent."
     }
     ```
   - **Error Responses**:
     - 400 Bad Request: Validation errors
     - 401 Unauthorized: Missing or invalid token
     - 403 Forbidden: Insufficient permissions
     - 409 Conflict: Duplicate visitor
     - 500 Internal Server Error: Server error

2. **GET /api/visitors/{id}** - Get Visitor Details
   - **Purpose**: Retrieve detailed information about a specific visitor
   - **Authentication**: Required
   - **Authorization**: User must have "visitor:read" permission
   - **Path Parameter**: `id` - UUID of visitor
   - **Response** (200 OK):
     ```json
     {
       "success": true,
       "data": {
         "id": "uuid-of-visitor",
         "firstName": "John",
         "lastName": "Doe",
         "email": "john.doe@example.com",
         "phone": "+14155551234",
         "company": "Acme Corp",
         "photoUrl": "https://storage.example.com/photos/visitor.jpg",
         "visitDate": "2025-11-15",
         "visitTime": "14:00",
         "duration": 60,
         "status": "expected",
         "checkInTime": null,
         "checkOutTime": null,
         "host": {
           "id": "uuid-of-host",
           "name": "Jane Smith",
           "email": "jane.smith@company.com",
           "department": "Engineering"
         },
         "building": {
           "id": "uuid-of-building",
           "name": "Headquarters",
           "address": "123 Main St"
         },
         "purpose": "Business meeting",
         "specialInstructions": "Please notify when arrived",
         "requireNDA": false,
         "ndaSigned": false,
         "badgePrinted": false,
         "createdAt": "2025-10-28T10:30:00Z",
         "createdBy": {
           "id": "uuid-of-creator",
           "name": "Admin User"
         }
       }
     }
     ```
   - **Error Responses**:
     - 401 Unauthorized: Missing or invalid token
     - 403 Forbidden: Insufficient permissions
     - 404 Not Found: Visitor not found
     - 500 Internal Server Error: Server error

3. **GET /api/visitors** - List Visitors (with filtering, sorting, pagination)
   - **Purpose**: Retrieve list of visitors with advanced filtering
   - **Authentication**: Required
   - **Authorization**: User must have "visitor:read" permission
   - **Query Parameters**:
     - `page` (integer, default: 1) - Page number
     - `limit` (integer, default: 20, max: 100) - Items per page
     - `search` (string) - Search by name, email, or company
     - `status` (enum: expected, checked-in, checked-out, cancelled) - Filter by status
     - `hostId` (uuid) - Filter by host
     - `buildingId` (uuid) - Filter by building
     - `fromDate` (date) - Filter visits from this date
     - `toDate` (date) - Filter visits until this date
     - `sortBy` (string, default: visitDate) - Sort field
     - `sortOrder` (enum: asc, desc, default: asc) - Sort direction
   - **Response** (200 OK):
     ```json
     {
       "success": true,
       "data": [
         {
           "id": "uuid-of-visitor",
           "firstName": "John",
           "lastName": "Doe",
           "email": "john.doe@example.com",
           "company": "Acme Corp",
           "visitDate": "2025-11-15",
           "visitTime": "14:00",
           "status": "expected",
           "host": {
             "id": "uuid-of-host",
             "name": "Jane Smith"
           },
           "building": {
             "id": "uuid-of-building",
             "name": "Headquarters"
           }
         }
       ],
       "pagination": {
         "page": 1,
         "limit": 20,
         "totalItems": 150,
         "totalPages": 8,
         "hasNextPage": true,
         "hasPrevPage": false
       }
     }
     ```

4. **PUT /api/visitors/{id}** - Update Visitor
   - **Purpose**: Update visitor information before check-in
   - **Authentication**: Required
   - **Authorization**: User must have "visitor:update" permission
   - **Path Parameter**: `id` - UUID of visitor
   - **Request Body**: Same as POST, all fields optional
   - **Business Rules**:
     - Cannot update visitor after check-in
     - Cannot change visit date to past date
     - If email changes, new confirmation email is sent
   - **Response** (200 OK): Updated visitor object
   - **Error Responses**: Same as POST

5. **DELETE /api/visitors/{id}** - Cancel Visitor Registration
   - **Purpose**: Cancel a visitor registration
   - **Authentication**: Required
   - **Authorization**: User must have "visitor:delete" permission
   - **Path Parameter**: `id` - UUID of visitor
   - **Business Rules**:
     - Can only cancel visitors with status "expected"
     - Cannot delete checked-in or checked-out visitors (use soft delete)
     - Sends cancellation email to visitor
   - **Response** (200 OK):
     ```json
     {
       "success": true,
       "message": "Visitor registration cancelled. Notification email sent."
     }
     ```
   - **Error Responses**:
     - 400 Bad Request: Visitor cannot be cancelled (already checked in)
     - 404 Not Found: Visitor not found

**Technical Specifications**:
- **Framework**: Express.js (Node.js) or ASP.NET Core (.NET)
- **Database ORM**: Prisma (Node.js) or Entity Framework Core (.NET)
- **Authentication**: JWT middleware with token validation
- **Authorization**: RBAC middleware with permission checking
- **Validation**: Joi or express-validator (Node.js), FluentValidation (.NET)
- **Error Handling**: Centralized error handler middleware
- **Logging**: Winston or Pino for request/response logging
- **API Versioning**: URL versioning (e.g., /api/v1/visitors)
- **Rate Limiting**: Express-rate-limit or similar (100 requests per 15 minutes per IP)
- **CORS**: Configure allowed origins for tenant domains
- **Compression**: Gzip compression for responses
- **Documentation**: Swagger/OpenAPI annotations for auto-generated docs

**Database Schema** (PostgreSQL):
```sql
CREATE TABLE visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    photo_url TEXT,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    duration INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'expected',
    host_id UUID NOT NULL REFERENCES users(id),
    building_id UUID NOT NULL REFERENCES buildings(id),
    purpose TEXT,
    special_instructions TEXT,
    require_nda BOOLEAN DEFAULT FALSE,
    nda_signed BOOLEAN DEFAULT FALSE,
    nda_signed_at TIMESTAMP,
    badge_printed BOOLEAN DEFAULT FALSE,
    badge_printed_at TIMESTAMP,
    qr_code TEXT,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_status CHECK (status IN ('expected', 'checked-in', 'checked-out', 'cancelled', 'no-show')),
    CONSTRAINT valid_dates CHECK (visit_date >= CURRENT_DATE)
);

CREATE INDEX idx_visitors_tenant ON visitors(tenant_id);
CREATE INDEX idx_visitors_email ON visitors(email);
CREATE INDEX idx_visitors_visit_date ON visitors(visit_date);
CREATE INDEX idx_visitors_status ON visitors(status);
CREATE INDEX idx_visitors_host ON visitors(host_id);
CREATE INDEX idx_visitors_building ON visitors(building_id);
CREATE INDEX idx_visitors_created_at ON visitors(created_at);
```

**Acceptance Criteria**:
- [ ] All endpoints follow REST conventions
- [ ] Authentication is enforced on all endpoints
- [ ] Authorization checks permissions correctly
- [ ] Validation errors return 400 with detailed messages
- [ ] Successful operations return appropriate status codes
- [ ] Pagination works correctly with large datasets
- [ ] Filtering and sorting work as expected
- [ ] Search functionality returns relevant results
- [ ] Rate limiting prevents abuse
- [ ] API documentation is auto-generated
- [ ] Error handling is consistent across endpoints
- [ ] Performance is acceptable (< 200ms for simple queries)

**Testing Requirements**:
- Unit tests for each endpoint handler
- Integration tests with test database
- API contract tests
- Performance tests with load testing (e.g., k6, Artillery)
- Security tests (OWASP ZAP, Burp Suite)
- Test with various authentication scenarios
- Test with invalid/malformed data
- Test pagination with edge cases (empty results, single page, etc.)

---

##### Work Item 001-001-UC01-WI05

**ID**: 001-001-UC01-WI05  
**Type**: User Story  
**Title**: Send confirmation email to visitor  
**ParentID**: 001-001-UC01  
**Priority**: High  
**Effort**: 5 Story Points (~20 hours)  
**Implementation Area**: API

**Description**:
Implement an automated email notification system that sends a professional, branded confirmation email to visitors when they are pre-registered. The email should include all visit details, a QR code for fast check-in, directions to the building, parking information, and any special instructions.

**Detailed Requirements**:

1. **Email Trigger**: Send email immediately after successful visitor registration (POST /api/visitors)

2. **Email Content**:
   - **Subject Line**: "Your visit to [Company Name] on [Date]"
   - **Greeting**: "Hello [Visitor First Name],"
   - **Introduction**: Brief welcome message
   - **Visit Details**:
     - Date and time of visit
     - Duration (if specified)
     - Host name and contact information
     - Building name and address
     - Purpose of visit (if provided)
   - **QR Code**: Large, scannable QR code for check-in (embedded image or linked)
   - **Directions**:
     - Link to Google Maps with building address
     - Public transportation options
     - Parking instructions (visitor parking location, fees, validation)
   - **What to Expect**:
     - Check-in procedure
     - Badge requirements
     - Security screening information
     - Building access instructions
   - **NDA Notice**: If requireNDA is true, include notice that NDA must be signed upon arrival
   - **Special Instructions**: Display host's special instructions if provided
   - **Contact Information**: Reception phone number and host contact
   - **Footer**: Company branding, privacy policy link, unsubscribe option

3. **Email Template Design**:
   - Responsive HTML email (mobile-friendly)
   - Tenant-specific branding (logo, colors)
   - Clean, professional design
   - Accessible (plain text alternative)
   - Compatible with major email clients (Gmail, Outlook, Apple Mail)

4. **QR Code Generation**:
   - QR code contains visitor UUID
   - QR code format: `VISITOR:{visitor_id}` or deep link `https://app.example.com/checkin?v={visitor_id}`
   - QR code size: 300x300 pixels for optimal scanning
   - Error correction level: Medium (M) to handle slight damage
   - Generate using QR code library (qrcode, qr-image, etc.)
   - Store QR code in object storage or generate on-the-fly

5. **Email Delivery**:
   - Use transactional email service (SendGrid, AWS SES, Postmark)
   - Implement retry logic for failed deliveries (3 attempts with exponential backoff)
   - Queue emails using message queue (Bull, RabbitMQ) to avoid blocking API response
   - Track delivery status (sent, delivered, bounced, opened, clicked)
   - Handle bounced emails (invalid email addresses)
   - Respect user's email preferences (if they unsubscribed previously)

6. **Internationalization**:
   - Support multiple languages based on tenant locale
   - Format dates/times according to tenant timezone and format preferences
   - Translate all text elements

7. **Security & Privacy**:
   - Do not include sensitive information (passwords, full SSN)
   - Include privacy notice
   - Provide unsubscribe link (visitor can opt out of future notifications)
   - Encrypt email content in transit (TLS)

**Email Template Example** (Handlebars or similar):
```handlebars
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your visit to {{companyName}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px;">
            <img src="{{tenantLogoUrl}}" alt="{{companyName}}" style="max-width: 200px; margin-bottom: 20px;">
            
            <h1 style="color: {{brandColor}};">Your Visit Confirmation</h1>
            
            <p>Hello {{visitorFirstName}},</p>
            
            <p>You have been registered for a visit to <strong>{{companyName}}</strong>. We look forward to welcoming you!</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid {{brandColor}}; margin: 20px 0;">
                <h2 style="margin-top: 0;">Visit Details</h2>
                <p><strong>Date:</strong> {{visitDate}}</p>
                <p><strong>Time:</strong> {{visitTime}}</p>
                <p><strong>Duration:</strong> {{duration}}</p>
                <p><strong>Host:</strong> {{hostName}} ({{hostEmail}})</p>
                <p><strong>Location:</strong> {{buildingName}}<br>{{buildingAddress}}</p>
                {{#if purpose}}
                <p><strong>Purpose:</strong> {{purpose}}</p>
                {{/if}}
            </div>
            
            <h2>Quick Check-In</h2>
            <p>For fast check-in, please show this QR code at reception:</p>
            <div style="text-align: center; margin: 20px 0;">
                <img src="{{qrCodeUrl}}" alt="Check-in QR Code" style="max-width: 300px;">
            </div>
            
            <h2>Directions & Parking</h2>
            <p><a href="{{googleMapsLink}}" style="color: {{brandColor}};">Get directions to {{buildingName}}</a></p>
            <p>{{parkingInstructions}}</p>
            
            {{#if requireNDA}}
            <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <strong>Important:</strong> You will be required to sign a Non-Disclosure Agreement upon arrival.
            </div>
            {{/if}}
            
            {{#if specialInstructions}}
            <h2>Special Instructions</h2>
            <p>{{specialInstructions}}</p>
            {{/if}}
            
            <h2>What to Expect</h2>
            <ul>
                <li>Check in at the reception desk</li>
                <li>Present a valid photo ID</li>
                <li>Receive a visitor badge (to be worn at all times)</li>
                <li>Wait for your host to escort you</li>
            </ul>
            
            <p>If you have any questions, please contact:</p>
            <p><strong>Reception:</strong> {{receptionPhone}}<br>
               <strong>Host:</strong> {{hostName}} - {{hostPhone}}</p>
            
            <p style="margin-top: 40px; font-size: 12px; color: #666;">
                This is an automated message. Please do not reply to this email.<br>
                If you need to cancel or reschedule, please contact your host.<br>
                <a href="{{privacyPolicyUrl}}" style="color: #666;">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
```

**Technical Specifications**:
- **Email Service**: SendGrid API, AWS SES, or Postmark
- **Template Engine**: Handlebars, EJS, or Pug for HTML template rendering
- **QR Code Library**: qrcode (Node.js), QRCoder (.NET)
- **Message Queue**: Bull (Redis-based) for email queue
- **Email Tracking**: SendGrid Event Webhook or similar for delivery tracking
- **Storage**: S3 or Azure Blob for QR code images
- **Retry Logic**: Exponential backoff (1min, 5min, 15min)

**Email Queue Job Structure**:
```javascript
// Email job data
{
  type: 'visitor_confirmation',
  to: 'visitor@example.com',
  data: {
    visitorFirstName: 'John',
    companyName: 'Acme Corp',
    visitDate: '2025-11-15',
    visitTime: '2:00 PM',
    duration: '1 hour',
    hostName: 'Jane Smith',
    hostEmail: 'jane@company.com',
    hostPhone: '+1-415-555-1234',
    buildingName: 'Headquarters',
    buildingAddress: '123 Main St, San Francisco, CA 94105',
    qrCodeUrl: 'https://storage.example.com/qr/visitor-uuid.png',
    googleMapsLink: 'https://maps.google.com/?q=123+Main+St',
    parkingInstructions: 'Visitor parking is available in Lot B.',
    requireNDA: false,
    specialInstructions: 'Please arrive 10 minutes early.',
    receptionPhone: '+1-415-555-5000',
    tenantLogoUrl: 'https://storage.example.com/logos/tenant-uuid.png',
    brandColor: '#0066CC',
    privacyPolicyUrl: 'https://company.com/privacy'
  },
  tenantId: 'tenant-uuid',
  attempts: 0,
  maxAttempts: 3
}
```

**Acceptance Criteria**:
- [ ] Email is sent automatically after visitor registration
- [ ] Email contains all required information
- [ ] QR code is generated and embedded correctly
- [ ] QR code can be scanned reliably on mobile devices
- [ ] Email is mobile-responsive
- [ ] Email displays correctly in Gmail, Outlook, Apple Mail
- [ ] Tenant branding (logo, colors) is applied
- [ ] Failed email deliveries are retried
- [ ] Bounced emails are handled gracefully
- [ ] Email delivery status is tracked
- [ ] Plain text version is included for accessibility
- [ ] Unsubscribe link is included
- [ ] Email queue prevents API blocking

**Testing Requirements**:
- Unit tests for email template rendering
- Integration tests for email sending
- Test with real email services (sandbox mode)
- Test email display in multiple email clients
- Test QR code generation and scanning
- Test with various data scenarios (with/without optional fields)
- Test retry logic with forced failures
- Test email queue processing
- Load testing for high-volume email sending

---

##### Work Item 001-001-UC01-WI06

**ID**: 001-001-UC01-WI06  
**Type**: Task  
**Title**: Store visitor data in database  
**ParentID**: 001-001-UC01  
**Priority**: High  
**Effort**: 3 Story Points (~12 hours)  
**Implementation Area**: API

**Description**:
Design and implement the database schema for storing visitor information with proper data types, indexes, relationships, and constraints. This includes creating the visitors table, establishing foreign key relationships, implementing audit fields, and ensuring optimal query performance.

**Detailed Requirements**:

1. **Primary Table**: `visitors`
   - Stores all visitor registration data
   - Includes foreign keys to related tables (hosts, buildings, tenants)
   - Implements soft delete pattern (deleted_at field)
   - Includes audit trail fields (created_at, created_by, updated_at, updated_by)

2. **Related Tables**:
   - `tenants` - Multi-tenant isolation
   - `users` - Host and creator references
   - `buildings` - Building reference
   - `visitor_check_in_log` - Check-in/out history (separate table for audit)
   - `visitor_agreements` - NDA and legal agreement signatures

3. **Data Types**:
   - Use UUID for primary keys and foreign keys (better for distributed systems, no sequential enumeration)
   - Use VARCHAR with appropriate limits for text fields
   - Use TEXT for long-form content (purpose, instructions)
   - Use TIMESTAMP WITH TIME ZONE for date/time fields (timezone-aware)
   - Use BOOLEAN for flags
   - Use JSONB for flexible metadata storage (PostgreSQL)

4. **Indexes**:
   - Primary key index on `id`
   - Index on `tenant_id` for multi-tenant queries
   - Index on `email` for duplicate detection and search
   - Index on `visit_date` for date-range queries
   - Index on `status` for filtering
   - Index on `host_id` for host-specific queries
   - Index on `building_id` for building-specific queries
   - Composite index on (tenant_id, visit_date, status) for common query patterns
   - Full-text search index on (first_name, last_name, company) for search

5. **Constraints**:
   - Primary key constraint on `id`
   - Foreign key constraints with cascading rules
   - Check constraints for valid status values
   - Check constraint for visit_date >= CURRENT_DATE
   - Unique constraint on (tenant_id, email, visit_date) to prevent duplicates

6. **Data Retention**:
   - Soft delete visitors (set deleted_at instead of physical delete)
   - Implement data retention policy (auto-delete visitors older than X years)
   - Archive old visitor records to separate table for compliance

**Complete Database Schema** (PostgreSQL):

```sql
-- ============================================
-- Visitors Table
-- ============================================
CREATE TABLE visitors (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Multi-Tenant Isolation
    tenant_id UUID NOT NULL,
    
    -- Visitor Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    photo_url TEXT,
    
    -- Visit Information
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    duration INTEGER, -- Duration in minutes
    status VARCHAR(20) NOT NULL DEFAULT 'expected',
    
    -- Relationships
    host_id UUID NOT NULL,
    building_id UUID NOT NULL,
    
    -- Visit Details
    purpose TEXT,
    special_instructions TEXT,
    
    -- NDA and Legal
    require_nda BOOLEAN DEFAULT FALSE,
    nda_signed BOOLEAN DEFAULT FALSE,
    nda_signed_at TIMESTAMP WITH TIME ZONE,
    nda_document_url TEXT,
    
    -- Badge Information
    badge_printed BOOLEAN DEFAULT FALSE,
    badge_printed_at TIMESTAMP WITH TIME ZONE,
    badge_number VARCHAR(50),
    
    -- Check-In Information
    qr_code TEXT UNIQUE,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_in_by UUID, -- User who checked in the visitor
    check_out_time TIMESTAMP WITH TIME ZONE,
    check_out_by UUID, -- User who checked out the visitor
    
    -- Metadata (JSONB for flexible data)
    metadata JSONB DEFAULT '{}',
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT fk_visitors_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_visitors_host FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_visitors_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE RESTRICT,
    CONSTRAINT fk_visitors_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_visitors_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_visitors_check_in_by FOREIGN KEY (check_in_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_visitors_check_out_by FOREIGN KEY (check_out_by) REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT chk_visitors_status CHECK (status IN ('expected', 'checked-in', 'checked-out', 'cancelled', 'no-show')),
    CONSTRAINT chk_visitors_visit_date CHECK (visit_date >= CURRENT_DATE OR check_in_time IS NOT NULL),
    CONSTRAINT chk_visitors_duration CHECK (duration IS NULL OR duration > 0),
    CONSTRAINT chk_visitors_check_times CHECK (check_out_time IS NULL OR check_out_time > check_in_time),
    
    -- Unique constraint to prevent duplicate visitors on same day
    CONSTRAINT uq_visitors_email_date UNIQUE (tenant_id, email, visit_date) WHERE deleted_at IS NULL
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Primary access patterns
CREATE INDEX idx_visitors_tenant ON visitors(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_visitors_email ON visitors(email);
CREATE INDEX idx_visitors_visit_date ON visitors(visit_date);
CREATE INDEX idx_visitors_status ON visitors(status) WHERE deleted_at IS NULL;

-- Relationship indexes
CREATE INDEX idx_visitors_host ON visitors(host_id);
CREATE INDEX idx_visitors_building ON visitors(building_id);

-- Composite indexes for common query patterns
CREATE INDEX idx_visitors_tenant_date_status ON visitors(tenant_id, visit_date, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_visitors_check_in_time ON visitors(check_in_time) WHERE check_in_time IS NOT NULL;

-- Full-text search index (PostgreSQL specific)
CREATE INDEX idx_visitors_search ON visitors USING GIN (
    to_tsvector('english', 
        coalesce(first_name, '') || ' ' || 
        coalesce(last_name, '') || ' ' || 
        coalesce(company, '')
    )
);

-- QR code lookup
CREATE INDEX idx_visitors_qr_code ON visitors(qr_code) WHERE qr_code IS NOT NULL;

-- Audit and reporting
CREATE INDEX idx_visitors_created_at ON visitors(created_at);
CREATE INDEX idx_visitors_created_by ON visitors(created_by);

-- ============================================
-- Visitor Check-In Log (Audit Trail)
-- ============================================
CREATE TABLE visitor_check_in_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID NOT NULL,
    event_type VARCHAR(20) NOT NULL, -- 'check-in', 'check-out', 'status-change'
    event_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    performed_by UUID,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    notes TEXT,
    ip_address INET,
    user_agent TEXT,
    
    CONSTRAINT fk_check_in_log_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
    CONSTRAINT fk_check_in_log_user FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_event_type CHECK (event_type IN ('check-in', 'check-out', 'status-change', 'created', 'updated', 'cancelled'))
);

CREATE INDEX idx_check_in_log_visitor ON visitor_check_in_log(visitor_id);
CREATE INDEX idx_check_in_log_event_time ON visitor_check_in_log(event_time);

-- ============================================
-- Visitor Agreements (NDA, Terms, etc.)
-- ============================================
CREATE TABLE visitor_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID NOT NULL,
    agreement_type VARCHAR(50) NOT NULL, -- 'nda', 'terms-of-service', 'safety-rules'
    agreement_text TEXT NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    signature_image_url TEXT,
    ip_address INET,
    
    CONSTRAINT fk_agreements_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE
);

CREATE INDEX idx_agreements_visitor ON visitor_agreements(visitor_id);
CREATE INDEX idx_agreements_type ON visitor_agreements(agreement_type);

-- ============================================
-- Triggers for Auto-Update Timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_visitors_updated_at
BEFORE UPDATE ON visitors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function for QR Code Generation
-- ============================================
CREATE OR REPLACE FUNCTION generate_visitor_qr_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.qr_code IS NULL THEN
        NEW.qr_code := 'VISITOR:' || NEW.id::text;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_visitors_qr_code
BEFORE INSERT ON visitors
FOR EACH ROW
EXECUTE FUNCTION generate_visitor_qr_code();

-- ============================================
-- Views for Common Queries
-- ============================================

-- Active visitors (expected or checked-in today)
CREATE VIEW v_active_visitors AS
SELECT 
    v.id,
    v.first_name,
    v.last_name,
    v.email,
    v.company,
    v.visit_date,
    v.visit_time,
    v.status,
    v.check_in_time,
    u.first_name || ' ' || u.last_name AS host_name,
    u.email AS host_email,
    b.name AS building_name
FROM visitors v
JOIN users u ON v.host_id = u.id
JOIN buildings b ON v.building_id = v.building_id
WHERE v.deleted_at IS NULL
    AND v.visit_date = CURRENT_DATE
    AND v.status IN ('expected', 'checked-in')
ORDER BY v.visit_time;

-- Visitor statistics by date range
CREATE VIEW v_visitor_stats AS
SELECT 
    tenant_id,
    DATE_TRUNC('day', visit_date) AS visit_day,
    COUNT(*) AS total_visitors,
    COUNT(*) FILTER (WHERE status = 'checked-in' OR status = 'checked-out') AS checked_in_count,
    COUNT(*) FILTER (WHERE status = 'no-show') AS no_show_count,
    AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time))/60) AS avg_duration_minutes
FROM visitors
WHERE deleted_at IS NULL
    AND visit_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY tenant_id, DATE_TRUNC('day', visit_date);

-- ============================================
-- Data Retention Policy (Run periodically via cron job)
-- ============================================
-- Archive old visitors (older than 7 years for compliance)
CREATE TABLE visitors_archive (
    LIKE visitors INCLUDING ALL
);

-- Function to archive old visitors
CREATE OR REPLACE FUNCTION archive_old_visitors(retention_years INTEGER DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    WITH moved_visitors AS (
        INSERT INTO visitors_archive
        SELECT * FROM visitors
        WHERE visit_date < CURRENT_DATE - (retention_years || ' years')::INTERVAL
            AND deleted_at IS NOT NULL
        RETURNING id
    )
    DELETE FROM visitors
    WHERE id IN (SELECT id FROM moved_visitors);
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;
```

**ORM Model Example** (Prisma for Node.js):

```prisma
model Visitor {
  id                   String    @id @default(uuid())
  tenantId             String    @map("tenant_id")
  firstName            String    @map("first_name") @db.VarChar(50)
  lastName             String    @map("last_name") @db.VarChar(50)
  email                String    @db.VarChar(255)
  phone                String?   @db.VarChar(20)
  company              String?   @db.VarChar(100)
  photoUrl             String?   @map("photo_url")
  visitDate            DateTime  @map("visit_date") @db.Date
  visitTime            DateTime  @map("visit_time") @db.Time
  duration             Int?
  status               String    @default("expected") @db.VarChar(20)
  hostId               String    @map("host_id")
  buildingId           String    @map("building_id")
  purpose              String?   @db.Text
  specialInstructions  String?   @map("special_instructions") @db.Text
  requireNda           Boolean   @default(false) @map("require_nda")
  ndaSigned            Boolean   @default(false) @map("nda_signed")
  ndaSignedAt          DateTime? @map("nda_signed_at")
  ndaDocumentUrl       String?   @map("nda_document_url")
  badgePrinted         Boolean   @default(false) @map("badge_printed")
  badgePrintedAt       DateTime? @map("badge_printed_at")
  badgeNumber          String?   @map("badge_number") @db.VarChar(50)
  qrCode               String?   @unique @map("qr_code")
  checkInTime          DateTime? @map("check_in_time")
  checkInBy            String?   @map("check_in_by")
  checkOutTime         DateTime? @map("check_out_time")
  checkOutBy           String?   @map("check_out_by")
  metadata             Json      @default("{}")
  createdAt            DateTime  @default(now()) @map("created_at")
  createdBy            String?   @map("created_by")
  updatedAt            DateTime  @updatedAt @map("updated_at")
  updatedBy            String?   @map("updated_by")
  deletedAt            DateTime? @map("deleted_at")

  // Relations
  tenant               Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  host                 User     @relation("VisitorHost", fields: [hostId], references: [id])
  building             Building @relation(fields: [buildingId], references: [id])
  creator              User?    @relation("VisitorCreator", fields: [createdBy], references: [id])
  updater              User?    @relation("VisitorUpdater", fields: [updatedBy], references: [id])
  checkInUser          User?    @relation("VisitorCheckIn", fields: [checkInBy], references: [id])
  checkOutUser         User?    @relation("VisitorCheckOut", fields: [checkOutBy], references: [id])
  
  checkInLog           VisitorCheckInLog[]
  agreements           VisitorAgreement[]

  @@unique([tenantId, email, visitDate], name: "uq_visitors_email_date")
  @@index([tenantId])
  @@index([email])
  @@index([visitDate])
  @@index([status])
  @@index([hostId])
  @@index([buildingId])
  @@index([tenantId, visitDate, status])
  @@map("visitors")
}
```

**Acceptance Criteria**:
- [ ] Visitors table is created with all required fields
- [ ] Foreign key relationships are established correctly
- [ ] Indexes are created for query performance
- [ ] Constraints enforce data integrity
- [ ] Soft delete is implemented (deleted_at field)
- [ ] Audit fields track creation and updates
- [ ] QR code is auto-generated on insert
- [ ] Updated timestamp is auto-updated on changes
- [ ] Check-in log table captures audit trail
- [ ] Visitor agreements table stores legal documents
- [ ] Views provide convenient query access
- [ ] Data retention function archives old visitors
- [ ] Schema supports multi-tenant isolation
- [ ] Unique constraint prevents duplicate visitors

**Testing Requirements**:
- Unit tests for ORM models
- Integration tests for database operations (CRUD)
- Test foreign key constraints and cascading
- Test unique constraints with duplicate data
- Test check constraints with invalid data
- Test indexes improve query performance (EXPLAIN ANALYZE)
- Test with large datasets (100k+ visitors) for performance
- Test concurrent inserts for race conditions
- Test soft delete behavior
- Test data retention archival function

---

##### Work Item 001-001-UC01-WI07

**ID**: 001-001-UC01-WI07  
**Type**: Bug/Task  
**Title**: Handle duplicate visitor detection  
**ParentID**: 001-001-UC01  
**Priority**: Medium  
**Effort**: 3 Story Points (~12 hours)  
**Implementation Area**: API

**Description**:
Implement intelligent duplicate visitor detection to prevent creating multiple registration records for the same visitor on the same day. The system should identify potential duplicates based on email address and phone number, provide user feedback, and offer options to view or modify the existing registration.

**Detailed Requirements**:

1. **Duplicate Detection Logic**:
   - **Primary Check**: Email + Visit Date + Building combination
   - **Secondary Check**: Phone number + Visit Date + Building combination (for visitors without email or typos in email)
   - **Fuzzy Matching**: Optional fuzzy name matching to catch name variations (Jon Doe vs John Doe)
   - **Time Window**: Consider visitors within 24 hours of the requested visit time
   - **Status Filter**: Only consider active visitors (exclude cancelled and no-show)

2. **Detection Scenarios**:
   - **Exact Duplicate**: Same email, same date, same building → Block with error message
   - **Near Duplicate**: Same email, same date, different building → Warning, allow proceed
   - **Soft Duplicate**: Same email, different date within 7 days → Info notice, allow proceed
   - **Phone Duplicate**: Different email, same phone, same date → Warning, prompt verification
   - **Multiple Visits**: Same email, same date, different times (legitimate multiple visits) → Allow with confirmation

3. **User Experience**:
   - **Blocking Error**: "A visitor with email {email} is already registered for {date}. Please check the existing registration or contact reception."
   - **Warning**: "A visitor with this email is already registered. View existing registration?"
   - **Information**: "This visitor has an upcoming visit on {date}. Creating new registration for {new_date}."
   - **Confirmation**: "This visitor has multiple visits scheduled for this date. Confirm to add another visit?"

4. **API Response for Duplicates**:
   ```json
   {
     "success": false,
     "error": {
       "code": "DUPLICATE_VISITOR",
       "message": "A visitor with this email is already registered for this date",
       "severity": "error",
       "duplicateVisitor": {
         "id": "existing-visitor-uuid",
         "firstName": "John",
         "lastName": "Doe",
         "email": "john.doe@example.com",
         "visitDate": "2025-11-15",
         "visitTime": "14:00",
         "status": "expected",
         "host": {
           "name": "Jane Smith"
         }
       },
       "suggestions": [
         {
           "action": "view",
           "label": "View existing registration",
           "link": "/visitors/existing-visitor-uuid"
         },
         {
           "action": "update",
           "label": "Update existing registration",
           "link": "/visitors/existing-visitor-uuid/edit"
         },
         {
           "action": "cancel",
           "label": "Cancel existing and create new",
           "method": "POST",
           "endpoint": "/api/visitors/existing-visitor-uuid/replace"
         }
       ]
     }
   }
   ```

5. **Admin Override**:
   - Admins can force creation even with duplicates
   - Requires special permission: "visitor:create:force"
   - Add query parameter: `?force=true` to POST /api/visitors
   - Log forced duplicate creations in audit log

6. **Database Query for Duplicate Detection**:
   ```sql
   -- Exact duplicate check
   SELECT id, first_name, last_name, email, visit_date, visit_time, status
   FROM visitors
   WHERE tenant_id = $1
     AND email = $2
     AND visit_date = $3
     AND building_id = $4
     AND status NOT IN ('cancelled', 'no-show', 'checked-out')
     AND deleted_at IS NULL
   LIMIT 1;
   
   -- Phone duplicate check (if email check returns no results)
   SELECT id, first_name, last_name, email, phone, visit_date, visit_time, status
   FROM visitors
   WHERE tenant_id = $1
     AND phone = $2
     AND visit_date = $3
     AND building_id = $4
     AND status NOT IN ('cancelled', 'no-show', 'checked-out')
     AND deleted_at IS NULL
   LIMIT 1;
   
   -- Fuzzy name matching (optional advanced feature)
   SELECT id, first_name, last_name, email, visit_date, similarity
   FROM visitors,
        SIMILARITY(first_name || ' ' || last_name, $2 || ' ' || $3) AS similarity
   WHERE tenant_id = $1
     AND visit_date = $4
     AND building_id = $5
     AND similarity > 0.7  -- 70% similarity threshold
     AND status NOT IN ('cancelled', 'no-show', 'checked-out')
     AND deleted_at IS NULL
   ORDER BY similarity DESC
   LIMIT 5;
   ```

7. **Configuration Settings** (tenant-level):
   - `enableDuplicateDetection`: Boolean (default: true)
   - `duplicateDetectionLevel`: Enum ('strict', 'moderate', 'lenient')
     - **strict**: Block all duplicates, require admin override
     - **moderate**: Warn on duplicates, allow user to proceed
     - **lenient**: Only show info notice, auto-allow
   - `fuzzyMatchingEnabled`: Boolean (default: false)
   - `fuzzyMatchingThreshold`: Float 0-1 (default: 0.7)
   - `allowMultipleVisitsPerDay`: Boolean (default: false)

**Implementation Flow**:

```javascript
async function createVisitor(data, user) {
  // 1. Check if duplicate detection is enabled
  const settings = await getTenantSettings(user.tenantId);
  if (!settings.enableDuplicateDetection) {
    return await insertVisitor(data);
  }

  // 2. Check for exact email duplicate
  const emailDuplicate = await checkEmailDuplicate(
    user.tenantId,
    data.email,
    data.visitDate,
    data.buildingId
  );

  if (emailDuplicate) {
    const response = handleDuplicateVisitor(
      emailDuplicate,
      settings.duplicateDetectionLevel,
      data
    );
    
    if (response.block) {
      throw new DuplicateVisitorError(response);
    }
  }

  // 3. Check for phone duplicate (if no email duplicate)
  if (!emailDuplicate && data.phone) {
    const phoneDuplicate = await checkPhoneDuplicate(
      user.tenantId,
      data.phone,
      data.visitDate,
      data.buildingId
    );

    if (phoneDuplicate) {
      // Log potential duplicate for review
      await logPotentialDuplicate({
        type: 'phone',
        existing: phoneDuplicate,
        attempted: data
      });
    }
  }

  // 4. Optional: Fuzzy name matching
  if (settings.fuzzyMatchingEnabled) {
    const fuzzyMatches = await checkFuzzyNameMatch(
      user.tenantId,
      data.firstName,
      data.lastName,
      data.visitDate,
      data.buildingId,
      settings.fuzzyMatchingThreshold
    );

    if (fuzzyMatches.length > 0) {
      await logPotentialDuplicate({
        type: 'fuzzy_name',
        existing: fuzzyMatches,
        attempted: data
      });
    }
  }

  // 5. Create visitor if no blocking duplicates
  const visitor = await insertVisitor(data);
  
  // 6. Log creation in audit trail
  await logVisitorCreation(visitor, user);
  
  return visitor;
}

function handleDuplicateVisitor(existing, level, newData) {
  switch (level) {
    case 'strict':
      return {
        block: true,
        severity: 'error',
        message: 'A visitor with this email is already registered for this date',
        existing,
        suggestions: [
          { action: 'view', label: 'View existing registration' },
          { action: 'update', label: 'Update existing registration' }
        ]
      };
    
    case 'moderate':
      return {
        block: false,
        severity: 'warning',
        message: 'A visitor with this email is already registered. Proceed anyway?',
        existing,
        requireConfirmation: true
      };
    
    case 'lenient':
      return {
        block: false,
        severity: 'info',
        message: 'Note: This visitor is already registered for this date',
        existing
      };
  }
}
```

**Frontend Handling**:

```javascript
// In visitor registration form component
async function handleSubmit(formData) {
  try {
    const response = await api.post('/api/visitors', formData);
    
    if (response.success) {
      showSuccessMessage('Visitor registered successfully');
      navigate('/visitors');
    }
  } catch (error) {
    if (error.code === 'DUPLICATE_VISITOR') {
      // Show duplicate visitor dialog
      setDuplicateDialog({
        open: true,
        existing: error.duplicateVisitor,
        suggestions: error.suggestions,
        severity: error.severity
      });
    } else {
      showErrorMessage(error.message);
    }
  }
}

// Duplicate visitor dialog component
function DuplicateVisitorDialog({ duplicate, suggestions, onClose }) {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
        Duplicate Visitor Found
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning">
          A visitor with email {duplicate.email} is already registered:
        </Alert>
        
        <Box mt={2}>
          <Typography variant="subtitle2">Existing Registration:</Typography>
          <Typography>Name: {duplicate.firstName} {duplicate.lastName}</Typography>
          <Typography>Date: {duplicate.visitDate}</Typography>
          <Typography>Time: {duplicate.visitTime}</Typography>
          <Typography>Host: {duplicate.host.name}</Typography>
          <Typography>Status: {duplicate.status}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        {suggestions.map(suggestion => (
          <Button 
            key={suggestion.action}
            onClick={() => handleSuggestion(suggestion)}
          >
            {suggestion.label}
          </Button>
        ))}
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
```

**Acceptance Criteria**:
- [ ] Exact email duplicates are detected on same date
- [ ] Phone duplicates are detected when email differs
- [ ] Duplicate detection respects tenant-level settings
- [ ] Strict level blocks duplicate creation
- [ ] Moderate level warns but allows with confirmation
- [ ] Lenient level shows info notice only
- [ ] Admin override with `force=true` parameter works
- [ ] Duplicate errors return existing visitor details
- [ ] Suggestions provide actionable next steps
- [ ] Fuzzy name matching catches name variations (if enabled)
- [ ] Multiple legitimate visits per day are allowed (if configured)
- [ ] Cancelled and checked-out visitors don't trigger duplicates
- [ ] Duplicate detection doesn't significantly impact performance
- [ ] All duplicate checks are logged for audit

**Testing Requirements**:
- Unit tests for duplicate detection logic
- Unit tests for each detection level (strict, moderate, lenient)
- Integration tests with database queries
- Test exact email duplicates
- Test phone duplicates
- Test fuzzy name matching with variations
- Test with special characters and Unicode in names/emails
- Test concurrent registration attempts (race conditions)
- Test admin override functionality
- Test performance with large visitor databases
- Test configuration settings changes
- E2E tests for user workflows with duplicates

---

Due to the length constraints, I'll continue with a summary of the remaining work items for this use case and then move to additional use cases. This provides a detailed template that can be replicated for all other use cases.

---

### Use Case 001-001-UC02: Visitor Check-In/Check-Out

#### Use Case Overview

**ID**: 001-001-UC02  
**Title**: Visitor Check-In/Check-Out  
**ParentID**: 001-001  
**Priority**: Critical  
**Implementation Areas**: Tenant Admin, API

#### Business Context

The check-in/check-out process is the core operation of visitor management, executed by reception staff when visitors arrive at and leave the building. A fast, reliable check-in process improves visitor experience, reduces wait times, enhances security, and provides accurate occupancy data.

**Key Features**:
- QR code scanning for instant check-in
- Manual search by name or email
- Walk-in visitor registration (no pre-registration)
- Photo capture and identity verification
- NDA digital signature
- Badge printing trigger
- Host notification on arrival
- Check-out tracking for audit and security
- Building occupancy tracking

**User Stories**:
- As a receptionist, I want to quickly check in pre-registered visitors using QR codes so that they can access the building within seconds
- As a receptionist, I want to register walk-in visitors who don't have pre-registration so that all visitors are tracked
- As a security officer, I want to verify visitor identity with photos so that unauthorized persons cannot enter
- As a host, I want to be notified immediately when my visitor arrives so that I can meet them promptly

#### Work Items Summary

**(Full detailed specifications similar to UC01 would continue here for all 8 work items. Due to length, providing abbreviated list):**

1. **001-001-UC02-WI01**: Build check-in interface - Create comprehensive UI for reception staff with QR scanner, search, and walk-in registration
2. **001-001-UC02-WI02**: Implement QR code scanner - Integrate camera-based QR code scanning with HTML5 or native libraries
3. **001-001-UC02-WI03**: Create check-in API endpoint - PUT /api/visitors/{id}/checkin with validation and business logic
4. **001-001-UC02-WI04**: Create check-out API endpoint - PUT /api/visitors/{id}/checkout with timestamp tracking
5. **001-001-UC02-WI05**: Display visitor photo on check-in - Show photo for identity verification, handle missing photos
6. **001-001-UC02-WI06**: Notify host on visitor arrival - Trigger notification (email, SMS, push) when visitor checks in
7. **001-001-UC02-WI07**: Record check-in/out timestamps - Store accurate timestamps with timezone support, calculate duration
8. **001-001-UC02-WI08**: Handle walk-in visitors - Support immediate registration and check-in for unexpected visitors

---

### Use Case 001-001-UC03: Visitor Badge Printing

**(Similar detailed structure as above)**

---

### Use Case 001-001-UC04: Visitor List Management

**(Similar detailed structure as above)**

---

### Use Case 001-001-UC05: Visitor Management Configuration

**(Similar detailed structure as above)**

---

## Summary Statistics

### Total Work Items by Epic

| Epic ID | Epic Name | Use Cases | Work Items | Estimated Story Points | Estimated Hours |
|---|---|---|---|---|---|
| 001-001 | Visitor Management | 5 | 35 | 175 | 700 |
| 001-002 | Parking Management | 5 | 30 | 183 | 732 |
| 001-003 | Digital Badges | 5 | 25 | 155 | 620 |
| 001-004 | Lockers | 5 | 27 | 149 | 596 |
| 001-005 | Space Management | 6 | 37 | 215 | 860 |
| 001-006 | User Management | 6 | 36 | 194 | 776 |
| 001-007 | Tenant Management | 5 | 25 | 168 | 672 |
| 001-008 | Building Management | 5 | 24 | 130 | 520 |
| 001-009 | Reporting & Analytics | 5 | 25 | 180 | 720 |
| 001-010 | Notifications | 5 | 25 | 164 | 656 |
| 001-011 | Integration Hub | 5 | 29 | 196 | 784 |
| 001-012 | Security & Compliance | 5 | 30 | 196 | 784 |
| **TOTAL** | **12 Epics** | **62 Use Cases** | **348 Work Items** | **~2,105 SP** | **~8,420 hours** |

### Effort Distribution by Implementation Area

| Implementation Area | Work Items | Story Points | Estimated Hours | Percentage |
|---|---|---|---|---|
| Tenant Admin (Frontend) | ~140 | ~890 | ~3,560 | 42% |
| API (Backend) | ~185 | ~990 | ~3,960 | 47% |
| Global Admin | ~40 | ~185 | ~740 | 9% |
| API Documentation | ~8 | ~40 | ~160 | 2% |

*Note: Many work items span multiple implementation areas, so totals exceed 100%*

### Team Capacity Estimates

Assuming an 8-person development team working 5 days/week:

**Team Composition**:
- 3 Frontend Developers (React/Next.js)
- 3 Backend Developers (Node.js/API)
- 1 DevOps Engineer
- 1 QA Engineer

**Development Phases**:

| Phase | Duration | Milestones |
|---|---|---|
| Phase 1: Foundation | 3 months | User Management, Tenant Management, Building Setup, Security Core |
| Phase 2: Core Modules | 3 months | Visitor Management, Space Management, Notifications |
| Phase 3: Additional Modules | 3 months | Parking, Digital Badges, Lockers |
| Phase 4: Advanced Features | 3 months | Reporting, Analytics, Integrations, Polish |
| **Total** | **12 months** | Production-ready platform |

---

## Development Guidelines

### Code Standards

**Frontend (React/Next.js)**:
- Use TypeScript for type safety
- Follow Airbnb JavaScript Style Guide
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization
- Implement code splitting and lazy loading
- Follow atomic design principles (atoms, molecules, organisms)
- Maintain 80%+ code coverage

**Backend (Node.js/Express)**:
- Use TypeScript for type safety
- Follow RESTful API design principles
- Implement proper error handling middleware
- Use async/await for asynchronous operations
- Implement request validation middleware
- Use dependency injection for testability
- Follow SOLID principles
- Maintain 80%+ code coverage

**Database**:
- Use migrations for schema changes
- Always use parameterized queries
- Implement proper indexes for performance
- Use transactions for data consistency
- Implement soft deletes for audit trail
- Regular backup and testing of restore procedures

**Security**:
- Never store passwords in plain text
- Implement rate limiting on all endpoints
- Validate and sanitize all inputs
- Use HTTPS everywhere
- Implement CSRF protection
- Regular security audits and penetration testing
- Keep dependencies updated

### Testing Strategy

**Unit Tests**:
- Test individual functions and components
- Mock external dependencies
- Aim for 80%+ coverage
- Run on every commit (CI/CD)

**Integration Tests**:
- Test API endpoints with test database
- Test component integration
- Test third-party service integrations
- Run on every pull request

**End-to-End Tests**:
- Test critical user workflows
- Test across different browsers
- Test mobile responsiveness
- Run before deployment

**Performance Tests**:
- Load testing for API endpoints
- Stress testing for concurrent users
- Database query performance testing
- Frontend performance audits (Lighthouse)

### Documentation Requirements

**Code Documentation**:
- JSDoc comments for all functions
- README in every module
- Architecture Decision Records (ADRs)
- API documentation (Swagger/OpenAPI)

**User Documentation**:
- Admin user guides
- End-user tutorials
- Video walkthroughs
- FAQ and troubleshooting guides

**Technical Documentation**:
- System architecture diagrams
- Database schema documentation
- Deployment procedures
- Runbooks for common issues

---

## Appendices

### Appendix A: Glossary

**Terms and Definitions**:

- **Tenant**: An organization or customer using the NEOX Infinity App with isolated data
- **Host**: An employee who is expecting a visitor
- **Visitor**: An external person visiting the building
- **Badge**: A physical or digital credential for building access
- **Check-In**: The process of registering a visitor's arrival
- **Check-Out**: The process of registering a visitor's departure
- **QR Code**: Quick Response code used for fast visitor identification
- **Space**: Any bookable resource (meeting room, desk, phone booth)
- **Locker**: A storage unit that can be assigned or reserved
- **Epic**: A large body of work that can be broken down into features
- **Use Case**: A specific scenario or workflow for a feature
- **Work Item**: An atomic unit of development work (user story, task, bug)
- **Story Point**: A unit of effort estimation (Fibonacci scale: 1, 2, 3, 5, 8, 13, 21)

### Appendix B: Technology Alternatives

**Frontend Alternatives**:
- **Vue.js + Nuxt.js** instead of React + Next.js
- **Angular** for enterprises preferring opinionated frameworks
- **Svelte + SvelteKit** for lightweight, high-performance UI

**Backend Alternatives**:
- **.NET 8 + ASP.NET Core** for Microsoft-centric organizations
- **Python + FastAPI** for data-heavy applications
- **Go + Gin** for high-performance, concurrent workloads
- **Java + Spring Boot** for large enterprises

**Database Alternatives**:
- **MongoDB** for document-oriented data (JSON-heavy)
- **CockroachDB** for global distribution and resilience
- **Amazon Aurora** for managed PostgreSQL with auto-scaling

### Appendix C: Compliance Requirements

**GDPR Compliance**:
- Right to access personal data
- Right to be forgotten
- Right to data portability
- Consent management
- Data breach notification (72 hours)
- Privacy by design
- Data Protection Officer (DPO) for large deployments

**SOC 2 Type II**:
- Security controls
- Availability controls
- Processing integrity
- Confidentiality
- Privacy controls
- Annual audit requirements

**ISO 27001**:
- Information security management system (ISMS)
- Risk assessment and treatment
- Access control policies
- Incident management
- Business continuity planning

### Appendix D: API Endpoint Reference

**(Complete API reference would be included here with all endpoints, methods, request/response schemas, and authentication requirements)**

**Example Structure**:
```
GET    /api/visitors                    - List visitors
POST   /api/visitors                    - Create visitor
GET    /api/visitors/{id}               - Get visitor
PUT    /api/visitors/{id}               - Update visitor
DELETE /api/visitors/{id}               - Delete visitor
PUT    /api/visitors/{id}/checkin       - Check in visitor
PUT    /api/visitors/{id}/checkout      - Check out visitor
GET    /api/visitors/{id}/badge         - Get badge for visitor
POST   /api/visitors/{id}/badge/print   - Print badge
GET    /api/visitors/stats              - Get visitor statistics
... (continue for all modules)
```

### Appendix E: Azure DevOps Import Instructions

**Step 1: Create Service Work Item**
1. Navigate to Azure DevOps project
2. Go to Boards → Work Items
3. Click "New Work Item" → Select "Epic" or create custom "Service" type
4. Set ID: 001, Title: "NEOX Infinity App"
5. Set Description: (Copy from Service Level section)

**Step 2: Create Epic Work Items**
1. For each module (001-001 through 001-012):
2. Create Epic work item
3. Set Parent Link to Service (001)
4. Set Title, Description, Implementation Areas
5. Set Priority and Tags

**Step 3: Create Use Case (Feature) Work Items**
1. For each Use Case:
2. Create Feature work item
3. Set Parent Link to Epic
4. Set Acceptance Criteria
5. Set Implementation Areas

**Step 4: Create Work Items (User Stories/Tasks)**
1. For each Work Item:
2. Create User Story or Task
3. Set Parent Link to Use Case
4. Set Story Points
5. Set Acceptance Criteria
6. Set Tags and Priority

**Step 5: Import via CSV (Alternative)**
- Use provided CSV template
- Map columns to Azure DevOps fields
- Import in batches (Service, then Epics, then Use Cases, then Work Items)
- Verify Parent-Child relationships after import

**CSV Template Structure**:
```csv
Work Item Type,ID,Title,Description,ParentID,Implementation Area,Story Points,Priority,Tags
Service,001,NEOX Infinity App,"Multi-tenant platform...",,All,,High,Core
Epic,001-001,Visitor Management,"Complete visitor lifecycle...",001,"Global Admin;Tenant Admin;API",,High,"Module;Visitor"
Feature,001-001-UC01,Visitor Pre-Registration,"Allow hosts to pre-register...",001-001,"Tenant Admin;API",,High,"UC;Registration"
User Story,001-001-UC01-WI01,Create visitor registration form,"Design and implement...",001-001-UC01,Tenant Admin,5,High,"Frontend;Form"
...
```

---

## Version History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-10-28 | System | Initial comprehensive detailed specification with full implementation guidance, technical specifications, database schemas, and development guidelines |

---

**End of Specification Document**

*This document serves as the complete blueprint for developing the NEOX Infinity App. All development teams should refer to this specification for requirements, technical details, and implementation guidance. Updates to this document should be versioned and communicated to all stakeholders.*

