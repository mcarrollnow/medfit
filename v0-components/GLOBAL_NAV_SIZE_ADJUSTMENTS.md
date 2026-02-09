# Global Navigation Size Adjustments - Quick Reference

## 🎯 Quick Size Changes

### Make Header Smaller
```tsx
// In global-navigation.tsx

// 1. Logo (line ~68-69)
className="w-6 h-6 sm:w-8 sm:h-8"  // From: w-8 h-8 sm:w-10 sm:h-10

// 2. Title (line ~73)
className="text-lg md:text-xl"     // From: text-xl md:text-2xl

// 3. Mobile Title (line ~77)
className="text-base"               // From: text-lg

// 4. Icons
className="w-6 h-6"                 // Cart/Menu (was: w-8 h-8)
className="w-5 h-5"                 // Bell (was: w-6 h-6)

// 5. Header Spacer (line ~275)
<div className="h-14 sm:h-16"></div>  // From: h-16 sm:h-20
```

### Make Header Larger
```tsx
// 1. Logo
className="w-10 h-10 sm:w-12 sm:h-12"

// 2. Title
className="text-2xl md:text-3xl"

// 3. Icons
className="w-10 h-10"  // Cart/Menu
className="w-8 h-8"    // Bell

// 4. Header Spacer
<div className="h-20 sm:h-24"></div>
```

## 🎨 Common Size Presets

### Compact Header
```tsx
// Logo: w-6 h-6
// Title: text-lg
// Icons: w-6 h-6
// Padding: py-2
// Spacer: h-12
```

### Standard Header (Current)
```tsx
// Logo: w-8 h-8 sm:w-10 sm:h-10
// Title: text-xl md:text-2xl
// Icons: w-8 h-8
// Padding: py-3
// Spacer: h-16 sm:h-20
```

### Large Header
```tsx
// Logo: w-12 h-12 sm:w-14 sm:h-14
// Title: text-2xl md:text-4xl
// Icons: w-10 h-10
// Padding: py-4
// Spacer: h-24 sm:h-28
```

## 📏 Menu Overlay Sizes

### Profile Section
```tsx
// Avatar
className="w-14 h-14"  // Current
className="w-12 h-12"  // Smaller
className="w-16 h-16"  // Larger

// Name
className="text-xl"    // Current
className="text-lg"    // Smaller
className="text-2xl"   // Larger
```

### Menu Icons & Text
```tsx
// Icons
className="w-8 h-8"      // Current
className="w-6 h-6"      // Smaller
className="w-10 h-10"    // Larger

// Menu Text
className="text-2xl"     // Current
className="text-xl"      // Smaller
className="text-3xl"     // Larger
```

## 🔧 Padding & Spacing

### Header Container
```tsx
// Current
<div className="w-full px-4 py-3">

// Tighter
<div className="w-full px-3 py-2">

// Looser
<div className="w-full px-6 py-4">
```

### Search Bar Height
```tsx
// Current
className="py-2"

// Smaller
className="py-1.5"

// Larger
className="py-3"
```

## 💡 Tips

1. **Keep Proportions**: If you change logo size, adjust title size too
2. **Test Responsive**: Check both mobile and desktop views
3. **Match Spacer**: Always update the spacer div to match header height
4. **Icon Balance**: Keep cart/menu icons same size for visual balance
5. **Touch Targets**: Don't go below w-8 h-8 for mobile tap targets
