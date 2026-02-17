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
    } else {
        console.error("FIREBASE_SERVICE_ACCOUNT is missing");
    }
}

const db = admin.firestore();

export default async function handler(req, res) {
    // Log the method for debugging
    console.log(`Webhook received with method: ${req.method}`);

    // Handle CORS preflight or PawaPay checks
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        console.error(`Method ${req.method} not allowed`);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const signature = req.headers['x-pawapay-signature'];
    // TODO: Verify signature using your secret if available for security

    const events = req.body;
    // PawaPay might send an array or single object depending on configuration, 
    // but typically webhooks for a specific deposit are single objects. 
    // Adjust based on actual payload structure if it's a list.

    const event = Array.isArray(events) ? events[0] : events;

    console.log("Webhook received:", JSON.stringify(event));

    try {
        const { depositId, status, failCode } = event;

        // We need to find the order associated with this deposit.
        // OPTION 1: Store depositId in order when initiating (Client-side update or separate API step)
        // OPTION 2: PawaPay allows custom metadata? No generic metadata field in simplified payload above.

        // WORKAROUND: In a real app, we should save the 'depositId' to the order in Firestore 
        // immediately after initiation. 
        // For this implementation, we will assume we can't look up by depositId easily 
        // UNLESS we query for it.

        // Let's assume the Client updated the order with depositId, OR 
        // we query all pending orders to find the one with this depositId.

        const ordersRef = db.collection('orders');
        const snapshot = await ordersRef.where('paymentInfo.depositId', '==', depositId).limit(1).get();

        if (snapshot.empty) {
            console.warn(`Order not found for depositId: ${depositId}`);
            // Return 200 to acknowledge receipt even if we can't process it, to stop retries
            return res.status(200).json({ message: 'Order not found' });
        }

        const orderDoc = snapshot.docs[0];
        const currentStatus = orderDoc.data().status;

        if (currentStatus === 'paid') {
            return res.status(200).json({ message: 'Order already paid' });
        }

        let newStatus = currentStatus;
        let paymentData = {
            lastWebhookDate: new Date().toISOString(),
            pawapayStatus: status
        };

        if (status === 'COMPLETED') {
            newStatus = 'paid';
            paymentData.status = 'paid';
            paymentData.paidAt = new Date().toISOString();
        } else if (status === 'FAILED' || status === 'CANCELLED') {
            // Don't change order status to 'failed' if it was 'pending', 
            // to allow retry? Or set to 'payment_failed'?
            // The requirement says: update doc to 'paid' or 'failed'.
            newStatus = 'failed';
            paymentData.failCode = failCode || 'unknown';
        }

        await ordersRef.doc(orderDoc.id).update({
            status: newStatus,
            paymentInfo: {
                ...orderDoc.data().paymentInfo,
                ...paymentData
            }
        });

        console.log(`Order ${orderDoc.id} updated to ${newStatus}`);

        return res.status(200).json({ message: 'Webhook processed' });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
