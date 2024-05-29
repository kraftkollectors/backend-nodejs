import dotenv from 'dotenv';
dotenv.config();
import { sendmail, mailGenerator } from '../../middlewares/mailer'
import User from '../../models/users'
import bcrypt from 'bcrypt';
import { UserData, UserDataLogin, UserDataForgot, UserDataContact } from '../../types/user/defaultTypes';
import generateToken from '../../utils/tokenUtils';
import Contact from '../../models/contact';



const SALT: any = process.env.SALT

const BasicService = {
    testServer: async () => {
        try {
            // Check if the email exists
            const user = await User.find().limit(10)

            return { data: user, statusCode: 201, msg: "Success" };
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


            let num: string = ""
            for(let i = 0; i < 6; i++){ 
                num += Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            }
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
                    
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Hardware Mall.'
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
    
            let num: string = ""
            for(let i = 0; i < 6; i++){ 
                num += Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            }
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
                    
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Hardware Mall.'
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

            let num: string = ""
            for(let i = 0; i < 6; i++){ 
                num += Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            }

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
                    
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Hardware Mall.'
                }
            };

            let emailBody: any = mailGenerator.generate(emailSender);
            // send mail
            const sent = await sendmail(userData.email, 'Password Recovery', emailBody);
            if(sent){
                return { data: { msg: 'Email sent', otp: num}, statusCode: 201, msg: "Success" };
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

    userReset: async (userData: UserDataLogin) => {
        try {
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