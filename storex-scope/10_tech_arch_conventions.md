{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # 10 \'97 Technical Architecture Conventions (Storex)\
\
This document defines the **non-negotiable technical conventions**\
for building Storex.\
\
Storex is:\
- AI-first\
- State-driven\
- Non-blocking\
- Selling-oriented\
\
These conventions apply to **frontend, backend, AI services, and infra**.\
\
---\
\
## 1. Core Architecture Principles\
\
### 1.1 State-driven, not page-driven\
\
- UI screens are **derived from state**\
- Business logic is **never coupled to routes or URLs**\
- Navigation is a **state transition**, not a page load\
\
Examples:\
- `Business.ACTIVE` \uc0\u8594  Main App available\
- `PAYMENT_DISABLED` \uc0\u8594  Selling allowed, checkout blocked\
- `PAYOUT_BLOCKED` \uc0\u8594  App usable, payout action blocked only\
\
\uc0\u10060  Forbidden:\
- Page-based permission logic\
- Hardcoded route guards for business rules\
\
---\
\
### 1.2 AI is a First-class System Actor\
\
AI is not a feature.\
AI is a **system participant**.\
\
AI can:\
- Read business state\
- Read readiness flags\
- Read product/order/customer context\
- Suggest actions\
- Execute actions **only when allowed**\
\
AI cannot:\
- Bypass states\
- Perform high-risk actions without merchant approval\
- Act invisibly in financial operations\
\
---\
\
### 1.3 Non-blocking by Default\
\
**No configuration blocks exploration.**\
\
Blocking is allowed ONLY when:\
- Completing a sale (payment required)\
- Requesting payout (DAN verification required)\
\
Everything else:\
- Reminder\
- Suggestion\
- Soft warning\
- AI explanation\
\
\uc0\u10060  Forbidden:\
- Forced setup wizard\
- Mandatory modals on app entry\
- \'93You must complete X first\'94 screens\
\
---\
\
## 2. System Layers\
\
### 2.1 Frontend (Web App)\
\
Principles:\
- Single Page App\
- Internal view-state navigation\
- No URL-based permissions\
- UI reacts to state changes\
\
Conventions:\
- One global AppState\
- Feature visibility = derived selectors\
- AI Panel is always mounted (collapsible only)\
\
UI must:\
- Be explainable in <10 seconds\
- Prefer cards over forms\
- Prefer toggles over configuration pages\
\
---\
\
### 2.2 Backend (Core API)\
\
Backend responsibilities:\
- Enforce state transitions\
- Validate actions against state\
- Persist truth (never UI)\
\
Rules:\
- Backend is the source of truth\
- Frontend assumptions are never trusted\
- All state transitions are explicit\
\
Examples:\
- Cannot create `Business` without valid `ReferralCode`\
- Cannot request `Payout` if `IdentityVerification != VERIFIED`\
- Can create `Order` even if payment disabled\
\
---\
\
### 2.3 AI Service Layer\
\
AI services:\
- Consume state snapshots\
- Emit recommendations\
- Propose actions\
- Execute only allowed actions\
\
AI must:\
- Explain \'93why\'94 before acting\
- Respect Automation ON/OFF toggles\
- Respect merchant approval boundaries\
\
AI must never:\
- Modify prices\
- Enable payments\
- Trigger payouts\
- Send irreversible messages without approval\
\
---\
\
## 3. State Machines as Contracts\
\
State machines are **contracts**, not suggestions.\
\
### 3.1 User Access States\
- ANONYMOUS\
- AUTHENTICATED\
- PASSWORD_RESET\
\
### 3.2 Business Access States\
- NO_BUSINESS\
- REFERRAL_REQUIRED\
- ACCESS_REQUESTED\
- BUSINESS_CREATED\
- ACTIVE\
\
### 3.3 Business Readiness Flags (Parallel)\
- PAYMENT_ENABLED / PAYMENT_DISABLED\
- DELIVERY_CONFIGURED / NOT_CONFIGURED\
- PRODUCTS_AVAILABLE / NO_PRODUCTS\
- AI_ENERGY_OK / AI_ENERGY_LOW\
- PAYOUT_READY / PAYOUT_BLOCKED\
\
Rules:\
- Flags are independent\
- Flags never block app access\
- Flags affect **specific actions only**\
\
---\
\
## 4. Action Gating Rules\
\
| Action | Required State |\
|------|----------------|\
| Create Order | Business.ACTIVE |\
| Complete Payment | PAYMENT_ENABLED |\
| Deliver Order | DELIVERY_CONFIGURED |\
| Withdraw Funds | DAN VERIFIED + BANK DETAILS |\
| AI Follow-up | Automation ON |\
\
\uc0\u10060  Never gate:\
- Browsing products\
- Viewing orders\
- Opening Wallet\
- Exploring settings\
\
---\
\
## 5. AI Assistant Panel Contract\
\
The Right AI Assistant Panel is:\
- Always present\
- Context-aware\
- Action-oriented\
\
Panel responsibilities:\
- Observe current state\
- Recommend next best action\
- Execute lightweight actions\
- Escalate risky actions for approval\
\
Panel is NOT:\
- A settings page\
- A rule editor\
- A chatbot sandbox\
\
---\
\
## 6. Data Conventions\
\
### 6.1 Immutable Events, Mutable State\
\
- Orders, payments, payouts create events\
- Current state is derived\
- No silent overwrites\
\
### 6.2 Ownership Rules\
\
- User owns Business\
- Business owns Products, Orders, Wallet\
- AI never owns data \'97 only acts on behalf\
\
---\
\
## 7. Payments & Money Safety Rules\
\
Hard rules:\
- Money movement requires verification\
- Selling does NOT require verification\
- Payment success \uc0\u8800  Order completed\
- BNPL approved = Order can proceed\
\
AI behavior:\
- Explain delays\
- Explain failures\
- Never promise money availability\
\
---\
\
## 8. Automations Philosophy\
\
- Pre-built only\
- ON / OFF only\
- No condition builders\
- No scripts\
- No merchant logic burden\
\
If automation is OFF:\
- AI suggests\
- AI does not execute\
\
---\
\
## 9. Error Handling Conventions\
\
Errors must be:\
- Human-readable\
- Actionable\
- Non-technical\
\
\uc0\u10060  Forbidden:\
- Stack traces\
- Provider error codes\
- Blame language\
\
---\
\
## 10. MVP Discipline Rules (Hard)\
\
1. Selling beats configuration\
2. State beats screens\
3. AI explains, never surprises\
4. Nothing blocks exploration\
5. Money actions are protected\
6. If it doesn\'92t increase sales \uc0\u8594  cut\
\
---\
\
## One-line Architecture Definition\
\
Storex is a **state-driven AI commerce system**\
where selling is always possible,\
configuration is never forced,\
and trust gates only money.\
}