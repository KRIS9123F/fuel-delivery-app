import { useState } from 'react'
import { X } from 'lucide-react'

export default function BottomSheet({ children, isOpen, onClose, title, snapPoints = ['50%', '90%'] }) {
    const [currentSnap, setCurrentSnap] = useState(0)

    if (!isOpen) return null

    const height = snapPoints[currentSnap]

    const handleToggleSnap = () => {
        setCurrentSnap((prev) => (prev + 1) % snapPoints.length)
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className="bottom-sheet animate-slide-up"
                style={{ height }}
            >
                {/* Handle */}
                <div
                    className="cursor-grab active:cursor-grabbing py-2"
                    onClick={handleToggleSnap}
                >
                    <div className="sheet-handle" />
                </div>

                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: `calc(${height} - 80px)` }}>
                    {children}
                </div>
            </div>
        </>
    )
}
