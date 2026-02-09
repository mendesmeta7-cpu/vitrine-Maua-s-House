import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ORDERS_COLLECTION = "orders";

export const createOrder = async (orderData) => {
    try {
        const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
            ...orderData,
            status: 'to_prepare',
            paymentStatus: 'pending',
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating order: ", error);
        throw error;
    }
};
