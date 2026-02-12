import { useEffect, useState } from 'react'
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps'
import { BANGALORE_CENTER, DEFAULT_ZOOM, fitBoundsToMarkers } from '../../utils/mapHelpers'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || ''

/**
 * Render route polyline using Directions API
 */
function DirectionsRoute({ origin, destination }) {
    const map = useMap()
    const [renderer, setRenderer] = useState(null)

    useEffect(() => {
        if (!map || !window.google) return
        const r = new window.google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#FF6B35',
                strokeWeight: 5,
                strokeOpacity: 0.85,
            },
        })
        setRenderer(r)
        return () => r.setMap(null)
    }, [map])

    useEffect(() => {
        if (!renderer || !origin || !destination || !window.google) return

        const service = new window.google.maps.DirectionsService()
        service.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK') {
                    renderer.setDirections(result)
                }
            }
        )
    }, [renderer, origin, destination])

    return null
}

/**
 * Auto-fit map bounds to markers
 */
function AutoBounds({ locations }) {
    const map = useMap()

    useEffect(() => {
        if (!map || !locations || locations.length < 2) return
        fitBoundsToMarkers(map, locations)
    }, [map, locations])

    return null
}

/**
 * MapWithRoute — Google Maps with station, delivery, and customer markers + route
 */
export default function MapWithRoute({
    stationLocation,
    deliveryLocation,
    customerLocation,
    showRoute = true,
    className = '',
}) {
    // If no API key, show styled fallback
    if (!API_KEY) {
        return (
            <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden ${className}`}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }} />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                            <span className="text-3xl">🗺️</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Live Map Preview</p>
                        <p className="text-xs text-gray-500 mt-1">Add VITE_GOOGLE_MAPS_API_KEY to .env</p>

                        <div className="flex gap-4 mt-4 text-xs text-gray-500">
                            {stationLocation && (
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-blue-500 rounded-full" /> Station
                                </span>
                            )}
                            {deliveryLocation && (
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" /> Driver
                                </span>
                            )}
                            {customerLocation && (
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-red-500 rounded-full" /> You
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const allLocations = [stationLocation, deliveryLocation, customerLocation].filter(Boolean)
    const center = deliveryLocation || customerLocation || BANGALORE_CENTER

    return (
        <div className={`rounded-2xl overflow-hidden ${className}`} style={{ width: '100%', height: '100%' }}>
            <APIProvider apiKey={API_KEY} libraries={['places']}>
                <Map
                    defaultCenter={center}
                    defaultZoom={DEFAULT_ZOOM}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    zoomControl={true}
                    mapTypeControl={false}
                    streetViewControl={false}
                    fullscreenControl={false}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Auto-fit bounds */}
                    <AutoBounds locations={allLocations} />

                    {/* Route */}
                    {showRoute && deliveryLocation && customerLocation && (
                        <DirectionsRoute origin={deliveryLocation} destination={customerLocation} />
                    )}

                    {/* Station marker */}
                    {stationLocation && (
                        <Marker
                            position={stationLocation}
                            title="Fuel Station"
                            label={{ text: '⛽', fontSize: '18px' }}
                        />
                    )}

                    {/* Delivery person marker */}
                    {deliveryLocation && (
                        <Marker
                            position={deliveryLocation}
                            title="Delivery Person"
                            icon={{
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                                    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#22c55e" stroke="white" stroke-width="3"/><text x="20" y="26" text-anchor="middle" font-size="18">🏍️</text></svg>'
                                ),
                                scaledSize: typeof window !== 'undefined' && window.google?.maps?.Size
                                    ? new window.google.maps.Size(40, 40)
                                    : undefined,
                            }}
                        />
                    )}

                    {/* Customer marker */}
                    {customerLocation && (
                        <Marker
                            position={customerLocation}
                            title="Your Location"
                            icon={{
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                                    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#ef4444" stroke="white" stroke-width="3"/><text x="20" y="26" text-anchor="middle" font-size="16">📍</text></svg>'
                                ),
                                scaledSize: typeof window !== 'undefined' && window.google?.maps?.Size
                                    ? new window.google.maps.Size(40, 40)
                                    : undefined,
                            }}
                        />
                    )}
                </Map>
            </APIProvider>
        </div>
    )
}
