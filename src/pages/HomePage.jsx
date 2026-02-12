import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Fuel, Droplets, Flame, Crosshair, Search, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fuelTypes, mockFuelStations, BANGALORE_CENTER } from '../utils/mockData'
import { searchLocations, reverseGeocodeLocal } from '../utils/locationSearch'
import { fetchNearbyPumps } from '../utils/nearbyPumps'
import { createOrder } from '../firebase/orders'
import BottomNav from '../components/ui/BottomNav'
import QuantityModal from '../components/modals/QuantityModal'
import MapWithRoute from '../components/maps/MapWithRoute'

const fuelIcons = { petrol: Fuel, diesel: Droplets, cng: Flame }
const fuelColors = {
    petrol: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-600' },
    diesel: { bg: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-200', gradient: 'from-sky-500 to-blue-600' },
    cng: { bg: 'bg-violet-500/10', text: 'text-violet-600', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600' },
}

export default function HomePage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [selectedFuel, setSelectedFuel] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [nearbyStations, setNearbyStations] = useState([])
    const [selectedStation, setSelectedStation] = useState(null)
    const [loadingPumps, setLoadingPumps] = useState(false)
    const [pumpsSource, setPumpsSource] = useState('') // 'real' or 'mock'

    // Location state
    const [userLocation, setUserLocation] = useState(null)
    const [locationText, setLocationText] = useState('')
    const [detectingGPS, setDetectingGPS] = useState(false)

    // Search state
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef(null)

    const displayName = user?.displayName || 'there'
    const photoURL = user?.photoURL
    const now = new Date()
    const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening'
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })

    // Load real nearby petrol pumps from OpenStreetMap
    useEffect(() => {
        const loc = userLocation || BANGALORE_CENTER
        setLoadingPumps(true)

        fetchNearbyPumps(loc.lat, loc.lng, 5000)
            .then((realPumps) => {
                if (realPumps.length > 0) {
                    setNearbyStations(realPumps.slice(0, 10))
                    setSelectedStation(realPumps[0])
                    setPumpsSource('real')
                    console.log(`✅ Found ${realPumps.length} real petrol pumps nearby`)
                } else {
                    // No real pumps found — use mock data
                    const online = mockFuelStations.filter((s) => s.isOnline)
                    setNearbyStations(online)
                    setSelectedStation(online[0])
                    setPumpsSource('mock')
                }
            })
            .catch(() => {
                const online = mockFuelStations.filter((s) => s.isOnline)
                setNearbyStations(online)
                setSelectedStation(online[0])
                setPumpsSource('mock')
            })
            .finally(() => setLoadingPumps(false))
    }, [userLocation])

    // ------ Location Functions ------

    // Detect GPS location
    const handleDetectLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationText('GPS not available in this browser')
            return
        }

        setDetectingGPS(true)
        setLocationText('Detecting your location...')
        setSuggestions([])
        setShowSuggestions(false)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
                setUserLocation(loc)

                // Use local reverse geocoding (no Google API needed)
                const nearest = reverseGeocodeLocal(loc.lat, loc.lng)
                if (nearest) {
                    setLocationText(nearest.full)
                } else {
                    setLocationText(`Near ${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E, Hyderabad`)
                }
                setDetectingGPS(false)
            },
            (error) => {
                console.error('Geolocation error:', error)
                const msgs = {
                    1: 'Location access denied. Enable it in browser settings.',
                    2: 'Location unavailable. Try again.',
                    3: 'Location request timed out. Try again.',
                }
                setLocationText(msgs[error.code] || 'Could not detect location')
                setDetectingGPS(false)
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }, [])

    // Handle typing in location input — search local database
    const handleLocationInput = (value) => {
        setLocationText(value)

        if (value.length < 2) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        // Search local Hyderabad locations (instant, no API call)
        const results = searchLocations(value)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
    }

    // User selects a suggestion
    const handleSelectSuggestion = (loc) => {
        setLocationText(loc.full)
        setUserLocation({ lat: loc.lat, lng: loc.lng })
        setSuggestions([])
        setShowSuggestions(false)
    }

    const clearLocation = () => {
        setLocationText('')
        setUserLocation(null)
        setSuggestions([])
        setShowSuggestions(false)
        inputRef.current?.focus()
    }

    // ------ Order Functions ------

    const handleFuelSelect = (fuel) => {
        setSelectedFuel(fuel)
        setShowModal(true)
    }

    const handleQuantityConfirm = async (orderData) => {
        setShowModal(false)

        const enrichedOrder = {
            ...orderData,
            stationId: selectedStation?.id || null,
            stationName: selectedStation?.name || 'Nearest Station',
            stationLocation: selectedStation?.location || null,
            deliveryLocation: userLocation || BANGALORE_CENTER,
            deliveryAddress: locationText || 'Banjara Hills, Hyderabad',
            userId: user?.uid,
            userName: user?.displayName || 'Customer',
            userPhone: user?.phoneNumber || '+919876543210',
        }

        try {
            const orderId = await createOrder(enrichedOrder)
            enrichedOrder.orderId = orderId
        } catch {
            enrichedOrder.orderId = 'ORD-' + Date.now()
        }

        navigate('/payment', { state: enrichedOrder })
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* ===== Greeting Section ===== */}
            <div className="bg-gradient-hero px-6 pt-8 pb-10 rounded-b-[2rem] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute bottom-0 -left-8 w-28 h-28 bg-white/5 rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-white/70 text-sm">{greeting} 👋</p>
                            <h1 className="text-2xl font-bold text-white">Hello, {displayName.split(' ')[0]}!</h1>
                        </div>
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/30 bg-white/20 flex items-center justify-center">
                            {photoURL ? (
                                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-bold text-lg">{displayName.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <MapPin size={13} className="text-white" />
                            <span className="text-white text-xs font-medium">
                                {locationText ? locationText.split(',')[0] : 'Hyderabad'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <Calendar size={13} className="text-white" />
                            <span className="text-white text-xs font-medium">{dateStr}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Content Section ===== */}
            <div className="px-5 -mt-5 relative z-10">
                {/* Fuel Type Cards */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Select Fuel Type</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {fuelTypes.map((fuel) => {
                            const Icon = fuelIcons[fuel.id]
                            const colors = fuelColors[fuel.id]
                            return (
                                <button
                                    key={fuel.id}
                                    onClick={() => handleFuelSelect(fuel)}
                                    className={`relative rounded-2xl border ${colors.border} bg-white p-4 text-center shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden`}
                                >
                                    {/* Subtle gradient accent bar at top */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`} />

                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform`}>
                                        <Icon size={22} className={colors.text} />
                                    </div>
                                    <p className="font-bold text-gray-800 text-sm">{fuel.label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 font-medium">₹{fuel.price}/{fuel.id === 'cng' ? 'kg' : 'L'}</p>
                                    <div className={`mt-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-r ${colors.gradient} hover:opacity-90 transition-opacity`}>
                                        Select
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Location Input with Local Search */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Delivery Location</h2>
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={locationText}
                            onChange={(e) => handleLocationInput(e.target.value)}
                            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                            placeholder="Search area, landmark, or locality..."
                            className="input-field pl-11 pr-20"
                        />

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {locationText && (
                                <button
                                    onClick={clearLocation}
                                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                            <button
                                onClick={handleDetectLocation}
                                disabled={detectingGPS}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${detectingGPS
                                    ? 'bg-orange-100 text-orange-500 animate-pulse'
                                    : 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                                    }`}
                                title="Use my current GPS location"
                            >
                                <Crosshair size={16} />
                            </button>
                        </div>

                        {/* Location suggestions dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-30 overflow-hidden">
                                {suggestions.map((loc, i) => (
                                    <button
                                        key={`${loc.name}-${loc.area}-${i}`}
                                        onClick={() => handleSelectSuggestion(loc)}
                                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                                    >
                                        <MapPin size={16} className="text-orange-400 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {loc.name} <span className="text-gray-400 font-normal">• {loc.area}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{loc.full}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* GPS detected indicator */}
                    {userLocation && locationText && !detectingGPS && !showSuggestions && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Location set — your fuel will be delivered here
                        </div>
                    )}
                </div>

                {/* Nearest Station */}
                {loadingPumps ? (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Finding Petrol Pumps...</h2>
                        <div className="card p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center animate-pulse">⛽</div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                            </div>
                        </div>
                    </div>
                ) : selectedStation && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-gray-900">Nearest Petrol Pump</h2>
                            {pumpsSource === 'real' && (
                                <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">LIVE DATA</span>
                            )}
                        </div>
                        <div className="card p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-lg text-white shadow-sm">⛽</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 truncate">{selectedStation.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{selectedStation.address}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    {selectedStation.distanceText ? (
                                        <p className="text-sm font-bold text-orange-600">{selectedStation.distanceText}</p>
                                    ) : selectedStation.distance ? (
                                        <p className="text-sm font-bold text-orange-600">{selectedStation.distance.toFixed(1)} km</p>
                                    ) : (
                                        <p className="text-xs text-gray-400">Nearby</p>
                                    )}
                                    <p className="text-[10px] text-gray-400">⭐ {selectedStation.rating?.toFixed(1) || '4.5'}</p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                                <span className="text-xs">🛡️</span>
                                <p className="text-[11px] text-blue-700 font-medium">Fuel delivered by verified pump staff — safe & certified</p>
                            </div>
                        </div>

                        {/* Other nearby pumps */}
                        {nearbyStations.length > 1 && (
                            <div className="mt-2 space-y-1.5">
                                {nearbyStations.slice(1, 4).map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setSelectedStation(s)}
                                        className={`w-full card p-3 flex items-center gap-3 text-left transition-all ${selectedStation.id === s.id ? 'ring-2 ring-orange-300' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">⛽</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-800 truncate">{s.name}</p>
                                        </div>
                                        <span className="text-[11px] font-semibold text-orange-500 flex-shrink-0">
                                            {s.distanceText || (s.distance ? `${s.distance.toFixed(1)} km` : '')}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Map */}
                <div className="mb-6" style={{ height: '200px' }}>
                    <MapWithRoute
                        stationLocation={selectedStation?.location}
                        customerLocation={userLocation || BANGALORE_CENTER}
                        showRoute={false}
                        className="w-full h-full"
                    />
                </div>
            </div>

            <BottomNav />

            <QuantityModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                fuelType={selectedFuel}
                onConfirm={handleQuantityConfirm}
            />
        </div>
    )
}
