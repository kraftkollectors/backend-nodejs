import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const EducationSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    certificate: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
}, { timestamps: true })


const Education: any = mongoose.models.Education ||  mongoose.model('Education', EducationSchema);

export default Education