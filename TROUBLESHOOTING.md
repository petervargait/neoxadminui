# NEOX Infinity - Troubleshooting Guide

## LocalStorage Reset

The application uses localStorage with key `neox_global_state` to persist all state data. If data appears incorrect or you need to reset, use these methods.

### Full Reset (Clear All Data)

**Method 1: Browser Console**
```javascript
localStorage.removeItem('neox_global_state')
location.reload()
```

**Method 2: Application Tab**
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Find Local Storage > your site URL
4. Delete `neox_global_state`
5. Refresh the page

This restores all seed data (tenants, users, parking spaces, lockers, spaces, etc.)

### Clear Only Parking Spaces

Removes parking data while preserving everything else:

```javascript
const storedState = localStorage.getItem('neox_global_state');
if (storedState) {
  const state = JSON.parse(storedState);
  state.parkingSpaces = [];
  localStorage.setItem('neox_global_state', JSON.stringify(state));
  console.log('Parking spaces cleared. Refresh the page.');
} else {
  console.log('No stored state found.');
}
```

### Clear Specific Data

Replace `parkingSpaces` with any of these keys:
- `parkingSpaces` - Parking space data
- `lockers` - Locker data
- `spaces` - Desk/room space data
- `invitations` - Visitor invitations
- `tickets` - Support tickets
- `badges` - Digital badges
- `operationalMessages` - System messages

### Verify State

```javascript
const state = JSON.parse(localStorage.getItem('neox_global_state'));
console.log('Keys:', Object.keys(state));
console.log('Tenants:', state.tenants.length);
console.log('Users:', state.users.length);
console.log('Parking:', state.parkingSpaces.length);
```

## Tenant Data Filtering

Resources use tenant-based filtering:

```javascript
// Visible to tenant if: no tenantId (global) OR matching tenantId
const tenantSpaces = globalState.parkingSpaces.filter(
  p => !p.tenantId || p.tenantId === selectedTenantId
);
```

- Resources WITHOUT `tenantId` (global) are visible to ALL tenants
- Resources WITH matching `tenantId` are visible only to that tenant
- Resources WITH different `tenantId` are NOT visible

## Policy Fallback Logic

Tenant policies follow this hierarchy:
1. **Tenant version** (uploaded by tenant admin) - highest priority
2. **Global version** (uploaded by global admin) - fallback
3. **Not uploaded** - neither version available

## Build Issues

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Full build
npm run build

# Clear Next.js cache
rm -rf .next && npm run build
```
