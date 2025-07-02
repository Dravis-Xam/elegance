import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNotifications } from "./NotificationContext";
import api from "../utils/api.js";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const { notifications } = useNotifications();

  // Filter notifications of type 'Order update'
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

  const fetchAllOrder = async () => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await api.get("/orders/all");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch all orders:", err);
      setErrors(prev => [...prev, err?.message || "Unknown error"]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrder = async () => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await api.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setErrors(prev => [...prev, err?.message || "Unknown error"]);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchOrders = fetchOrder;

  const findOrder = async (query) => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await api.get(`/orders/search?q=${encodeURIComponent(query)}`);
      return Array.isArray(res.data) ? res.data : [res.data];
    } catch (err) {
      console.error("Failed to search order:", err);
      setErrors(prev => [...prev, err?.message || "Unknown error"]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const findYourOrder = async (id) => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await api.get(`/orders/${id}`);
      return Array.isArray(res.data) ? res.data : [res.data];
    } catch (err) {
      console.error("Failed to fetch your order:", err);
      setErrors(prev => [...prev, err?.message || "Unknown error"]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addOrder = async (orderData) => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await api.post("/orders/add", orderData);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setOrders(prev => [...prev, res.data[0]]);
        console.log(res.data[1]); // e.g., pushUSSD result
      }
    } catch (err) {
      console.error("Failed to add order:", err);
      setErrors(prev => [...prev, err?.message || "Unknown error"]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrder = async (orderData) => {
    setIsLoading(true);
    resetErrors();
    try {
      const res = await api.put(`/orders/edit/${orderData.id}`, orderData);
      if (res.data?.id) {
        setOrders(prev => prev.map(o => (o.id === res.data.id ? res.data : o)));
      }
    } catch (err) {
      console.error("Failed to update order:", err);
      setErrors(prev => [...prev, err?.message || "Unknown error"]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    setIsLoading(true);
    resetErrors();
    try {
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Failed to delete order:", err);
      setErrors(prev => [...prev, err?.message || "Unknown error"]);
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
    refetchOrders,
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
