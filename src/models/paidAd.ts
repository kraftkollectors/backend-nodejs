import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const PaidAdSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    image: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    }
}, { timestamps: true })


const PaidAd: any = mongoose.models.PaidAd || mongoose.model('PaidAd', PaidAdSchema);

export default PaidAd