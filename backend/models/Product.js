import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const ProductSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String, required: true
    },
    attributes: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    unitAmount: {
        type: [String],
        requied: true
    },
    amountInStock: {
        type: Number,
        required: true
    }
})


const Product = model('Client', ProductSchema);
export default Product;