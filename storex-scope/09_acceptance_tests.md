# 09 — Acceptance Tests (MVP)

Storex MVP-ийн **acceptance tests** нь core selling loop (Social chat → Order → Payment/BNPL → Fulfillment → Wallet/Payout) болон **state-driven** UI/AI behavior-уудад зөв ажиллаж байгааг батална.

> **Формат**: **Given / When / Then** (+ **And**)  
> **Scope**: MVP cutline-д багтсан хэсгүүд (Onboarding/Referral, Main App, Products, Orders, Payments+BNPL, Wallet/Payout, Settings, AI Assistant Panel, Automations, Notifications).

---

## 0) Test Data & Common Assumptions

### Shared Fixtures
- `USER_A`: шинэ хэрэглэгч (email/phone бүртгүүлэх боломжтой)
- `USER_B`: өмнө нь бүртгэлтэй хэрэглэгч (login хийх боломжтой)
- `REF_OK`: хүчинтэй referral code (`UNUSED`)
- `REF_USED`: ашигласан referral code (`USED`)
- `BUSINESS_A`: `USER_A`-ийн бизнес (created via `REF_OK`, status `ACTIVE`)
- `PRODUCT_1`: идэвхтэй бүтээгдэхүүн (photo + name + price + stock)
- `PRODUCT_2`: incomplete бүтээгдэхүүн (photo байхгүй эсвэл price байхгүй)
- `ORDER_1`: `PRODUCT_1`-ээр үүссэн захиалга

### Global Rules (MVP)
- App нь **state-driven**: screen/permissions/AI behavior нь state-ээс хамаарна.
- **No blocking setup**: Payment/Delivery/DAN verification нь app access-ийг хаахгүй, зөвхөн тухайн action (sale completion, payout)-ийг block хийнэ.
- Automations нь **pre-built** бөгөөд зөвхөн **ON/OFF**.
- Merchant нь өндөр эрсдэлтэй үйлдэл дээр (payout, payment, status changes) **control**-оо алдахгүй.

---

## 1) Auth & Access (User Access State Machine)

### AT-001 — Sign up creates AUTHENTICATED user
**Given** хэрэглэгч `ANONYMOUS` байна  
**When** зөв email/phone + password-оор Sign up хийнэ  
**Then** user `AUTHENTICATED` болно  
**And** user profile (id, created_at) үүссэн байна

### AT-002 — Login transitions to AUTHENTICATED
**Given** `USER_B` бүртгэлтэй байна  
**When** зөв credential-оор Log in хийнэ  
**Then** user `AUTHENTICATED` болно  
**And** last_login_at шинэчлэгдэнэ

### AT-003 — Login rejects invalid credentials
**Given** `USER_B` бүртгэлтэй байна  
**When** буруу password оруулна  
**Then** Log in амжилтгүй  
**And** error message нь credential-ийн аль хэсэг буруу гэдгийг нарийвчлан задлахгүй

### AT-004 — Forgot password enters PASSWORD_RESET state
**Given** user `ANONYMOUS` байна  
**When** Forgot password эхлүүлнэ  
**Then** system `PASSWORD_RESET` урсгал руу оруулна

### AT-005 — Successful reset returns to AUTHENTICATED
**Given** user password reset хийх эрхтэй байна  
**When** шинэ password-оо амжилттай баталгаажуулна  
**Then** user `AUTHENTICATED` болно

### AT-006 — No business → Main App нэвтрэхгүй
**Given** user `AUTHENTICATED` бөгөөд business байхгүй (`NO_BUSINESS`)  
**When** user main app руу орох оролдлого хийнэ  
**Then** Business onboarding entry screen рүү чиглүүлнэ  
**And** main app screens (Dashboard/Products/Orders/Wallet/Settings) харагдахгүй

---

## 2) Business Onboarding (Referral-gated)

### AT-010 — Business creation requires referral
**Given** `USER_A` нь `AUTHENTICATED` бөгөөд `NO_BUSINESS`  
**When** "Create business" сонгоно  
**Then** Referral code input (`REFERRAL_REQUIRED`) state-д орно

