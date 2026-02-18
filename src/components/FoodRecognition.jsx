// Food recognition results display component

import { formatProtein } from '../utils/formatters'

/**
 * FoodRecognition component - displays recognition results
 * @param {Object} props
 * @param {string} props.capturedImage - Data URL of captured image
 * @param {Array} props.results - Recognition results
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onSelectFood - Callback when user selects a food
 * @param {Function} props.onRetake - Callback to retake photo
 * @param {Function} props.onManualSearch - Callback to switch to manual search
 */
export default function FoodRecognition({
  capturedImage,
  results,
  loading,
  error,
  onSelectFood,
  onRetake,
  onManualSearch
}) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Captured image preview */}
      <div className="relative">
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured food"
            className="w-full h-48 object-cover"
          />
        )}
        
        {/* Retake button */}
        <button
          onClick={onRetake}
          className="absolute top-2 left-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-protein mb-4"></div>
            <p className="text-gray-600">Analyzing your food...</p>
            <p className="text-sm text-gray-400 mt-1">This may take a moment on first use</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-gray-700 mb-2">{error}</p>
            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={onRetake}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Retake Photo
              </button>
              <button
                onClick={onManualSearch}
                className="px-4 py-2 bg-protein text-white rounded-lg font-medium hover:bg-protein-dark transition-colors"
              >
                Search Manually
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What did we find?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Select the correct food or search manually
            </p>

            <div className="space-y-3">
              {results.map((food, index) => (
                <button
                  key={food.id || index}
                  onClick={() => onSelectFood(food)}
                  className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-protein transition-colors">
                        {food.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatProtein(food.protein)} protein per 100g
                      </div>
                    </div>
                    
                    {/* Confidence indicator */}
                    <div className="flex flex-col items-end">
                      <div className={`text-sm font-medium ${
                        food.confidence >= 70 ? 'text-green-600' :
                        food.confidence >= 40 ? 'text-yellow-600' :
                        'text-red-500'
                      }`}>
                        {food.confidence}% match
                      </div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            food.confidence >= 70 ? 'bg-green-500' :
                            food.confidence >= 40 ? 'bg-yellow-500' :
                            'bg-red-400'
                          }`}
                          style={{ width: `${food.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Manual search fallback */}
            <button
              onClick={onManualSearch}
              className="w-full mt-4 p-3 text-center text-protein font-medium hover:underline"
            >
              Not in the list? Search manually
            </button>
          </div>
        )}

        {/* No results but no error */}
        {!loading && !error && results.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 mb-4">No foods recognized</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={onRetake}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Retake Photo
              </button>
              <button
                onClick={onManualSearch}
                className="px-4 py-2 bg-protein text-white rounded-lg font-medium hover:bg-protein-dark transition-colors"
              >
                Search Manually
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}