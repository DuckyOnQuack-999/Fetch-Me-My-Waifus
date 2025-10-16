# Tailwind CSS v4 Migration Guide

## Overview
This document outlines the migration from Tailwind CSS v3 to v4 for the Waifu Downloader project.

---

## What Changed

### 1. Configuration System
**Before (v3)**:
\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
\`\`\`

**After (v4)**:
\`\`\`css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@theme {
  --color-primary: var(--primary);
}
\`\`\`

### 2. Import System
**Before**: `@tailwind base`, `@tailwind components`, `@tailwind utilities`  
**After**: `@import "tailwindcss"`

### 3. Color System
**Before**: Channel values `--primary: 221.2 83.2% 53.3%`  
**After**: Full HSL `--primary: hsl(221.2 83.2% 53.3%)`

### 4. Plugin System
**Before**: JavaScript plugins in config  
**After**: CSS imports `@import "tw-animate-css"`

---

## Migration Steps

### Step 1: Update package.json
\`\`\`bash
npm install tailwindcss@^4.0.0 tw-animate-css@^1.0.0
npm uninstall @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio
\`\`\`

### Step 2: Simplify tailwind.config.js
Delete the file or simplify to:
\`\`\`javascript
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}"
  ]
}
\`\`\`

### Step 3: Update globals.css
Replace `@tailwind` directives with:
\`\`\`css
@import "tailwindcss";
@import "tw-animate-css";
\`\`\`

### Step 4: Wrap Color Values
Update all color custom properties:
\`\`\`css
/* Before */
:root {
  --primary: 221.2 83.2% 53.3%;
}

/* After */
:root {
  --primary: hsl(221.2 83.2% 53.3%);
}
\`\`\`

### Step 5: Create @theme Block
\`\`\`css
@theme {
  --color-primary: var(--primary);
  --color-background: var(--background);
  /* ... all other tokens */
}
\`\`\`

### Step 6: Update Component Utilities
Replace hardcoded colors with semantic tokens:
\`\`\`css
/* Before */
.my-class {
  background: hsl(221.2 83.2% 53.3%);
}

/* After */
.my-class {
  background: var(--color-primary);
}
\`\`\`

---

## Breaking Changes

### 1. Plugin Architecture
- All v3 plugins require migration to CSS
- `tailwindcss-animate` → `tw-animate-css`
- Custom plugins need rewriting

### 2. Color Functions
- No more `theme()` function in CSS
- Use CSS custom properties directly
- `color-mix()` replaces opacity utilities

### 3. Configuration
- No more `extend` keyword
- Theme config moved to CSS
- PostCSS still required

---

## Benefits

✅ **Smaller Bundle**: ~30% reduction  
✅ **Faster Builds**: CSS-based configuration  
✅ **Better DX**: Hot reload improvements  
✅ **Modern CSS**: Native cascade layers  
✅ **Type Safety**: CSS-first approach

---

## Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Node Version
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

---

## Troubleshooting

### Issue: "Unknown at-rule @theme"
**Solution**: Update PostCSS and Tailwind CSS to latest versions

### Issue: Colors not working
**Solution**: Ensure all color values are wrapped in `hsl()`

### Issue: Animations broken
**Solution**: Import `tw-animate-css` after tailwindcss

### Issue: Build errors
**Solution**: Clear `.next` cache and rebuild

---

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta)
- [tw-animate-css](https://github.com/ben-rogerson/tw-animate-css)
- [Migration Examples](https://github.com/tailwindlabs/tailwindcss/discussions)

---

## Next Steps

1. ✅ Test all components in development
2. ✅ Run production build
3. ✅ Verify styling in all browsers
4. ✅ Update documentation
5. ⏳ Monitor bundle size
6. ⏳ Optimize unused CSS purging
