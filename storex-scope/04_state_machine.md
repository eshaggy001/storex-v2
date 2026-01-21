# Storex — State Machine Definition

This document defines the **core state machines** that govern user access, business lifecycle, AI readiness, and selling operations in Storex.

Storex is **state-driven**, not page-driven.  
UI screens, AI behavior, and permissions are derived from state.

---

## 1. User Access State Machine

### States

- `ANONYMOUS`
- `AUTHENTICATED`
- `PASSWORD_RESET`

### Transitions

- `ANONYMOUS → AUTHENTICATED`
  - Sign up (email / phone)
  - Log in

- `AUTHENTICATED → PASSWORD_RESET`
  - Forgot password flow

- `PASSWORD_RESET → AUTHENTICATED`
  - Successful reset

### Rules

- No business context exists at this level
- No referral code is required
- User cannot access Main App without a Business state

---

## 2. Business Access State Machine (Referral-Gated)

### States

- `NO_BUSINESS`
- `REFERRAL_REQUIRED`
- `ACCESS_REQUESTED`
- `BUSINESS_CREATED`
- `ACTIVE`

### Transitions

- `AUTHENTICATED → NO_BUSINESS`
  - First login with no business

- `NO_BUSINESS → REFERRAL_REQUIRED`
  - User attempts to create a business

- `REFERRAL_REQUIRED → BUSINESS_CREATED`
  - Valid referral code submitted

- `REFERRAL_REQUIRED → ACCESS_REQUESTED`
  - No referral code / invalid code
  - Access request submitted

- `ACCESS_REQUESTED → NO_BUSINESS`
  - Await approval (no app access)

- `BUSINESS_CREATED → ACTIVE`
  - Business name + category saved

### Rules

- Business cannot exist without a valid referral
- Access request does NOT create a business
- Once ACTIVE, user enters Main Application immediately
- No setup is blocking at this stage

---

## 3. Business Readiness State Machine

This machine runs **in parallel** after business becomes ACTIVE.

### States (Independent Flags)

- `PAYMENT_ENABLED` / `PAYMENT_DISABLED`
- `DELIVERY_CONFIGURED` / `DELIVERY_NOT_CONFIGURED`
- `PRODUCTS_AVAILABLE` / `NO_PRODUCTS`
- `AI_ENERGY_OK` / `AI_ENERGY_LOW`
- `PAYOUT_READY` / `PAYOUT_BLOCKED`

### Initial State

```text
PAYMENT_DISABLED
DELIVERY_NOT_CONFIGURED
NO_PRODUCTS
AI_ENERGY_OK
PAYOUT_BLOCKED
```

### Triggers & Transitions

#### PAYMENT_DISABLED → PAYMENT_ENABLED
**When**: Merchant enables at least one payment method (bank transfer, cash, QR, card)  
**Effect**: Orders can receive payments

#### DELIVERY_NOT_CONFIGURED → DELIVERY_CONFIGURED
**When**: Merchant sets delivery method (delivery, pickup, or both)  
**Effect**: Orders can be fulfilled

#### NO_PRODUCTS → PRODUCTS_AVAILABLE
**When**: At least 1 active product exists  
**Effect**: AI can recommend products, customers can browse

#### AI_ENERGY_OK → AI_ENERGY_LOW
**When**: Token usage drops below threshold (e.g., 20% remaining)  
**Effect**: AI warns merchant, suggests token purchase

#### AI_ENERGY_LOW → AI_ENERGY_OK
**When**: Merchant purchases tokens OR usage resets  
**Effect**: AI operates normally

#### PAYOUT_BLOCKED → PAYOUT_READY
**When**: DAN verification is completed AND bank details are added  
**Effect**: Merchant can withdraw funds

#### PAYOUT_READY → PAYOUT_BLOCKED
**When**: DAN verification expires OR bank details removed  
**Effect**: Payout requests blocked

---

## 4. Dashboard View State Machine

The Dashboard changes its view based on **Business Readiness**.

### States

- `ONBOARDING` (Gamified Roadmap)
- `ACTIVE` (Command Center)

### Transition Logic

```javascript
isBusinessReady = (
  readiness.PAYMENT_ENABLED &&
  readiness.DELIVERY_CONFIGURED &&
  readiness.PRODUCTS_AVAILABLE
)

dashboardView = isBusinessReady ? 'ACTIVE' : 'ONBOARDING'
```

### View Mapping

| State | View | Components |
|-------|------|------------|
| `ONBOARDING` | Gamified Roadmap | Progress bar, Hero actions, Locked stats, AI welcome |
| `ACTIVE` | Command Center | KPI cards, Needs attention feed, AI insights, Activity feed |

---

## 5. Order Lifecycle State Machine

### Order Status States

- `NEW` → Order just created
- `PAID` → Payment confirmed
- `PREPARING` → Merchant preparing order
- `READY` → Ready for delivery/pickup
- `COMPLETED` → Delivered/picked up
- `CANCELLED` → Order cancelled

### Payment Status States

- `UNPAID` → Awaiting payment
- `PAID` → Payment received
- `FAILED` → Payment failed
- `REFUNDED` → Payment refunded

### Delivery Status States

