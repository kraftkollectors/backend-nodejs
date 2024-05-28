import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Category: any = mongoose.models.Category ||  mongoose.model('Category', CategorySchema);

export default Category