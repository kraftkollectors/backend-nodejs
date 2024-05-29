import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const ReportSchema = new Schema({
    reporterId: {
        type: String,
        required: true
    },
    reportedId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Report: any = mongoose.models.Report ||  mongoose.model('Report', ReportSchema);

export default Report