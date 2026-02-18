// Custom hook for managing food recognition state

import { useState, useCallback } from 'react'
import { 
  recognizeFood as recognizeFoodService, 
  loadModel,
  getModelStatus,
  createImageFromBlob 
} from '../services/foodRecognition'

/**
 * Custom hook for food recognition functionality
 * @returns {Object} Recognition state and actions
 */
export function useFoodRecognition() {
  const [loading, setLoading] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [capturedImage, setCapturedImage] = useState(null)

  /**
   * Preload the model (call this when component mounts)
   */
  const preloadModel = useCallback(async () => {
    const status = getModelStatus()
    if (status.loaded || status.loading) return
    
    setModelLoading(true)
    try {
      await loadModel()
    } catch (err) {
      console.error('Model preload error:', err)
    }
    setModelLoading(false)
  }, [])

  /**
   * Recognize food from an image element
   * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageElement - Image to classify
   */
  const recognize = useCallback(async (imageElement) => {
    setLoading(true)
    setError(null)
    setResults([])
    
    try {
      const foods = await recognizeFoodService(imageElement)
      setResults(foods)
      
      if (foods.length === 0) {
        setError('No foods recognized. Try a different angle or use manual search.')
      }
    } catch (err) {
      console.error('Recognition error:', err)
      setError(err.message || 'Failed to recognize food')
    }
    
    setLoading(false)
  }, [])

  /**
   * Recognize food from a blob
   * @param {Blob} blob - Image blob
   */
  const recognizeFromBlob = useCallback(async (blob) => {
    setLoading(true)
    setError(null)
    setResults([])
    
    try {
      const imageElement = await createImageFromBlob(blob)
      setCapturedImage(imageElement.src)
      await recognize(imageElement)
    } catch (err) {
      console.error('Recognition from blob error:', err)
      setError(err.message || 'Failed to process image')
    }
  }, [recognize])

  /**
   * Reset recognition state
   */
  const reset = useCallback(() => {
    setResults([])
    setError(null)
    setCapturedImage(null)
  }, [])

  /**
   * Clear error only
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    modelLoading,
    error,
    results,
    capturedImage,
    preloadModel,
    recognize,
    recognizeFromBlob,
    reset,
    clearError,
    hasResults: results.length > 0
  }
}