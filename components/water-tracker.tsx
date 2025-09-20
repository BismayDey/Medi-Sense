"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet } from "lucide-react"
import { ProgressRing } from "./progress-ring"
import { motion, AnimatePresence } from "framer-motion"
import { updateHealthData } from "@/lib/firebase-service"
import { toast } from "@/components/ui/use-toast"

interface WaterTrackerProps {
  currentIntake: number
  goal: number
  healthDataId?: string
  onUpdate?: (newValue: number) => void
}

export function WaterTracker({ currentIntake, goal, healthDataId, onUpdate }: WaterTrackerProps) {
  const [intake, setIntake] = useState(currentIntake)
  const [isUpdating, setIsUpdating] = useState(false)

  const percentage = Math.min(Math.round((intake / goal) * 100), 100)

  const addWater = async (amount: number) => {
    const newIntake = intake + amount
    setIntake(newIntake)

    if (healthDataId) {
      setIsUpdating(true)
      try {
        await updateHealthData(healthDataId, { waterIntake: newIntake })
        if (onUpdate) onUpdate(newIntake)

        toast({
          title: "Water intake updated",
          description: `Added ${amount}ml of water. Total: ${newIntake}ml`,
        })
      } catch (error) {
        console.error("Error updating water intake:", error)
        setIntake(intake) // Revert on error
        toast({
          title: "Error",
          description: "Failed to update water intake",
          variant: "destructive",
        })
      } finally {
        setIsUpdating(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Water Intake</CardTitle>
        <CardDescription>Track your daily hydration</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ProgressRing
          value={intake}
          max={goal}
          size={150}
          strokeWidth={12}
          color="hsl(var(--blue-500))"
          label={`${percentage}% of daily goal`}
          unit="ml"
        />

        <div className="mt-6 grid grid-cols-3 gap-2">
          <AnimatePresence>
            {[100, 250, 500].map((amount) => (
              <motion.div
                key={amount}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button variant="outline" className="w-full" onClick={() => addWater(amount)} disabled={isUpdating}>
                  <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                  {amount}ml
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}

