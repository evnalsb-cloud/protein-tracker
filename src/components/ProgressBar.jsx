// Progress bar component for protein tracking

import { formatProtein } from '../utils/formatters'

/**
 * Circular progress bar for protein tracking
 * @param {Object} props
 * @param {number} props.current - Current protein amount
 * @param {number} props.goal - Protein goal
 * @param {number} props.percentage - Progress percentage (0-100)
 */
export default function ProgressBar({ current, goal, percentage }) {
  // SVG circle calculations
  const size = 200
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference
  
  // Determine color based on progress
  const getColor = () => {
    if (percentage >= 100) return '#059669' // protein-dark
    if (percentage >= 75) return '#10b981' // protein-light
    if (percentage >= 50) return '#22c55e' // green-500
    return '#86efac' // green-300
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">
            {formatProtein(current)}
          </span>
          <span className="text-sm text-gray-500">
            of {formatProtein(goal)} goal
          </span>
        </div>
      </div>
      
      {/* Percentage indicator */}
      <div className="mt-4 text-center">
        <span className="text-2xl font-semibold text-protein">
          {Math.round(percentage)}%
        </span>
        <span className="block text-sm text-gray-500">
          daily goal reached
        </span>
      </div>
    </div>
  )
}
