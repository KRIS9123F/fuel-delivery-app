/**
 * Local Hyderabad locations database — replaces Google Places API
 * Used for address autocomplete without requiring Google billing
 */
export const hyderabadLocations = [
    // Major residential areas
    { name: 'Banjara Hills', area: 'Road No. 12', full: 'Road No. 12, Banjara Hills, Hyderabad 500034', lat: 17.4156, lng: 78.4347 },
    { name: 'Banjara Hills', area: 'Road No. 1', full: 'Road No. 1, Banjara Hills, Hyderabad 500034', lat: 17.4200, lng: 78.4400 },
    { name: 'Jubilee Hills', area: 'Road No. 36', full: 'Road No. 36, Jubilee Hills, Hyderabad 500033', lat: 17.4320, lng: 78.4070 },
    { name: 'Jubilee Hills', area: 'Checkpost', full: 'Jubilee Hills Checkpost, Hyderabad 500033', lat: 17.4280, lng: 78.4150 },
    { name: 'Madhapur', area: 'Ayyappa Society', full: 'Ayyappa Society, Madhapur, Hyderabad 500081', lat: 17.4486, lng: 78.3908 },
    { name: 'Madhapur', area: 'Kavuri Hills', full: 'Kavuri Hills, Madhapur, Hyderabad 500081', lat: 17.4450, lng: 78.3950 },
    { name: 'Gachibowli', area: 'Financial District', full: 'Financial District, Gachibowli, Hyderabad 500032', lat: 17.4401, lng: 78.3489 },
    { name: 'Gachibowli', area: 'DLF Cyber City', full: 'DLF Cyber City, Gachibowli, Hyderabad 500032', lat: 17.4350, lng: 78.3520 },
    { name: 'Hitech City', area: 'Cyber Towers', full: 'Cyber Towers, Hitech City, Hyderabad 500081', lat: 17.4435, lng: 78.3772 },
    { name: 'Hitech City', area: 'Mindspace', full: 'Mindspace IT Park, Hitech City, Hyderabad 500081', lat: 17.4470, lng: 78.3800 },
    { name: 'Kondapur', area: 'Main Road', full: 'Kondapur Main Road, Hyderabad 500084', lat: 17.4589, lng: 78.3634 },
    { name: 'Kondapur', area: 'Botanical Garden', full: 'Near Botanical Garden, Kondapur, Hyderabad 500084', lat: 17.4620, lng: 78.3680 },
    { name: 'Kukatpally', area: 'KPHB Colony', full: 'KPHB Colony, Kukatpally, Hyderabad 500085', lat: 17.4947, lng: 78.3996 },
    { name: 'Kukatpally', area: 'Balanagar', full: 'Balanagar, Kukatpally, Hyderabad 500037', lat: 17.4870, lng: 78.4100 },
    { name: 'Ameerpet', area: 'Metro Station', full: 'Ameerpet Metro Station, Hyderabad 500016', lat: 17.4375, lng: 78.4483 },
    { name: 'Ameerpet', area: 'SR Nagar', full: 'SR Nagar, Ameerpet, Hyderabad 500038', lat: 17.4400, lng: 78.4520 },
    { name: 'Secunderabad', area: 'MG Road', full: 'MG Road, Secunderabad, Hyderabad 500003', lat: 17.4399, lng: 78.4983 },
    { name: 'Secunderabad', area: 'Paradise Circle', full: 'Paradise Circle, Secunderabad, Hyderabad 500003', lat: 17.4440, lng: 78.4870 },
    { name: 'Dilsukhnagar', area: 'Main Road', full: 'Dilsukhnagar Main Road, Hyderabad 500060', lat: 17.3688, lng: 78.5247 },
    { name: 'LB Nagar', area: 'Ring Road', full: 'LB Nagar Ring Road, Hyderabad 500074', lat: 17.3457, lng: 78.5522 },
    { name: 'Begumpet', area: 'Greenlands', full: 'Greenlands, Begumpet, Hyderabad 500016', lat: 17.4440, lng: 78.4740 },
    { name: 'Somajiguda', area: 'Raj Bhavan Road', full: 'Raj Bhavan Road, Somajiguda, Hyderabad 500082', lat: 17.4300, lng: 78.4600 },
    { name: 'Tolichowki', area: 'ISB Road', full: 'ISB Road, Tolichowki, Hyderabad 500008', lat: 17.4100, lng: 78.4100 },
    { name: 'Miyapur', area: 'Allwyn Colony', full: 'Allwyn Colony, Miyapur, Hyderabad 500049', lat: 17.4960, lng: 78.3530 },
    { name: 'Manikonda', area: 'Narsingi', full: 'Narsingi, Manikonda, Hyderabad 500075', lat: 17.4040, lng: 78.3800 },
    { name: 'Uppal', area: 'Ring Road', full: 'Uppal Ring Road, Hyderabad 500039', lat: 17.3960, lng: 78.5590 },
    { name: 'Tarnaka', area: 'Osmania University', full: 'Near Osmania University, Tarnaka, Hyderabad 500007', lat: 17.4120, lng: 78.5310 },
    { name: 'Habsiguda', area: 'ECIL Road', full: 'ECIL Road, Habsiguda, Hyderabad 500007', lat: 17.4050, lng: 78.5450 },
    { name: 'Mehdipatnam', area: 'Pillar No. 1', full: 'Pillar No. 1, Mehdipatnam, Hyderabad 500028', lat: 17.3940, lng: 78.4400 },
    { name: 'Abids', area: 'GPO', full: 'GPO, Abids, Hyderabad 500001', lat: 17.3930, lng: 78.4740 },
    { name: 'Charminar', area: 'Old City', full: 'Charminar, Old City, Hyderabad 500002', lat: 17.3616, lng: 78.4747 },
    { name: 'Nampally', area: 'Railway Station', full: 'Nampally Railway Station, Hyderabad 500001', lat: 17.3888, lng: 78.4676 },
    { name: 'Shamshabad', area: 'Airport', full: 'Rajiv Gandhi International Airport, Shamshabad 500108', lat: 17.2403, lng: 78.4294 },
    { name: 'Kompally', area: 'NH 44', full: 'NH 44, Kompally, Hyderabad 500014', lat: 17.5350, lng: 78.4820 },

    // Landmarks
    { name: 'HITEC City', area: 'Shilparamam', full: 'Shilparamam, HITEC City, Hyderabad 500081', lat: 17.4520, lng: 78.3820 },
    { name: 'Hussain Sagar', area: 'Tank Bund', full: 'Tank Bund, Hussain Sagar, Hyderabad 500004', lat: 17.4239, lng: 78.4738 },
    { name: 'Inorbit Mall', area: 'Madhapur', full: 'Inorbit Mall, Madhapur, Hyderabad 500081', lat: 17.4350, lng: 78.3870 },
    { name: 'GVK One', area: 'Banjara Hills', full: 'GVK One Mall, Road No. 1, Banjara Hills 500034', lat: 17.4220, lng: 78.4460 },
    { name: 'Forum Mall', area: 'Kukatpally', full: 'Forum Sujana Mall, Kukatpally, Hyderabad 500072', lat: 17.4890, lng: 78.3990 },
    { name: 'Chowmahalla Palace', area: 'Old City', full: 'Chowmahalla Palace, Old City, Hyderabad 500002', lat: 17.3583, lng: 78.4707 },
    { name: 'Golconda Fort', area: 'Ibrahim Bagh', full: 'Golconda Fort, Ibrahim Bagh, Hyderabad 500008', lat: 17.3833, lng: 78.4011 },
    { name: 'Birla Mandir', area: 'Naubat Pahad', full: 'Birla Mandir, Naubat Pahad, Hyderabad 500004', lat: 17.4060, lng: 78.4700 },
]

