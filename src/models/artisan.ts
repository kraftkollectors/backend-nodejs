import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const ArtisanSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    businessName: {
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
    workingHour: {
        type: String,
        required: true
    },
    nin: {
        type: String,
        required: true
    },
}, { timestamps: true })


const Artisan: any = mongoose.models.Artisan ||  mongoose.model('Artisan', ArtisanSchema);

export default Artisan