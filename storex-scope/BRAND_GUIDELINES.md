# Storex AI — Brand Guidelines

Official brand guidelines derived from the current production system.

---

## 1. Brand Philosophy

**Storex AI** is an AI-powered social commerce management platform that helps small and medium businesses automate delivery, messaging, and customer interactions to create simpler, smarter retail operations.

### Voice & Tone
- **Friendly yet Professional** — AI assistance is approachable but results-focused
- **Clear and Direct** — Transparent, fast information delivery
- **Empowering** — Gives users confidence in decision-making

---

## 2. Logo & Brand Identity

### Primary Logo
```
┌─────────────────┐
│   ⚡  Storex AI │  
└─────────────────┘
```

- **Icon**: Lightning bolt (`⚡`) — Represents speed, energy, and capability
- **Typography**: **Manrope** — Bold, tracking-tight
- **Container**: Lime (#EDFF8C) square with 12-14px border radius

---

## 3. Color Palette

### Primary Colors

| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| **Lime Accent** | `#EDFF8C` | `rgb(237, 255, 140)` | Primary accent — buttons, highlights, AI elements |
| **Dark Base** | `#1A1A1A` | `rgb(26, 26, 26)` | Text, sidebar background |
| **Light Background** | `#F8F9FA` | `rgb(248, 249, 250)` | Main screen background |
| **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | Card backgrounds |

### Semantic Colors

| Type | HEX | Usage |
|------|-----|-------|
| **Success** | `#10B981` (Emerald-600) | Paid, confirmed status |
| **Warning** | `#F59E0B` (Amber-600) | Pending, alerts |
| **Error** | `#EF4444` (Rose-600) | Errors, cancelled |
| **Info** | `#6366F1` (Indigo-600) | Information, links |

### Motion & Shadows

- **Shadow**: `0 10px 30px rgba(0, 0, 0, 0.06)` (soft)
- **Border**: `rgba(26, 26, 26, 0.10)` (10% opacity)
- **Hover State**: Lime color at 35% transparency
- **Active State**: Lime at 55% transparency

---

## 4. Typography

### Primary Font
**Manrope** (Google Fonts)
- Font-family: `'Manrope', sans-serif`
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Source: https://fonts.google.com/specimen/Manrope

### Type System

| Element | Font Size | Weight | Line Height | Letter Spacing |
|---------|-----------|--------|-------------|----------------|
| **H1 (Page Title)** | 30-40px | 700 | 1.2 | -0.02em (tight) |
| **H2 (Section)** | 18-24px | 700 | 1.3 | -0.01em |
| **Body Text** | 13-14px | 400-500 | 1.5 | normal |
| **Small Label** | 10-12px | 700 | 1.1 | 0.05em (widest) |
| **Button Text** | 12-14px | 600-700 | 1 | 0.02em |

### Text Rules
- **Uppercase Labels**: 9-11px, font-weight: 700, tracking: widest, color: slate-400
- **Monospace Text**: UI-monospace (for code, API keys, etc.)

---

## 5. Visual Elements

### Border Radius
- **Small**: 12-14px (input, button)
- **Medium**: 18-22px (cards, navigation)
- **Large**: 2rem - 2.5rem (40px) (main containers)
- **Super Round**: 999px (badges, pills)

### Icon System
- **Library**: Font Awesome 6.4.0 (Solid & Brands)
- **Size**: 14-20px (interface), 24-32px (hero sections)
- **Style**: Solid line weight
- **Source**: https://fontawesome.com/

### Spacing Scale
```
4px   (micro)
8px   (small)
12px  (base)
16px  (medium)
24px  (large)
32px  (xl)
48px  (2xl)
```

---

## 6. Component Patterns

### Button Styles

#### Primary Button
```css
background: #EDFF8C;
border: 1px solid rgba(26, 26, 26, 0.12);
border-radius: 14px;
padding: 12px 16px;
font-weight: 600;
transition: all 0.2s;
```

**Hover State:**
```css
transform: scale(1.02);
background: #e5f77a; /* slightly darker lime */
```

#### Secondary Button
```css
background: #FFFFFF;
border: 1px solid rgba(26, 26, 26, 0.12);
border-radius: 14px;
padding: 12px 16px;
font-weight: 600;
```

#### Ghost Button
```css
background: transparent;
border: 1px solid rgba(26, 26, 26, 0.12);
border-radius: 14px;
padding: 12px 16px;
font-weight: 600;
```

### Card Template
```css
background: #FFFFFF;
border: 1px solid rgba(26, 26, 26, 0.10);
border-radius: 2.5rem; /* 40px */
padding: 32px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
```

### Badge/Pill
```css
background: rgba(237, 255, 140, 0.55);
border: 1px solid rgba(26, 26, 26, 0.10);
border-radius: 999px;
padding: 6px 12px;
font-size: 12px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.05em;
```

### Input Fields
```css
height: 42px;
border-radius: 14px;
border: 1px solid rgba(26, 26, 26, 0.12);
padding: 0 12px;
background: #FFFFFF;
font-size: 14px;
```

**Focus State:**
```css
border-color: rgba(26, 26, 26, 0.35);
box-shadow: 0 0 0 4px rgba(237, 255, 140, 0.55);
outline: none;
```

---

## 7. Animation Guidelines

### Transition Timing
- **Fast**: 150-200ms (hover, focus)
- **Standard**: 300-500ms (panel open/close)
- **Slow**: 800ms+ (animations, AI thinking states)

### Easing Functions
- **Default**: `ease` or `cubic-bezier(0.4, 0, 0.2, 1)`
- **Bounce**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` for playful elements

### Micro-animations

#### Pulse Animation (AI Indicator)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.ai-indicator {
  animation: pulse 2s ease-in-out infinite;
}
```

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.4s ease-out;
}
```

---

## 8. Layout Rules

### Grid System
- **Primary Layout**: Sidebar (80-96px) + Main Content (flex-1)
- **Dashboard Grid**: 2-column (lg+), 1-column (mobile)
- **Max Width**: 1600px (centered)
- **Gutter**: 24px (desktop), 16px (mobile)

### Container Padding
- **Desktop**: 40px horizontal
- **Tablet**: 24px horizontal
- **Mobile**: 16px horizontal

### Responsive Breakpoints
```
sm:  640px  (mobile landscape)
md:  768px  (tablet)
lg:  1024px (small desktop)
xl:  1280px (desktop)
2xl: 1536px (large desktop)
```

---

## 9. Accessibility

### WCAG 2.1 Compliance
- **Target Level**: AA
- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus States**: Always visible with Lime shadow `0 0 0 4px rgba(237, 255, 140, 0.55)`
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Keyboard Navigation**: All interactive elements must be keyboard accessible

### Screen Reader Support
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, etc.)
- Provide `aria-label` for icon-only buttons
- Use `alt` text for all images
- Maintain logical heading hierarchy

---

## 10. AI Interface Patterns

### AI Context Badge
```html
<div class="ai-badge">
  <span class="pulse-dot"></span>
  <span class="label">AI Active</span>
