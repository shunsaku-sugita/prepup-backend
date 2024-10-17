import { HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // Importing mongoose
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";
import User, { IUser } from "../../models/user";
import { sendMail } from "../../services/mailService";
import { questionsByOccupation } from "../../services/chatGpt/getQuestions";
import {
  IInterviewQuestion,
  interviewQuestionSchema,
} from "../../models/interviewQuestion";
import { Types } from "mongoose";
import {
  IInterviewCategory,
  InterviewCategorySchema,
} from "../../models/interviewCategory";
import { createSecretToken } from "../../utils/SecretToken";
import { behavioralQuestions, generalQuestions } from "./defaultCategory";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, givenName, familyName } = req.body;

    if (!email || !password || !givenName || !familyName) {
      return res.status(400).json({
        error: "Missing required fields: email, password, givenName, familyName, and occupation are required.",
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send(`User already exists`);
    }

    const user: HydratedDocument<IUser> = await User.create({
      email,
      password,
      givenName,
      familyName
    });

    await saveQuestionsToDatabase(user, generalQuestions, "General");
    await saveQuestionsToDatabase(user, behavioralQuestions, "Behavioral");

    await user.save();

    const token = createSecretToken(user._id as number);
    return res.status(201).json({
      message: "User registered successfully",
      authorization: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });

    console.error("Failed to signup user ====>");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    console.log("Request query params:", req.query);
    console.log("Request URL params:", req.params);
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.error("Error: " + error);
  }

  next();
};

// /**
//  * Generates a secure random OTP.
//  * @param length - The desired length of the OTP (default is 6).
//  * @returns The generated OTP as a string.
//  */
// function generateSecureOTP(length: number = 6): string {
//   // Generate random bytes
//   const bytes = randomBytes(length);

//   // Convert to a number and mod by 10^length to get a number within the desired range
//   const otp = parseInt(bytes.toString("hex"), 16) % 10 ** length;

//   // Return OTP padded with zeros to ensure it's the correct length
//   return otp.toString().padStart(length, "0");
// }

async function saveQuestionsToDatabase(
  user: IUser,
  questionStrings: string[],
  categoryName: string
) {
  try {

    const interviewQuestions: Array<IInterviewQuestion> = [];

    const interviewQuestionModel = mongoose.model<IInterviewQuestion>(
      "interviewQuestion",
      interviewQuestionSchema
    );

    questionStrings.forEach((questionString, index) => {
      const question: IInterviewQuestion = new interviewQuestionModel({
        question: questionString,
        audio: "",
        transcript: "",
        answer: "",
        _id: index,
      });

      interviewQuestions.push(question);
    });

    const interviewQuestionsModel = mongoose.model<IInterviewCategory>(
      "interviewQuestions",
      InterviewCategorySchema
    );

    const totalQuestions = user.interviewQuestions.length;

    user.interviewQuestions.push(
      new interviewQuestionsModel({
        categoryName: categoryName,
        questions: interviewQuestions,
        badge: "",
        score: [],
        _id: totalQuestions,
      })
    );

    return true;
  } catch (error) {
    console.error("Error while saving questions for category : " + categoryName + " Error " +error);
    return false;
  }
}