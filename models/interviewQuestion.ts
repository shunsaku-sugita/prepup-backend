import { Schema, model, Document, CallbackError, Types} from "mongoose";

export interface IInterviewQuestion extends Types.Subdocument {
  _id: number;
  question: string;
  audio: string;
  transcript: string;
  answer: string;
}

export const interviewQuestionSchema = new Schema<IInterviewQuestion>({
  _id: { type: Number },
  question: {
    type: String,
    required: [true, "Interview question for category is required"],
  },
  audio: String,
  transcript: String,
  answer: String,
});


