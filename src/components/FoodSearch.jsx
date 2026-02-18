// Food search component with API integration and camera recognition

import { useState, useEffect, useRef } from 'react'
import { searchAllFoods, searchCommonFoods } from '../services/nutritionApi'
import { formatProtein } from '../utils/formatters'
import { MEAL_TYPES } from '../utils/constants'
import { useFoodRecognition } from '../hooks/useFoodRecognition'
import FoodCamera from './FoodCamera'
import FoodRecognition from './FoodRecognition'

/**
 * Food search component with camera tab
 * @param {Object} props
 * @param {Function} props.onAdd - Callback when food is added
 * @param {Function} props.onClose - Callback to close search
 */
export default function FoodSearch({ onAdd, onClose }) {
  // Tab state
  const [activeTab, setActiveTab] = useState('search')
  
  // Search state
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [servingSize, setServingSize] = useState(100)
  const [selectedMeal, setSelectedMeal] = useState('breakfast')
  const inputRef = useRef(null)
  
  // Camera state
  const [cameraState, setCameraState] = useState('idle') // 'idle' | 'capturing' | 'recognizing'
  
  // Recognition hook
  const {
    loading: recognitionLoading,
    error: recognitionError,
    results: recognitionResults,
    capturedImage,
    recognizeFromBlob,
    reset: resetRecognition,
    preloadModel
  } = useFoodRecognition()

  // Focus input on mount and preload model
  useEffect(() => {
    inputRef.current?.focus()
    // Load initial common foods
    setResults(searchCommonFoods('').slice(0, 10))
    // Preload recognition model in background
    preloadModel()
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true)
        try {
          const foods = await searchAllFoods(query)
          setResults(foods)
        } catch (error) {
          console.error('Search error:', error)
        }
        setLoading(false)
      } else {
        setResults(searchCommonFoods('').slice(0, 10))
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Handle food selection
  const handleSelectFood = (food) => {
    setSelectedFood(food)
    setServingSize(food.servingSize || 100)
  }

  // Calculate protein for custom serving
  const calculateProtein = () => {
    if (!selectedFood) return 0
    const ratio = servingSize / (selectedFood.servingSize || 100)
    return Math.round(selectedFood.protein * ratio * 10) / 10
  }

  // Handle add food
  const handleAdd = () => {
    if (!selectedFood) return
    
    const foodToAdd = {
      name: selectedFood.name,
      protein: calculateProtein(),
      servingSize: servingSize,
      servingUnit: selectedFood.servingUnit || 'g',
      source: selectedFood.source,
    }
    
    onAdd(selectedMeal, foodToAdd)
    onClose()
  }

  // Handle camera capture
  const handleCameraCapture = async (blob, imageElement) => {
    setCameraState('recognizing')
    await recognizeFromBlob(blob)
    setCameraState('idle')
  }

  // Handle recognition result selection
  const handleSelectRecognizedFood = (food) => {
    setSelectedFood(food)
    setServingSize(food.servingSize || 100)
    resetRecognition()
  }

  // Handle retake photo
  const handleRetake = () => {
    resetRecognition()
    setCameraState('idle')
  }

  // Handle switch to manual search
  const handleManualSearch = () => {
    setActiveTab('search')
    resetRecognition()
    setCameraState('idle')
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col">
      {/* Camera mode - full screen camera with overlay controls */}
      {activeTab === 'camera' && !capturedImage && !recognitionLoading && recognitionResults.length === 0 && !recognitionError ? (
        <FoodCamera
          onCapture={handleCameraCapture}
          onClose={onClose}
        />
      ) : (
        <>
          {/* Header with tabs - only shown for search mode or recognition results */}
          <div className="bg-white flex-shrink-0">
            <div className="p-4 flex items-center gap-3">
              <button 
                onClick={onClose}
                className="p-2 -ml-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search foods..."
                className="flex-1 text-lg outline-none"
                disabled={activeTab !== 'search'}
              />
              {query && activeTab === 'search' && (
                <button 
                  onClick={() => setQuery('')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Tab navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'text-protein border-b-2 border-protein'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </div>
              </button>
              <button
                onClick={() => setActiveTab('camera')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'camera'
                    ? 'text-protein border-b-2 border-protein'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Camera
                </div>
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'search' ? (
              // Search tab content
              <div className="h-full bg-white overflow-y-auto">
                {selectedFood ? (
                  // Food details view
                  <div className="p-4">
                    <button 
                      onClick={() => setSelectedFood(null)}
                      className="flex items-center gap-2 text-gray-500 mb-4"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to results
                    </button>

                    <div className="card mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedFood.name}
                      </h3>
                      {selectedFood.brand && (
                        <p className="text-sm text-gray-500 mb-2">{selectedFood.brand}</p>
                      )}
                      {selectedFood.confidence && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-medium ${
                            selectedFood.confidence >= 70 ? 'text-green-600' :
                            selectedFood.confidence >= 40 ? 'text-yellow-600' :
                            'text-red-500'
                          }`}>
                            {selectedFood.confidence}% match
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-protein">
                          {formatProtein(selectedFood.protein)}
                        </span>
                        <span className="text-gray-500">per 100g</span>
                      </div>
                    </div>

                    {/* Serving size */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Serving Size
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={servingSize}
                          onChange={(e) => setServingSize(Math.max(1, Number(e.target.value)))}
                          className="input-field w-24 text-center"
                        />
                        <span className="text-gray-500">{selectedFood.servingUnit || 'g'}</span>
                      </div>
                    </div>

                    {/* Calculated protein */}
                    <div className="bg-green-50 rounded-xl p-4 mb-4">
                      <span className="text-sm text-gray-600">You'll get</span>
                      <div className="text-2xl font-bold text-protein">
                        {formatProtein(calculateProtein())} protein
                      </div>
                    </div>

                    {/* Meal selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add to meal
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(MEAL_TYPES).map(([key, meal]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedMeal(key)}
                            className={`p-3 rounded-xl text-left transition-colors ${
                              selectedMeal === key 
                                ? 'bg-protein text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span className="font-medium">{meal.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={handleAdd}
                      className="btn-primary w-full text-lg"
                    >
                      Add to {MEAL_TYPES[selectedMeal].label}
                    </button>
                  </div>
                ) : (
                  // Search results
                  <>
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-protein"></div>
                      </div>
                    ) : results.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {results.map((food) => (
                          <button
                            key={food.id}
                            onClick={() => handleSelectFood(food)}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-left">
                              <div className="font-medium text-gray-900">{food.name}</div>
                              {food.brand && (
                                <div className="text-sm text-gray-500">{food.brand}</div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-protein">
                                {formatProtein(food.protein)}
                              </div>
                              <div className="text-xs text-gray-400">per 100g</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p>No foods found</p>
                        <p className="text-sm mt-1">Try a different search term</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              // Camera tab content - recognition results view
              <div className="flex flex-col flex-1 min-h-0 bg-white">
                <FoodRecognition
                  capturedImage={capturedImage}
                  results={recognitionResults}
                  loading={recognitionLoading}
                  error={recognitionError}
                  onSelectFood={handleSelectRecognizedFood}
                  onRetake={handleRetake}
                  onManualSearch={handleManualSearch}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}