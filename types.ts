
export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number | 'unlimited';
  images: string[];
  category: 'Apparel' | 'Food & Beverage' | 'Beauty & Personal Care' | 'Electronics' | 'Services' | 'Other';
  status: 'active' | 'inactive';
  availabilityType: 'ready' | 'made_to_order';
  deliveryDays?: number;
  deliveryOptions: ('courier' | 'pickup' | 'none')[];
  // Unified Structured Attributes (Shopify style)
  options?: ProductOption[];
  // AI suggestions
  seoTitle?: string;
  seoDescription?: string;
  productType?: string;
  tags?: string[];
  // Discount support
  discount?: {
    type: 'sale_price' | 'percentage';
    value: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber?: string;
  channel: 'facebook' | 'instagram' | 'web' | 'phone';
  ordersCount: number;
  totalSpent: number;
  firstInteraction: string;
  lastInteraction: string;
  status: 'new' | 'returning';
  aiInsight?: string;
  source?: 'manual' | 'auto';
  note?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber?: string;
  channel: 'facebook' | 'instagram' | 'web' | 'facebook_comment';
  items: { productId: string; quantity: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'paid' | 'completed';
  createdAt: string;
  isAiGenerated: boolean;
  // Enhanced fields for MVP delivery and payment
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  paymentMethod: 'cash_on_delivery' | 'bank_transfer' | 'online' | 'qpay' | 'afterpay';
  deliveryMethod: 'courier' | 'pickup';
  deliveryAddress?: string;
  aiSummary?: string;
  nextBestAction?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'customer';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerAvatar?: string;
  channel: 'facebook' | 'instagram';
  lastMessage: string;
  timestamp: string;
  status: 'ai_handling' | 'requires_action' | 'completed';
  unread: boolean;
  messages: Message[];
}

export interface TokenUsage {
  balance: number;
  limit: number;
  usedToday: number;
  estimatedDaysLeft: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  avatar: string;
  role: 'Owner' | 'Admin' | 'Staff';
  lastLogin: string;
  language: 'mn' | 'en';
  notifications: {
    personalOrders: boolean;
    personalPayments: boolean;
    systemAlerts: boolean;
  };
}

export interface StoreInfo {
  name: string;
  category: string;
  city: string;
  phone: string;
  logo?: string;
  onboardingStep: number;
  isLive: boolean;
  connectedChannels: {
    facebook: boolean;
    instagram: boolean;
  };
  aiConfig: {
    tone: 'friendly' | 'professional';
    responseDetail: 'short' | 'balanced' | 'detailed';
  };
  fulfillment: {
    deliveryTypes: ('courier' | 'pickup')[];
    paymentMethods: ('cash_on_delivery' | 'bank_transfer' | 'online' | 'qpay' | 'afterpay')[];
    afterpayProviders?: ('storepay' | 'lendpay' | 'simplepay')[];
    bankDetails?: {
      bankName: string;
      accountNumber: string;
      accountHolder: string;
      paymentNote?: string;
    };
  };
  notifications: {
    newOrders: boolean;
    lowStock: boolean;
    paymentPending: boolean;
  };
  tokenUsage: TokenUsage;
}

export interface AppState {
  store: StoreInfo;
  user: UserProfile;
  products: Product[];
  orders: Order[];
  conversations: Conversation[];
  customers: Customer[];
}
