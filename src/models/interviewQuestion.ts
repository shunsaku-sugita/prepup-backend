import mongoose, { Schema, model, Document, CallbackError, Types} from "mongoose";

export interface IInterviewQuestion extends Types.Subdocument {
  organization: Types.ObjectId;
  question: string;
  audio: string;
  transcript: string;
  answer: string;
}

export const interviewQuestionSchema = new Schema<IInterviewQuestion>({
  question: {
    type: String,
    required: [true, "Interview question for category is required"],
  },
  audio: String,
  transcript: String,
  answer: String,
});

export const interviewQuestionModel = mongoose.model<IInterviewQuestion>(
  "interviewQuestion",
  interviewQuestionSchema
);
