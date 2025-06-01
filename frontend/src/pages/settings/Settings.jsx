import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css'

const Settings = () => {
    const navigate = useNavigate();
    document.title = "Settings  |  DAOGROW";
    return (
        <div>
            <h2>Settings</h2>
            <button onClick={()=>navigate('/')}>Home</button>
        </div>
    );
}

export default Settings;
