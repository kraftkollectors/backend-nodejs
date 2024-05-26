import dotenv from 'dotenv';
dotenv.config();
import Ads from '../../models/ads'
import mongoose from 'mongoose';


const AdsService = {
    getAds: async () => {
        try {

            // Check if the email already exists
            const existingAd = await Ads.find({ active: true })

            if (!existingAd) {
                return { data: 'No ad found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingAd }, statusCode: 201, msg: "Success" };
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
    
    getUserAds: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingAd = await Ads.find({ userid: id })

            if (!existingAd) {
                return { data: 'No user ad found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingAd }, statusCode: 201, msg: "Success" };
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