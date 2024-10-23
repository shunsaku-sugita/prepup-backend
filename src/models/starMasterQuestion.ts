import { Schema, model, Document, Types } from "mongoose";

export interface IQuestion extends Types.Subdocument {
  id: number;
  question: string;
}

export interface IStarMasterQuestionBank extends Document {
  _id: Types.ObjectId;
  questions: IQuestion[];
}

const questionSchema = new Schema<IQuestion>({
  id: { type: Number, required: true },
  question: { type: String, required: true },
});

const starMasterQuestionSchema = new Schema<IStarMasterQuestionBank>(
  {
    questions: [questionSchema],
  },
  { collection: "starMasterQuestionBank" }
);

export const StarMasterQuestionBank = model<IStarMasterQuestionBank>(
  process.env.STAR_MASTER_QUESTION_BANK_COLLECTION_NAME ||
    "starMasterQuestionBank",
  starMasterQuestionSchema
);
