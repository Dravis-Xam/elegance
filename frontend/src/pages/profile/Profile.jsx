import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/AuthContext';
import './Profile.css'
import { toast } from '../../modules/ToastStore';
import ToastContainer from '../../utils/toasts/ToastContainer';

const Profile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    document.title = "Profile  |  DAOGROW";
    return (
        <div>
            <h2>Profile</h2>
            <button onClick={()=>navigate('/')}>Home</button>
            <button onClick={()=>{logout(); toast.success('Logged out'); navigate('/');}}>Logout</button>
            <ToastContainer />
        </div>
    );
}

export default Profile;
