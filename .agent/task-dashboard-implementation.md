# Task: Dashboard Implementation (Onboarding vs. Active)

## Status
- [x] Analysis & Design
- [x] Implementation - Onboarding State
- [x] Implementation - Active State
- [x] Verification

## Context
The user has selected a "Gamified Roadmap" for the Onboarding phase and a "Smart Command Center" for the Active phase. The Dashboard must dynamically switch between these two views based on the business readiness state.

## Selected Options
1.  **Onboarding (Gamified Roadmap)**:
    - **Progress Bar**: "Your store is X% ready".
    - **Hero Actions**: Large cards for "Add Product", "Connect Payment".
    - **Locked Stats**: Blurred charts with "Unlock by adding your first product".
    - **AI Welcome**: "What to do next?" guidance.
2.  **Active (Smart Command Center)**:
    - **KPI Cards**: Revenue, Orders, New Customers.
    - **Needs Attention Feed**: "3 pending orders", "Low stock".
    - **AI Insight**: Actionable business advice.

## Implementation Plan

### Phase 1: Analysis & Setup
- [x] Read `components/DashboardOverview.tsx` to understand current structure.
- [x] Check `types.ts` or `stateTransitions.ts` for available state flags (`PRODUCTS_AVAILABLE`, `PAYMENT_ENABLED`, etc.).
- [x] Create mock data/state helpers if needed for testing different states.

### Phase 2: Onboarding State Components
- [x] Create `components/dashboard/SetupProgressBar.tsx`: Visual progress indicator (Implemented in OnboardingRoadmap).
- [x] Create `components/dashboard/HeroActionCard.tsx`: Large, inviting action cards (Implemented in OnboardingRoadmap).
- [x] Create `components/dashboard/LockedStatCard.tsx`: Blurred dummy chart component (Implemented in OnboardingRoadmap).
- [x] Update `DashboardOverview.tsx` to render this view when `!isBusinessReady`.

### Phase 3: Active State Components
- [x] Create `components/dashboard/NeedsAttentionFeed.tsx`: List of urgent items (Implemented in ActiveCommandCenter).
- [x] Refine `KPICard.tsx`: Ensure it matches "Premium" aesthetic (Reused existing).
- [x] Update `DashboardOverview.tsx` to render this view when `isBusinessReady`.

### Phase 4: Integration
- [x] Wire up "Add Product" action to open `ProductCreationWizard`.
- [x] Wire up "Connect Payment" to open `PaymentSetupModal` or go to Settings.

## Technical Notes
- Use `framer-motion` for smooth transitions between states (if available, else CSS transitions).
- Stick to `Storex Quartz` design usage (glassmorphism, clean typography).
