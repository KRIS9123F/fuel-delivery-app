/**
 * OSRM Routing Service — free road-following routes (replaces Google Directions API)
 *
 * Uses the public OSRM demo server. For production, host your own OSRM instance.
 * API docs: http://project-osrm.org/docs/v5.24.0/api/
 */

const OSRM_BASE = 'https://router.project-osrm.org'

/**
 * Fetch a driving route between two points
 *
 * @param {{ lat: number, lng: number }} origin
 * @param {{ lat: number, lng: number }} destination
 * @returns {Promise<{ points: Array, distance: number, duration: number }>}
 *   - points: Array of {lat, lng} along the road
 *   - distance: total distance in meters
 *   - duration: total duration in seconds
 */
export async function fetchRoute(origin, destination) {
    try {
        // OSRM uses lng,lat order (not lat,lng!)
        const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`
        const url = `${OSRM_BASE}/route/v1/driving/${coords}?overview=full&geometries=polyline&steps=true`

        const response = await fetch(url)
        if (!response.ok) throw new Error(`OSRM error: ${response.status}`)

        const data = await response.json()

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('No route found')
        }

        const route = data.routes[0]

        // Decode the polyline into lat/lng points
        const allPoints = decodePolyline(route.geometry)

        // Sample points for smooth animation (~60 points)
        const points = samplePoints(allPoints, 60)

        return {
            points,
            distance: Math.round(route.distance), // meters
            duration: Math.round(route.duration), // seconds
            distanceText: formatDistance(route.distance),
            durationText: formatDuration(route.duration),
        }
    } catch (error) {
        console.error('OSRM route fetch failed:', error)

        // Fallback: generate straight-line points
        return generateStraightLineFallback(origin, destination)
    }
}

/**
 * Decode Google-style encoded polyline (used by OSRM)
 * Algorithm: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
function decodePolyline(encoded) {
    const points = []
    let index = 0
    let lat = 0
    let lng = 0

    while (index < encoded.length) {
        let b, shift, result

        // Decode latitude
        shift = 0
        result = 0
        do {
            b = encoded.charCodeAt(index++) - 63
            result |= (b & 0x1f) << shift
            shift += 5
        } while (b >= 0x20)
        lat += result & 1 ? ~(result >> 1) : result >> 1

        // Decode longitude
        shift = 0
        result = 0
        do {
            b = encoded.charCodeAt(index++) - 63
            result |= (b & 0x1f) << shift
            shift += 5
        } while (b >= 0x20)
        lng += result & 1 ? ~(result >> 1) : result >> 1

        points.push({
            lat: lat / 1e5,
            lng: lng / 1e5,
        })
    }

    return points
}

/**
 * Sample N evenly-spaced points from an array (always includes first and last)
 */
function samplePoints(points, targetCount) {
    if (points.length <= targetCount) return points

    const sampled = [points[0]]
    const step = (points.length - 1) / (targetCount - 1)

    for (let i = 1; i < targetCount - 1; i++) {
        const idx = Math.round(i * step)
        sampled.push(points[idx])
    }

    sampled.push(points[points.length - 1])
    return sampled
}

/**
 * Fallback: straight line with interpolated points
 */
function generateStraightLineFallback(origin, destination) {
    const steps = 40
    const points = []

    for (let i = 0; i <= steps; i++) {
        const t = i / steps
        points.push({
            lat: origin.lat + (destination.lat - origin.lat) * t,
            lng: origin.lng + (destination.lng - origin.lng) * t,
        })
    }

    // Estimate distance using haversine
    const R = 6371000
    const dLat = (destination.lat - origin.lat) * Math.PI / 180
    const dLng = (destination.lng - origin.lng) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    // Estimate ~30 km/h average city speed
    const duration = (distance / 1000) / 30 * 3600

    return {
        points,
        distance: Math.round(distance),
        duration: Math.round(duration),
        distanceText: formatDistance(distance),
        durationText: formatDuration(duration),
    }
}

function formatDistance(meters) {
    if (meters < 1000) return `${Math.round(meters)} m`
    return `${(meters / 1000).toFixed(1)} km`
}

function formatDuration(seconds) {
    const mins = Math.ceil(seconds / 60)
    if (mins < 60) return `${mins} min`
    const hrs = Math.floor(mins / 60)
    const remainMins = mins % 60
    return `${hrs}h ${remainMins}m`
}
