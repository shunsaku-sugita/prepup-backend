import { Request, Response } from "express";
import dotenv from "dotenv";
import { StarMasterQuestionBank } from "../../models/starMasterQuestion";
import { getAnswerAnalysisForStarMaster } from "../../services/chatGpt/getAnswerAnalysisForStarMaster";

dotenv.config();

// Fetch a random question from the question bank
export const getQuestion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const questionBank = await StarMasterQuestionBank.findOne()
      .select("questions.id questions.question")
      .exec();

    if (!questionBank || !questionBank.questions.length) {
      return res.status(400).json({ message: "No question found" });
    }

    const randomIndex = Math.floor(
      Math.random() * questionBank.questions.length
    );
    const randomQuestion = questionBank.questions[randomIndex];

    return res.status(200).json(randomQuestion);
  } catch (error) {
    logRequestDetails(req);
    return res.status(500).json({ message: "Error fetching question" });
  }
};

// Analyze user-provided STAR method answers
export const analyzeAnswers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { question, answers } = req.body;

  if (!question || !answers) {
    return res.status(400).json({ error: "Question or answers not provided" });
  }

  try {
    const analysisData = await getAnswerAnalysisForStarMaster({
      question,
      answers,
    });

    const parsedData = JSON.parse(analysisData.choices[0].message.content);

    return res.status(200).json({
      feedback: parsedData.feedback,
      score: parsedData.score,
    });
  } catch (error) {
    logRequestDetails(req);
    return res.status(500).json({ error: "Failed to analyze answers" });
  }
};

const logRequestDetails = (req: Request) => {
  console.error("Error processing request ====>");
  console.log("Request Body:", req.body);
  console.log("Request Headers:", req.headers);
  console.log("Request Query Params:", req.query);
  console.log("Request URL Params:", req.params);
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);
};
