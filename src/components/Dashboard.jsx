// Main dashboard component

import { useState } from 'react'
import { formatDate, formatProtein } from '../utils/formatters'
import ProgressBar from './ProgressBar'
import MealLog from './MealLog'
import FoodSearch from './FoodSearch'
import GoalSetter from './GoalSetter'
import History from './History'

/**
 * Dashboard component
 * @param {Object} props
 * @param {Object} props.log - Current day's log
 * @param {number} props.goal - Protein goal
 * @param {number} props.progress - Progress percentage
 * @param {number} props.remaining - Remaining protein
 * @param {boolean} props.isGoalReached - Whether goal is reached
 * @param {Function} props.onAddFood - Add food callback
 * @param {Function} props.onRemoveFood - Remove food callback
 * @param {Function} props.onSetGoal - Set goal callback
 * @param {Date} props.currentDate - Current date
 * @param {Function} props.onDateChange - Date change callback
 */
export default function Dashboard({
  log,
  goal,
  progress,
  remaining,
  isGoalReached,
  onAddFood,
  onRemoveFood,
  onSetGoal,
  currentDate,
  onDateChange,
}) {
  const [showSearch, setShowSearch] = useState(false)
  const [showGoalSetter, setShowGoalSetter] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState(null)

  // Navigate to previous/next day
  const goToPreviousDay = () => {
    const prev = new Date(currentDate)
    prev.setDate(prev.getDate() - 1)
    onDateChange(prev)
  }

  const goToNextDay = () => {
    const next = new Date(currentDate)
    next.setDate(next.getDate() + 1)
    if (next <= new Date()) {
      onDateChange(next)
    }
  }

  // Handle opening search for specific meal
  const handleAddFood = (mealType) => {
    setSelectedMealType(mealType)
    setShowSearch(true)
  }

  // Handle adding food from search
  const handleFoodAdd = (mealType, food) => {
    onAddFood(mealType || selectedMealType || 'breakfast', food)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-protein text-white p-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Protein Tracker</h1>
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>

        {/* Date navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goToPreviousDay}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium min-w-[120px] text-center">
            {formatDate(currentDate)}
          </span>
          <button
            onClick={goToNextDay}
            disabled={formatDate(currentDate) === 'Today'}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Progress section */}
      <div className="px-4 -mt-16">
        <div className="card flex flex-col items-center py-6">
          <ProgressBar
            current={log.totalProtein}
            goal={goal}
            percentage={progress}
          />
          
          {/* Goal reached message */}
          {isGoalReached && (
            <div className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Goal reached! Great job!
            </div>
          )}

          {/* Remaining protein */}
          {!isGoalReached && remaining > 0 && (
            <p className="mt-4 text-gray-500 text-sm">
              {formatProtein(remaining)} more to reach your goal
            </p>
          )}

          {/* Set goal button */}
          <button
            onClick={() => setShowGoalSetter(true)}
            className="mt-4 text-sm text-protein font-medium hover:underline"
          >
            Edit goal ({formatProtein(goal)})
          </button>
        </div>
      </div>

      {/* Quick add button */}
      <div className="px-4 mt-4">
        <button
          onClick={() => {
            setSelectedMealType(null)
            setShowSearch(true)
          }}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Food
        </button>
      </div>

      {/* Meal log */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Meals</h2>
        <MealLog
          meals={log.meals}
          onRemoveFood={onRemoveFood}
          onAddFood={handleAddFood}
        />
      </div>

      {/* Modals */}
      {showSearch && (
        <FoodSearch
          onAdd={handleFoodAdd}
          onClose={() => {
            setShowSearch(false)
            setSelectedMealType(null)
          }}
        />
      )}

      {showGoalSetter && (
        <GoalSetter
          currentGoal={goal}
          onSetGoal={onSetGoal}
          onClose={() => setShowGoalSetter(false)}
        />
      )}

      {showHistory && (
        <History
          onClose={() => setShowHistory(false)}
          onSelectDate={(date) => {
            onDateChange(date)
            setShowHistory(false)
          }}
        />
      )}
    </div>
  )
}