// Nutrition API service using Open Food Facts (free, open source, no API key required)

import { API_CONFIG } from '../utils/constants'

/**
 * Search for foods using Open Food Facts API
 * @param {string} query - Search query
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Results per page
 * @returns {Promise<Array>} Array of food items
 */
export async function searchFoods(query, page = 1, pageSize = 20) {
  try {
    const url = `${API_CONFIG.OPEN_FOOD_FACTS.baseUrl}${API_CONFIG.OPEN_FOOD_FACTS.searchEndpoint}?fields=code,product_name,brands,nutriments,image_front_small_url&serving_size_tags=en:${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ProteinTrackerApp/1.0',
      },
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Also try a text search for better results
    const textSearchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page=${page}&page_size=${pageSize}&fields=code,product_name,brands,nutriments,image_front_small_url`
    
    const textResponse = await fetch(textSearchUrl, {
      headers: {
        'User-Agent': 'ProteinTrackerApp/1.0',
      },
    })
    
    let textData = { products: [] }
    if (textResponse.ok) {
      textData = await textResponse.json()
    }
    
    // Combine and deduplicate results
    const allProducts = [...(data.products || []), ...(textData.products || [])]
    const seen = new Set()
    const uniqueProducts = allProducts.filter(product => {
      if (seen.has(product.code)) return false
      seen.add(product.code)
      return true
    })
    
    return uniqueProducts.map(product => transformProduct(product)).filter(item => item.protein > 0)
  } catch (error) {
    console.error('Error searching foods:', error)
    return []
  }
}

/**
 * Transform Open Food Facts product to our food item format
 * @param {Object} product - Raw product from API
 * @returns {Object} Transformed food item
 */
function transformProduct(product) {
  const nutriments = product.nutriments || {}
  
  // Get protein per 100g
  const proteinPer100g = nutriments.proteins_100g || nutriments.proteins || 0
  
  // Get serving size info if available
  const servingSize = nutriments.serving_size || 100
  const proteinPerServing = nutriments.proteins_serving || (proteinPer100g * servingSize / 100)
  
  return {
    id: product.code,
    name: product.product_name || 'Unknown Product',
    brand: product.brands || '',
    protein: Math.round(proteinPer100g * 10) / 10, // protein per 100g
    proteinPerServing: Math.round(proteinPerServing * 10) / 10,
    servingSize: servingSize,
    servingUnit: 'g',
    source: 'openfoodfacts',
    image: product.image_front_small_url || null,
  }
}

/**
 * Get food details by barcode
 * @param {string} barcode 
 * @returns {Promise<Object|null>}
 */
export async function getFoodByBarcode(barcode) {
  try {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ProteinTrackerApp/1.0',
      },
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status === 1 && data.product) {
      return transformProduct(data.product)
    }
    
    return null
  } catch (error) {
    console.error('Error fetching food by barcode:', error)
    return null
  }
}

/**
 * Common foods database for offline fallback
 * These are typical high-protein foods with approximate values
 */
export const COMMON_FOODS = [
  { name: 'Chicken Breast (cooked)', protein: 31, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Turkey Breast (cooked)', protein: 30, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Lean Beef (cooked)', protein: 26, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Salmon (cooked)', protein: 25, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Tuna (canned)', protein: 26, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Egg (whole)', protein: 6, servingSize: 1, servingUnit: 'egg', source: 'common' },
  { name: 'Egg White', protein: 3.6, servingSize: 1, servingUnit: 'egg', source: 'common' },
  { name: 'Greek Yogurt', protein: 10, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Cottage Cheese', protein: 11, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Milk (whole)', protein: 3.2, servingSize: 100, servingUnit: 'ml', source: 'common' },
  { name: 'Whey Protein Powder', protein: 25, servingSize: 30, servingUnit: 'g', source: 'common' },
  { name: 'Tofu (firm)', protein: 8, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Lentils (cooked)', protein: 9, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Black Beans (cooked)', protein: 8.9, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Chickpeas (cooked)', protein: 8.9, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Quinoa (cooked)', protein: 4.4, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Almonds', protein: 21, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Peanut Butter', protein: 25, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Cottage Cheese', protein: 11, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Shrimp (cooked)', protein: 24, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Tilapia (cooked)', protein: 26, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Ground Turkey (cooked)', protein: 27, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Ground Beef 90% (cooked)', protein: 26, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Protein Bar', protein: 20, servingSize: 1, servingUnit: 'bar', source: 'common' },
  { name: 'Edamame (cooked)', protein: 11, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Tempeh', protein: 19, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Seitan', protein: 25, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Pumpkin Seeds', protein: 19, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Chia Seeds', protein: 17, servingSize: 100, servingUnit: 'g', source: 'common' },
  { name: 'Hemp Seeds', protein: 31, servingSize: 100, servingUnit: 'g', source: 'common' },
]

/**
 * Search common foods (local, instant results)
 * @param {string} query 
 * @returns {Array}
 */
export function searchCommonFoods(query) {
  const lowerQuery = query.toLowerCase()
  return COMMON_FOODS.filter(food => 
    food.name.toLowerCase().includes(lowerQuery)
  ).map((food, index) => ({
    ...food,
    id: `common-${index}`,
  }))
}

/**
 * Combined search - common foods first, then API results
 * @param {string} query 
 * @returns {Promise<Array>}
 */
export async function searchAllFoods(query) {
  // Get instant results from common foods
  const commonResults = searchCommonFoods(query)
  
  // Try to get API results
  let apiResults = []
  try {
    apiResults = await searchFoods(query)
  } catch (error) {
    console.warn('API search failed, using common foods only:', error)
  }
  
  // Combine, prioritizing common foods
  const combined = [...commonResults]
  
  // Add API results that don't duplicate common foods
  apiResults.forEach(apiFood => {
    const isDuplicate = commonResults.some(
      common => common.name.toLowerCase() === apiFood.name.toLowerCase()
    )
    if (!isDuplicate) {
      combined.push(apiFood)
    }
  })
  
  return combined
}