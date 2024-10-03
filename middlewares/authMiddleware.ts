import User from "../models/users";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";

dotenv.config();

export interface CustomRequest extends Request {
  token: string | JwtPayload;
 }

const userVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ status: "User token expired" });
    }

    const decodedToken = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.TOKEN_KEY || ""
    ); 

    (req as CustomRequest).token = decodedToken;

    console.log("What is the token : ===========> " + decodedToken);

    next();
  } catch (error) {
    console.error("unauthorized request ===========> " + error + " \n The request object " + req);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = userVerification;


