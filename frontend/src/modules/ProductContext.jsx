import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "./ToastStore";

// ------------------- Context Setup -------------------

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setError] = useState([])
  // ------------------- CRUD Operations -------------------

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/products/`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(prev => [...prev, err])
    } finally {
      setIsLoading(false)
    }
  };

const findProduct = async (query) => {
  try {
    const res = await axios.get(`${baseUrl}/products/search?q=${encodeURIComponent(query)}`);
    return Array.isArray(res.data) ? res.data : [res.data];
  } catch (err) {
    console.error("Failed to fetch products:", err);
    setError(prev => [...prev, err]);
    return [];
  } finally {
    setIsLoading(false);
  }
};



  const addProduct = async (productData) => {
    try {
      const res = await axios.post(`${baseUrl}/products/add`, productData);
      setProducts((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add product:", err);
      setError(prev => [...prev, err])
    }finally {
      setIsLoading(false)
    }
  };

  const updateProduct = async (productData) => {
    try {
      if (!productData.id) {
        console.log("No id passed: ", productData?.id)
        return;
      }
      const res = await axios.put(`${baseUrl}/products/edit/${productData.id}`, productData);
      setProducts((prev) =>
        prev.map((p) => (p.id === res.data.id ? res.data : p))
      );
    } catch (err) {
      console.error("Failed to update product:", err);
      setError(prev => [...prev, err])
    }finally {
      setIsLoading(false)
    }
  };

  const deleteProduct = async (id) => {
    try {
      if (!productData.id) {
        console.log("No id passed: ", productData?.id)
        return;
      }
      await axios.delete(`${baseUrl}/products/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError(prev => [...prev, err])
    }finally {
      setIsLoading(false)
    }
  };

  // ------------------- Initial Fetch -------------------

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        findProduct,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        errors, 
        isLoading
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// ------------------- Hook -------------------

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