</div>
```

```css
.ai-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 999px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #EDFF8C;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px #EDFF8C;
}
```

### AI Message Bubble
```css
background: #EDFF8C;
color: #1A1A1A;
border-radius: 20px;
border-top-left-radius: 4px; /* speech bubble effect */
padding: 16px 20px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
font-size: 14px;
line-height: 1.6;
```

### AI Assistant Panel
- **Width**: 400px (fixed)
- **Position**: Right-side drawer, fixed position
- **Background**: #1A1A1A (dark mode)
- **Slide transition**: 500ms ease-in-out
- **Z-index**: 50

```css
.ai-assistant-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: #1A1A1A;
  color: #FFFFFF;
  transform: translateX(100%);
  transition: transform 500ms ease-in-out;
  z-index: 50;
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.3);
}

.ai-assistant-panel.open {
  transform: translateX(0);
}
```

---

## 11. Do's and Don'ts

### ✅ DO
- Use Lime exclusively for AI-related elements and primary CTAs
- Apply large radius (40px) to card components for a modern feel
- Use tracking-widest (0.05em) for uppercase labels
- Maintain strong contrast between Dark (#1A1A1A) and Light (#F8F9FA)
- Keep animations subtle and purposeful
- Use proper semantic HTML
- Test accessibility with screen readers

### ❌ DON'T
- Overuse Lime (avoid overwhelming the interface)
- Mix color schemes (e.g., multiple gradients, rainbow effects)
- Use system default fonts
- Use sharp corners (0px border-radius) on cards
- Animate everything (be intentional)
- Use red or green for non-semantic purposes
- Create inaccessible color combinations

---

## 12. Brand Applications

### Loading States

#### Spinner
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(26, 26, 26, 0.1);
  border-top-color: #EDFF8C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Skeleton Loader
```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(26, 26, 26, 0.05) 0%,
    rgba(26, 26, 26, 0.1) 50%,
    rgba(26, 26, 26, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Empty States
- Use friendly illustrations or icons (Font Awesome)
- Muted text color (slate-400)
- Clear call-to-action with Lime button
- Center-aligned content

```html
<div class="empty-state">
  <i class="fa-solid fa-box-open"></i>
  <h3>No products yet</h3>
  <p>Start by adding your first product</p>
  <button class="btn-primary">Add Product</button>
</div>
```

### Toasts/Notifications

#### Success Toast
```css
background: #FFFFFF;
border-left: 4px solid #10B981;
border-radius: 14px;
padding: 16px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
```

#### Warning Toast
```css
border-left: 4px solid #F59E0B;
```

#### Error Toast
```css
border-left: 4px solid #EF4444;
```

---

## 13. Code Implementation

### CSS Variables
```css
:root {
  /* Colors */
  --bg: #F8F9FA;
  --card: #FFFFFF;
  --text: #1A1A1A;
  --muted: rgba(26, 26, 26, 0.6);
  --border: rgba(26, 26, 26, 0.10);
  --lime: #EDFF8C;
  
  /* Shadows */
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.1);
  
  /* Radius */
  --radius-sm: 12px;
  --radius: 18px;
  --radius-lg: 22px;
  --radius-xl: 2.5rem;
  --radius-full: 999px;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        lime: '#EDFF8C',
        dark: '#1A1A1A',
        bg: '#F8F9FA',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        'super': '2.5rem',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0, 0, 0, 0.06)',
        'lime': '0 0 0 4px rgba(237, 255, 140, 0.55)',
      },
    },
  },
}
```

### React Component Example
```jsx
// Button Component
const Button = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = 'px-4 py-3 rounded-xl font-semibold transition-all';
  
  const variants = {
    primary: 'bg-[#EDFF8C] border border-slate-200 hover:scale-105',
    secondary: 'bg-white border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent border border-slate-200 hover:bg-white',
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};
```

---

## 14. File Organization

### Design Assets Structure
```
/design
  /logo
    - storex-logo.svg
    - storex-icon.svg
    - storex-wordmark.svg
  /colors
    - palette.json
    - palette.ase (Adobe Swatch)
  /fonts
    - Manrope (woff2 files)
  /icons
    - (Font Awesome CDN)
  /guidelines
    - BRAND_GUIDELINES.md (this file)
```

---

## 15. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial brand guidelines based on production codebase |

---

## 16. Contact & Resources

- **Design System**: Based on Storex AI production code
- **Font Source**: [Google Fonts - Manrope](https://fonts.google.com/specimen/Manrope)
- **Icon Library**: [Font Awesome 6.4.0](https://fontawesome.com/)
- **Framework**: React + Vite + Tailwind CSS

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Source**: Storex AI Production Codebase  
**Maintained by**: Storex Design Team

---

## Quick Reference Card

### Colors
- Lime: `#EDFF8C`
- Dark: `#1A1A1A`
- Background: `#F8F9FA`
- White: `#FFFFFF`

### Typography
- Font: Manrope
- Sizes: 10px (label) | 14px (body) | 18-24px (heading)

### Spacing
- 4px | 8px | 12px | 16px | 24px | 32px | 48px

### Border Radius
- 12-14px (small) | 18-22px (medium) | 40px (large) | 999px (pill)

### Shadows
- Soft: `0 10px 30px rgba(0, 0, 0, 0.06)`
- Focus: `0 0 0 4px rgba(237, 255, 140, 0.55)`
