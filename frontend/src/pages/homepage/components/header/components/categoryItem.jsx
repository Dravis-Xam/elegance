import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryItem = ({ category }) => {
    if (!category || !category.name) {
        return <div className="loading-circle">Loading category...</div>;
    }
    if(!category.products || category.products.length === 0) {
        return <div className="Edge">No products available in this category.</div>;
    }

    const navigate = useNavigate();
    const handleNavigate = (productId) => {
        navigate(`/shop?productId=${productId}`);
    }

    //console.log("Category Item Rendered:", category);
    return (
        <div className="menuColumn">
            <h4>{category.name}</h4>
            <ul className="menuList">
                {category.products.map((product) => (
                    <li key={product.id} className="menuItem">
                        <a onClick={() => handleNavigate(product.id)} className="menuLink">
                            {product.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryItem;
