import React, { useState } from 'react';
import { Layout, Menu, Avatar, Badge, Divider, Tooltip } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import './Sider.css';

import ProductForm from '../../homepage/components/forms/ProductForm';
import Dashboard from './Dashboard';
import ClientTabs from './ClientTabs';
import Settings from './Settings';
import ProductTabs from './ProductTabs';
import Account from './Account';
import TestimonialTab from './Testimonial';
import { useAuth } from '../../../modules/AuthContext';

const { Sider } = Layout;

const storedUsername = localStorage.getItem("username");

const AppSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [openKeys, setOpenKeys] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);

  const { logout } = useAuth()

  const userData = {
    name: storedUsername || 'Admin User',
    role: 'Admin',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    notifications: 3
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      console.log('Logging out...');
      logout();
    } else {
      setSelectedKey(key);
    }
  };

  const toggleProductForm = () => {
    setShowProductForm(true);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      className: 'menu-item-dashboard'
    },
    {
      key: 'clients',
      icon: <TeamOutlined />,
      label: 'Clients',
      children: [
        { key: 'client-logs', label: 'Logs', icon: <FileTextOutlined /> },
        { key: 'client-purchases', label: 'Purchases', icon: <ShoppingCartOutlined /> },
        { key: 'client-manage', label: 'Manage', icon: <TeamOutlined /> },
      ],
      className: 'menu-item-clients'
    },
    {
      key: 'products',
      icon: <AppstoreOutlined />,
      label: 'Products',
      children: [
        { key: 'product-logs', label: 'Logs', icon: <FileTextOutlined /> },
        { key: 'product-sales', label: 'Sales', icon: <ShoppingCartOutlined /> },
        { key: 'product-manage', label: 'Manage', icon: <AppstoreOutlined /> },
      ],
      className: 'menu-item-products'
    },
    {
      key: 'testmonials',
      icon: <MessageOutlined />,
      label: 'Testimonials',
      className: 'menu-item-testimonials'
    }
    ,
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'My Account',
      className: 'menu-item-account'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      className: 'menu-item-settings'
    }
  ];

  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        className="custom-sider"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sider-content"
        >
          {/* Header with Collapse Button */}
          <div className="sider-header">
            {!collapsed && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="logo-container"
              >
                <span className="logo">DAOGROW</span>
                <span className="logo-sub">Admin Panel</span>
              </motion.div>
            )}
            <Tooltip title={collapsed ? "Expand" : "Collapse"} placement="right">
              <div
                className="collapse-button"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
            </Tooltip>
          </div>

          {/* User Profile Section */}
          {!collapsed && (
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="user-profile"
            >
              <Avatar size={64} src={userData.avatar} className="user-avatar" />
              <div className="user-info">
                <h4>{userData.name}</h4>
                <p>{userData.role}</p>
              </div>
              <Badge count={userData.notifications} className="notification-badge">
                <BellOutlined className="notification-icon" />
              </Badge>
            </motion.div>
          )}

          {/* Quick Action Button */}
          {!collapsed ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="quick-action"
            >
              <button className="action-button" onClick={toggleProductForm}>
                <PlusOutlined /> New Product
              </button>
            </motion.div>
          ) : (
            <Tooltip title="New Product" placement="right">
              <div className="quick-action-collapsed" onClick={toggleProductForm}>
                <PlusOutlined />
              </div>
            </Tooltip>
          )}

          <Divider className="sider-divider" />

          {/* Main Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={handleMenuClick}
            items={menuItems}
            className="custom-menu"
          />

          {/* Footer */}
          <div className="sider-footer">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[]}
              className="footer-menu"
              onClick={handleMenuClick}
              items={[
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: collapsed ? '' : 'Logout',
                  className: 'menu-item-logout',
                }
              ]}
            />
            {!collapsed && (
              <div className="version-info">
                v2.4.1 • © 2023
              </div>
            )}
          </div>
        </motion.div>
      </Sider>

      {/* AnimatePresence content rendering */}
      <AnimatePresence>
        {showProductForm && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="product-form-wrapper"
            style={{
              padding: 20,
              background: 'transparent',
              borderRadius: 8,
              position: 'absolute',
              top: 50,
              left: collapsed ? 80 : 300,
              zIndex: 999
            }}
          >
            <ProductForm
              isEditing={false}
              onCancel={() => setShowProductForm(false)}
            />
          </motion.div>
        )}

        {selectedKey === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="dashboard-wrapper"
            style={{
              padding: 20,
              background: 'transparent',
              borderRadius: 8,
              position: 'absolute',
              top: 50,
              left: collapsed ? 80 : 300,
              zIndex: 999
            }}
          >
            <Dashboard />
          </motion.div>
        )}

        {selectedKey.startsWith('client') && (
          <motion.div
            key="clients"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="clients-wrapper"
            style={{
              padding: 20,
              background: 'transparent',
              borderRadius: 8,
              position: 'absolute',
              top: 50,
              left: collapsed ? 80 : 300,
              zIndex: 999
            }}
          >
            <ClientTabs />
          </motion.div>
        )}

        {selectedKey.startsWith('product') && (
          <motion.div
            key="products"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="products-wrapper"
            style={{
              padding: 20,
              background: 'transparent',
              borderRadius: 8,
              position: 'absolute',
              top: 50,
              left: collapsed ? 80 : 300,
              zIndex: 999
            }}
          >
            <ProductTabs />
          </motion.div>
        )}

        {selectedKey.startsWith('testimonials') && (
          <motion.div
            key="testimonials"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="testimonials-wrapper"
            style={{
              padding: 20,
              background: 'transparent',
              borderRadius: 8,
              position: 'absolute',
              top: 50,
              left: collapsed ? 80 : 300,
              zIndex: 999
            }}
          >
            <TestimonialTab />
          </motion.div>
        )}

        {selectedKey === 'account' && (
          <motion.div
            key="account"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="account-wrapper"
            style={{
              padding: 20,
              background: 'transparent',
              borderRadius: 8,
              position: 'absolute',
              top: 50,
              left: collapsed ? 80 : 300,
              zIndex: 999
            }}
          >
            <Account />
          </motion.div>
        )}

        {selectedKey === 'settings' && (
          <motion.div
            key="settings"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="settings-wrapper"
            style={{
              padding: 20,
              background: 'transparent',
              borderRadius: 8,
              position: 'absolute',
              top: 50,
              left: collapsed ? 80 : 300,
              zIndex: 999
            }}
          >
            <Settings />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppSider;
