import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const ReviewSchema = new Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ad',
        required: false
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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