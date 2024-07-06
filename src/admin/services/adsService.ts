import dotenv from 'dotenv';
dotenv.config();
import Ads from '../../models/ads'
import mongoose from 'mongoose';
import Report from '../../models/report';
import Users from '../../models/users';
import { getFilteredReport } from '../../middlewares/calculateBound';


const AdsService = {
    getAds: async (query: any) => {
        try {
            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            const search = query.keyword ? {
                title: {
                    $regex: query.keyword,
                    $options: 'i'
                },
                active: true
            } : { active: true }

            // Check if the email already exists
            const existingRecords = await Ads.find(search, { active: true })
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
            const totalDocuments = await Ads.countDocuments({ active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = (totalPages - currentPageNum) < 0 ? 0 : totalPages - currentPageNum;
               

            return { 
                data: { 
                    existingRecords,
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
            throw new Error(`Error fetching ad: ${error.message}`);
        }
    },

    getReport: async (query: any) => {
        try {
            return await getFilteredReport(query)

        } catch (error: any) {
            throw new Error(`Error fetching ad: ${error.message}`);
        }
    },

    getReportById: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingRecords = await Report.findOne({ _id: id })

            if (!existingRecords) {
                return { data: 'No report found', statusCode: 404, msg: "Failure" };
            }
            
            await Report.updateOne({ _id: id }, 
                {
                    $set:{
                        read: true
                    }
                }
            )

            return { data: { existingRecords }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error logging in: ${error.message}`);
        }
    },
    
    getSingleAd: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingAd = await Ads.findOne({ _id: id })

            if (!existingAd) {
                return { data: 'No ad found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingAd }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching ad: ${error.message}`);
        }
    },
    
    getUserAds: async (query: any, id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            // Check if the email already exists
            const existingRecords = await Ads.find({ userid: id })
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
            const totalDocuments = await Report.countDocuments({ active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages
            
            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = (totalPages - currentPageNum) < 0 ? 0 : totalPages - currentPageNum;

            return { 
                data: { 
                    existingRecords,
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
            throw new Error(`Error fetching ad: ${error.message}`);
        }
    },
    
    deleteAd: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await Ads.findByIdAndDelete({ _id: id })

            return { data: 'ad deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error deleting ad: ${error.message}`);
        }
    },
    
    deleteReport: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await Report.findByIdAndDelete({ _id: id })

            return { data: 'report deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error deleting report: ${error.message}`);
        }
    },

    editAd: async (id: string, adData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Ads.findByIdAndUpdate(id, adData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating ads', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing ads: ${error.message}`);
        }
    },
    
    editReport: async (id: string, body: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Report.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating report', statusCode: 401, msg: "Failure" };
            }
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error logging in: ${error.message}`);
        }
    },

}


export default AdsService;