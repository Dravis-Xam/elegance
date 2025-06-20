 import './Header.css';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '../../../../modules/AuthContext';
 import {FiChevronDown, FiChevronUp, FiSearch, FiX, FiSettings} from 'react-icons/fi';
 import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useState, useRef, useEffect, useMemo } from 'react';
import HamburgerBtn from '../HamburgerBtn/HamburgerBtn';
import useWindowWidth from '../../../../modules/useWindowWidth';


 export default function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoverDropdown, setHoverDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const headerRef = useRef(null);
    const searchInputRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    const menuItems = useMemo(() => ({
      services: (
        <div className="menuContent">
          <h2 className="services-heading">OUR SERVICES</h2>
          <div className="service-list">
            <div className="service-box">
              <h3>Training</h3>
              <p>Training SPA Staff/Employees, ensuring a positive and excellent experience</p>
              <button className='btn-primary' style={{margin: '10px auto'}}>Enrol now</button>
            </div>

            <div className="service-box">
              <h3>Beauty Workshops</h3>
              <p>Covering the essentials of skincare routines, skin types, and product selection</p>
              <button className='btn-primary' style={{margin: '10px auto'}}>View more</button>
            </div>

            <div className="service-box">
              <h3>Massage Therapy</h3>
              <p>Deep Tissue, Sweedish, Distress, Body Scrub, Facial, Manicure, Pedicure</p>
              <button className='btn-primary' style={{margin: '10px auto'}}>Schedule</button>
            </div>

            <div className="service-box">
              <h3>Mobile Spa</h3>
              <p>We provide convenience for individuals who prefer spa services by visiting where they are</p>
              <button className='btn-primary' style={{margin: '10px auto'}}>Schedule</button>
            </div>
          </div>
        </div>
      ),
      categories: (
      <div className="menuContent">
        <h3>Popular Categories</h3>
        <div className="menuGrid">
          <div className="menuColumn">
            <h4>Skincare</h4>
            <a href="/brands/cerave">CeraVe</a>
            <a href="/brands/ordinary">The Ordinary</a>
            <a href="/brands/laroche">La Roche-Posay</a>
          </div>
          <div className="menuColumn">
            <h4>Haircare</h4>
            <a href="/brands/olaplex">Olaplex</a>
            <a href="/brands/sheamoisture">SheaMoisture</a>
            <a href="/brands/mielle">Mielle Organics</a>
          </div>
          <div className="menuColumn">
            <h4>Makeup</h4>
            <a href="/brands/fenty">Fenty Beauty</a>
            <a href="/brands/mac">MAC</a>
            <a href="/brands/nars">NARS</a>
          </div>
          <div className="menuColumn">
            <h4>Fragrances</h4>
            <a href="/brands/chanel">Chanel</a>
            <a href="/brands/zara">Zara</a>
            <a href="/brands/arabian-oud">Arabian Oud</a>
          </div>
          <div className="menuColumn">
            <h4>Body Care</h4>
            <a href="/brands/treehut">Tree Hut</a>
            <a href="/brands/nivea">NIVEA</a>
            <a href="/brands/bodyshop">The Body Shop</a>
          </div>
        </div>
      </div>
      )
    }), []);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (headerRef.current && !headerRef.current.contains(event.target)) {
          setActiveDropdown(null);
          setIsSearchFocused(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
        setIsSearchFocused(false);
      }
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
      // Here you would typically fetch search suggestions from an API
      // For now we're using the static list
    };

    const handleSuggestionClick = (suggestion) => {
      setSearchQuery(suggestion);
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
      setIsSearchFocused(false);
    };

    const clearSearch = () => {
      setSearchQuery('');
      searchInputRef.current.focus();
    };

    const handleDropdownClick = (dropdown) => {
      setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const handleShowNav = () => {
      showDropdown ? setShowDropdown(false) : setShowDropdown(true)
    }

    const width = useWindowWidth();
 
    return <header style={{ 
        display: 'flex',
        gap: 'var(--space-md)',
        justifyContent: 'space-between',
        alignItems: 'center'
      }} ref={headerRef}>
          {width <= 1190 ? <span onClick={handleShowNav}><HamburgerBtn show={showDropdown}/></span> : null}
          <div className={`toggleMenu ${showDropdown ? "shown" : ""}`} style={{ position: 'relative' }}>
          <div 
            className={`dropdown ${activeDropdown === 'services' ? 'active' : ''}`}
            onClick={() => handleDropdownClick('services')}
            onMouseEnter={() => setHoverDropdown('services')}
            onMouseLeave={() => setHoverDropdown(null)}
          >
            <span>Services</span>
            <FiChevronDown />
            {(activeDropdown === 'services' || hoverDropdown === 'services') && (
              <div className="menuItemsContainer">
                {menuItems.services}
              </div>
            )}
          </div>
          <div 
            className={`dropdown ${activeDropdown === 'categories' ? 'active' : ''}`}
            onClick={() => handleDropdownClick('categories')}
            onMouseEnter={() => setHoverDropdown('categories')}
            onMouseLeave={() => setHoverDropdown(null)}
          >
            <span>Categories</span>
            {activeDropdown === 'categories' ? <FiChevronUp /> : <FiChevronDown />}
            {(activeDropdown === 'categories' || hoverDropdown === 'categories') && (
              <div className="menuItemsContainer wideMenu">
                {menuItems.categories}
              </div>
            )}
          </div>
          <span className="dropdown" onClick={()=>navigate('/shop')}>Shop</span>
          <span className='cartBtn' onClick={()=>navigate('/cart')}>Cart</span>
        </div>
        <h1 className="text-primary logo" onClick={() => navigate('/')}>DAOGROW</h1>
        <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search products, brands..."
                aria-label="Search products"
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="search-clear"
                  aria-label="Clear search"
                >
                  <FiX />
                </button>
              )}
            </div>
            <button type="submit" className="search-button" aria-label="Submit search" title='Search'>
              <FiSearch />
            </button>
          </form>

          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              <ul>
                {searchSuggestions
                  .filter(suggestion =>
                    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        {user ? (
          <div style={{display: 'inline-flex', alignItems: 'center', gap: "10px"}}>
            <span title="Profile" style={{padding: " 0 var(--space-md)", cursor: "pointer"}} onClick={()=>navigate('/profile')}><FaUser /></span>
            <span title="Settings" style={{padding: " 0 var(--space-md)", cursor: "pointer"}} onClick={()=>navigate('/settings')}><FiSettings/></span>
            <button 
              className="btn-secondary authbtn"
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
            >
              {width <= '768px' ? <FaSignOutAlt/> : 'Log out'}
            </button>
          </div>
        ) : (
          <div style={{display: 'inline-flex', alignItems: 'center', gap: "10px"}}>
            <button 
              className="btn-primary authbtn"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="btn-outline authbtn"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </div>
        )}
    </header>
}