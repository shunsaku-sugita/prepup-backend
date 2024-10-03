
import User, { IUser } from "../models/users";
import { HydratedDocument } from 'mongoose';
import { createSecretToken } from "../utils/SecretToken";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { sendMail } from "../services/mailService";
import mongoose from 'mongoose'; // Importing mongoose
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";


const PRODUCTION_LINK = process.env.PRODUCTION_LINK;


export const signup = async (req : Request, res : Response, next : NextFunction) => {
    try {

        // console.log(req);
        const { email, password, firstName, lastName } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send(`User already exists`);
        }

        const user: HydratedDocument<IUser>  = await User.create({ email, password, firstName, lastName});
        // const token = createSecretToken(user._id as string);
        // user.token = token;
        user.otp = generateSecureOTP();
        await user.save();

        const from: string = 'no-replay@prepup.com';
        const to: string = email;
        const subject: string = 'PreUp account verification';
        const mailTemplate: string = `<div style="text-align: center;"> <br>Paste this verification code into PrepUp to verify account</br> <h1><b>${user.otp}</b></h1> </div>`;

        try {
            await sendMail(from, to, subject, mailTemplate);
            return res.status(201).json({ message: "OTP sent for registration successfully", userId: user._id });
        } catch (error) {
            res.status(500).send("Failed to register user");
            console.error("Error while sending mail for user registration, Error : " + error);
        }
        

    } catch (error) {
        res.status(400).send("Failed to register user");
        
        console.error("Failed to signup user ====>");
        console.log("Request body:", req.body);
        console.log("Request headers:", req.headers);
        console.log("Request query params:", req.query);
        console.log("Request URL params:", req.params);
        console.log("Request method:", req.method);
        console.log("Request URL:", req.url);
        console.error( "Error: " + error);

    }

    next();
}

/**
 * Generates a secure random OTP.
 * @param length - The desired length of the OTP (default is 6).
 * @returns The generated OTP as a string.
 */
function generateSecureOTP(length: number = 6): string {
    // Generate random bytes
    const bytes = randomBytes(length);
    
    // Convert to a number and mod by 10^length to get a number within the desired range
    const otp = parseInt(bytes.toString('hex'), 16) % (10 ** length);
    
    // Return OTP padded with zeros to ensure it's the correct length
    return otp.toString().padStart(length, '0');
}