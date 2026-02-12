import { createContext, useContext, useState, useEffect } from 'react'
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    // Google popup sign-in
    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider)
        return result.user
    }

    // Email + password sign-in
    const loginWithEmail = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password)
        return result.user
    }

    // Email + password registration
    const registerWithEmail = async (email, password, displayName) => {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        if (displayName) {
            await updateProfile(result.user, { displayName })
        }
        return result.user
    }

    // Sign out
    const logout = async () => {
        await signOut(auth)
    }

    const value = {
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
