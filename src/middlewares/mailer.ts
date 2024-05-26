import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

// Configure mailgen by setting a theme and your product info
export const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Hardware Mall',
        link: 'https://www.crystalhealth.com/'
    }
});


// mail request
export const sendmail = (to: string, subject: string, message: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        // email configuration 
        const transporter = nodemailer.createTransport({
            host: 'mail.crystalhealth.com',
            port: 465,
            auth: {
            user: 'testemail@crystalhealth.com',
            pass: 'Nodetest2022'
            }
        });

        const mailOptions = {
            from: 'testemail@crystalhealth.com',
            to: to,
            subject: subject,
            html: message
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('Error sending email:', error);
            reject(error);
        } else {
            console.log('Email sent:', info.response);
            resolve(true);
        }
        });
    });

}