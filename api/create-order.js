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

    try {
        const orderData = req.body;
        let validPrice = 0;

        if (orderData.items && Array.isArray(orderData.items)) {
            // Traitement d'un panier
            for (let item of orderData.items) {
                // item.id peut être productId ou productId-variantId
                const productId = String(item.id).split('-')[0];
                const productDoc = await db.collection('products').doc(productId).get();
                
                if (productDoc.exists) {
                    const product = productDoc.data();
                    let priceMatch = false;
                    const itemPriceReceived = Number(item.price);
                    
                    if (itemPriceReceived === Number(product.price)) {
                        priceMatch = true;
                    } else if (product.variants) {
                        for (let v of product.variants) {
                            if (Number(v.price) === itemPriceReceived) {
                                priceMatch = true;
                                break;
                            }
                        }
                    }
                    
                    const finalItemPrice = priceMatch ? itemPriceReceived : Number(product.price);
                    validPrice += finalItemPrice * Number(item.quantity || 1);
                }
            }
        } else if (orderData.productId) {
            // Traitement d'un produit unique (achat direct)
            const productDoc = await db.collection('products').doc(orderData.productId).get();
            if (productDoc.exists) {
                const product = productDoc.data();
                let priceMatch = false;
                const priceReceived = Number(orderData.productPrice);
                
                if (priceReceived === Number(product.price)) {
                    priceMatch = true;
                } else if (product.variants) {
                    for (let v of product.variants) {
                        if (Number(v.price) === priceReceived) {
                            priceMatch = true;
                            break;
                        }
                    }
                }
                
                validPrice = priceMatch ? priceReceived : Number(product.price);
            }
        } else {
            validPrice = Number(orderData.productPrice) || 0;
        }

        const newOrder = {
            ...orderData,
            status: 'pending',
            paymentStatus: 'pending',
            catalog_price: validPrice,
            paid_amount: validPrice, // Initie à la même valeur, sera vérifié plus tard
            paymentInfo: {},
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('orders').add(newOrder);
        return res.status(200).json({ id: docRef.id });

    } catch (error) {
        console.error("Error creating order API:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
