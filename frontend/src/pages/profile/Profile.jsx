import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/AuthContext';
import './Profile.css';
import { toast } from '../../modules/ToastStore';
import ToastContainer from '../../utils/toasts/ToastContainer';
import Header from '../homepage/components/header/Header';
import Footer from '../homepage/components/footer/Footer';
import { FaPenToSquare } from 'react-icons/fa6';
import { uploadImagesToCloudinary } from '../../modules/cloudinary';
import { useTheme } from '../../modules/ThemeContext';
import { FaMoon } from 'react-icons/fa';
import { FiSun, FiLogOut } from 'react-icons/fi';

const Profile = () => {
  const navigate = useNavigate();
  const { user, changeCredentials, savePhoto, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account')
  document.title = 'Profile  |  DAOGROW';
    const [selectedMethod, setSelectedMethod] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const { theme, toggleTheme } = useTheme();

  const [file, setFile] = useState(null);

  const [TpesaNo, setTpesaNo] = useState('');

const handleUpload = async (file) => {
  if (!file) return toast.error('Please select an image');
  try {
    const [url] = await uploadImagesToCloudinary([file]);
    await savePhoto(url);
    toast.success('Photo updated');
  } catch (err) {
    toast.error('Failed to upload image');
  }
};


const handleSave = async () => {
  const result = await changeCredentials(data.username, data.email);
  if (result) {
    setIsEditing(false);
  }
};


  const handleLogout = async() => {
    await logout()
    navigate('/')
  }

  const switchTab = tab => {
    switch (tab) {
        case 'account':
            setActiveTab('account')
            break;
        case 'preferences':
            setActiveTab('preferences')
            break;

        default:
            setActiveTab('account')
            break;
    }
  }

  return (
    <div>
      <Header />
      <div className="profile-content">
        <div className="profile-root">
          <h2>Your Profile</h2>
          <span className="profile-image" />
          <label htmlFor="file-upload" className="upload-label">
            <FaPenToSquare />
            </label>
            <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
                if (e.target.files?.length) {
                    const selected = e.target.files[0];
                    setFile(selected);
                    handleUpload(selected);
                }
            }}

            />
          <span>Hello, {user?.username}</span>
        </div>

        { activeTab === 'account' && (
            <>
                {isEditing ? (
                <div className="profile-input-grp">
                    <input
                    type="text"
                    value={data.username}
                    className='profile-input'
                    onChange={(e) =>
                        setData((prev) => ({ ...prev, username: e.target.value }))
                    }
                    />
                    <input
                    type="email"
                    value={data.email}
                    className='profile-input'
                    onChange={(e) =>
                        setData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    />
                    <button className="btn-primary p-save-btn" onClick={handleSave}>Save</button>
                    <button className='btn-outline p-cancel-btn' onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
                ) : (
                <div className="profile-details">
                    <span className="username">{user?.username}</span>
                    <span className="email">{user?.email}</span>
                    <span className="recover-password">Password</span>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
                )}
            </>
        )}

        { activeTab === 'preferences' && <div className="pref-cont">
            <div className="payment-options-cont">
                <h4>Choose your prefered payment option</h4>
                <div className="options">
                    {['T-Pesa', 'Bank Transfer', 'Paypal', 'Pesapal'].map((item, index)=>(
                        <button key={index} className={selectedMethod === item ? 'active-method' : ''} onClick={() => setSelectedMethod(item)}>{item}</button>
                    ))}
                </div>
                <div className='option-tabs'>
                    {selectedMethod === 'T-Pesa' && <div className='m-input-grp'>
                        <input type="text" placeholder='Your T-Pesa number' onChange={(e)=>setTpesaNo(e.target.value)}/>
                        <button className="o-save-btn btn-primary">Save</button>
                    </div>}
                    {selectedMethod === 'Bank Transfer' && <div className='m-input-grp'>
                        <p>For now, this option is Not available</p>
                    </div>}
                    {selectedMethod === 'Paypal' && <div className='m-input-grp'>
                        <p>For now, this option is Not available</p>
                    </div>}
                    {selectedMethod === 'Pesapal' && <div className='m-input-grp'>
                        <input type='text' placeholder='Your Email' onChange={(e)=>setTpesaNo(e.target.value)}/>
                        <button className="o-save-btn btn-primary">Save</button>
                    </div>}
                </div>
            </div>
            <div className="theme-switch-cont">
                <h4>Change to your prefered theme</h4>
                <button className="toggle-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                    <span className="circle">
                        {theme === 'dark' ? <FiSun /> : <FaMoon />}
                    </span>
                    <span className="text">
                        {theme === 'dark' ? 'Light' : 'Dark'}
                    </span>
                </button>
            </div>
        </div> }

        <div className="profile-nav">
            <span className={`${activeTab === 'account' ? 'active' : ''}`} onClick={() => switchTab('account')}>Account</span>
            <span className={`${activeTab === 'preferences' ? 'active' : ''}`} onClick={() => switchTab('preferences')}>Preferences</span>
            <button className='btn-secondary' onClick={handleLogout}><span>Log out </span><FiLogOut /></button>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Profile;
