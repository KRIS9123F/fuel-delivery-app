import { useState } from 'react'
import { User, Mail, Lock, Phone, Building2, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RegisterForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', role: 'customer', stationName: '', license: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const update = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        onSubmit?.(formData)
        setLoading(false)
    }

    const isStation = formData.role === 'station'

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, role: 'customer' }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${!isStation ? 'bg-white text-brand shadow-sm' : 'text-gray-500'
                        }`}
                >
                    Customer
                </button>
                <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, role: 'station' }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isStation ? 'bg-white text-brand shadow-sm' : 'text-gray-500'
                        }`}
                >
                    Fuel Station
                </button>
            </div>

            {/* Name */}
            <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text" value={formData.name} onChange={update('name')}
                    placeholder="Full name" required className="input-field pl-11"
                />
            </div>

            {/* Email */}
            <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="email" value={formData.email} onChange={update('email')}
                    placeholder="Email address" required className="input-field pl-11"
                />
            </div>

            {/* Phone */}
            <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="tel" value={formData.phone} onChange={update('phone')}
                    placeholder="Phone number" required className="input-field pl-11"
                />
            </div>

            {/* Password */}
            <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type={showPassword ? 'text' : 'password'} value={formData.password} onChange={update('password')}
                    placeholder="Create password" required className="input-field pl-11 pr-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Station-only fields */}
            {isStation && (
                <div className="space-y-4 pt-2 border-t border-gray-100 mt-4">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Station Details</p>
                    <div className="relative">
                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text" value={formData.stationName} onChange={update('stationName')}
                            placeholder="Station name" required className="input-field pl-11"
                        />
                    </div>
                    <input
                        type="text" value={formData.license} onChange={update('license')}
                        placeholder="License number" required className="input-field"
                    />
                </div>
            )}

            {/* Submit */}
            <button
                type="submit" disabled={loading}
                className="btn btn-primary btn-full btn-lg mt-6"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                    </span>
                ) : 'Create Account'}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-brand font-semibold hover:underline">
                    Sign In
                </Link>
            </p>
        </form>
    )
}
