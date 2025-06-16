import ToastContainer from '../../utils/toasts/ToastContainer';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MoveToTop from './components/movetotop/MoveToTop';
import ProductForm from './components/forms/ProductForm';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../modules/ToastStore';

const Homepage = () => {
  const navigate = useNavigate();
  const handleCancelAdd = () => {
    navigate('/shop')
    toast.success('Cancelled your submit message');
  };

  return (
      <div className="container" style={{ 
        padding: 'var(--space-sm) 0',
        textAlign: 'center'
      }}>
        <Header />
        <ProductForm 
          onCancel={handleCancelAdd}
          isEditing={false}
        />
        <Footer />
        <MoveToTop />
        <small>&copy; 2025 | DAOGROW | Terms and conditions apply.</small>
        <ToastContainer />
      </div>
  )
};

export default Homepage;