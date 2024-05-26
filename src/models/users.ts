import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const UserSchema = new Schema({
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
}, { timestamps: true })


const User: any = mongoose.models.User ||  mongoose.model('User', UserSchema);

export default User