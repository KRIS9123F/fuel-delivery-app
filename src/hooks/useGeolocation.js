import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for browser geolocation with watch mode
 * Used by the delivery person app to track their location
 *
 * @param {Object} options
 * @param {boolean} options.enableHighAccuracy - use GPS (default true)
 * @param {number} options.timeout - max wait ms (default 10000)
 * @param {number} options.maximumAge - cache ms (default 0)
 * @returns {{ location, heading, speed, accuracy, error, isTracking, startTracking, stopTracking }}
 */
export default function useGeolocation(options = {}) {
    const {
        enableHighAccuracy = true,
        timeout = 10000,
        maximumAge = 0,
    } = options

    const [location, setLocation] = useState(null)
    const [heading, setHeading] = useState(0)
    const [speed, setSpeed] = useState(0)
    const [accuracy, setAccuracy] = useState(null)
    const [error, setError] = useState(null)
    const [isTracking, setIsTracking] = useState(false)
    const watchIdRef = useRef(null)

    const handleSuccess = useCallback((position) => {
        setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        })
        setHeading(position.coords.heading || 0)
        setSpeed(position.coords.speed || 0)
        setAccuracy(position.coords.accuracy)
        setError(null)
    }, [])

    const handleError = useCallback((err) => {
        const messages = {
            1: 'Location permission denied. Please enable GPS.',
            2: 'Location unavailable. Check GPS settings.',
            3: 'Location request timed out. Retrying...',
        }
        setError(messages[err.code] || err.message)
    }, [])

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            return
        }

        setIsTracking(true)

        // Get initial position immediately
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy,
            timeout,
            maximumAge,
        })

        // Watch for continuous updates
        watchIdRef.current = navigator.geolocation.watchPosition(
            handleSuccess,
            handleError,
            { enableHighAccuracy, timeout, maximumAge }
        )
    }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError])

    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
        }
        setIsTracking(false)
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
            }
        }
    }, [])

    return {
        location,
        heading,
        speed,
        accuracy,
        error,
        isTracking,
        startTracking,
        stopTracking,
    }
}
