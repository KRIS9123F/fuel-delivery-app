import { Component } from 'react'

/**
 * Error Boundary — catches runtime errors and shows a friendly message
 * instead of a blank white screen.
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('🔴 ErrorBoundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f9fafb',
                    padding: '24px',
                }}>
                    <div style={{
                        maxWidth: '400px',
                        background: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111', marginBottom: '8px' }}>
                            Something went wrong
                        </h2>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                background: '#f97316',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
