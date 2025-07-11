import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNotifications } from "./NotificationContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const defaultHeaders = { 'Content-Type': 'application/json' };

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const { notifications } = useNotifications();

  const orderUpdates = useMemo(() => {
    return notifications
      .filter(n => n.type === "Order update")
      .map(n => ({
        ...n,
        message: (() => {
          try {
            return JSON.parse(n.metadata);
          } catch {
            return { error: "Invalid JSON" };
          }
        })(),
      }));
  }, [notifications]);

  const resetErrors = () => setErrors([]);

  const handleResponse = async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Unknown error");
    return data;
  };

  const fetchAllOrder = async () => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await fetch(`${BASE_URL}/orders/all`, {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      });
      const data = await handleResponse(res);
      setOrders(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Fetch all orders failed:", err);
      setErrors(prev => [...prev, err.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrder = async () => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      });
      const data = await handleResponse(res);
      setOrders(Array.isArray(data.data) ? data.data : [data.data]);
    } catch (err) {
      console.error("Fetch order failed:", err);
      setErrors(prev => [...prev, err.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const findOrder = async (query) => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await fetch(`${BASE_URL}/orders/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      });
      const data = await handleResponse(res);
      return Array.isArray(data.data) ? data.data : [data.data];
    } catch (err) {
      console.error("Search order failed:", err);
      setErrors(prev => [...prev, err.message]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const findYourOrder = async (id) => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await fetch(`${BASE_URL}/orders/${id}`, {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      });
      const data = await handleResponse(res);
      return Array.isArray(data.data) ? data.data : [data.data];
    } catch (err) {
      console.error("Fetch your order failed:", err);
      setErrors(prev => [...prev, err.message]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addOrder = async (orderData) => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await fetch(`${BASE_URL}/orders/add`, {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: JSON.stringify(orderData),
      });
      const data = await handleResponse(res);
      if (Array.isArray(data.data) && data.data.length > 0) {
        setOrders(prev => [...prev, data.data[0]]);
        console.log(data.data[1]); // Possibly USSD log
      }
    } catch (err) {
      console.error("Add order failed:", err);
      setErrors(prev => [...prev, err.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrder = async (orderData) => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await fetch(`${BASE_URL}/orders/edit/${orderData.id}`, {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: JSON.stringify(orderData),
      });
      const data = await handleResponse(res);
      if (data.data?.id) {
        setOrders(prev => prev.map(o => (o.id === data.data.id ? data.data : o)));
      }
    } catch (err) {
      console.error("Update order failed:", err);
      setErrors(prev => [...prev, err.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await fetch(`${BASE_URL}/orders/delete/${id}`, {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      });
      await handleResponse(res);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Delete order failed:", err);
      setErrors(prev => [...prev, err.message]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const contextValue = useMemo(() => ({
    orders,
    orderUpdates,
    fetchAllOrder,
    fetchOrder,
    refetchOrders: fetchOrder,
    findOrder,
    findYourOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    isLoading,
    errors,
  }), [orders, orderUpdates, isLoading, errors]);

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
