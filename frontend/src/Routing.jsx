import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Homepage from "./pages/homepage/homepage";
import PageNotFound from "./pages/pagenotfound/PageNotFound";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import AboutPage from "./pages/aboutpage/AboutPage";
import ContactUs from "./pages/contactuspage/ContactUs";
import PrivacyPolicy from "./pages/privacypolicy/PrivacyPolicy";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/homepage/components/cart/Cart";
import Profile from "./pages/profile/Profile";
import SearchPage from "./pages/searchPage/SearchPage";
import Notifications from "./pages/Notifications/Notifications";
import Checkout from "./pages/checkout/Checkout";
import AdminPage from "./pages/adminpage/AdminPage";
import ProtectedRoute from "./utils/ProtectedRoute";


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/*" element={<Homepage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminPage />} />
                {/* add more protected routes here */}
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default AppRouter;
