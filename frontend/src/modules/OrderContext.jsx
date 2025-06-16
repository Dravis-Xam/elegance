//order context
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// ------------------- Context Setup -------------------

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setError] = useState([])
  // ------------------- CRUD Operations -------------------

  const fetchOrder = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/");
      setOrder(res.data || []);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setError(prev => [...prev, err])
    } finally {
      setIsLoading(false)
    }
  };

const findOrder = async (query) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/order/search?q=${encodeURIComponent(query)}`);
    return Array.isArray(res.data) ? res.data : [res.data];
  } catch (err) {
    console.error("Failed to fetch order:", err);
    setError(prev => [...prev, err]);
    return [];
  } finally {
    setIsLoading(false);
  }
};



  const addOrder = async (orderData) => {
    try {
      const res = await axios.post("http://localhost:5000/api/order/add", orderData);
      setOrder((prev) => [...prev, res.data[0]]);
      console.log(res.data[1]) //testing 
    } catch (err) {
      console.error("Failed to add product:", err);
      setError(prev => [...prev, err])
    }finally {
      setIsLoading(false)
    }
  };

  const updateOrder = async (orderData) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/order/edit/${orderData.id}`, orderData);
      setOrder((prev) =>
        prev.map((p) => (p.id === res.data.id ? res.data : p))
      );
    } catch (err) {
      console.error("Failed to update product:", err);
      setError(prev => [...prev, err])
    }finally {
      setIsLoading(false)
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/order/delete/${id}`);
      setOrder((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete order:", err);
      setError(prev => [...prev, err])
    }finally {
      setIsLoading(false)
    }
  };

  // ------------------- Initial Fetch -------------------

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        order,
        findOrder,
        fetchOrder,
        addOrder,
        updateOrder,
        deleteOrder,
        errors, 
        isLoading
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// ------------------- Hook -------------------

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
