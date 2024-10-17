import { NextFunction, Request, Response } from "express";
import axios from "axios";
import cheerioModule = require("cheerio");

import mongoose from "mongoose";
import User, { IUser } from "../models/user";
import { questionsByJobDescription } from "./chatGpt/getQuestions";
import {
  IInterviewQuestion,
  interviewQuestionSchema,
} from "../models/interviewQuestion";
import {
  IInterviewCategory,
  InterviewCategorySchema,
} from "../models/interviewCategory";

const BASE_ADZUNA_URL = "https://www.adzuna.ca/details/";

export async function scrapeAdzunaSection(adzunaJobId: string) {

  const url = BASE_ADZUNA_URL + adzunaJobId;
  
  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      console.error("Error fetching the URL:", response.status);
      return null;
    }

    const { data } = response;

    const $ = cheerioModule.load(data);

    const section = $("section.adp-body");

    const sectionHtml = section.html();

    return sectionHtml ? sectionHtml : null;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    return null;
  }
}

export async function generateQuestionOnOccupation(
  jobDescription: string
): Promise<string[] | null> {
  return questionsByJobDescription(jobDescription)
    .then((responseContent) => {
      const content = responseContent.choices[0].message.content;

      const questionStrings: string[] = safeJsonParse(content);

      return questionStrings;
    })
    .catch((error) => {
      console.error(
        "Error while generating questions from job description, Error: " + error
      );
      return null;
    });
}

export async function saveQuestionsToDatabase(
  _id: string,
  questionStrings: string[],
  categoryName: string
) {
  try {
    const user: IUser | null = await User.findById(_id);

    if (!user) {
      throw new Error (
        "User not found for id  + " + _id + " + While saving interview questions"
      );
    }

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

    return user.save();
  } catch (error) {
    console.error("Error while saving question to the database :", error);
    return false;
  }
}

function safeJsonParse(content: string): string[] {
  try {
    // Attempt to parse the JSON string
    const parsedData = JSON.parse(content);

    // Ensure that the parsed data is in the expected format
    return (
      parsedData.choices[0]?.message.content
        .split("\n")
        .map((q: string) => q.trim())
        .filter((q: string) => q) || []
    );
  } catch (error) {
    console.log(
      "Failed to parse JSON Trying another way, Error ========?> ",
      error
    );

    // Fallback method if parsing fails
    return content
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q);
  }
}
