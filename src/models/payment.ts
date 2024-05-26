import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const PaymentSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    active: {
        default: true,
        type: Boolean,
        required: true
    },
}, { timestamps: true })


const Payment: any = mongoose.model('Payment', PaymentSchema);

export default Payment