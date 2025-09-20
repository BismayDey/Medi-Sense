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
import { Utensils, Coffee, Sun, Moon, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { addFoodEntry, subscribeToFoodEntries } from "@/lib/firebase-service"
import type { FoodEntry } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

const foodEntrySchema = z.object({
  name: z.string().min(1, "Food name is required"),
  calories: z.coerce.number().min(0, "Calories must be a positive number"),
  protein: z.coerce.number().min(0).optional(),
  carbs: z.coerce.number().min(0).optional(),
  fat: z.coerce.number().min(0).optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
})

type FoodEntryFormValues = z.infer<typeof foodEntrySchema>

export function FoodDiary() {
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    const unsubscribe = subscribeToFoodEntries(selectedDate, (data) => {
      setEntries(data)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [selectedDate])

  const form = useForm<FoodEntryFormValues>({
    resolver: zodResolver(foodEntrySchema),
    defaultValues: {
      name: "",
      calories: 0,
      protein: undefined,
      carbs: undefined,
      fat: undefined,
      mealType: "breakfast",
    },
  })

  const onSubmit = async (data: FoodEntryFormValues) => {
    try {
      await addFoodEntry({
        name: data.name,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        mealType: data.mealType,
        timestamp: new Date(),
      } as FoodEntry)

      toast({
        title: "Food entry added",
        description: `${data.name} has been added to your food diary.`,
      })

      form.reset()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding food entry:", error)
      toast({
        title: "Error",
        description: "Failed to add food entry. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return <Coffee className="h-4 w-4" />
      case "lunch":
        return <Sun className="h-4 w-4" />
      case "dinner":
        return <Moon className="h-4 w-4" />
      case "snack":
        return <Utensils className="h-4 w-4" />
      default:
        return <Utensils className="h-4 w-4" />
    }
  }

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
      case "lunch":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
      case "dinner":
        return "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
      case "snack":
        return "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)
  const totalProtein = entries.reduce((sum, entry) => sum + (entry.protein || 0), 0)
  const totalCarbs = entries.reduce((sum, entry) => sum + (entry.carbs || 0), 0)
  const totalFat = entries.reduce((sum, entry) => sum + (entry.fat || 0), 0)

  const mealTypeEntries = {
    breakfast: entries.filter((entry) => entry.mealType === "breakfast"),
    lunch: entries.filter((entry) => entry.mealType === "lunch"),
    dinner: entries.filter((entry) => entry.mealType === "dinner"),
    snack: entries.filter((entry) => entry.mealType === "snack"),
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center">
            <Utensils className="mr-2 h-5 w-5" />
            Food Diary
          </CardTitle>
          <CardDescription>Track your meals and nutrition</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Food Entry</DialogTitle>
              <DialogDescription>Enter the details of your meal or snack.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter food name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="protein"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Protein (g)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fat (g)</FormLabel>
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
                  name="mealType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Add Food</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Today's Summary</h3>
            <div className="text-sm text-muted-foreground">{format(selectedDate, "MMMM d, yyyy")}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-muted/50 p-2 rounded-md text-center">
              <div className="text-lg font-bold">{totalCalories}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            <div className="bg-muted/50 p-2 rounded-md text-center">
              <div className="text-lg font-bold">{totalProtein}g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div className="bg-muted/50 p-2 rounded-md text-center">
              <div className="text-lg font-bold">{totalCarbs}g</div>
              <div className="text-xs text-muted-foreground">Carbs</div>
            </div>
            <div className="bg-muted/50 p-2 rounded-md text-center">
              <div className="text-lg font-bold">{totalFat}g</div>
              <div className="text-xs text-muted-foreground">Fat</div>
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
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No food entries</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Add your meals to track your nutrition</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Food
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(mealTypeEntries).map(([mealType, mealEntries]) => {
              if (mealEntries.length === 0) return null

              return (
                <div key={mealType}>
                  <h3 className="text-sm font-medium capitalize mb-2 flex items-center">
                    {getMealTypeIcon(mealType)}
                    <span className="ml-2">{mealType}</span>
                  </h3>
                  <AnimatePresence>
                    <div className="space-y-2">
                      {mealEntries.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between p-2 rounded-lg border border-border"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${getMealTypeColor(entry.mealType)}`}
                            >
                              {getMealTypeIcon(entry.mealType)}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium">{entry.name}</h4>
                              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                {entry.protein && <span>{entry.protein}g P</span>}
                                {entry.carbs && <span>{entry.carbs}g C</span>}
                                {entry.fat && <span>{entry.fat}g F</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">{entry.calories} cal</div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Food
        </Button>
        <div className="text-sm text-muted-foreground">Daily Goal: 2,000 calories</div>
      </CardFooter>
    </Card>
  )
}

