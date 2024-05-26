import dotenv from 'dotenv';
dotenv.config();
import Ad from '../../models/ads'
import mongoose from 'mongoose';
import veriNIN from '../../middlewares/nin'


const AdsService = {
    getAllAd: async () => {
        try {

            // Check if the email already exists
            const existingRecord = await Ad.findOne({ active: true })

            if (!existingRecord) {
                return { data: 'No records found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingRecord }, statusCode: 201, msg: "Success" };
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

            return { data: { existingRecord }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    getMyAd: async (userid: string) => {
        try {
            const isValidId = mongoose.isValidObjectId(userid)

            if(!isValidId){
                return { data: 'Please enter a valid id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingRecord = await Ad.find({ userid })

            if (!existingRecord) {
                return { data: 'No records found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingRecord }, statusCode: 201, msg: "Success" };
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
            await Ad.findByIdAndDelete({ id })          

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

    postAd: async (userData: any) => {
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
    }

}


export default AdsService;