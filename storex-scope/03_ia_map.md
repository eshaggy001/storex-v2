{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # Storex \'96 Information Architecture (AI-first)\
\
## Design Principles\
- Selling comes first\
- Remove online selling friction\
- No forced setup or long wizards\
- AI guides actions, not forms\
- Growth is built into onboarding (referral-based)\
\
---\
\
## 1. Onboarding (Full Screen, Minimal & Controlled)\
\
### Purpose\
- Control access via referral campaign\
- Identify user and business context\
- Let users enter the system with minimal friction\
\
---\
\
### Step 1: User Onboarding (Access)\
\
**Goal**\
- Identify the user\
- Allow fast entry into Storex\
\
**Screens**\
- Sign up (email / phone)\
- Log in\
- Forgot password\
\
**Rules**\
- No business setup at this stage\
- No referral code required\
- No configuration or selling steps\
\
---\
\
### Step 2: Business Onboarding (Referral-Gated)\
\
#### Entry Rule\
- Only users with a **valid referral code** can create a business\
- Users without a referral code must submit an access request\
\
---\
\
#### 2A. Referral Code Check\
- Prompt: \'93Enter your referral code to create your business\'94\
\
**States**\
- \uc0\u9989  Valid \u8594  Proceed to Business Creation  \
- \uc0\u10060  Invalid / none \u8594  Request Access flow\
\
---\
\
#### 2B. Request Access (No Referral Code)\
\
**Purpose**\
- Capture demand\
- Control Storex campaign rollout\
\
**Inputs**\
- Business name  \
- Business category  \
- Contact info (email / phone)\
\
**Message**\
- \'93Your request has been received. We\'92ll notify you when access is available.\'94\
\
**Rules**\
- Business is NOT created\
- No access to main application\
\
---\
\
#### 2C. Business Creation (Referral Holder)\
\
##### Welcome & Intro\
- \'93You\'92re invited to sell online with Storex \'97\
  no website, no SaaS tools, no bank or BNPL contracts.\'94\
- Short explanation of Storex as an AI sales person\
\
##### Store Basics (Required)\
- Business / Store name\
- Business category\
\
##### Selling Channels (Optional \'96 Checkbox)\
- \uc0\u9744  Facebook  \
- \uc0\u9744  Instagram  \
- \uc0\u9744  Offline only  \
- \uc0\u9744  Not selling yet  \
\
**Rules**\
- No channel connection\
- No product creation\
- No payment or BNPL setup\
- User enters main application immediately\
\
---\
\
#### 2D. Referral Sharing (Post Creation)\
\
- One-time referral code granted\
- Can invite **one other business**\
- Code usable once only\
\
**Purpose**\
- Controlled, trust-based growth\
- Storex marketing campaign\
\
**UI**\
- Light prompt in Dashboard or AI Assistant\
- Never blocks selling\
\
---\
\
## 2. Main Application (Immediate Access)\
\
**Purpose**\
- Let merchants explore and operate Storex immediately\
- Complete critical setup through AI guidance\
\
---\
\
### AI-Guided Setup (Non-blocking)\
\
#### Payment Setup\
- Enable built-in payments\
- No bank or BNPL contracts\
- AI explains methods\
- Status: Not enabled / Enabled\
\
#### Delivery Setup\
- Delivery or pickup\
- Delivery fee (optional)\
- Delivery areas (optional)\
\
**Key Rule**\
- Payment & delivery required to complete a sale\
- NOT required to enter or explore the app\
- AI reminds only when relevant\
\
---\
\
### AI Assistant Responsibilities\
- Detect missing setup\
- Suggest next best actions\
- Never block the user\
\
---\
\
## 3. Main Application Structure\
\
---\
\
### Dashboard\
\
**Purpose**\
- Snapshot of business health\
- Focus on selling, not configuration\
\
**Includes**\
- Performance KPIs (Sales, Conversion, Response time)\
- Live Status (AI activity)\
- Recommended Actions\
- Activity Feeds (orders & messages)\
\
---\
\
### Products\
\
**Purpose**\
- Fast product management\
- Clean input for AI selling\
\
#### Product List\
- Search\
- Filter: Availability, Status\
\
#### Product Detail View\
- Edit name, price, variants, stock\
- Enable / disable\
- Delete with confirmation\
\
#### Product Wizard (Overlay)\
\
**AI-assisted (Photo-based)**\
- Upload product photos\
- AI generates title, category, attributes, variants, price range\
- Merchant reviews & edits\
\
**Manual**\
- Direct field input\
\
**Rules**\
- Overlay only\
- Minimal required fields\
- Product available for AI selling immediately\
\
---\
\
### Orders\
\
**Purpose**\
- Manage sales outcomes\
- Connect sales with fulfillment\
- Reduce manual follow-ups\
\
#### Core Capabilities\
- Create orders (AI / Manual)\
- Search & filter\
- Track status\
- Delivery View (AI Dispatcher)\
\
#### Create Order\
- AI-created after checkout / BNPL\
- Manual for offline / phone orders\
\
#### Order List\
**Search**\
- Order ID, Customer, Phone\
\
**Filters**\
- Status, Payment, Delivery, Date\
\
**Status Flow**\
- New \uc0\u8594  Paid \u8594  Preparing \u8594  Ready \u8594  Completed / Cancelled\
\
#### Order Detail View\
- Customer & items\
- Payment & BNPL\
- Delivery details\
\
**Actions**\
- Update status\
- Update delivery\
- Internal notes\
\
**AI**\
- Customer notifications\
- Delay / unpaid alerts\
- Next-action suggestions\
\
---\
\
#### Delivery View (AI Dispatcher)\
\
**Views**\
- Map View\
- List View\
\
##### Map View\
- Orders on map\
- Clustered by location\
- Courier load visibility\
\
##### List View (Detailed)\
\
Each row includes:\
- Order ID\
- Customer name\
- Delivery address\
- Order status\
- Payment status\
- Order Creation Type (AI / Manual / Website)\
- Source (Instagram / Facebook / Website / Offline)\
- Total Amount\
\
**Actions**\
- View detail\
- Update delivery\
- Assign courier\
\
**AI Intelligence**\
- Priority highlighting\
- Bottleneck detection\
- Cluster optimization\
\
---\
\
### Customers\
\
**Purpose**\
- Centralize customer data\
- Enable repeat sales\
- Power AI follow-ups\
\
#### Metrics\
- Total Customers\
- Returning Customers\
\
#### Customer List\
- Name\
- Contact\
- Last interaction\
- Total orders\
- Total spend\
- Status (New / Returning)\
\
#### Search & Filter\
- Name, phone, social\
- New vs returning\
- Spend range\
\
#### Add Customer\
- Manual add (offline / phone)\
- Auto-merge with AI data\
\
#### Customer Detail View\
**Profile**\
- Contact, socials, notes\
\
**History**\
- Orders (status, amount, source)\
- Conversations & intents\
\
**AI**\
- Tags, follow-ups, churn detection\
\
---\
\
### Automations\
- Pre-built\
- On / Off only\
\
---\
\
### Wallet\
\
Purpose:\
- Centralize all payment, BNPL, and payout activities\
- Give merchants clear visibility into money flow\
- Ensure payouts are secure and compliant\
- Let AI guide financial actions safely\
\
---\
\
### Wallet Overview\
- Available balance\
- Pending balance\
- Total earnings\
- Recent transactions\
\
Purpose:\
- Provide instant understanding of funds status\
- Help merchants decide when to withdraw (payout)\
\
---\
\
### Payments\
- Enabled payment methods\
- Payment status (Enabled / Not enabled)\
- Transaction history:\
  - Order ID\
  - Amount\
  - Payment method\
  - Status (Paid / Pending / Failed)\
\
Purpose:\
- Track incoming payments clearly\
- Reduce confusion around order payment status\
\
---\
\
### BNPL\
- BNPL availability status\
- BNPL order list\
- Approved / rejected summary\
- Outstanding BNPL amounts\
\
Purpose:\
- Monitor deferred payments and BNPL performance\
\
---\
\
### Merchant Payout\
\
Purpose:\
- Allow merchants to withdraw available balance securely\
- Ensure payouts comply with identity and banking requirements\
\
---\
\
#### Identity Verification (DAN) \'97 Required for Payout\
\
Requirement:\
- Merchant must complete **DAN (national ID) verification**\
  before requesting any payout.\
\
Verification Status:\
- Not verified\
- Pending verification\
- Verified\
\
Rules:\
- \uc0\u10060  Payout requests are blocked if DAN is not verified\
- \uc0\u9989  Payout becomes available only after successful verification\
- Verification is required **once per user**\
\
UI Behavior:\
- Show verification prompt inside Wallet\
- Clearly explain why verification is required\
- Do not block other app usage\
\
---\
\
#### Payout Setup (Bank Details)\
\
Required to withdraw funds:\
- Bank name\
- Account holder name\
- Bank account number\
- Optional: Branch / IBAN (if applicable)\
\
Rules:\
- Bank details can be added only after DAN verification\
- Bank details are stored securely\
- Changes may require re-verification\
\
---\
\
#### Payout Request\
\
- Withdraw available balance (partial or full)\
- Show payout limits or minimums (if any)\
- Confirm payout amount before submission\
\
Payout Status:\
- Requested\
- Processing\
- Completed\
- Failed\
\
---\
\
### AI Involvement\
- AI reminds merchants to complete DAN verification\
- AI explains why verification is required (simple, non-legal language)\
- AI notifies when payout becomes available\
- AI explains payout status and delays\
\
---\
\
Wallet Philosophy:\
> Money movement requires trust.  \
> Verification builds that trust \'97 AI makes it easy.\
\
\
### Settings\
\
Purpose:\
- Manage business-level configuration\
- Control identity, subscription, billing, and operational preferences\
- Keep setup separate from daily selling workflows\
\
---\
\
#### Business Info\
\
Purpose:\
- Define the business identity across Storex\
- Help AI understand where and how the business operates\
- Improve customer trust and fulfillment accuracy\
\
---\
\
##### Business Identity\
- Business name\
- Business category\
\
---\
\
##### Business Logo\
\
Options:\
- Upload logo manually\
- Import from Instagram profile\
- Import from Facebook profile picture\
\
Rules:\
- Logo is optional but recommended\
- Used in:\
  - AI messages\
  - Order confirmations\
  - Customer-facing views\
\
---\
\
##### Contact Information\
- Contact phone number (required)\
- Optional secondary contact\
\
Purpose:\
- Enable customer communication\
- Support delivery and order follow-ups\
\
---\
\
##### Location\
- City selection (required)\
\
Purpose:\
- Localize delivery, pickup, and AI recommendations\
\
---\
\
##### Physical Store Information (Optional)\
\
Shown only if the business has a physical location.\
\
Includes:\
- Physical store toggle (Yes / No)\
- Store address\
- Store name (if different from business name)\
- Working hours\
- Pickup availability (Yes / No)\
\
Rules:\
- Physical store details are optional\
- Can be updated anytime\
- Does not block selling\
\
---\
\
#### Subscription Plan\
\
Purpose:\
- Show which Storex plan the business is currently on\
- Communicate feature access and usage limits clearly\
\
Includes:\
- Current plan name (e.g. Starter / Pro / Business)\
- Plan status (Active / Trial / Expired)\
- Included features overview\
- Upgrade / change plan action\
\
Rules:\
- Plan changes do not interrupt active selling\
- AI may recommend plan upgrades when usage approaches limits\
\
---\
\
#### Billing & AI Energy\
\
Purpose:\
- Give transparency into AI usage and billing\
- Let merchants manage token-based AI consumption\
\
---\
\
##### AI Energy (Token Usage)\
\
Includes:\
- Available tokens\
- Used tokens (current cycle)\
- Token consumption by feature:\
  - AI conversations\
  - Product generation\
  - Automation actions\
- Usage reset date (if applicable)\
\
Purpose:\
- Help merchants understand how AI is being used\
- Prevent unexpected token exhaustion\
\
---\
\
##### Token Packages\
\
Includes:\
- Available add-on token packages\
- Token amount per package\
- Price per package\
- Purchase action\
\
Rules:\
- Token purchases apply immediately\
- Tokens do not affect subscription plan status\
\
---\
\
##### Billing History\
- Invoices and payment history\
- Token purchase records\
- Billing dates and amounts\
\
---\
\
#### Delivery Settings\
\
Purpose:\
- Configure how orders are fulfilled\
- Support delivery and pickup workflows\
\
Settings:\
- Delivery enabled / disabled\
- Pickup only option\
- Delivery fee (optional)\
- Delivery areas (optional)\
- Fulfillment preferences\
\
Rules:\
- Delivery settings affect Orders and Delivery View\
- Changes apply to new orders only\
- Delivery setup does not block selling\
\
---\
\
#### Store Notifications\
\
Purpose:\
- Control how and when merchants are notified about important events\
- Prevent notification overload while ensuring critical actions are not missed\
\
---\
\
##### Notification Channels\
- In-app notifications\
- Email notifications\
- SMS / Push notifications (if available)\
\
---\
\
##### Notification Types\
\
Merchants can enable or disable notifications for:\
\
- New orders\
- Order status changes\
- Payment received\
- BNPL approval / rejection\
- Delivery status updates\
- Payout status updates\
- Low AI Energy (token) warning\
- System or account-related alerts\
\
Rules:\
- Critical notifications (e.g. payout failure, payment issues)\
  cannot be fully disabled\
- Non-critical notifications are customizable\
\
---\
\
##### AI Notification Intelligence\
- AI prioritizes notifications based on urgency\
- AI reduces noise by batching low-priority updates\
- AI highlights actionable notifications first\
\
Purpose:\
- Ensure merchants see what matters most\
- Support faster reaction to sales and fulfillment events\
\
---\
\
#### Team & Access (Coming Soon)\
\
Status:\
- Coming Soon\
\
Planned Capabilities:\
- Invite team members\
- Assign roles and permissions\
- Control access to:\
  - Orders\
  - Products\
  - Wallet\
  - Settings\
\
Rules (Future):\
- Owner has full access\
- Role-based permissions\
- Activity logging per team member\
\
Purpose:\
- Prepare Storex for multi-user businesses\
- Enable safe collaboration as merchants grow\
\
---\
\
#### AI Preferences\
\
Purpose:\
- Control how proactive the AI is\
- Let merchants tune AI behavior without technical setup\
\
---\
\
##### AI Automations\
\
Description:\
- Pre-built, AI-managed workflows\
- Designed to increase sales and reduce manual work\
\
Controls:\
- Auto-reply to comments \uc0\u8594  ON / OFF\
- Follow up unpaid orders \uc0\u8594  ON / OFF\
- Re-engage returning customers \uc0\u8594  ON / OFF\
- Delivery status auto-updates \uc0\u8594  ON / OFF\
- Low AI Energy alerts \uc0\u8594  ON / OFF\
\
Rules:\
- No rule builders\
- No condition editors\
- AI handles the logic\
- Merchant only approves behavior\
\
---\
\
##### AI Tone & Intensity\
- Conservative / Balanced / Proactive\
- Notification sensitivity\
\
---\
\
Rule:\
- Changes apply immediately\
- AI explains impact of each toggle\
\
\
---\
\
### AI Involvement (Settings)\
\
\
- AI explains notification importance and urgency\
- AI suggests optimal notification settings based on business activity\
- AI adapts notification behavior as order volume grows\
\
---\
\
Settings Philosophy:\
> Control should be clear.  \
> AI usage should be transparent.  \
> Growth should never be confusing.\
\
---\
\
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

Items:
1) **My Profile**
2) Divider
3) **Log out**

