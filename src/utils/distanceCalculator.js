/**
 * Haversine formula — distance between two lat/lng points in km
 */
export function calculateHaversineDistance(loc1, loc2) {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(loc2.lat - loc1.lat)
    const dLng = toRad(loc2.lng - loc1.lng)
    const lat1 = toRad(loc1.lat)
    const lat2 = toRad(loc2.lat)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // km
}

function toRad(degrees) {
    return degrees * (Math.PI / 180)
}

/**
 * Find the nearest station from a list to a user's location
 * @param {Object} userLoc - { lat, lng }
 * @param {Array} stations - array of station objects with .location
 * @returns {Array} stations sorted by distance, with .distance appended
 */
export function findNearestStations(userLoc, stations) {
    return stations
        .map((station) => ({
            ...station,
            distance: calculateHaversineDistance(userLoc, station.location),
        }))
        .sort((a, b) => a.distance - b.distance)
}

/**
 * Check if a user location is within a station's delivery radius
 */
export function isWithinDeliveryRadius(station, userLoc) {
    const distance = calculateHaversineDistance(station.location, userLoc)
    return distance <= (station.deliveryRadius || 10)
}

/**
 * Format distance for display
 */
export function formatDistance(km) {
    if (km < 1) return `${Math.round(km * 1000)} m`
    return `${km.toFixed(1)} km`
}
