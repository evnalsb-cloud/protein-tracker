// App constants

export const MEAL_TYPES = {
  breakfast: { label: 'Breakfast', icon: ' sunrise', color: 'bg-orange-100 text-orange-600' },
  lunch: { label: 'Lunch', icon: ' sun', color: 'bg-yellow-100 text-yellow-600' },
  dinner: { label: 'Dinner', icon: ' moon', color: 'bg-purple-100 text-purple-600' },
  snack: { label: 'Snack', icon: ' cookie', color: 'bg-pink-100 text-pink-600' },
}

export const DEFAULT_PROTEIN_GOAL = 150 // grams

export const STORAGE_KEYS = {
  DAILY_LOGS: 'proteinTracker_dailyLogs',
  GOAL: 'proteinTracker_goal',
  RECENT_FOODS: 'proteinTracker_recentFoods',
}

export const API_CONFIG = {
  OPEN_FOOD_FACTS: {
    baseUrl: 'https://world.openfoodfacts.org/api/v2',
    searchEndpoint: '/search',
  },
  USDA: {
    baseUrl: 'https://api.nal.usda.gov/fdc/v1',
    // Note: For production, user would need their own API key
    // For demo purposes, we'll use Open Food Facts which doesn't require an API key
    apiKey: 'DEMO_KEY', 
  }
}

// Food recognition configuration
export const RECOGNITION_CONFIG = {
  MIN_CONFIDENCE: 0.3,      // Minimum confidence to show result
  MAX_RESULTS: 3,           // Maximum predictions to display
  MODEL_LOAD_TIMEOUT: 10000 // 10 second timeout
}

// Food name mappings for MobileNet classes to common food names
// MobileNet has 1000 classes, these are the food-related ones
export const FOOD_CLASS_MAPPINGS = {
  // Proteins
  'banana': { name: 'Banana', protein: 1.1 },
  'pizza': { name: 'Pizza', protein: 12 },
  'hamburger': { name: 'Hamburger', protein: 17 },
  'hotdog': { name: 'Hot Dog', protein: 10 },
  'burrito': { name: 'Burrito', protein: 15 },
  'cheeseburger': { name: 'Cheeseburger', protein: 18 },
  'meat loaf': { name: 'Meatloaf', protein: 22 },
  'French loaf': { name: 'Bread', protein: 9 },
  'bagel': { name: 'Bagel', protein: 10 },
  'pretzel': { name: 'Pretzel', protein: 8 },
  'carbonara': { name: 'Carbonara', protein: 14 },
  'chicken': { name: 'Chicken', protein: 27 },
  'eggnog': { name: 'Eggnog', protein: 5 },
  'ice cream': { name: 'Ice Cream', protein: 3 },
  'cheese': { name: 'Cheese', protein: 25 },
  'eggs': { name: 'Eggs', protein: 13 },
  'breakfast': { name: 'Breakfast Plate', protein: 20 },
  'guacamole': { name: 'Guacamole', protein: 2 },
  'mixed vegetables': { name: 'Mixed Vegetables', protein: 3 },
  'salad': { name: 'Salad', protein: 2 },
  'steak': { name: 'Steak', protein: 26 },
  'fish': { name: 'Fish', protein: 22 },
  'salmon': { name: 'Salmon', protein: 25 },
  'shrimp': { name: 'Shrimp', protein: 24 },
  'lobster': { name: 'Lobster', protein: 24 },
  'crab': { name: 'Crab', protein: 19 },
  'sushi': { name: 'Sushi', protein: 7 },
  'taco': { name: 'Taco', protein: 12 },
  'sandwich': { name: 'Sandwich', protein: 15 },
  'pancake': { name: 'Pancakes', protein: 6 },
  'waffle': { name: 'Waffle', protein: 7 },
  'omelette': { name: 'Omelette', protein: 14 },
  'scrambled eggs': { name: 'Scrambled Eggs', protein: 13 },
  'bacon': { name: 'Bacon', protein: 37 },
  'sausage': { name: 'Sausage', protein: 18 },
  'yogurt': { name: 'Yogurt', protein: 10 },
  'cottage cheese': { name: 'Cottage Cheese', protein: 11 },
  'peanut butter': { name: 'Peanut Butter', protein: 25 },
  'almond': { name: 'Almonds', protein: 21 },
  'peanut': { name: 'Peanuts', protein: 26 },
  'walnut': { name: 'Walnuts', protein: 15 },
  'cashew': { name: 'Cashews', protein: 18 },
  'pumpkin seed': { name: 'Pumpkin Seeds', protein: 19 },
  'sunflower seed': { name: 'Sunflower Seeds', protein: 21 },
  'tofu': { name: 'Tofu', protein: 8 },
  'tempeh': { name: 'Tempeh', protein: 19 },
  'lentil': { name: 'Lentils', protein: 9 },
  'bean': { name: 'Beans', protein: 9 },
  'chickpea': { name: 'Chickpeas', protein: 9 },
  'quinoa': { name: 'Quinoa', protein: 4.4 },
  'rice': { name: 'Rice', protein: 2.7 },
  'pasta': { name: 'Pasta', protein: 5 },
  'noodle': { name: 'Noodles', protein: 5 },
  'soup': { name: 'Soup', protein: 6 },
  'stew': { name: 'Stew', protein: 15 },
  'curry': { name: 'Curry', protein: 12 },
  'dumpling': { name: 'Dumplings', protein: 8 },
  'spring roll': { name: 'Spring Roll', protein: 5 },
  'kebab': { name: 'Kebab', protein: 20 },
  'meatball': { name: 'Meatballs', protein: 18 },
  'pot roast': { name: 'Pot Roast', protein: 25 },
  'ribs': { name: 'Ribs', protein: 23 },
  'pork chop': { name: 'Pork Chop', protein: 25 },
  'lamb': { name: 'Lamb', protein: 25 },
  'venison': { name: 'Venison', protein: 26 },
  'turkey': { name: 'Turkey', protein: 29 },
  'duck': { name: 'Duck', protein: 19 },
  'goose': { name: 'Goose', protein: 25 },
}