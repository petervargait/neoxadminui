// Run this script in the browser console to update tenant modules
// This preserves all existing data and only adds missing modules

(function updateTenantModules() {
  const STORAGE_KEY = 'neox_global_state';
  
  // ALL modules that should exist (matching integrationOptions)
  const allModules = [
    'User Management',
    'Visitor Management',
    'Parking',
    'Emergency',
    'Map',
    'Restaurant',
    'Ticketing',
    'Service Hub',
    'Lockers',
    'News',
    'AI Assistant',
    'Space Management',
    'Private Delivery',
    'Building Automation',
    'Smart Sensors',
    'Access Management'
  ];
  
  try {
    // Get current state
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.log('❌ No stored state found');
      return;
    }
    
    const state = JSON.parse(stored);
    
    if (!state.tenants || !Array.isArray(state.tenants)) {
      console.log('❌ No tenants found in state');
      return;
    }
    
    console.log(`📋 Found ${state.tenants.length} tenants`);
    
    // Update each tenant's modules
    let updatedCount = 0;
    state.tenants.forEach(tenant => {
      if (!tenant.modules || !Array.isArray(tenant.modules)) {
        tenant.modules = [];
      }
      
      const before = tenant.modules.length;
      
      // Add missing modules
      allModules.forEach(module => {
        if (!tenant.modules.includes(module)) {
          tenant.modules.push(module);
        }
      });
      
      const after = tenant.modules.length;
      
      if (after > before) {
        console.log(`✅ ${tenant.name}: Added ${after - before} module(s)`);
        updatedCount++;
      } else {
        console.log(`⏭️  ${tenant.name}: Already has all modules`);
      }
    });
    
    // Update profiles too
      if (state.profiles && Array.isArray(state.profiles)) {
      state.profiles.forEach(profile => {
        if (profile.id === 'prof1' && profile.modules) {
          const before = profile.modules.length;
          allModules.forEach(module => {
            if (!profile.modules.includes(module)) {
              profile.modules.push(module);
            }
          });
          if (profile.modules.length > before) {
            console.log(`✅ Profile "${profile.name}": Added ${profile.modules.length - before} module(s)`);
          }
        }
      });
    }
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    console.log('\n✨ Update complete!');
    console.log(`📊 Updated ${updatedCount} tenant(s)`);
    console.log('🔄 Refresh the page to see changes');
    
  } catch (error) {
    console.error('❌ Error updating modules:', error);
  }
})();
