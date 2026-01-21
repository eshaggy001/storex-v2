# BNPL (Afterpay) Бүтэн Процесс / Complete BNPL Process

## 📋 Урсгалын Дараалал / Process Flow

### Step 1: Эхлэх үе (Not Applied)
**When**: Хэрэглэгч "Afterpay (BNPL)" checkbox дээр дарна  
**Action**: Үйлчилгээний нөхцөл modal нээгдэнэ

---

### Step 2: Үйлчилгээний нөхцөл (Terms Step)

**Агуулга / Content**:
- ⚠️ BNPL-н онцгой анхааруулга
- 📜 Үйлчилгээний нөхцөл (4 section)
  1. Үйлчилгээний нөхцөл
  2. Хураамж болон шимтгэл
  3. Мэдээллийн нууцлал
  4. Зөрчил болон маргаан

**Товч / Buttons**:
- ✅ **"Зөвшөөрч байна" / "I Agree"** → Хүсэлтийн форм руу шилжинэ
- ❌ **"Болих" / "Cancel"** → Modal хаагдана

---

### Step 3: Хүсэлтийн форм (Application Step)

**Бөглөх мэдээлэл / Required Information**:
1. 🏢 **Бизнесийн нэр** - автомат (store.name)
2. 📂 **Бизнесийн ангилал** - автомат (store.category)
3. 💰 **Сарын орлого** - хэрэглэгч оруулна (монгол төгрөгөөр)
4. 🛒 **Дундаж захиалгын дүн** - хэрэглэгч оруулна
5. 🏦 **BNPL үйлчилгээ үзүүлэгч**:
   - ⚡ **StorePay** (recommended)
   - 💳 **LendPay**
   - 📱 **SimplePay**

**Товч / Buttons**:
- ✅ **"Хүсэлт илгээх" / "Submit Application"** → Server рүү илгээнэ
- ◀️ **"Буцах" / "Back"** → Terms Step руу буцна

---

### Step 4: Илгээсний дараа (Submitted Step)

**Харуулах / Display**:
- ✅ Амжилттай илгээлээ
- ⏳ "Таны хүсэлт хүлээгдэж байна. 1-2 хоногт батлагдах болно."
- 🔄 **3 секундын дараа** modal автомат хаагдана

---

## 🔄 Төлөвүүд / Application Statuses

### 1️⃣ `not_applied` - Хүсэлт илгээгээгүй
**UI Behavior**:
- Checkbox enabled, энгийн харагдана
- Click → BNPL modal нээгдэнэ

**Badge**: None

---

### 2️⃣ `pending` - Хүлээгдэж байна ⏳
**UI Behavior**:
- Checkbox **disabled**
- Click → Alert: _"Таны хүсэлт хүлээгдэж байна. Батлагдсаны дараа идэвхжүүлэх боломжтой."_

**Badge**: 
```
🟡 PENDING - Шалгагдаж байна
```

---

### 3️⃣ `approved` - Батлагдсан ✅
**UI Behavior**:
- Checkbox **enabled**
- Click → Энгийн toggle (идэвхжүүлэх/идэвхгүй болгох)

**Badge**:
```
🟢 APPROVED - Идэвхжүүлэх боломжтой
```

---

### 4️⃣ `rejected` - Татгалзсан ❌
**UI Behavior**:
- Checkbox **disabled**
- Click → BNPL modal дахин нээгдэнэ (reapply боломжтой)
- Шалтгаан харуулна: `rejectionReason`

**Badge**:
```
🔴 REJECTED - Дахин хүсэлт илгээх боломжтой
Reason: Insufficient monthly revenue
```

---

## 💾 Data Structure

```typescript
interface BNPLApplicationStatus {
  status: 'not_applied' | 'pending' | 'approved' | 'rejected';
  appliedAt?: string;  // ISO timestamp
  provider?: 'storepay' | 'lendpay' | 'simplepay';
  rejectionReason?: string;
}

// Example: Pending application
{
  status: 'pending',
  appliedAt: '2026-01-19T12:00:00Z',
  provider: 'storepay'
}

// Example: Rejected application
{
  status: 'rejected',
  appliedAt: '2026-01-18T10:00:00Z',
  provider: 'lendpay',
  rejectionReason: 'Monthly revenue below minimum threshold (₮500,000)'
}
```

---

## 🔌 Backend Integration

