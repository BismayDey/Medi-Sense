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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Target, Plus, Trophy, Calendar, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { addGoal, updateGoal, subscribeToGoals } from "@/lib/firebase-service"
import type { Goal } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Progress } from "@/components/ui/progress"

const goalSchema = z.object({
  type: z.enum(["steps", "weight", "sleep", "water", "calories", "workout", "custom"]),
  target: z.coerce.number().min(1, "Target must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  deadline: z.date(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
})

type GoalFormValues = z.infer<typeof goalSchema>

export function GoalsTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToGoals((data) => {
      setGoals(data)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      type: "steps",
      target: 10000,
      unit: "steps",
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      title: "Daily Steps Goal",
      description: "",
    },
  })

  const onSubmit = async (data: GoalFormValues) => {
    try {
      await addGoal({
        type: data.type,
        target: data.target,
        unit: data.unit,
        deadline: data.deadline,
        progress: 0,
        completed: false,
        title: data.title,
        description: data.description,
      } as Goal)

      toast({
        title: "Goal added",
        description: `${data.title} has been added to your goals.`,
      })

      form.reset()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding goal:", error)
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateGoalProgress = async (goal: Goal, newProgress: number) => {
    try {
      const isCompleted = newProgress >= goal.target

      await updateGoal(goal.id, {
        progress: newProgress,
        completed: isCompleted,
      })

      if (isCompleted && !goal.completed) {
        toast({
          title: "Goal achieved! 🎉",
          description: `Congratulations! You've completed your goal: ${goal.title}`,
        })
      } else {
        toast({
          title: "Progress updated",
          description: `${goal.title} progress updated to ${newProgress} ${goal.unit}.`,
        })
      }
    } catch (error) {
      console.error("Error updating goal:", error)
      toast({
        title: "Error",
        description: "Failed to update goal progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case "steps":
        return <Target className="h-4 w-4" />
      case "weight":
        return <Target className="h-4 w-4" />
      case "sleep":
        return <Target className="h-4 w-4" />
      case "water":
        return <Target className="h-4 w-4" />
      case "calories":
        return <Target className="h-4 w-4" />
      case "workout":
        return <Target className="h-4 w-4" />
      case "custom":
        return <Target className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getGoalTypeColor = (type: string) => {
    switch (type) {
      case "steps":
        return "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
      case "weight":
        return "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
      case "sleep":
        return "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
      case "water":
        return "bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400"
      case "calories":
        return "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
      case "workout":
        return "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
      case "custom":
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  // Filter goals
  const activeGoals = goals.filter((goal) => !goal.completed)
  const completedGoals = goals.filter((goal) => goal.completed)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Goals & Achievements
          </CardTitle>
          <CardDescription>Track your health and fitness goals</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>Set a new health or fitness goal to track your progress.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter goal title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)

                          // Set default units based on type
                          switch (value) {
                            case "steps":
                              form.setValue("unit", "steps")
                              form.setValue("target", 10000)
                              break
                            case "weight":
                              form.setValue("unit", "kg")
                              form.setValue("target", 70)
                              break
                            case "sleep":
                              form.setValue("unit", "hours")
                              form.setValue("target", 8)
                              break
                            case "water":
                              form.setValue("unit", "ml")
                              form.setValue("target", 2000)
                              break
                            case "calories":
                              form.setValue("unit", "calories")
                              form.setValue("target", 2000)
                              break
                            case "workout":
                              form.setValue("unit", "workouts")
                              form.setValue("target", 20)
                              break
                            case "custom":
                              form.setValue("unit", "")
                              form.setValue("target", 1)
                              break
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="steps">Steps</SelectItem>
                          <SelectItem value="weight">Weight</SelectItem>
                          <SelectItem value="sleep">Sleep</SelectItem>
                          <SelectItem value="water">Water</SelectItem>
                          <SelectItem value="calories">Calories</SelectItem>
                          <SelectItem value="workout">Workout</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., steps, kg, hours" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter goal description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Add Goal</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                <div className="space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="p-4 rounded-md border border-border">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-muted rounded-full mr-3"></div>
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                      </div>
                      <div className="h-2 bg-muted rounded w-full mb-2"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                        <div className="w-20 h-8 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No goals set</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Set goals to track your health and fitness progress
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  <span>Active Goals</span>
                </h3>
                <AnimatePresence>
                  <div className="space-y-3">
                    {activeGoals.map((goal) => {
                      const progress = Math.min(Math.round((goal.progress / goal.target) * 100), 100)
                      const deadline = goal.deadline.toDate()
                      const isNearDeadline = deadline < new Date(new Date().setDate(new Date().getDate() + 3))

                      return (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="p-4 rounded-lg border border-border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${getGoalTypeColor(goal.type)}`}
                              >
                                {getGoalTypeIcon(goal.type)}
                              </div>
                              <h4 className="font-medium ml-2">{goal.title}</h4>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span className={isNearDeadline ? "text-red-500" : ""}>
                                {format(deadline, "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>

                          <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>
                                {goal.progress} {goal.unit}
                              </span>
                              <span>
                                {goal.target} {goal.unit}
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-muted-foreground">{progress}% complete</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newProgress = Math.min(
                                    goal.progress + Math.ceil(goal.target * 0.1),
                                    goal.target,
                                  )
                                  updateGoalProgress(goal, newProgress)
                                }}
                              >
                                Update Progress
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </AnimatePresence>
              </div>
            )}

            {completedGoals.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span>Completed Goals</span>
                </h3>
                <AnimatePresence>
                  <div className="space-y-2">
                    {completedGoals.slice(0, 3).map((goal) => (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <h4 className="font-medium ml-2 text-sm">{goal.title}</h4>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {goal.target} {goal.unit}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {completedGoals.length > 3 && (
                      <Button variant="ghost" size="sm" className="w-full">
                        View All {completedGoals.length} Completed Goals
                      </Button>
                    )}
                  </div>
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </CardFooter>
    </Card>
  )
}

