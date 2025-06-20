import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [paymentInfo, setPaymentInfo] = useState({});
    const [deliveryInfo, setDeliveryInfo] = useState({});

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            localStorage.removeItem("cart");
        }
    }, [cart]);

    const addToCart = (item) => {
        // Ensure item has required fields
        if (
            item.name &&
            item.category &&
            Array.isArray(item.attributes) &&
            typeof item.price === "number" &&
            Array.isArray(item.unitAmount) &&
            typeof item.amountInStock === "number"
        ) {
            setCart((prev) => [...prev, item]);
        } else {
            console.warn("Invalid item structure:", item);
        }
    };

    const removeFromCart = (itemToRemove) => {
        setCart((prevCart) => {
            const index = prevCart.findIndex(
                (item) =>
                    item.brand === itemToRemove.brand &&
                    item.category === itemToRemove.category &&
                    item.price === itemToRemove.price &&
                    JSON.stringify(item.attributes) === JSON.stringify(itemToRemove.attributes) &&
                    JSON.stringify(item.unitAmount) === JSON.stringify(itemToRemove.unitAmount)
            );

            if (index !== -1) {
                const newCart = [...prevCart];
                newCart.splice(index, 1);
                return newCart;
            }

            return prevCart;
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                paymentInfo,
                setPaymentInfo,
                deliveryInfo,
                setDeliveryInfo,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
