import { MapPin, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar({ title = 'FuelRescue', showLocation = false, location = 'Current Location' }) {
    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="flex items-center justify-between px-5 py-3">
                {/* Left: Logo & Location */}
                <div className="flex items-center gap-3">
                    <Link to="/home" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-bold">⛽</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{title}</span>
                    </Link>
                </div>

                {/* Center: Location (optional) */}
                {showLocation && (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors max-w-[200px]">
                        <MapPin size={14} className="text-brand shrink-0" />
                        <span className="truncate">{location}</span>
                    </button>
                )}

                {/* Right: Notifications */}
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full"></span>
                </button>
            </div>
        </nav>
    )
}
