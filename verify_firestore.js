import { getProducts } from './src/services/productService.js';
import { db } from './src/firebase.js';

async function verifyData() {
    console.log("Démarrage de la vérification...");
    try {
        const products = await getProducts();
        console.log(`Succès ! ${products.length} produits trouvés.`);
        if (products.length > 0) {
            console.log("Exemple de produit:", JSON.stringify(products[0], null, 2));
        } else {
            console.log("Base de données vide. Veuillez ajouter des produits via /admin.");
        }
    } catch (error) {
        console.error("Erreur de connexion:", error);
    }
    process.exit(0);
}

verifyData();
