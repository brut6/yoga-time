import { SubscriptionPlanId } from '../types';

const STORAGE_KEY = 'yt_subscription_plan';

interface PlanConfig {
  id: SubscriptionPlanId;
  price: number;
  features: string[];
}

const PLANS: Record<SubscriptionPlanId, PlanConfig> = {
  free: {
    id: 'free',
    price: 0,
    features: []
  },
  premium: {
    id: 'premium',
    price: 4.99,
    features: ['canAdvancedFilters', 'canDeepBreathing']
  },
  pro: {
    id: 'pro',
    price: 14.99,
    features: ['canAdvancedFilters', 'canSeeOrganizerTools', 'canBoost', 'canDeepBreathing', 'canStreakInsights']
  }
};

export const subscriptionService = {
  getCurrentPlan: (): SubscriptionPlanId => {
    try {
      if (typeof window === 'undefined') return 'free';
      return (window.localStorage.getItem(STORAGE_KEY) as SubscriptionPlanId) || 'free';
    } catch (e) {
      return 'free';
    }
  },

  setPlan: (plan: SubscriptionPlanId) => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(STORAGE_KEY, plan);
      // Dispatch event to update UI immediately
      window.dispatchEvent(new Event('planChange'));
    } catch (e) {
      console.warn('Failed to set plan:', e);
    }
  },

  hasFeature: (feature: string): boolean => {
    const planId = subscriptionService.getCurrentPlan();
    const plan = PLANS[planId];
    return plan ? plan.features.includes(feature) : false;
  },

  isPro: (): boolean => {
    return subscriptionService.getCurrentPlan() === 'pro';
  },

  isPremiumOrPro: (): boolean => {
    const plan = subscriptionService.getCurrentPlan();
    return plan === 'premium' || plan === 'pro';
  },

  getPlans: () => Object.values(PLANS)
};