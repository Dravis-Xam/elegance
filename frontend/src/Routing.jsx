import React from "react";
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
import DetailPage from "./pages/detailPage/DetailPage";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";
import SearchPage from "./pages/searchPage/SearchPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/details" element={<DetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default AppRouter;
