import React, { useState, useEffect } from 'react';
import { Input, Avatar, Badge, Dropdown, Space, notification } from 'antd';
import { 
  SearchOutlined, 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SkinOutlined,
  CrownOutlined
} from '@ant-design/icons';

const { Search } = Input;

const SearchBar = () => (
  <Search 
    placeholder="Search products, clients, appointments..." 
    enterButton={<SearchOutlined style={{ color: '#ff4d6d' }} />}
    size="large"
    className="luxury-search"
    onSearch={value => notification.success({
      message: 'Beautiful Choice!',
      description: `Searching our collection for "${value}"`,
      icon: <SkinOutlined style={{ color: '#ff4d6d' }} />,
    })}
  />
);

const Header = () => {
  const storedUsername = localStorage.getItem("username") || "Beauty Admin";
  const [notificationCount, setNotificationCount] = useState(3);
  const [salesToday, setSalesToday] = useState(1242);

  // Simulate salon activity
  useEffect(() => {
    const interval = setInterval(() => {
      // New notifications for appointments
      if (Math.random() > 0.8) {
        setNotificationCount(prev => prev + 1);
        const messages = [
          'New booking request from VIP client',
          'Product restock arrived',
          'Client left a 5-star review!'
        ];
        notification.info({
          message: 'Salon Update',
          description: messages[Math.floor(Math.random() * messages.length)],
          icon: <CrownOutlined style={{ color: '#ff4d6d' }} />,
        });
      }
      
      // Simulate sales throughout the day
      setSalesToday(prev => prev + Math.floor(Math.random() * 3));
    }, 15000);

    return () => clearInterval(interval);
  }, []);


  return (
    <header className="beauty-header">
      <div className="header-left">
        <span className="beauty-logo">
          <SkinOutlined style={{ 
            marginRight: 10, 
            color: '#ff4d6d',
            fontSize: '1.5em'
          }} />
          Daogrow Admin
        </span>
      </div>
      
      <div className="header-center">
        <SearchBar />
      </div>
      
      <div className="header-right">
        <Space size="large">
          <Badge 
            count={notificationCount} 
            overflowCount={9}
            style={{ 
              backgroundColor: '#ff4d6d',
              boxShadow: '0 0 0 1px #fff'
            }}
          >
            <Avatar 
              icon={<BellOutlined />} 
              className="notification-bell"
              style={{ backgroundColor: 'rgba(255,77,109,0.1)' }}
              onClick={() => {
                setNotificationCount(0);
                notification.success({
                  message: 'All caught up!',
                  description: 'No new notifications',
                });
              }}
            />
          </Badge>
          
          <div className="sales-counter">
            <ShoppingCartOutlined style={{ marginRight: 5 }} />
            <span>${salesToday.toLocaleString()}</span>
            <small>today</small>
          </div>
        
        </Space>
      </div>
    </header>
  );
};

export default Header;