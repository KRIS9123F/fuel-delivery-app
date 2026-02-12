import { User, MapPin, CreditCard, HelpCircle, Info, ChevronRight, LogOut, Settings, Shield, Bell, Globe, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/ui/Navbar'
import BottomNav from '../components/ui/BottomNav'

const menuSections = [
    {
        title: 'Account',
        items: [
            { icon: MapPin, label: 'Saved Locations', desc: 'Home, Work, and more' },
            { icon: CreditCard, label: 'Payment Methods', desc: 'UPI, Cards, Wallets' },
        ],
    },
    {
        title: 'Preferences',
        items: [
            { icon: Bell, label: 'Notifications', desc: 'Push & email alerts', toggle: true },
            { icon: Globe, label: 'Language', desc: 'English' },
            { icon: Moon, label: 'Dark Mode', desc: 'Coming soon', toggle: true, disabled: true },
        ],
    },
    {
        title: 'Support',
        items: [
            { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs, Contact us' },
            { icon: Shield, label: 'Terms & Conditions', desc: 'Legal information' },
            { icon: Info, label: 'About FuelRescue', desc: 'Version 1.0.0' },
        ],
    },
]

export default function ProfilePage() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const displayName = user?.displayName || 'User'
    const email = user?.email || 'user@email.com'
    const photoURL = user?.photoURL
    const phone = user?.phoneNumber || '+91 98765 43210'

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar title="Profile" />

            {/* Profile Header */}
            <div className="bg-white px-5 py-6 mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg shadow-brand/20 shrink-0">
                        {photoURL ? (
                            <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                                <User size={28} className="text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-gray-900 truncate">{displayName}</h2>
                        <p className="text-sm text-gray-500 truncate">{email}</p>
                        <p className="text-xs text-gray-400">{phone}</p>
                    </div>
                    <button className="btn btn-sm btn-outline">Edit</button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-brand-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-brand">5</p>
                        <p className="text-[10px] text-gray-500 font-medium">Orders</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-blue-600">₹9.2K</p>
                        <p className="text-[10px] text-gray-500 font-medium">Total Spent</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-green-600">4.9</p>
                        <p className="text-[10px] text-gray-500 font-medium">Rating</p>
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            {menuSections.map((section) => (
                <div key={section.title} className="bg-white mb-2">
                    <p className="px-5 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {section.title}
                    </p>
                    {section.items.map(({ icon: Icon, label, desc, toggle, disabled }, index) => (
                        <button
                            key={label}
                            disabled={disabled}
                            className={`flex items-center gap-4 w-full px-5 py-3.5 hover:bg-gray-50 transition-colors text-left ${index < section.items.length - 1 ? 'border-b border-gray-50' : ''
                                } ${disabled ? 'opacity-50' : ''}`}
                        >
                            <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                                <Icon size={16} className="text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">{label}</p>
                                <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                            {toggle ? (
                                <div className={`w-10 h-5 rounded-full ${disabled ? 'bg-gray-200' : 'bg-brand'} relative`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${disabled ? 'translate-x-0.5' : 'translate-x-5'}`} />
                                </div>
                            ) : (
                                <ChevronRight size={16} className="text-gray-300" />
                            )}
                        </button>
                    ))}
                </div>
            ))}

            {/* Sign Out */}
            <div className="px-5 mt-4">
                <button
                    onClick={handleLogout}
                    className="btn btn-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
                <p className="text-center text-[10px] text-gray-300 mt-4">FuelRescue v1.0.0</p>
            </div>

            <BottomNav />
        </div>
    )
}
