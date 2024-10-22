import chatGptAxios from "./chatGptAxios";
import { analyzeAnswersPrompt } from "./prompts";

export interface IAnswer {
  question: string;
  answer: string;
}

// analyzeAnswersPrompt
export const getAnswerAnalysis = async (answersArray: IAnswer[]) => {
  const answers = answersArray
    .map(
      (item, index) =>
        `Question ${index + 1}: ${item.question}\nAnswer: ${item.answer}`
    )
    .join("\n\n");

  const payload = analyzeAnswersPrompt(answers);

  try {
    const response = await chatGptAxios.post("", payload);

    return response.data;
  } catch (error) {
    console.error("Error analyzing answers", error);
    throw new Error("Failed to analyze answers");
  }
};
