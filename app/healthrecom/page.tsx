"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Heart,
  Dumbbell,
  Apple,
  Moon,
  UserCircle,
  Plus,
  Info,
  Calendar,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import next from "next";

// Types
interface HealthData {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  conditions: string[];
  sleepHours: number;
  dietaryPreferences: string[];
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  detail: string;
  completed: boolean;
  category: "nutrition" | "exercise" | "sleep";
  priority: number;
  tags: string[];
}

// Initial health data
const initialHealthData: HealthData = {
  age: 35,
  weight: 75,
  height: 175,
  gender: "male",
  activityLevel: "moderate",
  conditions: ["high blood pressure"],
  sleepHours: 6,
  dietaryPreferences: ["balanced"],
};

// Initial recommendations
const initialRecommendations: Recommendation[] = [
  {
    id: "n1",
    title: "Increase omega-3 intake",
    description:
      "Incorporate more fatty fish, flaxseeds, and walnuts for heart health",
    detail:
      "Omega-3 fatty acids help reduce inflammation and can lower blood pressure. Aim for 2-3 servings of fatty fish like salmon or mackerel per week, or 1-2 tablespoons of ground flaxseeds daily.",
    completed: false,
    category: "nutrition",
    priority: 1,
    tags: ["heart health", "essential fats"],
  },
  {
    id: "n2",
    title: "Reduce sodium intake",
    description:
      "Limit processed foods and added salt to help manage blood pressure",
    detail:
      "High sodium intake can increase blood pressure. Aim to keep daily sodium intake below 2,300mg, or ideally 1,500mg if you have hypertension. Read food labels and choose low-sodium options.",
    completed: false,
    category: "nutrition",
    priority: 2,
    tags: ["heart health", "blood pressure"],
  },
  {
    id: "n3",
    title: "Increase potassium-rich foods",
    description: "Add more bananas, potatoes, and leafy greens to your diet",
    detail:
      "Potassium helps balance sodium levels and can help lower blood pressure. Good sources include bananas, potatoes with skin, spinach, beans, and yogurt.",
    completed: false,
    category: "nutrition",
    priority: 3,
    tags: ["minerals", "blood pressure"],
  },
  {
    id: "e1",
    title: "30 min moderate cardio, 3x weekly",
    description:
      "Engage in walking, cycling, or swimming to improve heart health",
    detail:
      "Moderate cardio exercise helps lower blood pressure and improves heart function. Start with 10-15 minutes if you're new to exercise and gradually increase duration. Monitor your heart rate to stay in the moderate intensity zone.",
    completed: false,
    category: "exercise",
    priority: 1,
    tags: ["cardio", "heart health"],
  },
  {
    id: "e2",
    title: "Strength training 2x weekly",
    description:
      "Incorporate resistance exercises to build muscle and boost metabolism",
    detail:
      "Strength training improves muscle mass, which helps burn more calories at rest. Focus on major muscle groups with body weight exercises or light weights. Start with 10-12 repetitions of each exercise.",
    completed: false,
    category: "exercise",
    priority: 2,
    tags: ["strength", "metabolism"],
  },
  {
    id: "e3",
    title: "Daily stretching routine",
    description:
      "Improve flexibility and circulation with 10 minutes of daily stretches",
    detail:
      "Regular stretching improves flexibility, blood flow, and can help reduce stress. Hold each stretch for 15-30 seconds without bouncing. Focus on major muscle groups like hamstrings, quadriceps, shoulders, and back.",
    completed: false,
    category: "exercise",
    priority: 3,
    tags: ["flexibility", "recovery"],
  },
  {
    id: "s1",
    title: "Aim for 7-8 hours of quality sleep",
    description:
      "Establish a consistent sleep schedule to improve sleep quality",
    detail:
      "Quality sleep is essential for recovery, hormone regulation, and cognitive function. Go to bed and wake up at the same time every day, even on weekends, to regulate your body's internal clock.",
    completed: false,
    category: "sleep",
    priority: 1,
    tags: ["recovery", "circadian rhythm"],
  },
  {
    id: "s2",
    title: "Create a sleep-friendly environment",
    description: "Keep your bedroom dark, quiet, and cool for optimal sleep",
    detail:
      "Your sleep environment significantly impacts sleep quality. Keep the room temperature between 60-67°F (15-19°C), use blackout curtains to block light, and consider using white noise to mask disruptive sounds.",
    completed: false,
    category: "sleep",
    priority: 2,
    tags: ["environment", "sleep quality"],
  },
  {
    id: "s3",
    title: "Digital sunset: No screens 1 hour before bed",
    description: "Reduce blue light exposure to improve melatonin production",
    detail:
      "Blue light from screens can suppress melatonin production and make it harder to fall asleep. Stop using electronic devices at least one hour before bedtime, or use blue light filters if you must use them.",
    completed: false,
    category: "sleep",
    priority: 3,
    tags: ["habits", "melatonin"],
  },
];

