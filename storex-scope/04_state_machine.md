{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # Storex \'97 State Machine Definition\
\
This document defines the **core state machines** that govern\
user access, business lifecycle, AI readiness, and selling operations in Storex.\
\
Storex is **state-driven**, not page-driven.\
UI screens, AI behavior, and permissions are derived from state.\
\
---\
\
## 1. User Access State Machine\
\
### States\
\
- `ANONYMOUS`\
- `AUTHENTICATED`\
- `PASSWORD_RESET`\
\
### Transitions\
\
- `ANONYMOUS \uc0\u8594  AUTHENTICATED`\
  - Sign up (email / phone)\
  - Log in\
\
- `AUTHENTICATED \uc0\u8594  PASSWORD_RESET`\
  - Forgot password flow\
\
- `PASSWORD_RESET \uc0\u8594  AUTHENTICATED`\
  - Successful reset\
\
### Rules\
\
- No business context exists at this level\
- No referral code is required\
- User cannot access Main App without a Business state\
\
---\
\
## 2. Business Access State Machine (Referral-Gated)\
\
### States\
\
- `NO_BUSINESS`\
- `REFERRAL_REQUIRED`\
- `ACCESS_REQUESTED`\
- `BUSINESS_CREATED`\
- `ACTIVE`\
\
### Transitions\
\
- `AUTHENTICATED \uc0\u8594  NO_BUSINESS`\
  - First login with no business\
\
- `NO_BUSINESS \uc0\u8594  REFERRAL_REQUIRED`\
  - User attempts to create a business\
\
- `REFERRAL_REQUIRED \uc0\u8594  BUSINESS_CREATED`\
  - Valid referral code submitted\
\
- `REFERRAL_REQUIRED \uc0\u8594  ACCESS_REQUESTED`\
  - No referral code / invalid code\
  - Access request submitted\
\
- `ACCESS_REQUESTED \uc0\u8594  NO_BUSINESS`\
  - Await approval (no app access)\
\
- `BUSINESS_CREATED \uc0\u8594  ACTIVE`\
  - Business name + category saved\
\
### Rules\
\
- Business cannot exist without a valid referral\
- Access request does NOT create a business\
- Once ACTIVE, user enters Main Application immediately\
- No setup is blocking at this stage\
\
---\
\
## 3. Business Readiness State Machine\
\
This machine runs **in parallel** after business becomes ACTIVE.\
\
### States (Independent Flags)\
\
- `PAYMENT_ENABLED` / `PAYMENT_DISABLED`\
- `DELIVERY_CONFIGURED` / `DELIVERY_NOT_CONFIGURED`\
- `PRODUCTS_AVAILABLE` / `NO_PRODUCTS`\
- `AI_ENERGY_OK` / `AI_ENERGY_LOW`\
- `PAYOUT_READY` / `PAYOUT_BLOCKED`\
\
### Initial State\
\
```text\
PAYMENT_DISABLED\
DELIVERY_NOT_CONFIGURED\
NO_PRODUCTS\
AI_ENERGY_OK\
PAYOUT_BLOCKED\
}