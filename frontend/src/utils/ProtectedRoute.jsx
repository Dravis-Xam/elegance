// components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../modules/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth(); // user null = not authenticated
  const storedUsername = localStorage.getItem("username");

  return (user || storedUsername) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