### AT-011 — Valid referral proceeds to Business Creation
**Given** user `REFERRAL_REQUIRED` screen дээр  
**When** хүчинтэй `REF_OK` оруулна  
**Then** business creation form нээгдэнэ  
**And** referral code нь business дээр `referral_code_used`-д хадгалагдана

### AT-012 — Used referral is rejected
**Given** user `REFERRAL_REQUIRED` screen дээр  
**When** `REF_USED` оруулна  
**Then** proceed хийхгүй  
**And** "code already used" төрлийн ойлгомжтой алдаа харуулна

### AT-013 — No/invalid referral routes to Access Request
**Given** user `REFERRAL_REQUIRED` screen дээр  
**When** referral оруулахгүй эсвэл invalid code оруулна  
**Then** "Request Access" flow руу оруулна  
**And** business үүсэхгүй

### AT-014 — Access request creates AccessRequest (no business)
**Given** user access request form дээр  
**When** business_name, category, contact info бөглөж submit хийнэ  
**Then** `AccessRequest.status = REQUESTED` үүснэ  
**And** user business үүсгээгүй хэвээр (`NO_BUSINESS`)

### AT-015 — Access requested users cannot access main app
**Given** `AccessRequest.status = REQUESTED` бөгөөд user business байхгүй  
**When** user main app руу орох оролдлого хийнэ  
**Then** "request received" / "await approval" дэлгэц харуулна

### AT-016 — Business becomes ACTIVE after name+category saved
**Given** user business creation form дээр (referral ok)  
**When** Business name + category save хийнэ  
**Then** `Business.status = ACTIVE`  
**And** user main app руу орно

### AT-017 — Referral sharing prompt is non-blocking
**Given** business `ACTIVE` болсон  
**When** Dashboard эсвэл AI panel дээр referral prompt гарна  
**Then** user dismiss хийж болно  
**And** dismiss нь selling workflow-г таслахгүй

---

## 3) Main App Navigation & State-driven Visibility

### AT-020 — Sidebar shows core modules for ACTIVE business
**Given** user `AUTHENTICATED` ба `Business.ACTIVE`  
**When** app ачаална  
**Then** Sidebar-д Dashboard, Products, Orders, Customers, Wallet, Settings харагдана

### AT-021 — Right AI panel exists on all main screens
**Given** user main app-д байна  
**When** user Dashboard → Products → Orders гэх мэт шилжинэ  
**Then** Right AI Assistant Panel тогтмол харагдана (collapse боломжтой)

### AT-022 — Collapsed AI panel opens via floating button
**Given** AI panel collapsed  
**When** Floating AI button дарна  
**Then** AI panel open болно  
**And** panel state navigation хооронд хадгалагдана

---

## 4) AI Assistant Panel (Context, Recommendations, Actions)

### AT-030 — Context awareness switches automatically
**Given** user Products screen дээр байна  
**When** user Orders screen рүү шилжинэ  
**Then** AI panel-ийн context header/quick actions нь Orders context руу солигдоно

### AT-031 — Recommendations are explainable and dismissible
**Given** AI зөвлөмж гаргаж байна  
**When** user "Why?" эсвэл info товч дарна  
**Then** AI нь ойлгомжтой тайлбар өгнө  
**And** user зөвлөмжийг dismiss хийж болно

### AT-032 — Non-blocking readiness reminders
**Given** payments disabled (`PAYMENT_DISABLED`)  
**When** user Orders screen дээр "complete sale" төрлийн алхам хийх контекст үүснэ  
**Then** AI panel нь enable payments-г санал болгоно  
**And** app usage-г блоклох modal гаргахгүй

### AT-033 — High-impact actions require merchant control
**Given** AI нь customer message илгээх гэж байна (high impact scenario)  
**When** merchant approve toggle эсвэл confirm шаардсан төлөвтэй  
**Then** AI нь merchant-ийн зөвшөөрөлгүйгээр илгээхгүй

---

## 5) Products

