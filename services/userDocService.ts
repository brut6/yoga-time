import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, isFirebaseConfigured } from './firebase';

/**
 * Ensures a Firestore document exists for the authenticated user.
 * Creates it with default data if missing.
 * Does NOT overwrite existing data.
 */
export const ensureUserDoc = async (user: User): Promise<void> => {
  // Graceful fallback if Firebase is not configured
  if (!isFirebaseConfigured() || !db) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      // Create new document with defaults
      // Using merge: true as a safety measure, though !exists() implies creation
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || null,
        role: 'student', // Default role
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        joinedAt: serverTimestamp(), // Ensure consistency with UserProfile schema
        
        publicProfile: {
          displayName: user.displayName || '',
          avatarUrl: user.photoURL || '',
          bio: { en: '', ru: '', he: '' },
          experienceLevel: 'beginner',
          interests: [],
          location: '',
          languages: ['ru', 'en', 'he'], // Default availability
          joinedAt: serverTimestamp()
        }
      }, { merge: true });
      
      console.debug(`[UserDoc] Created default profile for ${user.uid}`);
    } else {
      // Document exists: Do NOTHING to preserve existing data (roles, etc.)
      console.debug(`[UserDoc] Profile already exists for ${user.uid}`);
    }
  } catch (error) {
    // Fail silently to not block the auth flow in the UI
    console.warn('[UserDoc] Failed to ensure user doc:', error);
  }
};
