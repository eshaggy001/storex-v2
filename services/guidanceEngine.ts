import { AppState, ActionGuidanceState, ActionTask, TaskTagType, TaskState } from '../types';

// Task Templates - Based on the "Action Guidance System" principle
const TASK_TEMPLATES: Record<string, Partial<ActionTask>> = {
    // DAILY
    respond_messages: {
        title: 'Respond to urgent chats',
        description: '3 MESSAGES REQUIRE HUMAN CL...',
        tags: ['AI_SUGGESTED', 'HABIT'],
        whyMatters: 'Fast response times increase conversion by up to 40%.',
        howTo: [
            'Open the Messages view from the sidebar',
            'Look for conversations with blue "requires action" badges',
            'Reply manually or review AI-generated draft responses'
        ],
        ctaText: 'Хариу бичих',
        ctaAction: 'navigate:messages',
        icon: 'fa-comments'
    },
    confirm_orders: {
        title: 'Review AI Draft Orders',
        description: 'ENSURES DELIVERY ACCURACY F...',
        tags: ['HABIT', 'IMPORTANT'],
        whyMatters: 'Quick confirmation builds customer trust and reduces cancellation rates.',
        howTo: [
            'Go to the Orders section',
            'Select orders with "Pending" status',
            'Click the "Confirm Order" button to notify the customer'
        ],
        ctaText: 'Захиалга хянах',
        ctaAction: 'navigate:orders',
        icon: 'fa-receipt'
    },
    add_product: {
        title: 'Verify DAN for Payouts',
        description: 'REQUIRED FOR RECEIVING AUTOM...',
        tags: ['FIRST_TIME', 'IMPORTANT', 'HOW_TO'],
        whyMatters: 'Maintaining a fresh inventory keeps customers coming back to your store.',
        howTo: [
            'Click on the "Add Product" button',
            'Upload 2-3 high-quality photos',
            'Provide a price and title (AI can help with the rest)'
        ],
        ctaText: 'Одоо баталгаажуулах',
        ctaAction: 'action:add_product',
        icon: 'fa-id-card'
    },

    // WEEKLY
    weekly_habit: {
        title: '7-Day Operating Streak',
        description: 'Maintain consistency in your daily operations.',
        tags: ['HABIT', 'IMPORTANT'],
        whyMatters: 'Professional sellers succeed through consistent daily habits, not bursts.',
        howTo: [
            'Complete all 3 daily tasks every day',
            'Check your dashboard daily to see your streak progress'
        ],
        ctaText: 'View Habit Stats',
        ctaAction: 'view:progress'
    },
    setup_payments: {
        title: 'Verify Payout Identity',
        description: 'Complete DAN verification to secure your payouts.',
        tags: ['FIRST_TIME', 'IMPORTANT', 'HOW_TO'],
        whyMatters: 'Identity verification is required by financial regulations to release your funds.',
        howTo: [
            'Navigate to Settings > Payouts',
            'Upload a clear photo of your ID',
            'Wait 24 hours for automated verification'
        ],
        ctaText: 'Start Verification',
        ctaAction: 'navigate:settings'
    },
    weekly_insight: {
        title: 'Weekly Performance Review',
        description: 'Analyze your 7-day growth and trends.',
        tags: ['INSIGHT'],
        whyMatters: 'Weekly reviews help you identify which products are trending and why.',
        howTo: [
            'Scroll down to the analytics section',
            'Examine the Revenue and Conversation charts',
            'Note any spikes in activity'
        ],
        ctaText: 'View Insights',
        ctaAction: 'view:analytics'
    },

    // MONTHLY
    monthly_habit: {
        title: 'Monthly Momentum',
        description: 'Complete weekly guidance cycles for stability.',
        tags: ['HABIT'],
        whyMatters: 'Long-term business growth is built on monthly recurring operational stability.',
        howTo: [
            'Complete your weekly tasks for 4 consecutive weeks',
            'Watch your efficiency score improve'
        ],
        ctaText: 'Check Momentum',
        ctaAction: 'view:progress'
    },
    explore_bnpl: {
        title: 'Explore BNPL Setup',
        description: 'Enable "Sell now, pay later" for your store.',
        tags: ['FIRST_TIME', 'AI_SUGGESTED', 'HOW_TO'],
        whyMatters: 'Enabling Afterpay (Storepay/Lendpay) can increase average order value by 30%.',
        howTo: [
            'Navigate to Settings > Payment Methods',
            'Click "Apply" next to Afterpay providers',
            'Fill out the brief merchant application'
        ],
        ctaText: 'Explore Afterpay',
        ctaAction: 'navigate:settings'
    },
    monthly_insight: {
        title: 'Monthly Strategic Review',
        description: 'Deep dive into your AI-generated monthly summary.',
        tags: ['INSIGHT', 'AI_SUGGESTED'],
        whyMatters: 'A strategic review ensures you’re making data-driven decisions for next month.',
        howTo: [
            'Review your Monthly Revenue vs. Previous Month',
            'Check Customer Satisfaction and response metrics',
            'Read AI suggestions for inventory levels'
        ],
        ctaText: 'Review Strategy',
        ctaAction: 'view:monthly_insight'
    }
};

