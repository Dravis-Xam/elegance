 import './Header.css';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '../../../../modules/AuthContext';
 import {FiChevronDown, FiChevronUp} from 'react-icons/fi'


 export default function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
 
    return <header style={{ 
        display: 'flex',
        gap: 'var(--space-md)',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span className="dropdown"><span>Shop</span><FiChevronDown /></span>
          <span className="dropdown"><span>Services</span><FiChevronDown /></span>
          <span className="dropdown"><span>Brands</span><FiChevronDown /></span>
          <span className='cartBtn'>Cart</span>
        </div>
        <h1 className="text-primary">Beauty Spa</h1>
        {user ? (
          <button 
            className="btn-secondary"
            onClick={() => {
              navigate('/login');
              logout();
            }}
          >
            Log out
          </button>
        ) : (
          <div style={{display: 'inline-flex', alignItems: 'center', gap: "10px"}}>
            <button 
              className="btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="btn-outline"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </div>
        )}
      </header>
}