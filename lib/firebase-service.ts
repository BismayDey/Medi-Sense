import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import type {
  HealthData,
  Goal,
  Medication,
  FoodEntry,
  WorkoutSession,
} from "./types";

// Get current user ID with fallback for unauthenticated users
const getCurrentUserId = (): string | null => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.uid;
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

// Collection names
const HEALTH_DATA_COLLECTION = "healthData";
const GOALS_COLLECTION = "goals";
const MEDICATIONS_COLLECTION = "medications";
const FOOD_DIARY_COLLECTION = "foodDiary";
const WORKOUTS_COLLECTION = "workouts";
const ACHIEVEMENTS_COLLECTION = "achievements";

// Health Data Operations
export const addHealthData = async (
  data: Omit<HealthData, "id">
): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, HEALTH_DATA_COLLECTION), {
      ...data,
      userId,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding health data: ", error);
    throw error;
  }
};

export const updateHealthData = async (
  id: string,
  data: Partial<Omit<HealthData, "id">>
): Promise<void> => {
  try {
    if (!isAuthenticated()) throw new Error("User not authenticated");

    await updateDoc(doc(db, HEALTH_DATA_COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating health data: ", error);
    throw error;
  }
};

export const deleteHealthData = async (id: string): Promise<void> => {
  try {
    if (!isAuthenticated()) throw new Error("User not authenticated");

    await deleteDoc(doc(db, HEALTH_DATA_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting health data: ", error);
    throw error;
  }
};

export const getHealthData = async (days = 7): Promise<HealthData[]> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const q = query(
      collection(db, HEALTH_DATA_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate(),
          } as HealthData)
      )
      .filter((item) => item.timestamp >= startDate);
  } catch (error) {
    console.error("Error getting health data: ", error);
    return [];
  }
};

export const subscribeToHealthData = (
  days = 7,
  callback: (data: HealthData[]) => void
): (() => void) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, HEALTH_DATA_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const data = snapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate(),
              } as HealthData)
          )
          .filter((item) => item.timestamp >= cutoffDate);

        callback(data);
      },
      (error) => {
        console.error("Error subscribing to health data: ", error);
        callback([]);
      }
    );
  } catch (error) {
    console.error("Error setting up health data subscription: ", error);
    callback([]);
    return () => {};
  }
};

export const getTodayHealthData = async (): Promise<HealthData | null> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return null;

    const q = query(
      collection(db, HEALTH_DATA_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const docData = querySnapshot.docs[0].data();
    return docData.timestamp.toDate() >= today
      ? { id: querySnapshot.docs[0].id, ...docData }
      : null;
  } catch (error) {
    console.error("Error getting today's health data: ", error);
    return null;
  }
};

export const subscribeToTodayHealthData = (
  callback: (data: HealthData | null) => void
): (() => void) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      callback(null);
      return () => {};
    }

    const q = query(
      collection(db, HEALTH_DATA_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(null);
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const docData = snapshot.docs[0].data();

        callback(
          docData.timestamp.toDate() >= today
            ? { id: snapshot.docs[0].id, ...docData }
            : null
        );
      },
      (error) => {
        console.error("Error subscribing to today's health data: ", error);
        callback(null);
      }
    );
  } catch (error) {
    console.error("Error setting up today's health data subscription: ", error);
    callback(null);
    return () => {};
  }
};

// Goals Operations
export const addGoal = async (goal: Omit<Goal, "id">): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, GOALS_COLLECTION), {
      ...goal,
      userId,
      createdAt: serverTimestamp(),
      completed: false,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding goal: ", error);
    throw error;
  }
};

export const updateGoal = async (
  id: string,
  data: Partial<Omit<Goal, "id">>
): Promise<void> => {
  try {
    if (!isAuthenticated()) throw new Error("User not authenticated");

    await updateDoc(doc(db, GOALS_COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating goal: ", error);
    throw error;
  }
};

export const getGoals = async (): Promise<Goal[]> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const q = query(
      collection(db, GOALS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Goal)
    );
  } catch (error) {
    console.error("Error getting goals: ", error);
    return [];
  }
};

