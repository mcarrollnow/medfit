# Support-UI Header Integration

## Overview
Added global navigation header to support-ui using the EXACT header from the main site, adapted for Next.js.

## Files Created/Modified

### Created
- `/supportui/components/support-header.tsx` - Main header component (exact copy from SiteHeader)
- `/supportui/public/eagleonlywhite.svg` - Logo file (copied from main site)

### Modified
- `/supportui/app/layout.tsx` - Added SupportHeader to global layout
- `/supportui/app/globals.css` - Added brand color variables, removed overflow:hidden from body
- `/supportui/.env.local` - Added NEXT_PUBLIC_MAIN_SITE_URL
- `/supportui/.env.example` - Updated with new environment variable
- `/supportui/components/desktop-chat-interface.tsx` - Changed h-screen to h-[calc(100vh-5rem)]
- `/supportui/components/customer-desktop-interface.tsx` - Changed h-screen to h-[calc(100vh-5rem)]
- `/supportui/components/customer-mobile-interface.tsx` - Changed h-screen to h-[calc(100vh-5rem)]

## Features

### Header Design (EXACT COPY from main site)
- **Fixed positioning** - Stays at top during scroll
- **Black background** with gray border
- **Logo and branding** - Eagle logo + "MODERN HEALTH PRO" text
- **Hamburger menu** - Opens full-screen overlay navigation
- **Responsive** - Works on mobile and desktop
- **Height**: 64px mobile (4rem), 80px desktop (5rem)

### Navigation Menu
The overlay menu includes:
1. **Admin Support** - Link to `/` (support-ui home)
2. **Customer Support** - Link to `/customer` 
3. **Dashboard** - Link to main site `/admin`
4. **Profile** - Link to main site `/profile`
5. **Support** - Link to main site `/support`
6. **Shop** - Link to main site home

### Height Fix
All support-ui interface components now use:
```
h-[calc(100vh-5rem)]
```
Instead of `h-screen` to account for the header height of 5rem (80px)

### Yellow Primary Branding
- Menu hover states use yellow primary (#fff95e)
- Matches brand guidelines from main site
- Added to globals.css as `--color-yellow-primary`

## Environment Configuration

Add to production `.env.local`:
```bash
NEXT_PUBLIC_MAIN_SITE_URL="https://your-production-domain.com"
```

For development (already configured):
```bash
NEXT_PUBLIC_MAIN_SITE_URL="http://localhost:5173"
```

## CSS Lint Warnings (Safe to Ignore)

The following CSS linter warnings can be safely ignored:
- `@custom-variant` - Tailwind v4 custom variant syntax
- `@theme` - Tailwind v4 theme definition syntax  
- `@apply` - Standard Tailwind directive

These are valid Tailwind CSS v4 features but not recognized by standard CSS linters.

## Testing

1. Start support-ui dev server:
   ```bash
   cd supportui
   npm run dev
   ```

2. Visit http://localhost:3000

3. Test navigation:
   - Click hamburger menu
   - Verify all links work
   - Test yellow hover effects
   - Confirm logo displays correctly

## Integration Complete ✅

Users can now navigate between support-ui and the main site using the same header experience.
