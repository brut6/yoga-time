
import React, { useState, useMemo, useEffect } from 'react';
import { useSafeTranslation } from '../hooks';
import { dbService, isFirebaseConfigured } from '../services';
import { RetreatCard, FilterModal, FilterState, RetreatSmartMatchModal } from '../components';
import { vibeService } from '../services';
import { UserDNA, Retreat, Vibe } from '../types';
import { useSearchParams } from 'react-router-dom';
import { Unsubscribe } from 'firebase/firestore';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SlidersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"></line>
    <line x1="4" y1="10" x2="4" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12" y2="3"></line>
    <line x1="20" y1="21" x2="20" y2="16"></line>
    <line x1="20" y1="12" x2="20" y2="3"></line>
    <line x1="1" y1="14" x2="7" y2="14"></line>
    <line x1="9" y1="8" x2="15" y2="8"></line>
    <line x1="17" y1="16" x2="23" y2="16"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const RetreatsPage = () => {
  const { tsafe, t } = useSafeTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // -- State --
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);
  const [userDNA, setUserDNA] = useState<UserDNA | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'recommended',
    duration: 'all',
    tags: [],
    difficulty: 'all',
    retreatType: 'all',
    goals: [],
    comfort: 'all',
    silence: 'all',
    location: '',
    dateRange: { start: '', end: '' }
  });

  // Exclusive State: Matches
  const [matchResults, setMatchResults] = useState<Retreat[] | null>(null);

  const activeVibe = searchParams.get('vibe');

  useEffect(() => {
    setUserDNA(vibeService.getDNA());
    
    let unsubscribe: Unsubscribe | undefined;

    const fetchRetreats = async () => {
      setIsLoading(true);
      try {
        if (isFirebaseConfigured()) {
          // Realtime Subscription
          unsubscribe = dbService.subscribeToRetreats((data) => {
            setRetreats(data);
            setIsLoading(false);
          });
        } else {
          // Fallback to Mocks (One-time fetch)
          const data = await dbService.getRetreats();
          setRetreats(data);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to load retreats", e);
        setIsLoading(false);
      }
    };

    fetchRetreats();

    // Cleanup
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Prevent background scrolling when Smart Match is open
  useEffect(() => {
    document.body.style.overflow = isSmartMatchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSmartMatchOpen]);

  // -- Derived Data --
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    retreats.forEach(r => r.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [retreats]);

  // First, apply standard filters
  const standardFilteredRetreats = useMemo(() => {
    let result = retreats;

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.location.city.toLowerCase().includes(q) ||
        r.location.country.toLowerCase().includes(q) ||
        r.tags.some(tag => tag.toLowerCase().includes(q)) ||
        (r.retreatType && r.retreatType.includes(q))
      );
    }

    // 2. Filters
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter(r => 
        r.location.city.toLowerCase().includes(loc) || 
        r.location.country.toLowerCase().includes(loc)
      );
    }

    if (filters.dateRange.start) {
      result = result.filter(r => new Date(r.dates.start) >= new Date(filters.dateRange.start));
    }

    if (filters.dateRange.end) {
      result = result.filter(r => new Date(r.dates.end) <= new Date(filters.dateRange.end));
    }

    if (filters.duration !== 'all') {
      result = result.filter(r => {
        if (filters.duration === 'short') return r.durationDays < 5;
        if (filters.duration === 'medium') return r.durationDays >= 5 && r.durationDays <= 9;
        if (filters.duration === 'long') return r.durationDays >= 10;
        return true;
      });
    }
    if (filters.difficulty !== 'all') {
      result = result.filter(r => r.difficulty === filters.difficulty);
    }
    if (filters.retreatType !== 'all') {
      result = result.filter(r => r.retreatType === filters.retreatType);
    }
    if (filters.comfort !== 'all') {
      result = result.filter(r => r.comfortLevel === filters.comfort);
    }
    if (filters.silence !== 'all') {
      const wantsSilence = filters.silence === 'yes';
      result = result.filter(r => r.isSilence === wantsSilence);
    }
    if (filters.goals.length > 0) {
      result = result.filter(r => 
        filters.goals.some(g => r.goals?.includes(g))
      );
    }
    if (filters.tags.length > 0) {
      result = result.filter(r => 
        filters.tags.every(tag => r.tags.includes(tag))
      );
    }

    // 3. Sorting & Recommendations
    if (filters.sortBy === 'recommended' && userDNA) {
      result = result.map(r => {
        let score = 0;
        const DNA_VIBES = userDNA.primaryVibes || [];
        const vibeMatches = r.vibes.filter(v => DNA_VIBES.includes(v)).length;
        score += vibeMatches * 10;
        if (userDNA.intensity === 'gentle' && (r.difficulty === 'light')) score += 5;
        if (userDNA.intensity === 'fiery' && (r.difficulty === 'hardcore')) score += 5;
        return { ...r, _score: score };
      }).sort((a, b) => (b as any)._score - (a as any)._score);
    } else {
      result = [...result].sort((a, b) => {
        switch (filters.sortBy) {
          case 'priceLow': return a.priceFrom.amount - b.priceFrom.amount;
          case 'priceHigh': return b.priceFrom.amount - a.priceFrom.amount;
          case 'newest': return b.id.localeCompare(a.id); 
          default: return 0;
        }
      });
    }

    return result;
  }, [searchQuery, filters, userDNA, retreats]);

  // Then, apply Vibe filtering on top (Exact or Fallback)
  const { visibleRetreats, isVibeFallback } = useMemo(() => {
    if (!activeVibe) return { visibleRetreats: standardFilteredRetreats, isVibeFallback: false };

    // 1. Exact Match
    const exact = standardFilteredRetreats.filter(r => r.vibes?.includes(activeVibe as Vibe));
    if (exact.length > 0) return { visibleRetreats: exact, isVibeFallback: false };

    // 2. Partial Fallback (e.g. check tags)
    // Relaxed matching: check tags or description for similar keywords
    const keyword = activeVibe.replace(/_/g, ' ').toLowerCase();
    const partial = standardFilteredRetreats.filter(r => 
      r.tags.some(t => t.toLowerCase().includes(keyword)) ||
      (r.description && r.description.toLowerCase().includes(keyword))
    );

    if (partial.length > 0) return { visibleRetreats: partial, isVibeFallback: true };

    // 3. No match at all -> Show all but indicate fallback
    return { visibleRetreats: standardFilteredRetreats, isVibeFallback: true };

  }, [standardFilteredRetreats, activeVibe]);

  const activeFiltersCount = 
    (filters.duration !== 'all' ? 1 : 0) +
    filters.tags.length +
    (filters.difficulty !== 'all' ? 1 : 0) +
    (filters.retreatType !== 'all' ? 1 : 0) +
    filters.goals.length +
    (filters.comfort !== 'all' ? 1 : 0) +
    (filters.silence !== 'all' ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.dateRange.start ? 1 : 0);

  const clearVibeFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('vibe');
    setSearchParams(newParams);
  };

  const localizedVibeLabel = activeVibe ? t(`vibe.${activeVibe}`) : '';

  if (isLoading) {
    return (
      <div className="yt-page" style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
        <div style={{ color: 'var(--text-3)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="yt-page" style={{ paddingTop: 0 }}>
      
      {!isSmartMatchOpen && (
        <>
          {/* 1. EDITORIAL HEADER */}
          <div style={{ padding: '32px 8px 16px', textAlign: 'center' }}>
             <h1 style={{ 
               fontFamily: 'var(--font-serif)', 
               fontSize: '2.8rem', 
               fontWeight: 400, 
               color: 'var(--text-1)', 
               marginBottom: 8,
               lineHeight: 1.1
             }}>
               {matchResults ? tsafe('smartMatch.matchesFound', 'Your Matches') : tsafe('retreats.title', 'Retreats')}
             </h1>
             <p style={{ 
               fontSize: '1.05rem', 
               fontWeight: 300, 
               color: 'var(--text-2)',
               maxWidth: '80%',
               margin: '0 auto',
               lineHeight: 1.5,
               fontStyle: 'italic'
             }}>
               {matchResults ? tsafe('smartMatch.resultsSubtitle', 'Curated for you.') : tsafe('retreats.subtitle', 'Journeys with purpose.')}
             </p>
          </div>

          {/* 2. STICKY TOOLS */}
          <div style={{ 
            position: 'sticky', top: 0, zIndex: 40, 
            backgroundColor: 'rgba(245, 243, 240, 0.96)',
            backdropFilter: 'blur(12px)',
            margin: '0 -16px', padding: '12px 16px 16px',
            borderBottom: '1px solid rgba(0,0,0,0.03)'
          }}>
             {/* Vibe Context Banner (Active Vibe Filter) */}
             {activeVibe && (
                <div style={{ 
                  marginBottom: 16, 
                  backgroundColor: '#F3F0EB', 
                  borderRadius: 12, 
                  padding: '10px 16px',
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-1)', fontWeight: 500 }}>
                      {t('common.matchesForVibe', { vibe: localizedVibeLabel })}
                    </div>
                    {isVibeFallback && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 2 }}>
                        {t('common.noExactVibeMatch', 'No exact matches, showing similar')}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={clearVibeFilter}
                    style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-2)', 
                      fontWeight: 600, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      padding: '4px 8px', 
                      backgroundColor: 'rgba(255,255,255,0.6)',
                      borderRadius: 6
                    }}
                  >
                    {t('common.clearFilter', 'Clear')}
                  </button>
                </div>
             )}

             <div style={{ marginBottom: 16 }}>
               {matchResults ? (
                 <button 
                   onClick={() => setMatchResults(null)}
                   style={{
                     width: '100%',
                     padding: '14px',
                     borderRadius: 12,
                     backgroundColor: '#FFFFFF',
                     border: '1px solid rgba(0,0,0,0.1)',
                     color: 'var(--text-2)',
                     fontSize: '0.9rem',
                     fontWeight: 500,
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                     boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                   }}
                 >
                   ✕ {tsafe('common.viewAll', 'View All')}
                 </button>
               ) : (
                 <button 
                   onClick={() => setIsSmartMatchOpen(true)}
                   style={{
                     width: '100%',
                     padding: '14px',
                     borderRadius: 12,
                     background: 'linear-gradient(to right, #FDFBF9, #F7F5F2)',
                     border: '1px solid rgba(198, 162, 126, 0.15)',
                     color: 'var(--text-1)',
                     fontSize: '0.9rem',
                     fontWeight: 500,
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                     boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                     fontFamily: 'var(--font-sans)',
                     letterSpacing: '0.02em',
                     textTransform: 'uppercase'
                   }}
                 >
                   <span style={{ fontSize: '1.1rem' }}>✨</span> 
                   {tsafe('retreatSmartMatch.findMatch', 'Find Perfect Retreat')}
                 </button>
               )}
             </div>

             {!matchResults && (
               <div style={{ display: 'flex', gap: 12 }}>
                 <div style={{ 
                   flex: 1, position: 'relative', display: 'flex', alignItems: 'center',
                   backgroundColor: '#FFFFFF', 
                   borderRadius: 100, 
                   border: '1px solid transparent',
                   boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                 }}>
                   <div style={{ paddingLeft: 16, display: 'flex' }}><SearchIcon /></div>
                   <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={tsafe('retreats.searchPlaceholder', 'Location, style...')}
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

                 <button 
                   onClick={() => setIsFilterOpen(true)}
                   style={{ 
                     width: 48, height: 48, borderRadius: '50%', 
                     backgroundColor: activeFiltersCount > 0 ? 'var(--text-1)' : '#FFFFFF',
                     color: activeFiltersCount > 0 ? '#fff' : 'var(--text-1)',
                     border: '1px solid rgba(0,0,0,0.05)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     position: 'relative', flexShrink: 0,
                     boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                   }}
                 >
                   <SlidersIcon />
                   {activeFiltersCount > 0 && (
                     <div style={{ 
                       position: 'absolute', top: 0, right: 0, 
                       width: 14, height: 14, borderRadius: '50%', backgroundColor: 'var(--gold-sand)', 
                       border: '2px solid #FFF'
                     }} />
                   )}
                 </button>
               </div>
             )}
          </div>
          
          {/* 3. Retreats List */}
          <div className="yt-stack stagger-appear" style={{ paddingTop: 32, paddingBottom: 80, gap: 32 }}>
            {matchResults ? (
              matchResults.map((retreat) => (
                <div key={retreat.id}>
                  <RetreatCard retreat={retreat} />
                </div>
              ))
            ) : (
              visibleRetreats.length > 0 ? (
                visibleRetreats.map(retreat => (
                  <div key={retreat.id}>
                    <RetreatCard retreat={retreat} />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-2)' }}>
                  <p style={{ fontSize: '1.2rem', marginBottom: 16 }}>{tsafe('retreats.noResults', 'No retreats found')}</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        sortBy: 'recommended',
                        duration: 'all',
                        tags: [],
                        difficulty: 'all',
                        retreatType: 'all',
                        goals: [],
                        comfort: 'all',
                        silence: 'all',
                        location: '',
                        dateRange: { start: '', end: '' }
                      });
                      if(activeVibe) clearVibeFilter();
                    }}
                    style={{ textDecoration: 'underline', color: 'var(--text-1)', fontWeight: 500 }}
                  >
                    {tsafe('retreats.clearFilters', 'Clear Filters')}
                  </button>
                </div>
              )
            )}
          </div>
        </>
      )}

      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
        availableTags={allTags}
      />

      <RetreatSmartMatchModal
        isOpen={isSmartMatchOpen}
        onClose={() => setIsSmartMatchOpen(false)}
        onMatch={(results) => {
          setMatchResults(results);
          setIsSmartMatchOpen(false);
        }}
      />
    </div>
  );
};
