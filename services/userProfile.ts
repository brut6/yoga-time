
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, isFirebaseConfigured } from './firebase';

const STORAGE_KEYS = {
  USER_ID: 'yt_user_id',
  PROFILE: 'yt_user_profile',
};

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  language: string;
  role: 'student' | 'organizer' | 'instructor' | 'admin';
  favorites: {
    retreats: string[];
    instructors: string[];
  };
  // Extended Student Profile
  bio: Record<string, string>; // Multi-lang support { en: '...', ru: '...' }
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  interests: string[];
  location: string;
  languages: string[];
  joinedAt: string;
  updatedAt: string;
}

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  name: '',
  avatarUrl: null,
  language: 'en',
  role: 'student',
  favorites: {
    retreats: [],
    instructors: []
  },
  bio: {},
  experienceLevel: '',
  interests: [],
  location: '',
  languages: [],
  joinedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// --- Helper: Timestamp Conversion ---
const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  // Robust check: If it looks like a Timestamp (has toDate), treat it as one.
  // This avoids issues where 'instanceof Timestamp' fails due to multiple module versions.
  if (typeof data === 'object' && typeof data.toDate === 'function') {
    try {
      return data.toDate().toISOString();
    } catch (e) {
      return data;
    }
  }
  
  if (Array.isArray(data)) {
    return data.map(item => convertTimestamps(item));
  }
  
  if (typeof data === 'object') {
    // If it's a native Date, convert to string
    if (data instanceof Date) return data.toISOString();

    const newData: any = {};
    Object.keys(data).forEach(key => {
      newData[key] = convertTimestamps(data[key]);
    });
    return newData;
  }
  return data;
};

// --- Part 1: Local Storage Helpers ---

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const getLocalUserId = (): string => {
  if (typeof window === 'undefined') return 'server_guest';
  let uid = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!uid) {
    uid = generateUUID();
    localStorage.setItem(STORAGE_KEYS.USER_ID, uid);
  }
  return uid;
};

const getLocalProfile = (): UserProfile => {
  if (typeof window === 'undefined') return { ...DEFAULT_PROFILE };
  
  const json = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!json) {
    const newProfile = { ...DEFAULT_PROFILE, id: getLocalUserId() };
    // Legacy migration (keep existing logic)
    const legacyAvatar = localStorage.getItem('yt_user_avatar');
    const legacyRole = localStorage.getItem('yt_user_role');
    const legacyLang = localStorage.getItem('yt_lang');
    
    if (legacyAvatar) newProfile.avatarUrl = legacyAvatar;
    if (legacyRole) newProfile.role = legacyRole as any;
    if (legacyLang) newProfile.language = legacyLang;

    try {
      const savedRetreats = JSON.parse(localStorage.getItem('yt_saved_retreats') || '[]');
      const savedInstructors = JSON.parse(localStorage.getItem('yt_saved_instructors') || '[]');
      newProfile.favorites.retreats = savedRetreats;
      newProfile.favorites.instructors = savedInstructors;
    } catch (e) {}

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    return newProfile;
  }
  
  // Merge with default to ensure new fields exist for old local profiles
  const parsed = JSON.parse(json);
  return { ...DEFAULT_PROFILE, ...parsed };
};

const saveLocalProfile = (profile: UserProfile) => {
  if (typeof window === 'undefined') return;
  // Ensure we always have an ID
  if (!profile.id) profile.id = getLocalUserId();
  
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  
  // Sync legacy keys for backward compatibility
  if (profile.avatarUrl) localStorage.setItem('yt_user_avatar', profile.avatarUrl);
  localStorage.setItem('yt_user_role', profile.role);
  localStorage.setItem('yt_lang', profile.language);
};

// --- Part 2: Firebase Sync Helpers ---

const syncToFirebase = async (profile: UserProfile) => {
  if (!isFirebaseConfigured() || !db || !auth?.currentUser) return;
  
  try {
    // We only write to the authenticated user's document
    const userId = auth.currentUser.uid;
    const userRef = doc(db, 'users', userId);
    
    // Create a safe payload (exclude local-only fields if any, ensure ID matches auth)
    // IMPORTANT: Write public fields to nested 'publicProfile' for privacy compliance on reads
    const publicProfile = {
      displayName: profile.name,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      experienceLevel: profile.experienceLevel,
      interests: profile.interests,
      location: profile.location,
      languages: profile.languages,
      joinedAt: profile.joinedAt
    };

    const payload = { 
      ...profile, 
      id: userId,
      publicProfile // Nested object for safe public reading
    };
    
    await setDoc(userRef, payload, { merge: true });
  } catch (e) {
    console.warn('Firebase sync failed (swallowed)', e);
  }
};

const fetchFromFirebase = async (userId: string): Promise<UserProfile | null> => {
  if (!isFirebaseConfigured() || !db) return null;
  
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      // Ensure Timestamps are converted to strings before returning
      return convertTimestamps(data) as UserProfile;
    }
  } catch (e) {
    console.warn('Firebase fetch failed (swallowed)', e);
  }
  return null;
};

// --- Part 3: Merge Strategy ---

