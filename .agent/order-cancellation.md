# Task: Add Order Cancellation Workflow

Implement a premium order cancellation flow with specific reason tracking (Quality, Damaged, Customer Changed Mind). This includes UI updates in Order Detail, a new cancellation modal, and state management consistency.

## 1. ANALYSIS
- **Current State**: Orders have a `CANCELLED` status in `types.ts` but the UI uses `canceled` in `OrdersView.tsx`. No UI exists to trigger cancellation.
- **Requirements**:
    - "Cancel Order" button in `OrderDetail.tsx`.
    - Modal to select reason: Quality Issue, Damaged, Customer Changed Mind.
    - Status transitions: `*` -> `CANCELLED`.
    - Payment adjustment: If `paid`, transition `payment_status` to `REFUNDED` (or similar logic).
    - Consistency: Standardize on `CANCELLED` status across the app.

## 2. PLANNING
- **Files to Modify**:
    - `types.ts`: Add `cancellation_reason` to `Order` interface. Update `OrderStatus` if needed.
    - `components/OrderDetail.tsx`: Add "Cancel Order" button and state for modal.
    - `components/OrdersView.tsx`: Fix `canceled` vs `CANCELLED` typo in filter/map.
    - `App.tsx` (or where state is managed): Ensure `onUpdateOrder` handles the new fields.
- **New Files**:
    - `components/CancelOrderModal.tsx`: Premium selection modal.

## 3. SOLUTIONING
- **Data Model**:
    - `Order` gets: `cancellationReason?: 'quality' | 'damaged' | 'customer_changed_mind' | 'other'`.
    - `Order` gets: `cancelledAt?: string`.
- **UI Design**:
    - Modal: Glassmorphism style, large cards for reasons with icons.
    - Button: "Cancel Order" as a secondary danger action.

## 4. IMPLEMENTATION
- [ ] Update `types.ts`
- [ ] Create `components/CancelOrderModal.tsx`
- [ ] Update `components/OrderDetail.tsx`
- [ ] Update `components/OrdersView.tsx`
- [ ] Update state handler in `App.tsx` (if needed)

## 5. VERIFICATION
- [ ] Test cancellation of a `pending` order.
- [ ] Test cancellation of a `paid` order (check refund status).
- [ ] Verify filter in `OrdersView.tsx` shows cancelled orders.
