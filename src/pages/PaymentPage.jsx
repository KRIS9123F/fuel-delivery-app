import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CreditCard, Smartphone, Banknote, Loader2, CheckCircle } from 'lucide-react'

const paymentMethods = [
    { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm)', icon: Smartphone, desc: 'Instant payment via UPI' },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
    { id: 'cash', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when fuel arrives' },
]

export default function PaymentPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const order = location.state // { fuelType, quantity, fuelCost, deliveryCharge, total }

    const [selectedMethod, setSelectedMethod] = useState('upi')
    const [paying, setPaying] = useState(false)
    const [paid, setPaid] = useState(false)

    if (!order) {
        // No order data — go back to Home
        navigate('/')
        return null
    }

    const handlePay = () => {
        setPaying(true)
        // Mock: 2-second payment processing
        setTimeout(() => {
            setPaying(false)
            setPaid(true)
            // After 1.5s success animation, redirect to assignment
            setTimeout(() => {
                navigate('/assignment', { state: order })
            }, 1500)
        }, 2000)
    }

    // Success State
    if (paid) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
                <div className="animate-bounce mb-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 text-sm">Redirecting to find your delivery...</p>
            </div>
        )
    }

    // Paying State
    if (paying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
                <div className="spinner w-12 h-12 mb-6" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
                <p className="text-gray-400 text-sm">Please wait, do not close this page</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft size={20} className="text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Payment</h1>
                </div>
            </div>

            <div className="px-5 py-5">
                {/* Order Summary */}
                <div className="card mb-5">
                    <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Fuel Type</span>
                            <span className="font-semibold text-gray-900">{order.fuelType.emoji} {order.fuelType.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Quantity</span>
                            <span className="font-semibold text-gray-900">
                                {order.quantity} {order.fuelType.id === 'cng' ? 'kg' : 'Liters'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                Price ({order.fuelType.id === 'cng' ? 'per kg' : 'per liter'})
                            </span>
                            <span className="font-semibold text-gray-900">₹{order.fuelType.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Fuel Cost</span>
                            <span className="font-semibold text-gray-900">₹{order.fuelCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Delivery Charge</span>
                            <span className="font-semibold text-gray-900">₹{order.deliveryCharge}</span>
                        </div>
                        <div className="divider" />
                        <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Grand Total</span>
                            <span className="text-xl font-bold text-brand">₹{order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
                    <div className="space-y-3">
                        {paymentMethods.map(({ id, label, icon: Icon, desc }) => (
                            <button
                                key={id}
                                onClick={() => setSelectedMethod(id)}
                                className={`card w-full text-left flex items-center gap-4 transition-all duration-200 ${selectedMethod === id
                                        ? 'border-brand border-2 bg-brand-50'
                                        : 'hover:shadow-md'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedMethod === id ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <Icon size={22} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-900">{label}</p>
                                    <p className="text-xs text-gray-400">{desc}</p>
                                </div>
                                {/* Radio indicator */}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMethod === id ? 'border-brand' : 'border-gray-300'
                                    }`}>
                                    {selectedMethod === id && (
                                        <div className="w-2.5 h-2.5 bg-brand rounded-full" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pay Button */}
                <button onClick={handlePay} className="btn btn-primary btn-full btn-lg">
                    Pay ₹{order.total.toLocaleString()}
                </button>
            </div>
        </div>
    )
}
