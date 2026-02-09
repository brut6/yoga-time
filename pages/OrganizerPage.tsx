
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { storageService, subscriptionService, dbService, isFirebaseConfigured, auth } from '../services';
import { uploadImage, dataURLtoBlob } from '../services/firebase';
import { Retreat, Organizer, ProgramDay } from '../types';
import { RetreatCard, MediaPicker, MediaGalleryPicker } from '../components';

interface DraftForm {
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  amount: string;
  currency: string;
  coverImage: string | null;
  gallery: string[];
  tags: string;
  dailyJourney: { title: string; description: string }[];
}

const INITIAL_FORM: DraftForm = {
  title: '',
  city: '',
  country: '',
  startDate: '',
  endDate: '',
  amount: '',
  currency: 'USD',
  coverImage: null,
  gallery: [],
  tags: '',
  dailyJourney: [
    { title: '', description: '' } 
  ]
};

const CURRENT_USER_ORG: Organizer = {
  id: "user_org",
  name: "You",
  photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  rating: { average: 5.0, count: 0 },
  description: "Your retreats"
};

export const OrganizerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DraftForm>(INITIAL_FORM);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [published, setPublished] = useState<any[]>([]);
  const [previewDraftId, setPreviewDraftId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!subscriptionService.hasFeature('canSeeOrganizerTools')) {
      navigate('/paywall');
      return;
    }
    loadData();
    setIsDemoMode(localStorage.getItem('yt_demo_mode') === 'true');
  }, [navigate]);

  const loadData = () => {
    setDrafts(storageService.getRetreatDrafts());
    setPublished(storageService.getPublishedRetreats());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- Daily Journey Logic ---
  const handleDayChange = (index: number, field: 'title' | 'description', value: string) => {
    const newJourney = [...formData.dailyJourney];
    newJourney[index][field] = value;
    setFormData({ ...formData, dailyJourney: newJourney });
  };

  const addDay = () => {
    setFormData({ 
      ...formData, 
      dailyJourney: [...formData.dailyJourney, { title: '', description: '' }] 
    });
  };

  const removeDay = (index: number) => {
    const newJourney = [...formData.dailyJourney];
    newJourney.splice(index, 1);
    setFormData({ ...formData, dailyJourney: newJourney });
  };

  const validateProgram = (): boolean => {
    const validDays = formData.dailyJourney.filter(d => d.title.trim().length > 0);
    if (validDays.length === 0) {
      alert(t('organizerPage.alerts.programRequired'));
      return false;
    }
    return true;
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProgram()) return;

    const programDays: ProgramDay[] = formData.dailyJourney.map((d, i) => ({
      day: i + 1,
      title: d.title || `Day ${i + 1}`,
      description: d.description || ''
    }));

    const newDraft = {
      id: Date.now().toString(),
      title: formData.title || t('organizerPage.placeholders.untitled'),
      location: {
        city: formData.city || t('organizerPage.placeholders.unknownCity'),
        country: formData.country || t('organizerPage.placeholders.unknownCountry')
      },
      dates: { start: formData.startDate, end: formData.endDate },
      priceFrom: { amount: Number(formData.amount) || 0, currency: formData.currency },
      photo: formData.coverImage || "https://images.unsplash.com/photo-1506126613408-eca07ce68773", 
      gallery: formData.gallery,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dailyJourney: programDays,
      createdAt: new Date().toISOString()
    };
    storageService.saveRetreatDraft(newDraft);
    loadData();
    setFormData(INITIAL_FORM);
  };

  const convertDraftToRetreat = (draft: any): Retreat => {
    let duration = 7;
    if (draft.dates?.start && draft.dates?.end) {
      const diff = new Date(draft.dates.end).getTime() - new Date(draft.dates.start).getTime();
      duration = Math.ceil(diff / (1000 * 3600 * 24));
      if (duration < 1) duration = 1;
    }
    return {
      id: draft.id,
      title: draft.title,
      photo: draft.photo,
      gallery: draft.gallery,
      location: draft.location,
      dates: draft.dates,
      durationDays: duration,
      priceFrom: draft.priceFrom,
      organizer: CURRENT_USER_ORG,
      instructors: [],
      tags: draft.tags,
      vibes: [],
      rating: { average: 0, count: 0 },
      description: "Preview description...",
      boost: draft.boost,
      dailyJourney: draft.dailyJourney 
    };
  };

  const togglePreview = (id: string) => setPreviewDraftId(previewDraftId === id ? null : id);

  const handlePublish = async (draft: any) => {
    if (!draft.dailyJourney || draft.dailyJourney.length === 0) {
       alert(t('organizerPage.alerts.programRequired'));
       return;
    }
    
    setIsPublishing(true);
    let retreatToPublish = convertDraftToRetreat(draft);

    // Database Bloat Fix: Upload images to Storage if configured
    if (isFirebaseConfigured() && !isDemoMode && auth?.currentUser) {
      try {
        const uid = auth.currentUser.uid;
        
        // 1. Upload Cover
        if (retreatToPublish.photo?.startsWith('data:')) {
          const blob = dataURLtoBlob(retreatToPublish.photo);
          const path = `retreats/${draft.id}/${uid}/cover_${Date.now()}.jpg`;
          const url = await uploadImage(blob, path);
          retreatToPublish.photo = url;
        }

        // 2. Upload Gallery
        if (retreatToPublish.gallery && retreatToPublish.gallery.length > 0) {
          const newGallery = [];
          for (let i = 0; i < retreatToPublish.gallery.length; i++) {
            const img = retreatToPublish.gallery[i];
            if (img.startsWith('data:')) {
              const blob = dataURLtoBlob(img);
              const path = `retreats/${draft.id}/${uid}/gallery_${i}_${Date.now()}.jpg`;
              const url = await uploadImage(blob, path);
              newGallery.push(url);
            } else {
              newGallery.push(img);
            }
          }
          retreatToPublish.gallery = newGallery;
        }

        // 3. Save to Firestore
        const { id, ...payload } = retreatToPublish; 
        await dbService.addRetreat(payload);
        alert('Published to database successfully!');
        
        // Clean up local draft
        storageService.deleteRetreatDraft(draft.id);
        
      } catch (e) {
        console.error("Publish failed", e);
        alert('Failed to publish to database. Saved locally.');
        storageService.publishRetreatDraft(retreatToPublish);
      }
    } else {
      // Local fallback (Offline or Demo)
      if (isDemoMode) alert(t('organizerPage.alerts.demoPublish'));
      storageService.publishRetreatDraft(retreatToPublish);
    }

    setIsPublishing(false);
    setPreviewDraftId(null);
    loadData();
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 0',
    borderRadius: 0,
    border: 'none',
    borderBottom: '1px solid var(--border)',
    fontSize: '1rem',
    color: 'var(--text-1)',
    marginBottom: 24,
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 4,
    fontSize: '0.8rem',
    color: 'var(--text-2)',
    fontWeight: 500,
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const
  };

  return (
    <div className="yt-page">
      <header className="yt-section">
        <h1 className="yt-h1">
          {t('organizerPage.title')}
        </h1>
        <p className="yt-sub">
          {t('organizerPage.subtitle')}
        </p>
      </header>

      {isDemoMode && (
        <div style={{ padding: '8px 0', marginBottom: 32, fontSize: '0.8rem', color: '#92400E', borderBottom: '1px solid #FCD34D' }}>
          {t('common.demoModeBanner')}
        </div>
      )}

      {/* 1. Creation Form */}
      <div style={{ marginBottom: 48 }}>
        <div 
          onClick={() => setIsFormExpanded(!isFormExpanded)}
          style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            marginBottom: 24, cursor: 'pointer' 
          }}
        >
           <h2 className="yt-h2" style={{ margin: 0, fontWeight: 400 }}>
             {t('organizerPage.createTitle')}
           </h2>
           <span style={{ fontSize: '1.2rem', color: 'var(--text-2)' }}>
             {isFormExpanded ? '−' : '+'}
           </span>
        </div>

        {isFormExpanded && (
          <div className="yt-card" style={{ padding: 24, animation: 'fadeInSoft 0.3s ease' }}>
            <form onSubmit={handleSaveDraft}>
              <div>
                <label style={labelStyle}>{t('organizerPage.form.title')}</label>
                <input 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={inputStyle} 
                  placeholder="Ex: Silent Jungle Retreat" 
                />
              </div>

              {/* MEDIA SECTION */}
              <MediaPicker 
                kind="image" 
                labelKey="labels.coverPhoto" 
                value={formData.coverImage} 
                onChange={(url) => setFormData({...formData, coverImage: url})} 
                allowUrlFallback
              />

              <MediaGalleryPicker 
                images={formData.gallery} 
                onChange={(imgs) => setFormData({...formData, gallery: imgs})}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <label style={labelStyle}>{t('organizerPage.form.country')}</label>
                  <input 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    style={inputStyle} 
                    placeholder="Indonesia" 
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('organizerPage.form.city')}</label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={inputStyle} 
                    placeholder="Ubud" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <label style={labelStyle}>{t('organizerPage.form.startDate')}</label>
                  <input 
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('organizerPage.form.endDate')}</label>
                  <input 
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    style={inputStyle} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                <div>
                  <label style={labelStyle}>{t('organizerPage.form.price')}</label>
                  <input 
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    style={inputStyle} 
                    placeholder="2000" 
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('organizerPage.form.currency')}</label>
                  <select 
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, borderBottom: '1px solid var(--border)', background: 'none' }}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="ILS">ILS</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>{t('organizerPage.form.tags')}</label>
                <input 
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  style={inputStyle} 
                  placeholder="Yoga, Meditation" 
                />
              </div>

              {/* DAILY JOURNEY BUILDER (REQUIRED) */}
              <div style={{ marginTop: 40, padding: 24, backgroundColor: '#F9F8F6', borderRadius: 16 }}>
                <label style={{ ...labelStyle, marginBottom: 16 }}>{t('organizerPage.form.dailyJourney')}</label>
                
                {formData.dailyJourney.map((day, index) => (
                  <div key={index} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-3)' }}>DAY {index + 1}</span>
                      {formData.dailyJourney.length > 1 && (
                        <button type="button" onClick={() => removeDay(index)} style={{ fontSize: '0.8rem', color: '#DC2626', cursor: 'pointer' }}>✕</button>
                      )}
                    </div>
                    <input 
                      placeholder={t('organizerPage.form.dayTitle')}
                      value={day.title}
                      onChange={(e) => handleDayChange(index, 'title', e.target.value)}
                      style={{ ...inputStyle, marginBottom: 12, fontWeight: 500 }}
                    />
                    <textarea 
                      placeholder={t('organizerPage.form.dayDesc')}
                      value={day.description}
                      onChange={(e) => handleDayChange(index, 'description', e.target.value)}
                      style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
                    />
                  </div>
                ))}

                <button 
                  type="button" 
                  onClick={addDay}
                  style={{ fontSize: '0.85rem', color: 'var(--gold-sand)', fontWeight: 600, cursor: 'pointer' }}
                >
                  {t('organizerPage.form.addDay')}
                </button>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 32, width: '100%' }}>
                {t('organizerPage.saveDraft')}
              </button>
            </form>
          </div>
        )}
      </div>

       {/* 2. Drafts List */}
      <div style={{ marginBottom: 64 }}>
        <h2 className="yt-h2" style={{ fontWeight: 400 }}>
          {t('organizerPage.draftsTitle')} ({drafts.length})
        </h2>

        {drafts.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontStyle: 'italic', border: '1px dashed var(--border)', borderRadius: 'var(--radius-1)' }}>
            {t('organizerPage.emptyDrafts')}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 24 }}>
            {drafts.slice().reverse().map(draft => (
              <div key={draft.id} className="yt-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{draft.title || t('organizerPage.placeholders.untitled')}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-2)' }}>{draft.location?.city} • {draft.dates?.start}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => togglePreview(draft.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-2)' }}>
                      {previewDraftId === draft.id ? t('organizerPage.hidePreview') : t('organizerPage.preview')}
                    </button>
                    <button 
                      onClick={() => handlePublish(draft)} 
                      className="btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '0.85rem', opacity: isPublishing ? 0.6 : 1 }}
                      disabled={isPublishing}
                    >
                      {isPublishing ? '...' : t('organizerPage.publish')}
                    </button>
                  </div>
                </div>
                 {/* Preview Area */}
                {previewDraftId === draft.id && (
                  <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                      <RetreatCard retreat={convertDraftToRetreat(draft)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Published */}
      <div>
         <h2 className="yt-h2" style={{ fontWeight: 400 }}>
          {t('organizerPage.publishedTitle')} ({published.length})
        </h2>
         {published.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontStyle: 'italic', border: '1px dashed var(--border)', borderRadius: 'var(--radius-1)' }}>
            {t('organizerPage.emptyPublished')}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 40 }}>
            {published.slice().reverse().map(retreat => (
              <div key={retreat.id}>
                <RetreatCard retreat={retreat} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
