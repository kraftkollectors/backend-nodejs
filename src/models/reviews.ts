import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const ReviewSchema = new Schema({
    serviceId: {
        type: String,
        required: true
    },
    userId: {
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