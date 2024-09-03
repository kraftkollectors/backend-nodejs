import dotenv from 'dotenv';
dotenv.config();
import Admin from '../../models/admin'
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Category from '../../models/category';
import SubCategory from '../../models/subcategory';
import Ad from '../../models/ads';


const SALT: any = process.env.SALT

const DashService = {
    getAdmin: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingAdmin = await Admin.findOne({ _id: id })

            if (!existingAdmin) {
                return { data: 'No admin found', statusCode: 404, msg: "Failure" };
            }            

            existingAdmin.password = ''

            return { data: { existingAdmin }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },

    getCategories: async (query: any) => {
        try {
            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            // adding search
            const keyword = query.q ? {
                title: {
                    $regex: query.q,
                    $options: 'i'
                }
            } : {}

            const existingRecords = await Category.find({ ...keyword })
            .sort({ createdAt: -1 })
            .limit(resPerPage)
            .skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { 
                        existingRecords,
                        totalDocuments: 0, 
                        hasPreviousPage: false, 
                        previousPages: 0, 
                        hasNextPage: false,      
                        nextPages: 0,
                        totalPages: 0,
                        currentPage: currentPageNum
                    },  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }           

            // Count the total number of documents
            const totalDocuments = await Category.countDocuments({ ...keyword });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = (totalPages - currentPageNum) < 0 ? 0 : totalPages - currentPageNum;

            // Fetch subcategories and service counts for each category
            const categoriesWithDetails = await Promise.all(existingRecords.map(async (category: any) => {
                const subcategories = await SubCategory.find({ categoryId: category._id });
                const serviceCount = await Ad.countDocuments({ category: category.title });

                return {
                    ...category._doc,
                    subcategories,
                    serviceCount
                };
            }));
               

            return { 
                data: { 
                    existingRecords: categoriesWithDetails,
                    totalDocuments, 
                    hasPreviousPage, 
                    previousPages, 
                    hasNextPage, 
                    nextPages,                    
                    totalPages,
                    currentPage: currentPageNum
                }, 
                statusCode: 201, 
                msg: "Success" 
            }

        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },

    getSingleCategory: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingRecord = await Category.findOne({ _id: id })

            if (!existingRecord) {
                return { data: 'No record found', statusCode: 404, msg: "Failure" };
            } 
            return { data: { existingRecord }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },

    getSUbCategories: async (query: any) => {
        try {
            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            // adding search
            const keyword = query.q ? {
                title: {
                    $regex: query.q,
                    $options: 'i'
                }
            } : {}

            const existingRecords = await SubCategory.find({ ...keyword })
            .sort({ createdAt: -1 })
            .limit(resPerPage)
            .skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { 
                        existingRecords,
                        totalDocuments: 0, 
                        hasPreviousPage: false, 
                        previousPages: 0, 
                        hasNextPage: false,      
                        nextPages: 0,
                        totalPages: 0,
                        currentPage: currentPageNum
                    },  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }           

            // Count the total number of documents
            const totalDocuments = await SubCategory.countDocuments({ ...keyword });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = (totalPages - currentPageNum) < 0 ? 0 : totalPages - currentPageNum;


            // Fetch subcategories and service counts for each category
            const subCategoriesWithDetails = await Promise.all(existingRecords.map(async (subCategory: any) => {
                const serviceCount = await Ad.countDocuments({ subCategory: subCategory.title });

                return {
                    ...subCategory._doc,
                    serviceCount
                };
            }));
               

            return { 
                data: { 
                    existingRecords: subCategoriesWithDetails,
                    totalDocuments, 
                    hasPreviousPage, 
                    previousPages, 
                    hasNextPage, 
                    nextPages,                    
                    totalPages,
                    currentPage: currentPageNum
                }, 
                statusCode: 201, 
                msg: "Success" 
            }
        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },

    getSingleSubCategory: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingRecord = await SubCategory.findOne({ _id: id })

            if (!existingRecord) {
                return { data: 'No record found', statusCode: 404, msg: "Failure" };
            }

            const serviceCount = await Ad.countDocuments({ subCategory: existingRecord.title });

            return { data: { existingRecord: { ...existingRecord, serviceCount } }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },

    

    editAdmin: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const admin = await Admin.findOne({ _id: id })

            if (!admin) {
                return { data: 'admin With The Specified id Not Found', statusCode: 404, msg: "Failure" };
            }

            // Compare passwords using bcrypt
            let olPassword: string = await bcrypt.hash(userData.oldPassword, SALT)

            if (olPassword !== admin.password) {
                return { data: 'Incorrect old password entered', statusCode: 401, msg: "Failure" };
            }

            userData.password = await bcrypt.hash(userData.password, SALT);

            let data = await Admin.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating account password', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing account password: ${error.message}`);
        }
    },

    editCategory: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Category.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating category', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing category: ${error.message}`);
        }
    },

    editSubCategory: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await SubCategory.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating subcategory', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing subcategory: ${error.message}`);
        }
    },

    addCategory: async (userData: any) => {
        try {

            const { title, subCategories } = userData

            // Check if a category with the same title already exists
            let existingCategory = await Category.findOne({ title });
            if (existingCategory) {
                return { data: 'Category with this title already exists', statusCode: 409, msg: "Failure" };
            }

            let data = await new Category({ title }).save();

            if(data !== null){
                // Transform subCategories array to array of objects with title property
                const subCategoriesWithTitle = subCategories.map((subcategory: string) => ({
                    title: subcategory,
                    categoryId: data._id // Assign the category _id to each subcategory
                }));

                // Iterate over each subcategory and save it
                for (let subcategory of subCategoriesWithTitle) {
                    // Check if a subcategory with the same categoryId and title already exists
                    let existingSubCategory = await SubCategory.findOne({ categoryId: subcategory.categoryId, title: subcategory.title });
                    if (existingSubCategory) {
                        return { data: `Subcategory with title "${subcategory.title}" already exists for this category`, statusCode: 409, msg: "Failure" };
                    }

                    await new SubCategory(subcategory).save();
                }
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating account password', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`error: ${error.message}`);
        }
    },

    
    addSubCategory: async (userData: any) => {
        try {
            // Extract categoryId and subCategories from userData
            const { categoryId, subCategories } = userData;

            // Transform subCategories array to array of objects with title property
            const subCategoriesWithTitle = subCategories.map((subCategory: string) => ({
                title: subCategory,
                categoryId: categoryId // Assign the categoryId to each subcategory
            }));
            
            // Create an array of promises for saving each subcategory
            const savePromises = subCategoriesWithTitle.map(async (subCategory: any) => {
                // Check if a subcategory with the same categoryId and title already exists
                let existingSubCategory = await SubCategory.findOne({ categoryId, title: subCategory.title });
                if (existingSubCategory) {
                    throw new Error(`Subcategory with title "${subCategory.title}" already exists for this category`);
                }

                // Create a new SubCategory instance with categoryId and subCategory data
                return await new SubCategory(subCategory).save();
            });

            // Wait for all subcategory save operations to complete
            const savedSubCategories = await Promise.all(savePromises);

            // Check if all subcategories were saved successfully
            if (savedSubCategories.every(data => data !== null)) {
                return { data: { savedSubCategories }, statusCode: 201, msg: "Success" };
            } else {
                return { data: 'Error saving one or more subcategories', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`error: ${error.message}`);
        }
    },

    deleteCategory: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await Category.findByIdAndDelete({ _id: id })

            return { data: 'category deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching category: ${error.message}`);
        }
    },

    deleteSubCategory: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await SubCategory.findByIdAndDelete({ _id: id })

            return { data: 'subcategory deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching subcategory: ${error.message}`);
        }
    },

}


export default DashService;