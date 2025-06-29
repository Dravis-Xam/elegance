import { useEffect, useRef, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import './Contact.css';
import { FaXTwitter, FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa6';

const Contact = () => {
    const icons = [<FaFacebook />, <FaInstagram />, <FaTiktok />, <FaXTwitter />, <FaWhatsapp />];
    const [inView, setInView] = useState(false);
    const navigate = useNavigate()
    const iconContainerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                } else {
                    setInView(false);
                }
            },
            {
                threshold: 0.3,
            }
        );

        if (iconContainerRef.current) {
            observer.observe(iconContainerRef.current);
        }

        return () => {
            if (iconContainerRef.current) {
                observer.unobserve(iconContainerRef.current);
            }
        };
    }, []);

    return (
        <div className="contact-section" id="contact">
            <h2>Contact Us</h2>
            <div className="cs-icons-container" ref={iconContainerRef}>
                {icons.map((icon, index) => (
                    <span
                        key={index}
                        className={`cs-icon-${index + 1} ${inView ? 'start' : 'stop'}`}
                    >
                        {icon}
                    </span>
                ))}
            </div>
            <p style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)'
            }}>For more info, visit <span style={{color: 'var(--color-primary)', cursor: 'pointer'}} onClick={() => navigate('/contact-us')}>our Contact page</span></p>
        </div>
    );
};

export default Contact;
