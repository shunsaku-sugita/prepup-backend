import dotenv from "dotenv";

export const interviewPromptByOccupation = (occupation: string) => {
  return {
    model: process.env.GPT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that helps users prepare for job interviews. Your task is to generate interview questions in an array format.",
      },
      {
        role: "user",
        content: `Generate an array of five general interview questions for a ${occupation}. The output should be an array of plain text questions with no explanations, no numbers, and no additional formatting.`,
      },
    ],
    temperature: 0.7,
  };
};

export const interviewPromptByJobDescription = (jobDescription: string) => {
  return {
    model: process.env.GPT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that helps users prepare for job interviews. Your task is to generate interview questions based on specific job descriptions in an array format.",
      },
      {
        role: "user",
        content: `Generate an array of five interview questions based on the following job description. Focus on areas like the candidate's experience, problem-solving abilities, teamwork skills, commitment to quality, and willingness to learn:\n\n${jobDescription}\n\nOutput the questions in plain text with no explanations, no numbers, and no additional formatting.`,
      },
    ],
    temperature: 0.7,
  };
};

export const analyzeAnswersPrompt = (answers: string) => {
  return {
    model: process.env.GPT_MODEL,
    messages: [
      {
        role: "system",
        content:
          'You are an AI that evaluates interview answers. Your task is to analyze the provided answers and output a single set of averaged scores from 0 to 100% for the following criteria:\n- Speaking: The fluency and flow of speech.\n- Confidence: The level of self-assurance displayed in the answer.\n- Clarity: How clear and understandable the answer is.\n- Conciseness: How well the answer stays on point without unnecessary elaboration.\n\nProvide the feedback in a strict JSON format as { "scores": { "speaking": number, "confidence": number, "clarity": number, "conciseness": number } } with no additional text or explanations.',
      },
      {
        role: "user",
        content: `Here are the answers to be analyzed:\n\n${answers}\n\nPlease provide the averaged scores in the required JSON format.`,
      },
    ],
    temperature: 0.7,
  };
};
