import React, { useState } from 'react';
import { useAuth } from '../../modules/AuthContext';
import { useNavigate } from 'react-router-dom';
import ToastContainer from '../../utils/toasts/ToastContainer';
import bg from '../../assets/bg/bg.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  document.body.style.cssText = `
    background-image: url(${bg});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const role = await login(formData);
    if (role) navigate('/');
    setIsSubmitting(false);
  };

  return (
    <div className="container" style={{ padding: 'var(--space-xl)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        maxWidth: '100%',
        width: '500px' }}>
      <h2 className="text-primary" style={{textAlign: 'center'}}>Login</h2>
      <form onSubmit={handleSubmit} style={{ 
        maxWidth: '400px', 
        margin: '10px auto',
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        width: '70%'
      }}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: '95%',
            padding: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'Ancizar sans'
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: '95%',
            padding: 'var(--space-sm)',
            marginBottom: 'var(--space-lg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'Ancizar sans'
          }}
        />
        <button type="submit" className="btn-primary" style={{ width: '90%' }}>
          Login
        </button>
      </form>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '30px'}}>
        <span style={{cursor: 'default'}} onClick={()=> navigate('/forgot-password')}>Forgot Password</span>
        <span style={{cursor: 'default'}} onClick={()=>navigate('/signup')}>Sign up</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '30px', color: 'var(--color-secondary)', cursor: 'pointer'}} onClick={()=>navigate('/')}>
        Continue without logging in  
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;