import dotenv from 'dotenv';
dotenv.config();
import Payment from '../../models/payment'
import mongoose from 'mongoose';


const transService = {
    getTransactions: async () => {
        try {

            // Check if the email alrepaymenty exists
            const existingPay = await Payment.find()

            if (!existingPay) {
                return { data: 'No payment found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingPay }, statusCode: 201, msg: "Success" };
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
    
    getUserTransactions: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email alrepaymenty exists
            const existingPay = await Payment.find({ userid: id })

            if (!existingPay) {
                return { data: 'No user payment found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingPay }, statusCode: 201, msg: "Success" };
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