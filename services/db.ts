
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
  Unsubscribe,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './firebase';
import { Instructor, Retreat } from '../types';
import { UserProfile } from './userProfile';
import { MOCK_INSTRUCTORS, MOCK_RETREATS } from '../data/mock';

const COLLECTION_INSTRUCTORS = 'instructors';
const COLLECTION_RETREATS = 'retreats';
const COLLECTION_USERS = 'users';

// --- Helpers ---

const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  // Robust check: If it looks like a Timestamp (has toDate), treat it as one.
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

const mapDoc = <T>(docSnap: QueryDocumentSnapshot<DocumentData>): T => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...convertTimestamps(data)
  } as T;
};

// --- Admin Utilities ---

export const getAllUsers = async (): Promise<UserProfile[]> => {
  if (!isFirebaseConfigured() || !db) return [];
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_USERS));
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => mapDoc<UserProfile>(d));
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};

export const updateUserRole = async (uid: string, role: UserProfile['role']): Promise<void> => {
  if (!isFirebaseConfigured() || !db) throw new Error("Firebase required");
  const ref = doc(db, COLLECTION_USERS, uid);
  await updateDoc(ref, { role });
};

export const deleteRetreat = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured() || !db) throw new Error("Firebase required");
  const ref = doc(db, COLLECTION_RETREATS, id);
  await deleteDoc(ref);
};

export const deleteGuide = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured() || !db) throw new Error("Firebase required");
  const ref = doc(db, COLLECTION_INSTRUCTORS, id);
  await deleteDoc(ref);
};

// --- Guides / Instructors ---

export const getGuides = async (): Promise<Instructor[]> => {
  if (!isFirebaseConfigured() || !db) {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_INSTRUCTORS), 300));
  }
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_INSTRUCTORS));
    if (snapshot.empty) return MOCK_INSTRUCTORS;
    return snapshot.docs.map(d => mapDoc<Instructor>(d));
  } catch (error) {
    console.error("Error fetching guides:", error);
    return MOCK_INSTRUCTORS;
  }
};

export const getGuideById = async (id: string): Promise<Instructor | undefined> => {
  if (!isFirebaseConfigured() || !db) {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_INSTRUCTORS.find(i => i.id === id)), 300));
  }
  try {
    const docRef = doc(db, COLLECTION_INSTRUCTORS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return mapDoc<Instructor>(docSnap as any);
    }
    return MOCK_INSTRUCTORS.find(i => i.id === id);
  } catch (error) {
    console.error(`Error fetching guide ${id}:`, error);
    return MOCK_INSTRUCTORS.find(i => i.id === id);
  }
};

export const addGuide = async (payload: Partial<Instructor>): Promise<string> => {
  if (!isFirebaseConfigured() || !db) throw new Error("Firebase not configured");
  
  // Security Contract: Must inject ownerId
  const user = auth?.currentUser;
  if (!user) throw new Error("Must be logged in to create content");

  const docRef = await addDoc(collection(db, COLLECTION_INSTRUCTORS), {
    ...payload,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateGuide = async (id: string, payload: Partial<Instructor>): Promise<void> => {
  if (!isFirebaseConfigured() || !db) throw new Error("Firebase not configured");
  
  const user = auth?.currentUser;
  if (!user) throw new Error("Must be logged in");

  const docRef = doc(db, COLLECTION_INSTRUCTORS, id);
  await updateDoc(docRef, {
    ...payload,
    // ownerId is NOT updated to prevent ownership theft
    updatedAt: serverTimestamp()
  });
};

// --- Retreats ---

export const getRetreats = async (): Promise<Retreat[]> => {
  if (!isFirebaseConfigured() || !db) {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_RETREATS), 300));
  }
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_RETREATS));
    if (snapshot.empty) return MOCK_RETREATS;
    return snapshot.docs.map(d => mapDoc<Retreat>(d));
  } catch (error) {
    console.error("Error fetching retreats:", error);
    return MOCK_RETREATS;
  }
};

export const subscribeToRetreats = (onData: (retreats: Retreat[]) => void): Unsubscribe => {
  if (!isFirebaseConfigured() || !db) {
    // Return no-op if firebase is not configured
    return () => {};
  }
  
  try {
    // We listen to the whole collection. Sorting is done client-side to ensure robustness
    // against missing indexes during development.
    const q = collection(db, COLLECTION_RETREATS);
    
    return onSnapshot(q, (snapshot) => {
      const retreats = snapshot.docs.map(d => mapDoc<Retreat>(d));
      onData(retreats);
    }, (error) => {
      console.warn("Realtime retreats subscription error:", error);
    });
  } catch (e) {
    console.error("Failed to subscribe to retreats", e);
    return () => {};
  }
};

export const getRetreatById = async (id: string): Promise<Retreat | undefined> => {
  if (!isFirebaseConfigured() || !db) {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_RETREATS.find(r => r.id === id)), 300));
  }
  try {
    const docRef = doc(db, COLLECTION_RETREATS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return mapDoc<Retreat>(docSnap as any);
    }
    return MOCK_RETREATS.find(r => r.id === id);
  } catch (error) {
    console.error(`Error fetching retreat ${id}:`, error);
    return MOCK_RETREATS.find(r => r.id === id);
  }
};

export const addRetreat = async (payload: Partial<Retreat>): Promise<string> => {
  if (!isFirebaseConfigured() || !db) throw new Error("Firebase not configured");

  // Security Contract: Must inject ownerId
  const user = auth?.currentUser;
  if (!user) throw new Error("Must be logged in to create content");

  const docRef = await addDoc(collection(db, COLLECTION_RETREATS), {
    ...payload,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateRetreat = async (id: string, payload: Partial<Retreat>): Promise<void> => {
  if (!isFirebaseConfigured() || !db) throw new Error("Firebase not configured");

  const user = auth?.currentUser;
  if (!user) throw new Error("Must be logged in");

  const docRef = doc(db, COLLECTION_RETREATS, id);
  await updateDoc(docRef, {
    ...payload,
    updatedAt: serverTimestamp()
  });
};

export const dbService = {
  getGuides,
  getGuideById,
  addGuide,
  updateGuide,
  getRetreats,
  subscribeToRetreats,
  getRetreatById,
  addRetreat,
  updateRetreat,
  // Admin
  getAllUsers,
  updateUserRole,
  deleteRetreat,
  deleteGuide
};
