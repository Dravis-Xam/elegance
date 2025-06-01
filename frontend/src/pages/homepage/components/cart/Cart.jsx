import './Cart.css';
import { useCart } from "../../../../modules/CartContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { toast } from "../../../../modules/ToastStore";
import MoveToTop from '../movetotop/MoveToTop';

export default function Cart() {
  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const groupedCart = cart.reduce((acc, item) => {
    const key = `${item.brand}-${item.build}-${item.model}-${item.unitAmount}`;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 0 };
    }
    acc[key].quantity += 1;
    return acc;
  }, {});

  const cartItems = Object.values(groupedCart);
  const shippingcost = cartItems.length === 0 ? 0 : 500;

  const handleAdd = (item) => addToCart(item);
  const handleRemove = (item) => removeFromCart(item);
  const handleProceedToPay = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <div className="cart-container">
        <h1>Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="cart-items">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <img
                  src={item.image || "/fallback.jpg"}
                  alt={`${item.brand} ${item.model}`}
                  className="item-image"
                />

                <div className="item-info">
                  <h3>{item.brand} {item.model}</h3>
                  <p><strong>Build:</strong> {item.build}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Unit:</strong> {item.unitAmount}</p>
                  <p><strong>Price:</strong> Ksh. {item.price}</p>
                  <p className={item.amountInStock <= item.quantity ? 'out-of-stock' : 'in-stock'}>
                    {item.amountInStock <= item.quantity ? 'Out of Stock' : 'In Stock'}
                  </p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Delivery:</strong> Ksh. {shippingcost}</p>
                </div>

                <div className="item-actions">
                  <button onClick={() => handleAdd(item)}>+</button>
                  <button onClick={() => handleRemove(item)}>-</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-summary">
          <h2>
            Total: Ksh.{" "}
            {(
              cart.reduce((total, item) => total + item.price, 0) + (shippingcost || 0)
            ).toFixed(2)}
          </h2>
        </div>

        <button
          className="proceed-to-pay-btn"
          onClick={handleProceedToPay}
          disabled={cartItems.length === 0}
        >
          Proceed to Pay
        </button>
      </div>
      <MoveToTop />
    </div>
  );
}
