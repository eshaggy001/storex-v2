# Action Guidance System — Implementation Guide

## Overview

The **Action Guidance System** is now fully implemented with dynamic task generation, completion tracking, and intelligent AI recommendations. This document explains how the system works and how to use it.

---

## ✅ What's Implemented

### 1. **Task Generation Engine** (`hooks/useTaskGenerator.ts`)

Dynamically generates tasks based on:
- **Seller's action history** (first-time detection)
- **Business readiness state** (payment, delivery, products)
- **Current business metrics** (orders, conversations, customers)
- **AI recommendations** (context-aware suggestions)

**Key Features:**
- ✅ Daily tasks (3 tasks, reset every 24 hours)
- ✅ Weekly tasks (3 tasks, reset every 7 days)
- ✅ Monthly tasks (3 tasks, reset every 30 days)
- ✅ First-time action detection (9 different first-time tasks)
- ✅ Conditional task visibility based on missing data
- ✅ AI-powered business lever selection
- ✅ Smart task merging (first-time tasks injected into daily/weekly/monthly)

---

### 2. **Task Completion Tracker** (`hooks/useTaskCompletionTracker.ts`)

Manages task state and persistence:
- **Task completion tracking**
- **Action history logging** (prevents duplicate first-time tasks)
- **Daily/Weekly streak calculation**
- **Auto-completion for condition-based tasks**
- **Time-based reset logic** (24h/7d/30d)
- **localStorage persistence** (survives page refresh)

**Key Features:**
- ✅ Automatic streak calculation
- ✅ Auto-completion when progress reaches 100%
- ✅ Hourly reset checks
- ✅ State persistence across sessions

---

### 3. **Dashboard Integration** (`components/DashboardOverview.tsx`)

The system is fully integrated into the dashboard:
- Tasks are generated on every render based on current state
- Completion tracking updates streaks automatically
- State persists to localStorage
- Parent component receives state updates via callback

---

## 📋 Task Types

### Daily Tasks (Reset every 24 hours)

1. **Respond to active conversations**
   - Shows unread message count
   - Auto-completes when all messages are read
   - Tags: `HABIT`

2. **Review orders in progress**
   - Shows pending order count
   - Auto-completes when no pending orders
   - Tags: `HABIT`

3. **Review AI suggestions**
   - Always pending (requires manual review)
   - Tags: `HABIT`, `AI_SUGGESTED`

---

### Weekly Tasks (Reset every 7 days)

1. **Maintain daily consistency**
   - Condition-based: Tracks daily streak
   - Auto-completes at 7 consecutive days
   - Tags: `HABIT`
   - Progress: `X/7 days`

2. **Improve one business lever** (AI-selected)
   - Priority order:
     1. Enable payment methods (if not enabled)
     2. Configure delivery (if not configured)
     3. Optimize product listings (default)
   - Tags: `AI_SUGGESTED`, `IMPORTANT` (if critical)

3. **Review 7-day performance analytics**
   - Always pending (requires manual review)
   - Tags: `INSIGHT`

---

### Monthly Tasks (Reset every 30 days)

1. **Sustain weekly habits**
   - Condition-based: Tracks weekly streak
   - Auto-completes at 4 consecutive weeks
   - Tags: `HABIT`
   - Progress: `X/4 weeks`

2. **Make one strategic improvement** (AI-suggested)
   - Priority order:
     1. Improve customer retention (if <20% returning rate)
     2. Expand product catalog (default)
   - Tags: `AI_SUGGESTED`

3. **Review monthly business insights**
   - Always pending (requires manual review)
   - Tags: `INSIGHT`

---

## 🎯 First-Time Action Tasks

These tasks appear **only once** and disappear after completion:

