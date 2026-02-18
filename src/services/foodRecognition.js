// Food recognition service using TensorFlow.js MobileNet
// Runs entirely client-side - no API costs, works offline after model load

import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { RECOGNITION_CONFIG, FOOD_CLASS_MAPPINGS } from '../utils/constants'
import { searchCommonFoods } from './nutritionApi'

// Model singleton - loaded once and cached
let model = null
let modelLoading = false
let modelLoadPromise = null

/**
 * Load the MobileNet model
 * @returns {Promise<Object>} Loaded model
 */
export async function loadModel() {
  if (model) {
    return model
  }
  
  if (modelLoading && modelLoadPromise) {
    return modelLoadPromise
  }
  
  modelLoading = true
  modelLoadPromise = mobilenet.load({
    version: 2,
    alpha: 1.0
  })
  
  try {
    model = await modelLoadPromise
    console.log('MobileNet model loaded successfully')
    return model
  } catch (error) {
    console.error('Failed to load MobileNet model:', error)
    modelLoading = false
    modelLoadPromise = null
    throw error
  }
}

/**
 * Check if model is loaded
 * @returns {boolean}
 */
export function isModelLoaded() {
  return model !== null
}

/**
 * Recognize food from an image element
 * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageElement - Image to classify
 * @returns {Promise<Array>} Array of recognized food items with confidence scores
 */
export async function recognizeFood(imageElement) {
  try {
    const loadedModel = await loadModel()
    
    // Get predictions from MobileNet
    const predictions = await loadedModel.classify(imageElement, RECOGNITION_CONFIG.MAX_RESULTS)
    
    // Map predictions to food items
    const foodResults = predictions
      .filter(pred => pred.probability >= RECOGNITION_CONFIG.MIN_CONFIDENCE)
      .map(prediction => mapToFoodItem(prediction))
      .filter(item => item !== null)
    
    // If no direct mappings found, try fuzzy matching with common foods
    if (foodResults.length === 0 && predictions.length > 0) {
      const fuzzyResults = await fuzzyMatchFoods(predictions)
      foodResults.push(...fuzzyResults)
    }
    
    return foodResults
  } catch (error) {
    console.error('Food recognition error:', error)
    throw error
  }
}

/**
 * Map a MobileNet prediction to a food item
 * @param {Object} prediction - MobileNet prediction { className, probability }
 * @returns {Object|null} Food item or null if not a food
 */
function mapToFoodItem(prediction) {
  const className = prediction.className.toLowerCase()
  
  // Check if we have a direct mapping
  for (const [key, value] of Object.entries(FOOD_CLASS_MAPPINGS)) {
    if (className.includes(key.toLowerCase())) {
      return {
        id: `recognized-${key}`,
        name: value.name,
        protein: value.protein,
        servingSize: 100,
        servingUnit: 'g',
        source: 'recognition',
        confidence: Math.round(prediction.probability * 100),
        originalClass: prediction.className
      }
    }
  }
  
  return null
}

/**
 * Fuzzy match predictions to common foods database
 * @param {Array} predictions - MobileNet predictions
 * @returns {Promise<Array>} Matched food items
 */
async function fuzzyMatchFoods(predictions) {
  const results = []
  
  for (const prediction of predictions) {
    if (prediction.probability < RECOGNITION_CONFIG.MIN_CONFIDENCE) continue
    
    const className = prediction.className.toLowerCase()
    
    // Extract keywords from class name
    const keywords = className.split(/[,/]/).map(k => k.trim())
    
    // Search common foods for each keyword
    for (const keyword of keywords) {
      const commonFoods = searchCommonFoods(keyword)
      
      if (commonFoods.length > 0) {
        // Take the best match
        const bestMatch = commonFoods[0]
        results.push({
          ...bestMatch,
          source: 'recognition',
          confidence: Math.round(prediction.probability * 100),
          originalClass: prediction.className
        })
        break
      }
    }
  }
  
  return results.slice(0, RECOGNITION_CONFIG.MAX_RESULTS)
}

/**
 * Create an image element from a blob
 * @param {Blob} blob - Image blob
 * @returns {Promise<HTMLImageElement>}
 */
export function createImageFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

/**
 * Preprocess image for better recognition
 * @param {HTMLImageElement} image - Original image
 * @returns {HTMLCanvasElement} Preprocessed canvas
 */
export function preprocessImage(image) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // MobileNet expects 224x224 images
  const size = 224
  canvas.width = size
  canvas.height = size
  
  // Calculate crop dimensions (center crop)
  const scale = Math.max(size / image.width, size / image.height)
  const scaledWidth = image.width * scale
  const scaledHeight = image.height * scale
  const offsetX = (scaledWidth - size) / 2
  const offsetY = (scaledHeight - size) / 2
  
  // Draw centered and scaled
  ctx.drawImage(
    image,
    -offsetX,
    -offsetY,
    scaledWidth,
    scaledHeight
  )
  
  return canvas
}

/**
 * Get model loading progress (for UI feedback)
 * @returns {Object} { loaded: boolean, loading: boolean }
 */
export function getModelStatus() {
  return {
    loaded: model !== null,
    loading: modelLoading
  }
}