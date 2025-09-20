"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color?: "default" | "primary" | "success" | "warning" | "danger"
  onClick?: () => void
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  color = "default",
  onClick,
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const colorClasses = {
    default: "",
    primary: "bg-primary/10 border-primary/20",
    success: "bg-green-500/10 border-green-500/20",
    warning: "bg-yellow-500/10 border-yellow-500/20",
    danger: "bg-red-500/10 border-red-500/20",
  }

  const iconColors = {
    default: "text-foreground",
    primary: "text-primary",
    success: "text-green-500",
    warning: "text-yellow-500",
    danger: "text-red-500",
  }

  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500",
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn("overflow-hidden transition-all duration-200", colorClasses[color], onClick && "cursor-pointer")}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <motion.div
              animate={{ rotate: isHovered ? 15 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <Icon className={cn("h-4 w-4", iconColors[color])} />
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && <CardDescription className="mt-1 text-xs">{description}</CardDescription>}
        </CardContent>
        {trend && trendValue && (
          <CardFooter className="pt-0">
            <span className={cn("text-xs font-medium flex items-center gap-1", trendColors[trend])}>
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "neutral" && "→"}
              {trendValue}
            </span>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}

