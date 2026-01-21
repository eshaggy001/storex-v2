# Storex — Information Architecture (AI-first)

## Design Principles
- Selling comes first
- Remove online selling friction
- No forced setup or long wizards
- AI guides actions, not forms
- Growth is built into onboarding (referral-based)

---

## 1. Onboarding (Full Screen, Minimal & Controlled)

### Purpose
- Control access via referral campaign
- Identify user and business context
- Let users enter the system with minimal friction

---

### Step 1: User Onboarding (Access)

**Goal**
- Identify the user
- Allow fast entry into Storex

**Screens**
- Sign up (email / phone)
- Log in
- Forgot password

**Rules**
- No business setup at this stage
- No referral code required
- No configuration or selling steps

---

### Step 2: Business Onboarding (Referral-Gated)

#### Entry Rule
- Only users with a **valid referral code** can create a business
- Users without a referral code must submit an access request

---

#### 2A. Referral Code Check
- Prompt: "Enter your referral code to create your business"

**States**
- ✅ Valid → Proceed to Business Creation  
- ❌ Invalid / none → Request Access flow

---

#### 2B. Request Access (No Referral Code)

**Purpose**
- Capture demand
- Control Storex campaign rollout

**Inputs**
- Business name  
- Business category  
- Contact info (email / phone)

**Message**
- "Your request has been received. We'll notify you when access is available."

**Rules**
- Business is NOT created
- No access to main application

---

#### 2C. Business Creation (Referral Holder)

##### Welcome & Intro
- "You're invited to sell online with Storex —
  no website, no SaaS tools, no bank or BNPL contracts."
- Short explanation of Storex as an AI sales person

##### Store Basics (Required)
- Business / Store name
- Business category

##### Selling Channels (Optional — Checkbox)
- ☐ Facebook  
- ☐ Instagram  
- ☐ Offline only  
- ☐ Not selling yet  

**Rules**
- No channel connection
- No product creation
- No payment or BNPL setup
- User enters main application immediately

---

#### 2D. Referral Sharing (Post Creation)

- One-time referral code granted
- Can invite **one other business**
- Code usable once only

**Purpose**
- Controlled, trust-based growth
- Storex marketing campaign

**UI**
- Light prompt in Dashboard or AI Assistant
- Never blocks selling

---

## 2. Main Application (Immediate Access)

**Purpose**
- Let merchants explore and operate Storex immediately
- Complete critical setup through AI guidance

---

### AI-Guided Setup (Non-blocking)

#### Payment Setup
- Enable built-in payments
- No bank or BNPL contracts
- AI explains methods
- Status: Not enabled / Enabled

#### Delivery Setup
- Delivery or pickup
- Delivery fee (optional)
- Delivery areas (optional)

**Key Rule**
- Payment & delivery required to complete a sale
- NOT required to enter or explore the app
- AI reminds only when relevant

---

### AI Assistant Responsibilities
- Detect missing setup
- Suggest next best actions
- Never block the user

---

## 3. Main Application Structure

---

### Dashboard

**Purpose**
- Snapshot of business health
- Focus on selling, not configuration

**Includes**
- Performance KPIs (Sales, Conversion, Response time)
- Live Status (AI activity)
- Recommended Actions
- Activity Feeds (orders & messages)

**State-Based Views**

#### Onboarding State (Gamified Roadmap)
**When**: Business is not ready (`!isBusinessReady` based on readiness flags)

**Components:**
- **Progress Bar**: "Your store is X% ready"
  - Calculated from: products, payment, delivery flags
- **Hero Action Cards**: Large, prominent cards for critical setup
  - "Add Your First Product"
  - "Connect Payment"
  - "Setup Delivery"
- **Locked Stats**: Blurred/dimmed KPI cards with unlock prompts
  - "Unlock by adding your first product"
- **AI Welcome Panel**: "What to do next?" guidance
- **Recent Activity Feed**: Shows sample data or empty state

#### Active State (Smart Command Center)
**When**: Business is ready (`isBusinessReady` based on readiness flags)

**Components:**
- **KPI Cards**: 
  - Revenue (total, trends)
  - Orders (count, conversion)
  - New Customers (count, repeat rate)
  - Response Time (average)
- **Needs Attention Feed**: 
  - Urgent items ("3 pending orders", "Low stock on X")
  - Prioritized by AI
