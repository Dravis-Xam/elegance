import ToastContainer from '../../utils/toasts/ToastContainer';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MoveToTop from './components/movetotop/MoveToTop';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../modules/ToastStore';

const Homepage = () => {

  return (
      <div className="container" style={{ 
        padding: 'var(--space-sm) 0',
        textAlign: 'center'
      }}>
        <Header />
        
        <Footer />
        <MoveToTop />
        <small>&copy; 2025 | DAOGROW | Terms and conditions apply.</small>
        <ToastContainer />
      </div>
  )
};

export default Homepage;