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
  
  export const interviewPromptByJobDescription = (jobDescription: string) => {
    return {
      model: process.env.GPT_MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant that helps users prepare for job interviews. Your task is to generate interview questions based on specific job descriptions in an array format." 
        },
        { 
          role: "user", 
          content: `Generate an array of five interview questions based on the following job description. Focus on areas like the candidate's experience, problem-solving abilities, teamwork skills, commitment to quality, and willingness to learn:\n\n${jobDescription}\n\nOutput the questions in plain text with no explanations, no numbers, and no additional formatting.` 
        }
      ],
      temperature: 0.7
    };
};