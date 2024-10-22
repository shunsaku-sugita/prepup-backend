import chatGptAxios from "./chatGptAxios";
import {
  analyzeAnswersPrompt,
  interviewPromptByJobDescription,
  interviewPromptByOccupation,
} from "./prompts";

export const questionsByOccupation = async (occupation: string) => {
  const payload = interviewPromptByOccupation(occupation);

  try {
    const response = await chatGptAxios.post("", payload);
    return response.data;
  } catch (error) {
    console.error("Error generating interview questions by occupation:", error);
    throw new Error("Failed to generate interview questions by occupation");
  }
};

export const questionsByJobDescription = async (jobDescription: string) => {
  const payload = interviewPromptByJobDescription(jobDescription);

  try {
    const response = await chatGptAxios.post("", payload);
    return response.data;
  } catch (error) {
    console.error(
      "Error generating interview questions by job description:",
      error
    );
    throw new Error("Failed to generate interview questions job description");
  }
};
