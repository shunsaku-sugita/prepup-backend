import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import { CustomRequest } from "../../middlewares/authMiddleware";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = (req as CustomRequest).token.userId;

    const user = await User.findById(_id).select('email givenName familyName occupation');

    if(user){
      res.status(200).json({
        user : user
      });
    }else{
      res.status(401).json({
        message : "User not found"
      })
    }

  } catch (error) {
    res.status(400).json({ error: "Failed to register user" });

    console.error("Failed to signup user ====>");
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
