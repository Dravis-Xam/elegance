import React from 'react';
import { useNavigate } from 'react-router-dom';
import MoveToTop from '../homepage/components/movetotop/MoveToTop';
import Header from '../homepage/components/header/Header';
import Footer from '../homepage/components/footer/Footer';
import { useProduct } from '../../modules/ProductContext';
import Listing from './components/listing/Listing';

const Shop = () => {
    const navigate = useNavigate();
    const { products } = useProduct();

    const item = {}
    return (
        <div>
            <Header />
            <div className="container">
                <h2 style={{textAlign: 'center', display: 'flex', justifyContent:'center', alignItems: 'center'}}>Shop</h2>
                <div className="products-container">
                    <Listing products={products}/>
                </div>
                <button onClick={()=>navigate("/details")}>Details</button>
                <button onClick={()=> navigate('/')}>Home</button>
            </div>
            <Footer />
            <MoveToTop/>
        </div>
    );
}

export default Shop;
