import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import AppRouter from './Routing.jsx';
import { AuthProvider } from './modules/AuthContext.jsx';
import { ThemeProvider } from './modules/ThemeContext.jsx';
import { CartProvider } from './modules/CartContext.jsx';
import { ProductProvider } from './modules/ProductContext';
import { CategoryProvider } from './modules/CategoryContext.jsx';
import { TestimonialProvider } from './modules/TestimonialContext.jsx';
import { NotificationProvider} from './modules/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <TestimonialProvider>
            <ProductProvider>
              <CategoryProvider>
                <CartProvider>
                  <ThemeProvider>
                    <AppRouter />
                  </ThemeProvider>
                </CartProvider>
              </CategoryProvider>
            </ProductProvider>
          </TestimonialProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>
);
