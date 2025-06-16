import React from 'react';
import { useNavigate } from 'react-router-dom';
import MoveToTop from '../homepage/components/movetotop/MoveToTop';
import Header from '../homepage/components/header/Header';
import Footer from '../homepage/components/footer/Footer';
import { useProduct } from '../../modules/ProductContext';
import ProductCard from './components/ProductCard/ProductCard';

const Shop = () => {
    const navigate = useNavigate();
    const { products } = useProduct();

    const item = {}
    return (
        <div>
            <Header />
            <div className="container">
                <h2>Shop</h2>
                <div className="products-container">
                    {products.map((item, i) => <ProductCard key={i} product={item} />)}
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
