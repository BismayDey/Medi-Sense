"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addHealthData } from "@/lib/firebase-service"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

const formSchema = z.object({
  heartRate: z.coerce.number().min(40).max(220),
  systolic: z.coerce.number().min(70).max(200),
  diastolic: z.coerce.number().min(40).max(130),
  sleepHours: z.coerce.number().min(0).max(24),
  sleepQuality: z.enum(["Poor", "Fair", "Good", "Excellent"]),
  steps: z.coerce.number().min(0).max(100000),
  caloriesBurned: z.coerce.number().min(0).max(10000),
  caloriesConsumed: z.coerce.number().min(0).max(10000),
  waterIntake: z.coerce.number().min(0).max(5000),
  weight: z.coerce.number().min(20).max(300),
  mood: z.enum(["Very Bad", "Bad", "Neutral", "Good", "Very Good"]),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface HealthDataFormProps {
  onSuccess: () => void
}

export function HealthDataForm({ onSuccess }: HealthDataFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: FormValues = {
    heartRate: 72,
    systolic: 120,
    diastolic: 80,
    sleepHours: 7,
    sleepQuality: "Good",
    steps: 8000,
    caloriesBurned: 400,
    caloriesConsumed: 2000,
    waterIntake: 2000,
    weight: 70,
    mood: "Good",
    notes: "",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      const today = new Date()
      const formattedDate = today.toISOString().split("T")[0]

      await addHealthData({
        date: formattedDate,
        heartRate: data.heartRate,
        bloodPressure: {
          systolic: data.systolic,
          diastolic: data.diastolic,
        },
        sleepHours: data.sleepHours,
        sleepQuality: data.sleepQuality,
        steps: data.steps,
        caloriesBurned: data.caloriesBurned,
        caloriesConsumed: data.caloriesConsumed,
        waterIntake: data.waterIntake,
        weight: data.weight,
        mood: data.mood,
        notes: data.notes || "",
      })

      toast({
        title: "Success!",
        description: "Your health data has been saved.",
      })

      onSuccess()
    } catch (error) {
      console.error("Error saving health data:", error)
      toast({
        title: "Error",
        description: "Failed to save your health data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-card rounded-lg border shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Log Today's Health Data</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="heartRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heart Rate (bpm)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="systolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Systolic (mmHg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diastolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diastolic (mmHg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sleepHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep Hours</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sleepQuality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep Quality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sleep quality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Poor">Poor</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="steps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steps</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="caloriesBurned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories Burned</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="caloriesConsumed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories Consumed</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waterIntake"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Intake (ml)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Very Bad">Very Bad</SelectItem>
                        <SelectItem value="Bad">Bad</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
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
                      <Textarea placeholder="Any additional notes about your day..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Health Data"}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}

