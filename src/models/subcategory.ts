import mongoose from "mongoose"
const Schema: any = mongoose.Schema

const SubCategorySchema = new Schema({
    categoryId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
}, { timestamps: true })


const SubCategory: any = mongoose.models.SubCategory ||  mongoose.model('SubCategory', SubCategorySchema);

export default SubCategory