/**
 * Derived Task Engine
 * Synchronizes guidance system based on overall AppState
 * No hardcoded logic in the UI - everything flows from here
 */
export function deriveActionGuidance(state: AppState): ActionGuidanceState {
    const { taskHistory, streaks } = state.actionGuidance;

    // 1. DAILY (Always 3 tasks)
    const dailyTasks: ActionTask[] = [
        createTask('respond_messages',
            state.conversations.some(c => c.unread) ? 'pending' : 'completed'
        ),
        createTask('confirm_orders',
            state.orders.some(o => o.status === 'pending') ? 'pending' : 'completed'
        ),
        createTask('add_product',
            state.products.length > 0 ? 'completed' : 'pending'
        )
    ];

    // 2. WEEKLY (Always 3 tasks)
    const weeklyTasks: ActionTask[] = [
        createTask('weekly_habit',
            streaks.daily >= 7 ? 'completed' : 'condition_based',
            { current: streaks.daily, total: 7, unit: 'days' }
        ),
        createTask('setup_payments',
            state.store.readiness.payout_ready ? 'completed' : 'pending'
        ),
        createTask('weekly_insight',
            taskHistory.includes('view_weekly_insight') ? 'completed' : 'pending'
        )
    ];

    // 3. MONTHLY (Always 3 tasks)
    const monthlyTasks: ActionTask[] = [
        createTask('monthly_habit',
            streaks.weekly >= 4 ? 'completed' : 'condition_based',
            { current: streaks.weekly, total: 4, unit: 'weeks' }
        ),
        createTask('explore_bnpl',
            state.store.fulfillment.afterpayProviders && state.store.fulfillment.afterpayProviders.length > 0 ? 'completed' : 'pending'
        ),
        createTask('monthly_insight',
            taskHistory.includes('view_monthly_insight') ? 'completed' : 'pending'
        )
    ];

    return {
        ...state.actionGuidance,
        daily: dailyTasks,
        weekly: weeklyTasks,
        monthly: monthlyTasks
    };
}

function createTask(id: string, state: TaskState, progress?: { current: number; total: number; unit: string }): ActionTask {
    const template = TASK_TEMPLATES[id] || {
        title: id,
        description: '',
        tags: [],
        whyMatters: '',
        howTo: [],
        ctaText: '',
        ctaAction: ''
    };

    return {
        id,
        title: template.title as string,
        description: template.description as string,
        tags: template.tags as TaskTagType[],
        state: state,
        progress,
        whyMatters: template.whyMatters as string,
        howTo: template.howTo as string[],
        aiSuggestion: template.aiSuggestion || 'I recommend completing this to unlock higher efficiency scores.',
        ctaText: template.ctaText as string,
        ctaAction: template.ctaAction as string,
        icon: template.icon as string,
        impact: template.impact || (state === 'completed' ? 'Response speed improved by 22%' : 'Pending impact analysis...')
    };
}
