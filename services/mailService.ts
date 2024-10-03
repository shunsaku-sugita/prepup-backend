import nodemailer from 'nodemailer';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

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
