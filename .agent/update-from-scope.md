---
description: Update Storex project based on storex-scope documentation
---

# Storex Project Update Plan

## Objective
Update the Storex v2 project to align with the comprehensive scope documentation in `storex-scope/` folder, implementing the AI-first, state-driven architecture.

## Key Scope Documents
1. **01_product_core.md** - Product vision and north star metrics
2. **05_data_dictionary.md** - Complete data model (15 core entities)
3. **08_mvp_scope_cutline.md** - MVP boundaries and rules
4. **10_tech_arch_conventions.md** - Technical architecture principles
5. **03_ia_map.md** - Information architecture and UI structure

## Core Principles from Scope
1. **State-driven, not page-driven** - UI screens derived from state
2. **AI is first-class system actor** - Not just a feature
3. **Non-blocking by default** - No forced setup wizards
4. **Selling first** - Everything serves the core selling loop
5. **Referral-gated onboarding** - Controlled growth

## Implementation Phases

### Phase 1: Data Model & Types Update ✓
**Status**: Need to align with Data Dictionary (05_data_dictionary.md)

**Current state**:
- Basic types in `types.ts`
- Missing: User states, Business states, Referral system, BNPL, Wallet, Notifications

**Actions**:
1. Update `types.ts` with all 15 entities from data dictionary:
   - ✓ User (with status: ANONYMOUS | AUTHENTICATED)
   - ✓ Business (with states: NO_BUSINESS | BUSINESS_CREATED | ACTIVE)
   - ✗ ReferralCode
   - ✗ AccessRequest
   - ✓ Product (enhanced)
   - ✓ Customer (enhanced)
   - ✓ Order (enhanced with payment/delivery)
   - ✗ PaymentTransaction
   - ✗ BNPLTransaction
   - ✗ Wallet
   - ✗ IdentityVerification (DAN)
   - ✗ Payout
   - ✗ AI_Energy (Token Balance)
   - ✗ AutomationSetting
   - ✗ Notification

### Phase 2: State Machine Implementation
**Based on**: 04_state_machine.md, 10_tech_arch_conventions.md

**Actions**:
1. Implement User Access States
2. Implement Business Access States  
3. Implement Business Readiness Flags (parallel states)
4. Add action gating rules

### Phase 3: Onboarding Flow Refactor
**Based on**: 03_ia_map.md (Section 1)

**Current**: Simple onboarding wizard
**Target**: Referral-gated, minimal friction onboarding

**Actions**:
1. Create ReferralCodeCheck component
2. Create AccessRequestFlow component
3. Update OnboardingFlow to implement referral logic
4. Remove forced setup steps
5. Enable immediate app access after business creation

### Phase 4: Main App Structure Update
**Based on**: 03_ia_map.md (Sections 2-3)

**Key Changes**:
1. Dashboard - Focus on selling metrics
2. Products - AI-assisted creation, minimal fields
3. Orders - Enhanced with delivery view, AI dispatcher
4. Customers - Light CRM with AI insights
5. **NEW**: Wallet view (payments, BNPL, payouts, DAN verification)
6. **NEW**: Automations (ON/OFF toggles only)
7. Settings - Expanded (business info, billing, AI preferences)

### Phase 5: AI Assistant Panel Enhancement
**Based on**: 03_ia_map.md (Section 4), 06_ai_sales_playbooks.md

**Current**: Basic AI chat
**Target**: Context-aware sales cockpit

**Actions**:
1. Make panel persistent (always mounted)
2. Add context detection based on current view
3. Implement recommendation layer
4. Add action execution layer
5. Integrate with state readiness flags
6. Add AI Energy (token) visibility

### Phase 6: Payments & BNPL Integration
**Based on**: 07_payment_bnpl_flows.md

**Actions**:
1. Create Wallet components
2. Implement payment transaction tracking
3. Add BNPL flow components
4. Create DAN verification flow
5. Add payout request functionality
6. Implement payment method toggles

### Phase 7: Automation System
**Based on**: MVP scope, Tech conventions

**Actions**:
1. Create AutomationSettings component
2. Implement ON/OFF toggles (no rule builders)
3. Add automation types:
   - Auto-reply to comments
   - Unpaid order follow-up
   - Re-engagement
   - Delivery updates
   - Low AI energy alerts

### Phase 8: Enhanced Features
1. **Delivery View** - Orders map view + dispatcher
2. **Customer Detail** - Order history, AI insights
3. **Notification System** - In-app, smart batching
4. **Settings Organization** - Business info, billing, team (coming soon)

## Technical Debt to Address

1. **State Management**: Currently using local useState
   - Consider: Context API or Zustand for global state
   - Implement state machine logic

2. **API Integration**: Mock data in `services/api.ts`
   - Needs Supabase integration
   - RLS policies per business_id

3. **AI Service**: Currently uses @google/genai
   - Needs proper AI service layer
   - Token usage tracking
   - Context management

## Success Criteria (from 08_mvp_scope_cutline.md)

✓ Merchant can start selling immediately
✓ AI conversations convert to orders
✓ Money comes in via Payment/BNPL
✓ Merchant trusts AI
✓ Setup doesn't block selling

## Hard MVP Rules (Non-negotiable)

1. No feature unless it helps selling
2. No setup blocks selling
3. AI guides, never forces
4. Settings ≠ Selling
5. State-driven, not page-driven
6. Merchant never feels like "software setup"

## Next Steps

1. Review and confirm plan with user
2. Start with Phase 1 (Data Model)
3. Implement incrementally
4. Test each phase before proceeding
5. Maintain current functionality while upgrading
