import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../../models/user";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../../utils/SecretToken";

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user : IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found associated with this email" });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
        return res.json({ message: "Incorrect password or email" });
      }

      const token = createSecretToken(user._id as number);
      res.status(200).json({ message: "User logged in successfully", authorization: token});
    
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });

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
