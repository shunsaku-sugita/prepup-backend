import { Schema, model, Document, CallbackError, Types } from "mongoose";
import {
  IInterviewQuestion,
  interviewQuestionSchema,
} from "./interviewQuestion";

export interface IInterviewCategory extends Types.Subdocument {
  _id: number;
  categoryName: string;
  questions: Array<IInterviewQuestion>;
  badge: string;
  score: Array<string>;
}

export const InterviewCategorySchema = new Schema<IInterviewCategory>({
  _id: { type: Number },
  categoryName: {
    type: String,
    required: [true, "Category name is require for the interview questions"],
  },
  questions: [interviewQuestionSchema],
  badge: String,
  score: [String],
});
