import { NextFunction, Request, Response } from "express";
import {
  IAnswer,
  getAnswerAnalysis,
} from "../../services/chatGpt/getAnswerAnalysis";

export const analyzeAnswers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { answers } = req.body;

    if (!answers) {
      return res
        .status(404)
        .json({ error: "Answers not defined/ No data posted" });
    }

    const data = await getAnswerAnalysis(answers);
    const parsedData = JSON.parse(data.choices[0].message.content);
    const scores = parsedData.scores;

    return res.status(200).json({
      scores,
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to generate questions" });

    console.error("Failed to generate questions ====>");
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
