import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import PaymentPage from './pages/PaymentPage'
import AssignmentPage from './pages/AssignmentPage'
import TrackingPage from './pages/TrackingPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import StationDashboard from './pages/StationDashboard'
import DeliveryPersonApp from './pages/DeliveryPersonApp'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner label="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public-only route (redirect if already logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner label="Loading..." />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      <Route path="/assignment" element={<ProtectedRoute><AssignmentPage /></ProtectedRoute>} />
      <Route path="/tracking/:orderId" element={<ProtectedRoute><TrackingPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/station" element={<ProtectedRoute><StationDashboard /></ProtectedRoute>} />
      <Route path="/delivery" element={<ProtectedRoute><DeliveryPersonApp /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}