Rules:
- Dropdown closes on outside click / Esc
- No blocking modals
- One-click logout

---

## Profile Screen Structure

### 1. Basic Information

Purpose:
- Identify the user
- Provide secure contact information
- Keep user identity separate from business data

---

**Avatar**
- Profile image
- Action: Upload / Change avatar

---

**Full Name**
- Editable inline
- Used for account identification and internal references

---

**Email Address**
- Read-only (locked)
- Helper text: “Email changes require a separate verification process”
- Used for login and security notifications

---

**Phone Number**
- Editable
- Input type: international phone format
- Validation: required format check
- Used for:
  - Account security
  - Important system alerts
  - Identity verification support (DAN)

Rules:
- Phone updates apply instantly
- No impact on business access or selling workflows
- Clear validation and error messaging

---


### 2. Language Strategy

**Language Selector**
- Toggle: **Монгол / English**

Rules:
- UI language switches immediately
- Stored at user-level
- Does not affect business data or AI logic

---

### 3. Identity Verification — DAN (National ID)

Purpose:
- Required ONLY for payout eligibility
- Does NOT block selling or app usage

**Status**
- Not verified
- Pending
- Verified

**Verified Information (masked)**
- National ID number (partially hidden)
- Verified date

Rules:
- Visible reminder only
- Action button appears only when payout is attempted
- Verification applies once per user

