"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { HealthDataForm } from "@/components/health-data-form";
import { ProgressRing } from "@/components/progress-ring";
import { HealthChart } from "@/components/health-chart";
import { WaterTracker } from "@/components/water-tracker";
import { SleepQuality } from "@/components/sleep-quality";
import { MedicationTracker } from "@/components/medication-tracker";
import { FoodDiary } from "@/components/food-diary";
import { WorkoutTracker } from "@/components/workout-tracker";
import { GoalsTracker } from "@/components/goals-tracker";
import { MoodTracker } from "@/components/mood-tracker";
import {
  subscribeToTodayHealthData,
  subscribeToHealthData,
  checkAuthStatus,
} from "@/lib/firebase-service";
import type { HealthData } from "@/lib/types";
import {
  getWaterIntakeGoal,
  getSleepRecommendation,
  getHeartRateZone,
  calculateBMI,
  getBMICategory,
} from "@/lib/health-utils";
import {
  Heart,
  Activity,
  Moon,
  Utensils,
  Droplet,
  Scale,
  Footprints,
  Plus,
  BarChart3,
  ArrowLeft,
  User,
  Bell,
  Settings,
  Thermometer,
  TreesIcon as Lungs,
  Dumbbell,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HealthDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayData, setTodayData] = useState<HealthData | null>(null);
  const [historicalData, setHistoricalData] = useState<HealthData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const userProfile = {
    age: 35,
    height: 175,
    weight: todayData?.weight || 70,
  };

  useEffect(() => {
    const unsubscribeAuth = checkAuthStatus((isLoggedIn) => {
      setIsAuthenticated(isLoggedIn);
      setIsLoading(false);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribeToday = subscribeToTodayHealthData((data) => {
      setTodayData(data);
      setIsLoading(false);
    });

    const unsubscribeHistory = subscribeToHealthData(30, (data) => {
      setHistoricalData(data);
    });

    return () => {
      unsubscribeToday();
      unsubscribeHistory();
    };
  }, [isAuthenticated]);

  const handleFormSuccess = () => {
    setShowForm(false);
    toast({
      title: "Success!",
      description: "Your health data has been updated.",
    });
  };

  const handleWaterUpdate = (newValue: number) => {
    if (todayData) {
      setTodayData({
        ...todayData,
        waterIntake: newValue,
      });
    }
  };

  const handleMoodUpdate = (
    newMood: "Very Bad" | "Bad" | "Neutral" | "Good" | "Very Good"
  ) => {
    if (todayData) {
      setTodayData({
        ...todayData,
        mood: newMood,
      });
    }
  };

  const waterGoal = getWaterIntakeGoal(userProfile.weight);
  const sleepGoal = getSleepRecommendation(userProfile.age);
  const bmi = calculateBMI(userProfile.weight, userProfile.height);
  const bmiCategory = getBMICategory(bmi);

  const calculateTrend = (metric: keyof HealthData, current: number) => {
    if (historicalData.length < 2)
      return { trend: "neutral", value: "No data" };

    const yesterday = historicalData[1][metric] as number;
    const diff = current - yesterday;
    const percentage = yesterday ? Math.round((diff / yesterday) * 100) : 0;

    return {
      trend: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
      value: `${Math.abs(percentage)}% from yesterday`,
    };
  };

  if (isAuthenticated === null) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access your health dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="mb-6 text-center">
              You need to be logged in to view and track your health data.
              Please sign in to continue.
            </p>
            <Button onClick={() => router.push("/auth")}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Home</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Daily Health Tracking
            </h1>
            <p className="text-muted-foreground">
              Track your daily health metrics and visualize your progress
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Cancel" : "Log Today's Health"}
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HealthDataForm onSuccess={handleFormSuccess} />
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="dashboard">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="health">
            <Heart className="mr-2 h-4 w-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="nutrition">
            <Utensils className="mr-2 h-4 w-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="fitness">
            <Dumbbell className="mr-2 h-4 w-4" />
            Fitness
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="w-full h-[120px] animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : todayData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Heart Rate"
                  value={`${todayData.heartRate} bpm`}
                  description={getHeartRateZone(
                    todayData.heartRate,
                    userProfile.age
                  )}
                  icon={Heart}
                  color="danger"
                  {...calculateTrend("heartRate", todayData.heartRate)}
                />

                <MetricCard
                  title="Blood Pressure"
                  value={`${todayData.bloodPressure.systolic}/${todayData.bloodPressure.diastolic}`}
                  description="Systolic/Diastolic"
                  icon={Activity}
                  color="warning"
                />

                <MetricCard
                  title="Sleep"
                  value={`${todayData.sleepHours} hrs`}
                  description={todayData.sleepQuality}
                  icon={Moon}
                  color="primary"
                  {...calculateTrend("sleepHours", todayData.sleepHours)}
                />

                <MetricCard
                  title="Steps"
                  value={todayData.steps.toLocaleString()}
                  description={
                    todayData.steps >= 10000
                      ? "Goal reached!"
                      : `${Math.round(todayData.steps / 100)}% of 10,000 goal`
                  }
                  icon={Footprints}
                  color="success"
                  {...calculateTrend("steps", todayData.steps)}
                />

                <MetricCard
                  title="Calories Burned"
                  value={todayData.caloriesBurned.toLocaleString()}
                  description="Active calories"
                  icon={Activity}
                  color="success"
                  {...calculateTrend(
                    "caloriesBurned",
                    todayData.caloriesBurned
                  )}
                />

                <MetricCard
                  title="Calories Consumed"
                  value={todayData.caloriesConsumed.toLocaleString()}
                  description="Nutritional intake"
                  icon={Utensils}
                  color="warning"
                  {...calculateTrend(
                    "caloriesConsumed",
                    todayData.caloriesConsumed
                  )}
                />

                <MetricCard
                  title="Water Intake"
                  value={`${todayData.waterIntake} ml`}
                  description={`${Math.round(
                    (todayData.waterIntake / waterGoal) * 100
                  )}% of daily goal`}
                  icon={Droplet}
                  color="primary"
                  {...calculateTrend("waterIntake", todayData.waterIntake)}
                />

                <MetricCard
                  title="Weight"
                  value={`${todayData.weight} kg`}
                  description={`BMI: ${bmi.toFixed(1)} (${bmiCategory})`}
                  icon={Scale}
                  color={
                    bmiCategory === "Normal weight" ? "success" : "warning"
                  }
                  {...calculateTrend("weight", todayData.weight)}
                />

                {todayData.bodyTemperature && (
                  <MetricCard
                    title="Body Temperature"
                    value={`${todayData.bodyTemperature}°C`}
                    description={
                      todayData.bodyTemperature > 37.5 ? "Elevated" : "Normal"
                    }
                    icon={Thermometer}
                    color={
                      todayData.bodyTemperature > 37.5 ? "danger" : "success"
                    }
                  />
                )}

                {todayData.oxygenSaturation && (
                  <MetricCard
                    title="Oxygen Saturation"
                    value={`${todayData.oxygenSaturation}%`}
                    description={
                      todayData.oxygenSaturation < 95 ? "Low" : "Normal"
                    }
                    icon={Lungs}
                    color={
                      todayData.oxygenSaturation < 95 ? "danger" : "success"
                    }
                  />
                )}

                {todayData.stressLevel && (
                  <MetricCard
                    title="Stress Level"
                    value={`${todayData.stressLevel}/10`}
                    description={
                      todayData.stressLevel > 7
                        ? "High"
                        : todayData.stressLevel > 4
                        ? "Moderate"
                        : "Low"
                    }
                    icon={Activity}
                    color={
                      todayData.stressLevel > 7
                        ? "danger"
                        : todayData.stressLevel > 4
                        ? "warning"
                        : "success"
                    }
                  />
                )}

                {todayData.glucoseLevel && (
                  <MetricCard
                    title="Glucose Level"
                    value={`${todayData.glucoseLevel} mg/dL`}
                    description={
                      todayData.glucoseLevel > 140
                        ? "High"
                        : todayData.glucoseLevel < 70
                        ? "Low"
                        : "Normal"
                    }
                    icon={Activity}
                    color={
                      todayData.glucoseLevel > 140 ||
                      todayData.glucoseLevel < 70
                        ? "danger"
                        : "success"
                    }
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WaterTracker
                  currentIntake={todayData.waterIntake}
                  goal={waterGoal}
                  healthDataId={todayData.id}
                  onUpdate={handleWaterUpdate}
                />

                <MoodTracker
                  currentMood={todayData.mood}
                  healthDataId={todayData.id}
                  onUpdate={handleMoodUpdate}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SleepQuality
                  hours={todayData.sleepHours}
                  quality={todayData.sleepQuality}
                  recommendedHours={sleepGoal}
                />

                <Card>
                  <CardHeader>
                    <CardTitle>Calorie Balance</CardTitle>
                    <CardDescription>
                      Calories consumed vs. burned today
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                      <div className="flex flex-col items-center">
                        <ProgressRing
                          value={todayData.caloriesConsumed}
                          max={2500}
                          color="hsl(var(--yellow-500))"
                          label="Consumed"
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Daily Goal: 2,500
                        </p>
                      </div>

                      <div className="text-2xl font-bold">-</div>

                      <div className="flex flex-col items-center">
                        <ProgressRing
                          value={todayData.caloriesBurned}
                          max={2500}
                          color="hsl(var(--green-500))"
                          label="Burned"
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Goal: 500+
                        </p>
                      </div>

                      <div className="text-2xl font-bold">=</div>

                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                          className="text-3xl font-bold"
                        >
                          {todayData.caloriesConsumed -
                            todayData.caloriesBurned}
                        </motion.div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Net Calories
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <MedicationTracker />

              <GoalsTracker />

              <Card>
                <CardHeader>
                  <CardTitle>Daily Notes</CardTitle>
                  <CardDescription>
                    Your health journal for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {todayData.notes ||
                      "No notes for today. Add notes when logging your health data."}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Data Available</CardTitle>
                <CardDescription>
                  You haven't logged your health data for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Start tracking your health by logging your first entry.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Health Data
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Vital Signs
                </CardTitle>
                <CardDescription>
                  Track your vital health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-12 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : todayData ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg border border-border">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                          <Heart className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium">Heart Rate</h4>
                          <p className="text-sm text-muted-foreground">
                            {getHeartRateZone(
                              todayData.heartRate,
                              userProfile.age
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-xl font-bold">
                        {todayData.heartRate} bpm
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg border border-border">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium">Blood Pressure</h4>
                          <p className="text-sm text-muted-foreground">
                            Systolic/Diastolic
                          </p>
                        </div>
                      </div>
                      <div className="text-xl font-bold">
                        {todayData.bloodPressure.systolic}/
                        {todayData.bloodPressure.diastolic}
                      </div>
                    </div>

                    {todayData.bodyTemperature && (
                      <div className="flex justify-between items-center p-3 rounded-lg border border-border">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                            <Thermometer className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">Body Temperature</h4>
                            <p className="text-sm text-muted-foreground">
                              {todayData.bodyTemperature > 37.5
                                ? "Elevated"
                                : "Normal"}
                            </p>
                          </div>
                        </div>
                        <div className="text-xl font-bold">
                          {todayData.bodyTemperature}°C
                        </div>
                      </div>
                    )}

                    {todayData.oxygenSaturation && (
                      <div className="flex justify-between items-center p-3 rounded-lg border border-border">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                            <Lungs className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">Oxygen Saturation</h4>
                            <p className="text-sm text-muted-foreground">
                              {todayData.oxygenSaturation < 95
                                ? "Low"
                                : "Normal"}
                            </p>
                          </div>
                        </div>
                        <div className="text-xl font-bold">
                          {todayData.oxygenSaturation}%
                        </div>
                      </div>
                    )}

                    {todayData.glucoseLevel && (
                      <div className="flex justify-between items-center p-3 rounded-lg border border-border">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                            <Activity className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">Glucose Level</h4>
                            <p className="text-sm text-muted-foreground">
                              {todayData.glucoseLevel > 140
                                ? "High"
                                : todayData.glucoseLevel < 70
                                ? "Low"
                                : "Normal"}
                            </p>
                          </div>
                        </div>
                        <div className="text-xl font-bold">
                          {todayData.glucoseLevel} mg/dL
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4">
                      No vital signs data available for today.
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                      Log Health Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <MedicationTracker />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SleepQuality
              hours={todayData?.sleepHours || 0}
              quality={todayData?.sleepQuality || "Good"}
              recommendedHours={sleepGoal}
            />

            <MoodTracker
              currentMood={todayData?.mood || "Good"}
              healthDataId={todayData?.id}
              onUpdate={handleMoodUpdate}
            />
          </div>

          <HealthChart data={historicalData} />
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WaterTracker
              currentIntake={todayData?.waterIntake || 0}
              goal={waterGoal}
              healthDataId={todayData?.id}
              onUpdate={handleWaterUpdate}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="mr-2 h-5 w-5" />
                  Nutrition Summary
                </CardTitle>
                <CardDescription>Today's nutritional intake</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : todayData ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        Calories Consumed
                      </div>
                      <div className="text-xl font-bold">
                        {todayData.caloriesConsumed} cal
                      </div>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (todayData.caloriesConsumed / 2500) * 100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {Math.round((todayData.caloriesConsumed / 2500) * 100)}%
                      of daily goal (2,500 cal)
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="bg-muted/50 p-2 rounded-md text-center">
                        <div className="text-lg font-bold">55%</div>
                        <div className="text-xs text-muted-foreground">
                          Carbs
                        </div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-md text-center">
                        <div className="text-lg font-bold">25%</div>
                        <div className="text-xs text-muted-foreground">
                          Protein
                        </div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-md text-center">
                        <div className="text-lg font-bold">20%</div>
                        <div className="text-xs text-muted-foreground">Fat</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4">
                      No nutrition data available for today.
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                      Log Health Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <FoodDiary />
        </TabsContent>

        <TabsContent value="fitness" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Footprints className="mr-2 h-5 w-5" />
                  Activity Summary
                </CardTitle>
                <CardDescription>Today's physical activity</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : todayData ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Steps</div>
                      <div className="text-xl font-bold">
                        {todayData.steps.toLocaleString()} steps
                      </div>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (todayData.steps / 10000) * 100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {Math.round((todayData.steps / 10000) * 100)}% of daily
                      goal (10,000 steps)
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm font-medium">Calories Burned</div>
                      <div className="text-xl font-bold">
                        {todayData.caloriesBurned} cal
                      </div>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (todayData.caloriesBurned / 500) * 100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {Math.round((todayData.caloriesBurned / 500) * 100)}% of
                      daily goal (500 cal)
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4">
                      No activity data available for today.
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                      Log Health Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="mr-2 h-5 w-5" />
                  Weight Tracking
                </CardTitle>
                <CardDescription>Monitor your weight over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-40 bg-muted rounded"></div>
                  </div>
                ) : todayData ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <ProgressRing
                        value={todayData.weight}
                        max={100}
                        size={150}
                        strokeWidth={12}
                        color="hsl(var(--primary))"
                        label="Current Weight"
                        unit="kg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-muted/50 p-3 rounded-md text-center">
                        <div className="text-lg font-bold">
                          {bmi.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">BMI</div>
                        <div
                          className={`text-xs mt-1 ${
                            bmiCategory === "Normal weight"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {bmiCategory}
                        </div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md text-center">
                        <div className="text-lg font-bold">
                          {userProfile.height} cm
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Height
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4">No weight data available for today.</p>
                    <Button onClick={() => setShowForm(true)}>
                      Log Health Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <WorkoutTracker />

          <GoalsTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
