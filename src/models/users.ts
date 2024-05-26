import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const AdminSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    livingArrangement: {
        type: String,
        required: true
    },
    questions: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    cloudinaryid: {
        type: String,
        required: false
    },
    approved: {
        type: Number,
        required: true,
        default: 0
    },
}, { timestamps: true })


const Admin: any = mongoose.model('Admin', AdminSchema);

export default Admin