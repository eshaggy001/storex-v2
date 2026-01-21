# Task: Product Detail UI/UX Refactor & Optimization

The goal is to fix the "broken" UI and "confusing actions" on the Product Detail page by refactoring the `ProductDetail.tsx` component into a cleaner, more intuitive, and AI-integrated interface.

## 1. Analysis of Current Issues
- **Overloaded Component**: `ProductDetail.tsx` (847 lines) handles View, Manual Edit, and AI Suggestion logic in one block.
- **Disconnected Editing**: Manual Edit mode is a long, overwhelming scroll of sections.
- **Clunky UX**: Category change requires a separate confirmation step; Variant editing is layout-shifting.
- **AI Placement**: AI suggestions are buried at the bottom instead of being integrated where needed.

## 2. Design Commitment (Radical Style: Bento-AI Integrated)
- **Topological Choice**: Move from a "Long Stack" to a "Functional Bento Grid" for editing.
- **Risk Factor**: Integrating AI buttons *directly* into input fields for instant optimization.
- **Cliché Liquidation**: No more "Edit button at the top / Save button at the bottom" jump. Fixed footer for primary actions.
- **Geometry**: Sharp 40px radius for cards, consistent 14px for interactive elements.
- **Palette**: Dark Base (#1A1A1A) for context, Lime (#EDFF8C) for AI capability.

## 3. Proposed Changes

### Phase 1: Structural Refactor
- [ ] Create `ProductView` sub-component for the read-only state.
- [ ] Create `ProductEditor` sub-component for the editing state.
- [ ] Extract `AIFieldOptimizer` as a reusable component for inline field improvements.

### Phase 2: User Experience (UX) Fixes
- [ ] **Inline AI Magic**: Add a ⚡ button next to Name and Description fields in Edit mode to fetch AI improvements *for that field only*.
- [ ] **Bento Organization**: Group settings into logical cards:
    - **Identity & Description** (Name, Category, Description)
    - **Pricing & Discounts** (Price, Promo toggle, Discount fields)
    - **Inventory & Fulfillment** (Stock, Availability Type, Lead Time)
    - **Variants** (Option management)
    - **Logistics** (Delivery methods)
- [ ] **Action Bar**: Implement a fixed bottom action bar for "Save" and "Cancel" to prevent jumping.

### Phase 3: Visual Polish
- [ ] Apply consistent 40px radius to all sections.
- [ ] Use `Manrope` font with proper weight hierarchy as per Brand Guidelines.
- [ ] Improve variant management with a cleaner "pill" interface.

## 4. Verification Plan
- [ ] Compare old vs new layout on mobile and desktop breakpoints.
- [ ] Verify AI field optimization works without refreshing the whole form.
- [ ] Ensure image upload/removal still functions correctly.
