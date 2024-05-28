import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const AdSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estimatedPrice: {
        type: Number,
        required: true
    },
    charge: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String,
        required: true
    },
    portfolio: {
        type: [],
        required: true
    },
    active: {
        default: true,
        type: Boolean,
        required: true
    },
}, { timestamps: true })


const Ad: any = mongoose.models.Ad || mongoose.model('Ad', AdSchema);

export default Ad