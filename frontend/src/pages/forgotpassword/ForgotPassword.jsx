import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate()
    return (
        <div>
            Forgot Password
            <button onClick={()=>navigate('/')}>Home</button>
        </div>
    );
}

export default ForgotPassword;
