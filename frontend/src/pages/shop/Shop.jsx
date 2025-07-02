import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MoveToTop from '../homepage/components/movetotop/MoveToTop';
import Header from '../homepage/components/header/Header';
import Footer from '../homepage/components/footer/Footer';
import { useProduct } from '../../modules/ProductContext';
import Listing from './components/listing/Listing';

const Shop = () => {
    const navigate = useNavigate();
    const { products } = useProduct();
    if (!products || products.length === 0) {
        return <div className="loading-circle">Loading products...</div>;
    }
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');
    const filteredProducts = productId
    ? [products.find(p => p.id === productId)].filter(Boolean)  // avoids `[undefined]`
    : products;


    return (
        <div>
            <Header />
            <div className="container shop-container">
                <h2 style={{textAlign: 'center', display: 'flex', justifyContent:'center', alignItems: 'center'}}>Shop</h2>
                <div className="products-container">
                    <Listing products={filteredProducts}/>
                </div>
            </div>
            <Footer />
            <MoveToTop/>
        </div>
    );
}

export default Shop;