/**
 * Search locations locally — fuzzy text match
 * @param {string} query - search text
 * @param {number} maxResults - max results to return
 * @returns {Array} matching locations
 */
export function searchLocations(query, maxResults = 5) {
    if (!query || query.length < 2) return []

    const q = query.toLowerCase().trim()
    const scored = hyderabadLocations
        .map((loc) => {
            const nameMatch = loc.name.toLowerCase().includes(q) ? 3 : 0
            const areaMatch = loc.area.toLowerCase().includes(q) ? 2 : 0
            const fullMatch = loc.full.toLowerCase().includes(q) ? 1 : 0
            const score = nameMatch + areaMatch + fullMatch
            return { ...loc, score }
        })
        .filter((loc) => loc.score > 0)
        .sort((a, b) => b.score - a.score)

    return scored.slice(0, maxResults)
}

/**
 * Reverse geocode using our local dataset — find nearest known location
 * @param {number} lat
 * @param {number} lng
 * @returns {Object|null} nearest location
 */
export function reverseGeocodeLocal(lat, lng) {
    let nearest = null
    let minDist = Infinity

    for (const loc of hyderabadLocations) {
        const dist = Math.sqrt(Math.pow(lat - loc.lat, 2) + Math.pow(lng - loc.lng, 2))
        if (dist < minDist) {
            minDist = dist
            nearest = loc
        }
    }

    // If within ~2km of a known location, name it
    if (nearest && minDist < 0.02) {
        return nearest
    }

    return null
}
