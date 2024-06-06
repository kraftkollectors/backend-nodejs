import dotenv from 'dotenv';
dotenv.config();
import Ad from '../../models/ads'
import Category from '../../models/category'
import SubCategory from '../../models/subcategory'
import Report from '../../models/report'
import savedAd from '../../models/saveAds'
import mongoose from 'mongoose';
import { UserDataAds, UserDataReport } from '../../types/user/defaultTypes';
import Review from '../../models/reviews';


const AdsService = {
    getAllAd: async (query: any) => {
        try {
            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            const existingRecords = await Ad.find({ active: true })
            .limit(resPerPage)
            .skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { 
                        existingRecords, 
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
            const totalDocuments = await Ad.countDocuments({ active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = totalPages - currentPageNum;
            
            

            return { 
                data: { 
                    existingRecords, 
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
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    getSingleAd: async (id: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingRecord = await Ad.findOne({ _id: id })

            if (!existingRecord) {
                return { data: 'No record found', statusCode: 404, msg: "Failure" };
            }
            
            // Extract the category and subcategory of the existing ad
            const { category, subcategory } = existingRecord;

            // Create a query object to find similar ads
            const query = {
                $or: [
                    { category: category },
                    { subcategory: subcategory }
                ],
                _id: { $ne: id }
            };

            // Find 10 similar ads in the same category or subcategory, excluding the current ad
            const similarAds = await Ad.find(query).limit(10);

            return { data: { existingRecord, similarAds }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    getsavedAd: async (query: any, userid: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(userid)

            if(!isValidId){
                return { data: 'Please enter a valid id', statusCode: 404, msg: "Failure" };
            }

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            
            const existingRecords = await savedAd.find({ userId: userid }).lean()
            .limit(resPerPage)
            .skip(skip)


            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { 
                        existingRecords, 
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

            // Extract serviceIds from savedAds
            const serviceIds: any = existingRecords.map((saveAds: any) => saveAds.serviceId);

            // Fetch product details for each productId
            const saved: any = await Ad.find({ _id: { $in: serviceIds } }).lean();


            // Count the total number of documents
            const totalDocuments = await Ad.countDocuments({ userid, active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = totalPages - currentPageNum;
               

            return { 
                data: { 
                    saved, 
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
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    getrateAd: async (query: any, serviceId: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(serviceId)

            if(!isValidId){
                return { data: 'Please enter a valid id', statusCode: 404, msg: "Failure" };
            }

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            
            const existingRecords = await Review.find({ serviceId })
            .limit(resPerPage)
            .skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { 
                        existingRecords, 
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
            const totalDocuments = await Ad.countDocuments({ serviceId });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = totalPages - currentPageNum;
               

            return { 
                data: { 
                    existingRecords, 
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
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    getMyAd: async (query: any, userid: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(userid)

            if(!isValidId){
                return { data: 'Please enter a valid id', statusCode: 404, msg: "Failure" };
            }

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            
            const existingRecords = await Ad.find({ userId: userid, active: true })
            .limit(resPerPage)
            .skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { 
                        existingRecords, 
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
            const totalDocuments = await Ad.countDocuments({ userId: userid, active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = totalPages - currentPageNum;
               

            return { 
                data: { 
                    existingRecords, 
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
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    getcategory: async () => {
        try {
            
            // Fetch all categories
            const categories = await Category.find();

            // Fetch subcategories for each category and attach them
            const categoriesWithSubcategories = await Promise.all(
                categories.map(async (category: any) => {
                    const subcategories = await SubCategory.find({ categoryId: category._id });
                    return {
                        ...category.toObject(),
                        subcategories,
                    };
                })
            );
            return { data: { categoriesWithSubcategories }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    deleteSavedAd: async (id: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a valid id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await savedAd.findByIdAndDelete(id)          

            return { data: 'Record deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    deleteAd: async (id: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a valid id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await Ad.findByIdAndDelete(id)          

            return { data: 'Record deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    editAd: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }


            let data = await Ad.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating Ads', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing Ads: ${error.message}`);
        }
    },

    enableDisableAd: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Ad.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Ads status changed', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error changing status: ${error.message}`);
        }
    },

    postAd: async (userData: UserDataAds) => {
        try {
            const ad = await new Ad({ ...userData }).save();
            if(ad !== null){
                return { data: { ad }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error creating post', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error adding post: ${error.message}`);
        }
    },

    saveAd: async (userData: any) => {
        try {
            const saved = await new savedAd({ ...userData }).save();
            if(saved !== null){
                return { data: { saved }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error creating savedads', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error adding savedads: ${error.message}`);
        }
    },

    createReport: async (userData: UserDataReport) => {
        try {
            const report = await new Report({ ...userData }).save();
            if(report !== null){
                return { data: { report }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error creating report', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error adding report: ${error.message}`);
        }
    },

    rateAd: async (userData: any) => {
        try {
            const review = await new Review({ ...userData }).save();
            if(review !== null){
                return { data: { review }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error creating review', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    },

}


export default AdsService;