- **AI Insight Panel**: 
  - Actionable business advice
  - Growth recommendations
- **Recent Activity Feed**:
  - Recent orders
  - Recent messages
  - System notifications

---

### Products

**Purpose**
- Fast product management
- Clean input for AI selling

#### Product List
- Search
- Filter: Availability, Status

#### Product Detail View
- Edit name, price, variants, stock
- Enable / disable
- Delete with confirmation
- **AI Enhancement**: "Let's improve this product with AI"
  - AI-powered product optimization
  - Photo enhancement suggestions
  - Description improvements

#### Product Wizard (Overlay)

**AI-assisted (Photo-based)**
- Upload product photos
- AI generates title, category, attributes, variants, price range
- Merchant reviews & edits

**Manual**
- Direct field input

**Rules**
- Overlay only
- Minimal required fields
- Product available for AI selling immediately

---

### Messages

**Purpose**
- Centralize all customer conversations
- Enable AI-powered responses and order creation
- Track conversation intent and status

#### Messages Layout

##### Left Column: Conversation List
- **Search & Filter**
  - Search by customer name, phone, message
  - Filter by channel (Instagram, Facebook, Web, Offline)
  - Filter by status (New, In Progress, Closed)
- **Conversation Cards**
  - Customer name & avatar
  - Last message preview
  - Channel badge
  - Time stamp
  - Unread indicator
  - AI-detected intent tag

##### Right Column: Active Conversation

**Profile View** (Default when conversation selected)
- **Customer Info**
  - Name, phone, social handles
  - Channel source
  - Tags & AI insights
- **Quick Actions**
  - Create order
  - View order history
  - Add note
- **Order History**
  - List of past orders
  - Status & amounts

**Draft Order View** (When creating order from conversation)
- **Order Builder**
  - Product selection
  - Quantity & variants
  - Pricing calculation
  - Delivery method
  - Payment method
- **Customer Context**
  - Customer info visible
  - Conversation history accessible
- **Actions**
  - Confirm & create order
  - Save as draft
  - Cancel & return

**Active Order View** (When order exists for conversation)
- **Order Details**
  - Order ID & status
  - Items & pricing
  - Payment status
  - Delivery status
- **Order Actions**
  - Update status
  - Update delivery
  - Add notes
- **Customer Communication**
  - Send updates
  - Request payment
  - Confirm delivery

#### AI Capabilities
- **Intent Detection**: Detect buying intent, questions, support requests
- **Auto-response suggestions**: Pre-written responses based on context
- **Order creation assistance**: Suggest products based on conversation
- **Follow-up automation**: Remind about unpaid orders, abandoned carts

---

### Orders

**Purpose**
- Manage sales outcomes
- Connect sales with fulfillment
- Reduce manual follow-ups

#### Core Capabilities
- Create orders (AI / Manual)
- Search & filter
- Track status
- Delivery View (AI Dispatcher)

#### Create Order
- AI-created after checkout / BNPL
- Manual for offline / phone orders

#### Order List
**Search**
- Order ID, Customer, Phone

**Filters**
- Status, Payment, Delivery, Date

**Status Flow**
- New → Paid → Preparing → Ready → Completed / Cancelled

#### Order Detail View
- Customer & items
- Payment & BNPL
- Delivery details

**Actions**
- Update status
- Update delivery
- Internal notes

**AI**
- Customer notifications
- Delay / unpaid alerts
- Next-action suggestions

---

#### Delivery View (AI Dispatcher)

**Views**
- Map View
- List View

##### Map View
- Orders on map
- Clustered by location
- Courier load visibility

##### List View (Detailed)

Each row includes:
- Order ID
- Customer name
- Delivery address
- Order status
- Payment status
- Order Creation Type (AI / Manual / Website)
- Source (Instagram / Facebook / Website / Offline)
- Total Amount

**Actions**
- View detail
- Update delivery
- Assign courier

**AI Intelligence**
- Priority highlighting
- Bottleneck detection
- Cluster optimization

---

### Customers

**Purpose**
- Centralize customer data
- Enable repeat sales
- Power AI follow-ups

#### Metrics
- Total Customers
- Returning Customers

#### Customer List
- Name
- Contact
- Last interaction
- Total orders
- Total spend
- Status (New / Returning)

