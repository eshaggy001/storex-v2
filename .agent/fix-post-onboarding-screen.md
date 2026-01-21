# Task: Fix Post-Onboarding Screen Visibility

## Status
- [ ] Explicitly set `status: 'ACTIVE'` in `completeOnboarding`
- [ ] Handle `ACCESS_REQUESTED` state in `App.tsx` to prevent redirection loop
- [ ] Clean up redundant props in `App.tsx`
- [ ] Verify `DashboardOverview` defensive checks

## Implementation Details

### 1. App.tsx
- Update `completeOnboarding` function.
- Ensure `status` is transitioned to `'ACTIVE'` when onboarding is finished via business creation.
- Add logic to handle users who finished the access request but aren't yet active.

### 2. stateTransitions.ts
- Review if `ACCESS_REQUESTED` should show a different "Waiting" screen instead of the full onboarding flow.

### 3. OnboardingFlow.tsx
- Ensure state updates are passed correctly to `updateStore`.
