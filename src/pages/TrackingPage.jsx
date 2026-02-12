import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, AlertTriangle, Check, Package, Truck, MapPin, Clock, Shield } from 'lucide-react'
import MapWithRoute from '../components/maps/MapWithRoute'
import ETADisplay from '../components/tracking/ETADisplay'
import DeliveryPersonCard from '../components/tracking/DeliveryPersonCard'
import { cancelOrder } from '../firebase/orders'
import { mockDeliveryPersons, mockFuelStations, BANGALORE_CENTER } from '../utils/mockData'
import { fetchRoute } from '../utils/routeService'

const STATUS_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: Package, description: 'Your order has been placed' },
    { key: 'accepted', label: 'Accepted', icon: Check, description: 'Pump staff is preparing your fuel' },
    { key: 'assigned', label: 'Staff Assigned', icon: Shield, description: 'Verified pump staff is picking up fuel' },
    { key: 'on_the_way', label: 'On the Way', icon: Truck, description: 'Fuel is heading to you via road' },
    { key: 'delivered', label: 'Delivered', icon: Check, description: 'Fuel delivered successfully!' },
]

export default function TrackingPage() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const orderState = location.state || {}

    const [showDetails, setShowDetails] = useState(false)
    const [showCancel, setShowCancel] = useState(false)
    const [cancelling, setCancelling] = useState(false)

    // Simulation state
    const [currentStep, setCurrentStep] = useState(0)
    const [driverLocation, setDriverLocation] = useState(null)
    const [etaText, setEtaText] = useState('Calculating route...')
    const [distanceRemaining, setDistanceRemaining] = useState(0)
    const [routeSource, setRouteSource] = useState('') // 'osrm' or 'fallback'
    const simulationRef = useRef(null)
    const routePointsRef = useRef([])

    // Locations
    const stationLoc = orderState?.stationLocation
        || mockFuelStations[0]?.location
        || { lat: 17.3700, lng: 78.3450 }

    const customerLoc = orderState?.deliveryLocation
        || { lat: BANGALORE_CENTER.lat + 0.012, lng: BANGALORE_CENTER.lng + 0.008 }

    // Build driver info as pump staff
    const stationName = orderState?.stationName || mockFuelStations[0]?.name || 'Petrol Pump'
    const driver = {
        ...mockDeliveryPersons[0],
        name: mockDeliveryPersons[0].name,
        role: 'Pump Staff',
        stationName: stationName,
    }

    const order = {
        fuelType: orderState?.fuelType || 'Petrol',
        quantity: orderState?.quantity || 20,
        pricePerLiter: orderState?.pricePerLiter || 109,
        deliveryCharge: orderState?.deliveryCharge || 100,
        totalAmount: orderState?.totalAmount || 2280,
        stationName: stationName,
    }

    // Fetch road route using OSRM (free!) and animate driver along it
    const fetchRouteAndAnimate = useCallback(async () => {
        try {
            const routeData = await fetchRoute(stationLoc, customerLoc)

            if (routeData.points.length > 0) {
                routePointsRef.current = routeData.points
                setRouteSource(routeData.distance > 0 ? 'osrm' : 'fallback')
                animateAlongRoute(routeData.points, routeData.distance, routeData.duration)
                console.log(`✅ Route loaded: ${routeData.distanceText}, ${routeData.durationText} (${routeData.points.length} waypoints)`)
            }
        } catch (error) {
            console.error('Route fetch failed:', error)
            // Fallback is handled inside fetchRoute itself
        }
    }, [stationLoc, customerLoc])

    // Animate driver along actual road route points
    function animateAlongRoute(points, totalDistanceM, totalDurationS) {
        if (points.length === 0) return

        let step = 0
        setDriverLocation(points[0])
        setDistanceRemaining(totalDistanceM)

        const totalEtaMins = Math.ceil(totalDurationS / 60)
        setEtaText(`${totalEtaMins} min`)

        // Speed: move one waypoint every 1.2 seconds for ~60 points = ~72s total animation
        const intervalMs = Math.max(800, Math.min(2000, (60 * 1000) / points.length))

        simulationRef.current = setInterval(() => {
            step++
            if (step >= points.length) {
                clearInterval(simulationRef.current)
                setDriverLocation(points[points.length - 1])
                setEtaText('Arrived!')
                setDistanceRemaining(0)
                setCurrentStep(4)
                return
            }

            setDriverLocation(points[step])

            // Update ETA and distance progressively
            const progress = step / points.length
            const remainingDist = Math.round(totalDistanceM * (1 - progress))
            const remainingMins = Math.max(1, Math.ceil(totalEtaMins * (1 - progress)))
            setDistanceRemaining(remainingDist)
            setEtaText(remainingMins <= 1 ? 'Almost there!' : `${remainingMins} min`)
        }, intervalMs)
    }

    // Auto-advance status steps, then start movement
    useEffect(() => {
        const timers = []
        timers.push(setTimeout(() => setCurrentStep(1), 2000))   // accepted
        timers.push(setTimeout(() => setCurrentStep(2), 4000))   // staff assigned
        timers.push(setTimeout(() => {
            setCurrentStep(3) // on_the_way
            fetchRouteAndAnimate()
        }, 6000))

        return () => {
            timers.forEach(clearTimeout)
            if (simulationRef.current) clearInterval(simulationRef.current)
        }
    }, [fetchRouteAndAnimate])

    const handleCancel = async () => {
        setCancelling(true)
        try {
            if (orderId && !orderId.startsWith('ORD-')) await cancelOrder(orderId)
            navigate('/orders')
        } catch (err) {
            console.error(err)
        } finally {
            setCancelling(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="relative z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h1 className="text-base font-bold text-gray-900">Live Tracking</h1>
                    <p className="text-xs text-gray-500">Order #{orderId?.slice(0, 8) || 'DEMO'}</p>
                </div>
                {routeSource === 'osrm' && (
                    <span className="text-[9px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">LIVE ROUTE</span>
                )}
                {currentStep < 4 && (
                    <button onClick={() => setShowCancel(true)} className="text-xs text-red-500 font-medium hover:text-red-600">
                        Cancel
                    </button>
                )}
            </header>

            {/* Map */}
            <div className="relative" style={{ height: '40vh', minHeight: '280px' }}>
                <MapWithRoute
                    stationLocation={stationLoc}
                    deliveryLocation={driverLocation}
                    customerLocation={customerLoc}
                    showRoute={currentStep >= 2 && currentStep < 4}
                    className="w-full h-full"
                />

                {/* Status badge on map */}
                {currentStep < 3 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${currentStep < 2 ? 'bg-yellow-400' : 'bg-green-500'} animate-pulse`} />
                            <span className="text-sm font-semibold text-gray-700">
                                {STATUS_STEPS[currentStep].label}...
                            </span>
                        </div>
                    </div>
                )}

                {/* Delivered overlay */}
                {currentStep === 4 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl mx-6 max-w-sm animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Fuel Delivered!</h2>
                            <p className="text-sm text-gray-500 mt-1">Your order has been delivered successfully</p>
                            <button onClick={() => navigate('/orders')} className="w-full mt-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all">
                                View Orders
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom sheet */}
            <div className="relative z-10 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 -mt-6 flex-1 flex flex-col">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />

                <div className="px-5 pb-6 space-y-4 overflow-y-auto flex-1">
                    {/* ETA */}
                    {currentStep >= 3 && currentStep < 4 && (
                        <ETADisplay eta={etaText} distance={distanceRemaining} status="On the Way" />
                    )}

                    {/* Driver Card (Pump Staff) */}
                    {currentStep >= 2 && (
                        <div>
                            <DeliveryPersonCard person={driver} />
                            <div className="mt-2 flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                                <Shield size={14} className="text-blue-600" />
                                <p className="text-[11px] text-blue-700 font-medium">
                                    Verified staff from {stationName}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Status Timeline */}
                    <div className="pt-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Status</h3>
                        <div className="space-y-0">
                            {STATUS_STEPS.map((step, index) => {
                                const isDone = index < currentStep
                                const isActive = index === currentStep
                                const IconComp = step.icon
                                return (
                                    <div key={step.key} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-orange-500 text-white animate-pulse shadow-md shadow-orange-200' : 'bg-gray-200 text-gray-400'}`}>
                                                {isDone ? <Check size={16} /> : <IconComp size={16} />}
                                            </div>
                                            {index < STATUS_STEPS.length - 1 && (
                                                <div className={`w-0.5 h-8 transition-all duration-500 ${isDone ? 'bg-green-500' : isActive ? 'bg-orange-300' : 'bg-gray-200'}`} />
                                            )}
                                        </div>
                                        <div className="pb-6">
                                            <p className={`text-sm font-semibold ${isActive ? 'text-orange-600' : isDone ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                            <p className={`text-xs mt-0.5 ${isActive || isDone ? 'text-gray-500' : 'text-gray-300'}`}>{step.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div>
                        <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                            Order Details
                            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {showDetails && (
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Station</span><span className="font-medium">{order.stationName}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Fuel Type</span><span className="font-medium">{order.fuelType}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-medium">{order.quantity} L</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="font-medium">₹{order.pricePerLiter}/L</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="font-medium">₹{order.deliveryCharge}</span></div>
                                <div className="border-t pt-2 flex justify-between"><span className="font-semibold text-gray-900">Total</span><span className="font-bold text-orange-600">₹{order.totalAmount}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancel && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={28} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-center text-gray-900">Cancel Order?</h3>
                        <p className="text-sm text-gray-500 text-center mt-2">This action cannot be undone.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowCancel(false)} className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200">Go Back</button>
                            <button onClick={handleCancel} disabled={cancelling} className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50">{cancelling ? 'Cancelling...' : 'Cancel Order'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
