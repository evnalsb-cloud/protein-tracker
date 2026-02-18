// Custom hook for managing food log state

import { useState, useCallback, useEffect } from 'react'
import { 
  getLogByDate, 
  addFoodToMeal as addToMeal, 
  removeFoodFromMeal as removeFromMeal,
  getProteinGoal,
  setProteinGoal as saveProteinGoal,
  addRecentFood as saveRecentFood
} from '../services/storage'
import { toISODateString } from '../utils/formatters'

/**
 * Custom hook for managing daily food log
 * @param {Date|string} date - The date to manage
 * @returns {Object} Log state and actions
 */
export function useFoodLog(date = new Date()) {
  const [log, setLog] = useState(() => getLogByDate(date))
  const [goal, setGoalState] = useState(() => getProteinGoal())

  // Update log when date changes
  useEffect(() => {
    setLog(getLogByDate(date))
  }, [date])

  // Add food to a meal
  const addFood = useCallback((mealType, foodItem) => {
    const updatedLog = addToMeal(date, mealType, foodItem)
    if (updatedLog) {
      setLog(updatedLog)
      // Save to recent foods
      saveRecentFood(foodItem)
      return true
    }
    return false
  }, [date])

  // Remove food from a meal
  const removeFood = useCallback((mealType, foodId) => {
    const updatedLog = removeFromMeal(date, mealType, foodId)
    if (updatedLog) {
      setLog(updatedLog)
      return true
    }
    return false
  }, [date])

  // Update protein goal
  const setGoal = useCallback((newGoal) => {
    if (saveProteinGoal(newGoal)) {
      setGoalState(newGoal)
      return true
    }
    return false
  }, [])

  // Get protein progress percentage
  const progress = Math.min((log.totalProtein / goal) * 100, 100)
  
  // Get remaining protein
  const remaining = Math.max(goal - log.totalProtein, 0)

  // Check if goal is reached
  const isGoalReached = log.totalProtein >= goal

  return {
    log,
    goal,
    progress,
    remaining,
    isGoalReached,
    addFood,
    removeFood,
    setGoal,
  }
}
