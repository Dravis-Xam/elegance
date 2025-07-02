import modelpic from '../../../../assets/bg/woman-in-pink-silk.jpg';
import './hero.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <div className="hero-section" id='hero'>
            <img src={modelpic} className='hero-pic' alt='...'></img>
            <div className="hero-content">
                <h3>Change Yourself</h3>
                <h1>WITH THE PERFECT NATURAL BEAUTY PRODUCTS</h1>
                <p>Endow your skin with the quality and service it deserves. We offer products that transform your skin into a tender and radiant one.</p>
                <button className="btn-primary explore-btn" onClick={() => navigate('/shop')}>Explore Now</button>
            </div>
        </div>
    );
}

export default Hero;
