/**
 * Estimate ETA based on distance and average speed
 * @param {number} distanceKm - distance in km
 * @param {number} avgSpeedKmh - average speed (default 25 km/h for city bike delivery)
 * @returns {number} estimated minutes
 */
export function estimateETA(distanceKm, avgSpeedKmh = 25) {
    const hours = distanceKm / avgSpeedKmh
    return Math.max(1, Math.round(hours * 60))
}

/**
 * Format minutes into human-readable string
 * @param {number} minutes
 * @returns {string} e.g., "15 mins", "1 hr 5 mins"
 */
export function formatETA(minutes) {
    if (minutes < 1) return '< 1 min'
    if (minutes < 60) return `${Math.round(minutes)} mins`

    const hrs = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)

    if (mins === 0) return `${hrs} hr`
    return `${hrs} hr ${mins} mins`
}

/**
 * Format a Firestore timestamp for display
 * @param {Object} timestamp - Firestore Timestamp or Date
 * @returns {string} e.g., "2:30 PM"
 */
export function formatTime(timestamp) {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

/**
 * Format a Firestore timestamp as date string
 */
export function formatDate(timestamp) {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
