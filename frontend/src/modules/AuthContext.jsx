import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "./ToastStore";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const { userId, username, role, exp } = data.user;
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      sessionStorage.setItem("role", role);
      setUser({ userId, username, role, exp });
      return data.user?.role && (data.user?.role.toLowerCase() === "admin" ? <Navigate to={"/admin"} replace /> : <Navigate to={"/"} replace />);
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
      return data.user?.role && <Navigate to ={"/login"} replace />;
    } catch (err) {
      toast.error("Signup error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  //TODO: changeCredentials e.g username, email

 const changeCredentials = async (username, email) => {
  setLoading(true);
  if (!username || !email || username === '' || email === '') {
    toast.error("All fields are required");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/change-creds`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, email })
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Change credentials failed, try again later");
      return null;
    }

    toast.success("Update successful");
    await new Promise((r) => setTimeout(r, 100));
    return data.user;

  } catch (error) {
    toast.error('Could not change credentials. Try again later.');
    return null;
  } finally {
    setLoading(false);
  }
};


  //TODO: passwordRecovery

  const requestRecoveryCode = async (email) => {
    const res = await fetch(`${BASE_URL}/auth/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setToken(data.token); // store in local state
  };

  const verifyRecoveryCode = async (code) => {
    const res = await fetch(`${BASE_URL}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, token }),
    });
    const data = await res.json();
    return data.verified ? data.email : null;
  };


  const resetPassword = async (email, newPassword) => {
    await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
  };


  //save profile-photo url

const savePhoto = async (url) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/save-photo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo: url }),
    });
    if (!res.ok) throw new Error('Failed to save photo');
  } catch (err) {
    toast.error('Could not save profile photo');
  }
};

// save prefered payment option

const savePaymentOption = async (preferedPaymentOption, contact) => {
  await fetch(`${BASE_URL}/auth/update-payment-option`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({preferedPaymentOption, contact})
    }
  )
}

  const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    clearStoredAuth();
    setUser(null);
    return <Navigate to = '/login' replace />
  };

  const clearStoredAuth = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("role");
  };
  
  async function fetchUser() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/user`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to fetch user");
        return null;
      }
      const { userId, username, role, exp } = data.user;
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      sessionStorage.setItem("role", role);
      setUser({ userId, username, role, exp });
    } catch (err) {
      toast.error("Error fetching user");
    } finally {
      setLoading(false);
    }
  }

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
      value={{ user, isAuthenticated: !!user, loading, signup, login, logout, changeCredentials, requestRecoveryCode, verifyRecoveryCode, savePaymentOption, resetPassword, savePhoto }}
    >
      {children}
    </AuthContext.Provider>
  );
};