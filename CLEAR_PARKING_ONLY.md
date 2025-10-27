# Clear Only Parking Spaces from localStorage

This will remove all parking space data while keeping everything else (users, tenants, badges, lockers, spaces, buildings, etc.) intact.

## Instructions

1. Open your browser's Developer Console (Press F12 or right-click → Inspect → Console)

2. Copy and paste this code:

```javascript
// Get current state from localStorage
const storedState = localStorage.getItem('neox_global_state');

if (storedState) {
  const state = JSON.parse(storedState);
  
  // Clear only parking spaces
  state.parkingSpaces = [];
  
  // Save back to localStorage
  localStorage.setItem('neox_global_state', JSON.stringify(state));
  
  console.log('✅ Parking spaces cleared! All other data preserved.');
  console.log('Please refresh the page to see changes.');
} else {
  console.log('⚠️ No stored state found.');
}
```

3. Press Enter to execute

4. Refresh the page (F5 or Cmd+R)

5. Now create new parking spaces in the Admin panel with a specific tenant selected

## Alternative: Reset to Default Parking Spaces

If you want to reset parking spaces to the default sample data instead of clearing them:

```javascript
// Get current state from localStorage
const storedState = localStorage.getItem('neox_global_state');

if (storedState) {
  const state = JSON.parse(storedState);
  
  // Reset to default parking spaces (40 spaces in Building A, 40 in Building B)
  state.parkingSpaces = [
    // Building A - Level 1 (20 spaces)
    { id: 'p1', spaceNumber: 'A-101', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p2', spaceNumber: 'A-102', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p3', spaceNumber: 'A-103', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p4', spaceNumber: 'A-104', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p5', spaceNumber: 'A-105', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p6', spaceNumber: 'A-106', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p7', spaceNumber: 'A-107', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p8', spaceNumber: 'A-108', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p9', spaceNumber: 'A-109', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p10', spaceNumber: 'A-110', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p11', spaceNumber: 'A-111', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p12', spaceNumber: 'A-112', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p13', spaceNumber: 'A-113', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p14', spaceNumber: 'A-114', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p15', spaceNumber: 'A-115', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p16', spaceNumber: 'A-116', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p17', spaceNumber: 'A-117', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p18', spaceNumber: 'A-118', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p19', spaceNumber: 'A-119', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
    { id: 'p20', spaceNumber: 'A-120', building: 'Building A', location: 'Building A - Level 1', status: 'available' },
  ];
  
  // Save back to localStorage
  localStorage.setItem('neox_global_state', JSON.stringify(state));
  
  console.log('✅ Parking spaces reset to defaults! All other data preserved.');
  console.log('Please refresh the page to see changes.');
} else {
  console.log('⚠️ No stored state found.');
}
```

## Verify It Worked

After refreshing, you can verify parking spaces were cleared by running:

```javascript
const state = JSON.parse(localStorage.getItem('neox_global_state'));
console.log('Parking spaces count:', state.parkingSpaces.length);
console.log('Parking spaces:', state.parkingSpaces);
```

This will show you how many parking spaces remain and their details.