---

### 4. Security

#### Change Password
Fields:
- Current password
- New password
- Confirm password

Rules:
- Does not log out active session
- Success message: “Password updated”

#### Session Information (Read-only)
- Last login date
- Last login device / location (if available)

---

### 5. Personal Notifications (User-level)

Controls notifications that affect the user personally
(not business-wide rules)

**Notification Types**
- New orders (assigned / relevant)
- Payment success / failure
- System alerts (maintenance, updates)

Rules:
- These settings do NOT override business notifications
- Critical alerts cannot be fully disabled

---

### 6. Role & Access Status

Purpose:
- Clarify the user’s authority level
- Read-only informational block

**Role Badge**
- Label: `Role: Owner`
- Style:
  - Crown icon
  - Dark background
  - Highlighted yellow text

**Access Headline**
- “Full Administrative Access”

**Description**
- “As the primary owner, you have authority to manage all store members.”

**Design**
- Centered card
- Light gray background
- Dashed border

Rules:
- Informational only
- No permission editing in MVP

---

### 7. Account Actions

**Log Out**
- One-click
- Available in Profile and Avatar dropdown

**Delete Account**
- Destructive action
- Requires confirmation
- Warning:
  - Deletes user account permanently
  - Business data handling follows platform policy

Rules:
- Clear explanation
- Cannot be undone

