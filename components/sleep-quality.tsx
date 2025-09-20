"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

interface SleepQualityProps {
  hours: number
  quality: "Poor" | "Fair" | "Good" | "Excellent"
  recommendedHours: number
}

export function SleepQuality({ hours, quality, recommendedHours }: SleepQualityProps) {
  const getQualityColor = () => {
    switch (quality) {
      case "Poor":
        return "text-red-500"
      case "Fair":
        return "text-yellow-500"
      case "Good":
        return "text-green-500"
      case "Excellent":
        return "text-blue-500"
      default:
        return "text-foreground"
    }
  }

  const getSleepMessage = () => {
    const diff = hours - recommendedHours

    if (diff < -2) {
      return "You're significantly under your sleep goal. Try to get to bed earlier tonight."
    } else if (diff < 0) {
      return "You're slightly under your sleep goal. A bit more rest would be beneficial."
    } else if (diff <= 1) {
      return "You're meeting your sleep goal. Great job maintaining a healthy sleep schedule!"
    } else {
      return "You're sleeping more than recommended. While extra rest can be good, too much sleep might affect your energy levels."
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Sleep Analysis</CardTitle>
        <CardDescription>Track your sleep patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Moon className="h-5 w-5 mr-2 text-indigo-400" />
            <span className="text-lg font-medium">{hours} hours</span>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-lg font-medium ${getQualityColor()}`}
          >
            {quality}
          </motion.div>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-muted-foreground">
                Sleep Goal: {recommendedHours} hours
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-muted-foreground">
                {Math.round((hours / recommendedHours) * 100)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.round((hours / recommendedHours) * 100), 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
            ></motion.div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-2">{getSleepMessage()}</p>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <Moon className="h-4 w-4 text-indigo-400" />
            <span className="text-xs ml-1">10:30 PM</span>
          </div>
          <div className="h-px bg-muted flex-1 mx-2"></div>
          <div className="flex items-center">
            <Sun className="h-4 w-4 text-yellow-400" />
            <span className="text-xs ml-1">6:30 AM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

