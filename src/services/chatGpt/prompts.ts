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

export const analyzeStarAnswersWithFeedback = (
  question: string,
  answers: any
) => {
  return {
    model: process.env.GPT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an AI that evaluates STAR method interview answers. Your task is to analyze the provided answers and provide feedback for each section (Situation, Task, Action, Result). Also, provide an overall score from 0 to 100, which represents the average quality of the answers.",
      },
      {
        role: "user",
        content: `Here is the question and the answers based on the STAR method.\n\nQuestion: ${question}\n\nSituation: ${answers.situation}\nTask: ${answers.task}\nAction: ${answers.action}\nResult: ${answers.result}\n\nPlease provide feedback for each section as a JSON object in the following format:\n{
          "feedback": {
            "situation": "string",
            "task": "string",
            "action": "string",
            "result": "string",
          },
          "score": number
        }\nProvide the JSON output only without any additional text.`,
      },
    ],
    temperature: 0.7,
  };
};