#### Search & Filter
- Name, phone, social
- New vs returning
- Spend range

#### Add Customer
- Manual add (offline / phone)
- Auto-merge with AI data

#### Customer Detail View
**Profile**
- Contact, socials, notes

**History**
- Orders (status, amount, source)
- Conversations & intents

**AI**
- Tags, follow-ups, churn detection

---

### Automations
- Pre-built
- On / Off only

---

### Wallet

**Purpose**
- Centralize all payment, BNPL, and payout activities
- Give merchants clear visibility into money flow
- Ensure payouts are secure and compliant
- Let AI guide financial actions safely

---

### Wallet Overview
- Available balance
- Pending balance
- Total earnings
- Recent transactions

**Purpose**
- Provide instant understanding of funds status
- Help merchants decide when to withdraw (payout)

---

### Payments
- Enabled payment methods
- Payment status (Enabled / Not enabled)
- Transaction history:
  - Order ID
  - Amount
  - Payment method
  - Status (Paid / Pending / Failed)

**Purpose**
- Track incoming payments clearly
- Reduce confusion around order payment status

---

### BNPL
- BNPL availability status
- BNPL order list
- Approved / rejected summary
- Outstanding BNPL amounts

**Purpose**
- Monitor deferred payments and BNPL performance

---

### Merchant Payout

**Purpose**
- Allow merchants to withdraw available balance securely
- Ensure payouts comply with identity and banking requirements

---

#### Identity Verification (DAN) — Required for Payout

**Requirement**
- Merchant must complete **DAN (national ID) verification**
  before requesting any payout.

**Verification Status**
- Not verified
- Pending verification
- Verified

**Rules**
- ❌ Payout requests are blocked if DAN is not verified
- ✅ Payout becomes available only after successful verification
- Verification is required **once per user**

**UI Behavior**
- Show verification prompt inside Wallet
- Clearly explain why verification is required
- Do not block other app usage

---

#### Payout Setup (Bank Details)

**Required to withdraw funds**
- Bank name
- Account holder name
- Bank account number
- Optional: Branch / IBAN (if applicable)

**Rules**
- Bank details can be added only after DAN verification
- Bank details are stored securely
- Changes may require re-verification

---

#### Payout Request

- Withdraw available balance (partial or full)
- Show payout limits or minimums (if any)
- Confirm payout amount before submission

**Payout Status**
- Requested
- Processing
- Completed
- Failed

---

### AI Involvement
- AI reminds merchants to complete DAN verification
- AI explains why verification is required (simple, non-legal language)
- AI notifies when payout becomes available
- AI explains payout status and delays

---

**Wallet Philosophy**
> Money movement requires trust.  
> Verification builds that trust — AI makes it easy.

---

### Settings

**Purpose**
- Manage business-level configuration
- Control identity, subscription, billing, and operational preferences
- Keep setup separate from daily selling workflows

---

#### Business Info

**Purpose**
- Define the business identity across Storex
- Help AI understand where and how the business operates
- Improve customer trust and fulfillment accuracy

---

##### Business Identity
- Business name
- Business category

---

##### Business Logo

**Options**
- Upload logo manually
- Import from Instagram profile
- Import from Facebook profile picture

**Rules**
- Logo is optional but recommended
- Used in:
  - AI messages
  - Order confirmations
  - Customer-facing views

---

##### Contact Information
- Contact phone number (required)
- Optional secondary contact

**Purpose**
- Enable customer communication
- Support delivery and order follow-ups

---

##### Location
- City selection (required)

**Purpose**
- Localize delivery, pickup, and AI recommendations

---

##### Physical Store Information (Optional)

**Shown only if the business has a physical location**

**Includes**
- Physical store toggle (Yes / No)
- Store address
- Store name (if different from business name)
- Working hours
- Pickup availability (Yes / No)

**Rules**
- Physical store details are optional
- Can be updated anytime
- Does not block selling

---

#### Accepted Payment Methods

**Purpose**
- Configure which payment methods the business accepts
- Clear visibility of payment setup status

**Payment Methods**
- Bank Transfer
- Cash on Delivery
- QR Code (QPay, Social Pay, etc.)
- Card Payment (if available)

