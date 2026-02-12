import { useRef, useEffect, useState } from 'react'

export default function MapView({ center, zoom = 14, markers = [], className = '' }) {
    const mapRef = useRef(null)
    const [mapError] = useState(false)

    // Placeholder map since Google Maps API key may not be configured
    // In production, this would use @googlemaps/react-wrapper
    useEffect(() => {
        // Map initialization would go here with the Google Maps API
    }, [center, zoom])

    return (
        <div ref={mapRef} className={`relative w-full h-full bg-gray-100 ${className}`}>
            {/* Placeholder Map UI */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid pattern to simulate map */}
                <div className="w-full h-full relative" style={{
                    backgroundImage: `
            linear-gradient(rgba(200,200,200,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,200,200,0.3) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                    backgroundColor: '#E8F4E8'
                }}>
                    {/* Simulated roads */}
                    <div className="absolute top-0 bottom-0 left-1/3 w-8 bg-white/70" />
                    <div className="absolute left-0 right-0 top-1/2 h-8 bg-white/70" />
                    <div className="absolute top-0 bottom-0 left-2/3 w-4 bg-white/50" />
                    <div className="absolute left-0 right-0 top-1/4 h-4 bg-white/50" />

                    {/* Simulated buildings/blocks */}
                    <div className="absolute top-[15%] left-[10%] w-24 h-16 bg-gray-200/60 rounded" />
                    <div className="absolute top-[60%] left-[50%] w-32 h-20 bg-gray-200/60 rounded" />
                    <div className="absolute top-[20%] left-[70%] w-20 h-24 bg-gray-200/60 rounded" />
                    <div className="absolute top-[70%] left-[15%] w-28 h-16 bg-gray-200/60 rounded" />

                    {/* Center marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
                        <div className="flex flex-col items-center animate-bounce">
                            <div className="w-8 h-8 bg-brand rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                                <span className="text-white text-xs">📍</span>
                            </div>
                            <div className="w-2 h-2 bg-brand/30 rounded-full mt-1" />
                        </div>
                    </div>

                    {/* Simulated markers */}
                    {markers.map((marker, i) => (
                        <div
                            key={i}
                            className="absolute z-10"
                            style={{ top: `${30 + i * 20}%`, left: `${20 + i * 25}%` }}
                        >
                            <div className="w-6 h-6 bg-navy rounded-full border-2 border-white shadow-md flex items-center justify-center">
                                <span className="text-white text-[10px]">⛽</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <p className="text-sm text-gray-500">Map unavailable</p>
                </div>
            )}
        </div>
    )
}
