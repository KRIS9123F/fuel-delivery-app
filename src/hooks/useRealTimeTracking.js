import { useState, useEffect, useRef } from 'react'
import { listenToOrder } from '../firebase/orders'
import { listenToTracking } from '../firebase/tracking'

/**
 * Custom hook for real-time order + delivery tracking
 * Subscribes to both fuelRequests/{orderId} and liveTracking/{orderId}
 *
 * @param {string} orderId
 * @returns {{ orderData, deliveryLocation, trackingData, loading, error }}
 */
export default function useRealTimeTracking(orderId) {
    const [orderData, setOrderData] = useState(null)
    const [trackingData, setTrackingData] = useState(null)
    const [deliveryLocation, setDeliveryLocation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const prevLocationRef = useRef(null)

    useEffect(() => {
        if (!orderId) {
            setLoading(false)
            return
        }

        let orderUnsub
        let trackingUnsub

        try {
            // Listen to order status
            orderUnsub = listenToOrder(orderId, (data) => {
                setOrderData(data)
                setLoading(false)
            })

            // Listen to live tracking
            trackingUnsub = listenToTracking(
                orderId,
                (data) => {
                    setTrackingData(data)
                    if (data?.currentLocation) {
                        prevLocationRef.current = deliveryLocation
                        setDeliveryLocation(data.currentLocation)
                    }
                },
                (err) => {
                    setError(err.message)
                }
            )
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }

        return () => {
            if (orderUnsub) orderUnsub()
            if (trackingUnsub) trackingUnsub()
        }
    }, [orderId])

    return {
        orderData,
        trackingData,
        deliveryLocation,
        prevLocation: prevLocationRef.current,
        loading,
        error,
        eta: trackingData?.estimatedTimeArrival || null,
        distanceRemaining: trackingData?.distanceRemaining || 0,
        lastUpdated: trackingData?.lastUpdated || null,
    }
}
