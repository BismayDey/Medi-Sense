"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { updateHealthData } from "@/lib/firebase-service"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface MoodTrackerProps {
  currentMood: "Very Bad" | "Bad" | "Neutral" | "Good" | "Very Good"
  healthDataId?: string
  onUpdate?: (newMood: "Very Bad" | "Bad" | "Neutral" | "Good" | "Very Good") => void
}

export function MoodTracker({ currentMood, healthDataId, onUpdate }: MoodTrackerProps) {
  const [mood, setMood] = useState<"Very Bad" | "Bad" | "Neutral" | "Good" | "Very Good">(currentMood)
  const [isUpdating, setIsUpdating] = useState(false)

  const moods = [
    {
      value: "Very Bad",
      emoji: "😢",
      label: "Very Bad",
      color: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    },
    {
      value: "Bad",
      emoji: "😕",
      label: "Bad",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
    },
    {
      value: "Neutral",
      emoji: "😐",
      label: "Neutral",
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
    },
    {
      value: "Good",
      emoji: "🙂",
      label: "Good",
      color: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      value: "Very Good",
      emoji: "😄",
      label: "Very Good",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
  ]

  const updateMood = async (newMood: "Very Bad" | "Bad" | "Neutral" | "Good" | "Very Good") => {
    if (newMood === mood) return

    setMood(newMood)

    if (healthDataId) {
      setIsUpdating(true)
      try {
        await updateHealthData(healthDataId, { mood: newMood })
        if (onUpdate) onUpdate(newMood)

        toast({
          title: "Mood updated",
          description: `Your mood has been updated to ${newMood}.`,
        })
      } catch (error) {
        console.error("Error updating mood:", error)
        setMood(currentMood) // Revert on error
        toast({
          title: "Error",
          description: "Failed to update mood",
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
        <CardTitle>Mood Tracker</CardTitle>
        <CardDescription>How are you feeling today?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">Current Mood:</div>
          <div className="text-xl">
            {moods.find((m) => m.value === mood)?.emoji} {mood}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          <AnimatePresence>
            {moods.map((moodOption) => (
              <motion.div
                key={moodOption.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button
                  variant="outline"
                  className={`w-full h-auto flex flex-col py-3 ${mood === moodOption.value ? moodOption.color : ""}`}
                  onClick={() => updateMood(moodOption.value as any)}
                  disabled={isUpdating}
                >
                  <span className="text-2xl mb-1">{moodOption.emoji}</span>
                  <span className="text-xs">{moodOption.label}</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}

