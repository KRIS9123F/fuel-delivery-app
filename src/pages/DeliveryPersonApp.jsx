import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Navigation, Phone, Package, Check, Clock, Truck, Power, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useGeolocation from '../hooks/useGeolocation'
import { updateDeliveryLocation } from '../firebase/tracking'
import { listenToDeliveryPersonOrder, updateOrderStatus } from '../firebase/orders'
import { updateDeliveryPersonStatus } from '../firebase/stations'
import MapWithRoute from '../components/maps/MapWithRoute'
import { mockFuelStations, mockDeliveryPersons, BANGALORE_CENTER } from '../utils/mockData'

const STATUS_LABELS = {
    assigned: { label: 'New Order Assigned', color: 'bg-blue-500', action: 'Start Delivery' },
    on_the_way: { label: 'On the Way', color: 'bg-orange-500', action: 'Reached Customer' },
    delivered: { label: 'Delivered', color: 'bg-green-500', action: null },
}

export default function DeliveryPersonApp() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { location, heading, speed, error: geoError, isTracking, startTracking, stopTracking } = useGeolocation()

    const [isOnline, setIsOnline] = useState(true)
    const [currentOrder, setCurrentOrder] = useState(null)
    const [demoMode, setDemoMode] = useState(false)
    const [demoOrder, setDemoOrder] = useState(null)
    const [updating, setUpdating] = useState(false)
    const intervalRef = useRef(null)

    // Listen for assigned/active orders from Firestore
    useEffect(() => {
        if (!user) return

        const unsub = listenToDeliveryPersonOrder(user.uid, (order) => {
            setCurrentOrder(order)
            if (order && !isTracking) {
                startTracking()
            }
        })

        // If no real order found after 3s, show demo mode option
        const timer = setTimeout(() => {
            if (!currentOrder) setDemoMode(true)
        }, 3000)

        return () => {
            unsub()
            clearTimeout(timer)
        }
    }, [user])

    // Send location updates to Firestore every 5 seconds
    useEffect(() => {
        const orderId = currentOrder?.id || demoOrder?.id
        if (!location || !orderId) return

        // Update immediately
        updateDeliveryLocation(orderId, {
            lat: location.lat,
            lng: location.lng,
            heading: heading || 0,
            speed: speed || 0,
            eta: 'Calculating...',
        }).catch(() => { })

        // Then every 5 seconds
        intervalRef.current = setInterval(() => {
            if (location) {
                updateDeliveryLocation(orderId, {
                    lat: location.lat,
                    lng: location.lng,
                    heading: heading || 0,
                    speed: speed || 0,
                    eta: 'Calculating...',
                }).catch(() => { })
            }
        }, 5000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [location, currentOrder, demoOrder])

    const handleToggleOnline = () => {
        const newStatus = !isOnline
        setIsOnline(newStatus)
        if (user) {
            updateDeliveryPersonStatus(user.uid, { isOnline: newStatus }).catch(() => { })
        }
        if (newStatus) {
            startTracking()
        } else {
            stopTracking()
        }
    }

    const handleStatusUpdate = async () => {
        const order = currentOrder || demoOrder
        if (!order) return

        setUpdating(true)
        try {
            if (order.status === 'assigned') {
                await updateOrderStatus(order.id, 'on_the_way')
                if (currentOrder) setCurrentOrder({ ...currentOrder, status: 'on_the_way' })
                if (demoOrder) setDemoOrder({ ...demoOrder, status: 'on_the_way' })
            } else if (order.status === 'on_the_way') {
                await updateOrderStatus(order.id, 'delivered')
                if (user) {
                    updateDeliveryPersonStatus(user.uid, { isAvailable: true, currentOrderId: null }).catch(() => { })
                }
                stopTracking()
                if (currentOrder) setCurrentOrder({ ...currentOrder, status: 'delivered' })
                if (demoOrder) setDemoOrder({ ...demoOrder, status: 'delivered' })
            }
        } catch (err) {
            console.error('Status update failed:', err)
        } finally {
            setUpdating(false)
        }
    }

    const startDemoOrder = () => {
        setDemoOrder({
            id: 'DEMO-' + Date.now(),
            status: 'assigned',
            fuelType: 'Petrol',
            quantity: 20,
            totalAmount: 2320,
            userName: 'Krishna Kumar',
            userPhone: '+919876543210',
            deliveryAddress: 'Banjara Hills, Hyderabad',
            deliveryLocation: { lat: BANGALORE_CENTER.lat + 0.008, lng: BANGALORE_CENTER.lng + 0.005 },
            stationName: mockFuelStations[0].name,
        })
        startTracking()
    }

    const activeOrder = currentOrder || demoOrder
    const statusInfo = activeOrder ? STATUS_LABELS[activeOrder.status] : null

    // Get a delivery person profile matching current user or use first mock
    const myProfile = mockDeliveryPersons.find((p) => p.id === user?.uid) || mockDeliveryPersons[0]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
                        {myProfile.photoURL ? (
                            <img src={myProfile.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🏍️</div>
                        )}
                    </div>
                    <div>
                        <h1 className="font-bold text-sm">{user?.displayName || myProfile.name}</h1>
                        <p className="text-xs text-white/60">Delivery Partner</p>
                    </div>
                </div>

                {/* Online/Offline toggle */}
                <button
                    onClick={handleToggleOnline}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}
                >
                    <Power size={14} />
                    {isOnline ? 'Online' : 'Offline'}
                </button>
            </header>

            {/* Main content */}
            {!activeOrder ? (
                /* Waiting for orders */
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center max-w-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {isOnline ? (
                                <div className="w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Power size={32} className="text-gray-400" />
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {isOnline ? 'Waiting for Orders...' : 'You\'re Offline'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isOnline ? 'You\'ll be notified when a new order is assigned.' : 'Go online to start receiving orders.'}
                        </p>

                        {/* GPS status */}
                        {geoError && (
                            <div className="mt-4 bg-red-50 rounded-xl p-3 flex items-start gap-2">
                                <AlertCircle size={16} className="text-red-500 mt-0.5" />
                                <p className="text-xs text-red-600 text-left">{geoError}</p>
                            </div>
                        )}

                        {location && (
                            <div className="mt-4 bg-green-50 rounded-xl p-3 flex items-center gap-2">
                                <Navigation size={14} className="text-green-600" />
                                <p className="text-xs text-green-700">
                                    GPS Active: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                </p>
                            </div>
                        )}

                        {/* Demo mode */}
                        {demoMode && (
                            <button
                                onClick={startDemoOrder}
                                className="mt-6 btn w-full"
                            >
                                🧪 Start Demo Order
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* Active order */
                <div className="flex-1 flex flex-col">
                    {/* Status banner */}
                    <div className={`${statusInfo?.color || 'bg-gray-500'} text-white px-5 py-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                            <Truck size={18} />
                            <span className="font-semibold text-sm">{statusInfo?.label}</span>
                        </div>
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                            #{activeOrder.id?.slice(0, 8)}
                        </span>
                    </div>

                    {/* Map */}
                    <div className="h-56 relative">
                        <MapWithRoute
                            stationLocation={mockFuelStations[0].location}
                            deliveryLocation={location || myProfile.currentLocation}
                            customerLocation={activeOrder.deliveryLocation}
                            showRoute={activeOrder.status !== 'delivered'}
                            className="w-full h-full"
                        />
                    </div>

                    {/* Order details */}
                    <div className="flex-1 bg-white rounded-t-3xl -mt-4 relative z-10 p-5 space-y-4 overflow-y-auto">
                        {/* Customer info */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <MapPin size={20} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">{activeOrder.userName || 'Customer'}</p>
                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{activeOrder.deliveryAddress}</p>
                                </div>
                            </div>
                            <a
                                href={`tel:${activeOrder.userPhone}`}
                                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md"
                            >
                                <Phone size={18} />
                            </a>
                        </div>

                        {/* Order summary */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                            <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Fuel</span>
                                <span className="font-medium">{activeOrder.fuelType} • {activeOrder.quantity}L</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Station</span>
                                <span className="font-medium truncate max-w-[180px]">{activeOrder.stationName}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-orange-600">₹{activeOrder.totalAmount}</span>
                            </div>
                        </div>

                        {/* Navigation button */}
                        {activeOrder.status !== 'delivered' && activeOrder.deliveryLocation && (
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${activeOrder.deliveryLocation.lat},${activeOrder.deliveryLocation.lng}&travelmode=driving`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition-colors"
                            >
                                <Navigation size={16} />
                                Open in Google Maps
                            </a>
                        )}

                        {/* Action button */}
                        {statusInfo?.action && (
                            <button
                                onClick={handleStatusUpdate}
                                disabled={updating}
                                className="btn w-full text-base py-4 disabled:opacity-50"
                            >
                                {updating ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Updating...
                                    </span>
                                ) : (
                                    statusInfo.action
                                )}
                            </button>
                        )}

                        {/* Delivered success */}
                        {activeOrder.status === 'delivered' && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Check size={32} className="text-green-600" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">Delivery Complete!</h3>
                                <p className="text-sm text-gray-500 mt-1">Great job! Waiting for next order...</p>
                                <button
                                    onClick={() => {
                                        setCurrentOrder(null)
                                        setDemoOrder(null)
                                    }}
                                    className="btn mt-4 w-full"
                                >
                                    Back to Waiting
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
