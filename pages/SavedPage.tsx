
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { MOCK_RETREATS, MOCK_INSTRUCTORS } from '../data';
import { RetreatCard, InstructorCard } from '../components';
import { userProfileService } from '../services';

type Tab = 'retreats' | 'instructors';

export const SavedPage = () => {
  const { tsafe } = useSafeTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('retreats');
  const [savedRetreatIds, setSavedRetreatIds] = useState<string[]>([]);
  const [savedInstructorIds, setSavedInstructorIds] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      const favs = userProfileService.getFavorites();
      // Reverse to show newest first
      setSavedRetreatIds([...favs.retreats].reverse());
      setSavedInstructorIds([...favs.instructors].reverse());
    };

    loadFavorites();

    const handleUpdate = () => {
      loadFavorites();
    };
    window.addEventListener('yt_fav_updated', handleUpdate);
    return () => window.removeEventListener('yt_fav_updated', handleUpdate);
  }, []);

  // Map IDs to objects to preserve order (Newest first)
  const savedRetreats = savedRetreatIds
    .map(id => MOCK_RETREATS.find(r => r.id === id))
    .filter(Boolean) as typeof MOCK_RETREATS;

  const savedInstructors = savedInstructorIds
    .map(id => MOCK_INSTRUCTORS.find(i => i.id === id))
    .filter(Boolean) as typeof MOCK_INSTRUCTORS;

  const renderContent = () => {
    if (activeTab === 'retreats') {
      if (savedRetreats.length === 0) {
        return (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-2)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: 12 }}>{tsafe('saved.emptyRetreats.title', 'List is empty')}</h3>
            <p className="yt-sub" style={{ marginBottom: 24 }}>{tsafe('saved.emptyRetreats.desc', 'You haven\'t saved any retreats yet.')}</p>
            <button 
              onClick={() => navigate('/retreats')}
              className="btn-primary"
            >
              {tsafe('saved.emptyRetreats.action', 'Explore')}
            </button>
          </div>
        );
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {savedRetreats.map(retreat => (
            <RetreatCard key={retreat.id} retreat={retreat} />
          ))}
        </div>
      );
    } else {
      if (savedInstructors.length === 0) {
         return (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-2)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: 12 }}>{tsafe('saved.emptyInstructors.title', 'List is empty')}</h3>
            <p className="yt-sub" style={{ marginBottom: 24 }}>{tsafe('saved.emptyInstructors.desc', 'You haven\'t saved any mentors yet.')}</p>
            <button 
              onClick={() => navigate('/instructors')}
              className="btn-primary"
            >
              {tsafe('saved.emptyInstructors.action', 'Explore')}
            </button>
          </div>
        );
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {savedInstructors.map(instructor => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="yt-page">
      <header className="yt-section">
        <h1 className="yt-h1">
          {tsafe('saved.title', 'Saved')}
        </h1>
      </header>

      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
        <button
          onClick={() => setActiveTab('retreats')}
          style={{
            padding: '12px 0',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'retreats' ? 600 : 400,
            color: activeTab === 'retreats' ? 'var(--text-1)' : 'var(--text-2)',
            borderBottom: activeTab === 'retreats' ? '2px solid var(--text-1)' : '2px solid transparent',
            transition: 'all 0.2s',
            flex: 1,
            minHeight: 'auto'
          }}
        >
          {tsafe('saved.tabs.retreats', 'Retreats')} <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: 4 }}>{savedRetreats.length}</span>
        </button>
        <button
           onClick={() => setActiveTab('instructors')}
           style={{
             padding: '12px 0',
             border: 'none',
             background: 'none',
             cursor: 'pointer',
             fontSize: '1rem',
             fontWeight: activeTab === 'instructors' ? 600 : 400,
             color: activeTab === 'instructors' ? 'var(--text-1)' : 'var(--text-2)',
             borderBottom: activeTab === 'instructors' ? '2px solid var(--text-1)' : '2px solid transparent',
             transition: 'all 0.2s',
             flex: 1,
             minHeight: 'auto'
           }}
        >
          {tsafe('saved.tabs.teachers', 'Mentors')} <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: 4 }}>{savedInstructors.length}</span>
        </button>
      </div>

      {renderContent()}
    </div>
  );
};
