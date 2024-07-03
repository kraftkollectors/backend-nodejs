import dotenv from 'dotenv';
dotenv.config();
import { sendmail, mailGenerator } from '../../middlewares/mailer'
import Admin from '../../models/admin'
import bcrypt from 'bcrypt';
import { AdminData, AdminDataForgot } from '../../types/admin/defaultTypes';
import generateToken from '../../utils/tokenUtils';
import Contact from '../../models/contact';
import mongoose from 'mongoose';
import { generateOtp } from '../../middlewares/generate';

const SALT: any = process.env.SALT
const PASSCODE: any = process.env.PASSCODE

const BasicService = {
    testServer: async (query: any) => {
        try {
            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            const admin = await Admin.find()
            .limit(resPerPage)
            .skip(skip)

            if (!admin || admin.length === 0) {
                return { 
                    data: { 
                        admin,
                        totalDocuments: 0, 
                        hasPreviousPage: false, 
                        previousPages: 0, 
                        hasNextPage: false,      
                        nextPages: 0,
                        totalPages: 0,
                        currentPage: currentPageNum
                    },  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }

            // Count the total number of documents
            const totalDocuments = await Admin.countDocuments({ active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = (totalPages - currentPageNum) < 0 ? 0 : totalPages - currentPageNum;
               

            return { 
                data: { 
                    admin,
                    totalDocuments, 
                    hasPreviousPage, 
                    previousPages, 
                    hasNextPage, 
                    nextPages,                    
                    totalPages,
                    currentPage: currentPageNum
                }, 
                statusCode: 201, 
                msg: "Success" 
            }
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error logging in: ${error.message}`);
        }
    },
    
    getContact: async (query: any) => {
        try {
            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            // Check if the email exists
            const contact = await Contact.find().limit(resPerPage).skip(skip)

            if (!contact || contact.length === 0) {
                return { 
                    data: { 
                        contact,
                        totalDocuments: 0, 
                        hasPreviousPage: false, 
                        previousPages: 0, 
                        hasNextPage: false,      
                        nextPages: 0,
                        totalPages: 0,
                        currentPage: currentPageNum
                    },  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }

            // Count the total number of documents
            const totalDocuments = await Contact.countDocuments({ active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = (totalPages - currentPageNum) < 0 ? 0 : totalPages - currentPageNum;
               

            return { 
                data: { 
                    contact,
                    totalDocuments, 
                    hasPreviousPage, 
                    previousPages, 
                    hasNextPage, 
                    nextPages,                    
                    totalPages,
                    currentPage: currentPageNum
                }, 
                statusCode: 201, 
                msg: "Success" 
            }
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error logging in: ${error.message}`);
        }
    },
    
    getContactById: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            const existingAd = await Contact.findOne({ _id: id })

            if (!existingAd) {
                return { data: 'No contact found', statusCode: 404, msg: "Failure" };
            }
            
            const res = await Contact.updateOne({ _id: id }, 
                {
                    $set:{
                        read: true
                    }
                }
            )

            return { data: { existingAd }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error logging in: ${error.message}`);
        }
    },
    
    editContact: async (id: string, body: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            let data = await Contact.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating ads', statusCode: 401, msg: "Failure" };
            }
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error logging in: ${error.message}`);
        }
    },

    createAdmin: async (adminData: any) => {
        try {

            if(PASSCODE !== adminData.passcode){
                return { data: 'Unauthorized entry', statusCode: 404, msg: "Failure" }
            }

            // Check if the email already exists
            const existingAdmin = await Admin.findOne({ email: adminData.email })

            if (existingAdmin) {
                return { data: 'Email is already in use', statusCode: 404, msg: "Failure" };
            }

            // Hash the password before creating the admin
            const hashedPassword = await bcrypt.hash(adminData.password, SALT);
            const admin = await new Admin({ ...adminData, password: hashedPassword }).save();

            admin.type = 'admin'

            // Generate a token with admin information
            const token = generateToken(admin);

            console.log(token);
            
            admin.password = ''

            return { data: { admin, token }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error creating account: ${error.message}`);
        }
    },

    loginAdmin: async (adminData: AdminData) => {
        try {
            // Check if the email exists
            const admin = await Admin.findOne({ email: adminData.email })

            if (!admin) {
                return { data: 'admin With The Specified Email Not Found', statusCode: 404, msg: "Failure" };
            }

            // Compare passwords using bcrypt
            let password: string = await bcrypt.hash(adminData.password, SALT)

            if (admin.password !== password) {
                return { data: 'Incorrect password', statusCode: 401, msg: "Failure" };
            }

            admin.type = 'admin'
            
            // Generate a token with admin information
            const token = generateToken(admin);

            admin.password = ''

            return { data: { admin, token }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            console.log(error);

            throw new Error(`Error logging in: ${error.message}`);
        }
    },
    
    createOTP: async (adminData: any) => {
        try{
    
            let num: string = generateOtp()
            var emailSender: any = {
                body: {
                    name: 'User',
                    intro: 'We got a request for an OTP to complete request. Please enter the OTP on next page to complete verification and access account. If this was you, enter the otp in the next page or ignore and nothing will happen to your account.\n',

                    action: {
                        instructions: 'To get started, enter the OTP in the app window',
                        button: {
                            color: '#ffffff',
                            text: `<span style="font-size: 30px; font-weight: bolder; color: black">${num}</span>`,
                            link: ''
                        }
                    },
                    
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Kraftkollectors.'
                }
            };

            let emailBody: any = mailGenerator.generate(emailSender);

            await sendmail(adminData.email, 'OTP Mail', emailBody)
    
            return { data: { num }, statusCode: 201, msg: "Success" };
           
        }catch (error: any) {
            console.log(error)
            throw new Error(`Error creating account: ${error.message}`);;
        }
    },

    adminForgot: async (adminData: AdminDataForgot) => {
        try {
            // Check if the email exists
            const admin = await Admin.findOne({ email: adminData.email })

            if (!admin) {
                return { data: 'admin With The Specified Email Not Found', statusCode: 404, msg: "Failure" };
            }

            let num: string = generateOtp()

            var emailSender: any = {
                body: {
                    name: 'Admin',
                    intro: 'We got a request to reset your password, if this was you, enter the otp in the next page to reset password or ignore and nothing will happen to your account',

                    action: {
                        instructions: 'To get started, enter the OTP in the app window',
                        button: {
                            color: '#ffffff',
                            text: `<span style="font-size: 30px; font-weight: bolder; color: black">${num}</span>`,
                            link: ''
                        }
                    },
                    
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Kraftkollectors.'
                }
            };

            let emailBody: any = mailGenerator.generate(emailSender);
            // send mail
            const sent = await sendmail(adminData.email, 'Password Recovery', emailBody);
            if(sent){
                return { data: 'Email sent', statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error sending mail', statusCode: 404, msg: "Failure" };
            }

        } catch (error: any) {
            console.log(error);

            throw new Error(`Forgot password error: ${error.message}`);
        }
    },

    adminReset: async (adminData: AdminData) => {
        try {
            let password: string = await bcrypt.hash(adminData.password, SALT)

            const res = await Admin.update({ password:password }, { where: { email: adminData.email }})
           
            if(res){
                return { data: 'password changed', statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating password', statusCode: 404, msg: "Failure" };
            }

        } catch (error: any) {
            console.log(error);

            throw new Error(`Reset password error: ${error.message}`);
        }
    },

    deleteContact: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await Contact.findByIdAndDelete({ _id: id })

            return { data: 'contact deleted', statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error fetching contact: ${error.message}`);
        }
    },
}


export default BasicService;