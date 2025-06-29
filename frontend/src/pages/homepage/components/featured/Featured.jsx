import React from 'react';
import './Featured.css';
import Listing from '../../../shop/components/listing/Listing';
import { useProduct } from '../../../../modules/ProductContext';

const Featured = () => {
  const { products } = useProduct();
  const featuredProducts = Array.isArray(products) ? products.slice(0, 3) : [];

  return (
    <div className='featured-section' id='featured'>
      <h2>Featured Section</h2>
      {featuredProducts.length === 0 ? (
        <p>No featured products available.</p>
      ) : (
        <Listing products={featuredProducts} />
      )}
    </div>
  );
};

export default Featured;
// This component fetches the featured products from the ProductContext and displays them using the Listing component.