import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '../modules/ToastStore';

const BaseURL = import.meta.env.VITE_API_BASE_URL;
const TestimonialContext = createContext();

export const TestimonialProvider = ({ children }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [likes, setLikes] = useState(0 || localStorage.getItem('likes'));

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${BaseURL}/testimonials/get`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                toast.error('Could not fetch testimonials');
                console.error('Could not fetch testimonials:', res.statusText);
                return;
            }

            const data = await res.json();
            setTestimonials(data);
        } catch (error) {
            toast.error('Error fetching testimonials');
            console.error('Error fetching testimonials:', error);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const addTestimonial = async (testimonial) => {
        try {
            const res = await fetch(`${BaseURL}/testimonials/add`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testimonial),
            });

            if (!res.ok) throw new Error(res.statusText);

            const newTestimonial = await res.json();
            setTestimonials((prev) => [...prev, newTestimonial]);
            toast.success('Testimonial added');
        } catch (err) {
            console.error('Could not  add testimonial:', err);
            toast.error('Could not add testimonial');
        }
    };

    const removeTestimonial = async (id, userId) => {
        try {
            const res = await fetch(`${BaseURL}/testimonials/${id}&${userId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(res.statusText);

            setTestimonials((prev) => prev.filter((t) => t.id !== id));
            toast.success('Testimonial deleted successfully');
        } catch (err) {
            console.error('Could not delete testimonial:', err);
            toast.error('Could not delete testimonial');
        }
    };

    const toggleLike = async (id) => {
        try {
            const res = await fetch(`${BaseURL}/api/testimonials/${id}/toggle-like`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            });

            if (!res.ok) throw new Error('Toggle like failed');
            const { testimonial, liked } = await res.json();

            setTestimonials((prev) =>
            prev.map((t) => (t._id === testimonial._id ? testimonial : t))
            );

            toast.success(liked ? 'Liked!' : 'Unliked!');
        } catch (err) {
            toast.error('Failed to like/unlike testimonial');
        }
    };


    return (
        <TestimonialContext.Provider value={{ testimonials, addTestimonial, removeTestimonial, fetchTestimonials, toggleLike }}>
            {children}
        </TestimonialContext.Provider>
    );
};

export const useTestimonials = () => useContext(TestimonialContext);
export default TestimonialContext;