export default function HealthRecommendationsPage() {
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    initialRecommendations
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [progressValue, setProgressValue] = useState(0);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Calculate progress
  useEffect(() => {
    const completed = recommendations.filter((rec) => rec.completed).length;
    const total = recommendations.length;
    setProgressValue(Math.round((completed / total) * 100));
  }, [recommendations]);

  // Generate recommendations based on health data
  const generateRecommendations = () => {
    setLoadingRecs(true);

    // Simulate API call
    setTimeout(() => {
      // Regenerate recommendations based on health data
      // This is a simplified example; in a real app, this would be a more complex algorithm
      const newRecommendations = [...initialRecommendations];

      // Adjust recommendations based on age
      if (healthData.age > 50) {
        newRecommendations.push({
          id: "n4",
          title: "Calcium and Vitamin D",
          description: "Increase intake to support bone health",
          detail:
            "Adults over 50 need more calcium (1200mg daily) and vitamin D (800-1000 IU daily) to maintain bone density. Good sources include dairy products, fortified plant milks, leafy greens, and moderate sun exposure.",
          completed: false,
          category: "nutrition",
          priority: 2,
          tags: ["bone health", "aging well"],
        });
      }

      // Adjust recommendations based on activity level
      if (healthData.activityLevel === "high") {
        newRecommendations.push({
          id: "e4",
          title: "Recovery techniques",
          description: "Implement active recovery days and proper hydration",
          detail:
            "With high activity levels, proper recovery becomes crucial. Incorporate active recovery days with light movement, stay well-hydrated (aim for 3-4 liters daily), and consider sports massage bi-weekly.",
          completed: false,
          category: "exercise",
          priority: 2,
          tags: ["recovery", "performance"],
        });
      }

      // Add sleep recommendations based on current sleep hours
      if (healthData.sleepHours < 7) {
        newRecommendations.push({
          id: "s4",
          title: "Sleep extension strategy",
          description:
            "Gradually increase sleep duration by 15 minutes each week",
          detail:
            "To increase your sleep duration, add 15 minutes to your sleep time each week until you reach 7-8 hours. This gradual approach helps your body adjust naturally without causing sleep onset insomnia.",
          completed: false,
          category: "sleep",
          priority: 1,
          tags: ["sleep duration", "adaptation"],
        });
      }

      setRecommendations(newRecommendations);
      setLoadingRecs(false);
      toast({
        title: "Recommendations updated!",
        description:
          "Your health plan has been personalized based on your profile.",
      });
    }, 1500);
  };

  // Filter recommendations based on selected category and completion status
  const filteredRecommendations = recommendations.filter((rec) => {
    const categoryMatch =
      selectedCategory === "all" || rec.category === selectedCategory;
    const completionMatch = showCompleted || !rec.completed;
    return categoryMatch && completionMatch;
  });

  // Toggle recommendation completion
  const toggleCompletion = (id: string) => {
    setRecommendations((prevRecs) =>
      prevRecs.map((rec) =>
        rec.id === id ? { ...rec, completed: !rec.completed } : rec
      )
    );

    toast({
      title: "Progress updated",
      description: "Your health journey is being tracked!",
    });
  };

  // Calculate category counts
  const nutritionCount = recommendations.filter(
    (r) => r.category === "nutrition"
  ).length;
  const exerciseCount = recommendations.filter(
    (r) => r.category === "exercise"
  ).length;
  const sleepCount = recommendations.filter(
    (r) => r.category === "sleep"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Link
        href="/"
        className="w-full h-[40px] group border border-[#0284c7] text-[#0284c7] px-4 py-2 flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition"
      >
        Go to Home
        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {" "}
                Your Health Recommendation
              </h1>
              <p className="text-muted-foreground mt-1">
                Personalized recommendations for optimal wellbeing
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={() => setShowProgress(!showProgress)}
              >
                {showProgress ? "Hide" : "Show"} Progress
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                {isEditing ? "View Dashboard" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {showProgress && (
            <div className="mt-6 p-4 bg-card rounded-lg border shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h2 className="text-lg font-medium">Your Health Journey</h2>
                <p className="text-sm text-muted-foreground">
                  {recommendations.filter((r) => r.completed).length} of{" "}
                  {recommendations.length} recommendations completed
                </p>
              </div>
              <Progress value={progressValue} className="h-2 mb-2" />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col items-center p-2 rounded-md bg-green-100/40 dark:bg-green-900/20">
                  <Apple className="h-5 w-5 text-green-600 dark:text-green-400 mb-1" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Nutrition
                  </span>
                  <span className="text-sm font-bold">
                    {Math.round(
                      (recommendations.filter(
                        (r) => r.category === "nutrition" && r.completed
                      ).length /
                        nutritionCount) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md bg-orange-100/40 dark:bg-orange-900/20">
                  <Dumbbell className="h-5 w-5 text-orange-600 dark:text-orange-400 mb-1" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Exercise
                  </span>
                  <span className="text-sm font-bold">
                    {Math.round(
                      (recommendations.filter(
                        (r) => r.category === "exercise" && r.completed
                      ).length /
                        exerciseCount) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md bg-blue-100/40 dark:bg-blue-900/20">
                  <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-1" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Sleep
                  </span>
                  <span className="text-sm font-bold">
                    {Math.round(
                      (recommendations.filter(
                        (r) => r.category === "sleep" && r.completed
                      ).length /
                        sleepCount) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main>
          {isEditing ? (
            /* Health Profile Form */
            <div className="bg-card rounded-lg shadow-md p-6 mb-8 border animate-in fade-in-50 duration-300">
              <h2 className="text-2xl font-bold mb-6">Your Health Profile</h2>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsEditing(false);
                  generateRecommendations();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={healthData.age}
                      onChange={(e) =>
                        setHealthData({
                          ...healthData,
                          age: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={healthData.gender}
                      onValueChange={(value) =>
                        setHealthData({ ...healthData, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={healthData.weight}
                      onChange={(e) =>
                        setHealthData({
                          ...healthData,
                          weight: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={healthData.height}
                      onChange={(e) =>
                        setHealthData({
                          ...healthData,
                          height: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select
                      value={healthData.activityLevel}
                      onValueChange={(value) =>
                        setHealthData({ ...healthData, activityLevel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">
                          Sedentary (little to no exercise)
                        </SelectItem>
                        <SelectItem value="light">
                          Light (1-3 days/week)
                        </SelectItem>
                        <SelectItem value="moderate">
                          Moderate (3-5 days/week)
                        </SelectItem>
                        <SelectItem value="high">
                          High (6-7 days/week)
                        </SelectItem>
                        <SelectItem value="athlete">
                          Athlete (2x daily)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleepHours">Average Sleep (hours)</Label>
                    <div className="pt-2">
                      <Slider
                        id="sleepHours"
                        min={4}
                        max={12}
                        step={0.5}
                        value={[healthData.sleepHours]}
                        onValueChange={(value) =>
                          setHealthData({ ...healthData, sleepHours: value[0] })
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>4h</span>
                        <span className="font-medium">
                          {healthData.sleepHours}h
                        </span>
                        <span>12h</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Health Conditions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                    {[
                      "high blood pressure",
                      "diabetes",
                      "high cholesterol",
                      "obesity",
                      "heart disease",
                      "asthma",
                    ].map((condition) => (
                      <div
                        key={condition}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`condition-${condition}`}
                          className="rounded border-muted-foreground h-4 w-4 text-primary focus:ring-primary"
                          checked={healthData.conditions.includes(condition)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setHealthData({
                                ...healthData,
                                conditions: [
                                  ...healthData.conditions,
                                  condition,
                                ],
                              });
                            } else {
                              setHealthData({
                                ...healthData,
                                conditions: healthData.conditions.filter(
                                  (c) => c !== condition
                                ),
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor={`condition-${condition}`}
                          className="text-sm cursor-pointer"
                        >
                          {condition.charAt(0).toUpperCase() +
                            condition.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dietary Preferences</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                    {[
                      "balanced",
                      "vegetarian",
                      "vegan",
                      "paleo",
                      "keto",
                      "gluten-free",
                      "dairy-free",
                    ].map((diet) => (
                      <div key={diet} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`diet-${diet}`}
                          className="rounded border-muted-foreground h-4 w-4 text-primary focus:ring-primary"
                          checked={healthData.dietaryPreferences.includes(diet)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setHealthData({
                                ...healthData,
                                dietaryPreferences: [
                                  ...healthData.dietaryPreferences,
                                  diet,
                                ],
                              });
                            } else {
                              setHealthData({
                                ...healthData,
                                dietaryPreferences:
                                  healthData.dietaryPreferences.filter(
                                    (d) => d !== diet
                                  ),
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor={`diet-${diet}`}
                          className="text-sm cursor-pointer"
                        >
                          {diet.charAt(0).toUpperCase() + diet.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="transition-all duration-300 hover:scale-105"
                  >
                    Update Recommendations
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* Recommendations Dashboard */
            <div className="animate-in fade-in-50 duration-300">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <Tabs
                  defaultValue="all"
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger
                      value="nutrition"
                      className="flex items-center"
                    >
                      <Apple className="mr-1 h-4 w-4" />
                      Nutrition
                    </TabsTrigger>
                    <TabsTrigger value="exercise" className="flex items-center">
                      <Dumbbell className="mr-1 h-4 w-4" />
                      Exercise
                    </TabsTrigger>
                    <TabsTrigger value="sleep" className="flex items-center">
                      <Moon className="mr-1 h-4 w-4" />
                      Sleep
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="show-completed"
                    className="text-sm cursor-pointer"
                  >
                    Show completed
                  </label>
                  <Switch
                    id="show-completed"
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                  />
                </div>
              </div>

              {loadingRecs ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-12 w-12 rounded-full border-4 border-t-primary animate-spin mb-4"></div>
                  <p className="text-muted-foreground">
                    Analyzing your health profile...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecommendations.map((recommendation) => (
                    <Card
                      key={recommendation.id}
                      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
                        recommendation.completed ? "bg-muted/50" : ""
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-1">
                            {recommendation.category === "nutrition" && (
                              <Badge
                                variant="outline"
                                className="bg-green-100/40 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              >
                                <Apple className="mr-1 h-3 w-3" /> Nutrition
                              </Badge>
                            )}
                            {recommendation.category === "exercise" && (
                              <Badge
                                variant="outline"
                                className="bg-orange-100/40 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                              >
                                <Dumbbell className="mr-1 h-3 w-3" /> Exercise
                              </Badge>
                            )}
                            {recommendation.category === "sleep" && (
                              <Badge
                                variant="outline"
                                className="bg-blue-100/40 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              >
                                <Moon className="mr-1 h-3 w-3" /> Sleep
                              </Badge>
                            )}

                            {recommendation.priority === 1 && (
                              <Badge variant="secondary" className="ml-1">
                                High Priority
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleCompletion(recommendation.id)}
                          >
                            <div
                              className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                recommendation.completed
                                  ? "bg-primary border-primary"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {recommendation.completed && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                          </Button>
                        </div>
                        <CardTitle
                          className={`text-xl mt-2 ${
                            recommendation.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {recommendation.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {recommendation.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="details" className="border-b-0">
                            <AccordionTrigger className="text-sm py-2 hover:no-underline">
                              <span className="flex items-center text-muted-foreground hover:text-foreground">
                                <Info className="h-4 w-4 mr-1" /> View details
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-0">
                              <p className="text-sm text-muted-foreground">
                                {recommendation.detail}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-3">
                                {recommendation.tags.map((tag) => (
                                  <Badge
                                    variant="outline"
                                    key={tag}
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                      <CardFooter className="pt-0 pb-4">
                        <div className="flex justify-between w-full mt-4">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Calendar className="h-3.5 w-3.5 mr-1" />{" "}
                                Schedule
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Schedule {recommendation.title}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Add this recommendation to your calendar to
                                  help build it into your routine.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="schedule-date">Date</Label>
                                  <Input id="schedule-date" type="date" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="schedule-time">Time</Label>
                                  <Input id="schedule-time" type="time" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="schedule-repeat">
                                    Repeat
                                  </Label>
                                  <Select defaultValue="daily">
                                    <SelectTrigger id="schedule-repeat">
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="once">Once</SelectItem>
                                      <SelectItem value="daily">
                                        Daily
                                      </SelectItem>
                                      <SelectItem value="weekly">
                                        Weekly
                                      </SelectItem>
                                      <SelectItem value="custom">
                                        Custom
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    toast({
                                      title: "Scheduled!",
                                      description: `${recommendation.title} has been added to your calendar.`,
                                    });
                                  }}
                                >
                                  Add to Calendar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Add Note
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-4">
                                <h4 className="font-medium text-sm">
                                  Add a personal note
                                </h4>
                                <textarea
                                  className="w-full min-h-[100px] text-sm p-2 rounded-md border border-input bg-transparent"
                                  placeholder="Write your notes about this recommendation..."
                                />
                                <Button
                                  className="w-full text-xs"
                                  size="sm"
                                  onClick={() => {
                                    toast({
                                      title: "Note saved",
                                      description:
                                        "Your note has been attached to this recommendation.",
                                    });
                                  }}
                                >
                                  Save Note
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {filteredRecommendations.length === 0 && !loadingRecs && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    No recommendations found
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {showCompleted
                      ? "Try changing your filters or update your health profile for more tailored recommendations."
                      : "You've completed all recommendations in this category! Toggle 'Show completed' to view them."}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      selectedCategory === "all"
                        ? setIsEditing(true)
                        : setSelectedCategory("all")
                    }
                  >
                    {selectedCategory === "all"
                      ? "Update Health Profile"
                      : "View All Categories"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Quick Add Button (Float) */}
          <div className="fixed bottom-8 right-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
                  <Plus className="h-6 w-6" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add Custom Health Goal</AlertDialogTitle>
                  <AlertDialogDescription>
                    Create a personalized health goal to track alongside your
                    recommendations.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input id="goal-title" placeholder="Enter your goal" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-description">Description</Label>
                    <textarea
                      id="goal-description"
                      className="w-full min-h-[80px] text-sm p-2 rounded-md border border-input bg-transparent"
                      placeholder="Add details about your goal..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-category">Category</Label>
                    <Select defaultValue="nutrition">
                      <SelectTrigger id="goal-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nutrition">Nutrition</SelectItem>
                        <SelectItem value="exercise">Exercise</SelectItem>
                        <SelectItem value="sleep">Sleep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      toast({
                        title: "Goal added!",
                        description:
                          "Your custom health goal has been added to your dashboard.",
                      });
                    }}
                  >
                    Add Goal
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
