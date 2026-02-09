
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { storageService, dbService, isFirebaseConfigured } from '../services';
import { Instructor } from '../types';

export const DevPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [guides, setGuides] = useState<Instructor[]>([]);
  
  // Converter State
  const [configInput, setConfigInput] = useState('');
  const [envOutput, setEnvOutput] = useState('');

  // Form States
  const [guideForm, setGuideForm] = useState({
    name: '',
    bio: '',
    city: '',
    country: '',
    vibes: '',
    photo: '',
    price: '80'
  });

  const [retreatForm, setRetreatForm] = useState({
    title: '',
    description: '',
    city: '',
    country: '',
    price: '1500',
    vibes: '',
    photo: '',
    guideId: ''
  });

  useEffect(() => {
    const devParam = searchParams.get('dev');
    if (devParam === '1' || devParam === 'true') {
      storageService.setDevMode(true);
      setIsAuthorized(true);
    } else if (storageService.isDevMode()) {
      setIsAuthorized(true);
    } else {
      navigate('/');
    }

    // Load guides for dropdown
    dbService.getGuides().then(setGuides);
  }, [searchParams, navigate]);

  const handleConvertConfig = () => {
    const mapping: Record<string, string> = {
      apiKey: 'VITE_FIREBASE_API_KEY',
      authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
      projectId: 'VITE_FIREBASE_PROJECT_ID',
      storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
      messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
      appId: 'VITE_FIREBASE_APP_ID'
    };

    let output = '';
    const regex = /([a-zA-Z0-9_]+)\s*:\s*["']?([^"'\s,]+)["']?/g;
    
    let match;
    while ((match = regex.exec(configInput)) !== null) {
      const key = match[1];
      let value = match[2];

      if (mapping[key]) {
        if (key === 'storageBucket') {
           if (value.includes('.firebasestorage.app')) {
             value = value.replace('.firebasestorage.app', '.appspot.com');
           }
        }
        output += `${mapping[key]}=${value}\n`;
      }
    }
    
    if (!output) {
      output = "# Could not parse config. Please paste the content inside 'firebaseConfig = { ... }'.";
    }

    setEnvOutput(output);
  };

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Instructor> = {
        name: guideForm.name,
        bio: guideForm.bio,
        location: { city: guideForm.city, country: guideForm.country },
        vibes: guideForm.vibes.split(',').map(s => s.trim()) as any[],
        photo: guideForm.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
        pricePerHour: { amount: Number(guideForm.price), currency: 'USD' },
        rating: { average: 5.0, count: 1 },
        verified: true,
        tags: [],
        languages: ['English']
      };
      await dbService.addGuide(payload);
      alert('Guide Saved Successfully');
      setGuideForm({ name: '', bio: '', city: '', country: '', vibes: '', photo: '', price: '80' });
      dbService.getGuides().then(setGuides); // Refresh list
    } catch (err) {
      alert('Error saving guide');
      console.error(err);
    }
  };

  const handleRetreatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retreatForm.guideId) {
      alert('Please select a guide/organizer');
      return;
    }
    
    const selectedGuide = guides.find(g => g.id === retreatForm.guideId);
    
    try {
      // Basic Retreat Payload
      const payload: any = {
        title: retreatForm.title,
        description: retreatForm.description,
        location: { city: retreatForm.city, country: retreatForm.country },
        priceFrom: { amount: Number(retreatForm.price), currency: 'USD' },
        vibes: retreatForm.vibes.split(',').map(s => s.trim()),
        photo: retreatForm.photo || "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
        organizer: selectedGuide ? {
          id: selectedGuide.id,
          name: selectedGuide.name,
          photo: selectedGuide.photo,
          rating: selectedGuide.rating
        } : undefined,
        durationDays: 7,
        dates: { start: new Date().toISOString(), end: new Date(Date.now() + 7*86400000).toISOString() },
        rating: { average: 5.0, count: 0 },
        tags: []
      };

      await dbService.addRetreat(payload);
      alert('Retreat Saved Successfully');
      setRetreatForm({ title: '', description: '', city: '', country: '', price: '1500', vibes: '', photo: '', guideId: '' });
    } catch (err) {
      alert('Error saving retreat');
      console.error(err);
    }
  };

  if (!isAuthorized) return null;

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: 8,
    border: '1px solid var(--border-strong)',
    marginBottom: 16,
    fontSize: '0.95rem',
    fontFamily: 'inherit'
  };

  const btnStyle = {
    backgroundColor: 'var(--text-1)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 99,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '100%'
  };

  return (
    <div className="yt-page">
      <header className="yt-section">
        <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600, marginBottom: 16 }}>
          DEV MODE
        </div>
        <h1 className="yt-h1">Developer Tools</h1>
        <p className="yt-sub">
          {isFirebaseConfigured() ? "Connected to Firestore" : "Running in Mock Mode (Local)"}
        </p>
      </header>

      <div style={{ display: 'grid', gap: 64 }}>

        {/* SECTION 0: ENV CONVERTER */}
        <section className="yt-card" style={{ padding: 24, backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
          <h2 className="yt-h2" style={{ borderBottom: '1px solid #BAE6FD', paddingBottom: 16, color: '#0369A1' }}>Firebase Config Converter</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: 16, color: '#0C4A6E' }}>
            Paste the JS object from Firebase Console to generate <code>.env.local</code> format.
          </p>
          <textarea 
            placeholder={'apiKey: "...",\nauthDomain: "...",\n...'}
            value={configInput}
            onChange={e => setConfigInput(e.target.value)}
            style={{...inputStyle, minHeight: 120, fontFamily: 'monospace', fontSize: '0.85rem'}}
          />
          <button onClick={handleConvertConfig} style={{...btnStyle, backgroundColor: '#0284C7', marginBottom: 24}}>Generate .env.local</button>
          
          {envOutput && (
            <div style={{ position: 'relative' }}>
              <pre style={{ 
                backgroundColor: '#0F172A', color: '#E2E8F0', padding: 16, 
                borderRadius: 8, overflowX: 'auto', fontSize: '0.8rem', whiteSpace: 'pre-wrap'
              }}>
                {envOutput}
              </pre>
              <button 
                onClick={() => navigator.clipboard.writeText(envOutput)}
                style={{ position: 'absolute', top: 8, right: 8, fontSize: '0.75rem', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 4 }}
              >
                Copy
              </button>
            </div>
          )}
        </section>
        
        {/* SECTION 1: ADD GUIDE */}
        <section className="yt-card" style={{ padding: 24 }}>
          <h2 className="yt-h2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Add Guide</h2>
          <form onSubmit={handleGuideSubmit}>
            <input 
              placeholder="Name"
              value={guideForm.name}
              onChange={e => setGuideForm({...guideForm, name: e.target.value})}
              style={inputStyle}
              required
            />
            <textarea 
              placeholder="Bio"
              value={guideForm.bio}
              onChange={e => setGuideForm({...guideForm, bio: e.target.value})}
              style={{...inputStyle, minHeight: 100, resize: 'vertical'}}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input 
                placeholder="City"
                value={guideForm.city}
                onChange={e => setGuideForm({...guideForm, city: e.target.value})}
                style={inputStyle}
              />
              <input 
                placeholder="Country"
                value={guideForm.country}
                onChange={e => setGuideForm({...guideForm, country: e.target.value})}
                style={inputStyle}
              />
            </div>
            <input 
              placeholder="Vibes (comma separated)"
              value={guideForm.vibes}
              onChange={e => setGuideForm({...guideForm, vibes: e.target.value})}
              style={inputStyle}
            />
            <input 
              placeholder="Photo URL"
              value={guideForm.photo}
              onChange={e => setGuideForm({...guideForm, photo: e.target.value})}
              style={inputStyle}
            />
            <button type="submit" style={btnStyle}>Save Guide</button>
          </form>
        </section>

        {/* SECTION 2: ADD RETREAT */}
        <section className="yt-card" style={{ padding: 24 }}>
          <h2 className="yt-h2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Add Retreat</h2>
          <form onSubmit={handleRetreatSubmit}>
            <input 
              placeholder="Title"
              value={retreatForm.title}
              onChange={e => setRetreatForm({...retreatForm, title: e.target.value})}
              style={inputStyle}
              required
            />
            <textarea 
              placeholder="Description"
              value={retreatForm.description}
              onChange={e => setRetreatForm({...retreatForm, description: e.target.value})}
              style={{...inputStyle, minHeight: 100, resize: 'vertical'}}
              required
            />
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8 }}>Organizer / Guide</label>
              <select 
                value={retreatForm.guideId}
                onChange={e => setRetreatForm({...retreatForm, guideId: e.target.value})}
                style={inputStyle}
                required
              >
                <option value="">Select Guide...</option>
                {guides.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input 
                placeholder="City"
                value={retreatForm.city}
                onChange={e => setRetreatForm({...retreatForm, city: e.target.value})}
                style={inputStyle}
              />
              <input 
                placeholder="Country"
                value={retreatForm.country}
                onChange={e => setRetreatForm({...retreatForm, country: e.target.value})}
                style={inputStyle}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input 
                type="number"
                placeholder="Price (USD)"
                value={retreatForm.price}
                onChange={e => setRetreatForm({...retreatForm, price: e.target.value})}
                style={inputStyle}
              />
              <input 
                placeholder="Vibes (comma separated)"
                value={retreatForm.vibes}
                onChange={e => setRetreatForm({...retreatForm, vibes: e.target.value})}
                style={inputStyle}
              />
            </div>

            <input 
              placeholder="Cover Photo URL"
              value={retreatForm.photo}
              onChange={e => setRetreatForm({...retreatForm, photo: e.target.value})}
              style={inputStyle}
            />
            <button type="submit" style={btnStyle}>Save Retreat</button>
          </form>
        </section>

      </div>
    </div>
  );
};
