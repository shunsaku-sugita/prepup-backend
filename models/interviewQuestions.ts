import { Schema, model, Document, CallbackError, Types } from "mongoose";
import { IInterviewQuestion, interviewQuestionSchema } from "./interviewQuestion";

export interface IInterviewQuestions extends Types.Subdocument {
  categoryName: string;
  questions: Array<IInterviewQuestion>;
  badge: string;
  score: Array<string>;
}

export const interviewQuestionsSchema = new Schema<IInterviewQuestions>({
  categoryName: {
    type: String,
    required: [true, "Category name is require for the interview questions"],
  },
  questions: [interviewQuestionSchema],
  badge: String,
  score: [String],
});
