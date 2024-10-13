import dotenv from "dotenv";

export const interviewPromptByOccupation = (occupation: string) => {
    return {
      model: process.env.GPT_MODEL,
      messages: [
        { role: "system", content: "You are an AI assistant that helps users prepare for job interviews. Your task is to generate interview questions in an array format." },
        { role: "user", content: `Generate an array of five general interview questions for a ${occupation}. The output should be an array of plain text questions with no explanations, no numbers, and no additional formatting.` }
      ],
      temperature: 0.7
    };
  };
  