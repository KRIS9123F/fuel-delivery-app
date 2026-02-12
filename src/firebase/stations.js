import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore'
import { db } from './config'
import { calculateHaversineDistance } from '../utils/distanceCalculator'

const STATIONS_COLLECTION = 'fuelStations'
const DELIVERY_COLLECTION = 'deliveryPersons'

/**
 * Get a single station by ID
 */
export async function getStation(stationId) {
    const snap = await getDoc(doc(db, STATIONS_COLLECTION, stationId))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/**
 * Get all online stations in a city
 */
export async function getOnlineStations(city = 'Hyderabad') {
    const q = query(
        collection(db, STATIONS_COLLECTION),
        where('city', '==', city),
        where('isOnline', '==', true)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Get nearby stations within delivery radius of user location
 * @param {Object} userLocation - { lat, lng }
 * @param {string} city
 * @returns {Array} stations sorted by distance
 */
export async function getNearbyStations(userLocation, city = 'Hyderabad') {
    const stations = await getOnlineStations(city)

    return stations
        .map((station) => {
            const distance = calculateHaversineDistance(userLocation, station.location)
            return { ...station, distance }
        })
        .filter((s) => s.distance <= (s.deliveryRadius || 10))
        .sort((a, b) => a.distance - b.distance)
}

/**
 * Toggle station online/offline status
 */
export async function updateStationStatus(stationId, updates) {
    await updateDoc(doc(db, STATIONS_COLLECTION, stationId), updates)
}

/**
 * Real-time listener for station data
 */
export function listenToStation(stationId, callback) {
    return onSnapshot(doc(db, STATIONS_COLLECTION, stationId), (snap) => {
        if (snap.exists()) {
            callback({ id: snap.id, ...snap.data() })
        }
    })
}

// ───── Delivery Person Queries ─────

/**
 * Get available delivery persons for a station
 */
export async function getAvailableDeliveryPersons(stationId) {
    const q = query(
        collection(db, DELIVERY_COLLECTION),
        where('stationId', '==', stationId),
        where('isAvailable', '==', true),
        where('isOnline', '==', true)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Find the nearest available delivery person to a customer location
 */
export async function findNearestDeliveryPerson(stationId, customerLocation) {
    const persons = await getAvailableDeliveryPersons(stationId)

    if (persons.length === 0) return null

    let nearest = null
    let shortestDistance = Infinity

    for (const person of persons) {
        if (!person.currentLocation) continue
        const dist = calculateHaversineDistance(person.currentLocation, customerLocation)
        if (dist < shortestDistance) {
            shortestDistance = dist
            nearest = { ...person, distance: dist }
        }
    }

    return nearest
}

/**
 * Update delivery person availability
 */
export async function updateDeliveryPersonStatus(personId, updates) {
    await updateDoc(doc(db, DELIVERY_COLLECTION, personId), updates)
}

/**
 * Get delivery person by ID
 */
export async function getDeliveryPerson(personId) {
    const snap = await getDoc(doc(db, DELIVERY_COLLECTION, personId))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/**
 * Get all delivery persons assigned to a station (available or not)
 */
export async function getStationDeliveryPersons(stationId) {
    const q = query(
        collection(db, DELIVERY_COLLECTION),
        where('stationId', '==', stationId)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
