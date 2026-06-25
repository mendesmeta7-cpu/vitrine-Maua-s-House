import admin from 'firebase-admin';

if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", e);
        }
    }
}
const db = admin.firestore();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Vérification de l'authentification (Seul l'admin peut MAJ ou Supprimer des commandes depuis le front)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        await admin.auth().verifyIdToken(token);
    } catch (error) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const { action, orderId, status, additionalData } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: 'orderId is required' });
    }

    try {
        const orderRef = db.collection('orders').doc(orderId);

        if (action === 'delete') {
            await orderRef.delete();
            return res.status(200).json({ success: true, message: 'Order deleted' });
        } else if (action === 'update_status') {
            await orderRef.update({
                status: status,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                ...(additionalData || {})
            });
            return res.status(200).json({ success: true, message: 'Order status updated' });
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
