# NEOX Infinity App - Ultra-Detailed Specification
## Every Screen, Every Button, Every Field, Every Interaction

**Version**: 2.0  
**Date**: 2025-10-28  
**Purpose**: Pixel-perfect specification for complete system implementation  
**Detail Level**: Implementation-ready - No assumptions needed

---

## Table of Contents

1. [Global Design System](#global-design-system)
2. [Authentication & Login](#authentication--login)
3. [Global Admin Interface](#global-admin-interface)
4. [Tenant Admin Interface](#tenant-admin-interface)
5. [Visitor Management Module](#visitor-management-module)
6. [All Other Modules](#all-other-modules)

---

## GLOBAL DESIGN SYSTEM

### Color Palette

**Primary Colors:**
```
Primary Blue:     #0066CC (rgb(0, 102, 204))
Primary Dark:     #004C99 (hover state)
Primary Light:    #3385DB (disabled state)
```

**Secondary Colors:**
```
Success Green:    #28A745 (rgb(40, 167, 69))
Warning Orange:   #FFC107 (rgb(255, 193, 7))
Error Red:        #DC3545 (rgb(220, 53, 69))
Info Blue:        #17A2B8 (rgb(23, 162, 184))
```

**Neutral Colors:**
```
Black:            #000000
Dark Gray:        #343A40 (text)
Medium Gray:      #6C757D (secondary text)
Light Gray:       #DEE2E6 (borders)
Background Gray:  #F8F9FA (page background)
White:            #FFFFFF
```

**Transparent Colors:**
```
Overlay:          rgba(0, 0, 0, 0.5) (modal backdrop)
Hover:            rgba(0, 102, 204, 0.1) (row hover)
Selected:         rgba(0, 102, 204, 0.2) (selected row)
```

### Typography

**Font Family:**
```css
Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Monospace: 'Monaco', 'Courier New', monospace (for code)
```

**Font Sizes:**
```
Heading 1 (H1):   32px, weight: 700, line-height: 40px, color: #000000
Heading 2 (H2):   28px, weight: 600, line-height: 36px, color: #000000
Heading 3 (H3):   24px, weight: 600, line-height: 32px, color: #000000
Heading 4 (H4):   20px, weight: 600, line-height: 28px, color: #000000
Heading 5 (H5):   18px, weight: 600, line-height: 24px, color: #000000
Heading 6 (H6):   16px, weight: 600, line-height: 22px, color: #000000

Body Large:       16px, weight: 400, line-height: 24px, color: #343A40
Body Regular:     14px, weight: 400, line-height: 20px, color: #343A40
Body Small:       12px, weight: 400, line-height: 18px, color: #6C757D

Button Text:      14px, weight: 500, line-height: 20px
Label Text:       14px, weight: 500, line-height: 20px, color: #343A40
Helper Text:      12px, weight: 400, line-height: 16px, color: #6C757D
Error Text:       12px, weight: 400, line-height: 16px, color: #DC3545
```

### Spacing System

**Base Unit: 4px**

```
Spacing Scale:
xs:   4px   (0.25rem)
sm:   8px   (0.5rem)
md:   16px  (1rem)
lg:   24px  (1.5rem)
xl:   32px  (2rem)
2xl:  48px  (3rem)
3xl:  64px  (4rem)
```

**Component Spacing:**
```
Form Field Vertical Spacing:    16px (between fields)
Section Spacing:                 32px (between sections)
Page Padding:                    24px (page edges)
Card Padding:                    24px (inside cards)
Button Padding:                  12px 24px (vertical horizontal)
Input Padding:                   10px 12px
```

### Border Radius

```
Small:    4px  (buttons, inputs, badges)
Medium:   8px  (cards, panels)
Large:    12px (modals, large cards)
Circle:   50% (avatars, icon buttons)
```

### Shadows

```css
/* Elevation 1 - Subtle (cards, inputs) */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

/* Elevation 2 - Default (raised cards, dropdowns) */
box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);

/* Elevation 3 - High (modals, popovers) */
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10);

/* Elevation 4 - Highest (sticky headers, tooltips) */
box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05);
```

### Buttons

#### Primary Button

**Default State:**
```css
Background: #0066CC
Color: #FFFFFF
Font: 14px, weight 500
Padding: 12px 24px
Border: none
Border-radius: 4px
Cursor: pointer
Box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12)
Transition: all 0.2s ease
```

**Hover State:**
```css
Background: #004C99
Box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15)
Transform: translateY(-1px)
```

**Active State (Pressed):**
```css
Background: #003D7A
Box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12)
Transform: translateY(0)
```

**Disabled State:**
```css
Background: #3385DB
Color: rgba(255, 255, 255, 0.7)
Cursor: not-allowed
Box-shadow: none
Opacity: 0.6
```

**Loading State:**
```css
Background: #0066CC
Cursor: wait
Opacity: 0.7
Content: "..." (animated spinner inside button)
Disabled: true (cannot click)
```

#### Secondary Button

**Default State:**
```css
Background: transparent
Color: #0066CC
Font: 14px, weight 500
Padding: 12px 24px
Border: 1px solid #0066CC
Border-radius: 4px
Cursor: pointer
Transition: all 0.2s ease
```

**Hover State:**
```css
Background: rgba(0, 102, 204, 0.1)
Border-color: #004C99
Color: #004C99
```

#### Danger Button (Delete/Cancel)

**Default State:**
```css
Background: #DC3545
Color: #FFFFFF
Font: 14px, weight 500
Padding: 12px 24px
Border: none
Border-radius: 4px
```

**Hover State:**
```css
Background: #C82333
```

#### Icon Button

**Default State:**
```css
Background: transparent
Color: #6C757D
Width: 32px
Height: 32px
Border: none
Border-radius: 4px
Padding: 8px
Cursor: pointer
Display: flex
Align-items: center
Justify-content: center
```

**Hover State:**
```css
Background: rgba(0, 0, 0, 0.05)
Color: #343A40
```

### Input Fields

#### Text Input

**Default State:**
```css
Width: 100% (or specified)
Height: 40px
Padding: 10px 12px
Background: #FFFFFF
Border: 1px solid #DEE2E6
Border-radius: 4px
Font: 14px, weight 400, color #343A40
Transition: border-color 0.2s ease

Placeholder:
  Color: #6C757D
  Font-style: normal
```

**Focus State:**
```css
Border: 2px solid #0066CC
Outline: none
Box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)
```

**Error State:**
```css
Border: 2px solid #DC3545
Background: #FFF5F5

Below input:
  Error message appears
  Color: #DC3545
  Font: 12px
  Margin-top: 4px
  Icon: ⚠️ (warning triangle)
```

**Success State:**
```css
Border: 2px solid #28A745
Background: #F0FFF4

Below input:
  Success message appears (optional)
  Color: #28A745
  Font: 12px
  Margin-top: 4px
  Icon: ✓ (checkmark)
```

**Disabled State:**
```css
Background: #F8F9FA
Border: 1px solid #DEE2E6
Color: #6C757D
Cursor: not-allowed
Opacity: 0.6
```

#### Label (for inputs)

```css
Display: block
Font: 14px, weight 500
Color: #343A40
Margin-bottom: 6px
```

**Required Indicator:**
```css
After label text: " *"
Color: #DC3545
```

#### Helper Text

```css
Display: block
Font: 12px, weight 400
Color: #6C757D
Margin-top: 4px
Line-height: 16px
```

### Dropdown/Select

**Default State:**
```css
Width: 100%
Height: 40px
Padding: 10px 36px 10px 12px
Background: #FFFFFF
Border: 1px solid #DEE2E6
Border-radius: 4px
Font: 14px, weight 400
Appearance: none
Cursor: pointer

After (dropdown arrow):
  Content: "▼"
  Position: absolute
  Right: 12px
  Top: 50%
  Transform: translateY(-50%)
  Pointer-events: none
  Color: #6C757D
```

**Open State:**
```css
Border: 2px solid #0066CC
Box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)

Dropdown menu:
  Position: absolute
  Top: 100%
  Left: 0
  Right: 0
  Margin-top: 4px
  Background: #FFFFFF
  Border: 1px solid #DEE2E6
  Border-radius: 4px
  Box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15)
  Max-height: 300px
  Overflow-y: auto
  Z-index: 1000
```

**Dropdown Option:**
```css
Default:
  Padding: 10px 12px
  Font: 14px
  Color: #343A40
  Cursor: pointer
  Background: #FFFFFF

Hover:
  Background: rgba(0, 102, 204, 0.1)

Selected:
  Background: rgba(0, 102, 204, 0.2)
  Font-weight: 500
  Icon: ✓ (checkmark on right)
```

### Checkbox

**Default State:**
```css
Width: 18px
Height: 18px
Border: 2px solid #DEE2E6
Border-radius: 3px
Background: #FFFFFF
Cursor: pointer
Position: relative
```

**Checked State:**
```css
Background: #0066CC
Border-color: #0066CC

After (checkmark):
  Content: "✓"
  Color: #FFFFFF
  Font-size: 14px
  Position: absolute
  Top: 50%
  Left: 50%
  Transform: translate(-50%, -50%)
```

**Hover State:**
```css
Border-color: #0066CC
```

**Disabled State:**
```css
Background: #F8F9FA
Border-color: #DEE2E6
Cursor: not-allowed
Opacity: 0.5
```

**Checkbox with Label:**
```css
Container:
  Display: flex
  Align-items: center
  Cursor: pointer

Label:
  Margin-left: 8px
  Font: 14px, weight 400
  Color: #343A40
  Cursor: pointer
```

### Radio Button

**Default State:**
```css
Width: 18px
Height: 18px
Border: 2px solid #DEE2E6
Border-radius: 50%
Background: #FFFFFF
Cursor: pointer
Position: relative
```

**Selected State:**
```css
Border-color: #0066CC

After (inner circle):
  Content: ""
  Width: 10px
  Height: 10px
  Border-radius: 50%
  Background: #0066CC
  Position: absolute
  Top: 50%
  Left: 50%
  Transform: translate(-50%, -50%)
```

### Toggle/Switch

**Default State (Off):**
```css
Width: 44px
Height: 24px
Background: #DEE2E6
Border-radius: 12px
Position: relative
Cursor: pointer
Transition: background 0.3s ease

Knob:
  Width: 20px
  Height: 20px
  Background: #FFFFFF
  Border-radius: 50%
  Position: absolute
  Top: 2px
  Left: 2px
  Box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12)
  Transition: left 0.3s ease
```

**On State:**
```css
Background: #0066CC

Knob:
  Left: 22px (moves to right)
```

### Date Picker

**Input Field:**
```css
Same as text input
Icon on right: 📅 (calendar icon)
Icon position: absolute, right 12px
Icon color: #6C757D
```

**Calendar Popup:**
```css
Position: absolute
Top: calc(100% + 4px)
Left: 0
Background: #FFFFFF
Border: 1px solid #DEE2E6
Border-radius: 8px
Box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15)
Padding: 16px
Z-index: 1000
Width: 320px
```

**Calendar Header:**
```css
Display: flex
Justify-content: space-between
Align-items: center
Margin-bottom: 16px

Month/Year display:
  Font: 16px, weight 600
  Color: #343A40

Previous/Next buttons:
  Width: 32px
  Height: 32px
  Border: none
  Background: transparent
  Border-radius: 4px
  Cursor: pointer
  Color: #6C757D
  
  Hover:
    Background: rgba(0, 0, 0, 0.05)
```

**Calendar Grid:**
```css
Display: grid
Grid-template-columns: repeat(7, 1fr)
Gap: 4px

Day names (Su, Mo, Tu, etc.):
  Text-align: center
  Font: 12px, weight 600
  Color: #6C757D
  Padding: 8px 0
  
Day cells:
  Width: 36px
  Height: 36px
  Display: flex
  Align-items: center
  Justify-content: center
  Border-radius: 4px
  Cursor: pointer
  Font: 14px
  Color: #343A40
  
  Hover:
    Background: rgba(0, 102, 204, 0.1)
  
  Selected:
    Background: #0066CC
    Color: #FFFFFF
    Font-weight: 600
  
  Today (not selected):
    Border: 2px solid #0066CC
    
  Disabled (past dates or out of range):
    Color: #DEE2E6
    Cursor: not-allowed
    
  Other month:
    Color: #6C757D
    Opacity: 0.5
```

### Time Picker

**Input Field:**
```css
Same as text input
Icon on right: 🕐 (clock icon)
Placeholder: "HH:MM" or "12:00 AM"
```

**Time Popup:**
```css
Position: absolute
Top: calc(100% + 4px)
Background: #FFFFFF
Border: 1px solid #DEE2E6
Border-radius: 8px
Box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15)
Padding: 16px
Z-index: 1000
Width: 280px

Display: flex
Gap: 16px

Hour column, Minute column, AM/PM column:
  Flex: 1
  
  Label:
    Font: 12px, weight 600
    Color: #6C757D
    Margin-bottom: 8px
  
  Options container:
    Max-height: 200px
    Overflow-y: auto
    Border: 1px solid #DEE2E6
    Border-radius: 4px
    
  Option:
    Padding: 8px 12px
    Font: 14px
    Text-align: center
    Cursor: pointer
    
    Hover:
      Background: rgba(0, 102, 204, 0.1)
      
    Selected:
      Background: #0066CC
      Color: #FFFFFF
      Font-weight: 600
```

### Search Input

**Default State:**
```css
Same as text input
Padding-left: 40px (space for icon)

Icon:
  Position: absolute
  Left: 12px
  Top: 50%
  Transform: translateY(-50%)
  Color: #6C757D
  Content: "🔍" (search icon)
```

**With Clear Button (when has value):**
```css
Padding-right: 40px (space for X button)

Clear button:
  Position: absolute
  Right: 8px
  Top: 50%
  Transform: translateY(-50%)
  Width: 24px
  Height: 24px
  Border: none
  Background: transparent
  Border-radius: 50%
  Cursor: pointer
  Color: #6C757D
  Content: "✕"
  
  Hover:
    Background: rgba(0, 0, 0, 0.05)
    Color: #343A40
```

### File Upload

**Dropzone (Default):**
```css
Width: 100%
Min-height: 150px
Border: 2px dashed #DEE2E6
Border-radius: 8px
Background: #F8F9FA
Cursor: pointer
Display: flex
Flex-direction: column
Align-items: center
Justify-content: center
Padding: 24px
Transition: all 0.2s ease

Icon: 📎 (upload icon)
  Font-size: 32px
  Color: #6C757D
  Margin-bottom: 8px

Text:
  Font: 14px, weight 500
  Color: #343A40
  "Drop files here or click to browse"

Sub-text:
  Font: 12px, weight 400
  Color: #6C757D
  Margin-top: 4px
  "Maximum file size: 5MB"
```

**Dropzone (Drag Over):**
```css
Border-color: #0066CC
Border-style: solid
Background: rgba(0, 102, 204, 0.05)

Icon color: #0066CC
Text: "Drop files here"
Text color: #0066CC
```

**Dropzone (Error):**
```css
Border-color: #DC3545
Border-style: solid
Background: #FFF5F5

Icon color: #DC3545
Error message:
  Color: #DC3545
  Font: 12px
  Margin-top: 8px
```

**File Preview (after upload):**
```css
Display: flex
Align-items: center
Padding: 12px
Background: #FFFFFF
Border: 1px solid #DEE2E6
Border-radius: 4px
Margin-top: 8px

File icon:
  Width: 32px
  Height: 32px
  Margin-right: 12px
  
File name:
  Flex: 1
  Font: 14px, weight 500
  Color: #343A40
  
File size:
  Font: 12px
  Color: #6C757D
  Margin-left: 8px
  
Remove button:
  Width: 24px
  Height: 24px
  Border: none
  Background: transparent
  Border-radius: 50%
  Cursor: pointer
  Color: #6C757D
  Content: "✕"
  Margin-left: 8px
  
  Hover:
    Background: rgba(220, 53, 69, 0.1)
    Color: #DC3545
```

### Progress Bar

**Container:**
```css
Width: 100%
Height: 8px
Background: #DEE2E6
Border-radius: 4px
Overflow: hidden
```

**Progress Fill:**
```css
Height: 100%
Background: #0066CC
Border-radius: 4px
Transition: width 0.3s ease
Width: [percentage]%
```

**With Label:**
```css
Display: flex
Justify-content: space-between
Align-items: center
Margin-bottom: 8px

Label:
  Font: 14px, weight 500
  Color: #343A40

Percentage:
  Font: 14px, weight 600
  Color: #0066CC
```

### Loading Spinner

**Small (16px):**
```css
Width: 16px
Height: 16px
Border: 2px solid rgba(0, 102, 204, 0.2)
Border-top-color: #0066CC
Border-radius: 50%
Animation: spin 0.8s linear infinite

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Medium (24px):**
```css
Width: 24px
Height: 24px
Border: 3px solid rgba(0, 102, 204, 0.2)
Border-top-color: #0066CC
Border-radius: 50%
Animation: spin 0.8s linear infinite
```

**Large (48px):**
```css
Width: 48px
Height: 48px
Border: 4px solid rgba(0, 102, 204, 0.2)
Border-top-color: #0066CC
Border-radius: 50%
Animation: spin 0.8s linear infinite
```

**Full Page Loading:**
```css
Position: fixed
Top: 0
Left: 0
Right: 0
Bottom: 0
Background: rgba(255, 255, 255, 0.95)
Display: flex
Flex-direction: column
Align-items: center
Justify-content: center
Z-index: 9999

Spinner: Large (48px)
Text below:
  Font: 16px, weight 500
  Color: #343A40
  Margin-top: 16px
  "Loading..."
```

### Toast Notifications

**Container Position:**
```css
Position: fixed
Top: 24px
Right: 24px
Z-index: 10000
Max-width: 400px
```

**Toast (Success):**
```css
Background: #FFFFFF
Border-left: 4px solid #28A745
Border-radius: 4px
Box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15)
Padding: 16px
Margin-bottom: 12px
Display: flex
Align-items: start
Animation: slideIn 0.3s ease

Icon:
  Width: 24px
  Height: 24px
  Margin-right: 12px
  Color: #28A745
  Content: "✓"

Content:
  Flex: 1
  
  Title:
    Font: 14px, weight 600
    Color: #343A40
    Margin-bottom: 4px
    
  Message:
    Font: 14px, weight 400
    Color: #6C757D

Close button:
  Width: 24px
  Height: 24px
  Border: none
  Background: transparent
  Border-radius: 50%
  Cursor: pointer
  Color: #6C757D
  Content: "✕"
  Margin-left: 12px
  
  Hover:
    Background: rgba(0, 0, 0, 0.05)

Auto-dismiss: 5 seconds
```

**Toast (Error):**
```css
Same as success, but:
Border-left-color: #DC3545
Icon color: #DC3545
Icon: "⚠️"
```

**Toast (Warning):**
```css
Same as success, but:
Border-left-color: #FFC107
Icon color: #FFC107
Icon: "⚠️"
```

**Toast (Info):**
```css
Same as success, but:
Border-left-color: #17A2B8
Icon color: #17A2B8
Icon: "ℹ️"
```

---

## AUTHENTICATION & LOGIN

### Login Screen

**URL:** `/login` or `/auth/login`

**Page Layout:**
```css
Display: flex
Min-height: 100vh
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

Left side (50%):
  Display: flex
  Align-items: center
  Justify-content: center
  Padding: 48px
  
  Branding:
    Logo: 200px width, centered
    App name: "NEOX Infinity"
      Font: 48px, weight 700
      Color: #FFFFFF
      Margin-top: 24px
    Tagline: "Modern Workplace Management"
      Font: 20px, weight 400
      Color: rgba(255, 255, 255, 0.9)
      Margin-top: 12px

Right side (50%):
  Display: flex
  Align-items: center
  Justify-content: center
  Background: #FFFFFF
  Padding: 48px
```

**Login Form Card:**
```css
Width: 100%
Max-width: 400px
Background: #FFFFFF
Padding: 48px
Border-radius: 8px
Box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1)

Heading:
  "Sign in to your account"
  Font: 28px, weight 600
  Color: #343A40
  Margin-bottom: 8px

Sub-heading:
  "Enter your credentials to access the platform"
  Font: 14px, weight 400
  Color: #6C757D
  Margin-bottom: 32px
```

**Email Field:**
```html
<div class="form-group">
  <label for="email">Email Address *</label>
  <input 
    type="email" 
    id="email" 
    name="email"
    placeholder="you@company.com"
    required
    autocomplete="email"
    autocapitalize="off"
  />
  <span class="helper-text">We'll never share your email</span>
</div>
```

**Styling:**
```css
Margin-bottom: 24px

Label:
  Display: block
  Font: 14px, weight 500
  Color: #343A40
  Margin-bottom: 6px
  Required asterisk: color #DC3545

Input:
  Width: 100%
  Height: 44px
  Padding: 12px 16px
  Border: 1px solid #DEE2E6
  Border-radius: 4px
  Font: 14px
  Background: #FFFFFF
  
  Focus:
    Border: 2px solid #0066CC
    Outline: none
    Box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)
    
  Error:
    Border: 2px solid #DC3545
    Background: #FFF5F5

Helper text:
  Display: block
  Font: 12px
  Color: #6C757D
  Margin-top: 4px
```

**Validation Rules:**
1. **Required**: Email cannot be empty
   - Error: "Email address is required"
   - Show: On blur if empty, on submit
   
2. **Format**: Must be valid email
   - Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - Error: "Please enter a valid email address"
   - Show: On blur if invalid format
   
3. **Exists**: Email must exist in system
   - Error: "No account found with this email"
   - Show: After API response (async)

**Password Field:**
```html
<div class="form-group">
  <label for="password">Password *</label>
  <div class="password-input-wrapper">
    <input 
      type="password" 
      id="password" 
      name="password"
      placeholder="Enter your password"
      required
      autocomplete="current-password"
    />
    <button 
      type="button" 
      class="toggle-password"
      aria-label="Show password"
    >
      👁️
    </button>
  </div>
</div>
```

**Styling:**
```css
Margin-bottom: 24px

Password input wrapper:
  Position: relative
  
Input:
  Same as email field
  Padding-right: 48px (space for toggle button)

Toggle password button:
  Position: absolute
  Right: 8px
  Top: 50%
  Transform: translateY(-50%)
  Width: 32px
  Height: 32px
  Border: none
  Background: transparent
  Border-radius: 4px
  Cursor: pointer
  Font-size: 16px
  
  Hover:
    Background: rgba(0, 0, 0, 0.05)
  
  When password visible:
    Icon changes to: 🙈
    Input type changes to: "text"
```

**Validation Rules:**
1. **Required**: Password cannot be empty
   - Error: "Password is required"
   - Show: On submit only
   
2. **Incorrect**: Password doesn't match
   - Error: "Incorrect password"
   - Show: After API response

**Remember Me Checkbox:**
```html
<div class="form-row">
  <div class="checkbox-group">
    <input 
      type="checkbox" 
      id="remember" 
      name="remember"
    />
    <label for="remember">Remember me for 30 days</label>
  </div>
  <a href="/forgot-password" class="forgot-link">
    Forgot password?
  </a>
</div>
```

**Styling:**
```css
Display: flex
Justify-content: space-between
Align-items: center
Margin-bottom: 32px

Checkbox group:
  Display: flex
  Align-items: center
  
Checkbox: (as per global design)
  Width: 18px
  Height: 18px

Label:
  Margin-left: 8px
  Font: 14px, weight 400
  Color: #343A40
  Cursor: pointer

Forgot link:
  Font: 14px, weight 500
  Color: #0066CC
  Text-decoration: none
  
  Hover:
    Text-decoration: underline
    Color: #004C99
```

**Behavior:**
- When checked: Sets cookie/localStorage with 30-day expiration
- When unchecked: Session-only authentication

**Sign In Button:**
```html
<button 
  type="submit" 
  class="btn-primary btn-block"
  id="sign-in-btn"
>
  Sign In
</button>
```

**Styling:**
```css
Width: 100%
Height: 48px
Background: #0066CC
Color: #FFFFFF
Font: 16px, weight 600
Border: none
Border-radius: 4px
Cursor: pointer
Box-shadow: 0 2px 4px rgba(0, 102, 204, 0.2)
Transition: all 0.2s ease
Margin-bottom: 24px

Hover:
  Background: #004C99
  Box-shadow: 0 4px 8px rgba(0, 102, 204, 0.3)
  Transform: translateY(-1px)

Active:
  Transform: translateY(0)

Disabled:
  Background: #3385DB
  Cursor: not-allowed
  Opacity: 0.6
  Box-shadow: none

Loading state:
  Background: #0066CC
  Cursor: wait
  Content: Spinner + "Signing in..."
  Disabled: true
```

**States & Behavior:**

1. **Initial State:**
   - Button enabled if form has values
   - Button disabled if form empty

2. **Form Validation (on submit):**
   - If email empty: Show error, focus email
   - If email invalid: Show error, focus email
   - If password empty: Show error, focus password
   - If validation passes: Continue to API call

3. **Loading State (during API call):**
   - Button shows spinner + "Signing in..."
   - All form fields disabled
   - Cannot submit again

4. **Success Response:**
   - Store auth token in localStorage/cookie
   - Show success toast: "Welcome back!"
   - Redirect to dashboard after 500ms
   - Animate transition (fade out)

5. **Error Responses:**
   - **401 Unauthorized** (wrong credentials):
     - Show error below password field
     - Error: "The email or password you entered is incorrect"
     - Clear password field
     - Focus password field
     - Enable form
     
   - **404 Not Found** (email not found):
     - Show error below email field
     - Error: "No account found with this email address"
     - Focus email field
     - Enable form
     
   - **429 Too Many Requests** (rate limited):
     - Show error toast
     - Error: "Too many login attempts. Please try again in 15 minutes."
     - Disable form for 15 minutes
     - Show countdown timer
     
   - **500 Internal Server Error**:
     - Show error toast
     - Error: "Something went wrong. Please try again."
     - Enable form

6. **Network Error:**
   - Show error toast
   - Error: "Unable to connect. Check your internet connection."
   - Enable form

**SSO Options (if enabled):**
```html
<div class="divider">
  <span>Or continue with</span>
</div>

<div class="sso-buttons">
  <button type="button" class="btn-sso">
    <img src="/icons/microsoft.svg" alt="Microsoft" />
    Microsoft
  </button>
  <button type="button" class="btn-sso">
    <img src="/icons/google.svg" alt="Google" />
    Google
  </button>
</div>
```

**Styling:**
```css
Divider:
  Position: relative
  Text-align: center
  Margin: 32px 0
  
  Before/After:
    Content: ""
    Position: absolute
    Top: 50%
    Width: 45%
    Height: 1px
    Background: #DEE2E6
  
  Before: Left: 0
  After: Right: 0
  
  Span:
    Background: #FFFFFF
    Padding: 0 16px
    Font: 14px
    Color: #6C757D

SSO buttons container:
  Display: flex
  Gap: 12px
  Margin-bottom: 24px

SSO button:
  Flex: 1
  Height: 48px
  Display: flex
  Align-items: center
  Justify-content: center
  Gap: 8px
  Background: #FFFFFF
  Border: 1px solid #DEE2E6
  Border-radius: 4px
  Font: 14px, weight 500
  Color: #343A40
  Cursor: pointer
  
  Hover:
    Border-color: #0066CC
    Background: rgba(0, 102, 204, 0.02)
  
  Icon:
    Width: 20px
    Height: 20px
```

**Click Behavior:**
- Microsoft: Redirect to `/auth/microsoft`
- Google: Redirect to `/auth/google`
- Show loading spinner during redirect

**Sign Up Link:**
```html
<div class="signup-link">
  Don't have an account? 
  <a href="/signup">Sign up</a>
</div>
```

**Styling:**
```css
Text-align: center
Font: 14px, weight 400
Color: #6C757D

Link:
  Color: #0066CC
  Font-weight: 500
  Text-decoration: none
  
  Hover:
    Text-decoration: underline
    Color: #004C99
```

**API Endpoint:**
```
POST /api/auth/login

Request:
{
  "email": "user@company.com",
  "password": "password123",
  "remember": true
}

Response (Success 200):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "uuid",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "tenant_admin",
      "tenantId": "tenant_uuid",
      "tenantName": "Acme Corp",
      "permissions": ["visitor:read", "visitor:create", ...]
    }
  }
}

Response (Error 401):
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The email or password you entered is incorrect"
  }
}
```

---

I need to stop here as I'm creating an extremely detailed specification. This single login screen specification is already very comprehensive. To complete this ULTRA-DETAILED specification for the ENTIRE system (all 12 modules, all screens, all interactions), it would require approximately 50,000-100,000 lines of documentation.

Would you like me to:
1. **Continue with this level of detail** for specific modules/screens you prioritize
2. **Create a template** showing this level of detail that your team can follow to document each screen
3. **Focus on a specific module** (e.g., Visitor Management) with complete pixel-perfect specifications for every screen

This level of specification is what's needed for a development team that has never seen the system - every button, every field, every state, every error message, every pixel is documented.