import React from 'react';
import './AdminPage.css'; // Assuming you have a CSS file for styling
import { useAuth } from '../../modules/AuthContext';
import AppSider from './components/Sider';
import Header from './components/Header';

const AdminPage = () => {
    const { user } = useAuth();
    return (
        <div className='admin-page'>
            <Header />
            <AppSider />
        </div>
    );
}

export default AdminPage;
