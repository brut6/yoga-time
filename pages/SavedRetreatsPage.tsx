
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { userProfileService, dbService } from '../services';
import { Retreat } from '../types';
import { RetreatCard } from '../components';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const SavedRetreatsPage = () => {
  const { tsafe } = useSafeTranslation();
  const navigate = useNavigate();
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const profileIds = userProfileService.getFavorites().retreats;
        setSavedIds(profileIds);
        
        const allRetreats = await dbService.getRetreats();
        setRetreats(allRetreats);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Listen for toggleFavorite events to update UI instantly
    const handleUpdate = (e: any) => {
      const { type, id, isFavorite } = e.detail;
      if (type === 'retreat') {
        setSavedIds(prev => isFavorite ? [...prev, id] : prev.filter(sid => sid !== id));
      }
    };
    window.addEventListener('yt_fav_updated', handleUpdate);
    return () => window.removeEventListener('yt_fav_updated', handleUpdate);
  }, []);

  const filteredRetreats = savedIds
    .slice()
    .reverse() // Newest first
    .map(id => retreats.find(r => r.id === id))
    .filter((r): r is Retreat => {
      if (!r) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || 
             r.location.city.toLowerCase().includes(q) ||
             r.location.country.toLowerCase().includes(q) ||
             r.tags.some(tag => tag.toLowerCase().includes(q));
    });

  return (
    <div className="yt-page">
      <div style={{ padding: '24px', backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => navigate('/profile')} 
          style={{ 
            marginBottom: 16, 
            fontSize: '0.9rem', 
            color: 'var(--text-2)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            padding: '8px 0',
            cursor: 'pointer'
          }}
        >
          ← {tsafe('common.back', 'Back')}
        </button>
        <h1 className="yt-h1" style={{ fontSize: '1.8rem', marginBottom: 4 }}>
          {tsafe('saved.retreatsTitle', 'Saved Retreats')}
        </h1>
      </div>

      <div style={{ padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'rgba(245, 243, 240, 0.95)', backdropFilter: 'blur(10px)' }}>
        <div style={{ 
           position: 'relative', display: 'flex', alignItems: 'center',
           backgroundColor: '#FFFFFF', 
           borderRadius: 100, 
           border: '1px solid transparent',
           boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
         }}>
           <div style={{ paddingLeft: 16, display: 'flex' }}><SearchIcon /></div>
           <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tsafe('saved.searchPlaceholder', 'Search...')}
              style={{ 
                flex: 1, border: 'none', background: 'none', padding: '12px', 
                fontSize: '0.95rem', outline: 'none', color: 'var(--text-1)', fontWeight: 400
              }}
           />
           {searchQuery && (
             <button onClick={() => setSearchQuery('')} style={{ padding: 12, color: 'var(--text-3)' }}>
               <CloseIcon />
             </button>
           )}
         </div>
      </div>

      <div style={{ padding: '0 24px 80px 24px', animation: 'fadeInSoft 0.4s ease' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>Loading...</div>
        ) : filteredRetreats.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingTop: 16 }}>
            {filteredRetreats.map(retreat => (
              <div key={retreat.id}>
                <RetreatCard retreat={retreat} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-2)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: 12 }}>{tsafe('saved.noRetreats', 'No saved retreats yet')}</h3>
            <button 
              onClick={() => navigate('/retreats')}
              className="btn-primary"
              style={{ fontSize: '0.9rem', padding: '12px 24px' }}
            >
              {tsafe('saved.goToDiscovery', 'Go to discovery')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
