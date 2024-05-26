import dotenv from 'dotenv';
dotenv.config();
import Admin from '../../models/admin'
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';


const SALT: any = process.env.SALT

const DashService = {
    getAdmin: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingAdmin = await Admin.findOne({ _id: id })

            if (!existingAdmin) {
                return { data: 'No admin found', statusCode: 404, msg: "Failure" };
            }            

            let fakePassword = '';
            existingAdmin.dataValues.password = fakePassword

            return { data: { existingAdmin }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },

    editAdmin: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            userData.password = await bcrypt.hash(userData.password, SALT);

            let data = await Admin.findByIdAndUpdate(id, userData, {
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