import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";

const PRODUCTS_COLLECTION = "products";

export const setPromo = async (productId, variantId = null, promoPrice, expiresAt) => {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error("Produit introuvable");

        const product = docSnap.data();
        
        if (variantId) {
            // Appliquer la promo sur une variante spécifique
            const updatedVariants = (product.variants || []).map(v => {
                if (String(v.id) === String(variantId)) {
                    return { ...v, promoPrice: Number(promoPrice), promoExpiresAt: expiresAt };
                }
                return v;
            });
            await updateDoc(docRef, { variants: updatedVariants });
        } else {
            // Appliquer la promo sur le produit de base
            await updateDoc(docRef, { 
                promoPrice: Number(promoPrice), 
                promoExpiresAt: expiresAt 
            });
        }
    } catch (error) {
        console.error("Erreur lors de l'application de la promotion: ", error);
        throw error;
    }
};

export const removePromo = async (productId, variantId = null) => {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error("Produit introuvable");

        const product = docSnap.data();

        if (variantId) {
            const updatedVariants = (product.variants || []).map(v => {
                if (String(v.id) === String(variantId)) {
                    const { promoPrice, promoExpiresAt, ...rest } = v;
                    return rest;
                }
                return v;
            });
            await updateDoc(docRef, { variants: updatedVariants });
        } else {
            await updateDoc(docRef, { 
                promoPrice: deleteField(), 
                promoExpiresAt: deleteField() 
            });
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la promotion: ", error);
        throw error;
    }
};
