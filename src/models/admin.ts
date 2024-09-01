import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: false,
        default: ''
    },
}, { timestamps: true })


const Admin: any =  mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export default Admin