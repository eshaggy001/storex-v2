import { describe, it, expect } from 'vitest';
import {
    transitionUserState,
    transitionBusinessState,
    updateReadinessFlags
} from '@/stateTransitions';
import {
    UserAccessState,
    BusinessAccessState
} from '@/types';

describe('stateTransitions', () => {
    describe('transitionUserState', () => {
        it('should transition from ANONYMOUS to AUTHENTICATED on SIGN_UP', () => {
            const current: UserAccessState = 'ANONYMOUS';
            const action = { type: 'SIGN_UP' } as const;
            expect(transitionUserState(current, action)).toBe('AUTHENTICATED');
        });

        it('should transition from ANONYMOUS to AUTHENTICATED on LOG_IN', () => {
            const current: UserAccessState = 'ANONYMOUS';
            const action = { type: 'LOG_IN' } as const;
            expect(transitionUserState(current, action)).toBe('AUTHENTICATED');
        });

        it('should transition from AUTHENTICATED to ANONYMOUS on LOG_OUT', () => {
            const current: UserAccessState = 'AUTHENTICATED';
            const action = { type: 'LOG_OUT' } as const;
            expect(transitionUserState(current, action)).toBe('ANONYMOUS');
        });

        it('should transition to PASSWORD_RESET on REQUEST_PASSWORD_RESET', () => {
            const current: UserAccessState = 'AUTHENTICATED';
            const action = { type: 'REQUEST_PASSWORD_RESET' } as const;
            expect(transitionUserState(current, action)).toBe('PASSWORD_RESET');
        });

        it('should return to AUTHENTICATED from PASSWORD_RESET on COMPLETE_PASSWORD_RESET', () => {
            const current: UserAccessState = 'PASSWORD_RESET';
            const action = { type: 'COMPLETE_PASSWORD_RESET' } as const;
            expect(transitionUserState(current, action)).toBe('AUTHENTICATED');
        });
    });

    describe('transitionBusinessState', () => {
        it('should transition from NO_BUSINESS to REFERRAL_REQUIRED on ATTEMPT_CREATE_BUSINESS', () => {
            const current: BusinessAccessState = 'NO_BUSINESS';
            const action = { type: 'ATTEMPT_CREATE_BUSINESS' } as const;
            expect(transitionBusinessState(current, action)).toBe('REFERRAL_REQUIRED');
        });

        it('should transition to BUSINESS_CREATED on SUBMIT_VALID_REFERRAL', () => {
            const current: BusinessAccessState = 'REFERRAL_REQUIRED';
            const action = { type: 'SUBMIT_VALID_REFERRAL', referralCode: 'STOREX-ABC' } as const;
            expect(transitionBusinessState(current, action)).toBe('BUSINESS_CREATED');
        });

        it('should transition to ACCESS_REQUESTED on SUBMIT_INVALID_REFERRAL', () => {
            const current: BusinessAccessState = 'REFERRAL_REQUIRED';
            const action = { type: 'SUBMIT_INVALID_REFERRAL' } as const;
            expect(transitionBusinessState(current, action)).toBe('ACCESS_REQUESTED');
        });

        it('should transition to ACTIVE on COMPLETE_BUSINESS_SETUP', () => {
            const current: BusinessAccessState = 'BUSINESS_CREATED';
            const action = { type: 'COMPLETE_BUSINESS_SETUP', name: 'Test Store', category: 'Retail' } as const;
            expect(transitionBusinessState(current, action)).toBe('ACTIVE');
        });
    });

    describe('updateReadinessFlags', () => {
        it('should set payment_enabled correctly', () => {
            const business = {
                status: 'ACTIVE' as BusinessAccessState,
                paymentMethods: ['STRIPE']
            };
            const readiness = updateReadinessFlags(business);
            expect(readiness.payment_enabled).toBe(true);
        });

        it('should set products_available correctly', () => {
            const business = {
                status: 'ACTIVE' as BusinessAccessState,
                products: [{ id: '1' }]
            };
            const readiness = updateReadinessFlags(business);
            expect(readiness.products_available).toBe(true);
        });

        it('should set ai_energy_ok when tokens are above threshold', () => {
            const business = {
                status: 'ACTIVE' as BusinessAccessState,
                aiTokens: 50
            };
            const readiness = updateReadinessFlags(business);
            expect(readiness.ai_energy_ok).toBe(true);
        });
    });
});
