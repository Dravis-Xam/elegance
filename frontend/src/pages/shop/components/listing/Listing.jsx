import ProductCard from "../ProductCard/ProductCard";
import './Listing.css';

export default function Listing( {products} ) {
    return (
        <div className="listing-area">
            {products.map(( product, index) => (
                <ProductCard
                    product={product} key={index}
                />
            ))}
        </div>
    );
}
