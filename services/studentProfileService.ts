
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { userProfileService, UserProfile } from './userProfile';

export interface StudentPublicProfile {
  displayName: string;
  avatarUrl: string;
  bio: Record<string, string>;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  interests: string[];
  location: string;
  languages: string[];
  joinedAt: string;
}

export const studentProfileService = {
  // Safe Fetch: Only returns public data from Firestore if available
  getStudentPublicProfile: async (uid: string): Promise<StudentPublicProfile | null> => {
    // 1. If it's me, return local profile mapped to public
    const myId = userProfileService.getUserId();
    if (uid === myId) {
      const myProfile = await userProfileService.loadProfile();
      return mapToPublic(myProfile);
    }

    // 2. Fetch from Firebase (External User)
    if (isFirebaseConfigured() && db) {
      try {
        const userRef = doc(db, 'users', uid);
        const snap = await getDoc(userRef);
        
        if (snap.exists()) {
          const data = snap.data();
          // Priority: Read from 'publicProfile' nested object
          if (data.publicProfile) {
            return data.publicProfile as StudentPublicProfile;
          }
          // Fallback: Map from root fields (Legacy support)
          return mapToPublic(data as UserProfile);
        }
      } catch (e) {
        console.warn('Error fetching public profile', e);
      }
    }

    // 3. Offline or Not Found
    return null;
  },

  isOnlineAvailableForProfiles: (): boolean => {
    return isFirebaseConfigured() && !!db && navigator.onLine;
  }
};

// Helper to map full UserProfile to safe StudentPublicProfile
function mapToPublic(full: UserProfile): StudentPublicProfile {
  return {
    displayName: full.name || '',
    avatarUrl: full.avatarUrl || '',
    bio: full.bio || {},
    experienceLevel: full.experienceLevel,
    interests: full.interests || [],
    location: full.location || '',
    languages: full.languages || [],
    joinedAt: full.joinedAt || new Date().toISOString()
  };
}
