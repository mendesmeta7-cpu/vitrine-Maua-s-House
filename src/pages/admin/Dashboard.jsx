// Trigger Vercel Deployment Update
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../services/productService";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../../services/orderService";
import { uploadImage } from "../../services/storageService";
import { LogOut, Plus, Edit, Trash, X, Upload, LayoutDashboard, ShoppingBag, CheckCircle, AlertTriangle, Truck, History } from "lucide-react";

// Categories Configuration (Shared with Frontend ideally, but duplicated for now for simplicity)
const CATEGORIES = [
    { id: 'innovations', label: 'Célébrations & Événements' },
    { id: 'ceremonies', label: 'Hommages & Souvenirs' },
    { id: 'amour', label: 'Amour & Émotions' }
];

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // State
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("products"); // products | orders
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        currency: "USD", // Default currency
        category: "innovations",
        description: "",
        imageFile: null,
        imageUrl: ""
    });
    const [formLoading, setFormLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(""); // Feedback for user

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Load Data
    useEffect(() => {
        if (activeTab === "products") {
            loadProducts();
        } else {
            loadOrders();
        }
    }, [activeTab]);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to load products:", err);
            setError("Impossible de charger les produits. Vérifiez votre connexion.");
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllOrders();
            // Global pending count (status === 'paid')
            const globalPending = data.filter(order => order.status === 'paid');
            setPendingCount(globalPending.length);

            // Filter based on active tab
            if (activeTab === "orders") {
                setOrders(globalPending);
            } else if (activeTab === "history") {
                const deliveredOrders = data.filter(order => order.status === 'delivered');
                setOrders(deliveredOrders);
            }
        } catch (err) {
            console.error("Failed to load orders:", err);
            setError("Impossible de charger les commandes.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette archive ?")) {
            try {
                await deleteOrder(orderId);
                loadOrders(); // Refresh list
            } catch (err) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    const handleDeliver = async (orderId) => {
        if (window.confirm("Confirmer la livraison de cette commande ? Elle sera archivée.")) {
            try {
                await updateOrderStatus(orderId, 'delivered');
                loadOrders(); // Refresh list
            } catch (err) {
                alert("Erreur lors de la mise à jour du statut.");
            }
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    // Modal Handlers
    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ name: "", price: "", currency: "USD", category: "innovations", description: "", imageFile: null, imageUrl: "" });
        setLoadingStatus("");
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            currency: product.currency || "USD",
            category: product.category,
            description: product.description || "",
            imageUrl: product.imageUrl || "",
            imageFile: null
        });
        setLoadingStatus("");
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    // CRUD Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setLoadingStatus("Initialisation...");
        setError(null);

        // Safety Timeout (30s)
        const timeoutId = setTimeout(() => {
            setFormLoading(false);
            setLoadingStatus("");
            alert("L'opération prend trop de temps. Vérifiez votre connexion internet ou la taille de l'image.");
        }, 30000);

        try {
            // 1. Validation Image Size
            if (formData.imageFile && formData.imageFile.size > MAX_FILE_SIZE) {
                clearTimeout(timeoutId);
                alert("L'image est trop volumineuse (Max 5MB).");
                setFormLoading(false);
                setLoadingStatus("");
                return;
            }

            let finalImageUrl = formData.imageUrl;

            // 2. Image Upload
            if (formData.imageFile) {
                setLoadingStatus("Envoi de l'image en cours...");
                try {
                    finalImageUrl = await uploadImage(formData.imageFile);
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    throw new Error("Échec de l'envoi de l'image. Vérifiez votre connexion.");
                }
            }

            // 3. Firestore Write
            setLoadingStatus("Sauvegarde des données...");

            const productPayload = {
                name: formData.name,
                price: Number(formData.price),
                currency: formData.currency,
                category: formData.category,
                description: formData.description,
                imageUrl: finalImageUrl,
                updatedAt: new Date()
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productPayload);
                clearTimeout(timeoutId); // Clear timeout on success
                alert("Produit mis à jour avec succès !");
            } else {
                await addProduct({ ...productPayload, createdAt: new Date() });
                clearTimeout(timeoutId); // Clear timeout on success
                alert("Produit ajouté avec succès !");
            }

            closeModal();
            setLoadingStatus("Rafraîchissement...");
            loadProducts();
        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Error saving product:", error);
            alert(`Erreur : ${error.message || "Une erreur est survenue."}`);
        } finally {
            setFormLoading(false);
            setLoadingStatus("");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            await deleteProduct(id);
            loadProducts();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-maua-dark text-white p-2 rounded-lg">
                        <LayoutDashboard size={20} />
                    </div>
                    <h1 className="text-xl font-serif font-bold text-gray-800">Maua's Admin</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={async () => {
                            const start = Date.now();
                            try {
                                alert("Test 1/3: Connexion Base de données (Lecture)...");
                                await getProducts();

                                alert("Test 2/3: Test d'écriture (Ajout produit test)...");
                                // Test Write
                                const testId = await addProduct({
                                    name: "Test Connection",
                                    price: 0,
                                    category: "innovations",
                                    description: "Test delete me",
                                    createdAt: new Date()
                                });
                                await deleteProduct(testId);

                                alert("Test 3/3: Envoi Fichier (Storage)...");
                                // Test upload small blob
                                const blob = new Blob(["test"], { type: "text/plain" });
                                const file = new File([blob], "test_connection.txt", { type: "text/plain" });
                                await uploadImage(file);

                                alert("SUCCÈS TOTAL !\nTout fonctionne (Lecture, Écriture, Storage).");
                            } catch (e) {
                                console.error(e);
                                alert("ÉCHEC DU TEST :\n" + e.message + "\n\nCode: " + e.code + "\n\nConsultez la console (F12) pour plus de détails.");
                            }
                        }}
                        className="text-maua-primary hover:text-maua-primary-dark text-sm font-medium underline"
                    >
                        Tester la connexion (Complet)
                    </button>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium transition-colors">
                        <LogOut size={18} /> Déconnexion
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 shadow-sm">
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`pb-3 px-2 font-medium text-sm transition-colors relative ${activeTab === "products" ? "text-maua-dark" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Gestion des Fleurs
                        {activeTab === "products" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-maua-dark rounded-t-full"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`pb-3 px-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${activeTab === "orders" ? "text-maua-dark" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Livraisons en attente
                        {pendingCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-sm">
                                {pendingCount}
                            </span>
                        )}
                        {activeTab === "orders" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-maua-dark rounded-t-full"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`pb-3 px-2 font-medium text-sm transition-colors relative ${activeTab === "history" ? "text-maua-dark" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Historique
                        {activeTab === "history" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-maua-dark rounded-t-full"></span>}
                    </button>
                </div>

                {activeTab === "products" ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Vos Produits ({products.length})</h2>
                            <button onClick={openAddModal} className="bg-maua-primary hover:bg-maua-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
                                <Plus size={18} /> Ajouter une fleur
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Chargement...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                                        <div className="relative h-48 bg-gray-100">
                                            <img src={product.imageUrl || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover" />
                                            <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm">
                                                {CATEGORIES.find(c => c.id === product.category)?.label || product.category}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-serif font-bold text-lg text-gray-800 line-clamp-1">{product.name}</h3>
                                                <span className="text-maua-primary font-bold">{product.price} {product.currency || "$"}</span>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{product.description}</p>

                                            <div className="flex gap-2 pt-2 border-t border-gray-50">
                                                <button onClick={() => openEditModal(product)} className="flex-1 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                                    <Edit size={16} /> Éditer
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="flex-1 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                                    <Trash size={16} /> Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                {activeTab === "orders" ? <Truck className="text-maua-primary" /> : <History className="text-maua-primary" />}
                                {activeTab === "orders" ? "Livraisons en attente" : "Historique des commandes"} ({orders.length})
                            </h2>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Chargement...</div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-500" size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Tout est à jour !</h3>
                                <p className="text-gray-500">Aucune commande {activeTab === "orders" ? "en attente de livraison" : "dans l'historique"}.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-600">
                                        <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
                                            <tr>
                                                <th className="px-6 py-4">Client</th>
                                                <th className="px-6 py-4">Produit</th>
                                                <th className="px-6 py-4">Validation Paiement</th>
                                                <th className="px-6 py-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {orders.map((order) => {
                                                const isPriceValid = order.catalog_price === order.paid_amount;
                                                return (
                                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-gray-900">{order.customerName}</div>
                                                            <div className="text-xs">{order.phone}</div>
                                                            <div className="text-xs text-gray-400">{order.address}</div>
                                                            {order.message && (
                                                                <div className="mt-2 text-xs italic text-stone-500 bg-stone-50 p-2 rounded border border-stone-100 max-w-xs">
                                                                    "{order.message}"
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-gray-900">{order.productName}</div>
                                                            <div className="text-xs text-gray-500">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${isPriceValid ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                                                                {isPriceValid ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                                                <span className="font-bold">
                                                                    {order.paid_amount} {order.currency || "$"} Reçu
                                                                </span>
                                                            </div>
                                                            {!isPriceValid && (
                                                                <div className="text-xs text-red-500 mt-1 pl-1">
                                                                    Prix catalogue : {order.catalog_price} {order.currency || "$"}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {activeTab === "orders" ? (
                                                                <button
                                                                    onClick={() => handleDeliver(order.id)}
                                                                    className="bg-maua-dark hover:bg-maua-primary text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                                                                >
                                                                    <Truck size={14} />
                                                                    Livrer
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleDeleteOrder(order.id)}
                                                                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                                                                >
                                                                    <Trash size={14} />
                                                                    Supprimer
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main >

            {/* Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-serif font-bold text-gray-800">
                                    {editingProduct ? "Modifier la fleur" : "Ajouter une nouvelle fleur"}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du bouquet</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maua-primary outline-none"
                                                placeholder="Ex: Rose Éternelle"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maua-primary outline-none"
                                                    placeholder="50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                                                <select
                                                    value={formData.currency}
                                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maua-primary outline-none"
                                                >
                                                    <option value="USD">USD ($)</option>
                                                    <option value="CDF">CDF (FC)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maua-primary outline-none"
                                            >
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center h-48 hover:bg-gray-50 transition-colors relative cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        setFormData({ ...formData, imageFile: e.target.files[0] });
                                                    }
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />

                                            {(formData.imageFile || formData.imageUrl) ? (
                                                <img
                                                    src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.imageUrl}
                                                    alt="Preview"
                                                    className="h-full object-contain"
                                                />
                                            ) : (
                                                <>
                                                    <Upload className="text-gray-400 mb-2" size={24} />
                                                    <span className="text-sm text-gray-500">Cliquez pour uploader une image</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maua-primary outline-none"
                                        placeholder="Description détaillée du produit..."
                                    ></textarea>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="px-6 py-2 rounded-lg bg-maua-dark text-white font-medium hover:bg-maua-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {formLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                        {formLoading ? (loadingStatus || "Traitement...") : (editingProduct ? "Mettre à jour" : "Sauvegarder")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminDashboard;