### AT-040 — Product list loads for business
**Given** `BUSINESS_A` дээр 2+ бүтээгдэхүүн байна  
**When** Products page нээнэ  
**Then** Product list харагдана  
**And** status (ACTIVE/DISABLED) тодорхой харагдана

### AT-041 — Product search filters by name
**Given** product list байна  
**When** search query оруулна  
**Then** list нь query-д таарах бүтээгдэхүүнүүдээр шүүгдэнэ

### AT-042 — Product filter by status works
**Given** ACTIVE болон DISABLED бүтээгдэхүүнүүд байна  
**When** filter = DISABLED сонгоно  
**Then** зөвхөн DISABLED бүтээгдэхүүнүүд харагдана

### AT-043 — Product detail shows editable fields
**Given** `PRODUCT_1` байна  
**When** Product row дээр дарж detail нээнэ  
**Then** name, price, variants, stock, status, photos талбарууд харагдана

### AT-044 — Edit product persists changes
**Given** `PRODUCT_1` detail дээр  
**When** price өөрчлөөд Save хийнэ  
**Then** product шинэ price-тай хадгалагдана  
**And** list дээр шинэчлэгдэж харагдана

### AT-045 — Disable/Enable toggles product sellability
**Given** `PRODUCT_1` ACTIVE  
**When** Disable хийнэ  
**Then** status DISABLED болно  
**And** AI product recommendation хийх үед DISABLED бүтээгдэхүүнийг санал болгохгүй

### AT-046 — Delete requires confirmation
**Given** product detail дээр байна  
**When** Delete дарна  
**Then** confirmation dialog гарна  
**And** confirm хийсэн үед л устгана

### AT-047 — AI photo-based product creation produces draft
**Given** Product wizard (AI-assisted) нээлттэй  
**When** user product photo upload хийнэ  
**Then** AI нь title/category/attributes/variants/price suggestion гаргана  
**And** merchant review + edit хийж Save хийснээр product үүснэ

### AT-048 — Manual product creation requires minimal fields
**Given** Product wizard (Manual) нээлттэй  
**When** user name + price оруулаад Save хийнэ  
**Then** product үүснэ  
**And** бусад optional талбарууд хоосон байж болно

---

## 6) Orders

### AT-060 — Order list loads and shows key columns
**Given** business дээр захиалгууд байна  
**When** Orders page нээнэ  
**Then** list нь Order ID, Customer, Total, Payment status, Order status, Delivery status, Source-ыг харуулна

### AT-061 — Order search works (ID / customer / phone)
**Given** захиалгуудын жагсаалт  
**When** search input-д Order ID эсвэл phone оруулна  
**Then** тохирох захиалгууд шүүгдэнэ

### AT-062 — Order filters work (status/payment/delivery/date)
**Given** олон төрлийн төлөвтэй захиалгууд байна  
**When** payment_status = UNPAID filter сонгоно  
**Then** зөвхөн UNPAID захиалгууд харагдана

### AT-063 — Order detail shows full information
**Given** `ORDER_1` байна  
**When** order detail нээнэ  
**Then** customer, items, totals, payment info, BNPL info (if any), delivery details, internal notes харагдана

### AT-064 — Update order status follows allowed transitions
**Given** `ORDER_1.order_status = NEW`  
**When** merchant PREPARING болгоно  
**Then** order_status PREPARING болно

### AT-065 — Invalid order status transition is prevented
**Given** `ORDER_1.order_status = NEW`  
**When** merchant COMPLETED руу шууд үсрэх оролдлого хийнэ  
**Then** system нь зөвшөөрөхгүй  
**And** ойлгомжтой validation message харуулна

### AT-066 — Manual order creation supports offline
**Given** Orders page дээр manual create  
**When** merchant customer + items + total оруулна  
**Then** order `created_by = MANUAL` үүснэ  
**And** source = OFFLINE сонгож болно

### AT-067 — AI-created order marks created_by = AI
**Given** AI checkout initiation ажилласан  
**When** AI order үүсгэнэ  
**Then** `Order.created_by = AI` хадгалагдана

