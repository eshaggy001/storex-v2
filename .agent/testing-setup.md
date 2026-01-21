# Task: Infrastructure - Testing Suite Setup (Vitest)

Initialize and configure a comprehensive testing suite for Storex v2, focusing on Vitest for unit/integration tests and React Testing Library for UI components.

## 1. Analysis
- **Current State**: 0 tests, 0 testing dependencies.
- **Core Logic**: `stateTransitions.ts` handles the state machine, critical for the "state-driven" architecture.
- **UI Architecture**: React 19 + Vite.

## 2. Implementation Plan

### Phase 1: Dependency Installation
- [x] Install `vitest`, `@vitejs/plugin-react` (if needed for vitest), `jsdom`.
- [x] Install `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.
- [x] Install `c8` or `v8` for coverage reporting.

### Phase 2: Configuration
- [x] Create `vitest.config.ts` (or update `vite.config.ts`).
- [x] Create `tests/setup.ts` for library initialization (e.g., `jest-dom` matchers).
- [x] Update `package.json` with test scripts.

### Phase 3: Unit Testing (State Machine)
- [x] Create `tests/unit/stateTransitions.test.ts`.
- [x] Test `transitionUserState` (Login, Logout, Reset flows).
- [x] Test `transitionBusinessState` (Referral flow, Setup flow).
- [x] Test `updateReadinessFlags` (Independent parallel flags).
- [x] Test validation helpers and guards.

### Phase 4: Component Testing (UI)
- [x] Create `tests/components/App.test.tsx` (or a smaller component).
- [x] Verify state-driven visibility (e.g., if ANONYMOUS, show login).

## 3. Verification Plan
- [ ] Run `npm test` and verify all tests pass.
- [ ] Generate coverage report and ensure logic is covered > 80%.
- [ ] Verify tests fail as expected when logic is intentionally broken.
