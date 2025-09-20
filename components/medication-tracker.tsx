"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Pill, Clock, Plus, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { addMedication, updateMedication, subscribeToMedications } from "@/lib/firebase-service"
import type { Medication } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

const medicationFormSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.enum(["daily", "twice-daily", "weekly", "monthly", "as-needed", "custom"]),
  customFrequency: z.string().optional(),
  nextDose: z.date(),
  instructions: z.string().optional(),
  remainingDoses: z.coerce.number().min(0).optional(),
  refillReminder: z.boolean().default(false),
  refillReminderDate: z.date().optional(),
})

type MedicationFormValues = z.infer<typeof medicationFormSchema>

export function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToMedications((data) => {
      setMedications(data)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "daily",
      nextDose: new Date(),
      refillReminder: false,
    },
  })

  const onSubmit = async (data: MedicationFormValues) => {
    try {
      await addMedication({
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        customFrequency: data.customFrequency,
        nextDose: data.nextDose,
        instructions: data.instructions,
        remainingDoses: data.remainingDoses,
        refillReminder: data.refillReminder,
        refillReminderDate: data.refillReminderDate,
      } as Medication)

      toast({
        title: "Medication added",
        description: `${data.name} has been added to your medications.`,
      })

      form.reset()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding medication:", error)
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive",
      })
    }
  }

  const markAsTaken = async (medication: Medication) => {
    try {
      // Calculate next dose based on frequency
      let nextDose = new Date()

      switch (medication.frequency) {
        case "daily":
          nextDose.setDate(nextDose.getDate() + 1)
          break
        case "twice-daily":
          nextDose.setHours(nextDose.getHours() + 12)
          break
        case "weekly":
          nextDose.setDate(nextDose.getDate() + 7)
          break
        case "monthly":
          nextDose.setMonth(nextDose.getMonth() + 1)
          break
        case "as-needed":
          // No specific next dose for as-needed medications
          break
        case "custom":
          // Use the same interval as before
          if (medication.lastTaken) {
            const lastInterval = medication.nextDose.toDate().getTime() - medication.lastTaken.toDate().getTime()
            nextDose = new Date(Date.now() + lastInterval)
          }
          break
      }

      const remainingDoses = medication.remainingDoses ? medication.remainingDoses - 1 : undefined

      await updateMedication(medication.id, {
        lastTaken: new Date(),
        nextDose,
        remainingDoses,
      })

      toast({
        title: "Medication taken",
        description: `${medication.name} marked as taken.`,
      })

      // Show refill reminder if needed
      if (remainingDoses !== undefined && remainingDoses <= 3) {
        toast({
          title: "Refill reminder",
          description: `You have ${remainingDoses} doses of ${medication.name} remaining. Consider refilling soon.`,
          variant: "warning",
        })
      }
    } catch (error) {
      console.error("Error updating medication:", error)
      toast({
        title: "Error",
        description: "Failed to update medication. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getTimeUntilNextDose = (nextDose: Date): string => {
    const now = new Date()
    const diffMs = nextDose.getTime() - now.getTime()

    if (diffMs < 0) return "Overdue"

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays} day${diffDays !== 1 ? "s" : ""}`
    }

    return `${diffHours}h ${diffMinutes}m`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center">
            <Pill className="mr-2 h-5 w-5" />
            Medications
          </CardTitle>
          <CardDescription>Track your medications and dosages</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Medication</DialogTitle>
              <DialogDescription>
                Enter the details of your medication to track doses and get reminders.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter medication name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 10mg, 1 tablet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="twice-daily">Twice Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="as-needed">As Needed</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("frequency") === "custom" && (
                  <FormField
                    control={form.control}
                    name="customFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Frequency</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Every 8 hours, Every other day" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="nextDose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Dose</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Take with food, Take before bed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remainingDoses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remaining Doses</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>Leave empty if not applicable</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Add Medication</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-2 rounded-md animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
                <div className="w-20 h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : medications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Pill className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No medications</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Add your medications to track doses and get reminders
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {medications.map((medication) => {
                const nextDose = medication.nextDose.toDate()
                const isOverdue = nextDose < new Date()

                return (
                  <motion.div
                    key={medication.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isOverdue ? "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800" : "border-border"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isOverdue
                            ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Pill className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">{medication.name}</h4>
                        <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                          <span className="mr-2">{medication.dosage}</span>
                          {medication.remainingDoses !== undefined && (
                            <span className="bg-muted px-1.5 py-0.5 rounded text-xs">
                              {medication.remainingDoses} left
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`text-xs flex items-center ${
                          isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                        }`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{getTimeUntilNextDose(nextDose)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={isOverdue ? "destructive" : "outline"}
                        onClick={() => markAsTaken(medication)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Take
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}

