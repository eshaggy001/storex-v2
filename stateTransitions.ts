// ============================================================================
// State Transition Logic for Storex
// ============================================================================
// This file centralizes all state machine transition logic
// Architecture: State-driven, non-blocking, AI-first
// ============================================================================

import {
    UserAccessState,
    BusinessAccessState,
    BusinessReadiness,
    ReferralCode,
    IdentityVerification
} from './types';

// ----------------------------------------------------------------------------
// USER ACCESS STATE TRANSITIONS
// ----------------------------------------------------------------------------

export type UserAction =
    | { type: 'SIGN_UP' }
    | { type: 'LOG_IN' }
    | { type: 'LOG_OUT' }
    | { type: 'REQUEST_PASSWORD_RESET' }
    | { type: 'COMPLETE_PASSWORD_RESET' };

/**
 * Transitions user access state based on actions
 * Rules:
 * - ANONYMOUS → AUTHENTICATED (via SIGN_UP or LOG_IN)
 * - AUTHENTICATED → PASSWORD_RESET (via REQUEST_PASSWORD_RESET)
 * - PASSWORD_RESET → AUTHENTICATED (via COMPLETE_PASSWORD_RESET)
 * - AUTHENTICATED → ANONYMOUS (via LOG_OUT)
 */
export function transitionUserState(
    current: UserAccessState,
    action: UserAction
): UserAccessState {
    switch (current) {
        case 'ANONYMOUS':
            if (action.type === 'SIGN_UP' || action.type === 'LOG_IN') {
                return 'AUTHENTICATED';
            }
            return current;

        case 'AUTHENTICATED':
            if (action.type === 'LOG_OUT') {
                return 'ANONYMOUS';
            }
            if (action.type === 'REQUEST_PASSWORD_RESET') {
                return 'PASSWORD_RESET';
            }
            return current;

        case 'PASSWORD_RESET':
            if (action.type === 'COMPLETE_PASSWORD_RESET') {
                return 'AUTHENTICATED';
            }
            return current;

        default:
            return current;
    }
}

// ----------------------------------------------------------------------------
// BUSINESS ACCESS STATE TRANSITIONS (Referral-Gated)
// ----------------------------------------------------------------------------

export type BusinessAction =
    | { type: 'ATTEMPT_CREATE_BUSINESS' }
    | { type: 'SUBMIT_VALID_REFERRAL'; referralCode: string }
    | { type: 'SUBMIT_INVALID_REFERRAL' }
    | { type: 'REQUEST_ACCESS'; businessName: string; businessCategory: string }
    | { type: 'COMPLETE_BUSINESS_SETUP'; name: string; category: string }
    | { type: 'ACTIVATE_BUSINESS' };

/**
 * Transitions business access state based on actions
 * Rules:
 * - NO_BUSINESS → REFERRAL_REQUIRED (user attempts to create business)
 * - REFERRAL_REQUIRED → BUSINESS_CREATED (valid referral code submitted)
 * - REFERRAL_REQUIRED → ACCESS_REQUESTED (no/invalid referral code)
 * - BUSINESS_CREATED → ACTIVE (business name + category saved)
 * - ACCESS_REQUESTED stays until admin approval (not implemented in MVP)
 */
export function transitionBusinessState(
    current: BusinessAccessState,
    action: BusinessAction
): BusinessAccessState {
    switch (current) {
        case 'NO_BUSINESS':
            if (action.type === 'ATTEMPT_CREATE_BUSINESS') {
                return 'REFERRAL_REQUIRED';
            }
            return current;

        case 'REFERRAL_REQUIRED':
            if (action.type === 'SUBMIT_VALID_REFERRAL') {
                return 'BUSINESS_CREATED';
            }
            if (action.type === 'SUBMIT_INVALID_REFERRAL' || action.type === 'REQUEST_ACCESS') {
                return 'ACCESS_REQUESTED';
            }
            return current;

        case 'ACCESS_REQUESTED':
            // Stays in this state until admin approval (future feature)
            return current;

        case 'BUSINESS_CREATED':
            if (action.type === 'COMPLETE_BUSINESS_SETUP') {
                return 'ACTIVE';
            }
            return current;

        case 'ACTIVE':
            // Terminal state - business is active
            return current;

        default:
            return current;
    }
}

// ----------------------------------------------------------------------------
// BUSINESS READINESS FLAGS
// ----------------------------------------------------------------------------

/**
 * Updates business readiness flags based on current business state
 * These flags are INDEPENDENT and run in PARALLEL
 * They NEVER block app exploration, only specific actions
 */
