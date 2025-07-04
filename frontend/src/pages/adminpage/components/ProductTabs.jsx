import React from 'react';

const ProductTabs = () => {
    return (
        <div>
            <h1>Product Management</h1>
            <p>Manage your products here.</p>
            {/* Add more product functionalities here */}
            <ul>
                <li><a href="/admin/products/add">Add Product</a></li>
                <li><a href="/admin/products/list">List Products</a></li>
                <li><a href="/admin/products/edit">Edit Product</a></li>
                <li><a href="/admin/products/delete">Delete Product</a></li>
            </ul>
        </div>
    );
}

export default ProductTabs;
