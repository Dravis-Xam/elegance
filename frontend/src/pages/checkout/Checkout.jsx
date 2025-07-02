import Header from '../homepage/components/header/Header';
import Footer from '../homepage/components/footer/Footer';
import './Checkout.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../../modules/AuthContext';
import LocationPicker from './locator';
import useUserLocation from '../../modules/useUserLocation';
import { useOrder } from '../../modules/OrderContext';
import { toast } from '../../modules/ToastStore';

const Checkout = () => {
  const savedPref = JSON.parse(localStorage.getItem('paymentPref')) || {};

  const [selectedMethod, setSelectedMethod] = useState(savedPref.selectedMethod || '');
  const [TpesaNo, setTpesaNo] = useState(savedPref.TpesaNo || '');
  const [isEmpty, setIsEmpty] = useState(true);

  const [order, _ ] = useState([]);

  const [saved, setSaved] = useState(false);

  const { savePaymentOption } = useAuth();
  const { addOrder } = useOrder();
  const { user } = useAuth();

  const [ orderData, setOrderData ] = useState({});

  const {
    manualAddress,
    setManualAddress,
    requestLocation,
  } = useUserLocation();

  const [seeLoc, setSeeLoc] = useState(false);

  const handleAllow = () => {
    requestLocation();
    setSeeLoc(true);
  };

  const handleDeny = () => {
    setSeeLoc(false);
  };

  useEffect(() => {
    localStorage.setItem('paymentPref', JSON.stringify({ selectedMethod, TpesaNo }));
    setIsEmpty(!(selectedMethod && TpesaNo.trim()));
    setOrderData({
        username: user?.username || 'Guest',
        status: 'pending',
        productIds: order.map((item) => item.id),
        totalPrice: order.reduce((total, item) => total + item.price, 0),
        paymentDetails: {
          paymentMethod: selectedMethod,
          paymentData: TpesaNo,
        },
        address: manualAddress
    });
  }, [selectedMethod, TpesaNo]);

  const handleSave = async () => {
    if (!TpesaNo.trim()) return toast.error('Please enter your details.');
    if (!selectedMethod) return toast.error('Please select a payment method.');
    await savePaymentOption(selectedMethod, TpesaNo);
    await addOrder({orderData});
    setSaved(true);
  };

  return (
    <div>
      <Header />
      <div className="checkout-content">
        <h2>Checkout</h2>

        <div className="payment-options-container">
          <h4>Choose your preferred option</h4>
          <div className="p-options">
            {['T-Pesa', 'Bank Transfer', 'Paypal', 'Pesapal'].map((item, index) => (
              <button
                key={index}
                className={`p-option ${selectedMethod === item ? 'active' : ''}`}
                onClick={() => {
                  setSelectedMethod(item);
                  setSaved(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="p-option-tabs">
            {selectedMethod === 'T-Pesa' && (
              <div className="m-input-grp">
                <input
                  type="text"
                  placeholder="Your T-Pesa number"
                  value={TpesaNo}
                  onChange={(e) => setTpesaNo(e.target.value)}
                />
                <button className="o-save-btn btn-primary" onClick={handleSave} disabled={saved}>
                  {saved ? 'Saved' : 'Save as preferred method'}
                </button>
              </div>
            )}

            {['Bank Transfer', 'Paypal'].includes(selectedMethod) && (
              <div className="m-input-grp">
                <p>For now, this option is not available.</p>
              </div>
            )}

            {selectedMethod === 'Pesapal' && (
              <div className="m-input-grp">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={TpesaNo}
                  onChange={(e) => setTpesaNo(e.target.value)}
                />
                <button className="o-save-btn btn-primary" onClick={handleSave}>
                  Save as preferred method
                </button>
              </div>
            )}
          </div>

          {/* ✅ LocationPicker with all required props */}
          <LocationPicker
            handleAllow={handleAllow}
            handleDeny={handleDeny}
            manualAddress={manualAddress}
            setManualAddress={setManualAddress}
            requestLocation={requestLocation}
            seeLoc={seeLoc}
          />

          <button className="btn-primary complete-p-btn" disabled={isEmpty}>
            Complete purchase
          </button>
        </div>
        <div className="tracking">
            <h3>Track your order</h3>
            <div>
                {order.length > 0 
                ? 
                  order.map((item, index) => (
                    <div key={index} className="order-item">
                      <p>Order ID: {item.id}</p>
                      <p>Status: {item.status}</p>
                      <p>Total Price: Ksh {item.price}</p>
                    </div>
                  ))
                :
                  <p>No orders found. Please add items to your cart.</p>
                }
                <button className="btn-secondary" onClick={() => {window.location.reload()}}>Refresh</button>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
