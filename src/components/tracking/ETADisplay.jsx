import { Clock, MapPin } from 'lucide-react'

/**
 * Large animated ETA display overlay for the tracking page
 *
 * @param {string} eta - e.g. "12 mins"
 * @param {string|number} distance - e.g. "2.3 km" or meters
 * @param {string} status - order status text
 */
export default function ETADisplay({ eta, distance, status }) {
    const formattedDistance =
        typeof distance === 'number'
            ? distance >= 1000
                ? `${(distance / 1000).toFixed(1)} km`
                : `${Math.round(distance)} m`
            : distance || '—'

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-5 py-4">
            {/* Status badge */}
            {status && (
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-600">{status}</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                {/* ETA */}
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
                        <Clock size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Arriving in</p>
                        <p className="text-xl font-bold text-gray-900">{eta || 'Calculating...'}</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-12 bg-gray-200" />

                {/* Distance */}
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                        <MapPin size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Distance</p>
                        <p className="text-xl font-bold text-gray-900">{formattedDistance}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
