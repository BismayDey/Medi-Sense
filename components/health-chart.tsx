"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { HealthData, HealthMetric } from "@/lib/types"
import { motion } from "framer-motion"

interface HealthChartProps {
  data: HealthData[]
}

export function HealthChart({ data }: HealthChartProps) {
  const [metric, setMetric] = useState<HealthMetric>("heartRate")
  const [chartType, setChartType] = useState<"line" | "bar">("line")

  const chartData = data
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      [metric]:
        metric === "bloodPressure" ? `${item.bloodPressure.systolic}/${item.bloodPressure.diastolic}` : item[metric],
    }))
    .reverse()

  const metricLabels: Record<HealthMetric, string> = {
    heartRate: "Heart Rate (bpm)",
    sleepHours: "Sleep Hours",
    sleepQuality: "Sleep Quality",
    steps: "Steps",
    caloriesBurned: "Calories Burned",
    caloriesConsumed: "Calories Consumed",
    waterIntake: "Water Intake (ml)",
    weight: "Weight (kg)",
    mood: "Mood",
  }

  const getChartColor = (metric: HealthMetric) => {
    const colors: Record<HealthMetric, string> = {
      heartRate: "hsl(var(--chart-1))",
      sleepHours: "hsl(var(--chart-2))",
      sleepQuality: "hsl(var(--chart-3))",
      steps: "hsl(var(--chart-4))",
      caloriesBurned: "hsl(var(--chart-5))",
      caloriesConsumed: "hsl(var(--chart-6))",
      waterIntake: "hsl(var(--chart-7))",
      weight: "hsl(var(--chart-8))",
      mood: "hsl(var(--chart-9))",
    }

    return colors[metric] || "hsl(var(--chart-1))"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle>Health Trends</CardTitle>
              <CardDescription>Track your health metrics over time</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={metric} onValueChange={(value) => setMetric(value as HealthMetric)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(metricLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Tabs
                defaultValue="line"
                className="w-[180px]"
                onValueChange={(value) => setChartType(value as "line" | "bar")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="line">Line</TabsTrigger>
                  <TabsTrigger value="bar">Bar</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                [metric]: {
                  label: metricLabels[metric],
                  color: getChartColor(metric),
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey={metric}
                      stroke={`var(--color-${metric})`}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey={metric} fill={`var(--color-${metric})`} radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

