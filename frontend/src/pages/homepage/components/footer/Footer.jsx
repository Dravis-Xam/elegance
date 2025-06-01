import React from 'react';
import './Footer.css'
import { useNavigate } from 'react-router-dom';
import SocialLinks from "../links/SocialLinks/SocialLink"

const handleTagClick = () => {}

const Footer = () => {
    const navigate = useNavigate()
    return (
        <footer>
            <div>
                <div>
                <h2>DAOGROW</h2>
                <p><strong>Email: </strong>beautyspa@gmail.com</p>
                <p><strong>Contact: </strong> 0700 000 555 / 0700 001 555</p>
                <SocialLinks />
                </div>
                <div>
                <h3>Our Company</h3>
                <ul>
                    <li><a onClick={()=>navigate('/about-us')}>About us</a></li>
                    <li><a onClick={()=> navigate('/contact-us')}>Contact us</a></li>
                    <li><a onClick={() => navigate("/privacy-policy")}>Privacy policy</a></li>
                </ul>
                </div>
                <div>
                <h3>Categories</h3>
                <ul>
                    <li><a onClick={()=> handleTagClick('Moisterisers')}>Moisterisers</a></li>
                    <li><a onClick={()=> handleTagClick('Lotions')}>Lotions</a></li>
                    <li><a onClick={()=> handleTagClick('Shampoos')}>Shampoos</a></li>
                    <li><a onClick={()=> handleTagClick('Hair products')}>Hair products</a></li>
                    <li><a onClick={()=> handleTagClick('Serums')}>Serums</a></li>
                    <li><a onClick={()=> handleTagClick('Skin Care')}>Skin Care</a></li>
                </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
