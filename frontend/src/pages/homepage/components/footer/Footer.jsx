import React from 'react';
import './Footer.css'
import { useNavigate } from 'react-router-dom';
import SocialLinks from "../links/SocialLinks/SocialLink"
import { useCategory } from '../../../../modules/CategoryContext';



const Footer = () => {
    const navigate = useNavigate()

    const { categoryList } = useCategory();

    const handleTagClick = ( value ) => {
        navigate(`/search?q=${encodeURIComponent(value)}`)
    }
    
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
                        {
                            categoryList?.length > 0 ? (
                                categoryList.map((value, index) => (
                                <li key={value.id || index}>
                                    <a href="#" onClick={(e) => {
                                    e.preventDefault(); // Prevent page jump
                                    handleTagClick(value.name.toString());
                                    }}>
                                    {value.name}
                                    </a>
                                </li>
                                ))
                            ) : (
                                <p>No categories added yet</p>
                            )
                        }
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
