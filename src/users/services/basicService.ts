import dotenv from 'dotenv';
dotenv.config();
import { sendmail, mailGenerator } from '../../middlewares/mailer'
import User from '../../models/users'
import bcrypt from 'bcrypt';
import { UserData, UserDataLogin, UserDataForgot, UserDataContact } from '../../types/user/defaultTypes';
import generateToken from '../../utils/tokenUtils';
import Contact from '../../models/contact';
import { generateOtp } from '../../middlewares/generate';



const SALT: any = process.env.SALT

const BasicService = {
    testServer: async (query: any) => {
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

            const user = await User.find(search)
            .limit(resPerPage)
            .skip(skip)

            if (!user || user.length === 0) {
                return { data: 'No records found', statusCode: 404, msg: "Failure" }
            }

            // Count the total number of documents
            const totalDocuments = await User.countDocuments({ active: true });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = totalPages - currentPageNum;
               

            return { 
                data: { user, hasPreviousPage, previousPages, hasNextPage, nextPages }, 
                statusCode: 201, 
                msg: "Success" 
            }
            
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error logging in: ${error.message}`);
        }
    },


    createUser: async (userData: UserData) => {
        try {
            // Check if the email already exists
            const existingUser = await User.findOne({ email: userData.email })

            if (existingUser) {
                return { data: 'Email is already in use', statusCode: 404, msg: "Failure" };
            }


            // Hash the password before creating the user
            const hashedPassword = await bcrypt.hash(userData.password, SALT);
            const user = await new User({ ...userData, password: hashedPassword }).save();


            let num: string = generateOtp()
            var emailSender: any = {
                body: {
                    name: userData.firstName + ' ' + userData.lastName,
                    intro: 'We got a request to verify your mail. Please enter OTP on next page to complete verification and access account. If this was you, enter the otp in the next page or ignore and nothing will happen to your account.\n',

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

            await sendmail(userData.email, 'Email Verification', emailBody)


            user['type'] = 'user'

            // Generate a token with user information
            const token = generateToken(user);
            

            let fakePassword = '';
            user.password = fakePassword

            return { data: { user, token, otp: num }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error creating account: ${error.message}`);
        }
    },

    createOTP: async (userData: any) => {
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

            await sendmail(userData.email, 'OTP Mail', emailBody)
    
            return { data: { num }, statusCode: 201, msg: "Success" };
           
        }catch (error: any) {
            console.log(error)
            throw new Error(`Error creating account: ${error.message}`);;
        }
    },

    thirdPartyCreate: async (userData: any) => {
        try {
            // Check if the email already exists
            const existingUser = await User.findOne({ email: userData.email })

            if (existingUser) {
                existingUser.type = 'user'

                // Generate a token with user information
                const token = generateToken(existingUser);
                
                return { data: { user: existingUser, token }, statusCode: 201, msg: "Success" };
            }

            const user = await new User({ ...userData }).save();

            user.type = 'user'

            // Generate a token with user information
            const token = generateToken(user);
            
            return { data: { user, token }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            throw new Error(`Error creating account: ${error.message}`);
        }
    },

    loginUser: async (userData: UserDataLogin) => {
        try {
            // Check if the email exists
            const user = await User.findOne({ email: userData.email })

            if (!user) {
                return { data: 'User With The Specified Email Not Found', statusCode: 404, msg: "Failure" };
            }

            if (user.active === false) {
                return { data: 'account blocked', statusCode: 401, msg: "Failure" };
            }
            
            if (user.emailVerify === false) {
                return { data: 'email not verified', statusCode: 401, msg: "Failure" };
            }

            // Compare passwords using bcrypt
            let password: string = await bcrypt.hash(userData.password, SALT)

            if (user.password !== password) {
                return { data: 'Incorrect password', statusCode: 401, msg: "Failure" };
            }

            user.type = 'user'

            // Generate a token with user information
            const token = generateToken(user);

            let fakePassword = '';
            user.password = fakePassword

            return { data: { user, token }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            console.log(error);

            throw new Error(`Error logging in: ${error.message}`);
        }
    },

    thirdPartyLogin: async (userData: UserDataForgot) => {
        try {
            // Check if the email exists
            const user = await User.findOne({ email: userData.email })

            if (!user) {
                return { data: 'User With The Specified Email Not Found', statusCode: 404, msg: "Failure" };
            }

            if (user.active === false) {
                return { data: 'account blocked', statusCode: 401, msg: "Failure" };
            }

            user.type = 'user'

            // Generate a token with user information
            const token = generateToken(user);

            let fakePassword = '';
            user.password = fakePassword

            return { data: { user, token }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            console.log(error);

            throw new Error(`Error logging in: ${error.message}`);
        }
    },

    userForgot: async (userData: UserDataForgot) => {
        try {
            // Check if the email exists
            const user = await User.findOne({ email: userData.email })

            if (!user) {
                return { data: 'User With The Specified Email Not Found', statusCode: 404, msg: "Failure" };
            }

            let num: string = generateOtp()
            let num2: string = generateOtp()

            await User.updateOne({ email: userData.email }, 
                {
                    $set:{
                        otp: num2
                    }
                }
            )

            var emailSender: any = {
                body: {
                    name: 'User',
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
            const sent = await sendmail(userData.email, 'Password Recovery', emailBody);
            if(sent){
                return { data: { msg: 'Email sent', otp: num, stored: num2 }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error sending mail', statusCode: 404, msg: "Failure" };
            }

        } catch (error: any) {
            console.log(error);

            throw new Error(`Forgot password error: ${error.message}`);
        }
    },

    verifyUserEmail: async (userData: any) => {
        try {
            const res = await User.updateOne({ email: userData.email }, 
                {
                    $set:{
                        emailVerify: true
                    }
                }
            )
           
            if(res){
                return { data: 'email verified', statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error verifying email', statusCode: 404, msg: "Failure" };
            }

        } catch (error: any) {
            console.log(error);

            throw new Error(`Reset password error: ${error.message}`);
        }
    },

    userReset: async (userData: any) => {
        try {
            const user = await User.findOne({ email: userData.email, otp: userData.stored })
            if(user !== null){

                let password: string = await bcrypt.hash(userData.password, SALT)

                const res = await User.updateOne({ email: userData.email }, 
                    {
                        $set:{
                            password: password
                        }
                    }
                )
            
                if(res){
                    return { data: 'password changed', statusCode: 201, msg: "Success" };
                }else{
                    return { data: 'Error updating password', statusCode: 404, msg: "Failure" };
                }
            }else{
                return { data: 'invalid request', statusCode: 404, msg: "Failure" };
            }

        } catch (error: any) {
            console.log(error);

            throw new Error(`Reset password error: ${error.message}`);
        }
    },

    contact: async (userData: UserDataContact) => {
        try {
            const contact = await new Contact({ ...userData }).save();
            if(contact !== null){
                return { data: { contact }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error creating contact', statusCode: 401, msg: "Failure" };
            }

        } catch (error: any) {
            console.log(error);

            throw new Error(`Reset password error: ${error.message}`);
        }
    },
}


export default BasicService;