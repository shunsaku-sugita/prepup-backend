import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../../models/user";
import { CustomRequest } from "../../middlewares/authMiddleware";

export const createPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const { password } = req.body;

      const _id = (req as CustomRequest).token.userId;
  
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      const user: IUser | null = await User.findOne({ _id });
      if (!user) {
        return res
          .status(401)
          .json({ message: "No user found associated with this email" });
      }
  
      user.password = password;
  
      await user.save();
      
      return res.status(200).json({ message: "password updated successfully" });
  
    } catch (error) {
      res.status(500).json({ error: "Failed to create Password" });
  
      console.error("Failed to create Password ====> ");
      console.log("Request body:", req.body);
      console.log("Request headers:", req.headers);
      console.log("Request query params:", req.query);
      console.log("Request URL params:", req.params);
      console.log("Request method:", req.method);
      console.log("Request URL:", req.url);
      console.error("Error: " + error);
    }
  
    next();
  };