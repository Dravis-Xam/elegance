import './Testimonials.css'; 
import TCard from './T-Card';
import { useTestimonials } from '../../../../modules/TestimonialContext';
import { useAuth } from '../../../../modules/AuthContext';
import { useProduct } from '../../../../modules/ProductContext';
import ReviewOption from './ReviewOption';
import { FiX } from 'react-icons/fi';
import { useMemo, useState } from 'react';

const Testimonials = () => {
    const { testimonials, addTestimonial, removeTestimonial, like } = useTestimonials();
    const { user } = useAuth();
    const { products } = useProduct();

    const [show, setShow] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [message, setMessage] = useState('');

    const payload = useMemo(() => ({ items: selectedItems, message }), [selectedItems, message]);

    const toggleCommentForm = () => setShow(prev => !prev);

    const selectItem = (item) => {
        setSelectedItems(prev => 
            prev.includes(item)
                ? prev.filter(p => p !== item)
                : [...prev, item]
        );
    };

    const handleSubmitComment = () => {
        addTestimonial(payload);
        setMessage('');
        setSelectedItems([]);
        setShow(false);
    };

    return (
        <div className='testimonials-section' id='testimonials'>
            <h2>Testimonials</h2>
            <div className="testimonial-container">
                {testimonials.length !== 0 
                    ? testimonials.map((testimonial, index) => (
                        <TCard 
                            key={index} 
                            testimonial={testimonial} 
                            f={testimonial.username === user.username 
                                ? [addTestimonial, removeTestimonial, like] 
                                : null}
                        />
                    ))
                    : <>
                        <p>No testimonials available at the moment. Be the first.</p>
                        <button className="t-open-tform btn-primary" onClick={toggleCommentForm}>Comment</button>
                    </>
                }
            </div>

            {show && (
                <div className='comment-form-container'>
                    <span className='comment-form-close-btn' onClick={toggleCommentForm}><FiX /></span>
                    <div className="comment-form-inner">
                        <h2>Submit your review</h2>
                        <div className="comment-input-group">
                            <h4>Choose the product to review</h4>
                            <div className='review-obj-container'>
                                {products.map((item, index) => (
                                    <ReviewOption 
                                        key={index}
                                        item={item}
                                        onclick={selectItem}
                                        isSelected={selectedItems.includes(item)}
                                    />
                                ))}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label htmlFor="message" className='c-floating-label'>
                                    Type your comment
                                </label>
                                <textarea 
                                    name="message" 
                                    id="message" 
                                    className='c-message-input' 
                                    rows={3} 
                                    cols={30} 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className='submit-btn btn-primary' onClick={handleSubmitComment}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Testimonials;
