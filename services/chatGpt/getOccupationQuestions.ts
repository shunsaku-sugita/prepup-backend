import chatGptAxios from "./chatGptAxios";
import { interviewPromptByOccupation } from "./prompts";


export const generateInterviewQuestions = async (occupation: string) => {
    const payload = interviewPromptByOccupation(occupation);
  
    try { 
      const response = await chatGptAxios.post('', payload);
      return response.data;
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw new Error('Failed to generate interview questions');
    }
  };