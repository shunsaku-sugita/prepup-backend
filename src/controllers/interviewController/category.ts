import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
import User, { IUser } from "../../models/user";
import { saveQuestionsToDatabase } from "../../services/interviewQuestionsService";

export const category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = (req as CustomRequest).token.userId;
    const existingUser: IUser | null = await User.findOne({ _id });
    if (!existingUser) {
      return res.status(400).send(`User doesn't exists`);
    }

    return res.status(200).json({
      occupation: existingUser.occupation ? true : false,
      category: existingUser.interviewQuestions,
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to get interivew category" });

    console.error("Failed to get interivew category ====>");
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

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryName, questions } = req.body;

    if (!categoryName || !questions) {
      return res
        .status(400)
        .json({ error: "No valid fields to create category" });
    }

    const isSaved = await saveQuestionsToDatabase(
      (req as CustomRequest).token.userId,
      questions,
      categoryName
    );

    if (isSaved) {
      res.status(200).json({
        message: "category created successfully",
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to get interivew category" });

    console.error("Failed to get interivew category ====>");
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
