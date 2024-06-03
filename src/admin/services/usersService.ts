import dotenv from 'dotenv';
dotenv.config();
import Users from '../../models/users'
import Certificate from '../../models/certification'
import Education from '../../models/education'
import Artisan from '../../models/artisan'
import mongoose from 'mongoose';


const UsersService = {
    getUsers: async (query: any) => {
        try {

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            const search = query.keyword ? {
                userName: {
                    $regex: query.keyword,
                    $options: 'i'
                },
                active: true
            } : { active: true }

            // Check if the email already exists
            const existingUser = await Users.find(search, { active: 0, password: 0 })
            .limit(resPerPage)
            .skip(skip)

            if (!existingUser || existingUser.length === 0) {
                return { 
                    data: { existingUser, hasPreviousPage: false, previousPages: 0, hasNextPage: false, nextPages: 0 },  
                    statusCode: 404, 
                    msg: "Failure" 
                }
            }
            
            // Count the total number of documents
            const totalDocuments = await Users.countDocuments(search);

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = totalPages - currentPageNum;
               

            return { 
                data: { existingUser, hasPreviousPage, previousPages, hasNextPage, nextPages }, 
                statusCode: 201, 
                msg: "Success" 
            }

        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },
    
    getSingleUser: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingUser = await Users.findOne({ _id: id }, { active: 0, password: 0, createdAt: 0 })

            if (!existingUser) {
                return { data: 'No user found', statusCode: 404, msg: "Failure" };
            }    
            
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
    
    deleteUser: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await Users.findByIdAndDelete({ _id: id })

            return { data: 'account deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },

    enableDisableUser: async (id: string, userData: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Users.findByIdAndUpdate(id, userData, {
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


export default UsersService;