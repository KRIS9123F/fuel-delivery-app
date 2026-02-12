import { useState, useEffect } from 'react'
import { Fuel, DollarSign, TrendingUp, Clock, Check, X, Phone, MapPin, ChevronDown, Users, Truck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { listenToStationOrders, updateOrderStatus, assignDeliveryPerson } from '../firebase/orders'
import { getStationDeliveryPersons, updateStationStatus } from '../firebase/stations'
import { mockDeliveryPersons } from '../utils/mockData'
import Navbar from '../components/ui/Navbar'

const mockIncoming = [
    { id: 'ORD-2001', customer: 'Arun Sharma', phone: '+91 97654 32100', fuel: 'Petrol', qty: 5, amount: 531, distance: '2.3 km', location: 'Banjara Hills, Hyderabad', time: '2 min ago', status: 'pending' },
    { id: 'ORD-2002', customer: 'Priya Patel', phone: '+91 88765 43210', fuel: 'Diesel', qty: 10, amount: 927, distance: '4.1 km', location: 'Madhapur, Hyderabad', time: '5 min ago', status: 'pending' },
    { id: 'ORD-2003', customer: 'Vikram Singh', phone: '+91 77654 32100', fuel: 'Petrol', qty: 3, amount: 319, distance: '1.5 km', location: 'Jubilee Hills, Hyderabad', time: '8 min ago', status: 'pending' },
]

export default function StationDashboard() {
    const { user } = useAuth()
    const [isOnline, setIsOnline] = useState(true)
    const [orders, setOrders] = useState([])
    const [deliveryPersons, setDeliveryPersons] = useState([])
    const [stats, setStats] = useState({
        todayOrders: 0,
        revenue: 0,
        active: 0,
        avgTime: '—',
    })
    const [assigningOrder, setAssigningOrder] = useState(null)

    // Listen for incoming orders from Firestore
    useEffect(() => {
        if (!user) return

        const unsub = listenToStationOrders(user.uid, (firestoreOrders) => {
            if (firestoreOrders.length > 0) {
                setOrders(firestoreOrders)
                // Compute stats
                const active = firestoreOrders.filter(o => ['accepted', 'assigned', 'on_the_way'].includes(o.status)).length
                const delivered = firestoreOrders.filter(o => o.status === 'delivered')
                const revenue = firestoreOrders.reduce((sum, o) => sum + (o.totalAmount || o.amount || 0), 0)
                setStats({
                    todayOrders: firestoreOrders.length,
                    revenue,
                    active,
                    avgTime: delivered.length > 0 ? '14m' : '—',
                })
            } else {
                // Mock fallback
                setOrders(mockIncoming)
                setStats({ todayOrders: 24, revenue: 12400, active: 3, avgTime: '14m' })
            }
        })

        // Load delivery persons
        getStationDeliveryPersons(user.uid)
            .then(persons => {
                if (persons.length > 0) setDeliveryPersons(persons)
                else setDeliveryPersons(mockDeliveryPersons.slice(0, 3))
            })
            .catch(() => setDeliveryPersons(mockDeliveryPersons.slice(0, 3)))

        return () => unsub()
    }, [user])

    const handleToggleOnline = () => {
        const next = !isOnline
        setIsOnline(next)
        if (user) {
            updateStationStatus(user.uid, { isOnline: next }).catch(() => { })
        }
    }

    const handleAccept = async (orderId) => {
        try {
            await updateOrderStatus(orderId, 'accepted')
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepted' } : o))
            // Prompt to assign delivery person
            setAssigningOrder(orderId)
        } catch {
            setOrders(prev => prev.filter(o => o.id !== orderId))
        }
    }

    const handleReject = async (orderId) => {
        try {
            await updateOrderStatus(orderId, 'cancelled')
        } catch { /* ignore */ }
        setOrders(prev => prev.filter(o => o.id !== orderId))
    }

    const handleAssign = async (orderId, personId) => {
        try {
            await assignDeliveryPerson(orderId, personId)
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'assigned', deliveryPersonId: personId } : o))
        } catch { /* ignore */ }
        setAssigningOrder(null)
    }

    const pendingOrders = orders.filter(o => o.status === 'pending')
    const activeOrders = orders.filter(o => ['accepted', 'assigned', 'on_the_way'].includes(o.status))

    const statCards = [
        { label: "Today's Orders", value: String(stats.todayOrders), icon: Fuel, color: 'text-brand', bg: 'bg-brand-50' },
        { label: 'Revenue', value: `₹${(stats.revenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active', value: String(stats.active), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Avg Time', value: stats.avgTime, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar title="Station Dashboard" />

            {/* Online Toggle */}
            <div className="bg-white px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">HP Fuel Station</h2>
                        <p className="text-xs text-gray-400">Koramangala Branch</p>
                    </div>
                    <button
                        onClick={handleToggleOnline}
                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isOnline ? 'translate-x-7.5' : 'translate-x-0.5'}`} />
                    </button>
                </div>
                <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    {isOnline ? 'Accepting Orders' : 'Offline'}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 px-5 py-4">
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="card p-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                                <Icon size={18} className={color} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{value}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Deliveries */}
            {activeOrders.length > 0 && (
                <div className="px-5 pb-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Truck size={14} className="text-orange-500" />
                        Active Deliveries ({activeOrders.length})
                    </h3>
                    <div className="space-y-2">
                        {activeOrders.map((order) => (
                            <div key={order.id} className="card p-3 border-l-4 border-l-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">#{order.id?.slice(0, 12)}</p>
                                        <p className="text-xs text-gray-500">{order.customer || order.userName} — {order.fuel || order.fuelType} {order.qty || order.quantity}L</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${order.status === 'on_the_way' ? 'bg-orange-100 text-orange-700' :
                                        order.status === 'assigned' ? 'bg-purple-100 text-purple-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.status === 'on_the_way' ? 'On the Way' : order.status === 'assigned' ? 'Assigned' : 'Accepted'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Incoming Orders */}
            <div className="px-5 pb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Incoming Orders ({pendingOrders.length})</h3>
                    <button className="text-xs text-gray-400 flex items-center gap-0.5">
                        Sort by <ChevronDown size={12} />
                    </button>
                </div>

                {pendingOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 card">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Fuel size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">No incoming orders</p>
                        <p className="text-xs text-gray-300 mt-1">New orders will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingOrders.map((order) => (
                            <div key={order.id} className="card p-4 border-l-4 border-l-brand animate-fade-in">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 bg-brand-50 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-brand">
                                                {(order.customer || order.userName || 'C').charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{order.customer || order.userName}</p>
                                            <p className="text-[10px] text-gray-400">{order.time || 'Just now'} • {order.distance || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">₹{order.amount || order.totalAmount}</p>
                                        <p className="text-[10px] text-gray-400">{order.fuel || order.fuelType} • {order.qty || order.quantity}L</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 mb-3">
                                    <MapPin size={14} className="text-gray-400 shrink-0" />
                                    <p className="text-xs text-gray-600 truncate">{order.location || order.deliveryAddress}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleReject(order.id)}
                                        className="btn btn-sm flex-1 bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
                                    >
                                        <X size={14} /> Decline
                                    </button>
                                    <a href={`tel:${order.phone || order.userPhone}`} className="btn btn-sm flex-none bg-gray-50 text-gray-600 hover:bg-gray-100">
                                        <Phone size={14} />
                                    </a>
                                    <button
                                        onClick={() => handleAccept(order.id)}
                                        className="btn btn-sm flex-1 btn-primary flex items-center gap-1"
                                    >
                                        <Check size={14} /> Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delivery Person Assignment Modal */}
            {assigningOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Assign Delivery Person</h3>
                        <p className="text-sm text-gray-500 mb-4">Select a driver for order #{assigningOrder?.slice(0, 8)}</p>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {deliveryPersons.map((person) => (
                                <button
                                    key={person.id}
                                    onClick={() => handleAssign(assigningOrder, person.id)}
                                    disabled={!person.isAvailable}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${person.isAvailable
                                        ? 'bg-gray-50 hover:bg-orange-50 cursor-pointer'
                                        : 'bg-gray-100 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                        {person.photoURL ? (
                                            <img src={person.photoURL} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg">🏍️</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {person.vehicleType} • ⭐ {person.rating?.toFixed(1)} • {person.totalDeliveries} trips
                                        </p>
                                    </div>
                                    <span className={`w-2.5 h-2.5 rounded-full ${person.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setAssigningOrder(null)}
                            className="w-full mt-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
