import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'

export default function RegisterPage() {
    const { loginWithGoogle, registerWithEmail } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState('')

    const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

    const handleGoogleRegister = async () => {
        setError('')
        setGoogleLoading(true)
        try {
            await loginWithGoogle()
            navigate('/')
        } catch (err) {
            setError(err.message || 'Google sign-up failed.')
        } finally {
            setGoogleLoading(false)
        }
    }

    const validate = () => {
        if (!form.name.trim()) return 'Please enter your name.'
        if (!form.email.trim()) return 'Please enter your email.'
        if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email.'
        if (!form.phone.trim()) return 'Please enter your phone number.'
        if (form.password.length < 6) return 'Password must be at least 6 characters.'
        if (form.password !== form.confirmPassword) return 'Passwords do not match.'
        return null
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }
        setError('')
        setLoading(true)
        try {
            await registerWithEmail(form.email, form.password, form.name)
            navigate('/')
        } catch (err) {
            const msg = err.code === 'auth/email-already-in-use'
                ? 'An account with this email already exists.'
                : err.message || 'Registration failed.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left: Branding (desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-dark relative overflow-hidden">
                <div className="relative z-10 flex flex-col justify-center px-16">
                    <Link to="/landing" className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                            <span className="text-2xl">⛽</span>
                        </div>
                        <span className="text-2xl font-bold text-white">FuelRescue</span>
                    </Link>
                    <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Join the fuel<br />revolution.
                    </h1>
                    <p className="text-white/60 text-lg max-w-sm">
                        Whether you need fuel or supply it — we&apos;ve got you covered.
                    </p>
                    <div className="flex gap-8 mt-12">
                        <div>
                            <p className="text-3xl font-bold text-white">10K+</p>
                            <p className="text-sm text-white/50">Deliveries</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">500+</p>
                            <p className="text-sm text-white/50">Stations</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">15 min</p>
                            <p className="text-sm text-white/50">Avg. delivery</p>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
                <div className="absolute top-40 -left-10 w-48 h-48 bg-brand/10 rounded-full" />
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <Link to="/landing" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                                <span className="text-white text-lg">⛽</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">FuelRescue</span>
                        </Link>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>
                    <p className="text-gray-500 text-sm mb-6">Start getting fuel delivered in minutes</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 flex items-start gap-2 animate-fade-in">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Google */}
                    <button
                        onClick={handleGoogleRegister}
                        disabled={googleLoading}
                        className="btn btn-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 mb-5 gap-3"
                    >
                        {googleLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                            </svg>
                        )}
                        {googleLoading ? 'Signing up...' : 'Continue with Google'}
                    </button>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">or register with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-3.5">
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => updateForm('name', e.target.value)}
                                placeholder="Full Name"
                                className="input-field pl-11"
                            />
                        </div>

                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => updateForm('email', e.target.value)}
                                placeholder="Email address"
                                className="input-field pl-11"
                            />
                        </div>

                        <div className="relative">
                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => updateForm('phone', e.target.value)}
                                placeholder="Phone Number"
                                className="input-field pl-11"
                            />
                        </div>

                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => updateForm('password', e.target.value)}
                                placeholder="Password (min 6 chars)"
                                className="input-field pl-11 pr-11"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => updateForm('confirmPassword', e.target.value)}
                                placeholder="Confirm Password"
                                className="input-field pl-11"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-full btn-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