**For each method:**
- Status: Enabled / Disabled
- Setup requirements (if any)
- Toggle on/off

**Bank Details Section** (Conditional)
- **When NOT configured**: 
  - Show "Add Bank Account" card in payment methods list
  - Click opens `BankSettingsModal`
- **When configured**: 
  - Show "Payout: [Bank Name]" badge in section header
  - Click badge to edit in modal

**Rules**
- At least one payment method must be enabled to receive payments
- Bank details are required for bank transfer payments
- Bank details sync with Wallet payout settings

---

#### Subscription Plan

**Purpose**
- Show which Storex plan the business is currently on
- Communicate feature access and usage limits clearly

**Includes**
- Current plan name (e.g. Starter / Pro / Business)
- Plan status (Active / Trial / Expired)
- Included features overview
- Upgrade / change plan action

**Rules**
- Plan changes do not interrupt active selling
- AI may recommend plan upgrades when usage approaches limits

---

#### Billing & AI Energy

**Purpose**
- Give transparency into AI usage and billing
- Let merchants manage token-based AI consumption

---

##### AI Energy (Token Usage)

**Includes**
- Available tokens
- Used tokens (current cycle)
- Token consumption by feature:
  - AI conversations
  - Product generation
  - Automation actions
- Usage reset date (if applicable)

**Purpose**
- Help merchants understand how AI is being used
- Prevent unexpected token exhaustion

---

##### Token Packages

**Includes**
- Available add-on token packages
- Token amount per package
- Price per package
- Purchase action

**Rules**
- Token purchases apply immediately
- Tokens do not affect subscription plan status

---

##### Billing History
- Invoices and payment history
- Token purchase records
- Billing dates and amounts

---

#### Delivery Settings

**Purpose**
- Configure how orders are fulfilled
- Support delivery and pickup workflows

**Settings**
- Delivery enabled / disabled
- Pickup only option
- Delivery fee (optional)
- Delivery areas (optional)
- Fulfillment preferences

**Rules**
- Delivery settings affect Orders and Delivery View
- Changes apply to new orders only
- Delivery setup does not block selling

---

#### Store Notifications

**Purpose**
- Control how and when merchants are notified about important events
- Prevent notification overload while ensuring critical actions are not missed

---

##### Notification Channels
- In-app notifications
- Email notifications
- SMS / Push notifications (if available)

---

##### Notification Types

**Merchants can enable or disable notifications for:**

- New orders
- Order status changes
- Payment received
- BNPL approval / rejection
- Delivery status updates
- Payout status updates
- Low AI Energy (token) warning
- System or account-related alerts

**Rules**
- Critical notifications (e.g. payout failure, payment issues)
  cannot be fully disabled
- Non-critical notifications are customizable

---

##### AI Notification Intelligence
- AI prioritizes notifications based on urgency
- AI reduces noise by batching low-priority updates
- AI highlights actionable notifications first

**Purpose**
- Ensure merchants see what matters most
- Support faster reaction to sales and fulfillment events

---

#### Team & Access (Coming Soon)

**Status**
- Coming Soon

**Planned Capabilities**
- Invite team members
- Assign roles and permissions
- Control access to:
  - Orders
  - Products
  - Wallet
  - Settings

**Rules (Future)**
- Owner has full access
- Role-based permissions
- Activity logging per team member

**Purpose**
- Prepare Storex for multi-user businesses
- Enable safe collaboration as merchants grow

---

#### AI Preferences

**Purpose**
- Control how proactive the AI is
- Let merchants tune AI behavior without technical setup

---

##### AI Automations

**Description**
- Pre-built, AI-managed workflows
- Designed to increase sales and reduce manual work

**Controls**
- Auto-reply to comments → ON / OFF
- Follow up unpaid orders → ON / OFF
- Re-engage returning customers → ON / OFF
- Delivery status auto-updates → ON / OFF
- Low AI Energy alerts → ON / OFF

**Rules**
- No rule builders
- No condition editors
- AI handles the logic
- Merchant only approves behavior

---

##### AI Tone & Intensity
- Conservative / Balanced / Proactive
- Notification sensitivity

---

**Rule**
- Changes apply immediately
- AI explains impact of each toggle

---

### AI Involvement (Settings)

- AI explains notification importance and urgency
- AI suggests optimal notification settings based on business activity
- AI adapts notification behavior as order volume grows

