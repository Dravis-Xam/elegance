import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "./ToastStore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      const { userId, username, role, exp } = data;
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      sessionStorage.setItem("role", role);
      setUser({ userId, username, role, exp });
    } catch (err) {
      setUser(null);
      clearStoredAuth();
    }
  };

  const login = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return null;
      }
      toast.success("Login successful");
      await new Promise((res) => setTimeout(res, 100));
      await fetchUser();
      return data.client.role;
    } catch (err) {
      toast.error("Login error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return null;
      }
      toast.success("Signup successful");
      await new Promise((res) => setTimeout(res, 100));
      await fetchUser();
      return data.client.role;
    } catch (err) {
      toast.error("Signup error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    clearStoredAuth();
    setUser(null);
  };

  const clearStoredAuth = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("role");
  };

  useEffect(() => { fetchUser(); }, []);

  useEffect(() => {
    if (user?.exp) {
      const timeout = user.exp * 1000 - Date.now();
      if (timeout <= 1000) logout();
      else {
        const timer = setTimeout(() => {
          toast.error("Session expired. You have been logged out.");
          logout();
        }, timeout);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, signup, login, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};