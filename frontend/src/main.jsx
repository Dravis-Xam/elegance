import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import AppRouter from './Routing.jsx';
import { AuthProvider } from './modules/AuthContext.jsx';
import { ThemeProvider } from './modules/ThemeContext.jsx';
import { CartProvider } from './modules/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <AppRouter />
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
