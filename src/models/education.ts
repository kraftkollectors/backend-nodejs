import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const EducationSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    areaOfStudy: {
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