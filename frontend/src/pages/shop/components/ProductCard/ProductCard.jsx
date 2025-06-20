import './ProductCard.css';
import AttributeBadge from '../AttributeBadge/AttributeBadge';
import { useState, useEffect } from 'react';
import ProductModal from '../ProductModal/ProductModal';
import { useCart } from '../../../../modules/CartContext';

function ProductCard({ product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [count, setCount] = useState(1); // default quantity to 1
    const { cartItems, addToCart, removeFromCart } = useCart();

    const createCartItem = (product, amount) => ({
        name: product.name,
        category: product.category,
        attributes: Array.isArray(product.attributes) ? [...product.attributes] : [],
        price: product.price,
        unitAmount: Array.isArray(product.unitAmount) ? [...product.unitAmount] : [],
        amountInStock: product.amountInStock,
        brand: product.brand,
        thumbnail: product.thumbnail,
        amount
    });

    const handleCardClick = () => {
        setIsModalOpen(true);
    };

    const handleAddToCart = () => {
        const newCartItem = createCartItem(product, count);
        setIsInCart(true);
        setIsModalOpen(false);
        addToCart(newCartItem);
    };

    const handleRemoveFromCart = () => {
        const cartItemToRemove = createCartItem(product, count);
        setIsInCart(false);
        setIsModalOpen(false);
        removeFromCart(cartItemToRemove);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="listing-card">
            <div onClick={handleCardClick}>
                <img src={product?.thumbnail[0]} alt={product?.name} className="img-fluid" />
            </div>
            <div className="listing-details">
                <h3>{product?.name}</h3>
                <p>{product?.category}</p>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    {product?.attributes?.map((attribute, index) => (
                        <AttributeBadge attribute={attribute} key={index} />
                    ))}
                </div>
                <p className="price">${product?.price?.toFixed(2)}</p>
                <button className="get btn-secondary" onClick={handleCardClick}>
                    {isInCart ? 'In Cart' : 'Get'}
                </button>
            </div>

            {isModalOpen && (
                <ProductModal
                    product={product}
                    isInCart={isInCart}
                    count={count}
                    setCount={setCount}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default ProductCard;
