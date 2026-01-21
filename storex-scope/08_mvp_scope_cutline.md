# Storex — MVP Scope & Cutline

## Purpose
- Юу MVP-д ОРОХ, юу ОРОХГҮЙ вэ гэдгийг тодорхой зааглах
- Feature creep-ээс хамгаалах
- Engineering, Product, Design бүгд нэг ойлголттой байх

**Principle:**  
Sell first. Cut everything else.

---

## 1. MVP-ийн гол зорилго (Why MVP exists)

Storex MVP-ийн зорилго бол:

**Social chat → Order → Payment → Fulfillment**  
Энэ loop-ийг AI-аар бодит бөрлөөллөөт болгож нөтлөх.

**MVP бол:**
- Зах зээлийг батлах
- AI sales person бодит буюу боорөллөөт хийж чадаж байна уу гэдгийг шалгах
- Merchant-д шууд орлого үүсгэж чадах эсэхийг батлах шат

---

## 2. MVP-д ОРСОН (IN SCOPE)

### 2.1 Core Selling Loop (Must-have)

**Included:**
- Social chat selling (Facebook / Instagram)
- AI product recommendation
- Intent detection (price, availability, hesitation)
- Order creation (AI + manual)
- Built-in payments
- BNPL checkout
- Order status management
- Basic delivery / pickup flow

**Rule:**
- Selling-тэй холбоотой зүйл cut хийхгүй

---

### 2.2 Onboarding & Access

**Included:**
- User signup / login
- Business onboarding (referral-gated)
- Access request flow (no referral)
- Business үүсмэгц main app-д нэвтрэх

**Excluded:**
- Long setup wizard
- Mandatory setup before app access

---

### 2.3 Products (Lean)

**Included:**
- Product list
- Product detail edit
- Enable / disable
- AI photo-based product creation
- Manual product creation

**Excluded:**
- Category trees
- Product collections
- Advanced inventory logic
- Multi-warehouse

---

### 2.4 Orders

**Included:**
- Order list
- Order detail
- Order status flow
- Manual order creation
- AI-created orders
- Customer notifications (AI)

**Excluded:**
- Returns
- Refunds
- Advanced fulfillment rules

---

### 2.5 Customers (Light CRM)

**Included:**
- Customer list
- Order history
- Total spend
- New vs returning
- AI tagging & follow-ups

**Excluded:**
- Manual segmentation
- Campaign builder
- Marketing lists

---

### 2.6 Wallet, Payments & BNPL

**Included:**
- Wallet overview (available / pending)
- Payment transaction history
- BNPL order visibility
- Payout request
- DAN identity verification (payout-only gate)

**Excluded:**
- Refunds
- Disputes
- Advanced finance reports

---

### 2.7 AI Assistant (Core Differentiator)

**Included:**
- Right AI Assistant Panel (persistent)
- Context-aware recommendations
- Non-blocking setup reminders
- Automation ON / OFF toggles
- AI Energy (token) visibility
- AI sales playbooks

**Excluded:**
- Custom rule builders
- Prompt editors
- AI scripting

---

### 2.8 Automations (Minimal)

**Included:**
- Pre-built automations only
- ON / OFF toggles
  - Auto-reply
  - Unpaid follow-up
  - Re-engagement
  - Delivery updates
  - Low AI energy alerts

**Excluded:**
- Conditional logic
- If / Else builders
- Time-based workflow editors

---

## 3. MVP-ээс CUT ХИЙСЭН (OUT OF SCOPE)

### 3.1 Platform / Scale

- Multi-business per user
- Team & roles
- Permissions matrix
- Activity logs

---

### 3.2 Commerce Complexity

- Multi-warehouse
- Supplier management
- Purchase orders
- Inventory sync

---

### 3.3 Marketing & Growth Tools

- Campaign builder
- Broadcast messaging
- Coupons
- Loyalty programs
- Email marketing

---

### 3.4 Power-user & Customization

- Custom AI prompts
- Workflow builders
- Rule engines
- Advanced analytics dashboards

---

### 3.5 Financial Depth

- Refunds
- Chargebacks
- Accounting exports
- Finance integrations

---

## 4. Hard MVP Rules (Non-negotiable)

1. **No feature unless it helps selling**
2. **No setup blocks selling**
3. **AI guides, never forces**
4. **Settings ≠ Selling**
5. **State-driven, not page-driven**
6. **Merchant never feels like "software setup"**

---

## 5. MVP Success Criteria

MVP амжилттай гэж үзэх шалгуур:

- ✅ Merchant бодит борлуулалт хийж эхэлсэн
- ✅ AI conversation → order conversion биелсэн
- ✅ Payment / BNPL-ээр мөнгө орж ирж байна
- ✅ Merchant AI-д итгэж байна
- ✅ Setup-аас илүү selling дээр төвлөрч байна

---

## 6. One-line MVP Definition

> **Storex MVP is an AI sales person  
> that turns social conversations into paid orders  
> without setup friction.**

---

**Document Version**: 2.0  
**Last Updated**: 2026-01-19  
**Status**: Production-Ready MVP Scope Definition