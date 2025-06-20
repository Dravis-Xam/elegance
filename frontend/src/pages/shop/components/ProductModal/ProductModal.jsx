import React from 'react';
import './ProductModal.css';

const ProductModal = ({ 
    product, 
    isInCart, 
    onAddToCart, 
    onRemoveFromCart, 
    onClose 
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Close Button */}
                <button onClick={onClose} className="modal-close">
                    &times;
                </button>

                {/* Product Content */}
                <div className="product-content">
                    {/* Full-height Thumbnail on the left */}
                    <div className="product-thumbnail">
                        <img src={product.thumbnail[0]} alt={product.name} />
                    </div>

                    {/* All details on the right */}
                    <div className="product-details">
                        <h2 className="product-title">{product.name}</h2>
                        
                        <div className="product-category">{product.category}</div>
                        
                        <div className="attributes-list">
                            {product.attributes.map((attr, index) => (
                                <small key={index} className="attribute-item">{attr}</small>
                            ))}
                        </div>
                        
                        <div className="product-price">${product.price.toFixed(2)}</div>

                        {/* Pill-shaped toggle button */}
                        <div className="pill-toggle">
                            <button
                                onClick={onAddToCart}
                                className={`pill-option ${!isInCart ? 'active' : ''}`}
                            >
                                Add to cart
                            </button>
                            <button
                                onClick={onRemoveFromCart}
                                className={`pill-option ${isInCart ? 'active' : ''}`}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;