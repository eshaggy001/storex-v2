import { supabase } from './supabase';
import { AppState, StoreInfo, Product, Order, Customer, Conversation, Message } from '../types';
import { INITIAL_STATE } from '../constants';

// Helper to map DB Product to App Product
const mapProduct = (data: any): Product => ({
    id: data.id,
    business_id: data.business_id,
    name: data.name,
    price: Number(data.price),
    description: data.description,
    stock: data.stock,
    images: data.images || [],
    category: data.category,
    status: data.status,
    created_by: data.created_by,
    created_at: data.created_at,
    updated_at: data.updated_at,
    availabilityType: data.availability_type,
    deliveryDays: data.delivery_days,
    deliveryOptions: data.delivery_options || [],
    options: data.options,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    productType: data.product_type,
    tags: data.tags,
    discount: data.discount,
});

// Helper to map DB Customer to App Customer
const mapCustomer = (data: any): Customer => ({
    id: data.id,
    business_id: data.business_id,
    name: data.name,
    phone: data.phone_number,
    channel: data.channel,
    total_orders: data.orders_count,
    total_spend: Number(data.total_spent),
    ordersCount: data.orders_count,
    totalSpent: Number(data.total_spent),
    firstInteraction: data.first_interaction,
    lastInteraction: data.last_interaction,
    created_at: data.created_at,
    status: data.status,
    aiInsight: data.ai_insight,
    source: data.source,
    note: data.note,
});

// Helper to map DB Order to App Order
const mapOrder = (data: any, items: any[]): Order => ({
    id: data.id,
    business_id: data.business_id,
    customer_id: data.customer_id,
    customerName: data.customer_name || '',
    phoneNumber: data.phone_number,
    channel: data.channel,
    items: items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
    })),
    total: Number(data.total),
    total_amount: Number(data.total),
    status: data.status,
    order_status: data.order_status,
    payment_status: data.payment_status,
    delivery_status: data.delivery_status,
    source: data.source,
    created_by: data.created_by,
    created_at: data.created_at,
    isAiGenerated: data.is_ai_generated,
    paymentMethod: data.payment_method,
    deliveryMethod: data.delivery_method,
    deliveryAddress: data.delivery_address,
    paymentStatus: data.payment_status?.toLowerCase() || 'unpaid',
    aiSummary: data.ai_summary,
    nextBestAction: data.next_best_action,
});


// Helper to map DB Conversation to App Conversation
const mapConversation = (data: any, messages: any[]): Conversation => ({
    id: data.id,
    customerName: data.customer_name,
    customerAvatar: data.customer_avatar,
    channel: data.channel,
    lastMessage: data.last_message,
    timestamp: data.timestamp, // Assuming string format is compatible
    status: data.status,
    unread: data.unread,
    messages: messages.map(m => ({
        id: m.id,
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp,
    })),
});

export const fetchInitialState = async (): Promise<AppState> => {
    // If Supabase is not configured, return mock data immediately
    if (!supabase) {
        console.log('Supabase not configured. Using mock data from INITIAL_STATE.');
        return INITIAL_STATE;
    }

    try {
        // 1. Fetch Store
        const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .select('*')
            .limit(1)
            .single();

        if (storeError) throw storeError;

        // Map store data
        const store: StoreInfo = {
            id: storeData.id,
            owner_user_id: storeData.owner_user_id,
            name: storeData.name,
            category: storeData.category,
            city: storeData.city,
            phone: storeData.phone,
            logo_url: storeData.logo,
            has_physical_store: storeData.has_physical_store,
            physical_address: storeData.physical_address,
            status: storeData.status,
            created_at: storeData.created_at,
            onboardingStep: 0, // Force onboarding for demo
            isLive: false, // Force onboarding for demo
            connectedChannels: storeData.connected_channels,
            aiConfig: storeData.ai_config,
            fulfillment: storeData.fulfillment,
            notifications: storeData.notifications,
            tokenUsage: storeData.token_usage,
            readiness: storeData.readiness || {
                payment_enabled: false,
                delivery_configured: false,
                products_available: false,
                ai_energy_ok: true,
                payout_ready: false
            }
        };

        const user = storeData.user_profile; // We stored user profile in the store table for now

        // 2. Fetch Products
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        const products = productsData.map(mapProduct);

        // 3. Fetch Customers
        const { data: customersData, error: customersError } = await supabase
            .from('customers')
            .select('*');

        if (customersError) throw customersError;
        const customers = customersData.map(mapCustomer);

        // 4. Fetch Orders & Order Items
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*, order_items(*)');

        if (ordersError) throw ordersError;
        const orders = ordersData.map((order: any) => mapOrder(order, order.order_items));

        // 5. Fetch Conversations & Messages
        const { data: conversationsData, error: conversationsError } = await supabase
            .from('conversations')
            .select('*, messages(*)')
            .order('timestamp', { ascending: false });

        if (conversationsError) throw conversationsError;

        // Sort messages within conversation (optional if DB returns unordered)
        const conversations = conversationsData.map((conv: any) => {
            const sortedMessages = (conv.messages || []).sort((a: any, b: any) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            return mapConversation(conv, sortedMessages);
        });

        return {
            store,
            user,
            products,
            customers,
            orders,
            conversations,
            actionGuidance: INITIAL_STATE.actionGuidance,
        };

    } catch (error) {
        console.error('Error fetching data from Supabase:', error);
        console.log('Falling back to local INITIAL_STATE');
        return INITIAL_STATE;
    }
};
