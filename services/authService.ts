
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { ensureUserDoc } from './userDocService';
import i18n from '../i18n';

// Helper to map errors to localized messages
const getAuthErrorMessage = (error: any): string => {
  const code = error.code;
  switch (code) {
    case 'auth/invalid-email': return i18n.t('auth.errors.invalidEmail');
    case 'auth/user-disabled': return i18n.t('auth.errors.userDisabled');
    case 'auth/user-not-found': return i18n.t('auth.errors.userNotFound');
    case 'auth/wrong-password': return i18n.t('auth.errors.wrongPassword');
    case 'auth/email-already-in-use': return i18n.t('auth.errors.emailInUse');
    case 'auth/popup-closed-by-user': return i18n.t('auth.errors.popupClosed');
    case 'auth/weak-password': return i18n.t('auth.errors.weakPassword');
    default: return i18n.t('auth.errors.unknown');
  }
};

export const authService = {
  isAuthAvailable: () => !!auth,
  
  getCurrentUser: (): User | null => auth?.currentUser || null,

  onAuthChange: (callback: (user: User | null) => void) => {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fire and forget: Ensure doc exists without blocking UI
        ensureUserDoc(user).catch(e => console.error(e));
      }
      callback(user);
    });
  },

  signUpEmail: async (email: string, pass: string) => {
    if (!auth) {
      console.warn("[Auth] Attempted auth action (signUpEmail) while Firebase is not configured.");
      throw new Error(i18n.t('auth.errors.notConfigured'));
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await ensureUserDoc(cred.user); // Ensure doc exists before returning
      return cred.user;
    } catch (e) {
      throw new Error(getAuthErrorMessage(e));
    }
  },

  signInEmail: async (email: string, pass: string) => {
    if (!auth) {
      console.warn("[Auth] Attempted auth action (signInEmail) while Firebase is not configured.");
      throw new Error(i18n.t('auth.errors.notConfigured'));
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await ensureUserDoc(cred.user); // Ensure doc exists before returning
      return cred.user;
    } catch (e) {
      throw new Error(getAuthErrorMessage(e));
    }
  },

  signInGoogle: async () => {
    if (!auth || !googleProvider) {
      console.warn("[Auth] Attempted auth action (signInGoogle) while Firebase is not configured.");
      throw new Error(i18n.t('auth.errors.notConfigured'));
    }
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureUserDoc(cred.user); // Ensure doc exists before returning
      return cred.user;
    } catch (e) {
      throw new Error(getAuthErrorMessage(e));
    }
  },

  signOutUser: async () => {
    if (!auth) return;
    await signOut(auth);
  }
};