export function updateReadinessFlags(
    business: any
): BusinessReadiness {
    const fulfillment = business.fulfillment || {};
    const paymentMethods = fulfillment.paymentMethods || business.paymentMethods || [];
    const deliveryTypes = fulfillment.deliveryTypes || business.deliveryTypes || [];
    const products = business.products || [];

    return {
        // Payment enabled if at least one payment method configured
        payment_enabled: paymentMethods.length > 0,

        // Delivery configured if at least one delivery type set
        delivery_configured: deliveryTypes.length > 0,

        // Products available if at least one active product exists
        products_available: products.length > 0,

        // AI energy OK if tokens > 10 (arbitrary threshold)
        ai_energy_ok: (business.tokenUsage?.balance ?? business.aiTokens ?? 100) > 10,

        // Payout ready if identity verified
        payout_ready: business.identityVerified ?? (business.fulfillment?.bankDetails?.accountNumber ? true : false),
    };
}

// ----------------------------------------------------------------------------
// VALIDATION FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Validates a referral code
 * In MVP, this is mocked. In production, this would call backend API
 */
export async function validateReferralCode(code: string): Promise<boolean> {
    // Mock validation - accept any code that starts with "STOREX-"
    // In production: await api.validateReferralCode(code)
    return code.startsWith('STOREX-') && code.length > 7;
}

/**
 * Checks if user can create a business
 * Requires: User is AUTHENTICATED and has valid referral code
 */
export async function canCreateBusiness(
    userState: UserAccessState,
    referralCode: string
): Promise<boolean> {
    if (userState !== 'AUTHENTICATED') {
        return false;
    }
    return await validateReferralCode(referralCode);
}

/**
 * Checks if user can request payout
 * Requires: Identity verification completed
 */
export function canRequestPayout(
    verification: IdentityVerification
): boolean {
    return verification.status === 'VERIFIED';
}

/**
 * Checks if user can complete checkout
 * Requires: Payment enabled (but doesn't block order creation)
 */
export function canCompleteCheckout(
    readiness: BusinessReadiness
): boolean {
    return readiness.payment_enabled;
}

/**
 * Checks if AI can execute automated actions
 * Requires: Sufficient AI energy and automation enabled
 */
export function canAIExecuteAutomation(
    readiness: BusinessReadiness,
    automationEnabled: boolean
): boolean {
    return readiness.ai_energy_ok && automationEnabled;
}

// ----------------------------------------------------------------------------
// STATE GUARDS (What blocks what)
// ----------------------------------------------------------------------------

/**
 * Defines what actions are blocked by which states
 * Philosophy: MINIMAL blocking, only for critical actions
 */
export const StateGates = {
    // Main app access: requires ACTIVE business
    canAccessMainApp: (businessState: BusinessAccessState) =>
        businessState === 'ACTIVE',

    // Order creation: allowed even without payment setup
    canCreateOrder: (businessState: BusinessAccessState) =>
        businessState === 'ACTIVE',

    // Payment completion: requires payment enabled
    canCompletePayment: (readiness: BusinessReadiness) =>
        readiness.payment_enabled,

    // Delivery: requires delivery configured
    canFulfillDelivery: (readiness: BusinessReadiness) =>
        readiness.delivery_configured,

    // Payout: requires identity verification
    canWithdrawFunds: (readiness: BusinessReadiness) =>
        readiness.payout_ready,

    // AI automation: requires AI energy and toggle ON
    canAutomate: (readiness: BusinessReadiness, enabled: boolean) =>
        readiness.ai_energy_ok && enabled,
} as const;

// ----------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Gets human-readable state description
 */
export function getStateDescription(state: BusinessAccessState): string {
    switch (state) {
        case 'NO_BUSINESS':
            return 'No business created yet';
        case 'REFERRAL_REQUIRED':
            return 'Referral code required to create business';
        case 'ACCESS_REQUESTED':
            return 'Access request submitted, awaiting approval';
        case 'BUSINESS_CREATED':
            return 'Business created, completing setup';
        case 'ACTIVE':
            return 'Business is active and ready to sell';
        default:
            return 'Unknown state';
    }
}

/**
 * Gets next recommended action based on state
 */
export function getNextAction(
    businessState: BusinessAccessState,
    readiness: BusinessReadiness
): string | null {
    // If business not active, focus on that first
    if (businessState !== 'ACTIVE') {
        switch (businessState) {
            case 'NO_BUSINESS':
                return 'Create your business to start selling';
            case 'REFERRAL_REQUIRED':
                return 'Enter your referral code to continue';
            case 'ACCESS_REQUESTED':
                return 'Your access request is being reviewed';
            case 'BUSINESS_CREATED':
                return 'Complete business setup to activate';
            default:
                return null;
        }
    }

    // Business is active, check readiness flags
    if (!readiness.payment_enabled) {
        return 'Enable payments to complete sales';
    }
    if (!readiness.products_available) {
        return 'Add products to start selling';
    }
    if (!readiness.delivery_configured) {
        return 'Configure delivery options';
    }
    if (!readiness.ai_energy_ok) {
        return 'Add AI energy to continue automations';
    }
    if (!readiness.payout_ready) {
        return 'Complete identity verification to withdraw funds';
    }

    return null; // All set!
}
