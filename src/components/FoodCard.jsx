// Food card component for displaying individual food items

import { formatProtein, formatTime } from '../utils/formatters'

/**
 * Food card component
 * @param {Object} props
 * @param {Object} props.food - Food item data
 * @param {Function} props.onRemove - Remove callback
 * @param {boolean} props.showTime - Whether to show timestamp
 */
export default function FoodCard({ food, onRemove, showTime = true }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-2 group">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">
          {food.name}
        </h4>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold text-protein">
            {formatProtein(food.protein)}
          </span>
          {food.servingSize && (
            <>
              <span>•</span>
              <span>{food.servingSize}{food.servingUnit || 'g'}</span>
            </>
          )}
          {showTime && food.timestamp && (
            <>
              <span>•</span>
              <span>{formatTime(food.timestamp)}</span>
            </>
          )}
        </div>
      </div>
      
      {onRemove && (
        <button
          onClick={() => onRemove(food.id)}
          className="ml-2 p-2 text-gray-400 hover:text-red-500 
                     opacity-0 group-hover:opacity-100 transition-opacity
                     active:scale-95"
          aria-label="Remove food"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
        </button>
      )}
    </div>
  )
}
