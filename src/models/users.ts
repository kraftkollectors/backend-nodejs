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
    picture: {
        type: String,
        required: false,
        default: ''
    },
    workHour: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false,
        default: ''
    },
    instagram: {
        type: String,
        required: false,
        default: ''
    },
    twitter: {
        type: String,
        required: false,
        default: ''
    },
    facebook: {
        type: String,
        required: false,
        default: ''
    },
    linkedln: {
        type: String,
        required: false,
        default: ''
    },
    aboutMe: {
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
}, { timestamps: true })


const User: any = mongoose.models.User ||  mongoose.model('User', UserSchema);

export default User