// Date and number formatting utilities

/**
 * Format a date to a readable string (e.g., "Today", "Yesterday", "Feb 18")
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Reset time for comparison
  const compareDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const compareToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const compareYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
  
  if (compareDate.getTime() === compareToday.getTime()) {
    return 'Today'
  } else if (compareDate.getTime() === compareYesterday.getTime()) {
    return 'Yesterday'
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

/**
 * Format date to ISO date string (YYYY-MM-DD)
 * @param {Date} date 
 * @returns {string}
 */
export function toISODateString(date) {
  return date.toISOString().split('T')[0]
}

/**
 * Format time to readable string (e.g., "2:30 PM")
 * @param {string} isoString 
 * @returns {string}
 */
export function formatTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

/**
 * Format protein amount with unit
 * @param {number} grams 
 * @returns {string}
 */
export function formatProtein(grams) {
  return `${Math.round(grams)}g`
}

/**
 * Format serving size
 * @param {number} amount 
 * @param {string} unit 
 * @returns {string}
 */
export function formatServing(amount, unit = 'g') {
  return `${amount}${unit}`
}

/**
 * Get relative time description
 * @param {string} isoString 
 * @returns {string}
 */
export function getRelativeTime(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return formatDate(date)
}