
import React, { useState } from 'react';
import { useSafeTranslation } from '../hooks';
import { MOCK_DIGITAL_PRODUCTS, MOCK_STUDENTS } from '../data';
import { ImageWithFallback, MediaPicker } from '../components';
import { useNavigate } from 'react-router-dom';

type Tab = 'overview' | 'content' | 'pricing' | 'students';

export const InstructorDashboardPage = () => {
  const { tsafe } = useSafeTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [rate, setRate] = useState(80);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [newContentImage, setNewContentImage] = useState<string | null>(null);

  const earningsData = [450, 620, 800, 950, 1200, 1450]; 

  const renderOverview = () => (
    <div style={{ animation: 'fadeInSoft 0.6s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
        <div className="luxury-card" style={{ padding: 24, backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {tsafe('instructorDashboard.totalRevenue', 'Total Revenue')}
          </div>
          <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--text-1)' }}>
            $12,450
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10B981', marginTop: 8, fontWeight: 500 }}>+12%</div>
        </div>
        <div className="luxury-card" style={{ padding: 24, backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {tsafe('instructorDashboard.activeStudents', 'Active Students')}
          </div>
          <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--text-1)' }}>
            42
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: 8 }}>+3 new</div>
        </div>
      </div>

      <div className="luxury-card" style={{ padding: 32, marginBottom: 40, backgroundColor: '#FFFFFF' }}>
        <h3 className="yt-h2" style={{ marginBottom: 32, border: 'none' }}>{tsafe('instructorDashboard.earnings', 'Earnings')}</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, paddingTop: 20 }}>
          {earningsData.map((val, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{ 
                width: 6, 
                height: `${(val / 1500) * 100}%`, 
                backgroundColor: i === earningsData.length - 1 ? 'var(--gold-sand)' : 'var(--bg-main)',
                borderRadius: '10px',
                transition: 'height 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-sans)' }}>{['J', 'F', 'M', 'A', 'M', 'J'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="yt-section">
        <h3 className="yt-h2" style={{ display: 'flex', justifyContent: 'space-between', border: 'none' }}>
          <span>{tsafe('instructorDashboard.rating', 'Rating')}</span>
          <span style={{ color: 'var(--text-1)', fontFamily: 'var(--font-serif)' }}>4.9 ★</span>
        </h3>
        <div className="luxury-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
               <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Alice M.</span>
               <span style={{ color: 'var(--gold-sand)', fontSize: '0.75rem' }}>★★★★★</span>
             </div>
             <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.5 }}>"Changed my life. Sarah is amazing!"</p>
           </div>
           <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
               <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Bob D.</span>
               <span style={{ color: 'var(--gold-sand)', fontSize: '0.75rem' }}>★★★★★</span>
             </div>
             <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.5 }}>"Great pace and energy."</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div style={{ animation: 'fadeInSoft 0.6s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h2 className="yt-h2" style={{ margin: 0, border: 'none' }}>{tsafe('instructorDashboard.content', 'My Content')}</h2>
        <button 
          className="btn-primary" 
          onClick={() => setIsCreatingContent(!isCreatingContent)}
          style={{ padding: '10px 24px', fontSize: '0.85rem' }}
        >
          {isCreatingContent ? tsafe('instructorDashboard.cancel', 'Cancel') : `+ ${tsafe('instructorDashboard.createNew', 'Create New')}`}
        </button>
      </div>

      {isCreatingContent && (
        <div className="yt-card" style={{ padding: 24, marginBottom: 32, animation: 'fadeInSoft 0.3s ease' }}>
          <h3 className="yt-h2" style={{ border: 'none', fontSize: '1rem', marginBottom: 24 }}>{tsafe('instructorDashboard.newProduct', 'New Product')}</h3>
          <input 
            placeholder={tsafe('instructorDashboard.productTitlePlaceholder', 'Title...')}
            style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid var(--border)', marginBottom: 24, fontSize: '1rem', background: 'transparent' }} 
          />
          <MediaPicker 
            kind="image" 
            labelKey="labels.coverPhoto" 
            value={newContentImage} 
            onChange={setNewContentImage} 
            allowUrlFallback
          />
          <button className="btn-primary" style={{ width: '100%', marginTop: 16 }}>{tsafe('instructorDashboard.createBtn', 'Create')}</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {MOCK_DIGITAL_PRODUCTS.map(prod => (
          <div key={prod.id} className="luxury-card" style={{ display: 'flex', gap: 20, padding: 16, alignItems: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
              <ImageWithFallback src={prod.image} alt={prod.title} style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 4 }}>
                {tsafe(`instructorDashboard.products.${prod.type}`, prod.type)}
              </div>
              <div style={{ fontWeight: 500, fontSize: '1.05rem', marginBottom: 4, fontFamily: 'var(--font-serif)' }}>{prod.title}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-2)' }}>
                {prod.price.currency}{prod.price.amount} • {prod.sales} sales
              </div>
            </div>
            <div style={{ padding: '6px 14px', borderRadius: 100, backgroundColor: prod.status === 'active' ? '#F2F9F6' : '#FAFAFA', color: prod.status === 'active' ? '#10B981' : '#A3A3A3', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.03em', border: '1px solid rgba(0,0,0,0.03)' }}>
              {prod.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div style={{ animation: 'fadeInSoft 0.6s ease' }}>
      <div className="luxury-card" style={{ padding: 32, marginBottom: 32 }}>
        <h3 className="yt-h2" style={{ border: 'none', marginBottom: 16 }}>{tsafe('instructorDashboard.baseRate', 'Base Rate')}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-2)' }}>$</span>
          <input 
            type="number" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            style={{ 
              fontSize: '2.5rem', fontFamily: 'var(--font-serif)', width: 120, border: 'none', borderBottom: '1px solid var(--border)', 
              background: 'transparent', outline: 'none', color: 'var(--text-1)' 
            }} 
          />
        </div>
      </div>

      <h3 className="yt-h2" style={{ border: 'none', marginBottom: 24 }}>{tsafe('instructorDashboard.packages', 'Packages')}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {['Trial Session', '5 Sessions Pack', '10 Sessions Pack', '20 Sessions Pack'].map((pkg, i) => (
          <div key={i} className="luxury-card" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500, fontSize: '1rem' }}>{pkg}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
                {i === 0 
                  ? tsafe('instructorDashboard.packagesDesc.single', 'Single session') 
                  : tsafe('instructorDashboard.packagesDesc.bundle', { count: (i + 1) * 5, defaultValue: `Bundle of ${(i + 1) * 5} sessions` })
                }
              </div>
            </div>
            <div style={{ 
              width: 52, height: 30, borderRadius: 15, 
              backgroundColor: i < 3 ? 'var(--gold-sand)' : 'var(--bg-main)', 
              position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
            }}>
              <div style={{ 
                width: 26, height: 26, borderRadius: '50%', backgroundColor: '#fff', 
                position: 'absolute', top: 2, left: i < 3 ? 24 : 2, 
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)', transition: 'left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudents = () => (
    <div style={{ animation: 'fadeInSoft 0.6s ease' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MOCK_STUDENTS.map(student => (
          <div 
            key={student.id} 
            className="luxury-card" 
            style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }}
            onClick={() => navigate(`/students/${student.id}`)}
          >
            <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden' }}>
              <ImageWithFallback src={student.photo} alt={student.name} style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: 'var(--font-serif)', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'all 0.2s' }}>{student.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
                {student.totalSessions} sessions • Last: {student.lastSeen}
              </div>
            </div>
            <button style={{ 
              width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--border)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-1)',
              backgroundColor: 'var(--bg-main)'
            }}>
              <span style={{ fontSize: '0.8rem' }}>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="yt-page">
      <header className="yt-section" style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 className="yt-h1">
          {tsafe('instructorDashboard.title', 'Dashboard')}
        </h1>
      </header>

      <div style={{ 
        display: 'flex', gap: 12, overflowX: 'auto', marginBottom: 40, 
        paddingBottom: 4, justifyContent: 'flex-start' 
      }} className="hide-scrollbar">
        {(['overview', 'content', 'pricing', 'students'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              borderRadius: 100,
              backgroundColor: activeTab === tab ? 'var(--text-1)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-2)',
              fontWeight: 500,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              border: activeTab === tab ? '1px solid var(--text-1)' : '1px solid transparent'
            }}
          >
            {tsafe(`instructorDashboard.tabs.${tab}`, tab)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'content' && renderContent()}
      {activeTab === 'pricing' && renderPricing()}
      {activeTab === 'students' && renderStudents()}
    </div>
  );
};
