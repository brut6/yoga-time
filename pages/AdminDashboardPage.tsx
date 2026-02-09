
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { userProfileService, dbService, isFirebaseConfigured, UserProfile } from '../services';
import { Retreat, Instructor } from '../types';

type Tab = 'users' | 'retreats' | 'guides';
type RetreatFilter = 'all' | 'published' | 'draft';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const AdminDashboardPage = () => {
  const { tsafe } = useSafeTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [retreatFilter, setRetreatFilter] = useState<RetreatFilter>('all');

  // Data
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [guides, setGuides] = useState<Instructor[]>([]);

  useEffect(() => {
    const checkAccess = async () => {
      const profile = await userProfileService.loadProfile();
      if (!userProfileService.isAdmin(profile)) {
        navigate('/');
        return;
      }
      setIsAdmin(true);
      setLoading(false);
      loadData();
    };
    checkAccess();
  }, [navigate]);

  const loadData = async () => {
    if (!isFirebaseConfigured()) return;
    try {
      const [u, r, g] = await Promise.all([
        dbService.getAllUsers(),
        dbService.getRetreats(),
        dbService.getGuides()
      ]);
      setUsers(u);
      setRetreats(r);
      setGuides(g);
    } catch (e) {
      console.error("Admin load error", e);
    }
  };

  const handleRoleChange = async (uid: string, newRole: UserProfile['role']) => {
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await dbService.updateUserRole(uid, newRole);
      setUsers(users.map(u => u.id === uid ? { ...u, role: newRole } : u));
    } catch (e) {
      alert('Failed to update role');
    }
  };

  const handleDeleteRetreat = async (id: string) => {
    if (!window.confirm(tsafe('admin.confirmDelete', 'Are you sure?'))) return;
    try {
      await dbService.deleteRetreat(id);
      setRetreats(retreats.filter(r => r.id !== id));
    } catch (e) {
      alert('Failed to delete retreat');
    }
  };

  const handleUnpublishRetreat = async (retreat: Retreat) => {
    try {
      const newStatus = retreat.status === 'published' ? 'draft' : 'published';
      await dbService.updateRetreat(retreat.id, { status: newStatus });
      setRetreats(retreats.map(r => r.id === retreat.id ? { ...r, status: newStatus } : r));
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleDeleteGuide = async (id: string) => {
    if (!window.confirm(tsafe('admin.confirmDelete', 'Are you sure?'))) return;
    try {
      await dbService.deleteGuide(id);
      setGuides(guides.filter(g => g.id !== id));
    } catch (e) {
      alert('Failed to delete guide');
    }
  };

  // Filtered Lists
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q));
  }, [users, searchQuery]);

  const filteredRetreats = useMemo(() => {
    let list = retreats;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(q));
    }
    if (retreatFilter !== 'all') {
      list = list.filter(r => r.status === retreatFilter);
    }
    return list;
  }, [retreats, searchQuery, retreatFilter]);

  const filteredGuides = useMemo(() => {
    if (!searchQuery) return guides;
    const q = searchQuery.toLowerCase();
    return guides.filter(g => g.name.toLowerCase().includes(q));
  }, [guides, searchQuery]);

  if (!isAdmin) return null;

  if (!isFirebaseConfigured()) {
    return (
      <div className="yt-page" style={{ textAlign: 'center', paddingTop: 100 }}>
        <h2 style={{ color: 'var(--text-1)', fontWeight: 300, fontSize: '1.2rem' }}>
          {tsafe('admin.requireOnline', 'Admin panel requires online connection')}
        </h2>
        <button onClick={() => navigate('/auth')} className="btn-primary" style={{ marginTop: 24 }}>
          {tsafe('auth.ui.signIn', 'Sign In')}
        </button>
      </div>
    );
  }

  const renderSearchBar = () => (
    <div style={{ marginBottom: 24, position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: 16 }}><SearchIcon /></div>
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={tsafe('admin.search', 'Search...')}
        style={{
          width: '100%', padding: '12px 12px 12px 48px', borderRadius: 12, border: '1px solid var(--border)',
          backgroundColor: '#FFFFFF', fontSize: '0.9rem', outline: 'none'
        }}
      />
    </div>
  );

  const renderUsers = () => (
    <div className="yt-stack">
      {renderSearchBar()}
      {filteredUsers.map(user => (
        <div key={user.id} className="luxury-card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{user.name || 'Anonymous'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{user.id}</div>
            <div style={{ fontSize: '0.85rem', marginTop: 4 }}>
              <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                {user.role}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {user.role === 'student' && (
              <button 
                onClick={() => handleRoleChange(user.id, 'organizer')}
                className="btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                {tsafe('admin.actions.makeOrganizer', 'Promote')}
              </button>
            )}
            {user.role === 'organizer' && (
              <button 
                onClick={() => handleRoleChange(user.id, 'student')}
                className="btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                {tsafe('admin.actions.makeStudent', 'Demote')}
              </button>
            )}
            <button 
              onClick={() => navigate(`/students/${user.id}`)}
              style={{ fontSize: '0.9rem', padding: 8 }}
            >
              👁️
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRetreats = () => (
    <div className="yt-stack">
      {renderSearchBar()}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'published', 'draft'] as RetreatFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setRetreatFilter(f)}
            style={{
              padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem',
              backgroundColor: retreatFilter === f ? 'var(--text-1)' : 'transparent',
              color: retreatFilter === f ? '#fff' : 'var(--text-2)',
              border: '1px solid var(--border)'
            }}
          >
            {tsafe(`admin.filters.${f}`, f)}
          </button>
        ))}
      </div>

      {filteredRetreats.map(retreat => (
        <div key={retreat.id} className="luxury-card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={retreat.photo} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} alt="" />
            <div>
              <div style={{ fontWeight: 600 }}>{retreat.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{retreat.location?.city} • {retreat.status || 'published'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={() => navigate(`/retreats/${retreat.id}`)}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              {tsafe('admin.actions.view', 'View')}
            </button>
            <button 
              onClick={() => handleUnpublishRetreat(retreat)}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              {retreat.status === 'published' ? tsafe('admin.actions.unpublish', 'Hide') : tsafe('admin.actions.publish', 'Publish')}
            </button>
            <button 
              onClick={() => handleDeleteRetreat(retreat.id)}
              style={{ color: '#DC2626', padding: 8 }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGuides = () => (
    <div className="yt-stack">
      {renderSearchBar()}
      {filteredGuides.map(guide => (
        <div key={guide.id} className="luxury-card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={guide.photo} style={{ width: 48, height: 48, borderRadius: 24, objectFit: 'cover' }} alt="" />
            <div>
              <div style={{ fontWeight: 600 }}>{guide.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{guide.location?.city}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={() => navigate(`/instructors/${guide.id}`)}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              {tsafe('admin.actions.view', 'View')}
            </button>
            <button 
              onClick={() => handleDeleteGuide(guide.id)}
              style={{ color: '#DC2626', padding: 8 }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="yt-page">
      <header className="yt-section">
        <h1 className="yt-h1">{tsafe('admin.title', 'Admin Dashboard')}</h1>
      </header>

      <div style={{ 
        display: 'flex', gap: 12, overflowX: 'auto', marginBottom: 32, 
        paddingBottom: 4, justifyContent: 'flex-start' 
      }} className="hide-scrollbar">
        {(['users', 'retreats', 'guides'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
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
            {tsafe(`admin.tabs.${tab}`, tab)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>Loading...</div>
      ) : (
        <div style={{ paddingBottom: 100 }}>
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'retreats' && renderRetreats()}
          {activeTab === 'guides' && renderGuides()}
        </div>
      )}
    </div>
  );
};
