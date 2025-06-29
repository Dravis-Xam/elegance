import ToastContainer from '../../utils/toasts/ToastContainer';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MoveToTop from './components/movetotop/MoveToTop';
import Hero from './components/hero/hero';
import PageNav from './components/page-nav/PageNav';
import Featured from './components/featured/Featured';
import Testimonials from './components/testimonials/Testimonials';
import Contact from './components/Contact/Contact';

const Homepage = () => {

  return (
      <div className="container" style={{ 
        padding: 'var(--space-sm) 0',
        textAlign: 'center'
      }}>
        <Header />
        <Hero /><PageNav />
        <Featured />
        <Testimonials />
        <Contact />
        <Footer />
        <MoveToTop />
        <small>&copy; 2025 | DAOGROW | Terms and conditions apply.</small>
        <ToastContainer />
      </div>
  )
};

export default Homepage;