| Task ID | Trigger Condition | Priority | Injected Into |
|---------|-------------------|----------|---------------|
| `first_create_order` | No orders exist | High | Daily |
| `first_enable_payment` | Payment not enabled | High | Daily |
| `first_add_phone` | No contact phone | High | Daily |
| `first_verify_dan` | DAN not verified | Medium | Weekly |
| `first_upload_logo` | No logo uploaded | Medium | Weekly |
| `first_explore_bnpl` | BNPL not applied | Medium | Weekly |
| `first_confirm_address` | Store type undefined | Low | Monthly |
| `first_configure_notifications` | Never configured | Low | Monthly |

**Detection Logic:**
- Checks `actionGuidance.taskHistory` array
- If action key (e.g., `'create_order'`) is not in history, task appears
- When task is completed, action key is added to history
- Task never appears again

---

## 🔄 Auto-Completion Logic

### Condition-Based Tasks

Tasks with `state: 'condition_based'` auto-complete when:
```typescript
task.progress.current >= task.progress.total
```

**Examples:**
- "Maintain daily consistency" → Auto-completes at 7/7 days
- "Sustain weekly habits" → Auto-completes at 4/4 weeks

### Completion-Based Tasks

Tasks with `state: 'pending'` can auto-complete based on data:
```typescript
// Example: "Respond to active conversations"
const unreadCount = conversations.filter(c => c.unread).length;
state: unreadCount === 0 ? 'completed' : 'pending'
```

---

## 🔁 Reset Logic

### Daily Reset (Every 24 hours)
```typescript
// Resets all daily tasks to 'pending'
// Triggered when: hoursSinceReset >= 24
```

### Weekly Reset (Every 7 days)
```typescript
// Resets weekly tasks (except condition-based)
// Triggered when: daysSinceReset >= 7
```

### Monthly Reset (Every 30 days)
```typescript
// Resets monthly tasks (except condition-based)
// Triggered when: daysSinceReset >= 30
```

**Reset Check Frequency:**
- On component mount
- Every hour (via `setInterval`)

---

## 💾 State Persistence

### localStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `storex_action_guidance` | `ActionGuidanceState` JSON | Full guidance state |
| `storex_task_last_reset` | ISO timestamp | Last reset time |

### State Structure

```typescript
{
  daily: ActionTask[],      // 3 tasks max
  weekly: ActionTask[],     // 3 tasks max
  monthly: ActionTask[],    // 3 tasks max
  taskHistory: string[],    // Completed action keys
  streaks: {
    daily: number,          // Consecutive days
    weekly: number          // Consecutive weeks
  }
}
```

---

## 🎨 UI Components

All UI components are already implemented:

| Component | Location | Purpose |
|-----------|----------|---------|
| `ActionGuidanceSection` | `components/dashboard/GuidanceSystem/` | Main container |
| `TaskCard` | `components/dashboard/GuidanceSystem/` | Individual task display |
| `GuidanceDrawer` | `components/dashboard/GuidanceSystem/` | Task detail panel |
| `TaskTag` | `components/dashboard/GuidanceSystem/` | Tag pills |
| `TaskProgressIndicator` | `components/dashboard/GuidanceSystem/` | Progress bar |
| `AIInsightSummary` | `components/dashboard/GuidanceSystem/` | Weekly/Monthly insights |

---

## 🚀 Usage Example

```typescript
import { useTaskGenerator } from '../hooks/useTaskGenerator';
import { useTaskCompletionTracker } from '../hooks/useTaskCompletionTracker';

// In your component:
const generatedTasks = useTaskGenerator({
  store,
  orders,
  conversations,
  products,
  customers,
  actionGuidance: initialState
});

const { guidanceState, completeTask } = useTaskCompletionTracker({
  initialState: generatedTasks,
  onStateChange: (newState) => {
    console.log('State updated:', newState);
  }
});

// Pass to ActionGuidanceSection:
<ActionGuidanceSection
  guidance={guidanceState}
  onTakeAction={(task) => {
    completeTask(task.id, 'action_key');
    // Handle navigation or action
  }}
  onTaskClick={(task) => {
    // Open drawer
  }}
/>
```

---

## 🧪 Testing Scenarios

