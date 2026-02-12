import { useState } from 'react'
import { X, Minus, Plus, Fuel } from 'lucide-react'
import { quickQuantities, deliveryCharge } from '../../utils/mockData'

export default function QuantityModal({ isOpen, onClose, fuelType, onConfirm }) {
    const [quantity, setQuantity] = useState(10)

    if (!isOpen || !fuelType) return null

    const fuelCost = fuelType.price * quantity
    const total = fuelCost + deliveryCharge

    const handleConfirm = () => {
        onConfirm({ fuelType, quantity, fuelCost, deliveryCharge, total })
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal (bottom sheet style) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-slide-up shadow-2xl max-h-[85vh] overflow-y-auto">
                {/* Handle */}
                <div className="py-2">
                    <div className="sheet-handle" />
                </div>

                <div className="px-6 pb-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                How much {fuelType.label}?
                            </h3>
                            <p className="text-sm text-gray-400 mt-0.5">
                                {fuelType.emoji} ₹{fuelType.price}/{fuelType.id === 'cng' ? 'kg' : 'L'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="bg-gray-50 rounded-2xl p-5 mb-5">
                        <div className="flex items-center justify-center gap-6">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
                            >
                                <Minus size={20} className="text-gray-600" />
                            </button>
                            <div className="text-center min-w-[100px]">
                                <span className="text-4xl font-bold text-gray-900">{quantity}</span>
                                <p className="text-sm text-gray-400 mt-1">
                                    {fuelType.id === 'cng' ? 'kilograms' : 'liters'}
                                </p>
                            </div>
                            <button
                                onClick={() => setQuantity(Math.min(100, quantity + 1))}
                                className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
                            >
                                <Plus size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Select Buttons */}
                    <div className="flex gap-2 mb-6">
                        {quickQuantities.map((q) => (
                            <button
                                key={q}
                                onClick={() => setQuantity(q)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${quantity === q
                                        ? 'bg-brand text-white shadow-md shadow-brand/25'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {q}{fuelType.id === 'cng' ? 'kg' : 'L'}
                            </button>
                        ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                                {fuelType.label} × {quantity} {fuelType.id === 'cng' ? 'kg' : 'L'}
                            </span>
                            <span className="font-semibold text-gray-900">₹{fuelCost.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Delivery charge</span>
                            <span className="font-semibold text-gray-900">₹{deliveryCharge}</span>
                        </div>
                        <div className="divider" />
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-brand">₹{total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleConfirm}
                        className="btn btn-primary btn-full btn-lg"
                    >
                        <Fuel size={18} className="mr-2" />
                        Continue to Payment — ₹{total.toLocaleString()}
                    </button>
                </div>
            </div>
        </>
    )
}
