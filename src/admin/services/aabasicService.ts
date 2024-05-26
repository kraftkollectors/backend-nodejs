import dotenv from 'dotenv';
dotenv.config();
import { sendmail, mailGenerator } from '../../middlewares/mailer'
import Admin from '../../models/admin'
import bcrypt from 'bcrypt';
import { AdminData, AdminDataForgot } from '../../types/admin/defaultTypes';
import generateToken from '../../utils/tokenUtils';

const SALT: any = process.env.SALT

const BasicService = {
    testServer: async () => {
        try {
            // Check if the email exists
            const admin = await Admin.find().limit(10)

            return { data: admin, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error logging in: ${error.message}`);
        }
    },

    createAdmin: async (adminData: AdminData) => {
        try {
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
            

            let fakePassword = '';
            admin.password = fakePassword

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

            console.log(token);

            let fakePassword = '';
            admin.password = fakePassword

            return { data: { admin, token }, statusCode: 201, msg: "Success" };
        } catch (error: any) {
            console.log(error);

            throw new Error(`Error logging in: ${error.message}`);
        }
    },

    adminForgot: async (adminData: AdminDataForgot) => {
        try {
            // Check if the email exists
            const admin = await Admin.findOne({ email: adminData.email })

            if (!admin) {
                return { data: 'admin With The Specified Email Not Found', statusCode: 404, msg: "Failure" };
            }

            var emailSender: any = {
                body: {
                    name: 'Crystal Healthcare Caregiving',
                    intro: 'We got a request to reset your password, if this was you, click the link below to reset password or ignore and nothing will happen to your account.',

                    action: {
                        instructions: 'To get started, please click here:',
                        button: {
                            color: '#22BC66',
                            text: 'Recover Password',
                            link: 'https://www.kraftkollectors.com/passwordreset?email='+adminData.email
                        }
                    },
                    
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Hardware Mall.'
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
}


export default BasicService;