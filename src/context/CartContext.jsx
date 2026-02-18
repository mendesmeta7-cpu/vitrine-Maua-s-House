import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

const MAX_CART_ITEMS = 20;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    const [customerInfo, setCustomerInfo] = useState(() => {
        try {
            const savedInfo = localStorage.getItem('customerInfo');
            return savedInfo ? JSON.parse(savedInfo) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (customerInfo) {
            localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
        } else {
            localStorage.removeItem('customerInfo');
        }
    }, [customerInfo]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const currentTotalQuantity = prevItems.reduce((total, item) => total + item.quantity, 0);

            if (currentTotalQuantity + quantity > MAX_CART_ITEMS) {
                alert(`Le panier est plein (Limite : ${MAX_CART_ITEMS} articles). Impossible d'ajouter plus d'articles.`);
                return prevItems;
            }

            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            if (newQuantity < 1) return prevItems; // Prevent going below 1 (handled by UI usually but good safety)

            const itemToUpdate = prevItems.find(item => item.id === productId);
            if (!itemToUpdate) return prevItems;

            const quantityDifference = newQuantity - itemToUpdate.quantity;
            const currentTotalQuantity = prevItems.reduce((total, item) => total + item.quantity, 0);

            if (quantityDifference > 0 && (currentTotalQuantity + quantityDifference > MAX_CART_ITEMS)) {
                alert(`Limite de ${MAX_CART_ITEMS} articles atteinte dans le panier.`);
                return prevItems;
            }

            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        });
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            updateQuantity,
            cartTotal,
            customerInfo,
            setCustomerInfo
        }}>
            {children}
        </CartContext.Provider>
    );
};
