import dotenv from 'dotenv';
dotenv.config();
import User from '../../models/users'
import Certificate from '../../models/certification'
import Education from '../../models/education'
import Artisan from '../../models/artisan'
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

             // Fetch certificates and education records
             const [certificates, education, artisan] = await Promise.all([
                Certificate.find({ userId: id }),
                Education.find({ userId: id }),
                Artisan.find({ userId: id })
            ]);

            // Combine user details with certificates and education
            const userDetails = {
                ...existingUser.toObject(),
                certificates,
                education,
                artisan
            };       

            return { data: { userDetails }, statusCode: 201, msg: "Success" };
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

            const user = await User.findOne({ _id: id })

            if (!user) {
                return { data: 'user With The Specified id Not Found', statusCode: 404, msg: "Failure" };
            }

            // Compare passwords using bcrypt
            let olPassword: string = await bcrypt.hash(userData.oldPassword, SALT)

            if (olPassword !== user.password) {
                return { data: 'Incorrect old password entered', statusCode: 401, msg: "Failure" };
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
    },

    deleteAccount: async (body: any) => {
        try {
            let { userEmail, userId, password } = body
            // Check if the email exists
            const user = await User.findOne({ email: userEmail })

            if (!user) {
                return { data: 'User With The Specified Email Not Found', statusCode: 404, msg: "Failure" };
            }

            // Compare passwords using bcrypt
            password = await bcrypt.hash(password, SALT)

            if (user.password !== password) {
                return { data: 'Incorrect password', statusCode: 401, msg: "Failure" };
            }

            await User.deleteOne({ _id: userId });
            
            return { data: "account deleted", statusCode: 201, msg: "Success" };
            
        } catch (error: any) {
            throw new Error(`Error editing account password: ${error.message}`);
        }
    }

}


export default DashService;