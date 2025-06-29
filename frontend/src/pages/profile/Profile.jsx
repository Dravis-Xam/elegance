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

const Profile = () => {
  const navigate = useNavigate();
  const { user, changeCredentials, savePhoto, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account')
  document.title = 'Profile  |  DAOGROW';

  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const [file, setFile] = useState(null);

 const handleUpload = async () => {
  if (!file) return toast.error('Please select an image');
  try {
    const [url] = await uploadImagesToCloudinary([file]); // pass as array
    await savePhoto(url);
    toast.success('Photo updated');
  } catch (err) {
    toast.error('Failed to upload image');
  }
};

useEffect(()=> {
    handleUpload()
}, [file])

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
                setFile(e.target.files[0]);
                }
            }}
            />
          <span>{user?.username}</span>
        </div>
        { activeTab === 'account' && (
            <>
                {isEditing ? (
                <div className="profile-input-grp">
                    <input
                    type="text"
                    value={data.username}
                    onChange={(e) =>
                        setData((prev) => ({ ...prev, username: e.target.value }))
                    }
                    />
                    <input
                    type="email"
                    value={data.email}
                    onChange={(e) =>
                        setData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    />
                    <button className="btn-primary" onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
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
            <div className="payment-options-cont"></div>
            <div className="theme-switch-cont"></div>
        </div> }
        <div className="profile-nav">
            <span className={`${activeTab === 'account' ? 'active' : ''}`} onClick={() => switchTab('account')}>Account</span>
            <span className={`${activeTab === 'preferences' ? 'active' : ''}`} onClick={() => switchTab('preferences')}>Preferences</span>
            <span className='btn-secondary' onClick={handleLogout}>Log out</span>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Profile;
