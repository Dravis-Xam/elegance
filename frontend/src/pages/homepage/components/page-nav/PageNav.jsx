import React, { useState, useRef, useEffect } from 'react';
import './PageNav.css';
import { FiSearch } from 'react-icons/fi';
import useWindowWidth from '../../../../modules/useWindowWidth';
import { useNavigate } from 'react-router-dom'; // <-- You were missing this
import { useProduct } from '../../../../modules/ProductContext';

const PageNav = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const searchInputRef = useRef(null);
    const { width } = useWindowWidth();
    const navigate = useNavigate(); // <-- Missing navigate definition

    const { products } = useProduct();

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (width > 768) {
                if (scrollY > 1000) {
                    setActiveTab(3); // About
                } else if (scrollY > 700) {
                    setActiveTab(2); // Testimonials
                } else if (scrollY > 300) {
                    setActiveTab(1); // Featured
                } else {
                    setActiveTab(0); // Hero
                }
            } else {
                setActiveTab(0); // On small screens, always Hero
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [width]);

    const handleClick = (index) => {
        setActiveTab(index);

        const sectionId = ['hero', 'featured', 'testimonials', 'about'][index];
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }

        // Reset search state
        setShowSearch(false);
        setIsSearchFocused(false);
        setSearchQuery('');
        setSearchSuggestions([]);

        if (searchInputRef.current) {
            searchInputRef.current.blur();
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchSuggestions([]);
            setIsSearchFocused(false);
        }
    };

    const handleShowSearch = () => {
        setShowSearch(prev => !prev);
        if (!showSearch) {
            setIsSearchFocused(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            setIsSearchFocused(false);
            setSearchQuery('');
            setSearchSuggestions([]);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchSuggestions(value
            ? products.filter(s =>
                s.name.toLowerCase().includes(value.toLowerCase()))
            : []);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
        setIsSearchFocused(false);
        setSearchSuggestions([]);
    };

    return (
        <div className="page-nav">
            {[0, 1, 2, 3].map((_, index) => (
                <span
                    key={index}
                    className={`p-link ${activeTab === index ? 'active' : ''}`}
                    onClick={() => handleClick(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleClick(index)}
                />
            ))}

            <div className="search-input-container">
                <FiSearch onClick={handleShowSearch} className="search-icon" />
                {showSearch && (
                    <div className="outer">
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsSearchFocused(true)}
                                className='search-input'
                                placeholder="Looking for sth?"
                            />
                            {isSearchFocused && searchSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {searchSuggestions.map((s, i) => (
                                        <li key={i} onClick={() => handleSuggestionClick(s)}>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button className='btn-primary close-btn' onClick={handleShowSearch}>Close</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageNav;
