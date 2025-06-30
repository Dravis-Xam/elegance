import Header from '../homepage/components/header/Header';
import Footer from '../homepage/components/footer/Footer';
import './Checkout.css';

const Checkout = () => {
    
    return (
        <div>
            <Header />
            <div className="checkout-content">
                <h2>Checkout</h2>
                
                <div className="payment-options-container">
                    <span className="p-option"></span>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Checkout;
