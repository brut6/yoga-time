
import React, { useState, useMemo, useEffect } from 'react';
import { useSafeTranslation } from '../hooks';
import { dbService } from '../services';
import { InstructorCard, InstructorFilterModal, InstructorFilterState, SmartMatchModal, RetreatCard } from '../components';
import { vibeService } from '../services'; 
import { UserDNA, VibePersona, Instructor, Retreat } from '../types';
import { useSearchParams } from 'react-router-dom';

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

const INITIAL_FILTERS: InstructorFilterState = {
  sortBy: 'recommended',
  price: 'all',
  languages: [],
  tags: [],
  levels: [],
  mode: 'all',
  experience: 'all',
  specializations: [],
  city: '',
  verified: false,
  vibe: []
};

export const InstructorsPage = () => {
  const { tsafe, t } = useSafeTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // -- State --
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);
  const [filters, setFilters] = useState<InstructorFilterState>(INITIAL_FILTERS);
  const [userDNA, setUserDNA] = useState<UserDNA | null>(null);
  
  // Exclusive State: Matches (Stores extended instructor objects)
  const [matchResults, setMatchResults] = useState<any[] | null>(null);

  const activeVibe = searchParams.get('vibe');

  // Load Data on mount
  useEffect(() => {
    setUserDNA(vibeService.getDNA());
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [loadedInstructors, loadedRetreats] = await Promise.all([
          dbService.getGuides(),
          dbService.getRetreats()
        ]);
        setInstructors(loadedInstructors);
        setRetreats(loadedRetreats);
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prevent background scrolling when Smart Match is open
  useEffect(() => {
    document.body.style.overflow = isSmartMatchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSmartMatchOpen]);

  // -- Vibe Result Filter Logic --
  const filterByVibe = (items: any[], vibeKey: string) => {
    const normVibe = vibeKey.toLowerCase().replace(/_/g, ' ');
    
    // 1. Exact Match (Preferred)
    const exact = items.filter(i => i.vibes?.includes(vibeKey));
    if (exact.length > 0) return { items: exact, isExact: true };

    // 2. Fallback Match (Tags, Description)
    const fallback = items.filter(i => 
      i.tags?.some((t: string) => t.toLowerCase().includes(normVibe)) ||
      i.description?.toLowerCase().includes(normVibe) ||
      i.bio?.toLowerCase().includes(normVibe)
    );
    return { items: fallback, isExact: false };
  };

  const vibeResults = useMemo(() => {
    if (!activeVibe) return null;

    const instructorsData = filterByVibe(instructors, activeVibe);
    const retreatsData = filterByVibe(retreats, activeVibe);

    return {
      instructors: instructorsData.items,
      retreats: retreatsData.items,
      isExact: instructorsData.isExact || retreatsData.isExact
    };
  }, [activeVibe, instructors, retreats]);

  // -- Standard Filter Logic --
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    instructors.forEach(i => i.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [instructors]);

  const filteredInstructors = useMemo(() => {
    let result = instructors;

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.location.city.toLowerCase().includes(q) ||
        i.tags.some(tag => tag.toLowerCase().includes(q)) ||
        i.languages.some(l => l.toLowerCase().includes(q))
      );
    }

    // 2. Price Filter
    if (filters.price !== 'all') {
      result = result.filter(i => {
        const p = i.pricePerHour?.amount || 0;
        if (filters.price === 'budget') return p < 50;
        if (filters.price === 'standard') return p >= 50 && p <= 100;
        if (filters.price === 'premium') return p > 100;
        return true;
      });
    }

    // 3. Languages
    if (filters.languages.length > 0) {
      result = result.filter(i => 
        filters.languages.some(l => i.languages.includes(l))
      );
    }

    // 4. Styles / Tags
    if (filters.tags.length > 0) {
       result = result.filter(i => 
        filters.tags.some(tag => i.tags.includes(tag))
      );
    }

    // 5. Mode
    if (filters.mode !== 'all') {
      result = result.filter(i => 
        i.teachingMode === 'both' || i.teachingMode === filters.mode
      );
    }

    // 6. Experience
    if (filters.experience !== 'all') {
      result = result.filter(i => {
        const exp = i.experienceYears || 0;
        if (filters.experience === 'junior') return exp < 3;
        if (filters.experience === 'mid') return exp >= 3 && exp < 7;
        if (filters.experience === 'senior') return exp >= 7;
        return true;
      });
    }

    // 7. Verified
    if (filters.verified) {
      result = result.filter(i => i.verified);
    }

    // 8. City
    if (filters.city) {
      const cityQ = filters.city.toLowerCase();
      result = result.filter(i => i.location.city.toLowerCase().includes(cityQ));
    }
    
    // 9. Vibe
    if (filters.vibe.length > 0) {
       result = result.filter(i => 
         filters.vibe.some(v => i.vibes?.some(iv => iv.includes(v)))
       );
    }

    // 10. Sorting
    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case 'priceLow': return (a.pricePerHour?.amount || 0) - (b.pricePerHour?.amount || 0);
        case 'priceHigh': return (b.pricePerHour?.amount || 0) - (a.pricePerHour?.amount || 0);
        case 'rating': return b.rating.average - a.rating.average;
        case 'experienceHigh': return (b.experienceYears || 0) - (a.experienceYears || 0);
        case 'verifiedFirst': return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
        default: return 0; // Recommended
      }
    });

    return result;
  }, [searchQuery, filters, instructors]);

  const activeFiltersCount = 
    (filters.price !== 'all' ? 1 : 0) +
    filters.languages.length +
    filters.tags.length +
    filters.levels.length +
    (filters.mode !== 'all' ? 1 : 0) +
    (filters.experience !== 'all' ? 1 : 0) +
    filters.specializations.length +
    (filters.city ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    filters.vibe.length;

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
               {matchResults 
                 ? tsafe('smartMatch.matchesFound', 'Top Matches') 
                 : activeVibe 
                   ? tsafe('common.matchesForVibe', { vibe: localizedVibeLabel })
                   : tsafe('instructors.title', 'Mentors')
               }
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
               {matchResults 
                 ? userDNA 
                    ? tsafe('smartMatch.resultsSubtitleDNA', `Curated for your ${userDNA.persona} state.`)
                    : tsafe('smartMatch.resultsSubtitle', 'Based on your profile.') 
                 : activeVibe
                   ? (vibeResults?.isExact ? tsafe('common.recommendedForVibe', {vibe: localizedVibeLabel}) : tsafe('common.noExactVibeMatch', 'Showing similar options'))
                   : tsafe('instructors.subtitle', 'Guides for your journey.')}
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
             {/* Active Vibe Context Banner */}
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
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-1)', fontWeight: 500 }}>
                      {t('common.matchesForVibe', { vibe: localizedVibeLabel })}
                    </div>
                  </div>
                  <button 
                    onClick={clearVibeFilter}
                    style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-2)', 
                      fontWeight: 600, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255,255,255,0.6)',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    {t('common.clearFilter', 'Clear')}
                  </button>
                </div>
             )}

             {/* Smart Match or Clear */}
             <div style={{ marginBottom: 16 }}>
               {matchResults ? (
                 <button 
                   onClick={() => setMatchResults(null)}
                   style={{
                     width: '100%', padding: '14px', borderRadius: 12,
                     backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)',
                     color: 'var(--text-2)', fontSize: '0.9rem', fontWeight: 500,
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                     boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                   }}
                 >
                   ✕ {tsafe('common.viewAll', 'View All')}
                 </button>
               ) : (
                 !activeVibe && (
                   <button 
                     onClick={() => setIsSmartMatchOpen(true)}
                     style={{
                       width: '100%', padding: '14px', borderRadius: 12,
                       background: 'linear-gradient(to right, #FDFBF9, #F7F5F2)',
                       border: '1px solid rgba(198, 162, 126, 0.15)',
                       color: 'var(--text-1)', fontSize: '0.9rem', fontWeight: 500,
                       display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                       boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                       fontFamily: 'var(--font-sans)', letterSpacing: '0.02em', textTransform: 'uppercase'
                     }}
                   >
                     <span style={{ fontSize: '1.1rem' }}>✨</span> 
                     {tsafe('instructors.findMatch', 'Find a Mentor')}
                   </button>
                 )
               )}
             </div>

             {/* Standard Tools (Hidden in Vibe/Match Mode) */}
             {!matchResults && !activeVibe && (
               <div style={{ display: 'flex', gap: 12 }}>
                 <div style={{ 
                   flex: 1, position: 'relative', display: 'flex', alignItems: 'center',
                   backgroundColor: '#FFFFFF', borderRadius: 100, border: '1px solid transparent',
                   boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                 }}>
                   <div style={{ paddingLeft: 16, display: 'flex' }}><SearchIcon /></div>
                   <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={tsafe('instructors.searchPlaceholder', 'Name or style...')}
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
          
          {/* 3. LIST CONTENT */}
          <div className="yt-stack stagger-appear" style={{ paddingTop: 32, paddingBottom: 80, gap: 24 }}>
            
            {matchResults ? (
              // A) Smart Match Results
              matchResults.map((instructor) => {
                const reasons = instructor._matchReasons || [];
                return (
                  <div key={instructor.id} style={{ width: '100%' }}>
                    <InstructorCard 
                      instructor={instructor} 
                      matchReasons={reasons} 
                    />
                  </div>
                );
              })
            ) : activeVibe && vibeResults ? (
              // B) Vibe Results (Split View: Guides + Retreats)
              <>
                {/* SECTION 1: GUIDES */}
                <div style={{ marginBottom: 12 }}>
                  <h3 className="yt-h2" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 12, marginBottom: 24 }}>
                    {t('common.guidesForMood', 'Guides for your mood')}
                  </h3>
                  
                  {vibeResults.instructors.length > 0 ? (
                    <div style={{ display: 'grid', gap: 24 }}>
                      {vibeResults.instructors.map(instructor => (
                        <div key={instructor.id}>
                          <InstructorCard instructor={instructor} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-3)', fontStyle: 'italic' }}>
                      {t('instructors.noResults', 'No guides found')}
                    </div>
                  )}
                </div>

                {/* SECTION 2: RETREATS */}
                {vibeResults.retreats.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <h3 className="yt-h2" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 12, marginBottom: 24 }}>
                      {t('common.retreatsForMood', 'Retreats for your mood')}
                    </h3>
                    <div style={{ display: 'grid', gap: 32 }}>
                      {vibeResults.retreats.map(retreat => (
                        <div key={retreat.id}>
                          <RetreatCard retreat={retreat} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // C) Standard Directory View
              filteredInstructors.length > 0 ? (
                filteredInstructors.map(instructor => (
                  <div key={instructor.id} style={{ width: '100%' }}>
                    <InstructorCard instructor={instructor} />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-2)' }}>
                  <p style={{ fontSize: '1.2rem', marginBottom: 16 }}>{tsafe('instructors.noResults', 'No mentors found')}</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilters(INITIAL_FILTERS);
                    }}
                    style={{ textDecoration: 'underline', color: 'var(--text-1)', fontWeight: 500 }}
                  >
                    {tsafe('instructors.clearFilters', 'Clear Filters')}
                  </button>
                </div>
              )
            )}
          </div>
        </>
      )}

      <InstructorFilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
        availableTags={allTags}
      />

      <SmartMatchModal
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
