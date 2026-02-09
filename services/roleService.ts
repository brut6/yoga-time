
import { userProfileService, UserProfile } from './userProfile';
import { isFirebaseConfigured } from './firebase';

export type UserRole = 'student' | 'organizer' | 'instructor' | 'admin';

const CACHE_KEY = 'yt_role_cached';

export const roleService = {
  getUserRole: async (uid: string): Promise<UserRole> => {
    if (!isFirebaseConfigured()) {
      const cached = localStorage.getItem(CACHE_KEY) as UserRole;
      return cached || 'student';
    }

    try {
      const profile = await userProfileService.loadProfile();
      if (profile && profile.id === uid) {
        const role = profile.role || 'student';
        localStorage.setItem(CACHE_KEY, role);
        return role;
      }
    } catch (e) {
      console.warn('Role fetch failed', e);
    }
    
    return 'student';
  },

  getCachedRole: (): UserRole => {
    if (typeof window === 'undefined') return 'student';
    return (localStorage.getItem(CACHE_KEY) as UserRole) || 'student';
  },

  isAdmin: (role: UserRole) => role === 'admin',
  isOrganizer: (role: UserRole) => role === 'organizer',
  isInstructor: (role: UserRole) => role === 'instructor',
  isStudent: (role: UserRole) => role === 'student',
};
