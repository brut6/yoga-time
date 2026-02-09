
const STORAGE_KEYS = {
  RETREATS: 'yt_saved_retreats',
  INSTRUCTORS: 'yt_saved_instructors',
  DRAFTS: 'yt_organizer_drafts',
  PUBLISHED: 'yt_organizer_published',
  FOCUS_STREAK: 'yt_focus_streak',
  FOCUS_LAST_DONE: 'yt_focus_last_done',
  
  // App State Persistence
  DEV_MODE: 'yt_dev_mode',
  SMART_MATCH_ANSWERS: 'yt_smart_match_answers',
  APP_STATE: 'yt_app_state', // role, activeVibe, etc.
  LANG: 'yt_lang'
};

const getIds = (key: string): string[] => {
  try {
    if (typeof window === 'undefined') return [];
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.warn('StorageService access error:', e);
    return [];
  }
};

const getObjects = (key: string): any[] => {
  try {
    if (typeof window === 'undefined') return [];
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.warn('StorageService read objects error:', e);
    return [];
  }
};

const toggleId = (key: string, id: string): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const ids = getIds(key);
    const index = ids.indexOf(id);
    let isAdded = false;
    
    if (index > -1) {
      ids.splice(index, 1); // Remove
    } else {
      ids.push(id); // Add
      isAdded = true;
    }
    
    window.localStorage.setItem(key, JSON.stringify(ids));
    return isAdded;
  } catch (e) {
    console.warn('StorageService write error:', e);
    return false;
  }
};

const isSaved = (key: string, id: string): boolean => {
  return getIds(key).includes(id);
};

// Drafts specific logic
const saveDraft = (draft: any) => {
  try {
    if (typeof window === 'undefined') return;
    const drafts = getObjects(STORAGE_KEYS.DRAFTS);
    drafts.push(draft);
    window.localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  } catch (e) {
    console.warn('StorageService save draft error:', e);
  }
};

const deleteDraft = (draftId: string) => {
  try {
    if (typeof window === 'undefined') return;
    const drafts = getObjects(STORAGE_KEYS.DRAFTS);
    const updatedDrafts = drafts.filter((d: any) => d.id !== draftId);
    window.localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(updatedDrafts));
  } catch (e) {
    console.warn('StorageService delete draft error:', e);
  }
};

const publishRetreat = (retreat: any) => {
  try {
    if (typeof window === 'undefined') return;
    
    // Save to published list
    const published = getObjects(STORAGE_KEYS.PUBLISHED);
    published.push(retreat);
    window.localStorage.setItem(STORAGE_KEYS.PUBLISHED, JSON.stringify(published));
    
    // Remove from drafts if exists (handled by caller usually, but good utility)
    deleteDraft(retreat.id);
  } catch (e) {
    console.warn('StorageService publish error:', e);
  }
};

const updatePublishedRetreat = (retreat: any) => {
  try {
    if (typeof window === 'undefined') return;
    const published = getObjects(STORAGE_KEYS.PUBLISHED);
    const index = published.findIndex((r: any) => r.id === retreat.id);
    if (index !== -1) {
      published[index] = retreat;
      window.localStorage.setItem(STORAGE_KEYS.PUBLISHED, JSON.stringify(published));
    }
  } catch (e) {
    console.warn('StorageService update error:', e);
  }
};

// --- STREAK LOGIC ---

// Helper to get local date string YYYY-MM-DD
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStreak = (): number => {
  try {
    if (typeof window === 'undefined') return 0;
    const val = window.localStorage.getItem(STORAGE_KEYS.FOCUS_STREAK);
    return val ? parseInt(val, 10) : 0;
  } catch { return 0; }
};

const isDoneToday = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const lastDone = window.localStorage.getItem(STORAGE_KEYS.FOCUS_LAST_DONE);
    const today = getLocalDateString();
    return lastDone === today;
  } catch { return false; }
};

const markDone = () => {
  try {
    if (typeof window === 'undefined') return getStreak();

    const today = getLocalDateString();
    const lastDone = window.localStorage.getItem(STORAGE_KEYS.FOCUS_LAST_DONE);
    let currentStreak = getStreak();

    if (lastDone === today) {
      // Already done today, do not increment
      return currentStreak;
    }

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    if (lastDone === yesterday) {
      // Done yesterday, increment
      currentStreak += 1;
    } else {
      // Gap detected (or first time), reset to 1
      currentStreak = 1;
    }

    window.localStorage.setItem(STORAGE_KEYS.FOCUS_STREAK, currentStreak.toString());
    window.localStorage.setItem(STORAGE_KEYS.FOCUS_LAST_DONE, today);

    return currentStreak;
  } catch (e) {
    console.warn('StorageService streak error:', e);
    return 0;
  }
};

// --- APP STATE PERSISTENCE ---

const setDevMode = (enabled: boolean) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.DEV_MODE, enabled ? 'true' : 'false');
    }
  } catch (e) {}
};

const isDevMode = (): boolean => {
  try {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(STORAGE_KEYS.DEV_MODE) === 'true';
    }
    return false;
  } catch { return false; }
};

const setSmartMatchAnswers = (answers: any) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.SMART_MATCH_ANSWERS, JSON.stringify(answers));
    }
  } catch (e) {}
};

const getSmartMatchAnswers = (): any => {
  try {
    if (typeof window !== 'undefined') {
      const data = window.localStorage.getItem(STORAGE_KEYS.SMART_MATCH_ANSWERS);
      return data ? JSON.parse(data) : {};
    }
    return {};
  } catch { return {}; }
};

export const storageService = {
  // Retreats (Saved by user)
  getSavedRetreatIds: () => getIds(STORAGE_KEYS.RETREATS),
  toggleSavedRetreat: (id: string) => toggleId(STORAGE_KEYS.RETREATS, id),
  isSavedRetreat: (id: string) => isSaved(STORAGE_KEYS.RETREATS, id),
  
  // Instructors (Saved by user)
  getSavedInstructorIds: () => getIds(STORAGE_KEYS.INSTRUCTORS),
  toggleSavedInstructor: (id: string) => toggleId(STORAGE_KEYS.INSTRUCTORS, id),
  isSavedInstructor: (id: string) => isSaved(STORAGE_KEYS.INSTRUCTORS, id),

  // Organizer Drafts
  getRetreatDrafts: () => getObjects(STORAGE_KEYS.DRAFTS),
  saveRetreatDraft: (draft: any) => saveDraft(draft),
  deleteRetreatDraft: (id: string) => deleteDraft(id),

  // Organizer Published
  getPublishedRetreats: () => getObjects(STORAGE_KEYS.PUBLISHED),
  publishRetreatDraft: (retreat: any) => publishRetreat(retreat),
  updatePublishedRetreat: (retreat: any) => updatePublishedRetreat(retreat),

  // Daily Focus Streak
  getBreathingStreak: () => getStreak(),
  isBreathingDoneToday: () => isDoneToday(),
  markBreathingDone: () => markDone(),

  // App State
  setDevMode,
  isDevMode,
  setSmartMatchAnswers,
  getSmartMatchAnswers
};
