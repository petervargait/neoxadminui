# Mobile Responsive Implementation Guide

## Overview
This guide outlines the mobile responsive strategy for the NEOX Admin UI. The implementation uses CSS media queries and responsive design patterns to ensure optimal viewing on mobile devices while preserving the desktop/tablet experience.

## Breakpoints
- **Mobile**: `max-width: 768px`
- **Tablet**: `min-width: 769px` and `max-width: 1024px`
- **Desktop**: `min-width: 1025px`

## Core Principles
1. **Mobile-First Enhancements**: Add mobile-specific styles without breaking desktop
2. **Responsive Grids**: Use CSS Grid with `grid-template-columns: 1fr` on mobile
3. **Collapsible Sidebars**: Implement hamburger menus for navigation
4. **Touch-Friendly**: Minimum touch target size of 44x44px
5. **Readable Text**: Minimum font size of 16px to prevent zoom on iOS

## CSS Classes Added

### Mobile Utilities (`globals.css`)
```css
.mobile-sidebar-hidden    /* Hide sidebar off-screen */
.mobile-sidebar-visible   /* Show sidebar with animation */
.mobile-overlay          /* Dark overlay when sidebar is open */
.mobile-table-wrapper    /* Horizontal scroll for tables */
.mobile-card-list        /* Stack cards vertically */
.mobile-stack            /* Force single column grid */
.mobile-padding          /* Reduce padding on mobile */
.mobile-hidden           /* Hide on mobile */
.mobile-full-width       /* 100% width on mobile */
.mobile-text-sm          /* Smaller text on mobile */
.mobile-button           /* Full-width buttons on mobile */
```

## Implementation Strategy

### 1. Home Page (`src/app/page.tsx`)
**Changes Needed:**
- Stack tiles vertically on mobile
- Reduce logo size (320px width on mobile)
- Full-width buttons
- Reduce padding

**Implementation:**
```typescript
// Add media query detection
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth <= 768)
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])

// Apply responsive styles
gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'
```

### 2. Admin Pages (`src/app/admin/page.tsx`, `src/app/tenant/page.tsx`)
**Changes Needed:**
- Hamburger menu button in top bar
- Collapsible sidebar with overlay
- Horizontal scrolling tables
- Stack stat cards vertically
- Responsive action buttons

**Sidebar Implementation:**
```typescript
const [sidebarOpen, setSidebarOpen] = useState(false)
const [isMobile, setIsMobile] = useState(false)

// Hamburger button
<button 
  onClick={() => setSidebarOpen(!sidebarOpen)}
  style={{ display: isMobile ? 'block' : 'none' }}
>
  ☰
</button>

// Sidebar with conditional positioning
<div style={{
  position: isMobile ? 'fixed' : 'relative',
  transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
  transition: 'transform 0.3s ease'
}}>
```

### 3. Tables
**Mobile Table Pattern:**
- Wrap tables in scrollable container
- OR convert to card layout on mobile
- Show only essential columns

```typescript
// Option 1: Horizontal scroll
<div className="mobile-table-wrapper">
  <table style={{ minWidth: '800px' }}>
    {/* table content */}
  </table>
</div>

// Option 2: Card layout on mobile
{isMobile ? (
  // Card view
  users.map(user => <UserCard key={user.id} user={user} />)
) : (
  // Table view
  <table>...</table>
)}
```

### 4. Forms
**Mobile Form Optimization:**
- Stack form fields vertically
- Full-width inputs
- Larger touch targets for buttons

### 5. Modals
**Mobile Modal Adjustments:**
- Full-screen modals on mobile
- Bottom sheet style for better UX

## Testing Checklist

### Mobile Devices to Test
- [ ] iPhone SE (375px width)
- [ ] iPhone 12/13 (390px width)
- [ ] iPhone 14 Pro Max (430px width)
- [ ] Samsung Galaxy S21 (360px width)
- [ ] iPad Mini (768px width)

### Features to Test
- [ ] Navigation (hamburger menu)
- [ ] Table scrolling
- [ ] Form inputs
- [ ] Buttons (touch targets)
- [ ] Modals
- [ ] Cards and tiles
- [ ] Logout functionality
- [ ] Tenant selection

## Browser DevTools Testing
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test portrait and landscape
5. Check touch interactions

## Performance Considerations
- Lazy load images
- Minimize layout shifts
- Use CSS transforms for animations
- Avoid fixed positioning where possible
- Test on real devices

## Future Enhancements
- Progressive Web App (PWA) capabilities
- Offline mode
- Native app feel with swipe gestures
- Dark mode toggle
- Accessibility improvements (WCAG 2.1 AA)

## Resources
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
