# Required Fixes for NeoxAdminUI

## Status: IN PROGRESS

### 1. ✅ Tasks Menu - PARTIALLY COMPLETE
- [x] Add Tasks menu item to Admin sidebar
- [x] Add Tasks title to header
- [ ] Implement Tasks section UI with approval workflow
- [ ] Show pending tasks (create/edit/delete operations)
- [ ] Add approve/reject buttons with details view
- [ ] Add Tasks menu to Tenant site

### 2. Tenant Persistence Issues
- [ ] Fix: Creating new tenant causes existing tenants to disappear
- [ ] Fix: Tenants not persistent in GlobalStateContext
- [ ] Fix: New tenants not visible on home page
- [ ] Update tenant selector dropdown to use GlobalState tenants

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

### 6. User Management - Profile Selection
- [ ] Fix profile selection dropdown (not setting value)
- [ ] Fix user deactivation function
- [ ] Fix user deletion function
- [ ] Fix user modification function
- [ ] Apply fixes to both admin and tenant sites

### 7. White Label
- [ ] Fix logo upload functionality
- [ ] Fix white label settings save function

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
