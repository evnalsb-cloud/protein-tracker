// Goal setter component for setting daily protein goal

import { useState } from 'react'

/**
 * Goal setter component
 * @param {Object} props
 * @param {number} props.currentGoal - Current protein goal
 * @param {Function} props.onSetGoal - Callback to set new goal
 * @param {Function} props.onClose - Callback to close
 */
export default function GoalSetter({ currentGoal, onSetGoal, onClose }) {
  const [goal, setGoal] = useState(currentGoal)

  const handleSave = () => {
    const newGoal = Math.max(1, Math.min(500, goal)) // Clamp between 1-500g
    onSetGoal(newGoal)
    onClose()
  }

  const quickGoals = [100, 120, 150, 180, 200]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Daily Protein Goal
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current goal display */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-protein mb-2">
            {goal}g
          </div>
          <p className="text-gray-500">protein per day</p>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <input
            type="range"
            min="50"
            max="300"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-protein"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>50g</span>
            <span>300g</span>
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Quick select</p>
          <div className="flex gap-2">
            {quickGoals.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  goal === g
                    ? 'bg-protein text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {g}g
              </button>
            ))}
          </div>
        </div>

        {/* Custom input */}
        <div className="mb-6">
          <label className="text-sm text-gray-500 block mb-2">
            Or enter custom amount
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="input-field text-center text-lg"
              min="1"
              max="500"
            />
            <span className="text-gray-500">grams</span>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="btn-primary w-full"
        >
          Save Goal
        </button>
      </div>
    </div>
  )
}