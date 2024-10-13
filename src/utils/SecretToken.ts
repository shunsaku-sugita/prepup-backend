import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const createSecretToken = (userId: number): string => {
    if (!process.env.TOKEN_KEY) {
      throw new Error("TOKEN_KEY is not defined in the environment variables.");
    }
  
    return jwt.sign({ userId }, process.env.TOKEN_KEY, {
      expiresIn: 3 * 24 * 60 * 60, // 3 days in seconds
    });
  };
