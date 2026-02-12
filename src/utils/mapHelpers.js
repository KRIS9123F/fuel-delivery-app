/** Default center (Secunderabad, Hyderabad) */
export const BANGALORE_CENTER = { lat: 17.4399, lng: 78.4983 }

/** Default map zoom level */
export const DEFAULT_ZOOM = 14

/**
 * Fit map bounds to show all given locations
 * @param {google.maps.Map} map - Google Maps instance
 * @param {Array} locations - array of { lat, lng }
 */
export function fitBoundsToMarkers(map, locations) {
    if (!map || !locations || locations.length === 0) return

    const bounds = new window.google.maps.LatLngBounds()
    locations.forEach(({ lat, lng }) => bounds.extend({ lat, lng }))
    map.fitBounds(bounds, { padding: 60 })
}

/**
 * Linear interpolation between two positions (for smooth marker animation)
 * @param {Object} from - { lat, lng }
 * @param {Object} to - { lat, lng }
 * @param {number} progress - 0 to 1
 * @returns {Object} { lat, lng }
 */
export function interpolatePosition(from, to, progress) {
    return {
        lat: from.lat + (to.lat - from.lat) * progress,
        lng: from.lng + (to.lng - from.lng) * progress,
    }
}

/**
 * Animate a position change smoothly over duration ms
 * @param {Object} from - { lat, lng }
 * @param {Object} to - { lat, lng }
 * @param {number} duration - ms (default 1000)
 * @param {Function} onUpdate - called with interpolated { lat, lng }
 */
export function animatePosition(from, to, duration = 1000, onUpdate) {
    const startTime = Date.now()

    const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const pos = interpolatePosition(from, to, progress)
        onUpdate(pos)

        if (progress < 1) {
            requestAnimationFrame(animate)
        }
    }

    requestAnimationFrame(animate)
}

/**
 * Calculate bearing between two points (for marker rotation)
 */
export function calculateBearing(from, to) {
    const lat1 = (from.lat * Math.PI) / 180
    const lat2 = (to.lat * Math.PI) / 180
    const dLng = ((to.lng - from.lng) * Math.PI) / 180

    const y = Math.sin(dLng) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}
