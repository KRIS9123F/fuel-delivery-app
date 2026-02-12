import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Fuel, CheckCircle, Star, Bike } from 'lucide-react'
import { deliveryPerson } from '../utils/mockData'

const stages = [
    { text: 'Searching fuel stations near you...', emoji: '🔍' },
    { text: 'Assigning delivery professional...', emoji: '🏍️' },
    { text: 'Preparing your order...', emoji: '⛽' },
]

export default function AssignmentPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const order = location.state

    const [stage, setStage] = useState(0)
    const [assigned, setAssigned] = useState(false)

    useEffect(() => {
        if (!order) {
            navigate('/')
            return
        }

        // Stage progression: 0→1 at 2s, 1→2 at 4s, assigned at 5s
        const timers = [
            setTimeout(() => setStage(1), 2000),
            setTimeout(() => setStage(2), 4000),
            setTimeout(() => setAssigned(true), 5000),
        ]

        return () => timers.forEach(clearTimeout)
    }, [order, navigate])

    if (!order) return null

    // Assigned success screen
    if (assigned) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 animate-fade-in">
                {/* Success */}
                <div className="mb-8 relative">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Assigned!</h1>
                <p className="text-sm text-gray-400 mb-8">Your fuel is on its way</p>

                {/* Delivery Person Card */}
                <div className="card w-full max-w-sm mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                                {deliveryPerson.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-900">{deliveryPerson.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center gap-0.5">
                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-semibold text-gray-700">{deliveryPerson.rating}</span>
                                </div>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-400">{deliveryPerson.totalDeliveries} deliveries</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <Bike size={12} className="text-gray-400" />
                                <span className="text-xs text-gray-500">{deliveryPerson.vehicle}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Track Button */}
                <button
                    onClick={() => navigate('/tracking/ORD-LIVE', { state: order })}
                    className="btn btn-primary btn-lg btn-full max-w-sm"
                >
                    Track Your Order
                </button>
            </div>
        )
    }

    // Loading animation
    return (
        <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center px-6">
            {/* Animated fuel icon */}
            <div className="relative mb-10">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center animate-pulse-brand">
                    <Fuel size={40} className="text-white" />
                </div>
                {/* Orbiting dots */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand rounded-full" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/40 rounded-full" />
                </div>
            </div>

            {/* Stage Text */}
            <div className="text-center animate-fade-in" key={stage}>
                <p className="text-3xl mb-4">{stages[stage].emoji}</p>
                <h2 className="text-xl font-bold text-white mb-2">{stages[stage].text}</h2>
                <p className="text-white/50 text-sm">This won&apos;t take long</p>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center gap-3 mt-10">
                {stages.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i <= stage ? 'bg-brand w-8' : 'bg-white/20 w-4'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
