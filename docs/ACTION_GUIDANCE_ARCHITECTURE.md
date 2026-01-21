# Action Guidance System — Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DASHBOARD OVERVIEW                              │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  useTaskGenerator()                                           │    │
│  │  ────────────────────────────────────────────────────────────  │    │
│  │                                                                │    │
│  │  INPUT:                                                        │    │
│  │  • store (StoreInfo)                                          │    │
│  │  • orders (Order[])                                           │    │
│  │  • conversations (Conversation[])                             │    │
│  │  • products (Product[])                                       │    │
│  │  • customers (Customer[])                                     │    │
│  │  • actionGuidance (ActionGuidanceState)                       │    │
│  │                                                                │    │
│  │  LOGIC:                                                        │    │
│  │  1. Generate Daily Tasks (3)                                  │    │
│  │     ├─ Respond to conversations                               │    │
│  │     ├─ Review orders in progress                              │    │
│  │     └─ Review AI suggestions                                  │    │
│  │                                                                │    │
│  │  2. Generate Weekly Tasks (3)                                 │    │
│  │     ├─ Maintain daily consistency (condition-based)           │    │
│  │     ├─ Improve business lever (AI-selected)                   │    │
│  │     └─ Review 7-day analytics                                 │    │
│  │                                                                │    │
│  │  3. Generate Monthly Tasks (3)                                │    │
│  │     ├─ Sustain weekly habits (condition-based)                │    │
│  │     ├─ Strategic improvement (AI-suggested)                   │    │
│  │     └─ Review monthly insights                                │    │
│  │                                                                │    │
│  │  4. Generate First-Time Tasks (0-9)                           │    │
│  │     ├─ Check taskHistory for completed actions               │    │
│  │     ├─ Check store state for missing data                    │    │
│  │     └─ Generate tasks for incomplete actions                 │    │
│  │                                                                │    │
│  │  5. Merge Tasks                                               │    │
│  │     ├─ High-priority first-time → Daily                       │    │
│  │     ├─ Medium-priority first-time → Weekly                    │    │
│  │     └─ Low-priority first-time → Monthly                      │    │
│  │                                                                │    │
│  │  OUTPUT: ActionGuidanceState                                  │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                              ↓                                          │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  useTaskCompletionTracker()                                   │    │
│  │  ────────────────────────────────────────────────────────────  │    │
│  │                                                                │    │
│  │  INPUT: generatedTasks (from useTaskGenerator)                │    │
│  │                                                                │    │
│  │  LOGIC:                                                        │    │
│  │  1. Load state from localStorage                              │    │
│  │  2. Track task completion                                     │    │
│  │  3. Update action history                                     │    │
│  │  4. Calculate streaks                                         │    │
│  │  5. Check auto-completion                                     │    │
│  │  6. Check reset conditions                                    │    │
│  │  7. Save state to localStorage                                │    │
│  │                                                                │    │
│  │  AUTO-COMPLETION:                                             │    │
│  │  • Condition-based: progress.current >= progress.total        │    │
│  │  • Data-driven: unreadCount === 0, pendingOrders === 0        │    │
│  │                                                                │    │
│  │  RESET LOGIC:                                                 │    │
│  │  • Daily: Every 24 hours                                      │    │
│  │  • Weekly: Every 7 days                                       │    │
│  │  • Monthly: Every 30 days                                     │    │
│  │  • Check frequency: Hourly + on mount                         │    │
│  │                                                                │    │
│  │  PERSISTENCE:                                                 │    │
│  │  • localStorage key: 'storex_action_guidance'                 │    │
│  │  • Reset timestamp: 'storex_task_last_reset'                  │    │
│  │                                                                │    │
│  │  OUTPUT: { guidanceState, completeTask, ... }                 │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                              ↓                                          │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  ActiveCommandCenter                                          │    │
│  │  ────────────────────────────────────────────────────────────  │    │
│  │                                                                │    │
│  │  PROPS:                                                        │    │
│  │  • actionGuidance = guidanceState                             │    │
│  │  • onGuidanceAction = (task) => {                             │    │
│  │      completeTask(task.id, actionKey);                        │    │
│  │      navigate or perform action;                              │    │
│  │    }                                                           │    │
│  │                                                                │    │
│  │  RENDERS:                                                      │    │
│  │  └─ ActionGuidanceSection                                     │    │
│  │     ├─ Tab Switcher (Daily/Weekly/Monthly)                    │    │
│  │     ├─ Progress Bar                                           │    │
│  │     └─ Task Cards (3 per tab)                                 │    │
│  │        ├─ TaskCard                                            │    │
│  │        │  ├─ Icon                                             │    │
│  │        │  ├─ Tags (TaskTag)                                   │    │
│  │        │  ├─ Title & Description                              │    │
│  │        │  ├─ Progress (if condition-based)                    │    │
│  │        │  └─ Action Indicator                                 │    │
│  │        │                                                       │    │
│  │        └─ onClick → GuidanceDrawer                            │    │
│  │           ├─ Why this matters                                 │    │
│  │           ├─ How to do it                                     │    │
│  │           ├─ AI suggestion                                    │    │
│  │           ├─ Business impact                                  │    │
│  │           └─ Actions: "Do it now" | "Let AI do it"            │    │
│  └───────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────┐
│   User      │
│  Actions    │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  Business State Changes                                     │
│  • Create order → orders.length++                           │
│  • Enable payment → store.readiness.payment_enabled = true  │
│  • Upload logo → store.logo_url = "..."                     │
│  • Read message → conversations[x].unread = false           │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  useTaskGenerator() Re-runs                                 │
│  • Detects state changes                                    │
│  • Regenerates tasks based on new state                     │
│  • Updates first-time task visibility                       │
│  • Recalculates AI suggestions                              │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  useTaskCompletionTracker() Updates                         │
│  • Merges new tasks with existing completion state          │
│  • Preserves completed tasks                                │
│  • Updates auto-completion status                           │
│  • Recalculates streaks                                     │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  UI Re-renders                                              │
│  • ActionGuidanceSection shows updated tasks                │
│  • Progress bars reflect new state                          │
│  • Completed tasks show checkmarks                          │
│  • New first-time tasks appear (if applicable)              │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  User Completes Task                                        │
│  • Clicks "Do it now"                                       │
│  • onGuidanceAction(task) called                            │
│  • completeTask(task.id, actionKey) called                  │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  State Updates                                              │
│  • task.state = 'completed'                                 │
│  • task.completedAt = now                                   │
│  • taskHistory.push(actionKey)                              │
│  • streaks recalculated                                     │
│  • localStorage updated                                     │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  Next Render                                                │
│  • Task shows as completed                                  │
│  • First-time task disappears (if applicable)               │
│  • Streak progress updates                                  │
│  • Auto-completion checked                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Task Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│  TASK CREATION                                              │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  1. Check Conditions                                        │
│     ├─ First-time: !taskHistory.includes(actionKey)        │
│     ├─ Conditional: Check store/business state             │
│     └─ Always: Daily/Weekly/Monthly core tasks             │
│                                                             │
│  2. Generate Task Object                                    │
│     {                                                       │
│       id: string,                                           │
│       title: string,                                        │
│       description: string,                                  │
│       tags: TaskTagType[],                                  │
│       state: 'pending' | 'completed' | 'condition_based',   │
│       progress?: { current, total, unit },                  │
│       whyMatters: string,                                   │
│       howTo: string[],                                      │
│       aiSuggestion: string,                                 │
│       ctaText: string,                                      │
│       ctaAction: string,                                    │
│       icon: string                                          │
│     }                                                       │
│                                                             │
│  3. Merge into Daily/Weekly/Monthly                         │
│     ├─ High priority → Daily                                │
│     ├─ Medium priority → Weekly                             │
│     └─ Low priority → Monthly                               │
└─────────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  TASK DISPLAY                                               │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  • Rendered in ActionGuidanceSection                        │
│  • Shows in appropriate tab (Daily/Weekly/Monthly)          │
│  • Displays tags, progress, icon                            │
│  • Clickable to open GuidanceDrawer                         │
└─────────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  TASK INTERACTION                                           │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  User clicks task → GuidanceDrawer opens                    │
│  ├─ Shows: Why, How, AI Suggestion, Impact                  │
│  └─ Actions: "Do it now" | "Let AI do it"                   │
│                                                             │
│  User clicks "Do it now"                                    │
│  ├─ onGuidanceAction(task) called                           │
│  ├─ completeTask(task.id, actionKey) called                 │
│  └─ Navigation or action performed                          │
└─────────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  TASK COMPLETION                                            │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  1. Update Task State                                       │
│     ├─ state = 'completed'                                  │
│     ├─ completedAt = ISO timestamp                          │
│     └─ UI shows checkmark                                   │
│                                                             │
│  2. Update Action History                                   │
│     ├─ taskHistory.push(actionKey)                          │
│     └─ Prevents task from reappearing                       │
│                                                             │
│  3. Update Streaks                                          │
│     ├─ Check if all daily tasks completed                   │
│     ├─ Increment daily streak                               │
│     └─ Check if weekly streak should increment              │
│                                                             │
│  4. Check Auto-Completion                                   │
│     ├─ Condition-based: progress >= total?                  │
│     └─ Auto-complete if threshold met                       │
│                                                             │
│  5. Persist to localStorage                                 │
│     └─ Save full ActionGuidanceState                        │
└─────────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  TASK RESET (Time-based)                                    │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  Daily (24h):                                               │
│  ├─ Reset all daily tasks to 'pending'                      │
│  ├─ Clear completedAt timestamps                            │
│  └─ Update lastResetDate                                    │
│                                                             │
│  Weekly (7d):                                               │
│  ├─ Reset weekly tasks (except condition-based)             │
│  └─ Preserve streak progress                                │
│                                                             │
│  Monthly (30d):                                             │
│  ├─ Reset monthly tasks (except condition-based)            │
│  └─ Preserve streak progress                                │
└─────────────────────────────────────────────────────────────┘
```

---

## First-Time Task Flow

```
┌─────────────────────────────────────────────────────────────┐
│  NEW SELLER ONBOARDS                                        │
│  taskHistory = []                                           │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  First Render: useTaskGenerator() runs                      │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  Checks:                                                    │
│  ✓ orders.length === 0 → "Create first order" appears      │
│  ✓ !store.logo_url → "Upload logo" appears                 │
│  ✓ !store.phone → "Add phone" appears                      │
│  ✓ !store.readiness.payment_enabled → "Enable payment"     │
│  ✓ !store.readiness.payout_ready → "Verify DAN"            │
│  ... etc (9 total first-time tasks)                        │
│                                                             │
│  Result: 5-7 first-time tasks generated                     │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  Task Merging                                               │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  Daily:   [Create Order, Enable Payment, Add Phone]        │
│  Weekly:  [Daily Consistency, Verify DAN, Upload Logo]     │
│  Monthly: [Weekly Habits, Confirm Address, Configure Notif]│
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  Seller Creates First Order                                 │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  1. User clicks "Create Order" in Orders section            │
│  2. Fills out order form                                    │
│  3. Submits order                                           │
│  4. orders.length++ (now 1)                                 │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  Task Completion Triggered                                  │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  completeTask('first_create_order', 'create_order')         │
│  ├─ task.state = 'completed'                                │
│  ├─ taskHistory.push('create_order')                        │
│  └─ localStorage updated                                    │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  Next Render: useTaskGenerator() runs again                 │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  Checks:                                                    │
│  ✗ taskHistory.includes('create_order') → SKIP             │
│  ✓ !store.logo_url → "Upload logo" still appears           │
│  ✓ !store.phone → "Add phone" still appears                │
│  ... etc                                                    │
│                                                             │
│  Result: "Create first order" task NEVER appears again      │
└─────────────────────────────────────────────────────────────┘
```

---

## Streak Calculation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Day 1: Seller completes all 3 daily tasks                  │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  updateStreaks() called                                     │
│  ├─ Check: all daily tasks completed? YES                   │
│  ├─ streaks.daily = 1                                       │
│  └─ Weekly task progress: 1/7 days                          │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓ (24 hours pass)
       │
┌─────────────────────────────────────────────────────────────┐
│  Day 2: Daily tasks reset                                   │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  checkAndResetTasks() called                                │
│  ├─ hoursSinceReset >= 24? YES                              │
│  ├─ Reset all daily tasks to 'pending'                      │
│  └─ Preserve streak (still 1)                               │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│  Day 2: Seller completes all 3 daily tasks again            │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  updateStreaks() called                                     │
│  ├─ Check: all daily tasks completed? YES                   │
│  ├─ streaks.daily = 2                                       │
│  └─ Weekly task progress: 2/7 days                          │
└──────┬──────────────────────────────────────────────────────┘
       │
       ↓ (Repeat for 5 more days)
       │
┌─────────────────────────────────────────────────────────────┐
│  Day 7: Seller completes all 3 daily tasks                  │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  updateStreaks() called                                     │
│  ├─ Check: all daily tasks completed? YES                   │
│  ├─ streaks.daily = 7                                       │
│  ├─ Weekly task progress: 7/7 days                          │
│  └─ streaks.weekly = 1                                      │
│                                                             │
│  checkAutoCompletion() called                               │
│  ├─ "Maintain daily consistency" task                       │
│  ├─ progress.current (7) >= progress.total (7)? YES         │
│  └─ Auto-complete task!                                     │
└─────────────────────────────────────────────────────────────┘
```

This visual architecture should help understand how all the pieces fit together!
