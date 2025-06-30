import './Cart.css';
import { useEffect, useState } from 'react';
import { useCart } from "../../../../modules/CartContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { toast } from "../../../../modules/ToastStore";
import MoveToTop from '../movetotop/MoveToTop';
import { useAuth } from '../../../../modules/AuthContext';

export default function Cart() {
  const { cart, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const colors = ['#62E1E5', '#F86E19', '#F81AC0'];

  const groupedCart = cart.reduce((acc, item) => {
    const key = `${item.brand}-${item.name}-${JSON.stringify(item.attributes)}-${item.unitAmount?.join?.(',') ?? ''}`;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 0 };
    }
    acc[key].quantity += 1;
    return acc;
  }, {});

  const cartItems = Object.values(groupedCart);
  const subtotal = cart.reduce((total, item) => total + item.price, 0);

  const handleAdd = (item) => addToCart(item);
  const handleRemove = (item) => removeFromCart(item);
  const handleProceedToPay = () => navigate('/checkout');

  const isSelected = (item) => selected.some(s => s.name === item.name);

  const toggleSelect = (item) => {
    setSelected(prev =>
      isSelected(item)
        ? prev.filter(s => s.name !== item.name)
        : [...prev, item]
    );
  };

  const handleRemoveSelected = () => {
    selected.forEach(item => handleRemove(item));
    setSelected([]);
  }

const handleCopySelected = async () => {
  if (selected.length === 0) return;

  try {
    const textToCopy = JSON.stringify(selected, null, 2);
    await navigator.clipboard.writeText(textToCopy);
    toast.success('Selected items copied to clipboard!');
  } catch (error) {
    toast.error('Copy failed. Try again later.');
    console.error('Clipboard copy failed:', error);
  }
};

  const getColorIndex = (i) => i % 3;

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-underlay">
        <div className="circle circle-lg"></div>
        <div className="circle circle-md"></div>
        <div className="circle circle-sm"></div>
        <div className="cart-container">
          <h1 className="cart-title">Cart</h1>

          
        { selected.length > 0 && <div className="actions">
          {user.role === 'developer' &&<button onClick={handleCopySelected}>Copy</button>}
          <button className='btn-primary' onClick={handleRemoveSelected}>Remove ({selected.length})</button>
        </div> }

          {cartItems.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items-container">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="cart-item"
                    style={{ backgroundColor: colors[getColorIndex(index)] }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(item)}
                      onChange={() => toggleSelect(item)}
                      className="check-item-box"
                    />
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-price">$ {item.price.toFixed(2)}</p>
                      <div className="button-pill">
                        <button className="btn-outline" onClick={() => handleAdd(item)}>
                          Add to cart
                        </button>
                        <button className="btn-primary" onClick={() => handleRemove(item)}>
                          Remove from cart
                        </button>
                      </div>
                    </div>
                    <img
                      src={item.thumbnail?.[0] || "/fallback.jpg"}
                      alt={`${item.brand} ${item.name}`}
                      className="item-thumbnail"
                    />
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2 className="total-price">Total price</h2>
                <p className="total-amount">$ {subtotal.toFixed(2)}</p>
              </div>
            </>
          )}
        </div>
        <button className="checkout-btn" onClick={handleProceedToPay}>
          Continue to pay
        </button>
      </div>
      <Footer />
      <MoveToTop />
    </div>
  );
}
