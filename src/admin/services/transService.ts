import dotenv from 'dotenv';
dotenv.config();
import Payment from '../../models/payment'
import mongoose from 'mongoose';


const transService = {
    getTransactions: async (query: any) => {
        try {
            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            const existingRecords = await Payment.find()
            .sort({ createdAt: -1 })
            .limit(resPerPage)
            .skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { existingRecords, hasPreviousPage: false, previousPages: 0, hasNextPage: false, nextPages: 0 },  
                    statusCode: 404, 
                    msg: "Failure" 
                }
            }           

            // Count the total number of documents
            const totalDocuments = await Payment.countDocuments({ active: true });

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
            throw new Error(`Error fetching payment: ${error.message}`);
        }
    },
    
    getSingleTransaction: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email alrepaymenty exists
            const existingPay = await Payment.findOne({ _id: id })

            if (!existingPay) {
                return { data: 'No payment found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingPay }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching payment: ${error.message}`);
        }
    },
    
    getUserTransactions: async (query: any, id: string) => {
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
            .sort({ createdAt: -1 })
            .limit(resPerPage)
            .skip(skip)

            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    data: { existingRecords, hasPreviousPage: false, previousPages: 0, hasNextPage: false, nextPages: 0 },  
                    statusCode: 404, 
                    msg: "Failure" 
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
            throw new Error(`Error fetching payment: ${error.message}`);
        }
    },
    
    deleteTransaction: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email alrepaymenty exists
            await Payment.findByIdAndDelete({ _id: id })

            return { data: 'payment deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error deleting payment: ${error.message}`);
        }
    },

    editTransaction: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Payment.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating Payment', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing Payment: ${error.message}`);
        }
    }

}


export default transService;