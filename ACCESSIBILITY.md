# Accessibility Guidelines - Posyandu Lansia Frontend

This document outlines the accessibility features implemented in the Posyandu Lansia frontend application to ensure WCAG 2.1 AA compliance.

## Overview

The application is built with accessibility as a core principle, ensuring that all users, including those with disabilities, can effectively use the system.

## Implemented Features

### 1. Keyboard Navigation

All interactive elements are fully accessible via keyboard:

- **Tab Navigation**: All focusable elements follow a logical tab order
- **Enter/Space**: Activates buttons and interactive elements
- **Escape**: Closes modals and dropdowns
- **Arrow Keys**: Navigate through dropdown options (Select component)

#### Focus Management

- All interactive elements have visible focus indicators using `focus-visible:ring-2 focus-visible:ring-neutral-400`
- Focus is trapped within modals when open
- Focus returns to trigger element when modal closes

### 2. Semantic HTML

The application uses proper semantic HTML5 elements:

- `<header>` - Not used (using `<nav>` for Navbar)
- `<nav>` - Navigation bars (Navbar, Sidebar)
- `<main>` - Main content area in layouts
- `<section>` - Content sections within pages
- `<aside>` - Sidebar navigation
- `<article>` - Individual content items (can be added to cards)
- `<footer>` - Not yet implemented (can be added if needed)

### 3. ARIA Attributes

Proper ARIA attributes are used throughout:

#### Forms
- `aria-required` - Marks required form fields
- `aria-invalid` - Indicates validation errors
- `aria-describedby` - Links error messages to inputs
- `role="alert"` - Error messages for screen readers

#### Interactive Elements
- `aria-label` - Provides accessible names for icon buttons
- `aria-labelledby` - Links modal titles to modal containers
- `aria-modal="true"` - Identifies modal dialogs
- `role="dialog"` - Semantic role for modals
- `role="button"` - For clickable table rows
- `aria-hidden="true"` - Hides decorative elements from screen readers

#### Navigation
- `role="combobox"` - Select/dropdown components
- `role="listbox"` - Dropdown option lists
- `role="option"` - Individual dropdown options
- `aria-expanded` - Indicates dropdown state
- `aria-haspopup` - Indicates element has popup

### 4. Form Accessibility

All form inputs follow best practices:

- **Labels**: Every input has an associated `<label>` with proper `htmlFor` attribute
- **Required Fields**: Marked with asterisk (*) and `aria-required="true"`
- **Error Messages**: 
  - Displayed below inputs with red color
  - Linked via `aria-describedby`
  - Marked with `role="alert"` for immediate announcement
  - Include warning icon for visual indication
- **Validation**: Client-side validation with clear error messages
- **Disabled State**: Properly styled and announced to screen readers

### 5. Color Contrast

All text meets WCAG AA standards:

- **Body Text**: neutral-900 on neutral-50 (ratio > 7:1)
- **Buttons**: 
  - Primary: white on neutral-800 (ratio > 7:1)
  - Secondary: neutral-800 on neutral-200 (ratio > 4.5:1)
- **Error Text**: red-600 on white (ratio > 4.5:1)
- **Links**: Sufficient contrast in all states

### 6. Images and Icons

- **Decorative Icons**: Marked with `aria-hidden="true"` or empty alt text
- **Informative Icons**: Accompanied by text labels or `aria-label`
- **Images**: All images should have descriptive alt text (to be verified)
- **Logo**: Has text alternative in adjacent element

### 7. Responsive Design

- Mobile-first approach ensures accessibility on all devices
- Touch targets are minimum 44x44px
- Content reflows without horizontal scrolling
- No loss of functionality at 200% zoom

### 8. Screen Reader Support

The application is compatible with major screen readers:

- **NVDA** (Windows)
- **JAWS** (Windows)
- **VoiceOver** (macOS/iOS)
- **TalkBack** (Android)

#### Screen Reader Testing Checklist

- [ ] All interactive elements are announced correctly
- [ ] Form labels and errors are read properly
- [ ] Navigation structure is clear
- [ ] Modal dialogs are announced and trapped
- [ ] Loading states are communicated
- [ ] Error messages are announced immediately

## Component-Specific Accessibility

### Button Component
- Focus-visible ring on keyboard focus
- Disabled state properly announced
- Loading state with "Loading..." text for screen readers
- Proper button type attributes

### Input Component
- Label association via `htmlFor`
- Error messages linked via `aria-describedby`
- Required fields marked with `aria-required`
- Invalid state marked with `aria-invalid`
- Support for textarea with proper semantics

### Modal Component
- `role="dialog"` and `aria-modal="true"`
- Title linked via `aria-labelledby`
- Escape key closes modal
- Focus trapped within modal
- Body scroll prevented when open
- Backdrop click closes modal

### Table Component
- Proper `<table>`, `<thead>`, `<tbody>` structure
- Clickable rows have `role="button"` and `tabIndex="0"`
- Keyboard navigation with Enter/Space keys
- Pagination controls are keyboard accessible

### Select Component
- `role="combobox"` for main trigger
- `role="listbox"` for options container
- `role="option"` for each option
- `aria-expanded` indicates open/closed state
- `aria-haspopup="listbox"` on trigger
- Keyboard navigation with arrow keys
- Search functionality for filtering options

### Navbar Component
- Semantic `<nav>` element
- Hamburger menu has `aria-label="Toggle menu"`
- User menu has `aria-label="User menu"`
- Dropdown properly announced

### Sidebar Component
- Semantic `<aside>` element
- Navigation wrapped in `<nav>`
- Active state clearly indicated
- Mobile close button has `aria-label="Close menu"`
- Backdrop has `aria-hidden="true"`

## Testing Procedures

### Manual Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify focus indicators are visible
   - Test Enter/Space on buttons and links
   - Test Escape on modals and dropdowns

2. **Screen Reader Testing**
   - Navigate with screen reader only
   - Verify all content is announced
   - Check form labels and errors
   - Test modal announcements

3. **Zoom Testing**
   - Test at 200% zoom
   - Verify no horizontal scrolling
   - Check all functionality works
   - Verify text remains readable

4. **Color Contrast**
   - Use browser DevTools to check contrast ratios
   - Verify all text meets WCAG AA standards
   - Check focus indicators are visible

### Automated Testing

Tools to use:
- **axe DevTools**: Browser extension for accessibility testing
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Web accessibility evaluation tool
- **Pa11y**: Command-line accessibility testing

## Known Issues and Future Improvements

### To Be Implemented

- [ ] Skip to main content link
- [ ] Landmark regions with proper labels
- [ ] Live regions for dynamic content updates
- [ ] High contrast mode support
- [ ] Reduced motion support for animations
- [ ] Focus management on route changes
- [ ] Breadcrumb navigation
- [ ] Search functionality with autocomplete

### Potential Improvements

- Add `<footer>` with copyright and links
- Implement focus management on page transitions
- Add keyboard shortcuts for common actions
- Improve error recovery mechanisms
- Add success confirmations for screen readers
- Implement skip links for navigation

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Compliance Statement

This application strives to meet WCAG 2.1 Level AA standards. If you encounter any accessibility barriers, please report them to the development team.

Last Updated: 2024
