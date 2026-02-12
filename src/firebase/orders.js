import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const COLLECTION = 'fuelRequests'

/**
 * Create a new fuel order in Firestore
 * @param {Object} orderData - { userId, userName, userPhone, fuelType, quantity, pricePerLiter, deliveryCharge, totalAmount, deliveryLocation, deliveryAddress, paymentMethod }
 * @returns {string} orderId
 */
export async function createOrder(orderData) {
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...orderData,
        stationId: orderData.stationId || null,
        stationName: orderData.stationName || null,
        deliveryPersonId: null,
        deliveryPersonName: null,
        status: 'pending',
        paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'completed',
        estimatedTime: null,
        actualDeliveryTime: null,
        rating: null,
        feedback: null,
        createdAt: serverTimestamp(),
        acceptedAt: null,
        assignedAt: null,
        deliveredAt: null,
    })
    return docRef.id
}

/**
 * Update order status with appropriate timestamp
 */
export async function updateOrderStatus(orderId, status, extraFields = {}) {
    const timestampMap = {
        accepted: { acceptedAt: serverTimestamp() },
        assigned: { assignedAt: serverTimestamp() },
        delivered: { deliveredAt: serverTimestamp(), actualDeliveryTime: serverTimestamp() },
    }

    await updateDoc(doc(db, COLLECTION, orderId), {
        status,
        ...timestampMap[status],
        ...extraFields,
    })
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId) {
    await updateDoc(doc(db, COLLECTION, orderId), {
        status: 'cancelled',
        paymentStatus: 'failed',
    })
}

/**
 * Assign a delivery person to an order
 */
export async function assignDeliveryPerson(orderId, deliveryPersonId, deliveryPersonName = '') {
    await updateDoc(doc(db, COLLECTION, orderId), {
        deliveryPersonId,
        deliveryPersonName,
        status: 'assigned',
        assignedAt: serverTimestamp(),
    })
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId) {
    const snap = await getDoc(doc(db, COLLECTION, orderId))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/**
 * Get all orders for a user, newest first
 */
export async function getUserOrders(userId, maxResults = 20) {
    const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Get active orders for a user (pending, accepted, assigned, on_the_way)
 */
export async function getActiveOrders(userId) {
    const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        where('status', 'in', ['pending', 'accepted', 'assigned', 'on_the_way'])
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Get pending orders for a station (incoming requests)
 */
export async function getStationPendingOrders(stationId) {
    const q = query(
        collection(db, COLLECTION),
        where('stationId', '==', stationId),
        where('status', 'in', ['pending'])
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Real-time listener for a single order
 * @returns {Function} unsubscribe
 */
export function listenToOrder(orderId, callback) {
    return onSnapshot(doc(db, COLLECTION, orderId), (snap) => {
        if (snap.exists()) {
            callback({ id: snap.id, ...snap.data() })
        } else {
            callback(null)
        }
    })
}

/**
 * Real-time listener for station incoming orders
 * @returns {Function} unsubscribe
 */
export function listenToStationOrders(stationId, callback) {
    const q = query(
        collection(db, COLLECTION),
        where('stationId', '==', stationId),
        where('status', 'in', ['pending', 'accepted', 'assigned', 'on_the_way'])
    )
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
}

/**
 * Real-time listener for delivery person's current order
 * @returns {Function} unsubscribe
 */
export function listenToDeliveryPersonOrder(deliveryPersonId, callback) {
    const q = query(
        collection(db, COLLECTION),
        where('deliveryPersonId', '==', deliveryPersonId),
        where('status', 'in', ['assigned', 'on_the_way'])
    )
    return onSnapshot(q, (snap) => {
        const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callback(orders.length > 0 ? orders[0] : null)
    })
}
