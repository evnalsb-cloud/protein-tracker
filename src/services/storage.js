// Local storage service for data persistence

import { STORAGE_KEYS, DEFAULT_PROTEIN_GOAL } from '../utils/constants'
import { toISODateString } from '../utils/formatters'

/**
 * Get all daily logs from storage
 * @returns {Object} Object with date keys and log values
 */
export function getAllLogs() {
  try {
    const logs = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS)
    return logs ? JSON.parse(logs) : {}
  } catch (error) {
    console.error('Error reading logs from storage:', error)
    return {}
  }
}

/**
 * Get log for a specific date
 * @param {Date|string} date 
 * @returns {Object} Daily log object
 */
export function getLogByDate(date) {
  const dateKey = typeof date === 'string' ? date : toISODateString(date)
  const logs = getAllLogs()
  
  return logs[dateKey] || {
    date: dateKey,
    goal: getProteinGoal(),
    meals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    },
    totalProtein: 0,
  }
}

/**
 * Save log for a specific date
 * @param {Object} log 
 */
export function saveLog(log) {
  try {
    const logs = getAllLogs()
    logs[log.date] = log
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs))
    return true
  } catch (error) {
    console.error('Error saving log to storage:', error)
    return false
  }
}

/**
 * Add a food item to a specific meal
 * @param {Date|string} date 
 * @param {string} mealType 
 * @param {Object} foodItem 
 */
export function addFoodToMeal(date, mealType, foodItem) {
  const log = getLogByDate(date)
  
  if (!log.meals[mealType]) {
    log.meals[mealType] = []
  }
  
  log.meals[mealType].push({
    ...foodItem,
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    timestamp: new Date().toISOString(),
  })
  
  // Recalculate total protein
  log.totalProtein = calculateTotalProtein(log.meals)
  
  return saveLog(log) ? log : null
}

/**
 * Remove a food item from a meal
 * @param {Date|string} date 
 * @param {string} mealType 
 * @param {string} foodId 
 */
export function removeFoodFromMeal(date, mealType, foodId) {
  const log = getLogByDate(date)
  
  if (log.meals[mealType]) {
    log.meals[mealType] = log.meals[mealType].filter(item => item.id !== foodId)
  }
  
  // Recalculate total protein
  log.totalProtein = calculateTotalProtein(log.meals)
  
  return saveLog(log) ? log : null
}

/**
 * Calculate total protein from all meals
 * @param {Object} meals 
 * @returns {number}
 */
function calculateTotalProtein(meals) {
  return Object.values(meals)
    .flat()
    .reduce((total, item) => total + (item.protein || 0), 0)
}

/**
 * Get protein goal from storage
 * @returns {number}
 */
export function getProteinGoal() {
  try {
    const goal = localStorage.getItem(STORAGE_KEYS.GOAL)
    return goal ? parseInt(goal, 10) : DEFAULT_PROTEIN_GOAL
  } catch (error) {
    console.error('Error reading goal from storage:', error)
    return DEFAULT_PROTEIN_GOAL
  }
}

/**
 * Set protein goal in storage
 * @param {number} goal 
 */
export function setProteinGoal(goal) {
  try {
    localStorage.setItem(STORAGE_KEYS.GOAL, goal.toString())
    return true
  } catch (error) {
    console.error('Error saving goal to storage:', error)
    return false
  }
}

/**
 * Get recent/favorite foods
 * @returns {Array}
 */
export function getRecentFoods() {
  try {
    const foods = localStorage.getItem(STORAGE_KEYS.RECENT_FOODS)
    return foods ? JSON.parse(foods) : []
  } catch (error) {
    console.error('Error reading recent foods from storage:', error)
    return []
  }
}

/**
 * Add food to recent foods (max 20 items)
 * @param {Object} food 
 */
export function addRecentFood(food) {
  try {
    let recent = getRecentFoods()
    
    // Remove if already exists (to move to front)
    recent = recent.filter(f => f.name !== food.name)
    
    // Add to front
    recent.unshift({
      name: food.name,
      protein: food.protein,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      source: food.source,
    })
    
    // Keep only last 20
    recent = recent.slice(0, 20)
    
    localStorage.setItem(STORAGE_KEYS.RECENT_FOODS, JSON.stringify(recent))
    return true
  } catch (error) {
    console.error('Error saving recent food to storage:', error)
    return false
  }
}

/**
 * Get logs for a date range (for history view)
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Array}
 */
export function getLogsInRange(startDate, endDate) {
  const logs = getAllLogs()
  const results = []
  
  const current = new Date(startDate)
  const end = new Date(endDate)
  
  while (current <= end) {
    const dateKey = toISODateString(current)
    if (logs[dateKey]) {
      results.push(logs[dateKey])
    }
    current.setDate(current.getDate() + 1)
  }
  
  return results.sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Clear all data (for testing/reset)
 */
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}