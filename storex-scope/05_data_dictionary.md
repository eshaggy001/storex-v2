# Storex — Data Dictionary (v2)

This document defines the **core data objects**, their fields, relationships, and usage rules across the Storex platform.

Storex is **state-driven and AI-first**.  
Data structures are designed to support:
- AI decision-making
- Social commerce selling
- Minimal manual configuration
- Secure payments & payouts

---

## 1. User

Represents a human account that can own or operate one or more businesses.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique user identifier |
| `email` | String | No | User email (optional for phone-only signup) |
| `phone` | String | No | User phone number |
| `password_hash` | String | Yes | Hashed password |
| `full_name` | String | No | User's full name |
| `avatar_url` | String | No | Profile picture URL |
| `language` | Enum | Yes | UI language (`mn`, `en`) |
| `status` | Enum | Yes | `ANONYMOUS`, `AUTHENTICATED` |
| `created_at` | Timestamp | Yes | Account creation time |
| `last_login_at` | Timestamp | No | Last login timestamp |

### Rules

- A User can exist without a Business
- A User may own multiple Businesses (future)
- User identity is separate from Business identity
- Email OR phone required (at least one)

### Relationships

- One User → Many Businesses (owner)
- One User → One IdentityVerification (DAN)

---

## 2. Business

Represents a merchant entity selling through Storex.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique business identifier |
| `owner_user_id` | UUID (FK) | Yes | References User.id |
| `name` | String | Yes | Business/Store name |
| `category` | String | Yes | Business category |
| `city` | String | No | Business location |
| `logo_url` | String | No | Business logo |
| `status` | Enum | Yes | `NO_BUSINESS`, `BUSINESS_CREATED`, `ACTIVE` |
| `referral_code_used` | String | Yes | Referral code used for creation |
| `onboarding_step` | Integer | No | Legacy onboarding progress |
| `is_live` | Boolean | No | Legacy live status |
| `created_at` | Timestamp | Yes | Business creation time |
| `updated_at` | Timestamp | Yes | Last update time |

### Rules

- Business can only be created with a valid referral code
- Business becomes `ACTIVE` immediately after name & category
- No setup blocks access to the Main App

### Relationships

- One Business → One User (owner)
- One Business → Many Products
- One Business → Many Orders
- One Business → Many Customers
- One Business → One Wallet
- One Business → Many Automations

---

## 3. ReferralCode

Controls access and campaign-based growth.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | String | Yes | Unique referral code |
| `issued_by_business_id` | UUID (FK) | Yes | References Business.id |
| `used_by_user_id` | UUID (FK) | No | References User.id (null if unused) |
| `status` | Enum | Yes | `UNUSED`, `USED` |
| `expires_at` | Timestamp | No | Expiration date (optional) |
| `created_at` | Timestamp | Yes | Code generation time |

### Rules

- One referral code = one business creation
- Referral codes are trust-based and limited
- Each business receives one referral code upon creation
- Code can only be used once

---

## 4. AccessRequest

Captures demand when referral code is not available.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique request identifier |
| `user_id` | UUID (FK) | Yes | References User.id |
| `business_name` | String | Yes | Proposed business name |
| `business_category` | String | Yes | Proposed category |
| `contact_email` | String | No | Contact email |
| `contact_phone` | String | No | Contact phone |
| `status` | Enum | Yes | `REQUESTED`, `APPROVED`, `REJECTED` |
| `created_at` | Timestamp | Yes | Request submission time |
| `reviewed_at` | Timestamp | No | Review time |

### Rules

- Does NOT create a Business
- User cannot access Main App with pending request
- Used for controlled rollout

---

## 5. Product

Represents an item sold by a Business.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique product identifier |
| `business_id` | UUID (FK) | Yes | References Business.id |
| `name` | String | Yes | Product name |
| `description` | String | No | Product description |
| `price` | Decimal | Yes | Base price |
| `category` | String | Yes | Product category |
| `images` | JSON Array | No | Array of image URLs |
| `variants` | JSON | No | Product variants (size, color, etc.) |
| `options` | JSON Array | No | Product options/attributes |
| `stock` | Integer | Yes | Available quantity |
| `availability_type` | Enum | Yes | `ready`, `pre_order`, `custom_order` |
| `delivery_days` | Integer | No | Estimated delivery days |
| `delivery_options` | JSON Array | Yes | `['courier', 'pickup']` |
| `status` | Enum | Yes | `ACTIVE`, `DISABLED` |
| `created_by` | Enum | Yes | `AI`, `MANUAL` |
| `created_at` | Timestamp | Yes | Product creation time |
| `updated_at` | Timestamp | Yes | Last update time |