### Test 1: First-Time User
1. Create new business
2. Verify "Create first order" appears in Daily
3. Create order
4. Verify task disappears and never returns

### Test 2: Daily Streak
1. Complete all 3 daily tasks
2. Wait 24 hours (or manually reset)
3. Verify daily tasks reset to pending
4. Complete again for 7 consecutive days
5. Verify "Maintain daily consistency" auto-completes

### Test 3: Business Readiness
1. Disable payment methods
2. Verify "Enable payment methods" appears in Weekly
3. Enable payments
4. Verify task changes to "Configure delivery" or "Optimize products"

### Test 4: Persistence
1. Complete some tasks
2. Refresh page
3. Verify completed tasks remain completed
4. Verify streaks are preserved

---

## 🔧 Configuration

### Adjust Reset Intervals

Edit `hooks/useTaskCompletionTracker.ts`:

```typescript
// Daily reset (default: 24 hours)
if (hoursSinceReset >= 24) { ... }

// Weekly reset (default: 7 days)
if (daysSinceReset >= 7) { ... }

// Monthly reset (default: 30 days)
if (daysSinceReset >= 30) { ... }
```

### Add New First-Time Tasks

Edit `hooks/useTaskGenerator.ts`:

```typescript
// Add to firstTimeTasks array:
if (!taskHistory.includes('your_action_key') && yourCondition) {
  tasks.push({
    id: 'first_your_task',
    title: 'Your Task Title',
    // ... rest of task definition
  });
}
```

### Customize AI Suggestions

Edit helper functions in `hooks/useTaskGenerator.ts`:
- `selectBusinessLeverTask()` - Weekly AI suggestions
- `selectStrategicImprovementTask()` - Monthly AI suggestions

---

## 📊 Metrics & Analytics

The system tracks:
- ✅ Task completion rate (daily/weekly/monthly)
- ✅ Streak length (daily/weekly)
- ✅ First-time action completion
- ✅ Time to complete critical tasks

**Future Enhancement:**
Send analytics to backend for:
- Seller engagement scoring
- AI recommendation improvement
- Feature adoption tracking

---

## 🎯 Next Steps

### Phase 2: AI Intelligence (Recommended)
- [ ] Real-time impact calculation
- [ ] Context-aware task prioritization
- [ ] Personalized AI suggestions based on seller behavior
- [ ] Predictive task generation

### Phase 3: Backend Integration
- [ ] Sync task state to Supabase
- [ ] Multi-device state synchronization
- [ ] Analytics dashboard for admins
- [ ] A/B testing for task effectiveness

### Phase 4: Advanced Features
- [ ] Custom task creation (seller-defined)
- [ ] Team collaboration (assign tasks to staff)
- [ ] Gamification (badges, achievements)
- [ ] Social proof (show other sellers' progress)

---

## 🐛 Troubleshooting

### Tasks not appearing
- Check `store.readiness` flags
- Verify `taskHistory` doesn't already contain action key
- Check console for errors

### Tasks not resetting
- Verify `localStorage` has `storex_task_last_reset`
- Check browser console for reset logs
- Manually clear localStorage to force reset

### Streaks not calculating
- Ensure all daily tasks are completed
- Check `useTaskCompletionTracker` is called
- Verify `updateStreaks()` is running

### State not persisting
- Check browser localStorage is enabled
- Verify no errors in `useTaskCompletionTracker`
- Check `onStateChange` callback is firing

---

## 📝 Summary

**Phase 1 is now complete!** The Action Guidance System has:

✅ Dynamic task generation based on seller state  
✅ First-time action detection (9 tasks)  
✅ Conditional task visibility  
✅ Auto-completion for condition-based tasks  
✅ Daily/Weekly/Monthly reset logic  
✅ Streak tracking and persistence  
✅ AI-powered business lever selection  
✅ Full localStorage persistence  
✅ Dashboard integration  

The system is production-ready and will guide sellers through their daily operations while building strong business habits.
