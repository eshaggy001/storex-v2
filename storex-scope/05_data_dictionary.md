{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # Storex \'97 Data Dictionary (v1)\
\
This document defines the **core data objects**, their fields,\
relationships, and usage rules across the Storex platform.\
\
Storex is **state-driven and AI-first**.\
Data structures are designed to support:\
- AI decision-making\
- Social commerce selling\
- Minimal manual configuration\
- Secure payments & payouts\
\
---\
\
## 1. User\
\
Represents a human account that can own or operate one or more businesses.\
\
### Fields\
- id (UUID)\
- email (string, optional)\
- phone (string, optional)\
- password_hash\
- status (enum)\
  - ANONYMOUS\
  - AUTHENTICATED\
- created_at\
- last_login_at\
\
### Rules\
- A User can exist without a Business\
- A User may own multiple Businesses (future)\
- User identity is separate from Business identity\
\
---\
\
## 2. Business\
\
Represents a merchant entity selling through Storex.\
\
### Fields\
- id (UUID)\
- owner_user_id (FK \uc0\u8594  User.id)\
- name (string)\
- category (string)\
- city (string)\
- logo_url (string, optional)\
- status (enum)\
  - NO_BUSINESS\
  - BUSINESS_CREATED\
  - ACTIVE\
- referral_code_used (string)\
- created_at\
\
### Rules\
- Business can only be created with a valid referral code\
- Business becomes ACTIVE immediately after name & category\
- No setup blocks access to the Main App\
\
---\
\
## 3. ReferralCode\
\
Controls access and campaign-based growth.\
\
### Fields\
- code (string)\
- issued_by_business_id (FK \uc0\u8594  Business.id)\
- used_by_user_id (FK \uc0\u8594  User.id, nullable)\
- status (enum)\
  - UNUSED\
  - USED\
- expires_at (optional)\
\
### Rules\
- One referral code = one business creation\
- Referral codes are trust-based and limited\
\
---\
\
## 4. AccessRequest\
\
Captures demand when referral code is not available.\
\
### Fields\
- id (UUID)\
- business_name\
- business_category\
- contact_email\
- contact_phone\
- status (enum)\
  - REQUESTED\
  - APPROVED\
  - REJECTED\
- created_at\
\
### Rules\
- Does NOT create a Business\
- User cannot access Main App\
- Used for controlled rollout\
\
---\
\
## 5. Product\
\
Represents an item sold by a Business.\
\
### Fields\
- id (UUID)\
- business_id (FK \uc0\u8594  Business.id)\
- name\
- description (optional)\
- price\
- variants (JSON)\
- stock_quantity\
- status (enum)\
  - ACTIVE\
  - DISABLED\
- created_by (enum)\
  - AI\
  - MANUAL\
- created_at\
- updated_at\
\
### Rules\
- Products can be AI-generated from photos\
- Minimal required fields\
- Product becomes sellable immediately\
\
---\
\
## 6. Customer\
\
Represents an end buyer interacting via social channels.\
\
### Fields\
- id (UUID)\
- business_id (FK \uc0\u8594  Business.id)\
- name (optional)\
- phone\
- social_id (FB / IG)\
- total_orders\
- total_spend\
- status (enum)\
  - NEW\
  - RETURNING\
- created_at\
\
### Rules\
- Customers may be auto-created by AI\
- AI merges duplicate identities automatically\
\
---\
\
## 7. Order\
\
Represents a sales transaction.\
\
### Fields\
- id (UUID)\
- business_id (FK \uc0\u8594  Business.id)\
- customer_id (FK \uc0\u8594  Customer.id)\
- items (JSON)\
- total_amount\
- payment_status (enum)\
  - UNPAID\
  - PAID\
  - FAILED\
- order_status (enum)\
  - NEW\
  - PREPARING\
  - READY\
  - COMPLETED\
  - CANCELLED\
- delivery_status (enum)\
  - NOT_REQUIRED\
  - PENDING\
  - IN_PROGRESS\
  - DELIVERED\
- source (enum)\
  - FACEBOOK\
  - INSTAGRAM\
  - OFFLINE\
- created_by (enum)\
  - AI\
  - MANUAL\
- created_at\
\
### Rules\
- Orders can be AI-created or manually created\
- Payment & delivery required to complete sale\
- AI manages notifications & follow-ups\
\
---\
\
## 8. PaymentTransaction\
\
Tracks incoming payments.\
\
### Fields\
- id (UUID)\
- order_id (FK \uc0\u8594  Order.id)\
- amount\
- payment_method\
- status (enum)\
  - PENDING\
  - PAID\
  - FAILED\
- created_at\
\
---\
\
## 9. BNPLTransaction\
\
Tracks Buy Now Pay Later activity.\
\
### Fields\
- id (UUID)\
- order_id (FK \uc0\u8594  Order.id)\
- provider\
- status (enum)\
  - APPROVED\
  - REJECTED\
  - PENDING\
- outstanding_amount\
- created_at\
\
---\
\
## 10. Wallet\
\
Represents merchant financial state.\
\
### Fields\
- business_id (FK \uc0\u8594  Business.id)\
- available_balance\
- pending_balance\
- total_earned\
- payout_status (enum)\
  - PAYOUT_READY\
  - PAYOUT_BLOCKED\
\
---\
\
## 11. IdentityVerification (DAN)\
\
Required for payouts.\
\
### Fields\
- user_id (FK \uc0\u8594  User.id)\
- status (enum)\
  - NOT_VERIFIED\
  - PENDING\
  - VERIFIED\
- verified_at\
\
### Rules\
- Required once per user\
- Blocks payouts only (not selling)\
\
---\
\
## 12. Payout\
\
Represents withdrawal request.\
\
### Fields\
- id (UUID)\
- business_id (FK \uc0\u8594  Business.id)\
- amount\
- status (enum)\
  - REQUESTED\
  - PROCESSING\
  - COMPLETED\
  - FAILED\
- created_at\
\
---\
\
## 13. AI_Energy (Token Balance)\
\
Tracks AI usage.\
\
### Fields\
- business_id (FK \uc0\u8594  Business.id)\
- available_tokens\
- used_tokens\
- reset_date\
\
### Rules\
- Token usage does not block app access\
- AI warns before exhaustion\
\
---\
\
## 14. AutomationSetting\
\
Controls AI behavior.\
\
### Fields\
- business_id (FK \uc0\u8594  Business.id)\
- auto_reply_comments (boolean)\
- unpaid_order_followup (boolean)\
- reengage_customers (boolean)\
- delivery_updates (boolean)\
- low_energy_alerts (boolean)\
\
### Rules\
- No custom rules\
- ON / OFF only\
- AI handles logic internally\
\
---\
\
## 15. Notification\
\
Represents merchant alerts.\
\
### Fields\
- id (UUID)\
- business_id (FK \uc0\u8594  Business.id)\
- type\
- channel (IN_APP / EMAIL / SMS)\
- priority (LOW / MEDIUM / HIGH)\
- read_at\
- created_at\
\
### Rules\
- Critical notifications cannot be fully disabled\
- AI batches low-priority alerts\
\
---\
\
## Data Philosophy\
\
- Data supports **selling first**\
- No unnecessary configuration objects\
- State > Screens\
- AI is a first-class consumer of data\
\
}