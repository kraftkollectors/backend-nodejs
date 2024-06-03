import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const savedAdSchema = new Schema({
    serviceId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true })


const savedAd: any = mongoose.models.savedAd ||  mongoose.model('savedAd', savedAdSchema);

export default savedAd