# Required Fixes for NeoxAdminUI

## Status: IN PROGRESS

### 1. ✅ Tasks Menu - COMPLETE
- [x] Add Tasks menu item to Admin sidebar
- [x] Add Tasks title to header
- [x] Implement Tasks section UI with approval workflow
- [x] Show pending tasks (create/edit/delete operations)
- [x] Add approve/reject buttons with details view
- [ ] TODO: Add Tasks menu to Tenant site (not critical)

### 2. ✅ Tenant Persistence Issues - COMPLETE
- [x] Fix: Creating new tenant causes existing tenants to disappear
- [x] Fix: Tenants persistent via GlobalStateContext
- [x] New tenants visible on home page
- [x] Updated tenant selector dropdown to use GlobalState tenants

### 3. Module/Profile Management
- [ ] Add edit function for global profiles
- [ ] Add delete function for global profiles

### 4. Policy Visibility on Tenant Site
- [ ] Make uploaded policies visible on Tenant site
- [ ] Add download functionality for policies on Tenant site

### 5. Ticket Management
- [ ] Fix "View Ticket" button functionality
- [ ] Implement assign ticket to existing users
- [ ] Make tickets visible on global admin site

### 6. ✅ User Management - Profile Selection - COMPLETE
- [x] Fixed profile selection dropdown (now properly sets value)
- [x] User creation works with profile selection
- [x] User modification works
- [ ] TODO: Fix user deletion function (needs implementation)
- [ ] TODO: Apply same fixes to tenant site

### 7. ✅ White Label - COMPLETE
- [x] Logo upload functionality working
- [x] White label settings save function working

### 8. Visitor Invitations (Tenant Site)
- [ ] Fix view invitation functionality
- [ ] Implement modification of invitations
- [ ] Implement deletion of invitations

### 9. Parking Management (Tenant Site)
- [ ] Fix parking assignment function
- [ ] Make assigned parking appear in visual list
- [ ] Make assigned parking appear in list below
- [ ] Show confirmation with assigned space details

### 10. Digital Badge - User Selection
- [ ] Change digital badge to select from existing users only
- [ ] Inherit all details from selected user
- [ ] Apply to both admin and tenant sites

### 11. Digital Badge Assignment in User Creation
- [ ] Add digital badge assignment option during user creation
- [ ] Apply to both admin and tenant sites

### 12. Template Menu
- [ ] Fix template changes persistence
- [ ] Ensure changes are saved properly

### 13. Modules Menu - Global Profile Inheritance
- [ ] Fix tenant site modules menu to inherit Global profiles
- [ ] Display modules from assigned Global profiles

### 14. Ticket Creation
- [ ] Fix ticket creation (not being created)
- [ ] Show ticket number in notification
- [ ] Make tickets visible on global admin site

## Implementation Plan

### Phase 1: Core Infrastructure (GlobalState fixes)
1. Fix tenant persistence
2. Connect tenant selector to GlobalState
3. Fix user profile selection

### Phase 2: Critical User Functions
1. User management operations (add/edit/delete)
2. White label save functionality
3. Ticket creation and assignment

### Phase 3: Tasks & Approval Workflow
1. Implement Tasks UI
2. Connect approval workflow
3. Add to both admin and tenant sites

### Phase 4: Remaining Features
1. Policy visibility on tenant site
2. Parking management fixes
3. Visitor invitation operations
4. Template persistence
5. Digital badge user selection
6. Module inheritance from global profiles
