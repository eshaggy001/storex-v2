// ============================================================================
// Storex Data Model - Based on storex-scope/05_data_dictionary.md
// ============================================================================
// This file defines the core data objects aligned with the Storex scope.
// Architecture: State-driven, AI-first, Social commerce selling
// ============================================================================

// ----------------------------------------------------------------------------
// 1. USER ACCESS STATE MACHINE
// ----------------------------------------------------------------------------
// Governs user authentication and access to the system
// Transitions: ANONYMOUS → AUTHENTICATED (via signup/login)
//              AUTHENTICATED ↔ PASSWORD_RESET (via forgot password)
export type UserAccessState = 'ANONYMOUS' | 'AUTHENTICATED' | 'PASSWORD_RESET';

// Legacy alias for backward compatibility
export type UserStatus = 'ANONYMOUS' | 'AUTHENTICATED';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  password_hash?: string;
  status: UserAccessState; // Updated to use state machine
  created_at: string;
  last_login_at?: string;
}

export interface UserProfile {
  user_id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  role: 'Owner' | 'Admin' | 'Staff';
  lastLogin: string;
  lastLoginDevice?: string;
  language: 'mn' | 'en';
  notifications: {
    personalOrders: boolean;
    personalPayments: boolean;
    systemAlerts: boolean;
  };
}

// ----------------------------------------------------------------------------
// 2. BUSINESS ACCESS STATE MACHINE (Referral-Gated)
// ----------------------------------------------------------------------------
// Governs business creation and activation
// Transitions:
//   NO_BUSINESS → REFERRAL_REQUIRED (user attempts to create business)
//   REFERRAL_REQUIRED → BUSINESS_CREATED (valid referral code submitted)
//   REFERRAL_REQUIRED → ACCESS_REQUESTED (no/invalid referral code)
//   BUSINESS_CREATED → ACTIVE (business name + category saved)
export type BusinessAccessState =
  | 'NO_BUSINESS'
  | 'REFERRAL_REQUIRED'
  | 'ACCESS_REQUESTED'
  | 'BUSINESS_CREATED'
  | 'ACTIVE';

// Legacy alias for backward compatibility
export type BusinessStatus = 'NO_BUSINESS' | 'BUSINESS_CREATED' | 'ACTIVE';

export interface Business {
  id: string;
  owner_user_id: string;
  name: string;
  category: string;
  city: string;
  logo_url?: string;
  phone?: string;
  status: BusinessAccessState; // Updated to use state machine
  referral_code_used?: string;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 3. BUSINESS READINESS FLAGS (Parallel, Independent States)
// ----------------------------------------------------------------------------
// These flags run in parallel after Business.ACTIVE
// They affect specific actions but NEVER block app exploration

// Payment readiness
export type PaymentReadiness = 'PAYMENT_ENABLED' | 'PAYMENT_DISABLED';

// Delivery configuration
export type DeliveryReadiness = 'DELIVERY_CONFIGURED' | 'DELIVERY_NOT_CONFIGURED';

// Product availability
export type ProductReadiness = 'PRODUCTS_AVAILABLE' | 'NO_PRODUCTS';

// AI Energy (token) status
export type AIEnergyReadiness = 'AI_ENERGY_OK' | 'AI_ENERGY_LOW';

// Payout readiness (gated by DAN verification)
export type PayoutReadiness = 'PAYOUT_READY' | 'PAYOUT_BLOCKED';

// Business Readiness Flags (updated with enums)
export interface BusinessReadiness {
  payment_enabled: boolean; // Maps to PaymentReadiness
  delivery_configured: boolean; // Maps to DeliveryReadiness
  products_available: boolean; // Maps to ProductReadiness
  ai_energy_ok: boolean; // Maps to AIEnergyReadiness
  payout_ready: boolean; // Maps to PayoutReadiness
}

// Extended Store Info (UI layer)
export interface StoreInfo extends Business {
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
  readiness: BusinessReadiness;
}

// ----------------------------------------------------------------------------
// 3. REFERRAL CODE
// ----------------------------------------------------------------------------
export type ReferralCodeStatus = 'UNUSED' | 'USED';

export interface ReferralCode {
  code: string;
  issued_by_business_id: string;
  used_by_user_id?: string;
  status: ReferralCodeStatus;
  expires_at?: string;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 4. ACCESS REQUEST
// ----------------------------------------------------------------------------
export type AccessRequestStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED';

export interface AccessRequest {
  id: string;
  business_name: string;
  business_category: string;
  contact_email?: string;
  contact_phone?: string;
  status: AccessRequestStatus;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 5. PRODUCT
// ----------------------------------------------------------------------------
export type ProductStatus = 'ACTIVE' | 'DISABLED';
export type ProductCreatedBy = 'AI' | 'MANUAL';
export type ProductCategory = 'Apparel' | 'Food & Beverage' | 'Beauty & Personal Care' | 'Electronics' | 'Services' | 'Other';
export type AvailabilityType = 'ready' | 'made_to_order';
export type DeliveryOption = 'courier' | 'pickup' | 'none';

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  variants?: Record<string, any>; // JSON field
  stock: number | 'unlimited';
  status: ProductStatus;
  created_by: ProductCreatedBy;
  created_at: string;
  updated_at: string;

