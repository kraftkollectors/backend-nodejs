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
    description: {
        type: String,
        required: true
    },
    amount: {
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
    publicId: {
        type: String,
        required: true
    },
    portfolio: {
        type: String,
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