const mergeProfiles = (local: UserProfile, remote: UserProfile | null, user: User): UserProfile => {
  // If no remote data, just adopt local data to the new user ID
  if (!remote) {
    return { ...local, id: user.uid, updatedAt: new Date().toISOString() };
  }

  // Union Favorites
  const mergedRetreats = Array.from(new Set([...local.favorites.retreats, ...remote.favorites.retreats]));
  const mergedInstructors = Array.from(new Set([...local.favorites.instructors, ...remote.favorites.instructors]));

  // Conflict Resolution for fields
  // Rule: Prefer Cloud (Remote) generally, but if Local has data and Cloud is empty/default, use Local.
  // Rule: If both have data, use the one with newer updatedAt (or Cloud if equal/missing timestamps)
  
  const localTime = new Date(local.updatedAt || 0).getTime();
  const remoteTime = new Date(remote.updatedAt || 0).getTime();
  const remoteIsNewer = remoteTime >= localTime;

  const merged: UserProfile = {
    id: user.uid,
    name: (remoteIsNewer ? remote.name : local.name) || remote.name || local.name || user.displayName || '',
    avatarUrl: (remoteIsNewer ? remote.avatarUrl : local.avatarUrl) || remote.avatarUrl || local.avatarUrl || user.photoURL || null,
    language: (remoteIsNewer ? remote.language : local.language) || remote.language || local.language,
    role: (remoteIsNewer ? remote.role : local.role) || remote.role || local.role,
    favorites: {
      retreats: mergedRetreats,
      instructors: mergedInstructors
    },
    // New Fields Merge
    bio: (remoteIsNewer ? remote.bio : local.bio) || remote.bio || local.bio || {},
    experienceLevel: (remoteIsNewer ? remote.experienceLevel : local.experienceLevel) || remote.experienceLevel || local.experienceLevel,
    interests: (remoteIsNewer ? remote.interests : local.interests) || remote.interests || local.interests,
    location: (remoteIsNewer ? remote.location : local.location) || remote.location || local.location,
    languages: (remoteIsNewer ? remote.languages : local.languages) || remote.languages || local.languages,
    joinedAt: remote.joinedAt || local.joinedAt,
    updatedAt: new Date().toISOString()
  };

  return merged;
};

// --- Part 4: Migration Logic ---

let _authUser: User | null = null;

const performMigration = async (user: User) => {
  const local = getLocalProfile();
  
  // Fetch remote
  const remote = await fetchFromFirebase(user.uid);
  
  // Merge
  const merged = mergeProfiles(local, remote, user);
  
  // Update Local Cache immediately
  saveLocalProfile(merged);
  
  // Notify UI
  window.dispatchEvent(new Event('yt_profile_updated'));
  
  // Sync back to Cloud
  await syncToFirebase(merged);
};

// --- Initialization ---

if (auth) {
  onAuthStateChanged(auth, async (user) => {
    const prevUid = _authUser?.uid;
    _authUser = user;
    
    if (user && user.uid !== prevUid) {
      // Login detected: Migrate/Sync
      await performMigration(user);
    } else if (!user && prevUid) {
      // Logout logic... kept same as before
    }
  });
}

// --- Public API ---

export const userProfileService = {
  getUserId: (): string => {
    if (_authUser) return _authUser.uid;
    return getLocalUserId();
  },

  loadProfile: async (): Promise<UserProfile> => {
    // Always return local first for speed
    const local = getLocalProfile();
    return local;
  },

  updateProfile: async (partial: Partial<UserProfile>): Promise<void> => {
    const current = getLocalProfile();
    const updated = { ...current, ...partial, updatedAt: new Date().toISOString() };
    
    // 1. Optimistic Update (Local)
    saveLocalProfile(updated);
    window.dispatchEvent(new Event('yt_profile_updated'));

    // 2. Sync to Cloud (if logged in)
    if (_authUser) {
      await syncToFirebase(updated);
    }
  },

  isFavorite: (type: 'retreat' | 'instructor', id: string): boolean => {
    const profile = getLocalProfile();
    const list = type === 'retreat' ? profile.favorites.retreats : profile.favorites.instructors;
    return list.includes(id);
  },

  toggleFavorite: async (type: 'retreat' | 'instructor', id: string): Promise<boolean> => {
    const profile = getLocalProfile();
    const list = type === 'retreat' ? profile.favorites.retreats : profile.favorites.instructors;
    const exists = list.includes(id);
    
    let newList;
    if (exists) {
      newList = list.filter(item => item !== id);
    } else {
      newList = [...list, id];
    }

    if (type === 'retreat') profile.favorites.retreats = newList;
    else profile.favorites.instructors = newList;

    profile.updatedAt = new Date().toISOString();

    // Local Update
    saveLocalProfile(profile);
    window.dispatchEvent(new CustomEvent('yt_fav_updated', { detail: { type, id, isFavorite: !exists } }));

    // Cloud Update
    if (_authUser && isFirebaseConfigured() && db) {
      try {
        const userRef = doc(db, 'users', _authUser.uid);
        const fieldPath = type === 'retreat' ? 'favorites.retreats' : 'favorites.instructors';
        const operation = exists ? arrayRemove(id) : arrayUnion(id);
        
        // Granular update
        await updateDoc(userRef, { 
          [fieldPath]: operation, 
          updatedAt: profile.updatedAt 
        });
      } catch (e) {
        // Fallback to full sync
        syncToFirebase(profile);
      }
    }

    return !exists;
  },
  
  getFavorites: () => {
    const p = getLocalProfile();
    return p.favorites;
  },

  // Role Helpers
  isAdmin: (profile: UserProfile) => profile.role === 'admin',
  isOrganizer: (profile: UserProfile) => profile.role === 'organizer',
  isStudent: (profile: UserProfile) => profile.role === 'student',
  isInstructor: (profile: UserProfile) => profile.role === 'instructor',
};