- `NOT_REQUIRED` → Pickup only
- `PENDING` → Awaiting delivery assignment
- `IN_PROGRESS` → Out for delivery
- `DELIVERED` → Successfully delivered

### Rules

- Order can only be `COMPLETED` if payment is `PAID`
- AI automatically updates customers on status changes
- Merchant can override status manually

---

## 6. AI Assistant State Machine

### States

- `COLLAPSED` → Floating button visible
- `EXPANDED` → Side panel open
- `THINKING` → Processing request
- `RESPONDING` → Showing response

### Context States

The AI Assistant adapts based on:
- **Active View** (Dashboard, Products, Orders, etc.)
- **Business Readiness Flags**
- **User Action History**

### Behavior Mapping

| Business State | AI Behavior |
|----------------|-------------|
| `NO_PRODUCTS` | Strongly prompt: "Add your first product" |
| `PAYMENT_DISABLED` | Suggest: "Enable payments to start selling" |
| `DELIVERY_NOT_CONFIGURED` | Suggest: "Setup delivery to complete orders" |
| `AI_ENERGY_LOW` | Warn: "Your AI energy is running low" |
| `PAYOUT_BLOCKED` | Explain: "Complete DAN verification to withdraw" |
| `BUSINESS_READY` | Focus on: Growth, optimization, insights |

---

## 7. Conversation State Machine (Messages)

### Conversation States

- `NEW` → First message received
- `IN_PROGRESS` → Merchant engaged
- `DRAFT_ORDER` → Order being created
- `ORDER_CREATED` → Order exists
- `CLOSED` → Conversation resolved

### Intent Detection (AI)

- `BUYING_INTENT` → Customer ready to buy
- `QUESTION` → Customer asking questions
- `SUPPORT` → Customer needs help
- `FOLLOW_UP` → Customer following up on order

### Rules

- AI detects intent automatically
- Merchant can override AI suggestions
- Conversations link to customer profiles
- One conversation can have multiple orders

---

## 8. Identity Verification State Machine (DAN)

### States

- `NOT_VERIFIED` → No verification attempted
- `PENDING` → Documents submitted, under review
- `VERIFIED` → Verification successful
- `REJECTED` → Verification failed
- `EXPIRED` → Verification needs renewal

### Transitions

- `NOT_VERIFIED → PENDING`
  - When: User uploads DAN and selfie
  
- `PENDING → VERIFIED`
  - When: AI/Admin approves verification
  
- `PENDING → REJECTED`
  - When: Documents are invalid
  
- `VERIFIED → EXPIRED`
  - When: Verification period ends (e.g., 1 year)

### Rules

- Required for payout operations only
- Does NOT block selling or app usage
- One verification per user (not per business)
- AI guides the verification process

---

## State-Driven Architecture Principles

### 1. State > Screens
- UI is derived from state, not the other way around
- Same screen can show different views based on state

### 2. Non-Blocking
- No state blocks app access (except onboarding)
- All states allow exploration

### 3. AI-Aware
- AI behavior changes based on state flags
- AI guides state transitions

### 4. Parallel States
- Business readiness flags run independently
- Multiple flags can change simultaneously

### 5. Transparent
- Users always know their current state
- AI explains why certain actions are blocked

---

## State Flag Summary

### Critical Flags (Affect Core Functionality)

| Flag | Default | Purpose |
|------|---------|---------|
| `PAYMENT_ENABLED` | `false` | Can receive payments |
| `DELIVERY_CONFIGURED` | `false` | Can fulfill orders |
| `PRODUCTS_AVAILABLE` | `false` | Can sell items |
| `AI_ENERGY_OK` | `true` | Can use AI features |
| `PAYOUT_READY` | `false` | Can withdraw funds |

### Helper Flags (Computed)

```javascript
isBusinessReady = PAYMENT_ENABLED && DELIVERY_CONFIGURED && PRODUCTS_AVAILABLE
canSell = PRODUCTS_AVAILABLE
canReceivePayment = PAYMENT_ENABLED
canFulfillOrders = DELIVERY_CONFIGURED
canWithdraw = PAYOUT_READY
```

---

## UI Visibility Matrix

| State | Dashboard View | Products | Orders | Messages | Wallet | Settings | Profile |
|-------|---------------|----------|--------|----------|--------|----------|---------|
| `NO_BUSINESS` | ❌ Onboarding | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `BUSINESS_CREATED` | ✅ Roadmap | ✅ | ✅ | ✅ | ⚠️ Limited | ✅ | ✅ |
| `ACTIVE` (not ready) | ✅ Roadmap | ✅ | ✅ | ✅ | ⚠️ Limited | ✅ | ✅ |
| `ACTIVE` (ready) | ✅ Command | ✅ | ✅ | ✅ | ✅ Full | ✅ | ✅ |

**Legend:**
- ✅ Full Access
- ⚠️ Limited (e.g., Payout blocked if DAN not verified)
- ❌ No Access

---

**State Philosophy**
> States unlock capability.  
> AI guides transitions.  
> Nothing blocks exploration.

---

**Document Version**: 2.0  
**Last Updated**: 2026-01-19  
**Status**: Production-Ready State Machine Definition