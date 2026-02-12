import { Link } from 'react-router-dom'
import { Fuel, Clock, Shield, MapPin, ChevronRight, Zap, Truck, CheckCircle } from 'lucide-react'

const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Fuel delivered in under 30 minutes' },
    { icon: Shield, title: 'Verified Stations', desc: 'All partner stations are quality-verified' },
    { icon: MapPin, title: 'Live Tracking', desc: 'Track your delivery in real-time on the map' },
    { icon: Clock, title: '24/7 Available', desc: 'Emergency fuel delivery anytime, anywhere' },
]

const steps = [
    { num: '01', title: 'Choose Fuel', desc: 'Select fuel type and quantity', icon: Fuel },
    { num: '02', title: 'Set Location', desc: 'Drop a pin or use GPS', icon: MapPin },
    { num: '03', title: 'Get Delivered', desc: 'Sit back, fuel is on the way', icon: Truck },
]

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Nav */}
            <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <span className="text-white text-lg">⛽</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">FuelRescue</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/login" className="btn btn-ghost text-sm">Sign In</Link>
                    <Link to="/register" className="btn btn-primary text-sm">Get Started</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="bg-gradient-hero px-6 pt-16 pb-24 md:pt-24 md:pb-32">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                                <Zap size={14} />
                                <span>India&apos;s First Fuel Delivery App</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                                Fuel Delivered<br />
                                <span className="text-white/80">To Your Doorstep</span>
                            </h1>
                            <p className="text-lg text-white/80 mb-8 max-w-md">
                                Ran out of fuel? Don&apos;t push your vehicle. Get emergency fuel delivered in minutes.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/register" className="btn btn-lg bg-white text-brand font-bold hover:bg-gray-100 shadow-xl">
                                    Request Fuel Now
                                    <ChevronRight size={18} className="ml-1" />
                                </Link>
                                <Link to="/login" className="btn btn-lg bg-white/10 backdrop-blur text-white border border-white/30 hover:bg-white/20">
                                    I have an account
                                </Link>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="hidden md:flex justify-center">
                            <div className="relative">
                                {/* Phone mockup */}
                                <div className="w-64 h-[500px] bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-3">
                                    <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden shadow-2xl">
                                        <div className="bg-gradient-primary p-4">
                                            <p className="text-white text-sm font-semibold">⛽ FuelRescue</p>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div className="w-full h-32 bg-green-50 rounded-xl flex items-center justify-center">
                                                <MapPin className="text-brand" size={32} />
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-xs text-gray-500">📍 Delivery Location</p>
                                                <p className="text-sm font-medium text-gray-800">Banjara Hills, Hyderabad</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-brand-50 rounded-lg p-2 text-center">
                                                    <p className="text-xs text-brand font-semibold">Petrol</p>
                                                </div>
                                                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                                                    <p className="text-xs text-gray-500">Diesel</p>
                                                </div>
                                            </div>
                                            <div className="bg-brand rounded-xl p-3 text-center">
                                                <p className="text-white text-sm font-bold">Request Fuel — ₹450</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating badges */}
                                <div className="absolute -left-12 top-20 bg-white rounded-2xl shadow-xl p-3 animate-bounce">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Delivered!</p>
                                            <p className="text-[10px] text-gray-400">2 min ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -right-8 bottom-32 bg-white rounded-2xl shadow-xl p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Truck size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">ETA: 12 min</p>
                                            <p className="text-[10px] text-gray-400">On the way</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" className="w-full">
                        <path d="M0 60L60 45C120 30 240 0 360 0C480 0 600 30 720 40C840 50 960 40 1080 30C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-brand text-sm font-bold uppercase tracking-wider mb-2">Simple & Fast</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map(({ num, title, desc, icon: Icon }) => (
                            <div key={num} className="relative group">
                                <div className="card card-hover text-center p-8">
                                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand group-hover:scale-110 transition-all duration-300">
                                        <Icon size={28} className="text-brand group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-xs text-brand font-bold">{num}</span>
                                    <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{title}</h3>
                                    <p className="text-sm text-gray-500">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-brand text-sm font-bold uppercase tracking-wider mb-2">Why Choose Us</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Built for Emergencies</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-start gap-4 card card-hover p-6">
                                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Icon size={22} className="text-brand" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                                    <p className="text-sm text-gray-500">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ready to Never Run Out Again?
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Join thousands of drivers who trust FuelRescue for emergency fuel delivery.
                    </p>
                    <Link to="/register" className="btn btn-primary btn-lg shadow-xl shadow-brand/20">
                        Get Started — It&apos;s Free
                        <ChevronRight size={18} className="ml-1" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">⛽</span>
                        </div>
                        <span className="text-white font-bold">FuelRescue</span>
                    </div>
                    <p className="text-sm">© 2025 FuelRescue. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
