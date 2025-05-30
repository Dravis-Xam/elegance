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

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default AppRouter;
