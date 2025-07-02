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
    },
    productIds: {
        type: [String],
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    paymentDetails: {
        paymentMethod: {
            type: String,
            enum: ['T-Pesa', 'bank transfer', 'paypal', 'pesapal'],
            default: 'T-Pesa'
        },
        paymentData: {
            type: String,
        }
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
        },
        coordinates: {
            type: [Number],
            index: '2dsphere' // For geospatial queries
        }
    }
})

const Order = model("Orders", orderSchema)
export default Order; 