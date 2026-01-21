# Storex — Payments & BNPL Flows (MVP)

> **Goal:** Sell fast with built-in payments + BNPL, without forcing early setup.
> 
> **Principle:** Payments/BNPL are required to complete a sale, but NOT required to enter the app. AI guides setup **only when relevant**.

This file aligns with Storex IA, state machine, and data dictionary.

---

## 0) Scope & Entities

### In scope (MVP)
- Payment enable/disable (built-in methods)
- Checkout payment flow (success / pending / failed)
- BNPL application flow (approved / rejected / pending)
- Order payment state updates + follow-ups
- Wallet ledger visibility (available / pending)
- Payout gating by **DAN verification** (identity)

### Core data objects
- `Order` (payment_status, order_status)
- `PaymentTransaction` (status: PENDING/PAID/FAILED)
- `BNPLTransaction` (status: PENDING/APPROVED/REJECTED)
- `Wallet` (available_balance, pending_balance, payout_status)
- `IdentityVerification (DAN)` (NOT_VERIFIED/PENDING/VERIFIED)

---

## 1) Readiness Flags (Parallel State Machine)

These flags run after `Business.ACTIVE`:

- **PAYMENT_ENABLED / PAYMENT_DISABLED**
- **PAYOUT_READY / PAYOUT_BLOCKED** (blocked until DAN verified)

> AI behavior is driven by these flags: **remind, don't block**.

---

## 2) Payment Setup Flow (Non-blocking)

### Entry points
- **Settings → Payment Setup** (or Wallet → Payments)
- **AI Panel prompt** when user attempts to complete first sale

### Flow
1. **Status card**
   - `Payment status: Not enabled / Enabled`
   - Primary action: **Enable payments**

2. **Enable payments modal/page**
   - Select built-in methods (MVP examples):
     - Card / Wallet / QPay-like (actual methods are implementation-specific)
   - Confirm

3. **Result**
   - ✅ Enabled → readiness flag flips: `PAYMENT_ENABLED`
   - ❌ Failed/Unavailable → show error + retry, remain `PAYMENT_DISABLED`

### UI rules
- Never show legal-heavy text.
- Explain in simple language:
  - "Enable payments so customers can complete checkout."

### AI rules
- If payments disabled and user is about to confirm an order:
  - AI prompts: "To complete this sale, enable payments (1 minute)."
  - Provide **one-click navigate** to setup.

---

## 3) Customer Checkout — Payment Flow

### Trigger
Customer signals intent to buy ("Okay", "I'll take it").

### Steps
1. **AI confirms** product + quantity (minimal confirmation)
2. **Create Order**
   - `Order.order_status = NEW`
   - `Order.payment_status = UNPAID`
3. **Present payment options**
   - Built-in payment methods
   - BNPL option (if available)

### Payment attempt outcomes

#### A) Payment success
- Create `PaymentTransaction`:
  - `status = PAID`
- Update `Order.payment_status = PAID`
- Move order forward:
  - `Order.order_status = PREPARING` (or remain NEW if merchant flow requires manual accept)
- Wallet effect:
  - Increase `Wallet.pending_balance` by amount (until settlement rules) or directly `available_balance` if instant settlement

#### B) Payment pending
- `PaymentTransaction.status = PENDING`
- `Order.payment_status = UNPAID` (or keep UNPAID + show "Pending") — choose one consistent convention
- AI message to customer:
  - "Payment is pending — I'll confirm once it's completed."
- AI follow-up timer triggers polite reminder if pending too long

#### C) Payment failed
- `PaymentTransaction.status = FAILED`
- `Order.payment_status = FAILED` (or UNPAID with failure reason)
- AI message to customer:
  - "Payment didn't go through. Want to try again or use BNPL?"

### Merchant notification
- In-app notification on payment status transitions:
  - Received / pending too long / failed

---

## 4) BNPL Flow (Buy Now Pay Later)

### Availability logic
BNPL can be shown to customers if:
- BNPL is enabled/available for the business (provider-side rule)
- Order amount meets minimum/maximum constraints (provider rule)

### Steps
1. Customer selects **BNPL**
2. Create `BNPLTransaction`:
   - `status = PENDING`
   - `provider = <BNPL_PROVIDER>`
3. Provider decision returned:

#### A) Approved
- `BNPLTransaction.status = APPROVED`
- `BNPLTransaction.outstanding_amount = total_amount` (or remaining schedule)
- Update `Order.payment_status = PAID` *(because merchant can fulfill now)*
- Proceed with fulfillment:
  - `Order.order_status = PREPARING`
