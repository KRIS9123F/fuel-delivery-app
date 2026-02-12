import { MapPin, Navigation, Search } from 'lucide-react'
import { useState } from 'react'

export default function LocationSearch({ onLocationSelect, placeholder = 'Where do you need fuel?' }) {
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const suggestions = [
        { id: 1, name: 'Current Location', address: 'Use GPS', icon: Navigation, isCurrent: true },
        { id: 2, name: 'Home', address: '123 Main Street, Hyderabad', icon: MapPin },
        { id: 3, name: 'Work', address: '456 Tech Park, Whitefield', icon: MapPin },
    ]

    const handleSelect = (suggestion) => {
        setQuery(suggestion.name)
        setIsFocused(false)
        onLocationSelect?.(suggestion)
    }

    return (
        <div className="relative">
            {/* Search Input */}
            <div className={`flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3.5 border transition-all duration-200 ${isFocused ? 'border-brand ring-4 ring-brand/10 bg-white' : 'border-gray-200'
                }`}>
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setIsFocused(true); }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                    {suggestions.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.isCurrent ? 'bg-brand-50 text-brand' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <Icon size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-sm font-medium ${item.isCurrent ? 'text-brand' : 'text-gray-900'}`}>
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">{item.address}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
