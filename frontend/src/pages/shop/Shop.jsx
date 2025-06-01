import React from 'react';
import { useNavigate } from 'react-router-dom';
import MoveToTop from '../homepage/components/movetotop/MoveToTop';
import Header from '../homepage/components/header/Header';
import Footer from '../homepage/components/footer/Footer';

const Shop = () => {
    const navigate = useNavigate();

    const item = {}
    return (
        <div>
            <Header />
            <div className="container">
                <h2>Shop</h2>
                <button onClick={()=>navigate("/details")}>Details</button>
                <button onClick={()=> navigate('/')}>Home</button>
            </div>
            <Footer />
            <MoveToTop/>
        </div>
    );
}

export default Shop;
