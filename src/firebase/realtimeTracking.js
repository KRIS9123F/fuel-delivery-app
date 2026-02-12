import { ref, set, update, remove, onValue, onDisconnect, serverTimestamp } from 'firebase/database'
import { rtdb } from './config'

// ───── Paths ─────
const TRACKING_PATH = 'liveTracking'
const DRIVERS_ONLINE_PATH = 'driversOnline'

// ───── Live GPS Tracking (Driver → Customer) ─────

/**
 * Start tracking session when delivery person is assigned
 * Creates a node at /liveTracking/{orderId}
 */
export function startTrackingSession(orderId, deliveryPersonId, initialLocation) {
    const trackingRef = ref(rtdb, `${TRACKING_PATH}/${orderId}`)
    return set(trackingRef, {
        orderId,
        deliveryPersonId,
        currentLocation: {
            lat: initialLocation.lat,
            lng: initialLocation.lng,
        },
        heading: 0,
        speed: 0,
        eta: 'Calculating...',
        distanceRemaining: 0,
        status: 'on_the_way',
        lastUpdated: serverTimestamp(),
    })
}

/**
 * Update driver's live GPS location (called every 3-5 seconds)
 * Ultra-low latency — customer sees movement in real-time
 */
export function updateDriverLocation(orderId, locationData) {
    const trackingRef = ref(rtdb, `${TRACKING_PATH}/${orderId}`)
    return update(trackingRef, {
        currentLocation: {
            lat: locationData.lat,
            lng: locationData.lng,
        },
        heading: locationData.heading || 0,
        speed: locationData.speed || 0,
        eta: locationData.eta || 'Calculating...',
        distanceRemaining: locationData.distanceRemaining || 0,
        lastUpdated: serverTimestamp(),
    })
}

/**
 * Listen to driver's live location (customer side)
 * Fires callback on EVERY location change — no polling needed
 * @returns {Function} unsubscribe
 */
export function listenToDriverLocation(orderId, callback, onError) {
    const trackingRef = ref(rtdb, `${TRACKING_PATH}/${orderId}`)
    return onValue(
        trackingRef,
        (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val())
            } else {
                callback(null)
            }
        },
        (error) => {
            console.error('RTDB tracking listener error:', error)
            if (onError) onError(error)
        }
    )
}

/**
 * End tracking session after delivery is complete
 */
export function endTrackingSession(orderId) {
    const trackingRef = ref(rtdb, `${TRACKING_PATH}/${orderId}`)
    return remove(trackingRef)
}

// ───── Driver Online/Offline Presence ─────

/**
 * Set driver as online with current location
 * Auto-removes when driver disconnects (closes app/loses internet)
 */
export function setDriverOnline(driverId, location) {
    const driverRef = ref(rtdb, `${DRIVERS_ONLINE_PATH}/${driverId}`)

    // Set current status
    set(driverRef, {
        isOnline: true,
        currentLocation: location,
        lastSeen: serverTimestamp(),
    })

    // Auto-cleanup: when driver disconnects, mark offline
    const disconnectRef = onDisconnect(driverRef)
    disconnectRef.update({
        isOnline: false,
        lastSeen: serverTimestamp(),
    })

    return driverRef
}

/**
 * Set driver as offline
 */
export function setDriverOffline(driverId) {
    const driverRef = ref(rtdb, `${DRIVERS_ONLINE_PATH}/${driverId}`)
    return update(driverRef, {
        isOnline: false,
        lastSeen: serverTimestamp(),
    })
}

/**
 * Listen to all online drivers (for station dashboard map view)
 * @returns {Function} unsubscribe
 */
export function listenToOnlineDrivers(callback) {
    const driversRef = ref(rtdb, DRIVERS_ONLINE_PATH)
    return onValue(driversRef, (snapshot) => {
        if (snapshot.exists()) {
            const drivers = []
            snapshot.forEach((child) => {
                const data = child.val()
                if (data.isOnline) {
                    drivers.push({ id: child.key, ...data })
                }
            })
            callback(drivers)
        } else {
            callback([])
        }
    })
}

/**
 * Update driver's location in the online presence node
 */
export function updateDriverPresenceLocation(driverId, location) {
    const driverRef = ref(rtdb, `${DRIVERS_ONLINE_PATH}/${driverId}`)
    return update(driverRef, {
        currentLocation: location,
        lastSeen: serverTimestamp(),
    })
}

// ───── Simulation for Demo/Testing ─────

/**
 * Simulate driver movement from station to customer
 * @returns {Function} stopSimulation
 */
export function simulateDriverMovement(orderId, stationLoc, customerLoc, onComplete) {
    const totalSteps = 25
    const latStep = (customerLoc.lat - stationLoc.lat) / totalSteps
    const lngStep = (customerLoc.lng - stationLoc.lng) / totalSteps
    let step = 0

    const interval = setInterval(async () => {
        if (step >= totalSteps) {
            clearInterval(interval)
            if (onComplete) onComplete()
            return
        }

        const currentLat = stationLoc.lat + latStep * step
        const currentLng = stationLoc.lng + lngStep * step
        const remaining = totalSteps - step
        const etaMins = Math.max(1, Math.round(remaining * 0.6))

        try {
            await updateDriverLocation(orderId, {
                lat: currentLat,
                lng: currentLng,
                heading: Math.atan2(lngStep, latStep) * (180 / Math.PI),
                speed: 20 + Math.random() * 15,
                eta: `${etaMins} mins`,
                distanceRemaining: Math.round(remaining * 120),
            })
        } catch (err) {
            console.error('Simulation update failed:', err)
        }

        step++
    }, 3000) // Update every 3 seconds for smooth tracking

    return () => clearInterval(interval)
}
