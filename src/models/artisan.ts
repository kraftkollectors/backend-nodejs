import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const ArtisanSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workHourFrom: {
        type: String,
        required: false
    },
    workHourTo: {
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
    state: {
        type: String,
        required: false
    },
    lga: {
        type: String,
        required: false
    },
    areaOfSpecialization: {
        type: String,
        required: true
    },
    showContact: {
        type: Boolean,
        required: false
    },
    awayMessage: {
        type: String,
        required: false
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