### Rules

- Products can be AI-generated from photos
- Minimal required fields (name, price, category)
- Product becomes sellable immediately when `ACTIVE`
- Stock can be 0 (out of stock) but product remains visible

### Relationships

- One Product → One Business
- One Product → Many OrderItems

---

## 6. Customer

Represents an end buyer interacting via social channels.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique customer identifier |
| `business_id` | UUID (FK) | Yes | References Business.id |
| `name` | String | No | Customer name |
| `phone` | String | No | Phone number |
| `email` | String | No | Email address |
| `social_id` | String | No | Facebook/Instagram ID |
| `channel` | Enum | Yes | `facebook`, `instagram`, `web`, `offline` |
| `total_orders` | Integer | Yes | Total order count |
| `total_spend` | Decimal | Yes | Total spending amount |
| `status` | Enum | Yes | `NEW`, `RETURNING` |
| `source` | String | No | Acquisition source |
| `note` | Text | No | Merchant notes |
| `ai_insight` | Text | No | AI-generated insights |
| `created_at` | Timestamp | Yes | First interaction time |
| `last_interaction` | Timestamp | Yes | Last activity time |

### Rules

- Customers may be auto-created by AI
- AI merges duplicate identities automatically
- At least one contact method required (phone/email/social)

### Relationships

- One Customer → One Business
- One Customer → Many Orders
- One Customer → Many Conversations

---

## 7. Order

