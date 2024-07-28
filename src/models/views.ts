import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const viewSchema = new Schema({
    serviceId: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        required: true
    }
}, { timestamps: true })


const View: any = mongoose.models.View ||  mongoose.model('View', viewSchema);

export default View