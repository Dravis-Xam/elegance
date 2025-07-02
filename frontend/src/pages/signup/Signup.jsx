import React, { useState } from 'react';
import { useAuth } from '../../modules/AuthContext';
import ToastContainer from '../../utils/toasts/ToastContainer';
import { useNavigate } from 'react-router-dom';
import bg from '../../assets/bg/bg.png';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    preferredPaymentOption: 'mpesa',
  });

  document.body.style.cssText = `
    background-image: url(${bg});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  `;

  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = await signup(formData);
    if (role) {
      navigate('/login');
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-xl)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        maxWidth: '500px',
        width: '100%' }}>
      <h2 className="text-primary" style={{textAlign: 'center'}}>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ 
        maxWidth: '400px', 
        margin: '0 auto',
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        width: '70%'
      }}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{
            width: '94%',
            padding: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'Ancizar sans',
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: '94%',
            padding: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'Ancizar sans',
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: '94%',
            padding: 'var(--space-sm)',
            marginBottom: 'var(--space-lg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'Ancizar sans',
          }}
        />
        <button type="submit" className="btn-primary" style={{ width: '90%' }}>
          Sign Up
        </button>
      </form>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '30px', width: '90%'}}>Already have an account?
        <span style={{cursor: 'default'}} onClick={()=>navigate('/login')}>Log in</span>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;