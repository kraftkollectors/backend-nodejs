import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const ReviewSchema = new Schema({
    ownerId: {
        type: String,
        required: true
    },
    serviceId: {
        type: String,
        required: true
    },
    reviewerId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
}, { timestamps: true })


const Review: any = mongoose.models.Review ||  mongoose.model('Review', ReviewSchema);

export default Review