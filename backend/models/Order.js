import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    productIds: {
        type: [String],
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    address: {
        country: {
            type: String,
        },
        county: {
            type: String,
        },
        location: {
            type: String,
        },
        town: {
            type: String,
        }
    }
})

const Order = model("Orders", orderSchema)
export default Order; 