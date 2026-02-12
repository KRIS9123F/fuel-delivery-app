import { Home, ClipboardList, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/orders', label: 'Orders', icon: ClipboardList },
    { path: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div className="bottom-nav pb-[env(safe-area-inset-bottom)]">
            {tabs.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path
                return (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                    >
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                        <span className={isActive ? 'font-semibold' : ''}>{label}</span>
                        {isActive && (
                            <div className="absolute -top-0.5 w-6 h-0.5 bg-brand rounded-full"></div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
