import dotenv from 'dotenv';
dotenv.config();
import User from '../../models/users'
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';


const SALT: any = process.env.SALT

const DashService = {
    getUser: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingUser = await User.findOne({ _id: id })

            if (!existingUser) {
                return { data: 'No user found', statusCode: 404, msg: "Failure" };
            }            

            existingUser.password = ''

            return { data: { existingUser }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },

    editUser: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await User.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating account', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing account: ${error.message}`);
        }
    },

    editUserPassword: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            userData.password = await bcrypt.hash(userData.password, SALT);

            let data = await User.findByIdAndUpdate(id, userData, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating account password', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error editing account password: ${error.message}`);
        }
    }

}


export default DashService;