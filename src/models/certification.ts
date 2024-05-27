import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const CertificateSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: false
    },
    year: {
        type: String,
        required: false
    },
}, { timestamps: true })


const Certificate: any = mongoose.models.Certificate ||  mongoose.model('Certificate', CertificateSchema);

export default Certificate