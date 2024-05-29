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
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: false,
        default: ''
    },
    longitude: {
        type: String,
        required: false,
        default: ''
    },
    coverPhoto: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: false,
        default: ''
    },
    portfolio: {
        type: [
            'https:/',
            'https:/',
            'https:/'
        ],
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