npm # Task: Brand Alignment & UI Refinement

Implement the official `BRAND_GUIDELINES.md` across the application to ensure a premium, AI-first social commerce experience.

## 🎨 Design Commitment: "Storex Quartz"
- **Topological Choice:** Layered depth with overlapping AI components.
- **Risk Factor:** Using extreme 40px border-radius on cards and a high-contrast Lime (#EDFF8C) accent.
- **Readability Conflict:** Maintaining high contrast while using a vibrant lime color.
- **Cliché Liquidation:** Removing standard 8px rounded corners and generic blue palettes.

## 🛠 Features & Requirements
1. **Typography Standardization**
   - Ensure `Manrope` is the only font used throughout the app.
   - Implement the specific type system (H1: 30-40px, Body: 13-14px).
2. **Core Component Styling**
   - **Buttons:** Implement Primary (Lime), Secondary (White), and Ghost styles with scale hovers.
   - **Cards:** Standardize on `#FFFFFF` background, `40px` radius, and soft shadow.
   - **Inputs:** Refine focus states with Lime glow.
3. **Color System**
   - Centralize colors using CSS variables / Tailwind config extensions.
   - Ensure Lime (#EDFF8C) is reserved for AI and Primary actions.
4. **Motion & micro-animations**
   - AI pulse state.
   - Slide-up entrances for cards.
   - Hover scaling for interactive elements.

## 📂 Implementation Plan

### Phase 1: Foundation & Global Styles
- [ ] Update `index.html` to include Manrope font and clean up local `<style>`.
- [ ] Create/Refine `src/app.css` to act as the source of truth for design tokens.
- [ ] Update `tailwind.config.ts` (if available) or use Tailwind CDN configurations.

### Phase 2: Core Components Refactor
- [ ] Update/Create `components/ui/Button.tsx` (if needed, or update existing usage).
- [ ] Update `Sidebar.tsx` for brand identity alignment (Lightning bolt icon, Lime accents).
- [ ] Update `TopBar.tsx` for layout and typography.

### Phase 3: Dashboard & View Refinement
- [ ] Update `DashboardOverview.tsx` cards (40px radius, soft shadows).
- [ ] Standardize typography across all dashboard metrics.
- [ ] Apply entrance animations to metrics cards.

### Phase 4: AI Assistant Glassmorphism & Animations
- [ ] Update `AIAssistant.tsx` panel styling (Dark background, Lime accents).
- [ ] Add pulse animations to AI indicators.

## ✅ Verification Criteria
- [ ] Font is `Manrope` everywhere.
- [ ] Cards have `40px` border-radius.
- [ ] Primary buttons use `#EDFF8C`.
- [ ] Animations are fluid and follow brand timing (150-300ms).
- [ ] Responsive layouts remain intact.
