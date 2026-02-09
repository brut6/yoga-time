
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';

export const InvestorDemoPage = () => {
  const navigate = useNavigate();
  const { tsafe } = useSafeTranslation();

  const metrics = [
    { label: tsafe('investor.metrics.retention', 'Retention'), value: tsafe('investor.metrics.retentionVal', '68%') },
    { label: tsafe('investor.metrics.monetization', 'Conversion'), value: tsafe('investor.metrics.monetizationVal', '4.2%') },
    { label: tsafe('investor.metrics.global', 'Market'), value: tsafe('investor.metrics.globalVal', '$1.2T') },
  ];

  const roadmap = [
    tsafe('investor.roadmapItems.1', 'AI Content Personalization'),
    tsafe('investor.roadmapItems.2', 'Apple Health Integration'),
    tsafe('investor.roadmapItems.3', 'Live Streaming'),
    tsafe('investor.roadmapItems.4', 'Corporate Subscription'),
    tsafe('investor.roadmapItems.5', 'Loyalty Tokenization')
  ];

  const demoLinks = [
    { label: tsafe('investor.links.home', 'Home'), path: "/" },
    { label: tsafe('investor.links.breathing', 'Breathing'), path: "/breathing" },
    { label: tsafe('investor.links.retreats', 'Retreats'), path: "/retreats" },
    { label: tsafe('investor.links.paywall', 'Paywall'), path: "/paywall" },
  ];

  return (
    <div className="yt-page">
      
      <section style={{ textAlign: 'center', marginBottom: 48, marginTop: 24 }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '6px 12px', 
          backgroundColor: 'var(--bg-elevated)', 
          borderRadius: 20, 
          fontSize: '0.8rem', 
          fontWeight: 600, 
          color: 'var(--text-2)',
          marginBottom: 16,
          letterSpacing: '0.05em'
        }}>
          {tsafe('investor.label', 'Investor')}
        </div>
        <h1 className="yt-h1">
          {tsafe('common.brandName', 'YOGA TIME')}
        </h1>
        <p className="yt-sub" style={{ maxWidth: 500, margin: '0 auto' }}>
          {tsafe('investor.subtitle', 'Scalable wellness platform.')}
          <br />
          <span style={{ fontSize: '1rem', opacity: 0.8 }}>{tsafe('investor.techStack', 'React 18 • TypeScript • Vite • PWA')}</span>
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {metrics.map((m, i) => (
            <div key={i} className="yt-card" style={{ padding: 20 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-1)' }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h3 className="yt-h2">{tsafe('investor.explore', 'Explore Demo')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {demoLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link.path)}
              style={{
                padding: '16px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                color: 'var(--text-1)',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'start',
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              → {link.label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ 
        backgroundColor: 'var(--text-1)', 
        color: '#fff', 
        borderRadius: 20, 
        padding: 32, 
        textAlign: 'center',
        marginBottom: 48,
        boxShadow: 'var(--shadow-1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: 8 }}>{tsafe('investor.partnerTitle', 'Partner with us')}</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>{tsafe('investor.partnerSubtitle', "Let's build the future of wellness together.")}</p>
        <button 
          onClick={() => alert("Contact: partners@yogatime.app (Mock)")}
          style={{
            padding: '12px 32px',
            backgroundColor: '#fff',
            color: 'var(--text-1)',
            borderRadius: 99,
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {tsafe('investor.contact', 'Contact')}
        </button>
      </section>

      <section>
        <h3 className="yt-h2">{tsafe('investor.roadmap', 'Roadmap')}</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {roadmap.map((item, i) => (
            <li key={i} style={{ 
              padding: '12px 0', 
              borderBottom: '1px solid var(--border)', 
              color: 'var(--text-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-1)', fontWeight: 700 }}>
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
};
