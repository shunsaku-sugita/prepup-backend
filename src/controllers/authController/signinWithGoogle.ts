import { last } from "cheerio/dist/commonjs/api/traversing";
import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../../models/user";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { HydratedDocument } from "mongoose";
import { createSecretToken } from "../../utils/SecretToken";
import { behavioralQuestions, generalQuestions } from "./defaultCategory";
import { saveQuestionsToDatabase } from "./signup";

export const signinWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = createSecretToken(existingUser._id as number);
      res
        .status(200)
        .json({ message: "User logged in successfully", authorization: token });
    } else {
      const userName: string = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
      });

      const user: HydratedDocument<IUser> = await User.create({
        email,
        givenName: firstName,
        familyName: lastName,
        userName,
      });

      await saveQuestionsToDatabase(user, generalQuestions, "General");
      await saveQuestionsToDatabase(user, behavioralQuestions, "Behavioral");

      await user.save();

      const token = createSecretToken(user._id as number);
      return res.status(201).json({
        message: "User registered successfully",
        authorization: token,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to signIn with google" });

    console.error("Failed to signup user with google ====>");
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
