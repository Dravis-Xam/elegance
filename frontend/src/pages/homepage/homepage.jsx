import React from 'react';
import ToastContainer from '../../utils/toasts/ToastContainer';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MoveToTop from './components/movetotop/MoveToTop';

const Homepage = () => {
  
  return (
    <div className="container" style={{ 
      padding: 'var(--space-sm) 0',
      textAlign: 'center'
    }}>
        <Header />
        <Footer />
        <MoveToTop />
        <small>&copy; 2025 | Beauty Spa | Terms and conditions apply.</small>
        <ToastContainer />
    </div>
  );
};

export default Homepage;