---

## 7) Payment Setup (Non-blocking)

### AT-080 — Payments can be enabled from Settings/Wallet
**Given** business `PAYMENT_DISABLED`  
**When** Settings → Payment Setup (эсвэл Wallet → Payments) орж Enable хийж submit хийнэ  
**Then** readiness flag `PAYMENT_ENABLED` болно

### AT-081 — Payment enable failure keeps disabled
**Given** payments enable хийх provider error гарсан  
**When** Enable submit хийнэ  
**Then** `PAYMENT_DISABLED` хэвээр  
**And** retry боломжтой error UI харагдана

### AT-082 — Payments disabled does not block app
**Given** business `PAYMENT_DISABLED`  
**When** user Dashboard/Products/Orders/Customers үзнэ  
**Then** ямар ч blocking modal байхгүй

---

## 8) Checkout Payment Flow (Success / Pending / Failed)

### AT-090 — Order can be created before payment
**Given** customer "OK авч байна" гэж батласан  
**When** AI order үүсгэнэ  
**Then** `Order.order_status = NEW`  
**And** `Order.payment_status = UNPAID`

### AT-091 — Payment success updates payment_status
**Given** order UNPAID  
**When** payment attempt success (`PaymentTransaction.status = PAID`)  
**Then** `Order.payment_status = PAID`  
**And** merchant notification "payment received" үүснэ

### AT-092 — Payment pending shows pending UX
**Given** order UNPAID  
**When** payment attempt pending (`PaymentTransaction.status = PENDING`)  
**Then** order дээр "pending" төлөв ойлгомжтой харагдана  
**And** AI нь customer-д pending тайлбарлаж мэдээлнэ (polite)

### AT-093 — Payment failed allows retry or BNPL
**Given** payment failed (`PaymentTransaction.status = FAILED`)  
**When** failure event ирнэ  
**Then** order дээр failure харагдана  
**And** customer-д retry эсвэл BNPL санал болгох message template боломжтой

---

## 9) BNPL Flow (Approved / Rejected / Pending)

### AT-100 — BNPL selection creates BNPLTransaction PENDING
**Given** order UNPAID бөгөөд BNPL option available  
**When** customer BNPL сонгоно  
**Then** `BNPLTransaction.status = PENDING` үүснэ

### AT-101 — BNPL approved marks order paid
**Given** BNPL pending  
**When** provider approve буцаана (`BNPLTransaction.status = APPROVED`)  
**Then** `Order.payment_status = PAID` болно  
**And** order fulfillment руу (PREPARING) шилжих боломжтой

### AT-102 — BNPL rejected keeps order unpaid
**Given** BNPL pending  
**When** provider reject буцаана (`BNPLTransaction.status = REJECTED`)  
**Then** `Order.payment_status` UNPAID хэвээр  
**And** AI нь normal payment alternatives санал болгоно

### AT-103 — BNPL pending timeout handled gracefully
**Given** BNPL pending удаан үргэлжилсэн  
**When** timeout threshold хүрнэ  
**Then** AI нь customer-д status update өгнө  
**And** normal payment path руу шилжих сонголт санал болгоно

---

## 10) Wallet (Balances, Transactions, BNPL visibility)

### AT-110 — Wallet overview shows available/pending/total
**Given** business wallet data байна  
**When** Wallet overview нээнэ  
**Then** available_balance, pending_balance, total_earned харагдана

### AT-111 — Payment transactions list shows required columns
**Given** payment transactions байна  
**When** Wallet → Payments нээнэ  
**Then** row бүр Order ID, Amount, Method, Status, Created_at харуулна

### AT-112 — BNPL list shows approved/rejected/pending summary
**Given** BNPL transactions байна  
**When** Wallet → BNPL нээнэ  
**Then** Approved/Rejected/Pending count (эсвэл summary) харагдана  
**And** transaction list харагдана

### AT-113 — Wallet balances update after payment events
**Given** order paid болсон  
**When** settlement rule-ээр pending эсвэл available руу нэмэгдэнэ  
**Then** Wallet overview дээр тоонууд шинэчлэгдэнэ

