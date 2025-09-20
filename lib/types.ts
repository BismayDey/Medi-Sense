import type { Timestamp } from "firebase/firestore"

export interface HealthData {
  id: string
  userId: string
  date: string
  heartRate: number
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  sleepHours: number
  sleepQuality: "Poor" | "Fair" | "Good" | "Excellent"
  steps: number
  caloriesBurned: number
  caloriesConsumed: number
  waterIntake: number
  weight: number
  mood: "Very Bad" | "Bad" | "Neutral" | "Good" | "Very Good"
  stressLevel?: number // 1-10
  bodyTemperature?: number // in Celsius
  oxygenSaturation?: number // in percentage
  glucoseLevel?: number // in mg/dL
  notes: string
  timestamp?: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type HealthMetric = keyof Omit<
  HealthData,
  "id" | "userId" | "date" | "notes" | "bloodPressure" | "timestamp" | "createdAt" | "updatedAt"
>

export interface Goal {
  id: string
  userId: string
  type: "steps" | "weight" | "sleep" | "water" | "calories" | "workout" | "custom"
  target: number
  unit: string
  deadline: Timestamp
  progress: number
  completed: boolean
  title: string
  description?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Medication {
  id: string
  userId: string
  name: string
  dosage: string
  frequency: "daily" | "twice-daily" | "weekly" | "monthly" | "as-needed" | "custom"
  customFrequency?: string
  nextDose: Timestamp
  lastTaken?: Timestamp
  instructions?: string
  remainingDoses?: number
  refillReminder?: boolean
  refillReminderDate?: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface FoodEntry {
  id: string
  userId: string
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  timestamp: Timestamp
  image?: string
}

export interface WorkoutSession {
  id: string
  userId: string
  type: "cardio" | "strength" | "flexibility" | "sports" | "other"
  name: string
  duration: number // in minutes
  caloriesBurned: number
  intensity: "low" | "moderate" | "high"
  notes?: string
  exercises?: WorkoutExercise[]
  timestamp: Timestamp
}

export interface WorkoutExercise {
  name: string
  sets?: number
  reps?: number
  weight?: number
  duration?: number // in minutes
  distance?: number // in km
}

export interface Achievement {
  id: string
  userId: string
  title: string
  description: string
  icon: string
  unlockedAt: Timestamp
  category: "steps" | "water" | "sleep" | "workout" | "weight" | "streak"
  level: "bronze" | "silver" | "gold" | "platinum"
}

export interface UserSettings {
  userId: string
  units: "metric" | "imperial"
  darkMode: boolean
  notificationsEnabled: boolean
  reminderTimes: {
    waterReminder?: string
    medicationReminder?: string
    sleepReminder?: string
    workoutReminder?: string
  }
  healthGoals: {
    steps: number
    sleep: number
    water: number
    calories: number
  }
}

