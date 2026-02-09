import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, orderBy, getDocs, deleteDoc } from "firebase/firestore";

const ORDERS_COLLECTION = "orders";

export const createOrder = async (orderData) => {
    try {
        const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
            ...orderData,
            status: 'pending', // Changing initial status to pending as requested
            paymentStatus: 'pending',
            catalog_price: Number(orderData.productPrice), // Store catalog price for security check
            paid_amount: Number(orderData.productPrice), // Initially assume full amount is to be paid
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating order: ", error);
        throw error;
    }
};

export const getOrderById = async (orderId) => {
    try {
        const docRef = doc(db, ORDERS_COLLECTION, orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Order not found");
        }
    } catch (error) {
        console.error("Error getting order:", error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status, additionalData = {}) => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            status: status,
            updatedAt: serverTimestamp(),
            ...additionalData
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

export const getAllOrders = async () => {
    try {
        const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};
export const deleteOrder = async (orderId) => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await deleteDoc(orderRef);
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
};