- Wallet effect:
  - Typically credit `Wallet.pending_balance` (depends on provider settlement)

**Customer-facing AI message:**
- "Approved ✅ I'll prepare your order. Delivery or pickup?"

#### B) Rejected
- `BNPLTransaction.status = REJECTED`
- `Order.payment_status` stays `UNPAID`
- AI offers alternatives:
  - Normal payment methods
  - Lower quantity / cheaper option

**Customer-facing AI message:**
- "BNPL wasn't approved. Want to pay normally or choose a different option?"

#### C) Still pending (timeout)
- `BNPLTransaction.status = PENDING`
- AI message:
  - "BNPL is still processing — I'll update you shortly."
- After timeout threshold:
  - Suggest normal payment path

### Merchant-facing UI (Wallet → BNPL)
- BNPL order list
- Summary: Approved / Rejected / Pending
- Outstanding totals

---

## 5) Order State & Payment State (Recommended Conventions)

### Payment state (`Order.payment_status`)
- `UNPAID`
- `PAID`
- `FAILED`

> BNPL Approved should map to `PAID` so fulfillment can proceed.

### Order state (`Order.order_status`)
- `NEW` → `PREPARING` → `READY` → `COMPLETED`
- `CANCELLED`

### Key rules
- Payment updates do **not** auto-complete an order.
- Merchant/AI moves order status based on operational progress.

---

## 6) Unpaid Order Follow-up (AI Automation)

### Trigger
- Order exists with `payment_status = UNPAID`
- Time window passes (e.g., 15–60 min, configurable by AI)

### AI action
- Send a polite reminder (only if automation is ON):
  - "Your order is ready 👍 Complete payment anytime to proceed."

### Safety rules
- Never spam: max reminders per order (e.g., 2)
- Respect merchant settings: `unpaid_order_followup` ON/OFF

---

## 7) Wallet Ledger & Money Movement

### Wallet Overview
- `available_balance`
- `pending_balance`
- `total_earned`

### What goes where
- **Pending**: funds not yet settled/cleared
- **Available**: funds eligible for payout

### Transaction history (Wallet → Payments)
Each row:
- Order ID
- Amount
- Method (Card/Wallet/BNPL)
- Status (Paid/Pending/Failed)

---

## 8) Payout Flow (Merchant Withdrawals)

### Hard gate: DAN Verification
Payout requires `IdentityVerification.status = VERIFIED`.

#### Statuses
- `NOT_VERIFIED` → `PENDING` → `VERIFIED`

#### UI behavior
- Show prompt **inside Wallet** (non-blocking for rest of app)
- Block only payout actions:
  - ❌ "Withdraw" disabled until verified

#### AI copy pattern
- "Verification is required to protect your payouts. It's a one-time step."

### Payout setup (Bank details)
Required after DAN verified:
- Bank name
- Account holder name
- Account number

### Payout request
1. User enters amount (partial or full)
2. Confirm
3. Create `Payout`:
   - `status = REQUESTED`
4. Status progression:
   - `REQUESTED` → `PROCESSING` → `COMPLETED` / `FAILED`

### Wallet effect
- On request: decrease `available_balance` (hold)
- On failed: return to `available_balance`

---

## 9) Error & Edge Cases

### Payment enabled but provider outage
- Show banner in Wallet/Orders: "Payments temporarily unavailable"
- AI suggests BNPL or offline payment (if allowed)

### BNPL approved but later reversed (rare)
- Mark `BNPLTransaction` with a dispute/reversal flag (future)
- In MVP: notify merchant and lock shipment if not delivered

### Refunds (Out of MVP)
- If needed later: introduce `RefundTransaction` and reverse wallet entries

---

## 10) Events & Notifications (Minimal Set)

### Merchant notifications (high priority)
- Payment received
- Payment failed
- BNPL approved / rejected
- Payout completed / failed

### AI Panel signals
- Payments disabled but needed to complete sale
- Low AI Energy impacts automated follow-ups
- Payout blocked due to DAN not verified

---

## 11) Acceptance Criteria (Quick Checklist)

- [ ] Merchant can enable payments without any onboarding wizard
- [ ] Order can be created before payment is completed
- [ ] PaymentTransaction statuses update Order payment_status
- [ ] BNPL approval marks Order as paid and moves fulfillment forward
- [ ] Wallet shows available vs pending balances + transaction history
- [ ] Payout is blocked until DAN is verified (but app usage is not blocked)
- [ ] AI follows up unpaid orders only when automation is ON

---

**Document Version**: 2.0  
**Last Updated**: 2026-01-19  
**Status**: Production-Ready Payment & BNPL Flows