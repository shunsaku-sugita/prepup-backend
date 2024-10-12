import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
import User, { IUser } from "../../models/user";

export const category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const _id = (req as CustomRequest).token.userId;
    const existingUser : IUser | null = await User.findOne({ _id });
    if (!existingUser) {
      return res.status(400).send(`User doesn't exists`);
    }

    return res.status(200).json({
      occupation: existingUser.occupation ? true : false,
      category: existingUser.interviewQuestions
    });
    
    
  } catch (error) {
    res.status(400).json({ error: "Failed to register user" });

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
