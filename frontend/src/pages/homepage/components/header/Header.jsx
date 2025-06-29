import './Header.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../modules/AuthContext';
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiSearch, FiSettings, FiX } from 'react-icons/fi';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useState, useRef, useEffect, useMemo } from 'react';
import useWindowWidth from '../../../../modules/useWindowWidth';
import { useCategory } from '../../../../modules/CategoryContext';
import CategoryItem from './components/categoryItem';
export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { categoryList } = useCategory();
  const width = useWindowWidth();
  const mode = localStorage.getItem('mode') || 'light';
  const currentPAGE = useLocation().pathname;

  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const searchBtnRef = useRef(null);
  const navPartRef = useRef(null);
  const rightPartRef = useRef(null);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const menuItems = useMemo(() => ({
    services: (
      <div className="menuContent" style={{ backgroundColor: `rgba( 0, ${currentPAGE === '/' ? '0' : '255'}, 0, 0.3)` }}>
        <div className="service-list">
          {[
            {
              title: 'Training',
              desc: 'Training SPA Staff/Employees, ensuring a positive and excellent experience',
              label: 'Enrol now',
            },
            {
              title: 'Beauty Workshops',
              desc: 'Covering the essentials of skincare routines, skin types, and product selection',
              label: 'View more',
            },
            {
              title: 'Massage Therapy',
              desc: 'Deep Tissue, Sweedish, Distress, Body Scrub, Facial, Manicure, Pedicure',
              label: 'Schedule',
            },
            {
              title: 'Mobile Spa',
              desc: 'We provide convenience for individuals who prefer spa services by visiting where they are',
              label: 'Schedule',
            },
          ].map((service, i) => (
            <div key={i} className="service-box">
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <button className="btn-primary" style={{ margin: '10px auto' }}>{service.label}</button>
            </div>
          ))}
        </div>
      </div>
    ),
    categories: (
      <div className="menuContent" style={{ backgroundColor: `rgba( 0, ${currentPAGE === '/' ? '0' : '255'}, 0, 0.3)` }}>
        <div className="category-list">
          {categoryList.map((category, index) => (
            <CategoryItem key={index} category={category} />
          ))}
        </div>
      </div>
    )
  }), [categoryList, currentPAGE]);

  useEffect(() => {
    if (headerRef.current) headerRef.current.style.width = '90%';
    if (width > 768) {
      [searchBtnRef, navPartRef, rightPartRef].forEach(ref => {
        if (ref.current) {
          ref.current.style.transition = 'width 0.3s ease-in-out';
          ref.current.style.overflow = 'hidden';
          ref.current.style.display = 'flex';
        }
      })
    } else {
      [searchBtnRef, rightPartRef].forEach(ref => {
        if (ref.current) {
          ref.current.style.transition = 'width 0.3s ease-in-out';
          ref.current.style.overflow = 'hidden';
          ref.current.style.display = 'none';
        }
      });
      if (navPartRef.current) {
        navPartRef.current.style.display = 'flex';
        navPartRef.current.style.width = '100%';
      }
    }
    const updateHeaderState = (shrink) => {
      const newWidth = width > 768 ? (shrink ? '500px' : '90%') : (shrink ? '50%' : '90%');
      const newDisplay = shrink ? 'none' : 'flex';

      if (headerRef.current) headerRef.current.style.width = newWidth;

      [searchBtnRef, navPartRef, rightPartRef].forEach(ref => {
        if (ref.current) ref.current.style.display = newDisplay;
      });
    };

    const handleMouseOver = (e) => {
      if (!e.relatedTarget || (headerRef.current && !headerRef.current.contains(e.relatedTarget))) {
        updateHeaderState(false);
      }
    };

    const handleMouseOut = (e) => {
      if (!headerRef.current.contains(e.relatedTarget)) {
        if (window.scrollY <= 50) updateHeaderState(true);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 50) updateHeaderState(true);
      else updateHeaderState(false);
    };

    const headerEl = headerRef.current;
    if (headerEl) {
      headerEl.addEventListener('mouseover', handleMouseOver);
      headerEl.addEventListener('mouseout', handleMouseOut);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (headerEl) {
        headerEl.removeEventListener('mouseover', handleMouseOver);
        headerEl.removeEventListener('mouseout', handleMouseOut);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [width]);

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

  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setIsSearchFocused(false);
        setSearchQuery('');
        setSearchSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideSearch);
    return () => document.removeEventListener('mousedown', handleClickOutsideSearch);
  }, []);

  const handleDropdownClick = (dropdown) => {
    setActiveDropdown(prev => (prev === dropdown ? null : dropdown));
    setShowDropdown(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleShowNav = () => setShowDropdown(prev => !prev);

  return (
    <header className="header" ref={headerRef} style={{ backgroundColor: `rgba( 0, ${currentPAGE === '/' ? '0' : '255'}, 0, 0.3)` }}>
      {/* Logo */}
      <div className="header-part title-part">
        <div className="page-title">DAOGROW</div>
      </div>

      {/* Navigation */}
      <div className="header-part nav-part" ref={navPartRef}>
        {width >= 768 ? (
          <>
            <div className="m-nav">
              <span className="nav-link"><Link to="/shop">Shop</Link></span>
              <span className="nav-link"><Link to="/cart">Cart</Link></span>
              <span className="nav-link" onClick={() => handleDropdownClick('categories')}>
                Categories <FiChevronDown className={`dropdown-icon ${activeDropdown === 'categories' ? 'active' : ''}`} />
              </span>
              <span className="nav-link" onClick={() => handleDropdownClick('services')}>
                Services <FiChevronDown className={`dropdown-icon ${activeDropdown === 'services' ? 'active' : ''}`} />
              </span>
            </div>
            <div className="toggle-menu">
              {activeDropdown && menuItems[activeDropdown]}
            </div>
          </>
        ) : (
          <div className="c-sidebar">
            <div className={`c-show-nav-btn ${showDropdown ? 'active' : ''}`} onClick={handleShowNav}><FiChevronRight/></div>
            {showDropdown && (
              <div className={`c-sidebar-content ${showDropdown ? 'active' : ''}`}>
                <span className="nav-link" onClick={() => navigate('/')}>Home</span>
                <span className="nav-link" onClick={() => navigate('/shop')}>Shop</span>
                <span className="nav-link" onClick={() => navigate('/cart')}>Cart</span>
                <span className="nav-link" onClick={() => handleDropdownClick('categories')}>
                  Categories <FiChevronDown className={`dropdown-icon ${activeDropdown === 'categories' ? 'active' : ''}`} />
                </span>
                <span className="nav-link" onClick={() => handleDropdownClick('services')}>
                  Services <FiChevronDown className={`dropdown-icon ${activeDropdown === 'services' ? 'active' : ''}`} />
                </span>
                {activeDropdown && menuItems[activeDropdown]}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="header-part" ref={rightPartRef}>
        {user ? (
          <>
            <span className="user" onClick={() => navigate('/profile')}><FaUser /></span>
            <span className="settings" onClick={() => navigate('/settings')}><FiSettings /></span>
            <span className="log-out" onClick={handleLogout}>
              {width <= 768 ? <FaSignOutAlt /> : 'Log out'}
            </span>
          </>
        ) : (
          <>
            <span className="log-in" onClick={() => navigate('/login')}>Log in</span>
            <span className="sign-up" onClick={() => navigate('/signup')}>Sign up</span>
          </>
        )}
      </div>
    </header>
  );
}
