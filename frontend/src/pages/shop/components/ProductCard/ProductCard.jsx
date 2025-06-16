import './ProductCard.css'

const ProductCard = ( { product } ) => {
    return (
        <div className='container'>
            {product.name}
        </div>
    );
}

export default ProductCard;
