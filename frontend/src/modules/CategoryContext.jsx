import { useProduct } from "./ProductContext";
import { createContext, useContext, useMemo } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const { products } = useProduct();

  const categoryList = useMemo(() => {
    if (!products?.length) return [];

    const grouped = products.reduce((acc, product) => {
        const key = product.category;
        if (key) {
        (acc[key] ||= []).push(product);
        }
        return acc;
    }, {});

    return Object.entries(grouped)
        .map(([name, products]) => ({ name, products }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }, [products]);


  if (!products || products.length === 0) {
    return <div className="loading-circle">Loading categories...</div>;
  }

  return (
    <CategoryContext.Provider value={{ categoryList }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
