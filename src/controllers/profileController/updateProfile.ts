import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
import User, { IUser } from "../../models/user";
import { questionsByOccupation } from "../../services/chatGpt/getQuestions";
import {
  IInterviewQuestion,
  interviewQuestionSchema,
} from "../../models/interviewQuestion";
import mongoose from "mongoose";
import {
  IInterviewCategory,
  InterviewCategorySchema,
} from "../../models/interviewCategory";

const allowedFieldsToUpdate = [
  "email",
  "givenName",
  "familyName",
  "occupation",
];

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updateData = req.body;

  const filteredUpdateData = filterUpdateFields(
    updateData,
    allowedFieldsToUpdate
  );

  if (Object.keys(filteredUpdateData).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  try {
    const _id = (req as CustomRequest).token.userId;

    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      _id,
      filteredUpdateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (filteredUpdateData.occupation) {
      generateQuestionOnOccupation(filteredUpdateData.occupation, updatedUser);
    }

    res.status(200).json({
      updatedFields: filteredUpdateData,
      message: "Profile updated successfully",
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

/**
 * Filters the request body to include only allowed fields for updating.
 *
 * @param updateData - Object containing the fields to update.
 * @param allowedFields - Array of strings representing allowed fields for updating.
 * @returns Filtered object with only the allowed fields.
 */
const filterUpdateFields = (
  updateData: Record<string, any>,
  allowedFields: string[]
): Record<string, any> => {
  return Object.keys(updateData).reduce((filtered, key) => {
    if (allowedFields.includes(key)) {
      filtered[key] = updateData[key];
    }
    return filtered;
  }, {} as Record<string, any>);
};

const generateQuestionOnOccupation = (occupation: string, user: IUser) => {
  questionsByOccupation(occupation)
    .then((responseContent) => {
      const questionStrings: string[] = JSON.parse(
        responseContent.choices[0].message.content
      );

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

      if (user.interviewQuestions[0].categoryName == "General") {
        user.interviewQuestions.unshift(
          new interviewQuestionsModel({
            categoryName: occupation,
            questions: interviewQuestions,
            badge: "",
            score: [],
            _id: 0,
          })
        );
      } else {
        user.interviewQuestions[0] = new interviewQuestionsModel({
          categoryName: occupation,
          questions: interviewQuestions,
          badge: "",
          score: [],
          _id: 0,
        });
      }
      return user.save();
    })
    .then(() => {
      console.log("User interview questions updated successfully");
    })
    .catch((error) => {
      console.error(
        "Error while generating questions from occupation, Error: " + error
      );
    });
};