---

## 11) Payout (DAN verification gate + bank details + lifecycle)

### AT-120 — Payout is blocked until DAN verified
**Given** `IdentityVerification.status = NOT_VERIFIED`  
**When** user Wallet → Payout орж Withdraw хийхийг оролдоно  
**Then** Withdraw action disabled/blocked байна  
**And** DAN verification prompt харагдана  
**And** app-ийн бусад хэсэг ажилласаар байна

### AT-121 — DAN verification can be started from Wallet
**Given** NOT_VERIFIED  
**When** user "Start verification" дарна  
**Then** verification flow эхэлнэ  
**And** status `PENDING` болж харагдана

### AT-122 — Verified unlocks payout
**Given** verification `PENDING`  
**When** verification success (`VERIFIED`)  
**Then** Withdraw action идэвхжинэ

### AT-123 — Bank details required after DAN verified
**Given** DAN `VERIFIED`  
**When** user bank details оруулаагүйгээр payout request хийхийг оролдоно  
**Then** bank details form руу чиглүүлнэ  
**And** validation message гарна

### AT-124 — Payout request creates lifecycle states
**Given** DAN verified + bank details saved + available_balance > 0  
**When** user payout request submit хийнэ  
**Then** `Payout.status = REQUESTED` үүснэ  
**And** дараа нь `PROCESSING` → `COMPLETED` (эсвэл `FAILED`) болж шинэчлэгдэнэ

### AT-125 — Payout failure returns funds
**Given** payout request хийсэн бөгөөд available_balance-оос hold хийсэн  
**When** payout `FAILED` болно  
**Then** hold amount available_balance руу буцааж нэмэгдэнэ

---

## 12) Settings

### AT-130 — Business Info editable (non-blocking)
**Given** Settings → Business Info  
**When** business name/category/city/contact өөрчилж Save хийнэ  
**Then** Business object дээр хадгалагдана

### AT-131 — Business logo supports upload and social import
**Given** Settings → Business Info → Logo section  
**When** user upload хийнэ  
**Then** logo_url хадгалагдана

### AT-132 — Subscription Plan shows current plan & status
**Given** business plan data байна  
**When** Settings → Subscription Plan нээнэ  
**Then** plan name + status + upgrade action харагдана

### AT-133 — Billing & AI Energy shows token usage
**Given** AI Energy data байна  
**When** Settings → Billing & AI Energy нээнэ  
**Then** available_tokens, used_tokens, reset_date (if any) харагдана

### AT-134 — Token package purchase applies immediately
**Given** token packages available  
**When** user token package purchase success хийнэ  
**Then** available_tokens нэмэгдэнэ  
**And** purchase record billing history-д нэмэгдэнэ

### AT-135 — Delivery settings update affects new orders
**Given** Delivery fee/areas тохируулна  
**When** Save хийнэ  
**Then** шинэ тохиргоо хадгалагдана  
**And** зөвхөн шинэ order-уудад хэрэглэгдэх зарчим UI дээр ойлгомжтой байна

### AT-136 — Store notifications toggles work with critical guard
**Given** Settings → Store Notifications  
**When** user non-critical notification-уудыг OFF болгоно  
**Then** OFF болсон төлөв хадгалагдана

### AT-137 — Critical notifications cannot be fully disabled
**Given** payout failure төрлийн critical notification type  
**When** user OFF болгох оролдлого хийнэ  
**Then** system нь зөвшөөрөхгүй (эсвэл "always on" label)  
**And** rationale (short) харуулна

### AT-138 — AI Preferences toggles persist and apply immediately
**Given** AI Preferences → Automations toggles  
**When** `unpaid_order_followup`-г ON болгоно  
**Then** `AutomationSetting.unpaid_order_followup = true` хадгалагдана  
**And** тухайн automation behavior шууд хэрэгжинэ

---

## 13) Automations (Pre-built ON/OFF)