---

**Settings Philosophy**
> Control should be clear.  
> AI usage should be transparent.  
> Growth should never be confusing.

---

## Profile (User-level) — Extended Minimal (MVP+)

**Purpose**
- Manage user identity, security, and personal preferences
- Must NOT block selling or business workflows
- User-level only (separate from Business Settings)

---

## IA Placement

### Sidebar
- Menu item: **Profile**
  - Opens full Profile screen

### Top Bar
- User Avatar (right side)
  - Click → Dropdown menu

---

## Top Bar Avatar — Dropdown Menu

**Items:**
1) **My Profile**
2) Divider
3) **Log out**

**Rules**
- Dropdown closes on outside click / Esc
- No blocking modals
- One-click logout

---

## Profile Screen Structure

### 1. Basic Information

**Purpose**
- Identify the user
- Provide secure contact information
- Keep user identity separate from business data

---

**Avatar**
- Profile image
- Action: Upload / Change avatar

---

**Full Name**
- User's full name
- Text input field

---

**Email Address**
- Primary email
- Used for account recovery and notifications
- Change requires verification

---

**Phone Number**
- Primary phone number
- Used for 2FA and critical notifications
- Change requires verification

---

### 2. Security & Auth Management

**Purpose**
- Secure account access
- Enable account recovery
- Manage authentication methods

---

**Password Management**
- **Change Password**
  - Current password (required)
  - New password
  - Confirm new password
- **Password strength indicator**
- **Last changed**: Display date

---

**Two-Factor Authentication (2FA)**
- Status: Enabled / Disabled
- Methods:
  - SMS-based OTP
  - Authenticator app (optional)
- Setup / Disable action

**Rules**
- Strongly recommended but not forced
- Cannot disable if it's the only security method

---

**Active Sessions**
- List of active login sessions
- Device type
- Location (city/country)
- Last active timestamp
- Action: "Log out this session"

**Purpose**
- Security monitoring
- Remote logout capability

---

### 3. Identity Verification (DAN)

**Purpose**
- Required for payout operations
- Comply with financial regulations
- Build trust and security

---

**Verification Status**
- ❌ Not Verified
- ⏳ Pending Verification
- ✅ Verified

**Verification Process** (if not verified)
- Upload national ID (DAN) photo
- Selfie verification (if required)
- AI-assisted verification guide
- Submit for review

**Display (if verified)**
- Verified badge
- Verification date
- "Manage verification" (if re-verification needed)

**Rules**
- Required once per user (not per business)
- Payout operations blocked until verified
- Does NOT block selling or other app usage

---

### 4. Language & Preferences

**Purpose**
- Personalize user experience
- Control UI language independently of business settings

---

**Language Selection**
- Mongolian (Монгол)
- English
- Other supported languages

**Rules**
- Changes apply immediately to UI
- Does NOT affect business communication language
- Stored at user level (not business level)

---

**Timezone** (Optional, future)
- Auto-detect or manual selection
- Used for notification timing

---

### 5. Referral Program

**Purpose**
- Enable users to invite others to Storex
- Track referral status and rewards
- Support controlled growth campaign

---

**Referral Code**
- Display user's unique referral code
- One-time use code
- Can invite **one other business**

**Status**
- Available (not used)
- Used (show invited business name if applicable)
- No code available (if user has already used their invite)

**Actions**
- Copy referral code
- Share via social media (optional)

**Social Proof**
- "Join 2,400+ businesses growing with Storex" (or similar)

**Rules**
- One code per user
- Code expires after one use
- Cannot generate new codes (controlled distribution)

---

### 6. Account Management

**Purpose**
- Give users control over their account lifecycle
- Ensure safe account deactivation/deletion

---

**Deactivate Account** (Optional, future)
- Temporary suspension
- Business remains but user cannot login
- Can be reactivated

**Delete Account**
- Permanent deletion
- Warning: All data will be lost
- Requires confirmation
- Requires password re-entry

**Rules**
- Cannot delete account with active orders (must resolve first)
- Cannot delete if there are outstanding payouts
- AI warns about consequences before proceeding

---

### AI Involvement (Profile)

- AI guides DAN verification process
- AI explains why identity verification is needed
- AI suggests strong password practices
- AI reminds about 2FA setup (non-blocking)
- AI explains referral program benefits

