import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const ArtisanSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    workHourFrom: {
        type: String,
        required: true
    },
    workHourTo: {
        type: String,
        required: true
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
    linkedin: {
        type: String,
        required: false,
        default: ''
    },
    phoneNumber: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    businessName: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    areaOfSpecialization: {
        type: String,
        required: true
    },
    showContact: {
        type: Boolean,
        required: true
    },
    awayMessage: {
        type: String,
        required: true
    },
    nin: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: false,
        default: true
    },
}, { timestamps: true })


const Artisan: any = mongoose.models.Artisan ||  mongoose.model('Artisan', ArtisanSchema);

export default Artisan