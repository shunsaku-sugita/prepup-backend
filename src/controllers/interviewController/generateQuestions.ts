import { NextFunction, Request, Response } from "express";
import axios from "axios";
import cheerioModule = require("cheerio");
import { questionsByJobDescription } from "../../services/chatGpt/getQuestions";
import {
  IInterviewQuestion,
  interviewQuestionSchema,
} from "../../models/interviewQuestion";
import mongoose from "mongoose";
import {
  IInterviewCategory,
  InterviewCategorySchema,
} from "../../models/interviewCategory";
import { CustomRequest } from "../../middlewares/authMiddleware";
import User, { IUser } from "../../models/user";
import { jobProcessingQueue } from "../../queues/jobQueue";


export const generateQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adzunaJobId, categoryName } = req.body;
    const userId = (req as CustomRequest).token.userId;

    if (!adzunaJobId) {
      return res.status(404).json({ error: "Adzuna Job id not defined" });
    }

    const job = await jobProcessingQueue.add("processJob", {
      adzunaJobId,
      userId,
      categoryName,
    });

    res.status(200).json({
      trackingId : job.id
    });

  } catch (error) {
    res.status(400).json({ error: "Failed to generate questions" });

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
