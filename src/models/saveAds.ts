import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const savedAdSchema = new Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ad',
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true })


const savedAd: any = mongoose.models.savedAd ||  mongoose.model('savedAd', savedAdSchema);

export default savedAd