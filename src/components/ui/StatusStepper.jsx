import { Check } from 'lucide-react'

const defaultSteps = [
    { label: 'Order Placed', description: 'Your order has been placed' },
    { label: 'Accepted', description: 'Station accepted your order' },
    { label: 'On the Way', description: 'Fuel is being delivered' },
    { label: 'Delivered', description: 'Fuel delivered successfully' },
]

export default function StatusStepper({ steps = defaultSteps, currentStep = 0 }) {
    return (
        <div className="flex flex-col gap-0">
            {steps.map((step, index) => {
                const isDone = index < currentStep
                const isActive = index === currentStep
                const isPending = index > currentStep

                return (
                    <div key={index} className="flex gap-3">
                        {/* Left: dot + line */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`stepper-dot ${isDone ? 'stepper-dot-done' :
                                        isActive ? 'stepper-dot-active animate-pulse-brand' :
                                            'stepper-dot-pending'
                                    }`}
                            >
                                {isDone ? <Check size={14} strokeWidth={3} /> : index + 1}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`stepper-line ${isDone || isActive ? 'bg-brand' : 'bg-gray-200'}`} />
                            )}
                        </div>

                        {/* Right: text */}
                        <div className="pb-6">
                            <p className={`text-sm font-semibold ${isActive ? 'text-brand' : isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.label}
                            </p>
                            <p className={`text-xs mt-0.5 ${isActive || isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                                {step.description}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
