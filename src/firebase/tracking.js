import {
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const COLLECTION = 'liveTracking'

/**
 * Create initial tracking document when delivery person is assigned
 */
export async function createTrackingDoc(orderId, deliveryPersonId, initialLocation) {
    await setDoc(doc(db, COLLECTION, orderId), {
        orderId,
        deliveryPersonId,
        currentLocation: initialLocation,
        heading: 0,
        speed: 0,
        estimatedTimeArrival: 'Calculating...',
        distanceRemaining: 0,
        lastUpdated: serverTimestamp(),
    })
}

/**
 * Update delivery person's live location
 * Called every 5 seconds by the delivery person app
 */
export async function updateDeliveryLocation(orderId, locationData) {
    await updateDoc(doc(db, COLLECTION, orderId), {
        currentLocation: {
            lat: locationData.lat,
            lng: locationData.lng,
        },
        heading: locationData.heading || 0,
        speed: locationData.speed || 0,
        estimatedTimeArrival: locationData.eta || 'Calculating...',
        distanceRemaining: locationData.distanceRemaining || 0,
        lastUpdated: serverTimestamp(),
    })
}

/**
 * Real-time listener for tracking data (customer side)
 * @returns {Function} unsubscribe
 */
export function listenToTracking(orderId, callback, onError) {
    return onSnapshot(
        doc(db, COLLECTION, orderId),
        (snap) => {
            if (snap.exists()) {
                callback({ id: snap.id, ...snap.data() })
            } else {
                callback(null)
            }
        },
        (error) => {
            console.error('Tracking listener error:', error)
            if (onError) onError(error)
        }
    )
}

/**
 * Delete tracking document after delivery is complete
 */
export async function deleteTrackingDoc(orderId) {
    try {
        await deleteDoc(doc(db, COLLECTION, orderId))
    } catch (err) {
        console.warn('Failed to delete tracking doc:', err)
    }
}

/**
 * Simulate delivery movement from station to customer (for demo/testing)
 * @returns {Function} clearInterval handle
 */
export function simulateDeliveryMovement(orderId, stationLocation, customerLocation, onComplete) {
    const steps = 20
    const latStep = (customerLocation.lat - stationLocation.lat) / steps
    const lngStep = (customerLocation.lng - stationLocation.lng) / steps

    let currentStep = 0

    const interval = setInterval(async () => {
        if (currentStep >= steps) {
            clearInterval(interval)
            if (onComplete) onComplete()
            return
        }

        const newLocation = {
            lat: stationLocation.lat + latStep * currentStep,
            lng: stationLocation.lng + lngStep * currentStep,
        }

        const remainingSteps = steps - currentStep
        const etaMins = Math.max(1, Math.round(remainingSteps * 0.75))

        try {
            await updateDeliveryLocation(orderId, {
                ...newLocation,
                heading: Math.atan2(lngStep, latStep) * (180 / Math.PI),
                speed: 25,
                eta: `${etaMins} mins`,
                distanceRemaining: Math.round(remainingSteps * 150), // meters
            })
        } catch (err) {
            console.error('Simulation update failed:', err)
        }

        currentStep++
    }, 15000) // every 15 seconds

    return () => clearInterval(interval)
}
