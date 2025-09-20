export const calculateBMI = (weight: number, heightCm: number): number => {
  const heightM = heightCm / 100
  return weight / (heightM * heightM)
}

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal weight"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

export const getHeartRateZone = (heartRate: number, age: number): string => {
  const maxHeartRate = 220 - age
  const percentage = (heartRate / maxHeartRate) * 100

  if (percentage < 50) return "Resting"
  if (percentage < 70) return "Moderate"
  if (percentage < 85) return "Aerobic"
  return "Anaerobic"
}

export const getSleepRecommendation = (age: number): number => {
  if (age < 13) return 9
  if (age < 18) return 8
  if (age < 65) return 7
  return 7
}

export const getWaterIntakeGoal = (weightKg: number): number => {
  // Recommendation: 30-35ml per kg of body weight
  return Math.round(weightKg * 0.033 * 1000)
}

export const getCaloriesBurnedEstimate = (steps: number, weightKg: number): number => {
  // Rough estimate: 0.04 calories per step per kg of body weight
  return Math.round(steps * 0.04 * weightKg)
}

