{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # 09 \'97 Acceptance Tests (MVP)\
\
Storex MVP-\uc0\u1080 \u1081 \u1085  **acceptance tests** \u1085 \u1100  core selling loop (Social chat \u8594  Order \u8594  Payment/BNPL \u8594  Fulfillment \u8594  Wallet/Payout) \u1073 \u1086 \u1083 \u1086 \u1085  **state-driven** UI/AI behavior-\u1091 \u1091 \u1076  \u1079 \u1257 \u1074  \u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1075 \u1072 \u1072 \u1075  \u1073 \u1072 \u1090 \u1072 \u1083 \u1085 \u1072 .\
\
> \uc0\u1060 \u1086 \u1088 \u1084 \u1072 \u1090 : **Given / When / Then** (+ **And**)  \
> Scope: MVP cutline-\uc0\u1076  \u1073 \u1072 \u1075 \u1090 \u1089 \u1072 \u1085  \u1093 \u1101 \u1089 \u1075 \u1199 \u1199 \u1076  (Onboarding/Referral, Main App, Products, Orders, Payments+BNPL, Wallet/Payout, Settings, AI Assistant Panel, Automations, Notifications).\
\
---\
\
## 0) Test Data & Common Assumptions\
\
### Shared Fixtures\
- `USER_A`: \uc0\u1096 \u1080 \u1085 \u1101  \u1093 \u1101 \u1088 \u1101 \u1075 \u1083 \u1101 \u1075 \u1095  (email/phone \u1073 \u1199 \u1088 \u1090 \u1075 \u1199 \u1199 \u1083 \u1101 \u1093  \u1073 \u1086 \u1083 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081 )\
- `USER_B`: \uc0\u1257 \u1084 \u1085 \u1257  \u1085 \u1100  \u1073 \u1199 \u1088 \u1090 \u1075 \u1101 \u1083 \u1090 \u1101 \u1081  \u1093 \u1101 \u1088 \u1101 \u1075 \u1083 \u1101 \u1075 \u1095  (login \u1093 \u1080 \u1081 \u1093  \u1073 \u1086 \u1083 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081 )\
- `REF_OK`: \uc0\u1093 \u1199 \u1095 \u1080 \u1085 \u1090 \u1101 \u1081  referral code (`UNUSED`)\
- `REF_USED`: \uc0\u1072 \u1096 \u1080 \u1075 \u1083 \u1072 \u1075 \u1076 \u1089 \u1072 \u1085  referral code (`USED`)\
- `BUSINESS_A`: `USER_A`-\uc0\u1080 \u1081 \u1085  \u1073 \u1080 \u1079 \u1085 \u1077 \u1089  (created via `REF_OK`, status `ACTIVE`)\
- `PRODUCT_1`: \uc0\u1080 \u1076 \u1101 \u1074 \u1093 \u1090 \u1101 \u1081  \u1073 \u1199 \u1090 \u1101 \u1101 \u1075 \u1076 \u1101 \u1093 \u1199 \u1199 \u1085  (photo + name + price + stock)\
- `PRODUCT_2`: incomplete \uc0\u1073 \u1199 \u1090 \u1101 \u1101 \u1075 \u1076 \u1101 \u1093 \u1199 \u1199 \u1085  (photo \u1073 \u1072 \u1081 \u1093 \u1075 \u1199 \u1081  \u1101 \u1089 \u1074 \u1101 \u1083  price \u1073 \u1072 \u1081 \u1093 \u1075 \u1199 \u1081 )\
- `ORDER_1`: `PRODUCT_1`-\uc0\u1086 \u1086 \u1088  \u1199 \u1199 \u1089 \u1089 \u1101 \u1085  \u1079 \u1072 \u1093 \u1080 \u1072 \u1083 \u1075 \u1072 \
\
### Global Rules (MVP)\
- App \uc0\u1085 \u1100  **state-driven**: screen/permissions/AI behavior \u1085 \u1100  state-\u1101 \u1101 \u1089  \u1093 \u1072 \u1084 \u1072 \u1072 \u1088 \u1085 \u1072 .\
- **No blocking setup**: Payment/Delivery/DAN verification \uc0\u1085 \u1100  app access-\u1080 \u1081 \u1075  \u1093 \u1072 \u1072 \u1093 \u1075 \u1199 \u1081 , \u1079 \u1257 \u1074 \u1093 \u1257 \u1085  \u1090 \u1091 \u1093 \u1072 \u1081 \u1085  action (sale completion, payout)-\u1080 \u1081 \u1075  block \u1093 \u1080 \u1081 \u1085 \u1101 .\
- Automations \uc0\u1085 \u1100  **pre-built** \u1073 \u1257 \u1075 \u1257 \u1257 \u1076  \u1079 \u1257 \u1074 \u1093 \u1257 \u1085  **ON/OFF**.\
- Merchant \uc0\u1085 \u1100  \u1257 \u1085 \u1076 \u1257 \u1088  \u1101 \u1088 \u1089 \u1076 \u1101 \u1083 \u1090 \u1101 \u1081  \u1199 \u1081 \u1083 \u1076 \u1101 \u1083  \u1076 \u1101 \u1101 \u1088  (payout, payment, status changes) **control**-\u1086 \u1086  \u1072 \u1083 \u1076 \u1072 \u1093 \u1075 \u1199 \u1081 .\
\
---\
\
## 1) Auth & Access (User Access State Machine)\
\
### AT-001 \'97 Sign up creates AUTHENTICATED user\
**Given** \uc0\u1093 \u1101 \u1088 \u1101 \u1075 \u1083 \u1101 \u1075 \u1095  `ANONYMOUS` \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** \uc0\u1079 \u1257 \u1074  email/phone + password-\u1086 \u1086 \u1088  Sign up \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** user `AUTHENTICATED` \uc0\u1073 \u1086 \u1083 \u1085 \u1086   \
**And** user profile (id, created_at) \uc0\u1199 \u1199 \u1089 \u1089 \u1101 \u1085  \u1073 \u1072 \u1081 \u1085 \u1072 \
\
### AT-002 \'97 Login transitions to AUTHENTICATED\
**Given** `USER_B` \uc0\u1073 \u1199 \u1088 \u1090 \u1075 \u1101 \u1083 \u1090 \u1101 \u1081  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** \uc0\u1079 \u1257 \u1074  credential-\u1086 \u1086 \u1088  Log in \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** user `AUTHENTICATED` \uc0\u1073 \u1086 \u1083 \u1085 \u1086   \
**And** last_login_at \uc0\u1096 \u1080 \u1085 \u1101 \u1095 \u1083 \u1101 \u1075 \u1076 \u1101 \u1085 \u1101 \
\
### AT-003 \'97 Login rejects invalid credentials\
**Given** `USER_B` \uc0\u1073 \u1199 \u1088 \u1090 \u1075 \u1101 \u1083 \u1090 \u1101 \u1081  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** \uc0\u1073 \u1091 \u1088 \u1091 \u1091  password \u1086 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072   \
**Then** Log in \uc0\u1072 \u1084 \u1078 \u1080 \u1083 \u1090 \u1075 \u1199 \u1081   \
**And** error message \uc0\u1085 \u1100  credential-\u1080 \u1081 \u1085  \u1072 \u1083 \u1100  \u1093 \u1101 \u1089 \u1101 \u1075  \u1073 \u1091 \u1088 \u1091 \u1091  \u1075 \u1101 \u1076 \u1075 \u1080 \u1081 \u1075  \u1085 \u1072 \u1088 \u1080 \u1081 \u1074 \u1095 \u1083 \u1072 \u1085  \u1079 \u1072 \u1076 \u1083 \u1072 \u1093 \u1075 \u1199 \u1081 \
\
### AT-004 \'97 Forgot password enters PASSWORD_RESET state\
**Given** user `ANONYMOUS` \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Forgot password \uc0\u1101 \u1093 \u1083 \u1199 \u1199 \u1083 \u1085 \u1101   \
**Then** system `PASSWORD_RESET` \uc0\u1091 \u1088 \u1089 \u1075 \u1072 \u1083  \u1088 \u1091 \u1091  \u1086 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072 \
\
### AT-005 \'97 Successful reset returns to AUTHENTICATED\
**Given** user password reset \uc0\u1093 \u1080 \u1081 \u1093  \u1101 \u1088 \u1093 \u1090 \u1101 \u1081  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** \uc0\u1096 \u1080 \u1085 \u1101  password-\u1086 \u1086  \u1072 \u1084 \u1078 \u1080 \u1083 \u1090 \u1090 \u1072 \u1081  \u1073 \u1072 \u1090 \u1072 \u1083 \u1075 \u1072 \u1072 \u1078 \u1091 \u1091 \u1083 \u1085 \u1072   \
**Then** user `AUTHENTICATED` \uc0\u1073 \u1086 \u1083 \u1085 \u1086 \
\
### AT-006 \'97 No business \uc0\u8594  Main App \u1085 \u1101 \u1074 \u1090 \u1088 \u1101 \u1093 \u1075 \u1199 \u1081 \
**Given** user `AUTHENTICATED` \uc0\u1073 \u1257 \u1075 \u1257 \u1257 \u1076  business \u1073 \u1072 \u1081 \u1093 \u1075 \u1199 \u1081  (`NO_BUSINESS`)  \
**When** user main app \uc0\u1088 \u1091 \u1091  \u1086 \u1088 \u1086 \u1093  \u1086 \u1088 \u1086 \u1083 \u1076 \u1083 \u1086 \u1075 \u1086  \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** Business onboarding entry screen \uc0\u1088 \u1199 \u1199  \u1095 \u1080 \u1075 \u1083 \u1199 \u1199 \u1083 \u1085 \u1101   \
**And** main app screens (Dashboard/Products/Orders/Wallet/Settings) \uc0\u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1093 \u1075 \u1199 \u1081 \
\
---\
\
## 2) Business Onboarding (Referral-gated)\
\
### AT-010 \'97 Business creation requires referral\
**Given** `USER_A` \uc0\u1085 \u1100  `AUTHENTICATED` \u1073 \u1257 \u1075 \u1257 \u1257 \u1076  `NO_BUSINESS`  \
**When** \'93Create business\'94 \uc0\u1089 \u1086 \u1085 \u1075 \u1086 \u1085 \u1086   \
**Then** Referral code input (`REFERRAL_REQUIRED`) state-\uc0\u1076  \u1086 \u1088 \u1085 \u1086 \
\
### AT-011 \'97 Valid referral proceeds to Business Creation\
**Given** user `REFERRAL_REQUIRED` screen \uc0\u1076 \u1101 \u1101 \u1088   \
**When** \uc0\u1093 \u1199 \u1095 \u1080 \u1085 \u1090 \u1101 \u1081  `REF_OK` \u1086 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072   \
**Then** business creation form \uc0\u1085 \u1101 \u1101 \u1075 \u1076 \u1101 \u1085 \u1101   \
**And** referral code \uc0\u1085 \u1100  business \u1076 \u1101 \u1101 \u1088  `referral_code_used`-\u1076  \u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-012 \'97 Used referral is rejected\
**Given** user `REFERRAL_REQUIRED` screen \uc0\u1076 \u1101 \u1101 \u1088   \
**When** `REF_USED` \uc0\u1086 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072   \
**Then** proceed \uc0\u1093 \u1080 \u1081 \u1093 \u1075 \u1199 \u1081   \
**And** \'93code already used\'94 \uc0\u1090 \u1257 \u1088 \u1083 \u1080 \u1081 \u1085  \u1086 \u1081 \u1083 \u1075 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081  \u1072 \u1083 \u1076 \u1072 \u1072  \u1093 \u1072 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072 \
\
### AT-013 \'97 No/invalid referral routes to Access Request\
**Given** user `REFERRAL_REQUIRED` screen \uc0\u1076 \u1101 \u1101 \u1088   \
**When** referral \uc0\u1086 \u1088 \u1091 \u1091 \u1083 \u1072 \u1093 \u1075 \u1199 \u1081  \u1101 \u1089 \u1074 \u1101 \u1083  invalid code \u1086 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072   \
**Then** \'93Request Access\'94 flow \uc0\u1088 \u1091 \u1091  \u1086 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072   \
**And** business \uc0\u1199 \u1199 \u1089 \u1101 \u1093 \u1075 \u1199 \u1081 \
\
### AT-014 \'97 Access request creates AccessRequest (no business)\
**Given** user access request form \uc0\u1076 \u1101 \u1101 \u1088   \
**When** business_name, category, contact info \uc0\u1073 \u1257 \u1075 \u1083 \u1257 \u1078  submit \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** `AccessRequest.status = REQUESTED` \uc0\u1199 \u1199 \u1089 \u1085 \u1101   \
**And** user business \uc0\u1199 \u1199 \u1089 \u1075 \u1101 \u1101 \u1075 \u1199 \u1081  \u1093 \u1101 \u1074 \u1101 \u1101 \u1088  (`NO_BUSINESS`)\
\
### AT-015 \'97 Access requested users cannot access main app\
**Given** `AccessRequest.status = REQUESTED` \uc0\u1073 \u1257 \u1075 \u1257 \u1257 \u1076  user business \u1073 \u1072 \u1081 \u1093 \u1075 \u1199 \u1081   \
**When** user main app \uc0\u1088 \u1091 \u1091  \u1086 \u1088 \u1086 \u1093  \u1086 \u1088 \u1086 \u1083 \u1076 \u1083 \u1086 \u1075 \u1086  \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** \'93request received\'94 / \'93await approval\'94 \uc0\u1076 \u1101 \u1083 \u1075 \u1101 \u1094  \u1093 \u1072 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072 \
\
### AT-016 \'97 Business becomes ACTIVE after name+category saved\
**Given** user business creation form \uc0\u1076 \u1101 \u1101 \u1088  (referral ok)  \
**When** Business name + category save \uc0\u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** `Business.status = ACTIVE`  \
**And** user main app \uc0\u1088 \u1091 \u1091  \u1086 \u1088 \u1085 \u1086 \
\
### AT-017 \'97 Referral sharing prompt is non-blocking\
**Given** business `ACTIVE` \uc0\u1073 \u1086 \u1083 \u1089 \u1086 \u1085   \
**When** Dashboard \uc0\u1101 \u1089 \u1074 \u1101 \u1083  AI panel \u1076 \u1101 \u1101 \u1088  referral prompt \u1075 \u1072 \u1088 \u1085 \u1072   \
**Then** user dismiss \uc0\u1093 \u1080 \u1081 \u1078  \u1073 \u1086 \u1083 \u1085 \u1086   \
**And** dismiss \uc0\u1085 \u1100  selling workflow-\u1075  \u1090 \u1072 \u1089 \u1083 \u1072 \u1093 \u1075 \u1199 \u1081 \
\
---\
\
## 3) Main App Navigation & State-driven Visibility\
\
### AT-020 \'97 Sidebar shows core modules for ACTIVE business\
**Given** user `AUTHENTICATED` \uc0\u1073 \u1072  `Business.ACTIVE`  \
**When** app \uc0\u1072 \u1095 \u1072 \u1072 \u1083 \u1085 \u1072   \
**Then** Sidebar-\uc0\u1076  Dashboard, Products, Orders, Customers, Wallet, Settings \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-021 \'97 Right AI panel exists on all main screens\
**Given** user main app-\uc0\u1076  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** user Dashboard \uc0\u8594  Products \u8594  Orders \u1075 \u1101 \u1093  \u1084 \u1101 \u1090  \u1096 \u1080 \u1083 \u1078 \u1080 \u1085 \u1101   \
**Then** Right AI Assistant Panel \uc0\u1090 \u1086 \u1075 \u1090 \u1084 \u1086 \u1083  \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072  (collapse \u1073 \u1086 \u1083 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081 )\
\
### AT-022 \'97 Collapsed AI panel opens via floating button\
**Given** AI panel collapsed  \
**When** Floating AI button \uc0\u1076 \u1072 \u1088 \u1085 \u1072   \
**Then** AI panel open \uc0\u1073 \u1086 \u1083 \u1085 \u1086   \
**And** panel state navigation \uc0\u1093 \u1086 \u1086 \u1088 \u1086 \u1085 \u1076  \u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
---\
\
## 4) AI Assistant Panel (Context, Recommendations, Actions)\
\
### AT-030 \'97 Context awareness switches automatically\
**Given** user Products screen \uc0\u1076 \u1101 \u1101 \u1088  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** user Orders screen \uc0\u1088 \u1199 \u1199  \u1096 \u1080 \u1083 \u1078 \u1080 \u1085 \u1101   \
**Then** AI panel-\uc0\u1080 \u1081 \u1085  context header/quick actions \u1085 \u1100  Orders context \u1088 \u1091 \u1091  \u1089 \u1086 \u1083 \u1080 \u1075 \u1076 \u1086 \u1085 \u1086 \
\
### AT-031 \'97 Recommendations are explainable and dismissible\
**Given** AI \uc0\u1079 \u1257 \u1074 \u1083 \u1257 \u1084 \u1078  \u1075 \u1072 \u1088 \u1075 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** user \'93Why?\'94 \uc0\u1101 \u1089 \u1074 \u1101 \u1083  info \u1090 \u1086 \u1074 \u1095  \u1076 \u1072 \u1088 \u1085 \u1072   \
**Then** AI \uc0\u1085 \u1100  \u1086 \u1081 \u1083 \u1075 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081  \u1090 \u1072 \u1081 \u1083 \u1073 \u1072 \u1088  \u1257 \u1075 \u1085 \u1257   \
**And** user \uc0\u1079 \u1257 \u1074 \u1083 \u1257 \u1084 \u1078 \u1080 \u1081 \u1075  dismiss \u1093 \u1080 \u1081 \u1078  \u1073 \u1086 \u1083 \u1085 \u1086 \
\
### AT-032 \'97 Non-blocking readiness reminders\
**Given** payments disabled (`PAYMENT_DISABLED`)  \
**When** user Orders screen \uc0\u1076 \u1101 \u1101 \u1088  \'93complete sale\'94 \u1090 \u1257 \u1088 \u1083 \u1080 \u1081 \u1085  \u1072 \u1083 \u1093 \u1072 \u1084  \u1093 \u1080 \u1081 \u1093  \u1082 \u1086 \u1085 \u1090 \u1077 \u1082 \u1089 \u1090  \u1199 \u1199 \u1089 \u1085 \u1101   \
**Then** AI panel \uc0\u1085 \u1100  enable payments-\u1075  \u1089 \u1072 \u1085 \u1072 \u1083  \u1073 \u1086 \u1083 \u1075 \u1086 \u1085 \u1086   \
**And** app usage-\uc0\u1075  \u1073 \u1083 \u1086 \u1082 \u1083 \u1086 \u1093  modal \u1075 \u1072 \u1088 \u1075 \u1072 \u1093 \u1075 \u1199 \u1081 \
\
### AT-033 \'97 High-impact actions require merchant control\
**Given** AI \uc0\u1085 \u1100  customer message \u1080 \u1083 \u1075 \u1101 \u1101 \u1093  \u1075 \u1101 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072  (high impact scenario)  \
**When** merchant approve toggle \uc0\u1101 \u1089 \u1074 \u1101 \u1083  confirm \u1096 \u1072 \u1072 \u1088 \u1076 \u1089 \u1072 \u1085  \u1090 \u1257 \u1083 \u1257 \u1074 \u1090 \u1101 \u1081   \
**Then** AI \uc0\u1085 \u1100  merchant-\u1080 \u1081 \u1085  \u1079 \u1257 \u1074 \u1096 \u1257 \u1257 \u1088 \u1257 \u1083 \u1075 \u1199 \u1081 \u1075 \u1101 \u1101 \u1088  \u1080 \u1083 \u1075 \u1101 \u1101 \u1093 \u1075 \u1199 \u1081 \
\
---\
\
## 5) Products\
\
### AT-040 \'97 Product list loads for business\
**Given** `BUSINESS_A` \uc0\u1076 \u1101 \u1101 \u1088  2+ \u1073 \u1199 \u1090 \u1101 \u1101 \u1075 \u1076 \u1101 \u1093 \u1199 \u1199 \u1085  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Products page \uc0\u1085 \u1101 \u1101 \u1085 \u1101   \
**Then** Product list \uc0\u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072   \
**And** status (ACTIVE/DISABLED) \uc0\u1090 \u1086 \u1076 \u1086 \u1088 \u1093 \u1086 \u1081  \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-041 \'97 Product search filters by name\
**Given** product list \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**When** search query \uc0\u1086 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072   \
**Then** list \uc0\u1085 \u1100  query-\u1076  \u1090 \u1072 \u1072 \u1088 \u1072 \u1093  \u1073 \u1199 \u1090 \u1101 \u1101 \u1075 \u1076 \u1101 \u1093 \u1199 \u1199 \u1085 \u1199 \u1199 \u1076 \u1101 \u1101 \u1088  \u1096 \u1199 \u1199 \u1075 \u1076 \u1101 \u1085 \u1101 \
\
### AT-042 \'97 Product filter by status works\
**Given** ACTIVE \uc0\u1073 \u1086 \u1083 \u1086 \u1085  DISABLED \u1073 \u1199 \u1090 \u1101 \u1101 \u1075 \u1076 \u1101 \u1093 \u1199 \u1199 \u1085 \u1199 \u1199 \u1076  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** filter = DISABLED \uc0\u1089 \u1086 \u1085 \u1075 \u1086 \u1085 \u1086   \
**Then** \uc0\u1079 \u1257 \u1074 \u1093 \u1257 \u1085  DISABLED \u1073 \u1199 \u1090 \u1101 \u1101 \u1075 \u1076 \u1101 \u1093 \u1199 \u1199 \u1085 \u1199 \u1199 \u1076  \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-043 \'97 Product detail shows editable fields\
**Given** `PRODUCT_1` \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Product row \uc0\u1076 \u1101 \u1101 \u1088  \u1076 \u1072 \u1088 \u1078  detail \u1085 \u1101 \u1101 \u1085 \u1101   \
**Then** name, price, variants, stock, status, photos \uc0\u1090 \u1072 \u1083 \u1073 \u1072 \u1088 \u1091 \u1091 \u1076  \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-044 \'97 Edit product persists changes\
**Given** `PRODUCT_1` detail \uc0\u1076 \u1101 \u1101 \u1088   \
**When** price \uc0\u1257 \u1257 \u1088 \u1095 \u1083 \u1257 \u1257 \u1076  Save \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** product \uc0\u1096 \u1080 \u1085 \u1101  price-\u1090 \u1072 \u1081  \u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072   \
**And** list \uc0\u1076 \u1101 \u1101 \u1088  \u1096 \u1080 \u1085 \u1101 \u1095 \u1083 \u1101 \u1075 \u1076 \u1101 \u1078  \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-045 \'97 Disable/Enable toggles product sellability\
**Given** `PRODUCT_1` ACTIVE  \
**When** Disable \uc0\u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** status DISABLED \uc0\u1073 \u1086 \u1083 \u1085 \u1086   \
**And** AI product recommendation \uc0\u1093 \u1080 \u1081 \u1093  \u1199 \u1077 \u1076  DISABLED \u1073 \u1199 \u1090 \u1101 \u1101 \u1075 \u1076 \u1101 \u1093 \u1199 \u1199 \u1085 \u1080 \u1081 \u1075  \u1089 \u1072 \u1085 \u1072 \u1083  \u1073 \u1086 \u1083 \u1075 \u1086 \u1093 \u1075 \u1199 \u1081 \
\
### AT-046 \'97 Delete requires confirmation\
**Given** product detail \uc0\u1076 \u1101 \u1101 \u1088  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Delete \uc0\u1076 \u1072 \u1088 \u1085 \u1072   \
**Then** confirmation dialog \uc0\u1075 \u1072 \u1088 \u1085 \u1072   \
**And** confirm \uc0\u1093 \u1080 \u1081 \u1089 \u1101 \u1085  \u1199 \u1077 \u1076  \u1083  \u1091 \u1089 \u1090 \u1075 \u1072 \u1085 \u1072 \
\
### AT-047 \'97 AI photo-based product creation produces draft\
**Given** Product wizard (AI-assisted) \uc0\u1085 \u1101 \u1101 \u1083 \u1090 \u1090 \u1101 \u1081   \
**When** user product photo upload \uc0\u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** AI \uc0\u1085 \u1100  title/category/attributes/variants/price suggestion \u1075 \u1072 \u1088 \u1075 \u1072 \u1085 \u1072   \
**And** merchant review + edit \uc0\u1093 \u1080 \u1081 \u1078  Save \u1093 \u1080 \u1081 \u1089 \u1085 \u1101 \u1101 \u1088  product \u1199 \u1199 \u1089 \u1085 \u1101 \
\
### AT-048 \'97 Manual product creation requires minimal fields\
**Given** Product wizard (Manual) \uc0\u1085 \u1101 \u1101 \u1083 \u1090 \u1090 \u1101 \u1081   \
**When** user name + price \uc0\u1086 \u1088 \u1091 \u1091 \u1083 \u1072 \u1072 \u1076  Save \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** product \uc0\u1199 \u1199 \u1089 \u1085 \u1101   \
**And** \uc0\u1073 \u1091 \u1089 \u1072 \u1076  optional \u1090 \u1072 \u1083 \u1073 \u1072 \u1088 \u1091 \u1091 \u1076  \u1093 \u1086 \u1086 \u1089 \u1086 \u1085  \u1073 \u1072 \u1081 \u1078  \u1073 \u1086 \u1083 \u1085 \u1086 \
\
---\
\
## 6) Orders\
\
### AT-060 \'97 Order list loads and shows key columns\
**Given** business \uc0\u1076 \u1101 \u1101 \u1088  \u1079 \u1072 \u1093 \u1080 \u1072 \u1083 \u1075 \u1091 \u1091 \u1076  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Orders page \uc0\u1085 \u1101 \u1101 \u1085 \u1101   \
**Then** list \uc0\u1085 \u1100  Order ID, Customer, Total, Payment status, Order status, Delivery status, Source-\u1099 \u1075  \u1093 \u1072 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072 \
\
### AT-061 \'97 Order search works (ID / customer / phone)\
**Given** \uc0\u1079 \u1072 \u1093 \u1080 \u1072 \u1083 \u1075 \u1091 \u1091 \u1076 \u1099 \u1085  \u1078 \u1072 \u1075 \u1089 \u1072 \u1072 \u1083 \u1090   \
**When** search input-\uc0\u1076  Order ID \u1101 \u1089 \u1074 \u1101 \u1083  phone \u1086 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072   \
**Then** \uc0\u1090 \u1086 \u1093 \u1080 \u1088 \u1086 \u1093  \u1079 \u1072 \u1093 \u1080 \u1072 \u1083 \u1075 \u1091 \u1091 \u1076  \u1096 \u1199 \u1199 \u1075 \u1076 \u1101 \u1085 \u1101 \
\
### AT-062 \'97 Order filters work (status/payment/delivery/date)\
**Given** \uc0\u1086 \u1083 \u1086 \u1085  \u1090 \u1257 \u1088 \u1083 \u1080 \u1081 \u1085  \u1090 \u1257 \u1083 \u1257 \u1074 \u1090 \u1101 \u1081  \u1079 \u1072 \u1093 \u1080 \u1072 \u1083 \u1075 \u1091 \u1091 \u1076  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** payment_status = UNPAID filter \uc0\u1089 \u1086 \u1085 \u1075 \u1086 \u1085 \u1086   \
**Then** \uc0\u1079 \u1257 \u1074 \u1093 \u1257 \u1085  UNPAID \u1079 \u1072 \u1093 \u1080 \u1072 \u1083 \u1075 \u1091 \u1091 \u1076  \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-063 \'97 Order detail shows full information\
**Given** `ORDER_1` \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**When** order detail \uc0\u1085 \u1101 \u1101 \u1085 \u1101   \
**Then** customer, items, totals, payment info, BNPL info (if any), delivery details, internal notes \uc0\u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-064 \'97 Update order status follows allowed transitions\
**Given** `ORDER_1.order_status = NEW`  \
**When** merchant PREPARING \uc0\u1073 \u1086 \u1083 \u1075 \u1086 \u1085 \u1086   \
**Then** order_status PREPARING \uc0\u1073 \u1086 \u1083 \u1085 \u1086 \
\
### AT-065 \'97 Invalid order status transition is prevented\
**Given** `ORDER_1.order_status = NEW`  \
**When** merchant COMPLETED \uc0\u1088 \u1091 \u1091  \u1096 \u1091 \u1091 \u1076  \u1199 \u1089 \u1088 \u1101 \u1093  \u1086 \u1088 \u1086 \u1083 \u1076 \u1083 \u1086 \u1075 \u1086  \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** system \uc0\u1085 \u1100  \u1079 \u1257 \u1074 \u1096 \u1257 \u1257 \u1088 \u1257 \u1093 \u1075 \u1199 \u1081   \
**And** \uc0\u1086 \u1081 \u1083 \u1075 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081  validation message \u1093 \u1072 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072 \
\
### AT-066 \'97 Manual order creation supports offline\
**Given** Orders page \uc0\u1076 \u1101 \u1101 \u1088  manual create  \
**When** merchant customer + items + total \uc0\u1086 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072   \
**Then** order `created_by = MANUAL` \uc0\u1199 \u1199 \u1089 \u1085 \u1101   \
**And** source = OFFLINE \uc0\u1089 \u1086 \u1085 \u1075 \u1086 \u1078  \u1073 \u1086 \u1083 \u1085 \u1086 \
\
### AT-067 \'97 AI-created order marks created_by = AI\
**Given** AI checkout initiation \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1089 \u1072 \u1085   \
**When** AI order \uc0\u1199 \u1199 \u1089 \u1075 \u1101 \u1085 \u1101   \
**Then** `Order.created_by = AI` \uc0\u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
---\
\
## 7) Payment Setup (Non-blocking)\
\
### AT-080 \'97 Payments can be enabled from Settings/Wallet\
**Given** business `PAYMENT_DISABLED`  \
**When** Settings \uc0\u8594  Payment Setup (\u1101 \u1089 \u1074 \u1101 \u1083  Wallet \u8594  Payments) \u1086 \u1088 \u1078  Enable \u1093 \u1080 \u1081 \u1078  submit \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** readiness flag `PAYMENT_ENABLED` \uc0\u1073 \u1086 \u1083 \u1085 \u1086 \
\
### AT-081 \'97 Payment enable failure keeps disabled\
**Given** payments enable \uc0\u1093 \u1080 \u1081 \u1093  provider error \u1075 \u1072 \u1088 \u1089 \u1072 \u1085   \
**When** Enable submit \uc0\u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** `PAYMENT_DISABLED` \uc0\u1093 \u1101 \u1074 \u1101 \u1101 \u1088   \
**And** retry \uc0\u1073 \u1086 \u1083 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081  error UI \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-082 \'97 Payments disabled does not block app\
**Given** business `PAYMENT_DISABLED`  \
**When** user Dashboard/Products/Orders/Customers \uc0\u1199 \u1079 \u1085 \u1101   \
**Then** \uc0\u1103 \u1084 \u1072 \u1088  \u1095  blocking modal \u1073 \u1072 \u1081 \u1093 \u1075 \u1199 \u1081 \
\
---\
\
## 8) Checkout Payment Flow (Success / Pending / Failed)\
\
### AT-090 \'97 Order can be created before payment\
**Given** customer \'93OK \uc0\u1072 \u1074 \u1095  \u1073 \u1072 \u1081 \u1085 \u1072 \'94 \u1075 \u1101 \u1078  \u1073 \u1072 \u1090 \u1072 \u1083 \u1089 \u1072 \u1085   \
**When** AI order \uc0\u1199 \u1199 \u1089 \u1075 \u1101 \u1085 \u1101   \
**Then** `Order.order_status = NEW`  \
**And** `Order.payment_status = UNPAID`\
\
### AT-091 \'97 Payment success updates payment_status\
**Given** order UNPAID  \
**When** payment attempt success (`PaymentTransaction.status = PAID`)  \
**Then** `Order.payment_status = PAID`  \
**And** merchant notification \'93payment received\'94 \uc0\u1199 \u1199 \u1089 \u1085 \u1101 \
\
### AT-092 \'97 Payment pending shows pending UX\
**Given** order UNPAID  \
**When** payment attempt pending (`PaymentTransaction.status = PENDING`)  \
**Then** order \uc0\u1076 \u1101 \u1101 \u1088  \'93pending\'94 \u1090 \u1257 \u1083 \u1257 \u1074  \u1086 \u1081 \u1083 \u1075 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081  \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072   \
**And** AI \uc0\u1085 \u1100  customer-\u1076  pending \u1090 \u1072 \u1081 \u1083 \u1073 \u1072 \u1088 \u1083 \u1072 \u1078  \u1084 \u1101 \u1076 \u1101 \u1101 \u1083 \u1085 \u1101  (polite)\
\
### AT-093 \'97 Payment failed allows retry or BNPL\
**Given** payment failed (`PaymentTransaction.status = FAILED`)  \
**When** failure event \uc0\u1080 \u1088 \u1085 \u1101   \
**Then** order \uc0\u1076 \u1101 \u1101 \u1088  failure \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072   \
**And** customer-\uc0\u1076  retry \u1101 \u1089 \u1074 \u1101 \u1083  BNPL \u1089 \u1072 \u1085 \u1072 \u1083  \u1073 \u1086 \u1083 \u1075 \u1086 \u1093  message template \u1073 \u1086 \u1083 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081 \
\
---\
\
## 9) BNPL Flow (Approved / Rejected / Pending)\
\
### AT-100 \'97 BNPL selection creates BNPLTransaction PENDING\
**Given** order UNPAID \uc0\u1073 \u1257 \u1075 \u1257 \u1257 \u1076  BNPL option available  \
**When** customer BNPL \uc0\u1089 \u1086 \u1085 \u1075 \u1086 \u1085 \u1086   \
**Then** `BNPLTransaction.status = PENDING` \uc0\u1199 \u1199 \u1089 \u1085 \u1101 \
\
### AT-101 \'97 BNPL approved marks order paid\
**Given** BNPL pending  \
**When** provider approve \uc0\u1073 \u1091 \u1094 \u1072 \u1072 \u1085 \u1072  (`BNPLTransaction.status = APPROVED`)  \
**Then** `Order.payment_status = PAID` \uc0\u1073 \u1086 \u1083 \u1085 \u1086   \
**And** order fulfillment \uc0\u1088 \u1091 \u1091  (PREPARING) \u1096 \u1080 \u1083 \u1078 \u1080 \u1093  \u1073 \u1086 \u1083 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081 \
\
### AT-102 \'97 BNPL rejected keeps order unpaid\
**Given** BNPL pending  \
**When** provider reject \uc0\u1073 \u1091 \u1094 \u1072 \u1072 \u1085 \u1072  (`BNPLTransaction.status = REJECTED`)  \
**Then** `Order.payment_status` UNPAID \uc0\u1093 \u1101 \u1074 \u1101 \u1101 \u1088   \
**And** AI \uc0\u1085 \u1100  normal payment alternatives \u1089 \u1072 \u1085 \u1072 \u1083  \u1073 \u1086 \u1083 \u1075 \u1086 \u1085 \u1086 \
\
### AT-103 \'97 BNPL pending timeout handled gracefully\
**Given** BNPL pending \uc0\u1091 \u1076 \u1072 \u1072 \u1085  \u1199 \u1088 \u1075 \u1101 \u1083 \u1078 \u1080 \u1083 \u1089 \u1101 \u1085   \
**When** timeout threshold \uc0\u1093 \u1199 \u1088 \u1085 \u1101   \
**Then** AI \uc0\u1085 \u1100  customer-\u1076  status update \u1257 \u1075 \u1085 \u1257   \
**And** normal payment path \uc0\u1088 \u1091 \u1091  \u1096 \u1080 \u1083 \u1078 \u1080 \u1093  \u1089 \u1086 \u1085 \u1075 \u1086 \u1083 \u1090  \u1089 \u1072 \u1085 \u1072 \u1083  \u1073 \u1086 \u1083 \u1075 \u1086 \u1085 \u1086 \
\
---\
\
## 10) Wallet (Balances, Transactions, BNPL visibility)\
\
### AT-110 \'97 Wallet overview shows available/pending/total\
**Given** business wallet data \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Wallet overview \uc0\u1085 \u1101 \u1101 \u1085 \u1101   \
**Then** available_balance, pending_balance, total_earned \uc0\u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-111 \'97 Payment transactions list shows required columns\
**Given** payment transactions \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Wallet \uc0\u8594  Payments \u1085 \u1101 \u1101 \u1085 \u1101   \
**Then** row \uc0\u1073 \u1199 \u1088  Order ID, Amount, Method, Status, Created_at \u1093 \u1072 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072 \
\
### AT-112 \'97 BNPL list shows approved/rejected/pending summary\
**Given** BNPL transactions \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Wallet \uc0\u8594  BNPL \u1085 \u1101 \u1101 \u1085 \u1101   \
**Then** Approved/Rejected/Pending count (\uc0\u1101 \u1089 \u1074 \u1101 \u1083  summary) \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072   \
**And** transaction list \uc0\u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-113 \'97 Wallet balances update after payment events\
**Given** order paid \uc0\u1073 \u1086 \u1083 \u1089 \u1086 \u1085   \
**When** settlement rule-\uc0\u1101 \u1101 \u1088  pending \u1101 \u1089 \u1074 \u1101 \u1083  available \u1088 \u1091 \u1091  \u1085 \u1101 \u1084 \u1101 \u1075 \u1076 \u1101 \u1085 \u1101   \
**Then** Wallet overview \uc0\u1076 \u1101 \u1101 \u1088  \u1090 \u1086 \u1086 \u1085 \u1091 \u1091 \u1076  \u1096 \u1080 \u1085 \u1101 \u1095 \u1083 \u1101 \u1075 \u1076 \u1101 \u1085 \u1101 \
\
---\
\
## 11) Payout (DAN verification gate + bank details + lifecycle)\
\
### AT-120 \'97 Payout is blocked until DAN verified\
**Given** `IdentityVerification.status = NOT_VERIFIED`  \
**When** user Wallet \uc0\u8594  Payout \u1086 \u1088 \u1078  Withdraw \u1093 \u1080 \u1081 \u1093 \u1080 \u1081 \u1075  \u1086 \u1088 \u1086 \u1083 \u1076 \u1086 \u1085 \u1086   \
**Then** Withdraw action disabled/blocked \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**And** DAN verification prompt \uc0\u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072   \
**And** app-\uc0\u1080 \u1081 \u1085  \u1073 \u1091 \u1089 \u1072 \u1076  \u1093 \u1101 \u1089 \u1101 \u1075  \u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1089 \u1072 \u1072 \u1088  \u1073 \u1072 \u1081 \u1085 \u1072 \
\
### AT-121 \'97 DAN verification can be started from Wallet\
**Given** NOT_VERIFIED  \
**When** user \'93Start verification\'94 \uc0\u1076 \u1072 \u1088 \u1085 \u1072   \
**Then** verification flow \uc0\u1101 \u1093 \u1101 \u1083 \u1085 \u1101   \
**And** status `PENDING` \uc0\u1073 \u1086 \u1083 \u1078  \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-122 \'97 Verified unlocks payout\
**Given** verification `PENDING`  \
**When** verification success (`VERIFIED`)  \
**Then** Withdraw action \uc0\u1080 \u1076 \u1101 \u1074 \u1093 \u1078 \u1080 \u1085 \u1101 \
\
### AT-123 \'97 Bank details required after DAN verified\
**Given** DAN `VERIFIED`  \
**When** user bank details \uc0\u1086 \u1088 \u1091 \u1091 \u1083 \u1072 \u1072 \u1075 \u1199 \u1081 \u1075 \u1101 \u1101 \u1088  payout request \u1093 \u1080 \u1081 \u1093 \u1080 \u1081 \u1075  \u1086 \u1088 \u1086 \u1083 \u1076 \u1086 \u1085 \u1086   \
**Then** bank details form \uc0\u1088 \u1091 \u1091  \u1095 \u1080 \u1075 \u1083 \u1199 \u1199 \u1083 \u1085 \u1101   \
**And** validation message \uc0\u1075 \u1072 \u1088 \u1085 \u1072 \
\
### AT-124 \'97 Payout request creates lifecycle states\
**Given** DAN verified + bank details saved + available_balance > 0  \
**When** user payout request submit \uc0\u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** `Payout.status = REQUESTED` \uc0\u1199 \u1199 \u1089 \u1085 \u1101   \
**And** \uc0\u1076 \u1072 \u1088 \u1072 \u1072  \u1085 \u1100  `PROCESSING` \u8594  `COMPLETED` (\u1101 \u1089 \u1074 \u1101 \u1083  `FAILED`) \u1073 \u1086 \u1083 \u1078  \u1096 \u1080 \u1085 \u1101 \u1095 \u1083 \u1101 \u1075 \u1076 \u1101 \u1085 \u1101 \
\
### AT-125 \'97 Payout failure returns funds\
**Given** payout request \uc0\u1093 \u1080 \u1081 \u1089 \u1101 \u1085  \u1073 \u1257 \u1075 \u1257 \u1257 \u1076  available_balance-\u1086 \u1086 \u1089  hold \u1093 \u1080 \u1081 \u1075 \u1076 \u1089 \u1101 \u1085   \
**When** payout `FAILED` \uc0\u1073 \u1086 \u1083 \u1085 \u1086   \
**Then** hold amount available_balance \uc0\u1088 \u1091 \u1091  \u1073 \u1091 \u1094 \u1072 \u1072 \u1078  \u1085 \u1101 \u1084 \u1101 \u1075 \u1076 \u1101 \u1085 \u1101 \
\
---\
\
## 12) Settings\
\
### AT-130 \'97 Business Info editable (non-blocking)\
**Given** Settings \uc0\u8594  Business Info  \
**When** business name/category/city/contact \uc0\u1257 \u1257 \u1088 \u1095 \u1080 \u1083 \u1078  Save \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** Business object \uc0\u1076 \u1101 \u1101 \u1088  \u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-131 \'97 Business logo supports upload and social import\
**Given** Settings \uc0\u8594  Business Info \u8594  Logo section  \
**When** user upload \uc0\u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** logo_url \uc0\u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-132 \'97 Subscription Plan shows current plan & status\
**Given** business plan data \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Settings \uc0\u8594  Subscription Plan \u1085 \u1101 \u1101 \u1085 \u1101   \
**Then** plan name + status + upgrade action \uc0\u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-133 \'97 Billing & AI Energy shows token usage\
**Given** AI Energy data \uc0\u1073 \u1072 \u1081 \u1085 \u1072   \
**When** Settings \uc0\u8594  Billing & AI Energy \u1085 \u1101 \u1101 \u1085 \u1101   \
**Then** available_tokens, used_tokens, reset_date (if any) \uc0\u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-134 \'97 Token package purchase applies immediately\
**Given** token packages available  \
**When** user token package purchase success \uc0\u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** available_tokens \uc0\u1085 \u1101 \u1084 \u1101 \u1075 \u1076 \u1101 \u1085 \u1101   \
**And** purchase record billing history-\uc0\u1076  \u1085 \u1101 \u1084 \u1101 \u1075 \u1076 \u1101 \u1085 \u1101 \
\
### AT-135 \'97 Delivery settings update affects new orders\
**Given** Delivery fee/areas \uc0\u1090 \u1086 \u1093 \u1080 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072   \
**When** Save \uc0\u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** \uc0\u1096 \u1080 \u1085 \u1101  \u1090 \u1086 \u1093 \u1080 \u1088 \u1075 \u1086 \u1086  \u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072   \
**And** \uc0\u1079 \u1257 \u1074 \u1093 \u1257 \u1085  \u1096 \u1080 \u1085 \u1101  order-\u1091 \u1091 \u1076 \u1072 \u1076  \u1093 \u1101 \u1088 \u1101 \u1075 \u1078 \u1080 \u1093  \u1079 \u1072 \u1088 \u1095 \u1080 \u1084  UI \u1076 \u1101 \u1101 \u1088  \u1086 \u1081 \u1083 \u1075 \u1086 \u1084 \u1078 \u1090 \u1086 \u1081  \u1073 \u1072 \u1081 \u1085 \u1072 \
\
### AT-136 \'97 Store notifications toggles work with critical guard\
**Given** Settings \uc0\u8594  Store Notifications  \
**When** user non-critical notification-\uc0\u1091 \u1091 \u1076 \u1099 \u1075  OFF \u1073 \u1086 \u1083 \u1075 \u1086 \u1085 \u1086   \
**Then** OFF \uc0\u1073 \u1086 \u1083 \u1089 \u1086 \u1085  \u1090 \u1257 \u1083 \u1257 \u1074  \u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-137 \'97 Critical notifications cannot be fully disabled\
**Given** payout failure \uc0\u1090 \u1257 \u1088 \u1083 \u1080 \u1081 \u1085  critical notification type  \
**When** user OFF \uc0\u1073 \u1086 \u1083 \u1075 \u1086 \u1093  \u1086 \u1088 \u1086 \u1083 \u1076 \u1083 \u1086 \u1075 \u1086  \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** system \uc0\u1085 \u1100  \u1079 \u1257 \u1074 \u1096 \u1257 \u1257 \u1088 \u1257 \u1093 \u1075 \u1199 \u1081  (\u1101 \u1089 \u1074 \u1101 \u1083  \'93always on\'94 label)  \
**And** rationale (short) \uc0\u1093 \u1072 \u1088 \u1091 \u1091 \u1083 \u1085 \u1072 \
\
### AT-138 \'97 AI Preferences toggles persist and apply immediately\
**Given** AI Preferences \uc0\u8594  Automations toggles  \
**When** `unpaid_order_followup`-\uc0\u1075  ON \u1073 \u1086 \u1083 \u1075 \u1086 \u1085 \u1086   \
**Then** `AutomationSetting.unpaid_order_followup = true` \uc0\u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072   \
**And** \uc0\u1090 \u1091 \u1093 \u1072 \u1081 \u1085  automation behavior \u1096 \u1091 \u1091 \u1076  \u1093 \u1101 \u1088 \u1101 \u1075 \u1078 \u1080 \u1085 \u1101 \
\
---\
\
## 13) Automations (Pre-built ON/OFF)\
\
### AT-150 \'97 No rule builder exists\
**Given** Automations settings  \
**When** user \uc0\u1072 \u1074 \u1090 \u1086 \u1084 \u1101 \u1081 \u1096 \u1085  \u1090 \u1086 \u1093 \u1080 \u1088 \u1091 \u1091 \u1083 \u1072 \u1093  \u1075 \u1101 \u1078  \u1086 \u1088 \u1086 \u1083 \u1076 \u1086 \u1085 \u1086   \
**Then** \uc0\u1079 \u1257 \u1074 \u1093 \u1257 \u1085  ON/OFF (\u1073 \u1086 \u1083 \u1086 \u1085  \u1090 \u1086 \u1074 \u1095  \u1090 \u1072 \u1081 \u1083 \u1073 \u1072 \u1088 ) \u1073 \u1072 \u1081 \u1085 \u1072   \
**And** \uc0\u1085 \u1257 \u1093 \u1094 \u1257 \u1083 /if-else editor \u1073 \u1072 \u1081 \u1093 \u1075 \u1199 \u1081 \
\
### AT-151 \'97 Unpaid follow-up runs only when ON\
**Given** order UNPAID \uc0\u1073 \u1257 \u1075 \u1257 \u1257 \u1076  follow-up \u1093 \u1091 \u1075 \u1072 \u1094 \u1072 \u1072  \u1257 \u1085 \u1075 \u1257 \u1088 \u1089 \u1257 \u1085   \
**When** automation OFF  \
**Then** AI \uc0\u1103 \u1084 \u1072 \u1088  \u1095  follow-up message \u1103 \u1074 \u1091 \u1091 \u1083 \u1072 \u1093 \u1075 \u1199 \u1081 \
\
### AT-152 \'97 Unpaid follow-up sends max limited reminders\
**Given** automation ON  \
**When** follow-up trigger \uc0\u1076 \u1072 \u1074 \u1090 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072   \
**Then** \uc0\u1085 \u1101 \u1075  order \u1076 \u1101 \u1101 \u1088  reminder-\u1080 \u1081 \u1085  \u1090 \u1086 \u1086  max \u1083 \u1080 \u1084 \u1080 \u1090 \u1101 \u1101 \u1089  \u1093 \u1101 \u1090 \u1088 \u1101 \u1093 \u1075 \u1199 \u1081 \
\
### AT-153 \'97 Auto-reply respects merchant OFF\
**Given** auto_reply_comments OFF  \
**When** customer comment \uc0\u1080 \u1088 \u1085 \u1101   \
**Then** AI \uc0\u1072 \u1074 \u1090 \u1086 \u1084 \u1072 \u1090 \u1072 \u1072 \u1088  reply \u1093 \u1080 \u1081 \u1093 \u1075 \u1199 \u1081   \
**And** merchant-\uc0\u1076  optional suggestion \u1075 \u1072 \u1088 \u1075 \u1072 \u1078  \u1073 \u1086 \u1083 \u1085 \u1086  (non-blocking)\
\
---\
\
## 14) Notifications (In-app)\
\
### AT-160 \'97 Payment received notification\
**Given** payment success event  \
**When** `PaymentTransaction.status = PAID`  \
**Then** merchant in-app notification \uc0\u1199 \u1199 \u1089 \u1085 \u1101  (priority HIGH)\
\
### AT-161 \'97 BNPL approved/rejected notification\
**Given** BNPL decision event  \
**When** APPROVED \uc0\u1101 \u1089 \u1074 \u1101 \u1083  REJECTED \u1080 \u1088 \u1085 \u1101   \
**Then** merchant notification \uc0\u1199 \u1199 \u1089 \u1085 \u1101 \
\
### AT-162 \'97 Payout status notifications\
**Given** payout request \uc0\u1093 \u1080 \u1081 \u1089 \u1101 \u1085   \
**When** payout PROCESSING / COMPLETED / FAILED \uc0\u1073 \u1086 \u1083 \u1085 \u1086   \
**Then** merchant notification \uc0\u1199 \u1199 \u1089 \u1085 \u1101 \
\
---\
\
## 15) Data Integrity (Minimal)\
\
### AT-170 \'97 Business isolation\
**Given** `BUSINESS_A` \uc0\u1073 \u1086 \u1083 \u1086 \u1085  \u1257 \u1257 \u1088  \u1073 \u1080 \u1079 \u1085 \u1077 \u1089  `BUSINESS_B` \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** `USER_A` Products/Orders/Wallet data \uc0\u1090 \u1072 \u1090 \u1085 \u1072   \
**Then** \uc0\u1079 \u1257 \u1074 \u1093 \u1257 \u1085  \u1257 \u1257 \u1088 \u1080 \u1081 \u1085  business-\u1080 \u1081 \u1085  \u1257 \u1075 \u1257 \u1075 \u1076 \u1257 \u1083  \u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1085 \u1072 \
\
### AT-171 \'97 Order requires valid relationships\
**Given** order create \uc0\u1093 \u1080 \u1081 \u1093  \u1075 \u1101 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072   \
**When** customer_id \uc0\u1101 \u1089 \u1074 \u1101 \u1083  business_id \u1073 \u1091 \u1088 \u1091 \u1091   \
**Then** system order \uc0\u1199 \u1199 \u1089 \u1075 \u1101 \u1093 \u1075 \u1199 \u1081  (validation)\
\
### AT-172 \'97 PaymentTransaction must reference an order\
**Given** payment transaction create  \
**When** order_id \uc0\u1073 \u1072 \u1081 \u1093 \u1075 \u1199 \u1081   \
**Then** system reject \uc0\u1093 \u1080 \u1081 \u1085 \u1101 \
\
---\
\
## 16) Non-blocking Principle Checks (System-level)\
\
### AT-180 \'97 Missing payment setup never blocks browsing\
**Given** payments disabled  \
**When** user Products/Customers/Settings \uc0\u1199 \u1079 \u1085 \u1101   \
**Then** \uc0\u1103 \u1084 \u1072 \u1088  \u1095  blocking interstitial \u1073 \u1072 \u1081 \u1093 \u1075 \u1199 \u1081 \
\
### AT-181 \'97 Missing delivery config only blocks completion\
**Given** delivery not configured  \
**When** order delivery-required \uc0\u1073 \u1086 \u1083 \u1075 \u1086 \u1093  \u1075 \u1101 \u1078  \u1086 \u1088 \u1086 \u1083 \u1076 \u1086 \u1085 \u1086   \
**Then** system delivery setup \uc0\u1089 \u1072 \u1085 \u1072 \u1083  \u1073 \u1086 \u1083 \u1075 \u1086 \u1085 \u1086   \
**And** browsing \uc0\u1073 \u1083 \u1086 \u1082 \u1083 \u1086 \u1093 \u1075 \u1199 \u1081 \
\
### AT-182 \'97 Missing DAN only blocks payout\
**Given** DAN not verified  \
**When** user payout request \uc0\u1093 \u1080 \u1081 \u1093 \u1101 \u1101 \u1089  \u1073 \u1091 \u1089 \u1072 \u1076  \u1199 \u1081 \u1083 \u1076 \u1101 \u1083  \u1093 \u1080 \u1081 \u1085 \u1101   \
**Then** \uc0\u1073 \u1199 \u1075 \u1076  \u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1085 \u1072 \
\
---\
\
## 17) Release Smoke Checklist (1-pass)\
\
- [ ] Sign up / Log in / Forgot password \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] Referral-gated business create + access request \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] ACTIVE business \uc0\u1073 \u1086 \u1083 \u1084 \u1086 \u1075 \u1094  main app \u1085 \u1101 \u1101 \u1075 \u1076 \u1101 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] Products: list/search/filter/detail/edit/disable/delete \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] Orders: list/search/filter/detail/status/update/manual create \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] Payments: enable/disable + checkout success/pending/failed \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] BNPL: approved/rejected/pending \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] Wallet: balances + transactions + BNPL list \uc0\u1093 \u1072 \u1088 \u1072 \u1075 \u1076 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] Payout: DAN gate + bank details + request lifecycle \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] Settings: Business info, Plan, Billing & AI Energy, Delivery, Notifications, AI Preferences \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] AI Panel: collapse/context/recommendations/non-blocking reminders \uc0\u1072 \u1078 \u1080 \u1083 \u1083 \u1072 \u1078  \u1073 \u1072 \u1081 \u1085 \u1072 \
- [ ] Automations: ON/OFF respected (no rule builder)\
}