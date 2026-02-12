import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

// ⚠️ Replace these with your actual Firebase project config
// Get them from: Firebase Console → Project Settings → General → Your apps → Web app
const firebaseConfig = {
    apiKey: "AIzaSyD-A5cVXy4zR8qFd-ou-5-_l3Ddf43hakM",
    authDomain: "fuel-delivery-a5a94.firebaseapp.com",
    projectId: "fuel-delivery-a5a94",
    storageBucket: "fuel-delivery-a5a94.firebasestorage.app",
    messagingSenderId: "161292147599",
    appId: "1:161292147599:web:36ea940d4414e1c44ec9fa",
    databaseURL: "https://fuel-delivery-a5a94-default-rtdb.asia-southeast1.firebasedatabase.app",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)           // Firestore — orders, stations, users
export const rtdb = getDatabase(app)          // Realtime Database — live GPS tracking
export const googleProvider = new GoogleAuthProvider()
export default app