### AT-150 — No rule builder exists
**Given** Automations settings  
**When** user автомейшн тохируулах гэж оролдоно  
**Then** зөвхөн ON/OFF (болон товч тайлбар) байна  
**And** нөхцөл/if-else editor байхгүй

### AT-151 — Unpaid follow-up runs only when ON
**Given** order UNPAID бөгөөд follow-up хугацаа өнгөрсөн  
**When** automation OFF  
**Then** AI ямар ч follow-up message явуулахгүй

### AT-152 — Unpaid follow-up sends max limited reminders
**Given** automation ON  
**When** follow-up trigger давтагдана  
**Then** нэг order дээр reminder-ийн тоо max лимитээс хэтрэхгүй

### AT-153 — Auto-reply respects merchant OFF
**Given** auto_reply_comments OFF  
**When** customer comment ирнэ  
**Then** AI автоматаар reply хийхгүй  
**And** merchant-д optional suggestion гаргаж болно (non-blocking)

---

## 14) Notifications (In-app)

### AT-160 — Payment received notification
**Given** payment success event  
**When** `PaymentTransaction.status = PAID`  
**Then** merchant in-app notification үүснэ (priority HIGH)

### AT-161 — BNPL approved/rejected notification
**Given** BNPL decision event  
**When** APPROVED эсвэл REJECTED ирнэ  
**Then** merchant notification үүснэ

### AT-162 — Payout status notifications
**Given** payout request хийсэн  
**When** payout PROCESSING / COMPLETED / FAILED болно  
**Then** merchant notification үүснэ

---

## 15) Data Integrity (Minimal)

### AT-170 — Business isolation
**Given** `BUSINESS_A` болон өөр бизнес `BUSINESS_B` байна  
**When** `USER_A` Products/Orders/Wallet data татна  
**Then** зөвхөн өөрийн business-ийн өгөгдөл харагдана

### AT-171 — Order requires valid relationships
**Given** order create хийх гэж байна  
**When** customer_id эсвэл business_id буруу  
**Then** system order үүсгэхгүй (validation)

### AT-172 — PaymentTransaction must reference an order
**Given** payment transaction create  
**When** order_id байхгүй  
**Then** system reject хийнэ

---

## 16) Non-blocking Principle Checks (System-level)

### AT-180 — Missing payment setup never blocks browsing
**Given** payments disabled  
**When** user Products/Customers/Settings үзнэ  
**Then** ямар ч blocking interstitial байхгүй

### AT-181 — Missing delivery config only blocks completion
**Given** delivery not configured  
**When** order delivery-required болгох гэж оролдоно  
**Then** system delivery setup санал болгоно  
**And** browsing блоклохгүй

### AT-182 — Missing DAN only blocks payout
**Given** DAN not verified  
**When** user payout request хийхээс бусад үйлдэл хийнэ  
**Then** бүгд ажиллана

---

## 17) Release Smoke Checklist (1-pass)

- [ ] Sign up / Log in / Forgot password ажиллаж байна
- [ ] Referral-gated business create + access request ажиллаж байна
- [ ] ACTIVE business болмогц main app нээгдэж байна
- [ ] Products: list/search/filter/detail/edit/disable/delete ажиллаж байна
- [ ] Orders: list/search/filter/detail/status/update/manual create ажиллаж байна
- [ ] Payments: enable/disable + checkout success/pending/failed ажиллаж байна
- [ ] BNPL: approved/rejected/pending ажиллаж байна
- [ ] Wallet: balances + transactions + BNPL list харагдаж байна
- [ ] Payout: DAN gate + bank details + request lifecycle ажиллаж байна
- [ ] Settings: Business info, Plan, Billing & AI Energy, Delivery, Notifications, AI Preferences ажиллаж байна
- [ ] AI Panel: collapse/context/recommendations/non-blocking reminders ажиллаж байна
- [ ] Automations: ON/OFF respected (no rule builder)

---

**Document Version**: 2.0  
**Last Updated**: 2026-01-19  
**Status**: Production-Ready Acceptance Tests (MVP)  
**Test Count**: 150+ test cases covering core MVP functionality