{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # Storex \'97 Payments & BNPL Flows (MVP)\
\
> Goal: **Sell fast** with built\uc0\u8209 in payments + BNPL, without forcing early setup.\
> \
> Principle: **Payments/BNPL are required to complete a sale**, but **not required to enter the app**. AI guides setup **only when relevant**.\
\
This file aligns with Storex IA, state machine, and data dictionary.\
\
---\
\
## 0) Scope & Entities\
\
### In scope (MVP)\
- Payment enable/disable (built\uc0\u8209 in methods)\
- Checkout payment flow (success / pending / failed)\
- BNPL application flow (approved / rejected / pending)\
- Order payment state updates + follow\uc0\u8209 ups\
- Wallet ledger visibility (available / pending)\
- Payout gating by **DAN verification** (identity)\
\
### Core data objects\
- `Order` (payment_status, order_status)\
- `PaymentTransaction` (status: PENDING/PAID/FAILED)\
- `BNPLTransaction` (status: PENDING/APPROVED/REJECTED)\
- `Wallet` (available_balance, pending_balance, payout_status)\
- `IdentityVerification (DAN)` (NOT_VERIFIED/PENDING/VERIFIED)\
\
---\
\
## 1) Readiness Flags (Parallel State Machine)\
\
These flags run after `Business.ACTIVE`:\
\
- **PAYMENT_ENABLED / PAYMENT_DISABLED**\
- **PAYOUT_READY / PAYOUT_BLOCKED** (blocked until DAN verified)\
\
> AI behavior is driven by these flags: **remind, don\'92t block**.\
\
---\
\
## 2) Payment Setup Flow (Non\uc0\u8209 blocking)\
\
### Entry points\
- **Settings \uc0\u8594  Payment Setup** (or Wallet \u8594  Payments)\
- **AI Panel prompt** when user attempts to complete first sale\
\
### Flow\
1. **Status card**\
   - `Payment status: Not enabled / Enabled`\
   - Primary action: **Enable payments**\
\
2. **Enable payments modal/page**\
   - Select built\uc0\u8209 in methods (MVP examples):\
     - Card / Wallet / QPay-like (actual methods are implementation-specific)\
   - Confirm\
\
3. **Result**\
   - \uc0\u9989  Enabled \u8594  readiness flag flips: `PAYMENT_ENABLED`\
   - \uc0\u10060  Failed/Unavailable \u8594  show error + retry, remain `PAYMENT_DISABLED`\
\
### UI rules\
- Never show legal-heavy text.\
- Explain in simple language:\
  - \'93Enable payments so customers can complete checkout.\'94\
\
### AI rules\
- If payments disabled and user is about to confirm an order:\
  - AI prompts: \'93To complete this sale, enable payments (1 minute).\'94\
  - Provide **one-click navigate** to setup.\
\
---\
\
## 3) Customer Checkout \'97 Payment Flow\
\
### Trigger\
Customer signals intent to buy (\'93Okay\'94, \'93I\'92ll take it\'94).\
\
### Steps\
1. **AI confirms** product + quantity (minimal confirmation)\
2. **Create Order**\
   - `Order.order_status = NEW`\
   - `Order.payment_status = UNPAID`\
3. **Present payment options**\
   - Built\uc0\u8209 in payment methods\
   - BNPL option (if available)\
\
### Payment attempt outcomes\
\
#### A) Payment success\
- Create `PaymentTransaction`:\
  - `status = PAID`\
- Update `Order.payment_status = PAID`\
- Move order forward:\
  - `Order.order_status = PREPARING` (or remain NEW if merchant flow requires manual accept)\
- Wallet effect:\
  - Increase `Wallet.pending_balance` by amount (until settlement rules) or directly `available_balance` if instant settlement\
\
#### B) Payment pending\
- `PaymentTransaction.status = PENDING`\
- `Order.payment_status = UNPAID` (or keep UNPAID + show \'93Pending\'94) \'97 choose one consistent convention\
- AI message to customer:\
  - \'93Payment is pending \'97 I\'92ll confirm once it\'92s completed.\'94\
- AI follow\uc0\u8209 up timer triggers polite reminder if pending too long\
\
#### C) Payment failed\
- `PaymentTransaction.status = FAILED`\
- `Order.payment_status = FAILED` (or UNPAID with failure reason)\
- AI message to customer:\
  - \'93Payment didn\'92t go through. Want to try again or use BNPL?\'94\
\
### Merchant notification\
- In-app notification on payment status transitions:\
  - Received / pending too long / failed\
\
---\
\
## 4) BNPL Flow (Buy Now Pay Later)\
\
### Availability logic\
BNPL can be shown to customers if:\
- BNPL is enabled/available for the business (provider-side rule)\
- Order amount meets minimum/maximum constraints (provider rule)\
\
### Steps\
1. Customer selects **BNPL**\
2. Create `BNPLTransaction`:\
   - `status = PENDING`\
   - `provider = <BNPL_PROVIDER>`\
3. Provider decision returned:\
\
#### A) Approved\
- `BNPLTransaction.status = APPROVED`\
- `BNPLTransaction.outstanding_amount = total_amount` (or remaining schedule)\
- Update `Order.payment_status = PAID` *(because merchant can fulfill now)*\
- Proceed with fulfillment:\
  - `Order.order_status = PREPARING`\
- Wallet effect:\
  - Typically credit `Wallet.pending_balance` (depends on provider settlement)\
\
Customer-facing AI message:\
- \'93Approved \uc0\u9989  I\'92ll prepare your order. Delivery or pickup?\'94\
\
#### B) Rejected\
- `BNPLTransaction.status = REJECTED`\
- `Order.payment_status` stays `UNPAID`\
- AI offers alternatives:\
  - Normal payment methods\
  - Lower quantity / cheaper option\
\
Customer-facing AI message:\
- \'93BNPL wasn\'92t approved. Want to pay normally or choose a different option?\'94\
\
#### C) Still pending (timeout)\
- `BNPLTransaction.status = PENDING`\
- AI message:\
  - \'93BNPL is still processing \'97 I\'92ll update you shortly.\'94\
- After timeout threshold:\
  - Suggest normal payment path\
\
### Merchant-facing UI (Wallet \uc0\u8594  BNPL)\
- BNPL order list\
- Summary: Approved / Rejected / Pending\
- Outstanding totals\
\
---\
\
## 5) Order State & Payment State (Recommended Conventions)\
\
### Payment state (`Order.payment_status`)\
- `UNPAID`\
- `PAID`\
- `FAILED`\
\
> BNPL Approved should map to `PAID` so fulfillment can proceed.\
\
### Order state (`Order.order_status`)\
- `NEW` \uc0\u8594  `PREPARING` \u8594  `READY` \u8594  `COMPLETED`\
- `CANCELLED`\
\
### Key rules\
- Payment updates do **not** auto-complete an order.\
- Merchant/AI moves order status based on operational progress.\
\
---\
\
## 6) Unpaid Order Follow\uc0\u8209 up (AI Automation)\
\
### Trigger\
- Order exists with `payment_status = UNPAID`\
- Time window passes (e.g., 15\'9660 min, configurable by AI)\
\
### AI action\
- Send a polite reminder (only if automation is ON):\
  - \'93Your order is ready \uc0\u55357 \u56397  Complete payment anytime to proceed.\'94\
\
### Safety rules\
- Never spam: max reminders per order (e.g., 2)\
- Respect merchant settings: `unpaid_order_followup` ON/OFF\
\
---\
\
## 7) Wallet Ledger & Money Movement\
\
### Wallet Overview\
- `available_balance`\
- `pending_balance`\
- `total_earned`\
\
### What goes where\
- **Pending**: funds not yet settled/cleared\
- **Available**: funds eligible for payout\
\
### Transaction history (Wallet \uc0\u8594  Payments)\
Each row:\
- Order ID\
- Amount\
- Method (Card/Wallet/BNPL)\
- Status (Paid/Pending/Failed)\
\
---\
\
## 8) Payout Flow (Merchant Withdrawals)\
\
### Hard gate: DAN Verification\
Payout requires `IdentityVerification.status = VERIFIED`.\
\
#### Statuses\
- `NOT_VERIFIED` \uc0\u8594  `PENDING` \u8594  `VERIFIED`\
\
#### UI behavior\
- Show prompt **inside Wallet** (non-blocking for rest of app)\
- Block only payout actions:\
  - \uc0\u10060  \'93Withdraw\'94 disabled until verified\
\
#### AI copy pattern\
- \'93Verification is required to protect your payouts. It\'92s a one-time step.\'94\
\
### Payout setup (Bank details)\
Required after DAN verified:\
- Bank name\
- Account holder name\
- Account number\
\
### Payout request\
1. User enters amount (partial or full)\
2. Confirm\
3. Create `Payout`:\
   - `status = REQUESTED`\
4. Status progression:\
   - `REQUESTED` \uc0\u8594  `PROCESSING` \u8594  `COMPLETED` / `FAILED`\
\
### Wallet effect\
- On request: decrease `available_balance` (hold)\
- On failed: return to `available_balance`\
\
---\
\
## 9) Error & Edge Cases\
\
### Payment enabled but provider outage\
- Show banner in Wallet/Orders: \'93Payments temporarily unavailable\'94\
- AI suggests BNPL or offline payment (if allowed)\
\
### BNPL approved but later reversed (rare)\
- Mark `BNPLTransaction` with a dispute/reversal flag (future)\
- In MVP: notify merchant and lock shipment if not delivered\
\
### Refunds (Out of MVP)\
- If needed later: introduce `RefundTransaction` and reverse wallet entries\
\
---\
\
## 10) Events & Notifications (Minimal Set)\
\
### Merchant notifications (high priority)\
- Payment received\
- Payment failed\
- BNPL approved / rejected\
- Payout completed / failed\
\
### AI Panel signals\
- Payments disabled but needed to complete sale\
- Low AI Energy impacts automated follow-ups\
- Payout blocked due to DAN not verified\
\
---\
\
## 11) Acceptance Criteria (Quick Checklist)\
\
- [ ] Merchant can enable payments without any onboarding wizard\
- [ ] Order can be created before payment is completed\
- [ ] PaymentTransaction statuses update Order payment_status\
- [ ] BNPL approval marks Order as paid and moves fulfillment forward\
- [ ] Wallet shows available vs pending balances + transaction history\
- [ ] Payout is blocked until DAN is verified (but app usage is not blocked)\
- [ ] AI follows up unpaid orders only when automation is ON\
\
}