---

## Out of Scope (MVP)

- Multi-business switcher
- Role editing
- Team permission management
- Audit logs
- Advanced session management
- 2FA / MFA (Post-MVP)

---

## Data (User-level)

`User`
- id
- full_name
- email
- phone
- avatar_url
- language
- password_hash
- status
- last_login_at
- created_at

---

## Non-blocking Rule

Profile access must never gate:
- Dashboard
- Products
- Orders
- Wallet
- Settings
- AI Assistant behavior

---

## One-line Definition

Profile is a user-level identity and preference hub,
designed to stay invisible to selling,
but critical for trust and security.

---

## 4. Global UI\
\
### Right AI Assistant Panel (Core Interaction Layer)\
\
The Right AI Assistant Panel is the core interaction surface\
between the merchant and Storex\'92s AI Sales Person.\
\
It is not a chat widget.\
It is a contextual sales cockpit that operates across the entire application.\
\
---\
\
#### Purpose\
- Enable real-time collaboration between merchant and AI\
- Surface AI-driven recommendations at the moment they matter\
- Allow merchants to act without navigating away from their current workflow\
- Reduce reliance on forms, wizards, and manual setup\
\
---\
\
#### Core Responsibilities\
\
The panel operates as a continuous loop:\
\
Observe \uc0\u8594  Recommend \u8594  Act \u8594  Learn\
\
---\
\
#### 1. Context Awareness\
\
The AI Assistant Panel automatically understands context based on:\
- Current screen (Dashboard, Products, Orders, Wallet, Customers)\
- Current merchant state (setup complete / missing / blocked)\
- Current customer or order focus (if applicable)\
\
Examples:\
- On Products page \uc0\u8594  product insights and quick edits\
- On Orders page \uc0\u8594  status updates and follow-up suggestions\
- On Wallet page \uc0\u8594  payout readiness and verification reminders\
- On Customers page \uc0\u8594  re-engagement and upsell suggestions\
\
Rule:\
- Context is inferred automatically\
- Merchant never needs to \'93switch modes\'94\
\
---\
\
#### 2. Recommendation Layer (Merchant-facing)\
\
The AI proactively suggests next best actions, such as:\
- Promote a specific product\
- Follow up with a high-intent customer\
- Enable or disable an automation\
- Complete missing setup (payments, delivery, payout verification)\
- Purchase additional AI Energy (tokens)\
- Upgrade subscription plan when justified\
\
Rules:\
- Recommendations are always explainable\
- AI provides a clear \'93why\'94 for each suggestion\
- Recommendations are non-blocking and dismissible\
\
---\
\
#### 3. Action Layer (Lightweight Control)\
\
The panel allows merchants to execute contextual actions instantly:\
\
Product Actions:\
- Insert product cards into AI conversations\
- Add a new product via photo-based AI Product Wizard\
- Trigger quick product edits when data is missing\
\
Order Actions:\
- Update order status\
- Add internal notes\
- Trigger customer notifications\
\
Automation Actions:\
- Turn AI automations ON / OFF\
- Confirm AI-proposed actions before execution\
\
Wallet Actions:\
- Navigate to payout setup\
- Start DAN verification\
- Review payout availability\
\
Rule:\
- Actions in the panel are lightweight and contextual\
- Full configuration remains in dedicated sections (Products, Orders, Settings)\
\
---\
\
#### 4. Conversation Oversight\
\
The panel provides visibility into AI-customer conversations:\
- Live AI replies to comments and messages\
- Conversation intent detection (interest, hesitation, ready-to-buy)\
- Merchant can:\
  - Edit AI messages before sending\
  - Approve or stop AI actions\
\
Rule:\
- Merchant remains in control\
- AI never acts invisibly in high-impact moments\
\
---\
\
#### 5. Product Intelligence Integration\
\
The AI Assistant Panel can surface products dynamically:\
- Display product cards during conversations\
- Fetch real-time price, stock, and variant data\
- Detect incomplete product information and suggest fixes\
\
Example:\
- \'93This product has no photo. Fix now?\'94\
\
Rule:\
- Product intelligence is contextual\
- The panel never replaces the Products page\
\
---\
\
#### 6. Setup & Readiness Guidance (Non-blocking)\
\
The panel continuously checks business readiness:\
- Payments enabled?\
- Delivery configured?\
- Wallet payout ready?\
- DAN verification completed?\
- AI Energy balance sufficient?\
\
Behavior:\
- AI reminds only when the action becomes relevant\
- No blocking modals or forced steps\
- Guidance is framed as sales enablement, not compliance\
\
---\
\
#### 7. Relationship with AI Preferences & Automations\
\
The panel respects merchant-defined AI Preferences:\
- Automation toggles (ON / OFF)\
- AI tone and proactiveness level\
\
Rules:\
- The panel never exceeds granted permissions\
- AI behavior adapts instantly when preferences change\
\
---\
\
#### 8. UI Behavior\
\
- Persistent right-side panel\
- Collapsible to save screen space\
- Floating AI button opens the panel when closed\
- State persists across navigation\
\
---\
\
#### What the Panel Is NOT\
\
- Not an admin dashboard\
- Not a settings page\
- Not a rule builder\
- Not a passive chatbot\
\
---\
\
#### IA One-Line Definition\
\
The Right AI Assistant Panel is a persistent, contextual sales cockpit\
that helps merchants observe activity, receive AI-driven recommendations,\
and take immediate action\'97without breaking their workflow.\
\
\
---\
\
### Other Global Elements\
- Left Sidebar\
- Top Bar\
- Floating AI Button\
}