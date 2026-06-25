import { db, auth } from "../firebase";
import { collection, doc, getDoc, query, orderBy, getDocs } from "firebase/firestore";

const ORDERS_COLLECTION = "orders";

export const createOrder = async (orderData) => {
    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Failed to create order via API');
        }
        
        const data = await response.json();
        return data.id;
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
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : '';

        const response = await fetch('/api/update-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                action: 'update_status',
                orderId,
                status,
                additionalData
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update order status via API');
        }
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
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : '';

        const response = await fetch('/api/update-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                action: 'delete',
                orderId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to delete order via API');
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
};
