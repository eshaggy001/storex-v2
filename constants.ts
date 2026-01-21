
import { AppState } from './types';

const MOCK_BUSINESS_ID = 'BIZ-001';
const MOCK_USER_ID = 'USER-001';
const NOW = new Date().toISOString();

export const INITIAL_STATE: AppState = {
  store: {
    id: MOCK_BUSINESS_ID,
    owner_user_id: MOCK_USER_ID,
    name: "",
    category: "",
    city: "",
    phone: "",
    logo_url: "",
    has_physical_store: false,
    physical_address: "",
    status: 'NO_BUSINESS', // Initial state: no business created yet
    created_at: NOW,
    onboardingStep: 0, // Legacy field, will be phased out
    isLive: false, // Legacy field, will be phased out
    connectedChannels: {
      facebook: false,
      instagram: false
    },
    aiConfig: {
      tone: 'professional',
      responseDetail: 'balanced'
    },
    fulfillment: {
      deliveryTypes: [], // Empty initially - non-blocking
      deliveryFee: 0,
      paymentMethods: [], // Empty initially - non-blocking
      afterpayProviders: [],
      bankDetails: {
        bankName: "",
        accountNumber: "",
        accountHolder: "",
        paymentNote: ""
      }
    },
    notifications: {
      newOrders: true,
      lowStock: true,
      paymentPending: false
    },
    tokenUsage: {
      balance: 100,
      limit: 100,
      usedToday: 0,
      estimatedDaysLeft: 0
    },
    readiness: {
      payment_enabled: false, // PAYMENT_DISABLED initially
      delivery_configured: false, // DELIVERY_NOT_CONFIGURED initially
      products_available: false, // NO_PRODUCTS initially
      ai_energy_ok: true, // AI_ENERGY_OK initially
      payout_ready: false // PAYOUT_BLOCKED initially (no DAN verification)
    }
  },
  user: {
    user_id: MOCK_USER_ID,
    fullName: "Admin User",
    email: "admin@storex.mn",
    phoneNumber: "+976 9911-2233",
    avatar: "https://picsum.photos/seed/admin/200/200",
    role: "Owner",
    lastLogin: NOW,
    lastLoginDevice: "MacBook Pro • Ulaanbaatar, MN",
    language: 'mn',
    notifications: {
      personalOrders: true,
      personalPayments: true,
      systemAlerts: true
    }
  },
  products: [], // Empty initially - user will add products after business creation
  orders: [], // Empty initially
  customers: [], // Empty initially
  conversations: [], // Empty initially
  actionGuidance: {
    daily: [],
    weekly: [],
    monthly: [],
    taskHistory: [],
    streaks: {
      daily: 0,
      weekly: 0
    }
  }
};