export const subscribeToGoals = (
  callback: (goals: Goal[]) => void
): (() => void) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, GOALS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      q,
      (snapshot) => {
        callback(
          snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Goal)
          )
        );
      },
      (error) => {
        console.error("Error subscribing to goals: ", error);
        callback([]);
      }
    );
  } catch (error) {
    console.error("Error setting up goals subscription: ", error);
    callback([]);
    return () => {};
  }
};

// Medications Operations
export const addMedication = async (
  medication: Omit<Medication, "id">
): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, MEDICATIONS_COLLECTION), {
      ...medication,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding medication: ", error);
    throw error;
  }
};

export const updateMedication = async (
  id: string,
  data: Partial<Omit<Medication, "id">>
): Promise<void> => {
  try {
    if (!isAuthenticated()) throw new Error("User not authenticated");

    await updateDoc(doc(db, MEDICATIONS_COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating medication: ", error);
    throw error;
  }
};

export const getMedications = async (): Promise<Medication[]> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const q = query(
      collection(db, MEDICATIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("nextDose", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Medication)
    );
  } catch (error) {
    console.error("Error getting medications: ", error);
    return [];
  }
};

export const subscribeToMedications = (
  callback: (medications: Medication[]) => void
): (() => void) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, MEDICATIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("nextDose", "asc")
    );

    return onSnapshot(
      q,
      (snapshot) => {
        callback(
          snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Medication)
          )
        );
      },
      (error) => {
        console.error("Error subscribing to medications: ", error);
        callback([]);
      }
    );
  } catch (error) {
    console.error("Error setting up medications subscription: ", error);
    callback([]);
    return () => {};
  }
};

// Food Diary Operations
export const addFoodEntry = async (
  entry: Omit<FoodEntry, "id">
): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, FOOD_DIARY_COLLECTION), {
      ...entry,
      userId,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding food entry: ", error);
    throw error;
  }
};

export const getFoodEntries = async (date: Date): Promise<FoodEntry[]> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const q = query(
      collection(db, FOOD_DIARY_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate(),
          } as FoodEntry)
      )
      .filter(
        (entry) => entry.timestamp >= startOfDay && entry.timestamp <= endOfDay
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  } catch (error) {
    console.error("Error getting food entries: ", error);
    return [];
  }
};

export const subscribeToFoodEntries = (
  date: Date,
  callback: (entries: FoodEntry[]) => void
): (() => void) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, FOOD_DIARY_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const entries = snapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate(),
              } as FoodEntry)
          )
          .filter(
            (entry) =>
              entry.timestamp >= startOfDay && entry.timestamp <= endOfDay
          )
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        callback(entries);
      },
      (error) => {
        console.error("Error subscribing to food entries: ", error);
        callback([]);
      }
    );
  } catch (error) {
    console.error("Error setting up food entries subscription: ", error);
    callback([]);
    return () => {};
  }
};

// Workout Operations
export const addWorkout = async (
  workout: Omit<WorkoutSession, "id">
): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, WORKOUTS_COLLECTION), {
      ...workout,
      userId,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding workout: ", error);
    throw error;
  }
};

export const getWorkouts = async (days = 30): Promise<WorkoutSession[]> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const q = query(
      collection(db, WORKOUTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate(),
          } as WorkoutSession)
      )
      .filter((workout) => workout.timestamp >= startDate);
  } catch (error) {
    console.error("Error getting workouts: ", error);
    return [];
  }
};

export const subscribeToWorkouts = (
  days = 30,
  callback: (workouts: WorkoutSession[]) => void
): (() => void) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, WORKOUTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const workouts = snapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate(),
              } as WorkoutSession)
          )
          .filter((workout) => workout.timestamp >= startDate);

        callback(workouts);
      },
      (error) => {
        console.error("Error subscribing to workouts: ", error);
        callback([]);
      }
    );
  } catch (error) {
    console.error("Error setting up workouts subscription: ", error);
    callback([]);
    return () => {};
  }
};

// User Profile
export const getUserProfile = async (): Promise<any> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return null;

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting user profile: ", error);
    return null;
  }
};

// Auth status
export const checkAuthStatus = (
  callback: (isLoggedIn: boolean) => void
): (() => void) => {
  return auth.onAuthStateChanged((user) => {
    callback(!!user);
  });
};
