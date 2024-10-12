import nodemailer from 'nodemailer';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

// How to use it 
// const email : Add your customer email here
// const from: string = "no-replay@prepup.com";
// const to: string = email;
// const subject: string = "PreUp account verification";
// const mailTemplate: string = `<div style="text-align: center;"> <br>Paste this verification code into PrepUp to verify account</br> <h1><b>${user.otp}</b></h1> </div>`;

// try {
//   await sendMail(from, to, subject, mailTemplate);
    
// } catch (error) {
    
// }

const logger = winston.createLogger({
    level: 'info',  // Change to 'debug' during development if needed
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

// Simple sendMail function
export const sendMail = async (from:string, to:string, subject:string, html:string) => {
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from,
        to,
        subject,
        html,
    };

    logger.info(`Sending mail to - ${to}`);

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info('Email sent: ' + info.response);
    } catch (error) {
        logger.error('Error sending email: ' + error);
        throw error;  // Propagate the error
    }
};
