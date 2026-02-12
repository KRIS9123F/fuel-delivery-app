import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Clock, Check, X, Filter, ChevronRight, RotateCcw, Truck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { mockOrders } from '../utils/mockData'
import BottomNav from '../components/ui/BottomNav'

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-700', icon: Check },
    assigned: { label: 'Assigned', color: 'bg-purple-100 text-purple-700', icon: Truck },
    on_the_way: { label: 'On the Way', color: 'bg-orange-100 text-orange-700', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: Check },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: X },
}

export default function OrdersPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [tab, setTab] = useState('active')
    const [filter, setFilter] = useState('all')
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadOrders()
    }, [tab])

    const loadOrders = () => {
        setLoading(true)

        // Use mock data for demo — always works
        try {
            const activeStatuses = ['pending', 'accepted', 'assigned', 'on_the_way']
            const pastStatuses = ['delivered', 'cancelled']

            if (tab === 'active') {
                setOrders(mockOrders.filter((o) => activeStatuses.includes(o.status)))
            } else {
                setOrders(mockOrders.filter((o) => pastStatuses.includes(o.status)))
            }
        } catch (err) {
            console.error('Error loading orders:', err)
            setOrders([])
        }

        setLoading(false)
    }

    const filteredOrders =
        filter === 'all'
            ? orders
            : orders.filter((o) => o.status === filter)

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-5 pt-8 pb-4">
                <h1 className="text-xl font-bold text-gray-900 mb-4">My Orders</h1>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                    {['active', 'past'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t === 'active' ? 'Active' : 'Past'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter (past tab only) */}
            {tab === 'past' && (
                <div className="px-5 py-3 flex items-center gap-2">
                    <Filter size={14} className="text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700"
                    >
                        <option value="all">All Orders</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            )}

            {/* Order list */}
            <div className="px-5 py-4 space-y-3">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm text-gray-500 mt-3">Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                        <Package size={48} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">
                            {tab === 'active' ? 'No active orders' : 'No past orders'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Your orders will appear here</p>
                        {tab === 'active' && (
                            <button
                                onClick={() => navigate('/')}
                                className="mt-4 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all"
                            >
                                Order Fuel Now
                            </button>
                        )}
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const config = statusConfig[order.status] || statusConfig.pending
                        const StatusIcon = config.icon

                        return (
                            <div key={order.id} className="card p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">
                                            #{order.id}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {order.date} • {order.time}
                                        </p>
                                    </div>
                                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                                        <StatusIcon size={12} />
                                        {config.label}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {order.fuelType} • {order.quantity}L
                                        </p>
                                        <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                            {order.deliveryAddress || order.location}
                                        </p>
                                    </div>
                                    <p className="font-bold text-lg text-gray-900">
                                        ₹{order.totalAmount || order.total}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    {['pending', 'accepted', 'assigned', 'on_the_way'].includes(order.status) && (
                                        <button
                                            onClick={() => navigate(`/tracking/${order.id}`)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-semibold hover:bg-orange-100 transition-colors"
                                        >
                                            <Truck size={14} />
                                            Track
                                        </button>
                                    )}
                                    {order.status === 'delivered' && (
                                        <button
                                            onClick={() => navigate('/')}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                                        >
                                            <RotateCcw size={14} />
                                            Reorder
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate(`/tracking/${order.id}`)}
                                        className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            <BottomNav />
        </div>
    )
}
