import { Phone, MessageSquare, Star } from 'lucide-react'

/**
 * Delivery person info card with call/message actions
 *
 * @param {Object} person - { name, phoneNumber, vehicleType, vehicleNumber, rating, totalDeliveries, photoURL }
 */
export default function DeliveryPersonCard({ person }) {
    if (!person) return null

    const vehicleEmoji = {
        bike: '🏍️',
        scooter: '🛵',
        van: '🚐',
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <div className="flex items-center gap-4">
                {/* Photo */}
                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden shadow-inner flex-shrink-0">
                    {person.photoURL ? (
                        <img
                            src={person.photoURL}
                            alt={person.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                            👤
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 truncate">{person.name}</h3>
                        {person.role === 'Pump Staff' && (
                            <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full flex-shrink-0">PUMP STAFF</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-sm text-amber-500">
                            <Star size={14} fill="currentColor" />
                            {person.rating?.toFixed(1) || '4.5'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                            {person.totalDeliveries || 0} deliveries
                        </span>
                    </div>
                    {person.stationName ? (
                        <p className="text-xs text-gray-400 mt-0.5">
                            🛡️ Staff at {person.stationName}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-400 mt-0.5">
                            {vehicleEmoji[person.vehicleType] || '🏍️'}{' '}
                            {person.vehicleNumber || person.vehicleType}
                        </p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                    <a
                        href={`tel:${person.phoneNumber}`}
                        className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
                        aria-label="Call delivery person"
                    >
                        <Phone size={18} />
                    </a>
                    <a
                        href={`sms:${person.phoneNumber}`}
                        className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                        aria-label="Message delivery person"
                    >
                        <MessageSquare size={18} />
                    </a>
                </div>
            </div>
        </div>
    )
}