Represents a sales transaction.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID/String | Yes | Unique order identifier |
| `business_id` | UUID (FK) | Yes | References Business.id |
| `customer_id` | UUID (FK) | Yes | References Customer.id |
| `customer_name` | String | Yes | Customer name (denormalized) |
| `phone_number` | String | No | Customer phone |
| `items` | JSON Array | Yes | Order line items |
| `total` | Decimal | Yes | Total order amount |
| `channel` | Enum | Yes | `facebook`, `instagram`, `web`, `offline` |
| `source` | Enum | Yes | `FACEBOOK`, `INSTAGRAM`, `OFFLINE`, `WEB` |
| `payment_method` | String | No | Payment method chosen |
| `payment_status` | Enum | Yes | `UNPAID`, `PAID`, `FAILED`, `REFUNDED` |
| `order_status` | Enum | Yes | `NEW`, `PAID`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED` |
| `delivery_status` | Enum | Yes | `NOT_REQUIRED`, `PENDING`, `IN_PROGRESS`, `DELIVERED` |
| `delivery_method` | String | No | `pickup`, `courier`, `delivery` |
| `delivery_address` | Text | No | Delivery address |
| `created_by` | Enum | Yes | `AI`, `MANUAL` |
| `is_ai_generated` | Boolean | Yes | True if AI created order |
| `ai_summary` | Text | No | AI order summary |
| `created_at` | Timestamp | Yes | Order creation time |
| `updated_at` | Timestamp | Yes | Last update time |

### Rules

- Orders can be AI-created or manually created
- Payment & delivery required to complete sale
- AI manages notifications & follow-ups
- `total` must match sum of items

### Relationships

- One Order → One Business
- One Order → One Customer
- One Order → Many PaymentTransactions
- One Order → Zero or One BNPLTransaction

---

## 8. PaymentTransaction

Tracks incoming payments.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique transaction identifier |
| `order_id` | UUID (FK) | Yes | References Order.id |
| `amount` | Decimal | Yes | Payment amount |
| `payment_method` | String | Yes | `bank_transfer`, `cash`, `qr`, `card` |
| `status` | Enum | Yes | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| `reference_number` | String | No | External payment reference |
| `created_at` | Timestamp | Yes | Transaction time |

### Relationships

- One PaymentTransaction → One Order

---

## 9. BNPLTransaction

Tracks Buy Now Pay Later activity.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique BNPL identifier |
| `order_id` | UUID (FK) | Yes | References Order.id |
| `provider` | String | Yes | BNPL provider name |
| `status` | Enum | Yes | `APPROVED`, `REJECTED`, `PENDING`, `COMPLETED` |
| `outstanding_amount` | Decimal | Yes | Remaining balance |
| `installments` | Integer | No | Number of payments |
| `created_at` | Timestamp | Yes | BNPL creation time |
| `completed_at` | Timestamp | No | Completion time |

### Relationships

- One BNPLTransaction → One Order

---

## 10. Wallet

Represents merchant financial state.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `business_id` | UUID (FK) | Yes | References Business.id (Primary Key) |
| `available_balance` | Decimal | Yes | Withdrawable balance |
| `pending_balance` | Decimal | Yes | Pending clearance |
| `total_earned` | Decimal | Yes | Lifetime earnings |
| `payout_status` | Enum | Yes | `PAYOUT_READY`, `PAYOUT_BLOCKED` |
| `bank_name` | String | No | Payout bank name |
| `account_holder` | String | No | Account holder name |
| `account_number` | String | No | Bank account number |
| `updated_at` | Timestamp | Yes | Last update time |

### Rules

- One Wallet per Business
- Payout requires DAN verification
- Bank details required for withdrawal

### Relationships

- One Wallet → One Business
- One Wallet → Many Payouts

---

## 11. IdentityVerification (DAN)

Required for payouts.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | UUID (FK) | Yes | References User.id (Primary Key) |
| `status` | Enum | Yes | `NOT_VERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`, `EXPIRED` |
| `document_url` | String | No | DAN photo URL |
| `selfie_url` | String | No | Selfie verification URL |
| `verified_at` | Timestamp | No | Verification completion time |
| `expires_at` | Timestamp | No | Verification expiry (e.g., 1 year) |
| `created_at` | Timestamp | Yes | Submission time |

### Rules

- Required once per user (not per business)
- Blocks payouts only (not selling)
- Can expire and require renewal

### Relationships

- One IdentityVerification → One User

---

## 12. Payout

Represents withdrawal request.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique payout identifier |
| `business_id` | UUID (FK) | Yes | References Business.id |
| `amount` | Decimal | Yes | Withdrawal amount |
| `status` | Enum | Yes | `REQUESTED`, `PROCESSING`, `COMPLETED`, `FAILED` |
| `bank_name` | String | Yes | Destination bank |
| `account_number` | String | Yes | Destination account |
| `failure_reason` | Text | No | Reason if failed |
| `created_at` | Timestamp | Yes | Request time |
| `completed_at` | Timestamp | No | Completion time |

### Relationships

- One Payout → One Business (via Wallet)

---

## 13. AI_Energy (Token Balance)

Tracks AI usage.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `business_id` | UUID (FK) | Yes | References Business.id (Primary Key) |
| `available_tokens` | Integer | Yes | Remaining tokens |
| `used_tokens` | Integer | Yes | Consumed tokens (current cycle) |
| `total_purchased` | Integer | Yes | Total tokens purchased |
| `reset_date` | Date | No | Next reset date (if subscription-based) |
| `updated_at` | Timestamp | Yes | Last update time |

### Rules

- Token usage does not block app access
- AI warns before exhaustion
- Can purchase additional token packages

### Relationships

- One AI_Energy → One Business

---

## 14. AutomationSetting

Controls AI behavior.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `business_id` | UUID (FK) | Yes | References Business.id (Primary Key) |
| `auto_reply_comments` | Boolean | Yes | Auto-reply to social comments |
| `unpaid_order_followup` | Boolean | Yes | Follow up on unpaid orders |
| `reengage_customers` | Boolean | Yes | Re-engage returning customers |
| `delivery_updates` | Boolean | Yes | Auto-send delivery updates |
| `low_energy_alerts` | Boolean | Yes | Alert on low AI energy |
| `ai_tone` | Enum | Yes | `conservative`, `balanced`, `proactive` |
| `updated_at` | Timestamp | Yes | Last update time |

### Rules

- No custom rules
- ON / OFF only (boolean toggles)
- AI handles logic internally

### Relationships

- One AutomationSetting → One Business

---

## 15. Notification

Represents merchant alerts.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique notification identifier |
| `business_id` | UUID (FK) | Yes | References Business.id |
| `type` | String | Yes | Notification type (e.g., `new_order`) |
| `title` | String | Yes | Notification title |
| `message` | Text | Yes | Notification content |
| `channel` | Enum | Yes | `IN_APP`, `EMAIL`, `SMS`, `PUSH` |
| `priority` | Enum | Yes | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `read_at` | Timestamp | No | Read timestamp (null if unread) |
| `created_at` | Timestamp | Yes | Notification creation time |

### Rules

- Critical notifications cannot be fully disabled
- AI batches low-priority alerts

### Relationships

- One Notification → One Business

---

## 16. Conversation

Represents customer chat thread (Messages view).

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique conversation identifier |
| `business_id` | UUID (FK) | Yes | References Business.id |
| `customer_id` | UUID (FK) | Yes | References Customer.id |
| `channel` | Enum | Yes | `facebook`, `instagram`, `web`, `offline` |
| `status` | Enum | Yes | `NEW`, `IN_PROGRESS`, `DRAFT_ORDER`, `ORDER_CREATED`, `CLOSED` |
| `intent` | Enum | No | `BUYING_INTENT`, `QUESTION`, `SUPPORT`, `FOLLOW_UP` |
| `last_message` | Text | No | Preview of last message |
| `unread_count` | Integer | Yes | Unread message count |
| `created_at` | Timestamp | Yes | First message time |
| `updated_at` | Timestamp | Yes | Last message time |

### Relationships

- One Conversation → One Business
- One Conversation → One Customer
- One Conversation → Many Messages
- One Conversation → Zero or Many Orders

---

## 17. Message

Individual message within a conversation.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique message identifier |
| `conversation_id` | UUID (FK) | Yes | References Conversation.id |
| `sender_type` | Enum | Yes | `CUSTOMER`, `MERCHANT`, `AI` |
| `content` | Text | Yes | Message text |
| `attachments` | JSON Array | No | File/image URLs |
| `ai_suggested` | Boolean | Yes | True if AI suggested response |
| `created_at` | Timestamp | Yes | Message timestamp |

### Relationships

- One Message → One Conversation

---

## 18. Readiness Flags (Computed)

These are **not stored** as separate tables but computed from other data.

### Flags

| Flag | Computation Logic |
|------|-------------------|
| `PAYMENT_ENABLED` | At least one payment method configured |
| `DELIVERY_CONFIGURED` | Delivery settings exist |
| `PRODUCTS_AVAILABLE` | At least one `ACTIVE` product exists |
| `AI_ENERGY_OK` | `available_tokens > threshold` |
| `PAYOUT_READY` | `DAN status = VERIFIED` AND `bank_details exist` |

### Usage

```javascript
const readiness = {
  PAYMENT_ENABLED: business.paymentMethods.length > 0,
  DELIVERY_CONFIGURED: business.deliverySettings !== null,
  PRODUCTS_AVAILABLE: products.filter(p => p.status === 'ACTIVE').length > 0,
  AI_ENERGY_OK: aiEnergy.available_tokens > 100,
  PAYOUT_READY: dan.status === 'VERIFIED' && wallet.bank_name !== null
}
```

---

## Data Relationships Diagram

```
User ──┬─ IdentityVerification (DAN)
       │
       └─ Business ──┬─ Product ──── OrderItem
                     │
                     ├─ Customer ──┬─ Order ──┬─ PaymentTransaction
                     │             │          └─ BNPLTransaction
                     │             │
                     │             └─ Conversation ── Message
                     │
                     ├─ Wallet ── Payout
                     ├─ AI_Energy
                     ├─ AutomationSetting
                     └─ Notification
```

---

## Data Philosophy

### Principles

1. **Data supports selling first**
   - No unnecessary configuration objects
   - Everything relates to selling

2. **State > Screens**
   - Data structure determines UI
   - Same data, different views based on state

3. **AI is a first-class consumer**
   - Data designed for AI decision-making
   - AI can read and write most entities

4. **Denormalization for performance**
   - Customer name stored in Order (not just FK)
   - Trade consistency for speed where needed

5. **Audit everything important**
   - Track `created_at` and `updated_at`
   - Know who/what created records (`created_by`)

---

**Data Dictionary Philosophy**
> Schema evolves with product.  
> Every field serves a purpose.  
> AI-friendly structure over perfect normalization.  
> Performance matters more than purity.

---

**Document Version**: 2.0  
**Last Updated**: 2026-01-19  
**Status**: Production-Ready Data Dictionary