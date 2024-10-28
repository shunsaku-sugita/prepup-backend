import mongoose, { Schema, model, Document, CallbackError, Types } from "mongoose";
import {
  IInterviewQuestion,
  interviewQuestionSchema,
} from "./interviewQuestion";

export interface IInterviewCategory extends Types.Subdocument {
  organization: Types.ObjectId;
  categoryName: string;
  questions: Array<IInterviewQuestion>;
  badge: string;
  score: Array<string>;
}

export const InterviewCategorySchema = new Schema<IInterviewCategory>({
  categoryName: {
    type: String,
    required: [true, "Category name is require for the interview questions"],
  },
  questions: [interviewQuestionSchema],
  badge: String,
  score: [String],
});

export const interviewQuestionsModel = mongoose.model<IInterviewCategory>(
  "interviewQuestions",
  InterviewCategorySchema
);