### Submit Application
```typescript
// Frontend submission
const handleBnplSubmit = () => {
  onUpdate({
    fulfillment: {
      ...store.fulfillment,
      bnplApplicationStatus: {
        status: 'pending',
        appliedAt: new Date().toISOString(),
        provider: bnplFormData.provider
      }
    }
  });
};
```

### Admin Approval (Backend)
```sql
-- Approve application
UPDATE businesses 
SET fulfillment = jsonb_set(
  fulfillment,
  '{bnplApplicationStatus,status}',
  '"approved"'
)
WHERE id = 'BIZ-001';

-- Reject with reason
UPDATE businesses 
SET fulfillment = jsonb_set(
  jsonb_set(
    fulfillment,
    '{bnplApplicationStatus,status}',
    '"rejected"'
  ),
  '{bnplApplicationStatus,rejectionReason}',
  '"Insufficient monthly revenue"'
)
WHERE id = 'BIZ-001';
```

---

## 🎨 UI Components

### BNPL Modal Flow
```
┌───────────────────────────────────────┐
│  📋 STEP 1: Terms                     │
│  ┌─────────────────────────────────┐  │
│  │ ⚠️ Important Notice            │  │
│  │ BNPL services may incur fees   │  │
│  └─────────────────────────────────┘  │
│                                       │
│  1. Terms of Service                  │
│  2. Fees and Charges                  │
│  3. Data Privacy                      │
│  4. Disputes and Resolution           │
│                                       │
│  [  Cancel  ]  [ ✓ I Agree ]         │
└───────────────────────────────────────┘
              ↓ (Click "I Agree")
┌───────────────────────────────────────┐
│  📝 STEP 2: Application Form          │
│  ┌─────────────────────────────────┐  │
│  │ Business Name: [Auto-filled]    │  │
│  │ Category:      [Auto-filled]    │  │
│  │ Monthly Revenue: [₮ _______]    │  │
│  │ Avg Order Value: [₮ _______]    │  │
│  │ Provider: [○ StorePay ▼]        │  │
│  └─────────────────────────────────┘  │
│                                       │
│  [  ← Back  ]  [ Submit Application →]│
└───────────────────────────────────────┘
              ↓ (Click "Submit")
┌───────────────────────────────────────┐
│  ✅ STEP 3: Submitted                 │
│  ┌─────────────────────────────────┐  │
│  │     ✓                            │  │
│  │   Success!                       │  │
│  │                                  │  │
│  │   Your application has been      │  │
│  │   submitted successfully.        │  │
│  │                                  │  │
│  │   Status: Pending approval       │  │
│  │   Expected: 1-2 business days    │  │
│  └─────────────────────────────────┘  │
│                                       │
│  Closing automatically in 3s...       │
└───────────────────────────────────────┘
```

---

## ⚠️ Error Handling

| Error | Message (MN) | Message (EN) | Action |
|-------|--------------|--------------|--------|
| Empty fields | Бүх талбарыг бөглөнө үү | Please fill all fields | Show alert |
| Network error | Холболтын алдаа гарлаа | Network error occurred | Retry button |
| Already pending | Таны хүсэлт хүлээгдэж байна | Application already pending | Show status |
| Validation failed | Орлого хангалтгүй байна | Revenue below minimum | Show reason |

---

## 📊 Analytics Events

```typescript
// Track BNPL funnel
analytics.track('bnpl_terms_viewed');
analytics.track('bnpl_terms_accepted');
analytics.track('bnpl_application_started');
analytics.track('bnpl_application_submitted', {
  provider: 'storepay',
  monthly_revenue: 1500000,
  avg_order_value: 45000
});
analytics.track('bnpl_application_approved');
analytics.track('bnpl_enabled');
```

---

## 🧪 Testing Checklist

- [ ] Terms modal opens when clicking BNPL for first time
- [ ] Application form validates all required fields
- [ ] Submission creates `pending` status
- [ ] Pending applications show disabled checkbox with badge
- [ ] Approved applications allow toggle on/off
- [ ] Rejected applications allow reapply
- [ ] Language switching works (MN ↔ EN)
- [ ] Mobile responsive layout
- [ ] Auto-close works after submission (3s)
- [ ] Back button returns to terms

---

**Version**: 1.0  
**Last Updated**: 2026-01-19  
**Status**: ✅ Documentation Complete
