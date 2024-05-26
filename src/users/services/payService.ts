import dotenv from 'dotenv';
dotenv.config();
import Payment from '../../models/payment'
import User from '../../models/users'
import mongoose from 'mongoose';
import veriNIN from '../../middlewares/nin'


const PayService = {
    getAllPayment: async (query: any, id: string) => {
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
            const existingRecord = await Payment.findOne({ userid: id }).limit(resPerPage).skip(skip)

            if (!existingRecord) {
                return { data: 'No record found', statusCode: 404, msg: "Failure" };
            }            

            return { data: { existingRecord }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error getting record: ${error.message}`);
        }
    },

    becomeArtisan: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let user = await User.findOne({ _id: id })

            if(user !== null){
                let nin = await veriNIN(userData.nin)

                if (nin === false){
                    return { data: 'Check nin provided', statusCode: 401, msg: "Failure" };
                }else{
                    if(nin.data.firstName != user.firstName || nin.data.lastName != user.lastName || nin.data.phonenUmber != user.phone){
                        return { data: 'NIN provided does not match any account details (first name, lastname or phone)', statusCode: 401, msg: "Failure" };
                    }
                }
            }else{
                return { data: 'Invalid user id', statusCode: 401, msg: "Failure" }; 
            }


            let data = await User.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating account to artisan', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error upgrading account: ${error.message}`);
        }
    },

    makePayment: async (userid: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(userid)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let user = await User.findOne({ _id: userid })

            if(user !== null){
                const pay = await new Payment({ userid, ...userData }).save();
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
    }

}


export default PayService;