/**
 * Fetch real nearby petrol pumps using OpenStreetMap Overpass API (100% free)
 *
 * @param {number} lat - User latitude
 * @param {number} lng - User longitude
 * @param {number} radiusMeters - Search radius (default 5000m = 5km)
 * @returns {Promise<Array>} Array of fuel stations sorted by distance
 */
export async function fetchNearbyPumps(lat, lng, radiusMeters = 5000) {
    // Overpass QL query: find all fuel stations within radius
    const query = `
        [out:json][timeout:10];
        (
            node["amenity"="fuel"](around:${radiusMeters},${lat},${lng});
            way["amenity"="fuel"](around:${radiusMeters},${lat},${lng});
        );
        out center body;
    `

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(query)}`,
        })

        if (!response.ok) throw new Error(`Overpass API error: ${response.status}`)

        const data = await response.json()

        // Parse OSM elements into our station format
        const stations = data.elements
            .map((el) => {
                // For 'way' elements, use the center point
                const elLat = el.lat || el.center?.lat
                const elLng = el.lon || el.center?.lon
                if (!elLat || !elLng) return null

                const tags = el.tags || {}
                const name = tags.name || tags.brand || 'Fuel Station'
                const brand = tags.brand || tags.operator || ''

                // Calculate distance from user
                const dist = haversineDistance(lat, lng, elLat, elLng)

                return {
                    id: `OSM-${el.id}`,
                    name: brand ? `${brand} - ${name}` : name,
                    brandName: brand || name,
                    location: { lat: elLat, lng: elLng },
                    address: buildAddress(tags),
                    city: tags['addr:city'] || 'Hyderabad',
                    state: tags['addr:state'] || 'Telangana',
                    distance: dist, // in km
                    distanceText: dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)} km`,
                    isReal: true, // Flag to distinguish from mock data
                    fuelTypes: {
                        petrol: { available: true, pricePerLiter: 109.50, stock: 5000 },
                        diesel: { available: true, pricePerLiter: 97.80, stock: 5000 },
                        cng: { available: tags.fuel?.includes('cng') || false, pricePerLiter: 78.00, stock: 2000 },
                    },
                    isOnline: true,
                    rating: 4.0 + Math.random() * 0.9, // Simulated for demo
                    totalDeliveries: Math.floor(100 + Math.random() * 400),
                    operatingHours: { open: '06:00', close: '22:00' },
                    deliveryRadius: 10,
                    deliveryCharge: 100,
                }
            })
            .filter(Boolean)
            .sort((a, b) => a.distance - b.distance)

        return stations
    } catch (error) {
        console.error('Overpass API failed:', error)
        return [] // Caller will fallback to mock data
    }
}

/**
 * Haversine formula — distance between two lat/lng points in km
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth radius in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 100) / 100 // Round to 2 decimals
}

function toRad(deg) {
    return deg * (Math.PI / 180)
}

/**
 * Build a human-readable address from OSM tags
 */
function buildAddress(tags) {
    const parts = []
    if (tags['addr:street']) parts.push(tags['addr:street'])
    if (tags['addr:housenumber']) parts.unshift(tags['addr:housenumber'])
    if (tags['addr:suburb'] || tags['addr:neighbourhood']) {
        parts.push(tags['addr:suburb'] || tags['addr:neighbourhood'])
    }
    if (tags['addr:city']) parts.push(tags['addr:city'])

    if (parts.length > 0) return parts.join(', ')

    // Fallback: use name or generic
    return tags.name ? `Near ${tags.name}` : 'Hyderabad'
}
