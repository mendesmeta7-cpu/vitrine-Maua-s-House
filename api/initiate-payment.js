import { v4 as uuidv4 } from 'uuid';
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
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { amount, currency, operator, phoneNumber, orderId } = req.body;

    if (!amount || !operator || !phoneNumber || !orderId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const depositId = uuidv4();
    const token = process.env.PAWAPAY_TOKEN;

    if (!token) {
        console.error("PAWAPAY_TOKEN is invalid");
        return res.status(500).json({ message: "Server Configuration Error" });
    }

    try {
        // Save depositId to Firestore BEFORE initiating payment to ensure webhook can find it
        await db.collection('orders').doc(orderId).update({
            'paymentInfo.depositId': depositId,
            'paymentInfo.operator': operator,
            'paymentInfo.phoneNumber': phoneNumber,
            'paymentInfo.initiatedAt': new Date().toISOString(),
            status: 'pending_payment'
        });

        // Force clean phone number (remove +, spaces, etc)
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        // Force amount to string without decimals
        const formattedAmount = Math.floor(Number(amount)).toString();

        const payload = {
            depositId: depositId,
            amount: formattedAmount,
            currency: "CDF",
            correspondent: operator, // VODACOM_MPESA_COD, AIRTEL_COD, ORANGE_COD
            payer: {
                type: "MMO",
                accountDetails: {
                    phoneNumber: cleanPhone,
                    provider: operator
                }
            }
        };

        console.log("Initiating PawaPay deposit:", JSON.stringify(payload));

        const response = await fetch('https://api.sandbox.pawapay.io/v2/deposits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("PawaPay Error:", data);

            return res.status(response.status).json({
                message: data.message || 'Payment initiation failed',
                details: data
            });
        }

        // Success
        return res.status(200).json({
            status: 'PENDING',
            depositId: depositId,
            message: 'Payment initiated successfully'
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
