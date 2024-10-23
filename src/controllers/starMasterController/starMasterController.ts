import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
import User from "../../models/user";
import {
  IQuestion,
  IStarMasterQuestionBank,
  StarMasterQuestionBank,
} from "../../models/starMasterQuestion";
import axios from "axios";
import dotenv from "dotenv";
import { format } from "date-fns";

dotenv.config();

// Fetch a question from the database randomly
export const getQuestion = async (req: Request, res: Response) => {
  try {
    const questionBank = await StarMasterQuestionBank.findOne()
      .select("questions.id questions.question")
      .exec();
    // If questions are found, return a random question
    if (questionBank && questionBank.questions.length > 0) {
      const randomIndex = Math.floor(
        // Generate a random index within the range of the questions array
        Math.random() * questionBank.questions.length
      );
      const randomQuestion = questionBank.questions[randomIndex];
      return res.status(200).json(randomQuestion);
    }
    return res.status(404).json({ message: "No questions found" });
  } catch (error) {
    console.error("Error fetching random question:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const analyzeAnswers = async (req: Request, res: Response) => {};
