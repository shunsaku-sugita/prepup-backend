import chatGptAxios from "./chatGptAxios";
import { analyzeStarAnswersWithFeedback } from "./prompts";

// Interface for structured request data
interface StarMasterAnswers {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface StarMasterRequestData {
  question: string;
  answers: StarMasterAnswers;
}

export const getAnswerAnalysisForStarMaster = async (
  starMasterRequestObject: StarMasterRequestData
) => {
  const { question, answers } = starMasterRequestObject;

  const formattedAnswers: StarMasterAnswers = {
    situation: answers.situation || "",
    task: answers.task || "",
    action: answers.action || "",
    result: answers.result || "",
  };

  const payload = analyzeStarAnswersWithFeedback(question, formattedAnswers);

  try {
    const response = await chatGptAxios.post("", payload);
    return response.data;
  } catch (error) {
    console.error("Error analyzing answers", error);
    throw new Error("Failed to analyze answers");
  }
};
