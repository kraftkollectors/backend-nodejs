import dotenv from 'dotenv';
dotenv.config();
import Ad from '../../models/ads'
import Category from '../../models/category'
import SubCategory from '../../models/subcategory'
import Rating from '../../models/reviews'
import Report from '../../models/report'
import savedAd from '../../models/saveAds'
import View from '../../models/views'
import User from '../../models/users'
import mongoose from 'mongoose';
import { UserDataAds, UserDataReport } from '../../types/user/defaultTypes';
import Review from '../../models/reviews';
import { getFilteredAds } from '../../middlewares/calculateBound';
import getStartOfDay from '../../utils/startDate';
import { mailGenerator, sendmail } from '../../middlewares/mailer';


const AdsService = {
    getAllAd: async (query: any) => {
        try {
            return await getFilteredAds(query)

        } catch (error: any) {
            throw new Error(`Error getting records: ${error.message}`);
        }
    },


    // getting total views per service
    totalViews: async (serviceid: any) => {
        try {
            // Count the total number of documents
            const result = await View.aggregate([
                { $match: { serviceId: serviceid } },
                { $group: { _id: "$serviceId", totalViews: { $sum: "$views" } } }
            ]);
    
            if (result.length > 0) {
                return { data: { views: result[0].totalViews }, statusCode: 201, msg: "Success" };
            } else {
                return { data: { views: 0 }, statusCode: 201, msg: "Success" };
            }

        } catch (error: any) {
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    getViews: async (query: any, serviceid: any) => {
        try {
            let date = query.date;
    
            if (!date) {
                date = getStartOfDay(new Date());
            }
    
            const view = await View.findOne({
                serviceId: serviceid,
                date: date
            });
    
            if (!view) {
                return { data: { views: 0 }, statusCode: 201, msg: "No views found for the specified date" };
            }
    
            return { data: { views: view.views }, statusCode: 201, msg: "Success" };
    
        } catch (error: any) {
            throw new Error(`Error getting records: ${error.message}`);
        }
    },
    

    getSingleAd: async (id: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(id)
            let cummulativeRating = {
                averageRating: 0,
                totalRatings: 0
            }

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingRecord = await Ad.findOne({ _id: id })

            if (!existingRecord) {
                return { data: 'No record found', statusCode: 404, msg: "Failure" };
            }

            // get the cummulative number of rating
            const pipeline = [
                { $match: { serviceId: id } },
                {
                  $group: {
                    _id: "$serviceId",
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 }
                  }
                }
            ];

            const result = await Rating.aggregate(pipeline);
            if (result.length > 0) {
                cummulativeRating = {
                    averageRating: result[0].averageRating,
                    totalRatings: result[0].totalRatings
                }
            }
            
            
            // Extract the category and subcategory of the existing ad
            const { category, subcategory } = existingRecord;

            // Create a query object to find similar ads
            const query = {
                $or: [
                    { category: category },
                    { subcategory: subcategory }
                ],
                _id: { $ne: id },
                active: true
            };

            // Find 10 similar ads in the same category or subcategory, excluding the current ad
            const similarAds = await Ad.find(query).limit(10);

            

            return { data: { existingRecord: { ...existingRecord.toObject(), similarAds, cummulativeRating } }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    checkSavedAd: async (query: any) => {
        try {

            if(!query.userid && !query.serviceid){
                return { data: 'Please enter user and service id', statusCode: 404, msg: "Failure" };
            }

            // Validate the user IDs
            const isValidUserId = mongoose.isValidObjectId(query.userid);
            const isValidServiceId = mongoose.isValidObjectId(query.serviceid);

            if (!isValidUserId || !isValidServiceId) {
                return { data: 'Please enter valid user and service id', statusCode: 404, msg: "Failure" };
            }

            const existingRecords = await savedAd.find({ userId: query.userid, serviceId: query.serviceid })

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: false,  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }else{
                return {
                    data: true,  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }

        } catch (error: any) {
            throw new Error(`Error checking records: ${error.message}`);
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

            // Extract serviceIds from savedAds
            const serviceIds: any = existingRecords.map((saveAds: any) => saveAds.serviceId);

            // Fetch product details for each productId
            const saved: any = await Ad.find({ _id: { $in: serviceIds } }).lean();


            // Count the total number of documents
            const totalDocuments = await savedAd.countDocuments({ userId: userid });

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
                    existingRecords: saved, 
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
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    getUserReviewsCount: async (userId: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(userId);
    
            if (!isValidId) {
                return { data: 'Please enter a valid id', statusCode: 404, msg: "Failure" };
            }
    
            // Aggregate ratings count and sum of ratings for the specified userId
            const ratingData = await Review.aggregate([
                { $match: { ownerId: userId } },
                {
                    $group: {
                        _id: "$rating",
                        count: { $sum: 1 },
                        sumRating: { $sum: "$rating" }
                    }
                }
            ]);
    
            // Convert the aggregation result to a more readable format
            const ratingCountsMap: any = {};
            let totalSumRating = 0;
            ratingData.forEach((item: any) => {
                ratingCountsMap[item._id] = item.count;
                totalSumRating += item.sumRating;
            });
    
            // Ensure all rating values (1-5) are present in the map, even if the count is 0
            for (let i = 1; i <= 5; i++) {
                if (!ratingCountsMap[i]) {
                    ratingCountsMap[i] = 0;
                }
            }
    
            // Get cumulative count of ratings
            const totalRatings = await Review.countDocuments({ ownerId: userId });
    
            return {
                data: {
                    totalRatings,
                    ratingCounts: ratingCountsMap,
                    sumRating: totalSumRating
                },
                statusCode: 201,
                msg: "Success"
            }
    
        } catch (error: any) {
            throw new Error(`Error getting records: ${error.message}`);
        }
    },

    getServiceReviewsCount: async (serviceId: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(serviceId);
    
            if (!isValidId) {
                return { data: 'Please enter a valid id', statusCode: 404, msg: "Failure" };
            }
    
            // Aggregate ratings count and sum of ratings for the specified serviceId
            const ratingData = await Review.aggregate([
                { $match: { serviceId } },
                {
                    $group: {
                        _id: "$rating",
                        count: { $sum: 1 },
                        sumRating: { $sum: "$rating" }
                    }
                }
            ]);
    
            // Convert the aggregation result to a more readable format
            const ratingCountsMap: any = {};
            let totalSumRating = 0;
            ratingData.forEach((item: any) => {
                ratingCountsMap[item._id] = item.count;
                totalSumRating += item.sumRating;
            });
    
            // Ensure all rating values (1-5) are present in the map, even if the count is 0
            for (let i = 1; i <= 5; i++) {
                if (!ratingCountsMap[i]) {
                    ratingCountsMap[i] = 0;
                }
            }
    
            // Get cumulative count of ratings
            const totalRatings = await Review.countDocuments({ serviceId });
    
            return {
                data: {
                    totalRatings,
                    ratingCounts: ratingCountsMap,
                    sumRating: totalSumRating
                },
                statusCode: 201,
                msg: "Success"
            }
    
        } catch (error: any) {
            throw new Error(`Error getting records: ${error.message}`);
        }
    },
   

    getUserReviews: async (query: any, userId: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(userId)

            if(!isValidId){
                return { data: 'Please enter a valid id', statusCode: 404, msg: "Failure" };
            }

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            
            const existingRecords = await Review.find({ ownerId: userId })
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
            const totalDocuments = await Review.countDocuments({ ownerId: userId });

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
            const totalDocuments = await Review.countDocuments({ serviceId });

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
            const totalDocuments = await Ad.countDocuments({ userId: userid, active: true });

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

    deleteSavedAd: async (query: any) => {
        try {
            if(!query.userid && !query.serviceid){
                return { data: 'Please enter valid user and service id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await savedAd.deleteOne({ userId: query.userid, serviceId: query.serviceid })          

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

    postSearchAd: async (userData: any) => {
        try {
            const serviceObjects = [];

            for (const serviceId of userData) {
                const serviceObject = await Ad.findOne({ _id: serviceId });
                if (serviceObject) {
                    serviceObjects.push(serviceObject);
                }
            }

            return { data: { serviceObjects }, statusCode: 201, msg: "Success" };
            
        } catch (error: any) {
            throw new Error(`Error adding post: ${error.message}`);
        }
    },

    // add number of views a service has
    updateViews: async (serviceId: string) => {
        try {
            const date = getStartOfDay(new Date());

            let viewDoc = await View.findOne({
                serviceId,
                date
            });

            // Check if any ads were found
            if (viewDoc) {
                // Document exists, increment totalViews by 1
                viewDoc.views += 1;
            } else {
            // Document does not exist, create a new one
                viewDoc = new View({ serviceId, date });
            }

            // Save the document
            const saved = await viewDoc.save();
            if(saved !== null){
                return { data: { saved }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error creating views data', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error adding savedads: ${error.message}`);
        }
    },

    saveAd: async (userData: any) => {
        try {
            const checkAd = await savedAd.find({ userId: userData.userId, serviceId: userData.serviceId })

            // Check if any ads were found
            if (checkAd.length !== 0) {
                return { data: 'Ad already saved', statusCode: 401, msg: "Failure" };
            }

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
            let receiver = await User.findOne({ _id: userData.ownerId }, {  _id: 0, notify: 1, userName: 1, email: 1 } )
            let sender = await User.findOne({ _id: userData.reviewerId }, {  _id: 0, userName: 1 } )

            const review = await new Review({ ...userData }).save();
            if(review !== null){

                const data = await Ad.find({ _id: userData.serviceId })
                let newRating: Number = data.rating

                await Ad.updateOne({ _id: data._id }, 
                    {
                        $set:{
                            rating: newRating
                        }
                    }
                )

                if(receiver.notify === true){
                    var emailSender: any = {
                        body: {
                            name: receiver.userName,
                            intro: `<span style="font-weight: bolder;">Review from ${sender.userName}:</span>.\n\n
                                    A service <span style="font-weight: bolder; color: blue;">"${data.title}"</span> you posted on our platform has been reviewed by a customer.`,
        
                            action: {
                                instructions: 'click to login and check out.',
                                button: {
                                    color: '#ffffff',
                                    text: `<span style="font-size: 30px; font-weight: bolder; color: black">Login</span>`,
                                    link: 'https://www.kraftkollectors.com'
                                }
                            },
                            
                            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Kraftkollectors.'
                        }
                    };
        
                    let emailBody: any = mailGenerator.generate(emailSender);
        
                    await sendmail(receiver.email, 'You got a message', emailBody)
                }

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