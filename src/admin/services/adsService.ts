import dotenv from 'dotenv';
dotenv.config();
import Ads from '../../models/ads'
import mongoose from 'mongoose';
import Report from '../../models/report';
import Users from '../../models/users';


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
            const existingAd = await Ads.find(search, { active: true })
            .limit(resPerPage)
            .skip(skip)

            if (!existingAd || existingAd.length === 0) {
                return { 
                    data: { 
                        existingAd,
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
                    existingAd,
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
            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            // Check if the email already exists
            const reports = await Report.find({ active: true })
            .limit(resPerPage)
            .skip(skip)

            if (!reports || reports.length === 0) {
                return { 
                    data: { 
                        reports,
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

            // Fetch user details for each report
            const reportDetails = await Promise.all(
                reports.map(async (report: any) => {
                    const reporter = await Users.findById(report.reporterId, 'userName email _id').lean();
                    const reported = await Users.findById(report.reportedId, 'userName email _id').lean();

                    return {
                        ...report,
                        reporter: reporter || null,
                        reported: reported || null,
                    };
                })
            );                        

            return { 
                data: { 
                    reports,
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
            const existingAd = await Ads.find({ userid: id })
            .limit(resPerPage)
            .skip(skip)

            if (!existingAd || existingAd.length === 0) {
                return { 
                    data: { 
                        existingAd,
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
                    existingAd,
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

    editAd: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Ads.findByIdAndUpdate(id, userData, {
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
    }

}


export default AdsService;