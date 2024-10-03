import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const ReportSchema = new Schema({
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ad',
        required: false
    },
    text: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false,
        required: false
    },
    resolved: {
        type: Boolean,
        default: false,
        required: false
    },
}, { timestamps: true })


const Report: any = mongoose.models.Report ||  mongoose.model('Report', ReportSchema);

export default Report