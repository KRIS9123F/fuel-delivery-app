/**
 * Firestore Data Import Script
 *
 * Usage: node scripts/importData.js
 *
 * Imports fuel stations and delivery persons into Firestore.
 * Requires Firebase config to be set in environment or hardcoded.
 *
 * NOTE: This uses the Firebase Admin SDK or the client SDK.
 * For simplicity, this uses the client SDK with manual auth.
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'
import { readFileSync } from 'fs'

// ⚠️ Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyD-A5cVXy4zR8qFd-ou-5-_l3Ddf43hakM',
    authDomain: 'fuel-delivery-a5a94.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'fuel-delivery-a5a94',
    storageBucket: 'fuel-delivery-a5a94.firebasestorage.app',
    messagingSenderId: '161292147599',
    appId: '1:161292147599:web:36ea940d4414e1c44ec9fa',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// ───── Import Fuel Stations from CSV ─────
async function importStations() {
    console.log('📦 Importing fuel stations...')

    const csv = readFileSync('./data/fuel_stations.csv', 'utf-8')
    const lines = csv.trim().split('\n').slice(1) // skip header

    for (let i = 0; i < lines.length; i++) {
        // Simple CSV parsing (handles quoted fields)
        const fields = lines[i].match(/(".*?"|[^,]+)/g).map((f) => f.replace(/^"|"$/g, ''))

        const [name, brand, lat, lng, address, city, state, pincode, petrolPrice, dieselPrice, hasCng, cngPrice] = fields

        const stationId = `STN-${String(i + 1).padStart(3, '0')}`
        const data = {
            name,
            brandName: brand,
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            address,
            city,
            state,
            pincode,
            fuelTypes: {
                petrol: { available: true, pricePerLiter: parseFloat(petrolPrice) || 106.5, stock: 5000 },
                diesel: { available: true, pricePerLiter: parseFloat(dieselPrice) || 95.8, stock: 5000 },
                cng: {
                    available: hasCng === 'yes',
                    pricePerLiter: parseFloat(cngPrice) || 0,
                    stock: hasCng === 'yes' ? 3000 : 0,
                },
            },
            deliveryRadius: 10,
            deliveryCharge: 100,
            isOnline: true,
            rating: 4.0 + Math.random() * 0.9,
            totalDeliveries: Math.floor(Math.random() * 500),
            operatingHours: { open: '06:00', close: '22:00' },
            ownerId: 'default_owner',
            deliveryPersons: [],
            createdAt: new Date(),
        }

        try {
            await setDoc(doc(db, 'fuelStations', stationId), data)
            console.log(`  ✅ ${stationId}: ${name}`)
        } catch (err) {
            console.error(`  ❌ ${name}:`, err.message)
        }
    }
}

// ───── Import Delivery Persons ─────
async function importDeliveryPersons() {
    console.log('\n🏍️ Importing delivery persons...')

    const persons = [
        { name: 'Rajesh Kumar', phone: '+919876543210', vehicle: 'bike', plate: 'KA 01 AB 1234', station: 'STN-001', lat: 12.938, lng: 77.626, photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { name: 'Priya Sharma', phone: '+919876543211', vehicle: 'scooter', plate: 'KA 02 CD 5678', station: 'STN-002', lat: 12.973, lng: 77.643, photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { name: 'Suresh Yadav', phone: '+919876543212', vehicle: 'bike', plate: 'KA 03 EF 9012', station: 'STN-001', lat: 12.934, lng: 77.62, photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { name: 'Amit Verma', phone: '+919876543213', vehicle: 'van', plate: 'KA 04 GH 3456', station: 'STN-004', lat: 12.915, lng: 77.647, photo: 'https://randomuser.me/api/portraits/men/67.jpg' },
        { name: 'Kavita Singh', phone: '+919876543214', vehicle: 'scooter', plate: 'KA 05 IJ 7890', station: 'STN-003', lat: 12.968, lng: 77.748, photo: 'https://randomuser.me/api/portraits/women/68.jpg' },
    ]

    for (let i = 0; i < persons.length; i++) {
        const p = persons[i]
        const id = `DEL-${String(i + 1).padStart(3, '0')}`
        const data = {
            uid: id,
            name: p.name,
            phoneNumber: p.phone,
            vehicleType: p.vehicle,
            vehicleNumber: p.plate,
            stationId: p.station,
            currentLocation: { lat: p.lat, lng: p.lng },
            isAvailable: true,
            isOnline: true,
            currentOrderId: null,
            rating: 4.0 + Math.random() * 0.9,
            totalDeliveries: Math.floor(100 + Math.random() * 400),
            photoURL: p.photo,
            updatedAt: new Date(),
        }

        try {
            await setDoc(doc(db, 'deliveryPersons', id), data)
            console.log(`  ✅ ${id}: ${p.name}`)
        } catch (err) {
            console.error(`  ❌ ${p.name}:`, err.message)
        }
    }
}

// ───── Run ─────
async function main() {
    console.log('🚀 FuelRescue Data Import\n')
    await importStations()
    await importDeliveryPersons()
    console.log('\n🎉 Import complete!')
    process.exit(0)
}

main().catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
})
