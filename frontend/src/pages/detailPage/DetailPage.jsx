import React from 'react';
import { useNavigate } from 'react-router-dom';
import MoveToTop from '../homepage/components/movetotop/MoveToTop';
import Header from '../homepage/components/header/Header';
import Footer from '../homepage/components/footer/Footer';



const DetailPage = () => {
    const navigate=useNavigate();
    const payload = {};
    return (
        <div>
            <Header />
            <div className="container">
                <h2>Detail page</h2>
                <button onClick={()=>navigate("/")}>Home</button>
                <button onClick={()=>navigate("/cart", {state: {details: payload}})}>Cart</button>
            </div>
            <Footer />
            <MoveToTop />
        </div>
    );
}

export default DetailPage;
