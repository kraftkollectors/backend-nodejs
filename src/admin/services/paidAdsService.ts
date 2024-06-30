import dotenv from 'dotenv';
dotenv.config();
import PaidAd from '../../models/paidAd'
import mongoose from 'mongoose';
import { getFilteredPaidAds } from '../../middlewares/calculateBound';
import { AdminDataPaidAds } from '../../types/admin/defaultTypes';


const AdsService = {
    getPaidAds: async (query: any) => {
        try {
            return await getFilteredPaidAds(query)
        } catch (error: any) {
            throw new Error(`Error fetching ad: ${error.message}`);
        }
    },
    
    getSinglePaidAd: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingAd = await PaidAd.findOne({ _id: id })

            if (!existingAd) {
                return { data: 'No ad found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingAd }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching ad: ${error.message}`);
        }
    },

    postPaidAd: async (adminData: AdminDataPaidAds) => {
        try {
            const ad = await new PaidAd({ ...adminData }).save();
            if(ad !== null){
                return { data: { ad }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error creating post', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error adding post: ${error.message}`);
        }
    },
    
    deletePaidAd: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await PaidAd.findByIdAndDelete({ _id: id })

            return { data: 'ad deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error deleting ad: ${error.message}`);
        }
    },

    editPaidAd: async (id: string, adData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await PaidAd.findByIdAndUpdate(id, adData, {
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