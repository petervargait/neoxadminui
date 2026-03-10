# Integration Studio UI – Detailed Specification (Smart Building Integration Platform)
**Document type:** Product + Functional Specification (UI/UX + Runtime configuration output)  
**Version:** 1.0  
**Date:** 2026-03-05  
**Audience:** Product Owner, UX/UI, Engineering (Platform + Integration), Security, Operations

---

## Table of Contents
1. [Executive Summary](#executive-summary)  
2. [Problem Statement](#problem-statement)  
3. [Goals and Non-Goals](#goals-and-non-goals)  
4. [Key Concepts and Glossary](#key-concepts-and-glossary)  
5. [Personas, Roles, and RBAC](#personas-roles-and-rbac)  
6. [High-Level Architecture](#high-level-architecture)  
7. [Domain Scope and Canonical Contracts](#domain-scope-and-canonical-contracts)  
8. [Core Object Model](#core-object-model)  
9. [UI Information Architecture](#ui-information-architecture)  
10. [Detailed UI Modules and Screen Specifications](#detailed-ui-modules-and-screen-specifications)  
11. [End-to-End Workflows](#end-to-end-workflows)  
12. [Mapping, Transformation, and Validation Capabilities](#mapping-transformation-and-validation-capabilities)  
13. [Versioning, Promotion, and Governance](#versioning-promotion-and-governance)  
14. [Operations, Monitoring, and Incident Handling](#operations-monitoring-and-incident-handling)  
15. [Security, Privacy, and Compliance](#security-privacy-and-compliance)  
16. [Performance and Scalability Requirements](#performance-and-scalability-requirements)  
17. [Templates and Domain Recipes](#templates-and-domain-recipes)  
18. [MVP Scope and Roadmap](#mvp-scope-and-roadmap)  
19. [Appendices (Examples)](#appendices-examples)

---

## Executive Summary
**Integration Studio** is a configuration-driven UI that enables your Smart Building Integration Platform to connect multiple vendor systems (Parking, Access Control, Visitor Management, Lockers, Room Booking, AV/VC, Events, etc.) to a stable **internal canonical API**.

The platform must support:
- **Connector creation** for vendor systems (import vendor APIs, configure auth, map to canonical operations)
- **Mapping designer** (request/response/event mapping + transformations + error mapping)
- **Flow orchestration** for multi-step vendor workflows
- **Event & sync configuration** (webhooks, polling schedules, replay)
- **Testing + promotion** across Dev/Test/Prod with versioning and approvals
- **Operations** (health dashboards, logs, incidents, replay/DLQ)
- **Issue Reporting** as a canonical domain (replaces “CAFM” as a domain): tickets are routed to multiple backends (CAFM/EAM, ITSM, AV NOC, vendor portals) based on category rules
- **Identity integration** (NEW): Entra ID, Google, etc. for SSO and directory sync, with role/group mappings and identity correlation across all building systems.

---

## Problem Statement
You operate in a multi-vendor environment. Each building/system vendor exposes different APIs, data models, event formats, auth mechanisms, and operational constraints. Without a unifying configuration UI, integrations become:
- slow and expensive (custom code per vendor)
- fragile (changes are hard to govern and rollback)
- opaque (limited observability and hard troubleshooting)
- inconsistent (each integration behaves differently)

You need an **Integration UI** that lets your team map vendor capabilities to a stable internal canonical contract, so downstream apps and analytics remain consistent even when vendors differ.

---

## Goals and Non-Goals

### Goals
1. Enable rapid onboarding of new vendor systems via UI configuration.
2. Maintain a stable, versioned canonical API across domains.
3. Provide repeatable, template-based connectors and mappings.
4. Support bi-directional sync and event ingestion where applicable.
5. Provide operational readiness: monitoring, logs, replay, incident grouping.
6. Enforce security: secret handling, PII masking, RBAC, audit trails.
7. Treat **Issue Reporting** as a top-level domain that routes to multiple ticket backends.
8. Support **Identity providers** (Entra, Google, etc.) for SSO + directory sync + role mapping.

### Non-Goals (for MVP; may be future)
- Full low-code custom UI builders for tenant-facing apps
- Full-blown BPMN workflow suite for business processes (basic orchestration only)
- Custom connector code IDE (support minimal script hooks only)
- Replacing HR master data systems (Identity sync is not HR)

---

## Key Concepts and Glossary
- **Canonical API / Contract:** Your internal stable API for a domain (e.g., Parking reservation, Issue create).
- **External System:** A vendor product instance, scoped to a tenant/site (e.g., Parking Vendor A in Building X).
- **Connector:** A configured adapter that binds one external system instance to one canonical domain contract.
- **Operation Mapping:** Mapping a canonical operation to one or more external API calls.
- **Event Mapping:** Mapping vendor event payloads to canonical events.
- **Flow:** A multi-step orchestration used when canonical operation ≠ single vendor endpoint.
- **Auth Profile:** Stored reference to credentials and auth method; secrets are not exposed in UI.
- **Coverage:** Which canonical operations a connector implements (partial implementations allowed).
- **Issue Reporting:** Canonical Service Desk domain. It routes issues to multiple backends (CAFM/EAM, ITSM, AV tools, etc.).
- **Identity Provider (IdP):** Entra, Google, etc. used for SSO and directory sync.
- **Promotion:** Moving connector versions across environments (Dev → Test → Prod).
- **DLQ:** Dead-letter queue for failed events/messages that require manual inspection.

---

## Personas, Roles, and RBAC

### Personas
1. **Platform Admin**
   - Manages tenants, sites, environments, RBAC, templates, governance policies.
2. **Integration Engineer**
   - Builds connectors, mappings, flows; runs tests; prepares deployment.
3. **Operator / NOC / FM Ops**
   - Monitors health, investigates failures, replays jobs/events, acknowledges incidents.
4. **Security / Auditor**
   - Reviews audit logs, access rules, retention policies; read-only system visibility.
5. **Tenant Admin (Optional)**
   - Manages site-level config only (endpoints, schedules, routing parameters), no global power.

### RBAC Requirements
- Permissions must be scoped by: **tenant → site/building → domain → connector → environment**.
- Roles must support granular rights: view/edit/test/deploy/replay/audit/export.
- **Separation of duties:** production promotion may require approval by Platform Admin or a second engineer.

---

## High-Level Architecture

### Components (conceptual)
1. **Integration Studio UI** (web app)
2. **Configuration Service**
   - stores connector definitions, versions, approvals, audit logs
3. **Canonical API Gateway**
   - exposes internal domain APIs used by apps and internal services
4. **Connector Runtime / Execution Engine**
   - executes mappings, calls vendor APIs, performs retries/backoff, emits events
5. **Eventing Layer**
   - webhooks receiver, message bus integration, scheduler for polling
6. **Secret Store / Vault**
   - stores credentials (API keys, OAuth clients, certs); UI gets references only
7. **Observability Stack**
   - logs, metrics, traces, alerting; integration with SIEM/ITSM is optional but recommended

### Environment model
- **Dev / Test / Prod** per tenant (or per platform).
- Configurations are promoted, not re-created.

---

## Domain Scope and Canonical Contracts

### Top-level canonical domains
- **BMS** — Building Management Systems (Nective, Schneider EcoStruxure, Siemens Desigo, bGrid*)
- **AV/UC** — Audio Visual / Unified Communications (Crestron, Cisco Webex Devices)
- **IoT** — IoT Sensors & Occupancy (bGrid, Haltian, XYSense, Avigilon Halo)
- **Access Control** — Physical access (Avigilon, Locksense, ThirdMillennium, HID Origo, HikCentral, SeaWing*)
- **Digital Badge** — Badge provisioning (HID Origo, Legic Connect, NXP DESFire EV3)
- **Lockers** — Smart locker management (Vecos, Digilock, Flexlock)
- **Ticketing** — Facility & IT ticketing (IBM Maximo, Cisco Spaces, APFM, Facilio*)
- **Elevator** — Elevator dispatch & floor auth (KONE DX*, Otis ONE*)
- **Visitor Management** — Visitor lifecycle (TDS, NEOX Visitor)
- **Parking** — Parking reservation & whitelist (SkiData, NEOX Parking, Designa*, Swarco*, Parkl*, ParkHelp*)
- **Event Management** — Event lifecycle (NEOX Events)
- **Restaurant** — Menu & ordering (NEOX Restaurant)
- **Waste Management** — Container tracking (WasteTracker)

> *Items marked with \* are on the roadmap (inactive/planned).*
> **Identity** is a cross-cutting domain (see below), not listed here as a canonical integration domain.

### Issue Reporting as the canonical domain
Issue Reporting is the single unified “ticket” contract. Under it:
- Categories: **ITC, FM, AV/VC, Security, Cleaning, Catering, HSE, etc.**
- Backends: CAFM/EAM, ITSM, AV NOC tools, vendor portals, contractor systems

### Identity as a cross-cutting canonical domain
Identity provides:
- SSO configuration (OIDC/SAML)
- Directory sync (users/groups/memberships)
- Platform RBAC mapping from IdP groups
- Identity correlation used by other domains (badge IDs, booking user IDs, etc.)

---

## Core Object Model

### Tenancy and locations
| Object | Description | Key fields |
|---|---|---|
| Tenant | Customer/organization boundary | tenantId, name, data region, retention policies |
| Site/Campus | A physical site | siteId, timezone, address, hierarchy |
| Building | A building under a site | buildingId, floors, zones |
| Zone/Space | Optional hierarchy | zoneId, roomId, type |

### External system registry
| Object | Description | Key fields |
|---|---|---|
| ExternalSystem | Vendor instance at tenant/site | systemId, domainType, vendor, product, version, tenantId (dropdown), siteId |
| Endpoint | Environment-specific endpoint with credentials | env (Dev/Test/Prod), baseUrl, healthUrl, apiKey, apiToken |
| Capability | Supported feature flags | supportedOps list, limits |
| RateLimitPolicy | Vendor constraints | rpm, burst, concurrency |

> **Note:** Auth Profiles have been merged into External Systems. Each endpoint (Dev/Test/Prod) carries its own `apiKey` and `apiToken`. The tenant field uses a dropdown populated from existing tenants. An "Open API Endpoint" button is available to directly access the system's base URL.

### Integration configuration
| Object | Description | Key fields |
|---|---|---|
| Connector | Adapter from canonical domain to vendor | connectorId, domain, externalSystemId, status |
| ConnectorVersion | Immutable deployable version | version, createdBy, createdAt, changelog, artifactHash |
| OperationMapping | Canonical op → vendor endpoint(s) | canonicalOpId, vendorCallRefs, mappingRefs |
| Mapping | Field-level mapping definition | requestMap, responseMap, errorMap, eventMap |
| TransformLibrary | Reusable functions/blocks | functions, lookups, templates |
| Flow | Multi-step orchestration | steps, conditions, compensation |
| CorrelationStoreConfig | ID mapping settings | entityTypes, keys, TTL, merge rules |

### Operations/runtime
| Object | Description | Key fields |
|---|---|---|
| SyncJob | Scheduled pull | schedule, cursor/watermark, batch size |
| WebhookSubscription | Vendor → platform events | secret/signature, filters, retry policy |
| ExecutionLog | Runtime details | correlationId, op, vendor, latency, status, masked payload |
| Incident | Grouped failures | errorSignature, severity, owner, state, SLA |

---

## UI Information Architecture

### Primary navigation (sidebar)
- **Dashboard** — Health overview with 13 domain cards
- **External Systems** — Vendor system registry (38 systems across 13 domains). Each system has per-environment (Dev/Test/Prod) endpoints with API Key and Token. Tenant selected via dropdown.
- **Canonical APIs** — Internal contract catalog (13 domains with operations)
- **Connectors** — Connector list with coverage %, health, versioning
- **Mapping Designer** — Field-level mapping UI
- **Flows** — Multi-step orchestration designer
- **Events & Sync** — Webhooks (7 subscriptions) + Polling (7 jobs) + Replay
- **Testing** — Test console with 14 connectors and per-domain operations
- **Health & Logs** — Connector health cards (16 connectors) + request logs
- **Incidents** — Error grouping with severity S1-S4 and assignment
- **Issue Reporting** — Taxonomy, Routing & Dispatch, Backends
- **Identity** — SSO Providers, Directory Sync, Role Mapping, Identity Correlation
- **Templates** — 13 pre-built connector templates (one per domain)

> **Note:** Auth Profiles was removed as a separate section. Authentication (API Key/Token) is now configured per-environment directly on each External System.

---

## Detailed UI Modules and Screen Specifications

> **Note:** Each screen includes: purpose, core UI components, validations, permissions, and acceptance criteria.

### 1) Dashboard
**Purpose:** At-a-glance health and change activity.

**Components**
- Overall health per domain (OK/Warn/Critical)
- Top failing connectors (last 1h/24h/7d)
- Error rate, latency p95 per connector
- Recent deployments/promotions
- SLA alerts (especially Issue Reporting)

**Permissions**
- Read-only for Operator/Auditor; Admin/Engineer sees deployment widgets.

**Acceptance criteria**
- Operator can identify the top 3 failing connectors within 30 seconds.

---

### 2) External Systems Registry
**Purpose:** Register vendor systems, endpoints, and API credentials.

**Create/Edit External System modal — sections:**

*System Identity*
- System Name, Domain Type (13 domain types: BMS, AV/UC, IoT, Access Control, Digital Badge, Lockers, Ticketing, Elevator, Visitor Management, Parking, Event Management, Restaurant, Waste Management, Identity Provider)
- Vendor, Product, Version, Status (Active/Inactive/Maintenance)
- Tenant (dropdown from existing tenants), Site ID

*Endpoints (per-environment cards)*
Each environment (Dev, Test, Prod) is a color-coded card containing:
- Base URL
- API Key
- API Token

*Connectivity test*
- DNS resolution, TLS validation, health endpoint call
- Show result with timestamp; store last success time

**Table columns:** Name, Domain, Vendor, Product, Site, Status, Actions (Open API Endpoint, Edit, Delete)

**Registered vendor systems (38 total):**

| Domain | Vendors (Active) | Roadmap (*) |
|--------|-----------------|-------------|
| BMS | Nective, Schneider EcoStruxure, Siemens Desigo | bGrid* |
| AV/UC | Crestron, Cisco Webex | — |
| IoT | bGrid, Haltian, XYSense, Avigilon Halo | — |
| Access Control | Avigilon, Locksense, ThirdMillennium, HID Origo, HikCentral | SeaWing* |
| Digital Badge | HID Origo, Legic, NXP DESFire EV3 | — |
| Lockers | Vecos, Digilock, Flexlock | — |
| Ticketing | IBM Maximo, Cisco Spaces, APFM | Facilio* |
| Elevator | — | KONE*, Otis* |
| Visitor Management | TDS, NEOX Visitor | — |
| Parking | SkiData, NEOX Parking | Designa*, Swarco*, Parkl*, ParkHelp* |
| Event Management | NEOX Events | — |
| Restaurant | NEOX Restaurant | — |
| Waste Management | WasteTracker | — |

**Validations**
- baseUrl must be https (except local dev)
- prevent duplicate system definitions per site+vendor+domain unless explicitly allowed

**Permissions**
- Engineer can create for assigned tenant/site
- Admin can create globally

**Acceptance criteria**
- Engineer can add a system with per-environment API credentials and verify connectivity without leaving the UI.
- Each external system has an "Open API Endpoint" action button to directly open the production base URL.

---

### 4) Canonical APIs (Internal Contract Catalog)
**Purpose:** Make canonical endpoints and schemas visible and stable.

**Views**
- list by domain (filter/search)
- endpoint details: method/path, schema, example payloads, error codes
- event schema details (IssueUpdated, DoorEvent, etc.)

**Impact analysis (recommended)**
- show which connectors use the endpoint
- “change risk” if schema changes

**Acceptance criteria**
- Engineer can quickly see required fields and constraints for any canonical operation.

---

### 5) Connectors → List
**Purpose:** manage connectors across domains and environments.

**Columns**
- Connector name
- Domain
- External system (vendor/site)
- Coverage %
- Deployed version per environment
- Health summary (OK/Warn/Critical)
- Last test result

**Actions**
- Open connector
- Create new version
- Test
- Promote
- Rollback
- Pause/Resume

---

### 6) Connector Builder (Wizard)
**Purpose:** standard path to build a connector.

**Steps**
1. Choose domain
2. Select external system instance
3. Import vendor API spec (OpenAPI) or manual endpoints
4. Select canonical operations to implement
5. For each operation: bind vendor endpoint(s)
6. Choose auth profile
7. Configure runtime policies (timeouts/retries/circuit breaker/rate limit)
8. Configure sync/events (webhook vs poll schedule)
9. Run test suite
10. Create version & optionally promote

**Acceptance criteria**
- A basic connector implementing 1-2 operations can be built and tested in < 1 hour.

---

### 7) Mapping Designer (core)
**Purpose:** map canonical requests/responses/errors/events to vendor payloads.

#### 7.1 Request mapping tab
- left pane: canonical request schema tree
- right pane: vendor request schema tree (from OpenAPI or inferred)
- mapping panel: field mappings + transforms

#### 7.2 Response mapping tab
- vendor response → canonical response mapping
- support list/array mapping and pagination normalization

#### 7.3 Error mapping tab
- map vendor error codes/messages/HTTP status to canonical error codes
- mark retryable errors
- specify user-friendly messages (optional)

#### 7.4 Preview & validation
- run mapping preview with sample payloads
- validate required fields and types
- mask PII in preview (configurable)

**Transform types**
- constants/default values
- if/else conditions
- lookups (enum mapping tables)
- regex replace
- date/time parsing and timezone normalization
- unit conversions
- string templates
- optional “script hook” (limited sandbox, audited)

**Acceptance criteria**
- Engineer can view “canonical input → vendor request” and “vendor response → canonical output” before running a live test.

---

### 8) Flow Orchestration
**Purpose:** handle multi-call workflows and vendor-specific sequences.

**Flow model**
- steps (HTTP call, transform, conditional, wait, loop/iterate)
- shared context object
- branching conditions (based on response codes/fields)
- compensation steps (optional)

**Typical use cases**
- Parking: create booking + whitelist plate
- Visitor: preregistration + QR pass generation + optional badge provisioning
- Issue backend: create ticket + attach file + post initial comment

**Acceptance criteria**
- Engineer can model a 2–3 step flow without writing code.

---

### 9) Events & Sync
**Purpose:** configure vendor → platform updates.

**Webhook configuration**
- callback URL generated per connector/environment
- signature verification / secret
- retry policy + exponential backoff
- filters (event types)

**Polling sync**
- schedule (cron-like UI)
- cursor/watermark strategy
- batch size and throttling

**Replay**
- replay by event ID/time window
- reprocess from a cursor

**Acceptance criteria**
- Operator can replay failed events safely (role-gated).

---

## Issue Reporting (Service Desk) – detailed UI requirements

### 10) Issue Reporting → Taxonomy Management
**Purpose:** define categories that drive routing and form requirements.

**Features**
- category tree (drag/drop ordering)
- per category:
  - required fields (roomId, assetId, attachments required, etc.)
  - default priority suggestions
  - SLA policy reference
  - allowed channels (mobile app, kiosk, operator)
- localization (labels per language if needed)

**Acceptance criteria**
- Admin can create “AV/VC → Meeting Room → Teams Codec” and mark roomId as required.

---

### 11) Issue Reporting → Routing & Dispatch Rules
**Purpose:** route a canonical issue to the correct backend system/queue/team.

**Rule builder**
- Conditions:
  - category/subcategory (supports “starts with”, “in list”)
  - site/building/zone
  - asset type
  - priority/impact/urgency
  - time window (business hours, weekends)
  - reporter type (employee/visitor/operator)
- Actions:
  - choose backend connector (CAFM/EAM, ITSM, AV tool, vendor portal)
  - set target queue/group
  - set assignee policy (round robin, skill-based, on-call)
  - escalation timers (no-ack, no-resolve)

**Conflict resolution**
- rule precedence (top-down)
- “first match wins” vs “multi-dispatch” (MVP: first match wins)

**Acceptance criteria**
- An AV/VC issue from Building A routes to AV NOC tool; an FM issue routes to CAFM/EAM.

---

### 12) Issue Reporting → Backend Connectors
**Purpose:** configure the ticketing backends.

Backends may include:
- CAFM/EAM (Maximo/Hexagon/Planon/etc.)
- ITSM (ServiceNow/Jira/etc.)
- AV vendor NOC platforms
- Security incident tool
- Contractor portal

**Required operations**
- CreateTicket
- UpdateTicket
- GetTicket
- AddComment
- AddAttachment
- Optional: webhook ingestion for status updates

**Field mapping focus**
- classification/category mapping
- priority/impact/urgency
- location and asset mapping
- status normalization (Open/In Progress/Waiting/Resolved/Closed)

**Acceptance criteria**
- A user sees a unified issue timeline even if backend is different.

---

## Identity (Entra, Google, etc.) – detailed UI requirements

### 13) Identity → SSO Providers
**Purpose:** configure login integration (OIDC/SAML) with Entra/Google.

**Provider setup**
- provider type: Entra / Google
- protocol: OIDC (preferred) and/or SAML
- issuer, authorization endpoint, token endpoint, jwks/certs
- redirect URIs (display + copy)
- logout settings
- claims mapping:
  - subject identifier → internal user key strategy
  - email/UPN mapping
  - name fields mapping
- JIT provisioning toggle:
  - create user on first login vs require pre-provision

**Group/role mapping**
- map IdP groups → platform roles (Admin/Engineer/Operator/Tenant Admin)
- allow per-tenant role mapping

**Acceptance criteria**
- Admin can configure Entra OIDC and map group “NEOX-Integrations-Engineers” to Integration Engineer role.

---

### 14) Identity → Directory Sync
**Purpose:** sync users, groups, and memberships.

**Sync scope**
- all users vs filtered (by group or attribute)
- include/exclude rules

**Sync schedule**
- interval (e.g., every 15 min / hourly / daily)
- backfill window

**Attribute mapping**
- canonical person schema fields:
  - internalUserId, email, displayName, phone, department, costCenter, locale, status
- mapping rules with transforms (normalize phone, enforce lowercase email, etc.)

**Lifecycle**
- deprovision policy: disable vs delete
- group membership change handling

**Correlation**
- primary: immutable objectId (Entra) / userId (Google)
- fallback: email/UPN match

**Acceptance criteria**
- Operator can see last sync status, number of changes, and errors (e.g., permission denied).

---

### 15) Identity → Identity Correlation
**Purpose:** map identity across building systems.

**Supported correlation keys**
- internalUserId ↔ Entra objectId / Google userId
- internalUserId ↔ access card/badge ID
- internalUserId ↔ parking account ID
- internalUserId ↔ room booking user key
- internalUserId ↔ locker account key

**UI features**
- correlation rules per connector/entity
- manual resolution queue (duplicates/conflicts)
- export (role-gated)

**Acceptance criteria**
- When a badge ID changes, connector runtime updates access control mapping without breaking other systems.

---

## Testing

### 16) Testing Console
**Purpose:** validate connectors and mappings before production.

**Capabilities**
- choose connector + environment
- select canonical operation
- provide sample canonical input payload
- run in “dry run” (mapping preview) or “live call”
- view generated vendor calls (sequence for flows)
- store test cases for regression tests
- mock mode (record vendor responses)

**Acceptance criteria**
- Engineer can run regression tests against a connector version before promoting to Prod.

---

## Operations, Monitoring, and Incident Handling

### 17) Health view
- status per connector/environment
- last successful call/sync
- vendor error rate, latency, retries

### 18) Logs
- filters: connector, operation, site, entityId, correlationId, time range
- masked payload previews (PII redacted)
- export controls (audited)

### 19) Incidents
- error grouping (signature: vendor + operation + error)
- severity levels (S1–S4)
- assignment and notes
- links to relevant logs

### 20) Replay / DLQ (recommended)
- list failed executions/events
- replay with guardrails (idempotency check)
- mark “resolved” or “ignored” with reason

**Acceptance criteria**
- Operator can replay a failed webhook event and see it succeed without duplicating downstream objects.

---

## Versioning, Promotion, and Governance

### 21) Versioning model
- connector config is versioned (e.g., 1.2.0)
- versions are immutable artifacts
- environment deployments point to a version

### 22) Promotion workflow
- Dev: engineer can deploy self
- Test: engineer deploy + optional peer review
- Prod: approval required (Admin or 2-person rule)

### 23) Rollback
- one-click rollback to previous prod version
- rollback reason required

### 24) Audit trail
- track who changed what and when
- include diff view for:
  - mapping changes
  - policy changes
  - routing rule changes
  - identity configuration changes

---

## Mapping, Transformation, and Validation Capabilities

### 25) Mapping language requirements
- deterministic, testable, versioned
- supports common functions:
  - `coalesce`, `default`, `if`, `equals`, `contains`
  - string functions: `concat`, `substring`, `lower`, `upper`, `trim`
  - regex replace
  - date parse/format + timezone conversion
  - number conversion + rounding
  - lookup tables (enum map)
- ability to reference:
  - connector config constants (siteId, vendorAccountId, etc.)
  - correlation store lookups (internalId ↔ externalId)

### 26) Validation
- schema validation against canonical contract
- vendor schema validation (if OpenAPI available)
- preflight checks: required mappings exist

---

## Security, Privacy, and Compliance

### 27) Secrets
- stored in vault, referenced by ID
- UI must not display secrets
- rotation supported; connector runtime must handle rotation without downtime

### 28) PII handling
- PII masking in logs and previews
- configurable retention periods per tenant
- audit access to sensitive exports

### 29) Access controls
- least privilege RBAC
- separation of duties for prod deployment

### 30) GDPR considerations
- data minimization (store only what needed)
- data subject delete/anonymize flows (as allowed by external backends)

---

## Performance and Scalability Requirements

### 31) Expected patterns
- high volume events: access door events, IoT-like status events, AV telemetry
- bursty patterns during start/end of day or events

### 32) Performance targets (guidance)
- UI: page loads < 2s typical
- canonical API calls: p95 latency target defined per domain (e.g., Access events ingestion under seconds)
- connector runtime:
  - supports concurrency limits per vendor
  - handles backpressure with queues
  - rate-limit aware

---

## Templates and Domain Recipes

### 33) Templates library
Ship templates per domain:
- Parking (reservation + permit/whitelist patterns)
- Access Control (credential lifecycle + door events)
- Visitor (prereg + approvals + pass issuance)
- Locker (booking rules + unlock + audit)
- Rooms (availability + booking + check-in policy)
- AV/VC (device status + meeting join hooks)
- Events (ticket validation + loyalty flows)
- Issue Reporting backend template (ticket lifecycle + attachments)
- Identity templates (Entra OIDC + sync, Google OIDC + sync)

### 34) Coverage reporting
- each connector shows:
  - canonical ops implemented
  - ops missing (with reasons: vendor not supported vs not configured)
  - test coverage (cases passing)

---

## MVP Scope and Roadmap

### MVP (Phase 1)
- External Systems registry + Auth Profiles
- Canonical API Catalog (read-only)
- Connector Builder + Mapping Designer (req/resp/error)
- Basic Flow Orchestration (sequential + simple branching)
- Events: webhook receiver + polling schedule
- Testing console (live + dry run)
- Operations: logs + health + pause/resume + replay (basic)
- Issue Reporting: taxonomy + routing + 1 backend connector type
- Identity: Entra + Google SSO + directory sync + role mapping

### Phase 2
- DLQ UI + advanced replay controls
- Full bi-directional sync with conflict rules UI
- Advanced flow designer (visual nodes/edges)
- Impact analysis and schema change warnings
- SIEM/ITSM integrations (Splunk/Sentinel/ServiceNow/Jira)

### Phase 3
- AI-assisted mapping suggestions
- Auto-triage for issues using telemetry (AV/IoT) + recommended playbooks
- Large-scale multi-building connector fleet management
- Connector Marketplace / certified templates per vendor

---

## Appendices (Examples)

### Appendix A – Example Connector Definition (JSON)
```json
{
  "connectorId": "parking-vendorA-buildingX",
  "domain": "parking",
  "externalSystemId": "sys-vendorA-parking-bldgX",
  "version": "1.0.0",
  "authProfileRef": "auth-oauth2-vendorA",
  "policies": {
    "timeoutMs": 8000,
    "retries": { "max": 3, "backoff": "exponential", "baseMs": 500 },
    "rateLimit": { "rpm": 300, "concurrency": 10 },
    "circuitBreaker": { "errorRate": 0.2, "windowSec": 60 }
  },
  "operations": [
    {
      "canonicalOpId": "parking.createReservation",
      "flowRef": "flow.createReservation.vendorA"
    }
  ],
  "flows": {
    "flow.createReservation.vendorA": {
      "steps": [
        {
          "type": "http",
          "name": "createBooking",
          "method": "POST",
          "path": "/api/bookings",
          "requestMapRef": "map.booking.request",
          "responseVar": "bookingResp"
        },
        {
          "type": "conditional",
          "if": "ctx.bookingResp.requiresWhitelist == true",
          "then": [
            {
              "type": "http",
              "name": "addWhitelist",
              "method": "POST",
              "path": "/api/whitelist",
              "requestMapRef": "map.whitelist.request"
            }
          ]
        },
        {
          "type": "transform",
          "name": "toCanonicalResponse",
          "mapRef": "map.reservation.response"
        }
      ]
    }
  },
  "mappings": {
    "map.booking.request": { "type": "mapping", "rules": [] },
    "map.whitelist.request": { "type": "mapping", "rules": [] },
    "map.reservation.response": { "type": "mapping", "rules": [] }
  }
}
```

### Appendix B – Example Issue Routing Rule
```yaml
ruleId: route-avvc-buildingA
when:
  categoryPrefix: "AVVC"
  siteId: "site-A"
then:
  backendConnectorId: "issue-backend-av-noc-tool"
  targetQueue: "AVVC_L2"
  escalation:
    noAckMinutes: 10
    noResolveMinutes: 120
priority: 10
```

### Appendix C – Example Identity Role Mapping
```yaml
provider: entra
tenant: mbh
groupRoleMappings:
  - groupObjectId: "xxxx-aaaa"
    role: "IntegrationEngineer"
  - groupObjectId: "yyyy-bbbb"
    role: "Operator"
jitProvisioning: true
```

### Appendix D – Example Issue Taxonomy Snippet
```yaml
categories:
  - name: ITC
    children:
      - name: Network
      - name: Workplace
  - name: FM
    children:
      - name: HVAC
      - name: Lighting
  - name: AVVC
    children:
      - name: MeetingRoom
        requiredFields: ["roomId"]
        children:
          - name: TeamsCodec
          - name: Display
```

---

**End of document.**
