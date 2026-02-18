// Meal log component for displaying daily meals

import { MEAL_TYPES } from '../utils/constants'
import FoodCard from './FoodCard'
import { formatProtein } from '../utils/formatters'

/**
 * Meal log component
 * @param {Object} props
 * @param {Object} props.meals - Meals object with food items
 * @param {Function} props.onRemoveFood - Remove food callback
 * @param {Function} props.onAddFood - Add food callback (opens search)
 */
export default function MealLog({ meals, onRemoveFood, onAddFood }) {
  // Calculate protein for each meal
  const getMealProtein = (mealType) => {
    return (meals[mealType] || []).reduce((sum, food) => sum + food.protein, 0)
  }

  return (
    <div className="space-y-4">
      {Object.entries(MEAL_TYPES).map(([mealType, mealInfo]) => {
        const foods = meals[mealType] || []
        const mealProtein = getMealProtein(mealType)
        
        return (
          <div key={mealType} className="card">
            {/* Meal header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${mealInfo.color}`}>
                  {mealInfo.label}
                </span>
                {foods.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {formatProtein(mealProtein)}
                  </span>
                )}
              </div>
              <button
                onClick={() => onAddFood(mealType)}
                className="p-2 text-protein hover:bg-green-50 rounded-lg transition-colors"
                aria-label={`Add food to ${mealInfo.label}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Food items */}
            {foods.length > 0 ? (
              <div>
                {foods.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onRemove={() => onRemoveFood(mealType, food.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-2">
                No foods added yet
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}