---

**Profile Philosophy**
> User data is personal.  
> Security is empowering, not blocking.  
> AI makes compliance easy.

---

## Global AI Assistant Panel

**Purpose**
- Context-aware AI support across all screens
- Non-blocking guidance and task assistance
- Always accessible, never intrusive

---

### Panel Behavior

**States**
- Collapsed (floating button, bottom-right)
- Expanded (400px side panel, slides from right)

**Trigger**
- Click floating AI button
- Keyboard shortcut (optional)
- Auto-expand for urgent notifications (rare)

**Close**
- Click close button
- Click outside panel
- Press Esc

**Rules**
- Panel slides over content (does not push layout)
- Panel persists across navigation
- Context changes based on active view

---

### Panel Structure

**Header**
- "Storex AI" title
- Close button
- Context indicator ("Helping with: Dashboard" / "Product Detail" / etc.)

**Main Area**
- **Context-aware suggestions**: Based on current view and state
- **Quick actions**: Contextual buttons (e.g., "Add Product", "Create Order")
- **Conversation interface**: Chat-style interaction for complex tasks
- **Task progress**: If AI is performing a multi-step action

**Footer**
- Token usage indicator (if low)
- AI energy status

---

### Context-Aware Behavior

**Dashboard View**
- Onboarding state: "Add your first product to start selling"
- Active state: "3 orders need attention" or "Revenue up 15% this week"

**Product View**
- "Let's improve this product with AI"
- "Generate better product photos"
- "Optimize pricing based on market"

**Messages View**
- "Customer seems ready to buy. Create order?"
- "Suggest a response to this message"

**Orders View**
- "2 orders are delayed. Update customers?"
- "Optimize delivery routes for today"

**Wallet View**
- "DAN verification required for payout"
- "You can withdraw ₮45,000 now"

**Settings View**
- "Enable payment methods to start receiving orders"
- "Your AI automations are saving you 8 hours/week"

**Profile View**
- "Enable 2FA for better security"
- "Your referral code is ready to share"

---

### AI Capabilities

**Guidance**
- Explain features
- Suggest next steps
- Warn about consequences (e.g., deleting products)

**Automation**
- Auto-generate product descriptions
- Suggest responses to customer messages
- Create orders from conversations
- Optimize delivery routes

**Intelligence**
- Detect business health issues
- Predict customer churn
- Recommend pricing changes
- Identify growth opportunities

**Support**
- Answer questions
- Troubleshoot issues
- Explain why actions are blocked (e.g., payout requires DAN)

---

### AI Readiness Flags Integration

**The AI Assistant changes behavior based on readiness flags:**

**PAYMENT_DISABLED** → AI suggests: "Enable payments to start selling"  
**DELIVERY_NOT_CONFIGURED** → AI suggests: "Setup delivery to complete orders"  
**NO_PRODUCTS** → AI suggests: "Add your first product"  
**AI_ENERGY_LOW** → AI warns: "Your AI energy is running low. Purchase tokens?"  
**PAYOUT_BLOCKED** → AI explains: "Complete DAN verification to withdraw funds"

---

**AI Assistant Philosophy**
> AI is a co-pilot, not a blocker.  
> Context is everything.  
> Guidance is proactive, execution is on-demand.

---

## Navigation Structure

### Sidebar (Main Navigation)

**Always Visible Items** (Top)
1. Dashboard
2. Products
3. Messages
4. Orders
5. Customers

**Divider**

**Business Management** (Middle)
6. Wallet
7. Settings

**Divider**

**User Account** (Bottom)
8. Profile

**AI Assistant Toggle** (Floating)
- Always accessible via floating button OR sidebar icon

---

### Top Bar (Global Actions)

**Left Side**
- Business logo (if configured)
- Business name

**Right Side**
- Language toggle (🇲🇳 / 🇺🇸)
- View Store (preview icon)
- User avatar (dropdown)

**User Avatar Dropdown**
- My Profile
- Divider
- Log out

---

## Critical Modals & Overlays

### Non-Blocking Modals (Can appear over any view)

1. **Product Creation Wizard**
   - AI-assisted or Manual
   - Overlay (does not change route)
   
