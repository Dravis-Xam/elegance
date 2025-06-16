import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const ProductSchema = new Schema({
    id: {
        type: String, required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    attributes: {
        type: [String],
    },
    thumbnail: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    unitQuantity: {
        type: [String],
    },
    amountInStock: {
        type: Number,
        required: true
    }
})


const Product = model('Products', ProductSchema);
export default Product;