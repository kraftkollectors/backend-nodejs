import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const CertificateSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    certificate: {
        type: String,
        required: true
    },
    certifiedBy: {
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