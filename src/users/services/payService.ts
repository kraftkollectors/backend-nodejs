import dotenv from 'dotenv';
dotenv.config();
import Payment from '../../models/payment'
import User from '../../models/users'
import Artisan from '../../models/artisan'
import Certificate from '../../models/certification'
import Education from '../../models/education'
import mongoose from 'mongoose';
import veriNIN from '../../middlewares/nin'
import { UserDataArtisan, UserDataCertificate, UserDataEducation } from '../../types/user/defaultTypes';


const PayService = {
    getAllUserPayment: async (query: any, id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            const existingRecords = await Payment.find({ userId: id })
            .limit(resPerPage)
            .skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { existingRecords, hasPreviousPage: false, previousPages: 0, hasNextPage: false, nextPages: 0 },  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }           

            // Count the total number of documents
            const totalDocuments = await Payment.countDocuments({ userId: id, active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = totalPages - currentPageNum;
               

            return { 
                data: { existingRecords, hasPreviousPage, previousPages, hasNextPage, nextPages },  
                statusCode: 201, 
                msg: "Success" 
            }

        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    getSingleCert: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const existingRecord = await Certificate.findOne({ _id: id })

            if (!existingRecord) {
                return { data: [], statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingRecord }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    getSingleEdu: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const existingRecord = await Education.findOne({ _id: id })

            if (!existingRecord) {
                return { data: [], statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingRecord }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    getUserCert: async (query: any, id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            const existingRecords = await Certificate.find({ userId: id })
            .limit(resPerPage).
            skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { existingRecords, hasPreviousPage: false, previousPages: 0, hasNextPage: false, nextPages: 0 },  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }           

            // Count the total number of documents
            const totalDocuments = await Certificate.countDocuments({ userId: id, active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = totalPages - currentPageNum;
               

            return { 
                data: { existingRecords, hasPreviousPage, previousPages, hasNextPage, nextPages },  
                statusCode: 201, 
                msg: "Success" 
            }
        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    getUserEdu: async (query: any, id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            const existingRecords = await Education.find({ userId: id })
            .limit(resPerPage)
            .skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { existingRecords, hasPreviousPage: false, previousPages: 0, hasNextPage: false, nextPages: 0 },  
                    statusCode: 201, 
                    msg: "Success"  
                }
            }           

            // Count the total number of documents
            const totalDocuments = await Education.countDocuments({ userId: id, active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = totalPages - currentPageNum;
               

            return { 
                data: { existingRecords, hasPreviousPage, previousPages, hasNextPage, nextPages },  
                statusCode: 201, 
                msg: "Success" 
            }

        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    getAccount: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const existingRecord = await Artisan.findOne({ userId: id })

            if (!existingRecord) {
                return { data: [], statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingRecord }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    createCert: async (userData: UserDataCertificate) => {
        try {

            let data = await new Certificate({ ...userData }).save()

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error creating certificate', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error upgrading account: ${error.message}`);
        }
    },

    createEdu: async (userData: UserDataEducation) => {
        try {

            let data = await new Education({ ...userData }).save()

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error creating education', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error upgrading account: ${error.message}`);
        }
    },

    becomeArtisan: async (userData: UserDataArtisan) => {
        try {

            const check = await Artisan.findOne({ userId: userData.userId })

            if (check) {
                return { data: 'account already an artisan', statusCode: 401, msg: "Failure" };
            }

            let nin = await veriNIN(userData.nin)
            let lastNineCharacters = userData.phoneNumber.slice(-9);

            if (nin === false){
                return { data: 'Check nin provided', statusCode: 401, msg: "Failure" };
            }else{                
                if (
                    nin.firstname.toLowerCase() !== userData.firstName.toLowerCase() &&
                    nin.surname.toLowerCase() !== userData.lastName.toLowerCase() &&
                    !nin.telephoneno.includes(lastNineCharacters)
                  ) {
                    return { data: 'NIN provided does not match any account details (first name, lastname, or phone)', statusCode: 401, msg: "Failure" };
                }
            }
            

            let data = await new Artisan({ ...userData }).save()

            if(data !== null){

                await User.updateOne({ _id: userData.userId }, 
                    {
                        $set:{
                            isArtisan: true
                        }
                    }
                )

                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error upgrading account to artisan', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error upgrading account: ${error.message}`);
        }
    },

    makePayment: async (userData: any) => {
        try {

            let user = await User.findOne({ _id: userData.userId })

            if(user !== null){
                const pay = await new Payment({ ...userData }).save();
                if(pay !== null){
                    return { data: { pay }, statusCode: 201, msg: "Success" };
                }else{
                    return { data: 'Error creating record', statusCode: 401, msg: "Failure" };
                }

            }else{
                return { data: 'Invalid user id', statusCode: 401, msg: "Failure" };  
            }
            
        } catch (error: any) {
            throw new Error(`Error adding record: ${error.message}`);
        }
    },
    
    editCert: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Certificate.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating certificate', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing certificate: ${error.message}`);
        }
    },

    editEdu: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Education.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating education', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing education: ${error.message}`);
        }
    },

    editArtisan: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Artisan.findOneAndUpdate({ userId: id }, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating artisan account', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing artisan account: ${error.message}`);
        }
    },

    deleteEdu: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await Education.findByIdAndDelete(id)          

            return { data: 'Record deleted', statusCode: 201, msg: "Success" };
            
        } catch (error: any) {
            throw new Error(`Error deleting education: ${error.message}`);
        }
    },

    deleteCert: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await Certificate.findByIdAndDelete(id)          

            return { data: 'Record deleted', statusCode: 201, msg: "Success" };
            
        } catch (error: any) {
            throw new Error(`Error deleting education: ${error.message}`);
        }
    },

}


export default PayService;