
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { subscriptionService } from '../services';
import { SubscriptionPlanId } from '../types';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export const PaywallPage = () => {
  const { tsafe } = useSafeTranslation();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanId>('free');
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    setCurrentPlan(subscriptionService.getCurrentPlan());
    setIsDemoMode(localStorage.getItem('yt_demo_mode') === 'true');
    
    const handlePlanChange = () => {
      setCurrentPlan(subscriptionService.getCurrentPlan());
    };
    
    window.addEventListener('planChange', handlePlanChange);
    return () => window.removeEventListener('planChange', handlePlanChange);
  }, []);

  const handleSelectPlan = (planId: SubscriptionPlanId) => {
    if (isDemoMode) {
      alert(tsafe('paywall.alerts.demoUpgrade', 'This is demo mode. Plan updated locally.'));
      subscriptionService.setPlan(planId);
      return;
    }
    subscriptionService.setPlan(planId);
  };

  const handleRestore = () => {
    alert(tsafe('paywall.alerts.restoreMock', 'Purchases restored (Demo).'));
  };

  const benefits = [
    tsafe('paywall.benefits.breathing', 'Breathing practices'),
    tsafe('paywall.benefits.streak', 'Practice streak'),
    tsafe('paywall.benefits.filters', 'Advanced filters'),
    tsafe('paywall.benefits.organizer', 'Organizer access'),
    tsafe('paywall.benefits.support', 'Support')
  ];

  return (
    <div className="yt-page">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div style={{
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          padding: '12px',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: 600,
          borderBottom: '1px solid #FCD34D',
          letterSpacing: '0.02em',
          marginBottom: 24,
          borderRadius: 8
        }}>
          {tsafe('common.demoModeBanner', 'Your payment will not be charged (Demo)')}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '0 24px 40px', textAlign: 'center' }}>
        <div style={{ 
          width: 64, 
          height: 64, 
          borderRadius: '50%', 
          backgroundColor: 'var(--bg-elevated)', 
          margin: '0 auto 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-1)'
        }}>
          <LockIcon />
        </div>
        <h1 className="yt-h1" style={{ marginBottom: 12 }}>
          {tsafe('paywall.title', 'Choose Plan')}
        </h1>
        <p className="yt-sub">
          {tsafe('paywall.subtitle', 'Invest in your wellbeing.')}
        </p>
      </div>

      {/* Benefits List */}
      <div style={{ margin: '0 auto 40px', padding: '0 24px' }}>
        {benefits.map((benefit, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 16,
            fontSize: '1rem',
            color: 'var(--text-1)'
          }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              backgroundColor: 'var(--bg-card)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-card)'
            }}>
              <CheckIcon />
            </div>
            {benefit}
          </div>
        ))}
      </div>

      {/* Plans */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 16, 
        margin: '0 auto', 
        padding: '0 8px' 
      }}>
        {/* Free Plan */}
        <div style={{ 
          padding: 20, 
          borderRadius: 'var(--radius-md)', 
          border: currentPlan === 'free' ? '2px solid var(--text-1)' : '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
          opacity: currentPlan === 'free' ? 1 : 0.8
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{tsafe('paywall.plans.free.name', 'Free')}</span>
            {currentPlan === 'free' && <span style={{ fontSize: '0.9rem', color: 'var(--text-2)' }}>{tsafe('paywall.current', 'Current')}</span>}
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-2)', marginTop: 8 }}>
             {tsafe('paywall.plans.free.desc', 'Basic access to the app')}
          </div>
        </div>

        {/* Premium Plan */}
        <button 
          onClick={() => handleSelectPlan('premium')}
          style={{ 
            padding: 24, 
            borderRadius: 'var(--radius-md)', 
            border: currentPlan === 'premium' ? '2px solid var(--text-1)' : '1px solid var(--border)',
            backgroundColor: 'var(--bg-card)',
            textAlign: 'start', // RTL friendly
            cursor: 'pointer',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            transition: 'transform 0.2s',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{tsafe('paywall.plans.premium.name', 'Premium')}</span>
            <span style={{ fontWeight: 700 }}>$4.99 <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>{tsafe('paywall.monthly', '/ month')}</span></span>
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-2)' }}>
            {tsafe('paywall.plans.premium.desc', 'Extended practice features')}
          </div>
          {currentPlan === 'premium' && (
            <div style={{ position: 'absolute', top: -10, right: 16, background: 'var(--text-1)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
              {tsafe('common.currentPlan', 'Current Plan')} ✅
            </div>
          )}
        </button>

        {/* Pro Plan */}
        <button 
          onClick={() => handleSelectPlan('pro')}
          style={{ 
            padding: 24, 
            borderRadius: 'var(--radius-md)', 
            border: currentPlan === 'pro' ? '2px solid var(--text-1)' : '1px solid var(--border)',
            backgroundColor: 'var(--bg-elevated)', // Slightly warmer
            textAlign: 'start', // RTL friendly
            cursor: 'pointer',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            transition: 'transform 0.2s',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{tsafe('paywall.plans.pro.name', 'Pro')}</span>
            <span style={{ fontWeight: 700 }}>$14.99 <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>{tsafe('paywall.monthly', '/ month')}</span></span>
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-2)' }}>
            {tsafe('paywall.plans.pro.desc', 'Full unlimited access')}
          </div>
          {currentPlan === 'pro' && (
            <div style={{ position: 'absolute', top: -10, right: 16, background: 'var(--text-1)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
              {tsafe('common.currentPlan', 'Current Plan')} ✅
            </div>
          )}
        </button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button 
          onClick={handleRestore}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-3)', 
            fontSize: '0.9rem', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {tsafe('paywall.restore', 'Restore Purchases')}
        </button>
      </div>
    </div>
  );
};
