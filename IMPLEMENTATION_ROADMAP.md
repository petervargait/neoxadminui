# Phase 2 & 3 Implementation Roadmap

## Overview
This document outlines the systematic integration of GlobalStateContext into admin and tenant pages.

## Phase 2: Core CRUD Operations

### Priority 1: Critical Fixes (HIGH)

#### 1. Tenant Creation & Management (`admin/page.tsx`)
**Current State:** Mock data, no actual creation
**Required Changes:**
- Import `useGlobalState` hook
- Replace tenant list with `tenants` from global state
- Implement `handleCreateTenant` using `addTenant()`
- Implement tenant edit/delete using `updateTenant()` / `deleteTenant()`
- Add validation for mandatory fields

**Files to modify:**
- `src/app/admin/page.tsx` (Tenants List section, Create Tenant form)

#### 2. User Management CRUD (`admin/page.tsx` + `tenant/page.tsx`)
**Current State:** Local state, no persistence
**Required Changes:**
- Replace `users` local state with global `users`
- Fix profile selection dropdown to use global `profiles`
- Implement `addUser()`, `updateUser()`, `deleteUser()`
- Add user status toggle (active/inactive)

**Files to modify:**
- `src/app/admin/page.tsx` (User Management section)
- `src/app/tenant/page.tsx` (User Management section)

#### 3. Profile Management Edit/Delete (`admin/page.tsx`)
**Current State:** Can create, but no edit/delete
**Required Changes:**
- Add edit button to profile list
- Implement `updateProfile()` and `deleteProfile()`
- Add confirmation dialogs

**Files to modify:**
- `src/app/admin/page.tsx` (Modules section - profile management)

#### 4. Policy Upload/Download (`admin/page.tsx` + `tenant/page.tsx`)
**Current State:** Upload works, no download
**Required Changes:**
- Store file as Base64 in `uploadPolicy()`
- Implement `handlePolicyDownload()` using `downloadPolicy()`
- Inherit policies on tenant site from global admin

**Files to modify:**
- `src/app/admin/page.tsx` (Policy Management section)
- `src/app/tenant/page.tsx` (Policy section)

#### 5. Ticket Management (`admin/page.tsx` + `tenant/page.tsx`)
**Current State:** Static, no view/assign functions
**Required Changes:**
- Use global `tickets` and `addTicket()`
- Implement ticket view modal
- Implement assign to user (dropdown from `users`)
- Show ticket number in notifications
- Display tickets on both admin and tenant sites

**Files to modify:**
- `src/app/admin/page.tsx` (Ticket Management section)
- `src/app/tenant/page.tsx` (Ticket section)

### Priority 2: Module-Specific Fixes (MEDIUM)

#### 6. White Label Settings (`admin/page.tsx`)
**Current State:** No save/upload functionality
**Required Changes:**
- Implement logo upload as Base64
- Use `updateWhiteLabel()` to persist settings
- Load settings with `getWhiteLabel()`

**Files to modify:**
- `src/app/admin/page.tsx` (White Label section)

#### 7. Visitor Invitations (`tenant/page.tsx`)
**Current State:** Can't create/edit/delete
**Required Changes:**
- Implement `addInvitation()` on create
- Add edit/delete buttons with `updateInvitation()` / `deleteInvitation()`

**Files to modify:**
- `src/app/tenant/page.tsx` (Visitor Management section)

#### 8. Parking Assignment (`tenant/page.tsx`)
**Current State:** Assignment doesn't work
**Required Changes:**
- Use `parkingSpaces` from global state
- Implement `updateParkingSpace()` for assignment
- Show visual update and confirmation message

**Files to modify:**
- `src/app/tenant/page.tsx` (Parking section)

#### 9. Digital Badge User Selection (`admin/page.tsx` + `tenant/page.tsx`)
**Current State:** Manual entry
**Required Changes:**
- Change to user dropdown (from global `users`)
- Auto-fill user details
- Add badge assignment checkbox in user creation

**Files to modify:**
- `src/app/admin/page.tsx` (Digital Badges section)
- `src/app/tenant/page.tsx` (Digital Badges section)

### Priority 3: UI Enhancements (LOW)

#### 10. Template Saving (`tenant/page.tsx`)
**Current State:** No save function
**Required Changes:**
- Implement template save to localStorage or global state

**Files to modify:**
- `src/app/tenant/page.tsx` (Template section)

#### 11. Module/Profile Inheritance (`tenant/page.tsx`)
**Current State:** Doesn't show global profiles
**Required Changes:**
- Filter `profiles` where `isGlobal === true` or `tenantId === current`

**Files to modify:**
- `src/app/tenant/page.tsx` (Modules section)

#### 12. Audit Logs Integration (`admin/page.tsx`)
**Current State:** Static logs
**Required Changes:**
- Replace static array with global `auditLogs`
- Auto-updates via global state

**Files to modify:**
- `src/app/admin/page.tsx` (Audit Logs section)

## Phase 3: Approval Workflow System

### Task/Approval System
**New Feature:** Complete approval workflow

#### Required Components:
1. **Tasks Menu Item** (both admin and tenant)
   - Add "Tasks" to sidebar navigation
   - Show pending task count badge

2. **Tasks Page Section**
   - List all pending tasks
   - Group by type (create, update, delete)
   - Show entity details
   - Approve/Reject buttons
   - Comments/notes field

3. **Task Creation Hooks**
   - Wrap all CRUD operations with optional approval workflow
   - If approval required: create task instead of direct action
   - If not required: execute immediately

4. **Task Processing**
   - On approve: execute the stored action (e.g., actually create user)
   - On reject: discard task, notify requester

**Files to create/modify:**
- `src/app/admin/page.tsx` - Add Tasks menu + section
- `src/app/tenant/page.tsx` - Add Tasks menu + section
- Global state already supports tasks (`addTask`, `approveTask`, `rejectTask`)

## Implementation Order

### Batch 1: Foundation (Critical Path)
1. Import `useGlobalState` in both pages
2. Replace audit logs with global state
3. Replace module states with global state

### Batch 2: User & Tenant Management
4. Implement tenant CRUD
5. Implement user CRUD with profile selection
6. Implement profile edit/delete

### Batch 3: Content & Tickets
7. Implement policy download
8. Implement ticket view/assign
9. Implement white label save

### Batch 4: Tenant-Specific Features
10. Implement visitor invitation CRUD
11. Implement parking assignment
12. Implement badge user selection

### Batch 5: Approval Workflow
13. Add Tasks menu to both sites
14. Create Tasks section UI
15. Integrate task creation into CRUD operations
16. Implement approve/reject handlers

## Testing Checklist

After each batch:
- [ ] Data persists after page refresh
- [ ] Data visible across admin/tenant sites where applicable
- [ ] Audit logs record all actions
- [ ] No console errors
- [ ] UI updates immediately after actions

## Notes
- Each CRUD operation should validate inputs
- All operations auto-log via global state
- localStorage persists between sessions
- Global profiles visible in all tenants
- Policies uploaded on admin inherit to all tenants