2. **Payment Setup Modal**
   - Payment method configuration
   - Appears from Dashboard hero action or Settings
   
3. **Delivery Setup Modal**
   - Delivery method configuration
   - Appears from Dashboard hero action or Settings

4. **Bank Settings Modal**
   - Bank account configuration for payouts
   - Appears from Settings → Payment Methods OR Wallet → Payout

---

## State-Driven Visibility Rules

| State Flag | Affects | Visibility Rule |
|------------|---------|-----------------|
| `PAYMENT_DISABLED` | Dashboard, Settings | Hero action visible, Settings shows "Not Enabled" |
| `DELIVERY_NOT_CONFIGURED` | Dashboard, Settings, Orders | Hero action visible, Delivery View limited |
| `NO_PRODUCTS` | Dashboard, Products, Messages, Orders | Locked stats, AI prompts to add products |
| `AI_ENERGY_LOW` | All views (AI Panel) | Warning in AI panel footer, prompt to purchase tokens |
| `PAYOUT_BLOCKED` | Wallet | Payout section shows DAN verification requirement |

---

## Edge Cases & Special States

### No Business Created
- Show onboarding flow (referral gate)
- No access to main app

### Business Created, Not Ready
- Dashboard shows Gamified Roadmap
- All sections accessible but with limited data
- AI guides setup

### Business Ready, Active
- Dashboard shows Smart Command Center
- Full functionality unlocked
- AI focuses on growth and optimization

### No Products + Payment Disabled
- AI strongly encourages product addition
- Payment setup available but not blocking

### Products Exist, Payment Disabled
- AI reminds to enable payments
- Orders can be created but cannot be paid online

### DAN Not Verified
- Wallet shows verification prompt
- Payout section blocked
- Other app functionality unchanged

### Low AI Energy
- AI panel shows warning
- Non-critical AI features may be limited
- Critical features (order notifications) still work

### Token Exhausted
- AI panel shows purchase prompt
- Manual operations still available
- AI automations paused until tokens added

---

## Summary: Information Architecture Hierarchy

```
Storex App
│
├── Onboarding (Pre-App)
│   ├── User Auth (Sign Up / Log In)
│   └── Business Creation (Referral-Gated)
│       ├── Referral Check
│       ├── Access Request (if no code)
│       └── Business Setup (if code valid)
│
├── Main Application (Post-Onboarding)
│   │
│   ├── Dashboard (State-Driven)
│   │   ├── Onboarding Roadmap (if not ready)
│   │   └── Command Center (if ready)
│   │
│   ├── Products
│   │   ├── Product List
│   │   ├── Product Detail
│   │   └── Product Creation Wizard (Modal)
│   │
│   ├── Messages
│   │   ├── Conversation List
│   │   └── Conversation Detail
│   │       ├── Profile View
│   │       ├── Draft Order View
│   │       └── Active Order View
│   │
│   ├── Orders
│   │   ├── Order List
│   │   ├── Order Detail
│   │   └── Delivery View (Map / List)
│   │
│   ├── Customers
│   │   ├── Customer List
│   │   └── Customer Detail
│   │
│   ├── Wallet (Business Finance)
│   │   ├── Overview
│   │   ├── Payments
│   │   ├── BNPL
│   │   └── Payout (DAN-Gated)
│   │
│   ├── Settings (Business Config)
│   │   ├── Business Info
│   │   ├── Accepted Payment Methods
│   │   ├── Subscription Plan
│   │   ├── Billing & AI Energy
│   │   ├── Delivery Settings
│   │   ├── Store Notifications
│   │   ├── Team & Access (Coming Soon)
│   │   └── AI Preferences
│   │
│   └── Profile (User Account)
│       ├── Basic Information
│       ├── Security & Auth Management
│       ├── Identity Verification (DAN)
│       ├── Language & Preferences
│       ├── Referral Program
│       └── Account Management
│
└── AI Assistant Panel (Global)
    ├── Context-Aware Suggestions
    ├── Quick Actions
    ├── Conversation Interface
    └── Task Progress
```

---

**Final Principle**
> Every screen serves selling.  
> Setup is guided, never blocking.  
> AI is always present, never intrusive.  
> Trust is built through transparency.

---

**Document Version**: 2.0  
**Last Updated**: 2026-01-19  
**Status**: Production-Ready IA Map