  // Extended fields for UI
  images: string[];
  category: ProductCategory;
  availabilityType: AvailabilityType;
  deliveryDays?: number;
  deliveryOptions: DeliveryOption[];
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

// ----------------------------------------------------------------------------
// 6. CUSTOMER
// ----------------------------------------------------------------------------
export type CustomerStatus = 'NEW' | 'RETURNING';
export type CustomerChannel = 'facebook' | 'instagram' | 'web' | 'phone';

export interface Customer {
  id: string;
  business_id: string;
  name?: string;
  phone?: string;
  social_id?: string; // FB / IG ID
  total_orders: number;
  total_spend: number;
  status: CustomerStatus;
  created_at: string;

  // Extended fields
  channel: CustomerChannel;
  ordersCount: number; // alias
  totalSpent: number; // alias
  firstInteraction: string;
  lastInteraction: string;
  aiInsight?: string;
  source?: 'manual' | 'auto';
  note?: string;
}

// ----------------------------------------------------------------------------
// 7. ORDER
// ----------------------------------------------------------------------------
export type OrderPaymentStatus = 'UNPAID' | 'PAID' | 'FAILED';
export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type OrderDeliveryStatus = 'NOT_REQUIRED' | 'PENDING' | 'IN_PROGRESS' | 'DELIVERED';
export type OrderSource = 'FACEBOOK' | 'INSTAGRAM' | 'OFFLINE' | 'WEB';
export type OrderCreatedBy = 'AI' | 'MANUAL';

export interface OrderItem {
  productId: string;
  quantity: number;
  price?: number;
  name?: string;
}

export interface Order {
  id: string;
  business_id: string;
  customer_id: string;
  items: OrderItem[];
  total_amount: number;
  payment_status: OrderPaymentStatus;
  order_status: OrderStatus;
  delivery_status: OrderDeliveryStatus;
  source: OrderSource;
  created_by: OrderCreatedBy;
  created_at: string;

  // Extended fields for UI
  customerName: string;
  phoneNumber?: string;
  channel: 'facebook' | 'instagram' | 'web' | 'facebook_comment';
  total: number; // alias
  status: 'pending' | 'confirmed' | 'paid' | 'completed'; // UI alias
  isAiGenerated: boolean;
  paymentMethod: 'cash_on_delivery' | 'bank_transfer' | 'online' | 'qpay' | 'afterpay';
  deliveryMethod: 'courier' | 'pickup';
  deliveryAddress?: string;
  aiSummary?: string;
  nextBestAction?: string;
}

// ----------------------------------------------------------------------------
// 8. PAYMENT TRANSACTION
// ----------------------------------------------------------------------------
export type PaymentTransactionStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface PaymentTransaction {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  status: PaymentTransactionStatus;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 9. BNPL TRANSACTION
// ----------------------------------------------------------------------------
export type BNPLStatus = 'APPROVED' | 'REJECTED' | 'PENDING';

export interface BNPLTransaction {
  id: string;
  order_id: string;
  provider: string;
  status: BNPLStatus;
  outstanding_amount: number;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 10. WALLET
// ----------------------------------------------------------------------------
export type PayoutStatus = 'PAYOUT_READY' | 'PAYOUT_BLOCKED';

export interface Wallet {
  business_id: string;
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  payout_status: PayoutStatus;
}

// ----------------------------------------------------------------------------
// 11. IDENTITY VERIFICATION (DAN)
// ----------------------------------------------------------------------------
export type IdentityVerificationStatus = 'NOT_VERIFIED' | 'PENDING' | 'VERIFIED';

export interface IdentityVerification {
  user_id: string;
  status: IdentityVerificationStatus;
  verified_at?: string;
}

// ----------------------------------------------------------------------------
// 12. PAYOUT
// ----------------------------------------------------------------------------
export type PayoutRequestStatus = 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Payout {
  id: string;
  business_id: string;
  amount: number;
  status: PayoutRequestStatus;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 13. AI ENERGY (Token Balance)
// ----------------------------------------------------------------------------
export interface AI_Energy {
  business_id: string;
  available_tokens: number;
  used_tokens: number;
  reset_date?: string;
}

export interface TokenUsage {
  balance: number;
  limit: number;
  usedToday: number;
  estimatedDaysLeft: number;
}

// ----------------------------------------------------------------------------
// 14. AUTOMATION SETTING
// ----------------------------------------------------------------------------
export interface AutomationSetting {
  business_id: string;
  auto_reply_comments: boolean;
  unpaid_order_followup: boolean;
  reengage_customers: boolean;
  delivery_updates: boolean;
  low_energy_alerts: boolean;
}

// ----------------------------------------------------------------------------
// 15. NOTIFICATION
// ----------------------------------------------------------------------------
export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Notification {
  id: string;
  business_id: string;
  type: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  read_at?: string;
  created_at: string;
  message: string;
}

// ----------------------------------------------------------------------------
// CONVERSATION & MESSAGES (Existing)
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// APP STATE
// ----------------------------------------------------------------------------
export interface AppState {
  user: UserProfile;
  store: StoreInfo;
  products: Product[];
  orders: Order[];
  conversations: Conversation[];
  customers: Customer[];
  wallet?: Wallet;
  paymentTransactions?: PaymentTransaction[];
  bnplTransactions?: BNPLTransaction[];
  identityVerification?: IdentityVerification;
  payouts?: Payout[];
  automationSettings?: AutomationSetting;
  notifications?: Notification[];
}
