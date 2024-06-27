import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
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
    image: {
        type: String,
        required: false,
        default: ''
    },
    publicId: {
        type: String,
        required: false,
        default: ''
    },
    isArtisan: {
        type: Boolean,
        required: false,
        default: false
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    },
    emailVerify: {
        type: Boolean,
        required: false,
        default: false
    },
    otp: {
        type: String,
        required: false,
        default: ''
    },
    lastSeen: {
        type: String,
        required: false,
        default: ''
    },
    paymentPlan: {
        type: String,
        required: false,
        default: 'None'
    },
}, { timestamps: true })


const User: any = mongoose.models.User ||  mongoose.model('User', UserSchema);

export default User