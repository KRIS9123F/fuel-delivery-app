export default function LoadingSpinner({ fullScreen = false, message = 'Loading...' }) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="spinner" />
                <p className="mt-4 text-sm text-gray-500 font-medium">{message}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="spinner" />
            <p className="mt-4 text-sm text-gray-500 font-medium">{message}</p>
        </div>
    )
}
