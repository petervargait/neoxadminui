# Reset localStorage for Testing

If parking spaces (or other resources) are not showing up correctly for tenants, you may need to reset the localStorage to restore the initial global state.

## Method 1: Browser Console

1. Open your browser's developer tools (F12 or Cmd+Option+I on Mac)
2. Go to the Console tab
3. Run this command:
   ```javascript
   localStorage.removeItem('neoxGlobalState')
   location.reload()
   ```

## Method 2: Application Storage

1. Open your browser's developer tools (F12)
2. Go to the "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Find "Local Storage" in the left sidebar
4. Click on your site URL
5. Right-click on `neoxGlobalState` and select "Delete"
6. Refresh the page

## What This Does

Clearing the localStorage will:
- Reset all parking spaces to be global (no tenantId)
- Reset all lockers to be global (no tenantId)  
- Reset all spaces to be global (no tenantId)
- Restore the initial seed data

After clearing, all tenants will be able to see and assign the global parking spaces, lockers, and spaces.

## Current Filter Logic

The tenant page uses this filter for parking spaces:
```javascript
const tenantParkingSpaces = globalState.parkingSpaces.filter(p => !p.tenantId || p.tenantId === selectedTenantId);
```

This means:
- Parking spaces WITHOUT a tenantId (global) → visible to ALL tenants
- Parking spaces WITH a matching tenantId → visible only to that tenant
- Parking spaces WITH a different tenantId → NOT visible

The same logic applies to lockers and spaces.
