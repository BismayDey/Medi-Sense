"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dumbbell, Plus, Timer, Flame, Calendar, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { addWorkout, subscribeToWorkouts } from "@/lib/firebase-service"
import type { WorkoutSession } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

const workoutSchema = z.object({
  type: z.enum(["cardio", "strength", "flexibility", "sports", "other"]),
  name: z.string().min(1, "Workout name is required"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  caloriesBurned: z.coerce.number().min(0, "Calories must be a positive number"),
  intensity: z.enum(["low", "moderate", "high"]),
  notes: z.string().optional(),
})

type WorkoutFormValues = z.infer<typeof workoutSchema>

export function WorkoutTracker() {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToWorkouts(30, (data) => {
      setWorkouts(data)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      type: "cardio",
      name: "",
      duration: 30,
      caloriesBurned: 0,
      intensity: "moderate",
      notes: "",
    },
  })

  const onSubmit = async (data: WorkoutFormValues) => {
    try {
      await addWorkout({
        type: data.type,
        name: data.name,
        duration: data.duration,
        caloriesBurned: data.caloriesBurned,
        intensity: data.intensity,
        notes: data.notes,
        timestamp: new Date(),
      } as WorkoutSession)

      toast({
        title: "Workout added",
        description: `${data.name} has been added to your workout history.`,
      })

      form.reset()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding workout:", error)
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case "cardio":
        return <Timer className="h-4 w-4" />
      case "strength":
        return <Dumbbell className="h-4 w-4" />
      case "flexibility":
        return <ArrowRight className="h-4 w-4" />
      case "sports":
        return <Dumbbell className="h-4 w-4" />
      case "other":
        return <Dumbbell className="h-4 w-4" />
      default:
        return <Dumbbell className="h-4 w-4" />
    }
  }

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case "cardio":
        return "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
      case "strength":
        return "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
      case "flexibility":
        return "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
      case "sports":
        return "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
      case "other":
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low":
        return "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
      case "moderate":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
      case "high":
        return "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  // Calculate total stats
  const totalWorkouts = workouts.length
  const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0)
  const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0)

  // Group workouts by date
  const workoutsByDate = workouts.reduce(
    (acc, workout) => {
      const date = format(workout.timestamp.toDate(), "yyyy-MM-dd")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(workout)
      return acc
    },
    {} as Record<string, WorkoutSession[]>,
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center">
            <Dumbbell className="mr-2 h-5 w-5" />
            Workout Tracker
          </CardTitle>
          <CardDescription>Track your workouts and exercises</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Workout</DialogTitle>
              <DialogDescription>Enter the details of your workout session.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="strength">Strength</SelectItem>
                          <SelectItem value="flexibility">Flexibility</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Morning Run, Chest Day" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="caloriesBurned"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories Burned</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select intensity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional notes about your workout..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Add Workout</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">30-Day Summary</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/50 p-2 rounded-md text-center">
              <div className="text-lg font-bold">{totalWorkouts}</div>
              <div className="text-xs text-muted-foreground">Workouts</div>
            </div>
            <div className="bg-muted/50 p-2 rounded-md text-center">
              <div className="text-lg font-bold">{totalDuration} min</div>
              <div className="text-xs text-muted-foreground">Total Time</div>
            </div>
            <div className="bg-muted/50 p-2 rounded-md text-center">
              <div className="text-lg font-bold">{totalCaloriesBurned}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                <div className="space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-center p-2 rounded-md">
                      <div className="w-10 h-10 bg-muted rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                      <div className="w-12 h-6 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : workouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No workouts</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Add your workouts to track your fitness progress</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Workout
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(workoutsByDate).map(([date, dateWorkouts]) => (
              <div key={date}>
                <h3 className="text-sm font-medium flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(new Date(date), "MMMM d, yyyy")}</span>
                </h3>
                <AnimatePresence>
                  <div className="space-y-2">
                    {dateWorkouts.map((workout) => (
                      <motion.div
                        key={workout.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getWorkoutTypeColor(workout.type)}`}
                          >
                            {getWorkoutTypeIcon(workout.type)}
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">{workout.name}</h4>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span className="flex items-center">
                                <Timer className="h-3 w-3 mr-1" />
                                {workout.duration} min
                              </span>
                              <span className="flex items-center">
                                <Flame className="h-3 w-3 mr-1" />
                                {workout.caloriesBurned} cal
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-xs ${getIntensityColor(workout.intensity)}`}>
                                {workout.intensity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Workout
        </Button>
      </CardFooter>
    </Card>
  )
}

