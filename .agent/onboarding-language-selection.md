# Task: Onboarding Language Selection

Add a language selector to the onboarding flow to allow users to switch between English (EN) and Mongolian (MN).

## Status
- [x] Research & context awareness
- [x] Brainstorming & Socratic Gate
- [x] Implementation Plan
- [x] Component implementation (OnboardingFlow.tsx)
- [x] Localization updates (locales/)
- [x] Verification & Tests

## Context
- The app uses `react-i18next`.
- Currently supports `en` and `mn`.
- `OnboardingFlow.tsx` is the main entry point for new users.

## Decisions
- **Placement:** Floating pill in the top-right corner (Persistent).
- **Style:** Segmented glassmorphism toggle (Pill style).
- **Behavior:** Instant swap with potential "re-typing" animation triggers for AI sections.
- **Languages:** English (EN) and Mongolian (МН).

## Implementation Steps
1. Create a `LanguageSelector` component (local or extractable).
2. Integrate `i18n.changeLanguage()` logic.
3. Update `OnboardingFlow.tsx` layout to include the selector.
4. Add refined styles for the segmented toggle to match Storex AI aesthetic.
5. Verify translations in `mn/common.json` for onboarding keys.
