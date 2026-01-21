import { useMemo } from 'react';
import { StoreInfo, Order, Conversation, Product, Customer, ActionTask, ActionGuidanceState } from '../types';

interface TaskGeneratorProps {
    store: StoreInfo;
    orders: Order[];
    conversations: Conversation[];
    products: Product[];
    customers: Customer[];
    actionGuidance: ActionGuidanceState;
}

/**
 * Task Generator Hook
 * 
 * Dynamically generates Daily, Weekly, and Monthly tasks based on:
 * - Seller's action history (first-time detection)
 * - Business readiness state
 * - Time-based cadence
 * - AI recommendations
 */
export const useTaskGenerator = ({
    store,
    orders,
    conversations,
    products,
    customers,
    actionGuidance
}: TaskGeneratorProps): ActionGuidanceState => {

    const taskHistory = actionGuidance.taskHistory || [];
    const streaks = actionGuidance.streaks || { daily: 0, weekly: 0 };

    // ============================================================================
    // DAILY TASKS (Reset every 24 hours)
    // ============================================================================
    const dailyTasks = useMemo((): ActionTask[] => {
        const tasks: ActionTask[] = [];

        // Task 1: Respond to active conversations
        const activeConversations = conversations.filter(c => c.status !== 'completed');
        const unreadCount = conversations.filter(c => c.unread).length;

        tasks.push({
            id: 'daily_respond_conversations',
            title: 'Respond to active conversations',
            description: `${unreadCount} unread messages waiting`,
            tags: ['HABIT'],
            state: unreadCount === 0 ? 'completed' : 'pending',
            icon: 'fa-comments',
            whyMatters: 'Fast responses build customer trust and increase conversion rates. AI handles most questions, but some need your personal touch.',
            howTo: [
                'Open Messages from sidebar',
                'Review AI-handled conversations',
                'Reply to messages marked "Requires Action"',
                'Let AI suggest responses if needed'
            ],
            aiSuggestion: unreadCount > 0
                ? `You have ${unreadCount} unread messages. I recommend prioritizing conversations with buying intent first.`
                : 'All conversations are up to date. Great work maintaining fast response times!',
            ctaText: 'View Messages',
            ctaAction: 'navigate:messages',
            impact: 'Faster response time → Higher conversion rate',
            completedAt: unreadCount === 0 ? new Date().toISOString() : undefined
        });

        // Task 2: Review orders in progress
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed');

        tasks.push({
            id: 'daily_review_orders',
            title: 'Review orders in progress',
            description: `${pendingOrders.length} orders need attention`,
            tags: ['HABIT'],
            state: pendingOrders.length === 0 ? 'completed' : 'pending',
            icon: 'fa-truck-fast',
            whyMatters: 'Keeping orders moving prevents delays and keeps customers happy. Daily reviews catch issues early.',
            howTo: [
                'Open Orders from sidebar',
                'Check pending confirmations',
                'Update order status as you fulfill',
                'Mark orders ready for delivery'
            ],
            aiSuggestion: pendingOrders.length > 0
                ? `${pendingOrders.length} orders are waiting. ${pendingOrders.filter(o => o.status === 'pending').length} need confirmation.`
                : 'All orders are on track. No urgent actions needed.',
            ctaText: 'View Orders',
            ctaAction: 'navigate:orders',
            impact: 'Faster fulfillment → More satisfied customers',
            completedAt: pendingOrders.length === 0 ? new Date().toISOString() : undefined
        });

        // Task 3: Review AI suggestions
        tasks.push({
            id: 'daily_review_ai',
            title: 'Review AI suggestions',
            description: 'Check what AI learned today',
            tags: ['HABIT', 'AI_SUGGESTED'],
            state: 'pending',
            icon: 'fa-wand-magic-sparkles',
            whyMatters: 'AI learns from every conversation and order. Daily reviews help you stay in control and improve AI accuracy.',
            howTo: [
                'Check AI activity log in Dashboard',
                'Review auto-responses sent today',
                'Approve or adjust AI suggestions',
                'Update AI tone if needed'
            ],
            aiSuggestion: 'I handled 12 conversations today. 3 resulted in orders. Review my responses to improve accuracy.',
            ctaText: 'View AI Activity',
            ctaAction: 'navigate:dashboard',
            impact: 'Better AI accuracy → More automated sales'
        });

        return tasks;
    }, [conversations, orders]);

    // ============================================================================
    // WEEKLY TASKS
    // ============================================================================
    const weeklyTasks = useMemo((): ActionTask[] => {
        const tasks: ActionTask[] = [];

        // Task 1: Maintain daily consistency (Auto-completes if 7 consecutive days)
        const dailyStreak = streaks.daily;

        tasks.push({
            id: 'weekly_daily_consistency',
            title: 'Maintain daily consistency',
            description: 'Complete daily tasks 7 days in a row',
            tags: ['HABIT'],
            state: 'condition_based',
            progress: {
                current: dailyStreak,
                total: 7,
                unit: 'days'
            },
            icon: 'fa-fire',
            whyMatters: 'Consistency builds strong business habits. Daily engagement keeps your store responsive and growing.',
            howTo: [
                'Complete all 3 daily tasks each day',
                'Check dashboard every morning',
                'Respond to customers within 24 hours',
                'Keep orders moving forward'
            ],
            aiSuggestion: dailyStreak >= 7
                ? '🎉 Amazing! You completed 7 consecutive days. This consistency shows in your metrics.'
                : `You're on a ${dailyStreak}-day streak. Keep going to build strong habits!`,
            ctaText: 'View Daily Tasks',
            ctaAction: 'navigate:dashboard',
            impact: 'Daily habits → Predictable business growth',
            completedAt: dailyStreak >= 7 ? new Date().toISOString() : undefined
        });

        // Task 2: Improve one business lever (AI-selected)
        const improvementTask = selectBusinessLeverTask(store, orders, products, taskHistory);
        tasks.push(improvementTask);

        // Task 3: Review 7-day performance analytics
        tasks.push({
            id: 'weekly_summary',
            title: 'Review 7-day performance analytics',
            description: 'Understand what worked this week',
            tags: ['INSIGHT'],
            state: 'pending',
            icon: 'fa-chart-line',
            whyMatters: 'Weekly reviews reveal patterns you miss daily. Understanding trends helps you make better decisions.',
            howTo: [
                'Open Dashboard analytics',
                'Compare this week vs last week',
                'Identify top-performing products',
                'Review customer feedback patterns'
            ],
            aiSuggestion: 'This week: 23% more orders, 18% faster response time. Your consistency is paying off.',
            ctaText: 'View Analytics',
            ctaAction: 'navigate:dashboard',
            impact: 'Data-driven decisions → Better business outcomes'
        });

        return tasks;
    }, [store, orders, products, taskHistory, streaks.daily]);

    // ============================================================================
    // MONTHLY TASKS
    // ============================================================================
    const monthlyTasks = useMemo((): ActionTask[] => {
        const tasks: ActionTask[] = [];

        // Task 1: Sustain weekly habits (Auto-completes if 4 consecutive weeks)
        const weeklyStreak = streaks.weekly;

        tasks.push({
            id: 'monthly_weekly_consistency',
            title: 'Sustain weekly habits',
            description: 'Complete weekly tasks 4 weeks in a row',
            tags: ['HABIT'],
            state: 'condition_based',
            progress: {
                current: weeklyStreak,
                total: 4,
                unit: 'weeks'
            },
            icon: 'fa-calendar-check',
            whyMatters: 'Monthly consistency transforms habits into business systems. This is how sustainable growth happens.',
            howTo: [
                'Complete all weekly tasks each week',
                'Review weekly analytics consistently',
                'Act on AI recommendations',
                'Maintain daily engagement'
            ],
            aiSuggestion: weeklyStreak >= 4
                ? '🏆 Incredible! 4 weeks of consistency. Your business is now running like a system.'
                : `${weeklyStreak} weeks completed. Keep building toward sustainable growth.`,
            ctaText: 'View Weekly Tasks',
            ctaAction: 'navigate:dashboard',
            impact: 'Weekly consistency → Sustainable business systems',
            completedAt: weeklyStreak >= 4 ? new Date().toISOString() : undefined
        });

        // Task 2: Make one strategic improvement (AI-suggested)
        const strategicTask = selectStrategicImprovementTask(store, orders, customers, taskHistory);
        tasks.push(strategicTask);

        // Task 3: Review monthly business insights
        tasks.push({
            id: 'monthly_summary',
            title: 'Review monthly business insights',
            description: 'Understand your business trajectory',
            tags: ['INSIGHT'],
            state: 'pending',
            icon: 'fa-chart-pie',
            whyMatters: 'Monthly insights reveal your business trajectory. This is where you see real progress and plan ahead.',
            howTo: [
                'Review 30-day performance summary',
                'Compare month-over-month growth',
                'Identify seasonal patterns',
                'Plan next month\'s focus areas'
            ],
            aiSuggestion: 'This month: 45% revenue growth, 12 new returning customers. Your strategic improvements are working.',
            ctaText: 'View Monthly Report',
            ctaAction: 'navigate:dashboard',
            impact: 'Strategic thinking → Long-term business success'
        });

        return tasks;
    }, [store, orders, customers, taskHistory, streaks.weekly]);

    // ============================================================================
    // FIRST-TIME ACTION TASKS (Injected into Daily/Weekly/Monthly)
    // ============================================================================
    const firstTimeTasks = useMemo((): ActionTask[] => {
        const tasks: ActionTask[] = [];

        // Create first order
        if (!taskHistory.includes('create_order') && orders.length === 0) {
            tasks.push({
                id: 'first_create_order',
                title: 'Create your first order',
                description: 'Start tracking sales in Storex',
                tags: ['FIRST_TIME', 'IMPORTANT'],
                state: 'pending',
                icon: 'fa-cart-plus',
                whyMatters: 'Your first order teaches the system how you sell. This unlocks AI selling capabilities.',
                howTo: [
                    'Go to Orders section',
                    'Click "Create Order"',
                    'Add customer and products',
                    'Choose payment and delivery method'
                ],
                aiSuggestion: 'Create your first order to unlock AI-powered selling. I\'ll learn from this to help future customers.',
                ctaText: 'Create Order',
                ctaAction: 'navigate:orders',
                impact: 'First order → AI learns your selling process'
            });
        }

        // Verify DAN
        if (!taskHistory.includes('verify_dan') && store.readiness && !store.readiness.payout_ready) {
            tasks.push({
                id: 'first_verify_dan',
                title: 'Verify your identity (DAN)',
                description: 'Required to receive payouts',
                tags: ['FIRST_TIME', 'IMPORTANT'],
                state: 'pending',
                icon: 'fa-id-card',
                whyMatters: 'Identity verification is required by law to receive payouts. It protects both you and your customers.',
                howTo: [
                    'Go to Wallet section',
                    'Click "Verify Identity"',
                    'Upload your national ID (DAN)',
                    'Wait for verification (usually 24 hours)'
                ],
                aiSuggestion: 'Complete DAN verification to unlock payouts. This is a one-time process required by financial regulations.',
                ctaText: 'Verify Now',
                ctaAction: 'navigate:wallet',
                impact: 'DAN verified → Payouts unlocked'
            });
        }

        // Upload business logo
        if (!taskHistory.includes('upload_logo') && !store.logo_url) {
            tasks.push({
                id: 'first_upload_logo',
                title: 'Upload business logo',
                description: 'Build customer trust and recognition',
                tags: ['FIRST_TIME'],
                state: 'pending',
                icon: 'fa-image',
                whyMatters: 'A logo makes your business look professional and builds customer trust. It appears in AI messages and order confirmations.',
                howTo: [
                    'Go to Settings → Business Info',
                    'Click "Upload Logo"',
                    'Choose image (or import from Instagram/Facebook)',
                    'Save changes'
                ],
                aiSuggestion: 'Add your logo to increase customer trust. I can import it from your Instagram or Facebook profile.',
                ctaText: 'Add Logo',
                ctaAction: 'navigate:settings',
                impact: 'Professional branding → Higher customer trust'
            });
        }

        // Add contact phone
        if (!taskHistory.includes('add_phone') && !store.phone) {
            tasks.push({
                id: 'first_add_phone',
                title: 'Add contact phone number',
                description: 'Enable customer communication',
                tags: ['FIRST_TIME', 'IMPORTANT'],
                state: 'pending',
                icon: 'fa-phone',
                whyMatters: 'Customers need a way to reach you for delivery coordination and support. This is essential for order fulfillment.',
                howTo: [
                    'Go to Settings → Business Info',
                    'Add contact phone number',
                    'Optionally add secondary contact',
                    'Save changes'
                ],
                aiSuggestion: 'Add your contact phone to enable delivery coordination and customer support.',
                ctaText: 'Add Phone',
                ctaAction: 'navigate:settings',
                impact: 'Contact info → Smooth order fulfillment'
            });
        }

        // Confirm store address or mark as online-only
        if (!taskHistory.includes('confirm_address') && store.has_physical_store === undefined) {
            tasks.push({
                id: 'first_confirm_address',
                title: 'Confirm store type',
                description: 'Physical store or online-only?',
                tags: ['FIRST_TIME'],
                state: 'pending',
                icon: 'fa-store',
                whyMatters: 'Knowing your store type helps AI provide accurate delivery options and customer information.',
                howTo: [
                    'Go to Settings → Business Info',
                    'Choose "Physical Store" or "Online Only"',
                    'If physical, add store address',
                    'Save changes'
                ],
                aiSuggestion: 'Tell me if you have a physical store. This helps me give customers accurate pickup and delivery options.',
                ctaText: 'Confirm Store Type',
                ctaAction: 'navigate:settings',
                impact: 'Store type confirmed → Better customer experience'
            });
        }

        // Enable payment methods
        if (!taskHistory.includes('enable_payment') && store.readiness && !store.readiness.payment_enabled) {
            tasks.push({
                id: 'first_enable_payment',
                title: 'Enable payment methods',
                description: 'Required to receive payments',
                tags: ['FIRST_TIME', 'IMPORTANT'],
                state: 'pending',
                icon: 'fa-credit-card',
                whyMatters: 'You need at least one payment method enabled to receive payments from customers.',
                howTo: [
                    'Go to Settings → Payment Methods',
                    'Enable at least one method (Cash, Bank Transfer, QPay)',
                    'Add bank details if using Bank Transfer',
                    'Save changes'
                ],
                aiSuggestion: 'Enable payment methods to start receiving payments. I recommend enabling multiple options for customer convenience.',
                ctaText: 'Enable Payments',
                ctaAction: 'navigate:settings',
                impact: 'Payments enabled → Start receiving money'
            });
        }

        // Explore BNPL options
        if (!taskHistory.includes('explore_bnpl') && store.fulfillment?.bnplApplicationStatus?.status === 'not_applied') {
            tasks.push({
                id: 'first_explore_bnpl',
                title: 'Explore BNPL options',
                description: 'Increase sales with buy-now-pay-later',
                tags: ['FIRST_TIME'],
                state: 'pending',
                icon: 'fa-calendar-days',
                whyMatters: 'BNPL increases average order value by 30-40%. Customers can buy more without paying upfront.',
                howTo: [
                    'Go to Settings → Payment Methods',
                    'Review BNPL providers (StorePay, LendPay, SimplePay)',
                    'Apply to providers that fit your business',
                    'Wait for approval (usually 2-3 days)'
                ],
                aiSuggestion: 'BNPL can significantly increase your sales. I recommend applying to at least 2 providers for better approval chances.',
                ctaText: 'Explore BNPL',
                ctaAction: 'navigate:settings',
                impact: 'BNPL enabled → 30-40% higher order value'
            });
        }

        // Configure notifications
        if (!taskHistory.includes('configure_notifications')) {
            tasks.push({
                id: 'first_configure_notifications',
                title: 'Configure notifications',
                description: 'Stay informed about important events',
                tags: ['FIRST_TIME'],
                state: 'pending',
                icon: 'fa-bell',
                whyMatters: 'Smart notifications keep you informed without overwhelming you. Configure what matters most to your business.',
                howTo: [
                    'Go to Settings → Notifications',
                    'Enable notifications for critical events',
                    'Disable low-priority notifications',
                    'Choose notification channels (App, Email, SMS)'
                ],
                aiSuggestion: 'Configure notifications to stay informed without getting overwhelmed. I recommend enabling order and payment notifications.',
                ctaText: 'Configure Notifications',
                ctaAction: 'navigate:settings',
                impact: 'Smart notifications → Never miss important events'
            });
        }

        return tasks;
    }, [store, orders, taskHistory]);

    // ============================================================================
    // MERGE FIRST-TIME TASKS INTO DAILY/WEEKLY/MONTHLY
    // ============================================================================
    const mergedDaily = useMemo(() => {
        // Inject high-priority first-time tasks into daily
        const highPriorityFirstTime = firstTimeTasks.filter(t =>
            t.tags.includes('IMPORTANT') &&
            ['first_create_order', 'first_enable_payment', 'first_add_phone'].includes(t.id)
        );
        return [...highPriorityFirstTime, ...dailyTasks].slice(0, 3); // Max 3 daily tasks
    }, [dailyTasks, firstTimeTasks]);

    const mergedWeekly = useMemo(() => {
        // Inject medium-priority first-time tasks into weekly
        const mediumPriorityFirstTime = firstTimeTasks.filter(t =>
            !t.tags.includes('IMPORTANT') &&
            ['first_verify_dan', 'first_upload_logo', 'first_explore_bnpl'].includes(t.id)
        );
        return [...weeklyTasks.slice(0, 2), ...mediumPriorityFirstTime, weeklyTasks[2]].slice(0, 3);
    }, [weeklyTasks, firstTimeTasks]);

    const mergedMonthly = useMemo(() => {
        // Inject low-priority first-time tasks into monthly
        const lowPriorityFirstTime = firstTimeTasks.filter(t =>
            ['first_confirm_address', 'first_configure_notifications'].includes(t.id)
        );
        return [...monthlyTasks.slice(0, 2), ...lowPriorityFirstTime, monthlyTasks[2]].slice(0, 3);
    }, [monthlyTasks, firstTimeTasks]);

    return {
        daily: mergedDaily,
        weekly: mergedWeekly,
        monthly: mergedMonthly,
        taskHistory,
        streaks
    };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Select which business lever to improve (AI logic)
 */
function selectBusinessLeverTask(
    store: StoreInfo,
    orders: Order[],
    products: Product[],
    taskHistory: string[]
): ActionTask {
    // AI selects based on current business state
    // Priority: Payment > Delivery > BNPL > Notifications

    if (!store.readiness?.payment_enabled) {
        return {
            id: 'weekly_improve_payment',
            title: 'Enable payment methods',
            description: 'Critical for receiving payments',
            tags: ['AI_SUGGESTED', 'IMPORTANT'],
            state: 'pending',
            icon: 'fa-credit-card',
            whyMatters: 'Payment methods are essential for completing sales. Without them, customers cannot pay you.',
            howTo: [
                'Go to Settings → Payment Methods',
                'Enable at least one payment method',
                'Add bank details if needed',
                'Test with a small order'
            ],
            aiSuggestion: 'Enabling payments is your top priority. I recommend starting with Cash on Delivery and Bank Transfer.',
            ctaText: 'Enable Payments',
            ctaAction: 'navigate:settings',
            impact: 'Payments enabled → Start receiving money'
        };
    }

    if (!store.readiness?.delivery_configured) {
        return {
            id: 'weekly_improve_delivery',
            title: 'Configure delivery options',
            description: 'Set up how you fulfill orders',
            tags: ['AI_SUGGESTED'],
            state: 'pending',
            icon: 'fa-truck',
            whyMatters: 'Clear delivery options reduce customer confusion and speed up order fulfillment.',
            howTo: [
                'Go to Settings → Delivery',
                'Enable delivery and/or pickup',
                'Set delivery fee (if applicable)',
                'Define delivery areas'
            ],
            aiSuggestion: 'Configure delivery to complete your selling setup. Most businesses offer both delivery and pickup.',
            ctaText: 'Configure Delivery',
            ctaAction: 'navigate:settings',
            impact: 'Delivery configured → Faster order fulfillment'
        };
    }

    // Default: Improve product catalog
    return {
        id: 'weekly_improve_products',
        title: 'Optimize product listings',
        description: 'Improve photos and descriptions',
        tags: ['AI_SUGGESTED'],
        state: 'pending',
        icon: 'fa-sparkles',
        whyMatters: 'Better product listings increase conversion rates. Clear photos and descriptions reduce customer questions.',
        howTo: [
            'Go to Products',
            'Review products with low views',
            'Add better photos',
            'Improve descriptions with AI'
        ],
        aiSuggestion: `I noticed ${products.filter(p => !p.images || p.images.length < 2).length} products have only 1 photo. Adding more photos can increase sales by 20%.`,
        ctaText: 'Optimize Products',
        ctaAction: 'navigate:products',
        impact: 'Better listings → Higher conversion rates'
    };
}

/**
 * Select strategic improvement for monthly (AI logic)
 */
function selectStrategicImprovementTask(
    store: StoreInfo,
    orders: Order[],
    customers: Customer[],
    taskHistory: string[]
): ActionTask {
    const returningCustomers = customers.filter(c => c.status === 'RETURNING').length;
    const totalCustomers = customers.length;
    const returningRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

    if (returningRate < 20) {
        return {
            id: 'monthly_improve_retention',
            title: 'Improve customer retention',
            description: 'Turn one-time buyers into repeat customers',
            tags: ['AI_SUGGESTED'],
            state: 'pending',
            icon: 'fa-heart',
            whyMatters: 'Repeat customers are 5x more valuable than new customers. Retention is the key to sustainable growth.',
            howTo: [
                'Review customer purchase patterns',
                'Enable AI follow-up automation',
                'Offer loyalty incentives',
                'Improve post-purchase experience'
            ],
            aiSuggestion: `Only ${returningRate.toFixed(0)}% of customers return. I can help with automated follow-ups and personalized offers.`,
            ctaText: 'Improve Retention',
            ctaAction: 'navigate:customers',
            impact: 'Better retention → 5x customer lifetime value'
        };
    }

    // Default: Expand product catalog
    return {
        id: 'monthly_expand_catalog',
        title: 'Expand product catalog',
        description: 'Add complementary products',
        tags: ['AI_SUGGESTED'],
        state: 'pending',
        icon: 'fa-box-open',
        whyMatters: 'More product variety increases average order value and attracts different customer segments.',
        howTo: [
            'Analyze top-selling products',
            'Identify complementary items',
            'Add 3-5 new products',
            'Use AI to generate listings'
        ],
        aiSuggestion: 'Your top products are selling well. Adding complementary items can increase average order value by 25%.',
        ctaText: 'Add Products',
        ctaAction: 'navigate:products',
        impact: 'More variety → Higher average order value'
    };
}

export default useTaskGenerator;
