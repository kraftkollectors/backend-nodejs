import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const ContactSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false,
        required: false,
    },
    resolved: {
        type: Boolean,
        default: false,
        required: false
    },
}, { timestamps: true })


const Contact: any = mongoose.models.Contact ||  mongoose.model('Contact', ContactSchema);

export default Contact